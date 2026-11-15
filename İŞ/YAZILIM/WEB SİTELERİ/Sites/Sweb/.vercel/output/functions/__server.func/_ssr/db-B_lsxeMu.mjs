import { i as getRequest } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-B_lsxeMu.js
/**
* Fetch-Metadata sibling isolation — **server-only** (`.server.ts` suffix).
*
* MUST keep the `.server` suffix: this file imports `@tanstack/react-start/server`
* (`getRequest` → Node `AsyncLocalStorage`). If it is imported from a dual
* client/server module under a non-`.server` name, Vite ships it to the browser
* and the app dies with: `AsyncLocalStorage is not a constructor`.
*
* Apps deployed on `*.grok.me` are "same-site" to each other but MUTUALLY
* UNTRUSTED, and a `SameSite=Lax` session cookie IS sent on same-site
* subrequests — so without this, a malicious sibling could make a SCRIPTED
* (fetch/XHR/form-POST) request to this app's server functions and ride this
* app's session cookie.
*
* We allow only: same-origin requests (this app's own client), non-browser
* requests (SSR / server-to-server, which send no `Sec-Fetch-Site`), and
* top-level GET navigations (how the OAuth callback and normal page loads
* arrive). Every cross-site / same-site *scripted* request is rejected.
* Together with `__Host-` cookies and Better Auth's `trustedOrigins`, this
* closes the sibling-tenant attack surface. Enforced at the `authMiddleware`
* chokepoint (see `middleware.ts`).
*/
var CrossSiteRequestError = class extends Error {
	status = 403;
	constructor() {
		super("Forbidden: cross-site request blocked");
		this.name = "CrossSiteRequestError";
	}
};
/** Throw `CrossSiteRequestError` for a scripted cross-site/sibling request. */
function assertSameSiteRequest() {
	const request = getRequest();
	if (!request) return;
	const h = request.headers;
	const site = h.get("sec-fetch-site");
	if (!site || site === "same-origin" || site === "none") return;
	const dest = h.get("sec-fetch-dest");
	if (h.get("sec-fetch-mode") === "navigate" && request.method === "GET" && dest !== "object" && dest !== "embed") return;
	throw new CrossSiteRequestError();
}
var _0001_catalog_admin_default = "create table if not exists catalog_product_state (\n  product_key text primary key,\n  name_override text,\n  price_override numeric(12, 2),\n  status text not null default 'active',\n  updated_by text not null,\n  updated_at timestamptz not null default now(),\n  constraint catalog_product_state_status_check check (status in ('active', 'inactive', 'archived')),\n  constraint catalog_product_state_name_check check (name_override is null or char_length(name_override) between 2 and 120),\n  constraint catalog_product_state_price_check check (price_override is null or price_override >= 0)\n);\n\ncreate index if not exists catalog_product_state_status_idx\n  on catalog_product_state (status);\n\ncreate table if not exists catalog_admin_audit (\n  id bigserial primary key,\n  product_key text not null,\n  action text not null,\n  before_state jsonb,\n  after_state jsonb,\n  actor text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists catalog_admin_audit_product_idx\n  on catalog_admin_audit (product_key, created_at desc);\n";
var _0002_order_requests_default = "create table if not exists storefront_order_requests (\n  id text primary key,\n  request_hash text not null,\n  customer jsonb not null,\n  items jsonb not null,\n  total_cents bigint not null check (total_cents > 0),\n  shipping_cents integer not null check (shipping_cents >= 0),\n  status text not null default 'new' check (status in ('new', 'reviewed')),\n  created_at timestamptz not null default now()\n);\n";
var _0003_admin_seo_scripts_default = "alter table catalog_product_state add column if not exists seo_title_override text;\nalter table catalog_product_state add column if not exists seo_description_override text;\nalter table catalog_product_state add column if not exists image_alt_override text;\n\ncreate table if not exists site_script_state (\n  id uuid primary key,\n  name text not null,\n  placement text not null check (placement in ('head', 'body')),\n  code text not null,\n  active boolean not null default false,\n  updated_by text not null,\n  updated_at timestamptz not null default now()\n);\n";
var _0004_site_config_orders_default = "create table if not exists site_config (\n  id text primary key,\n  value jsonb not null,\n  updated_by text not null,\n  updated_at timestamptz not null default now()\n);\n\nalter table storefront_order_requests drop constraint if exists storefront_order_requests_status_check;\nalter table storefront_order_requests\n  add constraint storefront_order_requests_status_check\n  check (status in ('new', 'reviewed', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled', 'archived'));\n\nalter table storefront_order_requests add column if not exists admin_note text;\nalter table storefront_order_requests add column if not exists updated_at timestamptz not null default now();\n";
var _0005_admin_access_default = "create table if not exists admin_roles (\n  id uuid primary key,\n  role_key text not null unique,\n  name text not null,\n  description text not null default '',\n  is_system boolean not null default false,\n  rules jsonb not null default '[]'::jsonb,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists admin_users (\n  id uuid primary key,\n  username text not null unique,\n  display_name text not null,\n  password_salt text not null,\n  password_hash text not null,\n  active boolean not null default true,\n  locked boolean not null default false,\n  two_factor_required boolean not null default false,\n  two_factor_secret text,\n  role_id uuid not null references admin_roles(id) on delete restrict,\n  last_login_at timestamptz,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists admin_sessions (\n  id uuid primary key,\n  token_hash text not null unique,\n  user_id uuid references admin_users(id) on delete cascade,\n  actor_name text not null,\n  role_key text not null,\n  ip text not null,\n  user_agent text not null,\n  expires_at timestamptz not null,\n  revoked_at timestamptz,\n  created_at timestamptz not null default now(),\n  last_seen_at timestamptz not null default now()\n);\ncreate index if not exists admin_sessions_user_idx on admin_sessions(user_id, expires_at desc);\n\ncreate table if not exists admin_login_events (\n  id bigserial primary key,\n  user_id uuid references admin_users(id) on delete set null,\n  username text not null,\n  success boolean not null,\n  ip text not null,\n  user_agent text not null,\n  reason text,\n  created_at timestamptz not null default now()\n);\ncreate index if not exists admin_login_events_created_idx on admin_login_events(created_at desc);\n\ncreate table if not exists admin_activity_log (\n  id bigserial primary key,\n  actor_id uuid references admin_users(id) on delete set null,\n  actor_name text not null,\n  permission_key text not null,\n  action text not null,\n  resource_type text not null,\n  resource_id text,\n  before_state jsonb,\n  after_state jsonb,\n  ip text not null,\n  user_agent text not null,\n  created_at timestamptz not null default now()\n);\ncreate index if not exists admin_activity_created_idx on admin_activity_log(created_at desc);\n\ncreate table if not exists admin_approval_requests (\n  id uuid primary key,\n  requested_by uuid references admin_users(id) on delete set null,\n  requester_name text not null,\n  permission_key text not null,\n  resource_type text not null,\n  resource_id text,\n  payload jsonb,\n  payload_hash text not null,\n  status text not null default 'pending' check (status in ('pending','approved','rejected')),\n  reviewed_by uuid references admin_users(id) on delete set null,\n  reviewer_name text,\n  review_note text,\n  created_at timestamptz not null default now(),\n  reviewed_at timestamptz,\n  consumed_at timestamptz\n);\ncreate index if not exists admin_approval_status_idx on admin_approval_requests(status, created_at desc);\n\n-- Logs are append-only from the application role. There is deliberately no\n-- delete endpoint or cascading delete path for either audit table.\n";
var _0006_admin_2fa_default = "alter table admin_users add column if not exists two_factor_secret text;\n";
var _0007_admin_operations_default = "create table if not exists admin_records (\n  id uuid primary key,\n  module text not null,\n  title text not null,\n  reference text,\n  status text not null,\n  data jsonb not null default '{}'::jsonb,\n  owner_id uuid references admin_users(id) on delete set null,\n  assigned_id uuid references admin_users(id) on delete set null,\n  category text,\n  warehouse text,\n  brand text,\n  customer_group text,\n  sales_channel text,\n  created_by uuid references admin_users(id) on delete set null,\n  updated_by uuid references admin_users(id) on delete set null,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists admin_records_module_status_idx\n  on admin_records (module, status, updated_at desc);\ncreate index if not exists admin_records_assigned_idx\n  on admin_records (assigned_id, updated_at desc);\ncreate unique index if not exists admin_records_reference_idx\n  on admin_records (module, reference) where reference is not null;\n";
var _0008_order_operations_default = "alter table storefront_order_requests\n  add column if not exists payment_status text not null default 'pending';\nalter table storefront_order_requests\n  add column if not exists shipping_status text not null default 'pending';\nalter table storefront_order_requests add column if not exists carrier text;\nalter table storefront_order_requests add column if not exists tracking_code text;\nalter table storefront_order_requests add column if not exists invoice_number text;\nalter table storefront_order_requests\n  add column if not exists refunded_cents bigint not null default 0;\n\nalter table storefront_order_requests\n  drop constraint if exists storefront_order_requests_payment_status_check;\nalter table storefront_order_requests\n  add constraint storefront_order_requests_payment_status_check\n  check (payment_status in ('pending', 'paid', 'failed', 'partially_refunded', 'refunded'));\n\nalter table storefront_order_requests\n  drop constraint if exists storefront_order_requests_shipping_status_check;\nalter table storefront_order_requests\n  add constraint storefront_order_requests_shipping_status_check\n  check (shipping_status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled'));\n\nalter table storefront_order_requests\n  drop constraint if exists storefront_order_requests_refunded_cents_check;\nalter table storefront_order_requests\n  add constraint storefront_order_requests_refunded_cents_check\n  check (refunded_cents >= 0 and refunded_cents <= total_cents);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
function getDatabaseUrl() {
	return (typeof process !== "undefined" ? process.env.DATABASE_URL : void 0)?.trim() || void 0;
}
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
function getDbSource() {
	return getDatabaseUrl() ? "neon" : "pglite";
}
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql(databaseUrl) {
	if (globalRef.__pgSqlUrl__ !== databaseUrl) {
		globalRef.__pgSqlPromise__ = void 0;
		globalRef.__pgSqlUrl__ = databaseUrl;
	}
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { neon } = await import("../_libs/neondatabase__serverless.mjs").then((n) => n.t);
		const client = neon(databaseUrl);
		return toSql(async (text, params) => {
			return await client.query(text, params);
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0001_catalog_admin.sql": _0001_catalog_admin_default,
			"/migrations/0002_order_requests.sql": _0002_order_requests_default,
			"/migrations/0003_admin_seo_scripts.sql": _0003_admin_seo_scripts_default,
			"/migrations/0004_site_config_orders.sql": _0004_site_config_orders_default,
			"/migrations/0005_admin_access.sql": _0005_admin_access_default,
			"/migrations/0006_admin_2fa.sql": _0006_admin_2fa_default,
			"/migrations/0007_admin_operations.sql": _0007_admin_operations_default,
			"/migrations/0008_order_operations.sql": _0008_order_operations_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	const databaseUrl = getDatabaseUrl();
	return databaseUrl ? createNeonSql(databaseUrl) : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	return createSql();
}
//#endregion
export { getDbSource as n, getSql as r, assertSameSiteRequest as t };
