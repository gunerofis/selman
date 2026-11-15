import { c as object, r as array, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-admin-D2QCqMPW.js
var getPublicLines_createServerFn_handler = createServerRpc({
	id: "8cb24677bf2ff76713790da4c277df8e16f17b3357fe0d45723a034c6fb51925",
	name: "getPublicLines",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => getPublicLines.__executeServer(opts));
var getPublicLines = createServerFn({ method: "GET" }).handler(getPublicLines_createServerFn_handler, async () => {
	const { getPublicLinesServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return getPublicLinesServer();
});
var getAdminSession_createServerFn_handler = createServerRpc({
	id: "76579c36afc6a4745b80e947c748ca4e452a6af2e5e69832771e8b79bf87a29f",
	name: "getAdminSession",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => getAdminSession.__executeServer(opts));
var getAdminSession = createServerFn({ method: "GET" }).handler(getAdminSession_createServerFn_handler, async () => {
	const { getAdminSessionServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return getAdminSessionServer();
});
var loginSchema = object({
	username: string().trim().max(60).optional(),
	password: string().min(1).max(256),
	otp: string().trim().max(12).optional()
});
var adminLogin_createServerFn_handler = createServerRpc({
	id: "1de1b985d2e8775b1c71da3aef685c3ce976ffdac514029f9973c518b6de863b",
	name: "adminLogin",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => adminLogin.__executeServer(opts));
var adminLogin = createServerFn({ method: "POST" }).validator((input) => loginSchema.parse(input)).handler(adminLogin_createServerFn_handler, async ({ data }) => {
	const { adminLoginServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return adminLoginServer(data);
});
var adminLogout_createServerFn_handler = createServerRpc({
	id: "c6d1033eee4922688d0c24d2fb940709f6f4fe2635d9dae3ac8cc6f6f2d8573d",
	name: "adminLogout",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => adminLogout.__executeServer(opts));
var adminLogout = createServerFn({ method: "POST" }).handler(adminLogout_createServerFn_handler, async () => {
	const { adminLogoutServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return adminLogoutServer();
});
var getAdminCatalog_createServerFn_handler = createServerRpc({
	id: "22307effeb6eca6700b36b735325ff89507fac21f318963ab436fea652cb846e",
	name: "getAdminCatalog",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => getAdminCatalog.__executeServer(opts));
var getAdminCatalog = createServerFn({ method: "GET" }).handler(getAdminCatalog_createServerFn_handler, async () => {
	const { getAdminCatalogServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return getAdminCatalogServer();
});
var getAdminAudit_createServerFn_handler = createServerRpc({
	id: "e70a50d5e17c2c955fb61858228592af23a1f1148e569582ec5f407d229ebba1",
	name: "getAdminAudit",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => getAdminAudit.__executeServer(opts));
var getAdminAudit = createServerFn({ method: "GET" }).handler(getAdminAudit_createServerFn_handler, async () => {
	const { getAdminAuditServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return getAdminAuditServer();
});
var updateSchema = object({
	productKey: string().min(3).max(180),
	name: string().trim().min(2).max(120),
	price: number().min(0).max(99999999).nullable(),
	status: _enum([
		"active",
		"inactive",
		"archived"
	]),
	seoTitle: string().trim().max(70),
	seoDescription: string().trim().max(170),
	imageAlt: string().trim().min(2).max(160)
});
var updateAdminProduct_createServerFn_handler = createServerRpc({
	id: "63226103c72526c6e368a87277b7c8ea26dd55a26047359d588ee5fccea736d5",
	name: "updateAdminProduct",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => updateAdminProduct.__executeServer(opts));
var updateAdminProduct = createServerFn({ method: "POST" }).validator((input) => updateSchema.parse(input)).handler(updateAdminProduct_createServerFn_handler, async ({ data }) => {
	const { updateAdminProductServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return updateAdminProductServer(data);
});
var bulkStatusSchema = object({
	productKeys: array(string().min(3).max(180)).min(1).max(100),
	status: _enum([
		"active",
		"inactive",
		"archived"
	])
});
var bulkUpdateAdminProducts_createServerFn_handler = createServerRpc({
	id: "de17b5c2d81ed2c31f386ad7c810870b596177252d16658d394739f2bb20a695",
	name: "bulkUpdateAdminProducts",
	filename: "src/lib/catalog-admin.ts"
}, (opts) => bulkUpdateAdminProducts.__executeServer(opts));
var bulkUpdateAdminProducts = createServerFn({ method: "POST" }).validator((input) => bulkStatusSchema.parse(input)).handler(bulkUpdateAdminProducts_createServerFn_handler, async ({ data }) => {
	const { bulkUpdateAdminProductsServer } = await import("./catalog-admin.server-qad7ApFr.mjs");
	return bulkUpdateAdminProductsServer(data);
});
//#endregion
export { adminLogin_createServerFn_handler, adminLogout_createServerFn_handler, bulkUpdateAdminProducts_createServerFn_handler, getAdminAudit_createServerFn_handler, getAdminCatalog_createServerFn_handler, getAdminSession_createServerFn_handler, getPublicLines_createServerFn_handler, updateAdminProduct_createServerFn_handler };
