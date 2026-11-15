export const OFFER_STORAGE_KEY = "bucuruktoys-quote-quantities-v2";

export function countStoredOfferLines(rawValue: string | null) {
  if (!rawValue) return 0;

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return 0;

    return Object.values(parsed).filter(
      (quantity) => typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0,
    ).length;
  } catch {
    return 0;
  }
}
