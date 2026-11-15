import { c as object, i as boolean, t as _enum, u as string } from "../_libs/zod.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-scripts-szuXuSRQ.js
var getPublicScripts_createServerFn_handler = createServerRpc({
	id: "918c94ef815cf2065018123c174db220f877daaefed9d77f20d82c0e3e331b5c",
	name: "getPublicScripts",
	filename: "src/lib/site-scripts.ts"
}, (opts) => getPublicScripts.__executeServer(opts));
var getPublicScripts = createServerFn({ method: "GET" }).handler(getPublicScripts_createServerFn_handler, async () => {
	const { getPublicScriptsServer } = await import("./site-scripts.server-BJOxNphO.mjs");
	return getPublicScriptsServer();
});
var getAdminScripts_createServerFn_handler = createServerRpc({
	id: "adc8586e0d4ceb873a09192e39e15dfb27e258daea67bf42013fe1d251450b0e",
	name: "getAdminScripts",
	filename: "src/lib/site-scripts.ts"
}, (opts) => getAdminScripts.__executeServer(opts));
var getAdminScripts = createServerFn({ method: "GET" }).handler(getAdminScripts_createServerFn_handler, async () => {
	const { getAdminScriptsServer } = await import("./site-scripts.server-BJOxNphO.mjs");
	return getAdminScriptsServer();
});
var scriptSchema = object({
	id: string().uuid().optional(),
	name: string().trim().min(2).max(80),
	placement: _enum(["head", "body"]),
	code: string().trim().min(3).max(2e4),
	active: boolean()
});
var saveAdminScript_createServerFn_handler = createServerRpc({
	id: "63013381dfa04e070ce680f64ce799367b9d6827c14e8b0a26e0403ddbf6814b",
	name: "saveAdminScript",
	filename: "src/lib/site-scripts.ts"
}, (opts) => saveAdminScript.__executeServer(opts));
var saveAdminScript = createServerFn({ method: "POST" }).validator((input) => scriptSchema.parse(input)).handler(saveAdminScript_createServerFn_handler, async ({ data }) => {
	const { saveAdminScriptServer } = await import("./site-scripts.server-BJOxNphO.mjs");
	return saveAdminScriptServer(data);
});
var deleteAdminScript_createServerFn_handler = createServerRpc({
	id: "1d83c97ca61c6ccd2cbb07dcffbec298e228dec29df96d7b4d98349ee6cc7026",
	name: "deleteAdminScript",
	filename: "src/lib/site-scripts.ts"
}, (opts) => deleteAdminScript.__executeServer(opts));
var deleteAdminScript = createServerFn({ method: "POST" }).validator((input) => object({ id: string().uuid() }).parse(input)).handler(deleteAdminScript_createServerFn_handler, async ({ data }) => {
	const { deleteAdminScriptServer } = await import("./site-scripts.server-BJOxNphO.mjs");
	return deleteAdminScriptServer(data.id);
});
//#endregion
export { deleteAdminScript_createServerFn_handler, getAdminScripts_createServerFn_handler, getPublicScripts_createServerFn_handler, saveAdminScript_createServerFn_handler };
