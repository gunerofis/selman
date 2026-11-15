import { t as FREE_SHIPPING_FROM } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as formatPrice, b as BRAND } from "./router-BRoH_qS_2.mjs";
import { c as FaqList, s as FAQ_SHIP } from "./faq-D2XSa1MZ.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teslimat-DUK5MOfn.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Teslimat",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mb-8 grid gap-px bg-border sm:grid-cols-3",
				children: [
					["Hazır stok", "3–5 iş günü"],
					["Kargo", `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz`],
					["Çıkış", BRAND.atelier]
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
				"Siparişler ",
				BRAND.atelier,
				" atölyesinden kargoya verilir. Hazır stok 3–5 iş günü. Hafta içi 18.00'a kadar gelen sipariş aynı iş günü işleme alınır; sonrası veya hafta sonu bir sonraki iş gününe kalır. Stok dışı, ölçüye göre veya proje siparişlerinde süre ayrıca yazılır."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [formatPrice(FREE_SHIPPING_FROM), " üzeri Türkiye içi kargo ücretsizdir. Altındaki siparişlerde kargo bedeli sepet özetinde görünür."] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Süreler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[480px] border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border-strong font-mono text-xs uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Sipariş tipi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 pr-4",
								children: "Hazırlık"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3",
								children: "Kargo"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						[
							"Hazır stok",
							"1 iş günü",
							"3–5 iş günü"
						],
						[
							"Ölçüye göre üretim",
							"10–15 iş günü",
							"3–5 iş günü"
						],
						[
							"50 adet ve üzeri",
							"10–20 iş günü",
							"Teslim planına göre"
						]
					].map(([a, b, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-dashed border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "row",
								className: "py-3 pr-4 font-normal text-fg",
								children: a
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4",
								children: b
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3",
								children: c
							})
						]
					}, a)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kargo hasarlıysa" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Paketi kurye yanındayken kontrol edin. Ezik, yırtık veya ıslaklık varsa tutanak tutturun ve teslim almayın. Teslim aldıktan sonra fark ettiyseniz aynı gün fotoğrafla",
				" ",
				BRAND.email,
				" adresine yazın; hasarlı teslimat ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/garanti",
					children: "garanti"
				}),
				"kapsamındadır."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Adres ve teslim" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Teslimat adresi sipariş formunda bildirilir. Adres hatası nedeniyle dönen kargonun yeniden gönderim bedeli alıcıya aittir. Kapıcı, kat ve zil notunuzu ödeme adımındaki teslimat notu alanına yazın; not kargoya iletilir. Kargo takip numarası, çıkıştan sonra e-posta ile gönderilir ve ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/siparis-sorgu",
					children: "sipariş sorgula"
				}),
				" sayfasından da görünür."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"İade ve cayma için ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "İade"
				}),
				" sayfasına bakın."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, { items: FAQ_SHIP })
		]
	});
}
//#endregion
export { Page as component };
