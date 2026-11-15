import Link from "next/link";

export const metadata = { title: "Saat Kutusu Seçim Rehberi | Moneluks", description: "Kapasite, kullanım biçimi ve renge göre doğru saat kutusunu seçmek için kısa rehber.", alternates: { canonical: "/rehber" } };

export default function GuidePage() {
  return <main className="inner-page">
    <section className="page-hero"><p className="eyebrow">Seçim rehberi</p><h1>Doğru saat kutusunu seçin.</h1><p>Kapasite, kullanım biçimi ve malzeme kararını üç adımda netleştirin.</p></section>
    <section className="guide-grid full-guide">
      <article><span>01</span><h2>Kapasite</h2><p>Bugünkü saat sayınızın biraz üzerinde kapasite seçmek, koleksiyon büyüdüğünde yeniden kutu alma ihtiyacını azaltır. Başlangıç koleksiyonları için 6&apos;lı; daha geniş koleksiyonlar için 12&apos;li modeller uygundur.</p></article>
      <article><span>02</span><h2>Aksesuar alanı</h2><p>Gözlük, yüzük veya tesbihlerinizi saatlerle birlikte saklayacaksanız bölmeli ya da çekmeceli modelleri seçin. Yalnızca saat saklayacaksanız klasik düzen daha kompakt kalır.</p></article>
      <article><span>03</span><h2>Renk ve görünüm</h2><p>Siyah modern, kahve klasik, taba sıcak, bordo güçlü, krem ise daha aydınlık bir görünüm sağlar. Kutuyu kullanacağınız dolap ve masa tonlarını dikkate alın.</p></article>
    </section>
    <section className="contact-cta compact-cta"><div><h2>Seçiminiz hazır mı?</h2><p>Tüm modelleri renk ve kapasiteye göre karşılaştırın.</p></div><Link className="button primary light-button" href="/koleksiyon">Koleksiyona git →</Link></section>
  </main>;
}
