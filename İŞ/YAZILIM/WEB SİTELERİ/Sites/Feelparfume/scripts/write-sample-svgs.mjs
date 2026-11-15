/**
 * 16 örnek ürün için ayrı şişe / set çizimi yazar.
 * Fotoğraf değildir. WebP için ardından build-sample-gallery.mjs çalışır.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/samples");

function doc(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700"><rect width="700" height="700" fill="#E7E1D8"/>${inner}<text x="350" y="662" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#1B1714" opacity="0.38" letter-spacing="5">ÖRNEK</text></svg>\n`;
}

function shadow(y = 580, rx = 150) {
  return `<ellipse cx="350" cy="${y}" rx="${rx}" ry="14" fill="#1B1714" opacity="0.08"/>`;
}

const rose = (x, y) =>
  `<g transform="translate(${x} ${y})" fill="#7C2433"><circle cx="0" cy="-9" r="6"/><circle cx="8" cy="-2" r="6"/><circle cx="-8" cy="-2" r="6"/><circle cx="5" cy="8" r="6"/><circle cx="-5" cy="8" r="6"/><circle cx="0" cy="0" r="4" fill="#F3EFE8"/></g>`;

const files = {
  "fp-001": doc(`
    ${shadow()}
    <rect x="300" y="156" width="100" height="42" fill="#1B1714"/>
    <rect x="324" y="136" width="52" height="24" fill="#3A342F"/>
    <path d="M220 198 h260 v300 a24 24 0 0 1 -24 24 h-212 a24 24 0 0 1 -24 -24 z" fill="#E7B4BC" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <path d="M246 280 h208 v190 a12 12 0 0 1 -12 12 h-184 a12 12 0 0 1 -12 -12 z" fill="#C45B6A"/>
    <rect x="258" y="214" width="18" height="200" rx="9" fill="#fff" opacity=".35"/>
    <rect x="286" y="340" width="128" height="70" fill="#F7F3EE"/>
    ${rose(350, 375)}
  `),
  "fp-002": doc(`
    ${shadow(555, 190)}
    <ellipse cx="350" cy="268" rx="78" ry="26" fill="#3A2A22"/>
    <rect x="292" y="268" width="116" height="40" fill="#3A2A22"/>
    <path d="M140 312 h420 v160 a46 46 0 0 1 -46 46 h-328 a46 46 0 0 1 -46 -46 z" fill="#E6C39A" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <path d="M176 372 h348 v78 a28 28 0 0 1 -28 28 h-292 a28 28 0 0 1 -28 -28 z" fill="#C47A32"/>
    <rect x="250" y="390" width="200" height="52" rx="6" fill="#F7F1E6"/>
    <path d="M310 404 q24 28 48 0 q24 28 48 0" fill="none" stroke="#6B3E1E" stroke-width="3"/>
  `),
  "fp-003": doc(`
    ${shadow(575, 120)}
    <ellipse cx="350" cy="548" rx="100" ry="24" fill="#3E4A34"/>
    <rect x="250" y="196" width="200" height="352" fill="#A8B892" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <rect x="274" y="280" width="152" height="230" fill="#5E7A48"/>
    <ellipse cx="350" cy="196" rx="100" ry="24" fill="#6E8F62"/>
    <rect x="300" y="156" width="100" height="28" fill="#2C3328"/>
    <rect x="328" y="132" width="44" height="28" fill="#1B1714"/>
    <path d="M310 360 h80 M300 384 h100 M314 408 h72" stroke="#F3EFE8" stroke-width="3" fill="none"/>
  `),
  "fp-004": doc(`
    ${shadow(575, 80)}
    <rect x="300" y="118" width="70" height="22" rx="4" fill="#D9D4CC"/>
    <path d="M370 122 h48 v12 h-48 z" fill="#8A847C"/>
    <rect x="316" y="140" width="38" height="48" fill="#C5C0B8"/>
    <rect x="292" y="188" width="86" height="360" rx="20" fill="#D5E7E4" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <rect x="306" y="250" width="58" height="250" rx="12" fill="#3FA3A0"/>
    <rect x="314" y="340" width="42" height="56" fill="#F7F3EE"/>
    <path d="M322 362 q10 -8 20 0 t20 0" fill="none" stroke="#1B6E6C" stroke-width="2"/>
  `),
  "fp-005": doc(`
    ${shadow(575, 180)}
    <rect x="286" y="168" width="128" height="36" fill="#4A3A28"/>
    <rect x="314" y="140" width="72" height="32" fill="#2A241C"/>
    <rect x="160" y="204" width="380" height="330" fill="#2E2926" stroke="#1B1714" stroke-opacity=".35" stroke-width="3"/>
    <rect x="200" y="260" width="300" height="210" fill="#6B2433"/>
    <path d="M280 330 q30 -40 16 -70 M340 340 q28 -36 10 -64 M400 336 q26 -32 8 -58" fill="none" stroke="#E7D3C4" stroke-width="3"/>
  `),
  "fp-006": doc(`
    ${shadow(575, 160)}
    <ellipse cx="350" cy="400" rx="168" ry="200" fill="#F4E7E4" stroke="#C9B2AC" stroke-width="8"/>
    <ellipse cx="350" cy="430" rx="96" ry="120" fill="#E7C8C4"/>
    <rect x="310" y="150" width="80" height="78" rx="16" fill="#F7F4F0" stroke="#DDD4C8" stroke-width="4"/>
    <circle cx="350" cy="400" r="22" fill="none" stroke="#C9B2AC" stroke-width="4"/>
    <circle cx="350" cy="400" r="7" fill="#C9B2AC"/>
  `),
  "fp-007": doc(`
    ${shadow(575, 200)}
    ${[
      [96, 200, "#C45B6A", "#1B1714"],
      [196, 250, "#C47A32", "#3A2A22"],
      [296, 170, "#5E7A48", "#2C3328"],
      [396, 230, "#3FA3A0", "#5C6468"],
      [496, 210, "#6B2433", "#2A241C"],
    ]
      .map(([x, h, liquid, cap]) => {
        const top = 530 - h;
        return `<rect x="${x + 8}" y="${top - 26}" width="28" height="28" fill="${cap}"/><rect x="${x}" y="${top}" width="44" height="${h}" rx="12" fill="#F7F3EE" stroke="#1B1714" stroke-opacity=".25" stroke-width="3"/><rect x="${x + 7}" y="${top + 40}" width="30" height="${h - 56}" rx="6" fill="${liquid}"/>`;
      })
      .join("")}
  `),
  "fp-008": doc(`
    ${shadow()}
    <rect x="150" y="210" width="150" height="46" fill="#1B1714"/>
    <rect x="184" y="186" width="82" height="28" fill="#3A342F"/>
    <path d="M128 256 h194 v250 a16 16 0 0 1 -16 16 h-162 a16 16 0 0 1 -16 -16 z" fill="#E7B4BC" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <path d="M150 330 h150 v140 a8 8 0 0 1 -8 8 h-134 a8 8 0 0 1 -8 -8 z" fill="#C45B6A"/>
    ${rose(225, 300)}
    <rect x="470" y="300" width="36" height="16" rx="3" fill="#D9D4CC"/>
    <path d="M506 302 h22 v8 h-22 z" fill="#8A847C"/>
    <rect x="458" y="316" width="60" height="210" rx="14" fill="#E7B4BC" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <rect x="470" y="370" width="36" height="120" rx="8" fill="#C45B6A"/>
  `),
  "fp-009": doc(`
    ${shadow(575, 130)}
    <rect x="312" y="150" width="76" height="40" rx="6" fill="#3E4A28"/>
    <path d="M300 190 h100 c50 30 120 90 90 200 c-24 90 -50 150 -120 160 h-70 c-80 -8 -110 -90 -80 -170 c28 -90 40 -160 80 -190 z" fill="#C5D39A" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <path d="M330 280 h70 c30 20 60 50 46 100 c-12 46 -30 80 -70 86 h-30 c-40 -6 -60 -46 -46 -90 c16 -50 20 -80 30 -96 z" fill="#7D8F45"/>
    <path d="M250 250 q30 -40 10 -70 q20 30 50 20" fill="#5E7A32"/>
    <path d="M268 214 q18 24 8 40" fill="none" stroke="#3E4A28" stroke-width="3"/>
  `),
  "fp-010": doc(`
    ${shadow()}
    <rect x="312" y="178" width="76" height="36" fill="#1B1714"/>
    <polygon points="350,196 470,270 490,420 410,540 290,540 210,420 230,270" fill="#E7B2A4" stroke="#1B1714" stroke-opacity=".25" stroke-width="3"/>
    <polygon points="350,250 430,300 444,410 390,490 310,490 256,410 270,300" fill="#9C2E2E"/>
    <polygon points="350,330 390,352 390,400 350,422 310,400 310,352" fill="#F3EFE8"/>
  `),
  "fp-011": doc(`
    ${shadow(575, 170)}
    <polygon points="230,188 470,188 500,214 500,236 200,236 200,214" fill="#6E6878"/>
    <polygon points="190,236 250,196 450,196 510,236 510,500 450,546 250,546 190,500" fill="#C9C0D4" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <polygon points="230,300 280,270 420,270 470,300 470,470 420,506 280,506 230,470" fill="#8E79B5"/>
    <path d="M330 360 q10 -28 20 -8 q10 -24 20 4" fill="none" stroke="#F3EFE8" stroke-width="3"/>
  `),
  "fp-012": doc(`
    ${shadow(575, 140)}
    <rect x="304" y="148" width="92" height="34" fill="#2C3328"/>
    <polygon points="292,182 408,182 470,540 230,540" fill="#C3D2AE" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <polygon points="314,250 386,250 430,500 270,500" fill="#5E7A48"/>
    <path d="M320 300 v80 M350 280 v120 M380 310 v70" stroke="#E7F0DC" stroke-width="3"/>
  `),
  "fp-013": doc(`
    ${shadow(575, 160)}
    <ellipse cx="350" cy="168" rx="30" ry="36" fill="#5C3A24"/>
    <rect x="332" y="196" width="36" height="16" fill="#C4A574"/>
    <rect x="320" y="212" width="60" height="90" fill="#E8C49A"/>
    <circle cx="350" cy="420" r="155" fill="#E8C49A" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <circle cx="350" cy="440" r="100" fill="#C47A32"/>
    <path d="M350 360 q16 20 0 36 q-16 -16 0 -36" fill="#F3E2C4"/>
  `),
  "fp-014": doc(`
    ${shadow(575, 70)}
    <rect x="332" y="96" width="36" height="28" fill="#1B1714"/>
    <rect x="324" y="122" width="52" height="24" rx="4" fill="#C9B56A"/>
    <rect x="308" y="146" width="84" height="410" rx="10" fill="#F3E6B0" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <rect x="322" y="230" width="56" height="280" fill="#E2C15A"/>
    <circle cx="350" cy="300" r="10" fill="#F7F3EE"/>
    <circle cx="338" cy="292" r="6" fill="#F7F3EE"/>
    <circle cx="364" cy="294" r="6" fill="#F7F3EE"/>
  `),
  "fp-015": doc(`
    ${shadow(545, 190)}
    <rect x="322" y="196" width="56" height="40" fill="#6E5A78"/>
    <rect x="306" y="232" width="88" height="36" rx="8" fill="#F4EEF6" stroke="#C9B2C8" stroke-width="3"/>
    <ellipse cx="350" cy="400" rx="230" ry="140" fill="#E4D4EA" stroke="#1B1714" stroke-opacity=".2" stroke-width="3"/>
    <ellipse cx="350" cy="412" rx="150" ry="78" fill="#B79BC8"/>
    <ellipse cx="350" cy="400" rx="28" ry="18" fill="#F7F3EE"/>
  `),
  "fp-016": doc(`
    ${shadow()}
    <polygon points="250,150 430,150 470,190 430,230 250,230" fill="#1B1714"/>
    <polygon points="230,230 450,230 500,320 500,540 210,540 210,320" fill="#D5D0CB" stroke="#1B1714" stroke-opacity=".25" stroke-width="3"/>
    <polygon points="270,300 420,300 450,360 450,500 250,500 250,360" fill="#5C534C"/>
    <rect x="390" y="248" width="78" height="16" fill="#9C2E2E"/>
    <circle cx="300" cy="420" r="5" fill="#F3EFE8"/>
    <circle cx="340" cy="450" r="5" fill="#F3EFE8"/>
    <circle cx="380" cy="400" r="5" fill="#F3EFE8"/>
  `),
};

const names = Object.keys(files).sort();
if (names.length !== 16) throw new Error(`expected 16, got ${names.length}`);
for (const name of names) {
  const svg = files[name];
  if (!svg.includes('width="700" height="700"')) throw new Error(`${name}: ground rect missing`);
  await writeFile(path.join(dir, `${name}.svg`), svg);
}
console.log(`wrote ${names.length} svg`);
