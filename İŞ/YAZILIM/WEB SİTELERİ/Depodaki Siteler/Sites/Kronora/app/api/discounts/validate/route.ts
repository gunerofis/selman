import { NextResponse } from "next/server";
import { ensureCommerceTables, validateDiscountCode } from "../../../lib/commerce";
import { ensureCatalogSeeded, getD1OrNull, getProducts } from "../../../lib/store";
import { normalizeRequestedItems } from "../../../lib/order-input";
import { isSameOriginMutation } from "../../../lib/request-security";

type Payload = { code?: unknown; items?: Array<{ slug?: unknown; quantity?: unknown }> };
export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const db = getD1OrNull(); if (!db) return NextResponse.json({ error: "İndirim sistemi şu anda hazırlanıyor." }, { status: 503 });
  let body: Payload; try { body = await request.json() as Payload; } catch { return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 }); }
  const requested = normalizeRequestedItems(body.items);
  if (!requested.length) return NextResponse.json({ error: "İndirim için sepetinizde ürün olmalıdır." }, { status: 400 });
  try {
    await ensureCatalogSeeded(db); await ensureCommerceTables(db); const products = await getProducts({ includeInactive: false }); const lines = requested.map((item) => ({ item, product: products.find((product) => product.slug === item.slug) }));
    if (lines.some((line) => !line.product)) return NextResponse.json({ error: "Sepetinizde satışa kapalı bir ürün var." }, { status: 409 });
    const subtotal = lines.reduce((sum, line) => sum + line.product!.priceCents * line.item.quantity, 0); const result = await validateDiscountCode(db, body.code, subtotal); if (!result) return NextResponse.json({ error: "İndirim kodunu girin." }, { status: 400 }); return NextResponse.json(result);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "İndirim kodu doğrulanamadı." }, { status: 400 }); }
}
