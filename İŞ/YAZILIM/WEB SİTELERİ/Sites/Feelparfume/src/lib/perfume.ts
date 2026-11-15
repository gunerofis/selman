/** Parfüm sınıflandırması: cinsiyet, konsantrasyon, koku ailesi, mevsim. */

export const GENDERS = [
  { id: "kadin", name: "Kadın" },
  { id: "erkek", name: "Erkek" },
  { id: "unisex", name: "Unisex" },
] as const;
export type GenderId = (typeof GENDERS)[number]["id"];

export const CONCENTRATIONS = [
  { id: "extrait", name: "Extrait de Parfum", short: "Extrait", oil: "%20–40", hint: "En yoğun; 8+ saat" },
  { id: "parfum", name: "Parfum", short: "Parfum", oil: "%20–30", hint: "Çok yoğun; 8+ saat" },
  { id: "edp", name: "Eau de Parfum", short: "EDP", oil: "%15–20", hint: "Yoğun; 6–8 saat" },
  { id: "edt", name: "Eau de Toilette", short: "EDT", oil: "%5–15", hint: "Orta; 3–5 saat" },
  { id: "edc", name: "Eau de Cologne", short: "EDC", oil: "%2–5", hint: "Hafif; 2 saat" },
] as const;
export type ConcentrationId = (typeof CONCENTRATIONS)[number]["id"];

export const FAMILIES = [
  { id: "ciceksi", name: "Çiçeksi", blurb: "Gül, yasemin, sümbül." },
  { id: "odunsu", name: "Odunsu", blurb: "Sandal, sedir, vetiver." },
  { id: "amber", name: "Amber / Oryantal", blurb: "Vanilya, reçine, baharat." },
  { id: "taze", name: "Taze", blurb: "Narenciye, deniz, yeşil." },
  { id: "gurme", name: "Gurme", blurb: "Karamel, kahve, tonka." },
  { id: "aromatik", name: "Aromatik / Fougère", blurb: "Lavanta, kumarin, yosun." },
  { id: "misk", name: "Misk", blurb: "Temiz, pudralı, ten kokusu." },
  { id: "deri", name: "Deri / Chypre", blurb: "Deri, paçuli, meşe yosunu." },
] as const;
export type FamilyId = (typeof FAMILIES)[number]["id"];

export const SEASONS = [
  { id: "ilkbahar", name: "İlkbahar" },
  { id: "yaz", name: "Yaz" },
  { id: "sonbahar", name: "Sonbahar" },
  { id: "kis", name: "Kış" },
] as const;
export type SeasonId = (typeof SEASONS)[number]["id"];

export type NotePyramid = { top: string[]; heart: string[]; base: string[] };

/** Ürünün satılabilir hacim seçeneği. `id` sepette varyant anahtarıdır ("50ml"). */
export type SizeOption = {
  id: string;
  ml: number;
  price: number;
  /** Son 30 günün daha yüksek en düşük fiyatı. Uydurma karşılaştırma yazılmaz. */
  compareAt?: number;
  /** Deneme boyu (dekant / vial). */
  sample?: boolean;
  stockStatus?: "stokta" | "tukendi";
};

export const PERFORMANCE_LABELS = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Çok iyi"] as const;

export function sizeId(ml: number) {
  return `${ml}ml`;
}

export function mlOfVariant(id: string) {
  const match = /^(\d+(?:\.\d+)?)ml$/.exec(id);
  if (!match) return null;
  const ml = Number(match[1]);
  return Number.isFinite(ml) && ml > 0 ? ml : null;
}

export function sizeLabel(id: string) {
  const m = /^(\d+(?:\.\d+)?)ml$/.exec(id);
  return m ? `${m[1]} ml` : id;
}

export function genderName(id?: string) {
  return GENDERS.find((g) => g.id === id)?.name;
}

export function concentrationOf(id?: string) {
  return CONCENTRATIONS.find((c) => c.id === id);
}

export function familyName(id: string) {
  return FAMILIES.find((f) => f.id === id)?.name ?? id;
}

export function seasonName(id: string) {
  return SEASONS.find((s) => s.id === id)?.name ?? id;
}

/** Kozmetik etiket uyarısı (parfüm, alkol bazlı). */
export const COSMETIC_WARNINGS = [
  "Yalnızca haricen kullanılır. Göz ve mukozayla temasından kaçının.",
  "Yanıcıdır. Isı, kıvılcım ve açık alevden uzak tutun.",
  "Tahriş olmuş cilde uygulamayın. Kızarıklıkta kullanımı bırakın.",
  "Çocukların ulaşamayacağı yerde, doğrudan güneş almayan serin yerde saklayın.",
];
