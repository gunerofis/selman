import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLORS } from "./products-BOS9FmZC.mjs";
import { w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/malzeme-DjwpBvGM.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Malzeme"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-fg-muted",
				children: [
					"Gövde deri ile kaplanır. İç keçe veya süet. Menteşe ve vida görünmez kalır. ",
					COLORS.length,
					" ",
					"renk",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/palet",
						className: "text-taba hover:underline",
						children: "palet"
					}),
					" ",
					"sayfasında."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10 grid gap-px bg-border sm:grid-cols-2",
				children: [
					["Dış", "Deri kaplama. Masif deri blok değil; formun üzeri kaplanır."],
					["İç", "Keçe veya süet. Çekmece ve tepsi tabanı yumuşak kalsın."],
					["Gövde", "İstenirse ahşap. Metal menteşe, döner taban, vida gizlenir."],
					["Renk", "Espresso, siyah, krem, orman, taş, beyaz, taba, kestane."]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Teknik künye"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full min-w-[480px] border-collapse text-left text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
							["Gövde", "MDF veya masif ahşap; modele göre değişir, ürün sayfasında yazar."],
							["Kaplama", "Deri kaplama; deri türü satış öncesi teyit edilir."],
							["İç yüzey", "Keçe veya süet; çekmece ve tepsi tabanı yumuşaktır."],
							["Birleşim", "Gizli menteşe, gizli vida; dışarıdan metal görünmez."],
							["Kapak", "Modele göre mıknatıslı, toka veya kilitli."],
							["Tolerans", "Ölçüye göre üretimde ±2 mm sapma normaldir."],
							["Ağırlık", "Ürün sayfasında yazmıyorsa teklif adımında bildirilir."]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-dashed border-border align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "row",
								className: "w-40 py-3 pr-4 font-normal text-fg",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 text-fg-muted",
								children: v
							})]
						}, k)) })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Üretim sırası"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-3",
					children: [
						["Kalıp", "Ölçü çıkarılır, gövde kesilir ve birleştirilir."],
						["Kaplama", "Deri kesilir, gövdeye yapıştırılır; köşeler elde bastırılır."],
						["İç kaplama", "Keçe veya süet iç yüzeye döşenir."],
						["Montaj", "Menteşe, kilit ve döner aksam takılır; vidalar gizlenir."],
						["Kontrol", "Kapak boşluğu, dikiş ve renk kontrol edilir, paketlenir."]
					].map(([k, v], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border border-dashed border-border bg-bg-elevated px-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-subtle",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-xl",
								children: k
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-fg-muted",
								children: v
							})
						]
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm leading-relaxed text-fg-muted",
				children: [
					"Fotoğraf örnektir; sitede seçilen renk zemini boyar, deri dokusunu değiştirmez. Bakım: nemli bez. Yağ, krem, çözücü ve buhar yok —",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bakim",
						className: "text-taba hover:underline",
						children: "bakım"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg-muted",
				children: [
					"Yapılmayanlar: elektrik, cam-seramik gövde, dış mekân, gıdayla doğrudan temas. Ölçüye göre iş",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						className: "text-taba hover:underline",
						children: "Tasarlayın"
					}),
					"’da."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/palet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Palet" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/atolye",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Atölye"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ürünler"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
