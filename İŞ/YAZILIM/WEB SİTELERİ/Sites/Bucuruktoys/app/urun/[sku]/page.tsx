import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProducts } from "../../../lib/catalog-server";
import { productImageDimensions, publicImageUrl } from "../../../lib/products";
import { categoryById } from "../../../lib/category-pages";
import QuoteButton from "./quote-button";
import { hasPublicValue } from "../../../lib/business-info";
import DeveloperContact from "../../components/developer-contact";
import SiteHeader from "../../components/site-header";
import ProductGallery from "./product-gallery";

const base = "https://www.bucuruktoys.com";
const categoryNames: Record<string,string> = { outdoor:"Dış Mekân", fun:"Şaka & Eğlence", skill:"Zekâ & Beceri", sensory:"Stres & Duyusal", stationery:"Kırtasiye & Sticker", accessory:"Anahtarlık & Aksesuar", "3d":"3D Baskı" };

async function findProduct(slug: string) {
  const products = await getPublicProducts();
  return products.find((item) => item.sku.toLocaleLowerCase("tr-TR") === slug.toLocaleLowerCase("tr-TR"));
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params; const product = await findProduct(sku); if (!product) return {};
  const description = `${product.name} — ${product.pack}. BÜCÜRÜKTOYS toptan oyuncak kataloğu, Türkiye geneli teslimat.`;
  const url = `/urun/${product.sku.toLowerCase()}`;
  const image = publicImageUrl(product.image);
  return { title: product.name, description, alternates:{canonical:url}, openGraph:{title:`${product.name} | BÜCÜRÜKTOYS`,description,url,images:[{url:image,alt:product.name}]}, twitter:{card:"summary_large_image",title:product.name,description,images:[image]} };
}

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params; const products = await getPublicProducts(); const product = products.find((item) => item.sku.toLocaleLowerCase("tr-TR") === sku.toLocaleLowerCase("tr-TR")); if (!product) notFound();
  const gallerySources = [product.image, ...product.gallery].filter((value,index,array)=>array.indexOf(value)===index);
  const gallery = gallerySources.map((url) => publicImageUrl(url));
  const absoluteGallery = gallery.map((url) => /^https?:\/\//i.test(url) ? url : `${base}${url}`);
  const responsiveMainImage = !/^https?:\/\//i.test(product.image) && !product.image.startsWith("/");
  const galleryImages = gallerySources.map((source, index) => {
    const key = source.split("/").pop() ?? source;
    const [width, height] = productImageDimensions[key] ?? [900, 900];
    const responsive = index === 0 && responsiveMainImage;
    return {
      src: publicImageUrl(source),
      thumbnail: publicImageUrl(source, 320),
      srcSet: responsive ? `${publicImageUrl(source,320)} 320w, ${publicImageUrl(source,540)} 540w, ${publicImageUrl(source)} ${width}w` : undefined,
      width,
      height,
      alt: `${product.name} ${index + 1}. görsel`,
    };
  });
  const categoryPage = categoryById(product.category);
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  const message = encodeURIComponent(`Merhaba BÜCÜRÜKTOYS,\n\n*TOPTAN TEKLİF TALEBİ*\n\n1) *${product.sku} — ${product.name}*\n   Talep edilen: 1 adet\n   Paket / koli: ${product.pack}\n\nGüncel toptan fiyat, stok ve teslimat bilgisini paylaşabilir misiniz?`);
  const productUrl = `${base}/urun/${product.sku.toLowerCase()}`;
  const normalizedBarcode = product.barcode.replace(/\s+/g, "");
  const validGtin = /^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(normalizedBarcode) ? normalizedBarcode : undefined;
  const technicalDetails = [
    ["Yaş grubu", product.ageGroup],
    ["CE / uygunluk beyanı", product.conformityDeclaration],
    ["Ürün ölçüsü", product.productDimensions],
    ["Koli ölçüsü", product.cartonDimensions],
    ["Koli desisi", product.cartonDesi === null ? "" : product.cartonDesi.toLocaleString("tr-TR")],
    ["Koli ağırlığı", product.cartonWeightKg === null ? "" : `${product.cartonWeightKg.toLocaleString("tr-TR")} kg`],
    ["Barkod / GTIN", validGtin ?? ""],
    ["Menşe", product.originCountry],
  ];
  const knownTechnicalDetails = technicalDetails.filter(([, value]) => hasPublicValue(value));
  const schema = {
    "@context":"https://schema.org",
    "@graph":[
      {
        "@type":"Product",
        "@id":`${productUrl}#product`,
        name:product.name,
        sku:product.sku,
        ...(validGtin ? { gtin:validGtin } : {}),
        image:absoluteGallery,
        description:`${product.note || product.name}. Toptan paket düzeni: ${product.pack}. Minimum sipariş: ${product.minOrderPackages} paket/koli.`,
        category:categoryNames[product.category],
        brand:{"@type":"Brand",name:"BÜCÜRÜKTOYS"},
        audience:{"@type":"BusinessAudience","audienceType":"Toptan oyuncak alıcıları"},
        additionalProperty:[
          {"@type":"PropertyValue",name:"Paket / koli düzeni",value:product.pack},
          {"@type":"PropertyValue",name:"Minimum sipariş",value:`${product.minOrderPackages} paket/koli`},
          {"@type":"PropertyValue",name:"Teslimat bölgesi",value:"İstanbul"},
          ...knownTechnicalDetails.map(([name, value]) => ({"@type":"PropertyValue",name,value})),
        ],
        url:productUrl,
        ...(product.isPriceVisible && product.price !== null ? { offers:{ "@type":"Offer", url:productUrl, priceCurrency:"TRY", price:product.price, businessFunction:"https://purl.org/goodrelations/v1#Sell", eligibleQuantity:{"@type":"QuantitativeValue",minValue:product.minOrderPackages,unitCode:"C62"}, priceSpecification:{"@type":"UnitPriceSpecification",price:product.price,priceCurrency:"TRY",unitCode:"C62",description:"Toptan birim/paket fiyatı; KDV durumu kesin teklifte yazılı olarak belirtilir."}, seller:{"@id":`${base}/#organization`}, ...(product.stock > 0 ? { availability:"https://schema.org/InStock" } : {}) } } : {}),
      },
      {
        "@type":"BreadcrumbList",
        itemListElement:[
          {"@type":"ListItem",position:1,name:"Ana sayfa",item:base},
          {"@type":"ListItem",position:2,name:categoryNames[product.category],item:categoryPage ? `${base}/kategori/${categoryPage.slug}` : `${base}/urunler#products`},
          {"@type":"ListItem",position:3,name:product.name,item:productUrl},
        ],
      },
    ],
  };
  return <main className="product-page">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}} />
    <section className="product-detail">
      <ProductGallery images={galleryImages} />
      <div className="product-copy"><a className="product-breadcrumb" href={categoryPage ? `/kategori/${categoryPage.slug}` : "/urunler"}>Ana sayfa / {categoryNames[product.category]}</a><p className="eyebrow">{product.sku} · Toptan ürün</p><h1>{product.name}</h1><p className="product-note">{product.note || "Toptan satış için paketli oyuncak."}</p><div className="product-facts"><div><span>Paket / koli</span><strong>{product.pack}</strong></div><div><span>Teklif listesi</span><strong>Talep adedinizi siz girin</strong></div><div><span>Stok</span><strong>WhatsApp&apos;tan teyit</strong></div><div><span>Kategori</span><strong>{categoryNames[product.category]}</strong></div></div><p className="product-price">Toptan fiyat için teklif alın</p><QuoteButton id={product.id} sku={product.sku} name={product.name} /><div className="product-cta"><a href={`https://wa.me/905393468527?text=${message}`} target="_blank" rel="noreferrer">Tek ürün için WhatsApp</a><a href="/urunler#products">Diğer ürünler</a></div></div>
    </section>
    {knownTechnicalDetails.length > 0 && <section className="product-specifications" aria-labelledby="physical-specs-title">
      <header><p className="eyebrow">Toptan teknik föy</p><h2 id="physical-specs-title">Doğrulanmış ürün bilgileri.</h2><p>Yalnızca teyit edilmiş ölçü, belge ve ürün bilgileri gösterilir.</p></header>
      <dl>{knownTechnicalDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {(hasPublicValue(product.safetyNote) || hasPublicValue(product.licenseNote)) && <div className="product-risk-notes">
        {hasPublicValue(product.safetyNote) && <p><strong>Güvenlik doğrulaması</strong>{product.safetyNote}</p>}
        {hasPublicValue(product.licenseNote) && <p><strong>Lisans doğrulaması</strong>{product.licenseNote}</p>}
      </div>}
    </section>}
    <section className="product-explainer">
      <div><p className="eyebrow">Ürün özeti</p><h2>{product.name} nedir?</h2></div>
      <div><p><strong>{product.name}</strong>, BÜCÜRÜKTOYS kataloğunda <strong>{categoryNames[product.category]}</strong> kategorisinde yer alan {product.note?.toLocaleLowerCase("tr-TR") || "paketli bir toptan oyuncaktır"}. Ürün <strong>{product.pack}</strong> düzeninde sunulur; istediğiniz talep adedini teklif listesine yazabilirsiniz.</p><p>Kesin fiyat, uygun paket/koli toplamı, mevcut stok ve Türkiye geneli teslimat ayrıntısı sipariş öncesinde <strong>{product.sku}</strong> stok koduyla teyit edilir.</p><nav><a href="/toptan-oyuncak-rehberi">Toptan sipariş rehberi</a><a href="/sikca-sorulan-sorular">Sık sorulanlar</a></nav></div>
    </section>
    <section className="product-trust"><div><strong>Türkiye geneli teslimat</strong><span>Teslim süresi ve şehir uygunluğu siparişte netleştirilir.</span></div><div><strong>Toptan koli düzeni</strong><span>Minimum sipariş ve koli bilgisi ürün bazında korunur.</span></div><div><strong>Doğrudan iletişim</strong><span>Ürün koduyla hızlı stok ve fiyat teyidi alın.</span></div></section>
    {related.length > 0 && <section className="related-products"><header><p className="eyebrow">Aynı kategoriden</p><h2>Benzer toptan ürünler.</h2></header><div>{related.map((item)=><a href={`/urun/${item.sku.toLowerCase()}`} key={item.id}><img src={publicImageUrl(item.image,320)} alt={item.name} width="240" height="240" loading="lazy"/><span><small>{item.sku}</small><strong>{item.name}</strong><em>{item.pack}</em></span></a>)}</div></section>}
    <footer>BÜCÜRÜKTOYS · <a href="tel:+905393468527">0539 346 85 27</a></footer>
    <DeveloperContact />
  </main>;
}
