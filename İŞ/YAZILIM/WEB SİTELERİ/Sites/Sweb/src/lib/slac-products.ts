export type SlacTier = "set" | "tekli";

export type SlacProduct = {
  code: string;
  name: string;
  slug: string;
  tier: SlacTier;
  color: string;
  price: number;
  image: string;
  contents: string[];
};

export const SLAC_NOTE = "MDF üzeri deri kaplama, vanilya kadife iç. Gizli mıknatıslı kapak.";

export const SLAC_FEATURES = [
  "Premium deri kaplama",
  "Vanilya kadife iç",
  "Gizli mıknatıslı kapak",
  "Kurumsal & kişisel hediye",
];

export const SLAC_TIERS: { id: SlacTier; label: string }[] = [
  { id: "set", label: "Setler" },
  { id: "tekli", label: "Tekli kutular" },
];

export const SLAC_PRODUCTS: SlacProduct[] = [

];
