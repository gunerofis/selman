import { foldTr } from "./products";
import { fuzzyIncludes } from "./fuzzy";

export type LineFilter = { id: string; label: string };

export type LineItem = {
  id: string;
  name: string;
  image: string;
  imageSrcSet?: string;
  alt: string;
  description?: string;
  price: number | null;
  oldPrice?: number | null;
  availability?: "in-stock" | "out-of-stock" | "inquiry-only";
  code?: string;
  kind?: string;
  tags?: string[];
  note?: string;
  filter: string;
  /** Ek filtre anahtarları (kapasite gibi ikinci bir eksen için). */
  filterTags?: string[];
  teklifNot: string;
  seoTitle?: string;
  seoDescription?: string;
  details?: Array<{ label: string; value: string }>;
};

export type LineDef = {
  key: "urunler";
  to: "/urunler";
  kicker: string;
  title: string;
  description: string;
  features: string[];
  filters: LineFilter[];
  items: LineItem[];
};

export const LINES: LineDef[] = [
  {
    key: "urunler",
    to: "/urunler",
    kicker: "",
    title: "Ürünler",
    description: "",
    features: [],
    filters: [{ id: "hepsi", label: "Tümü" }],
    items: [],
  },
];

export function lineByPath(path: LineDef["to"]) {
  return LINES.find((line) => line.to === path)!;
}

export function lineDetailTo(_to: LineDef["to"]) {
  return "/urunler/$id" as const;
}

export function findLineItem(to: LineDef["to"], id: string) {
  const line = lineByPath(to);
  const item = line.items.find((p) => p.id === id);
  if (!item) return null;
  return { line, item };
}

export function matchesLineItem(item: LineItem, line: LineDef, q: string) {
  const raw = foldTr(q.trim());
  if (!raw) return true;
  const hay = foldTr(
    [
      line.kicker,
      line.title,
      item.name,
      item.code ?? "",
      item.kind ?? "",
      ...(item.tags ?? []),
      item.note ?? "",
    ].join(" "),
  );
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w) || fuzzyIncludes(hay, w));
}

export function searchLines(q: string, limit = 8) {
  const needle = q.trim();
  if (!needle) return [] as { line: LineDef; item: LineItem }[];
  const folded = foldTr(needle);
  const hits: { line: LineDef; item: LineItem }[] = [];
  for (const line of LINES) {
    for (const item of line.items) {
      if (matchesLineItem(item, line, needle)) hits.push({ line, item });
    }
  }
  hits.sort((a, b) => {
    const an = foldTr(a.item.name);
    const bn = foldTr(b.item.name);
    const ae = an === folded || foldTr(a.item.code ?? "") === folded ? 0 : 1;
    const be = bn === folded || foldTr(b.item.code ?? "") === folded ? 0 : 1;
    return ae - be;
  });
  return hits.slice(0, limit);
}
