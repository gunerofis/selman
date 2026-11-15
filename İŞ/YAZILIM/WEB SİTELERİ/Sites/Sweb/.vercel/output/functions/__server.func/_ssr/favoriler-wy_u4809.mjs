import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Route$48, a as EmptyHint, p as RecentRail, ut as SITE_ORIGIN } from "./router-BRoH_qS_.mjs";
import { C as specGrams, d as getCategory, v as productSlug } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as formatPrice, c as usePrefs, i as ProductCard, u as wishedProducts, v as useCart, w as Button, y as useHydrated } from "./router-BRoH_qS_2.mjs";
import { t as ShareButton } from "./share-button-D3jx41C0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/favoriler-wy_u4809.js
var import_jsx_runtime = require_jsx_runtime();
function Favorites() {
	const ready = useHydrated();
	const { sku: shared } = Route$48.useSearch();
	const wishlist = usePrefs((s) => s.wishlist);
	const sharedItems = ready ? wishedProducts((shared ?? "").split(",").map((s) => s.trim()).filter(Boolean)) : [];
	const items = ready ? wishedProducts(wishlist) : [];
	const shown = sharedItems.length > 0 ? sharedItems : items;
	const add = useCart((s) => s.add);
	const lastColor = usePrefs((s) => s.lastColor);
	const toggleWish = usePrefs((s) => s.toggleWish);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-fg-muted uppercase",
				children: "Kayıtlı"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl",
				children: "Favoriler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-fg-muted",
				children: "Favori listeniz hazırlanıyor…"
			})
		]
	});
	if (shown.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
			title: "Favori yok",
			body: "Bir parçanın kalbine dokunun — listeniz burada durur.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Koleksiyona git" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasarla",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Tasarlayın"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/son",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Son baktıklarınız"
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, { heading: "Son baktıklarınız" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.28em] text-fg-muted uppercase",
				children: "Kayıtlı"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl",
				children: "Favoriler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-fg-muted",
				children: [
					shown.length,
					" parça · ",
					sharedItems.length > 0 ? "paylaşılan liste" : "tarayıcıda tutulur",
					". Renk, ürün sayfasında seçilir."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							shown.forEach((p, i) => add(p.sku, lastColor, 1, i === shown.length - 1));
							toast.success(`${shown.length} parça sepete eklendi`);
						},
						children: "Tümünü sepete ekle"
					}),
					sharedItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							sharedItems.forEach((p) => {
								if (!wishlist.includes(p.sku)) toggleWish(p.sku);
							});
							toast.success("Liste kaydedildi");
						},
						children: "Listeyi kaydet"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButton, {
						title: "Sweb favoriler",
						url: `${SITE_ORIGIN}/favoriler?sku=${shown.map((p) => p.sku).join(",")}`,
						text: `${shown.length} parça`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teklif",
						search: {
							not: shown.map((p) => p.sku).join(" "),
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
							not: shown.map((p) => p.sku).join(" "),
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
							istek: shown.map((p) => p.shortName).join(", "),
							renk: lastColor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ölçüye göre tasarlayın"
						})
					})
				]
			}),
			shown.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-x-auto border border-dashed border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-bg-wash font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Parça"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Oda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Ölçü"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Ağırlık"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-normal",
								children: "Fiyat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-normal" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: shown.map((p) => {
						const olcu = p.specs.find((s) => s.label === "Dış ölçü")?.value ?? "—";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-dashed border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/urun/$sku",
										params: { sku: productSlug(p) },
										className: "font-medium hover:text-taba",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 block font-mono text-xs text-fg-muted",
										children: p.sku
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-fg-muted",
									children: getCategory(p.category)?.name ?? p.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 font-mono text-[13px]",
									children: olcu
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 font-mono text-[13px]",
									children: specGrams(p)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 tabular-nums",
									children: formatPrice(p.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end gap-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => add(p.sku, lastColor, 1),
											children: "Sepete ekle"
										})
									})
								})
							]
						}, p.sku);
					}) })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
				children: shown.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku))
			})
		]
	});
}
//#endregion
export { Favorites as component };
