import { createContext, useContext, type ReactNode } from "react";
import {
  ACTIVE_UNIFIED_PRODUCTS,
  type UnifiedProduct,
  type UnifiedCategoryId,
  UNIFIED_CATEGORIES,
} from "./unified-catalog";

interface UnifiedCatalogContextValue {
  products: UnifiedProduct[];
  categories: typeof UNIFIED_CATEGORIES;
  getProductsByCategory: (category: UnifiedCategoryId) => UnifiedProduct[];
  getProductBySku: (sku: string) => UnifiedProduct | undefined;
  getProductsBySeries: (series: string) => UnifiedProduct[];
}

const UnifiedCatalogContext = createContext<UnifiedCatalogContextValue | null>(null);

export function UnifiedCatalogProvider({ children }: { children: ReactNode }) {
  const value: UnifiedCatalogContextValue = {
    products: ACTIVE_UNIFIED_PRODUCTS,
    categories: UNIFIED_CATEGORIES,
    getProductsByCategory: (category) => ACTIVE_UNIFIED_PRODUCTS.filter((p) => p.category === category),
    getProductBySku: (sku) => ACTIVE_UNIFIED_PRODUCTS.find((p) => p.sku.toLowerCase() === sku.toLowerCase()),
    getProductsBySeries: (series) => ACTIVE_UNIFIED_PRODUCTS.filter((p) => p.series === series),
  };

  return (
    <UnifiedCatalogContext.Provider value={value}>
      {children}
    </UnifiedCatalogContext.Provider>
  );
}

export function useUnifiedCatalog() {
  const ctx = useContext(UnifiedCatalogContext);
  if (!ctx) throw new Error("UnifiedCatalogProvider is missing");
  return ctx;
}

export function useProductsByCategory(category: UnifiedCatalogContextValue["categories"][number]["id"]) {
  const { getProductsByCategory } = useUnifiedCatalog();
  return getProductsByCategory(category);
}

export function useProductBySku(sku: string) {
  const { getProductBySku } = useUnifiedCatalog();
  return getProductBySku(sku);
}

export function useProductsBySeries(series: string) {
  const { getProductsBySeries } = useUnifiedCatalog();
  return getProductsBySeries(series);
}
