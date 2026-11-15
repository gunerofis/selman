import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  model: text("model").notNull().default("Saat Kutusu"),
  color: text("color").notNull().default("Siyah"),
  sku: text("sku").notNull().default(""),
  priceCents: integer("price_cents").notNull().default(0),
  oldPriceCents: integer("old_price_cents"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  trackStock: integer("track_stock", { mode: "boolean" }).notNull().default(false),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  primaryImage: text("primary_image").notNull().default(""),
  imagesJson: text("images_json").notNull().default("[]"),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  keywordsJson: text("keywords_json").notNull().default("[]"),
  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  idempotencyKey: text("idempotency_key"),
  status: text("status").notNull().default("new"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  taxNumber: text("tax_number").notNull().default(""),
  taxOffice: text("tax_office").notNull().default(""),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  couponCode: text("coupon_code").notNull().default(""),
  totalCents: integer("total_cents").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const discountCodes = sqliteTable("discount_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  discountType: text("discount_type").notNull().default("percent"),
  discountValue: integer("discount_value").notNull().default(0),
  minOrderCents: integer("min_order_cents").notNull().default(0),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  startsAt: integer("starts_at").notNull().default(0),
  endsAt: integer("ends_at").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  occasion: text("occasion").notNull().default("Özel kampanya"),
  discountType: text("discount_type").notNull().default("percent"),
  discountValue: integer("discount_value").notNull().default(0),
  startsAt: integer("starts_at").notNull(),
  endsAt: integer("ends_at").notNull(),
  reminderDays: integer("reminder_days").notNull().default(14),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  appliedAt: integer("applied_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull().references(() => orders.id),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  sku: text("sku").notNull().default(""),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  lineTotalCents: integer("line_total_cents").notNull(),
});

export const orderHistory = sqliteTable("order_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull().references(() => orders.id),
  status: text("status").notNull(),
  note: text("note").notNull().default(""),
  changedBy: text("changed_by").notNull().default("system"),
  createdAt: integer("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: integer("updated_at").notNull().default(0),
});

export const adminUsers = sqliteTable("admin_users", {
  email: text("email").primaryKey(),
  role: text("role").notNull().default("admin"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const customScripts = sqliteTable("custom_scripts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  placement: text("placement").notNull().default("body"),
  code: text("code").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const modules = sqliteTable("modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  moduleKey: text("module_key").notNull().unique(),
  configJson: text("config_json").notNull().default("{}"),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull().default(""),
  detailsJson: text("details_json").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
});
