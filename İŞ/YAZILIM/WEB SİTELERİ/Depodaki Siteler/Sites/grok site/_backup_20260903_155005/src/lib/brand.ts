export const BRAND = {
  name: "Sweb",
  tagline: "Ev ve çalışma alanı için düzen ürünleri.",
  email: "selam@sweb.co",
  atelier: "Bomonti, Şişli · İstanbul",
  neighborhood: "Bomonti",
  district: "Şişli",
  city: "İstanbul",
  country: "Türkiye",
  hours: "09.00–18.00",
  reply: "1 iş günü",
  quoteReply: "2 iş günü",
  legalUpdated: "2026-09-02",
  /** Resmî unvan, telefon ve IBAN bilinmeden yazılmaz. */
  legalName: "",
  phone: "",
  iban: "",
} as const;

export function hasBrandValue(value: string) {
  return Boolean(value.trim());
}

export function sellerName() {
  return hasBrandValue(BRAND.legalName) ? BRAND.legalName : `${BRAND.name} atölyesi`;
}
