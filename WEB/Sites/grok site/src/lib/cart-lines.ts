export type RecolorLine = { sku: string; color: string; qty: number };

export function recolorLines<T extends RecolorLine>(lines: T[], sku: string, from: string, to: string): T[] {
  if (from === to) return lines;
  const next = lines.map((line) => ({ ...line }));
  const i = next.findIndex((line) => line.sku === sku && line.color === from);
  if (i < 0) return lines;
  const j = next.findIndex((line) => line.sku === sku && line.color === to);
  if (j >= 0) {
    next[j] = { ...next[j], qty: next[j].qty + next[i].qty };
    next.splice(i, 1);
    return next;
  }
  next[i] = { ...next[i], color: to };
  return next;
}

/** Put a removed line back, merging qty when the same sku+color is already there. */
export function restoreLine<T extends RecolorLine>(lines: T[], line: T): T[] {
  const i = lines.findIndex((row) => row.sku === line.sku && row.color === line.color);
  if (i < 0) return [...lines, line];
  const next = lines.map((row) => ({ ...row }));
  next[i] = { ...next[i], qty: next[i].qty + line.qty };
  return next;
}
