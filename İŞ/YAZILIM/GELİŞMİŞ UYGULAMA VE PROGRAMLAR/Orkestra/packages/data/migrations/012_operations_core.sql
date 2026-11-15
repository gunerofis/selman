ALTER TABLE production_jobs ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE production_jobs ADD COLUMN due_at TEXT;
ALTER TABLE production_jobs ADD COLUMN started_at TEXT;
ALTER TABLE production_jobs ADD COLUMN completed_at TEXT;

ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE tasks ADD COLUMN due_at TEXT;
ALTER TABLE tasks ADD COLUMN blocked_reason TEXT;

CREATE TABLE bills_of_materials(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  code TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  quantity REAL NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(brand,code,revision)
);
CREATE INDEX boms_brand_product ON bills_of_materials(brand,product_id,status);

CREATE TABLE bill_of_material_lines(
  id TEXT PRIMARY KEY,
  bom_id TEXT NOT NULL REFERENCES bills_of_materials(id) ON DELETE CASCADE,
  component_product_id TEXT NOT NULL REFERENCES products(id),
  quantity REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'adet',
  waste_percent REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  UNIQUE(bom_id,component_product_id)
);

CREATE TABLE production_operations(
  id TEXT PRIMARY KEY,
  production_job_id TEXT NOT NULL REFERENCES production_jobs(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assignee TEXT REFERENCES users(id),
  planned_minutes INTEGER,
  actual_minutes INTEGER,
  started_at TEXT,
  completed_at TEXT,
  notes TEXT,
  UNIQUE(production_job_id,sequence)
);
CREATE INDEX production_operations_job_status ON production_operations(production_job_id,status,sequence);

CREATE TABLE purchase_requests(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  number TEXT NOT NULL,
  supplier_id TEXT REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'draft',
  priority TEXT NOT NULL DEFAULT 'normal',
  needed_at TEXT,
  notes TEXT,
  requested_by TEXT NOT NULL REFERENCES users(id),
  approved_by TEXT REFERENCES users(id),
  approved_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(brand,number)
);
CREATE INDEX purchase_requests_brand_status ON purchase_requests(brand,status,updated_at DESC);

CREATE TABLE purchase_request_lines(
  id TEXT PRIMARY KEY,
  purchase_request_id TEXT NOT NULL REFERENCES purchase_requests(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'adet',
  estimated_unit_cost REAL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  notes TEXT
);
CREATE INDEX purchase_request_lines_request ON purchase_request_lines(purchase_request_id);

CREATE TABLE external_operation_history(
  id TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL REFERENCES external_operations(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor TEXT NOT NULL,
  detail_json TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX external_operation_history_operation ON external_operation_history(operation_id,created_at);

CREATE TABLE saved_views(
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  brand TEXT NOT NULL,
  resource TEXT NOT NULL,
  name TEXT NOT NULL,
  definition_json TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id,brand,resource,name)
);

CREATE UNIQUE INDEX stock_reservations_active_order_position
  ON stock_reservations(position_id,order_id)
  WHERE status='active' AND order_id IS NOT NULL;
CREATE INDEX stock_reservations_brand_status ON stock_reservations(brand,status,created_at DESC);
CREATE INDEX stock_movements_brand_created ON stock_movements(brand,created_at DESC);
