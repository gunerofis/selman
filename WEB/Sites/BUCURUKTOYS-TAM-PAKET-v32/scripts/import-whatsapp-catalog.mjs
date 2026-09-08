import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = resolve(process.argv[2] ?? "");
const catalogPath = join(repoRoot, "lib", "whatsapp-catalog-20260807.json");
const productRoot = join(repoRoot, "public", "products");
const sourceArchiveRoot = join(repoRoot, "catalog-sources", "whatsapp-2026-08-07");
const originalRoot = join(sourceArchiveRoot, "product-originals");
const quarantineRoot = join(sourceArchiveRoot, "quarantine-originals");

if (!process.argv[2]) {
  throw new Error("Kaynak klasör gerekli: node scripts/import-whatsapp-catalog.mjs <klasör>");
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const productItems = [
  ...catalog.newProducts.map((item) => ({ ...item, outputImage: item.image, kind: "new-product" })),
  ...catalog.existingProductUpdates.map((item) => ({ ...item, outputImage: item.galleryImage, kind: "existing-product-gallery" })),
];
const quarantinedItems = catalog.quarantinedMedia;

const sha256 = async (path) => createHash("sha256").update(await readFile(path)).digest("hex");
const identify = (path) => {
  const result = spawnSync("identify", ["-format", "%w %h", path], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Görsel ölçüsü okunamadı: ${path}\n${result.stderr}`);
  const [width, height] = result.stdout.trim().split(/\s+/).map(Number);
  if (!width || !height) throw new Error(`Geçersiz görsel ölçüsü: ${path}`);
  return { width, height };
};
const convertImage = (input, output, max, quality) => {
  const result = spawnSync("convert", [input, "-auto-orient", "-strip", "-resize", `${max}x${max}>`, "-quality", String(quality), output], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Görsel türevi oluşturulamadı: ${input}\n${result.stderr}`);
};

await Promise.all([
  mkdir(productRoot, { recursive: true }),
  mkdir(join(productRoot, "320"), { recursive: true }),
  mkdir(join(productRoot, "540"), { recursive: true }),
  mkdir(originalRoot, { recursive: true }),
  mkdir(quarantineRoot, { recursive: true }),
]);

const sourceFiles = (await readdir(sourceRoot)).filter((file) => /\.jpe?g$/i.test(file)).sort();
const classifiedSources = [...productItems.map((item) => item.sourceImage), ...quarantinedItems.map((item) => item.sourceFile)].sort();
const duplicateSources = classifiedSources.filter((file, index, all) => all.indexOf(file) !== index);
const missingFromClassification = sourceFiles.filter((file) => !classifiedSources.includes(file));
const missingFromArchive = classifiedSources.filter((file) => !sourceFiles.includes(file));

if (duplicateSources.length || missingFromClassification.length || missingFromArchive.length) {
  throw new Error(JSON.stringify({ duplicateSources, missingFromClassification, missingFromArchive }, null, 2));
}
if (productItems.length !== 62 || sourceFiles.length !== 65) {
  throw new Error(`Beklenmeyen sayım: ${productItems.length} ürün görseli, ${sourceFiles.length} JPG`);
}

const integrityItems = [];
for (const item of productItems) {
  const source = join(sourceRoot, item.sourceImage);
  const preserved = join(originalRoot, item.sourceImage);
  const rootOutput = join(productRoot, item.outputImage);
  const output320 = join(productRoot, "320", item.outputImage);
  const output540 = join(productRoot, "540", item.outputImage);

  await copyFile(source, preserved);
  convertImage(source, rootOutput, 1200, 92);
  convertImage(source, output320, 320, 84);
  convertImage(source, output540, 540, 88);

  const sourceHash = await sha256(source);
  const preservedHash = await sha256(preserved);
  if (sourceHash !== preservedHash) throw new Error(`Orijinal dosya doğrulaması başarısız: ${item.sourceImage}`);

  const originalDimensions = identify(source);
  const rootDimensions = identify(rootOutput);
  const ratioDelta = Math.abs(
    originalDimensions.width / originalDimensions.height - rootDimensions.width / rootDimensions.height,
  );
  if (ratioDelta > 0.01) throw new Error(`En-boy oranı değişti: ${item.sourceImage}`);

  integrityItems.push({
    sku: item.sku,
    kind: item.kind,
    sourceFile: item.sourceImage,
    outputFile: item.outputImage,
    sourceSha256: sourceHash,
    preservedSha256: preservedHash,
    originalDimensions,
    catalogDimensions: rootDimensions,
    responsiveDimensions: { "320": identify(output320), "540": identify(output540) },
    cropped: false,
    originalPreservedByteForByte: true,
    status: "verified",
  });
}

for (const item of quarantinedItems) {
  await copyFile(join(sourceRoot, item.sourceFile), join(quarantineRoot, item.sourceFile));
}

const dimensions = {};
for (const file of (await readdir(productRoot)).filter((file) => file.endsWith(".webp")).sort()) {
  const { width, height } = identify(join(productRoot, file));
  dimensions[file] = [width, height];
}

const integrity = {
  generatedAt: new Date().toISOString(),
  sourceArchive: basename(sourceRoot),
  counts: {
    archiveJpgFiles: sourceFiles.length,
    productImages: productItems.length,
    newProducts: catalog.newProducts.length,
    existingProductMatches: catalog.existingProductUpdates.length,
    quarantinedImages: quarantinedItems.length,
  },
  policy: {
    originals: "JPEG dosyaları byte-for-byte korunmuştur.",
    derivatives: "Kırpma uygulanmadan 320, 540 ve en fazla 1200 piksel WebP türevleri oluşturulmuştur.",
    missingValues: "Kaynağında doğrulanamayan alanlar DOLDURULACAK olarak işaretlenmiştir.",
  },
  items: integrityItems,
  quarantinedMedia: quarantinedItems,
};

await Promise.all([
  writeFile(join(repoRoot, "lib", "product-image-dimensions.json"), `${JSON.stringify(dimensions, null, 2)}\n`),
  writeFile(join(sourceArchiveRoot, "integrity.json"), `${JSON.stringify(integrity, null, 2)}\n`),
]);

console.log(JSON.stringify({
  imported: integrityItems.length,
  preservedOriginals: integrityItems.filter((item) => item.originalPreservedByteForByte).length,
  responsiveSets: integrityItems.length,
  quarantined: quarantinedItems.length,
  dimensionsIndexed: Object.keys(dimensions).length,
}, null, 2));
