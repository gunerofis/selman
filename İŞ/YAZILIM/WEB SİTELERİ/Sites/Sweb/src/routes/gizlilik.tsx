import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, sellerName } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/gizlilik")({
  component: Page,
  head: () =>
    pageHead({
      title: "Gizlilik politikası",
      description: "Sipariş ve iletişim verilerinin nasıl işlendiği.",
      path: "/gizlilik",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Gizlilik politikası" updated={BRAND.legalUpdated}>
      <p>
        Veri sorumlusu: {sellerName()}, {BRAND.atelier}. İletişim:{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>
      <h2>Toplanan veriler</h2>
      <p>
        Sipariş ve formlarda ad soyad, e-posta, telefon, teslimat adresi, sipariş içeriği ve gönüllü
        notlar alınır. Kart numarası, CVV veya IBAN bu sitede toplanmaz.
      </p>
      <h2>Amaç</h2>
      <p>
        Veriler siparişi ve talebi işlemek, teslimatı planlamak ve size dönüş yapmak için
        kullanılır. Formlar yönetim paneline kaydedilir ve yetkili personel tarafından işlenir.
      </p>
      <h2>Tarayıcıda tutulan veri</h2>
      <p>
        Sepet, favori, son sipariş özeti ve çerez tercihi cihazınızda kalır; başka bir cihaza
        taşınmaz. Tarayıcı verisini silerek bunları kaldırabilirsiniz.
      </p>
      <h2>Paylaşım</h2>
      <p>
        Kargo ve yasal yükümlülük dışında üçüncü taraflara satılmaz veya pazarlama listesine
        eklenmez. Ölçüm ve reklam çerezi yoktur. Bülten yalnız açık rıza ile:{" "}
        <Link to="/bulten">atölye notları</Link>.
      </p>
      <h2>Haklar</h2>
      <p>
        Erişim, düzeltme, silme ve itiraz talepleri {BRAND.email} adresine yazılır. Ayrıntı için{" "}
        <Link to="/kvkk" className="text-taba">
          KVKK aydınlatma metni
        </Link>
        .
      </p>
    </LegalPage>
  );
}
