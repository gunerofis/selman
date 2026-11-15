import { o as siteConfigSchema, t as DEFAULT_SITE_CONFIG } from "./site-config-BWq3LIpj.mjs";
import { n as getDbSource, r as getSql } from "./db-B_lsxeMu.mjs";
import { logAdminActivity, requireAnyPermission } from "./admin-access.server-DrHauVYy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-config.server-CS_UsL07.js
function normalizeConfig(config) {
	const email = config.identity.email === "selam@sweb.co" ? DEFAULT_SITE_CONFIG.identity.email : config.identity.email;
	return {
		...config,
		identity: {
			...config.identity,
			tagline: DEFAULT_SITE_CONFIG.identity.tagline,
			email,
			legalEmail: email,
			phone: config.identity.phone || DEFAULT_SITE_CONFIG.identity.phone,
			atelier: config.identity.atelier === "Bomonti, Şişli · İstanbul" ? DEFAULT_SITE_CONFIG.identity.atelier : config.identity.atelier,
			legalName: config.identity.legalName || DEFAULT_SITE_CONFIG.identity.legalName,
			mersisNumber: config.identity.mersisNumber || DEFAULT_SITE_CONFIG.identity.mersisNumber,
			taxOffice: config.identity.taxOffice || DEFAULT_SITE_CONFIG.identity.taxOffice,
			taxNumber: config.identity.taxNumber || DEFAULT_SITE_CONFIG.identity.taxNumber,
			legalAddress: config.identity.legalAddress || DEFAULT_SITE_CONFIG.identity.legalAddress
		},
		storefront: {
			...config.storefront,
			heroTitle: DEFAULT_SITE_CONFIG.storefront.heroTitle,
			announcement: config.storefront.announcement.replace("₺1.500 ve üzeri kargo yok", "₺1.500 üzeri kargo ücretsiz")
		},
		seo: {
			...config.seo,
			defaultTitle: DEFAULT_SITE_CONFIG.seo.defaultTitle,
			defaultDescription: DEFAULT_SITE_CONFIG.seo.defaultDescription,
			socialImage: config.seo.socialImage === "/clik/s-8008.jpg" ? "/clik/s-8008.webp" : config.seo.socialImage
		},
		links: config.links.filter((link) => ![
			"/setler",
			"/ofis",
			"/organizer",
			"/hediye-setleri",
			"/baby",
			"/koleksiyon",
			"/kategori"
		].some((path) => link.path === path || link.path.startsWith(path + "/") || link.path.startsWith(path + "?")))
	};
}
async function read() {
	if (getDbSource() !== "neon") return DEFAULT_SITE_CONFIG;
	const rows = await (await getSql())`select value, updated_at::text from site_config where id = 'main'`;
	if (!rows[0]) return DEFAULT_SITE_CONFIG;
	const parsed = siteConfigSchema.safeParse({
		...rows[0].value,
		updatedAt: rows[0].updated_at
	});
	return parsed.success ? normalizeConfig(parsed.data) : DEFAULT_SITE_CONFIG;
}
function getPublicSiteConfigServer() {
	return read();
}
async function getAdminSiteConfigServer() {
	await requireAnyPermission([
		"settings.view",
		"content.view",
		"seo.edit",
		"theme.edit_menu",
		"theme.edit_footer"
	]);
	return read();
}
async function saveAdminSiteConfigServer(data) {
	const previous = await read();
	const changedIdentity = JSON.stringify(previous.identity) !== JSON.stringify(data.identity) || JSON.stringify(previous.storefront) !== JSON.stringify(data.storefront);
	const changedLinks = JSON.stringify(previous.links) !== JSON.stringify(data.links);
	const changedSeo = JSON.stringify(previous.seo) !== JSON.stringify(data.seo);
	let identity = await requireAnyPermission([
		"settings.view",
		"content.view",
		"seo.edit",
		"theme.edit_menu",
		"theme.edit_footer"
	]);
	if (changedIdentity) identity = await requireAnyPermission(["settings.edit", "content.edit"], {
		resourceType: "site",
		resourceId: "config",
		payload: data
	});
	if (changedLinks) identity = await requireAnyPermission([
		"content.manage_menu",
		"theme.edit_menu",
		"theme.edit_footer",
		"settings.edit"
	], {
		resourceType: "site",
		resourceId: "navigation",
		payload: data.links
	});
	if (changedSeo) identity = await requireAnyPermission([
		"seo.edit",
		"seo.edit_title",
		"seo.edit_description",
		"settings.edit"
	], {
		resourceType: "site",
		resourceId: "seo",
		payload: data.seo
	});
	const sql = await getSql();
	const clean = {
		...data,
		updatedAt: null
	};
	await sql`
    with previous as (
      select value from site_config where id = 'main'
    ), changed as (
      insert into site_config (id, value, updated_by, updated_at)
      values ('main', ${JSON.stringify(clean)}::jsonb, 'admin', now())
      on conflict (id) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()
      returning value, updated_at
    )
    insert into catalog_admin_audit (product_key, action, before_state, after_state, actor)
    select 'site:config', 'site_config_update',
           (select value from previous), changed.value, 'admin'
    from changed
  `;
	await logAdminActivity(identity, {
		permission: "settings.edit",
		action: "site.config_update",
		resourceType: "site",
		resourceId: "config",
		after: clean
	});
	return read();
}
//#endregion
export { getAdminSiteConfigServer, getPublicSiteConfigServer, saveAdminSiteConfigServer };
