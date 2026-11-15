import { assertSameSiteRequest } from "./auth/isolation.server";
import { getSql } from "./db";
import { asPublicReview, authorLabel, reviewAllowed, type RatingRow } from "./reviews.ts";

type OrderRow = {
  shipping_status: string;
  email: string | null;
  name: string | null;
  items: unknown;
};

let indexCache: { at: number; rows: RatingRow[] } | null = null;

function missingTable(error: unknown, table: string) {
  return String(error).includes(table);
}

function skusOf(items: unknown) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (item && typeof item === "object" && "sku" in item ? String(item.sku) : ""))
    .filter(Boolean);
}

export function bustReviewIndex() {
  indexCache = null;
}

export async function loadReviewIndex(): Promise<RatingRow[]> {
  if (indexCache && Date.now() - indexCache.at < 30_000) return indexCache.rows;
  try {
    const sql = await getSql();
    const rows = await sql<{ sku: string; rating: number | string; count: number | string }>`
      select sku, round(avg(rating)::numeric, 1)::float as rating, count(*)::int as count
      from product_reviews
      group by sku
    `;
    const next = rows
      .map((row) => ({ sku: row.sku, rating: Number(row.rating), count: Number(row.count) }))
      .filter((row) => row.sku && Number.isFinite(row.rating) && row.count > 0);
    indexCache = { at: Date.now(), rows: next };
    return next;
  } catch (error) {
    if (missingTable(error, "product_reviews")) return [];
    throw error;
  }
}

export async function listProductReviews(sku: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      author: string;
      rating: number;
      longevity: number;
      sillage: number;
      season: string;
      body: string | null;
    }>`
      select id, author, rating, longevity, sillage, season, body
      from product_reviews
      where sku = ${sku}
      order by created_at desc
      limit 20
    `;
    return rows.flatMap((row) => {
      const review = asPublicReview(row);
      return review ? [review] : [];
    });
  } catch (error) {
    if (missingTable(error, "product_reviews")) return [];
    throw error;
  }
}

export async function submitProductReview(input: {
  orderId: string;
  email: string;
  sku: string;
  rating: number;
  longevity: number;
  sillage: number;
  season: "ilkbahar" | "yaz" | "sonbahar" | "kis";
  body: string;
}) {
  assertSameSiteRequest();
  const sql = await getSql();
  let order: OrderRow | undefined;
  try {
    const rows = await sql<OrderRow>`
      select shipping_status, customer->>'email' as email, customer->>'name' as name, items
      from storefront_order_requests
      where id = ${input.orderId}
    `;
    order = rows[0];
  } catch (error) {
    if (missingTable(error, "storefront_order_requests")) throw new Error("Kayıt açılamadı.");
    throw error;
  }
  const allowed = reviewAllowed(
    order
      ? { shippingStatus: order.shipping_status, email: order.email ?? "", skus: skusOf(order.items) }
      : null,
    input.email,
    input.sku,
  );
  if (!allowed) throw new Error("Teslim edilmiş sipariş gerekir.");
  const existing = await sql<{ id: string }>`
    select id from product_reviews where order_id = ${input.orderId} and sku = ${input.sku}
  `;
  if (existing[0]) throw new Error("Bu sipariş için kayıt var.");
  const id = `RV-${crypto.randomUUID()}`;
  await sql`
    insert into product_reviews (id, sku, order_id, email, author, rating, longevity, sillage, season, body)
    values (
      ${id}, ${input.sku}, ${input.orderId}, ${input.email.trim().toLowerCase()},
      ${authorLabel(order?.name ?? "")}, ${input.rating}, ${input.longevity}, ${input.sillage},
      ${input.season}, ${input.body}
    )
  `;
  bustReviewIndex();
  return { ok: true as const };
}

export async function lookupBatch(batch: string) {
  assertSameSiteRequest();
  const code = batch.trim();
  const sql = await getSql();
  const rows = await sql<{ sku: string; name: string; slug: string; ml: string }>`
    select p.sku, p.name, p.slug, v.ml::text as ml
    from perfume_variants v
    join perfume_products p on p.sku = v.sku
    where p.status = 'active' and lower(v.batch) = lower(${code})
    order by p.sku, v.ml
    limit 24
  `;
  return rows;
}
