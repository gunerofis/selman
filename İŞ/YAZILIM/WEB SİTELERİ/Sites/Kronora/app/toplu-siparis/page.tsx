import { EditorialHero, FaqModule, FeatureModule, PageCta, ProcessModule, QuoteModule } from "../section-modules";

export const metadata = { title: "Toplu Sipariş | Moneluks", description: "Kurumlara, etkinliklere ve özel projelere yönelik toplu saat ve aksesuar kutusu çözümleri.", alternates: { canonical: "/toplu-siparis" } };

export default function BulkOrderPage() {
  return <main className="inner-page">
    <EditorialHero eyebrow="Toplu sipariş" title="Toplu sipariş, düzenli bir süreç." lead="İhtiyacınız olan ürün, adet, renk ve teslimat bilgilerini paylaşın. Talebinizi değerlendirip ayrıntıları birlikte netleştirelim." primary={{ href: "/iletisim", label: "Talep oluştur" }} secondary={{ href: "/koleksiyon", label: "Ürünleri incele" }} panelTitle="Ürün ve adet bilgisinden teslimat planına." panelText="Teklif kapsamı; seçilen model, renk, adet ve istenen teslimat biçimine göre hazırlanır." stats={[]} />
    <FeatureModule eyebrow="Neler sunuyoruz" title="Projenize göre şekillenen seçenekler." intro="Toplu siparişi yalnızca adet indirimi olarak değil, baştan sona planlanması gereken bir marka deneyimi olarak ele alıyoruz." cards={[
      { title: "Kurumlara özel seçim", text: "Bütçe, hedef kitle ve kullanım amacına göre uygun model ile renkleri birlikte belirleriz.", meta: "Ekip hediyesi · VIP sunum · Etkinlik" },
      { title: "Adet planlaması", text: "Teslim tarihine ve ürün dağılımına göre gerçekçi bir hazırlık takvimi çıkarırız.", meta: "Tek veya karma model" },
      { title: "Sunum bütünlüğü", text: "Aynı proje içinde tutarlı renk, kapasite ve paketleme dili oluşturmanıza yardımcı oluruz.", meta: "Kurumsal ve rafine" },
      { title: "Teslimat koordinasyonu", text: "Tek noktaya ya da planlanan dağıtım modeline uygun teslimat seçeneklerini teklif aşamasında netleştiririz.", meta: "Planlı gönderim" },
    ]} />
    <ProcessModule eyebrow="Nasıl ilerler" title="Dört adımda net bir süreç." steps={[
      { title: "İhtiyaç özeti", text: "Adet, tarih, hedef bütçe ve tercih edilen ürün ailesini paylaşın." },
      { title: "Seçki ve teklif", text: "Uygun modelleri, renkleri ve proje kapsamını tek teklifte sunalım." },
      { title: "Onay ve hazırlık", text: "Ürün dağılımını ve teslimat planını onaydan sonra hazırlayalım." },
      { title: "Kontrollü teslim", text: "Siparişi planlanan tarihte, kararlaştırılan teslim biçimiyle tamamlayalım." },
    ]} />
    <QuoteModule quote="Ürün, adet, renk ve teslimat ihtiyacı aynı akışta netleştiğinde süreç daha doğru ilerler." label="Moneluks kurumsal yaklaşımı" />
    <FaqModule items={[
      { question: "Toplu sipariş için minimum adet nedir?", answer: "Minimum adet, seçilen modele ve proje takvimine göre değişir. İhtiyacınızı ilettiğinizde uygun başlangıç adedini teklifte netleştiririz." },
      { question: "Farklı renkler aynı siparişte kullanılabilir mi?", answer: "Stok ve hazırlık planı uygunsa karma renk dağılımı oluşturulabilir. Adetleri teklif aşamasında ayrı ayrı belirtiriz." },
      { question: "Kurumsal fatura düzenleniyor mu?", answer: "Evet. Fatura bilgilerinizi sipariş onayında paylaşabilirsiniz." },
      { question: "Teslim süresi nasıl belirlenir?", answer: "Adet, ürün dağılımı ve teslimat biçimi değerlendirildikten sonra size özel takvim sunulur." },
    ]} />
    <PageCta eyebrow="Projenizi anlatalım" title="Adet ve tarihinizi paylaşın, seçkiyi biz hazırlayalım." text="Kısa bir ihtiyaç özetiyle başlayın; uygun ürünleri ve teslim planını içeren net bir teklif alın." href="/iletisim" label="Toplu sipariş talebi" secondary={{ href: "/koleksiyon", label: "Koleksiyonu incele" }} />
  </main>;
}
