// Görsel hazırlığı: her doku-NNN.webp için 900 px sürüm üretir, 200 KB üstü büyük sürümleri
// yeniden sıkıştırır, özel proje PNG'lerini WebP'ye çevirir. Tekrar çalıştırmak güvenlidir.
import fs from 'fs'; import path from 'path'; import sharp from 'sharp';
sharp.cache(false); // Windows'ta açık dosya kilidini önler
const dir = path.resolve('../dist/assets');
const root = path.resolve('..');
const heroSource = path.join(root, 'assets/hero/doku-hero-v2.png');
if (fs.existsSync(heroSource)) {
  await sharp(heroSource).resize({width: 1800, withoutEnlargement: true}).webp({quality: 80, effort: 6}).toFile(path.join(dir, 'hero-doku-v2.webp'));
  await sharp(heroSource).resize({width: 900, withoutEnlargement: true}).webp({quality: 76, effort: 6}).toFile(path.join(dir, 'hero-doku-v2-900.webp'));
}
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
// New original concepts retain their source outside the public output.
const selectedId = process.argv[2];
const originals = catalog.designs.filter(d => !d.hidden && (d.sourceImage || d.sourceImages) && (!selectedId || d.id === selectedId));
if (selectedId && !originals.length) throw Error('Görsel üretilecek tasarım bulunamadı');
for (const design of originals) {
 for (const [index, source] of (design.sourceImages || [design.sourceImage]).entries()) {
  const input = path.resolve(root, source);
  if (!input.startsWith(root + path.sep)) throw Error('Görsel kaynağı proje dışında');
  if (!design.images[index]) throw Error('Kaynak görselin katalog kodu yok');
  const key = String(design.images[index]).padStart(3, '0');
  await sharp(input).resize({width: 1800, withoutEnlargement: true}).webp({quality: 78, effort: 6}).toFile(path.join(dir, `doku-${key}.webp`));
  await sharp(input).resize({width: 900, withoutEnlargement: true}).webp({quality: 74, effort: 6}).toFile(path.join(dir, `doku-${key}-900.webp`));
  await sharp(input).resize(360, 360, {fit: 'cover'}).webp({quality: 74, effort: 6}).toFile(path.join(dir, `thumb-${key}.webp`));
 }
}
const LIMIT = 200 * 1024;
const selectedImages = new Set(originals.flatMap(d => d.images.map(i => `doku-${String(i).padStart(3, '0')}.webp`)));
const files = fs.readdirSync(dir).filter(f => /^doku-\d{3}\.webp$/.test(f) && (!selectedId || selectedImages.has(f)));
let made = 0, squeezed = 0;
for (const f of files) {
  const src = path.join(dir, f), mid = src.replace('.webp', '-900.webp');
  if (!fs.existsSync(mid)) { await sharp(fs.readFileSync(src)).resize({width: 900, height: 900, fit: 'inside'}).webp({quality: 74}).toFile(mid); made++; }
  if (fs.statSync(src).size > LIMIT) {
    const buf = await sharp(fs.readFileSync(src)).webp({quality: 72, effort: 6}).toBuffer();
    if (buf.length < fs.statSync(src).size) { fs.writeFileSync(src, buf); squeezed++; }
  }
}
for (const [from, to] of [['ozel-proje-cizim.png', 'ozel-proje-cizim'], ['ozel-proje-uygulama-yeni.png', 'ozel-proje-uygulama']]) {
  const src = path.join(dir, from);
  if (!fs.existsSync(src)) continue;
  await sharp(fs.readFileSync(src)).resize({width: 1400, withoutEnlargement: true}).webp({quality: 76, effort: 6}).toFile(path.join(dir, to + '.webp'));
  await sharp(fs.readFileSync(src)).resize({width: 900}).webp({quality: 74}).toFile(path.join(dir, to + '-900.webp'));
  fs.unlinkSync(src);
}
console.log(`900 px: ${made}, yeniden sıkıştırılan: ${squeezed}`);
