import { ensureCatalogSeeded, getD1OrNull, getProducts, getSettings, type StoreProduct } from "./store";
import { ensureCommerceTables } from "./commerce";

export type AdminOrder = { id: string; orderNumber: string; status: string; paymentStatus: string; customerName: string; email: string; phone: string; city: string; district: string; address: string; notes: string; subtotalCents: number; discountCents: number; couponCode: string; totalCents: number; createdAt: number; items: Array<{ productName: string; sku: string; quantity: number; unitPriceCents: number }> };
export type DiscountCodeRow = { id: number; code: string; name: string; discountType: string; discountValue: number; minOrderCents: number; maxUses: number | null; usedCount: number; startsAt: number; endsAt: number; active: boolean };
export type CampaignRow = { id: number; name: string; occasion: string; discountType: string; discountValue: number; startsAt: number; endsAt: number; reminderDays: number; active: boolean; appliedAt: number | null };
export type AdminUserRow = { email: string; role: string; active: boolean };
export type ScriptRow = { id: number; name: string; placement: string; code: string; active: boolean };
export type ModuleRow = { id: number; name: string; moduleKey: string; configJson: string; active: boolean };
export type AuditRow = { id: number; adminEmail: string; action: string; entityType: string; entityId: string; createdAt: number };
export type AdminSnapshot = { generatedAt: number; products: StoreProduct[]; orders: AdminOrder[]; settings: Record<string, string>; discountCodes: DiscountCodeRow[]; campaigns: CampaignRow[]; users: AdminUserRow[]; scripts: ScriptRow[]; modules: ModuleRow[]; audit: AuditRow[] };

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const generatedAt = Date.now();
  const db = getD1OrNull();
  if (!db) return { generatedAt, products: await getProducts({ includeInactive: true }), orders: [], settings: await getSettings(), discountCodes: [], campaigns: [], users: [], scripts: [], modules: [], audit: [] };
  try {
    await ensureCatalogSeeded(db);
    await ensureCommerceTables(db);
    const [products, settings, orderRows, itemRows, discounts, campaigns, users, scripts, modules, audit] = await Promise.all([
      getProducts({ includeInactive: true }), getSettings(),
      db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 250").all<Record<string, unknown>>(),
      db.prepare("SELECT order_id, product_name, sku, quantity, unit_price_cents FROM order_items ORDER BY id ASC").all<Record<string, unknown>>(),
      db.prepare("SELECT * FROM discount_codes ORDER BY active DESC, created_at DESC").all<Record<string, unknown>>(),
      db.prepare("SELECT * FROM campaigns ORDER BY starts_at ASC").all<Record<string, unknown>>(),
      db.prepare("SELECT email, role, active FROM admin_users ORDER BY role, email").all<Record<string, unknown>>(),
      db.prepare("SELECT id, name, placement, code, active FROM custom_scripts ORDER BY id DESC").all<Record<string, unknown>>(),
      db.prepare("SELECT id, name, module_key, config_json, active FROM modules ORDER BY id DESC").all<Record<string, unknown>>(),
      db.prepare("SELECT id, admin_email, action, entity_type, entity_id, created_at FROM audit_log ORDER BY id DESC LIMIT 100").all<Record<string, unknown>>(),
    ]);
    const orders = orderRows.results.map((row) => ({ id: String(row.id), orderNumber: String(row.order_number), status: String(row.status), paymentStatus: String(row.payment_status), customerName: String(row.customer_name), email: String(row.email), phone: String(row.phone), city: String(row.city), district: String(row.district), address: String(row.address), notes: String(row.notes || ""), subtotalCents: Number(row.subtotal_cents), discountCents: Number(row.discount_cents || 0), couponCode: String(row.coupon_code || ""), totalCents: Number(row.total_cents), createdAt: Number(row.created_at), items: itemRows.results.filter((item) => item.order_id === row.id).map((item) => ({ productName: String(item.product_name), sku: String(item.sku), quantity: Number(item.quantity), unitPriceCents: Number(item.unit_price_cents) })) }));
    return { generatedAt, products, orders, settings, discountCodes: discounts.results.map((row) => ({ id: Number(row.id), code: String(row.code), name: String(row.name), discountType: String(row.discount_type), discountValue: Number(row.discount_value), minOrderCents: Number(row.min_order_cents), maxUses: row.max_uses == null ? null : Number(row.max_uses), usedCount: Number(row.used_count), startsAt: Number(row.starts_at), endsAt: Number(row.ends_at), active: Boolean(row.active) })), campaigns: campaigns.results.map((row) => ({ id: Number(row.id), name: String(row.name), occasion: String(row.occasion), discountType: String(row.discount_type), discountValue: Number(row.discount_value), startsAt: Number(row.starts_at), endsAt: Number(row.ends_at), reminderDays: Number(row.reminder_days), active: Boolean(row.active), appliedAt: row.applied_at == null ? null : Number(row.applied_at) })), users: users.results.map((row) => ({ email: String(row.email), role: String(row.role), active: Boolean(row.active) })), scripts: scripts.results.map((row) => ({ id: Number(row.id), name: String(row.name), placement: String(row.placement), code: String(row.code), active: Boolean(row.active) })), modules: modules.results.map((row) => ({ id: Number(row.id), name: String(row.name), moduleKey: String(row.module_key), configJson: String(row.config_json), active: Boolean(row.active) })), audit: audit.results.map((row) => ({ id: Number(row.id), adminEmail: String(row.admin_email), action: String(row.action), entityType: String(row.entity_type), entityId: String(row.entity_id), createdAt: Number(row.created_at) })) };
  } catch {
    return { generatedAt, products: await getProducts({ includeInactive: true }), orders: [], settings: await getSettings(), discountCodes: [], campaigns: [], users: [], scripts: [], modules: [], audit: [] };
  }
}
