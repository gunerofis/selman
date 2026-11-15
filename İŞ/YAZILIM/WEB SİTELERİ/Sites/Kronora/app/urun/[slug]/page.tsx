import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "../../product-card";
import ProductGallery from "../../product-gallery";
import ProductPurchase from "../../product-purchase";
import { conceptCatalogProducts, getConceptCatalogProduct, type ConceptCatalogProduct } from "../../lib/product-wall-concepts";
import { fallbackProducts, getProductBySlug, getProducts, getSettings } from "../../lib/store";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return [...fallbackProducts, ...conceptCatalogProducts].map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  const newModel = getConceptCatalogProduct(slug);
  if (!product && newModel) return {
    title: newModel.metaTitle,
    description: newModel.metaDescription,
    keywords: newModel.keywords,
    alternates: { canonical: newModel.href },
    openGraph: { title: newModel.name, description: newModel.metaDescription, type: "website", url: newModel.href, images: [{ url: newModel.primaryImage, alt: newModel.name }] },
    twitter: { card: "summary_large_image", title: newModel.name, description: newModel.metaDescription, images: [newModel.primaryImage] },
  };
  return product ? {
    title: product.metaTitle || `${product.name} | Moneluks`,
    description: product.metaDescription || product.shortDescription,
    keywords: product.keywords,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: { title: product.name, description: product.metaDescription || product.shortDescription, type: "website", url: `/urun/${product.slug}`, images: product.primaryImage ? [{ url: product.primaryImage, alt: product.name }] : [] },
    twitter: { card: "summary_large_image", title: product.name, description: product.metaDescription || product.shortDescription, images: product.primaryImage ? [product.primaryImage] : [] },
  } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [product, allProducts, settings] = await Promise.all([getProductBySlug(slug), getProducts(), getSettings()]);
  if (!product) {
    const newModel = getConceptCatalogProduct(slug);
    if (!newModel) notFound();
    return <NewModelProductPage product={newModel} contactEmail={settings.contactEmail} />;
  }
  const unavailable = product.trackStock && product.stockQuantity < 1;
  const gallery = [...new Set([product.primaryImage, ...product.images].filter(Boolean))];
  const skuFamily = product.sku.split("-")[0].toLocaleUpperCase("tr-TR");
  const variants = allProducts
    .filter((item) => item.sku.split("-")[0].toLocaleUpperCase("tr-TR") === skuFamily)
    .map((item) => ({ slug: item.slug, color: item.color, active: item.slug === product.slug }));
  const related = allProducts.filter((item) => item.slug !== product.slug && (item.model === product.model || item.color === product.color)).slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: gallery,
    description: product.metaDescription || product.shortDescription,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.priceCents / 100,
      availability: unavailable ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `https://moneluks.gunerofis.chatgpt.site/urun/${product.slug}`,
    },
  };

  return (
    <main id="main-content" className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="detail-breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/koleksiyon">Koleksiyon</Link><span>/</span><b>{product.name}</b></div>
      <section className="detail-hero">
        <ProductGallery images={gallery} name={product.name} />
        <div className="detail-summary">
          <p className="product-sku">SKU: {product.sku}</p>
          <h1>{product.name}</h1>
          <div className="drawer-price"><strong>{(product.priceCents / 100).toLocaleString("tr-TR")} TL</strong>{product.oldPriceCents && <del>{(product.oldPriceCents / 100).toLocaleString("tr-TR")} TL</del>}</div>
          <p className={unavailable ? "availability unavailable" : "availability"}>{unavailable ? "Tükendi" : product.trackStock ? `${product.stockQuantity} adet stokta` : "Siparişe açık"}</p>
          <p className="detail-lead">{product.shortDescription}</p>
          <div className="drawer-actions"><ProductPurchase slug={product.slug} color={product.color} variants={variants} unavailable={unavailable} maxQuantity={product.trackStock ? product.stockQuantity : 20} /></div>
          <dl className="product-facts"><div><dt>Model</dt><dd>{product.model}</dd></div><div><dt>Renk</dt><dd>{product.color}</dd></div><div><dt>Stok kodu</dt><dd>{product.sku}</dd></div></dl>
        </div>
      </section>
      <section className="product-service-strip" aria-label="Sipariş ve ürün bilgileri"><div><b>Güncel stok bilgisi</b><span>Durum ürün sayfasında gösterilir</span></div><div><b>Ödeme bilgisi</b><span>Kart bilgisi bu sitede tutulmaz</span></div><div><b>Ürün desteği</b><span>Seçim öncesi bize ulaşabilirsiniz</span></div></section>
      <section className="detail-description"><div><span>Ürün bilgisi</span><h2>Bilmeniz gerekenler</h2><p>Model, kullanım ve bakım bilgilerini sipariş öncesinde inceleyin.</p></div><article className="product-accordions">
        <details open><summary>Ürün detayları <span aria-hidden="true">+</span></summary><div>{product.description.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></details>
        <details><summary>Ölçü ve kullanım <span aria-hidden="true">+</span></summary><div><p>Ürün kapasitesi ve bölme yapısı model adına göre değişir. Satın almadan önce koleksiyonunuzun adet ve kullanım ihtiyacını ürün görselleriyle karşılaştırın.</p></div></details>
        <details><summary>Bakım <span aria-hidden="true">+</span></summary><div><p>Yüzeyi yumuşak ve kuru bir bezle temizleyin. Ürünü doğrudan güneş, yoğun nem ve aşındırıcı temizlik ürünlerinden uzak tutun.</p></div></details>
      </article></section>
      {related.length > 0 && <section className="related-products"><div className="section-heading"><h2>Benzer parçalar</h2><Link className="text-link" href="/koleksiyon">Tüm koleksiyon</Link></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></section>}
    </main>
  );
}

function NewModelProductPage({ product, contactEmail }: { product: ConceptCatalogProduct; contactEmail: string }) {
  const variants = conceptCatalogProducts.filter((item) => item.model === product.model);
  const subject = encodeURIComponent(`${product.name} hakkında bilgi`);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    model: product.model,
    color: product.color,
    image: [product.primaryImage],
    description: product.metaDescription,
    sku: product.sku,
    url: `https://moneluks.gunerofis.chatgpt.site${product.href}`,
  };

  return <main id="main-content" className="detail-page new-model-detail">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <div className="detail-breadcrumb"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/koleksiyon">Koleksiyon</Link><span>/</span><b>{product.name}</b></div>
    <section className="detail-hero">
      <ProductGallery images={[product.primaryImage]} name={product.name} />
      <div className="detail-summary">
        <p className="product-sku">YENİ MODEL · {product.sku}</p>
        <h1>{product.name}</h1>
        <div className="new-model-price"><strong>Fiyat ve üretim bilgisi alın</strong><span>Satışa açılmadan önce ölçü, fiyat ve stok kesinleştirilir.</span></div>
        <p className="detail-lead">{product.shortDescription}</p>
        <div className="concept-variant-picker" aria-label="Renk varyantları">
          <span>Renk</span><div>{variants.map((variant) => <Link key={variant.slug} href={variant.href} aria-current={variant.slug === product.slug ? "page" : undefined}>{variant.color}</Link>)}</div>
        </div>
        <div className="drawer-actions concept-detail-actions"><a className="add-button" href={`mailto:${contactEmail}?subject=${subject}`}>Bilgi al</a><Link className="secondary-button" href="/iletisim">İletişime geç</Link></div>
        <dl className="product-facts"><div><dt>Model</dt><dd>{product.model}</dd></div><div><dt>Renk</dt><dd>{product.color}</dd></div><div><dt>Tasarım kodu</dt><dd>{product.sku}</dd></div></dl>
      </div>
    </section>
    <section className="product-service-strip" aria-label="Yeni model bilgileri"><div><b>Beş sabit renk</b><span>Krem, kahve, bordo, taba ve siyah</span></div><div><b>Üretim doğrulaması</b><span>Ölçü ve malzeme sipariş öncesi kesinleşir</span></div><div><b>Ürün desteği</b><span>Seçim için doğrudan bilgi alın</span></div></section>
    <section className="detail-description"><div><span>Yeni model</span><h2>Ürün tasarımı</h2><p>Görsel, renk ve kullanım biçimini inceleyin; üretim ayrıntılarını sipariş öncesinde netleştirin.</p></div><article className="product-accordions">
      <details open><summary>Ürün detayları <span aria-hidden="true">+</span></summary><div><p>{product.description}</p></div></details>
      <details><summary>Renk seçenekleri <span aria-hidden="true">+</span></summary><div><p>Bu model krem, kahve, bordo, taba ve siyah olmak üzere beş sabit renk seçeneğiyle hazırlanmıştır.</p></div></details>
      <details><summary>Fiyat ve teslimat <span aria-hidden="true">+</span></summary><div><p>Bu tasarım henüz doğrudan sepete eklenmez. Güncel üretim ölçüsü, fiyat, stok ve teslimat süresi için bilgi alın.</p></div></details>
    </article></section>
  </main>;
}
