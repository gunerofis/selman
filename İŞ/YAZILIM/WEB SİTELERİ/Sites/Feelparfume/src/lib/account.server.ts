import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { assertSameSiteRequest } from "./auth/isolation.server";
import {
  BIRTHDAY_PERCENT,
  WELCOME_PERCENT,
  birthdayMatch,
  bottleReady,
  istanbulDate,
  pointsFromItems,
  priceDropped,
  validBirth,
  type AccountAddress,
  type AccountView,
} from "./account";
import type { AddressInput, LoginInput, ProfileInput, RegisterInput } from "./account-input";
import { getPublicCatalogServer } from "./catalog-db.server";
import { saveStockAlert } from "./commerce.server";
import { isPostalCode, isTurkishPhone } from "./commerce";
import { getSql } from "./db";
import { defaultSizeId, getProduct, minPrice, productSizes, productSlug, replaceCatalog } from "./products";
import { isTurkeyCity } from "./shipping";

const COOKIE = "sweb-customer";
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const ADDRESS_LIMIT = 8;
const WISH_LIMIT = 40;

type CustomerRow = {
  id: string;
  email: string;
  name: string;
  birth_month: number | null;
  birth_day: number | null;
  consent_stock: boolean;
  consent_price: boolean;
  consent_bottle: boolean;
};

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const DUMMY_HASH = hashPassword("not-a-real-password");

function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, 32);
  const target = Buffer.from(hash, "hex");
  return actual.length === target.length && timingSafeEqual(actual, target);
}

function writeSessionCookie(token: string) {
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

function clearSessionCookie() {
  setCookie(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

function asInt(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "bigint") {
    const n = Number(value);
    return Number.isSafeInteger(n) ? n : null;
  }
  if (typeof value === "string" && /^-?\d+$/.test(value)) {
    const n = Number(value);
    return Number.isSafeInteger(n) ? n : null;
  }
  return null;
}

function duplicateEmail(error: unknown) {
  const text = error instanceof Error ? error.message : String(error);
  return /duplicate key|unique constraint/i.test(text);
}

async function ensureCatalog() {
  const catalog = await getPublicCatalogServer();
  replaceCatalog(catalog.products, catalog.stamp);
}

async function currentCustomer() {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const sql = await getSql();
  const rows = await sql<CustomerRow>`
    select c.id, c.email, c.name, c.birth_month, c.birth_day,
           c.consent_stock, c.consent_price, c.consent_bottle
    from customer_sessions s
    join customers c on c.id = s.customer_id
    where s.token_hash = ${tokenHash(token)} and s.expires_at > now()
  `;
  return rows[0] ?? null;
}

async function customerById(id: string) {
  const sql = await getSql();
  const rows = await sql<CustomerRow>`
    select id, email, name, birth_month, birth_day,
           consent_stock, consent_price, consent_bottle
    from customers
    where id = ${id}
  `;
  return rows[0] ?? null;
}

async function requireCustomer() {
  const customer = await currentCustomer();
  if (!customer) throw new Error("Giriş gerekir.");
  return customer;
}

async function openSession(customerId: string) {
  const token = randomBytes(32).toString("base64url");
  const sql = await getSql();
  await sql`
    insert into customer_sessions (token_hash, customer_id, expires_at)
    values (${tokenHash(token)}, ${customerId}, now() + interval '30 days')
  `;
  writeSessionCookie(token);
}

async function rememberWishes(customerId: string, skus: string[] | undefined) {
  if (!skus?.length) return;
  await ensureCatalog();
  const sql = await getSql();
  const unique = [...new Set(skus)].slice(0, WISH_LIMIT);
  for (const sku of unique) {
    const product = getProduct(sku);
    if (!product) continue;
    const price = minPrice(product);
    if (!Number.isFinite(price) || price < 0) continue;
    const cents = Math.round(price * 100);
    await sql`
      insert into customer_wishes (customer_id, sku, price_cents)
      select ${customerId}, ${product.sku}, ${cents}
      where (select count(*) from customer_wishes where customer_id = ${customerId}) < ${WISH_LIMIT}
      on conflict (customer_id, sku) do nothing
    `;
  }
}

async function ensureBirthdayCoupon(email: string, month: number | null, day: number | null) {
  const today = istanbulDate(Date.now());
  if (!birthdayMatch(month, day, Date.now())) return;
  const sql = await getSql();
  const prefix = `DG-${today.year}-`;
  const existing = await sql<{ code: string }>`
    select code from coupons
    where lower(owner_email) = ${email} and code like ${`${prefix}%`}
    limit 1
  `;
  if (existing[0]) return;
  const code = `${prefix}${randomBytes(3).toString("hex").toUpperCase()}`;
  await sql`
    insert into coupons (code, kind, value, min_cents, active, owner_email, expires_on)
    values (${code}, 'percent', ${BIRTHDAY_PERCENT}, 0, true, ${email}, ${today.iso}::date)
  `;
}

async function queueReminders(customer: CustomerRow) {
  const stock = customer.consent_stock === true;
  const price = customer.consent_price === true;
  const bottle = customer.consent_bottle === true;
  if (!stock && !price && !bottle) return;
  await ensureCatalog();
  const sql = await getSql();
  if (stock || price) {
    const wishes = await sql<{ sku: string; price_cents: number }>`
      select sku, price_cents::float8 as price_cents
      from customer_wishes
      where customer_id = ${customer.id}
    `;
    for (const wish of wishes) {
      const product = getProduct(wish.sku);
      if (!product) continue;
      if (stock) {
        const size = productSizes(product).find((item) => item.id === defaultSizeId(product));
        if (size && size.stockStatus === "tukendi" && size.ml > 0) {
          await saveStockAlert(product.sku, size.ml, customer.email);
        }
      }
      const saved = asInt(wish.price_cents);
      const current = Math.round(minPrice(product) * 100);
      if (price && saved != null && priceDropped(saved, current)) {
        await sql`
          insert into customer_mail (id, to_email, kind, subject, body, status)
          values (
            ${`RM-fiyat-${customer.id}-${product.sku}`},
            ${customer.email},
            'fiyat',
            'Fiyat',
            ${`${product.name} fiyatı düştü.`},
            'held'
          )
          on conflict (id) do nothing
        `;
      }
    }
  }
  if (!bottle) return;
  const orders = await sql<{ id: string; items: unknown; created_at: string | Date }>`
    select id, items, created_at
    from storefront_order_requests
    where lower(customer->>'email') = ${customer.email} and payment_status = 'paid'
  `;
  const now = Date.now();
  for (const order of orders) {
    const at = order.created_at instanceof Date ? order.created_at.getTime() : Date.parse(String(order.created_at));
    if (!bottleReady(at, now) || !Array.isArray(order.items)) continue;
    const seen = new Set<string>();
    for (const item of order.items) {
      if (!item || typeof item !== "object") continue;
      const sku = (item as { sku?: unknown }).sku;
      if (typeof sku !== "string" || seen.has(sku)) continue;
      seen.add(sku);
      const name = getProduct(sku)?.name ?? sku;
      await sql`
        insert into customer_mail (id, to_email, kind, subject, body, status)
        values (
          ${`RM-sise-${order.id}-${sku}`},
          ${customer.email},
          'sise',
          'Şişe',
          ${`${name} için 90 gün doldu.`},
          'held'
        )
        on conflict (id) do nothing
      `;
    }
  }
}

async function snapshot(customer: CustomerRow): Promise<AccountView> {
  const month = asInt(customer.birth_month);
  const day = asInt(customer.birth_day);
  await ensureBirthdayCoupon(customer.email, month, day);
  await queueReminders(customer);
  await ensureCatalog();
  const sql = await getSql();
  const [couponRows, addressRows, orderRows, wishRows, pointRows] = await Promise.all([
    sql<{ code: string }>`
      select code from coupons
      where lower(owner_email) = ${customer.email} and active
      order by code
    `,
    sql<AccountAddress>`
      select id, name, phone, city, district, postal, address
      from customer_addresses
      where customer_id = ${customer.id}
      order by created_at
    `,
    sql<{ id: string; total_cents: number; status: string }>`
      select id, total_cents::float8 as total_cents, status
      from storefront_order_requests
      where lower(customer->>'email') = ${customer.email}
      order by created_at desc
      limit 24
    `,
    sql<{ sku: string }>`
      select sku from customer_wishes where customer_id = ${customer.id} order by sku
    `,
    sql<{ items: unknown }>`
      select items from storefront_order_requests
      where lower(customer->>'email') = ${customer.email} and payment_status = 'paid'
    `,
  ]);
  const items = pointRows.flatMap((row) => (Array.isArray(row.items) ? row.items : []));
  return {
    email: customer.email,
    points: pointsFromItems(items as { unitPrice?: unknown; qty?: unknown }[]),
    coupons: couponRows.map((row) => row.code),
    birthMonth: month,
    birthDay: day,
    consentStock: customer.consent_stock === true,
    consentPrice: customer.consent_price === true,
    consentBottle: customer.consent_bottle === true,
    addresses: addressRows,
    orders: orderRows.map((row) => ({
      id: row.id,
      totalCents: asInt(row.total_cents) ?? 0,
      status: row.status,
    })),
    wishes: wishRows.flatMap((row) => {
      const product = getProduct(row.sku);
      return product ? [{ sku: product.sku, name: product.name, slug: productSlug(product) }] : [];
    }),
  };
}

export async function readAccount(): Promise<AccountView | null> {
  const customer = await currentCustomer();
  if (!customer) return null;
  return snapshot(customer);
}

export async function registerAccount(data: RegisterInput): Promise<AccountView> {
  assertSameSiteRequest();
  if (data.password.length < 8) throw new Error("Şifre en az 8 karakter.");
  if (data.password.length > 72) throw new Error("Şifre en fazla 72 karakter.");
  const email = data.email.trim().toLowerCase();
  const month = data.birthMonth ?? null;
  const day = data.birthDay ?? null;
  if (!validBirth(month, day)) throw new Error("Tarih geçersiz.");
  const sql = await getSql();
  const existing = await sql<{ id: string }>`select id from customers where lower(email) = ${email}`;
  if (existing[0]) throw new Error("E-posta kayıtlı.");
  const id = `CU-${randomUUID()}`;
  try {
    await sql`
      insert into customers (id, email, password_hash, name, birth_month, birth_day)
      values (${id}, ${email}, ${hashPassword(data.password)}, '', ${month}, ${day})
    `;
  } catch (error) {
    if (duplicateEmail(error)) throw new Error("E-posta kayıtlı.");
    throw error;
  }
  const code = `HG${randomBytes(4).toString("hex").toUpperCase()}`;
  try {
    await sql`
      insert into coupons (code, kind, value, min_cents, active, owner_email)
      values (${code}, 'first', ${WELCOME_PERCENT}, 0, true, ${email})
    `;
  } catch (error) {
    await sql`delete from customers where id = ${id}`;
    throw error;
  }
  await rememberWishes(id, data.skus);
  await openSession(id);
  const customer = await customerById(id);
  if (!customer) throw new Error("Giriş gerekir.");
  return snapshot(customer);
}

export async function loginAccount(data: LoginInput): Promise<AccountView> {
  assertSameSiteRequest();
  const email = data.email.trim().toLowerCase();
  const sql = await getSql();
  const rows = await sql<{ id: string; password_hash: string }>`
    select id, password_hash from customers where lower(email) = ${email}
  `;
  const row = rows[0];
  const ok = verifyPassword(data.password, row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) throw new Error("E-posta veya şifre hatalı.");
  await openSession(row.id);
  const customer = await customerById(row.id);
  if (!customer) throw new Error("Giriş gerekir.");
  return snapshot(customer);
}

export async function logoutAccount() {
  assertSameSiteRequest();
  const token = getCookie(COOKIE);
  if (token) {
    const sql = await getSql();
    await sql`delete from customer_sessions where token_hash = ${tokenHash(token)}`;
  }
  clearSessionCookie();
  return { ok: true as const };
}

export async function saveProfile(data: ProfileInput): Promise<AccountView> {
  assertSameSiteRequest();
  const customer = await requireCustomer();
  const touched = data.birthMonth !== undefined || data.birthDay !== undefined;
  const month = touched ? (data.birthMonth ?? null) : asInt(customer.birth_month);
  const day = touched ? (data.birthDay ?? null) : asInt(customer.birth_day);
  if (!validBirth(month, day)) throw new Error("Tarih geçersiz.");
  const sql = await getSql();
  await sql`
    update customers
    set birth_month = ${month},
        birth_day = ${day},
        consent_stock = ${data.consentStock ?? customer.consent_stock},
        consent_price = ${data.consentPrice ?? customer.consent_price},
        consent_bottle = ${data.consentBottle ?? customer.consent_bottle}
    where id = ${customer.id}
  `;
  await rememberWishes(customer.id, data.skus);
  const next = await currentCustomer();
  if (!next) throw new Error("Giriş gerekir.");
  return snapshot(next);
}

export async function addAddress(data: AddressInput): Promise<AccountView> {
  assertSameSiteRequest();
  if (!isTurkishPhone(data.phone)) throw new Error("Telefon geçersiz.");
  if (!isTurkeyCity(data.city)) throw new Error("İl geçersiz.");
  if (!isPostalCode(data.postal)) throw new Error("Posta kodu geçersiz.");
  const customer = await requireCustomer();
  const sql = await getSql();
  const count = await sql<{ n: number }>`
    select count(*)::int as n from customer_addresses where customer_id = ${customer.id}
  `;
  if (Number(count[0]?.n ?? 0) >= ADDRESS_LIMIT) throw new Error("Adres sınırı.");
  await sql`
    insert into customer_addresses (id, customer_id, name, phone, city, district, postal, address)
    values (
      ${`AD-${randomUUID()}`},
      ${customer.id},
      ${data.name.trim()},
      ${data.phone.trim()},
      ${data.city.trim()},
      ${data.district.trim()},
      ${data.postal.trim()},
      ${data.address.trim()}
    )
  `;
  return snapshot(customer);
}

export async function removeAddress(id: string): Promise<AccountView> {
  assertSameSiteRequest();
  const customer = await requireCustomer();
  const sql = await getSql();
  await sql`delete from customer_addresses where id = ${id} and customer_id = ${customer.id}`;
  return snapshot(customer);
}

export async function removeWish(sku: string): Promise<AccountView> {
  assertSameSiteRequest();
  const customer = await requireCustomer();
  const sql = await getSql();
  await sql`delete from customer_wishes where customer_id = ${customer.id} and sku = ${sku}`;
  return snapshot(customer);
}
