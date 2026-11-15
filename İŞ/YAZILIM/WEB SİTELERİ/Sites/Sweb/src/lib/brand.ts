export const BRAND = {
  name: "Sweb",
  tagline: "Ev ve çalışma alanı için düzen ürünleri.",
  email: "destek@gunerofis.com",
  legalEmail: "destek@gunerofis.com",
  atelier: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
  neighborhood: "Örnektepe",
  district: "Beyoğlu",
  city: "İstanbul",
  country: "Türkiye",
  hours: "09.00–18.00",
  reply: "1 iş günü",
  quoteReply: "2 iş günü",
  legalUpdated: "2026-09-14",
  /** Resmî unvan, telefon ve IBAN bilinmeden yazılmaz. */
  legalName: "Guner Ofis Okul ve Büro Malzemeleri Ltd. Şti.",
  mersisNumber: "0432046576100001",
  taxOffice: "Kasımpaşa",
  taxNumber: "4320465761",
  legalAddress: "Örnektepe Mah. Etibank Cad. Onur Sok. 39/7, Beyoğlu / İstanbul",
  phone: "+90 212 210 33 91",
  iban: "",
} as const;

export function hasBrandValue(value: string) {
  return Boolean(value.trim());
}

export function sellerName() {
  return hasBrandValue(BRAND.legalName) ? BRAND.legalName : `${BRAND.name} atölyesi`;
}
