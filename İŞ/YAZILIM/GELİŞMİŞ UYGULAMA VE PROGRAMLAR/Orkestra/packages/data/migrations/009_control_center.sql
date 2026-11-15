CREATE TABLE shipments(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  order_id TEXT REFERENCES order_cache(id),
  carrier TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT NOT NULL DEFAULT 'preparing',
  note TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(brand,carrier,tracking_number)
);
CREATE INDEX shipments_brand_status_updated ON shipments(brand,status,updated_at DESC);

CREATE TABLE shipment_history(
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX shipment_history_shipment_created ON shipment_history(shipment_id,created_at DESC);

CREATE TABLE invoices(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  number TEXT NOT NULL,
  order_id TEXT REFERENCES order_cache(id),
  customer_id TEXT REFERENCES customers(id),
  currency TEXT NOT NULL DEFAULT 'TRY',
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  due_at TEXT,
  note TEXT,
  issued_at TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(brand,number)
);
CREATE INDEX invoices_brand_status_updated ON invoices(brand,status,updated_at DESC);

CREATE TABLE payments(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  invoice_id TEXT REFERENCES invoices(id),
  direction TEXT NOT NULL DEFAULT 'incoming',
  currency TEXT NOT NULL DEFAULT 'TRY',
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  paid_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX payments_brand_paid ON payments(brand,paid_at DESC);
CREATE INDEX payments_invoice ON payments(invoice_id,status);
