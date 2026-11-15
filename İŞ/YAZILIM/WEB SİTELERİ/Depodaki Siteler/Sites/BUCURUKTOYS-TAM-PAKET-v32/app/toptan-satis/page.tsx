import type { Metadata } from "next";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Toptan Satış ve Teklif Süreci",
  description: "BÜCÜRÜKTOYS toptan oyuncak seçimi, teklif, stok teyidi ve Türkiye geneli teslimat süreci.",
  alternates: { canonical: "/toptan-satis" },
};

const steps = [
  { number: "01", title: "Ürünleri seçin", text: "Katalogda ürün adı, kategori veya stok koduyla arayın. İlgilendiğiniz ürünleri teklif listenize ekleyin." },
  { number: "02", title: "Talep adedini yazın", text: "Her ürün için ihtiyacınız olan adedi belirtin. Paket ve koli düzeni teklif hazırlanırken birlikte kontrol edilir." },
  { number: "03", title: "Listenizi gönderin", text: "Hazır teklif mesajını WhatsApp üzerinden iletin. Ürün kodları ve adetler mesajınıza otomatik eklenir." },
  { number: "04", title: "Fiyat ve stok teyidi", text: "Satış ekibi güncel stok, toptan fiyat, minimum sipariş ve teslimat bilgisini yazılı olarak netleştirir." },
] as const;

export default function WholesalePage() {
  return (
    <main className="wholesale-page">
      <SiteHeader />
      <section className="wholesale-hero">
        <div className="wholesale-shell wholesale-hero-grid">
          <div>
            <p className="wholesale-kicker">Toptan satış · İstanbul</p>
            <h1>Ürünü seçin.<br /><em>Teklifi netleştirelim.</em></h1>
            <p className="wholesale-lead">BÜCÜRÜKTOYS yalnızca toptan çalışır. Online ödeme yerine, ürün kodu ve talep adedine göre güncel fiyat ve stok teyidi sunar.</p>
            <div className="wholesale-actions">
              <a href="/urunler">Ürünleri incele <span aria-hidden="true">→</span></a>
              <a className="secondary" href="https://wa.me/905393468527" target="_blank" rel="noreferrer">WhatsApp&apos;tan ulaş</a>
            </div>
          </div>
          <aside className="wholesale-summary" aria-label="Toptan satış özeti">
            <span>Satış modeli</span><strong>%100 toptan teklif</strong>
            <span>Teslimat</span><strong>Türkiye geneli planlama</strong>
            <span>Fiyat ve stok</span><strong>Sipariş öncesi yazılı teyit</strong>
            <span>İletişim</span><strong>0539 346 85 27</strong>
          </aside>
        </div>
      </section>

      <section className="wholesale-process wholesale-shell" aria-labelledby="wholesale-process-title">
        <header>
          <p className="wholesale-kicker">Nasıl çalışır?</p>
          <h2 id="wholesale-process-title">Dört adımda düzenli teklif.</h2>
          <p>Teklif listeniz ürün kodlarını, adları ve adetleri tek mesajda toplar; eksik veya yanlış ürün kodu riskini azaltır.</p>
        </header>
        <div>{steps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className="wholesale-requirements">
        <div className="wholesale-shell wholesale-requirements-grid">
          <div>
            <p className="wholesale-kicker">Hızlı teklif için</p>
            <h2>Mesajınızda beş bilgi yeterli.</h2>
            <p>Ürünlerin fiyatı, stoğu ve teslimat uygunluğu talebinizin kapsamına göre doğrulanır.</p>
          </div>
          <ol>
            <li><span>01</span><strong>Firma veya mağaza adı</strong></li>
            <li><span>02</span><strong>Ürün stok kodları</strong></li>
            <li><span>03</span><strong>Talep edilen adetler</strong></li>
            <li><span>04</span><strong>Teslimat ilçesi</strong></li>
            <li><span>05</span><strong>Varsa özel paketleme notu</strong></li>
          </ol>
        </div>
      </section>

      <section className="wholesale-notes wholesale-shell">
        <article><span>Fiyatlandırma</span><h3>Güncel teklif esastır.</h3><p>Sitede fiyat gösterilse bile kesin tutar; adet, koli düzeni, KDV ve sevkiyat koşullarıyla birlikte yazılı teklifte onaylanır.</p></article>
        <article><span>Stok</span><h3>Siparişten önce teyit edilir.</h3><p>Katalog ürünleri talep toplamaya açıktır. Anlık stok ve ürün varyantı satış ekibinin teyidiyle kesinleşir.</p></article>
        <article><span>Teslimat</span><h3>Türkiye genelinde planlanır.</h3><p>Şehir, sipariş hacmi ve uygun teslim günü görüşme sırasında netleştirilir.</p></article>
      </section>

      <section className="wholesale-final">
        <div className="wholesale-shell"><div><p className="wholesale-kicker">Teklifinizi hazırlayın</p><h2>Katalogdan başlayın, tek mesajla gönderin.</h2></div><a href="/urunler">Tüm ürünleri aç <span aria-hidden="true">→</span></a></div>
      </section>
      <DeveloperContact />
    </main>
  );
}
