import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as cn } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-notice-CE5NZMKQ.js
var import_jsx_runtime = require_jsx_runtime();
/** Baymard: mark required and optional; keep the label visible; hint next to the field. */
function FormField({ label, required, optional, hint, error, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor,
				className: "text-sm",
				children: [
					label,
					required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg-muted",
						children: " · zorunlu"
					}) : null,
					optional ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg-muted",
						children: " · isteğe bağlı"
					}) : null
				]
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: htmlFor ? `${htmlFor}-hata` : void 0,
				className: "text-xs text-danger",
				role: "alert",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-fg-muted",
				children: hint
			}) : null
		]
	});
}
function fieldBorder(error) {
	return cn(error && "border-danger");
}
function Notice({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "border border-dashed border-border bg-bg-wash px-3 py-2 text-sm text-fg-muted",
		children
	});
}
//#endregion
export { Notice as n, fieldBorder as r, FormField as t };
