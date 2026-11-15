import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as useSiteConfig } from "./router-BRoH_qS_.mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/satici-CP-aCD9a.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { identity } = useSiteConfig();
	const rows = [
		["Resmî unvan", identity.legalName],
		["MERSİS", identity.mersisNumber],
		["Vergi dairesi", identity.taxOffice],
		["Vergi numarası", identity.taxNumber],
		["Adres", identity.legalAddress || identity.atelier],
		["Hukuki e-posta", identity.legalEmail || identity.email],
		["Destek e-postası", identity.email],
		["Telefon", identity.phone],
		["Çalışma saatleri", `Hafta içi ${identity.hours}`]
	].filter(([, value]) => value.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Satıcı",
		updated: BRAND.legalUpdated,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mb-8 grid gap-px bg-border sm:grid-cols-2",
			children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-bg-elevated px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-2 text-fg",
					children: v
				})]
			}, k))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Şikayet: ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/sikayet",
				children: "şikayet"
			}),
			". Ön bilgi:",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/on-bilgilendirme",
				children: "ön bilgilendirme"
			}),
			". Yazın:",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/iletisim",
				children: "iletişim"
			}),
			"."
		] })]
	});
}
//#endregion
export { Page as component };
