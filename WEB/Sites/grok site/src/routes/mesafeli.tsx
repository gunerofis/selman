import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, sellerName } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mesafeli")({
  component: Page,
  head: () =>
    pageHead({
      title: "Mesafeli satış",
      description: "Kapıda ödeme veya havale ile mesafeli satış koşulları.",
      path: "/mesafeli",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Mesafeli satış sözleşmesi" updated={BRAND.legalUpdated}>
      <h2>Taraflar</h2>
      <p>
        Satıcı: {sellerName()}, {BRAND.atelier}, {BRAND.email}. Alıcı: sipariş
        formunda bildirilen kişi.
      </p>
      <h2>Konu</h2>
      <p>
        Siteden seçilen düzen ürünlerinin, bildirilen adrese teslimi. Fiyatlar KDV
        dahildir.
      </p>
      <h2>Ödeme</h2>
      <p>
        Kart bilgisi sitede alınmaz. Ödeme kapıda nakit/kart veya havale / EFT
        ile yapılır. Havale seçilirse açıklamalı dekont, sipariş onayından sonra
        iletilen hesaba 2 iş günü içinde beklenir.
      </p>
      <h2>Teslimat</h2>
      <p>
        Hazır stok 3–5 iş günü içinde kargoya verilir. Ölçüye göre ve kurumsal
        işlerde süre ayrıca yazılır. Ayrıntı:{" "}
        <Link to="/teslimat">Teslimat</Link>.
      </p>
      <h2>Cayma</h2>
      <p>
        Teslimden itibaren 14 gün. Kullanılmış, hasarlı veya kişiye özel kesim
        ürünler cayma dışıdır. Bildirim {BRAND.email} veya{" "}
        <Link to="/cayma">cayma formu</Link>. Ayrıntı: <Link to="/iade">İade</Link>.
      </p>
      <h2>Uyuşmazlık</h2>
      <p>
        Önce Tüketici Hakem Heyeti; mahkeme için 6502 m. 73/A uyarınca arabulucu.
        Ayrıntı: <Link to="/sikayet">Şikayet</Link>. Ön bilgilendirme:{" "}
        <Link to="/on-bilgilendirme">ön bilgilendirme</Link>.
      </p>
    </LegalPage>
  );
}
