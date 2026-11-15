export type RequestedOrderItem = { slug: string; quantity: number };

const MAX_DISTINCT_ITEMS = 50;
const MAX_QUANTITY_PER_ITEM = 20;

function cleanSlug(value: unknown) {
  return String(value || "").trim().slice(0, 220);
}

function cleanQuantity(value: unknown) {
  const quantity = Math.trunc(Number(value));
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(MAX_QUANTITY_PER_ITEM, quantity));
}

export function normalizeRequestedItems(value: unknown): RequestedOrderItem[] {
  if (!Array.isArray(value)) return [];
  const quantities = new Map<string, number>();

  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as { slug?: unknown; quantity?: unknown };
    const slug = cleanSlug(item.slug);
    if (!slug) continue;
    const current = quantities.get(slug) || 0;
    quantities.set(slug, Math.min(MAX_QUANTITY_PER_ITEM, current + cleanQuantity(item.quantity)));
  }

  return [...quantities].slice(0, MAX_DISTINCT_ITEMS).map(([slug, quantity]) => ({ slug, quantity }));
}

export function isValidOrderEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value);
}
