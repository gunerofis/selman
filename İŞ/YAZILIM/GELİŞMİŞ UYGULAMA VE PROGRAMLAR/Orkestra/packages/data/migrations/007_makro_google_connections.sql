INSERT OR IGNORE INTO integration_connections(
  id,brand,account_id,provider,kind,label,status,endpoint,external_account_id,secret_ref,capabilities_json,requirements_json,created_at,updated_at
) VALUES
  ('makro-google-analytics','makro',NULL,'google_analytics','analytics','Sümen Takımı · Google Analytics 4','awaiting_api_credentials','https://analyticsdata.googleapis.com','331936151','MAKRO_GOOGLE_SERVICE_ACCOUNT_FILE','["traffic","realtime","ecommerce","revenue","attribution"]','["service_account","property_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('makro-google-merchant','makro',NULL,'google_merchant','merchant','Sümen Takımı · Merchant Center','awaiting_api_credentials','https://merchantapi.googleapis.com','5509004200','MAKRO_GOOGLE_SERVICE_ACCOUNT_FILE','["products","issues","performance","competitive_visibility"]','["service_account","account_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('makro-google-ads','makro',NULL,'google_ads','advertising','Sümen Takımı · Google Ads','awaiting_api_credentials','https://googleads.googleapis.com','2421968660','MAKRO_GOOGLE_ADS_*','["campaigns","spend","conversions","search_terms"]','["oauth_client","refresh_token","developer_token","cloud_api_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('makro-google-search-console','makro',NULL,'google_search_console','search','Sümen Takımı · Search Console','awaiting_api_credentials','https://searchconsole.googleapis.com','https://www.sumentakimi.com.tr/','MAKRO_GOOGLE_SERVICE_ACCOUNT_FILE','["search_performance","indexing","sitemaps","page_experience"]','["service_account","property_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
  ('makro-google-tag-manager','makro',NULL,'google_tag_manager','tag_management','Sümen Takımı · Tag Manager','identified','https://tagmanager.googleapis.com','GTM-K2N35XC4','MAKRO_GOOGLE_SERVICE_ACCOUNT_FILE','["containers","tags","triggers","versions"]','["service_account","container_access"]',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

UPDATE sites
SET status = 'verified'
WHERE id = 'site-sumentakimi-tr';
