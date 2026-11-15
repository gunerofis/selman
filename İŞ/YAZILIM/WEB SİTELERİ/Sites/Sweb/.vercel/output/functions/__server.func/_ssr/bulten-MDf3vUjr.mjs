import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as NewsletterForm } from "./router-BRoH_qS_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bulten-MDf3vUjr.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Yardım"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Atölye notları"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg-muted",
				children: "Yeni parça, palet ve bakım notu. Reklam bombardımanı yok. Kayıt doğrudan bülten listesine alınır."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10 grid gap-px bg-border sm:grid-cols-2",
				children: [
					["Ne gelir", "Atölye notu, yeni parça, bakım."],
					["Sıklık", "Düzenli kampanya dizisi yok; arada bir."],
					["Rıza", "Siz gönderirsiniz. 6563 sayılı Kanun, açık rıza."],
					["Çıkış", `Aynı adrese “bülten çıkış” yazın.`]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-4 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-display text-xl",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 text-sm text-fg-muted",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border border-dashed border-border bg-bg-elevated p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Kayıt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: [
							"Kaydınız yönetim panelindeki bülten listesine alınır. Aydınlatma:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/kvkk",
								className: "text-taba hover:underline",
								children: "KVKK"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, {})
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
