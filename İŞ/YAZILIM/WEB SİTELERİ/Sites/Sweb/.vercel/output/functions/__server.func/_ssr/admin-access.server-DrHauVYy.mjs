import { c as starterRules, o as STARTER_ROLES, r as PERMISSION_KEYS, t as ALL_PERMISSION_KEYS } from "./admin-permissions-CglL3D63.mjs";
import { i as getRequest, o as setCookie$1, r as getCookie } from "./ssr.mjs";
import { n as getDbSource, r as getSql, t as assertSameSiteRequest } from "./db-B_lsxeMu.mjs";
import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-access.server-DrHauVYy.js
var COOKIE_NAME = "sweb_admin_session_v2";
var SESSION_SECONDS = 28800;
function adminConfigured() {
	const password = process.env.SWEB_ADMIN_PASSWORD?.trim() ?? "";
	return getDbSource() === "neon" && password.length >= 6;
}
function requestMeta() {
	const request = getRequest();
	return {
		ip: request?.headers.get("cf-connecting-ip") ?? request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local",
		userAgent: request?.headers.get("user-agent")?.slice(0, 500) ?? "unknown"
	};
}
function equalSecret(left, right) {
	const a = Buffer.from(left), b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}
function tokenHash(token) {
	return createHash("sha256").update(token).digest("hex");
}
function payloadHash(payload) {
	return createHash("sha256").update(JSON.stringify(payload ?? null)).digest("hex");
}
function hashPassword(password, salt = randomBytes(16).toString("hex")) {
	return {
		salt,
		hash: scryptSync(password, salt, 64).toString("hex")
	};
}
function verifyPassword(password, salt, expected) {
	const actual = scryptSync(password, salt, 64);
	const target = Buffer.from(expected, "hex");
	return actual.length === target.length && timingSafeEqual(actual, target);
}
var BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(value) {
	let bits = "", output = "";
	for (const byte of value) bits += byte.toString(2).padStart(8, "0");
	for (let i = 0; i < bits.length; i += 5) output += BASE32[Number.parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
	return output;
}
function base32Decode(value) {
	let bits = "";
	for (const char of value.replace(/=+$/u, "").toUpperCase()) {
		const index = BASE32.indexOf(char);
		if (index >= 0) bits += index.toString(2).padStart(5, "0");
	}
	const bytes = [];
	for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(Number.parseInt(bits.slice(i, i + 8), 2));
	return Buffer.from(bytes);
}
function totp(secret, offset = 0) {
	const counter = Math.floor(Date.now() / 3e4) + offset;
	const buffer = Buffer.alloc(8);
	buffer.writeBigUInt64BE(BigInt(counter));
	const digest = createHmac("sha1", base32Decode(secret)).update(buffer).digest();
	const position = digest[digest.length - 1] & 15;
	return ((digest.readUInt32BE(position) & 2147483647) % 1e6).toString().padStart(6, "0");
}
function verifyTotp(secret, code) {
	return [
		-1,
		0,
		1
	].some((offset) => equalSecret(totp(secret, offset), code));
}
var accessGlobal = globalThis;
async function seedRoles() {
	accessGlobal.__swebRoleSeedPromise__ ??= (async () => {
		const sql = await getSql();
		const roles = STARTER_ROLES.map((role) => ({
			id: randomUUID(),
			role_key: role.key,
			name: role.name,
			description: "Hazır sistem rolü",
			is_system: true,
			rules: starterRules(role.key)
		}));
		await sql`
      insert into admin_roles (id, role_key, name, description, is_system, rules)
      select seed.id::uuid, seed.role_key, seed.name, seed.description, seed.is_system, seed.rules
      from jsonb_to_recordset(${JSON.stringify(roles)}::jsonb) as seed(
        id text, role_key text, name text, description text, is_system boolean, rules jsonb
      )
      on conflict (role_key) do nothing
    `;
	})().catch((error) => {
		accessGlobal.__swebRoleSeedPromise__ = void 0;
		throw error;
	});
	await accessGlobal.__swebRoleSeedPromise__;
}
function ensureAccessSchema() {
	return getSql();
}
function normalizeRules(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const rule = item;
		if (!rule.permission || !PERMISSION_KEYS.has(rule.permission)) return [];
		if (![
			"none",
			"view_only",
			"own",
			"assigned",
			"category",
			"warehouse",
			"brand",
			"customer_group",
			"sales_channel",
			"all"
		].includes(rule.scope) || ![
			"allow",
			"require_approval",
			"deny"
		].includes(rule.approval)) return [];
		return [{
			permission: rule.permission,
			scope: rule.scope,
			scopeValue: rule.scopeValue?.slice(0, 120),
			approval: rule.approval
		}];
	});
}
async function currentIdentity() {
	if (!adminConfigured()) return null;
	const token = getCookie(COOKIE_NAME);
	if (!token) return null;
	const sql = await ensureAccessSchema();
	await seedRoles();
	const row = (await sql`
    select s.id::text session_id, s.user_id::text, s.actor_name, s.role_key,
           u.username, u.display_name, r.name role_name, r.rules
    from admin_sessions s
    left join admin_users u on u.id = s.user_id
    left join admin_roles r on r.id = u.role_id
    where s.token_hash = ${tokenHash(token)} and s.revoked_at is null and s.expires_at > now()
      and (u.id is null or (u.active = true and u.locked = false))
    limit 1
  `)[0];
	if (!row) return null;
	const owner = row.user_id === null && row.role_key === "owner";
	const rules = owner ? ALL_PERMISSION_KEYS.map((permission) => ({
		permission,
		scope: "all",
		approval: "allow"
	})) : normalizeRules(row.rules);
	return {
		id: row.user_id,
		username: row.username ?? "owner",
		displayName: row.display_name ?? row.actor_name,
		roleKey: row.role_key,
		roleName: row.role_name ?? "Super Admin / Sahip",
		permissions: rules.filter((rule) => rule.approval !== "deny" && rule.scope !== "none").map((rule) => rule.permission),
		rules,
		sessionId: row.session_id,
		isOwner: owner || row.role_key === "owner"
	};
}
async function getAdminSessionServer() {
	const identity = await currentIdentity();
	return {
		configured: adminConfigured(),
		authenticated: Boolean(identity),
		user: identity
	};
}
var attempts = /* @__PURE__ */ new Map();
async function adminLoginServer(data) {
	assertSameSiteRequest();
	const sql = await ensureAccessSchema();
	await seedRoles();
	const { ip, userAgent } = requestMeta();
	const now = Date.now();
	const attempt = attempts.get(ip);
	if (attempt && attempt.resetAt > now && attempt.count >= 5) return {
		ok: false,
		error: "Çok fazla deneme. 15 dakika sonra yeniden deneyin."
	};
	if (!adminConfigured()) return {
		ok: false,
		error: "Yönetim erişimi henüz yapılandırılmadı."
	};
	const username = data.username?.trim().toLocaleLowerCase("tr-TR") ?? "";
	let userId = null;
	let actorName = "Sahip";
	let roleKey = "owner";
	let success = false;
	let reason = "Parola hatalı";
	if (!username && equalSecret(data.password, process.env.SWEB_ADMIN_PASSWORD?.trim() ?? "")) success = true;
	else if (username) {
		const user = (await sql`
      select u.id::text, u.display_name, u.password_salt, u.password_hash, u.active, u.locked, r.role_key, u.two_factor_required, u.two_factor_secret
      from admin_users u join admin_roles r on r.id=u.role_id where lower(u.username)=lower(${username}) limit 1
    `)[0];
		if (!user) reason = "Kullanıcı bulunamadı";
		else if (!user.active) reason = "Kullanıcı pasif";
		else if (user.locked) reason = "Kullanıcı kilitli";
		else if (verifyPassword(data.password, user.password_salt, user.password_hash)) {
			if (user.two_factor_required) {
				let secret = user.two_factor_secret;
				if (!secret) {
					secret = base32Encode(randomBytes(20));
					await sql`update admin_users set two_factor_secret=${secret},updated_at=now() where id=${user.id}::uuid`;
				}
				if (!data.otp || !verifyTotp(secret, data.otp.replace(/\s/g, ""))) {
					await sql`insert into admin_login_events (user_id, username, success, ip, user_agent, reason) values (${user.id}::uuid, ${username}, false, ${ip}, ${userAgent}, ${data.otp ? "2FA kodu hatalı" : "2FA kodu bekleniyor"})`;
					return {
						ok: false,
						twoFactorRequired: true,
						setupSecret: user.two_factor_secret ? void 0 : secret,
						setupUri: user.two_factor_secret ? void 0 : `otpauth://totp/Sweb:${encodeURIComponent(username)}?secret=${secret}&issuer=Sweb`,
						error: data.otp ? "Doğrulama kodu hatalı." : "Doğrulama kodunu girin."
					};
				}
			}
			success = true;
			userId = user.id;
			actorName = user.display_name;
			roleKey = user.role_key;
		}
	}
	await sql`insert into admin_login_events (user_id, username, success, ip, user_agent, reason) values (${userId}::uuid, ${username || "owner"}, ${success}, ${ip}, ${userAgent}, ${success ? null : reason})`;
	if (!success) {
		attempts.set(ip, {
			count: attempt && attempt.resetAt > now ? attempt.count + 1 : 1,
			resetAt: now + 9e5
		});
		return {
			ok: false,
			error: reason === "Parola hatalı" ? "Kullanıcı adı veya parola hatalı." : reason
		};
	}
	attempts.delete(ip);
	const token = randomBytes(32).toString("base64url");
	await sql`insert into admin_sessions (id, token_hash, user_id, actor_name, role_key, ip, user_agent, expires_at) values (${randomUUID()}::uuid, ${tokenHash(token)}, ${userId}::uuid, ${actorName}, ${roleKey}, ${ip}, ${userAgent}, now() + interval '8 hours')`;
	if (userId) await sql`update admin_users set last_login_at=now() where id=${userId}::uuid`;
	setCookie$1(COOKIE_NAME, token, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
		maxAge: SESSION_SECONDS
	});
	return { ok: true };
}
async function adminLogoutServer() {
	assertSameSiteRequest();
	const token = getCookie(COOKIE_NAME);
	if (token) await (await getSql())`update admin_sessions set revoked_at=now() where token_hash=${tokenHash(token)}`;
	setCookie$1(COOKIE_NAME, "", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
		maxAge: 0
	});
	return { ok: true };
}
async function requireAdmin() {
	assertSameSiteRequest();
	const identity = await currentIdentity();
	if (!identity) throw new Error("Unauthorized");
	return identity;
}
async function requirePermission(permission, context) {
	const identity = await requireAdmin();
	if (identity.isOwner) return identity;
	const rule = identity.rules.find((x) => x.permission === permission);
	if (!rule || rule.scope === "none" || rule.approval === "deny") throw new Error("Bu işlem için yetkiniz yok.");
	const action = permission.split(".")[1] ?? "";
	const readAction = action === "view" || action.startsWith("view_") || [
		"sales",
		"orders",
		"customers",
		"quotes",
		"traffic",
		"activity",
		"stock_alerts"
	].includes(action);
	if (rule.scope === "view_only" && !readAction) throw new Error("Bu yetki yalnızca görüntüleme kapsamındadır.");
	if (rule.scope === "own" && context?.ownerId !== identity.id) throw new Error("Yalnızca kendinize ait kayıtları yönetebilirsiniz.");
	if (rule.scope === "assigned" && context?.assignedId !== identity.id) throw new Error("Yalnızca size atanmış kayıtları yönetebilirsiniz.");
	const scopedValue = rule.scopeValue ?? "";
	if (rule.scope === "category" && context?.category !== scopedValue) throw new Error("Bu kategori için yetkiniz yok.");
	if (rule.scope === "warehouse" && context?.warehouse !== scopedValue) throw new Error("Bu depo için yetkiniz yok.");
	if (rule.scope === "brand" && context?.brand !== scopedValue) throw new Error("Bu marka için yetkiniz yok.");
	if (rule.scope === "customer_group" && context?.customerGroup !== scopedValue) throw new Error("Bu müşteri grubu için yetkiniz yok.");
	if (rule.scope === "sales_channel" && context?.salesChannel !== scopedValue) throw new Error("Bu satış kanalı için yetkiniz yok.");
	if (rule.approval === "require_approval") {
		const sql = await getSql();
		const hash = payloadHash(context?.payload);
		const approved = await sql`
      select id::text from admin_approval_requests
      where requested_by=${identity.id}::uuid and permission_key=${permission}
        and resource_type=${context?.resourceType ?? "system"}
        and coalesce(resource_id,'')=coalesce(${context?.resourceId ?? null},'')
        and payload_hash=${hash} and status='approved' and consumed_at is null
      order by reviewed_at desc limit 1
    `;
		if (approved[0]) {
			await sql`update admin_approval_requests set consumed_at=now() where id=${approved[0].id}::uuid`;
			return identity;
		}
		await sql`
      insert into admin_approval_requests (id, requested_by, requester_name, permission_key, resource_type, resource_id, payload, payload_hash)
      select ${randomUUID()}::uuid, ${identity.id}::uuid, ${identity.displayName}, ${permission}, ${context?.resourceType ?? "system"}, ${context?.resourceId ?? null}, ${JSON.stringify(context?.payload ?? null)}::jsonb, ${hash}
      where not exists (
        select 1 from admin_approval_requests where requested_by=${identity.id}::uuid and permission_key=${permission}
          and resource_type=${context?.resourceType ?? "system"} and coalesce(resource_id,'')=coalesce(${context?.resourceId ?? null},'')
          and payload_hash=${hash} and status='pending'
      )
    `;
		throw new Error("İşlem yönetici onayına gönderildi.");
	}
	return identity;
}
async function requireListPermission(permission) {
	const identity = await requireAdmin();
	if (identity.isOwner) return {
		identity,
		rule: {
			permission,
			scope: "all",
			approval: "allow"
		}
	};
	const rule = identity.rules.find((x) => x.permission === permission);
	if (!rule || rule.scope === "none" || rule.approval === "deny") throw new Error("Bu alanı görüntüleme yetkiniz yok.");
	return {
		identity,
		rule
	};
}
async function requireAnyPermission(permissions, context) {
	const identity = await requireAdmin();
	if (identity.isOwner) return identity;
	const allowed = identity.rules.find((rule) => permissions.includes(rule.permission) && rule.scope !== "none" && rule.approval === "allow");
	if (allowed) return requirePermission(allowed.permission, context);
	const approval = identity.rules.find((rule) => permissions.includes(rule.permission) && rule.scope !== "none" && rule.approval === "require_approval");
	if (approval) return requirePermission(approval.permission, context);
	throw new Error("Bu işlem için yetkiniz yok.");
}
async function logAdminActivity(identity, data) {
	const sql = await getSql();
	const { ip, userAgent } = requestMeta();
	await sql`insert into admin_activity_log (actor_id, actor_name, permission_key, action, resource_type, resource_id, before_state, after_state, ip, user_agent) values (${identity.id}::uuid, ${identity.displayName}, ${data.permission}, ${data.action}, ${data.resourceType}, ${data.resourceId ?? null}, ${JSON.stringify(data.before ?? null)}::jsonb, ${JSON.stringify(data.after ?? null)}::jsonb, ${ip}, ${userAgent})`;
}
async function getAccessDataServer() {
	const identity = await requireAdmin();
	const sql = await getSql();
	await seedRoles();
	const canRoles = identity.isOwner || identity.permissions.includes("roles.view");
	const canUsers = identity.isOwner || identity.permissions.includes("users.view");
	const canLogs = identity.isOwner || identity.permissions.includes("logs.view") || identity.permissions.includes("security.view_logins");
	const canApprovals = identity.isOwner || identity.permissions.includes("approvals.view");
	return {
		roles: canRoles ? await sql`select id::text, role_key, name, description, is_system, rules, updated_at::text from admin_roles order by is_system desc, name` : [],
		users: canUsers ? await sql`select u.id::text,u.username,u.display_name,u.active,u.locked,u.two_factor_required,u.role_id::text,r.name role_name,u.last_login_at::text from admin_users u join admin_roles r on r.id=u.role_id order by u.display_name` : [],
		sessions: canLogs ? await sql`select id::text,actor_name,role_key,ip,user_agent,created_at::text,expires_at::text,revoked_at::text from admin_sessions order by created_at desc limit 100` : [],
		logins: canLogs ? await sql`select id::text,username,success,ip,user_agent,reason,created_at::text from admin_login_events order by created_at desc limit 100` : [],
		activity: canLogs ? await sql`select id::text,actor_name,permission_key,action,resource_type,resource_id,ip,user_agent,created_at::text from admin_activity_log order by created_at desc limit 200` : [],
		approvals: canApprovals ? await sql`select id::text,requester_name,permission_key,resource_type,resource_id,status,reviewer_name,review_note,created_at::text,reviewed_at::text from admin_approval_requests order by created_at desc limit 200` : []
	};
}
async function saveRoleServer(data) {
	const permission = data.id ? "roles.edit" : "roles.create";
	const identity = await requirePermission(permission, {
		resourceType: "role",
		resourceId: data.id,
		payload: data
	});
	const rules = normalizeRules(data.rules);
	const sql = await getSql();
	const id = data.id ?? randomUUID();
	if (data.id) {
		const old = await sql`select role_key,name,description,rules from admin_roles where id=${id}::uuid`;
		if (!old[0] || old[0].role_key === "owner") throw new Error("Sahip rolü değiştirilemez.");
		await sql`update admin_roles set name=${data.name},description=${data.description},rules=${JSON.stringify(rules)}::jsonb,updated_at=now() where id=${id}::uuid`;
		await logAdminActivity(identity, {
			permission,
			action: "role.update",
			resourceType: "role",
			resourceId: id,
			before: old[0],
			after: {
				name: data.name,
				description: data.description,
				rules
			}
		});
	} else {
		await sql`insert into admin_roles (id,role_key,name,description,is_system,rules) values (${id}::uuid,${`custom_${randomBytes(6).toString("hex")}`},${data.name},${data.description},false,${JSON.stringify(rules)}::jsonb)`;
		await logAdminActivity(identity, {
			permission,
			action: "role.create",
			resourceType: "role",
			resourceId: id,
			after: {
				name: data.name,
				description: data.description,
				rules
			}
		});
	}
	return {
		ok: true,
		id
	};
}
async function deleteRoleServer(id) {
	const identity = await requirePermission("roles.delete", {
		resourceType: "role",
		resourceId: id,
		payload: { id }
	});
	const sql = await getSql();
	const old = await sql`select role_key,name from admin_roles where id=${id}::uuid`;
	if (!old[0] || old[0].role_key === "owner" || old[0].role_key === "manager") throw new Error("Bu sistem rolü silinemez.");
	if (((await sql`select count(*)::int count from admin_users where role_id=${id}::uuid`)[0]?.count ?? 0) > 0) throw new Error("Bu role atanmış kullanıcılar var.");
	await sql`delete from admin_roles where id=${id}::uuid`;
	await logAdminActivity(identity, {
		permission: "roles.delete",
		action: "role.delete",
		resourceType: "role",
		resourceId: id,
		before: old[0]
	});
	return { ok: true };
}
async function saveUserServer(data) {
	const permission = data.id ? "users.edit" : "users.create";
	const identity = await requirePermission(permission, {
		resourceType: "user",
		resourceId: data.id,
		payload: {
			...data,
			password: data.password ? "[set]" : void 0
		}
	});
	const sql = await getSql();
	const role = await sql`select role_key from admin_roles where id=${data.roleId}::uuid`;
	if (!role[0]) throw new Error("Rol bulunamadı.");
	if (role[0].role_key === "owner" && !identity.isOwner) throw new Error("Sahip rolünü yalnızca sahip atayabilir.");
	const id = data.id ?? randomUUID();
	if (data.id) {
		const old = await sql`select username,display_name,role_id::text,active,locked,two_factor_required from admin_users where id=${id}::uuid`;
		if (!old[0]) throw new Error("Kullanıcı bulunamadı.");
		await sql`update admin_users set username=${data.username.toLowerCase()},display_name=${data.displayName},role_id=${data.roleId}::uuid,active=${data.active},locked=${data.locked},two_factor_required=${data.twoFactorRequired},updated_at=now() where id=${id}::uuid`;
		if (data.password) {
			const next = hashPassword(data.password);
			await sql`update admin_users set password_salt=${next.salt},password_hash=${next.hash} where id=${id}::uuid`;
			await sql`update admin_sessions set revoked_at=now() where user_id=${id}::uuid and revoked_at is null`;
		}
		await logAdminActivity(identity, {
			permission,
			action: "user.update",
			resourceType: "user",
			resourceId: id,
			before: old[0],
			after: {
				username: data.username,
				displayName: data.displayName,
				roleId: data.roleId,
				active: data.active,
				locked: data.locked,
				twoFactorRequired: data.twoFactorRequired,
				passwordChanged: Boolean(data.password)
			}
		});
	} else {
		if (!data.password || data.password.length < 10) throw new Error("Yeni kullanıcı parolası en az 10 karakter olmalı.");
		const next = hashPassword(data.password);
		await sql`insert into admin_users (id,username,display_name,password_salt,password_hash,role_id,active,locked,two_factor_required) values (${id}::uuid,${data.username.toLowerCase()},${data.displayName},${next.salt},${next.hash},${data.roleId}::uuid,${data.active},${data.locked},${data.twoFactorRequired})`;
		await logAdminActivity(identity, {
			permission,
			action: "user.create",
			resourceType: "user",
			resourceId: id,
			after: {
				username: data.username,
				displayName: data.displayName,
				roleId: data.roleId
			}
		});
	}
	return {
		ok: true,
		id
	};
}
async function deleteUserServer(id) {
	const identity = await requirePermission("users.delete", {
		resourceType: "user",
		resourceId: id,
		payload: { id }
	});
	if (identity.id === id) throw new Error("Kendi kullanıcınızı silemezsiniz.");
	const sql = await getSql();
	const old = await sql`select username,display_name from admin_users where id=${id}::uuid`;
	if (!old[0]) throw new Error("Kullanıcı bulunamadı.");
	await sql`delete from admin_users where id=${id}::uuid`;
	await logAdminActivity(identity, {
		permission: "users.delete",
		action: "user.delete",
		resourceType: "user",
		resourceId: id,
		before: old[0]
	});
	return { ok: true };
}
async function revokeSessionServer(id) {
	const identity = await requirePermission("security.revoke_session", {
		resourceType: "session",
		resourceId: id,
		payload: { id }
	});
	await (await getSql())`update admin_sessions set revoked_at=now() where id=${id}::uuid`;
	await logAdminActivity(identity, {
		permission: "security.revoke_session",
		action: "session.revoke",
		resourceType: "session",
		resourceId: id
	});
	return { ok: true };
}
async function reviewApprovalServer(data) {
	const identity = await requirePermission(data.status === "approved" ? "approvals.approve" : "approvals.reject");
	await (await getSql())`update admin_approval_requests set status=${data.status},reviewed_by=${identity.id}::uuid,reviewer_name=${identity.displayName},review_note=${data.note || null},reviewed_at=now() where id=${data.id}::uuid and status='pending'`;
	await logAdminActivity(identity, {
		permission: data.status === "approved" ? "approvals.approve" : "approvals.reject",
		action: `approval.${data.status}`,
		resourceType: "approval",
		resourceId: data.id,
		after: data
	});
	return { ok: true };
}
//#endregion
export { adminConfigured, adminLoginServer, adminLogoutServer, deleteRoleServer, deleteUserServer, getAccessDataServer, getAdminSessionServer, logAdminActivity, requireAdmin, requireAnyPermission, requireListPermission, requirePermission, reviewApprovalServer, revokeSessionServer, saveRoleServer, saveUserServer };
