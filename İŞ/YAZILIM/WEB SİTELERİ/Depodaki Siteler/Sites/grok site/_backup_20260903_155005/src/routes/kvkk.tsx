import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, hasBrandValue, sellerName } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/kvkk")({
  component: Page,
  head: () =>
    pageHead({
      title: "KVKK aydınlatma",
      description: "6698 sayılı Kanun kapsamında aydınlatma metni.",
      path: "/kvkk",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="KVKK aydınlatma metni" updated={BRAND.legalUpdated}>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu md. 10 uyarınca:
      </p>
      <h2>Veri sorumlusu</h2>
      <p>
        {sellerName()}, {BRAND.atelier}. E-posta:{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        {hasBrandValue(BRAND.legalName)
          ? null
          : " Resmî ticaret unvanı ve MERSİS numarası bu sayfada henüz yayımlanmamıştır."}
      </p>
      <h2>İşlenen veriler</h2>
      <p>
        Kimlik (ad soyad), iletişim (e-posta, telefon), teslimat adresi, sipariş
        ve teklif içeriği. Ödeme kartı verisi işlenmez.
      </p>
      <h2>Amaç ve hukuki sebep</h2>
      <p>
        Sözleşmenin kurulması ve ifası, talebe cevap, fatura ve yasal saklama.
        Dayanak: Kanun md. 5/2-c (sözleşme) ve md. 5/2-f (meşru menfaat).
      </p>
      <h2>Aktarım</h2>
      <p>
        Kargo firması, muhasebe ve zorunlu kamu kurumları dışında aktarılmaz.
        Form iletimi sizin e-posta uygulamanız üzerinden atölye kutusuna gider.
      </p>
      <h2>Saklama</h2>
      <p>
        Sipariş ve ticari kayıtlar yasal süreler boyunca tutulur. Tarayıcıdaki
        sepet ve favori, siz silene dek cihazınızda kalır.
      </p>
      <h2>Ticari ileti</h2>
      <p>
        Atölye notları yalnız sizin gönderdiğiniz kayıt e-postasıyla istenir. Çıkış
        aynı adrese yazılır. Ayrıntı: <Link to="/bulten">bülten</Link>.
      </p>
      <h2>Haklarınız</h2>
      <p>
        Kanun md. 11 kapsamındaki talepler {BRAND.email} adresine yazılır. Yanıt
        süresi otuz gündür.
      </p>
    </LegalPage>
  );
}
