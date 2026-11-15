export const MISSING_VALUE = "DOLDURULACAK" as const;

export const businessInfo = {
  brandName: "BÜCÜRÜKTOYS",
  officialTradeName: MISSING_VALUE,
  activity: "Toptan oyuncak tedariği ve WhatsApp üzerinden teklif hizmeti",
  phone: "0539 346 85 27",
  phoneE164: "+905393468527",
  whatsapp: "https://wa.me/905393468527",
  website: "https://www.bucuruktoys.com",
  city: "İstanbul",
  deliveryArea: "Türkiye geneli teslimat",
  address: MISSING_VALUE,
  district: MISSING_VALUE,
  email: MISSING_VALUE,
  workingHours: MISSING_VALUE,
  instagram: MISSING_VALUE,
  minimumOrderRule: MISSING_VALUE,
  deliveryTime: MISSING_VALUE,
  vatStatus: MISSING_VALUE,
  invoicePolicy: MISSING_VALUE,
  paymentMethods: MISSING_VALUE,
  shippingPolicy: MISSING_VALUE,
  returnPolicy: MISSING_VALUE,
} as const;

/** Web formlarinin kalici kaydi icin gerekli asgari veri sorumlusu kimligi. */
export const privacyControllerReady = [
  businessInfo.officialTradeName,
  businessInfo.address,
  businessInfo.email,
].every((value) => value !== MISSING_VALUE);

export const businessInfoGroups = [
  {
    title: "Firma",
    items: [
      ["Marka adı", businessInfo.brandName],
      ["Resmî firma unvanı", businessInfo.officialTradeName],
      ["Faaliyet alanı", businessInfo.activity],
      ["Açık adres", businessInfo.address],
      ["İlçe", businessInfo.district],
      ["Şehir", businessInfo.city],
      ["Çalışma saatleri", businessInfo.workingHours],
    ],
  },
  {
    title: "İletişim",
    items: [
      ["Telefon / WhatsApp", businessInfo.phone],
      ["Kurumsal e-posta", businessInfo.email],
      ["Instagram", businessInfo.instagram],
      ["Web sitesi", businessInfo.website],
    ],
  },
  {
    title: "Toptan satış koşulları",
    items: [
      ["Teslimat bölgesi", businessInfo.deliveryArea],
      ["Minimum sipariş kuralı", businessInfo.minimumOrderRule],
      ["Teslim süresi", businessInfo.deliveryTime],
      ["KDV durumu", businessInfo.vatStatus],
      ["Fatura politikası", businessInfo.invoicePolicy],
      ["Ödeme yöntemleri", businessInfo.paymentMethods],
      ["Kargo / sevkiyat politikası", businessInfo.shippingPolicy],
      ["İade ve değişim politikası", businessInfo.returnPolicy],
    ],
  },
] as const;

export function fillMissing(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : MISSING_VALUE;
}

/** Public pages never expose internal placeholder values or sentences. */
export function hasPublicValue(value: unknown): value is string {
  return typeof value === "string" && Boolean(value.trim()) && !value.includes(MISSING_VALUE);
}

export function publicValue(value: unknown, fallback = "") {
  return hasPublicValue(value) ? value.trim() : fallback;
}
