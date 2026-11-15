import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser } from "../chatgpt-auth";
import { getD1OrNull } from "./store";

export type AdminRole = "developer" | "admin";
export type AdminContext = { email: string; displayName: string; role: AdminRole };

function configuredEmails(key: "DEVELOPER_ADMIN_EMAILS" | "GENERAL_ADMIN_EMAILS") {
  const value = (env as unknown as Record<string, string | undefined>)[key] || "";
  return value.split(",").map((email) => email.trim().toLocaleLowerCase("tr-TR")).filter(Boolean);
}

async function roleForEmail(email: string): Promise<AdminRole | null> {
  const normalized = email.toLocaleLowerCase("tr-TR");
  if (configuredEmails("DEVELOPER_ADMIN_EMAILS").includes(normalized)) return "developer";
  if (configuredEmails("GENERAL_ADMIN_EMAILS").includes(normalized)) return "admin";
  const db = getD1OrNull();
  if (!db) return null;
  try {
    const row = await db.prepare("SELECT role, active FROM admin_users WHERE lower(email) = ? LIMIT 1").bind(normalized).first<{ role: string; active: number }>();
    if (!row || !row.active) return null;
    return row.role === "developer" ? "developer" : "admin";
  } catch {
    return null;
  }
}

export async function getAdminContext(returnTo = "/admin") {
  const user = await requireChatGPTUser(returnTo);
  const role = await roleForEmail(user.email);
  return role ? { email: user.email, displayName: user.displayName, role } satisfies AdminContext : null;
}

export async function getAdminApiContext() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const role = await roleForEmail(user.email);
  return role ? { email: user.email, displayName: user.displayName, role } satisfies AdminContext : null;
}

export async function writeAudit(admin: AdminContext, action: string, entityType: string, entityId = "", details: Record<string, unknown> = {}) {
  const db = getD1OrNull();
  if (!db) return;
  try {
    await db.prepare("INSERT INTO audit_log (admin_email, action, entity_type, entity_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(admin.email, action, entityType, entityId, JSON.stringify(details), Math.floor(Date.now() / 1000)).run();
  } catch { /* audit must not block the requested action */ }
}
