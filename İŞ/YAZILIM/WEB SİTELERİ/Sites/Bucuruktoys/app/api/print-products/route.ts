import { NextResponse } from "next/server";
import { rowToPrintProduct, seedPrintProducts } from "../../../lib/print-products";
import { fetchPrintProductRows, getDataConfig } from "../../../lib/data-server";
import { THREE_D_PUBLIC_ENABLED } from "../../../lib/features";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!THREE_D_PUBLIC_ENABLED) return NextResponse.json({ error: "Bu bölüm geçici olarak kapalı." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  const publishedFallback = seedPrintProducts.filter((product) => product.isPublished);
  const config = getDataConfig();
  if (!config) {
    return NextResponse.json(
      { products: publishedFallback, source: "fallback" },
      { headers: { "Cache-Control": "public, max-age=60" } },
    );
  }
  try {
    const rows = await fetchPrintProductRows(config, false);
    return NextResponse.json(
      { products: rows.map(rowToPrintProduct), source: "database" },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } },
    );
  } catch {
    return NextResponse.json(
      { products: publishedFallback, source: "fallback" },
      { headers: { "Cache-Control": "public, max-age=30" } },
    );
  }
}
