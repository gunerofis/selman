import { BRAND } from "./brand";
import { FREE_SHIPPING_FROM } from "./products";
import { formatPrice } from "./utils";

export type FaqItem = { q: string; a: string };

export const FAQ_SHIP: FaqItem[] = [
  {
    q: "Hazır stok ne kadar sürer?",
    a: "Stoktaki ürünler 1–3 iş gününde kargoya verilir.",
  },
  {
    q: "Kargo ne zaman ücretsiz?",
    a: `${formatPrice(FREE_SHIPPING_FROM)} üzeri Türkiye içi kargo ücretsizdir. Altındaki siparişlerde bedel sepet özetinde görünür. Yurt dışı gönderim kapalıdır.`,
  },
  {
    q: "Yanlış adrese gittiyse?",
    a: "Adres hatası nedeniyle dönen kargonun yeniden gönderim bedeli alıcıya aittir. Teslimat formundaki il, ilçe ve posta kodunu kontrol edin.",
  },
];

export const FAQ_RETURN: FaqItem[] = [
  {
    q: "Kaç günde iade ederim?",
    a: "Teslimden itibaren 14 gün. Ambalajı ve jelatini açılmamış olmalıdır; açılmış kozmetik ürün hijyen nedeniyle iade alınmaz. Kargo hasarı ayrı bakılır.",
  },
  {
    q: "İade kargosunu kim öder?",
    a: "Ayıplı üründe satıcı. Anlaşmalı iade taşıyıcısı sitede adı yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Sipariş numarası ve stok koduyla yazın.",
  },
];

export const FAQ_CARE: FaqItem[] = [
  {
    q: "Ürünler orijinal mi?",
    a: "Evet. Tüm ürünler yetkili kaynaktan faturalı alınır; etikette parti numarası bulunur.",
  },
  {
    q: "EDP ile EDT farkı nedir?",
    a: "EDP (Eau de Parfum) %15–20 esans içerir, 6–8 saat kalır. EDT (Eau de Toilette) %5–15 esansla daha hafiftir, 3–5 saat kalır.",
  },
  {
    q: "Deneme boyu nedir?",
    a: "Orijinal şişeden hijyenik koşullarda 2–10 ml cam şişeye aktarılan tanıtım boyudur. Şişeyi almadan önce kokuyu ciltte denemek içindir.",
  },
  {
    q: "Kalıcılığı nasıl artırırım?",
    a: "Nemli cilde, bilek, boyun ve kulak arkasına sıkın; ovmayın. Kalıcılık cilt tipine ve havaya göre değişir.",
  },
  {
    q: "Parfüm nasıl saklanır?",
    a: "Kutusunda, güneş ve ısıdan uzak, serin yerde. Banyo gibi nemli ve sıcak ortamlar kokuyu bozar.",
  },
];

export const FAQ_DESIGN: FaqItem[] = [];

export const FAQ_QUOTE: FaqItem[] = [
  {
    q: "En az kaç adet?",
    a: "Kurumsal teklif 50 adet ve üzeri.",
  },
  {
    q: "Ne zaman dönüş yapılır?",
    a: `${BRAND.quoteReply} içinde fiyat ve teslim planı.`,
  },
  {
    q: "Kartla öder miyim?",
    a: "Bu sitede kart numarası alınmaz. Teklif e-posta ile gider; ödeme kapıda veya havale ile netleşir.",
  },
];

export function shipFaq(freeFrom: number): FaqItem[] {
  return FAQ_SHIP.map((item) =>
    item.q === "Kargo ne zaman ücretsiz?"
      ? {
          ...item,
          a: `${formatPrice(freeFrom)} üzeri Türkiye içi kargo ücretsizdir. Altındaki siparişlerde bedel sepet özetinde görünür. Yurt dışı gönderim kapalıdır.`,
        }
      : item,
  );
}

export const FAQ_PDP: FaqItem[] = [
  FAQ_CARE[0],
  FAQ_CARE[2],
  FAQ_SHIP[0],
  FAQ_SHIP[1],
  FAQ_RETURN[0],
  {
    q: "Kartla öder miyim?",
    a: "Bu sitede kart numarası alınmaz. Kapıda nakit veya kart, ya da havale / EFT.",
  },
  {
    q: "Ayıplı çıkarsa?",
    a: "Üretim hatası ve kargo hasarı garantide. 14 gün cayma ayrıdır; ambalajı açılmamış ürün.",
  },
];

export const FAQ_CONTACT: FaqItem[] = [
  {
    q: "Mesaj nereye gider?",
    a: "Form talebinizi doğrudan yönetim paneline kaydeder ve ekibimize iletir.",
  },
  {
    q: "Ne zaman açıksınız?",
    a: `Hafta içi ${BRAND.hours}, ${BRAND.atelier}. Hafta sonu kapalı. Dönüş ${BRAND.reply}.`,
  },
  {
    q: "Sipariş numaram yoksa?",
    a: "Yine yazın. Varsa tarayıcıdaki son sipariş sayfasından numarayı kopyalayın.",
  },
];
