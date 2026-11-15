import { t as FREE_SHIPPING_FROM } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as useSiteConfig } from "./router-BRoH_qS_.mjs";
import { E as formatPrice, b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/on-bilgilendirme-BE0O82ms.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { identity } = useSiteConfig();
	const seller = identity.legalName || identity.name;
	const address = identity.legalAddress || identity.atelier;
	const legalEmail = identity.legalEmail || identity.email;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Ön bilgilendirme",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş onayından önce. Kart numarası bu sitede alınmaz; ödeme kapıda veya havale iledir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Satıcı" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				seller,
				", ",
				address,
				", Türkiye. E-posta: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${legalEmail}`,
					children: legalEmail
				}),
				". Çalışma: hafta içi ",
				identity.hours,
				".",
				identity.phone ? ` Telefon: ${identity.phone}.` : null,
				identity.mersisNumber ? ` MERSİS: ${identity.mersisNumber}.` : null,
				identity.taxNumber ? ` Vergi kimlik numarası: ${identity.taxNumber}.` : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Mal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ev ve çalışma alanı için düzen ürünleri. Deri kaplama, sekiz renk. Fiyat KDV dahildir. Ölçü, ağırlık ve stok kodu ürün sayfasındadır. Fotoğraf örnektir; seçilen renk zemini boyar." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bedel" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Ürün fiyatı + kargo. Kargo ",
				formatPrice(149),
				"; ",
				formatPrice(FREE_SHIPPING_FROM),
				" ",
				"üzeri siparişte kargo ücretsiz. Başka tahsilat sitede yoktur."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ödeme" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Kapıda nakit, kapıda kart (kurye POS) veya havale / EFT. Havale IBAN’ı sipariş onayından sonra e-posta ile gelir; sitede yazılmaz. Ayrıntı:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/odeme-yontemleri",
					children: "Ödeme yöntemleri"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Teslim" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Hazır stok 3–5 iş günü içinde kargoya verilir. Hafta içi 18.00’a kadar gelen sipariş aynı iş günü işleme alınır. Ayrıca kararlaştırılmadıysa teslim süresi en fazla otuz gündür. Ölçüye göre ve elli adet üzeri süre ayrıca yazılır. Teslime kadar kayıp ve hasar riski satıcıya aittir. Ayrıntı: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/teslimat",
					children: "Teslimat"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Cayma" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Teslimden itibaren 14 gün, gerekçesiz. Bildirim ",
				legalEmail,
				" veya",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma"
				}),
				" sayfasından. Kullanılmış, hasarlı veya kişiye özel kesim cayma dışıdır. Anlaşmalı iade taşıyıcısı sitede adı yazılmadığı için cayma iade kargosunu tüketiciye yüklemeyiz. Ayrıntı: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "İade"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Şikayet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Önce ",
				legalEmail,
				". Çözülmezse Tüketici Hakem Heyeti; tüketici mahkemesi için 6502 m. 73/A uyarınca önce arabulucu. Ayrıntı: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sikayet",
					children: "Şikayet"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sözleşme" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Sipariş düğmesi ödeme yükümlülüğü doğurduğunu açıkça belirtir. Onay,",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mesafeli",
					children: "mesafeli satış sözleşmesi"
				}),
				" ve bu metinle kurulur. Sipariş, yönetim paneline kaydedilir ve size verilen kayıt numarasıyla takip edilir. Ön bilgilendirme, sipariş ve teslimat kayıtları mevzuattaki saklama süresi boyunca korunur."
			] })
		]
	});
}
//#endregion
export { Page as component };
