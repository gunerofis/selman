export const LIST_STEP = 24;

export function parseListWindow(raw: unknown, cap = 480) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(cap, Math.max(LIST_STEP, Math.floor(n)));
}

export function listWindow(goster: number | undefined) {
  return Math.max(LIST_STEP, goster ?? LIST_STEP);
}
