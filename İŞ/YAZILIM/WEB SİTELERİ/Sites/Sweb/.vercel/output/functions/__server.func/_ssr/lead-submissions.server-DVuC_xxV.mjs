import { i as getRequest } from "./ssr.mjs";
import { r as getSql, t as assertSameSiteRequest } from "./db-B_lsxeMu.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/lead-submissions.server-DVuC_xxV.js
var target = {
	contact: {
		module: "forms",
		status: "new",
		permission: "forms.view_contact"
	},
	complaint: {
		module: "forms",
		status: "new",
		permission: "forms.view_complaints"
	},
	visit: {
		module: "forms",
		status: "new",
		permission: "forms.view_contact"
	},
	withdrawal: {
		module: "forms",
		status: "new",
		permission: "forms.view_contact"
	},
	quote: {
		module: "quotes",
		status: "new",
		permission: "quotes.view"
	},
	design: {
		module: "custom_production",
		status: "new",
		permission: "custom_production.view"
	},
	newsletter: {
		module: "newsletter",
		status: "active",
		permission: "newsletter.view_subscribers"
	}
};
async function submitLeadServer(data) {
	assertSameSiteRequest();
	if (data.trap?.trim()) return {
		ok: true,
		reference: "received"
	};
	if (data.type === "newsletter" && data.data.consent !== true) throw new Error("Bülten kaydı için ileti onayı gereklidir.");
	const sql = await getSql();
	const request = getRequest();
	const ip = request?.headers.get("cf-connecting-ip") ?? request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
	if (((await sql`
    select count(*)::int count from admin_records
    where module=${target[data.type].module} and data->>'email'=${data.email.toLowerCase()}
      and created_at > now() - interval '2 minutes'
  `)[0]?.count ?? 0) >= 3) throw new Error("Çok sık gönderim yapıldı. Biraz bekleyin.");
	const id = randomUUID();
	const reference = `${data.type.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
	const recordData = {
		...data.data,
		email: data.email.toLowerCase(),
		formType: data.type
	};
	await sql`
    insert into admin_records (id,module,title,reference,status,data,sales_channel)
    values (${id}::uuid,${target[data.type].module},${data.title},${reference},${target[data.type].status},${JSON.stringify(recordData)}::jsonb,'web')
  `;
	await sql`
    insert into admin_activity_log
      (actor_id,actor_name,permission_key,action,resource_type,resource_id,before_state,after_state,ip,user_agent)
    values (null,'Site formu',${target[data.type].permission},${"form.submit"},${target[data.type].module},${id},null,
      ${JSON.stringify({
		type: data.type,
		reference
	})}::jsonb,${ip},${request?.headers.get("user-agent")?.slice(0, 500) ?? "unknown"})
  `;
	return {
		ok: true,
		reference
	};
}
//#endregion
export { submitLeadServer };
