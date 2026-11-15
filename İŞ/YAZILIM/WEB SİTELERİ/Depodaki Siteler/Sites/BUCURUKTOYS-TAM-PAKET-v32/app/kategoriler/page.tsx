import type { Metadata } from "next";
import { getPublicCategories } from "../../lib/site-content-server";
import { publicImageUrl, publicSeedProducts } from "../../lib/products";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Toptan Oyuncak Kategorileri",
  description: "Dış mekân, eğlence, zekâ, duyusal, kırtasiye ve aksesuar toptan oyuncak kategorilerini inceleyin.",
  alternates: { canonical: "/kategoriler" },
};

export default async function CategoriesPage() {
  const products = publicSeedProducts.filter((product) => product.isPublished);
  const categoryPages = await getPublicCategories();
  return <main className="content-page categories-overview">
    <SiteHeader />
    <header className="content-hero"><p className="content-kicker">Katalog düzeni</p><h1>Ürün grupları.</h1><p>Her ürün tek bir ana kategori altında tutulur. Böylece mağazanıza uygun seçkiyi karşılaştırabilir, benzer ürünleri aynı sayfada görebilirsiniz.</p></header>
    <section className="category-overview-grid">{categoryPages.map((category, index) => {
      const matches = products.filter((product) => product.category === category.id);
      const image = matches[0];
      return <a href={`/kategori/${category.slug}`} key={category.id}><div>{image && <img src={publicImageUrl(image.image, 540)} alt={`${category.name} kategorisi`} width="540" height="540" />}</div><span>0{index + 1} · {matches.length} ürün</span><h2>{category.name}</h2><p>{category.description}</p><strong>Kategoriyi incele →</strong></a>;
    })}</section>
    <section className="content-cta"><div><p className="content-kicker">Tek listede seçim</p><h2>Tüm kategorileri birlikte görüntüleyin.</h2><p>Ürün araması, filtreler ve adetli teklif listesi için ana kataloğa geçin.</p></div><a href="/urunler">Tüm ürünleri aç →</a></section>
    <footer className="content-footer">BÜCÜRÜKTOYS · Toptan oyuncak kategorileri</footer>
    <DeveloperContact />
  </main>;
}
