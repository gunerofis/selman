import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const sourceDir = "C:\\Users\\DELL\\Desktop\\Selman\\TASARIM\\ORGANİZER";
const destDir = join(root, "public", "products");
const report = JSON.parse(await readFile(join(root, "scripts/organizer-ingest-report.json"), "utf8"));

const FORCE = {
  "Sekiz renkli deri masa düzenleyici koleksiyonu.png": "7017",
  "Sekiz renkli duvar tipi deri düzenleyici.png": "7047",
  "Sekiz renkli premium deri eşya istasyonu.png": "7011",
  "Sekiz renkli kompakt deri makyaj düzenleyicisi.png": "7064",
  "Sekiz renkli deri mendil kutusu koleksiyonu.png": "7064B",
  "Sekiz renkli deri kitap desteği koleksiyonu.png": "7062B",
  "Sekiz renkli deri çay kutusu.png": "7067B",
  "Sekiz renkli deri dergilik koleksiyonu.png": "7063B",
  "Sekiz renkli deri bardak altlığı koleksiyonu.png": "7065B",
};

const SKIP_FILES = new Set([
  "Yirmi parçalık koyu kahverengi deri ofis seti.png",
  "Yirmi Parçalı Koyu Kahverengi Ofis Koleksiyonu.png",
]);

const catalog = new Set(
  [...(await readFile(join(root, "src/lib/products.ts"), "utf8")).matchAll(/sku:\s*"([0-9A-Z]+)"/g)].map(
    (m) => m[1],
  ),
);

const assigned = new Map();
for (const [sku, row] of Object.entries(report.map)) {
  if (SKIP_FILES.has(row.file)) continue;
  assigned.set(sku, row.file);
}

for (const [file, sku] of Object.entries(FORCE)) {
  if (!catalog.has(sku)) continue;
  for (const [s, f] of assigned) {
    if (f === file && s !== sku) assigned.delete(s);
  }
  assigned.set(sku, file);
}

let written = 0;
const done = [];
for (const [sku, file] of [...assigned.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const src = join(sourceDir, file);
  await sharp(src).webp({ quality: 84, effort: 4 }).toFile(join(destDir, `${sku}.webp`));
  await sharp(src)
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(join(destDir, `${sku}-800.webp`));
  await sharp(src)
    .resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(join(destDir, `${sku}-320.webp`));
  written += 1;
  done.push({ sku, file });
  if (written % 15 === 0) console.log(`wrote ${written}/${assigned.size}`);
}

const missing = [...catalog].filter((sku) => !assigned.has(sku)).sort();
await writeFile(
  join(root, "scripts/organizer-convert-report.json"),
  JSON.stringify({ written, missing, done }, null, 2),
  "utf8",
);
console.log(`wrote ${written} SKUs × 3 (full frame, no crop)`);
console.log(`still missing: ${missing.join(", ") || "none"}`);
