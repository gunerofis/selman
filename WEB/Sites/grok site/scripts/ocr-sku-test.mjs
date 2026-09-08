import sharp from "sharp";
import { createWorker } from "tesseract.js";
import { join } from "node:path";

const dir = "C:\\Users\\DELL\\Desktop\\Selman\\TASARIM\\ORGANİZER";
const files = [
  "7050 sekiz renkli çekilebilir deri kemer düzenleyici.png",
  "Sekiz renkli lüks deri ayakkabı bankı.png",
  "Sekiz renkli lüks koltuk arkası düzenleyici.png",
];

const worker = await createWorker("eng");
await worker.setParameters({
  tessedit_char_whitelist: "0123456789B",
  tessedit_pageseg_mode: "7",
});

const regions = [
  [0, 0.9, 0.22, 1],
  [0, 0.88, 0.3, 1],
  [0, 0.93, 0.14, 1],
];

for (const file of files) {
  const meta = await sharp(join(dir, file)).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  console.log(file, `${w}x${h}`);
  for (const [x0, y0, x1, y1] of regions) {
    const left = Math.floor(w * x0);
    const top = Math.floor(h * y0);
    const width = Math.max(8, Math.floor(w * (x1 - x0)));
    const height = Math.max(8, h - top);
    const buf = await sharp(join(dir, file))
      .extract({ left, top, width, height })
      .greyscale()
      .normalize()
      .linear(1.6, -40)
      .resize({ width: 480, withoutEnlargement: false })
      .png()
      .toBuffer();
    const { data } = await worker.recognize(buf);
    console.log(`  ${width}x${height} => ${JSON.stringify(data.text.replace(/\s+/g, " ").trim())}`);
  }
}

await worker.terminate();
