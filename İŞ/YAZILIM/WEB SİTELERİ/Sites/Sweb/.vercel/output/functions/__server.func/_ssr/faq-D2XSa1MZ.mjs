import { i as __toESM } from "../_runtime.mjs";
import { t as FREE_SHIPPING_FROM } from "./order-input-C0XROU9h.mjs";
import { S as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as formatPrice, T as cn, b as BRAND } from "./router-BRoH_qS_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-D2XSa1MZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaqList({ items, heading = "Sık sorulan" }) {
	const base = (0, import_react.useId)();
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: heading === false ? "mt-4" : "mt-12",
		children: [heading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: heading
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 divide-y divide-dashed divide-border border-y border-dashed border-border",
			children: items.map((item, i) => {
				const expanded = open === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-start justify-between gap-4 py-4 text-left",
					"aria-expanded": expanded,
					"aria-controls": `${base}-${i}`,
					onClick: () => setOpen(expanded ? null : i),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: item.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono text-xs text-fg-muted", expanded && "text-fg"),
						children: expanded ? "−" : "+"
					})]
				}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: `${base}-${i}`,
					className: "pb-4 text-sm leading-relaxed text-fg-muted",
					children: item.a
				}) : null] }, item.q);
			})
		})]
	});
}
var FAQ_SHIP = [
	{
		q: "Hazır stok ne kadar sürer?",
		a: "Atölyeden 3–5 iş gününde kargoya verilir. Ölçüye göre parça 10–15 iş günü, elli adet ve üzeri 10–20 iş günüdür."
	},
	{
		q: "Kargo ne zaman ücretsiz?",
		a: `${formatPrice(FREE_SHIPPING_FROM)} üzeri Türkiye içi kargo ücretsizdir. Altındaki siparişlerde bedel sepet özetinde görünür.`
	},
	{
		q: "Yanlış adrese gittiyse?",
		a: "Adres hatası nedeniyle dönen kargonun yeniden gönderim bedeli alıcıya aittir. Teslimat formundaki il, ilçe ve posta kodunu kontrol edin."
	}
];
var FAQ_RETURN = [
	{
		q: "Kaç günde iade ederim?",
		a: "Teslimden itibaren 14 gün. Ürün kullanılmamış ve etiketli olmalıdır. Kargo hasarı ayrı bakılır."
	},
	{
		q: "Ölçüye göre üretim iade olur mu?",
		a: "Kişiye özel kesim, ölçüye göre üretilen ve proje siparişleri iade kapsamı dışındadır."
	},
	{
		q: "İade kargosunu kim öder?",
		a: "Ayıplı üründe satıcı. Anlaşmalı iade taşıyıcısı sitede adı yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Sipariş numarası ve stok koduyla yazın."
	}
];
var FAQ_CARE = [
	{
		q: "Deriyi yağlar mıyım?",
		a: "Hayır. Dış yüzey kaplamadır. Yağ, krem, çözücü ve buhar leke veya soyulma yapar. Nemli bez yeter."
	},
	{
		q: "Banyo ve evyede durur mu?",
		a: "Islak hacimde damlama tepsisi olan parçalar vardır. Suyu silin, gövdeyi ıslatmayın. Dış mekân ve sürekli su yok."
	},
	{
		q: "Güneş rengi değiştirir mi?",
		a: "Uzun doğrudan güneş soldurur. Pencere önünde perde veya gölge önerilir."
	}
];
var FAQ_DESIGN = [
	{
		q: "Sitedeki fiyat net mi?",
		a: "Hayır. İlk tahmin sitede çıkar; onay ve numuneden sonra netleşir. Taslak yönetim paneline kaydedilir ve atölye incelemesine alınır."
	},
	{
		q: "Numune ne kadar sürer?",
		a: "Onaylarsanız numune 10–15 iş günü. Tek parçada 80–900 mm aralığı geçilmez."
	},
	{
		q: "Neyi yapmıyorsunuz?",
		a: "Elektrik, cam-seramik gövde, dış mekân, gıdayla temas ve 900 mm üstü tek parça yok. Ayrıntı ölçü rehberinde."
	},
	{
		q: "Fotoğraf ekler miyim?",
		a: "Evet, en fazla dört görsel seçebilirsiniz. Kayıtta dosya adları atölye notuna eklenir; dosyaları görüşme sırasında iletebilirsiniz."
	}
];
var FAQ_QUOTE = [
	{
		q: "En az kaç adet?",
		a: "Kurumsal teklif 50 adet ve üzeri. Logo baskı talepte belirtilir."
	},
	{
		q: "Ne zaman dönüş yapılır?",
		a: `${BRAND.quoteReply} içinde fiyat ve teslim planı. Üretim 10–20 iş günü.`
	},
	{
		q: "Kartla öder miyim?",
		a: "Bu sitede kart numarası alınmaz. Teklif e-posta ile gider; ödeme kapıda veya havale ile netleşir."
	}
];
var FAQ_PDP = [
	FAQ_SHIP[0],
	FAQ_SHIP[1],
	FAQ_RETURN[0],
	{
		q: "Kartla öder miyim?",
		a: "Bu sitede kart numarası alınmaz. Kapıda nakit veya kart, ya da havale / EFT."
	},
	{
		q: "Ayıplı çıkarsa?",
		a: "Üretim hatası ve kargo hasarı garantide. 14 gün cayma ayrıdır; kullanılmamış ürün."
	}
];
var FAQ_CONTACT = [
	{
		q: "Mesaj nereye gider?",
		a: "Form talebinizi doğrudan yönetim paneline kaydeder ve atölye ekibine iletir."
	},
	{
		q: "Ne zaman açıksınız?",
		a: `Hafta içi ${BRAND.hours}, ${BRAND.atelier}. Hafta sonu kapalı. Dönüş ${BRAND.reply}.`
	},
	{
		q: "Sipariş numaram yoksa?",
		a: "Yine yazın. Varsa tarayıcıdaki son sipariş sayfasından numarayı kopyalayın."
	}
];
//#endregion
export { FAQ_QUOTE as a, FaqList as c, FAQ_PDP as i, FAQ_CONTACT as n, FAQ_RETURN as o, FAQ_DESIGN as r, FAQ_SHIP as s, FAQ_CARE as t };
