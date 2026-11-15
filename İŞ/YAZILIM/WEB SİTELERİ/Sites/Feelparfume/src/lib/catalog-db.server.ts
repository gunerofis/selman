import { compareAtPrice, type PricePoint } from "./checkout-pricing";
import { getSql } from "./db";
import { slugify, type Product } from "./products";
import type { SizeOption } from "./perfume";
import { normalizeCatalogMedia } from "./gallery";
import { SAMPLE_PRODUCTS } from "./sample-products";
import { SHOW_SAMPLE_PRODUCTS } from "./catalog-mode";

type ProductRow = {
  sku: string;
  slug: string;
  name: string;
  brand_slug: string | null;
  brand_name: string | null;
  category: string;
  gender: string | null;
  concentration: string | null;
  families: string[];
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  longevity: number | null;
  sillage: number | null;
  seasons: string[];
  year: number | null;
  perfumer: string | null;
  origin: string | null;
  ingredients: string | null;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  featured: boolean;
  status: "active" | "draft" | "archived";
  is_sample: boolean;
};

type VariantRow = {
  sku: string;
  ml: string;
  price: string;
  stock: number;
  gtin: string | null;
  batch: string | null;
  expiry: string | null;
  is_sample: boolean;
};

export type ProductInput = Omit<Product, "shortName" | "price" | "specs" | "variants" | "sizes"> & {
  sizes: Array<SizeOption & { stock: number; gtin?: string; batch?: string; expiry?: string }>;
};

const g = globalThis as typeof globalThis & {
  __catalogCache__?: { at: number; stamp: string; all: Product[] };
  __catalogSeed__?: Promise<void>;
};

const TTL_MS = 30_000;

export function bustCatalog() {
  g.__catalogCache__ = undefined;
}

async function seedIfEmpty() {
  g.__catalogSeed__ ??= (async () => {
    const sql = await getSql();
    const [{ n }] = await sql<{ n: number }>`select count(*)::int as n from perfume_products`;
    if (n > 0 || !SHOW_SAMPLE_PRODUCTS) return;
    for (const [i, p] of SAMPLE_PRODUCTS.entries()) {
      await upsertProductRaw(
        {
          ...p,
          sizes: (p.sizes ?? []).map((s) => ({
            ...s,
            stock: 12,
            gtin: p.gtin,
            batch: p.batch,
            expiry: p.expiry,
          })),
        },
        i,
      );
    }
  })().catch((error) => {
    g.__catalogSeed__ = undefined;
    throw error;
  });
  await g.__catalogSeed__;
}

function priceLows(logs: { sku: string; ml: string; price: string; at: string }[]) {
  const groups = new Map<string, PricePoint[]>();
  for (const log of logs) {
    const at = Date.parse(log.at);
    const price = Number(log.price);
    if (!Number.isFinite(at) || !Number.isFinite(price)) continue;
    const key = `${log.sku}:${Number(log.ml)}`;
    groups.set(key, [...(groups.get(key) ?? []), { price, at }]);
  }
  const lows = new Map<string, number>();
  for (const [key, history] of groups) {
    const latest = history.reduce((a, b) => (a.at > b.at ? a : b));
    const low = compareAtPrice(latest.price, history);
    if (low != null) lows.set(key, low);
  }
  return lows;
}

function toProduct(row: ProductRow, variants: VariantRow[], lows: Map<string, number>): Product {
  const sizes: SizeOption[] = variants.map((v) => {
    const ml = Number(v.ml);
    const compareAt = lows.get(`${row.sku}:${ml}`);
    return {
      id: `${ml}ml`,
      ml,
      price: Number(v.price),
      compareAt,
      sample: v.is_sample || undefined,
      stockStatus: v.stock > 0 ? ("stokta" as const) : ("tukendi" as const),
    };
  });
  const first = variants.find((v) => !v.is_sample) ?? variants[0];
  const prices = sizes.filter((s) => s.stockStatus !== "tukendi").map((s) => s.price);
  const media = normalizeCatalogMedia(row.image, row.images);
  return {
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    shortName: row.name,
    brand: row.brand_name ?? undefined,
    category: row.category,
    gender: (row.gender ?? undefined) as Product["gender"],
    concentration: (row.concentration ?? undefined) as Product["concentration"],
    families: row.families as Product["families"],
    notes:
      row.notes_top.length || row.notes_heart.length || row.notes_base.length
        ? { top: row.notes_top, heart: row.notes_heart, base: row.notes_base }
        : undefined,
    longevity: row.longevity ?? undefined,
    sillage: row.sillage ?? undefined,
    seasons: row.seasons as Product["seasons"],
    year: row.year ?? undefined,
    perfumer: row.perfumer ?? undefined,
    origin: row.origin ?? undefined,
    ingredients: row.ingredients ?? undefined,
    tagline: row.tagline,
    description: row.description,
    features: row.features,
    specs: [],
    image: media.image,
    images: media.images,
    featured: row.featured || undefined,
    status: row.status,
    sample: row.is_sample || undefined,
    sizes,
    price: prices.length ? Math.min(...prices) : Math.min(...sizes.map((s) => s.price), 0),
    stockStatus: prices.length ? "stokta" : "tukendi",
    gtin: first?.gtin ?? undefined,
    batch: first?.batch ?? undefined,
    expiry: first?.expiry ?? undefined,
  };
}

async function readAll(): Promise<Product[]> {
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql<ProductRow>`
    select p.*, b.name as brand_name
    from perfume_products p
    left join perfume_brands b on b.slug = p.brand_slug
    order by p.sort, p.sku
  `;
  const variants = await sql<VariantRow>`
    select sku, ml::text, price::text, stock, gtin, batch, expiry, is_sample
    from perfume_variants
    order by sku, sort, ml
  `;
  const logs = await sql<{ sku: string; ml: string; price: string; at: string }>`
    select sku, ml::text, price::text, recorded_at::text as at
    from perfume_price_log
    where recorded_at >= now() - interval '30 days'
  `;
  const lows = priceLows(logs);
  const bySku = new Map<string, VariantRow[]>();
  for (const v of variants) bySku.set(v.sku, [...(bySku.get(v.sku) ?? []), v]);
  return rows.map((r) => toProduct(r, bySku.get(r.sku) ?? [], lows));
}

/** Tüm ürünler (yönetim dahil), 30 sn önbellekli. */
export async function getAllProductsServer() {
  const cached = g.__catalogCache__;
  if (cached && Date.now() - cached.at < TTL_MS) return cached;
  const all = await readAll();
  const next = { at: Date.now(), stamp: `${Date.now()}`, all };
  g.__catalogCache__ = next;
  return next;
}

/** Vitrin: yalnız yayında olan ve en az bir varyantı olan ürünler. */
export async function getPublicCatalogServer() {
  const { stamp, all } = await getAllProductsServer();
  const products = all.filter(
    (p) => p.status === "active" && (p.sizes?.length ?? 0) > 0 && (SHOW_SAMPLE_PRODUCTS || !p.sample),
  );
  return { stamp, products };
}

async function uniqueSlug(base: string, sku: string) {
  const sql = await getSql();
  let slug = base || slugify(sku);
  for (let i = 2; i < 50; i += 1) {
    const hit = await sql<{ sku: string }>`select sku from perfume_products where slug = ${slug}`;
    if (!hit[0] || hit[0].sku === sku) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${sku.toLowerCase()}`;
}

async function upsertProductRaw(p: ProductInput, sort?: number) {
  const sql = await getSql();
  const brandSlug = p.brand ? slugify(p.brand) : null;
  if (brandSlug && p.brand) {
    await sql`
      insert into perfume_brands (slug, name) values (${brandSlug}, ${p.brand})
      on conflict (slug) do update set name = excluded.name
    `;
  }
  const slug = await uniqueSlug(p.slug?.trim() || slugify(p.name), p.sku);
  await sql`
    insert into perfume_products (
      sku, slug, name, brand_slug, category, gender, concentration, families,
      notes_top, notes_heart, notes_base, longevity, sillage, seasons, year, perfumer,
      origin, ingredients, tagline, description, features, image, images, featured,
      status, is_sample, sort, updated_at
    ) values (
      ${p.sku}, ${slug}, ${p.name}, ${brandSlug}, ${p.category}, ${p.gender ?? null},
      ${p.concentration ?? null}, ${p.families ?? []}, ${p.notes?.top ?? []},
      ${p.notes?.heart ?? []}, ${p.notes?.base ?? []}, ${p.longevity ?? null},
      ${p.sillage ?? null}, ${p.seasons ?? []}, ${p.year ?? null}, ${p.perfumer ?? null},
      ${p.origin ?? null}, ${p.ingredients ?? null}, ${p.tagline ?? ""}, ${p.description ?? ""},
      ${p.features ?? []}, ${p.image ?? ""}, ${p.images ?? []}, ${Boolean(p.featured)},
      ${p.status ?? "active"}, ${Boolean(p.sample)}, ${sort ?? 0}, now()
    )
    on conflict (sku) do update set
      slug = excluded.slug, name = excluded.name, brand_slug = excluded.brand_slug,
      category = excluded.category, gender = excluded.gender,
      concentration = excluded.concentration, families = excluded.families,
      notes_top = excluded.notes_top, notes_heart = excluded.notes_heart,
      notes_base = excluded.notes_base, longevity = excluded.longevity,
      sillage = excluded.sillage, seasons = excluded.seasons, year = excluded.year,
      perfumer = excluded.perfumer, origin = excluded.origin,
      ingredients = excluded.ingredients, tagline = excluded.tagline,
      description = excluded.description, features = excluded.features,
      image = excluded.image, images = excluded.images, featured = excluded.featured,
      status = excluded.status, is_sample = excluded.is_sample, updated_at = now()
  `;
  await sql`delete from perfume_variants where sku = ${p.sku}`;
  for (const [i, s] of p.sizes.entries()) {
    await sql`
      insert into perfume_variants (sku, ml, price, stock, gtin, batch, expiry, is_sample, sort)
      values (${p.sku}, ${s.ml}, ${s.price}, ${s.stock}, ${s.gtin ?? null}, ${s.batch ?? null},
              ${s.expiry ?? null}, ${Boolean(s.sample)}, ${i})
    `;
    await sql`
      insert into perfume_price_log (sku, ml, price)
      select ${p.sku}, ${s.ml}, ${s.price}
      where (
        select price from perfume_price_log
        where sku = ${p.sku} and ml = ${s.ml}
        order by recorded_at desc, id desc
        limit 1
      ) is distinct from ${s.price}
    `;
  }
}

export async function upsertProductServer(p: ProductInput) {
  await seedIfEmpty();
  await upsertProductRaw(p);
  bustCatalog();
}

export async function setProductStatusServer(sku: string, status: "active" | "draft" | "archived") {
  const sql = await getSql();
  await sql`update perfume_products set status = ${status}, updated_at = now() where sku = ${sku}`;
  bustCatalog();
}

export async function deleteProductServer(sku: string) {
  const sql = await getSql();
  await sql`delete from perfume_products where sku = ${sku}`;
  bustCatalog();
}

/** Yönetim için varyant ayrıntılı (stok, barkod, parti) ürün. */
export async function getAdminProductsServer() {
  await seedIfEmpty();
  const sql = await getSql();
  const variants = await sql<VariantRow>`
    select sku, ml::text, price::text, stock, gtin, batch, expiry, is_sample
    from perfume_variants order by sku, sort, ml
  `;
  const { all } = await getAllProductsServer();
  return all.map((p) => ({
    ...p,
    variantRows: variants
      .filter((v) => v.sku === p.sku)
      .map((v) => ({
        ml: Number(v.ml),
        price: Number(v.price),
        stock: v.stock,
        gtin: v.gtin ?? "",
        batch: v.batch ?? "",
        expiry: v.expiry ?? "",
        sample: v.is_sample,
      })),
  }));
}
