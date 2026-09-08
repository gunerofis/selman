import { NextResponse } from "next/server";
import { canAdminWrite, logAdminAction, requireAdmin, supabaseRest } from "../../../../lib/supabase-server";
import { rowToProduct } from "../../../../lib/products";
import { notifyIndexNow } from "../../../../lib/indexnow";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!canAdminWrite(auth.user.role)) return NextResponse.json({ error: "Bu hesap yalnızca görüntüleyebilir." }, { status: 403 });
  const productId = Number(new URL(request.url).searchParams.get("productId"));
  const filter = Number.isInteger(productId) && productId > 0 ? `&product_id=eq.${productId}` : "";
  try {
    const movements = await supabaseRest(auth.config, `/rest/v1/inventory_movements?select=*,products(sku,name)&order=created_at.desc&limit=250${filter}`, {}, auth.accessToken);
    return NextResponse.json({ movements });
  } catch {
    return NextResponse.json({ error: "Stok hareketleri alınamadı. Güncel veritabanı şemasını çalıştırın." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const productId = Number(body?.productId);
  const change = Math.trunc(Number(body?.change));
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 300) : "";
  if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(change) || change === 0 || Math.abs(change) > 999999) return NextResponse.json({ error: "Geçerli bir stok değişimi girin." }, { status: 400 });
  try {
    const result = await supabaseRest<Record<string, unknown> | Array<Record<string, unknown>>>(auth.config, "/rest/v1/rpc/adjust_product_stock", {
      method: "POST",
      body: JSON.stringify({ p_product_id: productId, p_change: change, p_reason: reason || null, p_actor_email: auth.user.email }),
    }, auth.accessToken);
    const row = Array.isArray(result) ? result[0] : result;
    await logAdminAction(auth.config,auth.accessToken,auth.user.email,"stock_adjust","product",productId,`${change>0?"+":""}${change} · ${reason||"Açıklama yok"}`);
    if (row && typeof row.sku === "string") await notifyIndexNow([`/urun/${row.sku.toLowerCase()}`]);
    return NextResponse.json({ product: row ? rowToProduct(row as never) : null });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: detail.includes("insufficient_stock") ? "Stok sıfırın altına düşemez." : "Stok güncellenemedi." }, { status: 409 });
  }
}
