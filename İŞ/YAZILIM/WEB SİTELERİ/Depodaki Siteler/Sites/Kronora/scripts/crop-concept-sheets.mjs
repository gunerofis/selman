import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const models = [
  "tekli-saat-seyahat-kupu",
  "ikili-saat-seyahat-kutusu",
  "dortlu-saat-kutusu",
  "sekizli-cam-kapakli-saat-kutusu",
  "on-ikili-cekmeceli-saat-kutusu",
  "saat-ve-yuzuk-organizeri",
  "saat-ve-kol-dugmesi-organizeri",
  "uclu-gozluk-kutusu",
  "altili-gozluk-kutusu",
  "airpods-anahtar-valesi",
  "komodin-saat-valesi",
  "iki-katli-taki-saat-kutusu",
  "dikey-saat-kulesi",
  "evrak-aksesuar-portfoyu",
];

const outputDirectory = process.argv[2];
const sheetArgs = process.argv.slice(3);
if (!outputDirectory || sheetArgs.length !== 5) {
  throw new Error("usage: node scripts/crop-concept-sheets.mjs OUTPUT color=sheet.png ...");
}

await mkdir(outputDirectory, { recursive: true });

for (const sheetArg of sheetArgs) {
  const separator = sheetArg.indexOf("=");
  const color = sheetArg.slice(0, separator);
  const sheetPath = sheetArg.slice(separator + 1);
  if (!color || !sheetPath) throw new Error(`invalid sheet argument: ${sheetArg}`);
  const image = sharp(sheetPath);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error(`missing dimensions: ${sheetPath}`);

  for (let index = 0; index < models.length; index += 1) {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const leftEdge = Math.round(column * metadata.width / 4);
    const rightEdge = Math.round((column + 1) * metadata.width / 4);
    const topEdge = Math.round(row * metadata.height / 4);
    const bottomEdge = Math.round((row + 1) * metadata.height / 4);
    const inset = 3;
    await sharp(sheetPath)
      .extract({ left: leftEdge + inset, top: topEdge + inset, width: rightEdge - leftEdge - inset * 2, height: bottomEdge - topEdge - inset * 2 })
      .resize(720, 720, { fit: "contain", background: "#f7f2eb" })
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(outputDirectory, `${models[index]}-${color}.webp`));
  }
}

console.log(`${models.length * sheetArgs.length} concept variants created in ${outputDirectory}`);
