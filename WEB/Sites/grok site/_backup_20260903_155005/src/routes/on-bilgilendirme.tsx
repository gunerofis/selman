import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, hasBrandValue, sellerName } from "@/lib/brand";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/on-bilgilendirme")({
  component: Page,
  head: () =>
    pageHead({
      title: "Ön bilgilendirme",
      description: "Mesafeli satış öncesi bilgiler. Kart sitede alınmaz.",
      path: "/on-bilgilendirme",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Ön bilgilendirme" updated={BRAND.legalUpdated}>
      <p>
        6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş
        onayından önce. Kart numarası bu sitede alınmaz; ödeme kapıda veya
        havale iledir.
      </p>

      <h2>Satıcı</h2>
      <p>
        {sellerName()}, {BRAND.atelier}, {BRAND.country}. E-posta:{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. Çalışma: hafta içi{" "}
        {BRAND.hours}.
        {hasBrandValue(BRAND.phone) ? ` Telefon: ${BRAND.phone}.` : " Telefon sitede yayınlanmaz; dönüş e-posta iledir."}
        {hasBrandValue(BRAND.legalName)
          ? null
          : " Resmî unvan, MERSİS ve vergi kimlik numarası sipariş e-postasında iletilir; burada uydurulmaz."}
      </p>

      <h2>Mal</h2>
      <p>
        Ev ve çalışma alanı için düzen ürünleri. Deri kaplama, sekiz renk. Fiyat
        KDV dahildir. Ölçü, ağırlık ve stok kodu ürün sayfasındadır. Fotoğraf
        örnektir; seçilen renk zemini boyar.
      </p>

      <h2>Bedel</h2>
      <p>
        Ürün fiyatı + kargo. Kargo {formatPrice(SHIPPING_FEE)};{" "}
        {formatPrice(FREE_SHIPPING_FROM)} ve üzeri siparişte kargo yok. Başka
        tahsilat sitede yoktur.
      </p>

      <h2>Ödeme</h2>
      <p>
        Kapıda nakit, kapıda kart (kurye POS) veya havale / EFT. Havale IBAN’ı
        sipariş onayından sonra e-posta ile gelir; sitede yazılmaz. Ayrıntı:{" "}
        <Link to="/odeme-yontemleri">Ödeme yöntemleri</Link>.
      </p>

      <h2>Teslim</h2>
      <p>
        Hazır stok 3–5 iş günü içinde kargoya verilir. Hafta içi 18.00’a kadar
        gelen sipariş aynı iş günü işleme alınır. Ölçüye göre ve elli adet üzeri
        süre ayrıca yazılır. Ayrıntı: <Link to="/teslimat">Teslimat</Link>.
      </p>

      <h2>Cayma</h2>
      <p>
        Teslimden itibaren 14 gün, gerekçesiz. Bildirim {BRAND.email} veya{" "}
        <Link to="/cayma">cayma</Link> sayfasından. Kullanılmış, hasarlı veya
        kişiye özel kesim cayma dışıdır. Anlaşmalı iade taşıyıcısı sitede adı
        yazılmadığı için cayma iade kargosunu tüketiciye yüklemeyiz. Ayrıntı:{" "}
        <Link to="/iade">İade</Link>.
      </p>

      <h2>Şikayet</h2>
      <p>
        Önce {BRAND.email}. Çözülmezse Tüketici Hakem Heyeti; tüketici
        mahkemesi için 6502 m. 73/A uyarınca önce arabulucu. Ayrıntı:{" "}
        <Link to="/sikayet">Şikayet</Link>.
      </p>

      <h2>Sözleşme</h2>
      <p>
        Onay, <Link to="/mesafeli">mesafeli satış sözleşmesi</Link> ve bu metinle
        kurulur. Sipariş, e-posta uygulamanızdan {BRAND.email} adresine gider;
        o mesajı göndermezseniz atölyeye düşmez.
      </p>
    </LegalPage>
  );
}
