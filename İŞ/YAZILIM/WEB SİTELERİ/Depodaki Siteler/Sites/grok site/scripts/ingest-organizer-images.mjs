import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { createWorker } from "tesseract.js";
import { readFile } from "node:fs/promises";

const root = join(import.meta.dirname, "..");
const sourceDir = "C:\\Users\\DELL\\Desktop\\Selman\\TASARIM\\ORGANİZER";
const destDir = join(root, "public", "products");
const dry = process.argv.includes("--ocr-only");

function fold(input) {
  return input
    .toLocaleLowerCase("tr")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replaceAll("â", "a")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const ALIASES = [
  ["koltuk arkasi", "7003"],
  ["mama ve aksesuar", "7004"],
  ["premium mama", "7004"],
  ["tiras", "7005"],
  ["arac ici deri evcil", "7006B"],
  ["evcil hayvan seyahat", "7006B"],
  ["evcil hayvan istasyon", "7004"],
  ["evcil hayvan bakim", "7006B"],
  ["evcil bakim", "7006B"],
  ["piknik", "7006"],
  ["askili konsol", "7007"],
  ["katlanir giris konsolu", "7007"],
  ["yatak cebi", "7008"],
  ["yatak yani", "7002"],
  ["yatak kenari deri sarj", "7062"],
  ["kolcak", "7009"],
  ["koltuk kolu", "7009"],
  ["masa yani", "7010"],
  ["koltuk yan", "7010"],
  ["saat standi", "7011"],
  ["ayakkabi banki", "7012"],
  ["canta besigi", "7013"],
  ["masa alti canta askisi", "7013"],
  ["masa alti askı", "7013B"],
  ["masa alti aski", "7013B"],
  ["duvar anahtar", "7015"],
  ["cop kutusu", "7016"],
  ["ofis kagit sepeti", "7016"],
  ["alt raf sepeti", "7016"],
  ["kapakli saklama", "7016B"],
  ["masaustu sarj istasyonu", "7017"],
  ["valet", "7018"],
  ["degerli esya kutusu", "7018"],
  ["dizustu tepsi", "7020"],
  ["doner cocuk kitapligi", "7023"],
  ["dalga formlu cocuk", "7023"],
  ["montessori", "7059"],
  ["cocuk kitap", "7059"],
  ["utu masasi", "7024"],
  ["entegrе utu", "7024"],
  ["entegr utu", "7024"],
  ["model araba", "7025"],
  ["minyatür otomobil", "7025"],
  ["minyatür otomobil", "7025"],
  ["minyatür", "7025"],
  ["robot supurge", "7026"],
  ["katlanir ayakkabi oturagi", "7027"],
  ["katlanir oturak", "7027"],
  ["kompakt deri makyaj", "7028"],
  ["kose makyaj", "7028"],
  ["doner baharat", "7029"],
  ["yag ve baharat", "7066"],
  ["doner banyo", "7030"],
  ["banyo organizeri", "7048"],
  ["sarap sunum", "7031"],
  ["semsiye ve baston", "7032"],
  ["ofis semsiye", "7032"],
  ["luks deri sarj istasyonu", "7033"],
  ["kemer ve saat", "7034"],
  ["doner makyaj kulesi", "7036"],
  ["acik deri degerli", "7037"],
  ["aynali makyaj", "7038"],
  ["duvara monte katlanir makyaj", "7038"],
  ["evye", "7041"],
  ["ekmek", "7043"],
  ["mutfak folyo", "7044"],
  ["sac aleti", "7045"],
  ["banyo cekmece", "7046"],
  ["premium deri cekmece", "7046"],
  ["cekmece ici duzenleyici", "7046"],
  ["banyo duvar", "7047"],
  ["tuvalet", "7049"],
  ["iki bolmeli kagit", "7049"],
  ["cekilebilir deri kemer", "7050"],
  ["luks kemer duzenleyici", "7050"],
  ["giris organizeri", "7051"],
  ["giris istasyonu", "7052"],
  ["katlanir giris", "7007"],
  ["antre", "7053"],
  ["duvara monte kahve", "7056"],
  ["kahve karuseli", "7055"],
  ["kahve istasyonu", "7054"],
  ["kahve organizeri", "7054"],
  ["camasir ve utu", "7057"],
  ["camasir bakim", "7057"],
  ["duvara monte utu", "7058"],
  ["utu dolabi", "7058"],
  ["bes katli deri koleksiyon vitrini", "7061"],
  ["100 model", "7060"],
  ["bes katli deri raf", "7060"],
  ["figür", "7060"],
  ["basucu", "7062"],
  ["yatak kenari deri sarj", "7062"],
  ["kitap destegi", "7062B"],
  ["dergilik", "7063B"],
  ["hol pano", "7063"],
  ["duvar hol", "7063"],
  ["duvar istasyonu", "7063"],
  ["makyaj ve firca", "7064"],
  ["kemerli deri makyaj", "7064"],
  ["luks deri makyaj istasyonu", "7064"],
  ["mendil", "7064B"],
  ["lavabo tepsi", "7065"],
  ["bardak altligi", "7065B"],
  ["yatay evrak", "7066B"],
  ["iki katli belge", "7066B"],
  ["saat ve gozluk", "7067"],
  ["cay kutusu", "7067B"],
  ["cay poseti", "7067B"],
  ["oyun kolu", "7068"],
  ["masaustu oyun", "7068"],
  ["oyun aksesuar", "7068"],
  ["kamera ve lens", "7069"],
  ["dikis", "7070"],
  ["sanat duzenleyicisi", "7071"],
  ["hobi", "7071"],
  ["hediye paketleme", "7072"],
  ["kis aksesuar", "7073"],
  ["sac aksesuari", "7074"],
  ["manikur", "7075"],
  ["kahvalti", "7076"],
  ["catal bicak", "7076"],
  ["atistirmalik", "7077"],
  ["giysi bakim", "7078"],
  ["bakim duzenleyicileri", "7078"],
  ["ayakkabi bakim", "7079"],
  ["canta raf", "7083"],
  ["monitor yukseltici", "7084"],
  ["bilgisayar yukselticisi", "7084"],
  ["cekmeceli yukseltici", "7100"],
  ["dizustu standi", "7085"],
  ["bilgisayar standlari", "7085"],
  ["tablet standi", "7086"],
  ["uclu kulaklik", "7087"],
  ["kavisli kulaklik", "7087"],
  ["kulaklik duzenleyici", "7112"],
  ["kulaklik standi", "7112"],
  ["ikili evrak tepsi", "7088"],
  ["iki katli belge", "7066B"],
  ["dikey dosyalik", "7089"],
  ["dort bolmeli", "7089"],
  ["uc bolmeli klasor", "7089"],
  ["kirtasiye", "7090"],
  ["cok bolmeli masa", "7090"],
  ["alti bolmeli ofis", "7090"],
  ["masaustu notluk", "7091"],
  ["bloknot", "7091"],
  ["kademeli evrak", "7092"],
  ["duvar evrak", "7092"],
  ["yaka karti", "7094"],
  ["numune", "7094"],
  ["masa alti ayaklik", "7103"],
  ["ofis ayakligi", "7103"],
  ["imza platformu", "7101"],
  ["ziyaretci kartligi", "7106"],
  ["uc cepli deri kartlik", "7106"],
  ["kartvizit", "7109"],
  ["canta askisi koleksiyonu", "7013"],
];

const source = await readFile(join(root, "src/lib/products.ts"), "utf8");
const catalog = new Set(
  [...source.matchAll(/sku:\s*"([0-9A-Z]+)"/g)].map((m) => m[1]),
);
const seriesIds = ["set-kompakt", "set-aksesuar", "set-yonetici"];

function aliasSku(file) {
  const f = fold(file.replace(/\.[^.]+$/, ""));
  let best = null;
  for (const [key, sku] of ALIASES) {
    if (f.includes(fold(key)) && (!best || key.length > best.key.length)) {
      best = { key, sku };
    }
  }
  return best?.sku ?? null;
}

function fileSku(file) {
  const m = file.match(/^(\d{4}B?)\b/i);
  if (!m) return null;
  const raw = m[1].toUpperCase();
  return catalog.has(raw) ? raw : null;
}

async function ocrSku(worker, filePath) {
  const meta = await sharp(filePath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const regions = [
    [0, 0.9, 0.22, 1],
    [0, 0.88, 0.3, 1],
  ];
  for (const [x0, y0, x1] of regions) {
    const left = Math.floor(w * x0);
    const top = Math.floor(h * y0);
    const width = Math.max(8, Math.floor(w * (x1 - x0)));
    const height = Math.max(8, h - top);
    const buf = await sharp(filePath)
      .extract({ left, top, width, height })
      .greyscale()
      .normalize()
      .linear(1.5, -30)
      .resize({ width: 480, withoutEnlargement: false })
      .png()
      .toBuffer();
    const { data } = await worker.recognize(buf);
    const text = data.text.replace(/\s+/g, "");
    const found = text.match(/(7\d{3}B?)/i);
    if (!found) continue;
    const sku = found[1].toUpperCase().replace(/B$/, "B");
    const exact = [...catalog].find((s) => s.toLowerCase() === sku.toLowerCase());
    if (exact) return exact;
  }
  return null;
}

function rank(file) {
  const f = fold(file);
  let n = 0;
  if (f.includes("sekiz renkli") || f.includes("sekizli") || f.includes("sekiz renkte")) n += 3;
  if (/\(\d+\)/.test(file)) n -= 2;
  return n;
}

const files = (await readdir(sourceDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
console.log(`OCR ${files.length} files…`);
const worker = await createWorker("eng");
await worker.setParameters({
  tessedit_char_whitelist: "0123456789B",
  tessedit_pageseg_mode: "7",
});

const perFile = [];
for (const file of files) {
  const path = join(sourceDir, file);
  let sku = fileSku(file);
  let why = sku ? "filename" : "";
  if (!sku) {
    sku = await ocrSku(worker, path);
    if (sku) why = "ocr";
  }
  if (!sku) {
    sku = aliasSku(file);
    if (sku) why = "alias";
  }
  perFile.push({ file, sku, why });
  if (perFile.length % 20 === 0) console.log(`  ${perFile.length}/${files.length}`);
}
await worker.terminate();

const assigned = new Map();
const unused = [];
for (const row of perFile) {
  if (!row.sku || (!catalog.has(row.sku) && !seriesIds.includes(row.sku))) {
    unused.push(row);
    continue;
  }
  const prev = assigned.get(row.sku);
  if (!prev || rank(row.file) > rank(prev.file) || (rank(row.file) === rank(prev.file) && row.why === "ocr" && prev.why !== "ocr" && prev.why !== "filename")) {
    if (prev) unused.push({ ...prev, note: `alt for ${row.sku}` });
    assigned.set(row.sku, row);
  } else {
    unused.push({ ...row, note: `alt for ${row.sku}` });
  }
}

const missing = [...catalog].filter((sku) => !assigned.has(sku)).sort();
const report = {
  files: files.length,
  matched: assigned.size,
  missing: missing.length,
  map: Object.fromEntries([...assigned.entries()].sort(([a], [b]) => a.localeCompare(b))),
  missingList: missing,
  unused,
};
await writeFile(join(root, "scripts/organizer-ingest-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(`matched ${assigned.size}/${catalog.size}, missing ${missing.length}`);

if (dry) {
  console.log("missing", missing.join(", "));
  process.exit(0);
}

await mkdir(destDir, { recursive: true });
let written = 0;
for (const [sku, row] of assigned) {
  const src = join(sourceDir, row.file);
  const base = join(destDir, `${sku}.webp`);
  const w800 = join(destDir, `${sku}-800.webp`);
  const w320 = join(destDir, `${sku}-320.webp`);
  await sharp(src).webp({ quality: 84, effort: 4 }).toFile(base);
  await sharp(src)
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(w800);
  await sharp(src)
    .resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(w320);
  written += 1;
  if (written % 15 === 0) console.log(`  wrote ${written}/${assigned.size}`);
}
console.log(`wrote ${written} SKUs × 3 webp, no crop`);
console.log(`missing: ${missing.join(", ") || "none"}`);
