import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/print-button-BbupOTeB.js
var import_jsx_runtime = require_jsx_runtime();
function PrintButton({ label = "Yazdır" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "outline",
		size: "sm",
		onClick: () => window.print(),
		children: label
	});
}
//#endregion
export { PrintButton as t };
