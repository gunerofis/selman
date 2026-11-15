export type OrgCategory =
  | "ofis"
  | "banyo"
  | "mutfak"
  | "makyaj"
  | "gardrop"
  | "cocuk"
  | "giris"
  | "arac-pet"
  | "genel";

export type OrgProduct = {
  slug: string;
  name: string;
  category: OrgCategory;
  color: string;
  price: number;
  image: string;
};

export const ORG_NOTE = "Boyalı düzen ve organize gereçleri. Sekiz renk, kişiye özel üretim.";

export const ORG_FEATURES = [
  "Boyalı kaplama",
  "Sekiz renk",
  "Kişiye özel üretim",
  "Kurumsal sipariş",
];

export const ORG_CATEGORIES: { id: OrgCategory; label: string }[] = [
  { id: "ofis", label: "Ofis" },
  { id: "banyo", label: "Banyo" },
  { id: "mutfak", label: "Mutfak" },
  { id: "makyaj", label: "Makyaj" },
  { id: "gardrop", label: "Giyinme & Çamaşır" },
  { id: "cocuk", label: "Çocuk" },
  { id: "giris", label: "Giriş & Duvar" },
  { id: "arac-pet", label: "Araç & Evcil" },
  { id: "genel", label: "Genel" },
];

export const ORG_PRODUCTS: OrgProduct[] = [

];
