import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as sellerName, b as BRAND, w as Button, x as hasBrandValue } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hakkimizda-C4Tx-WtI.js
var import_jsx_runtime = require_jsx_runtime();
var SERIES = [{
	code: "CLIK",
	to: "/saat-mucevher-kutulari",
	title: "Saat ve mücevher kutuları",
	body: "Tekli saat sunum kutusundan çok bölmeli, çekmeceli mücevher kutusuna kadar sunum kutuları."
}];
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Kurumsal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Hakkımızda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-fg",
						children: "Sweb"
					}),
					", ",
					sellerName(),
					" bünyesinde yürütülen saat ve mücevher kutuları markasıdır. Ürünler ",
					BRAND.atelier,
					" adresindeki atölyede üretilir; satış, fatura ve kargo işlemleri aynı şirket üzerinden yapılır. Sipariş yazışmalarında marka adı olarak “Sweb”, resmî belgelerde şirket unvanı görünür."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Saat ve mücevher kutuları"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: "CLIK koleksiyonunda saat kutuları ve mücevher kutuları yer alır."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-px bg-border sm:grid-cols-2",
						children: SERIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-bg-elevated px-5 py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
									children: s.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: s.to,
										className: "hover:text-taba",
										children: s.title
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-fg-muted",
									children: s.body
								})
							]
						}, s.code))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Künye"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-6 grid gap-px bg-border sm:grid-cols-2",
						children: [
							["Marka", BRAND.name],
							["Unvan", sellerName()],
							["Atölye ve adres", BRAND.legalAddress],
							["E-posta", BRAND.email],
							["Telefon", hasBrandValue(BRAND.phone) ? BRAND.phone : "Satıcı sayfasında"],
							["Çalışma saatleri", `Hafta içi ${BRAND.hours}`]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-[11px] tracking-wide text-fg-muted uppercase",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2 text-sm text-fg",
								children: v
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-fg-muted",
						children: [
							"MERSİS, vergi dairesi ve vergi numarası dahil tüm resmî künye",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/satici",
								className: "text-taba hover:underline",
								children: "satıcı bilgileri"
							}),
							" ",
							"sayfasındadır."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/atolye",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Atölye" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ürün kataloğu"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iletisim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "İletişim"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { About as component };
