import { NextResponse } from "next/server";
import { getDataConfig, queryData } from "../../../lib/data-server";
import { isRateLimited } from "../../../lib/rate-limit";

export const dynamic = "force-dynamic";

type QuoteItem = { productId: number; sku: string; name: string; pack: string; quantity: number };

export async function POST(request: Request) {
  if (await isRateLimited(request, "quote", 10, 10 * 60_000)) return NextResponse.json({ error: "Çok fazla teklif denemesi yapıldı. Lütfen biraz sonra tekrar deneyin." }, { status: 429 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Geçersiz teklif verisi." }, { status: 400 });
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ accepted: true }, { status: 202 });
  if (body.consent !== true) return NextResponse.json({ error: "Aydınlatma metni onayı zorunludur." }, { status: 400 });
  const sourceItems = Array.isArray(body.items) ? body.items : [];
  const items = sourceItems.slice(0, 100).map((item) => {
    const value = item as Record<string, unknown>;
    return {
      productId: Number(value.productId),
      sku: String(value.sku ?? "").trim().slice(0, 40),
      name: String(value.name ?? "").trim().slice(0, 160),
      pack: String(value.pack ?? "").trim().slice(0, 120),
      quantity: Math.floor(Number(value.quantity)),
    } satisfies QuoteItem;
  }).filter((item) => Number.isInteger(item.productId) && item.productId > 0 && item.sku && item.name && item.pack && item.quantity > 0 && item.quantity <= 999);
  if (items.length === 0 || items.length !== sourceItems.length) return NextResponse.json({ error: "Teklif listenizde geçerli ürün bulunamadı." }, { status: 400 });
  const customerName = typeof body.customerName === "string" ? body.customerName.trim().slice(0, 120) : "";
  const companyName = typeof body.companyName === "string" ? body.companyName.trim().slice(0, 160) : "";
  let phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "").slice(0, 16) : "";
  if (phone.startsWith("0") && phone.length === 11) phone = `90${phone.slice(1)}`;
  else if (phone.length === 10) phone = `90${phone}`;
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
  const config = getDataConfig();
  if (!config) return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  try {
    const ids = items.map((item) => item.productId).join(",");
    const catalogRows = await queryData<Array<{ id: number; sku: string; name: string; pack: string; is_published: boolean }>>(config, `/rest/v1/products?select=id,sku,name,pack,is_published&id=in.(${ids})&is_published=eq.true`);
    const canonicalItems = items.map((item) => {
      const catalogProduct = catalogRows.find((product) => Number(product.id) === item.productId);
      return catalogProduct ? { ...item, sku: catalogProduct.sku, name: catalogProduct.name, pack: catalogProduct.pack } : null;
    }).filter((item): item is QuoteItem => item !== null);
    if (canonicalItems.length !== items.length) return NextResponse.json({ error: "Teklif listenizde artık yayında olmayan bir ürün var." }, { status: 409 });
    const quoteRows = await queryData<Array<{ id: number; reference: string }>>(config, "/rest/v1/rpc/create_catalog_quote", {
      method: "POST",
      body: JSON.stringify({
        p_customer_name: customerName,
        p_company_name: companyName,
        p_phone: phone,
        p_note: note,
        p_items: canonicalItems,
      }),
    });
    const quote = quoteRows[0];
    if (!quote) throw new Error("quote_not_created");
    return NextResponse.json({ accepted: true, stored: true, reference: quote.reference }, { status: 201 });
  } catch {
    return NextResponse.json({ accepted: true, stored: false }, { status: 202 });
  }
}
