// Yayın öncesi statik kontrol. Çalıştır: cd tools && node check.mjs  (build'den sonra)
// Kontroller: yerel bağlantı/görsel var mı, tekil id, şablon artığı, canonical/sitemap tutarlılığı,
// kulüp adı, gizli tasarım sızıntısı, görsel boyut sınırı.
import fs from 'fs';
import path from 'path';
import {createProducts} from '../src/product-core.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/site.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog.json'), 'utf8'));
const grouping = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/product-groups.json'), 'utf8'));
const keywords = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keywords.json'), 'utf8'));
const products = createProducts(data, grouping);
const covers = products.map(product => product.images[0]);
const errors = [];
const fail = msg => errors.push(msg);
const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).filter(e=>!(dir===DIST && ['client','server','.openai','_appgen_meta'].includes(e.name))).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(DIST);
const htmls = files.filter(f => f.endsWith('.html'));
const titles = new Map();
const canonicals = new Map();
const exists = url => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const p = path.join(DIST, clean);
  return fs.existsSync(clean.endsWith('/') ? path.join(p, 'index.html') : p);
};

// katalog
const ids = data.designs.map(d => d.id);
if (new Set(ids).size !== ids.length) fail('catalog: tekrar eden id');
const live = data.designs.filter(d => !d.hidden);
const slugs = live.map(d => d.slug);
if (new Set(slugs).size !== slugs.length) fail('catalog: tekrar eden slug');
if (new Set(covers).size !== covers.length) fail('galeri: tekrar eden kapak görseli');
for (const d of live) if (!data.themes.some(t => t.slug === d.theme)) fail(`catalog: ${d.id} teması yok`);

const banned = /galatasaray|fenerbah|beşiktaş|besiktas|trabzon|taraftar|kanarya|kara kartal/i;
for (const f of htmls) {
  const rel = path.relative(DIST, f);
  const html = fs.readFileSync(f, 'utf8');
  if (/href="\/tasarimlar\/"|href="\/kategori\//.test(html)) fail(`${rel}: kategori bağlantısı kaldı`);
  if (/\{\{[a-zA-Z]/.test(html)) fail(`${rel}: çözülmemiş şablon`);
  if (banned.test(html)) fail(`${rel}: kulüp adı geçiyor`);
  const idList = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(idList).size !== idList.length) fail(`${rel}: tekrar eden id`);
  if (!/<html\b[^>]*\blang="tr"/i.test(html)) fail(`${rel}: html lang=tr yok`);
  if (!/<meta\b[^>]*name="viewport"/i.test(html)) fail(`${rel}: viewport meta yok`);
  const noindex = /name="robots" content="noindex/.test(html);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  if (!title) fail(`${rel}: title yok`);
  else if (titles.has(title) && !noindex && !rel.startsWith('urun')) fail(`${rel}: tekrar eden title (${titles.get(title)})`);
  else if (!noindex) titles.set(title, rel);
  if (!noindex && !/<meta\b[^>]*name="description"[^>]*content="[^"]+"/i.test(html)) fail(`${rel}: meta description yok`);
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) if (!exists(url)) fail(`${rel}: kırık yerel bağlantı ${url}`);
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) for (const part of set.split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/') && !exists(u)) fail(`${rel}: srcset eksik ${u}`); }
  for (const [, id] of html.matchAll(/href="(#[^"]+)"/g)) if (id.length > 1 && !idList.includes(id.slice(1))) fail(`${rel}: sayfa içi hedef yok ${id}`);
  const canon = html.match(/rel="canonical" href="([^"]+)"/);
  if (!canon && !noindex) fail(`${rel}: canonical yok`);
  if (canon && !canon[1].startsWith(site.url)) fail(`${rel}: canonical alan adı farklı`);
  if (canon && !noindex) {
    if (canonicals.has(canon[1])) fail(`${rel}: tekrar eden canonical (${canonicals.get(canon[1])})`);
    else canonicals.set(canon[1], rel);
  }
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (!noindex && !rel.startsWith('urun') && h1Count !== 1) fail(`${rel}: h1 sayısı ${h1Count}`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(tag) || !/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) fail(`${rel}: alt/width/height eksik img`);
  if (/<img\b[^>]*srcset=/.test(html) && /<img\b(?![^>]*sizes=)[^>]*srcset=/.test(html)) fail(`${rel}: srcset var ama sizes yok`);
  for (const [tag] of html.matchAll(/<(?:a|form)\b[^>]*target="_blank"[^>]*>/g)) if (!/\brel="[^"]*noopener/.test(tag)) fail(`${rel}: target=_blank için noopener yok`);
  for (const [, tagName, attrs] of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    if (/\btype="hidden"/.test(attrs)) continue;
    const controlId = attrs.match(/\bid="([^"]+)"/)?.[1];
    if (!controlId || !new RegExp(`<label\\b[^>]*for="${controlId}"`).test(html)) fail(`${rel}: etiketsiz ${tagName}${controlId ? `#${controlId}` : ''}`);
  }
}

// gizli tasarımlar yayına sızmasın
const hiddenImages = new Set(data.designs.filter(d => d.hidden).flatMap(d => d.images));
const liveImages = new Set(live.flatMap(d => d.images));
for (const img of hiddenImages) if (!liveImages.has(img) && fs.existsSync(path.join(DIST, 'assets', `doku-${String(img).padStart(3, '0')}.webp`))) fail(`assets: gizli görsel yayında ${img}`);

// sitemap
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (new Set(locs).size !== locs.length) fail('sitemap: tekrar eden adres');
for (const loc of locs) if (!exists(loc.replace(site.url, ''))) fail(`sitemap: sayfa yok ${loc}`);
for (const d of products) if (!locs.includes(`${site.url}/tasarim/${d.slug}/`)) fail(`sitemap: ürün eksik ${d.slug}`);
if (locs.some(loc => /\/(?:tasarimlar|kategori)\//.test(loc))) fail('sitemap: kategori adresi kaldı');
for (const rel of ['tasarimlar/index.html', 'mekanlar/index.html']) {
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  if (!/name="robots" content="noindex/.test(html) || !/url=\/galeri\//.test(html)) fail(`${rel}: galeri yönlendirmesi eksik`);
}
for (const d of live.filter(source=>!products.some(product=>product.slug===source.slug))) {
  const alias = path.join(DIST, 'tasarim', d.slug, 'index.html');
  if (!fs.existsSync(alias)) fail(`alias: eski tasarım adresi yok ${d.slug}`);
  else if (!/name="robots" content="noindex/.test(fs.readFileSync(alias,'utf8'))) fail(`alias: noindex yok ${d.slug}`);
  if (locs.includes(`${site.url}/tasarim/${d.slug}/`)) fail(`sitemap: eski alias listelenmiş ${d.slug}`);
}
for (const f of htmls) { const rel = path.relative(DIST, f).split(path.sep).join('/'); const html = fs.readFileSync(f, 'utf8'); const noindex = /name="robots" content="noindex/.test(html); if (!noindex && /rel="canonical"/.test(html) && !locs.includes(site.url + '/' + rel.replace(/index\.html$/, ''))) fail(`sitemap: canonical sayfa eksik ${rel}`); }

// Galeri: her gerçek ürün tek kart; bütün görseller arama JSON'unda korunmalı.
const gallery = fs.readFileSync(path.join(DIST, 'galeri', 'index.html'), 'utf8');
const galleryCards = (gallery.match(/\bdata-gallery-item\b/g) || []).length;
if (galleryCards !== products.length) fail(`galeri: ${galleryCards} kart var, ${products.length} ürün bekleniyor`);
const galleryIds = [...gallery.matchAll(/<li\b[^>]*\bdata-gallery-item\b[^>]*\bdata-design-id="([^"]+)"/g)].map(match=>match[1]);
if (new Set(galleryIds).size !== galleryIds.length || galleryIds.length !== products.length) fail('galeri: ürün kartları tekil değil');
for (const product of products) if (!galleryIds.includes(product.id)) fail(`galeri: ürün kartı eksik ${product.id}`);
for (const id of ['gallery-search', 'gallery-query', 'gallery-count', 'gallery-empty']) if (!gallery.includes(`id="${id}"`)) fail(`galeri: ${id} denetimi yok`);
for (const id of ['gallery-place', 'gallery-theme']) if (gallery.includes(`id="${id}"`)) fail(`galeri: kategori denetimi kalmış: ${id}`);
if (gallery.includes('DOKU seçkisi')) fail('galeri: kaldırılan başlık kalmış');

// tedarikçi adı dışarı çıkmaz (yalnız DOKU YÖNETİM'de tutulur)
const supplier = /g[üu]nder/i;
const walkAll = dir => fs.existsSync(dir) ? fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? walkAll(path.join(dir, e.name)) : [path.join(dir, e.name)]) : [];
for (const f of walkAll(DIST)) { if (supplier.test(f)) fail(`tedarikçi adı dosya adında: ${path.relative(DIST, f)}`); else if (/\.(html|js|mjs|json|xml|txt|css|webmanifest)$/.test(f) && supplier.test(fs.readFileSync(f, 'utf8'))) fail(`tedarikçi adı yayında: ${path.relative(DIST, f)}`); }
for (const f of ['data/materials.json', 'data/site.json', 'data/catalog.json', 'data/keywords.json', 'server/static-pages.json']) { const p = path.join(ROOT, f); if (fs.existsSync(p) && supplier.test(fs.readFileSync(p, 'utf8'))) fail(`tedarikçi adı veride: ${f}`); }

// boyut sınırları
for (const f of files.filter(f => /assets[\\/]doku-\d{3}\.webp$/.test(f))) if (fs.statSync(f).size > 205 * 1024) fail(`${path.basename(f)} 200 KB üstü`);
for (const f of files.filter(f => /\.(png)$/.test(f))) fail(`${path.relative(DIST, f)}: PNG kaldı`);

if (errors.length) { console.error(errors.join('\n')); console.error(`\nHATA: ${errors.length}`); process.exit(1); }
await import('./search-check.mjs');
await import('./group-check.mjs');
console.log(`GEÇTİ: ${htmls.length} HTML, ${locs.length} sitemap adresi, ${live.length} kaynak, ${products.length} ürün; etiketler aramada kaldı, kategori sayfaları kaldırıldı.`);
