import { CLIK_FEATURES, CLIK_KINDS, CLIK_MATERIAL, CLIK_PRODUCTS } from "./clik-products";
import { DESQ_FEATURES, DESQ_NOTE, DESQ_PRODUCTS, DESQ_TIERS } from "./desq-products";
import {
  ORG_CATEGORIES,
  ORG_FEATURES,
  ORG_NOTE,
  ORG_PRODUCTS,
} from "./organizer-products";
import { SLAC_FEATURES, SLAC_NOTE, SLAC_PRODUCTS, SLAC_TIERS } from "./slac-products";
import { foldTr } from "./products";
import { fuzzyIncludes } from "./fuzzy";

export type LineFilter = { id: string; label: string };

export type LineItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  code?: string;
  kind?: string;
  tags?: string[];
  note?: string;
  filter: string;
  teklifNot: string;
};

export type LineDef = {
  key: "sweb" | "slac" | "clik" | "desq";
  to: "/organizer" | "/hediye-setleri" | "/saat-mucevher-kutulari" | "/ofis";
  kicker: string;
  title: string;
  description: string;
  features: string[];
  filters: LineFilter[];
  items: LineItem[];
};

function swebItems(): LineItem[] {
  const label = Object.fromEntries(ORG_CATEGORIES.map((c) => [c.id, c.label]));
  return ORG_PRODUCTS.map((p) => ({
    id: p.slug,
    name: p.name,
    image: p.image,
    alt: p.name,
    price: p.price,
    code: p.color,
    kind: label[p.category] ?? p.category,
    filter: p.category,
    teklifNot: `SWEB · ${p.name}`,
  }));
}

function slacItems(): LineItem[] {
  return SLAC_PRODUCTS.map((p) => ({
    id: p.slug,
    name: p.name,
    image: p.image,
    alt: `${p.name} hediye kutusu`,
    price: p.price,
    code: p.code,
    kind: p.tier === "set" ? "Set" : "Tekli",
    tags: p.contents,
    note: p.color,
    filter: p.tier,
    teklifNot: `SLAC · ${p.code} · ${p.name}`,
  }));
}

function clikItems(): LineItem[] {
  return CLIK_PRODUCTS.map((p) => ({
    id: p.code,
    name: p.name,
    image: p.image,
    alt: p.name,
    price: p.price,
    code: p.code,
    kind: p.kind === "saat" ? "Saat kutusu" : "Mücevher kutusu",
    tags: p.specs,
    note: p.dims ? `Ölçü: ${p.dims}` : p.color,
    filter: p.kind,
    teklifNot: `CLIK · ${p.code} · ${p.name}`,
  }));
}

function desqItems(): LineItem[] {
  return DESQ_PRODUCTS.map((p) => ({
    id: p.slug,
    name: p.name,
    image: p.image,
    alt: p.name,
    price: p.price,
    code: p.color,
    kind: p.tier === "set" ? "Masa seti" : "Aksesuar",
    filter: p.tier,
    teklifNot: `DESQ · ${p.name}`,
  }));
}

export const LINES: LineDef[] = [
  {
    key: "sweb",
    to: "/organizer",
    kicker: "SWEB",
    title: "Deri Organizer Koleksiyonu",
    description: `${ORG_NOTE} ${ORG_PRODUCTS.length} model.`,
    features: ORG_FEATURES,
    filters: [{ id: "hepsi", label: "Tümü" }, ...ORG_CATEGORIES],
    items: swebItems(),
  },
  {
    key: "slac",
    to: "/hediye-setleri",
    kicker: "SLAC",
    title: "Hediye Setleri",
    description: `İçi hediye dolu, deri kaplı MDF VIP giftbox'lar. ${SLAC_PRODUCTS.length} model — çok parçalı setler ve tekli kutular. ${SLAC_NOTE}`,
    features: SLAC_FEATURES,
    filters: [{ id: "hepsi", label: "Tümü" }, ...SLAC_TIERS],
    items: slacItems(),
  },
  {
    key: "clik",
    to: "/saat-mucevher-kutulari",
    kicker: "CLIK",
    title: "Saat ve Mücevher Kutuları",
    description: `${CLIK_MATERIAL}. Tekli saat sunum kutusundan çok bölmeli mücevher koleksiyon kutusuna; ${CLIK_PRODUCTS.length} model. Renk ve iç kumaş talebe göre üretilir.`,
    features: CLIK_FEATURES,
    filters: [{ id: "hepsi", label: "Tümü" }, ...CLIK_KINDS],
    items: clikItems(),
  },
  {
    key: "desq",
    to: "/ofis",
    kicker: "DESQ",
    title: "Lüks Ofis Ürünleri",
    description: `${DESQ_NOTE} ${DESQ_PRODUCTS.length} model — yönetici masa setlerinden tekli aksesuarlara.`,
    features: DESQ_FEATURES,
    filters: [{ id: "hepsi", label: "Tümü" }, ...DESQ_TIERS],
    items: desqItems(),
  },
];

export function lineByPath(path: LineDef["to"]) {
  return LINES.find((line) => line.to === path)!;
}

export function lineDetailTo(to: LineDef["to"]) {
  switch (to) {
    case "/organizer":
      return "/organizer/$id" as const;
    case "/hediye-setleri":
      return "/hediye-setleri/$id" as const;
    case "/saat-mucevher-kutulari":
      return "/saat-mucevher-kutulari/$id" as const;
    case "/ofis":
      return "/ofis/$id" as const;
  }
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
    [line.kicker, line.title, item.name, item.code ?? "", item.kind ?? "", ...(item.tags ?? []), item.note ?? ""].join(
      " ",
    ),
  );
  return raw.split(/\s+/).filter(Boolean).every((w) => hay.includes(w) || fuzzyIncludes(hay, w));
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
