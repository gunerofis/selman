import { PRODUCTS as BASE_PRODUCTS, CATEGORIES, type Product } from "./products";
import { LINES, type LineDef, type LineItem } from "./line-items";

export type UnifiedProduct = Omit<Product, "category" | "series"> & {
  category: string;
  series?: string;
};

/** Tek katalog: products.ts (PRODUCTS) + line-items.ts (LINES). */
function lineItemToProduct(item: LineItem, line: LineDef): UnifiedProduct {
  const sku = item.code || item.id;
  return {
    sku,
    name: item.name,
    shortName: item.name.split("·")[0]?.trim() || item.name,
    category: line.key,
    series: line.key,
    price: item.price ?? 0,
    image: item.image,
    tagline: item.note || "",
    description: item.teklifNot || "",
    features: item.tags || [],
    specs: item.details?.map((d) => ({ label: d.label, value: d.value })) ?? [],
    stockStatus: "stokta",
    featured: false,
  };
}

export const UNIFIED_PRODUCTS: UnifiedProduct[] = [
  ...BASE_PRODUCTS.map((p) => ({ ...p, stockStatus: p.stockStatus ?? "stokta" })),
  ...LINES.flatMap((line) => line.items.map((item) => lineItemToProduct(item, line))),
];

export const ACTIVE_UNIFIED_PRODUCTS = UNIFIED_PRODUCTS.filter((p) => p.stockStatus !== "tukendi");

export const UNIFIED_CATEGORIES: Array<{ id: string; name: string; blurb: string }> = [
  ...CATEGORIES,
];

export type UnifiedCategoryId = string;

export function getUnifiedCountByCategory(category: UnifiedCategoryId): number {
  return ACTIVE_UNIFIED_PRODUCTS.filter((p) => p.category === category).length;
}

export function getTotalUnifiedCount(): number {
  return ACTIVE_UNIFIED_PRODUCTS.length;
}

export { UNIFIED_PRODUCTS as PRODUCTS };
