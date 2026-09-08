import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND, sellerName } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/kullanim")({
  component: Page,
  head: () =>
    pageHead({
      title: "Kullanım koşulları",
      description: "Site kullanımı. Satış sözleşmesi mesafeli satıştadır.",
      path: "/kullanim",
    }),
});

function Page() {
  return (
    <LegalPage kicker="Hukuki" title="Kullanım koşulları" updated={BRAND.legalUpdated}>
      <p>
        Bu metin {sellerName()} sitesinin tarayıcıda kullanımına dairdir. Satın alma{" "}
        <Link to="/mesafeli">mesafeli satış</Link> ve{" "}
        <Link to="/on-bilgilendirme">ön bilgilendirme</Link> iledir.
      </p>
      <h2>Hesap yok</h2>
      <p>
        Üyelik zorunlu değildir. Sepet, favori, karşılaştırma ve son sipariş özeti bu tarayıcıda
        tutulur; başka cihaza taşınmaz.
      </p>
      <h2>Sipariş ve kart</h2>
      <p>
        Sipariş, e-posta uygulamanızdan {BRAND.email} adresine gider. Kart numarası sitede alınmaz.
        Mesajı göndermezseniz atölyeye düşmez.
      </p>
      <h2>İçerik</h2>
      <p>
        Ürün fotoğrafları örnektir; seçilen renk zemini boyar. Görselleri ve metinleri izinsiz
        çoğaltmayın. Fiyat KDV dahildir; ölçüye göre işte ilk tahmin netleşene kadar bağlayıcı
        değildir.
      </p>
      <h2>Çerez ve veri</h2>
      <p>
        Zorunlu tarayıcı kaydı ve tercih: <Link to="/cerez">çerez politikası</Link>,{" "}
        <Link to="/gizlilik">gizlilik</Link>, <Link to="/kvkk">KVKK</Link>.
      </p>
      <h2>Uyuşmazlık</h2>
      <p>
        Tüketici işlemlerinde 6502 sayılı Kanun saklıdır. Şikayet:{" "}
        <Link to="/sikayet">şikayet</Link>.
      </p>
    </LegalPage>
  );
}
