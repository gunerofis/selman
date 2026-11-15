import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { GUNER_WATCH_IMAGE_URLS } from "./import-guner-watch-box-images.mjs";

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "public", "gunerofis-watch-boxes");
const BACKGROUND = path.join(IMAGE_DIR, "studio-background.png");
const only = process.argv[2]?.toLowerCase();

function isEdgeBackground(r, g, b, a) {
  if (a < 16) return true;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return r > 248 && g > 248 && b > 248 && spread < 7;
}

async function extractProduct(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const enqueue = (index) => {
    if (seen[index]) return;
    const offset = index * channels;
    if (!isEdgeBackground(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) return;
    seen[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  // Cam kapağın içinde kalan geniş beyaz stüdyo alanı kenara bağlı değildir.
  // Yalnızca büyük, kapalı beyaz bileşenleri de arka plan say; kadran ve
  // açık renkli ürün detaylarını koru.
  const largeInteriorThreshold = Math.round(width * height * 0.02);
  for (let seed = 0; seed < width * height; seed += 1) {
    if (seen[seed]) continue;
    const seedOffset = seed * channels;
    if (
      !isEdgeBackground(
        data[seedOffset],
        data[seedOffset + 1],
        data[seedOffset + 2],
        data[seedOffset + 3],
      )
    ) {
      continue;
    }

    head = 0;
    tail = 0;
    seen[seed] = 2;
    queue[tail++] = seed;

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x + 1 < width ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y + 1 < height ? index + width : -1,
      ];

      for (const neighbor of neighbors) {
        if (neighbor < 0 || seen[neighbor]) continue;
        const offset = neighbor * channels;
        if (
          !isEdgeBackground(
            data[offset],
            data[offset + 1],
            data[offset + 2],
            data[offset + 3],
          )
        ) {
          continue;
        }
        seen[neighbor] = 2;
        queue[tail++] = neighbor;
      }
    }

    const mark = tail >= largeInteriorThreshold ? 1 : 3;
    for (let index = 0; index < tail; index += 1) seen[queue[index]] = mark;
  }

  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;
  const rgba = Buffer.from(data);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * channels;
    if (seen[index]) rgba[offset + 3] = 0;
    if (rgba[offset + 3] > 12) {
      const x = index % width;
      const y = Math.floor(index / width);
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  const trimWidth = right - left + 1;
  const trimHeight = bottom - top + 1;
  const cutout = await sharp(rgba, { raw: { width, height, channels } })
    .extract({ left, top, width: trimWidth, height: trimHeight })
    .png()
    .toBuffer();

  return { cutout, width: trimWidth, height: trimHeight };
}

async function fetchOfficialSource(stem, fallback) {
  const url = GUNER_WATCH_IMAGE_URLS[stem];
  if (!url) return fallback;

  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function restyle(input) {
  const stem = path.basename(input, "-960.webp");
  const output960 = path.join(IMAGE_DIR, `${stem}-studio-960.webp`);
  const output480 = path.join(IMAGE_DIR, `${stem}-studio-480.webp`);
  const source = await fetchOfficialSource(stem, input);
  const product = await extractProduct(source);
  const scale = Math.min(850 / product.width, 620 / product.height);
  const width = Math.round(product.width * scale);
  const height = Math.round(product.height * scale);
  const left = Math.round((960 - width) / 2);
  const top = Math.round(650 - height);
  const shadowWidth = Math.round(width * 0.78);
  const shadowLeft = Math.round((960 - shadowWidth) / 2);

  const background = await sharp(BACKGROUND).resize(960, 720, { fit: "cover" }).webp({ quality: 90 }).toBuffer();
  const resizedProduct = await sharp(product.cutout)
    .resize(width, height, { fit: "fill" })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
  const shadow = Buffer.from(
    `<svg width="960" height="720" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b"><feGaussianBlur stdDeviation="15"/></filter></defs><ellipse cx="${shadowLeft + shadowWidth / 2}" cy="638" rx="${shadowWidth / 2}" ry="25" fill="#4b311f" fill-opacity=".22" filter="url(#b)"/></svg>`,
  );

  await sharp(background)
    .composite([
      { input: shadow, left: 0, top: 0 },
      { input: resizedProduct, left, top },
    ])
    .webp({ quality: 88, smartSubsample: true })
    .toFile(output960);

  await sharp(output960).resize(480, 360).webp({ quality: 84, smartSubsample: true }).toFile(output480);
  console.log(`${stem}: source ${product.width}x${product.height} -> ${width}x${height}`);
}

const files = (await fs.readdir(IMAGE_DIR))
  .filter((name) => name.endsWith("-960.webp") && !name.includes("-studio-"))
  .filter((name) => !only || name.startsWith(only));

for (const file of files) await restyle(path.join(IMAGE_DIR, file));
