import { S as require_jsx_runtime, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal-page-ByGkrLxl.js
var import_jsx_runtime = require_jsx_runtime();
var LEGAL_LINKS = [
	{
		to: "/teslimat",
		label: "Teslimat"
	},
	{
		to: "/iade",
		label: "İade"
	},
	{
		to: "/cayma",
		label: "Cayma"
	},
	{
		to: "/on-bilgilendirme",
		label: "Ön bilgilendirme"
	},
	{
		to: "/gizlilik",
		label: "Gizlilik"
	},
	{
		to: "/cerez",
		label: "Çerez"
	},
	{
		to: "/kvkk",
		label: "KVKK"
	},
	{
		to: "/mesafeli",
		label: "Mesafeli satış"
	},
	{
		to: "/kullanim",
		label: "Kullanım"
	},
	{
		to: "/satici",
		label: "Satıcı"
	},
	{
		to: "/sikayet",
		label: "Şikayet"
	}
];
function LegalPage({ kicker, title, updated, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: title
			}),
			updated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-mono text-xs text-fg-muted",
				children: [
					"son güncelleme:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: updated,
						children: new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(updated))
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "legal-copy mt-8 space-y-4 text-sm leading-relaxed text-fg-muted [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-fg [&_a]:text-taba [&_a]:underline-offset-2 hover:[&_a]:underline",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-dashed border-border pt-6 font-mono text-xs text-fg-muted",
				"aria-label": "Hukuki sayfalar",
				children: LEGAL_LINKS.map((item) => {
					const on = pathname === item.to;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						"aria-current": on ? "page" : void 0,
						className: on ? "text-fg" : "hover:text-taba",
						children: item.label
					}, item.to);
				})
			})
		]
	});
}
//#endregion
export { LegalPage as t };
