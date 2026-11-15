import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as BRAND, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hediye-BQZlBoDz.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Mağaza"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Hediye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-fg-muted",
				children: "Ödeme adımında isteğe bağlı kutu. Sarma, kurdele ve hediye kartı satılmaz."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10 grid gap-px bg-border sm:grid-cols-2",
				children: [
					["Fiş", "Hediye işaretlenirse fiyat fişi pakete konmaz."],
					["Not", "Kapıcı, kat, zil — teslimat notuna yazılır."],
					["Adres", "Teslimat formu alıcının adresidir; ayrı hediye adresi yok."],
					["Süre", "Hazır stok yine 3–5 iş günü. Hediye hızlandırmaz."]
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
					children: "Kime ne gider"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 divide-y divide-dashed divide-border border-y border-dashed border-border",
					children: [["Saat koleksiyoncusu", "Kapasiteye göre saat kutusu; 2, 4, 6 veya 12 saatlik modeller."], ["Mücevher takan", "Çekmeceli, vitrinli veya kilitli mücevher kutuları."]].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-fg-muted",
							children: v
						})]
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Hediye almadan önce"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-3",
					children: [
						["Ölçüyü kontrol edin", "Kutu nereye konacaksa o yüzeyi ölçün; ölçü rehberi yardımcı olur."],
						["Rengi belirleyin", "Alıcının mobilya tonuna yakın bir renk seçin; palet sayfasında künye var."],
						["Zamanı hesaplayın", "Hazır stok 3–5 iş günü. Özel gün için en az bir hafta önce sipariş verin."],
						["Hediye kutusunu işaretleyin", "Ödeme adımında hediye seçeneğini işaretleyin; fiyat fişi konmaz."]
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
					"Cayma ve iade, teslim alan için de 14 gündür; kullanılmamış ve etiketli olmalı. Ölçüye göre kesim hariç. Bildirim ",
					BRAND.email,
					" veya",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cayma",
						className: "text-taba hover:underline",
						children: "cayma"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/saat-mucevher-kutulari",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Saat ve mücevher kutuları"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kurumsal-teklif",
						search: { not: "Kurumsal hediye" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Kurumsal hediye"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teslimat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Teslimat"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
