import { NextResponse } from "next/server";
import { rowToPrintProduct } from "../../../../lib/print-products";
import { notifyIndexNow } from "../../../../lib/indexnow";
import {
  fetchPrintProductRows,
  canAdminWrite,
  logAdminAction,
  requireAdmin,
  validatePrintProductPayload,
  writePrintProduct,
} from "../../../../lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  try {
    const rows = await fetchPrintProductRows(auth.config, true, auth.accessToken);
    return NextResponse.json({ products: rows.map(rowToPrintProduct) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "3D ürünleri alınamadı. Güncel veritabanı şemasını kontrol edin." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const parsed = validatePrintProductPayload(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 });
  try {
    const row = await writePrintProduct(auth.config, "PATCH", parsed.value, parsed.value.id, auth.accessToken);
    const product = row ? rowToPrintProduct(row) : null;
    if (product) await notifyIndexNow(["/3d-baski", "/sitemap.xml", `/3d-baski/${product.sku.toLowerCase()}`]);
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, "update", "print_product", parsed.value.id, parsed.value.name);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "3D ürün güncellenemedi." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const parsed = validatePrintProductPayload(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.message }, { status: 400 });
  try {
    const row = await writePrintProduct(auth.config, "POST", parsed.value, parsed.value.id, auth.accessToken);
    const product = row ? rowToPrintProduct(row) : null;
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, "create", "print_product", parsed.value.id, parsed.value.name);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "3D ürün eklenemedi. Kod ve kimlik benzersiz olmalıdır." }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Geçersiz ürün kimliği." }, { status: 400 });
  try {
    await writePrintProduct(auth.config, "DELETE", null, id, auth.accessToken);
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, "delete", "print_product", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "3D ürün silinemedi." }, { status: 502 });
  }
}
