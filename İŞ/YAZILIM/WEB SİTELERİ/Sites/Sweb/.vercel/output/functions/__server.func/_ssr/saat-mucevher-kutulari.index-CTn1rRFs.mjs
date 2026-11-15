import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { it as useCatalogLine, x as Route$3 } from "./router-BRoH_qS_.mjs";
import { i as LineShop } from "./line-catalog-DNcdcPlf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saat-mucevher-kutulari.index-CTn1rRFs.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { tur, goster } = Route$3.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineShop, {
		line: useCatalogLine("/saat-mucevher-kutulari"),
		initialFilter: tur,
		initialShown: goster
	});
}
//#endregion
export { Page as component };
