import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as useSiteConfig } from "./router-BRoH_qS_.mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kvkk-u6nXmOg2.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { identity } = useSiteConfig();
	const seller = identity.legalName || identity.name;
	const address = identity.legalAddress || identity.atelier;
	const legalEmail = identity.legalEmail || identity.email;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "KVKK aydınlatma metni",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "6698 sayılı Kişisel Verilerin Korunması Kanunu md. 10 uyarınca:" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Veri sorumlusu" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				seller,
				", ",
				address,
				". E-posta: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${legalEmail}`,
					children: legalEmail
				}),
				".",
				identity.mersisNumber ? ` MERSİS: ${identity.mersisNumber}.` : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İşlenen veriler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kimlik (ad soyad), iletişim (e-posta, telefon), teslimat ve fatura adresi, sipariş, teklif, özel üretim ve şikâyet içeriği; işlem güvenliği (IP, cihaz, oturum ve hareket kaydı), müşteri işlem ve pazarlama tercihleri işlenir. Site ödeme kartı numarası veya güvenlik kodu toplamaz." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "İşleme amaçları" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Veriler; sipariş ve teklifin oluşturulması, üretim ve teslimatın yürütülmesi, müşteri desteği, cayma ve iade taleplerinin sonuçlandırılması, muhasebe ve vergi yükümlülüklerinin yerine getirilmesi, bilgi güvenliği, uyuşmazlıkların yönetimi ve açık rıza verilen bülten iletişimi amaçlarıyla işlenir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Hukuki sebepler" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sipariş, teslimat ve teklif verileri sözleşmenin kurulması veya ifası için gerekli olma; fatura, vergi ve resmî talep kayıtları hukuki yükümlülüğün yerine getirilmesi; güvenlik, denetim ve hak arama kayıtları bir hakkın tesisi, kullanılması veya korunması ile temel hak ve özgürlüklere zarar vermeyen meşru menfaat sebeplerine dayanır. Bülten ve ticari ileti, ilgili mevzuata uygun ayrı onayla işlenir; bu onay her zaman geri alınabilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Toplama yöntemi" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Veriler; site formları, sipariş ve yönetim ekranları, e-posta veya telefon iletişimi ve tarayıcının zorunlu teknik kayıtları aracılığıyla tamamen veya kısmen otomatik yollarla, gerektiğinde veri kayıt sisteminin parçası olan otomatik olmayan yollarla elde edilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Aktarım" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kimlik, iletişim ve teslimat verileri siparişin ifası için kargo ve lojistik hizmet sağlayıcılarına; mali kayıtlar muhasebe, banka ve yetkili kamu kurumlarına; gerekli teknik kayıtlar barındırma, veritabanı, güvenlik ve iletişim hizmeti sağlayıcılarına yalnızca ilgili amaçla sınırlı olarak aktarılabilir. Yurt dışı aktarımı gerektiren altyapı hizmetlerinde 6698 sayılı Kanun’un yurt dışı aktarıma ilişkin hükümleri ve uygun güvenceler uygulanır." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Saklama" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sipariş, fatura ve ticari kayıtlar ilgili kanunlardaki zorunlu süreler; mesafeli sözleşme işlem kayıtları en az mevzuatta öngörülen süre; teklif ve iletişim kayıtları ise amaç için gerekli makul süre boyunca tutulur. Amaç ve hukuki saklama sebebi sona erdiğinde veriler silinir, yok edilir veya anonimleştirilir. Tarayıcıdaki sepet ve favori, siz silene dek cihazınızda kalır." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ticari ileti" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Atölye notları ve kampanya iletileri, aydınlatmadan ayrı sunulan bülten onayıyla gönderilir. Onayın geri alınması, sipariş ve destek hizmetlerini etkilemez. Ayrıntı:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bulten",
					children: "bülten"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Haklarınız" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kanun’un 11. maddesi kapsamında verinizin işlenip işlenmediğini öğrenme, bilgi isteme, işleme amacını ve amaca uygun kullanımını öğrenme, aktarılan üçüncü kişileri bilme, eksik veya yanlış verinin düzeltilmesini, koşulları oluşmuşsa silinmesini veya yok edilmesini ve bu işlemlerin aktarılanlara bildirilmesini isteme; otomatik analiz sonucuna itiraz etme ve hukuka aykırı işleme nedeniyle zararın giderilmesini talep etme haklarınız vardır." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Başvuru" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Kimliğinizi ve talebinizi açıklayan başvuruyu ",
				legalEmail,
				" adresine veya satıcının ilan edilen tebligat adresine iletebilirsiniz. Başvuru, niteliğine göre en kısa sürede ve en geç otuz gün içinde yanıtlanır; ayrıca Kişisel Verileri Koruma Kuruluna şikâyet hakkınız bulunur."
			] })
		]
	});
}
//#endregion
export { Page as component };
