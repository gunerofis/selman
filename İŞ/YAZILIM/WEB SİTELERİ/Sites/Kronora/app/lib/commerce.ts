let commerceReady: Promise<void> | null = null;

async function initializeCommerce(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS discount_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      discount_type TEXT NOT NULL DEFAULT 'percent',
      discount_value INTEGER NOT NULL DEFAULT 0,
      min_order_cents INTEGER NOT NULL DEFAULT 0,
      max_uses INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0,
      starts_at INTEGER NOT NULL DEFAULT 0,
      ends_at INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      occasion TEXT NOT NULL DEFAULT 'Özel kampanya',
      discount_type TEXT NOT NULL DEFAULT 'percent',
      discount_value INTEGER NOT NULL DEFAULT 0,
      starts_at INTEGER NOT NULL,
      ends_at INTEGER NOT NULL,
      reminder_days INTEGER NOT NULL DEFAULT 14,
      active INTEGER NOT NULL DEFAULT 1,
      applied_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_discount_codes_active_dates ON discount_codes(active, starts_at, ends_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_campaigns_active_dates ON campaigns(active, starts_at, ends_at)"),
  ]);

  const orderColumns = await db.prepare("PRAGMA table_info(orders)").all<{ name: string }>();
  const names = new Set(orderColumns.results.map((column) => column.name));
  if (!names.has("discount_cents")) await db.prepare("ALTER TABLE orders ADD COLUMN discount_cents INTEGER NOT NULL DEFAULT 0").run();
  if (!names.has("coupon_code")) await db.prepare("ALTER TABLE orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("idempotency_key")) await db.prepare("ALTER TABLE orders ADD COLUMN idempotency_key TEXT").run();
  if (!names.has("tax_number")) await db.prepare("ALTER TABLE orders ADD COLUMN tax_number TEXT NOT NULL DEFAULT ''").run();
  if (!names.has("tax_office")) await db.prepare("ALTER TABLE orders ADD COLUMN tax_office TEXT NOT NULL DEFAULT ''").run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key ON orders(idempotency_key)").run();
  await db.prepare("PRAGMA optimize").run();
}

export async function ensureCommerceTables(db: D1Database) {
  if (!commerceReady) commerceReady = initializeCommerce(db).catch((error) => { commerceReady = null; throw error; });
  return commerceReady;
}

export type DiscountResult = {
  id: number;
  code: string;
  name: string;
  discountCents: number;
  totalCents: number;
};

export async function validateDiscountCode(db: D1Database, rawCode: unknown, subtotalCents: number, now = Math.floor(Date.now() / 1000)): Promise<DiscountResult> {
  await ensureCommerceTables(db);
  const code = String(rawCode || "").trim().toLocaleUpperCase("tr-TR").replace(/\s+/g, "").slice(0, 40);
  if (!code) throw new Error("İndirim kodunu yazın.");
  const row = await db.prepare(`SELECT id, code, name, discount_type, discount_value, min_order_cents, max_uses, used_count
    FROM discount_codes
    WHERE code = ? AND active = 1 AND starts_at <= ? AND ends_at >= ?
    LIMIT 1`).bind(code, now, now).first<Record<string, unknown>>();
  if (!row) throw new Error("Bu indirim kodu geçerli değil veya kullanım tarihi sona ermiş.");
  if (row.max_uses !== null && row.max_uses !== undefined && Number(row.used_count) >= Number(row.max_uses)) throw new Error("Bu indirim kodunun kullanım limiti dolmuş.");
  if (subtotalCents < Number(row.min_order_cents || 0)) throw new Error(`Bu kod için sepet tutarı en az ${(Number(row.min_order_cents) / 100).toLocaleString("tr-TR")} TL olmalıdır.`);
  const rawDiscount = String(row.discount_type) === "fixed"
    ? Number(row.discount_value)
    : Math.floor(subtotalCents * Number(row.discount_value) / 100);
  const discountCents = Math.max(0, Math.min(subtotalCents, rawDiscount));
  if (!discountCents) throw new Error("Bu kod için geçerli bir indirim tanımlanmamış.");
  return { id: Number(row.id), code: String(row.code), name: String(row.name), discountCents, totalCents: subtotalCents - discountCents };
}
