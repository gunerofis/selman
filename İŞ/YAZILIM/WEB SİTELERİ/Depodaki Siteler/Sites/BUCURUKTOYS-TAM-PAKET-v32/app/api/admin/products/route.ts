import { NextResponse } from "next/server";
import { rowToProduct } from "../../../../lib/products";
import { canAdminWrite, fetchProductRows, logAdminAction, payloadToRow, requireAdmin, supabaseRest, validateProductPayload, writeProduct } from "../../../../lib/supabase-server";
import { notifyIndexNow } from "../../../../lib/indexnow";

export const dynamic = "force-dynamic";

function failure(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return failure(auth.message, auth.status);
  try {
    const rows = await fetchProductRows(auth.config, true, auth.accessToken);
    const categories = await supabaseRest(auth.config, "/rest/v1/categories?select=id,name,slug,is_visible,sort_order&order=sort_order.asc", {}, auth.accessToken);
    return NextResponse.json({ products: rows.map(rowToProduct), categories, user: auth.user }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return failure("Ürünler alınamadı. Veritabanı kurulumunu kontrol edin.", 502);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return failure(auth.message, auth.status);
  if (!canAdminWrite(auth.user.role)) return failure("Bu hesap yalnızca görüntüleyebilir.", 403);
  const parsed = validateProductPayload(await request.json().catch(() => null));
  if (!parsed.ok) return failure(parsed.message, 400);
  try {
    const row = await writeProduct(auth.config, "POST", payloadToRow(parsed.value), undefined, auth.accessToken);
    if (row) await notifyIndexNow(["/", "/sitemap.xml", `/urun/${row.sku.toLowerCase()}`]);
    if (row) await logAdminAction(auth.config, auth.accessToken, auth.user.email, "create", "product", row.id, row.name);
    return NextResponse.json({ product: row ? rowToProduct(row) : null }, { status: 201 });
  } catch {
    return failure("Ürün eklenemedi. Ürün kodunun benzersiz olduğunu kontrol edin.", 409);
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return failure(auth.message, auth.status);
  if (!canAdminWrite(auth.user.role)) return failure("Bu hesap yalnızca görüntüleyebilir.", 403);
  const body = await request.json().catch(() => null) as ({ id?: unknown } & Record<string, unknown>) | null;
  const id = Number(body?.id);
  if (!Number.isInteger(id) || id < 1) return failure("Geçersiz ürün kimliği.", 400);
  const parsed = validateProductPayload(body);
  if (!parsed.ok) return failure(parsed.message, 400);
  try {
    const row = await writeProduct(auth.config, "PATCH", payloadToRow(parsed.value), id, auth.accessToken);
    if (row) await notifyIndexNow(["/", "/sitemap.xml", `/urun/${row.sku.toLowerCase()}`]);
    if (row) await logAdminAction(auth.config, auth.accessToken, auth.user.email, "update", "product", row.id, row.name);
    return NextResponse.json({ product: row ? rowToProduct(row) : null });
  } catch {
    return failure("Ürün güncellenemedi.", 502);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return failure(auth.message, auth.status);
  if (!canAdminWrite(auth.user.role)) return failure("Bu hesap yalnızca görüntüleyebilir.", 403);
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return failure("Geçersiz ürün kimliği.", 400);
  try {
    await writeProduct(auth.config, "DELETE", null, id, auth.accessToken);
    await notifyIndexNow(["/", "/sitemap.xml"]);
    await logAdminAction(auth.config, auth.accessToken, auth.user.email, "delete", "product", id);
    return NextResponse.json({ ok: true });
  } catch {
    return failure("Ürün silinemedi.", 502);
  }
}
