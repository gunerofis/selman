import { THREE_D_PUBLIC_ENABLED } from "../../lib/features";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export default async function PrintPage() {
  if (!THREE_D_PUBLIC_ENABLED) {
    return <main className="print-page print-inactive">
      <SiteHeader />
      <section className="coming-hero">
        <div className="coming-copy">
          <span className="print-kicker">Yeni üretim alanı · Yakında</span>
          <h1>Fikirler<br /><em>katman katman</em><br />gerçeğe dönüşüyor.</h1>
          <p>BÜCÜRÜKTOYS 3D baskı koleksiyonu; özgün ürünler, seri üretime uygun modeller ve kişiselleştirilebilir seçeneklerle hazırlanıyor.</p>
          <div className="coming-actions"><a href="/urunler">Mevcut kataloğu incele <span>→</span></a><a href="https://wa.me/905393468527?text=Merhaba%20B%C3%9CC%C3%9CR%C3%9CKTOYS%2C%203D%20bask%C4%B1%20koleksiyonu%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noreferrer">Bilgi alın</a></div>
          <dl className="coming-signals"><div><dt>Koleksiyon</dt><dd>Özgün ürün seçkisi</dd></div><div><dt>Üretim</dt><dd>Seri baskı testleri</dd></div><div><dt>Seçenekler</dt><dd>Renk ve kişiselleştirme</dd></div></dl>
        </div>
        <div className="coming-visual" aria-hidden="true">
          <div className="coming-grid" />
          <div className="coming-ring ring-a" /><div className="coming-ring ring-b" /><div className="coming-ring ring-c" />
          <div className="coming-object"><span>3D</span><small>BÜCÜRÜKTOYS</small><i /><i /><i /><i /></div>
          <div className="coming-axis axis-a">X</div><div className="coming-axis axis-b">Y</div><div className="coming-axis axis-c">Z</div>
          <div className="coming-badge"><span>KOLEKSİYON</span><strong>HAZIRLANIYOR</strong></div>
        </div>
      </section>
      <section className="coming-roadmap" aria-label="3D koleksiyon hazırlık alanları"><article><span>01</span><strong>Ürün seçkisi</strong><p>Satılabilir, anlaşılır ve seri üretime uygun modeller tek koleksiyonda düzenleniyor.</p></article><article><span>02</span><strong>Üretim standardı</strong><p>Malzeme, yüzey, dayanım, baskı süresi ve kalite kontrol adımları netleştiriliyor.</p></article><article><span>03</span><strong>Sipariş deneyimi</strong><p>Renk, adet ve kişiselleştirme seçeneklerini kolaylaştıran teklif akışı hazırlanıyor.</p></article></section>
      <footer className="coming-footer"><span>BÜCÜRÜKTOYS · 3D baskı koleksiyonu</span><a href="/">Ana sayfaya dön</a></footer>
      <DeveloperContact />
    </main>;
  }

  const { default: ActivePrintPage } = await import("./catalog-client");
  return <ActivePrintPage />;
}
