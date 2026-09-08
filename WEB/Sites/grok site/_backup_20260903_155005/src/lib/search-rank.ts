/** Baymard: exact SKU or name belongs at the top of “önerilen” results. */
export function promoteExact<T extends { sku: string; name: string }>(
  list: T[],
  q: string,
  fold: (s: string) => string,
): T[] {
  const n = fold(q.trim());
  if (!n || list.length < 2) return list;
  const i = list.findIndex((p) => fold(p.sku) === n || fold(p.name) === n);
  if (i <= 0) return list;
  const next = list.slice();
  const [hit] = next.splice(i, 1);
  next.unshift(hit);
  return next;
}

export function isExactHit(p: { sku: string; name: string }, q: string, fold: (s: string) => string) {
  const n = fold(q.trim());
  if (!n) return false;
  return fold(p.sku) === n || fold(p.name) === n;
}
