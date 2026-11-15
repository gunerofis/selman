import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { useSiteConfig } from "@/lib/site-config-context";

export const Route = createFileRoute("/mesafeli")({
  loader: async () => {
    const { paytrConfigured } = await import("@/lib/paytr.server");
    return { paytr: paytrConfigured() };
  },
  component: Page,
  head: () =>
    pageHead({
      title: "Mesafeli satış",
      description: "Kapıda ödeme veya havale ile mesafeli satış koşulları.",
      path: "/mesafeli",
    }),
});

function Page() {
  const { paytr } = Route.useLoaderData();
  const { identity } = useSiteConfig();
  const seller = identity.legalName || identity.name;
  const address = identity.legalAddress || identity.atelier;
  const legalEmail = identity.legalEmail || identity.email;

  return (
    <LegalPage kicker="Hukuki" title="Mesafeli satış sözleşmesi" updated={BRAND.legalUpdated}>
      <h2>Taraflar</h2>
      <p>
        Satıcı: {seller}, {address}, {legalEmail}. Alıcı: sipariş formunda kimlik ve iletişim
        bilgilerini bildiren tüketicidir. Sipariş özeti, ön bilgilendirme ve bu sözleşme bir
        bütündür.
      </p>
      <h2>Konu</h2>
      <p>
        Sözleşmenin konusu, alıcının elektronik ortamda temel niteliklerini, adedini, rengini,
        bedelini ve teslimat bilgilerini görerek seçtiği malların satışı ve bildirilen adrese
        teslimidir. Sipariş özetinde gösterilen fiyatlara KDV dahildir; kargo ve varsa onaylanan ek
        bedeller ayrıca gösterilir.
      </p>
      <h2>Sözleşmenin kurulması</h2>
      <p>
        Alıcı, siparişi tamamlamadan önce malın temel niteliklerini, toplam bedeli, teslimatı, ödeme
        yöntemini ve cayma koşullarını inceleyip onaylar. Sipariş kaydının oluşması, alıcının ödeme
        yükümlülüğü doğuran siparişi verdiğini gösterir. Satıcı sipariş numarasını ve kaydın
        durumunu kalıcı veri saklayıcıyla iletir.
      </p>
      <h2>Ödeme</h2>
      <p>
        {paytr
          ? "Kart ödemesi PayTR 3D Secure sayfasında alınır. Kart numarası bu sitede saklanmaz. Ödeme kapıda nakit/kart, havale / EFT veya kart ile yapılır."
          : "Kart bilgisi sitede alınmaz. Ödeme kapıda nakit/kart veya havale / EFT ile yapılır."}{" "}
        Havale
        seçilirse açıklamalı dekont, sipariş onayından sonra iletilen hesaba 2 iş günü içinde
        beklenir. Ödeme yöntemine ilişkin banka veya kargo kuruluşunun kendi hizmet şartları
        saklıdır; satıcının onaylamadığı hiçbir ek bedel tahsil edilmez.
      </p>
      <h2>Teslimat</h2>
      <p>
        Stoktaki ürün 1–3 iş günü içinde kargoya verilir. Kurumsal siparişlerde süre ayrıca
        yazılır. Ayrıca kararlaştırılmadıysa mal en geç otuz gün içinde gönderilir. Teslime kadar
        kayıp ve hasar riski satıcıya aittir. İfanın imkânsızlaşması hâlinde alıcıya üç gün içinde
        bilgi verilir; tahsil edilen bedeller mevzuattaki sürede iade edilir. Ayrıntı:{" "}
        <Link to="/teslimat">Teslimat</Link>.
      </p>
      <h2>Cayma hakkı ve kullanımı</h2>
      <p>
        Alıcı, malı teslim aldığı günden itibaren on dört gün içinde gerekçe göstermeden ve cezai
        şart ödemeden cayabilir; teslimden önce de cayma bildirimi yapabilir. Bildirim, süre
        dolmadan {legalEmail} adresine veya <Link to="/cayma">cayma formuna</Link> açık bir beyanla
        iletilir. Telefonla bildirim tek başına yeterli kabul edilmez.
      </p>
      <p>
        Alıcı, cayma bildiriminden itibaren on dört gün içinde malı iade eder. Ön bilgilendirmede
        iade taşıyıcısı belirtilmemişse alıcı iade masrafından sorumlu tutulmaz. Satıcı, mevzuatta
        belirlenen başlangıç tarihinden itibaren teslimat giderleri dâhil tahsil ettiği ödemeleri on
        dört gün içinde, kullanılan ödeme aracına uygun ve masrafsız biçimde iade eder. Alıcı malı
        yalnızca niteliğini ve işleyişini anlamak için gerekli ölçüde incelemekten sorumludur; bunun
        ötesindeki değer azalması ayrıca değerlendirilir.
      </p>
      <h2>Cayma hakkı istisnaları</h2>
      <p>
        Tesliminden sonra ambalajı, koruma bandı (jelatin) veya mührü açılmış kozmetik ürünler — parfüm ve deneme boyları dahil — sağlık ve hijyen nedeniyle iade edilemez (Mesafeli Sözleşmeler Yönetmeliği m.15). Alıcının özel istek ve ihtiyaçları doğrultusunda hazırlanan mallarda da mevzuattaki
        cayma istisnası uygulanır. Ayıplı mala ilişkin yasal haklar bu istisnalardan etkilenmez.
        Ayrıntı: <Link to="/iade">İade</Link>.
      </p>
      <h2>Ayıplı mal ve başvuru</h2>
      <p>
        Malın kararlaştırılan nitelikleri taşımaması hâlinde alıcı 6502 sayılı Kanun’daki seçimlik
        haklarını kullanabilir. Talep, sipariş numarası ve sorunun açıklamasıyla iletişim kanalından
        kayda alınır.
      </p>
      <h2>Uyuşmazlık</h2>
      <p>
        Başvuru, parasal sınırlara göre tüketicinin yerleşim yerindeki veya işlemin yapıldığı
        yerdeki Tüketici Hakem Heyetine; diğer uyuşmazlıklarda dava şartı arabuluculuk sonrası
        Tüketici Mahkemesine yapılabilir. Ayrıntı: <Link to="/sikayet">Şikayet</Link>. Ön
        bilgilendirme: <Link to="/on-bilgilendirme">ön bilgilendirme</Link>.
      </p>
      <h2>Kayıtlar</h2>
      <p>
        Sipariş, ön bilgilendirme, teslimat, cayma ve ilgili işlem kayıtları mevzuatta öngörülen
        sürelerle saklanır. Alıcı, sipariş numarasıyla kayıtlarına ilişkin talep oluşturabilir.
      </p>
    </LegalPage>
  );
}
