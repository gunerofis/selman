INSERT OR IGNORE INTO integration_connections(
  id,brand,account_id,provider,kind,label,status,endpoint,external_account_id,secret_ref,capabilities_json,requirements_json,created_at,updated_at
) VALUES
  ('guner-google-search-console','guner',NULL,'google_search_console','search','Güner Ofis · Search Console','awaiting_api_credentials','https://www.googleapis.com/webmasters/v3','sc-domain:gunerofis.com','GOOGLE_SERVICE_ACCOUNT_FILE','["search_performance","indexing","sitemaps"]','["service_account","property_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('guner-google-tag-manager','guner',NULL,'google_tag_manager','tag_management','Güner Ofis · Tag Manager','awaiting_api_credentials','https://tagmanager.googleapis.com','1446789795','GOOGLE_SERVICE_ACCOUNT_FILE','["containers","tags","triggers","versions"]','["service_account","account_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
