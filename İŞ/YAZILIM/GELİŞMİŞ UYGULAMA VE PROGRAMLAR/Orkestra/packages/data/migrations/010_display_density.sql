INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at)
SELECT id,'display_density','"comfortable"',CURRENT_TIMESTAMP FROM users;
