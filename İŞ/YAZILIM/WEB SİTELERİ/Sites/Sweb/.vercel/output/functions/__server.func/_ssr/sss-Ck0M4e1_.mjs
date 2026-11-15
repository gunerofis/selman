import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { a as FAQ_QUOTE, c as FaqList, n as FAQ_CONTACT, o as FAQ_RETURN, r as FAQ_DESIGN, s as FAQ_SHIP, t as FAQ_CARE } from "./faq-D2XSa1MZ.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sss-Ck0M4e1_.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const faqJsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			...FAQ_SHIP,
			...FAQ_RETURN,
			...FAQ_CARE,
			...FAQ_DESIGN,
			...FAQ_QUOTE,
			...FAQ_CONTACT
		].map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.a
			}
		}))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Yardım",
		title: "Sıkça sorulanlar",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(faqJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kısa yanıtlar. Teslimat, iade, bakım ve tasarım sayfalarında ayrıntı var." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kısa yol" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 text-sm",
				children: [
					[
						"Siparişim nerede?",
						"/siparis-sorgu",
						"Sipariş sorgula"
					],
					[
						"Nasıl iade ederim?",
						"/iade",
						"İade"
					],
					[
						"Kargo ne zaman gelir?",
						"/teslimat",
						"Teslimat"
					],
					[
						"Nasıl öderim?",
						"/odeme-yontemleri",
						"Ödeme yöntemleri"
					],
					[
						"Hangi renk?",
						"/palet",
						"Renk paleti"
					],
					[
						"Nasıl ölçerim?",
						"/olcu",
						"Ölçü rehberi"
					],
					[
						"Tek parça fiyatı",
						"/teklif",
						"Ürün teklifi"
					],
					[
						"50 adet ve üzeri",
						"/kurumsal-teklif",
						"Kurumsal teklif"
					]
				].map(([q, to, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap gap-x-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to,
						children: label
					})]
				}, q))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Teslimat" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_SHIP,
				heading: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İade ve cayma" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_RETURN,
				heading: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"Bildirim: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cayma",
						children: "cayma formu"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bakım" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_CARE,
				heading: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ölçüye göre" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_DESIGN,
				heading: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Teklif ve kurumsal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_QUOTE,
				heading: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Yazışma" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqList, {
				items: FAQ_CONTACT,
				heading: false
			})
		]
	});
}
//#endregion
export { Page as component };
