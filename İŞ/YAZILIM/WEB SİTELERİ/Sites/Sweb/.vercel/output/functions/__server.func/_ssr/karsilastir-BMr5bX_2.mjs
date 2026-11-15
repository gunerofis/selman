import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as EmptyHint, d as ProductRedesignButton, p as RecentRail, ut as SITE_ORIGIN, w as Route$40 } from "./router-BRoH_qS_.mjs";
import { C as specGrams, m as getSeries, t as CATEGORIES, v as productSlug } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as formatPrice, c as usePrefs, o as comparedProducts, s as useCompare, v as useCart, w as Button, y as useHydrated } from "./router-BRoH_qS_2.mjs";
import { t as ShareButton } from "./share-button-D3jx41C0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/karsilastir-BMr5bX_2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComparePage() {
	const ready = useHydrated();
	const { sku: shared } = Route$40.useSearch();
	const skus = useCompare((s) => s.skus);
	const remove = useCompare((s) => s.remove);
	const replace = useCompare((s) => s.replace);
	const clear = useCompare((s) => s.clear);
	(0, import_react.useEffect)(() => {
		if (!ready || !shared) return;
		const list = shared.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
		if (list.length) replace(list);
	}, [
		ready,
		shared,
		replace
	]);
	const add = useCart((s) => s.add);
	const lastColor = usePrefs((s) => s.lastColor);
	const items = ready ? comparedProducts(skus) : [];
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted",
		children: "Yükleniyor…"
	});
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
			title: "Karşılaştırma boş",
			body: "Karttaki Karşılaştır ile en fazla dört parça seçin.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/koleksiyon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ürünlere git" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tasarla",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Tasarlayın"
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, { heading: "Son baktıklarınız" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10 pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Ölçü"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl sm:text-5xl",
				children: "Karşılaştır"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-xl text-sm text-fg-muted",
				children: [items.length, " parça. Aynı paletten ölçü ve fiyat."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							items.forEach((p, i) => add(p.sku, lastColor, 1, i === items.length - 1));
							toast.success(`${items.length} parça sepete eklendi`);
						},
						children: "Tümünü sepete"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: clear,
						children: "Listeyi sil"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButton, {
						title: "Sweb karşılaştırma",
						url: `${SITE_ORIGIN}/karsilastir?sku=${items.map((p) => p.sku).join(",")}`,
						text: `${items.length} parça`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teklif",
						search: {
							not: items.map((p) => p.sku).join(" "),
							renk: lastColor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ürün teklifi"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kurumsal-teklif",
						search: {
							not: items.map((p) => p.sku).join(" "),
							renk: lastColor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "50+ adet kurumsal teklif"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						search: {
							istek: items.map((p) => p.shortName).join(", "),
							renk: lastColor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ölçüye göre tasarlayın"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-x-auto border border-dashed border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "w-32 px-3 py-3 font-mono text-xs font-normal text-fg-muted",
						children: "Özellik"
					}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-3 font-normal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/urun/$sku",
							params: { sku: productSlug(p) },
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: "",
								className: "mb-2 h-24 w-full object-contain",
								width: 1500,
								height: 1500
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg leading-tight",
								children: p.name
							})]
						})
					}, p.sku))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [[
						["Kod", (p) => p.sku],
						["Oda", (p) => CATEGORIES.find((c) => c.id === p.category)?.name ?? p.category],
						["Set", (p) => getSeries(p.series)?.name ?? "—"],
						["Ölçü", (p) => p.specs.find((s) => s.label === "Dış ölçü")?.value ?? "—"],
						["Ağırlık", (p) => specGrams(p)],
						["Fiyat", (p) => formatPrice(p.price)]
					].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-dashed border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-mono text-xs font-normal text-fg-muted",
							children: label
						}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 font-mono text-[13px]",
							children: val(p)
						}, p.sku))]
					}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-dashed border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-mono text-xs font-normal text-fg-muted",
							children: " "
						}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => {
											add(p.sku, lastColor, 1);
											toast.success(`${p.name} sepete eklendi`);
										},
										children: "Sepete ekle"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRedesignButton, {
										product: p,
										color: lastColor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-left text-xs text-fg-muted hover:text-fg",
										onClick: () => remove(p.sku),
										children: "Çıkar"
									})
								]
							})
						}, p.sku))]
					})] })]
				})
			})
		]
	});
}
//#endregion
export { ComparePage as component };
