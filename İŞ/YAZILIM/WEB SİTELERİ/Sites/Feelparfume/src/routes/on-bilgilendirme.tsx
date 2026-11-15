import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { GIFT_WRAP_CENTS } from "@/lib/checkout-pricing";
import { pageHead } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/on-bilgilendirme")({
  loader: async () => {
    const { paytrConfigured } = await import("@/lib/paytr.server");
    return { paytr: paytrConfigured() };
  },
  component: Page,
  head: () =>
    pageHead({
      title: "Ön bilgilendirme",
      description: "Mesafeli satış öncesi bilgiler. Kart sitede alınmaz.",
      path: "/on-bilgilendirme",
    }),
});

function Page() {
  const { paytr } = Route.useLoaderData();
  const { identity, shipping } = useSiteConfig();
  const seller = identity.legalName || identity.name;
  const address = identity.legalAddress || identity.atelier;
  const legalEmail = identity.legalEmail || identity.email;

  return (
    <LegalPage kicker="Hukuki" title="Ön bilgilendirme" updated={BRAND.legalUpdated}>
      <p>
        6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş onayından önce.{" "}
        {paytr
          ? "Kart ödemesi PayTR 3D Secure sayfasında alınır. Kart numarası bu sitede saklanmaz."
          : "Kart numarası bu sitede alınmaz; ödeme kapıda veya havale iledir."}
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
        Parfüm ve kozmetik ürünler. Marka, hacim (ml), konsantrasyon, içerik ve kullanım uyarıları
        ürün sayfasındadır. Fiyat KDV dahildir.
      </p>

      <h2>Bedel</h2>
      <p>
        Ürün fiyatı + kargo. Kargo {formatPrice(shipping.fee)}; {formatPrice(shipping.freeFrom)}{" "}
        üzeri siparişte kargo ücretsiz. Hediye paketi {formatPrice(GIFT_WRAP_CENTS / 100)} seçilirse
        eklenir. Yurt dışı gönderim kapalıdır.
      </p>

      <h2>Ödeme</h2>
      <p>
        {paytr
          ? "Kapıda nakit, kapıda kart (kurye POS), havale / EFT veya kart. Kart ödemesi PayTR 3D Secure sayfasında alınır; kart numarası bu sitede saklanmaz. Havale seçilince IBAN ödeme adımında görünür."
          : "Kapıda nakit, kapıda kart (kurye POS) veya havale / EFT. Havale IBAN’ı sipariş onayından sonra e-posta ile gelir; sitede yazılmaz."}{" "}
        Ayrıntı:{" "}
        <Link to="/odeme-yontemleri">Ödeme yöntemleri</Link>.
      </p>

      <h2>Teslim</h2>
      <p>
        Stoktaki ürün 1–3 iş günü içinde kargoya verilir. Hafta içi 18.00’a kadar gelen sipariş aynı iş
        günü işleme alınır. Ayrıca kararlaştırılmadıysa teslim süresi en fazla otuz gündür. Elli adet
        üzeri süre ayrıca yazılır. Teslime kadar kayıp ve hasar riski satıcıya
        aittir. Ayrıntı: <Link to="/teslimat">Teslimat</Link>.
      </p>

      <h2>Cayma</h2>
      <p>
        Teslimden itibaren 14 gün, gerekçesiz. Bildirim {legalEmail} veya{" "}
        <Link to="/cayma">cayma</Link> sayfasından. Ambalajı açılmış veya kullanılmış kozmetik
        ürünler hijyen nedeniyle cayma dışıdır. Anlaşmalı iade taşıyıcısı sitede adı yazılmadığı için cayma iade kargosunu
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
