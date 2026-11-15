/**
 * Örnek SVG'lerden şişe / kutu / yakın plan WebP üretir (1500, 800, 320).
 * Kaynak SVG silinmez. Zemin #F3EFE8.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "samples");
const GROUND = "#F3EFE8";
const WIDTHS = [1500, 800, 320];

function hexOf(raw) {
  let h = raw.toLowerCase();
  if (h.length === 4) h = `#${[...h.slice(1)].map((c) => c + c).join("")}`;
  return h;
}

function lum(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function bodyFill(svg) {
  const fills = [...svg.matchAll(/fill="(#[0-9A-Fa-f]{3,8})"/g)].map((m) => hexOf(m[1]));
  const bg = fills[0];
  for (const hex of fills) {
    if (hex === bg) continue;
    const y = lum(hex);
    if (y > 0.92 || y < 0.24) continue;
    return hex;
  }
  return "#7C2433";
}

function mix(hex, other, t) {
  const parse = (h) => {
    const n = Number.parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const a = parse(hex);
  const b = parse(other);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function cleanSvg(svg) {
  return svg
    .replace(
      /<rect width="700" height="700" fill="#[0-9A-Fa-f]{3,8}"\s*\/>/,
      `<rect width="700" height="700" fill="${GROUND}"/>`,
    )
    .replace(/<text\b[^>]*>ÖRNEK GÖRSEL<\/text>/g, "");
}

function cartonSvg(fill, id) {
  const lid = mix(fill, GROUND, 0.45);
  const edge = mix(fill, "#1B1714", 0.35);
  const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700"><rect width="700" height="700" fill="${GROUND}"/>`;
  const shadow = `<ellipse cx="350" cy="590" rx="160" ry="14" fill="#1B1714" opacity="0.08"/>`;
  const end = `</svg>`;
  const body = {
    "fp-001": `${shadow}<rect x="200" y="170" width="300" height="390" fill="${fill}"/><rect x="200" y="170" width="300" height="70" fill="${lid}"/><rect x="248" y="300" width="204" height="28" fill="${GROUND}"/>`,
    "fp-002": `${shadow}<rect x="150" y="280" width="400" height="250" rx="18" fill="${fill}"/><rect x="150" y="280" width="400" height="48" fill="${lid}"/><rect x="210" y="380" width="280" height="24" fill="${GROUND}"/>`,
    "fp-003": `${shadow}<ellipse cx="350" cy="540" rx="120" ry="28" fill="${edge}"/><rect x="230" y="180" width="240" height="360" fill="${fill}"/><ellipse cx="350" cy="180" rx="120" ry="28" fill="${lid}"/>`,
    "fp-004": `${shadow}<rect x="270" y="140" width="160" height="430" rx="12" fill="${fill}"/><rect x="270" y="140" width="160" height="46" fill="${lid}"/><rect x="300" y="250" width="100" height="16" fill="${GROUND}"/>`,
    "fp-005": `${shadow}<path d="M170 250 h360 v300 h-360 z M170 250 l40 -50 h280 l40 50" fill="${fill}" stroke="${edge}" stroke-width="8"/><rect x="230" y="360" width="240" height="20" fill="${GROUND}"/>`,
    "fp-006": `${shadow}<path d="M230 220 h240 v80 c40 40 40 200 0 250 h-240 c-40 -50 -40 -210 0 -250 z" fill="${fill}"/><rect x="250" y="300" width="200" height="18" fill="${GROUND}"/>`,
    "fp-007": `${shadow}<rect x="110" y="310" width="480" height="190" rx="16" fill="${fill}"/>${[150, 230, 310, 390, 470].map((x, i) => `<rect x="${x}" y="${250 - (i % 2) * 24}" width="58" height="${70 + (i % 2) * 24}" fill="${lid}"/>`).join("")}`,
    "fp-008": `${shadow}<rect x="175" y="200" width="350" height="350" fill="${fill}"/><rect x="325" y="200" width="50" height="350" fill="${lid}"/><rect x="175" y="350" width="350" height="50" fill="${lid}"/><path d="M290 188 q60 -78 120 0 q-24 54 -60 46 q-36 8 -60 -46 z" fill="${lid}"/>`,
    "fp-009": `${shadow}<rect x="185" y="190" width="330" height="360" rx="28" fill="${fill}"/><circle cx="350" cy="370" r="78" fill="${GROUND}"/><circle cx="350" cy="370" r="48" fill="${lid}"/>`,
    "fp-010": `${shadow}<polygon points="350,160 520,250 490,520 210,520 180,250" fill="${fill}"/><polygon points="350,230 430,280 410,450 290,450 270,280" fill="${GROUND}"/>`,
    "fp-011": `${shadow}<polygon points="190,230 250,180 450,180 510,230 510,500 450,550 250,550 190,500" fill="${fill}"/><rect x="250" y="320" width="200" height="22" fill="${GROUND}"/>`,
    "fp-012": `${shadow}<rect x="180" y="200" width="340" height="350" fill="${fill}"/><rect x="180" y="270" width="340" height="22" fill="${edge}"/><rect x="180" y="340" width="340" height="22" fill="${edge}"/><rect x="180" y="410" width="340" height="22" fill="${edge}"/>`,
    "fp-013": `${shadow}<ellipse cx="350" cy="390" rx="170" ry="170" fill="${fill}"/><ellipse cx="350" cy="250" rx="70" ry="28" fill="${lid}"/><rect x="318" y="180" width="64" height="70" fill="${lid}"/>`,
    "fp-014": `${shadow}<rect x="300" y="120" width="100" height="450" rx="8" fill="${fill}"/><rect x="300" y="120" width="100" height="40" fill="${lid}"/><rect x="324" y="220" width="52" height="14" fill="${GROUND}"/>`,
    "fp-015": `${shadow}<rect x="120" y="250" width="460" height="240" rx="24" fill="${fill}"/><rect x="120" y="250" width="460" height="40" fill="${lid}"/><ellipse cx="350" cy="390" rx="70" ry="36" fill="${GROUND}"/>`,
    "fp-016": `${shadow}<polygon points="200,200 500,200 540,280 500,540 180,540 180,280" fill="${fill}"/><path d="M210 230 l250 280" stroke="${GROUND}" stroke-width="16"/>`,
  }[id];
  if (!body) throw new Error(`box shape: ${id}`);
  return `${head}${body}${end}`;
}

async function master(svg) {
  return sharp(Buffer.from(svg)).resize(1500, 1500, { fit: "contain", background: GROUND }).png().toBuffer();
}

async function closeup(svg, id) {
  const big = 2200;
  const preset = {
    "fp-002": [0.34, 0.5],
    "fp-006": [0.24, 0.58],
    "fp-007": [0.28, 0.7],
    "fp-013": [0.16, 0.52],
    "fp-015": [0.26, 0.64],
  };
  const [topRatio, sizeRatio] = preset[id] ?? [0.18, 0.56];
  const crop = Math.round(big * sizeRatio);
  const left = Math.round((big - crop) / 2);
  const top = Math.round(big * topRatio);
  const rendered = await sharp(Buffer.from(svg))
    .resize(big, big, { fit: "contain", background: GROUND })
    .png()
    .toBuffer();
  return sharp(rendered).extract({ left, top, width: crop, height: crop }).resize(1500, 1500).png().toBuffer();
}

async function emit(name, png) {
  const bytes = {};
  for (const width of WIDTHS) {
    const file = width === 1500 ? `${name}.webp` : `${name}-${width}.webp`;
    const out = path.join(dir, file);
    const buf = await sharp(png).resize(width, width).webp({ quality: width === 320 ? 78 : 82 }).toBuffer();
    await sharp(buf).toFile(out);
    const meta = await sharp(out).metadata();
    if (meta.width !== width || meta.height !== width || meta.format !== "webp") {
      throw new Error(`${file}: ${meta.width}x${meta.height} ${meta.format}`);
    }
    bytes[file] = buf.length;
  }
  return bytes;
}

const files = (await readdir(dir)).filter((f) => /^fp-\d+\.svg$/i.test(f)).sort();
if (files.length !== 16) throw new Error(`expected 16 sample svg, found ${files.length}`);

let total = 0;
for (const file of files) {
  const id = file.replace(/\.svg$/i, "");
  const svg = cleanSvg(await readFile(path.join(dir, file), "utf8"));
  if (svg.includes("ÖRNEK GÖRSEL")) throw new Error(`${file}: caption remains`);
  if (!svg.includes(`fill="${GROUND}"`)) throw new Error(`${file}: ground missing`);
  const bottle = await master(svg);
  const box = await master(cartonSvg(bodyFill(svg), id));
  const near = await closeup(svg, id);
  const written = {
    ...(await emit(`${id}-sise`, bottle)),
    ...(await emit(`${id}-kutu`, box)),
    ...(await emit(`${id}-yakin`, near)),
  };
  total += Object.values(written).reduce((n, v) => n + v, 0);
  console.log(`${id} ${Object.entries(written).map(([k, v]) => `${k}:${v}`).join(" ")}`);
}
console.log(`files ${files.length * 9} bytes ${total}`);
