import { NextResponse } from "next/server";
import { publicSeedProducts, rowToProduct, toPublicCatalog } from "../../../lib/products";
import { mergeBootstrapCatalog } from "../../../lib/catalog-server";
import { fetchProductRows, getSupabaseConfig } from "../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ products: publicSeedProducts, source: "fallback" }, { headers: { "Cache-Control": "public, max-age=60" } });
  try {
    const rows = await fetchProductRows(config, false);
    const products = toPublicCatalog(mergeBootstrapCatalog(rows.map(rowToProduct)));
    return NextResponse.json({ products, source: products.length > rows.length ? "database+bootstrap" : "database" }, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
  } catch {
    return NextResponse.json({ products: publicSeedProducts, source: "fallback" }, { headers: { "Cache-Control": "public, max-age=30" } });
  }
}
