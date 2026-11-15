import { NextResponse } from "next/server";
import { rowToProduct } from "../../../../../lib/products";
import { payloadToRow, requireAdmin, queryData, validateProductPayload } from "../../../../../lib/data-server";
import { notifyIndexNow } from "../../../../../lib/indexnow";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const body = await request.json().catch(() => null) as { products?: unknown[] } | null;
  if (!Array.isArray(body?.products) || body.products.length === 0 || body.products.length > 500) return NextResponse.json({ error: "Tek seferde 1–500 ürün aktarabilirsiniz." }, { status: 400 });
  const valid: Array<ReturnType<typeof payloadToRow>> = [];
  const errors: Array<{ row: number; message: string }> = [];
  body.products.forEach((item, index) => {
    const parsed = validateProductPayload(item);
    if (parsed.ok) valid.push(payloadToRow(parsed.value));
    else errors.push({ row: index + 2, message: parsed.message });
  });
  if (errors.length) return NextResponse.json({ error: "Bazı satırlarda hata var.", errors }, { status: 400 });
  try {
    const rows = await queryData<Array<never>>(auth.config, "/rest/v1/products?on_conflict=sku", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(valid),
    }, auth.accessToken);
    await notifyIndexNow(["/", "/sitemap.xml", ...rows.map((row) => `/urun/${String((row as { sku?: string }).sku ?? "").toLowerCase()}`).filter((path) => !path.endsWith("/"))]);
    return NextResponse.json({ products: rows.map(rowToProduct), count: rows.length });
  } catch {
    return NextResponse.json({ error: "Toplu ürün aktarımı tamamlanamadı." }, { status: 502 });
  }
}
