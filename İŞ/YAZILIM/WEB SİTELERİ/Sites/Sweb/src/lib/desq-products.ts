export type DesqTier = "set" | "aksesuar";

export type DesqProduct = {
  slug: string;
  name: string;
  tier: DesqTier;
  color: string;
  price: number;
  image: string;
};

export const DESQ_NOTE = "Deri kaplı premium ofis ürünleri. Renk ve logo baskısı size özel.";

export const DESQ_FEATURES = [
  "Premium deri kaplama",
  "Yönetici masası aksesuarları",
  "Deri masa düzenleyiciler",
  "Kurumsal & kişiye özel",
];

export const DESQ_TIERS: { id: DesqTier; label: string }[] = [
  { id: "aksesuar", label: "Aksesuarlar" },
];

export const DESQ_PRODUCTS: DesqProduct[] = [

];
