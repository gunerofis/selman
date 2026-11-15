import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as listWindow, t as BuyAssurance, ut as SITE_ORIGIN } from "./router-BRoH_qS_.mjs";
import { r as lineDetailTo } from "./line-items-CJOP5bzH.mjs";
import { E as formatPrice, T as cn, g as toastAdded, v as useCart, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line-catalog-DNcdcPlf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MoreList({ shown, total, onMore }) {
	const triggerRef = (0, import_react.useRef)(null);
	const onMoreRef = (0, import_react.useRef)(onMore);
	(0, import_react.useEffect)(() => {
		onMoreRef.current = onMore;
	}, [onMore]);
	(0, import_react.useEffect)(() => {
		const trigger = triggerRef.current;
		if (!trigger || shown >= total) return;
		let requested = false;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry?.isIntersecting || requested) return;
			requested = true;
			onMoreRef.current();
		}, { rootMargin: "600px 0px" });
		observer.observe(trigger);
		return () => observer.disconnect();
	}, [shown, total]);
	if (shown >= total) return null;
	const remaining = total - shown;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: triggerRef,
		className: "mt-10 flex flex-col items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono text-xs text-fg-muted",
			children: [
				shown,
				" / ",
				total,
				" parça"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: onMore,
			children: [remaining, " parça daha yükle"]
		})]
	});
}
function LineItemLink({ line, id, className, ariaLabel, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: lineDetailTo(line.to),
		params: { id },
		className,
		"aria-label": ariaLabel,
		children
	});
}
function requiresInquiry(item) {
	return item.availability === "out-of-stock" || item.availability === "inquiry-only";
}
function LineGrid({ items, line, mobileLimit }) {
	const addCatalog = useCart((state) => state.addCatalog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-8 grid grid-cols-2 gap-px bg-border lg:grid-cols-3",
		children: items.map((p, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: cn("flex flex-col bg-bg", mobileLimit != null && index >= mobileLimit && "max-sm:hidden"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItemLink, {
				line,
				id: p.id,
				className: "img-zoom block bg-bg-wash",
				ariaLabel: p.name,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image,
					srcSet: p.imageSrcSet,
					sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
					alt: p.alt,
					width: 1500,
					height: 1125,
					loading: "lazy",
					className: cn("aspect-[4/3] w-full", p.filter === "mucevher" ? "object-contain" : "object-cover")
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col p-3 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
							children: p.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tracking-wide text-fg-subtle uppercase",
							children: p.kind
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-base leading-snug sm:text-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItemLink, {
							line,
							id: p.id,
							className: "hover:text-taba",
							children: p.name
						})
					}),
					p.tags && p.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 hidden flex-wrap gap-1.5 sm:flex",
						children: p.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border border-dashed border-border px-2 py-0.5 font-mono text-xs text-fg-muted",
							children: tag
						}, tag))
					}) : null,
					p.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 hidden font-mono text-xs text-fg-subtle sm:block",
						children: p.note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-col gap-3 pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end justify-between gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg sm:text-2xl",
									children: p.price == null ? "Fiyat teyidi bekliyor" : formatPrice(p.price)
								}),
								p.oldPrice != null && p.price != null && p.oldPrice > p.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 font-mono text-xs text-fg-subtle line-through",
									children: formatPrice(p.oldPrice)
								}) : null,
								requiresInquiry(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-fg-subtle",
									children: p.availability === "inquiry-only" ? "Fiyat ve stok teyidi gerekiyor" : "Stok teyidi gerekiyor"
								}) : null
							] })
						}), requiresInquiry(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teklif",
							search: { not: p.teklifNot },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "h-auto min-h-11 w-full px-2 py-2 leading-tight",
								children: p.availability === "inquiry-only" ? "Fiyat ve üretim bilgisini sor" : "Stok ve üretim bilgisini sor"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: cn("h-auto min-h-11 px-2 py-2 leading-tight", !lineCustomization(line, p) && "col-span-2"),
								onClick: () => {
									addCatalog(toCartItem(line, p));
									toastAdded(p.name);
								},
								children: "Sepete Ekle"
							}), lineCustomization(line, p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tasarla",
								search: { istek: lineCustomization(line, p)?.brief },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-auto min-h-11 w-full px-2 py-2 leading-tight",
									children: lineCustomization(line, p)?.label
								})
							}) : null]
						})]
					})
				]
			})]
		}, p.id))
	});
}
function LineShop({ line, initialFilter = "hepsi", initialShown }) {
	const validInitialFilter = line.filters.some((item) => item.id === initialFilter) ? initialFilter : "hepsi";
	const [filter, setFilter] = (0, import_react.useState)(validInitialFilter);
	const [sort, setSort] = (0, import_react.useState)("onerilen");
	const [shown, setShown] = (0, import_react.useState)(() => listWindow(initialShown));
	const list = [...line.items.filter((p) => filter === "hepsi" || p.filter === filter || p.filterTags?.includes(filter))].sort((a, b) => {
		const featuredOrder = Number(b.price === 1850) - Number(a.price === 1850);
		if (featuredOrder !== 0) return featuredOrder;
		if (sort === "ad") return a.name.localeCompare(b.name, "tr");
		if (sort === "fiyat-asc") return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
		if (sort === "fiyat-desc") return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY);
		return 0;
	});
	const windowed = list.slice(0, listWindow(shown));
	const itemListJsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		numberOfItems: list.length,
		itemListElement: windowed.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			url: `${SITE_ORIGIN}${line.to}/${encodeURIComponent(item.id)}`
		}))
	};
	(0, import_react.useEffect)(() => {
		setShown(listWindow(initialShown));
	}, [initialShown, line.to]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(itemListJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: line.kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: line.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted",
				children: line.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: line.filters.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setFilter(t.id);
							setShown(24);
						},
						"aria-pressed": filter === t.id,
						className: cn("min-h-11 border border-dashed px-4 py-2 font-mono text-xs tracking-wide uppercase transition-colors", filter === t.id ? "border-fg bg-bg-deep text-fg-on-deep" : "border-border text-fg-muted hover:text-fg"),
						children: t.label
					}, t.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm text-fg-muted",
					children: ["Sırala", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (event) => {
							setSort(event.target.value);
							setShown(24);
						},
						className: "h-11 border border-border-strong bg-bg-elevated px-3 text-sm text-fg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "onerilen",
								children: "Önerilen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fiyat-asc",
								children: "Fiyat: artan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fiyat-desc",
								children: "Fiyat: azalan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ad",
								children: "İsim"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-sm text-fg-muted",
				children: [list.length, " model"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineGrid, {
				items: windowed,
				line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreList, {
				shown: Math.min(windowed.length, list.length),
				total: list.length,
				onMore: () => setShown((current) => Math.min(current + 24, list.length))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 border border-dashed border-border bg-bg-wash px-6 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl sm:text-3xl",
						children: "Özel üretim ve kurumsal sipariş"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-fg-muted",
						children: "Ölçü, renk ve adet size özel hazırlanır. Kurumsal sipariş için teklif alın."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teklif",
							search: { not: line.kicker },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Teklif alın"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/iletisim",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								children: "İletişim"
							})
						})]
					})
				]
			})
		]
	});
}
function LineHomeSection({ line }) {
	const [shown, setShown] = (0, import_react.useState)(6);
	if (line.key === "slac") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-dashed border-border py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-dashed border-border bg-bg-wash px-6 py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
					children: [line.kicker, " · Hediye Setleri"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl sm:text-5xl",
					children: "Hediye setleri yenileniyor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted",
					children: "Yeni hediye seti koleksiyonunu hazırlıyoruz. Kurumsal ve özel hediye talepleriniz için teklif alın; ölçü, renk ve içerik size özel hazırlanır."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teklif",
						search: { not: line.kicker },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							children: "Hediye seti teklifi al"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iletisim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "lg",
							children: "İletişim"
						})
					})]
				})
			]
		})
	});
	const items = [...line.items].sort((a, b) => Number(b.price === 1850) - Number(a.price === 1850));
	const windowed = items.slice(0, shown);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-dashed border-border py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: line.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-4xl sm:text-5xl",
						children: line.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-2xl text-sm text-fg-muted",
						children: [
							line.key === "sweb" ? "Organizer ürün ailesi" : "Sweb ürün ailesi",
							" ·",
							" ",
							line.items.length,
							" model"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: line.to,
					className: "text-sm text-fg-muted hover:text-taba",
					children: "Tümü →"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineGrid, {
				items: windowed,
				line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreList, {
				shown: Math.min(windowed.length, items.length),
				total: items.length,
				onMore: () => setShown((current) => Math.min(current + 24, items.length))
			})
		]
	});
}
function LineProduct({ line, item }) {
	const addCatalog = useCart((state) => state.addCatalog);
	const related = line.items.filter((p) => p.id !== item.id).sort((a, b) => Number(b.filter === item.filter) - Number(a.filter === item.filter)).slice(0, 3);
	const customization = lineCustomization(line, item);
	const productUrl = `${SITE_ORIGIN}${line.to}/${encodeURIComponent(item.id)}`;
	const productDescription = item.description ?? item.seoDescription ?? `${item.name}, ${line.title.toLocaleLowerCase("tr-TR")} seçkisinde yer alan ${(item.kind ?? "ürün").toLocaleLowerCase("tr-TR")} modelidir.${item.tags?.length ? ` Öne çıkan ayrıntılar: ${item.tags.slice(0, 3).join(", ")}.` : ""}`;
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: item.name,
		image: new URL(item.image, SITE_ORIGIN).href,
		sku: item.code ?? item.id,
		description: productDescription,
		brand: {
			"@type": "Brand",
			name: "Sweb"
		},
		...item.price == null || item.availability === "inquiry-only" ? {} : { offers: {
			"@type": "Offer",
			price: item.price,
			priceCurrency: "TRY",
			availability: item.availability === "out-of-stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
			url: productUrl
		} }
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(productJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: line.kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: item.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: line.to,
						className: "text-taba hover:underline",
						children: line.title
					}),
					item.kind ? ` · ${item.kind}` : "",
					item.code ? ` · ${item.code}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-bg-wash",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.image,
						srcSet: item.imageSrcSet,
						sizes: "(min-width: 1024px) 55vw, 100vw",
						alt: item.alt,
						width: 1500,
						height: 1125,
						className: cn("aspect-[4/3] w-full", item.filter === "mucevher" ? "object-contain" : "object-cover")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [
						item.tags && item.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 flex flex-wrap gap-1.5",
							children: item.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border border-dashed border-border px-2 py-0.5 font-mono text-xs text-fg-muted",
								children: tag
							}, tag))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-sm leading-relaxed text-fg-muted",
							children: productDescription
						}),
						item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-mono text-sm text-fg-subtle",
							children: item.note
						}) : null,
						item.details?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 grid gap-px bg-border",
							children: item.details.map((detail) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1 bg-bg-elevated px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-fg-muted",
									children: detail.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-sm",
									children: detail.value
								})]
							}, detail.label))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl",
								children: item.price == null ? "Fiyat teyidi bekliyor" : formatPrice(item.price)
							}), item.oldPrice != null && item.price != null && item.oldPrice > item.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-fg-subtle line-through",
								children: formatPrice(item.oldPrice)
							}) : null]
						}),
						item.price != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-fg-muted",
							children: "KDV dahil"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: [
								requiresInquiry(item) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/teklif",
									search: { not: item.teklifNot },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										children: item.availability === "inquiry-only" ? "Fiyat ve üretim bilgisini sor" : "Stok ve üretim bilgisini sor"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									onClick: () => {
										addCatalog(toCartItem(line, item));
										toastAdded(item.name);
									},
									children: "Sepete Ekle"
								}),
								customization ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tasarla",
									search: { istek: customization.brief },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "lg",
										children: customization.label
									})
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: line.to,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "lg",
										children: "Listeye dön"
									})
								})
							]
						}),
						line.key === "clik" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border border-dashed border-border bg-bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg",
									children: "Renk ve iç kumaş"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-fg-muted",
									children: item.color ? `Bu karttaki ürün ${item.color.toLocaleLowerCase("tr-TR")} renk varyantıdır. İç kumaş, üretim imkânı ve farklı renk seçenekleri sipariş öncesi teyit edilir.` : "Bu modelin dış rengi ve iç kumaşı siparişe özel üretilir. Tercihinizi teklif formundaki nota yazın; üretim öncesi yazılı olarak teyit edilir."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/teklif",
										search: { not: `${item.code ?? item.name} · renk ve iç kumaş tercihi: ` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											children: "Renk ve iç kumaş seç"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/palet",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											children: "Renk paletini gör"
										})
									})]
								})
							]
						}) : null,
						!requiresInquiry(item) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyAssurance, {
								price: item.price ?? void 0,
								madeToOrder: line.key === "clik"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 border border-dashed border-border bg-bg-wash p-4 text-sm text-fg-muted",
							children: item.availability === "inquiry-only" ? "Bu model için güncel fiyat, stok ve üretim süresi teklif aşamasında yazılı olarak teyit edilir." : "Bu model kaynak envanterde stok dışı görünüyor. Güncel stok veya yeniden üretim süresi teklif aşamasında yazılı olarak teyit edilir."
						})
					]
				})]
			}),
			related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Aynı hattan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: "Yakın modeller"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineGrid, {
						items: related,
						line
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 border border-dashed border-border bg-bg-wash px-6 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl sm:text-3xl",
						children: "Özel üretim ve kurumsal sipariş"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-fg-muted",
						children: "Ölçü, renk ve adet size özel hazırlanır. Kurumsal sipariş için teklif alın."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teklif",
							search: { not: item.teklifNot },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Teklif alın"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/iletisim",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								children: "İletişim"
							})
						})]
					})
				]
			})
		]
	});
}
function lineCustomization(line, item) {
	if (line.key === "sweb") return {
		label: "Bu ürünü yeniden tasarla",
		brief: `Organizer yeniden tasarımı: ${item.name} (${item.code ?? item.id})`
	};
	if (line.key === "slac") return {
		label: "Bu ürünü özelleştir",
		brief: `Hediye kutusu özelleştirmesi: ${item.name} (${item.code ?? item.id})`
	};
	return null;
}
function toCartItem(line, item) {
	return {
		lineKey: line.key,
		itemId: item.id,
		path: line.to,
		name: item.name,
		image: item.image,
		price: item.price,
		code: item.code,
		kind: item.kind
	};
}
//#endregion
export { MoreList as a, LineShop as i, LineItemLink as n, LineProduct as r, LineHomeSection as t };
