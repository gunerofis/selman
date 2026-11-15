import { BRAND, sellerName } from "./brand";
import { bustCatalog } from "./catalog-db.server";
import { GIFT_WRAP_CENTS, type Coupon } from "./checkout-pricing";
import { getSql } from "./db";
import { trackingUrl } from "./shipping";
import { invoicePdf, type InvoiceDoc } from "./invoice-pdf";
import { mailEventFor, orderMail, type MailEvent } from "./order-mail";
import type { OrderItem } from "./order-input";
import { mlOfVariant } from "./perfume";

const ORDER_ID = /^SW-[0-9a-f-]{36}$/i;

export async function loadCoupon(code: string): Promise<Coupon | null> {
  const trimmed = code.trim();
  if (!trimmed) return null;
  const sql = await getSql();
  const rows = await sql<{
    code: string;
    kind: Coupon["kind"];
    value: number;
    min_cents: number;
    active: boolean;
    owner_email: string | null;
    expires_on: string | null;
  }>`
    select code, kind, value, min_cents::float8 as min_cents, active,
           owner_email, expires_on::text as expires_on
    from coupons
    where lower(code) = lower(${trimmed})
  `;
  const row = rows[0];
  if (!row || !row.active) throw new Error("Kupon geçersiz.");
  return {
    code: row.code,
    kind: row.kind,
    value: Number(row.value),
    minCents: Number(row.min_cents),
    active: true,
    ownerEmail: row.owner_email,
    expiresOn: row.expires_on,
  };
}

export async function priorOrderCount(email: string, exceptId: string) {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n
    from storefront_order_requests
    where lower(customer->>'email') = lower(${email.trim()})
      and status <> 'cancelled'
      and id <> ${exceptId}
  `;
  return Number(rows[0]?.n ?? 0);
}

export async function enqueueOrderMail(
  orderId: string,
  email: string,
  event: MailEvent,
  trackingUrl = "",
) {
  const sql = await getSql();
  const { subject, body } = orderMail(event, orderId, event === "kargoda" ? trackingUrl : "");
  const webhook = process.env.ORDER_MAIL_WEBHOOK?.trim() ?? "";
  const status = webhook ? "queued" : "held";
  const inserted = await sql<{ order_id: string }>`
    insert into order_mail (order_id, event, to_email, subject, body, status)
    values (${orderId}, ${event}, ${email}, ${subject}, ${body}, ${status})
    on conflict (order_id, event) do nothing
    returning order_id
  `;
  if (!inserted[0] || !webhook) return;
  let next: "sent" | "failed" = "failed";
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to: email, subject, body }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) next = "sent";
  } catch {
    next = "failed";
  }
  await sql`update order_mail set status = ${next} where order_id = ${orderId} and event = ${event}`;
}

export async function enqueueShippingMail(
  orderId: string,
  email: string,
  previous: string,
  next: string,
  trackingUrl = "",
) {
  if (previous === next) return;
  const event = mailEventFor({ type: "shipping", status: next });
  if (!event) return;
  await enqueueOrderMail(orderId, email, event, trackingUrl);
}

export async function applyPaidStock(orderId: string) {
  const sql = await getSql();
  const claimed = await sql<{ items: OrderItem[] }>`
    update storefront_order_requests
    set stock_applied = true
    where id = ${orderId} and stock_applied = false and payment_status = 'paid'
    returning items
  `;
  const items = claimed[0]?.items;
  if (!items) return;
  const short: { sku: string; ml: number | null; qty: number }[] = [];
  for (const item of items) {
    const ml = mlOfVariant(item.color);
    if (ml == null) {
      short.push({ sku: item.sku, ml: null, qty: item.qty });
      continue;
    }
    const updated = await sql<{ sku: string }>`
      update perfume_variants
      set stock = stock - ${item.qty}
      where sku = ${item.sku} and ml = ${ml} and stock >= ${item.qty}
      returning sku
    `;
    if (!updated[0]) short.push({ sku: item.sku, ml, qty: item.qty });
  }
  if (short.length) {
    await sql`
      update storefront_order_requests
      set stock_shortage = ${JSON.stringify(short)}::jsonb
      where id = ${orderId}
    `;
  }
  bustCatalog();
}

export async function saveStockAlert(sku: string, ml: number, email: string) {
  const sql = await getSql();
  await sql`
    insert into stock_alerts (sku, ml, email)
    values (${sku}, ${ml}, ${email.trim().toLowerCase()})
    on conflict (sku, ml, email) do nothing
  `;
  return { ok: true as const };
}

export async function publicOrderStatus(id: string) {
  if (!ORDER_ID.test(id)) return null;
  try {
    const sql = await getSql();
    const rows = await sql<{
      payment_status: string;
      shipping_status: string;
      tracking_code: string | null;
    }>`
      select payment_status, shipping_status, tracking_code
      from storefront_order_requests
      where id = ${id}
    `;
    const row = rows[0];
    if (!row) return null;
    const tracking = row.tracking_code ?? "";
    return {
      payment: row.payment_status,
      shipping: row.shipping_status,
      tracking,
      trackingUrl: trackingUrl(tracking),
    };
  } catch {
    return null;
  }
}

type InvoiceRow = {
  customer: {
    name?: string;
    email?: string;
    address?: string;
    taxNumber?: string;
    city?: string;
    district?: string;
  };
  items: OrderItem[];
  total_cents: number;
  shipping_cents: number;
  discount_cents: number;
  gift_wrap: boolean;
  hide_prices: boolean;
  invoice_number: string | null;
};

async function loadInvoiceRow(id: string) {
  if (!ORDER_ID.test(id)) return null;
  const sql = await getSql();
  const rows = await sql<InvoiceRow>`
    select customer, items, total_cents, shipping_cents, discount_cents, gift_wrap, hide_prices, invoice_number
    from storefront_order_requests
    where id = ${id}
  `;
  return rows[0] ?? null;
}

async function ensureInvoiceNumber(id: string, current: string | null) {
  if (current?.trim()) return current.trim();
  const sql = await getSql();
  const updated = await sql<{ invoice_number: string }>`
    update storefront_order_requests
    set invoice_number = 'EAR' || to_char(now() at time zone 'Europe/Istanbul', 'YYYY')
      || lpad(nextval('storefront_invoice_seq')::text, 6, '0'),
        updated_at = now()
    where id = ${id} and coalesce(invoice_number, '') = ''
    returning invoice_number
  `;
  if (updated[0]?.invoice_number) return updated[0].invoice_number;
  const again = await sql<{ invoice_number: string }>`
    select invoice_number from storefront_order_requests where id = ${id}
  `;
  return again[0]?.invoice_number?.trim() || "";
}

function invoiceDoc(row: InvoiceRow, number: string, prices: boolean): InvoiceDoc {
  const buyer = row.customer ?? {};
  return {
    number,
    title: prices ? "FATURA" : "IRSALIYE",
    prices,
    seller: {
      name: sellerName(),
      address: BRAND.legalAddress,
      taxOffice: BRAND.taxOffice,
      taxNumber: BRAND.taxNumber,
      phone: BRAND.phone,
      email: BRAND.email,
    },
    buyer: {
      name: buyer.name ?? "",
      address: [buyer.address, buyer.district, buyer.city].filter(Boolean).join(", "),
      taxNumber: buyer.taxNumber ?? "",
      email: buyer.email ?? "",
    },
    lines: (row.items ?? []).map((item) => ({
      name: `${item.name} ${item.colorName}`.trim(),
      qty: item.qty,
      unitCents: item.unitPrice,
    })),
    shippingCents: Number(row.shipping_cents) || 0,
    discountCents: Number(row.discount_cents) || 0,
    giftWrapCents: row.gift_wrap ? GIFT_WRAP_CENTS : 0,
    totalCents: Number(row.total_cents) || 0,
  };
}

export async function renderInvoice(id: string, kind: "fatura" | "irsaliye") {
  const row = await loadInvoiceRow(id);
  if (!row) return null;
  if (kind === "irsaliye" && !row.hide_prices) return null;
  const number = await ensureInvoiceNumber(id, row.invoice_number);
  if (!number) return null;
  const prices = kind === "fatura";
  return invoicePdf(invoiceDoc(row, number, prices));
}
