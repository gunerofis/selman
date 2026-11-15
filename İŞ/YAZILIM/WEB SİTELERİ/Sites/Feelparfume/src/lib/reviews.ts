export type ReviewGate = {
  shippingStatus: string;
  email: string;
  skus: string[];
};

export type PublicReview = {
  id: string;
  author: string;
  rating: number;
  longevity: number;
  sillage: number;
  season: "ilkbahar" | "yaz" | "sonbahar" | "kis";
  body: string;
};

export type RatingRow = { sku: string; rating: number; count: number };

const SEASONS = new Set(["ilkbahar", "yaz", "sonbahar", "kis"]);

/** Yorum yalnız teslim edilmiş siparişte, aynı e-posta ve ürün için açılır. */
export function reviewAllowed(order: ReviewGate | null, email: string, sku: string) {
  if (!order || order.shippingStatus !== "delivered") return false;
  const buyer = order.email.trim().toLowerCase();
  const claim = email.trim().toLowerCase();
  if (!buyer || buyer !== claim) return false;
  return order.skus.includes(sku);
}

export function authorLabel(name: string) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.slice(0, 24) || "Müşteri";
}

export function ratingSummary(ratings: number[]) {
  const clean = ratings.filter((n) => Number.isInteger(n) && n >= 1 && n <= 5);
  if (!clean.length) return null;
  const sum = clean.reduce((total, rating) => total + rating, 0);
  return { count: clean.length, rating: Math.round((sum / clean.length) * 10) / 10 };
}

export function asPublicReview(row: {
  id: string;
  author: string;
  rating: number | string;
  longevity: number | string;
  sillage: number | string;
  season: string;
  body: string | null;
}): PublicReview | null {
  const rating = Number(row.rating);
  const longevity = Number(row.longevity);
  const sillage = Number(row.sillage);
  if (![rating, longevity, sillage].every((n) => Number.isInteger(n) && n >= 1 && n <= 5)) return null;
  if (!SEASONS.has(row.season)) return null;
  return {
    id: row.id,
    author: authorLabel(row.author),
    rating,
    longevity,
    sillage,
    season: row.season as PublicReview["season"],
    body: (row.body ?? "").slice(0, 280),
  };
}

export function batchGroups(rows: Array<{ sku: string; name: string; slug: string; ml: string }>) {
  const groups = new Map<string, { sku: string; name: string; slug: string; mls: number[] }>();
  for (const row of rows) {
    const ml = Number(row.ml);
    const current = groups.get(row.sku) ?? { sku: row.sku, name: row.name, slug: row.slug, mls: [] };
    if (Number.isFinite(ml) && ml > 0 && !current.mls.includes(ml)) current.mls.push(ml);
    groups.set(row.sku, current);
  }
  return [...groups.values()];
}

let index: RatingRow[] = [];

export function replaceReviewIndex(next: RatingRow[]) {
  index = next;
}

export function ratingOf(sku: string) {
  return index.find((row) => row.sku === sku) ?? null;
}
