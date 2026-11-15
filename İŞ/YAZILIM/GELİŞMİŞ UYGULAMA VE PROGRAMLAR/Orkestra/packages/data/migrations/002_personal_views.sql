INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at)
SELECT id,'hidden_modules','[]',CURRENT_TIMESTAMP FROM users;

INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at)
SELECT id,'start_module','"home"',CURRENT_TIMESTAMP FROM users;
