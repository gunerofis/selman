ALTER TABLE accounts ADD COLUMN status TEXT NOT NULL DEFAULT 'ready';
ALTER TABLE accounts ADD COLUMN connection_status TEXT NOT NULL DEFAULT 'not_configured';
ALTER TABLE accounts ADD COLUMN last_sync_at TEXT;

ALTER TABLE order_cache ADD COLUMN status TEXT NOT NULL DEFAULT 'open';
ALTER TABLE order_cache ADD COLUMN source_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE order_cache ADD COLUMN updated_at TEXT;
ALTER TABLE order_cache ADD COLUMN cancelled_at TEXT;

ALTER TABLE tasks ADD COLUMN updated_at TEXT;

ALTER TABLE inbox_events ADD COLUMN event_id TEXT;
ALTER TABLE inbox_events ADD COLUMN digest TEXT;
ALTER TABLE inbox_events ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE inbox_events ADD COLUMN available_at TEXT;
ALTER TABLE inbox_events ADD COLUMN error_json TEXT;
CREATE UNIQUE INDEX inbox_source_event ON inbox_events(source,account_id,event_id);
CREATE INDEX inbox_pending ON inbox_events(status,available_at,received_at);

CREATE TABLE order_lines(
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES order_cache(id) ON DELETE CASCADE,
  external_product_id TEXT,
  product_id TEXT REFERENCES products(id),
  sku TEXT,
  title TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'adet',
  mapping_status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(order_id,external_product_id)
);

CREATE TABLE order_history(
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES order_cache(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source_version INTEGER NOT NULL,
  before_json TEXT,
  after_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX order_history_order_created ON order_history(order_id,created_at DESC);

CREATE TABLE demo_source_orders(
  account_id TEXT NOT NULL REFERENCES accounts(id),
  external_id TEXT NOT NULL,
  source_version INTEGER NOT NULL,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(account_id,external_id)
);

CREATE TABLE integration_errors(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  account_id TEXT,
  inbox_id TEXT,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  context_json TEXT,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);
CREATE INDEX integration_errors_brand_status ON integration_errors(brand,status,created_at DESC);

CREATE TABLE service_heartbeats(
  service TEXT PRIMARY KEY,
  instance_id TEXT NOT NULL,
  status TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  details_json TEXT
);
