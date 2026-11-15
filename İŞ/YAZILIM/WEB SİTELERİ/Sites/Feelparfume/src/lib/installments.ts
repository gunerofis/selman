export type InstallmentRate = { bank: string; months: number; ratioBps: number };

export function parseRatePayload(body: unknown): InstallmentRate[] {
  if (!body || typeof body !== "object") return [];
  const oranlar = (body as { oranlar?: unknown }).oranlar;
  if (!oranlar || typeof oranlar !== "object") return [];
  const rows: InstallmentRate[] = [];
  for (const [bank, table] of Object.entries(oranlar as Record<string, unknown>)) {
    if (!bank.trim() || !table || typeof table !== "object") continue;
    for (const [key, value] of Object.entries(table as Record<string, unknown>)) {
      const months = Number(key.replace(/\D/g, ""));
      const percent = Number(String(value).replace(",", "."));
      if (!Number.isInteger(months) || months < 2 || months > 12) continue;
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) continue;
      rows.push({ bank, months, ratioBps: Math.round(percent * 100) });
    }
  }
  return rows;
}

export function installmentRows(priceCents: number, rates: InstallmentRate[]) {
  if (!Number.isFinite(priceCents) || priceCents <= 0) return [];
  return rates
    .filter((rate) => rate.months >= 2 && rate.ratioBps >= 0)
    .map((rate) => {
      const totalCents = Math.round(priceCents * (1 + rate.ratioBps / 10_000));
      return { ...rate, totalCents, eachCents: Math.round(totalCents / rate.months) };
    });
}
