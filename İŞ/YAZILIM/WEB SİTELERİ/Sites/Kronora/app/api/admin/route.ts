import { NextResponse } from "next/server";
import { getAdminApiContext, writeAudit } from "../../lib/admin-auth";
import { ensureCatalogSeeded, getD1OrNull } from "../../lib/store";
import { ensureCommerceTables } from "../../lib/commerce";
import { CONCEPT_WALL_MODEL_KEYS } from "../../lib/product-wall-concepts";
import { wallModelKey } from "../../lib/product-wall";
import { isSameOriginMutation } from "../../lib/request-security";

const text = (value: unknown, max = 2000) => String(value || "").trim().slice(0, max);
const bool = (value: unknown) => value ? 1 : 0;
const number = (value: unknown, min = 0, max = 999999999) => Math.max(min, Math.min(max, Number(value) || 0));
const developerActions = new Set(["admin.save", "admin.delete", "script.save", "script.delete", "module.save", "module.delete"]);

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const admin = await getAdminApiContext();
  if (!admin) return NextResponse.json({ error: "Yönetici erişimi gerekli." }, { status: 403 });
  let body: { action?: string; payload?: Record<string, unknown> }; try { body = await request.json(); } catch { return NextResponse.json({ error: "Geçersiz veri." }, { status: 400 }); }
  const action = text(body.action, 60); const payload = body.payload || {};
  if (developerActions.has(action) && admin.role !== "developer") return NextResponse.json({ error: "Bu işlem yalnızca geliştirici yöneticiye açıktır." }, { status: 403 });
  const db = getD1OrNull(); if (!db) return NextResponse.json({ error: "Veritabanı bağlantısı hazır değil." }, { status: 503 });
  const now = Math.floor(Date.now() / 1000);
  try {
    await ensureCatalogSeeded(db);
    await ensureCommerceTables(db);
    if (action === "products.bulkPrice") {
      const scope = ["active", "all", "model", "color"].includes(text(payload.scope, 20)) ? text(payload.scope, 20) : "active";
      const scopeValue = text(payload.scopeValue, 120), changeType = text(payload.changeType, 30), value = number(payload.value, 0, 1000000);
      if (!value || !["percent_increase", "percent_decrease", "fixed_increase", "fixed_decrease"].includes(changeType)) return NextResponse.json({ error: "Geçerli bir fiyat işlemi ve değer seçin." }, { status: 400 });
      if (changeType === "percent_decrease" && value > 95) return NextResponse.json({ error: "Toplu indirim en fazla %95 olabilir." }, { status: 400 });
      let where = "price_cents > 0", bind: unknown[] = [];
      if (scope === "active") where += " AND active = 1";
      if (scope === "model") { where += " AND model = ?"; bind = [scopeValue]; }
      if (scope === "color") { where += " AND color = ?"; bind = [scopeValue]; }
      const rows = await db.prepare(`SELECT id, price_cents FROM products WHERE ${where}`).bind(...bind).all<{ id: number; price_cents: number }>();
      if (!rows.results.length) return NextResponse.json({ error: "Seçilen kapsama uygun ürün bulunamadı." }, { status: 400 });
      const fixedCents = Math.round(value * 100);
      const statements = rows.results.map((row) => { const old = Number(row.price_cents); const delta = changeType.startsWith("percent") ? Math.round(old * value / 100) : fixedCents; const next = changeType.endsWith("decrease") ? Math.max(1, old - delta) : old + delta; const oldPrice = changeType.endsWith("decrease") ? old : null; return db.prepare("UPDATE products SET price_cents = ?, old_price_cents = ?, updated_at = ? WHERE id = ?").bind(next, oldPrice, now, row.id); });
      await db.batch(statements); await writeAudit(admin, "products.bulkPrice", "products", scopeValue || scope, { scope, changeType, value, affected: rows.results.length }); return NextResponse.json({ ok: true, affected: rows.results.length });
    }
    if (action === "discount.save") {
      const id = number(payload.id), code = text(payload.code, 40).toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9_-]/g, ""), name = text(payload.name, 120), discountType = payload.discountType === "fixed" ? "fixed" : "percent", rawValue = number(payload.discountValue, 1, 1000000), discountValue = discountType === "fixed" ? Math.round(rawValue * 100) : rawValue, minOrderCents = Math.round(number(payload.minOrder, 0, 1000000) * 100), maxUses = number(payload.maxUses, 0, 1000000) || null, startsAt = number(payload.startsAt, 0), endsAt = number(payload.endsAt, 0);
      if (!code || !name || !startsAt || endsAt <= startsAt || (discountType === "percent" && discountValue > 95)) return NextResponse.json({ error: "Kod, ad, geçerli tarihler ve indirim değeri zorunludur." }, { status: 400 });
      if (id) await db.prepare("UPDATE discount_codes SET code=?, name=?, discount_type=?, discount_value=?, min_order_cents=?, max_uses=?, starts_at=?, ends_at=?, active=?, updated_at=? WHERE id=?").bind(code, name, discountType, discountValue, minOrderCents, maxUses, startsAt, endsAt, bool(payload.active), now, id).run();
      else await db.prepare("INSERT INTO discount_codes (code,name,discount_type,discount_value,min_order_cents,max_uses,used_count,starts_at,ends_at,active,created_at,updated_at) VALUES (?,?,?,?,?,?,0,?,?,?,?,?)").bind(code, name, discountType, discountValue, minOrderCents, maxUses, startsAt, endsAt, bool(payload.active), now, now).run();
      await writeAudit(admin, id ? "discount.update" : "discount.create", "discount", code); return NextResponse.json({ ok: true });
    }
    if (action === "discount.delete") { const id = number(payload.id); await db.prepare("DELETE FROM discount_codes WHERE id=?").bind(id).run(); await writeAudit(admin, "discount.delete", "discount", String(id)); return NextResponse.json({ ok: true }); }
    if (action === "campaign.save") {
      const id = number(payload.id), name = text(payload.name, 120), occasion = text(payload.occasion, 80), discountType = payload.discountType === "fixed" ? "fixed" : "percent", rawValue = number(payload.discountValue, 1, 1000000), discountValue = discountType === "fixed" ? Math.round(rawValue * 100) : rawValue, startsAt = number(payload.startsAt, 0), endsAt = number(payload.endsAt, 0), reminderDays = number(payload.reminderDays, 1, 120);
      if (!name || !occasion || !startsAt || endsAt <= startsAt || (discountType === "percent" && discountValue > 95)) return NextResponse.json({ error: "Kampanya bilgileri ve tarihler geçerli olmalıdır." }, { status: 400 });
      if (id) await db.prepare("UPDATE campaigns SET name=?, occasion=?, discount_type=?, discount_value=?, starts_at=?, ends_at=?, reminder_days=?, active=?, updated_at=? WHERE id=?").bind(name, occasion, discountType, discountValue, startsAt, endsAt, reminderDays, bool(payload.active), now, id).run();
      else await db.prepare("INSERT INTO campaigns (name,occasion,discount_type,discount_value,starts_at,ends_at,reminder_days,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(name, occasion, discountType, discountValue, startsAt, endsAt, reminderDays, bool(payload.active), now, now).run();
      await writeAudit(admin, id ? "campaign.update" : "campaign.create", "campaign", id ? String(id) : name); return NextResponse.json({ ok: true });
    }
    if (action === "campaign.delete") { const id = number(payload.id); await db.prepare("DELETE FROM campaigns WHERE id=?").bind(id).run(); await writeAudit(admin, "campaign.delete", "campaign", String(id)); return NextResponse.json({ ok: true }); }
    if (action === "campaign.apply") {
      const id = number(payload.id); const campaign = await db.prepare("SELECT * FROM campaigns WHERE id=? AND active=1").bind(id).first<Record<string, unknown>>(); if (!campaign) return NextResponse.json({ error: "Aktif kampanya bulunamadı." }, { status: 404 });
      const rows = await db.prepare("SELECT id, price_cents FROM products WHERE active=1 AND price_cents>0").all<{ id: number; price_cents: number }>(); const type = String(campaign.discount_type), value = Number(campaign.discount_value); if (type === "percent" && value > 95) return NextResponse.json({ error: "Kampanya indirimi geçersiz." }, { status: 400 });
      const statements = rows.results.map((row) => { const delta = type === "fixed" ? value : Math.round(row.price_cents * value / 100); return db.prepare("UPDATE products SET old_price_cents=?, price_cents=?, updated_at=? WHERE id=?").bind(row.price_cents, Math.max(1, row.price_cents - delta), now, row.id); }); statements.push(db.prepare("UPDATE campaigns SET applied_at=?, updated_at=? WHERE id=?").bind(now, now, id)); await db.batch(statements); await writeAudit(admin, "campaign.apply", "campaign", String(id), { affected: rows.results.length }); return NextResponse.json({ ok: true, affected: rows.results.length });
    }
    if (action === "product.save") {
      const id = number(payload.id); const slug = text(payload.slug, 220).toLocaleLowerCase("tr-TR").replace(/[^a-z0-9ğüşöçı-]+/gi, "-").replace(/^-+|-+$/g, ""); const values = [slug, text(payload.name, 240), text(payload.model, 120), text(payload.color, 80), text(payload.sku, 100), number(payload.priceCents), payload.oldPriceCents === null ? null : number(payload.oldPriceCents), number(payload.stockQuantity, 0, 100000), bool(payload.trackStock), bool(payload.active), bool(payload.featured), text(payload.shortDescription, 1200), text(payload.description, 12000), text(payload.primaryImage, 1000), JSON.stringify(Array.isArray(payload.images) ? payload.images.map((item) => text(item, 1000)).filter(Boolean).slice(0, 20) : []), text(payload.metaTitle, 300), text(payload.metaDescription, 500), JSON.stringify(Array.isArray(payload.keywords) ? payload.keywords.map((item) => text(item, 100)).filter(Boolean).slice(0, 30) : []), now];
      if (!slug || !values[1]) return NextResponse.json({ error: "Ürün adı ve bağlantısı zorunludur." }, { status: 400 });
      if (bool(payload.active) && (!text(payload.primaryImage, 1000) || number(payload.priceCents) <= 0)) return NextResponse.json({ error: "Ürünü satışa açmak için fiyat ve ana görsel ekleyin." }, { status: 400 });
      if (id) await db.prepare("UPDATE products SET slug=?, name=?, model=?, color=?, sku=?, price_cents=?, old_price_cents=?, stock_quantity=?, track_stock=?, active=?, featured=?, short_description=?, description=?, primary_image=?, images_json=?, meta_title=?, meta_description=?, keywords_json=?, updated_at=? WHERE id=?").bind(...values, id).run();
      else await db.prepare("INSERT INTO products (slug,name,model,color,sku,price_cents,old_price_cents,stock_quantity,track_stock,active,featured,short_description,description,primary_image,images_json,meta_title,meta_description,keywords_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(...values.slice(0, 18), now, now).run();
      await writeAudit(admin, id ? "product.update" : "product.create", "product", id ? String(id) : slug); return NextResponse.json({ ok: true });
    }
    if (action === "product.delete") { const id = number(payload.id); await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run(); await writeAudit(admin, "product.delete", "product", String(id)); return NextResponse.json({ ok: true }); }
    if (action === "productWallModelOrder.save") {
      const requested = Array.isArray(payload.order) ? payload.order.map((value) => text(value, 220)).filter(Boolean) : [];
      const rows = await db.prepare("SELECT DISTINCT model FROM products WHERE active = 1 AND primary_image <> '' ORDER BY id ASC").all<{ model: string }>();
      const activeModelKeys = rows.results.map((row) => wallModelKey(String(row.model)));
      const allowedKeys = [...new Set([...activeModelKeys, ...CONCEPT_WALL_MODEL_KEYS])].slice(0, 20);
      const requestedSet = new Set(requested);
      if (requested.length !== allowedKeys.length || requestedSet.size !== requested.length || allowedKeys.some((key) => !requestedSet.has(key))) {
        return NextResponse.json({ error: "Sıra 20 modelin her birini bir kez içermelidir." }, { status: 400 });
      }
      await db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind("productWallModelOrder", JSON.stringify(requested), now).run();
      await writeAudit(admin, "productWallModelOrder.update", "settings", "productWallModelOrder", { modelCount: requested.length });
      return NextResponse.json({ ok: true });
    }
    if (action === "order.update") { const id = text(payload.id, 80), status = text(payload.status, 30), payment = text(payload.paymentStatus, 30); const allowedStatus = ["new","confirmed","preparing","shipped","completed","cancelled"], allowedPayment = ["pending","paid","refunded"]; if (!allowedStatus.includes(status) || !allowedPayment.includes(payment)) return NextResponse.json({ error: "Geçersiz sipariş durumu." }, { status: 400 }); await db.batch([db.prepare("UPDATE orders SET status = ?, payment_status = ?, updated_at = ? WHERE id = ?").bind(status, payment, now, id), db.prepare("INSERT INTO order_history (order_id, status, note, changed_by, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, status, `Ödeme: ${payment}`, admin.email, now)]); await writeAudit(admin, "order.update", "order", id, { status, payment }); return NextResponse.json({ ok: true }); }
    if (action === "settings.save") { const allowed = ["brandName","tagline","heroTitle","heroDescription","contactEmail","contactPhone","seoTitle","seoDescription","shippingNote"]; await db.batch(allowed.map((key) => db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(key, text(payload[key], key.includes("Description") ? 1200 : 300), now))); await writeAudit(admin, "settings.update", "settings"); return NextResponse.json({ ok: true }); }
    if (action === "admin.save") { const email = text(payload.email, 160).toLocaleLowerCase("tr-TR"), role = payload.role === "developer" ? "developer" : "admin"; if (!email.includes("@")) return NextResponse.json({ error: "Geçerli e-posta girin." }, { status: 400 }); await db.prepare("INSERT INTO admin_users (email, role, active, created_at, updated_at) VALUES (?, ?, 1, ?, ?) ON CONFLICT(email) DO UPDATE SET role = excluded.role, active = 1, updated_at = excluded.updated_at").bind(email, role, now, now).run(); await writeAudit(admin, "admin.save", "admin_user", email, { role }); return NextResponse.json({ ok: true }); }
    if (action === "admin.delete") { const email = text(payload.email, 160).toLocaleLowerCase("tr-TR"); if (email === admin.email.toLocaleLowerCase("tr-TR")) return NextResponse.json({ error: "Kendi erişiminizi kaldıramazsınız." }, { status: 400 }); await db.prepare("DELETE FROM admin_users WHERE lower(email) = ?").bind(email).run(); await writeAudit(admin, "admin.delete", "admin_user", email); return NextResponse.json({ ok: true }); }
    if (action === "script.save") { const name = text(payload.name, 120), placement = payload.placement === "head" ? "head" : "body", code = text(payload.code, 50000); if (!name || !code) return NextResponse.json({ error: "Script adı ve kodu zorunludur." }, { status: 400 }); await db.prepare("INSERT INTO custom_scripts (name, placement, code, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").bind(name, placement, code, bool(payload.active), now, now).run(); await writeAudit(admin, "script.create", "script", name); return NextResponse.json({ ok: true }); }
    if (action === "script.delete") { const id = number(payload.id); await db.prepare("DELETE FROM custom_scripts WHERE id = ?").bind(id).run(); await writeAudit(admin, "script.delete", "script", String(id)); return NextResponse.json({ ok: true }); }
    if (action === "module.save") { const name = text(payload.name, 120), key = text(payload.moduleKey, 120).replace(/[^a-zA-Z0-9_-]/g, ""), config = text(payload.configJson, 20000); try { JSON.parse(config); } catch { return NextResponse.json({ error: "Modül yapılandırması geçerli JSON olmalıdır." }, { status: 400 }); } await db.prepare("INSERT INTO modules (name, module_key, config_json, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(module_key) DO UPDATE SET name=excluded.name, config_json=excluded.config_json, active=excluded.active, updated_at=excluded.updated_at").bind(name, key, config, bool(payload.active), now, now).run(); await writeAudit(admin, "module.save", "module", key); return NextResponse.json({ ok: true }); }
    if (action === "module.delete") { const id = number(payload.id); await db.prepare("DELETE FROM modules WHERE id = ?").bind(id).run(); await writeAudit(admin, "module.delete", "module", String(id)); return NextResponse.json({ ok: true }); }
    return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message.includes("UNIQUE") ? "Bu bağlantı, stok kodu veya anahtar zaten kullanılıyor." : "İşlem sırasında bir sorun oluştu." }, { status: 500 }); }
}
