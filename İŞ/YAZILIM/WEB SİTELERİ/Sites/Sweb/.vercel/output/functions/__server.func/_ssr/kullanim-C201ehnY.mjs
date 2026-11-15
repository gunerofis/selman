import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as sellerName, b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kullanim-C201ehnY.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Kullanım koşulları",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Bu metin ",
				sellerName(),
				" sitesinin tarayıcıda kullanımına dairdir. Satın alma",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mesafeli",
					children: "mesafeli satış"
				}),
				" ve",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/on-bilgilendirme",
					children: "ön bilgilendirme"
				}),
				" iledir."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Hesap yok" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Üyelik zorunlu değildir. Sepet, favori, karşılaştırma ve son sipariş özeti bu tarayıcıda tutulur; başka cihaza taşınmaz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sipariş ve kart" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sipariş ve form talepleri yönetim paneline kaydedilir. Kart numarası sitede alınmaz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İçerik" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ürün fotoğrafları örnektir; seçilen renk zemini boyar. Görselleri ve metinleri izinsiz çoğaltmayın. Fiyat KDV dahildir; ölçüye göre işte ilk tahmin netleşene kadar bağlayıcı değildir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Çerez ve veri" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Zorunlu tarayıcı kaydı ve tercih: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cerez",
					children: "çerez politikası"
				}),
				",",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/gizlilik",
					children: "gizlilik"
				}),
				", ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/kvkk",
					children: "KVKK"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Uyuşmazlık" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Tüketici işlemlerinde 6502 sayılı Kanun saklıdır. Şikayet:",
				" ",
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
