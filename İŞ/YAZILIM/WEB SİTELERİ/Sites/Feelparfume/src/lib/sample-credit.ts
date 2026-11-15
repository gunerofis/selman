const DAY_MS = 24 * 60 * 60 * 1000;

export type SampleHistory = {
  sku: string;
  sampleCents: number;
  bottle: boolean;
  at: number;
};

/** Ödenmiş deneme tutarı, 30 gün içinde aynı ürünün şişesine bir kez uygulanır. */
export function openSampleCredits(history: SampleHistory[], now: number) {
  const start = now - 30 * DAY_MS;
  const bySku = new Map<string, { sample: number; bottle: boolean }>();
  for (const row of history) {
    if (!Number.isFinite(row.at) || row.at < start || row.at > now) continue;
    const current = bySku.get(row.sku) ?? { sample: 0, bottle: false };
    if (row.bottle) current.bottle = true;
    else if (Number.isInteger(row.sampleCents) && row.sampleCents > 0) current.sample += row.sampleCents;
    bySku.set(row.sku, current);
  }
  const credits: Record<string, number> = {};
  for (const [sku, row] of bySku) {
    if (!row.bottle && row.sample > 0) credits[sku] = row.sample;
  }
  return credits;
}

export function applySampleCredit(
  items: Array<{ sku: string; unitPrice: number; qty: number; sample?: boolean; pricePending?: boolean }>,
  credits: Record<string, number>,
  merchandiseLeft: number,
) {
  const remain = { ...credits };
  let credit = 0;
  for (const item of items) {
    if (item.sample || item.pricePending) continue;
    const have = remain[item.sku] ?? 0;
    if (have <= 0) continue;
    const use = Math.min(have, item.unitPrice * item.qty);
    remain[item.sku] = have - use;
    credit += use;
  }
  return Math.min(credit, Math.max(0, merchandiseLeft));
}
