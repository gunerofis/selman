import { BRAND } from "./brand";
import { FREE_SHIPPING_FROM } from "./products";
import { formatPrice } from "./utils";

export type FaqItem = { q: string; a: string };

export const FAQ_SHIP: FaqItem[] = [
  {
    q: "Hazır stok ne kadar sürer?",
    a: "Atölyeden 3–5 iş gününde kargoya verilir. Ölçüye göre parça 10–15 iş günü, elli adet ve üzeri 10–20 iş günüdür.",
  },
  {
    q: "Kargo ne zaman ücretsiz?",
    a: `${formatPrice(FREE_SHIPPING_FROM)} üzeri Türkiye içi kargo ücretsizdir. Altındaki siparişlerde bedel sepet özetinde görünür.`,
  },
  {
    q: "Yanlış adrese gittiyse?",
    a: "Adres hatası nedeniyle dönen kargonun yeniden gönderim bedeli alıcıya aittir. Teslimat formundaki il, ilçe ve posta kodunu kontrol edin.",
  },
];

export const FAQ_RETURN: FaqItem[] = [
  {
    q: "Kaç günde iade ederim?",
    a: "Teslimden itibaren 14 gün. Ürün kullanılmamış ve etiketli olmalıdır. Kargo hasarı ayrı bakılır.",
  },
  {
    q: "Ölçüye göre üretim iade olur mu?",
    a: "Kişiye özel kesim, ölçüye göre üretilen ve proje siparişleri iade kapsamı dışındadır.",
  },
  {
    q: "İade kargosunu kim öder?",
    a: "Ayıplı üründe satıcı. Anlaşmalı iade taşıyıcısı sitede adı yazılmaz; caymada da kargoyu tüketiciye yüklemeyiz. Sipariş numarası ve stok koduyla yazın.",
  },
];

export const FAQ_CARE: FaqItem[] = [
  {
    q: "Deriyi yağlar mıyım?",
    a: "Hayır. Dış yüzey kaplamadır. Yağ, krem, çözücü ve buhar leke veya soyulma yapar. Nemli bez yeter.",
  },
  {
    q: "Banyo ve evyede durur mu?",
    a: "Islak hacimde damlama tepsisi olan parçalar vardır. Suyu silin, gövdeyi ıslatmayın. Dış mekân ve sürekli su yok.",
  },
  {
    q: "Güneş rengi değiştirir mi?",
    a: "Uzun doğrudan güneş soldurur. Pencere önünde perde veya gölge önerilir.",
  },
];

export const FAQ_DESIGN: FaqItem[] = [
  {
    q: "Sitedeki fiyat net mi?",
    a: "Hayır. İlk tahmin sitede çıkar; onay ve numuneden sonra netleşir. Taslak yönetim paneline kaydedilir ve atölye incelemesine alınır.",
  },
  {
    q: "Numune ne kadar sürer?",
    a: "Onaylarsanız numune 10–15 iş günü. Tek parçada 80–900 mm aralığı geçilmez.",
  },
  {
    q: "Neyi yapmıyorsunuz?",
    a: "Elektrik, cam-seramik gövde, dış mekân, gıdayla temas ve 900 mm üstü tek parça yok. Ayrıntı ölçü rehberinde.",
  },
  {
    q: "Fotoğraf ekler miyim?",
    a: "Evet, en fazla dört görsel seçebilirsiniz. Kayıtta dosya adları atölye notuna eklenir; dosyaları görüşme sırasında iletebilirsiniz.",
  },
];

export const FAQ_QUOTE: FaqItem[] = [
  {
    q: "En az kaç adet?",
    a: "Kurumsal teklif 50 adet ve üzeri. Logo baskı talepte belirtilir.",
  },
  {
    q: "Ne zaman dönüş yapılır?",
    a: `${BRAND.quoteReply} içinde fiyat ve teslim planı. Üretim 10–20 iş günü.`,
  },
  {
    q: "Kartla öder miyim?",
    a: "Bu sitede kart numarası alınmaz. Teklif e-posta ile gider; ödeme kapıda veya havale ile netleşir.",
  },
];

export const FAQ_PDP: FaqItem[] = [
  FAQ_SHIP[0],
  FAQ_SHIP[1],
  FAQ_RETURN[0],
  {
    q: "Kartla öder miyim?",
    a: "Bu sitede kart numarası alınmaz. Kapıda nakit veya kart, ya da havale / EFT.",
  },
  {
    q: "Ayıplı çıkarsa?",
    a: "Üretim hatası ve kargo hasarı garantide. 14 gün cayma ayrıdır; kullanılmamış ürün.",
  },
];

export const FAQ_CONTACT: FaqItem[] = [
  {
    q: "Mesaj nereye gider?",
    a: "Form talebinizi doğrudan yönetim paneline kaydeder ve atölye ekibine iletir.",
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
