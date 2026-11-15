import { n as getDbSource, r as getSql } from "./db-B_lsxeMu.mjs";
import { logAdminActivity, requireListPermission, requirePermission } from "./admin-access.server-DrHauVYy.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/site-scripts.server-BJOxNphO.js
function ensureTable() {
	return getSql();
}
function map(row) {
	return {
		id: row.id,
		name: row.name,
		placement: row.placement,
		code: row.code,
		active: row.active,
		updatedAt: row.updated_at
	};
}
async function getPublicScriptsServer() {
	if (getDbSource() === "pglite") return [];
	return (await (await ensureTable())`select id::text,name,placement,code,active,updated_at::text from site_script_state where active=true order by name`).map(map);
}
async function getAdminScriptsServer() {
	await requireListPermission("theme.edit_code");
	return (await (await ensureTable())`select id::text,name,placement,code,active,updated_at::text from site_script_state order by updated_at desc`).map(map);
}
async function saveAdminScriptServer(data) {
	const identity = await requirePermission("theme.edit_code", {
		resourceType: "script",
		resourceId: data.id,
		payload: data
	});
	const sql = await ensureTable();
	const id = data.id ?? randomUUID();
	await sql`with previous as (select to_jsonb(site_script_state.*) state from site_script_state where id=${id}::uuid), changed as (insert into site_script_state(id,name,placement,code,active,updated_by,updated_at) values(${id}::uuid,${data.name},${data.placement},${data.code},${data.active},${"admin"},now()) on conflict(id) do update set name=excluded.name,placement=excluded.placement,code=excluded.code,active=excluded.active,updated_by=excluded.updated_by,updated_at=now() returning *) insert into catalog_admin_audit(product_key,action,before_state,after_state,actor) select ${`script:${id}`},${data.id ? "script_update" : "script_create"},(select state from previous),to_jsonb(changed.*),${"admin"} from changed`;
	await logAdminActivity(identity, {
		permission: "theme.edit_code",
		action: data.id ? "script.update" : "script.create",
		resourceType: "script",
		resourceId: id,
		after: data
	});
	return {
		ok: true,
		id
	};
}
async function deleteAdminScriptServer(id) {
	const identity = await requirePermission("theme.edit_code", {
		resourceType: "script",
		resourceId: id,
		payload: { id }
	});
	await (await ensureTable())`with removed as (delete from site_script_state where id=${id}::uuid returning *) insert into catalog_admin_audit(product_key,action,before_state,after_state,actor) select ${`script:${id}`},${"script_delete"},to_jsonb(removed.*),null,${"admin"} from removed`;
	await logAdminActivity(identity, {
		permission: "theme.edit_code",
		action: "script.delete",
		resourceType: "script",
		resourceId: id
	});
	return { ok: true };
}
//#endregion
export { deleteAdminScriptServer, getAdminScriptsServer, getPublicScriptsServer, saveAdminScriptServer };
