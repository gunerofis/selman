import { CLIK_FEATURES, CLIK_KINDS, CLIK_PRODUCTS } from "./clik-products";
import { IMPORTED_DESIGNS } from "./imported-designs";
import { GUNER_WATCH_PRODUCTS } from "./guner-watch-products";
import { REAL_LEATHER_WATCH_PRODUCTS } from "./real-leather-watch-products";
import { foldTr } from "./products";
import { fuzzyIncludes } from "./fuzzy";

export type LineFilter = { id: string; label: string };

export type LineItem = {
  id: string;
  name: string;
  image: string;
  imageSrcSet?: string;
  alt: string;
  price: number | null;
  oldPrice?: number;
  availability?: "in-stock" | "out-of-stock" | "inquiry-only";
  color?: string;
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
  description?: string;
  details?: Array<{ label: string; value: string }>;
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

/** Kapasite sayımları değil, ürünün sabit fiziksel özellikleri kartta gösterilir. */
const CAPACITY_SPEC = /^\d+\s+(yüzük|küpe|kolye|bileklik|saat|ekstra bölme|bölme)$/i;

function cardSpecs(p: (typeof CLIK_PRODUCTS)[number]): string[] {
  if (p.kind === "saat") {
    const capacity = p.specs[0]?.match(/^(\d+)\s+saat$/i)?.[1];
    return capacity ? [`${capacity} saat kapasiteli`] : [];
  }
  const material = p.code === "P-7001" ? "Masif ahşap" : "MDF üzeri deri kaplama";
  const structural = p.specs.filter(
    (spec) =>
      !CAPACITY_SPEC.test(spec.trim()) &&
      !/(kilit|toka|altın detay|ayaklı)/i.test(spec),
  );
  return [...structural, material];
}

export const CLIK_CAPACITY_FILTERS: LineFilter[] = [
  { id: "kap-tekli", label: "1 saatlik" },
  { id: "kap-kucuk", label: "2–4 saatlik" },
  { id: "kap-orta", label: "6–10 saatlik" },
  { id: "kap-buyuk", label: "12 saatlik" },
];

function capacityBucket(capacity: string | null | undefined): string[] | undefined {
  if (!capacity) return undefined;
  const n = Number(capacity);
  if (!Number.isFinite(n)) return undefined;
  if (n <= 1) return ["kap-tekli"];
  if (n <= 4) return ["kap-kucuk"];
  if (n <= 10) return ["kap-orta"];
  return ["kap-buyuk"];
}

// Saat kutularını kapasite dışında ayırt eden form/kapak özelliği; "8 Saatlik"
// yerine "8 Saatlik Vitrinli" gibi ayırt edici bir ad üretmek için kullanılır.
const SAAT_FORM_LABELS: Array<[RegExp, string]> = [
  [/kavisli.*vitrin/i, "Kavisli Vitrinli"],
  [/katlan[ıi]r.*vitrin/i, "Katlanır Vitrinli"],
  [/vitrin/i, "Vitrinli"],
  [/cam/i, "Camlı"],
  [/ayak/i, "Ayaklı"],
  [/fasetli/i, "Fasetli"],
  [/sekizgen/i, "Sekizgen"],
  [/alt[ıi]gen/i, "Altıgen"],
  [/ah[şs]ap/i, "Ahşap"],
  [/stand/i, "Standlı"],
  [/sunum/i, "Sunum"],
  [/toka/i, "Tokalı"],
];

function saatFormLabel(specs: string[]): string | null {
  for (const spec of specs) {
    const s = spec.trim();
    if (/saat$/i.test(s)) continue; // kapasite satırı
    if (/(alt[ıi]n detay|kilit|toka|ayaklı)/i.test(s)) continue;
    for (const [re, label] of SAAT_FORM_LABELS) if (re.test(s)) return label;
  }
  return null;
}

function clikItems(): LineItem[] {
  return CLIK_PRODUCTS.map((p, index) => {
    const code =
      p.kind === "mucevher"
        ? `KM-${String(7001 + index)}`
        : `ST-${String(7001 + index - 12)}`;
    const watchCapacity = p.kind === "saat" ? p.specs[0]?.match(/^(\d+)\s+saat$/i)?.[1] : null;
    const drawerCount =
      p.kind === "mucevher"
        ? p.specs.map((spec) => spec.match(/^(\d+)\s+çekmece$/i)?.[1]).find(Boolean)
        : null;
    const watchForm = watchCapacity ? saatFormLabel(p.specs) : null;
    const displayName = watchCapacity
      ? `${watchCapacity} Saatlik ${watchForm ? `${watchForm} ` : ""}Saat Kutusu · ${code}`
      : drawerCount
        ? `${drawerCount} Çekmeceli Mücevher Kutusu · ${code}`
        : p.kind === "mucevher"
          ? `Mücevher Kutusu · ${code}`
          : p.name;
    return {
      id: p.code,
      name: displayName,
      image: `/catalog-standard/${code.toLocaleLowerCase("tr-TR")}.png`,
      alt: displayName,
      price: p.price,
      code,
      kind: p.kind === "saat" ? "Saat kutusu" : "Mücevher kutusu",
      tags: cardSpecs(p),
      filterTags: capacityBucket(watchCapacity),
      note: p.dims ? `Ölçü: ${p.dims}` : "Ölçü: sipariş onayında teyit edilir",
      details: [
        { label: "Dış ölçü", value: p.dims ?? "Satış öncesi teyit edilir" },
        {
          label: "Gövde ve kaplama",
          value:
            p.code === "P-7001"
              ? "Masif ahşap"
              : "MDF üzeri kaplama; deri türü satış öncesi teyit edilir",
        },
        { label: "İç astar ve yastık", value: "Malzeme bilgisi satış öncesi teyit edilir" },
        {
          label: "Stok ve üretim",
          value: "Hazır stok veya üretim süresi sipariş onayında teyit edilir",
        },
        {
          label: "Renk ve iç kumaş",
          value: "Tercih teklif veya iletişim notuyla alınır; üretim öncesi teyit edilir",
        },
      ],
      filter: p.kind,
      teklifNot: `CLIK · ${code} · ${displayName}`,
    };
  });
}

function importedItems(line: LineDef["key"]): LineItem[] {
  return IMPORTED_DESIGNS.filter((item) => item.line === line).map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    imageSrcSet: item.imageSrcSet,
    alt: item.name,
    price: null,
    code: item.code,
    kind: item.filter === "mucevher" ? "Mücevher kutusu" : "Saat kutusu",
    note: "TASARIM arşivinden",
    filter: item.filter,
    teklifNot: `${item.line.toUpperCase()} · ${item.code} · ${item.name}`,
  }));
}

function uniqueItems(items: LineItem[]) {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  return items.filter((item) => {
    const nameKey = foldTr(item.name).replace(/\s+/g, " ").trim();
    if (seenIds.has(item.id) || seenNames.has(nameKey)) return false;
    seenIds.add(item.id);
    seenNames.add(nameKey);
    return true;
  });
}

function prioritize1850(items: LineItem[]) {
  return [...items].sort((a, b) => Number(b.price === 1850) - Number(a.price === 1850));
}

export const LINES: LineDef[] = [
  {
    key: "clik",
    to: "/saat-mucevher-kutulari",
    kicker: "CLIK",
    title: "Saat ve Mücevher Kutuları",
    description: "CLIK, Sweb'in saat ve mücevher kutusu ürün ailesidir.",
    features: CLIK_FEATURES,
    filters: [
      { id: "hepsi", label: "Tümü" },
      ...CLIK_KINDS,
      { id: "gercek-deri", label: "Gerçek deri" },
      ...CLIK_CAPACITY_FILTERS,
    ],
    items: prioritize1850(
      uniqueItems([
        ...clikItems(),
        ...GUNER_WATCH_PRODUCTS,
        ...REAL_LEATHER_WATCH_PRODUCTS,
        ...importedItems("clik"),
      ]),
    ),
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
  const item = line?.items.find((p) => p.id === id);
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
