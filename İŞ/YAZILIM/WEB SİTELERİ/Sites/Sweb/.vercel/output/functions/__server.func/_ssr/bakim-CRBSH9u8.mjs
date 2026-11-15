import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CATEGORIES } from "./products-BOS9FmZC.mjs";
import { w as Button } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, t as FAQ_CARE } from "./faq-D2XSa1MZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bakim-CRBSH9u8.js
var import_jsx_runtime = require_jsx_runtime();
function CarePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
				children: "Atölye"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Bakım"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-10 grid gap-px bg-border sm:grid-cols-2",
				children: [
					["Yapın", "Nemli, sıkılmış bez. Hafif silin, kurulayın."],
					["Yapmayın", "Yağ, çözücü, buhar, çamaşır suyu, deri kremi."],
					["Güneş", "Uzun doğrudan güneş rengi soldurur. Perde veya gölge."],
					["Damlama", "Tepsi varsa çıkarıp ayrı yıkayın. Gövdeyi ıslatmayın."]
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Oda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl",
						children: "Nerede durduğuna göre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 divide-y divide-dashed divide-border border-y border-dashed border-border",
						children: [
							["ofis", "Kuru bez. Kahve ve mürekkep hemen silin."],
							["banyo", "Damlama tepsisi varsa çıkarın. Gövdeyi ıslatmayın."],
							["mutfak", "Yağ sıçrarsa nemli bez; çözücü yok."],
							["giris", "Islak şemsiye ve ayakkabı suyu silin."]
						].map(([id, note]) => {
							const cat = CATEGORIES.find((c) => c.id === id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-baseline justify-between gap-2 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl",
									children: cat?.name ?? id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-fg-muted",
									children: note
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/kategori/$id",
									params: { id },
									className: "text-xs text-taba hover:underline",
									children: "Odayı gör"
								})]
							}, id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: "Leke"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl",
						children: "Ne döküldüyse ona göre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[520px] border-collapse text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-strong font-mono text-xs uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "Leke"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 pr-4",
										children: "İlk 5 dakika"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3",
										children: "Sonra"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
								[
									"Su",
									"Kuru bezle emdirin, ovmayın.",
									"Oda sıcaklığında kendiliğinden kurusun."
								],
								[
									"Kahve, çay",
									"Nemli bezle üstten alın.",
									"Kuru bezle kurulayın; iz kalırsa tekrarlayın."
								],
								[
									"Yağ",
									"Kuru bezle emdirin.",
									"Ovmayın; çözücü kullanmayın, atölyeye yazın."
								],
								[
									"Mürekkep",
									"Dokunmayın, yaymayın.",
									"Stok kodu ve fotoğrafla atölyeye yazın."
								],
								[
									"Toz",
									"Kuru mikrofiber.",
									"Haftada bir yeterlidir."
								]
							].map(([k, a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-dashed border-border align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										scope: "row",
										className: "py-4 pr-4 font-display text-base font-normal",
										children: k
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 pr-4 text-fg-muted",
										children: a
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 text-fg-muted",
										children: b
									})
								]
							}, k)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-12 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Haftalık", "Kuru mikrofiber bezle tozunu alın."],
					["Aylık", "Nemli, iyice sıkılmış bezle silip hemen kurulayın."],
					["Yılda bir", "Menteşe ve mıknatısları kontrol edin; gevşemişse atölyeye yazın."]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm leading-relaxed text-fg-muted",
				children: [
					"Islak hacimde (banyo, evye) suyu silin. Çizik görünürse atölyeye yazın; renk tamiri stok kodu ve fotoğrafla değerlendirilir. İade koşulları için",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iade",
						className: "text-taba hover:underline",
						children: "iade"
					}),
					" ",
					"sayfası."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/palet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Palet"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/olcu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Ölçü"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/iletisim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Atölyeye yazın" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_CARE })
		]
	});
}
//#endregion
export { CarePage as component };
