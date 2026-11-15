import { readFileSync, writeFileSync } from "node:fs";

const origin = "https://www.sumentakimi.com.tr";
const strings = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/unzip/xl/sharedStrings.xml", "utf8")
  .match(/<si><t>([\s\S]*?)<\/t><\/si>/g)
  .map((s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));
const xml = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/unzip/xl/worksheets/sheet3.xml", "utf8");
const pages = [];
for (const r of xml.matchAll(/<row r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
  const cells = {};
  for (const c of r[2].matchAll(/<c r="([A-Z]+)(\d+)"([^>]*)>(?:<v>([^<]*)<\/v>)?/g)) {
    const attrs = c[3] || "";
    const v = c[4] || "";
    cells[c[1]] = attrs.includes('t="s"') ? strings[Number(v)] : v;
  }
  if (r[1] === "1") continue;
  pages.push({ url: cells.A, clicks: Number(cells.B) || 0, impr: Number(cells.C) || 0 });
}

const products = readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/products.jsonl", "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse)
  .filter((o) => (o.id || "").includes("/Product/"));
const productByHandle = new Map(products.map((p) => [p.handle, p]));

const col = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/collections.json", "utf8"));
const collections = (col.collections?.nodes || []).map((c) => c.handle);
const pagesJson = JSON.parse(readFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/backup/pages-redirects-menus.json", "utf8"));
const pageHandles = new Set((pagesJson.pages?.nodes || []).map((p) => p.handle));
const existingRedirects = new Map((pagesJson.urlRedirects?.nodes || []).map((r) => [r.path.replace(/\/$/, ""), r.target]));

const keepers = {
  "frontpage": "/collections/sumen-takimi",
  "kristal-masa-setleri": "/collections/kristal-sumen-takimlari",
  "makam-panolari-3": "/collections/makam-panolari",
  "kristal-sumen-takimlari-2": "/collections/kristal-sumen-takimlari",
  "dugmeli-makam-panosu": "/collections/makam-panolari",
  "anasayfa-aciklama": "/pages/sumen-takimi-rehberi",
  "adres-ve-konum-bilgisi": "/pages/bize-ulasin",
  "contact": "/pages/bize-ulasin",
  "sumen-takimi-nedir": "/pages/sumen-takimi-rehberi",
  "sumen-takimi-nasil-secilir-10-onemli-kriter": "/blogs/news/sumen-takimi-secerken-nelere-dikkat-edilmeli",
};

function pathOf(u) {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return u;
  }
}

function guess(path) {
  const p = path.replace(/\/$/, "");
  if (p === "" || p === "/") return { target: "/", reason: "home" };
  const slug = p.replace(/^\//, "").replace(/\/$/, "");
  if (keepers[slug]) return { target: keepers[slug], reason: "known-close" };
  if (collections.includes(slug)) return { target: "/collections/" + slug, reason: "collection" };
  if (pageHandles.has(slug)) {
    const h = slug === "contact" ? "bize-ulasin" : slug === "anasayfa-aciklama" ? "sumen-takimi-rehberi" : slug;
    return { target: "/pages/" + h, reason: "page" };
  }
  if (productByHandle.has(slug)) return { target: "/products/" + slug, reason: "product-handle" };
  if (p.startsWith("/blog")) return { target: "/blogs/news", reason: "old-blog" };
  if (p.includes("kullanici-kayit") || p.includes("kullanici-giris")) return { target: "/account/login", reason: "account" };
  const close = [...productByHandle.keys()].find((h) => slug.replace(/-+$/g, "") === h || slug === h + "-" || h.startsWith(slug));
  if (close) return { target: "/products/" + close, reason: "product-fuzzy" };
  return { target: null, reason: "unmapped" };
}

const rows = pages.map((x) => {
  const path = pathOf(x.url);
  const g = guess(path);
  const existing = existingRedirects.get(path) || existingRedirects.get(path + "/") || null;
  return { ...x, path, existing, ...g };
});

writeFileSync("C:/Users/DELL/Desktop/sumentakimi-com-tr/gsc/url-map.json", JSON.stringify(rows, null, 2));
const unmapped = rows.filter((r) => !r.target);
console.log("total", rows.length, "unmapped", unmapped.length);
console.log(unmapped.map((r) => r.clicks + " " + r.impr + " " + r.path).join("\n"));
console.log("\nCLICKED");
rows.filter((r) => r.clicks > 0).forEach((r) => console.log(r.clicks, r.path, "=>", r.target, r.reason, "had", r.existing));
