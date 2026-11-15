import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as sellerName, b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gizlilik-CnjwA3RJ.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Gizlilik politikası",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Veri sorumlusu: ",
				sellerName(),
				", ",
				BRAND.atelier,
				". İletişim:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${BRAND.email}`,
					children: BRAND.email
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Toplanan veriler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sipariş ve formlarda ad soyad, e-posta, telefon, teslimat adresi, sipariş içeriği ve gönüllü notlar alınır. Kart numarası, CVV veya IBAN bu sitede toplanmaz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Amaç" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Veriler siparişi ve talebi işlemek, teslimatı planlamak ve size dönüş yapmak için kullanılır. Formlar yönetim paneline kaydedilir ve yetkili personel tarafından işlenir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Tarayıcıda tutulan veri" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sepet, favori, son sipariş özeti ve çerez tercihi cihazınızda kalır; başka bir cihaza taşınmaz. Tarayıcı verisini silerek bunları kaldırabilirsiniz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Paylaşım" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Kargo ve yasal yükümlülük dışında üçüncü taraflara satılmaz veya pazarlama listesine eklenmez. Ölçüm ve reklam çerezi yoktur. Bülten yalnız açık rıza ile:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bulten",
					children: "atölye notları"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Haklar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Erişim, düzeltme, silme ve itiraz talepleri ",
				BRAND.email,
				" adresine yazılır. Ayrıntı için",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/kvkk",
					className: "text-taba",
					children: "KVKK aydınlatma metni"
				}),
				"."
			] })
		]
	});
}
//#endregion
export { Page as component };
