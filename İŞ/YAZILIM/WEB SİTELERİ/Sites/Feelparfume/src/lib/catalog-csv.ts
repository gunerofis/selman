import type { ProductInput } from "./catalog-db.server";

/** Şablon başlıkları (PLAN/urun-sablonu.csv ile aynı). */
export const CSV_HEADERS = [
  "sku", "marka", "ad", "kategori", "cinsiyet", "konsantrasyon", "koku_ailesi",
  "ust_notalar", "kalp_notalar", "alt_notalar", "ml", "fiyat_tl", "deneme_boyu", "stok",
  "gtin_barkod", "kalicilik_1_5", "yayilim_1_5", "mevsim", "cikis_yili", "parfumor",
  "inci_icerik", "mensei", "parti_no", "son_kullanma", "kisa_aciklama", "aciklama",
  "gorsel_dosya", "one_cikan", "ornek",
] as const;

export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const delim = (src.split("\n")[0].match(/;/g)?.length ?? 0) > (src.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i += 1; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i += 1;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

const list = (v: string, sep = /[;,]/) =>
  v.split(sep).map((x) => x.trim()).filter(Boolean);
const num = (v: string) => {
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && v.trim() !== "" ? n : undefined;
};
const yes = (v: string) => /^(evet|1|true|x)$/i.test(v.trim());

export type CsvResult = { products: ProductInput[]; errors: string[] };

export function csvToProducts(text: string): CsvResult {
  const rows = parseCsv(text);
  const errors: string[] = [];
  if (!rows.length) return { products: [], errors: ["Dosya boş."] };
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (h: string) => head.indexOf(h);
  for (const h of ["sku", "ad", "kategori", "ml", "fiyat_tl"]) {
    if (idx(h) < 0) errors.push(`Eksik sütun: ${h}`);
  }
  if (errors.length) return { products: [], errors };
  const get = (r: string[], h: string) => (idx(h) >= 0 ? (r[idx(h)] ?? "").trim() : "");
  const map = new Map<string, ProductInput>();
  rows.slice(1).forEach((r, n) => {
    const line = n + 2;
    const sku = get(r, "sku");
    const ml = num(get(r, "ml"));
    const price = num(get(r, "fiyat_tl"));
    if (!sku) return errors.push(`Satır ${line}: sku boş.`);
    if (!ml || ml <= 0) return errors.push(`Satır ${line}: ml geçersiz.`);
    if (price == null || price < 0) return errors.push(`Satır ${line}: fiyat geçersiz.`);
    let p = map.get(sku);
    if (!p) {
      const name = get(r, "ad");
      if (!name) return errors.push(`Satır ${line}: ad boş.`);
      const image = get(r, "gorsel_dosya");
      p = {
        sku,
        name,
        brand: get(r, "marka") || undefined,
        category: get(r, "kategori") || "unisex",
        gender: (get(r, "cinsiyet") || undefined) as ProductInput["gender"],
        concentration: (get(r, "konsantrasyon") || undefined) as ProductInput["concentration"],
        families: list(get(r, "koku_ailesi")) as ProductInput["families"],
        notes: {
          top: list(get(r, "ust_notalar"), /;/),
          heart: list(get(r, "kalp_notalar"), /;/),
          base: list(get(r, "alt_notalar"), /;/),
        },
        longevity: num(get(r, "kalicilik_1_5")),
        sillage: num(get(r, "yayilim_1_5")),
        seasons: list(get(r, "mevsim"), /;/) as ProductInput["seasons"],
        year: num(get(r, "cikis_yili")),
        perfumer: get(r, "parfumor") || undefined,
        ingredients: get(r, "inci_icerik") || undefined,
        origin: get(r, "mensei") || undefined,
        tagline: get(r, "kisa_aciklama"),
        description: get(r, "aciklama"),
        features: [],
        image: image ? (image.startsWith("/") || image.startsWith("http") ? image : `/urunler/${image}`) : "",
        featured: yes(get(r, "one_cikan")),
        sample: yes(get(r, "ornek")) || undefined,
        status: "active",
        sizes: [],
      };
      map.set(sku, p);
    }
    if (p.sizes.some((s) => s.ml === ml)) return errors.push(`Satır ${line}: ${sku} için ${ml} ml tekrar ediyor.`);
    p.sizes.push({
      id: `${ml}ml`,
      ml,
      price,
      sample: yes(get(r, "deneme_boyu")) || undefined,
      stock: num(get(r, "stok")) ?? 0,
      gtin: get(r, "gtin_barkod") || undefined,
      batch: get(r, "parti_no") || undefined,
      expiry: get(r, "son_kullanma") || undefined,
    });
  });
  return { products: [...map.values()], errors };
}

const esc = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export type ExportProduct = ProductInput & {
  variantRows: Array<{ ml: number; price: number; stock: number; gtin: string; batch: string; expiry: string; sample: boolean }>;
};

export function productsToCsv(products: ExportProduct[]) {
  const lines = [CSV_HEADERS.join(",")];
  for (const p of products) {
    for (const v of p.variantRows) {
      lines.push(
        [
          p.sku, p.brand, p.name, p.category, p.gender, p.concentration, (p.families ?? []).join(","),
          p.notes?.top.join(";"), p.notes?.heart.join(";"), p.notes?.base.join(";"),
          v.ml, v.price, v.sample ? "evet" : "hayir", v.stock, v.gtin, p.longevity, p.sillage,
          (p.seasons ?? []).join(";"), p.year, p.perfumer, p.ingredients, p.origin, v.batch, v.expiry,
          p.tagline, p.description, p.image, p.featured ? "evet" : "hayir", p.sample ? "evet" : "hayir",
        ].map(esc).join(","),
      );
    }
  }
  return "﻿" + lines.join("\n");
}
