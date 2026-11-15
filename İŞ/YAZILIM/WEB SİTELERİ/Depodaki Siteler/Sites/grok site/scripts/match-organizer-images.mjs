import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const sourceDir = "C:\\Users\\DELL\\Desktop\\Selman\\TASARIM\\ORGANİZER";

function fold(input) {
  return input
    .toLocaleLowerCase("tr")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("i", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replaceAll("â", "a")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const STOP = new Set(
  fold(
    "sekiz renkli sekizli renkli luks premium deri koleksiyonu koleksiyon koleksiyonlar koleksiyonlari duvara monte duvar tipi cok parcali yirmi parcali koyu kahverengi ofis seti seti seti icin icin ve veya ile bir iki uc dort bes alti yedi dokuz on entegre minimalist mat bos acik formlu dengeli merkezi kulplu katli katli katli",
  ).split(" "),
);

function tokens(input) {
  return fold(input)
    .split(" ")
    .filter((t) => t.length >= 3 && !STOP.has(t) && !/^\d+$/.test(t));
}

const source = await readFile(join(root, "src/lib/products.ts"), "utf8");
const products = [
  ...source.matchAll(
    /sku:\s*"(?<sku>[0-9A-Z]+)"[\s\S]*?name:\s*"(?<name>[^"]+)"[\s\S]*?shortName:\s*"(?<short>[^"]+)"/g,
  ),
].map(({ groups }) => ({
  sku: groups.sku,
  name: groups.name,
  short: groups.short,
  tokens: [...new Set([...tokens(groups.name), ...tokens(groups.short)])],
}));

const files = (await readdir(sourceDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

const skuInName = /^(\d{4}[A-Z]?)\b/;
const assigned = new Map(); // sku -> {file, score, why}
const unused = [];

function scoreFile(file, product) {
  const base = file.replace(/\.[^.]+$/, "");
  const fileTokens = tokens(base);
  if (fileTokens.length === 0) return 0;
  let hits = 0;
  for (const t of product.tokens) {
    if (fileTokens.includes(t) || fileTokens.some((f) => f.includes(t) || t.includes(f))) hits += 1;
  }
  const nameFold = fold(product.name);
  const fileFold = fold(base);
  if (fileFold.includes(nameFold) || nameFold.split(" ").every((w) => w.length < 3 || fileFold.includes(w))) {
    hits += 4;
  }
  return hits;
}

for (const file of files) {
  const skuMatch = file.match(skuInName);
  if (skuMatch && products.some((p) => p.sku === skuMatch[1])) {
    const sku = skuMatch[1];
    const prev = assigned.get(sku);
    if (!prev || prev.score < 99) assigned.set(sku, { file, score: 99, why: "filename-sku" });
    continue;
  }

  let best = null;
  for (const p of products) {
    const s = scoreFile(file, p);
    if (s <= 0) continue;
    if (!best || s > best.score) best = { sku: p.sku, score: s, name: p.name };
  }
  if (best && best.score >= 2) {
    const prev = assigned.get(best.sku);
    if (!prev || best.score > prev.score) {
      assigned.set(best.sku, { file, score: best.score, why: "name" });
    } else {
      unused.push({ file, note: `alt for ${best.sku} score ${best.score}` });
    }
  } else {
    unused.push({ file, note: best ? `weak ${best.sku}:${best.score}` : "no match" });
  }
}

const missing = products.filter((p) => !assigned.has(p.sku)).map((p) => ({ sku: p.sku, name: p.name }));

const report = {
  products: products.length,
  files: files.length,
  matched: assigned.size,
  missing: missing.length,
  unused: unused.length,
  map: Object.fromEntries(
    [...assigned.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([sku, v]) => [sku, v]),
  ),
  missingList: missing,
  unusedList: unused,
};

await writeFile(join(root, "scripts/organizer-match-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(
  JSON.stringify(
    {
      products: report.products,
      files: report.files,
      matched: report.matched,
      missing: report.missing,
      unused: report.unused,
    },
    null,
    2,
  ),
);
console.log("\nMISSING");
for (const m of missing) console.log(`${m.sku}\t${m.name}`);
console.log("\nUNUSED");
for (const u of unused) console.log(`${u.file}\t${u.note}`);
