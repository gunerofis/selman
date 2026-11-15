CREATE TABLE "quotes" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "reference" TEXT NOT NULL UNIQUE,
  "customer_name" TEXT,
  "company_name" TEXT,
  "phone" TEXT,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "total_lines" INTEGER NOT NULL DEFAULT 0,
  "total_packages" INTEGER NOT NULL DEFAULT 0,
  "source" TEXT NOT NULL DEFAULT 'catalog',
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "internal_note" TEXT
);

CREATE TABLE "products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "sku" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "pack" TEXT NOT NULL,
  "description" TEXT,
  "price" REAL CHECK ("price" IS NULL OR "price">=0),
  "cost_price" REAL CHECK ("cost_price" IS NULL OR "cost_price">=0),
  "stock" INTEGER NOT NULL DEFAULT 0 CHECK ("stock" IS NULL OR "stock">=0),
  "barcode" TEXT,
  "min_order_packages" INTEGER NOT NULL DEFAULT 1 CHECK ("min_order_packages" IS NULL OR "min_order_packages">=0),
  "low_stock_threshold" INTEGER NOT NULL DEFAULT 5 CHECK ("low_stock_threshold" IS NULL OR "low_stock_threshold">=0),
  "supplier" TEXT,
  "image_url" TEXT,
  "gallery" TEXT NOT NULL DEFAULT '[]' CHECK (json_valid("gallery")),
  "is_price_visible" INTEGER NOT NULL DEFAULT 0 CHECK ("is_price_visible" IN (0,1)),
  "is_published" INTEGER NOT NULL DEFAULT 1 CHECK ("is_published" IN (0,1)),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "age_group" TEXT,
  "conformity_declaration" TEXT,
  "product_dimensions" TEXT,
  "carton_dimensions" TEXT,
  "carton_desi" REAL CHECK ("carton_desi" IS NULL OR "carton_desi">=0),
  "carton_weight_kg" REAL CHECK ("carton_weight_kg" IS NULL OR "carton_weight_kg">=0),
  "origin_country" TEXT,
  "safety_note" TEXT,
  "license_note" TEXT
);

CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "short_description" TEXT NOT NULL DEFAULT '',
  "description" TEXT NOT NULL DEFAULT '',
  "guides" TEXT NOT NULL DEFAULT '[]' CHECK (json_valid("guides")),
  "is_visible" INTEGER NOT NULL DEFAULT 1 CHECK ("is_visible" IN (0,1)),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "admin_users" (
  "email" TEXT PRIMARY KEY,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "display_name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('developer','owner','editor','viewer')),
  "is_active" INTEGER NOT NULL DEFAULT 1 CHECK ("is_active" IN (0,1)),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "created_by" TEXT,
  "session_valid_after" TEXT NOT NULL DEFAULT '1970-01-01T00:00:00Z'
);

CREATE TABLE "quote_items" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "quote_id" INTEGER NOT NULL,
  "product_id" INTEGER,
  "sku" TEXT NOT NULL,
  "product_name" TEXT NOT NULL,
  "pack" TEXT NOT NULL,
  "package_quantity" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE "content_pages" (
  "slug" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "kicker" TEXT NOT NULL DEFAULT '',
  "summary" TEXT NOT NULL DEFAULT '',
  "sections" TEXT NOT NULL DEFAULT '[]' CHECK (json_valid("sections")),
  "seo_title" TEXT,
  "seo_description" TEXT,
  "is_published" INTEGER NOT NULL DEFAULT 1 CHECK ("is_published" IN (0,1)),
  "updated_by" TEXT,
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "site_settings" (
  "key" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "group_name" TEXT NOT NULL DEFAULT 'general',
  "value" TEXT NOT NULL DEFAULT 'null' CHECK (json_valid("value")),
  "is_public" INTEGER NOT NULL DEFAULT 0 CHECK ("is_public" IN (0,1)),
  "updated_by" TEXT,
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "print_products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "sku" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "group_name" TEXT NOT NULL,
  "viral_strength" INTEGER NOT NULL DEFAULT 3,
  "machine_fit" TEXT NOT NULL DEFAULT 'A',
  "details" TEXT NOT NULL,
  "production_minutes_min" INTEGER NOT NULL,
  "production_minutes_max" INTEGER NOT NULL,
  "base_unit_price" REAL NOT NULL,
  "min_order_quantity" INTEGER NOT NULL DEFAULT 1,
  "material" TEXT NOT NULL DEFAULT 'PLA',
  "image_key" TEXT NOT NULL DEFAULT 'flexi',
  "is_featured" INTEGER NOT NULL DEFAULT 0 CHECK ("is_featured" IN (0,1)),
  "is_published" INTEGER NOT NULL DEFAULT 1 CHECK ("is_published" IN (0,1)),
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "description" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "standard_dimensions" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "approximate_weight" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "print_method" TEXT NOT NULL DEFAULT 'FDM · DOLDURULACAK',
  "layer_height_mm" REAL NOT NULL DEFAULT 0.20,
  "infill_percent" INTEGER NOT NULL DEFAULT 15,
  "wall_count" INTEGER NOT NULL DEFAULT 3,
  "nozzle_mm" REAL NOT NULL DEFAULT 0.40,
  "supports" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "assembly" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "color_options" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "age_recommendation" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "usage_areas" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "packaging" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "license_note" TEXT NOT NULL DEFAULT 'Ticari üretim öncesi model lisansı doğrulanır.',
  "market_signal" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "popularity_rank" INTEGER,
  "quality_note" TEXT NOT NULL DEFAULT 'DOLDURULACAK',
  "gallery" TEXT NOT NULL DEFAULT '[]' CHECK (json_valid("gallery"))
);

CREATE TABLE "print_requests" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "customer_name" TEXT NOT NULL,
  "company_name" TEXT,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "model_name" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "material" TEXT,
  "color" TEXT,
  "dimensions" TEXT,
  "model_url" TEXT,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "reference" TEXT NOT NULL UNIQUE,
  "selected_product_sku" TEXT,
  "selected_product_name" TEXT,
  "estimated_price" REAL,
  "file_paths" TEXT NOT NULL DEFAULT '[]' CHECK (json_valid("file_paths")),
  "internal_note" TEXT
);

CREATE TABLE "admin_audit_logs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "actor_email" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "summary" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}' CHECK (json_valid("metadata")),
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "analytics_events" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "event_type" TEXT NOT NULL,
  "product_id" INTEGER,
  "sku" TEXT,
  "session_id" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}' CHECK (json_valid("metadata")),
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "dealer_applications" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "company_name" TEXT NOT NULL,
  "contact_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "city" TEXT,
  "district" TEXT,
  "tax_office" TEXT,
  "tax_number" TEXT,
  "business_type" TEXT,
  "monthly_volume" TEXT,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "internal_note" TEXT
);

CREATE TABLE "inventory_movements" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "product_id" INTEGER NOT NULL,
  "change" INTEGER NOT NULL,
  "stock_before" INTEGER NOT NULL,
  "stock_after" INTEGER NOT NULL,
  "reason" TEXT,
  "actor_email" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX products_lookup_0 ON "products" (is_published,sort_order,id);

CREATE INDEX products_lookup_1 ON "products" (category);

CREATE INDEX print_products_lookup_0 ON "print_products" (is_published,sort_order,id);

CREATE INDEX quotes_lookup_0 ON "quotes" (created_at);

CREATE INDEX quotes_lookup_1 ON "quotes" (status);

CREATE INDEX quote_items_lookup_0 ON "quote_items" (quote_id);

CREATE INDEX quote_items_lookup_1 ON "quote_items" (product_id);

CREATE INDEX inventory_movements_lookup_0 ON "inventory_movements" (product_id,created_at);

CREATE INDEX analytics_events_lookup_0 ON "analytics_events" (created_at,event_type);

CREATE INDEX analytics_events_lookup_1 ON "analytics_events" (sku);

CREATE INDEX admin_audit_logs_lookup_0 ON "admin_audit_logs" (created_at);

CREATE INDEX dealer_applications_lookup_0 ON "dealer_applications" (created_at);

CREATE INDEX print_requests_lookup_0 ON "print_requests" (created_at);

CREATE TABLE storage_objects (bucket_id TEXT NOT NULL, name TEXT NOT NULL, etag TEXT, size INTEGER NOT NULL, content_type TEXT NOT NULL, sha256 TEXT, PRIMARY KEY(bucket_id,name));

CREATE TABLE rate_limits (key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL); CREATE INDEX rate_limits_expiry ON rate_limits(window_start);
