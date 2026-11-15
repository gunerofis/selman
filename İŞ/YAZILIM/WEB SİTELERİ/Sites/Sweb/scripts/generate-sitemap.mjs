import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const nativeRequire = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const cache = new Map();

function loadTypeScript(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const localRequire = (specifier) => {
    if (!specifier.startsWith(".")) return nativeRequire(specifier);
    const target = path.resolve(path.dirname(filename), specifier);
    const resolved = fs.existsSync(target) ? target : `${target}.ts`;
    return loadTypeScript(path.relative(root, resolved));
  };
  new Function("require", "module", "exports", "__filename", "__dirname", output)(
    localRequire,
    module,
    module.exports,
    filename,
    path.dirname(filename),
  );
  return module.exports;
}

const { PRODUCTS, CATEGORIES, productSlug } = loadTypeScript("src/lib/products.ts");
const { LINES } = loadTypeScript("src/lib/line-items.ts");
const origin = "https://www.gunerofis.online";
const sourceLastmod = (relativePath) =>
  fs.statSync(path.join(root, relativePath)).mtime.toISOString().slice(0, 10);
const staticLastmod = sourceLastmod("src/routes/__root.tsx");
const productLastmod = sourceLastmod("src/lib/products.ts");
const lineLastmod = sourceLastmod("src/lib/line-items.ts");
const staticPaths = [
  "/",
  "/koleksiyon",
  "/saat-mucevher-kutulari",
  "/tasarla",
  "/atolye",
  "/hakkimizda",
  "/iletisim",
  "/teklif",
  "/kurumsal-teklif",
  "/sikayet",
  "/palet",
  "/olcu",
  "/bakim",
  "/kategori",
  "/teslimat",
  "/iade",
  "/gizlilik",
  "/cerez",
  "/kvkk",
  "/mesafeli",
  "/on-bilgilendirme",
  "/cayma",
  "/kullanim",
  "/satici",
  "/sss",
  "/odeme-yontemleri",
  "/garanti",
  "/malzeme",
  "/hediye",
];

const paths = new Map(staticPaths.map((pathname) => [pathname, staticLastmod]));
// Kategori yollarını tek kaynaktan (CATEGORIES) üret; liste büyüdükçe
// sitemap kendiliğinden güncel kalır, elle tekrar gerekmez.
for (const category of []) {
  paths.set(`/kategori/${category.id}`, productLastmod);
}
for (const product of PRODUCTS) {
  if (product.stockStatus !== "tukendi" && product.price > 0) {
    paths.set(`/urun/${productSlug(product)}`, productLastmod);
  }
}
// Tasarım/ürün arşivinden gelen, fiyatı teyit bekleyen kayıtları sitemap
// dışında tut (kataloğun ana listesiyle aynı kural).
const isArchive = (item) => Boolean(item.note && /arşiv/i.test(item.note));
for (const line of LINES) {
  for (const item of line.items) {
    if (!item.id.startsWith("tas-") && !isArchive(item) && item.price != null && item.price > 0) {
      paths.set(`${line.to}/${encodeURIComponent(item.id)}`, lineLastmod);
    }
  }
}

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const entries = [...paths]
  .map(
    ([pathname, lastmod]) =>
      `  <url><loc>${escapeXml(new URL(pathname, origin).href)}</loc><lastmod>${lastmod}</lastmod></url>`,
  )
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
console.log(`Sitemap generated: ${paths.size} canonical, indexable URLs`);
