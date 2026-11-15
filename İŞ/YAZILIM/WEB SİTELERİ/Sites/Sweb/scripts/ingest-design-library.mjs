import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceRoot = "C:/Users/Guner Office/Desktop/Güner Ofis/03 TASARIM";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = join(projectRoot, "public");
const outputRoot = join(publicRoot, "tasarimlar");
const generatedFile = join(projectRoot, "src", "lib", "imported-designs.ts");
const matchThreshold = 4;
const existingCatalogDirs = ["products", "organizer", "slac", "clik", "desq"];

const mappings = [
  { line: "slac", sources: ["GİFTBOX"], publicDir: "slac" },
  { line: "clik", sources: ["MÜCEVHER", "SAAT"], publicDir: "clik" },
  {
    line: "desq",
    sources: ["MACBOOK KILIF", "OFİS SETLERİ", "SÜMEN", "SUMEN PARÇALAR", "GERÇEK DERİ"],
    publicDir: "desq",
  },
  { line: "sweb", sources: ["ORGANİZER"], publicDir: "organizer" },
];

async function images(root) {
  const out = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.(?:png|jpe?g|webp)$/i.test(entry.name)) out.push(path);
    }
  }
  await walk(root);
  return out.sort((a, b) => a.localeCompare(b, "tr"));
}

async function fingerprint(path) {
  const data = await readFile(path);
  const exact = createHash("sha256").update(data).digest("hex");
  const { data: pixels } = await sharp(data)
    .rotate()
    .resize(9, 8, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let bits = 0n;
  let bit = 0n;
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      if (pixels[y * 9 + x] > pixels[y * 9 + x + 1]) bits |= 1n << bit;
      bit += 1n;
    }
  }
  return { path, data, exact, dhash: bits };
}

function distance(a, b) {
  let value = a ^ b;
  let count = 0;
  while (value) {
    value &= value - 1n;
    count += 1;
  }
  return count;
}

function sourceFolder(path) {
  const parts = relative(sourceRoot, path).split(/[\\/]/);
  return parts.length === 1 ? "TASARIM" : parts[0];
}

function isGenericStem(stem) {
  return /^(?:chatgpt image|image(?: \(\d+\))?|image-gen|grok[-_ ]image|edited-image|\d{7,})(?:[ _(-].*)?$/i.test(
    stem,
  );
}

function cleanStem(path) {
  return basename(path, extname(path))
    .replace(/\s*\(\d+\)$/u, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSumenPartStem(path) {
  return basename(path, extname(path))
    .replace(/^\d{4}_/u, "")
    .replace(
      /^(?:Ek_Revizyonlar_ve_Genis_Plan_v1|Final_26_Urun_4_Renk_Birlikte_v1|Final_26_Urun_Seti_v1|Final_27_Urun_4_Renk_Birlikte_v1|Parti(?:_\d+)?)__/u,
      "",
    )
    .replace(/^Alternatifler__/u, "")
    .replace(/^\d{2}_/u, "")
    .replace(/_4_Renk_v\d+$/u, "")
    .replace(/_Kahve_v\d+_\d+mm_MDF$/u, "")
    .replace(/_Kahve(?:_\d+mm_MDF)?_v\d+(?:_.*)?$/u, "")
    .replace(/_Arkaplan_Duzeltme_v\d+$/u, "")
    .replace(/_Kahve_\d+mm_MDF_v\d+_arkaplan_duzeltildi$/u, "")
    .replace(/_v\d+(?:_.*)?$/u, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productName(path, folder) {
  return folder === "SUMEN PARÇALAR" ? cleanSumenPartStem(path) : cleanStem(path);
}

function productNameKey(name) {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9çğıöşü]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^ana sümen$/u, "kapaksız sümen");
}

function fallbackLabel(line, folder) {
  if (line === "slac") return "SLAC Hediye Kutusu Tasarımı";
  if (line === "clik")
    return folder === "MÜCEVHER" ? "CLIK Mücevher Kutusu Tasarımı" : "CLIK Saat Kutusu Tasarımı";
  if (folder === "MACBOOK KILIF") return "DESQ MacBook Kılıfı Tasarımı";
  if (folder === "SÜMEN") return "DESQ Sümen Takımı Tasarımı";
  if (folder === "GERÇEK DERİ") return "DESQ Gerçek Deri Ürün Tasarımı";
  if (line === "desq") return "DESQ Ofis Seti Tasarımı";
  return "SWEB Organizer Tasarımı";
}

function filterFor(line, folder, name) {
  const value = name.toLocaleLowerCase("tr-TR");
  if (line === "slac") return "set";
  if (line === "clik") return folder === "MÜCEVHER" ? "mucevher" : "saat";
  if (line === "desq") {
    if (folder === "SUMEN PARÇALAR") return "sumen-parcalari";
    if (folder === "GERÇEK DERİ") return "gercek-deri";
    return folder === "MACBOOK KILIF" ? "aksesuar" : "set";
  }
  if (/banyo|lavabo|saç|manikür|parfüm/.test(value)) return "banyo";
  if (/mutfak|kahve|çay|baharat|şarap|çatal|kahvaltı|atıştırmalık/.test(value)) return "mutfak";
  if (/makyaj|ruj|oje/.test(value)) return "makyaj";
  if (/çocuk|montessori/.test(value)) return "cocuk";
  if (/giriş|antre|duvar|şemsiye/.test(value)) return "giris";
  if (/araç|evcil|mama/.test(value)) return "arac-pet";
  if (/masa|ofis|evrak|dosya|kart|dizüstü|tablet|monitör|kulaklık|yazıcı/.test(value))
    return "ofis";
  return "genel";
}

const imported = [];
const report = [];
const published = await Promise.all(
  (await Promise.all(existingCatalogDirs.map((dir) => images(join(publicRoot, dir)))))
    .flat()
    .map(fingerprint),
);
for (const mapping of mappings) {
  const sourcePaths = [
    ...(
      await Promise.all(mapping.sources.map((folder) => images(join(sourceRoot, folder))))
    ).flat(),
    ...(mapping.files ?? []).map((file) => join(sourceRoot, file)),
  ].filter(
    (path) => sourceFolder(path) !== "SUMEN PARÇALAR" || !/toplu[_ ]onizleme/i.test(basename(path)),
  );
  const source = await Promise.all(sourcePaths.map(fingerprint));
  const exactSeen = new Set();
  const acceptedHashes = [];
  const acceptedProductNames = new Set();
  let matched = 0;
  let duplicate = 0;
  let importedIndex = 0;
  for (const item of source) {
    if (exactSeen.has(item.exact)) {
      duplicate += 1;
      continue;
    }
    exactSeen.add(item.exact);
    const folder = sourceFolder(item.path);
    const stem = productName(item.path, folder);
    const productKey = productNameKey(stem);
    if (folder === "SUMEN PARÇALAR" && acceptedProductNames.has(productKey)) {
      duplicate += 1;
      continue;
    }
    const alreadyPublished = published.some(
      (target) => distance(item.dhash, target.dhash) <= matchThreshold,
    );
    if (alreadyPublished) {
      matched += 1;
      continue;
    }
    if (acceptedHashes.some((hash) => distance(item.dhash, hash) <= 1)) {
      duplicate += 1;
      continue;
    }
    acceptedHashes.push(item.dhash);
    if (folder === "SUMEN PARÇALAR") acceptedProductNames.add(productKey);
    importedIndex += 1;
    const name = isGenericStem(stem)
      ? `${fallbackLabel(mapping.line, folder)} ${String(importedIndex).padStart(2, "0")}`
      : stem;
    const id = `tas-${item.exact.slice(0, 12)}`;
    const assetDir = join(outputRoot, mapping.line);
    await mkdir(assetDir, { recursive: true });
    const largeName = `${id}-960.webp`;
    const smallName = `${id}-480.webp`;
    await sharp(item.data)
      .rotate()
      .resize({ width: 960, height: 960, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(join(assetDir, largeName));
    await sharp(item.data)
      .rotate()
      .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(join(assetDir, smallName));
    imported.push({
      id,
      line: mapping.line,
      name,
      image: `/tasarimlar/${mapping.line}/${largeName}`,
      imageSrcSet: `/tasarimlar/${mapping.line}/${smallName} 480w, /tasarimlar/${mapping.line}/${largeName} 960w`,
      filter: filterFor(mapping.line, folder, name),
      code: `TAS-${item.exact.slice(0, 6).toUpperCase()}`,
      sourceFolder: folder,
    });
  }
  report.push({
    line: mapping.line,
    source: source.length,
    matched,
    imported: importedIndex,
    duplicate,
  });
}

const source =
  `// Generated by scripts/ingest-design-library.mjs. Do not edit by hand.\n` +
  `export type ImportedDesign = {\n` +
  `  id: string;\n  line: "sweb" | "slac" | "clik" | "desq";\n` +
  `  name: string;\n  image: string;\n  imageSrcSet: string;\n  filter: string;\n` +
  `  code: string;\n  sourceFolder: string;\n};\n\n` +
  `export const IMPORTED_DESIGNS: ImportedDesign[] = ${JSON.stringify(imported, null, 2)};\n`;
await writeFile(generatedFile, source, "utf8");
const referencedAssets = new Set(
  imported.flatMap((item) =>
    [...item.imageSrcSet.matchAll(/\/tasarimlar\/[^/]+\/([^ ,]+\.webp)/g)].map(
      (match) => match[1],
    ),
  ),
);
for (const mapping of mappings) {
  const assetDir = join(outputRoot, mapping.line);
  for (const file of await readdir(assetDir)) {
    if (!referencedAssets.has(file)) await unlink(join(assetDir, file));
  }
}
process.stdout.write(`${JSON.stringify({ report, totalImported: imported.length }, null, 2)}\n`);
