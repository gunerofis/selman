import { publicSeedProducts, rowToProduct, toPublicCatalog, type CatalogProduct } from "./products";
import { fetchProductRows, getDataConfig } from "./data-server";

export function mergeBootstrapCatalog(databaseProducts: CatalogProduct[]) {
  return databaseProducts;
}

export async function getPublicProducts(): Promise<CatalogProduct[]> {
  const config = getDataConfig();
  if (!config) return publicSeedProducts;
  try {
    const rows = await fetchProductRows(config, false);
    return toPublicCatalog(mergeBootstrapCatalog(rows.map(rowToProduct)));
  } catch {
    return publicSeedProducts;
  }
}
