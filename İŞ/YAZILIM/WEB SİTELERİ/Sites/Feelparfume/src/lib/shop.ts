import {
  PRODUCTS,
  foldTr,
  matchesQuery,
  type CategoryId,
  type Product,
  type SeriesId,
} from "./products";
import { promoteExact } from "./search-rank";
import { inPriceBand, inWidthBand, type PriceBandId, type WidthBandId } from "./catalog-filters";
import { outerMm } from "./scale";

export type ShopSort = "onerilen" | "fiyat-asc" | "fiyat-desc" | "ad" | "kod" | "en";

export type CatalogQuery = {
  q?: string;
  kategori?: CategoryId;
  seri?: SeriesId;
  fiyat?: PriceBandId;
  en?: WidthBandId;
  sort?: ShopSort;
};

export function filterCatalog(opts: CatalogQuery): Product[] {
  const needle = (opts.q ?? "").trim();
  const filtered = PRODUCTS.filter((p) => {
    if (opts.kategori && p.category !== opts.kategori) return false;
    if (opts.seri && p.series !== opts.seri) return false;
    if (opts.fiyat && !inPriceBand(p.price, opts.fiyat)) return false;
    if (opts.en && !inWidthBand(outerMm(p), opts.en)) return false;
    if (!needle) return true;
    return matchesQuery(p, needle);
  });
  const copy = [...filtered];
  if (opts.sort === "fiyat-asc") copy.sort((a, b) => a.price - b.price);
  if (opts.sort === "fiyat-desc") copy.sort((a, b) => b.price - a.price);
  if (opts.sort === "ad") copy.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  if (opts.sort === "kod") copy.sort((a, b) => a.sku.localeCompare(b.sku, "tr"));
  if (opts.sort === "en") {
    copy.sort((a, b) => (outerMm(a) ?? 0) - (outerMm(b) ?? 0));
  }
  if (needle && (!opts.sort || opts.sort === "onerilen")) {
    return promoteExact(copy, needle, foldTr);
  }
  return copy;
}

export function facetCount(base: CatalogQuery, patch: CatalogQuery) {
  return filterCatalog({ ...base, ...patch, sort: undefined }).length;
}
