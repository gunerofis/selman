import { fetchPrintProductRows, getSupabaseConfig } from "./supabase-server";
import { rowToPrintProduct, seedPrintProducts, type PrintProduct } from "./print-products";

export async function getPublicPrintProducts(): Promise<PrintProduct[]> {
  const fallback = seedPrintProducts.filter((product) => product.isPublished);
  const config = getSupabaseConfig();
  if (!config) return fallback;
  try {
    const rows = await fetchPrintProductRows(config, false);
    return rows.map(rowToPrintProduct);
  } catch {
    return fallback;
  }
}
