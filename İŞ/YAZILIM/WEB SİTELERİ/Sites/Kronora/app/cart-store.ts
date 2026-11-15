export type CartItem = { slug: string; quantity: number };
const KEY = "kronora-cart";
function normalize(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  const quantities = new Map<string, number>();
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as { slug?: unknown; quantity?: unknown };
    const slug = String(item.slug || "").trim().slice(0, 220);
    if (!slug) continue;
    const quantity = Math.max(1, Math.min(20, Math.trunc(Number(item.quantity)) || 1));
    quantities.set(slug, Math.min(20, (quantities.get(slug) || 0) + quantity));
  }
  return [...quantities].slice(0, 50).map(([slug, quantity]) => ({ slug, quantity }));
}
export function readCart(): CartItem[] { if (typeof window === "undefined") return []; try { return normalize(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { return []; } }
export function writeCart(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(normalize(items))); window.dispatchEvent(new Event("cart-updated")); }
export function addCartItem(slug: string, quantity = 1) { const items = readCart(); const existing = items.find((item) => item.slug === slug); if (existing) existing.quantity = Math.min(20, existing.quantity + Math.max(1, Math.trunc(quantity) || 1)); else items.push({ slug, quantity }); writeCart(items); }
export function clearCart() { writeCart([]); }
