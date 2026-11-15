import { DatabaseSync } from 'node:sqlite';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'data', 'migrations');

export const hash = value => createHash('sha256').update(value).digest('hex');
export function openStore(path = ':memory:') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS schema_migrations(id TEXT PRIMARY KEY, applied_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT NOT NULL, token_hash TEXT UNIQUE NOT NULL, active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS grants(user_id TEXT NOT NULL REFERENCES users(id), brand TEXT NOT NULL, permission TEXT NOT NULL, PRIMARY KEY(user_id,brand,permission));
    CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, brand TEXT NOT NULL, platform TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS rules(id TEXT PRIMARY KEY, brand TEXT NOT NULL, kind TEXT NOT NULL, assignee TEXT REFERENCES users(id), UNIQUE(brand,kind));
    CREATE TABLE IF NOT EXISTS mappings(account TEXT NOT NULL REFERENCES accounts(id), kind TEXT NOT NULL, external_id TEXT NOT NULL, entity_id TEXT NOT NULL, PRIMARY KEY(account,kind,external_id));
    CREATE TABLE IF NOT EXISTS events(account TEXT NOT NULL REFERENCES accounts(id), event_id TEXT NOT NULL, digest TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(account,event_id));
    CREATE TABLE IF NOT EXISTS order_cache(id TEXT PRIMARY KEY, account TEXT NOT NULL REFERENCES accounts(id), external_id TEXT NOT NULL, customer_id TEXT, needs_production INTEGER NOT NULL, international INTEGER NOT NULL, expires_at TEXT NOT NULL, UNIQUE(account,external_id));
    CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY, brand TEXT NOT NULL, order_id TEXT NOT NULL REFERENCES order_cache(id), kind TEXT NOT NULL, assignee TEXT REFERENCES users(id), status TEXT NOT NULL DEFAULT 'pending', UNIQUE(order_id,kind));
    CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY, actor TEXT NOT NULL, brand TEXT NOT NULL, action TEXT NOT NULL, before_json TEXT, after_json TEXT, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS feature_access(user_id TEXT NOT NULL REFERENCES users(id), feature TEXT NOT NULL, unlocked INTEGER NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(user_id,feature));
    CREATE TABLE IF NOT EXISTS companies(id TEXT PRIMARY KEY, name TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS brands(id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id), name TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sites(id TEXT PRIMARY KEY, brand_id TEXT NOT NULL REFERENCES brands(id), host TEXT NOT NULL UNIQUE, purpose TEXT NOT NULL DEFAULT 'unverified', status TEXT NOT NULL DEFAULT 'unverified', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS customers(id TEXT PRIMARY KEY, brand TEXT NOT NULL, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'customer', email TEXT, phone TEXT, status TEXT NOT NULL DEFAULT 'active', notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS customers_brand_updated ON customers(brand,updated_at DESC);
    CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY, brand TEXT NOT NULL, sku TEXT NOT NULL, name TEXT NOT NULL, unit TEXT NOT NULL DEFAULT 'adet', status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(brand,sku));
    CREATE INDEX IF NOT EXISTS products_brand_updated ON products(brand,updated_at DESC);
    CREATE TABLE IF NOT EXISTS stock_positions(id TEXT PRIMARY KEY, brand TEXT NOT NULL, product_id TEXT NOT NULL REFERENCES products(id), location TEXT NOT NULL DEFAULT 'unassigned', opening_qty REAL NOT NULL DEFAULT 1000, on_hand REAL NOT NULL DEFAULT 1000, reserved REAL NOT NULL DEFAULT 0, verification_status TEXT NOT NULL DEFAULT 'unverified', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(product_id,location));
    CREATE TABLE IF NOT EXISTS stock_movements(id TEXT PRIMARY KEY, brand TEXT NOT NULL, position_id TEXT NOT NULL REFERENCES stock_positions(id), kind TEXT NOT NULL, quantity REAL NOT NULL, before_qty REAL NOT NULL, after_qty REAL NOT NULL, actor TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS stock_reservations(id TEXT PRIMARY KEY, brand TEXT NOT NULL, position_id TEXT NOT NULL REFERENCES stock_positions(id), order_id TEXT, quantity REAL NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, released_at TEXT);
    CREATE TABLE IF NOT EXISTS quotes(id TEXT PRIMARY KEY, brand TEXT NOT NULL, number TEXT NOT NULL, customer_id TEXT REFERENCES customers(id), currency TEXT NOT NULL DEFAULT 'TRY', total REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(brand,number,revision));
    CREATE TABLE IF NOT EXISTS production_jobs(id TEXT PRIMARY KEY, brand TEXT NOT NULL, code TEXT NOT NULL, product_id TEXT REFERENCES products(id), order_id TEXT, quantity REAL NOT NULL, status TEXT NOT NULL DEFAULT 'planned', assignee TEXT REFERENCES users(id), notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(brand,code));
    CREATE TABLE IF NOT EXISTS notifications(id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), brand TEXT NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, body TEXT, read_at TEXT, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS user_preferences(user_id TEXT NOT NULL REFERENCES users(id), pref_key TEXT NOT NULL, value_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(user_id,pref_key));
    CREATE TABLE IF NOT EXISTS inbox_events(id TEXT PRIMARY KEY, source TEXT NOT NULL, event_type TEXT NOT NULL, schema_version INTEGER NOT NULL DEFAULT 1, account_id TEXT, correlation_id TEXT, payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'received', received_at TEXT NOT NULL, processed_at TEXT);
    CREATE TABLE IF NOT EXISTS outbox_events(id TEXT PRIMARY KEY, event_type TEXT NOT NULL, aggregate_id TEXT NOT NULL, payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, available_at TEXT NOT NULL, created_at TEXT NOT NULL, delivered_at TEXT);
    CREATE TABLE IF NOT EXISTS external_operations(id TEXT PRIMARY KEY, brand TEXT NOT NULL, kind TEXT NOT NULL, target_account TEXT, idempotency_key TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'proposed', summary_json TEXT NOT NULL, confirmed_by TEXT REFERENCES users(id), confirmed_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
  `);
  migrateStore(db);
  return db;
}
export function migrateStore(db) {
  const applied=db.prepare('SELECT 1 FROM schema_migrations WHERE id=?');
  const record=db.prepare('INSERT INTO schema_migrations(id,applied_at) VALUES(?,?)');
  const files=readdirSync(migrationRoot).filter(name=>/^\d+_.+\.sql$/.test(name)).sort();
  for (const file of files) {
    if (applied.get(file)) continue;
    transaction(db,()=>{db.exec(readFileSync(join(migrationRoot,file),'utf8'));record.run(file,new Date().toISOString());});
  }
  return files;
}
export function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = fn(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}
export function audit(db, actor, brand, action, before, after) {
  db.prepare('INSERT INTO audit VALUES(?,?,?,?,?,?,?)').run(randomUUID(), actor, brand, action, JSON.stringify(before), JSON.stringify(after), new Date().toISOString());
}
export function permitted(db, user, brand, permission) {
  return !!db.prepare("SELECT 1 FROM grants WHERE user_id=? AND brand IN (?, '*') AND permission IN (?, '*')").get(user.id, brand, permission);
}
export function bootstrap(db, token, { id = 'admin', name = 'Yerel yönetici' } = {}) {
  if (!token || token.length < 32) throw new Error('BOOTSTRAP_TOKEN en az 32 karakter olmalı.');
  if (db.prepare('SELECT 1 FROM users LIMIT 1').get()) throw new Error('İlk kullanıcı zaten oluşturulmuş.');
  transaction(db, () => {
    db.prepare('INSERT INTO users(id,name,token_hash) VALUES(?,?,?)').run(id, name, hash(token));
    db.prepare('INSERT INTO grants VALUES(?,?,?)').run(id, '*', '*');
    const now = new Date().toISOString();
    db.prepare('INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,?,?,?)').run(id,'hidden_modules','[]',now);
    db.prepare('INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,?,?,?)').run(id,'start_module','"home"',now);
    db.prepare('INSERT OR IGNORE INTO user_preferences(user_id,pref_key,value_json,updated_at) VALUES(?,?,?,?)').run(id,'display_density','"comfortable"',now);
    db.prepare('INSERT OR IGNORE INTO companies(id,name,active,created_at) VALUES(?,?,?,?)').run('guner-office', 'Güner Office', 1, now);
    const insertBrand = db.prepare('INSERT OR IGNORE INTO brands VALUES(?,?,?,?,?)');
    insertBrand.run('teknik','guner-office','Teknik Kırtasiye',1,now);
    insertBrand.run('makro','guner-office','Makro Ofis',1,now);
    insertBrand.run('guner','guner-office','Güner Ofis',1,now);
    const insertSite = db.prepare('INSERT OR IGNORE INTO sites VALUES(?,?,?,?,?,?)');
    for (const [id,brand,host,purpose,status] of [
      ['site-imalattansumen','teknik','imalattansumen.com','sales','unverified'],
      ['site-sumentakimi-tr','makro','sumentakimi.com.tr','sales','unverified'],
      ['site-sumentakimi-com','makro','sumentakimi.com','sales','unverified'],
      ['site-gunerofis','guner','gunerofis.com','sales','unverified'],
      ['site-guneroffice','guner','guneroffice.com','sales','unverified'],
      ['site-guner-online','guner','gunerofis.online','unverified','unverified'],
      ['site-guner-workers','guner','gunerofis.workers.dev','unverified','unverified']
    ]) insertSite.run(id,brand,host,purpose,status,now);
    audit(db, 'bootstrap', '*', 'user.created', null, { id });
  });
}
