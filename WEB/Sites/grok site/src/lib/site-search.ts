import { productSlug, searchProducts } from "./products";
import { searchLines, type LineDef } from "./line-items";

export type SiteHit =
  | {
      kind: "sku";
      id: string;
      name: string;
      image: string;
      price: number;
      meta: string;
      sku: string;
      slug: string;
    }
  | {
      kind: "line";
      id: string;
      name: string;
      image: string;
      price: number;
      meta: string;
      to: LineDef["to"];
      itemId: string;
    };

export function searchSite(q: string, limit = 12): SiteHit[] {
  const needle = q.trim();
  if (!needle) return [];
  const sku = searchProducts(needle, limit).map(
    (p): SiteHit => ({
      kind: "sku",
      id: `sku-${p.sku}`,
      name: p.name,
      image: p.image,
      price: p.price,
      meta: p.sku,
      sku: p.sku,
      slug: productSlug(p),
    }),
  );
  const line = searchLines(needle, limit).map(
    ({ line, item }): SiteHit => ({
      kind: "line",
      id: `line-${line.key}-${item.id}`,
      name: item.name,
      image: item.image,
      price: item.price,
      meta: `${line.kicker}${item.code ? ` · ${item.code}` : ""}`,
      to: line.to,
      itemId: item.id,
    }),
  );
  const mixed: SiteHit[] = [];
  let i = 0;
  let j = 0;
  while (mixed.length < limit && (i < sku.length || j < line.length)) {
    if (i < sku.length) mixed.push(sku[i++]);
    if (mixed.length >= limit) break;
    if (j < line.length) mixed.push(line[j++]);
  }
  return mixed;
}
