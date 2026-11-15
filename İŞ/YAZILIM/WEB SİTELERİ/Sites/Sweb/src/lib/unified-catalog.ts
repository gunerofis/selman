import {
  PRODUCTS as ORGANIZER_PRODUCTS,
  type Product,
  type ColorId,
  CATEGORIES,
} from "./products";
import { LINES, type LineDef, type LineItem } from "./line-items";

export type UnifiedProduct = Omit<Product, "category" | "series"> & {
  category: string;
  series?: string;
};

/** =============================================================================
 * UNIFIED PRODUCT CATALOG - Tek Veri Kaynağı (P1/A1)
 * products.ts (PRODUCTS) + line-items.ts (LINES) birleştirildi
 * Tüm sayfalar (koleksiyon, organizer, ofis, saat-mucevher, hediye-setleri) buradan beslenir
 * ============================================================================= */

/** LineItem'ı Product tipine dönüştür */
function lineItemToProduct(item: LineItem, line: LineDef): UnifiedProduct {
  const categoryMap: Record<LineDef["key"], string> = {
    clik: "saat-mucevher",
    slac: "hediye-setleri", 
    desq: "ofis",
    sweb: "organizer",
  };

  const seriesMap: Record<LineDef["key"], string> = {
    clik: "saat-mucevher",
    slac: "hediye-setleri",
    desq: "ofis",
    sweb: "organizer",
  };

  const colorMap: Record<string, ColorId> = {
    espresso: "espresso",
    siyah: "siyah",
    krem: "krem",
    lacivert: "lacivert",
    gri: "gri",
    beyaz: "beyaz",
    taba: "taba",
    bordo: "bordo",
  };

  // SKU normalize
  const sku = item.code || item.id;
  const category = categoryMap[line.key] || "organizer";

  // Specs oluştur
  const specs = item.details?.map((d) => ({ label: d.label, value: d.value })) ?? [];

  // Stok durumu - note'dan çıkar veya varsayılan
  let stockStatus: Product["stockStatus"] = "siparisle-uretilir";
  if (item.note?.includes("Stokta")) stockStatus = "stokta";
  else if (item.note?.includes("Tükendi")) stockStatus = "tukendi";

  // Varyantlar
  const variants: Product["variants"] = item.filterTags?.map((tag) => ({
    id: tag,
    sku: `${sku}-${tag}`,
    stockStatus: "siparisle-uretilir" as const,
  }));

  return {
    sku,
    name: item.name,
    shortName: item.name.split("·")[0]?.trim() || item.name,
    category,
    series: seriesMap[line.key],
    price: item.price ?? 0,
    image: item.image,
    tagline: item.note || "",
    description: item.teklifNot || "",
    features: item.tags || [],
    specs,
    stockStatus,
    variants,
    featured: false,
  };
}

/** Tüm LineItem'ları Product'a çevir */
function allLineProducts(): UnifiedProduct[] {
  const products: UnifiedProduct[] = [];
  
  for (const line of LINES) {
    for (const item of line.items) {
      products.push(lineItemToProduct(item, line));
    }
  }
  
  return products;
}

/** ORG_PRODUCTS (products.ts) zaten Product tipinde - direkt kullan */
function getOrgProducts(): UnifiedProduct[] {
  return ORGANIZER_PRODUCTS.map((p) => ({
    ...p,
    stockStatus: p.stockStatus ?? "siparisle-uretilir",
  }));
}

/** Tek birleştirilmiş katalog (P1/A1) */
export const UNIFIED_PRODUCTS: UnifiedProduct[] = [
  ...getOrgProducts(),
  ...allLineProducts(),
];

/** Aktif ürünler (stokta olmayanlar hariç) */
export const ACTIVE_UNIFIED_PRODUCTS = UNIFIED_PRODUCTS.filter(
  (p) => p.stockStatus !== "tukendi"
);

/** =============================================================================
 * TEK KATEGORİ SÖZLÜĞÜ (P1/A2)
 * Organizasyon ve Odalar aynı sistem kullanır
 * ============================================================================= */

export const UNIFIED_CATEGORIES = [
{ id: "saat-mucevher", name: "Saat & Mücevher", blurb: "Deri kaplı saat ve mücevher kutuları." }
] as const;

export type UnifiedCategoryId = (typeof UNIFIED_CATEGORIES)[number]["id"];

/** Eski kategori ID'lerini yeniye map et (breadcrumb/URL için) */
export const CATEGORY_REDIRECT_MAP: Record<string, string> = {
  "saat-mucevher-kutulari": "saat-mucevher",
  "organizer": "organizer",
  "ofis": "ofis",
  "hediye-setleri": "hediye-setleri",
  "yasam": "yasam",
  "gardrop": "gardrop",
  "banyo": "banyo",
  "mutfak": "mutfak",
  "makyaj": "makyaj",
  "giris": "giris",
  "arac": "arac",
};

/** Kanonik kategori URL'i */
export function getUnifiedCategoryUrl(categoryId: string): string {
  return `https://www.gunerofis.online/kategori/${categoryId}`;
}

/** Eski URL → Yeni kanonik URL (301 redirect için) */
export function getCategoryRedirectUrl(oldPath: string): string | null {
  for (const [oldId, newId] of Object.entries(CATEGORY_REDIRECT_MAP)) {
    if (oldPath.includes(oldId)) {
      return getUnifiedCategoryUrl(newId);
    }
  }
  return null;
}

/** =============================================================================
 * SAYAÇ TUTARLILIĞI (P1/A3) - Tek sorgudan
 * ============================================================================= */

export function getUnifiedCountByCategory(category: UnifiedCategoryId): number {
  return ACTIVE_UNIFIED_PRODUCTS.filter((p) => p.category === category).length;
}

export function getUnifiedCountBySeries(series: string): number {
  return ACTIVE_UNIFIED_PRODUCTS.filter((p) => p.series === series).length;
}

export function getTotalUnifiedCount(): number {
  return ACTIVE_UNIFIED_PRODUCTS.length;
}

/** =============================================================================
 * PARALEL URL → TEK KANONİK URL + 301 REDIRECT (P1/A4)
 * ============================================================================= */

/** Eski ürün URL pattern'leri */
const OLD_PRODUCT_PATTERNS = [
  { pattern: /^\/urun\/([^/]+)$/, newPath: (sku: string) => `/urun/${sku.toLowerCase()}` },
  { pattern: /^\/organizer\/([^/]+)$/, newPath: (slug: string) => `/urun/${slug.toLowerCase()}` },
  { pattern: /^\/ofis\/([^/]+)$/, newPath: (slug: string) => `/urun/${slug.toLowerCase()}` },
  { pattern: /^\/saat-mucevher-kutulari\/([^/]+)$/, newPath: (code: string) => `/urun/${code.toLowerCase()}` },
  { pattern: /^\/hediye-setleri\/([^/]+)$/, newPath: (slug: string) => `/urun/${slug.toLowerCase()}` },
  { pattern: /^\/koleksiyon\?.*$/, newPath: () => `/koleksiyon` },
];

/** Eski URL → Kanonik URL (301 için) */
export function getCanonicalProductUrl(oldPath: string): string | null {
  for (const { pattern, newPath } of OLD_PRODUCT_PATTERNS) {
    const match = oldPath.match(pattern);
    if (match) {
      return `https://www.gunerofis.online${newPath(match[1])}`;
    }
  }
  return null;
}

/** Kategori canonical URL */
export function getCategoryCanonicalUrl(categoryId: UnifiedCategoryId): string {
  return `https://www.gunerofis.online/kategori/${categoryId}`;
}

/** Ürün canonical URL */
export function getProductCanonicalUrl(product: UnifiedProduct): string {
  return `https://www.gunerofis.online/urun/${product.sku.toLowerCase()}`;
}

/** 301 Redirect kuralları (middleware/Worker için) */
export const REDIRECT_RULES = [
  // Eski kategori yolları
  { from: "/saat-mucevher-kutulari", to: "/kategori/saat-mucevher", status: 301 },
  { from: "/saat-mucevher-kutulari/", to: "/kategori/saat-mucevher", status: 301 },
  { from: "/koleksiyon", to: "/koleksiyon", status: 301 }, // zaten kanonik
  { from: "/organizer", to: "/kategori/organizer", status: 301 },
  { from: "/organizer/", to: "/kategori/organizer", status: 301 },
  { from: "/ofis", to: "/kategori/ofis", status: 301 },
  { from: "/ofis/", to: "/kategori/ofis", status: 301 },
  { from: "/hediye-setleri", to: "/kategori/hediye-setleri", status: 301 },
  { from: "/hediye-setleri/", to: "/kategori/hediye-setleri", status: 301 },
  
  // Eski ürün yolları (pattern-based - middleware'de handle edilir)
  // /urun/* zaten kanonik
  // /organizer/* → /urun/*
  // /ofis/* → /urun/*
  // /saat-mucevher-kutulari/* → /urun/*
  // /hediye-setleri/* → /urun/*
];

/** Middleware/Worker için redirect fonksiyonu */
export function getRedirectResponse(request: Request): Response | null {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Kategori redirect'leri
  for (const rule of REDIRECT_RULES) {
    if (pathname === rule.from || pathname.startsWith(rule.from + "/")) {
      const newPath = rule.to;
      return Response.redirect(new URL(newPath, url.origin), rule.status);
    }
  }

  // Ürün pattern redirect'leri
  const productCanonical = getCanonicalProductUrl(pathname);
  if (productCanonical) {
    return Response.redirect(productCanonical, 301);
  }

  // Kategori pattern redirect'leri
  const categoryCanonical = getCategoryRedirectUrl(pathname);
  if (categoryCanonical) {
    return Response.redirect(categoryCanonical, 301);
  }

  return null;
}

export { UNIFIED_PRODUCTS as PRODUCTS };
