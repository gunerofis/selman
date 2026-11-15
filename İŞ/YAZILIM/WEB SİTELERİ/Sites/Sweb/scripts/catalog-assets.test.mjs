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

import test from "node:test";
import assert from "node:assert/strict";
const { LINES, findLineItem } = loadTypeScript("src/lib/line-items.ts");
const { CLIK_PRODUCTS } = loadTypeScript("src/lib/clik-products.ts");
const { GUNER_WATCH_PRODUCTS } = loadTypeScript("src/lib/guner-watch-products.ts");
const { REAL_LEATHER_WATCH_PRODUCTS } = loadTypeScript(
  "src/lib/real-leather-watch-products.ts",
);
const { PRODUCTS, CATEGORIES } = loadTypeScript("src/lib/products.ts");
const { IMPORTED_DESIGNS } = loadTypeScript("src/lib/imported-designs.ts");
const { searchSite } = loadTypeScript("src/lib/site-search.ts");
const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
test("only watch and jewelry products remain across catalog sources", () => {
  assert.deepEqual(
    LINES.map((line) => line.key),
    ["clik"],
  );
  assert.ok(CLIK_PRODUCTS.length >= 40);
  assert.equal(GUNER_WATCH_PRODUCTS.length, 30);
  assert.ok(GUNER_WATCH_PRODUCTS.every((item) => item.availability === "out-of-stock"));
  assert.deepEqual(
    REAL_LEATHER_WATCH_PRODUCTS.map((item) => item.code),
    ["G039", "G040", "G041", "G044", "G045", "G046", "G049"],
  );
  assert.ok(
    REAL_LEATHER_WATCH_PRODUCTS.every(
      (item) =>
        item.filter === "saat" &&
        item.filterTags?.includes("gercek-deri") &&
        item.availability === "inquiry-only",
    ),
  );
  assert.equal(PRODUCTS.length, 0);
  assert.equal(CATEGORIES.length, 0);
  assert.ok(IMPORTED_DESIGNS.length > 0);
  assert.ok(IMPORTED_DESIGNS.every((item) => item.line === "clik"));
  assert.ok(LINES[0].items.every((item) => ["saat", "mucevher"].includes(item.filter)));
  for (const p of CLIK_PRODUCTS) assert.ok(LINES[0].items.some((item) => item.id === p.code));
  for (const p of GUNER_WATCH_PRODUCTS) assert.ok(LINES[0].items.some((item) => item.id === p.id));
  for (const p of REAL_LEATHER_WATCH_PRODUCTS)
    assert.ok(LINES[0].items.some((item) => item.id === p.id), p.id);
});
test("product IDs and all referenced images are valid", () => {
  const items = LINES[0].items;
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  for (const item of items) {
    assert.ok(fs.existsSync(path.join(root, "public", item.image)), item.image);
    for (const entry of (item.imageSrcSet ?? "").split(",")) {
      const image = entry.trim().split(" ")[0];
      if (image) assert.ok(fs.existsSync(path.join(root, "public", image)), image);
    }
  }
});
test("removed products cannot be found through direct lookup or search", () => {
  assert.equal(findLineItem("/organizer", "utu-masasi"), null);
  assert.equal(findLineItem("/ofis", "sade-sik-sumen-takimi"), null);
  for (const id of [
    "gercek-deri-g047",
    "gercek-deri-g048",
    "gercek-deri-st0026",
    "gercek-deri-st0027",
    "gercek-deri-st0028",
    "gercek-deri-st0029",
    "gercek-deri-st0030",
    "gercek-deri-st0031",
    "gercek-deri-st0032",
    "gercek-deri-st0033",
    "gercek-deri-st0034",
    "gercek-deri-st0035",
  ])
    assert.equal(findLineItem("/saat-mucevher-kutulari", id), null, id);
  for (const q of ["organizer", "sümen"]) assert.deepEqual(searchSite(q), []);
  assert.ok(searchSite("gerçek deri").length > 0);
  assert.ok(searchSite("saat").length > 0);
  assert.ok(searchSite("mücevher").length > 0);
});
test("removed product assets are absent from public output", () => {
  for (const dir of [
    "products",
    "organizer",
    "slac",
    "desq",
    "tasarimlar/sweb",
    "tasarimlar/slac",
    "tasarimlar/desq",
  ]) {
    assert.equal(fs.existsSync(path.join(root, "public", dir)), false, dir);
  }
  for (const code of [
    "g047",
    "g048",
    "st0026",
    "st0027",
    "st0028",
    "st0029",
    "st0030",
    "st0031",
    "st0032",
    "st0033",
    "st0034",
    "st0035",
  ])
    for (const width of [480, 960])
      assert.equal(
        fs.existsSync(path.join(root, "public", "gercek-deri-saat", `${code}-${width}.webp`)),
        false,
        `${code}-${width}.webp`,
      );
});
test("sitemap contains all priced boxes and no removed families", () => {
  assert.doesNotMatch(sitemap, /\/(organizer|ofis|hediye-setleri|baby|urun)\//);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(urls).size, urls.length);
  for (const p of CLIK_PRODUCTS)
    assert.ok(
      urls.includes(
        "https://www.gunerofis.online/saat-mucevher-kutulari/" + encodeURIComponent(p.code),
      ),
      p.code,
    );
  for (const p of GUNER_WATCH_PRODUCTS)
    assert.ok(
      urls.includes(
        "https://www.gunerofis.online/saat-mucevher-kutulari/" + encodeURIComponent(p.id),
      ),
      p.id,
    );
  for (const p of REAL_LEATHER_WATCH_PRODUCTS)
    assert.ok(
      !urls.includes(
        "https://www.gunerofis.online/saat-mucevher-kutulari/" + encodeURIComponent(p.id),
      ),
      p.id,
    );
});
