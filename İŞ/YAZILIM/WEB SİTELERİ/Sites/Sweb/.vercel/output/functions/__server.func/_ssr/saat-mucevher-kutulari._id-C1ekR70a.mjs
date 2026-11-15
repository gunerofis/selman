import { S as require_jsx_runtime, U as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as TO, b as Route$2, rt as useCatalogItem } from "./router-BRoH_qS_.mjs";
import { r as LineProduct } from "./line-catalog-DNcdcPlf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saat-mucevher-kutulari._id-C1ekR70a.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { id } = Route$2.useParams();
	const found = useCatalogItem(TO, id);
	if (!found) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineProduct, {
		line: found.line,
		item: found.item
	});
}
//#endregion
export { Page as component };
