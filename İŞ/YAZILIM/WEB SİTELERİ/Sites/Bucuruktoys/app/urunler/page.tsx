"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OFFER_STORAGE_KEY } from "../../lib/offer-storage";
import { productImageDimensions, publicImageUrl, publicSeedProducts, type CatalogProduct } from "../../lib/products";
import DeveloperContact from "../components/developer-contact";
import SiteHeader from "../components/site-header";

type CategoryId =
  | "all"
  | "outdoor"
  | "fun"
  | "skill"
  | "sensory"
  | "stationery"
  | "accessory"
  | "3d";

type Product = CatalogProduct;

type OfferState = Record<number, number>;
type OfferContact = { customerName: string; companyName: string; phone: string; note: string };
type SortId = "featured" | "az" | "za";

const categories: { id: CategoryId; name: string; short: string; color: string }[] = [
  { id: "all", name: "Tüm Ürünler", short: "Tümü", color: "#17352d" },
  { id: "outdoor", name: "Dış Mekân", short: "Dış Mekân", color: "#c63f35" },
  { id: "fun", name: "Şaka & Eğlence", short: "Eğlence", color: "#f2b84b" },
  { id: "skill", name: "Zekâ & Beceri", short: "Zekâ", color: "#5a78d1" },
  { id: "sensory", name: "Stres & Duyusal", short: "Duyusal", color: "#62a88f" },
  { id: "stationery", name: "Kırtasiye & Sticker", short: "Kırtasiye", color: "#d66ca5" },
  { id: "accessory", name: "Anahtarlık & Aksesuar", short: "Aksesuar", color: "#7e6db1" },
];


const products: Product[] = publicSeedProducts;

const categoryImages: Record<Exclude<CategoryId, "all">, string> = {
  outdoor: "IMG-20260718-WA0006.webp",
  fun: "IMG-20260718-WA0021.webp",
  skill: "IMG-20260718-WA0065.webp",
  sensory: "IMG-20260718-WA0035.webp",
  stationery: "IMG-20260718-WA0038.webp",
  accessory: "IMG-20260718-WA0052.webp",
  "3d": "IMG-20260718-WA0065.webp",
};


const imageDimensions = productImageDimensions;

const siteUrl = "https://www.bucuruktoys.com";
const productImage = (image: string, size?: 320 | 540) => publicImageUrl(image, size);
const productCode = (product: Product) => product.sku;
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "BÜCÜRÜKTOYS",
  url: siteUrl,
  logo: { "@type": "ImageObject", url: `${siteUrl}/assets/bucuruktoys-touch-icon.png`, width: 512, height: 512 },
  image: `${siteUrl}/assets/bucuruktoys-og-card.png`,
  description: "Mağaza, kırtasiye, e-ticaret ve kurumsal alıcılar için paketli toptan oyuncak kataloğu; WhatsApp üzerinden teklif ve Türkiye geneli teslimat hizmeti.",
  telephone: "+90 539 346 85 27",
  areaServed: { "@type": "Country", name: "Türkiye" },
  knowsAbout: ["Toptan oyuncak", "Paketli oyuncak", "Kırtasiye oyuncakları", "Duyusal oyuncaklar", "Oyuncak aksesuarları", "WhatsApp teklif listesi"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    "@id": `${siteUrl}/#catalog`,
    name: "BÜCÜRÜKTOYS Toptan Oyuncak Kataloğu",
    url: `${siteUrl}/urunler#products`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90 539 346 85 27",
    contactType: "sales",
    areaServed: "TR",
    availableLanguage: "Turkish",
  },
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "BÜCÜRÜKTOYS",
  description: "Toptan oyuncak ürünleri, stok kodları, talep adetleri, WhatsApp teklif listesi ve Türkiye geneli teslimat.",
  inLanguage: "tr-TR",
  publisher: { "@id": `${siteUrl}/#organization` },
};
const buildCatalogSchema = (catalogProducts: Product[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${siteUrl}/urunler#catalog`,
  name: "BÜCÜRÜKTOYS Toptan Oyuncak Kataloğu",
  numberOfItems: catalogProducts.length,
  itemListElement: catalogProducts.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: `${siteUrl}/urun/${productCode(product).toLowerCase()}`,
  })),
});

function Icon({ name }: { name: "search" | "bag" | "arrow" | "plus" | "minus" | "close" | "menu" | "phone" | "check" | "copy" | "cube" | "share" }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    phone: <path d="M6.5 3.5 10 7l-2 3a16 16 0 0 0 6 6l3-2 3.5 3.5-2 3c-.6.9-1.8 1.3-2.8.9C8.8 19 5 15.2 2.6 8.3c-.4-1 .1-2.2 1-2.8l2.9-2Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5" /></>,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(products);
  const [category, setCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");
  const [offer, setOffer] = useState<OfferState>({});
  const [offerReady, setOfferReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preview, setPreview] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharedId, setSharedId] = useState<number | null>(null);
  const [offerContact, setOfferContact] = useState<OfferContact>({ customerName: "", companyName: "", phone: "", note: "" });
  const sessionIdRef = useRef("");
  const drawerRef = useRef<HTMLElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerTriggerRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewCloseRef = useRef<HTMLButtonElement>(null);
  const previewTriggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    const result = catalogProducts.filter((product) => {
      const inCategory = category === "all" || product.category === category;
      const inSearch = !term || `${product.name} ${product.sku} ${product.pack} ${product.note ?? ""}`.toLocaleLowerCase("tr-TR").includes(term);
      return inCategory && inSearch;
    });
    if (sort === "az") return [...result].sort((a, b) => a.name.localeCompare(b.name, "tr"));
    if (sort === "za") return [...result].sort((a, b) => b.name.localeCompare(a.name, "tr"));
    return result;
  }, [catalogProducts, category, query, sort]);

  const selectedProducts = catalogProducts.filter((product) => (offer[product.id] ?? 0) > 0);
  const totalRequestedQuantity = selectedProducts.reduce((total, product) => total + offer[product.id], 0);
  const contactText = [offerContact.companyName && `Firma: ${offerContact.companyName}`, offerContact.customerName && `Yetkili: ${offerContact.customerName}`, offerContact.phone && `Telefon: ${offerContact.phone}`, offerContact.note && `Not: ${offerContact.note}`].filter(Boolean).join("\n");
  const offerText = `Merhaba BÜCÜRÜKTOYS,\n\n*TOPTAN TEKLİF TALEBİ*${contactText ? `\n\n*Müşteri bilgileri*\n${contactText}` : ""}\n\n*Ürün listesi*\n${selectedProducts
    .map((product, index) => `*${index + 1}. ${product.name}*\n• Stok kodu: ${productCode(product)}\n• Talep adedi: *${offer[product.id]} adet*\n• Paket / koli: ${product.pack}`)
    .join("\n\n")}\n\n*Özet:* ${selectedProducts.length} ürün çeşidi · ${totalRequestedQuantity} adet\n\nGüncel toptan fiyat, stok ve teslimat bilgisini paylaşabilir misiniz?`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(OFFER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OfferState;
        const validOffer = Object.fromEntries(
          Object.entries(parsed).filter(([id, quantity]) =>
            catalogProducts.some((product) => product.id === Number(id)) &&
            Number.isInteger(quantity) && quantity >= 1 && quantity <= 100000
          )
        ) as OfferState;
        setOffer(validOffer);
      }
    } catch {
      window.localStorage.removeItem(OFFER_STORAGE_KEY);
    } finally {
      setOfferReady(true);
    }
  }, [catalogProducts]);

  useEffect(() => {
    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { products?: Product[] }) => {
        if (active && Array.isArray(data.products) && data.products.length > 0) setCatalogProducts(data.products);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (offerReady) window.localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(offer));
  }, [offer, offerReady]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("teklif") === "ac") setDrawerOpen(true);
    const initialSearch = params.get("arama")?.trim();
    if (initialSearch) setQuery(initialSearch);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (preview) closePreview();
        else if (drawerOpen) closeDrawer();
        return;
      }
      if (event.key === "Tab") {
        const activeDialog = preview ? previewRef.current : drawerOpen ? drawerRef.current : null;
        if (!activeDialog) return;
        const focusable = Array.from(activeDialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !activeDialog.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !activeDialog.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, preview]);

  useEffect(() => {
    if (!drawerOpen) return;
    const frame = window.requestAnimationFrame(() => drawerCloseRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [drawerOpen]);

  useEffect(() => {
    if (!preview) return;
    const frame = window.requestAnimationFrame(() => previewCloseRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [preview]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || preview ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, preview]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const timeout = window.setTimeout(() => track("catalog_search", undefined, { term }), 800);
    return () => window.clearTimeout(timeout);
  }, [query]);

  function track(eventType: string, product?: Product, metadata?: Record<string, string>) {
    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = window.localStorage.getItem("bucuruktoys-session") || crypto.randomUUID();
        window.localStorage.setItem("bucuruktoys-session", sessionIdRef.current);
      }
      void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ eventType, productId: product?.id, sku: product ? productCode(product) : undefined, sessionId: sessionIdRef.current, metadata }) }).catch(() => undefined);
    } catch {
      // Analitik katalog kullanımını etkilemez.
    }
  }

  function toggleOffer(id: number) {
    setOffer((current) => {
      if (current[id]) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      const addedProduct = catalogProducts.find((product) => product.id === id);
      if (addedProduct) track("offer_add", addedProduct);
      return { ...current, [id]: 1 };
    });
  }

  function changeQuantity(id: number, change: number) {
    setOffer((current) => {
      const currentQuantity = current[id] ?? 1;
      const nextQuantity = change < 0 && currentQuantity <= 1 ? 0 : Math.max(1, Math.min(100000, currentQuantity + change));
      const next = { ...current };
      if (nextQuantity === 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  }

  function setQuantity(id: number, value: string) {
    const quantity = Math.max(1, Math.min(100000, Math.floor(Number(value) || 1)));
    setOffer((current) => ({ ...current, [id]: quantity }));
  }

  async function copyOffer() {
    await navigator.clipboard.writeText(offerText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareProduct(product: Product) {
    const url = `${window.location.origin}/urun/${productCode(product).toLowerCase()}`;
    try {
      if (navigator.share) await navigator.share({ title: `${product.name} | BÜCÜRÜKTOYS`, text: `${product.name} — ${product.pack}`, url });
      else await navigator.clipboard.writeText(url);
      track("product_share", product);
      setSharedId(product.id);
      window.setTimeout(() => setSharedId(null), 1800);
    } catch {
      // Paylaşım penceresi kullanıcı tarafından kapatılmış olabilir.
    }
  }

  function chooseCategory(id: CategoryId) {
    setCategory(id);
    setQuery("");
    if (id !== "all") track("category_filter", undefined, { category: id });
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openDrawer() {
    drawerTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => drawerTriggerRef.current?.focus());
  }

  function openPreview(product: Product) {
    previewTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPreview(product);
    setPreviewImage(product.image);
    track("product_view", product);
  }

  function closePreview() {
    setPreview(null);
    window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
  }

  function sendOffer() {
    track("whatsapp_click", undefined, { items: String(selectedProducts.length), total_quantity: String(totalRequestedQuantity) });
    window.open(`https://wa.me/905393468527?text=${encodeURIComponent(offerText)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCatalogSchema(catalogProducts)).replace(/</g, "\\u003c") }} />
      <a className="skip-link" href="#products">Ürün kataloğuna geç</a>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{selectedProducts.length ? `Teklif listenizde ${selectedProducts.length} ürün çeşidi ve toplam ${totalRequestedQuantity} adet var.` : "Teklif listeniz boş."}</p>
      <SiteHeader action={<button className="offer-button" onClick={openDrawer} aria-label={`Teklif listesi, ${selectedProducts.length} ürün`} aria-controls="offer-drawer" aria-expanded={drawerOpen}><Icon name="bag" /><span>Teklif Listem</span><b>{selectedProducts.length}</b></button>} />

      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Yeni sezon toptan seçki</p>
            <h1>Raflarda dikkat çeken <em>oyuncaklar.</em></h1>
            <p className="hero-text">Paketli toptan ürünleri inceleyin, istediğiniz adetleri girin ve stok kodlarıyla hazırlanan listeniz üzerinden WhatsApp&apos;tan teklif alın.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#products">Kataloğu İncele <Icon name="arrow" /></a>
              <a className="text-button" href="/toptan-satis">Nasıl çalışır?</a>
            </div>
            <div className="hero-stats" aria-label="Katalog bilgileri">
              <div><strong>{catalogProducts.length}</strong><span>Seçili ürün</span></div>
              <div><strong>6+</strong><span>Ürün grubu</span></div>
              <div><strong>%100</strong><span>Toptan odaklı</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Öne çıkan ürünler">
            <div className="hero-blob" />
            <div className="product-shot shot-main"><img src="/media/products/IMG-20260718-WA0006.webp" alt="Küçük su tabancası" width="900" height="1200" /></div>
            <div className="product-shot shot-top"><img src="/media/products/IMG-20260718-WA0012.webp" alt="Çin mantısı clicker anahtarlık" width="960" height="1200" /></div>
            <div className="product-shot shot-bottom"><img src="/media/products/IMG-20260718-WA0035.webp" alt="Beyincik stres topu" width="1037" height="1200" /></div>
            <div className="floating-note"><span><img src="/assets/bucuruktoys-avatar.svg" alt="" width="512" height="512" /></span><strong>Renkli &amp; hızlı<br />dönen ürünler</strong></div>
          </div>
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">Kategoriler</p><h2>Aradığınızı hızla bulun.</h2></div>
            <p>Ürünler kullanım alanlarına göre ayrıldı; aynı ürün birden fazla değil, en doğru ana kategoride yer alıyor.</p>
          </div>
          <div className="category-grid">
            {categories.slice(1).filter((item) => catalogProducts.some((product) => product.category === item.id)).map((item, index) => {
              const categoryProducts = catalogProducts.filter((product) => product.category === item.id);
              const count = categoryProducts.length;
              const categoryImage = categoryProducts[0]?.image || categoryImages[item.id as Exclude<CategoryId, "all">];
              const [imageWidth, imageHeight] = imageDimensions[categoryImage] ?? [900, 900];
              return (
                <button className="category-card" onClick={() => chooseCategory(item.id)} key={item.id} aria-controls="product-results">
                  <span className="category-number">0{index + 1}</span>
                  <div className="category-image"><img src={productImage(categoryImage)} alt={`${item.name} kategorisi`} loading="lazy" width={imageWidth} height={imageHeight} /></div>
                  <div className="category-card-copy"><h3>{item.name}</h3><span>{count} ürün <Icon name="arrow" /></span></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="catalog-section" id="products">
        <div className="container">
          <div className="section-heading catalog-heading">
            <div><p className="eyebrow">Ürün kataloğu</p><h2>Toptan ürün seçkisi.</h2></div>
            <div className="catalog-tools">
              <div className="search-box">
                <Icon name="search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün ara..." aria-label="Ürün ara" aria-controls="product-results" />
                {query && <button onClick={() => setQuery("")} aria-label="Aramayı temizle"><Icon name="close" /></button>}
              </div>
              <label className="sort-box"><span>Sırala</span><select value={sort} onChange={(event) => setSort(event.target.value as SortId)} aria-label="Ürünleri sırala" aria-controls="product-results"><option value="featured">Önerilen</option><option value="az">A–Z</option><option value="za">Z–A</option></select></label>
            </div>
          </div>
          <div className="filter-row" role="group" aria-label="Ürün kategorileri">
            {categories.map((item) => (
              <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => { setCategory(item.id); if (item.id !== "all") track("category_filter", undefined, { category: item.id }); }} aria-pressed={category === item.id} aria-controls="product-results">
                {item.short}<span>{item.id === "all" ? catalogProducts.length : catalogProducts.filter((product) => product.category === item.id).length}</span>
              </button>
            ))}
          </div>

          <div id="product-results">
          <div className="result-line" role="status" aria-live="polite" aria-atomic="true"><span>{filtered.length} ürün gösteriliyor</span>{category !== "all" && <button onClick={() => setCategory("all")}>Filtreyi temizle</button>}</div>
          {filtered.length ? (
            <div className="product-grid">
              {filtered.map((product) => {
                const selected = (offer[product.id] ?? 0) > 0;
                const categoryInfo = categories.find((item) => item.id === product.category)!;
                const code = productCode(product);
                const [imageWidth, imageHeight] = imageDimensions[product.image] ?? [900, 900];
                const remoteImage = /^https?:\/\//i.test(product.image);
                return (
                  <article className="product-card" id={code} key={product.id}>
                    <button className="product-image" onClick={() => openPreview(product)} aria-label={`${product.name} görselini büyüt`}>
                      <img src={productImage(product.image)} srcSet={remoteImage ? undefined : `${productImage(product.image, 320)} 320w, ${productImage(product.image, 540)} 540w`} sizes="(max-width: 560px) calc(50vw - 19px), (max-width: 820px) calc(50vw - 32px), (max-width: 1060px) calc(33vw - 30px), 290px" alt={product.name} loading="lazy" width={imageWidth} height={imageHeight} />
                      <span>Görseli büyüt</span>
                    </button>
                    <div className="product-body">
                      <div className="product-meta"><span style={{ "--dot": categoryInfo.color } as React.CSSProperties}>{categoryInfo.short}</span><a href={`/urun/${code.toLowerCase()}`} aria-label={`${product.name} ürün detay sayfası`}>{code}</a></div>
                      <h3><a className="product-detail-link" href={`/urun/${code.toLowerCase()}`}>{product.name}</a></h3>
                      <p>{product.note}</p>
                      <div className="pack-row"><span>{product.pack}{(product.minOrderPackages ?? 1) > 1 && <small>Min. {product.minOrderPackages} paket</small>}</span>
                        <button className={selected ? "add-button selected" : "add-button"} onClick={() => toggleOffer(product.id)} aria-label={selected ? `${product.name} ürününü teklif listesinden çıkar` : `${product.name} ürününü teklif listesine ekle`} aria-pressed={selected}>
                          <Icon name={selected ? "check" : "plus"} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state"><span>Sonuç bulunamadı.</span><button onClick={() => { setQuery(""); setCategory("all"); }}>Tüm ürünleri göster</button></div>
          )}
          </div>
        </div>
      </section>

      <section className="trade-info-section" aria-labelledby="trade-info-title">
        <div className="container">
          <div className="trade-info-heading"><p className="eyebrow">Toptan koşullar</p><h2 id="trade-info-title">Sipariş öncesi kısa bilgi.</h2></div>
          <div className="trade-info-grid">
            <div><span>01</span><strong>Türkiye geneli teslimat</strong><p>Teslimat şehir ve sipariş hacmine göre planlanır.</p></div>
            <div><span>02</span><strong>Talep adedinizi girin</strong><p>Her ürün için istediğiniz adedi teklif listesinde doğrudan belirleyin.</p></div>
            <div><span>03</span><strong>Güncel fiyat ve stok</strong><p>Toptan fiyat, uygun paket/koli düzeni ve mevcut stok teklif yanıtında netleştirilir.</p></div>
            <div><span>04</span><strong>WhatsApp üzerinden</strong><p>Stok kodu, ürün adı, talep adedi ve paket bilgisi tek düzenli mesajla iletilir.</p></div>
          </div>
        </div>
      </section>

      <section className="entity-section" aria-labelledby="entity-title">
        <div className="container entity-card">
          <div><p className="eyebrow">BÜCÜRÜKTOYS kısaca</p><h2 id="entity-title">BÜCÜRÜKTOYS nedir?</h2></div>
          <div><p><strong>BÜCÜRÜKTOYS</strong>, mağaza, kırtasiye, e-ticaret ve kurumsal alıcılar için paketli toptan oyuncak ürünleri sunan; stok kodlu teklif listesi ve Türkiye geneli teslimat sistemiyle çalışan bir oyuncak tedarik markasıdır.</p><nav aria-label="BÜCÜRÜKTOYS bilgi bağlantıları"><a href="/hakkimizda">Marka hakkında</a><a href="/toptan-oyuncak-rehberi">Toptan sipariş rehberi</a><a href="/sikca-sorulan-sorular">Sık sorulan sorular</a></nav></div>
        </div>
      </section>

      <section className="wholesale-section" id="wholesale">
        <div className="container wholesale-grid">
          <div className="wholesale-copy">
            <p className="eyebrow light">Toptan alışveriş</p>
            <h2>Ürünleri seçin.<br />Teklifinizi alın.</h2>
            <p>Bu sitede doğrudan satış veya online ödeme yapılmaz. Ürünleri seçin, talep adetlerini girin ve düzenli listenizi WhatsApp üzerinden teklif için gönderin.</p>
            <button className="light-button" onClick={openDrawer}>Teklif listemi aç <Icon name="arrow" /></button>
            <img className="wholesale-logo" src="/assets/bucuruktoys-logo-reversed.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" />
          </div>
          <div className="steps">
            <div><b>01</b><span><strong>Ürünleri inceleyin</strong>Filtreleri kullanarak mağazanıza uygun ürünleri bulun.</span></div>
            <div><b>02</b><span><strong>Adetleri belirleyin</strong>Her ürün için istediğiniz talep adedini yazın.</span></div>
            <div><b>03</b><span><strong>Teklif isteyin</strong>Stok kodlu listenizi WhatsApp üzerinden tek mesajla gönderin.</span></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-card">
          <div><p className="eyebrow">İletişim</p><h2>Sipariş ve ürün bilgisi için.</h2><p>Toptan fiyat, paket içeriği ve güncel ürün durumu için doğrudan ulaşın.</p></div>
          <div className="contact-actions">
            <a href="https://wa.me/905393468527" target="_blank" rel="noreferrer" className="primary-button">WhatsApp <Icon name="arrow" /></a>
            <a href="tel:+905393468527" className="phone-link">0539 346 85 27</a>
            <span className="delivery-note">Türkiye geneli teslimat</span>
          </div>
        </div>
      </section>

      <footer className="catalog-footer">
        <div className="container footer-grid">
          <div><a href="/" className="brand footer-brand"><img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" /></a><p>Raflara neşe, mağazanıza hareket.</p></div>
          <div><strong>Katalog ve bilgi</strong><a href="/kategoriler">Kategoriler</a><a href="#products">Tüm ürünler</a><a href="/katalog">PDF katalog</a><a href="/hakkimizda">BÜCÜRÜKTOYS hakkında</a><a href="/kurumsal-bilgiler">Kurumsal bilgiler</a><a href="/toptan-oyuncak-rehberi">Toptan sipariş rehberi</a><a href="/sikca-sorulan-sorular">Sık sorulan sorular</a><a href="/bayi">Bayilik başvurusu</a></div>
          <div><strong>İletişim</strong><a href="tel:+905393468527">0539 346 85 27</a><a href="https://wa.me/905393468527" target="_blank" rel="noreferrer">WhatsApp</a><span>Türkiye geneli teslimat</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 BÜCÜRÜKTOYS</span><a href="/gizlilik">Gizlilik ve veri kullanımı</a><a className="footer-admin" href="/admin" aria-label="Yönetim panelini aç">Yönetim</a></div>
      </footer>

      {selectedProducts.length > 0 && !drawerOpen && <button className="mobile-offer" onClick={openDrawer} aria-controls="offer-drawer" aria-expanded={drawerOpen}><Icon name="bag" /><span>{selectedProducts.length} ürün için teklif al</span><Icon name="arrow" /></button>}

      {drawerOpen && (
        <div className="drawer-layer">
          <button className="drawer-backdrop" onClick={closeDrawer} tabIndex={-1} aria-hidden="true" />
          <aside ref={drawerRef} id="offer-drawer" className="drawer" role="dialog" aria-modal="true" aria-labelledby="offer-drawer-title">
            <div className="drawer-header"><div><p id="offer-drawer-title">Teklif Listeniz</p><span>{selectedProducts.length} ürün çeşidi • {totalRequestedQuantity} adet</span></div><button ref={drawerCloseRef} onClick={closeDrawer} aria-label="Teklif listesini kapat"><Icon name="close" /></button></div>
            <div className="drawer-products">
              {selectedProducts.length ? selectedProducts.map((product) => (
                <div className="drawer-product" key={product.id}>
                  <img src={productImage(product.image, 320)} alt={product.name} width="68" height="68" loading="lazy" />
                  <div className="drawer-product-info">
                    <strong>{product.name}</strong><small>{product.pack}</small>
                    <div className="quantity-control" aria-label={`${product.name} talep adedi`}>
                      <button onClick={() => changeQuantity(product.id, -1)} aria-label="Bir adet azalt"><Icon name="minus" /></button>
                      <label><input type="number" min="1" max="100000" inputMode="numeric" value={offer[product.id]} onChange={(event) => setQuantity(product.id, event.target.value)} aria-label={`${product.name} için talep edilen adet`} /><span>adet</span></label>
                      <button onClick={() => changeQuantity(product.id, 1)} aria-label="Bir adet artır"><Icon name="plus" /></button>
                    </div>
                  </div>
                  <button className="remove-product" onClick={() => toggleOffer(product.id)} aria-label={`${product.name} ürününü çıkar`}><Icon name="close" /></button>
                </div>
              )) : <div className="drawer-empty"><Icon name="bag" /><strong>Listeniz boş</strong><span>Ürün kartlarındaki + simgesini kullanın.</span></div>}
            </div>
            {selectedProducts.length > 0 && <div className="drawer-footer">
              <div className="offer-contact"><p>İletişim bilgisi <span>isteğe bağlı</span></p><div><input value={offerContact.companyName} onChange={(event) => setOfferContact({ ...offerContact, companyName: event.target.value })} placeholder="Firma adı" aria-label="Firma adı" /><input value={offerContact.customerName} onChange={(event) => setOfferContact({ ...offerContact, customerName: event.target.value })} placeholder="Yetkili adı" aria-label="Yetkili adı" /></div><input value={offerContact.phone} onChange={(event) => setOfferContact({ ...offerContact, phone: event.target.value })} placeholder="Telefon" inputMode="tel" aria-label="Telefon" /><textarea value={offerContact.note} onChange={(event) => setOfferContact({ ...offerContact, note: event.target.value })} placeholder="Teklif notu" aria-label="Teklif notu" rows={2} /><small>Bilgiler siteye kaydedilmez; yalnızca açılan WhatsApp mesajına eklenir.</small></div>
              <button type="button" onClick={sendOffer} className="whatsapp-button">WhatsApp&apos;tan teklif iste <Icon name="arrow" /></button>
              <button className="copy-button" onClick={copyOffer} aria-live="polite"><Icon name={copied ? "check" : "copy"} />{copied ? "Liste kopyalandı" : "Listeyi kopyala"}</button>
              <button className="clear-button" onClick={() => setOffer({})}>Listeyi temizle</button>
            </div>}
          </aside>
        </div>
      )}

      {preview && (
        <div className="preview-layer">
          <button className="preview-backdrop" onClick={closePreview} tabIndex={-1} aria-hidden="true" />
          <div ref={previewRef} className="preview-card" role="dialog" aria-modal="true" aria-labelledby="product-preview-title">
            <button ref={previewCloseRef} className="preview-close" onClick={closePreview} aria-label="Ürün önizlemesini kapat"><Icon name="close" /></button>
            <div className="preview-media"><img src={productImage(previewImage || preview.image)} alt={preview.name} width={(imageDimensions[previewImage || preview.image] ?? [900, 900])[0]} height={(imageDimensions[previewImage || preview.image] ?? [900, 900])[1]} />{preview.gallery && preview.gallery.length > 0 && <div className="preview-gallery">{[preview.image, ...preview.gallery].filter((image, index, all) => all.indexOf(image) === index).map((image) => <button key={image} className={(previewImage || preview.image) === image ? "active" : ""} onClick={() => setPreviewImage(image)} aria-label={`${preview.name} ek görselini göster`} aria-pressed={(previewImage || preview.image) === image}><img src={productImage(image)} alt="" loading="lazy" /></button>)}</div>}</div>
            <div className="preview-details">
              <div className="preview-meta"><span>{categories.find((item) => item.id === preview.category)?.name}</span><small>{productCode(preview)}</small></div>
              <h3 id="product-preview-title">{preview.name}</h3>
              <p>{preview.note}</p>
              <dl><div><dt>Toptan paket</dt><dd>{preview.pack}</dd></div><div><dt>Minimum sipariş</dt><dd>{preview.minOrderPackages ?? 1} paket/koli</dd></div><div><dt>Fiyat ve stok</dt><dd>{preview.isPriceVisible && preview.price !== null && preview.price !== undefined ? `${preview.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺${preview.stock !== undefined ? ` · ${preview.stock} stok` : ""}` : "Teklif ile güncel bilgi"}</dd></div></dl>
              <div className="preview-actions">
                <button className={Boolean(offer[preview.id]) ? "primary-button preview-add selected" : "primary-button preview-add"} onClick={() => toggleOffer(preview.id)} aria-pressed={Boolean(offer[preview.id])}>
                  <Icon name={Boolean(offer[preview.id]) ? "check" : "plus"} />
                  {Boolean(offer[preview.id]) ? "Teklif listesinde" : "Teklif listesine ekle"}
                </button>
                <button className="share-button" onClick={() => shareProduct(preview)} aria-live="polite"><Icon name={sharedId === preview.id ? "check" : "share"} />{sharedId === preview.id ? "Bağlantı hazır" : "Ürünü paylaş"}</button>
                <a className="preview-detail-link" href={`/urun/${productCode(preview).toLowerCase()}`}>Ürün detay sayfası →</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeveloperContact />
    </main>
  );
}
