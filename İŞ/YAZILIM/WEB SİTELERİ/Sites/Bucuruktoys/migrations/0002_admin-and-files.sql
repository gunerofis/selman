-- Migration number: 0002 	 2026-11-11T12:35:07.278Z
CREATE TABLE admin_credentials (
  email TEXT PRIMARY KEY REFERENCES admin_users(email) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE admin_sessions (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES admin_users(email) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX admin_sessions_expiry ON admin_sessions(expires_at);
CREATE INDEX admin_sessions_email ON admin_sessions(email);
CREATE TABLE uploaded_files (
  file_key TEXT PRIMARY KEY,
  bucket TEXT NOT NULL CHECK(bucket IN ('product-images','print-request-files')),
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL CHECK(size > 0 AND size <= 12582912),
  sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE file_chunks (
  file_key TEXT NOT NULL REFERENCES uploaded_files(file_key) ON DELETE CASCADE,
  part INTEGER NOT NULL,
  data BLOB NOT NULL,
  PRIMARY KEY(file_key,part)
);
