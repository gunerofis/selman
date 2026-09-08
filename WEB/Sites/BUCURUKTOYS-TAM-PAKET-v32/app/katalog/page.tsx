"use client";

import { useEffect, useMemo, useState } from "react";
import { publicImageUrl, publicSeedProducts, type CatalogProduct, type ProductCategory } from "../../lib/products";

const categoryNames: Record<ProductCategory, string> = { outdoor: "Dış Mekân", fun: "Şaka & Eğlence", skill: "Zekâ & Beceri", sensory: "Stres & Duyusal", stationery: "Kırtasiye & Sticker", accessory: "Anahtarlık & Aksesuar", "3d": "3D Baskı Oyuncaklar" };

export default function PrintableCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>(publicSeedProducts);
  const [showPrices, setShowPrices] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then((response) => response.json()).then((data: { products?: CatalogProduct[] }) => {
      if (Array.isArray(data.products) && data.products.length) setProducts(data.products);
    }).catch(() => undefined);
  }, []);

  const pages = useMemo(() => Object.entries(categoryNames).flatMap(([id, name]) => {
    const categoryProducts = products.filter((product) => product.category === id);
    const pageCount = Math.ceil(categoryProducts.length / 9);
    return Array.from({ length: pageCount }, (_, index) => ({ id: `${id}-${index}`, name, products: categoryProducts.slice(index * 9, index * 9 + 9), totalProducts: categoryProducts.length, page: index + 1, pageCount }));
  }), [products]);

  function printCatalog() {
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ eventType: "catalog_print" }) }).catch(() => undefined);
    window.print();
  }

  function trackPdfDownload() {
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ eventType: "catalog_pdf_download" }) }).catch(() => undefined);
  }

  return <main className="print-catalog">
    <div className="print-toolbar"><a href="/">← Siteye dön</a><label><input type="checkbox" checked={showPrices} onChange={(event) => setShowPrices(event.target.checked)} /> Yazdırmada görünür fiyatlar</label><a className="pdf-download" href="/catalogs/bucuruktoys-toptan-katalog-2026.pdf" download onClick={trackPdfDownload}>PDF kataloğu indir</a><button onClick={printCatalog}>Yazdır</button></div>
    <section className="catalog-cover">
      <img src="/assets/bucuruktoys-logo.svg" alt="BÜCÜRÜKTOYS" width="1460" height="288" />
      <div><p>2026 TOPTAN OYUNCAK KATALOĞU</p><h1>Raflara neşe,<br />mağazanıza hareket.</h1><span>{products.length} ürün · Türkiye geneli teslimat</span></div>
      <footer><strong>0539 346 85 27</strong><span>www.bucuruktoys.com</span></footer>
    </section>
    {pages.map((page) => <section className="catalog-group" key={page.id}>
      <header><p>BÜCÜRÜKTOYS</p><h2>{page.name}</h2><span>{page.totalProducts} ürün{page.pageCount > 1 ? ` · ${page.page}/${page.pageCount}` : ""}</span></header>
      <div className="print-product-grid">{page.products.map((product) => <article key={product.id}>
        <div className="print-product-image"><img src={publicImageUrl(product.image)} alt={product.name} /></div>
        <div className="print-product-info"><span>{product.sku}</span><h3>{product.name}</h3><p>{product.note}</p><footer><strong>{product.pack}</strong>{showPrices && product.isPriceVisible && product.price !== null ? <b>{product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</b> : <small>Teklif ile fiyat</small>}</footer></div>
      </article>)}</div>
      <div className="page-footer"><span>BÜCÜRÜKTOYS · Toptan Oyuncak</span><strong>0539 346 85 27</strong></div>
    </section>)}
  </main>;
}
