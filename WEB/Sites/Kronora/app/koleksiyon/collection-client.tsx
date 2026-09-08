"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../product-card";
import ConceptProductCard from "../concept-product-card";
import type { ConceptCatalogProduct } from "../lib/product-wall-concepts";
import type { StoreProduct } from "../lib/store";

const colorHex: Record<string, string> = { Tümü: "#a88447", Siyah: "#191a1c", Bordo: "#742f3c", Kahve: "#5a4033", Krem: "#e8ddc7", Taba: "#b8794f" };
type SortOption = "featured" | "price-asc" | "price-desc" | "name";

type CatalogItem =
  | { kind: "product"; product: StoreProduct; slug: string; name: string; sku: string; model: string; color: string; priceCents: number; inStock: boolean }
  | { kind: "new-model"; product: ConceptCatalogProduct; slug: string; name: string; sku: string; model: string; color: string; priceCents: null; inStock: false };

export default function CollectionClient({ products, newModels }: { products: StoreProduct[]; newModels: ConceptCatalogProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalog: CatalogItem[] = useMemo(() => [
    ...products.map((product) => ({ kind: "product" as const, product, slug: product.slug, name: product.name, sku: product.sku, model: product.model, color: product.color, priceCents: product.priceCents, inStock: !product.trackStock || product.stockQuantity > 0 })),
    ...newModels.map((product) => ({ kind: "new-model" as const, product, slug: product.slug, name: product.name, sku: product.sku, model: product.model, color: product.color, priceCents: null, inStock: false })),
  ], [products, newModels]);
  const models = [...new Set(catalog.map((product) => product.model))];
  const colors = [...new Set(catalog.map((product) => product.color))];
  const query = searchParams.get("q") || "";
  const modelParam = searchParams.get("model") || "";
  const colorParam = searchParams.get("color") || "";
  const sortParam = searchParams.get("sort") || "";
  const model = models.includes(modelParam) ? modelParam : "Tümü";
  const color = colors.includes(colorParam) ? colorParam : "Tümü";
  const sort: SortOption = (["price-asc", "price-desc", "name"] as SortOption[]).includes(sortParam as SortOption) ? sortParam as SortOption : "featured";
  const stockOnly = searchParams.get("stock") === "1";

  const updateParam = (key: string, value: string, defaultValue = "") => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === defaultValue) next.delete(key); else next.set(key, value);
    const suffix = next.toString();
    router.replace(suffix ? `/koleksiyon?${suffix}` : "/koleksiyon", { scroll: false });
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    const matches = catalog.filter((product) => {
      const text = `${product.name} ${product.sku} ${product.model} ${product.color}`.toLocaleLowerCase("tr-TR");
      return (model === "Tümü" || product.model === model)
        && (color === "Tümü" || product.color === color)
        && (!normalizedQuery || text.includes(normalizedQuery))
        && (!stockOnly || product.inStock);
    });
    const pricedFirst = (a: CatalogItem, b: CatalogItem, direction: 1 | -1) => a.priceCents === null ? 1 : b.priceCents === null ? -1 : (a.priceCents - b.priceCents) * direction;
    if (sort === "price-asc") return [...matches].sort((a, b) => pricedFirst(a, b, 1));
    if (sort === "price-desc") return [...matches].sort((a, b) => pricedFirst(a, b, -1));
    if (sort === "name") return [...matches].sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
    return matches;
  }, [catalog, query, model, color, sort, stockOnly]);

  const hasFilters = Boolean(query.trim()) || model !== "Tümü" || color !== "Tümü" || stockOnly;
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    ["q", "model", "color", "stock"].forEach((key) => next.delete(key));
    const suffix = next.toString();
    router.replace(suffix ? `/koleksiyon?${suffix}` : "/koleksiyon", { scroll: false });
  };

  return <section className="catalogue-section collection-page">
    <div className="catalogue-toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => updateParam("q", event.target.value)} placeholder="Model, renk veya stok kodu ara…"/><b>{filtered.length} ürün</b></label><div className="filter-group"><span>Model</span><div>{["Tümü", ...models].map((value) => <button type="button" key={value} className={model === value ? "active" : ""} aria-pressed={model === value} onClick={() => updateParam("model", value, "Tümü")}>{value}</button>)}</div></div><div className="filter-group color-filter-group"><span>Renk</span><div>{["Tümü", ...colors].map((value) => <button type="button" key={value} className={color === value ? "active color-filter" : "color-filter"} aria-pressed={color === value} onClick={() => updateParam("color", value, "Tümü")}><i aria-hidden="true" style={{ background: colorHex[value] || "#d8cdb8" }}></i>{value}</button>)}</div></div></div>
    <div className="catalogue-meta-row"><div className="catalogue-result-copy"><strong>{filtered.length} ürün</strong><span>{hasFilters ? "Seçiminize göre gösteriliyor" : "Tüm koleksiyon gösteriliyor"}</span>{hasFilters && <button type="button" onClick={clearFilters}>Filtreleri temizle</button>}</div><div className="catalogue-view-controls"><label className="stock-toggle"><input type="checkbox" checked={stockOnly} onChange={(event) => updateParam("stock", event.target.checked ? "1" : "")} /><span>Yalnızca stoktakiler</span></label><label className="sort-control"><span>Sırala</span><select value={sort} onChange={(event) => updateParam("sort", event.target.value, "featured")}><option value="featured">Öne çıkanlar</option><option value="price-asc">Fiyat: artan</option><option value="price-desc">Fiyat: azalan</option><option value="name">İsme göre</option></select></label></div></div>
    {filtered.length ? <div className="product-grid">{filtered.map((item) => item.kind === "product" ? <ProductCard key={item.slug} product={item.product}/> : <ConceptProductCard key={item.slug} product={item.product}/>)}</div> : <div className="empty-state"><h3>Uygun ürün bulunamadı.</h3><p>Arama veya filtre seçiminizi değiştirerek tekrar deneyin.</p><button type="button" onClick={clearFilters}>Filtreleri temizle</button></div>}
  </section>;
}
