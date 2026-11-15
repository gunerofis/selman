import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { X as useSiteConfig } from "./router-BRoH_qS_.mjs";
import { b as BRAND } from "./router-BRoH_qS_2.mjs";
import { t as LegalPage } from "./legal-page-ByGkrLxl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mesafeli-BUkIYqQt.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { identity } = useSiteConfig();
	const seller = identity.legalName || identity.name;
	const address = identity.legalAddress || identity.atelier;
	const legalEmail = identity.legalEmail || identity.email;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegalPage, {
		kicker: "Hukuki",
		title: "Mesafeli satış sözleşmesi",
		updated: BRAND.legalUpdated,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Taraflar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Satıcı: ",
				seller,
				", ",
				address,
				", ",
				legalEmail,
				". Alıcı: sipariş formunda kimlik ve iletişim bilgilerini bildiren tüketicidir. Sipariş özeti, ön bilgilendirme ve bu sözleşme bir bütündür."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Konu" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sözleşmenin konusu, alıcının elektronik ortamda temel niteliklerini, adedini, rengini, bedelini ve teslimat bilgilerini görerek seçtiği malların satışı ve bildirilen adrese teslimidir. Sipariş özetinde gösterilen fiyatlara KDV dahildir; kargo ve varsa onaylanan ek bedeller ayrıca gösterilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Sözleşmenin kurulması" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Alıcı, siparişi tamamlamadan önce malın temel niteliklerini, toplam bedeli, teslimatı, ödeme yöntemini ve cayma koşullarını inceleyip onaylar. Sipariş kaydının oluşması, alıcının ödeme yükümlülüğü doğuran siparişi verdiğini gösterir. Satıcı sipariş numarasını ve kaydın durumunu kalıcı veri saklayıcıyla iletir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ödeme" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kart bilgisi sitede alınmaz. Ödeme kapıda nakit/kart veya havale / EFT ile yapılır. Havale seçilirse açıklamalı dekont, sipariş onayından sonra iletilen hesaba 2 iş günü içinde beklenir. Ödeme yöntemine ilişkin banka veya kargo kuruluşunun kendi hizmet şartları saklıdır; satıcının onaylamadığı hiçbir ek bedel tahsil edilmez." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Teslimat" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Hazır stok 3–5 iş günü içinde kargoya verilir. Ölçüye göre ve kurumsal işlerde süre ayrıca yazılır. Ayrıca kararlaştırılmadıysa mal en geç otuz gün içinde gönderilir. Teslime kadar kayıp ve hasar riski satıcıya aittir. İfanın imkânsızlaşması hâlinde alıcıya üç gün içinde bilgi verilir; tahsil edilen bedeller mevzuattaki sürede iade edilir. Ayrıntı:",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/teslimat",
					children: "Teslimat"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Cayma hakkı ve kullanımı" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Alıcı, malı teslim aldığı günden itibaren on dört gün içinde gerekçe göstermeden ve cezai şart ödemeden cayabilir; teslimden önce de cayma bildirimi yapabilir. Bildirim, süre dolmadan ",
				legalEmail,
				" adresine veya ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cayma",
					children: "cayma formuna"
				}),
				" açık bir beyanla iletilir. Telefonla bildirim tek başına yeterli kabul edilmez."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Alıcı, cayma bildiriminden itibaren on dört gün içinde malı iade eder. Ön bilgilendirmede iade taşıyıcısı belirtilmemişse alıcı iade masrafından sorumlu tutulmaz. Satıcı, mevzuatta belirlenen başlangıç tarihinden itibaren teslimat giderleri dâhil tahsil ettiği ödemeleri on dört gün içinde, kullanılan ödeme aracına uygun ve masrafsız biçimde iade eder. Alıcı malı yalnızca niteliğini ve işleyişini anlamak için gerekli ölçüde incelemekten sorumludur; bunun ötesindeki değer azalması ayrıca değerlendirilir." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Cayma hakkı istisnaları" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Alıcının özel istek ve ihtiyaçları doğrultusunda üretilen, standart seçeneklerin ötesinde kişiye özel ölçülendirilen, isimlendirilen veya geri satışı olağan şekilde mümkün olmayan mallarda mevzuattaki cayma istisnası uygulanır. Yalnızca standart renk seçmek, tek başına kişiye özel üretim sayılmaz. Ayıplı mala ilişkin yasal haklar bu istisnalardan etkilenmez. Ayrıntı: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/iade",
					children: "İade"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ayıplı mal ve başvuru" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Malın kararlaştırılan nitelikleri taşımaması hâlinde alıcı 6502 sayılı Kanun’daki seçimlik haklarını kullanabilir. Talep, sipariş numarası ve sorunun açıklamasıyla iletişim kanalından kayda alınır." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Uyuşmazlık" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Başvuru, parasal sınırlara göre tüketicinin yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetine; diğer uyuşmazlıklarda dava şartı arabuluculuk sonrası Tüketici Mahkemesine yapılabilir. Ayrıntı: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sikayet",
					children: "Şikayet"
				}),
				". Ön bilgilendirme: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/on-bilgilendirme",
					children: "ön bilgilendirme"
				}),
				"."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Kayıtlar" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sipariş, ön bilgilendirme, teslimat, cayma ve ilgili işlem kayıtları mevzuatta öngörülen sürelerle saklanır. Alıcı, sipariş numarasıyla kayıtlarına ilişkin talep oluşturabilir." })
		]
	});
}
//#endregion
export { Page as component };
