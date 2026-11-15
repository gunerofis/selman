import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as OpenBadge } from "./router-BRoH_qS_.mjs";
import { p as getProduct, v as productSlug } from "./products-BOS9FmZC.mjs";
import { T as cn, b as BRAND, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atolye-Dy6Q7Vq1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLES = [
	"7043",
	"7012",
	"7080"
];
var TABS = [
	"Malzeme",
	"Üretim",
	"Bakım"
];
function Atelier() {
	const [tab, setTab] = (0, import_react.useState)("Malzeme");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: "Ürünlerin nasıl yapıldığı, hangi malzemeden ve hangi sürede."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenBadge, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-3 gap-px border border-dashed border-border bg-border",
				children: SAMPLES.map((sku) => {
					const p = getProduct(sku);
					if (!p) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/urun/$sku",
						params: { sku: productSlug(p) },
						className: "bg-bg-wash transition-colors hover:bg-bg-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: p.name,
							className: "aspect-square w-full object-contain p-2",
							width: 1500,
							height: 1500
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate px-2 pb-2 font-mono text-xs text-fg-muted",
							children: p.name
						})]
					}, sku);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 space-y-5 text-base leading-relaxed text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [BRAND.name, ", evin ve masanın görünmeyen köşelerini — çekmeceyi, lavabo kenarını, giriş holünü — deriyle ele alan bir atölye. Parçalar 70xx ve 71xx stok kodlarıyla üretilir; her biri on dört renkte: siyah, beyaz, gri, krem, kahve, taba, bordo, kırmızı, turuncu, pembe, turkuaz, mavi, lacivert ve yeşil."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gövdeler deri ile kaplanır, içler süet veya keçe ile yumuşatılır. Döner mekanizmalar, damlama tepsileri ve menteşeler görünmez kalır; elde kalan şey form ve renk olur." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Koleksiyon banyo, makyaj, mutfak, gardırop, giriş, yaşam, araç ve ofis masası için aynı elden, aynı paletten." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					role: "tablist",
					"aria-label": "Atölye",
					children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === t,
						onClick: () => setTab(t),
						className: cn("h-11 border px-4 text-sm", tab === t ? "border-fg bg-fg text-bg-elevated" : "border-border-strong text-fg-muted"),
						children: t
					}, t))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border border-dashed border-border bg-bg-elevated p-5",
					role: "tabpanel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-fg-muted",
							children: {
								Malzeme: "Dış deri kaplama, iç keçe veya süet. İstenirse ahşap gövde, metal menteşe ve vida görünmez kalır. Sekiz renk sabit liste.",
								Üretim: "Kalıp, kaplama, dikiş, montaj. Hazır stok 3–5 iş günü. Ölçüye göre parça 10–15 iş günü. Elli adet ve üzeri 10–20 iş günü.",
								Bakım: "Nemli bez. Yağ, çözücü, buhar yok. Güneşe uzun süre bırakmayın. Damlama tepsisi çıkarılıp yıkanır."
							}[tab]
						}),
						tab === "Malzeme" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/malzeme",
							className: "mt-3 inline-block text-sm text-taba hover:underline",
							children: "Malzeme sayfası"
						}) : null,
						tab === "Bakım" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bakim",
							className: "mt-3 inline-block text-sm text-taba hover:underline",
							children: "Bakım sayfası"
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Üretim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 grid gap-px bg-border sm:grid-cols-5",
						children: [
							"Kalıp",
							"Kaplama",
							"Dikiş",
							"Montaj",
							"Kargo"
						].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-bg-elevated px-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-taba",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: step
							})]
						}, step))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-fg-muted",
						children: "70xx ev ve oda parçaları, 71xx masa seti. Aynı sekiz renk."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border border-dashed border-border bg-bg-elevated p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: "Süre"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 grid gap-4 text-sm sm:grid-cols-3",
					children: [
						["Hazır stok", "3–5 iş günü"],
						["Ölçüye göre", "10–15 iş günü"],
						["Kurumsal", "10–20 iş günü"]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-fg-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-mono",
						children: v
					})] }, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-fg-muted",
				children: [
					BRAND.atelier,
					".",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ziyaret",
						className: "text-taba hover:underline",
						children: "Ziyaret"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Koleksiyona git" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Tasarımınızı gönderin"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ziyaret",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Randevu"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Atelier as component };
