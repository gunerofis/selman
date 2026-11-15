import { i as PERMISSION_MODULES } from "./admin-permissions-CglL3D63.mjs";
import { c as object, i as boolean, o as literal, r as array, t as _enum, u as string } from "../_libs/zod.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-access-D4uPZN-9.js
var scope = _enum([
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
]);
var approval = _enum([
	"allow",
	"require_approval",
	"deny"
]);
var rule = object({
	permission: string().max(100),
	scope,
	scopeValue: string().max(120).optional(),
	approval
});
var getAdminAccessData_createServerFn_handler = createServerRpc({
	id: "b5bcfd26b29f5839446a228e4f3fa35096bf5cf11519c3a68d204744c5767c9c",
	name: "getAdminAccessData",
	filename: "src/lib/admin-access.ts"
}, (opts) => getAdminAccessData.__executeServer(opts));
var getAdminAccessData = createServerFn({ method: "GET" }).handler(getAdminAccessData_createServerFn_handler, async () => {
	const { getAccessDataServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return getAccessDataServer();
});
var saveAdminRole_createServerFn_handler = createServerRpc({
	id: "bc58fa9e23d1fd50c4dd1411671e052e9e5c0e1ede9b5e292c907f3554689341",
	name: "saveAdminRole",
	filename: "src/lib/admin-access.ts"
}, (opts) => saveAdminRole.__executeServer(opts));
var saveAdminRole = createServerFn({ method: "POST" }).validator((input) => object({
	id: string().uuid().optional(),
	name: string().trim().min(2).max(80),
	description: string().trim().max(240),
	rules: array(rule).max(PERMISSION_MODULES.flatMap((x) => x.permissions).length)
}).parse(input)).handler(saveAdminRole_createServerFn_handler, async ({ data }) => {
	const { saveRoleServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return saveRoleServer(data);
});
var deleteAdminRole_createServerFn_handler = createServerRpc({
	id: "6e07483336c6f276a9fc8b8f784723d311901009a12763b949566f10bc51fe74",
	name: "deleteAdminRole",
	filename: "src/lib/admin-access.ts"
}, (opts) => deleteAdminRole.__executeServer(opts));
var deleteAdminRole = createServerFn({ method: "POST" }).validator((input) => object({ id: string().uuid() }).parse(input)).handler(deleteAdminRole_createServerFn_handler, async ({ data }) => {
	const { deleteRoleServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return deleteRoleServer(data.id);
});
var saveAdminUser_createServerFn_handler = createServerRpc({
	id: "724936165a1dbbabfba75c1285ed78d1776278b82aaaba69759f1d9467d9c7a9",
	name: "saveAdminUser",
	filename: "src/lib/admin-access.ts"
}, (opts) => saveAdminUser.__executeServer(opts));
var saveAdminUser = createServerFn({ method: "POST" }).validator((input) => object({
	id: string().uuid().optional(),
	username: string().trim().min(3).max(60).regex(/^[a-zA-Z0-9._-]+$/),
	displayName: string().trim().min(2).max(100),
	password: string().min(10).max(256).optional().or(literal("")),
	roleId: string().uuid(),
	active: boolean(),
	locked: boolean(),
	twoFactorRequired: boolean()
}).parse(input)).handler(saveAdminUser_createServerFn_handler, async ({ data }) => {
	const { saveUserServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return saveUserServer(data);
});
var deleteAdminUser_createServerFn_handler = createServerRpc({
	id: "cc0cd5a8a8efce8dc1f0c233b2a9e43579fe79240fd1102cc7435f030ac728c8",
	name: "deleteAdminUser",
	filename: "src/lib/admin-access.ts"
}, (opts) => deleteAdminUser.__executeServer(opts));
var deleteAdminUser = createServerFn({ method: "POST" }).validator((input) => object({ id: string().uuid() }).parse(input)).handler(deleteAdminUser_createServerFn_handler, async ({ data }) => {
	const { deleteUserServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return deleteUserServer(data.id);
});
var revokeAdminSession_createServerFn_handler = createServerRpc({
	id: "ada222f7bf3cb7354ccffd70c03fd2adfc6536fc5e6727e80a339bdf234a001a",
	name: "revokeAdminSession",
	filename: "src/lib/admin-access.ts"
}, (opts) => revokeAdminSession.__executeServer(opts));
var revokeAdminSession = createServerFn({ method: "POST" }).validator((input) => object({ id: string().uuid() }).parse(input)).handler(revokeAdminSession_createServerFn_handler, async ({ data }) => {
	const { revokeSessionServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return revokeSessionServer(data.id);
});
var reviewAdminApproval_createServerFn_handler = createServerRpc({
	id: "c9fc8f57268e9f82f6992ee470abfd04cf7df771178c3df83a26f80e16e6a873",
	name: "reviewAdminApproval",
	filename: "src/lib/admin-access.ts"
}, (opts) => reviewAdminApproval.__executeServer(opts));
var reviewAdminApproval = createServerFn({ method: "POST" }).validator((input) => object({
	id: string().uuid(),
	status: _enum(["approved", "rejected"]),
	note: string().trim().max(500)
}).parse(input)).handler(reviewAdminApproval_createServerFn_handler, async ({ data }) => {
	const { reviewApprovalServer } = await import("./admin-access.server-DrHauVYy.mjs");
	return reviewApprovalServer(data);
});
//#endregion
export { deleteAdminRole_createServerFn_handler, deleteAdminUser_createServerFn_handler, getAdminAccessData_createServerFn_handler, reviewAdminApproval_createServerFn_handler, revokeAdminSession_createServerFn_handler, saveAdminRole_createServerFn_handler, saveAdminUser_createServerFn_handler };
