import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as EmptyHint } from "./router-BRoH_qS_.mjs";
import { p as getProduct } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as usePrefs, i as ProductCard, s as useCompare, v as useCart, w as Button, y as useHydrated } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/son-DoDqzvqG.js
var import_jsx_runtime = require_jsx_runtime();
function RecentPage() {
	const ready = useHydrated();
	const recent = usePrefs((s) => s.recent);
	const items = ready ? recent.map(getProduct).filter((p) => p != null) : [];
	const add = useCart((s) => s.add);
	const lastColor = usePrefs((s) => s.lastColor);
	const replaceCompare = useCompare((s) => s.replace);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-20 text-sm text-fg-muted",
		children: "Yükleniyor…"
	});
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
			title: "Henüz bakılan yok",
			body: "Koleksiyondan bir parçaya girin — liste burada durur.",
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
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Tarayıcı"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl",
				children: "Son baktıklarınız"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-fg-muted",
				children: [items.length, " parça · bu cihazda tutulur"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
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
						onClick: () => {
							replaceCompare(items.slice(0, 4).map((p) => p.sku));
							toast.success("Karşılaştırmaya alındı");
						},
						children: "Karşılaştır"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/karsilastir",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Karşılaştırma sayfası"
						})
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
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku))
			})
		]
	});
}
//#endregion
export { RecentPage as component };
