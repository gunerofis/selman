import { i as __toESM } from "../_runtime.mjs";
import { o as includedVat } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as SearchRecover, M as ShippingBar, O as SaveForLater, a as EmptyHint, f as QtyControl, j as SeriesFill, l as PENDING_PRICE_NOTICE, n as ColorDot, nt as EtaLine, o as LineColorPicker, p as RecentRail, t as BuyAssurance } from "./router-BRoH_qS_.mjs";
import { f as getColor, r as PASTEL } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Trash2 } from "../_libs/lucide-react.mjs";
import { E as formatPrice, T as cn, _ as toastRemoved, d as cartCount, f as cartHasPendingPrice, h as shippingFor, m as cartSubtotal, p as cartLineDisplay, v as useCart, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sepet-ClvMbuqM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const lines = useCart((s) => s.lines);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const setColor = useCart((s) => s.setColor);
	const clear = useCart((s) => s.clear);
	const lastAdded = useCart((s) => s.lastAdded);
	const subtotal = cartSubtotal(lines);
	const shipping = shippingFor(subtotal);
	const total = subtotal + shipping;
	const pendingPrice = cartHasPendingPrice(lines);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-5xl",
			children: "Sepet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-fg-muted",
			children: "Sepetiniz hazırlanıyor…"
		})]
	});
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, {
				title: "Sepet boş",
				body: "Koleksiyondan bir parça seçin — sekiz deri renk sizi bekliyor.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/koleksiyon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Ürünlere git" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kategori",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								children: "Odalar"
							})
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchRecover, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, { heading: "Son baktıklarınız — sepete ekleyin" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 pb-[calc(7rem+var(--cookie-h,0px))] lg:grid-cols-[1fr_320px] lg:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl",
						children: "Sepet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-fg-muted",
						children: [cartCount(lines), " parça"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "font-mono text-xs text-fg-muted hover:text-danger",
						onClick: () => {
							clear();
							toast.success("Sepet boşaltıldı");
						},
						children: "Tümünü kaldır"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 divide-y divide-dashed divide-border border-y border-dashed border-border",
					children: lines.map((line) => {
						const p = cartLineDisplay(line);
						if (!p) return null;
						const color = getColor(line.color);
						const isLast = lastAdded?.sku === line.sku && lastAdded.color === line.color;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex gap-4 py-5", isLast && "-mx-2 bg-bg-wash px-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: p.href,
								className: "size-24 shrink-0 overflow-hidden border border-dashed border-border sm:size-28",
								style: { backgroundColor: p.catalog ? void 0 : PASTEL[line.color] },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: "",
									className: "size-full object-contain",
									width: 1500,
									height: 1500
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: p.href,
											className: "font-display text-xl leading-tight hover:underline",
											children: p.name
										}),
										isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-taba",
											children: "Az önce eklendi"
										}) : null,
										p.catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-fg-muted",
											children: p.code
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 flex items-center gap-2 text-sm text-fg-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDot, { id: line.color }),
												color?.name,
												" · ",
												p.code
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineColorPicker, {
											value: line.color,
											label: `${p.name} renk`,
											onChange: (id) => setColor(line.sku, line.color, id)
										})] })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm tabular-nums",
										children: p.price == null ? "Fiyat teyidi" : formatPrice(p.price * line.qty)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
										value: line.qty,
										onChange: (n) => setQty(line.sku, line.color, n)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [!p.catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveForLater, {
											sku: line.sku,
											color: line.color
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex size-11 items-center justify-center text-fg-muted hover:text-danger",
											"aria-label": "Kaldır",
											onClick: () => {
												remove(line.sku, line.color);
												toastRemoved(p.name);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									})]
								})]
							})]
						}, `${line.sku}-${line.color}`);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesFill, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit border border-dashed border-border bg-bg-elevated p-5 lg:sticky",
				style: { top: "calc(var(--nav-h, 4rem) + 1rem)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Özet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 space-y-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-fg-muted",
								children: pendingPrice ? "Bilinen ara toplam" : "Ara toplam"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "shrink-0 whitespace-nowrap tabular-nums",
								children: formatPrice(subtotal)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-fg-muted",
								children: "Kargo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "shrink-0 whitespace-nowrap tabular-nums",
								children: shipping === 0 ? "Ücretsiz" : formatPrice(shipping)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingBar, { subtotal })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-between gap-4 border-t border-border pt-4 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Toplam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 whitespace-nowrap tabular-nums",
							children: formatPrice(total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: ["KDV dahil ", formatPrice(includedVat(total))]
					}),
					pendingPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-fg-muted",
						children: PENDING_PRICE_NOTICE
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtaLine, { className: "mt-3 text-xs text-fg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: pendingPrice ? "/teklif" : "/odeme",
						search: pendingPrice ? { not: PENDING_PRICE_NOTICE } : void 0,
						className: "mt-5 block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							size: "lg",
							children: pendingPrice ? "Fiyat ve stok teklifi al" : "Ödemeye geç"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center font-mono text-xs text-fg-muted",
						children: "Kart çekilmez · talebiniz kaydedilir"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyAssurance, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teklif",
						search: {
							sku: lines.length === 1 ? lines[0].sku : void 0,
							renk: lines[0]?.color,
							not: lines.map((l) => `${l.catalog?.code ?? l.sku} ${l.catalog ? l.catalog.name : getColor(l.color)?.name ?? l.color}`).join(" · ")
						},
						className: "mt-3 block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-full",
							children: "50+ adet teklif"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						className: "mt-3 block text-center text-sm text-fg-muted hover:text-fg",
						children: "Alışverişe dön"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 z-40 border-t border-dashed border-border bg-bg/95 p-3 print:hidden lg:hidden",
				style: { bottom: "var(--cookie-h, 0px)" },
				"data-print-hide": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: pendingPrice ? "/teklif" : "/odeme",
					search: pendingPrice ? { not: PENDING_PRICE_NOTICE } : void 0,
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						size: "lg",
						children: pendingPrice ? "Fiyat ve stok teklifi al" : `Ödemeye geç · ${formatPrice(total)}`
					})
				})
			})
		]
	});
}
//#endregion
export { CartPage as component };
