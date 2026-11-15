import { fuzzyIncludes } from "./fuzzy.ts";
import { SITE_ORIGIN } from "./seo.ts";
import { promoteExact } from "./search-rank.ts";
import {
  sizeLabel,
  type ConcentrationId,
  type FamilyId,
  type GenderId,
  type NotePyramid,
  type SeasonId,
  type SizeOption,
} from "./perfume.ts";

export type ColorOption = { id: string; name: string; swatch: string };
export const COLORS: ColorOption[] = [];

export type ColorId = string;

export type ProductImageWidth = 320 | 800;

export function productImageVariant(image: string, width: ProductImageWidth) {
  return image.replace(/\.webp$/, `-${width}.webp`);
}

/** Renk seçiliyken karo zemini. */
export const PASTEL: Record<ColorId, string> = {};

export type CategoryDef = { id: string; name: string; blurb: string };
export const CATEGORIES: CategoryDef[] = [
  { id: "kadin", name: "Kadın Parfüm", blurb: "Çiçeksi, gurme ve amber kadın parfümleri." },
  { id: "erkek", name: "Erkek Parfüm", blurb: "Odunsu, aromatik ve taze erkek parfümleri." },
  { id: "unisex", name: "Unisex Parfüm", blurb: "Herkes için niş ve modern kokular." },
  { id: "deneme-boyu", name: "Deneme Boyu", blurb: "Şişeyi almadan önce 2–10 ml ile deneyin." },
  { id: "hediye-seti", name: "Hediye Setleri", blurb: "Hazır kutulu parfüm ve bakım setleri." },
];

export type CategoryId = string;

export const HUB_CATEGORIES = CATEGORIES;

export type SeriesDef = { id: string; name: string; blurb: string; image: string };
export const SERIES: SeriesDef[] = [];

export type SeriesId = string;

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
  slug?: string;
  /** active | draft | archived (yönetim) */
  status?: "active" | "draft" | "archived";
  images?: string[];
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
  /** Parfüm alanları */
  brand?: string;
  gender?: GenderId;
  concentration?: ConcentrationId;
  families?: FamilyId[];
  notes?: NotePyramid;
  sizes?: SizeOption[];
  /** 1–5 */
  longevity?: number;
  /** 1–5 */
  sillage?: number;
  seasons?: SeasonId[];
  year?: number;
  perfumer?: string;
  /** INCI içerik listesi */
  ingredients?: string;
  origin?: string;
  /** Barkod (EAN-13) */
  gtin?: string;
  /** Parti (batch) numarası */
  batch?: string;
  /** Son kullanma (AA/YYYY) */
  expiry?: string;
  /** Örnek (demo) ürün — yayında gösterilmez. */
  sample?: boolean;
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
  return p.slug ?? slugify(p.name);
}

export const CATEGORY_ALIASES: Record<string, CategoryId> = {};

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
  return `${SITE_ORIGIN}/urun/${productSlug(product)}`;
}

/** Kategori canonical URL */
export function getCategoryCanonicalUrl(categoryId: CategoryId): string {
  return `${SITE_ORIGIN}/kategori/${categoryId}`;
}

/** SEO için ürün meta üretimi */
export function generateProductMeta(product: Product) {
  const fullName = `${product.name}`;
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
  if (!cat) return { title: "Kategori", description: "", canonical: getCategoryCanonicalUrl(categoryId) };
  return {
    title: cat.name,
    description: cat.blurb.slice(0, 155),
    canonical: getCategoryCanonicalUrl(categoryId),
    ogImage: "/favicon.svg",
  };
}

/** Alt metin (alt text) üretimi */
export function generateAltText(product: Product, variant?: ProductVariant): string {
  const colorPart = variant?.color ? ` ${COLORS.find((c) => c.id === variant.color)?.name ?? variant.color}` : "";
  return `${product.name}${colorPart}`;
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
export const REQUIRED_SPECS: readonly string[] = [];

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

/**
 * Canlı katalog. Kaynak veritabanıdır (perfume_products); kök rota her istekte
 * `replaceCatalog` ile doldurur. Senkron yardımcılar (getProduct vb.) bunu okur.
 */
export const PRODUCTS: Product[] = [];

let catalogStamp = "";

export function replaceCatalog(list: Product[], stamp: string) {
  if (stamp && stamp === catalogStamp) return;
  PRODUCTS.splice(0, PRODUCTS.length, ...list);
  catalogStamp = stamp;
}

export function catalogStampValue() {
  return catalogStamp;
}

export function catalogLoaded() {
  return catalogStamp !== "";
}

export const PRODUCT_COUNT = PRODUCTS.length;

/** Homepage wall: 21 SKUs (center first). Extra tiles hide below 768 / 1440. */
export const WALL_SKUS: readonly string[] = [];

export { FREE_SHIPPING_FROM, SHIPPING_FEE } from "./commerce.ts";

const SLUG_TO_SKU: Record<string, string> = {};

export function getProduct(id: string) {
  const key = decodeURIComponent(id).trim();
  const aliased = SLUG_TO_SKU[key.toLowerCase()];
  if (aliased) return PRODUCTS.find((p) => p.sku === aliased);
  return (
    PRODUCTS.find((p) => p.sku === key) ??
    PRODUCTS.find((p) => productSlug(p) === key.toLowerCase())
  );
}

/** Sepetteki varyant etiketi. Parfümde varyant = hacim ("50ml" → "50 ml"). */
export function getColor(id: ColorId): ColorOption | undefined {
  const color = COLORS.find((c) => c.id === id);
  if (color) return color;
  return id ? { id, name: sizeLabel(id), swatch: "transparent" } : undefined;
}

export function productSizes(p: Product): SizeOption[] {
  return p.sizes?.length ? p.sizes : [{ id: "tek", ml: 0, price: p.price }];
}

export function defaultSizeId(p: Product) {
  const sizes = productSizes(p);
  const full = sizes.filter((s) => !s.sample && s.stockStatus !== "tukendi");
  return (full[0] ?? sizes[0]).id;
}

/** Varyant fiyatı; bilinmeyen varyant için undefined. */
export function unitPrice(sku: string, variant: string) {
  const p = getProduct(sku);
  if (!p) return undefined;
  const size = productSizes(p).find((s) => s.id === variant);
  return size && size.stockStatus !== "tukendi" ? size.price : undefined;
}

export function minPrice(p: Product) {
  return Math.min(...productSizes(p).map((s) => s.price));
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id);
}

export const COLOR_WASH_HINT = "";

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

const JOB_EXPAND: Record<string, string[]> = {};

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
      p.brand ?? "",
      p.gender ?? "",
      p.concentration ?? "",
      (p.families ?? []).join(" "),
      p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(" ") : "",
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

export function similarityScore(current: Product, other: Product) {
  let score = 0;
  if (other.category === current.category) score += 6;
  if (current.brand && other.brand === current.brand) score += 3;
  for (const family of current.families ?? []) if (other.families?.includes(family)) score += 4;
  if (current.series && other.series === current.series) score += 5;
  const notes = new Set(allNotes(current).map((note) => foldTr(note)));
  for (const note of allNotes(other)) if (notes.has(foldTr(note))) score += 7;
  const tokens = foldTr(`${current.name} ${current.tagline}`)
    .split(/\s+/)
    .filter((word) => word.length > 3);
  const hay = foldTr(`${other.name} ${other.tagline} ${other.features.join(" ")}`);
  for (const token of tokens) if (hay.includes(token)) score += 2;
  return score;
}

export function relatedProducts(sku: string, limit = 4) {
  const current = getProduct(sku);
  if (!current) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((product) => product.sku !== current.sku)
    .map((product) => ({ product, score: similarityScore(current, product) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.product);
}

export function allNotes(p: Product) {
  return p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : [];
}

/** Katalogdaki markalar (ad, slug, ürün sayısı), alfabetik. */
export function brandList() {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of PRODUCTS) {
    if (!p.brand) continue;
    const slug = slugify(p.brand);
    const row = map.get(slug) ?? { slug, name: p.brand, count: 0 };
    row.count += 1;
    map.set(slug, row);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

export function productsByBrand(slug: string) {
  return PRODUCTS.filter((p) => p.brand && slugify(p.brand) === slug);
}

/** Katalogdaki notalar (ad, slug, ürün sayısı), çoktan aza. */
export function noteList() {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of PRODUCTS) {
    for (const n of new Set(allNotes(p))) {
      const slug = slugify(n);
      const row = map.get(slug) ?? { slug, name: n, count: 0 };
      row.count += 1;
      map.set(slug, row);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "tr"));
}

export function productsByNote(slug: string) {
  return PRODUCTS.filter((p) => allNotes(p).some((n) => slugify(n) === slug));
}
