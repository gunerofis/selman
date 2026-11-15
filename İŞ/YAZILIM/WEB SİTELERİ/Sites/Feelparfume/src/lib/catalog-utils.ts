import { PRODUCTS, type Product, type CategoryId, type SeriesId } from "./products";
import { findDuplicateSlugs, findDuplicateSkus, findProductsMissingSpecs, countActiveProducts, buildBreadcrumb, getProductCanonicalUrl } from "./products";

/** Tek kaynak: aktif ürünler */
export const ACTIVE_PRODUCTS = PRODUCTS.filter((p) => p.stockStatus !== "tukendi");

/** Kategori bazlı aktif sayaç */
export function getActiveCountByCategory(category: CategoryId): number {
  return ACTIVE_PRODUCTS.filter((p) => p.category === category).length;
}

/** Seri bazlı aktif sayaç */
export function getActiveCountBySeries(series: SeriesId): number {
  return ACTIVE_PRODUCTS.filter((p) => p.series === series).length;
}

/** Tüm aktif sayaç */
export function getTotalActiveCount(): number {
  return ACTIVE_PRODUCTS.length;
}

/** Çakışan slug/SKU raporu */
export function getDuplicateReport() {
  return {
    slugs: findDuplicateSlugs(PRODUCTS),
    skus: findDuplicateSkus(PRODUCTS),
  };
}

/** Eksik spec raporu */
export function getMissingSpecsReport() {
  return findProductsMissingSpecs(PRODUCTS);
}

/** Kategori→Ürün map (filtre/breadcrumb için) */
export function getCategoryProductMap(): Map<CategoryId, Product[]> {
  const map = new Map<CategoryId, Product[]>();
  for (const p of ACTIVE_PRODUCTS) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return map;
}

/** Seri→Ürün map */
export function getSeriesProductMap(): Map<SeriesId, Product[]> {
  const map = new Map<SeriesId, Product[]>();
  for (const p of ACTIVE_PRODUCTS) {
    if (p.series) {
      if (!map.has(p.series)) map.set(p.series, []);
      map.get(p.series)!.push(p);
    }
  }
  return map;
}

/** URL → Ürün reverse lookup (canonical için) */
export const PRODUCT_BY_SLUG: Map<string, Product> = new Map(
  ACTIVE_PRODUCTS.map((p) => [p.sku.toLowerCase(), p])
);

/** Kategori breadcrumb zinciri */
export function getCategoryBreadcrumb(categoryId: string) {
  return [
    { label: "Ana Sayfa", href: "/" },
    { label: "Kategori", href: "/kategori" },
    { label: categoryId, href: `/kategori/${categoryId}` },
  ];
}

export { 
  buildBreadcrumb, 
  getProductCanonicalUrl, 
  countActiveProducts,
  findDuplicateSlugs,
  findDuplicateSkus,
  findProductsMissingSpecs,
} from "./products";
