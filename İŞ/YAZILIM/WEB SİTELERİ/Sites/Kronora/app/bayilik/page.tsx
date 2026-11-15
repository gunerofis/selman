import { EditorialHero, FaqModule, FeatureModule, PageCta, ProcessModule } from "../section-modules";

export const metadata = { title: "Bayilik ve Satış Ortaklığı | Moneluks", description: "Moneluks ürünlerini mağazanızda veya satış kanalınızda sunmak için bayilik ve iş ortaklığı bilgileri.", alternates: { canonical: "/bayilik" } };

export default function DealerPage() {
  return <main className="inner-page">
    <EditorialHero eyebrow="Bayilik" title="Seçkin bir ürün grubunu müşterilerinizle buluşturun." lead="Butikler, saat mağazaları, aksesuar perakendecileri ve kurumsal hediye ajansları için sürdürülebilir bir ürün ve satış ortaklığı modeli." primary={{ href: "/iletisim", label: "Başvuru yap" }} secondary={{ href: "/galeri", label: "Ürün sunumunu görün" }} panelTitle="Rafınıza değer, müşterinize düzen." panelText="Net ürün aileleri, güçlü görsel sunum ve ihtiyaca göre ölçeklenen iş ortaklığı desteği." stats={[{ value: "6–12", label: "saat kapasitesi" }, { value: "5", label: "ana renk" }, { value: "B2B", label: "iş ortaklığı" }]} />
    <FeatureModule eyebrow="İş ortaklığı" title="Satışı kolaylaştıran bir yapı." intro="Moneluks koleksiyonu, müşterinin ihtiyacını hızlı anlamayı ve doğru modeli kolayca önermeyi sağlayan belirgin ürün ailelerinden oluşur." cards={[
      { title: "Anlaşılır ürün mimarisi", text: "6'lı, 12'li, çekmeceli ve çok amaçlı modeller sayesinde ihtiyaca göre kolay yönlendirme.", meta: "Kapasite · kullanım · renk" },
      { title: "Vitrin gücü", text: "Cam kapak, deri yüzey ve düzenli iç mimari; ürünü rafta açıklamaya ihtiyaç bırakmadan görünür kılar.", meta: "Mağaza ve showroom" },
      { title: "Dijital satış desteği", text: "Ürün adları, açıklamalar ve görsel setler satış kanalında tutarlı bir sunum kurmanıza yardımcı olur.", meta: "E-ticaret uyumlu" },
      { title: "Planlı tedarik", text: "Talep, ürün karması ve satış kanalınıza göre sipariş periyodu birlikte planlanır.", meta: "Sürdürülebilir stok" },
    ]} />
    <ProcessModule eyebrow="Başvuru" title="Tanışmadan ilk siparişe." steps={[
      { title: "Kanalınızı tanıtın", text: "Mağaza, e-ticaret sitesi veya kurumsal satış yapınızı kısaca paylaşın." },
      { title: "Ürün karmasını seçelim", text: "Müşteri profilinize uygun kapasite, model ve renk dağılımını oluşturalım." },
      { title: "Koşulları netleştirelim", text: "Başlangıç adedi, fiyatlama, teslim ve satış desteği kapsamını belirleyelim." },
      { title: "Satışa başlayın", text: "İlk sipariş ve sunum materyalleriyle koleksiyonu kanalınıza taşıyın." },
    ]} />
    <section className="partner-fit"><div><p className="eyebrow">Kimler için uygun?</p><h2>Doğru yerde, doğru koleksiyon.</h2></div><div className="partner-tags"><span>Saat mağazaları</span><span>Erkek aksesuar butikleri</span><span>Kurumsal hediye ajansları</span><span>Premium e-ticaret mağazaları</span><span>Konsept mağazalar</span><span>Showroomlar</span></div></section>
    <FaqModule items={[
      { question: "Bayilik başvurusu nasıl değerlendirilir?", answer: "Satış kanalınız, hedef kitleniz, lokasyonunuz ve planlanan ürün hacmi birlikte değerlendirilir. Uygun model görüşme sonrasında netleştirilir." },
      { question: "Sadece çevrim içi satış yapan mağazalar başvurabilir mi?", answer: "Evet. Marka sunumu ve müşteri deneyimi açısından uygun e-ticaret kanalları da değerlendirmeye alınır." },
      { question: "Ürün fotoğrafları sağlanıyor mu?", answer: "Onaylanan iş ortaklıklarında kullanılabilecek ürün görselleri ve temel ürün bilgileri paylaşılabilir." },
      { question: "Bölge koruması var mı?", answer: "Bölgesel yapı, satış hacmi ve kanal özelliklerine göre ayrıca değerlendirilir; otomatik bir taahhüt değildir." },
    ]} />
    <PageCta eyebrow="Birlikte büyüyelim" title="Satış kanalınızı bize anlatın." text="Kısa başvurunuzun ardından ürün yapınıza uygun iş ortaklığı modelini görüşelim." href="/iletisim" label="Bayilik başvurusu" secondary={{ href: "/toplu-siparis", label: "Toplu sipariş bilgisi" }} />
  </main>;
}
