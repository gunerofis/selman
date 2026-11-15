import { randomUUID } from "node:crypto";
import { getDbSource, getSql } from "./db";
import { logAdminActivity, requireListPermission, requirePermission } from "./admin-access.server";
import type { SiteScript, SiteScriptInput } from "./site-scripts";

type Row = {
  id: string;
  name: string;
  placement: "head" | "body";
  code: string;
  active: boolean;
  updated_at: string;
};
function ensureTable() {
  return getSql();
}
function map(row: Row): SiteScript {
  return {
    id: row.id,
    name: row.name,
    placement: row.placement,
    code: row.code,
    active: row.active,
    updatedAt: row.updated_at,
  };
}
export async function getPublicScriptsServer() {
  if (process.env.NODE_ENV === "production" && getDbSource() === "pglite") return [];
  const sql = await ensureTable();
  const rows =
    await sql<Row>`select id::text,name,placement,code,active,updated_at::text from site_script_state where active=true order by name`;
  return rows.map(map);
}
export async function getAdminScriptsServer() {
  await requireListPermission("theme.edit_code");
  const sql = await ensureTable();
  const rows =
    await sql<Row>`select id::text,name,placement,code,active,updated_at::text from site_script_state order by updated_at desc`;
  return rows.map(map);
}
export async function saveAdminScriptServer(data: SiteScriptInput) {
  const identity = await requirePermission("theme.edit_code", {
    resourceType: "script",
    resourceId: data.id,
    payload: data,
  });
  const sql = await ensureTable();
  const id = data.id ?? randomUUID();
  await sql`with previous as (select to_jsonb(site_script_state.*) state from site_script_state where id=${id}::uuid), changed as (insert into site_script_state(id,name,placement,code,active,updated_by,updated_at) values(${id}::uuid,${data.name},${data.placement},${data.code},${data.active},${"admin"},now()) on conflict(id) do update set name=excluded.name,placement=excluded.placement,code=excluded.code,active=excluded.active,updated_by=excluded.updated_by,updated_at=now() returning *) insert into catalog_admin_audit(product_key,action,before_state,after_state,actor) select ${`script:${id}`},${data.id ? "script_update" : "script_create"},(select state from previous),to_jsonb(changed.*),${"admin"} from changed`;
  await logAdminActivity(identity, {
    permission: "theme.edit_code",
    action: data.id ? "script.update" : "script.create",
    resourceType: "script",
    resourceId: id,
    after: data,
  });
  return { ok: true as const, id };
}
export async function deleteAdminScriptServer(id: string) {
  const identity = await requirePermission("theme.edit_code", {
    resourceType: "script",
    resourceId: id,
    payload: { id },
  });
  const sql = await ensureTable();
  await sql`with removed as (delete from site_script_state where id=${id}::uuid returning *) insert into catalog_admin_audit(product_key,action,before_state,after_state,actor) select ${`script:${id}`},${"script_delete"},to_jsonb(removed.*),null,${"admin"} from removed`;
  await logAdminActivity(identity, {
    permission: "theme.edit_code",
    action: "script.delete",
    resourceType: "script",
    resourceId: id,
  });
  return { ok: true as const };
}
