import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, U as notFound, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as trapTab, d as ProductRedesignButton, f as QtyControl, i as DimDiagram, k as ScaleHint, m as Route, p as RecentRail, r as ColorSwatches, t as BuyAssurance, u as PlaceLine, ut as SITE_ORIGIN } from "./router-BRoH_qS_.mjs";
import { C as specGrams, f as getColor, g as neighborsInCategory, m as getSeries, p as getProduct, r as PASTEL, t as CATEGORIES, v as productSlug, x as relatedProducts, y as productsBySeries } from "./products-BOS9FmZC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as X, v as Maximize2 } from "../_libs/lucide-react.mjs";
import { E as formatPrice, T as cn, a as WishButton, b as BRAND, c as usePrefs, g as toastAdded, i as ProductCard, r as CatalogImg, v as useCart, w as Button } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, i as FAQ_PDP } from "./faq-D2XSa1MZ.mjs";
import { t as ShareButton } from "./share-button-D3jx41C0.mjs";
import { t as PrintButton } from "./print-button-BbupOTeB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/urun._sku-DjJ0tm_9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PairRail({ sku, color }) {
	const add = useCart((s) => s.add);
	const pairs = relatedProducts(sku, 2);
	if (pairs.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12 border border-dashed border-border bg-bg-elevated p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Yanına ekle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl",
				children: "Aynı paletten iki parça"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: pairs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/urun/$sku",
						params: { sku: productSlug(p) },
						search: { renk: color },
						"aria-label": `${p.name} ürününü aç`,
						className: "size-20 shrink-0 border border-dashed border-border",
						style: { backgroundColor: PASTEL[color] },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: "",
							className: "size-full object-contain p-1",
							width: 1500,
							height: 1500
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/urun/$sku",
								params: { sku: productSlug(p) },
								search: { renk: color },
								className: "font-display text-lg leading-tight hover:text-taba",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm tabular-nums",
								children: formatPrice(p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										add(p.sku, color, 1);
										toastAdded(p.name);
									},
									children: "Sepete ekle"
								})
							})
						]
					})]
				}, p.sku))
			})
		]
	});
}
var ROWS = [
	{
		id: "malzeme",
		title: "Malzeme",
		body: "Dış deri kaplama, iç keçe veya süet. Birleşimler ve varsa metal aksam (menteşe, vida) gizli kalır. On dört renk: siyah, beyaz, gri, krem, kahve, taba, bordo, kırmızı, turuncu, pembe, turkuaz, mavi, lacivert ve yeşil.",
		href: "/palet",
		link: "Palet"
	},
	{
		id: "bakim",
		title: "Bakım",
		body: "Nemli bez. Yağ, çözücü, buhar yok. Güneşe uzun süre bırakmayın. Damlama tepsisi varsa çıkarıp ayrı silin.",
		href: "/bakim",
		link: "Bakım rehberi"
	},
	{
		id: "uretim",
		title: "Üretim",
		body: `Kalıp, kaplama, dikiş, montaj. ${BRAND.atelier}. Hazır stok 3–5 iş günü; ölçüye göre 10–15.`,
		href: "/atolye",
		link: "Atölye"
	}
];
function CraftFold() {
	const [open, setOpen] = (0, import_react.useState)("malzeme");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-y border-dashed border-border",
		children: ROWS.map((row) => {
			const on = open === row.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-dashed border-border last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-12 w-full items-center justify-between text-left text-sm",
					"aria-expanded": on,
					onClick: () => setOpen(on ? null : row.id),
					children: [row.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono text-xs text-fg-muted", on && "text-fg"),
						children: on ? "−" : "+"
					})]
				}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "pb-4 text-sm leading-relaxed text-fg-muted",
					children: [
						row.body,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: row.href,
							className: "text-taba hover:underline",
							children: row.link
						})
					]
				}) : null]
			}, row.id);
		})
	});
}
var KEY = "sweb-last-list";
function readLastList() {
	try {
		const raw = sessionStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.href || !parsed.label) return null;
		return parsed;
	} catch {
		return null;
	}
}
/** Baymard: hierarchy crumbs plus a history-based path back to filtered results. */
function ListBack() {
	const [last, setLast] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setLast(readLastList()), []);
	if (!last) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 font-mono text-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: last.href,
			className: "text-taba hover:underline",
			children: ["← ", last.label]
		})
	});
}
function ProductPage() {
	const { sku } = Route.useParams();
	const { renk } = Route.useSearch();
	const navigate = Route.useNavigate();
	const product = getProduct(sku);
	if (!product) throw notFound();
	const [color, setColor] = (0, import_react.useState)(renk ?? "espresso");
	const [qty, setQty] = (0, import_react.useState)(1);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const [origin, setOrigin] = (0, import_react.useState)("50% 50%");
	const [hoverScale, setHoverScale] = (0, import_react.useState)(1);
	const add = useCart((s) => s.add);
	const addMany = useCart((s) => s.addMany);
	const pushRecent = usePrefs((s) => s.pushRecent);
	const rememberColor = usePrefs((s) => s.rememberColor);
	const colorMeta = getColor(color);
	const related = relatedProducts(product.sku);
	const series = getSeries(product.series);
	const cat = CATEGORIES.find((c) => c.id === product.category);
	const { prev: prevP, next: nextP } = neighborsInCategory(product.sku);
	const weight = specGrams(product);
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		sku: product.sku,
		image: new URL(product.image, SITE_ORIGIN).href,
		url: `${SITE_ORIGIN}/urun/${productSlug(product)}`,
		description: product.description,
		brand: {
			"@type": "Brand",
			name: "Sweb"
		},
		offers: {
			"@type": "Offer",
			price: product.price,
			priceCurrency: "TRY",
			availability: "https://schema.org/InStock",
			url: `${SITE_ORIGIN}/urun/${productSlug(product)}`
		}
	};
	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Ürünler",
				item: `${SITE_ORIGIN}/koleksiyon`
			},
			...cat ? [{
				"@type": "ListItem",
				position: 2,
				name: cat.name,
				item: `${SITE_ORIGIN}/kategori/${cat.id}`
			}] : [],
			{
				"@type": "ListItem",
				position: cat ? 3 : 2,
				name: product.name,
				item: `${SITE_ORIGIN}/urun/${productSlug(product)}`
			}
		]
	};
	(0, import_react.useEffect)(() => {
		pushRecent(product.sku);
	}, [product.sku, pushRecent]);
	(0, import_react.useEffect)(() => {
		if (renk) setColor(renk);
	}, [renk]);
	function chooseColor(id) {
		setColor(id);
		rememberColor(id);
		navigate({
			search: { renk: id },
			replace: true
		});
	}
	function addToCart() {
		if (!product) return;
		rememberColor(color);
		add(product.sku, color, qty);
		toastAdded(product.name);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10 pb-[calc(7rem+var(--cookie-h,0px))] lg:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(breadcrumbJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBack, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						className: "hover:text-fg",
						children: "Ürünler"
					}),
					cat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "/"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kategori/$id",
						params: { id: cat.id },
						className: "hover:text-fg",
						children: cat.name
					})] }) : null,
					series ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "/"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/koleksiyon",
						search: {
							kategori: "ofis",
							seri: series.id
						},
						className: "hover:text-fg",
						children: series.name
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.name })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "group relative w-full overflow-hidden border border-dashed border-border text-left outline-none wash-shift transition-colors hover:border-taba focus-visible:ring-2 focus-visible:ring-taba focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
					style: { backgroundColor: PASTEL[color] },
					onClick: () => setZoom(true),
					onMouseMove: (e) => {
						const r = e.currentTarget.getBoundingClientRect();
						const x = (e.clientX - r.left) / r.width * 100;
						const y = (e.clientY - r.top) / r.height * 100;
						setOrigin(`${x}% ${y}%`);
						setHoverScale(1.14);
					},
					onMouseLeave: () => {
						setOrigin("50% 50%");
						setHoverScale(1);
					},
					"aria-label": "Görseli büyüt",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogImg, {
						src: product.image,
						alt: `${product.name} — örnek fotoğraf, ${colorMeta?.name ?? "deri"} zemin`,
						priority: true,
						sizes: "(max-width: 1024px) 100vw, 50vw",
						className: "aspect-square w-full object-contain p-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
						style: {
							transform: `scale(${hoverScale})`,
							transformOrigin: origin
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute right-3 bottom-3 flex items-center gap-2 border border-border bg-bg/90 px-3 py-2 font-mono text-xs shadow-sm backdrop-blur-sm transition-colors group-hover:border-taba group-hover:bg-bg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, {
							className: "size-3.5",
							"aria-hidden": "true"
						}), "Görseli incele"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-xs text-fg-muted",
					children: "8 renk, örnek fotoğraf. Seçilen renk zemini boyar, deriyi değil."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "font-mono text-xs tracking-wide text-fg-muted hover:text-taba",
									onClick: () => {
										navigator.clipboard?.writeText(product.sku);
										toast.success(`${product.sku} kopyalandı`);
									},
									children: [product.sku, " · kopyala"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 font-display text-4xl leading-none sm:text-5xl",
									children: product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base text-fg-muted",
									children: product.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceLine, { category: product.category })
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishButton, { sku: product.sku }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButton, {
									title: product.name,
									url: `${SITE_ORIGIN}/urun/${productSlug(product)}${color ? `?renk=${color}` : ""}`,
									text: product.tagline
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl",
							children: formatPrice(product.price)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs text-fg-muted",
							children: "KDV dahil · 8 deri renk"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Renk"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-fg-muted",
								children: colorMeta?.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatches, {
							value: color,
							onChange: chooseColor,
							named: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden flex-wrap items-center gap-3 lg:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
									value: qty,
									onChange: setQty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "min-w-40 flex-1",
									onClick: addToCart,
									children: "Sepete ekle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRedesignButton, {
									product,
									color,
									size: "lg",
									className: "w-full",
									linkClassName: "w-full"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyAssurance, {
							price: product.price,
							madeToOrder: product.stockStatus === "siparisle-uretilir"
						}) }),
						series ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-dashed border-border bg-bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
									children: [series.name, " seti"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-fg-muted",
									children: series.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "mt-3",
									onClick: () => {
										const skus = productsBySeries(series.id).map((p) => p.sku);
										addMany(skus, color);
										toast.success(`${skus.length} parça sepete eklendi`);
									},
									children: "Seriyi sepete ekle"
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-prose text-sm leading-relaxed text-fg-muted",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/teklif",
									search: {
										sku: product.sku,
										renk: color
									},
									className: "text-taba hover:underline",
									children: "Bu ürün için teklif iste"
								}),
								". 50 adet ve üzeri için",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/kurumsal-teklif",
									search: {
										sku: product.sku,
										renk: color
									},
									className: "text-taba hover:underline",
									children: "kurumsal teklif"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-2 text-sm",
							children: product.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2 text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 bg-taba" }), f]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CraftFold, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-dashed border-border bg-bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-fg-muted",
										children: "Ölçü fişi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, { label: "Yazdır" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [product.specs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-dashed border-border last:border-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 text-fg-muted",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 text-right font-mono text-[13px]",
											children: s.label === "Ağırlık" ? weight : s.value
										})]
									}, s.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-dashed border-border last:border-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 text-fg-muted",
											children: "Teslim"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 text-right font-mono text-[13px]",
											children: "3–5 iş günü"
										})]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimDiagram, { product }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleHint, {
									product,
									color
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
							items: FAQ_PDP,
							heading: "Siparişten önce"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-12 flex items-center justify-between gap-4 border-t border-dashed border-border pt-6 text-sm",
				children: [prevP ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/urun/$sku",
					params: { sku: productSlug(prevP) },
					className: "text-fg-muted hover:text-taba",
					children: ["← ", prevP.name]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), nextP ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/urun/$sku",
					params: { sku: productSlug(nextP) },
					className: "text-right text-fg-muted hover:text-taba",
					children: [nextP.name, " →"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairRail, {
				sku: product.sku,
				color
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: series ? "Bu seride" : "Yanına"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						color
					}, p.sku))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentRail, {
				exclude: product.sku,
				color
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 z-40 border-t border-dashed border-border bg-bg/95 p-3 print:hidden lg:hidden",
				style: { bottom: "var(--cookie-h, 0px)" },
				"data-print-hide": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1400px] items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
						value: qty,
						onChange: setQty
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-w-0 flex-1 grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "h-auto min-h-12 px-2 py-2 leading-tight",
							size: "lg",
							onClick: addToCart,
							children: ["Sepete ekle · ", formatPrice(product.price * qty)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRedesignButton, {
							product,
							color,
							size: "lg",
							className: "h-auto min-h-12 w-full px-2 py-2 leading-tight"
						})]
					})]
				})
			}),
			zoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomLightbox, {
				src: product.image,
				alt: product.name,
				onClose: () => setZoom(false)
			}) : null
		]
	});
}
function ZoomLightbox({ src, alt, onClose }) {
	const [scale, setScale] = (0, import_react.useState)(1);
	const [origin, setOrigin] = (0, import_react.useState)("50% 50%");
	const panelRef = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(null);
	const lastFocus = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		lastFocus.current = document.activeElement;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const t = window.setTimeout(() => closeRef.current?.focus(), 20);
		const onKey = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
				return;
			}
			if (e.key === "Tab" && panelRef.current) trapTab(e, panelRef.current);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.clearTimeout(t);
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
			lastFocus.current?.focus();
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: panelRef,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/90 p-4 print:hidden",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `${alt} görsel galerisi`,
		"data-print-hide": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute inset-0",
				"aria-label": "Galeriyi kapat",
				onClick: onClose
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 text-bg sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.16em] text-bg/65 uppercase",
					children: "Ürün görünümü"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-xl",
					children: alt
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					ref: closeRef,
					type: "button",
					className: "pointer-events-auto flex size-11 shrink-0 items-center justify-center border border-bg/30 bg-bg-deep/50 transition-colors hover:border-bg hover:bg-bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg",
					"aria-label": "Galeriyi kapat",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-5",
						"aria-hidden": "true"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt,
				className: "relative z-10 max-h-[calc(100%-7rem)] max-w-full cursor-zoom-in object-contain transition-transform duration-200",
				style: {
					transform: `scale(${scale})`,
					transformOrigin: origin,
					cursor: scale > 1 ? "zoom-out" : "zoom-in"
				},
				onClick: (e) => {
					e.stopPropagation();
					const rect = e.currentTarget.getBoundingClientRect();
					const x = (e.clientX - rect.left) / rect.width * 100;
					const y = (e.clientY - rect.top) / rect.height * 100;
					setOrigin(`${x}% ${y}%`);
					setScale((s) => s === 1 ? 2.4 : 1);
				},
				width: 1500,
				height: 1500
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap border border-bg/20 bg-bg-deep/55 px-3 py-2 font-mono text-xs text-bg/75 backdrop-blur-sm",
				children: "Yakınlaştırmak için görsele dokunun · ESC ile kapatın"
			})
		]
	});
}
//#endregion
export { ProductPage as component };
