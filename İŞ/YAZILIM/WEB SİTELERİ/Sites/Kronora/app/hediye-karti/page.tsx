import { EditorialHero, FaqModule, FeatureModule, PageCta, ProcessModule, QuoteModule } from "../section-modules";

export const metadata = { title: "Hediye Kartı | Moneluks", description: "Saat ve aksesuar tutkunları için Moneluks hediye kartı seçenekleri.", alternates: { canonical: "/hediye-karti" } };

export default function GiftCardPage() {
  return <main className="inner-page">
    <EditorialHero eyebrow="Hediye kartı" title="Zevkini ona bırakın, seçimi özel kılın." lead="Model, kapasite ya da renk arasında karar veremediğinizde Moneluks hediye kartıyla sevdiğiniz kişiye kendi koleksiyonunu tamamlama özgürlüğü verin." primary={{ href: "/iletisim", label: "Hediye kartı iste" }} secondary={{ href: "/koleksiyon", label: "Koleksiyona göz at" }} panelTitle="Doğru hediye, kişisel bir seçim alanı açar." panelText="Doğum günü, yıl dönümü, terfi ve özel kutlamalar için zarif, esnek ve kolay bir seçenek." stats={[{ value: "Esnek", label: "kart tutarı" }, { value: "Kişisel", label: "hediye notu" }, { value: "Dijital", label: "teslim seçeneği" }]} />
    <section className="gift-values"><div><p className="eyebrow">Hediye seçenekleri</p><h2>Her koleksiyona uygun bir başlangıç.</h2></div><div className="gift-value-grid"><article><small>Başlangıç hediyesi</small><strong>Esnek tutar</strong><p>Kompakt modeller veya seçilecek ürüne katkı için.</p></article><article className="featured"><small>Kişisel seçim</small><strong>Özel mesaj</strong><p>Alıcının zevkine ve özel günün anlamına göre hazırlanan bir notla.</p></article><article><small>Kurumsal hediye</small><strong>Çoklu kart</strong><p>Ekipler ve özel projeler için planlanabilen toplu hediye kartı talebi.</p></article></div></section>
    <FeatureModule eyebrow="Neden hediye kartı?" title="Zarif ve risksiz bir seçim." intro="Saat kutusu kişisel bir üründür. Hediye kartı, doğru kapasiteyi ve rengi kullanıcının kendi alanına göre seçmesini sağlar." cards={[
      { title: "Kişisel tercih", text: "Alıcı, koleksiyonuna ve dekorasyonuna uygun modeli kendisi belirler." },
      { title: "Hızlı çözüm", text: "Son dakika hediyelerinde dahi özenli ve düşünülmüş bir seçenek sunar." },
      { title: "Esnek kullanım", text: "Kart tutarı seçilen ürünün tamamında veya bir bölümünde kullanılabilir." },
      { title: "Özel not", text: "Hediye mesajınızı talebinizle birlikte ileterek deneyimi kişiselleştirebilirsiniz." },
    ]} />
    <ProcessModule eyebrow="Kullanım" title="Göndermesi de kullanması da kolay." steps={[
      { title: "Tutarı seçin", text: "Hediye bütçenizi ve tercih ettiğiniz kart tutarını belirleyin." },
      { title: "Mesajınızı ekleyin", text: "Alıcı adı, kutlama notu ve teslim tercihinin detaylarını paylaşın." },
      { title: "Kartı ulaştıralım", text: "Kart bilgilerini belirlenen dijital teslimat yöntemiyle hazırlayalım." },
      { title: "Koleksiyondan seçsin", text: "Alıcı beğendiği modeli seçerek sipariş sürecini tamamlasın." },
    ]} />
    <QuoteModule quote="En iyi hediye, sahibinin zevkine yer bırakan hediyedir." label="Moneluks hediye seçkisi" />
    <FaqModule items={[
      { question: "Hediye kartı nasıl teslim edilir?", answer: "Tercih edilen teslim biçimi talep sırasında netleştirilir. Dijital teslimat için alıcı veya gönderen iletişim bilgisi kullanılır." },
      { question: "Kart tutarı tek seferde mi kullanılmalı?", answer: "Kullanım koşulları kart oluşturulurken belirtilir. Talebinizde tercih ettiğiniz kullanım biçimini paylaşabilirsiniz." },
      { question: "Hediye kartı nakde çevrilebilir mi?", answer: "Hediye kartları nakde çevrilemez; Moneluks ürün alışverişinde kullanılmak üzere hazırlanır." },
      { question: "Kurumsal hediye kartı alınabilir mi?", answer: "Evet. Çoklu hediye kartı ihtiyaçları için Toplu Sipariş sayfasından kurumsal talep oluşturabilirsiniz." },
    ]} />
    <PageCta eyebrow="Hediyeyi hazırlayalım" title="Tutarı ve notunuzu paylaşın." text="Hediye kartının teslim biçimini birlikte netleştirip özel gün için hazırlayalım." href="/iletisim" label="Hediye kartı talebi" secondary={{ href: "/toplu-siparis", label: "Kurumsal hediye" }} />
  </main>;
}
