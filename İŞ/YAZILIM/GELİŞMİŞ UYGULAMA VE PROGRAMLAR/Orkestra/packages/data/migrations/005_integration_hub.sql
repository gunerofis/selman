CREATE TABLE integration_connections(
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  account_id TEXT REFERENCES accounts(id),
  provider TEXT NOT NULL,
  kind TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_configured',
  endpoint TEXT,
  external_account_id TEXT,
  secret_ref TEXT,
  capabilities_json TEXT NOT NULL DEFAULT '[]',
  requirements_json TEXT NOT NULL DEFAULT '[]',
  last_sync_at TEXT,
  last_error_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX integration_connections_brand_kind
  ON integration_connections(brand,kind,status);

CREATE TABLE integration_sync_jobs(
  id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL REFERENCES integration_connections(id),
  dataset TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'incremental',
  cursor_json TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT NOT NULL,
  result_json TEXT,
  error_json TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT
);

CREATE INDEX integration_sync_jobs_pending
  ON integration_sync_jobs(status,created_at);

CREATE TABLE integration_snapshots(
  id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL REFERENCES integration_connections(id),
  dataset TEXT NOT NULL,
  period_start TEXT,
  period_end TEXT,
  payload_json TEXT NOT NULL,
  source_updated_at TEXT,
  captured_at TEXT NOT NULL,
  UNIQUE(connection_id,dataset,period_start,period_end)
);

INSERT OR IGNORE INTO accounts(id,brand,platform,status,connection_status)
VALUES('guner-faprika','guner','faprika','ready','awaiting_credentials');

INSERT OR IGNORE INTO account_connections(account_id,shop_domain,settings_json,updated_at)
VALUES(
  'guner-faprika',
  'www.gunerofis.com',
  '{"baseUrl":"https://www.gunerofis.com","usernameEnv":"FAPRIKA_GUNEROFIS_API_USER","secretEnv":"FAPRIKA_GUNEROFIS_API_SECRET"}',
  CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO integration_connections(
  id,brand,account_id,provider,kind,label,status,endpoint,secret_ref,capabilities_json,requirements_json,created_at,updated_at
) VALUES
  ('guner-faprika','guner','guner-faprika','faprika','commerce','Güner Ofis · Faprika','awaiting_credentials','https://www.gunerofis.com','FAPRIKA_GUNEROFIS_API_*','["orders","customers","products","inventory","returns","marketplace_source"]','["api_access","api_username","api_secret","provider_documentation"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-google-analytics','guner',NULL,'google_analytics','analytics','Google Analytics 4','awaiting_credentials','https://analyticsdata.googleapis.com','GOOGLE_SERVICE_ACCOUNT_FILE','["traffic","realtime","ecommerce","revenue","attribution"]','["service_account","ga4_property_id","property_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-google-merchant','guner',NULL,'google_merchant','merchant','Google Merchant Center','awaiting_credentials','https://merchantapi.googleapis.com','GOOGLE_SERVICE_ACCOUNT_FILE','["products","issues","performance","competitive_visibility"]','["service_account","merchant_account_id","account_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-google-ads','guner',NULL,'google_ads','advertising','Google Ads','awaiting_credentials','https://googleads.googleapis.com','GOOGLE_ADS_*','["campaigns","spend","conversions","search_terms"]','["oauth_client","refresh_token","customer_id","cloud_api_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-yurtici','guner',NULL,'yurtici_kargo','shipping','Yurtiçi Kargo','awaiting_credentials','https://ws.yurticikargo.com/KOPSWebServices/ShippingOrderDispatcherServices','YURTICI_WS_*','["create_shipment","track_shipment","cancel_shipment","returns"]','["web_service_user","web_service_password","ip_authorization"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-accounting','guner',NULL,'unselected','accounting','Muhasebe / ERP','provider_required',NULL,NULL,'["customers","invoices","payments","expenses","reconciliation"]','["provider_selection"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
