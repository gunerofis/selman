import { c as object, d as union, i as boolean, l as record, n as _null, o as literal, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-operations-DZGTJKhm.js
var moduleSchema = _enum([
	"quotes",
	"custom_production",
	"customers",
	"companies",
	"inventory",
	"warehouses",
	"production",
	"shipping",
	"pricing",
	"discounts",
	"blog",
	"reviews",
	"forms",
	"newsletter",
	"finance",
	"payment_settings",
	"delivery_settings",
	"tax",
	"domain",
	"integrations",
	"pixels",
	"media"
]);
var scalar = union([
	string().max(4e3),
	number().finite(),
	boolean(),
	_null()
]);
var recordInput = object({
	id: string().uuid().optional(),
	module: moduleSchema,
	title: string().trim().min(2).max(160),
	reference: string().trim().max(80).optional().or(literal("")),
	status: string().trim().min(2).max(40).regex(/^[a-z0-9_]+$/),
	data: record(string().max(60), scalar).refine((value) => Object.keys(value).length <= 30),
	assignedId: string().uuid().nullable().optional(),
	category: string().trim().max(100).optional().or(literal("")),
	warehouse: string().trim().max(100).optional().or(literal("")),
	brand: string().trim().max(100).optional().or(literal("")),
	customerGroup: string().trim().max(100).optional().or(literal("")),
	salesChannel: string().trim().max(100).optional().or(literal(""))
});
var getAdminOperations_createServerFn_handler = createServerRpc({
	id: "62e8d7f3cfd720a1d86e4d69c6464ceb0a46c6365547f52665b65c8fd6644a09",
	name: "getAdminOperations",
	filename: "src/lib/admin-operations.ts"
}, (opts) => getAdminOperations.__executeServer(opts));
var getAdminOperations = createServerFn({ method: "GET" }).handler(getAdminOperations_createServerFn_handler, async () => {
	const { getAdminOperationsServer } = await import("./admin-operations.server-Drbec5iw.mjs");
	return getAdminOperationsServer();
});
var saveAdminRecord_createServerFn_handler = createServerRpc({
	id: "dc9e9923ae895a4e1bc02cc2c42b09a4c71e8e5855b13dc7eb185ca8590adca7",
	name: "saveAdminRecord",
	filename: "src/lib/admin-operations.ts"
}, (opts) => saveAdminRecord.__executeServer(opts));
var saveAdminRecord = createServerFn({ method: "POST" }).validator((input) => recordInput.parse(input)).handler(saveAdminRecord_createServerFn_handler, async ({ data }) => {
	const { saveAdminRecordServer } = await import("./admin-operations.server-Drbec5iw.mjs");
	return saveAdminRecordServer(data);
});
var deleteAdminRecord_createServerFn_handler = createServerRpc({
	id: "281f14d7c844f3d12a3339f3a6d5fbbebd5816d80d874284dd9687b9e8a00075",
	name: "deleteAdminRecord",
	filename: "src/lib/admin-operations.ts"
}, (opts) => deleteAdminRecord.__executeServer(opts));
var deleteAdminRecord = createServerFn({ method: "POST" }).validator((input) => object({
	id: string().uuid(),
	module: moduleSchema
}).parse(input)).handler(deleteAdminRecord_createServerFn_handler, async ({ data }) => {
	const { deleteAdminRecordServer } = await import("./admin-operations.server-Drbec5iw.mjs");
	return deleteAdminRecordServer(data);
});
//#endregion
export { deleteAdminRecord_createServerFn_handler, getAdminOperations_createServerFn_handler, saveAdminRecord_createServerFn_handler };
