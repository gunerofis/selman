export const PRICE_BANDS = [
  { id: "1000", max: 1000, label: "₺1.000 altı" },
  { id: "2500", min: 1000, max: 2500, label: "₺1.000–₺2.500" },
  { id: "4000", min: 2500, max: 4000, label: "₺2.500–₺4.000" },
  { id: "ust", min: 4000, label: "₺4.000 üzeri" },
] as const;

export const WIDTH_BANDS = [
  { id: "200", max: 200, label: "20 cm'ye kadar" },
  { id: "350", min: 200, max: 350, label: "20–35 cm" },
  { id: "500", min: 350, max: 500, label: "35–50 cm" },
  { id: "genis", min: 500, label: "50 cm üzeri" },
] as const;

export type PriceBandId = (typeof PRICE_BANDS)[number]["id"];
export type WidthBandId = (typeof WIDTH_BANDS)[number]["id"];

export function isPriceBand(id: string | undefined): id is PriceBandId {
  return PRICE_BANDS.some((b) => b.id === id);
}

export function isWidthBand(id: string | undefined): id is WidthBandId {
  return WIDTH_BANDS.some((b) => b.id === id);
}

function inBand(n: number, band: { min?: number; max?: number }) {
  if (band.min != null && n < band.min) return false;
  if (band.max != null && n >= band.max) return false;
  return true;
}

export function inPriceBand(price: number, id: PriceBandId) {
  const band = PRICE_BANDS.find((b) => b.id === id);
  return band ? inBand(price, band) : true;
}

export function inWidthBand(widthMm: number | null, id: WidthBandId) {
  if (widthMm == null) return false;
  const band = WIDTH_BANDS.find((b) => b.id === id);
  return band ? inBand(widthMm, band) : true;
}
