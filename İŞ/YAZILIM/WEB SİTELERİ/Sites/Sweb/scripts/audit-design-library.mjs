import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceRoot = "C:/Users/Guner Office/Desktop/Güner Ofis/03 TASARIM";
const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));

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
  return { path, exact, dhash: bits };
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

function sumenPartKey(path) {
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
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/^ana sümen$/u, "kapaksız sümen");
}

const report = {};
for (const mapping of mappings) {
  const sourcePaths = [
    ...(await Promise.all(mapping.sources.map((dir) => images(join(sourceRoot, dir))))).flat(),
    ...(mapping.files ?? []).map((file) => join(sourceRoot, file)),
  ].filter(
    (path) => sourceFolder(path) !== "SUMEN PARÇALAR" || !/toplu[_ ]onizleme/i.test(basename(path)),
  );
  const publicPaths = [
    ...(await images(join(publicRoot, mapping.publicDir))),
    ...(await images(join(publicRoot, "tasarimlar", mapping.line))),
  ];
  const source = await Promise.all(sourcePaths.map(fingerprint));
  const published = await Promise.all(publicPaths.map(fingerprint));
  const seenExact = new Set();
  const seenSumenProducts = new Set();
  const unique = source.filter((item) => {
    if (seenExact.has(item.exact)) return false;
    seenExact.add(item.exact);
    if (sourceFolder(item.path) === "SUMEN PARÇALAR") {
      const key = sumenPartKey(item.path);
      if (seenSumenProducts.has(key)) return false;
      seenSumenProducts.add(key);
    }
    return true;
  });
  const nearest = unique.map((item) => {
    let best = null;
    for (const target of published) {
      const d = distance(item.dhash, target.dhash);
      if (!best || d < best.distance) best = { path: target.path, distance: d };
    }
    return {
      source: relative(sourceRoot, item.path),
      nearest: best ? relative(publicRoot, best.path) : null,
      distance: best?.distance ?? null,
    };
  });
  report[mapping.line] = {
    sourceFiles: source.length,
    exactUnique: unique.length,
    exactDuplicates: source.length - unique.length,
    currentPublicImages: published.length,
    nearestDistanceCounts: Object.fromEntries(
      [...new Set(nearest.map((item) => item.distance))]
        .sort((a, b) => a - b)
        .map((d) => [String(d), nearest.filter((item) => item.distance === d).length]),
    ),
    matchedAt4: nearest.filter((item) => item.distance <= 4).length,
    unmatchedAt4: nearest.filter((item) => item.distance > 4),
  };
}

const productSource = await readFile(new URL("../src/lib/products.ts", import.meta.url), "utf8");
const referencedNames = new Set(
  [...productSource.matchAll(/image:\s*"\/products\/([^"]+)"/g)].map((match) => match[1]),
);
const productImages = await Promise.all(
  (await images(join(publicRoot, "products"))).map(fingerprint),
);
const referencedProducts = productImages.filter((item) => referencedNames.has(basename(item.path)));
report.productOrphans = productImages
  .filter(
    (item) => !referencedNames.has(basename(item.path)) && !/-320|-800/.test(basename(item.path)),
  )
  .map((item) => {
    let best = null;
    for (const target of referencedProducts.filter(
      (candidate) => !/-320|-800/.test(basename(candidate.path)),
    )) {
      const d = distance(item.dhash, target.dhash);
      if (!best || d < best.distance) best = { file: basename(target.path), distance: d };
    }
    return { file: basename(item.path), nearest: best };
  });

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
