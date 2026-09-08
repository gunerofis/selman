import { getPublicManagedPage } from "../../lib/site-content-server";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export async function ManagedPage({ slug }: { slug: string }) {
  const page = await getPublicManagedPage(slug);
  if (!page) {
    return <main className="info-page"><article className="info-content"><section><h2>İçerik bulunamadı</h2><p>Bu sayfa içeriği şu an yüklenemedi. Lütfen daha sonra tekrar deneyin veya iletişim sayfamızdan bize ulaşın.</p></section></article></main>;
  }
  const base = "https://www.bucuruktoys.com";
  const schema = { "@context": "https://schema.org", "@type": slug === "sikca-sorulan-sorular" ? "FAQPage" : "Article", headline: page.title, description: page.summary, url: `${base}/${slug}`, inLanguage: "tr-TR" };
  return <main className="info-page">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header className="info-hero"><p className="info-kicker">{page.kicker}</p><h1>{page.title}</h1><p>{page.summary}</p></header>
    <article className="info-content">{page.sections.map((section, index) => <section key={`${section.title}-${index}`}><h2>{section.title}</h2><p>{section.text}</p></section>)}<section className="info-cta"><div><h2>Ürünleri inceleyin.</h2><p>Stok kodlu katalogdan teklif listenizi oluşturun.</p></div><a href="/urunler">Kataloğu aç</a></section></article>
    <footer className="info-footer">BÜCÜRÜKTOYS · <a href="tel:+905393468527">0539 346 85 27</a></footer>
    <DeveloperContact />
  </main>;
}
