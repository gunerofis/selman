import { getPublicCategories } from "../lib/site-content-server";
import { publicImageUrl, publicSeedProducts } from "../lib/products";
import DeveloperContact from "./components/developer-contact";
import SiteHeader from "./components/site-header";

const siteUrl = "https://www.bucuruktoys.com";

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}

function Cube() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5" /></svg>;
}

export default async function HomePage() {
  const products = publicSeedProducts.filter((product) => product.isPublished);
  const categoryPages = await getPublicCategories();
  const heroProducts = [products[0], products[7], products[19]].filter(Boolean);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "BÜCÜRÜKTOYS",
    url: siteUrl,
    logo: `${siteUrl}/assets/bucuruktoys-touch-icon.png`,
    description: "Mağaza, kırtasiye, e-ticaret ve kurumsal alıcılar için paketli toptan oyuncak tedarik markası.",
    telephone: "+905393468527",
    areaServed: { "@type": "Country", name: "Türkiye" },
    contactPoint: { "@type": "ContactPoint", telephone: "+905393468527", contactType: "sales", availableLanguage: "Turkish" },
  };

  return <main className="landing-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
    <SiteHeader />

    <section className="landing-hero">
      <div className="landing-container landing-hero-grid">
        <div className="landing-hero-copy">
          <p className="landing-kicker"><span /> Yeni sezon toptan seçki</p>
          <h1>Raflarda merak uyandıran <em>oyuncaklar.</em></h1>
          <p>Paketli ürünleri kategori ve stok koduyla inceleyin. İstediğiniz adetleri ekleyin; düzenli teklif listenizi WhatsApp üzerinden tek seferde gönderin.</p>
          <div className="landing-hero-actions"><a className="landing-primary" href="/urunler">Ürünleri incele <Arrow /></a><a className="landing-secondary" href="/toptan-satis">Süreç nasıl işler?</a></div>
          <dl className="landing-hero-stats"><div><dt>Katalog</dt><dd>{products.length} ürün</dd></div><div><dt>Ürün grubu</dt><dd>{categoryPages.length} kategori</dd></div><div><dt>Satış biçimi</dt><dd>%100 toptan</dd></div></dl>
        </div>
        <div className="landing-hero-gallery" aria-label="Öne çıkan katalog ürünleri">
          <div className="landing-gallery-backdrop" />
          {heroProducts.map((product, index) => <a className={`landing-product-frame frame-${index + 1}`} href={`/urun/${product.sku.toLowerCase()}`} key={product.id}><img src={publicImageUrl(product.image, 320)} srcSet={`${publicImageUrl(product.image, 160)} 160w, ${publicImageUrl(product.image, 320)} 320w, ${publicImageUrl(product.image, 540)} 540w`} sizes={index === 0 ? "(max-width: 560px) 58vw, (max-width: 900px) 42vw, 340px" : "(max-width: 560px) 44vw, (max-width: 900px) 34vw, 260px"} alt={product.name} width="540" height="540" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} /><span>{product.sku}</span></a>)}
          <div className="landing-gallery-note"><strong>Seç · Listele · Teklif al</strong><span>Fiyat ve stok sipariş öncesinde teyit edilir.</span></div>
        </div>
      </div>
    </section>

    <section className="landing-paths" aria-label="Hızlı erişim">
      <div className="landing-container landing-path-grid">
        <a href="/urunler"><span>01</span><div><small>Canlı katalog</small><strong>Ürünleri seçin</strong><p>Arama, kategori filtresi ve adetli teklif listesi.</p></div><Arrow /></a>
        <a href="/kategoriler"><span>02</span><div><small>Doğru raf grubu</small><strong>Kategorileri keşfedin</strong><p>Mağazanıza uygun ürün grubuna doğrudan ulaşın.</p></div><Arrow /></a>
        <a href="/bayi"><span>03</span><div><small>İş ortaklığı</small><strong>Bayilik başvurusu</strong><p>Firma bilgilerinizi tek form üzerinden iletin.</p></div><Arrow /></a>
      </div>
    </section>

    <section className="landing-categories">
      <div className="landing-container">
        <div className="landing-section-heading"><div><p className="landing-kicker">Ürün grupları</p><h2>Her raf için<br />net bir kategori.</h2></div><p>Ürünleri kullanım biçimine göre ayrılmış sayfalarda inceleyin; teknik bilgileri ve aynı gruptaki alternatifleri karşılaştırın.</p></div>
        <div className="landing-category-grid">{categoryPages.map((category, index) => {
          const product = products.find((item) => item.category === category.id);
          return <a href={`/kategori/${category.slug}`} key={category.id}><div>{product && <img src={publicImageUrl(product.image, 160)} srcSet={`${publicImageUrl(product.image, 160)} 160w, ${publicImageUrl(product.image, 320)} 320w`} sizes="(max-width: 560px) calc(100vw - 70px), (max-width: 900px) calc(50vw - 48px), 200px" alt="" width="320" height="320" loading="lazy" decoding="async" />}</div><span>0{index + 1}</span><h3>{category.name}</h3><p>{category.shortDescription}</p><b>Sayfayı aç <Arrow /></b></a>;
        })}</div>
      </div>
    </section>

    <section className="landing-process">
      <div className="landing-container landing-process-grid">
        <div><p className="landing-kicker light">Toptan teklif sistemi</p><h2>Üç adımda düzenli sipariş talebi.</h2><p>Online ödeme yoktur. Ürün, adet, stok kodu ve paket bilgisi teklif listenizde otomatik olarak düzenlenir.</p><a href="/toptan-satis">Tüm ticari süreci incele <Arrow /></a></div>
        <ol><li><span>01</span><div><strong>Ürünü bulun</strong><p>Kategori, ürün adı veya stok koduyla arayın.</p></div></li><li><span>02</span><div><strong>Adedi belirleyin</strong><p>İstediğiniz ürünleri listeye ekleyip talep adetlerini yazın.</p></div></li><li><span>03</span><div><strong>Teklif isteyin</strong><p>Hazır mesajı WhatsApp&apos;tan gönderip güncel fiyat ve stok teyidi alın.</p></div></li></ol>
      </div>
    </section>

    <section className="landing-3d-teaser">
      <div className="landing-container landing-3d-card">
        <div className="landing-3d-orbit"><i /><i /><i /><span><Cube /></span></div>
        <div><p className="landing-kicker">Yeni üretim alanı</p><h2>3D baskı koleksiyonu hazırlanıyor.</h2><p>Özgün ürünler, seri üretime uygun modeller ve kişiselleştirilebilir seçenekler tek katalog altında yayınlanacak.</p><a href="/3d-baski">Hazırlık sayfasını aç <Arrow /></a></div>
        <strong>YAKINDA</strong>
      </div>
    </section>

    <section className="landing-contact">
      <div className="landing-container landing-contact-card"><div><p className="landing-kicker">Satış ve ürün bilgisi</p><h2>Teklifinizi birlikte netleştirelim.</h2><p>Ürün kodu, talep adedi, paket düzeni ve teslimat için satış birimine doğrudan ulaşın.</p></div><div><a className="landing-primary" href="https://wa.me/905393468527" target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="tel:+905393468527">0539 346 85 27</a></div></div>
    </section>

    <footer className="landing-footer"><div className="landing-container landing-footer-grid"><div><img src="/assets/bucuruktoys-logo-reversed.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" /><p>Raflara neşe, mağazanıza hareket.</p></div><div><strong>Katalog</strong><a href="/urunler">Tüm ürünler</a><a href="/kategoriler">Kategoriler</a><a href="/katalog">Yazdırılabilir katalog</a><a href="/3d-baski">3D baskı · Yakında</a></div><div><strong>Kurumsal</strong><a href="/hakkimizda">Hakkımızda</a><a href="/toptan-satis">Toptan satış</a><a href="/bayi">Bayilik</a><a href="/iletisim">İletişim</a></div><div><strong>Bilgi</strong><a href="/toptan-oyuncak-rehberi">Sipariş rehberi</a><a href="/sikca-sorulan-sorular">Sık sorulanlar</a><a href="/kurumsal-bilgiler">Kurumsal bilgiler</a><a href="/gizlilik">Gizlilik</a></div></div><div className="landing-container landing-footer-bottom"><span>© 2026 BÜCÜRÜKTOYS</span><a href="/admin">Yönetim paneli</a></div></footer>
    <DeveloperContact />
  </main>;
}
