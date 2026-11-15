export const BRAND = {
  name: "feelparfume",
  tagline: "Parfüm koleksiyonu.",
  email: "destek@feelparfume.com",
  legalEmail: "hukuk@feelparfume.com",
  atelier: "Örnek Mah. Parfüm Sok. No:1 D:2, Şişli / İstanbul",
  neighborhood: "Örnek Mah.",
  district: "Şişli",
  city: "İstanbul",
  country: "Türkiye",
  hours: "09.00–18.00",
  reply: "1 iş günü",
  quoteReply: "2 iş günü",
  legalUpdated: "2026-09-14",
  /** Resmî unvan, telefon ve IBAN bilinmeden yazılmaz. */
  legalName: "Feel Parfüm Kozmetik Ticaret Ltd. Şti. (örnek)",
  mersisNumber: "0000000000000000",
  taxOffice: "Şişli",
  taxNumber: "0000000000",
  legalAddress: "Örnek Mah. Parfüm Sok. No:1 D:2, Şişli / İstanbul",
  phone: "+90 212 000 00 00",
  kep: "feelparfume@hs01.kep.tr",
  etbisNo: "ETBİS-0000000000 (örnek)",
  instagram: "https://instagram.com/feelparfume",
  iban: "TR00 0000 0000 0000 0000 0000 00",
} as const;

export function hasBrandValue(value: string) {
  return Boolean(value.trim());
}

export function sellerName() {
  return hasBrandValue(BRAND.legalName) ? BRAND.legalName : BRAND.name;
}
