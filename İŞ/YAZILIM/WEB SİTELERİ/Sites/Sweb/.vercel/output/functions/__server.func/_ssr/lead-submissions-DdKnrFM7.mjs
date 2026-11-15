import { c as object, d as union, i as boolean, l as record, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lead-submissions-DdKnrFM7.js
var leadInput = object({
	type: _enum([
		"contact",
		"quote",
		"complaint",
		"visit",
		"newsletter",
		"withdrawal",
		"design"
	]),
	title: string().trim().min(2).max(160),
	email: string().trim().email().max(254),
	trap: string().max(200).optional(),
	data: record(string().max(60), union([
		string().max(4e3),
		number().finite(),
		boolean()
	])).refine((value) => Object.keys(value).length <= 30)
});
var submitLead_createServerFn_handler = createServerRpc({
	id: "b318ff381073ccee96a3ac38fc741ae5df0a62e53decbed1c7fa2f3f184b4142",
	name: "submitLead",
	filename: "src/lib/lead-submissions.ts"
}, (opts) => submitLead.__executeServer(opts));
var submitLead = createServerFn({ method: "POST" }).validator((input) => leadInput.parse(input)).handler(submitLead_createServerFn_handler, async ({ data }) => {
	const { submitLeadServer } = await import("./lead-submissions.server-DVuC_xxV.mjs");
	return submitLeadServer(data);
});
//#endregion
export { submitLead_createServerFn_handler };
