import { NextResponse } from "next/server";
import { ensureCatalogSeeded, getD1OrNull, getProducts } from "../../lib/store";
import { ensureCommerceTables, validateDiscountCode, type DiscountResult } from "../../lib/commerce";
import { digitsOnly, isValidOrderEmail, isValidOrderPhone, isValidTaxNumber, isValidTaxOffice, normalizeRequestedItems } from "../../lib/order-input";
import { isSameOriginMutation } from "../../lib/request-security";

type OrderPayload = { customerName?: unknown; email?: unknown; phone?: unknown; taxNumber?: unknown; taxOffice?: unknown; city?: unknown; district?: unknown; address?: unknown; postalCode?: unknown; notes?: unknown; couponCode?: unknown; idempotencyKey?: unknown; accepted?: unknown; items?: Array<{ slug?: unknown; quantity?: unknown }> };
const clean = (value: unknown, max = 500) => String(value || "").trim().slice(0, max);
export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const db = getD1OrNull(); if (!db) return NextResponse.json({ error: "Sipariş sistemi şu anda hazırlanıyor." }, { status: 503 });
  let body: OrderPayload; try { body = await request.json() as OrderPayload; } catch { return NextResponse.json({ error: "Geçersiz sipariş verisi." }, { status: 400 }); }
  const customerName = clean(body.customerName, 120), email = clean(body.email, 160).toLocaleLowerCase("tr-TR"), phone = clean(body.phone, 40), taxOffice = clean(body.taxOffice, 80), city = clean(body.city, 80), district = clean(body.district, 80), address = clean(body.address, 600), postalCode = clean(body.postalCode, 20), notes = clean(body.notes, 1000);
  const taxNumber = digitsOnly(clean(body.taxNumber, 20));
  const idempotencyKey = clean(body.idempotencyKey, 100) || crypto.randomUUID();
  if (!body.accepted || customerName.length < 3 || !isValidOrderEmail(email) || !city || !district || address.length < 8) return NextResponse.json({ error: "Teslimat bilgilerini eksiksiz doldurun." }, { status: 400 });
  if (!isValidOrderPhone(phone)) return NextResponse.json({ error: "Geçerli bir telefon numarası girin." }, { status: 400 });
  if (!isValidTaxNumber(taxNumber)) return NextResponse.json({ error: "Vergi numarası 10 veya 11 haneli olmalıdır." }, { status: 400 });
  if (!isValidTaxOffice(taxOffice)) return NextResponse.json({ error: "Vergi dairesini yazın." }, { status: 400 });
  const requested = normalizeRequestedItems(body.items);
  if (!requested.length || requested.length > 50) return NextResponse.json({ error: "Sepetiniz boş veya geçersiz." }, { status: 400 });
  try {
    await ensureCatalogSeeded(db); await ensureCommerceTables(db);
    const existingOrder = await db.prepare("SELECT order_number, subtotal_cents, shipping_cents, discount_cents, total_cents FROM orders WHERE idempotency_key = ? AND email = ? LIMIT 1").bind(idempotencyKey, email).first<{ order_number: string; subtotal_cents: number; shipping_cents: number; discount_cents: number; total_cents: number }>();
    if (existingOrder?.order_number) return NextResponse.json({ orderNumber: existingOrder.order_number, subtotalCents: existingOrder.subtotal_cents, shippingCents: existingOrder.shipping_cents, discountCents: existingOrder.discount_cents, totalCents: existingOrder.total_cents });
    const products = await getProducts({ includeInactive: false }); const lines = requested.map((item) => ({ item, product: products.find((product) => product.slug === item.slug) })).filter((line) => line.product);
    if (lines.length !== requested.length) return NextResponse.json({ error: "Sepetinizde satışa kapalı bir ürün var." }, { status: 409 });
    for (const line of lines) if (line.product!.trackStock && line.item.quantity > line.product!.stockQuantity) return NextResponse.json({ error: `${line.product!.name} için yeterli stok yok.` }, { status: 409 });
    const subtotal = lines.reduce((sum, line) => sum + line.product!.priceCents * line.item.quantity, 0); const now = Math.floor(Date.now() / 1000); const couponCode = clean(body.couponCode, 40); let coupon: DiscountResult | null = null;
    if (couponCode) { try { coupon = await validateDiscountCode(db, couponCode, subtotal, now); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "İndirim kodu geçersiz." }, { status: 400 }); } }
    const discount = coupon?.discountCents || 0, total = subtotal - discount; const id = crypto.randomUUID(); const orderNumber = `SK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toLocaleUpperCase("tr-TR")}`;
    const availabilityChecks = lines.map(() => "EXISTS (SELECT 1 FROM products WHERE id = ? AND active = 1 AND (track_stock = 0 OR stock_quantity >= ?))");
    const availabilityValues = lines.flatMap((line) => [line.product!.id, line.item.quantity]);
    if (coupon) {
      availabilityChecks.push("EXISTS (SELECT 1 FROM discount_codes WHERE id = ? AND active = 1 AND starts_at <= ? AND ends_at >= ? AND (max_uses IS NULL OR used_count < max_uses))");
      availabilityValues.push(coupon.id, now, now);
    }
    const guard = availabilityChecks.length ? availabilityChecks.join(" AND ") : "1 = 1";
    const statements = [
      db.prepare(`INSERT INTO orders (id, order_number, idempotency_key, status, payment_status, customer_name, email, phone, tax_number, tax_office, city, district, address, postal_code, notes, subtotal_cents, shipping_cents, discount_cents, coupon_code, total_cents, created_at, updated_at)
        SELECT ?, ?, ?, 'new', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ? WHERE ${guard}`)
        .bind(id, orderNumber, idempotencyKey, customerName, email, phone, taxNumber, taxOffice, city, district, address, postalCode, notes, subtotal, discount, coupon?.code || "", total, now, now, ...availabilityValues),
      db.prepare("INSERT INTO order_history (order_id, status, note, changed_by, created_at) SELECT ?, 'new', ?, 'customer', ? WHERE EXISTS (SELECT 1 FROM orders WHERE id = ?)").bind(id, coupon ? `Sipariş site üzerinden ${coupon.code} koduyla oluşturuldu.` : "Sipariş site üzerinden oluşturuldu.", now, id),
    ];
    if (coupon) statements.push(db.prepare("UPDATE discount_codes SET used_count=used_count+1, updated_at=? WHERE id=? AND EXISTS (SELECT 1 FROM orders WHERE id = ?)").bind(now, coupon.id, id));
    for (const line of lines) {
      const product = line.product!;
      statements.push(db.prepare("INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, unit_price_cents, line_total_cents) SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM orders WHERE id = ?)").bind(id, product.id, product.name, product.sku, line.item.quantity, product.priceCents, product.priceCents * line.item.quantity, id));
      if (product.trackStock) statements.push(db.prepare("UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = ? WHERE id = ? AND stock_quantity >= ? AND EXISTS (SELECT 1 FROM orders WHERE id = ?)").bind(line.item.quantity, now, product.id, line.item.quantity, id));
    }
    const results = await db.batch(statements);
    const created = Number((results[0].meta as { changes?: number } | undefined)?.changes || 0) > 0;
    if (!created) return NextResponse.json({ error: "Stok veya indirim kullanılabilirliği değişti. Sepetinizi yenileyip tekrar deneyin." }, { status: 409 });
    return NextResponse.json({ orderNumber, subtotalCents: subtotal, shippingCents: 0, discountCents: discount, totalCents: total });
  } catch (error) {
    console.error("Order creation failed", error);
    try {
      const existingOrder = await db.prepare("SELECT order_number, subtotal_cents, shipping_cents, discount_cents, total_cents FROM orders WHERE idempotency_key = ? AND email = ? LIMIT 1").bind(idempotencyKey, email).first<{ order_number: string; subtotal_cents: number; shipping_cents: number; discount_cents: number; total_cents: number }>();
      if (existingOrder?.order_number) return NextResponse.json({ orderNumber: existingOrder.order_number, subtotalCents: existingOrder.subtotal_cents, shippingCents: existingOrder.shipping_cents, discountCents: existingOrder.discount_cents, totalCents: existingOrder.total_cents });
    } catch { /* Return the original safe error below. */ }
    return NextResponse.json({ error: "Sipariş oluşturulurken bir sorun oluştu." }, { status: 500 });
  }
}
