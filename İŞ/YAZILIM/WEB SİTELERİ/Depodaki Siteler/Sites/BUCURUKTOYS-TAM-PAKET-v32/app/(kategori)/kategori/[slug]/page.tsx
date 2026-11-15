import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryPages } from "../../../../lib/category-pages";
import { getPublicCategoryBySlug } from "../../../../lib/site-content-server";
import { getPublicProducts } from "../../../../lib/catalog-server";
import { publicImageUrl } from "../../../../lib/products";
import DeveloperContact from "../../../components/developer-contact";
import SiteHeader from "../../../components/site-header";

const base = "https://www.bucuruktoys.com";

export function generateStaticParams() {
  return categoryPages.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Toptan Katalog`,
    description: `${category.description} Paket ve koli bilgilerini inceleyin, BÜCÜRÜKTOYS'tan teklif alın.`,
    alternates: { canonical: `/kategori/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} | BÜCÜRÜKTOYS`,
      description: `${category.description} Ürün kodu, paket düzeni ve toptan alım rehberi.`,
      url: `/kategori/${category.slug}`,
      images: [{ url: "/assets/bucuruktoys-og-card.png", width: 1200, height: 630, alt: `${category.name} toptan katalog` }],
    },
    twitter: { card: "summary_large_image", title: `${category.name} | BÜCÜRÜKTOYS`, description: category.description, images: ["/assets/bucuruktoys-og-card.png"] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category) notFound();
  const products = (await getPublicProducts()).filter((product) => product.category === category.id);
  const url = `${base}/kategori/${category.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: category.name,
        description: category.description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${base}/#website` },
        mainEntity: { "@id": `${url}#products` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#products`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${base}/urun/${product.sku.toLowerCase()}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: base },
          { "@type": "ListItem", position: 2, name: category.name, item: url },
        ],
      },
    ],
  };

  return <main className="category-page">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header className="category-hero"><a className="category-crumb" href="/">Ana sayfa / Toptan oyuncak kategorileri</a><p className="category-kicker">{products.length} ürün · Toptan katalog</p><h1>{category.name}</h1><p>{category.description} Her ürünün kodunu, paket düzenini ve minimum sipariş bilgisini inceleyerek teklif listesi oluşturabilirsiniz.</p></header>
    <section className="category-list" aria-label={category.name}>{products.map((product) => <a className="category-product" href={`/urun/${product.sku.toLowerCase()}`} key={product.id}><div><img src={publicImageUrl(product.image, 320)} alt={product.name} width="320" height="320" loading="lazy" /></div><span><small>{product.sku}</small><strong>{product.name}</strong><em>{product.pack} · Min. {product.minOrderPackages} paket</em></span></a>)}</section>
    <section className="category-editorial" aria-label={`${category.name} satın alma rehberi`}>
      <header><p className="category-kicker">Kategori rehberi</p><h2>{category.name} alırken nelere bakılır?</h2></header>
      <div>{category.guides.map((guide) => <article key={guide.title}><h3>{guide.title}</h3><p>{guide.text}</p></article>)}</div>
    </section>
    <section className="category-answer"><h2>{category.name} toptan nasıl alınır?</h2><p>Ürün detay sayfasından kodu ve paket düzenini kontrol edin. İhtiyacınız olan ürünleri katalogdaki teklif listesine ekleyin; fiyat, stok ve Türkiye geneli teslimat bilgisini ürün kodlarıyla doğrulatın.</p><nav><a href="/urunler#products">Teklif listesi oluştur</a><a href="/toptan-oyuncak-rehberi">Sipariş rehberi</a><a href="/sikca-sorulan-sorular">Sık sorulanlar</a></nav></section>
    <footer className="category-footer">BÜCÜRÜKTOYS · {category.name} · <a href="tel:+905393468527">0539 346 85 27</a></footer>
    <DeveloperContact />
  </main>;
}
