import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/garanti-IYi505ok.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Yardım",
		title: "Garanti",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mb-8 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Ayıp", "Üretim, dikiş, kaplama, menteşe"],
					["Kargo", "Hasar ayrı bakılır"],
					["Cayma", "14 gün, /iade ve /cayma"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg-elevated px-4 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-xs tracking-wide text-fg-muted uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 text-fg",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Bu sayfa ayıplı mal içindir. Beğenmeme, ölçü pişmanlığı veya hediye değişimi 14 günlük",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma"
				}),
				" ve ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "iade"
				}),
				" kapsamındadır."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ne ayıptır" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Dikiş açılması, kaplama kalkması, menteşe veya döner aksamın çalışmaması, teslimde kargo hasarı. Yanlış kullanım, yağ, çözücü, buhar ve uzun güneş ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bakim",
					children: "bakım"
				}),
				" ",
				"dışıdır; ayıp sayılmaz."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ürün grubuna göre kapsam" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[680px] border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border bg-bg-wash",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: " Ürün grubu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Tamir / servis"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Değişim"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Kullanıcı hatası"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [[
						"Hazır ve standart ürün",
						"Dikiş, kaplama ve mekanizma incelenir; üretim hatası tamir edilir.",
						"Tamir uygun değilse aynı model veya yasal seçimlik haklar değerlendirilir.",
						"Darbe, sıvı, çözücü, buhar ve bakım talimatına aykırı kullanım kapsam dışıdır."
					], [
						"Ölçüye veya kişiye özel ürün",
						"Onaylanan ölçü ve tasarıma uygunluk ile üretim hatası incelenir.",
						"Üretim hatasında tamir veya yeniden üretim değerlendirilir; cayma istisnası ayıplı mal haklarını kaldırmaz.",
						"Yanlış verilen ölçü, sonradan tercih değişikliği ve uygunsuz kullanım kapsam dışıdır."
					]].map(([group, service, replacement, misuse]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-dashed border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "row",
								className: "px-3 py-3 font-normal text-fg",
								children: group
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-fg-muted",
								children: service
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-fg-muted",
								children: replacement
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-fg-muted",
								children: misuse
							})
						]
					}, group)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ne yapıyoruz" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Sipariş numarası, stok kodu ve fotoğrafla ",
				BRAND.email,
				" adresine yazın. Ayıp görülürse tamir veya aynı model değişim. Ölçüye göre üretilen parçada cayma yoktur; üretim hatası yine ayıptır."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Başvuruda ne gerekir" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 text-sm",
				children: [
					"Sipariş numarası (SW- ile başlar)",
					"Ürünün stok kodu",
					"Sorunu gösteren 2–3 fotoğraf, mümkünse gün ışığında",
					"Sorunun ne zaman ve nasıl ortaya çıktığı"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 bg-taba" }), item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Süreç ve süre" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full min-w-[420px] border-collapse text-left text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						["Değerlendirme", `${BRAND.reply} içinde yanıt`],
						["Ürünün atölyeye ulaşması", "Kargo süresi, bedeli satıcıda"],
						["Tamir veya değişim", "10–15 iş günü"],
						["Yeniden gönderim", "3–5 iş günü, bedeli satıcıda"]
					].map(([a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-dashed border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "row",
							className: "py-3 pr-4 font-normal text-fg",
							children: a
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: b
						})]
					}, a)) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kargo" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ayıplı üründe iade ve yeniden gönderim kargosu satıcıya aittir. Anlaşmalı iade taşıyıcısı sitede adı yazılmaz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Yasal ayıp hükümleri 6502 sayılı Kanun’dadır. Ticari “24 ay belgesi” sitede uydurulmaz. Şikayet yolu: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sikayet",
					children: "şikayet"
				}),
				"."
			] })
		]
	});
}
//#endregion
export { Page as component };
