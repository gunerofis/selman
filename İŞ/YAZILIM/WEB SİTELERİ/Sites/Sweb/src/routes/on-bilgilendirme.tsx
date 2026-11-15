import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { useSiteConfig } from "@/lib/site-config-context";

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
  const { identity } = useSiteConfig();
  const seller = identity.legalName || identity.name;
  const address = identity.legalAddress || identity.atelier;
  const legalEmail = identity.legalEmail || identity.email;

  return (
    <LegalPage kicker="Hukuki" title="Ön bilgilendirme" updated={BRAND.legalUpdated}>
      <p>
        6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş onayından önce. Kart
        numarası bu sitede alınmaz; ödeme kapıda veya havale iledir.
      </p>

      <h2>Satıcı</h2>
      <p>
        {seller}, {address}, Türkiye. E-posta: <a href={`mailto:${legalEmail}`}>{legalEmail}</a>.
        Çalışma: hafta içi {identity.hours}.{identity.phone ? ` Telefon: ${identity.phone}.` : null}
        {identity.mersisNumber ? ` MERSİS: ${identity.mersisNumber}.` : null}
        {identity.taxNumber ? ` Vergi kimlik numarası: ${identity.taxNumber}.` : null}
      </p>

      <h2>Mal</h2>
      <p>
        Ev ve çalışma alanı için düzen ürünleri. Deri kaplama, sekiz renk. Fiyat KDV dahildir. Ölçü,
        ağırlık ve stok kodu ürün sayfasındadır. Fotoğraf örnektir; seçilen renk zemini boyar.
      </p>

      <h2>Bedel</h2>
      <p>
        Ürün fiyatı + kargo. Kargo {formatPrice(SHIPPING_FEE)}; {formatPrice(FREE_SHIPPING_FROM)}{" "}
        üzeri siparişte kargo ücretsiz. Başka tahsilat sitede yoktur.
      </p>

      <h2>Ödeme</h2>
      <p>
        Kapıda nakit, kapıda kart (kurye POS) veya havale / EFT. Havale IBAN’ı sipariş onayından
        sonra e-posta ile gelir; sitede yazılmaz. Ayrıntı:{" "}
        <Link to="/odeme-yontemleri">Ödeme yöntemleri</Link>.
      </p>

      <h2>Teslim</h2>
      <p>
        Hazır stok 3–5 iş günü içinde kargoya verilir. Hafta içi 18.00’a kadar gelen sipariş aynı iş
        günü işleme alınır. Ayrıca kararlaştırılmadıysa teslim süresi en fazla otuz gündür. Ölçüye
        göre ve elli adet üzeri süre ayrıca yazılır. Teslime kadar kayıp ve hasar riski satıcıya
        aittir. Ayrıntı: <Link to="/teslimat">Teslimat</Link>.
      </p>

      <h2>Cayma</h2>
      <p>
        Teslimden itibaren 14 gün, gerekçesiz. Bildirim {legalEmail} veya{" "}
        <Link to="/cayma">cayma</Link> sayfasından. Kullanılmış, hasarlı veya kişiye özel kesim
        cayma dışıdır. Anlaşmalı iade taşıyıcısı sitede adı yazılmadığı için cayma iade kargosunu
        tüketiciye yüklemeyiz. Ayrıntı: <Link to="/iade">İade</Link>.
      </p>

      <h2>Şikayet</h2>
      <p>
        Önce {legalEmail}. Çözülmezse Tüketici Hakem Heyeti; tüketici mahkemesi için 6502 m. 73/A
        uyarınca önce arabulucu. Ayrıntı: <Link to="/sikayet">Şikayet</Link>.
      </p>

      <h2>Sözleşme</h2>
      <p>
        Sipariş düğmesi ödeme yükümlülüğü doğurduğunu açıkça belirtir. Onay,{" "}
        <Link to="/mesafeli">mesafeli satış sözleşmesi</Link> ve bu metinle kurulur. Sipariş,
        yönetim paneline kaydedilir ve size verilen kayıt numarasıyla takip edilir. Ön
        bilgilendirme, sipariş ve teslimat kayıtları mevzuattaki saklama süresi boyunca korunur.
      </p>
    </LegalPage>
  );
}
