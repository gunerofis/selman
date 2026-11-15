import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as ROOM_SURFACE, R as filterCatalog, et as WIDTH_BANDS, r as ColorSwatches } from "./router-BRoH_qS_.mjs";
import { t as CATEGORIES } from "./products-BOS9FmZC.mjs";
import { C as Input, i as ProductCard, w as Button } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, r as FAQ_DESIGN } from "./faq-D2XSa1MZ.mjs";
import { t as DimensionPreview } from "./dimension-preview-D5zlfY9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/olcu-DJya60QN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MeasurePage() {
	const [widthMm, setWidthMm] = (0, import_react.useState)("280");
	const [depthMm, setDepthMm] = (0, import_react.useState)("180");
	const [heightMm, setHeightMm] = (0, import_react.useState)("90");
	const [color, setColor] = (0, import_react.useState)("espresso");
	const bands = (0, import_react.useMemo)(() => WIDTH_BANDS.map((band) => ({
		band,
		products: filterCatalog({ en: band.id }).slice(0, 4),
		total: filterCatalog({ en: band.id }).length
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Nasıl ölçülür"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-fg-muted",
				children: "Milimetre. En × boy × yükseklik. Tek parçada 80–900 mm. Aşağıda katalogdaki gerçek dış ölçüler, oda yüzeyiyle oran."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "space-y-4 text-sm leading-relaxed text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl text-fg",
							children: "1. En"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Oturacağı açıklığın iç genişliği. Çekmece veya tezgâh ağzı."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl text-fg",
							children: "2. Boy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Önden arkaya derinlik. Kapak veya duvar payını düşün."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl text-fg",
							children: "3. Yükseklik"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Üst net boşluk. Menteşe ve ayak payı dahil değilse not düşün."
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DimensionPreview, {
							widthMm,
							depthMm,
							heightMm,
							color,
							note: "Oran canlıdır. Aşağıda katalogdaki gerçek dış ölçüler var."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									"aria-label": "En mm",
									value: widthMm,
									onChange: (e) => setWidthMm(e.target.value),
									placeholder: "en"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									"aria-label": "Boy mm",
									value: depthMm,
									onChange: (e) => setDepthMm(e.target.value),
									placeholder: "boy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									"aria-label": "Yükseklik mm",
									value: heightMm,
									onChange: (e) => setHeightMm(e.target.value),
									placeholder: "yükseklik"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatches, {
							value: color,
							onChange: setColor
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tasarla",
							search: {
								en: widthMm || void 0,
								boy: depthMm || void 0,
								yuk: heightMm || void 0,
								renk: color || void 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full sm:w-auto",
								size: "lg",
								children: "Bu ölçüyle tasarlayın"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Pay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: "Ne kadar pay bırakmalı"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-fg-muted",
						children: "Ölçtüğünüz açıklığa birebir sipariş vermeyin; parça yerine girmez ya da çıkarılamaz."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[560px] border-collapse text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-strong font-mono text-xs uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Yer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Bırakılacak pay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3",
										children: "Neden"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
								[
									"Çekmece içi",
									"Her kenardan 5 mm",
									"Parçayı iki parmakla çıkarabilmek için."
								],
								[
									"Raf arası",
									"Üstten 15 mm",
									"Kapak açılışı ve elin girmesi için."
								],
								[
									"Dolap içi",
									"Derinlikten 10 mm",
									"Kapak menteşesi öne taşar."
								],
								[
									"Masa üstü",
									"Pay gerekmez",
									"Serbest duran parçada ölçü birebir alınır."
								],
								[
									"Duvara monte",
									"Yanlardan 20 mm",
									"Montaj ayarı ve duvar eğriliği payı."
								]
							].map(([a, b, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-dashed border-border align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										scope: "row",
										className: "py-3 pr-4 font-normal text-fg",
										children: a
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 pr-4 text-fg-muted",
										children: b
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-fg-muted",
										children: c
									})
								]
							}, a)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-sm text-fg-muted",
						children: "Ölçüye göre üretimde ±2 mm sapma normaldir; payı bu sapmayı da karşılayacak şekilde bırakın."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Sık hata"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: "Ölçerken en çok yapılan dört hata"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-px bg-border sm:grid-cols-2",
						children: [
							["Dışarıdan ölçmek", "Çekmece veya rafın iç açıklığını ölçün, dış gövdesini değil."],
							["Kapağı unutmak", "Kapak, menteşe ve kulp derinliği açıklıktan çalar."],
							["Tek nokta ölçmek", "İki uçtan ve ortadan ölçün; en dar olanı esas alın."],
							["cm ile mm karıştırmak", "Formlar milimetre ister: 28 cm yerine 280 yazın."]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-bg-elevated px-5 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg-muted",
								children: v
							})]
						}, k))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Yer ölçeği"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: "Tipik yüzeyler"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-fg-muted",
						children: "Ürün iddiası değil; evdeki açıklığı tahmin etmek için."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4",
						children: CATEGORIES.filter((c) => ROOM_SURFACE[c.id]).map((c) => {
							const s = ROOM_SURFACE[c.id];
							if (!s) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "bg-bg-elevated px-4 py-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-fg-muted uppercase",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-display text-xl",
										children: [s.mm / 10, " cm"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-fg-muted",
										children: s.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/kategori/$id",
										params: { id: c.id },
										className: "mt-3 inline-block text-xs text-taba hover:underline",
										children: "Odayı gör"
									})
								]
							}, c.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Katalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: "Ene göre parçalar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-fg-muted",
						children: "Dış ölçüdeki ilk milimetre. Bant, koleksiyon filtresiyle aynı."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 space-y-14",
						children: bands.map(({ band, products, total }) => products.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-muted uppercase",
								children: band.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-fg-muted",
								children: [total, " parça"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/koleksiyon",
								search: { en: band.id },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									children: "Bu eni filtrele"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
							children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.sku))
						})] }, band.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 border border-dashed border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-fg-muted",
					children: "Yapmadıklarımız"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-1.5 text-sm text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Elektrikli veya elektronik parça" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cam ve seramik gövde" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dış mekân ve suya dayanıklı ürün" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tek parçada 900 mm üstü ölçü" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Gıdayla doğrudan temas eden yüzey" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_DESIGN })
		]
	});
}
//#endregion
export { MeasurePage as component };
