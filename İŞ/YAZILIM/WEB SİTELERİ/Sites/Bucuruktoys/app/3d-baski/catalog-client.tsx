"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { privacyControllerReady } from "../../lib/business-info";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";
import {
  calculatePrintPrice,
  formatPrintTime,
  printProductImage,
  printProductSrcSet,
  seedPrintProducts,
  type PrintProduct,
} from "../../lib/print-products";

const WHATSAPP = "905393468527";
const SITE_URL = "https://www.bucuruktoys.com";

function money(value: number) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ProductCard({
  product,
  onSelect,
  editorial = false,
  priority = false,
}: {
  product: PrintProduct;
  onSelect: (_product: PrintProduct, _quantity: number) => void;
  editorial?: boolean;
  priority?: boolean;
}) {
  const [quantity, setQuantity] = useState(Math.max(product.minOrderQuantity, 10));
  const estimate = calculatePrintPrice(product.baseUnitPrice, quantity);
  const colorOptions = product.colorOptions.split(/[,;]/).map((item) => item.trim()).filter(Boolean).slice(0, 4);

  return (
    <article
      className={`print-product-card${editorial ? " editorial" : ""}`}
      data-sku={product.sku}
      id={`urun-${product.id}`}
    >
      <figure className="print-product-media">
        <a className="print-product-media-link" href={`/3d-baski/${product.sku.toLowerCase()}`} aria-label={`${product.name} ürün detayını aç`}>
        <img
          src={printProductImage(product)}
          srcSet={printProductSrcSet(product)}
          sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1120px) calc(50vw - 38px), 440px"
          alt={`${product.name} için hazırlanmış 3D baskı ürün görseli`}
          width="1536"
          height="1024"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        </a>
        <span className="product-sku">{product.sku}</span>
        <b className="product-rank">Piyasa #{product.popularityRank}</b>
        <figcaption>Ürünü temsil eden katalog görseli</figcaption>
      </figure>

      <div className="print-product-body">
        <div className="product-heading">
          <div className="print-tags">
            <span>Viral güç {product.viralStrength}/5</span>
            <span>Makine uyumu {product.machineFit}</span>
            {product.isFeatured && <span className="featured-tag">Editör seçimi</span>}
          </div>
          <h3><a href={`/3d-baski/${product.sku.toLowerCase()}`}>{product.name}</a></h3>
          <p className="product-lead">{product.details}</p>
          <p className="product-description">{product.description}</p>
        </div>

        <dl className="product-quick-specs">
          <div><dt>Tahmini baskı</dt><dd>{formatPrintTime(product.productionMinutesMin)}–{formatPrintTime(product.productionMinutesMax)}</dd></div>
          <div><dt>Standart ölçü</dt><dd>{product.standardDimensions}</dd></div>
          <div><dt>Yaklaşık ağırlık</dt><dd>{product.approximateWeight}</dd></div>
          <div><dt>Malzeme</dt><dd>{product.material}</dd></div>
        </dl>

        <div className="variant-row" aria-label="Öne çıkan renk ve varyant seçenekleri">
          <strong>Varyantlar</strong>
          <div>{colorOptions.map((option) => <span key={option}>{option}</span>)}</div>
        </div>

        <a className="print-product-detail-link" href={`/3d-baski/${product.sku.toLowerCase()}`}>17 alanlı teknik föyü aç <span aria-hidden="true">→</span></a>

        <div className="ordering-panel">
          <label className="quantity-field">
            <span>Adet</span>
            <input
              type="number"
              min={product.minOrderQuantity}
              max="100000"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(product.minOrderQuantity, Math.floor(Number(event.target.value) || product.minOrderQuantity)))}
              aria-label={`${product.name} sipariş adedi`}
            />
            <small>Minimum {product.minOrderQuantity}</small>
          </label>
          <div className="price-estimate">
            <div><span>{quantity} adet için tahmini toplam</span><strong>{money(estimate.total)} ₺</strong></div>
            <small>{money(estimate.unitPrice)} ₺ / adet · KDV hariç{estimate.discount > 0 ? ` · %${Math.round(estimate.discount * 100)} adet avantajı` : ""}</small>
          </div>
          <button type="button" onClick={() => onSelect(product, quantity)}>Bu ürün için talep oluştur <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>
  );
}

function FeaturedProduct({ product, onSelect, priority = false }: { product: PrintProduct; onSelect: (_product: PrintProduct, _quantity: number) => void; priority?: boolean }) {
  const quantity = Math.max(product.minOrderQuantity, 10);
  return <article className="featured-product-summary">
    <a className="featured-product-media" href={`/3d-baski/${product.sku.toLowerCase()}`}>
      <img src={printProductImage(product)} srcSet={printProductSrcSet(product)} sizes="(max-width: 760px) calc(100vw - 32px), 430px" alt={`${product.name} 3D baskı ürün görseli`} width="1536" height="1024" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
      <span>Viral 30 · #{product.popularityRank}</span>
    </a>
    <div>
      <small>{product.sku} · Siparişe açık</small>
      <h3><a href={`/3d-baski/${product.sku.toLowerCase()}`}>{product.name}</a></h3>
      <p>{product.details}</p>
      <dl><div><dt>Baskı</dt><dd>{formatPrintTime(product.productionMinutesMin)}–{formatPrintTime(product.productionMinutesMax)}</dd></div><div><dt>Minimum</dt><dd>{product.minOrderQuantity} adet</dd></div><div><dt>Malzeme</dt><dd>{product.material}</dd></div></dl>
      <div className="featured-product-actions"><a href={`/3d-baski/${product.sku.toLowerCase()}`}>Ürün sayfası</a><button type="button" onClick={() => onSelect(product, quantity)}>Talep oluştur</button></div>
    </div>
  </article>;
}

export default function ActivePrintPage() {
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<{ product: PrintProduct; quantity: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch("/api/print-products", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { products?: PrintProduct[] }) => {
        if (Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => undefined);
  }, []);

  const orderedProducts = useMemo(
    () => [...products].sort((a, b) => (a.popularityRank ?? 99) - (b.popularityRank ?? 99)),
    [products],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    return orderedProducts.filter((product) =>
      (group === "all" || product.group === group) &&
      (!term || `${product.name} ${product.sku} ${product.details} ${product.description} ${product.material} ${product.usageAreas}`.toLocaleLowerCase("tr-TR").includes(term)),
    );
  }, [orderedProducts, query, group]);
  const featured = useMemo(() => orderedProducts.slice(0, 3), [orderedProducts]);
  const availableGroups = useMemo(() => Array.from(new Set(orderedProducts.map((product) => product.group))), [orderedProducts]);
  const heroProducts = useMemo(() => orderedProducts.slice(0, 3), [orderedProducts]);
  const researchCount = Math.max(0, seedPrintProducts.length - orderedProducts.length);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "3D Baskı", item: `${SITE_URL}/3d-baski` },
        ],
      },
      {
        "@type": "ItemList",
        name: "BÜCÜRÜKTOYS 2026 Toptan 3D Baskı Ana Kataloğu",
        description: "Piyasa popülerliği ve seri üretim uygunluğuna göre seçilmiş 30 aktif 3D baskı ürünü.",
        numberOfItems: orderedProducts.length,
        itemListElement: orderedProducts.map((product, index) => {
          const productUrl = `${SITE_URL}/3d-baski/${product.sku.toLowerCase()}`;
          return {
            "@type": "ListItem",
            position: index + 1,
            url: productUrl,
            item: {
              "@type": "Product",
              "@id": `${productUrl}#product`,
              name: product.name,
              sku: product.sku,
              url: productUrl,
              description: product.description,
              image: `${SITE_URL}${printProductImage(product)}`,
              material: product.material,
              brand: { "@type": "Brand", name: "BÜCÜRÜKTOYS" },
              offers: {
                "@type": "Offer",
                priceCurrency: "TRY",
                price: product.baseUnitPrice,
                availability: "https://schema.org/PreOrder",
                itemCondition: "https://schema.org/NewCondition",
                businessFunction: "https://purl.org/goodrelations/v1#Sell",
                eligibleQuantity: {
                  "@type": "QuantitativeValue",
                  minValue: product.minOrderQuantity,
                  unitCode: "C62",
                },
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: product.baseUnitPrice,
                  priceCurrency: "TRY",
                  unitCode: "C62",
                  valueAddedTaxIncluded: false,
                  description: "KDV hariç tahmini başlangıç birim fiyatı; kesin B2B teklif adet, renk, ölçü, malzeme ve paketlemeye göre onaylanır.",
                },
                seller: {
                  "@type": "Organization",
                  name: "BÜCÜRÜKTOYS",
                },
                url: productUrl,
              },
            },
          };
        }),
      },
    ],
  }), [orderedProducts]);

  function selectProduct(product: PrintProduct, quantity: number) {
    setSelected({ product, quantity });
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError(false);
    const form = new FormData(event.currentTarget);
    form.set("consent", form.get("consent") === "on" ? "true" : "false");
    if (selected) {
      const estimate = calculatePrintPrice(selected.product.baseUnitPrice, Number(form.get("quantity")) || selected.quantity);
      form.set("selectedSku", selected.product.sku);
      form.set("selectedProductName", selected.product.name);
      form.set("estimatedPrice", String(estimate.total));
    }
    if (!privacyControllerReady) {
      const text = encodeURIComponent(`Merhaba BÜCÜRÜKTOYS, 3D baskı talebim var. Model: ${form.get("modelName")}; Adet: ${form.get("quantity")}; İsim: ${form.get("customerName")}. Dosyalarımı bu görüşmede paylaşacağım.`);
      window.location.href = `https://wa.me/${WHATSAPP}?text=${text}`;
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/print-requests", { method: "POST", body: form });
      const data = await response.json() as { error?: string; stored?: boolean; reference?: string; uploadWarning?: boolean };
      if (!response.ok) throw new Error(data.error || "Talep gönderilemedi.");
      if (data.stored) {
        setMessage(`${data.reference ? `${data.reference} numaralı ` : ""}talebiniz kaydedildi.${data.uploadWarning ? " Dosyalar alınamadı; lütfen WhatsApp üzerinden ekleyin." : " Üretim uygunluğu için sizinle iletişime geçeceğiz."}`);
        event.currentTarget.reset();
        setSelected(null);
      } else {
        const text = encodeURIComponent(`Merhaba BÜCÜRÜKTOYS, 3D baskı talebim var. Model: ${form.get("modelName")}; Adet: ${form.get("quantity")}; İsim: ${form.get("customerName")}. Dosyalarımı bu görüşmede paylaşacağım.`);
        window.location.href = `https://wa.me/${WHATSAPP}?text=${text}`;
      }
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : "Talep gönderilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="print-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

    <SiteHeader />

    <section className="print-hero">
      <div className="print-hero-copy">
        <span className="print-kicker">Viral 30 · toptan 3D baskı ana kataloğu</span>
        <h1>Modeli gör.<br />Detayı incele.<br /><em>Adedi fiyatla.</em></h1>
        <p>Piyasa görünürlüğü, üretim tekrarlanabilirliği ve toptan satış gücüne göre seçilmiş ürünler. Her biri kendi görseli, üretim föyü, varyantları ve adet bazlı tahmini fiyatıyla sunulur.</p>
        <div className="print-hero-actions"><a href="#urunler">Kataloğu keşfet</a><a className="secondary" href="#ozel-talep">Kendi modelini gönder</a></div>
        <div className="print-trust"><span><strong>{orderedProducts.length}</strong> satışa hazır ana ürün</span><span><strong>{seedPrintProducts.length}</strong> toplam model havuzu</span><span><strong>17+</strong> teknik veri alanı</span></div>
      </div>
      <div className="print-hero-visual" aria-label="Katalogdan öne çıkan 3D baskı ürünleri">
        {heroProducts[0] && <img className="hero-image-main" src={printProductImage(heroProducts[0])} srcSet={printProductSrcSet(heroProducts[0])} sizes="(max-width: 820px) 90vw, 48vw" alt={heroProducts[0].name} width="1536" height="1024" />}
        {heroProducts[1] && <img className="hero-image-small one" src={printProductImage(heroProducts[1])} srcSet={printProductSrcSet(heroProducts[1])} sizes="(max-width: 820px) 38vw, 20vw" alt={heroProducts[1].name} width="1536" height="1024" />}
        {heroProducts[2] && <img className="hero-image-small two" src={printProductImage(heroProducts[2])} srcSet={printProductSrcSet(heroProducts[2])} sizes="(max-width: 820px) 38vw, 20vw" alt={heroProducts[2].name} width="1536" height="1024" />}
        <span>{orderedProducts.length} ürüne özel görseller</span>
      </div>
    </section>

    <section className="catalog-ribbon" aria-label="3D baskı görsel katalog indeksi">
      <div className="ribbon-intro"><span>2026</span><strong>3D Katalog</strong><small>Görsel ürün indeksi</small></div>
      <div className="ribbon-products">
        {orderedProducts.map((product) => <a href={`/3d-baski/${product.sku.toLowerCase()}`} key={product.id} title={`${product.name} ürün sayfası`}>
          <img src={printProductImage(product, 320)} alt={`${product.name} 3D baskı katalog görseli`} width="320" height="213" loading="lazy" />
          <span>#{product.popularityRank}</span>
          <strong>{product.name}</strong>
        </a>)}
      </div>
    </section>

    <section className="print-flow">
      <div><b>01</b><strong>Ürünü veya fikri seç</strong><span>Katalogdan hazır modeli seç ya da kendi dosyanı yükle.</span></div>
      <div><b>02</b><strong>Adet ve varyantı belirle</strong><span>Renk, ölçü, malzeme ve paketleme seçeneklerini netleştir.</span></div>
      <div><b>03</b><strong>Numune ve üretim onayı</strong><span>Kesin süre, fiyat ve kalite kontrolünden sonra seri üretim başlar.</span></div>
    </section>

    <section className="selection-method" id="teknik-standart" aria-labelledby="selection-title">
      <div><span className="print-kicker">Katalog standardımız</span><h2 id="selection-title">Güzel görünmek başlangıç. Üretilebilir olmak şart.</h2></div>
      <div className="selection-criteria">
        <article><b>01</b><strong>Piyasa görünürlüğü</strong><p>Pazar yeri ilgisi, model platformu trendleri ve sosyal medyada anlatılabilirlik birlikte değerlendirildi; aynı ürün ailesi ikinci kez eklenmedi.</p></article>
        <article><b>02</b><strong>Seri üretim uyumu</strong><p>Baskı süresi, destek, fire riski, montaj yükü ve aynı tablaya çoklu yerleşim kontrol edildi.</p></article>
        <article><b>03</b><strong>Toptan satış değeri</strong><p>Varyant, kişiselleştirme, paketleme ve tekrar sipariş potansiyeli önceliklendirildi.</p></article>
      </div>
    </section>

    <section className="featured-print" aria-labelledby="featured-title">
      <header><div><span className="print-kicker">Koleksiyonun ilk üçü</span><h2 id="featured-title">Vitrini taşıyan modeller.</h2></div><p>2026 başlangıç kataloğunda görünürlük, hediye değeri ve varyant potansiyelini en güçlü biçimde birleştiren üç ürün.</p></header>
      <div className="featured-grid">{featured.map((product, index) => <FeaturedProduct key={product.id} product={product} onSelect={selectProduct} priority={index === 0} />)}</div>
    </section>

    <section className="all-print-products" id="urunler" aria-labelledby="all-products-title">
      <header><div><span className="print-kicker">Aktif ana katalog</span><h2 id="all-products-title">{orderedProducts.length ? `${orderedProducts.length} ürün siparişe açık.` : "Henüz yayında ürün yok."}</h2></div><span>{filtered.length} / {orderedProducts.length} ürün gösteriliyor</span></header>
      <div className="print-filters">
        <label><span>Ürün ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ejderha, kapibara, clicker, anahtarlık…" /></label>
        <label><span>Ürün grubu</span><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="all">Tüm aktif ürün grupları</option>{availableGroups.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
      </div>
      <div className="print-catalog-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onSelect={selectProduct} />)}</div>
      {!filtered.length && <div className="print-empty">Aramana uygun ürün bulunamadı. Kendi modelin için özel talep oluşturabilirsin.</div>}
    </section>

    <section className="catalog-future">
      <span className="print-kicker">Sıradaki koleksiyonlar</span>
      <h2>{researchCount} model daha aynı kalite standardına hazırlanıyor.</h2>
      <p>Dekor, koleksiyon, sezon, eğitim, masaüstü ve kişiselleştirme gruplarındaki AR‑GE ürünleri; doğru görsel, net teknik föy ve üretim doğrulaması tamamlandıkça aktif kataloğa alınacak.</p>
      <div><span>Şimdi</span><strong>{orderedProducts.length} ana ürün</strong><i aria-hidden="true">→</i><span>AR‑GE</span><strong>{researchCount} model</strong></div>
    </section>

    <section className="custom-order" id="ozel-talep">
      <div className="custom-copy"><span className="print-kicker">Özel tasarım & toptan sipariş</span><h2>Dosyanı yükle,<br />üretilebilir hâle getirelim.</h2><p>STL/3MF/OBJ modelini, çizimini veya referans görselini gönder. Dosyan yoksa fikrini tarif et; tasarım ve üretim uygunluğu birlikte değerlendirilir.</p><ul><li>Ürün, promosyon, maskot ve anahtarlık tasarımı</li><li>Numune sonrası küçük veya orta seri üretim</li><li>Renk, boyut, malzeme ve ambalaj planlaması</li><li>Ticari lisans ve üretilebilirlik kontrolü</li></ul><a className="whatsapp-direct" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Merhaba BÜCÜRÜKTOYS, özel 3D baskı siparişi hakkında görüşmek istiyorum.")}`} target="_blank" rel="noreferrer">WhatsApp’tan hızlıca görüş ↗</a></div>
      <form ref={formRef} className="print-request-form" onSubmit={submit} encType="multipart/form-data">
        <div className="selected-product">{selected ? <><img src={printProductImage(selected.product, 320)} alt={`${selected.product.name} seçilen ürün görseli`} width="320" height="213" /><span><small>Seçilen katalog ürünü</small><strong>{selected.product.name}</strong><button type="button" onClick={() => setSelected(null)}>Seçimi kaldır</button></span></> : <><span><small>Özel model</small><strong>Kendi tasarımını veya görselini yükle</strong></span></>}</div>
        <h3>Üretim talebi</h3><p>Kesin fiyat ve teslim süresi dosya incelemesinden sonra onaylanır.</p>
        <div className="print-form-grid">
          <label>Ad soyad<input name="customerName" required /></label><label>Firma<input name="companyName" /></label>
          <label>Telefon<input name="phone" type="tel" required placeholder="05xx xxx xx xx" /></label><label>E-posta<input name="email" type="email" /></label>
          <label className="wide">Model / ürün adı<input name="modelName" required defaultValue={selected?.product.name ?? ""} key={selected?.product.id ?? "custom"} placeholder="Örn. 8 cm maskot anahtarlık" /></label>
          <label>Adet<input name="quantity" type="number" min={selected?.product.minOrderQuantity ?? 1} max="100000" defaultValue={selected?.quantity ?? 100} key={`quantity-${selected?.product.id ?? "custom"}`} required /></label>
          <label>Malzeme<select name="material" defaultValue={selected?.product.material ?? "Karar verilecek"}><option>Karar verilecek</option><option>PLA</option><option>PETG</option><option>TPU</option><option>PLA / PETG — ürüne göre</option></select></label>
          <label>Renk<input name="color" placeholder="Tek renk / karışık / marka renkleri" /></label><label>Ölçüler<input name="dimensions" placeholder="En × boy × yükseklik" /></label>
          <label className="wide upload-field"><span>Tasarım / model / referans dosyaları</span><input name="files" type="file" multiple accept=".stl,.3mf,.obj,.zip,.pdf,image/jpeg,image/png,image/webp" /><small>En fazla 3 dosya; STL, 3MF, OBJ, ZIP, PDF, JPG, PNG veya WebP. Toplam en fazla 25 MB.</small></label>
          <label className="wide">Dosya bağlantısı<input name="modelUrl" type="url" placeholder="İstersen Drive, WeTransfer veya model bağlantısı" /></label>
          <label className="wide">Açıklama<textarea name="note" rows={4} placeholder="Kullanım amacı, teslim tarihi, yüzey beklentisi, ambalaj…" /></label>
          <label className="trap">Web sitesi<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        {!privacyControllerReady && <p className="print-privacy-note">Resmî veri sorumlusu bilgileri tamamlanana kadar bu form sitede kayıt oluşturmaz; talep WhatsApp görüşmesine aktarılır ve dosyalar görüşme içinde paylaşılır.</p>}
        <label className="print-consent">
          <span className="print-checkbox">
            <input type="checkbox" name="consent" required />
            <i aria-hidden="true" />
          </span>
          <span><a href="/gizlilik" target="_blank">Veri kullanımı bilgilendirmesini</a> okudum ve WhatsApp üzerinden iletişim kurulmasını kabul ediyorum.</span>
        </label>
        {message && <p className={`print-result ${error ? "error" : ""}`}>{message}</p>}
        <button className="submit-request" disabled={busy}>{busy ? "Talep gönderiliyor…" : "Talebi ve dosyaları gönder"}</button>
      </form>
    </section>

    <section className="print-note"><strong>Fiyatlandırma ve vergi notu</strong><p>Sayfadaki tüm fiyatlara KDV dahil değildir. Fiyatlar standart boyut, belirtilen malzeme ve tahmini üretim varsayımıyla hesaplanır. Boyut, doluluk, destek, çok renk, montaj, aksesuar, lisans ve ambalaj kesin teklifi değiştirebilir. Katalog görselleri ürün tipini ve önerilen varyantı temsil eder; kesin renk ve model numune onayında netleşir.</p></section>
    <footer className="print-footer"><img src="/assets/bucuruktoys-logo-reversed.svg" alt="BÜCÜRÜKTOYS" /><p>Toptan oyuncak · 3D baskı · özel üretim</p><div><a href={`tel:+${WHATSAPP}`}>0539 346 85 27</a><a href="/gizlilik">Gizlilik</a><a href="/">Ana katalog</a></div></footer>
    <DeveloperContact />
  </main>;
}
