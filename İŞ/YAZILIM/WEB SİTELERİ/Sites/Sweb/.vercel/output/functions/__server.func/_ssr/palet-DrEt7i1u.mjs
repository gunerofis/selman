import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as featuredProducts, n as COLORS, r as PASTEL } from "./products-BOS9FmZC.mjs";
import { i as ProductCard, w as Button } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/palet-DrEt7i1u.js
var import_jsx_runtime = require_jsx_runtime();
var NOTES = {
	espresso: {
		tone: "Koyu sıcak",
		finish: "Mat, ince dokulu",
		use: "Ceviz ve koyu ahşap masalarda; yönetici masası setlerinde ilk tercih.",
		care: "İz ve parmak izini en az gösteren renk."
	},
	siyah: {
		tone: "En koyu",
		finish: "Mat",
		use: "Cam, metal ve teknoloji ürünlerinin yanında; modern ofis düzeninde.",
		care: "Toz açık renkten daha görünür; kuru bezle silin."
	},
	bordo: {
		tone: "Koyu sıcak",
		finish: "Hafif parlak",
		use: "Klasik ahşap mobilya ve deri koltuk yanında.",
		care: "Güneşte uzun süre kalırsa tonu açılır."
	},
	taba: {
		tone: "Orta sıcak",
		finish: "Doğal deri görünümü",
		use: "Meşe, kayın ve açık ahşapta; hediye setlerinde en çok seçilen renk.",
		care: "Zamanla patina yapar; bu rengin beklenen davranışıdır."
	},
	lacivert: {
		tone: "Koyu soğuk",
		finish: "Mat",
		use: "Krem ve bej zeminlerde vurgu rengi; kütüphane ve çalışma odasında.",
		care: "Koyu renkler gibi iz göstermez."
	},
	gri: {
		tone: "Orta nötr",
		finish: "Mat",
		use: "Beton, mermer ve gri tonlu mekânlarda; banyo ve makyaj alanında.",
		care: "Açık renklerden daha dayanıklı, koyu renklerden daha yumuşak."
	},
	krem: {
		tone: "Açık sıcak",
		finish: "Mat",
		use: "Küçük alanları büyütmek için; makyaj ve gardırop ürünlerinde.",
		care: "Leke gösterir; nemli bezle düzenli silin."
	},
	beyaz: {
		tone: "En açık",
		finish: "Mat",
		use: "Beyaz mobilya ve yüksek kontrastlı sunumlarda.",
		care: "En çok bakım isteyen renk; açık renk eşya ile kullanın."
	},
	kirmizi: {
		tone: "Canlı sıcak",
		finish: "Hafif parlak",
		use: "Nötr ve koyu mobilyalarda güçlü vurgu rengi olarak.",
		care: "Doğrudan güneşte uzun süre bırakmayın."
	},
	turuncu: {
		tone: "Canlı sıcak",
		finish: "Mat",
		use: "Yaratıcı çalışma alanları ve açık ahşap yüzeylerde.",
		care: "Nemli, renksiz bir bezle temizleyin."
	},
	pembe: {
		tone: "Açık sıcak",
		finish: "Mat",
		use: "Açık renkli masa ve kişisel çalışma alanlarında.",
		care: "Koyu renkli kumaşlarla uzun süre temas ettirmeyin."
	},
	turkuaz: {
		tone: "Canlı soğuk",
		finish: "Mat",
		use: "Beyaz, krem ve açık ahşap yüzeylerde belirgin vurgu için.",
		care: "Rengi korumak için doğrudan güneşten uzak tutun."
	},
	mavi: {
		tone: "Orta soğuk",
		finish: "Mat",
		use: "Modern ofislerde beyaz, gri ve metal yüzeylerle.",
		care: "Kuru veya hafif nemli bezle silin."
	},
	yesil: {
		tone: "Koyu doğal",
		finish: "Mat",
		use: "Ceviz, meşe ve doğal dokulu çalışma alanlarında.",
		care: "Koyu ton olduğu için günlük kullanım izlerini iyi saklar."
	}
};
var PAIRS = [
	{
		title: "Kahve + Taba",
		body: "Aynı sıcak ailede iki ton. Masa setinde büyük parçalar kahve, küçük aksesuarlar taba.",
		ids: ["espresso", "taba"]
	},
	{
		title: "Lacivert + Krem",
		body: "Koyu soğuk zemine açık sıcak vurgu. Vitrin ve kitaplık düzeninde çalışır.",
		ids: ["lacivert", "krem"]
	},
	{
		title: "Siyah + Gri",
		body: "Tek renkli, nötr bir düzen. Teknoloji ağırlıklı masalarda dağınık görünmez.",
		ids: ["siyah", "gri"]
	}
];
function PalettePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Deri"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "On dört renk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-fg-muted",
				children: "Sümen takımlarında kullanılan on dört deri rengi. Aşağıda her rengin tonu, dokusu, hangi alanda iyi durduğu ve günlük kullanımda nasıl davrandığı yazılıdır."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4",
				children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/koleksiyon",
					search: { renk: c.id },
					className: "group flex min-h-56 flex-col justify-between p-5",
					style: { backgroundColor: PASTEL[c.id] },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-10 border border-border-strong",
						style: { backgroundColor: c.swatch }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-3xl",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-mono text-xs text-fg-muted",
							children: NOTES[c.id].tone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-mono text-xs text-fg-muted",
							children: "Ürünlerde gör →"
						})
					] })]
				}) }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Renk künyesi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-fg-muted",
						children: "Ekrandaki renk ile deri arasında ton farkı olabilir; kesin karar için numune isteyin."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] border-collapse text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-strong font-mono text-xs uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Renk"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Ton"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Yüzey"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Nerede iyi durur"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3",
										children: "Kullanımda"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-dashed border-border align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										scope: "row",
										className: "py-4 pr-4 font-normal",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-5 shrink-0 border border-border-strong",
												style: { backgroundColor: c.swatch }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-base",
												children: c.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 pr-4 text-fg-muted",
										children: NOTES[c.id].tone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 pr-4 text-fg-muted",
										children: NOTES[c.id].finish
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 pr-4 text-fg-muted",
										children: NOTES[c.id].use
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 text-fg-muted",
										children: NOTES[c.id].care
									})
								]
							}, c.id)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Renk nasıl seçilir"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-px bg-border sm:grid-cols-3",
					children: [
						["Mobilyaya değil, zemine bakın", "Ürün çoğu zaman masanın veya rafın üstünde durur. Rengi mobilyanın tonuyla değil, altındaki yüzeyle karşılaştırın."],
						["Kullanım sıklığına göre koyulaştırın", "Her gün elle temas eden parçalarda (saat ve mücevher kutuları) koyu renkler izi gizler. Vitrin parçalarında açık renk serbesttir."],
						["Sette tek renk, aksesuarda ikinci renk", "Büyük parçaları tek renkte tutun; küçük aksesuarlarda ikinci bir ton kullanın. Üç renk bir masada dağınık görünür."]
					].map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-bg-elevated px-5 py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-fg-subtle",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-xl",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg-muted",
								children: d
							})
						]
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Uyumlu ikililer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-px bg-border sm:grid-cols-3",
					children: PAIRS.map((pair) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-bg-elevated px-5 py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: pair.ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-10 flex-1 border border-border-strong",
									style: { backgroundColor: COLORS.find((c) => c.id === id)?.swatch }
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-display text-xl",
								children: pair.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg-muted",
								children: pair.body
							})
						]
					}, pair.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Aynı parça, on dört zemin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-fg-muted",
						children: "Fotoğraf değişmez. Seçilen renk kartın zeminini boyar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
						children: COLORS.map((c, i) => {
							const sample = featuredProducts()[i % Math.max(1, featuredProducts().length)];
							if (!sample) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 font-display text-xl",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
									product: sample,
									color: c.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/koleksiyon",
									search: { renk: c.id },
									className: "mt-2 inline-block text-xs text-taba hover:underline",
									children: [c.name, " zeminde koleksiyon"]
								})
							] }, c.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 grid gap-px bg-border sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-6 py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Palet dışı renk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg-muted",
							children: "Kurumsal kimlik rengi veya palet dışı bir ton isteniyorsa 50 adet ve üzeri siparişlerde özel renk çalışılır. Pantone veya fiziksel numune gönderin."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/kurumsal-teklif",
								search: { not: "Palet dışı renk talebi" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Kurumsal teklif" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/iletisim",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									children: "Numune iste"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-6 py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Renkten sonra"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fg-muted",
							children: "Renk seçtikten sonra sırada ölçü ve bakım var."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/olcu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "Ölçü rehberi"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/bakim",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "Bakım rehberi"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/malzeme",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "Malzemeler"
									})
								})
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { PalettePage as component };
