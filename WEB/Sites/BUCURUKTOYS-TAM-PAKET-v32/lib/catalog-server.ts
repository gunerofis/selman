import { publicSeedProducts, rowToProduct, seedProducts, toPublicCatalog, type CatalogProduct } from "./products";
import { fetchProductRows, getSupabaseConfig } from "./supabase-server";

export function mergeBootstrapCatalog(databaseProducts: CatalogProduct[]) {
  const importedCatalogIsVisible = databaseProducts.some((product) => product.id >= 36);
  if (importedCatalogIsVisible) return databaseProducts;
  const databaseBySku = new Map(databaseProducts.map((product) => [product.sku, product]));
  return seedProducts.map((product) => databaseBySku.get(product.sku) ?? product);
}

export async function getPublicProducts(): Promise<CatalogProduct[]> {
  const config = getSupabaseConfig();
  if (!config) return publicSeedProducts;
  try {
    const rows = await fetchProductRows(config, false);
    return toPublicCatalog(mergeBootstrapCatalog(rows.map(rowToProduct)));
  } catch {
    return publicSeedProducts;
  }
}
