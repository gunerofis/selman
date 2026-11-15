UPDATE integration_connections
SET external_account_id = '399792825',
    status = 'awaiting_api_credentials',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'guner-google-analytics';

UPDATE integration_connections
SET external_account_id = '113549415',
    status = 'awaiting_api_credentials',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'guner-google-merchant';

UPDATE integration_connections
SET external_account_id = '7412228113',
    status = 'awaiting_api_credentials',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'guner-google-ads';

UPDATE integration_connections
SET status = 'license_required',
    requirements_json = '["api_license_purchase","api_username","api_secret","provider_documentation"]',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'guner-faprika';

UPDATE accounts
SET connection_status = 'awaiting_license'
WHERE id = 'guner-faprika';
