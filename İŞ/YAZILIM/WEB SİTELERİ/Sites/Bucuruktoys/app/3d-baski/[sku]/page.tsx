import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPrintProducts } from "../../../lib/print-catalog-server";
import { calculatePrintPrice, formatPrintTime, printProductGalleryImage, printProductImage, printProductSrcSet } from "../../../lib/print-products";
import { THREE_D_PUBLIC_ENABLED } from "../../../lib/features";
import DeveloperContact from "../../components/developer-contact";
import SiteHeader from "../../components/site-header";
import PrintProductGallery from "./product-gallery";

const SITE_URL = "https://www.bucuruktoys.com";
const WHATSAPP = "905393468527";

async function findProduct(slug: string) {
  const products = await getPublicPrintProducts();
  return products.find((product) => product.sku.toLocaleLowerCase("tr-TR") === slug.toLocaleLowerCase("tr-TR"));
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  if (!THREE_D_PUBLIC_ENABLED) return { robots: { index: false, follow: false } };
  const { sku } = await params;
  const product = await findProduct(sku);
  if (!product) return {};
  const url = `/3d-baski/${product.sku.toLowerCase()}`;
  const description = `${product.name}: ${product.description} Tahmini baskı ${formatPrintTime(product.productionMinutesMin)}–${formatPrintTime(product.productionMinutesMax)}; toptan sipariş ve adet bazlı fiyat.`;
  const image = printProductImage(product);
  return {
    title: `${product.name} · Toptan 3D Baskı`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${product.name} | BÜCÜRÜKTOYS 3D Baskı`,
      description,
      url,
      images: [{ url: image, width: 1536, height: 1024, alt: `${product.name} 3D baskı ürün görseli` }],
    },
    twitter: { card: "summary_large_image", title: product.name, description, images: [image] },
  };
}

function money(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function PrintProductPage({ params }: { params: Promise<{ sku: string }> }) {
  if (!THREE_D_PUBLIC_ENABLED) notFound();
  const { sku } = await params;
  const products = await getPublicPrintProducts();
  const product = products.find((item) => item.sku.toLocaleLowerCase("tr-TR") === sku.toLocaleLowerCase("tr-TR"));
  if (!product) notFound();

  const productUrl = `${SITE_URL}/3d-baski/${product.sku.toLowerCase()}`;
  const image = printProductImage(product);
  const gallery = [image, ...product.gallery.map(printProductGalleryImage)].filter((value, index, all) => all.indexOf(value) === index);
  const absoluteGallery = gallery.map((source) => /^https?:\/\//i.test(source) ? source : `${SITE_URL}${source}`);
  const galleryImages = gallery.map((source, index) => ({ src: source, alt: `${product.name} ${index + 1}. görsel`, srcSet: index === 0 ? printProductSrcSet(product) : undefined }));
  const related = products.filter((item) => item.id !== product.id && item.group === product.group).slice(0, 4);
  const quantities = Array.from(new Set([
    product.minOrderQuantity,
    Math.max(product.minOrderQuantity, 10),
    Math.max(product.minOrderQuantity, 25),
    Math.max(product.minOrderQuantity, 50),
    Math.max(product.minOrderQuantity, 100),
  ])).slice(0, 5);
  const message = encodeURIComponent(`Merhaba BÜCÜRÜKTOYS, ${product.sku} — ${product.name} için ${product.minOrderQuantity} adet üzerinden toptan 3D baskı teklifi almak istiyorum.`);
  const technicalDetails = [
    ["Tahmini baskı süresi", `${formatPrintTime(product.productionMinutesMin)}–${formatPrintTime(product.productionMinutesMax)}`],
    ["Standart ölçü", product.standardDimensions],
    ["Yaklaşık ağırlık", product.approximateWeight],
    ["Malzeme", product.material],
    ["Baskı yöntemi", product.printMethod],
    ["Katman yüksekliği", `${product.layerHeightMm.toLocaleString("tr-TR")} mm`],
    ["Nozzle", `${product.nozzleMm.toLocaleString("tr-TR")} mm`],
    ["Doluluk", `%${product.infillPercent}`],
    ["Duvar sayısı", String(product.wallCount)],
    ["Destek", product.supports],
    ["Montaj", product.assembly],
    ["Renk seçenekleri", product.colorOptions],
    ["Yaş önerisi", product.ageRecommendation],
    ["Kullanım alanı", product.usageAreas],
    ["Paketleme", product.packaging],
    ["Kalite kontrol", product.qualityNote],
    ["Lisans", product.licenseNote],
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        sku: product.sku,
        url: productUrl,
        image: absoluteGallery,
        description: product.description,
        material: product.material,
        category: product.group,
        brand: { "@type": "Brand", name: "BÜCÜRÜKTOYS" },
        audience: { "@type": "BusinessAudience", audienceType: "Toptan 3D baskı alıcıları" },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "TRY",
          price: product.baseUnitPrice,
          availability: "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
          businessFunction: "https://purl.org/goodrelations/v1#Sell",
          seller: { "@type": "Organization", name: "BÜCÜRÜKTOYS", url: SITE_URL },
          eligibleQuantity: { "@type": "QuantitativeValue", minValue: product.minOrderQuantity, unitCode: "C62" },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: product.baseUnitPrice,
            priceCurrency: "TRY",
            unitCode: "C62",
            valueAddedTaxIncluded: false,
            description: "KDV hariç tahmini başlangıç birim fiyatı; kesin fiyat üretim onayıyla belirlenir.",
          },
        },
        additionalProperty: technicalDetails.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "3D Baskı", item: `${SITE_URL}/3d-baski` },
          { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return <main className="print-page print-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <SiteHeader />

    <section className="print-detail-hero">
      <PrintProductGallery images={galleryImages} sku={product.sku} popularityRank={product.popularityRank} />
      <div className="print-detail-copy">
        <a className="print-detail-crumb" href="/3d-baski">Ana sayfa / 3D Baskı / {product.sku}</a>
        <span className="print-kicker">Sipariş üzerine üretim · Toptan</span>
        <h1>{product.name}</h1>
        <p className="print-detail-lead">{product.details}</p>
        <p>{product.description}</p>
        <div className="print-detail-highlight">
          <div><span>Tahmini baskı</span><strong>{formatPrintTime(product.productionMinutesMin)}–{formatPrintTime(product.productionMinutesMax)}</strong></div>
          <div><span>Minimum sipariş</span><strong>{product.minOrderQuantity} adet</strong></div>
          <div><span>Başlangıç birim fiyatı</span><strong>{money(product.baseUnitPrice)} ₺</strong><small>KDV hariç</small></div>
          <div><span>Malzeme</span><strong>{product.material}</strong></div>
        </div>
        <p className="print-market-signal"><strong>Neden Viral 30’da?</strong>{product.marketSignal}</p>
        <div className="print-detail-actions"><a href={`https://wa.me/${WHATSAPP}?text=${message}`} target="_blank" rel="noreferrer">WhatsApp’tan teklif al ↗</a><a href="/3d-baski#ozel-talep">Dosyalı talep oluştur</a></div>
      </div>
    </section>

    <section className="print-detail-specs">
      <header><span className="print-kicker">Üretim föyü</span><h2>Teknik detayların tamamı.</h2></header>
      <dl>{technicalDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>

    <section className="print-tier-section">
      <header><span className="print-kicker">Adet bazlı tahmin</span><h2>Toptan miktar arttıkça birim maliyet düşer.</h2><p>Bu hesap standart ölçü ve mevcut teknik föye dayanır; KDV dahil değildir. Kesin fiyat numune, renk, ambalaj ve üretim planı onayından sonra verilir.</p></header>
      <div>{quantities.map((quantity) => {
        const estimate = calculatePrintPrice(product.baseUnitPrice, quantity);
        return <article key={quantity}><span>{quantity} adet</span><strong>{money(estimate.unitPrice)} ₺<small>/ adet</small></strong><p>Toplam {money(estimate.total)} ₺</p>{estimate.discount > 0 && <b>%{Math.round(estimate.discount * 100)} adet avantajı</b>}</article>;
      })}</div>
    </section>

    <section className="print-detail-process">
      <div><b>01</b><strong>Üretilebilirlik kontrolü</strong><span>Ölçü, renk, lisans ve baskı parametreleri teyit edilir.</span></div>
      <div><b>02</b><strong>Numune onayı</strong><span>Gerekli projelerde seri üretim öncesi numune hazırlanır.</span></div>
      <div><b>03</b><strong>Seri üretim</strong><span>Onaylanan föy ve kalite standardıyla üretim planlanır.</span></div>
    </section>

    {related.length > 0 && <section className="print-related">
      <header><span className="print-kicker">Aynı ürün grubundan</span><h2>Benzer 3D baskı ürünleri.</h2></header>
      <div>{related.map((item) => <a href={`/3d-baski/${item.sku.toLowerCase()}`} key={item.id}><img src={printProductImage(item)} srcSet={printProductSrcSet(item)} sizes="(max-width: 560px) calc(50vw - 24px), (max-width: 1120px) calc(50vw - 32px), 330px" alt={`${item.name} 3D baskı ürün görseli`} width="1536" height="1024" loading="lazy" /><span><small>{item.sku}</small><strong>{item.name}</strong><em>{formatPrintTime(item.productionMinutesMin)}–{formatPrintTime(item.productionMinutesMax)}</em></span></a>)}</div>
    </section>}

    <footer className="print-footer"><img src="/assets/bucuruktoys-logo-reversed.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" /><p>Toptan oyuncak · 3D baskı · özel üretim</p><div><a href={`tel:+${WHATSAPP}`}>0539 346 85 27</a><a href="/3d-baski">Viral 30</a><a href="/">Ana katalog</a></div></footer>
    <DeveloperContact />
  </main>;
}
