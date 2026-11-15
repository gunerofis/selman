import { fuzzyIncludes } from "./fuzzy";
import { promoteExact } from "./search-rank";

export const COLORS = [
  { id: "siyah", name: "Siyah", swatch: "#191715" },
  { id: "beyaz", name: "Beyaz", swatch: "#F4F1E8" },
  { id: "gri", name: "Gri", swatch: "#73706C" },
  { id: "krem", name: "Krem", swatch: "#D8C6A5" },
  { id: "espresso", name: "Kahve", swatch: "#5A3825" },
  { id: "taba", name: "Taba", swatch: "#A56632" },
  { id: "bordo", name: "Bordo", swatch: "#642B36" },
  { id: "kirmizi", name: "Kırmızı", swatch: "#B3262D" },
  { id: "turuncu", name: "Turuncu", swatch: "#D86A2B" },
  { id: "pembe", name: "Pembe", swatch: "#D990A5" },
  { id: "turkuaz", name: "Turkuaz", swatch: "#159B9B" },
  { id: "mavi", name: "Mavi", swatch: "#285F9E" },
  { id: "lacivert", name: "Lacivert", swatch: "#1F2F4A" },
  { id: "yesil", name: "Yeşil", swatch: "#315C42" },
] as const;

export type ColorId = (typeof COLORS)[number]["id"];

export type ProductImageWidth = 320 | 800;

export function productImageVariant(image: string, width: ProductImageWidth) {
  return image.replace(/\.webp$/, `-${width}.webp`);
}

/** Tile wash when a leather color is selected on the wall. */
export const PASTEL: Record<ColorId, string> = {
  siyah: "#E4DFD6",
  beyaz: "#F7F3EC",
  gri: "#E6E3DC",
  krem: "#EFE6DA",
  espresso: "#EDE2DB",
  taba: "#EDE2DB",
  bordo: "#E8DFD4",
  kirmizi: "#F2DDDC",
  turuncu: "#F3E2D4",
  pembe: "#F3E2E6",
  turkuaz: "#DCEDEA",
  mavi: "#DDE6F0",
  lacivert: "#DDE2EA",
  yesil: "#DFE9E0",
};

export type CategoryId = "ofis" | "banyo" | "makyaj" | "mutfak" | "gardrop" | "giris" | "cocuk" | "yasam" | "arac";
export const CATEGORIES: { id: CategoryId; name: string; blurb: string }[] = [];

/** Hub tiles skip Araç (tek parça); kategori filtresi ve alt bilgi durur. */
export const HUB_CATEGORIES = CATEGORIES.filter((c) => c.id !== "arac");

export type SeriesId = "kompakt" | "aksesuar" | "yonetici";
export const SERIES: { id: SeriesId; name: string; blurb: string; image: string }[] = [];

export type StockStatus = "stokta" | "siparisle-uretilir" | "uretimde" | "tukendi";

export type ProductVariant = {
  id: string;
  color?: ColorId;
  material?: string;
  sku: string;
  price?: number;
  stockStatus: StockStatus;
  stockQuantity?: number;
};

export type Spec = { label: string; value: string; readonly?: boolean };

export type Product = {
  sku: string;
  name: string;
  shortName: string;
  category: CategoryId;
  series?: SeriesId;
  price: number;
  image: string;
  tagline: string;
  description: string;
  features: string[];
  specs: Spec[];
  featured?: boolean;
  stockStatus?: StockStatus;
  variants?: ProductVariant[];
  defaultVariantId?: string;
};

const TR_SLUG: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

export function slugify(input: string) {
  return input
    .split("")
    .map((ch) => TR_SLUG[ch] ?? TR_SLUG[ch.toLocaleLowerCase("tr")] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productSlug(p: Product) {
  return slugify(p.name);
}

export const CATEGORY_ALIASES: Record<string, CategoryId> = {
  calisma: "ofis",
  "yatak-odasi": "gardrop",
  ev: "yasam",
};

export function resolveCategory(id: string | undefined): CategoryId | undefined {
  if (!id) return undefined;
  if (CATEGORIES.some((c) => c.id === id)) return id as CategoryId;
  return CATEGORY_ALIASES[id];
}

/** Breadcrumb zinciri: Ana Sayfa → Kategori → Alt kategori → Ürün */
export function buildBreadcrumb(product: Product): Array<{ label: string; href: string }> {
  const category = CATEGORIES.find((c) => c.id === product.category);
  const series = product.series ? SERIES.find((s) => s.id === product.series) : undefined;
  return [
    { label: "Ana Sayfa", href: "/" },
    { label: category?.name ?? product.category, href: `/kategori/${product.category}` },
    ...(series ? [{ label: series.name, href: `/koleksiyon?seri=${product.series}` }] : []),
    { label: product.name, href: `/urun/${productSlug(product)}` },
  ];
}

/** Tek kanonik ürün URL'i */
export function getProductCanonicalUrl(product: Product): string {
  return `https://www.gunerofis.online/urun/${productSlug(product)}`;
}

/** Kategori canonical URL */
export function getCategoryCanonicalUrl(categoryId: CategoryId): string {
  return `https://www.gunerofis.online/kategori/${categoryId}`;
}

/** SEO için ürün meta üretimi */
export function generateProductMeta(product: Product) {
  const fullName = `${product.name} — Sweb`;
  const desc = product.description.slice(0, 155);
  return {
    title: fullName,
    description: desc,
    canonical: getProductCanonicalUrl(product),
    ogImage: product.image.replace(/\.webp$/, "-800.webp"),
  };
}

/** SEO için kategori meta üretimi */
export function generateCategoryMeta(categoryId: CategoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return { title: "Kategori — Sweb", description: "", canonical: getCategoryCanonicalUrl(categoryId) };
  return {
    title: `${cat.name} — Sweb`,
    description: cat.blurb.slice(0, 155),
    canonical: getCategoryCanonicalUrl(categoryId),
    ogImage: "/products/category-default-800.webp",
  };
}

/** Alt metin (alt text) üretimi */
export function generateAltText(product: Product, variant?: ProductVariant): string {
  const colorPart = variant?.color ? ` ${COLORS.find((c) => c.id === variant.color)?.name ?? variant.color}` : "";
  return `${product.name}${colorPart} — Sweb deri ürünleri`;
}

/** Çakışan slug/SKU tespiti */
export function findDuplicateSlugs(products: Product[]): Map<string, Product[]> {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const slug = productSlug(p);
    if (!map.has(slug)) map.set(slug, []);
    map.get(slug)!.push(p);
  }
  return new Map([...map].filter(([, arr]) => arr.length > 1));
}

export function findDuplicateSkus(products: Product[]): Map<string, Product[]> {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    if (!map.has(p.sku)) map.set(p.sku, []);
    map.get(p.sku)!.push(p);
  }
  return new Map([...map].filter(([, arr]) => arr.length > 1));
}

/** Eksik zorunlu spec'leri tespit et */
export const REQUIRED_SPECS = ["Dış ölçü", "Ağırlık", "Malzeme", "Renk", "Stok durumu"] as const;

export function findProductsMissingSpecs(products: Product[]): Map<Product, string[]> {
  const missing = new Map<Product, string[]>();
  for (const p of products) {
    const labels = new Set(p.specs.map((s) => s.label));
    const missingSpecs = REQUIRED_SPECS.filter((req) => !labels.has(req));
    if (missingSpecs.length > 0) missing.set(p, missingSpecs);
  }
  return missing;
}

/** Varyant bazlı renk etiketi (kart/breadcrumb tutarlılığı için) */
export function getVariantColorLabel(product: Product, variantId?: string): string | undefined {
  const variant = variantId
    ? product.variants?.find((v) => v.id === variantId)
    : product.variants?.[0];
  return variant?.color ? COLORS.find((c) => c.id === variant.color)?.name : undefined;
}

/** Aktif (satılabilir) ürün sayacı */
export function countActiveProducts(products: Product[]): number {
  return products.filter((p) => p.stockStatus !== "tukendi").length;
}

export const PRODUCTS: Product[] = [

];

export const PRODUCT_COUNT = PRODUCTS.length;

/** Homepage wall: 21 SKUs (center first). Extra tiles hide below 768 / 1440. */
export const WALL_SKUS = [
  "7043",
  "7069",
  "7060",
  "7083",
  "7067",
  "7054",
  "7036",
  "7068",
  "7080",
  "7012",
  "7048",
  "7007",
  "7065",
  "7075",
  "7015",
  "7076",
  "7052",
  "7073",
  "7047",
  "7062",
] as const;

export { FREE_SHIPPING_FROM, SHIPPING_FEE } from "./commerce";

const SLUG_TO_SKU: Record<string, string> = {
  "sarj-standi": "7033",
  "sarj-istasyonu": "7033",
  "basucu-sarj-istasyonu": "7062",
  "tezgaah-organizeri": "7029",
  "tezgah-organizeri": "7029",
  "masa-organizeri": "7017",
  "tablet-ve-saat-standi": "7011",
  "basucu-valesi": "7062",
  "duvar-telefon-cebi": "7063",
  "saat-kutusu": "7034",
  "folyo-duzenleyici": "7044",
  "lavabo-istasyonu": "7030",
  "lavabo-tepsisi": "7065",
  "dizustu-folyo": "7080",
};

export function getProduct(id: string) {
  const key = decodeURIComponent(id).trim();
  const aliased = SLUG_TO_SKU[key.toLowerCase()];
  if (aliased) return PRODUCTS.find((p) => p.sku === aliased);
  return (
    PRODUCTS.find((p) => p.sku === key) ??
    PRODUCTS.find((p) => productSlug(p) === key.toLowerCase())
  );
}

export function getColor(id: ColorId) {
  return COLORS.find((c) => c.id === id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id);
}

export const COLOR_WASH_HINT = "Seçilen renk zemini boyar, deri fotoğrafını değil.";

export function productsByCategory(id: CategoryId) {
  return PRODUCTS.filter((p) => p.category === id);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured);
}

export function productsBySeries(id: SeriesId) {
  return PRODUCTS.filter((p) => p.series === id);
}

export function seriesTotal(id: SeriesId) {
  return productsBySeries(id).reduce((sum, p) => sum + p.price, 0);
}

export function getSeries(id: SeriesId | undefined) {
  return SERIES.find((s) => s.id === id);
}

export function foldTr(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a");
}

const JOB_EXPAND: Record<string, string[]> = {
  sarj: ["sarj", "kablo"],
  kablo: ["kablo", "sarj"],
  charger: ["sarj", "kablo"],
  baharat: ["baharat", "baharatlik"],
  spice: ["baharat", "baharatlik"],
  gozluk: ["gozluk"],
  glasses: ["gozluk"],
  dizustu: ["dizustu", "laptop"],
  laptop: ["dizustu", "laptop"],
  notebook: ["dizustu", "laptop"],
  macbook: ["dizustu", "laptop"],
  folyo: ["folyo", "rulo"],
  lavabo: ["lavabo"],
  kulaklik: ["kulaklik"],
  mouse: ["mouse"],
  tepsi: ["tepsi"],
  tray: ["tepsi"],
  sumen: ["sumen"],
  kalem: ["kalem"],
  ruj: ["ruj", "makyaj"],
  oje: ["oje", "makyaj"],
  makyaj: ["makyaj"],
  makeup: ["makyaj"],
  anahtar: ["anahtar"],
  key: ["anahtar"],
  saat: ["saat"],
  watch: ["saat"],
  kahve: ["kahve"],
  coffee: ["kahve"],
  organizer: ["organizer"],
  duzenleyici: ["organizer"],
  semsiye: ["semsiye"],
  ayakkabi: ["ayakkabi"],
  cuzdan: ["cuzdan"],
};

export function matchesQuery(p: Product, q: string) {
  const raw = foldTr(q.trim());
  if (!raw) return true;
  const words = raw.split(/\s+/).filter(Boolean);
  const hay = foldTr(
    [
      p.name,
      p.shortName,
      p.sku,
      p.tagline,
      p.description,
      p.features.join(" "),
      p.category,
      p.series ?? "",
    ].join(" "),
  );
  return words.every((w) => {
    const expanded = JOB_EXPAND[w] ?? [w];
    return expanded.some((term) => hay.includes(term) || fuzzyIncludes(hay, term));
  });
}

export function searchProducts(q: string, limit = 8) {
  const needle = q.trim();
  if (!needle) return PRODUCTS.slice(0, limit);
  return promoteExact(
    PRODUCTS.filter((p) => matchesQuery(p, needle)),
    needle,
    foldTr,
  ).slice(0, limit);
}

export function neighborsInCategory(sku: string) {
  const current = getProduct(sku);
  if (!current) return { prev: null as Product | null, next: null as Product | null };
  const list = PRODUCTS.filter((p) => p.category === current.category);
  const i = list.findIndex((p) => p.sku === current.sku);
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
}

export function productPath(p: Product) {
  return `/urun/${productSlug(p)}`;
}

export function specGrams(p: Product) {
  const row = p.specs.find((s) => s.label === "Ağırlık");
  if (!row) return "—";
  if (/kg/i.test(row.value)) {
    const n = Number(row.value.replace(",", ".").replace(/[^\d.]/g, ""));
    if (Number.isFinite(n)) return `${Math.round(n * 1000)} g`;
  }
  return row.value;
}

export function relatedProducts(sku: string, limit = 4) {
  const current = getProduct(sku);
  if (!current) return PRODUCTS.slice(0, limit);
  const tokens = foldTr(`${current.name} ${current.tagline}`)
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const scored = PRODUCTS.filter((p) => p.sku !== current.sku).map((p) => {
    let score = 0;
    if (p.category === current.category) score += 6;
    if (current.series && p.series === current.series) score += 5;
    const hay = foldTr(`${p.name} ${p.tagline} ${p.features.join(" ")}`);
    for (const t of tokens) if (hay.includes(t)) score += 2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}
