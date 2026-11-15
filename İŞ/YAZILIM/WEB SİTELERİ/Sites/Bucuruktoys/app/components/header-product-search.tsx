"use client";

import { useMemo, useRef, useState } from "react";
import { publicImageUrl, type CatalogProduct } from "../../lib/products";

type ProductResponse = { products?: CatalogProduct[] };

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export default function HeaderProductSearch() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const requestedRef = useRef(false);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    if (!term) return [];
    return products.filter((product) =>
      `${product.name} ${product.sku} ${product.pack}`.toLocaleLowerCase("tr-TR").includes(term)
    ).slice(0, 6);
  }, [products, query]);

  function loadProducts() {
    if (requestedRef.current) return;
    requestedRef.current = true;
    setLoading(true);
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: ProductResponse) => {
        if (Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }

  function chooseResult(product: CatalogProduct) {
    window.location.assign(`/urun/${product.sku.toLowerCase()}`);
  }

  return (
    <form
      className="header-product-search"
      action="/urunler"
      method="get"
      role="search"
      onFocus={() => { setOpen(true); loadProducts(); }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor="header-product-query">Ürün veya stok kodu ara</label>
      <SearchIcon />
      <input
        id="header-product-query"
        name="arama"
        type="search"
        value={query}
        placeholder="Ürün veya stok kodu"
        autoComplete="off"
        aria-controls="header-search-results"
        aria-expanded={open && Boolean(query.trim())}
        aria-activedescendant={activeIndex >= 0 ? `header-search-result-${activeIndex}` : undefined}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(-1); loadProducts(); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { setOpen(false); setActiveIndex(-1); return; }
          if (!results.length) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => Math.min(current + 1, results.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            chooseResult(results[activeIndex]);
          }
        }}
      />
      <button type="submit" aria-label="Ürünlerde ara"><span aria-hidden="true">→</span></button>
      {open && query.trim() && (
        <div className="header-search-panel" id="header-search-results" role="listbox" aria-label="Ürün arama sonuçları">
          {loading ? <p className="header-search-message">Ürünler aranıyor…</p> : results.length ? results.map((product, index) => (
            <a
              className={activeIndex === index ? "is-active" : ""}
              href={`/urun/${product.sku.toLowerCase()}`}
              id={`header-search-result-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              key={product.id}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="header-search-image"><img src={publicImageUrl(product.image, 160)} alt="" width="72" height="72" loading="lazy" /></span>
              <span><strong>{product.name}</strong><small>{product.sku} · {product.pack}</small></span>
              <b aria-hidden="true">→</b>
            </a>
          )) : <p className="header-search-message">Eşleşen ürün bulunamadı. Enter ile katalogda ara.</p>}
        </div>
      )}
    </form>
  );
}
