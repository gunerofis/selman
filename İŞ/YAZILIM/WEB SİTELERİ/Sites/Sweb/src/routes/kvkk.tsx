import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { useSiteConfig } from "@/lib/site-config-context";

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
  const { identity } = useSiteConfig();
  const seller = identity.legalName || identity.name;
  const address = identity.legalAddress || identity.atelier;
  const legalEmail = identity.legalEmail || identity.email;

  return (
    <LegalPage kicker="Hukuki" title="KVKK aydınlatma metni" updated={BRAND.legalUpdated}>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu md. 10 uyarınca:</p>
      <h2>Veri sorumlusu</h2>
      <p>
        {seller}, {address}. E-posta: <a href={`mailto:${legalEmail}`}>{legalEmail}</a>.
        {identity.mersisNumber ? ` MERSİS: ${identity.mersisNumber}.` : null}
      </p>
      <h2>İşlenen veriler</h2>
      <p>
        Kimlik (ad soyad), iletişim (e-posta, telefon), teslimat ve fatura adresi, sipariş, teklif,
        özel üretim ve şikâyet içeriği; işlem güvenliği (IP, cihaz, oturum ve hareket kaydı),
        müşteri işlem ve pazarlama tercihleri işlenir. Site ödeme kartı numarası veya güvenlik kodu
        toplamaz.
      </p>
      <h2>İşleme amaçları</h2>
      <p>
        Veriler; sipariş ve teklifin oluşturulması, üretim ve teslimatın yürütülmesi, müşteri
        desteği, cayma ve iade taleplerinin sonuçlandırılması, muhasebe ve vergi yükümlülüklerinin
        yerine getirilmesi, bilgi güvenliği, uyuşmazlıkların yönetimi ve açık rıza verilen bülten
        iletişimi amaçlarıyla işlenir.
      </p>
      <h2>Hukuki sebepler</h2>
      <p>
        Sipariş, teslimat ve teklif verileri sözleşmenin kurulması veya ifası için gerekli olma;
        fatura, vergi ve resmî talep kayıtları hukuki yükümlülüğün yerine getirilmesi; güvenlik,
        denetim ve hak arama kayıtları bir hakkın tesisi, kullanılması veya korunması ile temel hak
        ve özgürlüklere zarar vermeyen meşru menfaat sebeplerine dayanır. Bülten ve ticari ileti,
        ilgili mevzuata uygun ayrı onayla işlenir; bu onay her zaman geri alınabilir.
      </p>
      <h2>Toplama yöntemi</h2>
      <p>
        Veriler; site formları, sipariş ve yönetim ekranları, e-posta veya telefon iletişimi ve
        tarayıcının zorunlu teknik kayıtları aracılığıyla tamamen veya kısmen otomatik yollarla,
        gerektiğinde veri kayıt sisteminin parçası olan otomatik olmayan yollarla elde edilir.
      </p>
      <h2>Aktarım</h2>
      <p>
        Kimlik, iletişim ve teslimat verileri siparişin ifası için kargo ve lojistik hizmet
        sağlayıcılarına; mali kayıtlar muhasebe, banka ve yetkili kamu kurumlarına; gerekli teknik
        kayıtlar barındırma, veritabanı, güvenlik ve iletişim hizmeti sağlayıcılarına yalnızca
        ilgili amaçla sınırlı olarak aktarılabilir. Yurt dışı aktarımı gerektiren altyapı
        hizmetlerinde 6698 sayılı Kanun’un yurt dışı aktarıma ilişkin hükümleri ve uygun güvenceler
        uygulanır.
      </p>
      <h2>Saklama</h2>
      <p>
        Sipariş, fatura ve ticari kayıtlar ilgili kanunlardaki zorunlu süreler; mesafeli sözleşme
        işlem kayıtları en az mevzuatta öngörülen süre; teklif ve iletişim kayıtları ise amaç için
        gerekli makul süre boyunca tutulur. Amaç ve hukuki saklama sebebi sona erdiğinde veriler
        silinir, yok edilir veya anonimleştirilir. Tarayıcıdaki sepet ve favori, siz silene dek
        cihazınızda kalır.
      </p>
      <h2>Ticari ileti</h2>
      <p>
        Atölye notları ve kampanya iletileri, aydınlatmadan ayrı sunulan bülten onayıyla gönderilir.
        Onayın geri alınması, sipariş ve destek hizmetlerini etkilemez. Ayrıntı:{" "}
        <Link to="/bulten">bülten</Link>.
      </p>
      <h2>Haklarınız</h2>
      <p>
        Kanun’un 11. maddesi kapsamında verinizin işlenip işlenmediğini öğrenme, bilgi isteme,
        işleme amacını ve amaca uygun kullanımını öğrenme, aktarılan üçüncü kişileri bilme, eksik
        veya yanlış verinin düzeltilmesini, koşulları oluşmuşsa silinmesini veya yok edilmesini ve
        bu işlemlerin aktarılanlara bildirilmesini isteme; otomatik analiz sonucuna itiraz etme ve
        hukuka aykırı işleme nedeniyle zararın giderilmesini talep etme haklarınız vardır.
      </p>
      <h2>Başvuru</h2>
      <p>
        Kimliğinizi ve talebinizi açıklayan başvuruyu {legalEmail} adresine veya satıcının ilan
        edilen tebligat adresine iletebilirsiniz. Başvuru, niteliğine göre en kısa sürede ve en geç
        otuz gün içinde yanıtlanır; ayrıca Kişisel Verileri Koruma Kuruluna şikâyet hakkınız
        bulunur.
      </p>
    </LegalPage>
  );
}
