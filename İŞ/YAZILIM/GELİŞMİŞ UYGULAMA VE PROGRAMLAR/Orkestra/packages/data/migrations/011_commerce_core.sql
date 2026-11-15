ALTER TABLE order_cache ADD COLUMN order_number TEXT;
ALTER TABLE order_cache ADD COLUMN placed_at TEXT;
ALTER TABLE order_cache ADD COLUMN processed_at TEXT;
ALTER TABLE order_cache ADD COLUMN currency TEXT NOT NULL DEFAULT 'TRY';
ALTER TABLE order_cache ADD COLUMN subtotal REAL NOT NULL DEFAULT 0;
ALTER TABLE order_cache ADD COLUMN shipping_total REAL NOT NULL DEFAULT 0;
ALTER TABLE order_cache ADD COLUMN tax_total REAL NOT NULL DEFAULT 0;
ALTER TABLE order_cache ADD COLUMN discount_total REAL NOT NULL DEFAULT 0;
ALTER TABLE order_cache ADD COLUMN grand_total REAL NOT NULL DEFAULT 0;
ALTER TABLE order_cache ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE order_cache ADD COLUMN fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled';
ALTER TABLE order_cache ADD COLUMN return_status TEXT NOT NULL DEFAULT 'none';
ALTER TABLE order_cache ADD COLUMN customer_name TEXT;
ALTER TABLE order_cache ADD COLUMN customer_email TEXT;
ALTER TABLE order_cache ADD COLUMN customer_phone TEXT;
ALTER TABLE order_cache ADD COLUMN shipping_address_json TEXT;
ALTER TABLE order_cache ADD COLUMN raw_snapshot_json TEXT;
ALTER TABLE order_cache ADD COLUMN source_updated_at TEXT;

ALTER TABLE order_lines ADD COLUMN external_variant_id TEXT;
ALTER TABLE order_lines ADD COLUMN unit_price REAL NOT NULL DEFAULT 0;
ALTER TABLE order_lines ADD COLUMN line_total REAL NOT NULL DEFAULT 0;
ALTER TABLE order_lines ADD COLUMN currency TEXT NOT NULL DEFAULT 'TRY';
ALTER TABLE order_lines ADD COLUMN raw_json TEXT;

CREATE TABLE channel_products(
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  featured_image_url TEXT,
  source_updated_at TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  raw_json TEXT,
  deleted_at TEXT,
  UNIQUE(account_id,external_id)
);
CREATE INDEX channel_products_account_updated ON channel_products(account_id,source_updated_at DESC);

CREATE TABLE channel_variants(
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  channel_product_id TEXT NOT NULL REFERENCES channel_products(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  sku TEXT,
  barcode TEXT,
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'TRY',
  inventory_quantity REAL,
  inventory_tracked INTEGER NOT NULL DEFAULT 0,
  options_json TEXT NOT NULL DEFAULT '[]',
  source_updated_at TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  raw_json TEXT,
  deleted_at TEXT,
  UNIQUE(account_id,external_id)
);
CREATE INDEX channel_variants_account_sku ON channel_variants(account_id,sku);
CREATE INDEX channel_variants_product ON channel_variants(channel_product_id);

CREATE TABLE channel_inventory_levels(
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  channel_variant_id TEXT NOT NULL REFERENCES channel_variants(id) ON DELETE CASCADE,
  external_location_id TEXT NOT NULL,
  location_name TEXT,
  available REAL,
  on_hand REAL,
  committed REAL,
  source_updated_at TEXT,
  captured_at TEXT NOT NULL,
  UNIQUE(account_id,channel_variant_id,external_location_id)
);
CREATE INDEX channel_inventory_account_location ON channel_inventory_levels(account_id,external_location_id);

CREATE TABLE order_returns(
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES order_cache(id) ON DELETE CASCADE,
  external_id TEXT,
  status TEXT NOT NULL,
  reason TEXT,
  amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'TRY',
  source_updated_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(order_id,external_id)
);
CREATE INDEX order_returns_order_status ON order_returns(order_id,status);

CREATE TABLE order_refunds(
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES order_cache(id) ON DELETE CASCADE,
  external_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  processed_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(order_id,external_id)
);
CREATE INDEX order_refunds_order_created ON order_refunds(order_id,created_at DESC);
