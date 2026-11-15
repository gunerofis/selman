CREATE TABLE account_connections(
  account_id TEXT PRIMARY KEY REFERENCES accounts(id),
  shop_domain TEXT NOT NULL,
  settings_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE TABLE connector_sync_jobs(
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT NOT NULL,
  result_json TEXT,
  error_json TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT
);

CREATE INDEX connector_sync_jobs_status_created
  ON connector_sync_jobs(status,created_at);

CREATE INDEX connector_sync_jobs_account_created
  ON connector_sync_jobs(account_id,created_at DESC);
