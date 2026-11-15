// DOKU site üretimi. Tek kaynak: data/catalog.json + data/site.json + src/.
// Çalıştır: cd tools && node build.mjs   (önce bir kez: node images.mjs)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import {createProducts} from '../src/product-core.mjs';
sharp.cache(false);

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const assembly = read('src/montaj.html');
const site = JSON.parse(read('data/site.json'));
const data = JSON.parse(read('data/catalog.json'));
const materials = JSON.parse(read('data/materials.json'));
const pricing = JSON.parse(read('data/pricing.json'));
const tl = n => new Intl.NumberFormat('tr-TR').format(n) + ' TL';
const priceMin = pricing.items[0].m2, priceMax = pricing.items.at(-1).m2;
const priceData = () => `<script id="price-data" type="application/json">${JSON.stringify({montaj: pricing.montaj, items: pricing.items.map(x => [x.collection, x.family, x.m2])}).replace(/</g, '\\u003c')}</script>`;
const priceList = () => `<details class="price-list"><summary>Kaplama m² fiyatları</summary><ul>${pricing.items.map(x => `<li><button type="button" data-price-pick="${esc(x.collection)}"><span>${esc(x.collection)} <small>${esc(x.family)}</small></span><b>${tl(x.m2)}</b></button></li>`).join('')}</ul></details>`;
// Galeri ana kategorileri (Faris kararı 05.11.2026). Tasarım; mekân alanı veya koleksiyonuyla eşleşir.
const GALLERY_CATS = [
  {slug: 'kurumsal', name: 'Kurumsal', areas: ['ofis', 'vezne', 'buro', 'isletme', 'magaza', 'otel', 'lobi', 'karsilama', 'kafe-restoran', 'studyo', 'mimari-tasarim'], collections: ['İşletme']},
  {slug: 'ev', name: 'Ev', areas: ['yatak-odasi', 'salon', 'cocuk-bebek', 'ev'], collections: ['Çocuk']},
  {slug: 'ortak-alan', name: 'Ortak alan', areas: ['ortak-alan', 'avm', 'kres', 'hastane'], collections: []},
  {slug: 'dis-mekan', name: 'Dış mekan', areas: ['dis-mekan'], collections: []},
];
const grouping = JSON.parse(read('data/product-groups.json'));
const sources = data.designs.filter(d => !d.hidden);
const designs = createProducts(data, grouping);
const sourceForImage = new Map(sources.flatMap(d => d.images.map(n => [n, d])));
const designNameCounts = new Map();
for (const d of designs) designNameCounts.set(d.name, (designNameCounts.get(d.name) || 0) + 1);
const hiddenDesigns = data.designs.filter(d => d.hidden);
const themes = data.themes.map(t => ({...t, designs: designs.filter(d => d.theme === t.slug || d.collection === t.includeCollection || d.sourceIds.some(id => t.designIds?.includes(id)))})).filter(t => t.designs.length);
const byId = Object.fromEntries(sources.map(d => [d.id, designs.find(p => p.images.includes(d.images[0]))]));
const areaData = JSON.parse(read('data/areas.json'));
// Gizli tasarımlar alanda atlanır; katalogda hiç olmayan kod hata verir.
for (const area of areaData) for (const id of area.designs) if (!data.designs.some(d => d.id === id)) throw Error(`Alan için geçersiz tasarım: ${area.slug} / ${id}`);
// Kapak tasarımı gizliyse alan listesindeki ilk görünür tasarım kapak olur.
const areas = areaData.map(area => ({
  ...area,
  designs: designs.filter(d => d.collection === area.collection || d.sourceIds.some(id => area.designs.includes(id)))
})).map(area => area.designs.includes(byId[area.cover]) ? area : {...area, cover: areaData.find(a => a.slug === area.slug).designs.find(id => area.designs.includes(byId[id])) ?? area.designs[0]?.sourceIds[0]});
const areaUrl = area => `/alan/${area.slug}/`;
if (new Set(areas.map(area => area.slug)).size !== areas.length) throw Error('Tekrar eden alan adresi.');
for (const area of areas) {
  if (!area.designs.length || !area.designs.includes(byId[area.cover])) throw Error(`Alan boş veya kapak tasarımı eksik: ${area.slug}`);
}
for (const d of designs) if (!areas.some(area => area.designs.includes(d))) throw Error(`Tasarım bir alana bağlı değil: ${d.id}`);
const today = new Date().toISOString().slice(0, 10);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(3, '0');
const keywords = JSON.parse(read('data/keywords.json'));
const imageCode = img => `G-${pad(img)}`;
const validTerms = list => Array.isArray(list) && list.length > 0 && list.every(term => typeof term === 'string' && term.trim() === term && term.length > 0 && !/\s/u.test(term)) && new Set(list).size === list.length;
for (const d of designs) if (!validTerms(keywords.productGroups?.[d.id])) throw Error(`Ürün grubu anahtar kelimeleri eksik: ${d.id}`);
for (const code of Object.keys(keywords.productGroups ?? {})) if (!grouping.products.some(group => group.id === code)) throw Error(`Katalog dışı ürün grubu etiketi: ${code}`);
for (const d of sources) {
  if (!validTerms(keywords.products[d.id])) throw Error(`Ürün anahtar kelimeleri eksik: ${d.id}`);
  for (const img of d.images) {
    const tags = keywords.images[imageCode(img)];
    for (const field of ['colors', 'forms', 'subjects', 'styles', 'tones', 'keywords']) if (!validTerms(tags?.[field])) throw Error(`Görsel etiketi eksik: ${d.id} / ${imageCode(img)} / ${field}`);
    if (tags.colors.includes('renk') || tags.forms.includes('duvar kompozisyonu') || tags.styles.includes('konsept') || tags.tones.includes('renk tonları')) throw Error(`Genel görsel etiketi kalmış: ${d.id} / ${imageCode(img)}`);
  }
}
const liveCodes = new Set(designs.flatMap(d => d.images.map(imageCode)));
const catalogCodes = new Set(data.designs.flatMap(d => [...d.images, ...(d.removedImages ?? []).map(r => r.image)].map(imageCode)));
for (const code of Object.keys(keywords.images)) if (!catalogCodes.has(code)) throw Error(`Katalog dışı görsel etiketi: ${code}`);
for (const code of Object.keys(keywords.products)) if (!data.designs.some(d => d.id === code)) throw Error(`Katalog dışı ürün etiketi: ${code}`);
const baseKeywords = (d, img = d.images[0]) => [...new Set([...keywords.productGroups[d.id], d.collection.toLocaleLowerCase('tr-TR'), ...(d.applicationType === 'tam-duvar' ? ['tam duvar kaplama'] : []),
  ...(d.affiliation ? [d.affiliation === 'TR' ? 'ülke' : 'takım', ...d.name.split(/\s+/u)] : [])])];
const searchKeywords = (d, img) => {
  const tags = keywords.images[imageCode(img)];
  return [...new Set([...tags.colors, ...tags.forms, ...tags.subjects, ...tags.styles, ...tags.tones, ...tags.keywords,
    ...baseKeywords(d, img), ...(d.materialCodes || []), ...(d.materialCatalogs || [])])];
};
const write = (rel, content) => { const p = path.join(DIST, rel); fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, content); };
const collectionLabel = {'Ev': 'Ev', 'Çocuk': 'Çocuk odası', 'İşletme': 'İşletme'};
const discoveryWords = ['çocuk','ev','doğa','botanik','manzara','soyut','geometrik','organik','daire','bebek','orman','yaprak','çiçek','ağaç','hayvan','figür','minimal','modern','sade','ofis','kurumsal','deniz','dağ','güneş','ay','yıldız','bulut','uzay','roket','kuş','logo','harf','isim','kemer','kavis','çizgi','dalga','üçgen','oval','yuvarlak','yatak','salon','kafe','masalsı','retro'];
const discoveryKeywords = discoveryWords.map(word => ({word, count: designs.reduce((count, d) => count + Number(d.images.some(img => searchKeywords(d, img).includes(word))), 0)})).filter(item => item.count > 0).sort((a,b) => b.count - a.count || a.word.localeCompare(b.word, 'tr'));
const keywordCards = list => `<ul class="keyword-directory">${list.map(({word,count}) => `<li><a href="/galeri/?q=${encodeURIComponent(word)}"><strong>${esc(word)}</strong><span>${count} tasarım <span aria-hidden="true">↗</span></span></a></li>`).join('')}</ul>`;

// ---------- görsel ölçüleri ----------
const meta = {};
async function dims(file) {
  if (!meta[file]) { const m = await sharp(path.join(DIST, 'assets', file)).metadata(); meta[file] = {w: m.width, h: m.height}; }
  return meta[file];
}
async function imageSet(key) {
  const numeric = /^\d+$/.test(String(key));
  const base = numeric ? 'doku-' + pad(key) : String(key);
  const full = await dims(base + (numeric ? '-900' : '') + '.webp');
  const mid = await dims(base + '-900.webp');
  const parts = [];
  if (numeric) { const t = await dims('thumb-' + pad(key) + '.webp'); parts.push(`/assets/thumb-${pad(key)}.webp ${t.w}w`); }
  parts.push(`/assets/${base}-900.webp ${mid.w}w`);
  if (!numeric) parts.push(`/assets/${base}.webp ${full.w}w`);
  return {src: `/assets/${base}-900.webp`, full: `/assets/${base}${numeric ? '-900' : ''}.webp`, srcset: parts.join(', '), w: full.w, h: full.h};
}

// ---------- fontlar (OFL, @fontsource-variable paketlerinden) ----------
fs.mkdirSync(path.join(DIST, 'fonts'), {recursive: true});
for (const [pkg, files] of [['dm-sans', ['dm-sans-latin-wght-normal.woff2', 'dm-sans-latin-ext-wght-normal.woff2']], ['manrope', ['manrope-latin-wght-normal.woff2', 'manrope-latin-ext-wght-normal.woff2']]]) {
  const dir = path.join(import.meta.dirname, 'node_modules', '@fontsource-variable', pkg);
  for (const f of files) fs.copyFileSync(path.join(dir, 'files', f), path.join(DIST, 'fonts', f));
  fs.copyFileSync(path.join(dir, 'LICENSE'), path.join(DIST, 'fonts', `OFL-${pkg}.txt`));
}

// ---------- e-posta görselleri (assets/eposta/*.jpg → /eposta/) ----------
{
  const src = path.join(ROOT, 'assets', 'eposta');
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.join(DIST, 'eposta'), {recursive: true});
    for (const f of fs.readdirSync(src)) if (/^[a-z-]+\.jpg$/.test(f)) fs.copyFileSync(path.join(src, f), path.join(DIST, 'eposta', f));
  }
}

// ---------- sabit dosyalar ----------
fs.cpSync(path.join(ROOT, 'assets', 'kaplamalar'), path.join(DIST, 'assets', 'kaplamalar'), {recursive:true});
const fonts = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');
const hashed = {};
function emit(rel, content) { write(rel, content); hashed[rel] = crypto.createHash('sha1').update(content).digest('hex').slice(0, 8); }
emit('/pastel.css', fs.readFileSync(path.join(SRC, 'pastel.css'), 'utf8'));
emit('/doku.css', fonts + fs.readFileSync(path.join(SRC, 'doku.css'), 'utf8') + read('src/montaj.css'));
emit('/tasarim.css', fonts + fs.readFileSync(path.join(SRC, 'tasarim.css'), 'utf8') + read('src/montaj.css'));
emit('/galeri/gallery.css', fonts + fs.readFileSync(path.join(SRC, 'galeri.css'), 'utf8'));
emit('/experience.js', fs.readFileSync(path.join(SRC, 'experience.js'), 'utf8'));
emit('/home.js', fs.readFileSync(path.join(SRC, 'home.js'), 'utf8'));
emit('/tasarim.js', fs.readFileSync(path.join(SRC, 'tasarim.js'), 'utf8'));
emit('/materials.js', fs.readFileSync(path.join(SRC, 'materials.js'), 'utf8'));
emit('/galeri/gallery.js', read('src/search-core.mjs').replace('export default DokuSearch;', '') + read('src/galeri.js'));
emit('/yonetim.css', read('src/yonetim.css'));
emit('/yonetim.js', read('src/yonetim.js'));
emit('/hesap.js', read('src/hesap.js'));
const asset = rel => `${rel}?v=${hashed[rel]}`;

// ---------- paylaşım görselleri (WhatsApp/sosyal önizleme) ----------
async function ogImage(name, key, refresh = false) {
  const out = path.join(DIST, 'og', name + '.jpg');
  if (refresh || !fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), {recursive: true});
    const base = /^\d+$/.test(String(key)) ? 'doku-' + pad(key) : key;
    await sharp(path.join(DIST, 'assets', base + (/^\d+$/.test(String(key)) ? '-900' : '') + '.webp')).resize(1200, 630, {fit: 'cover'}).jpeg({quality: 78, mozjpeg: true}).toFile(out);
  }
  return `${site.url}/og/${name}.jpg`;
}

const ICON = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23202b28'/%3E%3Cpath d='M9 7h6a9 9 0 0 1 0 18H9z' fill='none' stroke='%23f3f4ef' stroke-width='3'/%3E%3C/svg%3E">`;
const GA = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-NSM2B491MY"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-NSM2B491MY');</script>`;

function head({pathname, title, description, image, noindex = false}) {
  const url = site.url + pathname;
  return [
    noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">`,
    ICON,
    GA,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="tr_TR">',
    `<meta property="og:site_name" content="${site.name}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    image ? `<meta property="og:image" content="${image}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">` : '',
    '<meta name="twitter:card" content="summary_large_image">'
  ].filter(Boolean).join('\n  ');
}
const NAV = [['Galeri', '/galeri/'], ['Kaplamalar', '/kaplamalar/'], ['Özel tasarım', '/ozel-tasarim/'], ['Hizmet', '/hizmet/'], ['Hesabım', '/hesap/']];
const materialOptions = () => [...new Set(materials.references.map(m => m.type))].map(type => `<option>${esc(type)}</option>`).join('');
const COLLECTIONS = [
  {key: 'Ev', slug: 'ev', name: 'Ev', title: 'Ev için duvar tasarımları', lead: 'Salon, yatak odası ve yaşam alanları için mekânın ölçüsüne göre uyarlanan kompozisyonlar.', cover: 765, pick: 'DK-026', blurb: 'Yumuşak geçişlerle sakin bir duvar düzeni.'},
  {key: 'Çocuk', slug: 'cocuk-odasi', name: 'Çocuk odası', title: 'Bebek ve çocuk odası duvar tasarımları', lead: 'Figür, renk ve isimle kurulan, çocukla birlikte büyüyen duvarlar.', cover: 734, pick: 'DK-002', blurb: 'Çiçek ve yapraklarla kurulan yumuşak bir dünya.'},
  {key: 'İşletme', slug: 'isletme', name: 'İşletme', title: 'İşletmeler için duvar tasarımları', lead: 'Ofis, kafe, resepsiyon ve karşılama alanlarında odak oluşturan kompozisyonlar.', cover: 791, designIds: ["GK-063","GK-069","GK-052","GK-057","GK-088","GK-053","GK-108","GK-043","GK-002","GK-037","GK-095","GK-016"], pick: 'DK-003', blurb: 'Geometrik bloklarla belirgin bir odak noktası.'}
];
const collectionUrl = c => `/mekan/${c.slug}/`;
function siteHeader(current) {
  const nav = NAV.map(([label, url]) => `<a href="${url}"${url === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<header class="site-header">
    <a class="wordmark" href="/" aria-label="DOKU ana sayfa">doku<span>.</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu"><span class="menu-label">Menü</span><span class="menu-lines" aria-hidden="true"><i></i><i></i></span></button>
    <nav class="site-nav" id="site-menu" aria-label="Ana menü">${nav}<a class="mobile-contact" href="/iletisim/">Projenizi konuşalım</a></nav>
    <a class="header-action" href="/iletisim/"${current === '/iletisim/' ? ' aria-current="page"' : ''}>Projenizi konuşalım</a>
  </header>`;
}
function siteFooter() {
  return `<footer class="site-footer"><div><a class="wordmark" href="/" aria-label="DOKU ana sayfa">doku<span>.</span></a><p>Yumuşak kaplamalı panellerle mekâna özel duvar tasarımları.</p></div><nav aria-label="Alt menü">${NAV.map(([l, u]) => `<a href="${u}">${l}</a>`).join('')}<a href="/mimarlar/">Mimarlar için</a><a href="/iletisim/">İletişim</a></nav><div class="footer-contact"><span>Birlikte konuşalım.</span><a class="footer-phone" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">${site.phoneDisplay}</a><a href="/iletisim/">Proje formu</a></div><nav class="footer-legal" aria-label="Yasal">${legal.sayfalar.map(p => `<a href="${legalUrl(p)}">${esc(p.baslik)}</a>`).join('')}</nav><div class="footer-bottom"><span>© 2026 DOKU</span><span>Galeri görselleri tasarım konseptlerini temsil eder.</span></div></footer>`;
}
const projectForm = () => fs.readFileSync(path.join(SRC, 'proje-formu.html'), 'utf8').replace(/\{\{whatsapp\}\}/g, site.whatsapp).replace('{{material-options}}', materialOptions());
const jsonld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const designUrl = d => `/tasarim/${d.slug}/`;
const themeUrl = t => `/tema/${t.slug}/`;
const themeOf = d => themes.find(t => t.slug === d.theme);

// data-asset="N" taşıyan <img> etiketlerine src, srcset, sizes, width, height ekler.
async function expandImages(html) {
  const tags = [...html.matchAll(/<img\b[^>]*\bdata-asset="([^"]+)"[^>]*>/g)];
  for (const [tag, key] of tags) {
    const set = await imageSet(key);
    const sizes = (tag.match(/data-sizes="([^"]+)"/) || [])[1] || '100vw';
    let out = tag.replace(/\s*data-asset="[^"]+"/, '').replace(/\s*data-sizes="[^"]+"/, '');
    const eager = /fetchpriority="high"/.test(out);
    out = out.replace('<img', `<img src="${eager ? set.full : set.src}" srcset="${set.srcset}" sizes="${sizes}" width="${set.w}" height="${set.h}"${eager || /decoding=/.test(out) ? '' : ' decoding="async"'}`);
    html = html.replace(tag, out);
  }
  return html;
}

// ---------- ana sayfa ----------
async function buildHome() {
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8').replace('{{assembly}}', assembly);
  const title = site.seo?.home?.title || 'DOKU — Mekâna özel duvar tasarımları';
  const desc = site.seo?.home?.description || 'DOKU’da mekânınıza özel duvar tasarımlarını keşfedin. Bir tasarımı duvarınıza uyarlayın veya kendi fotoğrafınızdan özgün bir proje başlatın.';
  html = html.replace(/<title>[^<]+<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
  const og = await ogImage('ana-sayfa', 'hero-doku-v2', true);
  const viewers = [...html.matchAll(/\{\{viewer:([^:}]+):(\d+):([^:}]+):([^}]+)\}\}/g)];
  for (const [i, [token, id, img, small, description]] of viewers.entries()) {
    const d = byId[id]; const set = await imageSet(img);
    const btn = `<button type="button"${i === 0 ? ' class="active"' : ''} data-design data-id="${d.id}" data-name="${esc(d.name)}" data-description="${esc(description)}" data-url="${designUrl(d)}" data-src="${set.src}" data-srcset="${set.srcset}" data-width="${set.w}" data-height="${set.h}" aria-pressed="${i === 0}"><span>${esc(d.name)}</span><small>${esc(small)}</small></button>`;
    html = html.replace(token, btn);
  }
  html = html
    .replace('{{popular-keywords}}', keywordCards(discoveryKeywords.slice(0, 12)))
    .replace('{{head:/}}', head({pathname: '/', title, description: desc, image: og}))
    .replace(/\{\{srcset:([\w-]+)\}\}/g, (_, k) => `{{SRCSET${k}}}`)
    .replace(/\{\{asset:([^}]+)\}\}/g, (_, rel) => asset(rel))
    .replace(/\{\{url:([A-Z]{2}-\d{3})\}\}/g, (_, id) => { const d = byId[id]; if (!d || d.hidden) throw Error('Ana sayfada yayında olmayan tasarım: ' + id); return designUrl(d); })
    .replace('{{orgjson}}', jsonld({'@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url + '/', description: 'Deri, süet ve keten kaplamalı panellerle mekâna özel duvar tasarımları', contactPoint: {'@type': 'ContactPoint', telephone: '+' + site.whatsapp, contactType: 'customer service', availableLanguage: 'Turkish'}}))
    .replace('{{header:/}}', siteHeader('/'))
    .replace('{{footer}}', siteFooter())
    .replace('{{projectform}}', projectForm())
    .replace(/\{\{whatsapp\}\}/g, site.whatsapp)
    .replace(/\{\{phone\}\}/g, site.phoneDisplay);
  for (const [, k] of html.matchAll(/\{\{SRCSET([\w-]+)\}\}/g)) html = html.replace(`{{SRCSET${k}}}`, (await imageSet(k)).srcset);
  html = await expandImages(html);
  if (/\{\{/.test(html)) throw Error('Ana sayfada çözülmemiş şablon: ' + html.match(/\{\{[^}]*\}\}/)[0]);
  write('/index.html', html);
}

// ---------- ortak sayfa kabuğu (tasarım, tema, 404) ----------
function shell({pathname, title, description, image, noindex, body, extraHead = '', scripts = '', nav = ''}) {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f6f7f4">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${head({pathname, title, description, image, noindex})}
  <link rel="stylesheet" href="${asset('/doku.css')}">
  <link rel="stylesheet" href="${asset('/tasarim.css')}">
  <script src="${asset('/experience.js')}" defer></script>
  <link rel="stylesheet" href="${asset('/pastel.css')}">
  ${extraHead}${scripts}
</head>
<body>
  <a class="skip-link" href="#main-content">İçeriğe geç</a>
  ${siteHeader(nav)}
${body}
  ${siteFooter()}
</body>
</html>
`;
}
const breadcrumb = items => `<nav class="breadcrumb" aria-label="Konum"><ol>${items.map((it, i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(it.name)}</span></li>` : `<li><a href="${it.url}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`;
const breadcrumbLd = items => jsonld({'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({'@type': 'ListItem', position: i + 1, name: it.name, item: site.url + it.url}))});
async function card(d) {
  const set = await imageSet(d.images[0]);
  return `<li><a href="${designUrl(d)}"><img src="${set.src}" srcset="${set.srcset}" sizes="(max-width:700px) 45vw, (max-width:1000px) 30vw, 23vw" alt="" width="${set.w}" height="${set.h}" loading="lazy" decoding="async"><span>${esc(d.name)}</span></a></li>`;
}

// ---------- müşteri hesabı (06.11.2026) — API: pages/functions/api ----------
function buildAccount() {
  const page = (url, title, body) => write(url + 'index.html', shell({pathname: url, title: `${title} — DOKU`, description: 'DOKU müşteri hesabı: tasarımlarınızı görün ve onaylayın.', noindex: true, nav: '/hesap/', body: `  <main id="main-content" class="hesap-page">\n${body}\n  </main>`, scripts: `<script src="${asset('/hesap.js')}" defer></script>`}));
  const tools = `<details class="hesap-tools"><summary>Şifre değiştir</summary><form id="password-form" class="hesap-form"><label for="pw-old">Mevcut şifre</label><input id="pw-old" name="old" type="password" autocomplete="current-password" required><label for="pw-new">Yeni şifre</label><input id="pw-new" name="new" type="password" autocomplete="new-password" minlength="8" required><button type="submit">Kaydet</button><p class="hesap-msg" id="password-msg" role="alert" hidden></p></form></details><button type="button" class="hesap-link" id="logout">Çıkış</button>`;
  page('/hesap/', 'Hesabım', `    <section class="hesap-auth">
      <h1>Hesabım</h1>
      <div class="hesap-tabs" role="group" aria-label="Giriş veya kayıt"><button type="button" data-auth-tab="login" aria-pressed="true">Giriş</button><button type="button" data-auth-tab="register" aria-pressed="false">Hesap aç</button></div>
      <form id="login-form" class="hesap-form">
        <label for="login-email">E-posta</label><input id="login-email" name="email" type="email" autocomplete="email" required>
        <label for="login-password">Şifre</label><input id="login-password" name="password" type="password" autocomplete="current-password" required>
        <button type="submit" class="contact-link">Giriş yap</button>
        <p class="hesap-msg" id="login-msg" role="alert" hidden></p>
      </form>
      <form id="register-form" class="hesap-form" hidden>
        <label for="reg-name">Ad soyad</label><input id="reg-name" name="name" autocomplete="name" maxlength="120" required>
        <label for="reg-email">E-posta</label><input id="reg-email" name="email" type="email" autocomplete="email" required>
        <label for="reg-phone">Telefon <span>(isteğe bağlı)</span></label><input id="reg-phone" name="phone" type="tel" autocomplete="tel" maxlength="40">
        <label for="reg-password">Şifre <span>(en az 8 karakter)</span></label><input id="reg-password" name="password" type="password" autocomplete="new-password" minlength="8" required>
        <label class="hesap-check" for="reg-kvkk"><input id="reg-kvkk" name="kvkk" type="checkbox" required> <span><a href="/yasal/kvkk/" target="_blank" rel="noopener">KVKK aydınlatma metnini</a> okudum.</span></label>
        <button type="submit" class="contact-link">Hesap aç</button>
        <p class="hesap-msg" id="register-msg" role="alert" hidden></p>
      </form>
    </section>`);
  page('/hesap/panel/', 'Tasarımlarım', `    <section class="hesap-panel">
      <div class="hesap-top"><h1>Tasarımlarım</h1><p id="account-name"></p></div>
      <p class="hesap-empty" id="customer-empty" hidden>Tasarımınız hazır olunca burada görünür.</p>
      <ul class="hesap-designs" id="customer-designs"></ul>
      <div class="hesap-foot">${tools}</div>
    </section>`);
  page('/hesap/yonetim/', 'Tasarım teslimi', `    <section class="hesap-panel">
      <div class="hesap-top"><h1>Tasarım teslimi</h1></div>
      <form id="upload-form" class="hesap-form hesap-upload">
        <label for="up-email">Müşteri e-postası</label><input id="up-email" name="email" type="email" list="customer-list" required><datalist id="customer-list"></datalist>
        <label for="up-title">Başlık</label><input id="up-title" name="title" maxlength="160" required placeholder="Örneğin Salon duvarı — 1. öneri">
        <label for="up-note">Not <span>(isteğe bağlı)</span></label><textarea id="up-note" name="note" rows="2" maxlength="2000"></textarea>
        <label for="up-files">Dosyalar <span>(JPG, PNG, WEBP, PDF · en fazla 10 MB)</span></label><input id="up-files" name="files" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple required>
        <button type="submit" class="contact-link">Müşteriye yükle</button>
        <p class="hesap-msg" id="upload-msg" role="alert" hidden></p>
      </form>
      <ul class="hesap-designs" id="admin-designs"></ul>
      <details class="hesap-tools"><summary>Müşteriler</summary><ul class="hesap-customers" id="customers"></ul></details>
      <div class="hesap-foot">${tools}</div>
    </section>`);
}

function designCats(d, src) {
  const ids = new Set([d.id, ...(d.sourceIds || []), src?.id].filter(Boolean));
  const colls = new Set([d.collection, src?.collection].filter(Boolean));
  return GALLERY_CATS.filter(c => c.collections.some(x => colls.has(x)) || areaData.some(a => c.areas.includes(a.slug) && (a.designs || []).some(id => ids.has(id)))).map(c => c.slug);
}

// ---------- tasarım sayfaları ----------
async function buildDesign(d) {
  const url = designUrl(d);
  const title = `${d.name}${designNameCounts.get(d.name) > 1 ? ` (${d.id})` : ''} duvar tasarımı — DOKU`;
  const description = d.seoDescription || `${d.description} Deri, süet veya keten kaplama; mekânınızın ölçüsüne göre uyarlanır.`.slice(0, 200);
  const sets = await Promise.all(d.images.map(imageSet));
  const alt = i => d.imageLabels?.[i] ? `${d.name} tasarımı, ${d.imageLabels[i]}, konsept mekân sunumu` : `${d.name} tasarımı, konsept mekân sunumu ${i + 1}`;
  const thumbs = d.images.length > 1 ? (await Promise.all(d.images.map(async (img, i) => {
    return `<button type="button" aria-pressed="${i === 0}" aria-label="${esc(d.name)}, ${esc(d.imageLabels?.[i] || `görsel ${i + 1}`)}"${d.imageLabels?.[i] ? ` data-label="${esc(d.imageLabels[i])}"` : ''} data-code="G-${pad(img)}" data-src="${sets[i].src}" data-srcset="${sets[i].srcset}" data-width="${sets[i].w}" data-height="${sets[i].h}" data-alt="${esc(alt(i))}"><img src="/assets/thumb-${pad(img)}.webp" alt="" width="80" height="80" loading="lazy" decoding="async"></button>`;
  }))).join('') : '';
  let related = designs.filter(x => x !== d && x.theme === d.theme);
  if (related.length < 4) related = related.concat(designs.filter(x => x !== d && x.theme !== d.theme && x.collection === d.collection)).slice(0, 4);
  related = related.slice(0, 4);
  const crumbs = [{name: 'Ana sayfa', url: '/'}, {name: 'Galeri', url: '/galeri/'}, {name: d.name, url}];
  const idx = designs.indexOf(d), prev = designs[(idx - 1 + designs.length) % designs.length], next = designs[(idx + 1) % designs.length];
  const body = `  ${breadcrumb(crumbs)}
  <main id="main-content">
    <div class="product-layout" id="design" data-id="${d.id}" data-name="${esc(d.name)}" data-code="G-${pad(d.images[0])}" data-material-codes="${esc((d.materialCodes || []).join(' / '))}" data-whatsapp="${site.whatsapp}" data-url="${site.url}${url}">
      <section class="product-images" aria-label="Tasarım görselleri">
        <div class="main-image-wrap"><img id="main-image" src="${sets[0].full}" srcset="${sets[0].srcset}" sizes="(max-width:850px) 100vw, 60vw" width="${sets[0].w}" height="${sets[0].h}" alt="${esc(alt(0))}" fetchpriority="high"><span>Konsept mekân sunumu</span><button type="button" class="image-enlarge" data-enlarge="main-image">Yakından incele <span aria-hidden="true">⤢</span></button></div>
        ${thumbs ? `<div class="thumbnails" id="thumbnails" role="group" aria-label="Görsel seçimi">${thumbs}</div>` : ''}
        ${assembly}
        <p class="image-position" id="image-position" aria-live="polite">${d.imageLabels?.[0] ? `${esc(d.imageLabels[0])} · ` : ''}Görsel 1 / ${d.images.length}</p>
      </section>
      <div class="product-summary">
        <a class="archive-return" id="gallery-return" href="/galeri/">← Galeriye dön</a>
        <p class="model-code">${d.id}</p>
        <h1 id="product-name">${esc(d.name)}</h1>
        ${d.materialCodes?.length ? `<p class="material-codes"><strong>Kaplama kodu</strong><br>${d.materialCodes.map((code,i) => `${esc(d.materialCatalogs?.[i] || '')} · ${esc(code)}`).join('<br>')}</p>` : ''}
        <p class="description">${esc(d.description)}</p>
      </div>
      <section class="product-info" aria-labelledby="product-name">
        <form id="request-form" action="https://wa.me/${site.whatsapp}" method="get" target="_blank" rel="noopener noreferrer">
          <h2>Bu tasarımı duvarınıza uyarlayalım.</h2>
          <label for="material-code">Kaplama <span>(isteğe bağlı)</span></label>
          <div class="material-choice"><input id="material-code" maxlength="80" placeholder="Kartela renk kodu"><a href="/kaplamalar/?tasarim=${encodeURIComponent(d.slug)}">Kaplamaları gör ↗</a></div>
          <fieldset class="price-calc" id="price-calc">
            <legend>Duvar ölçüsü</legend>
            <div class="price-size"><label for="size-w"><span>En</span><input id="size-w" type="number" inputmode="decimal" min="0.1" max="50" step="0.01" placeholder="3"><em>m</em></label><span aria-hidden="true">×</span><label for="size-h"><span>Boy</span><input id="size-h" type="number" inputmode="decimal" min="0.1" max="20" step="0.01" placeholder="2,5"><em>m</em></label><output id="size-m2" for="size-w size-h">— m²</output></div>
            <p class="price-range" id="price-range" aria-live="polite">${tl(priceMin)} – ${tl(priceMax)} <small>/ m²</small></p>
            <p class="price-note">Fiyat kaplamaya göre değişir.</p>
            <p class="price-extra" id="price-extra" hidden></p>
            ${priceList()}
            <input id="dimensions" type="hidden">
          </fieldset>
          <label for="idea">Tasarım notu <span>(isteğe bağlı)</span></label>
          <textarea id="idea" rows="3" maxlength="600" placeholder="Aklınızdaki değişiklikler…"></textarea>
          <input id="design-message" type="hidden" name="text" value="${esc(`Merhaba DOKU, ${d.name} (${d.id}) tasarımı için teklif görüşmesi başlatmak istiyorum. ${site.url}${url}`)}">
          <button id="contact-link" class="contact-link" type="submit">WhatsApp’ta teklif iste</button>
        </form>
        <a class="sticky-cta" href="#request-form" hidden>Bu tasarım için teklif iste </a>
        ${priceData()}
      </section>
    </div>
    <section class="product-specs" aria-label="Teknik bilgiler"><dl class="spec-list"><div><dt>Malzeme</dt><dd>${esc(site.material)}</dd></div><div><dt>Kalınlık</dt><dd>${esc(site.thickness)}</dd></div><div><dt>Bitiş</dt><dd>${esc(site.finish)}</dd></div><div><dt>Ses</dt><dd>${esc(site.sound)}</dd></div><div><dt>Montaj</dt><dd>${esc(site.mounting)}</dd></div><div><dt>Ölçü</dt><dd>${esc(site.size)}</dd></div><div><dt>Teslim</dt><dd>${esc(site.delivery)}</dd></div></dl></section>
    <nav class="pager" aria-label="Tasarımlar arasında gezin"><a rel="prev" href="${designUrl(prev)}"><small>Önceki</small>${esc(prev.name)}</a><a rel="next" href="${designUrl(next)}"><small>Sonraki</small>${esc(next.name)}</a></nav>
    ${related.length ? `<section class="related" aria-labelledby="related-title"><h2 id="related-title">Benzer tasarımlar</h2><ul class="card-grid">${(await Promise.all(related.map(card))).join('')}</ul></section>` : ''}
  </main>`;
  const og = await ogImage(d.slug, d.images[0]);
  write(url + 'index.html', shell({pathname: url, title, description, image: og, body, nav: '/galeri/', extraHead: breadcrumbLd(crumbs) + '\n  ', scripts: `<script src="${asset('/tasarim.js')}" defer></script>`}));
}

// ---------- tema sayfaları ----------
async function buildTheme(t) {
  const url = themeUrl(t);
  const title = t.seoTitle || `${t.name} teması — DOKU duvar tasarımları`;
  const description = t.seoDescription || `${t.name} temasındaki ${t.designs.length} DOKU duvar tasarımı. Her tasarım mekânınızın ölçüsüne göre uyarlanır.`;
  const crumbs = [{name: 'Ana sayfa', url: '/'}, {name: 'Galeri', url: '/galeri/'}, {name: t.name, url}];
  const body = `  ${breadcrumb(crumbs)}
  <main id="main-content" class="listing">
    <h1>${esc(t.name)}</h1>
    <p class="listing-lead">${esc(t.intro || `${t.designs.length} tasarım.`)}</p>
    <ul class="card-grid">${(await Promise.all(t.designs.map(card))).join('')}</ul>
    <div class="cta-band"><p>Aradığınız yoksa size özel çizelim.</p><a class="contact-link" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Merhaba DOKU, ${t.name} teması için mekânıma özel bir duvar tasarımı hakkında görüşmek istiyorum.`)}" target="_blank" rel="noopener noreferrer">WhatsApp’ta görüşelim </a></div>
    <nav aria-label="Temalar"><ul class="theme-list">${themes.map(x => `<li><a href="${themeUrl(x)}"${x === t ? ' aria-current="page"' : ''}>${esc(x.name)}</a></li>`).join('')}</ul></nav>
  </main>`;
  const og = await ogImage('tema-' + t.slug, t.designs[0].images[0]);
  write(url + 'index.html', shell({pathname: url, title, description, image: og, body, nav: '/galeri/', extraHead: breadcrumbLd(crumbs) + '\n  '}));
}

// ---------- galeri ----------
async function buildGallery() {
  const galleryEntries = await Promise.all(designs.flatMap(d => d.images.map(async img => {
    const code = imageCode(img), tags = keywords.images[code];
    const t = await dims('thumb-' + pad(img) + '.webp');
    const m = await dims('doku-' + pad(img) + '-900.webp');
    return {designCode:d.id, legacyCode:sourceForImage.get(img).id, imageCode:code, name:d.name,
      materialCodes:d.materialCodes || [], materialCatalogs:d.materialCatalogs || [],
      keywords:searchKeywords(d,img).join(' '), baseKeywords:baseKeywords(d,img).join(' '),
      tones:tags.tones.join('|'), colors:tags.colors, form:tags.forms[0],
      place:sourceForImage.get(img).collection, themes:themes.filter(t=>t.designs.includes(d)).map(t=>t.slug),
      image:`/assets/doku-${pad(img)}-900.webp`, thumb:`/assets/thumb-${pad(img)}.webp`,
      srcset:`/assets/thumb-${pad(img)}.webp ${t.w}w, /assets/doku-${pad(img)}-900.webp ${m.w}w`,
      width:t.w,height:t.h,url:`${designUrl(d)}?gorsel=${code}`, cats:designCats(d, sourceForImage.get(img))};
  })));
  const catNav = `<nav class="gallery-cats" aria-label="Kategoriler"><button type="button" data-cat="" aria-pressed="true">Tümü</button>${GALLERY_CATS.map(c => `<button type="button" data-cat="${c.slug}" aria-pressed="false">${esc(c.name)}</button>`).join('')}<a href="/ozel-tasarim/">Fotoğraftan duvara</a></nav>`;
  const cells = designs.map((d,i) => {
    const entry = galleryEntries.find(e=>e.designCode===d.id);
    return `      <li class="gallery-item" id="p-${d.id}" data-gallery-item data-design-id="${d.id}" data-image-code="${entry.imageCode}" data-images="${d.images.map(imageCode).join(' ')}">
        <a class="gallery-card" href="${entry.url}" aria-label="${esc(d.name)} · ${d.id} · ${entry.imageCode}">
          <span class="gallery-image"><img src="${entry.thumb}" srcset="${entry.srcset}" sizes="(max-width:850px) 50vw, 20vw" alt="${esc(d.name)} duvar tasarımı" width="${entry.width}" height="${entry.height}" loading="${i<8?'eager':'lazy'}" decoding="async">${d.images.length>1?`<span class="gallery-variants">${d.images.length} varyant</span>`:''}</span>
          <span class="gallery-card-copy"><span class="gallery-code">${d.id} · ${entry.imageCode}</span><strong>${esc(d.name)}</strong>${d.materialCodes?.length ? `<span class="gallery-material">${d.materialCodes.map(esc).join('<br>')}</span>` : ''}<span class="gallery-meta">${esc(d.materialCatalogs?.length ? d.materialCatalogs.join(' · ') : entry.colors.slice(0,2).join(' · ') + ' · ' + entry.form)}</span></span>
        </a>
      </li>`;
  });
  const description = site.seo?.gallery?.description || 'DOKU duvar tasarımlarını görsellerle keşfedin. Beğendiğiniz tasarıma dokunarak detayını inceleyin.';
  const body = `  <main id="main-content" class="gallery-page">
    <section class="gallery-catalog" aria-labelledby="catalog-title">
      <h1 class="sr-only" id="catalog-title">Tasarım galerisi</h1>
      <form class="gallery-tools" id="gallery-search" role="search" action="/galeri/" method="get">
        <div class="gallery-search-field"><label class="sr-only" for="gallery-query">Tasarım ara</label><div><input id="gallery-query" name="q" type="search" autocomplete="off" maxlength="100" placeholder="Tasarım arayın…" aria-describedby="gallery-search-hint"><button type="submit">Ara</button></div><p class="gallery-search-hint" id="gallery-search-hint">Aradığınız tasarıma en yakın kelimeleri yazın.</p></div>
        <button class="gallery-clear" id="gallery-clear" type="reset" hidden>Temizle</button>
      </form>
      ${catNav}
      <noscript><p>Kelime araması için JavaScript’i etkinleştirin. Tüm görseller aşağıda.</p></noscript>
      <div class="gallery-status"><p id="gallery-count" role="status" aria-atomic="true">${designs.length} tasarım · ${galleryEntries.length} görsel</p></div>
      <ul class="gallery-grid" id="tasarimlar" aria-label="DOKU tasarımları">
${cells.join('\n')}
      </ul>
      <script id="gallery-data" type="application/json">${JSON.stringify(galleryEntries).replace(/</g,'\\u003c')}</script>
      <div class="gallery-empty" id="gallery-empty" hidden><h2>Sonuç yok.</h2><p id="gallery-empty-hint">Daha az kelime deneyin veya filtreleri temizleyin.</p><button type="button" id="gallery-suggestion" hidden></button><button type="button" data-clear-gallery>Temizle</button></div>
    </section>
  </main>`;
  write('/galeri/index.html', shell({
    pathname: '/galeri/',
    title: site.seo?.gallery?.title || 'Tasarım galerisi — DOKU',
    description,
    image: await ogImage('galeri', 734),
    body,
    nav: '/galeri/',
    extraHead: `  <link rel="stylesheet" href="${asset('/galeri/gallery.css')}">\n  <script>const p=new URLSearchParams(location.search);if(p.has('tasarim'))location.replace('/urun/?'+p.toString());</script>\n  `,
    scripts: `<script src="${asset('/galeri/gallery.js')}" defer></script>`
  }));
}

// ---------- eski /urun/?tasarim= adresleri ----------
function buildLegacy() {
  const map = Object.fromEntries([...sources.map(d => [d.id, byId[d.id].slug]), ...designs.map(d => [d.id, d.slug])]);
  const variants = Object.fromEntries([...sources, ...designs].map(d=>[d.id,Object.fromEntries(d.images.map(n=>[imageCode(n),designs.find(p=>p.images.includes(n)).slug]))]));
  write('/urun/index.html', `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>Tasarıma yönlendiriliyor — DOKU</title>
  <script>(function(){var m=${JSON.stringify(map)},v=${JSON.stringify(variants)},p=new URLSearchParams(location.search),id=p.get('tasarim'),g=p.get('gorsel');location.replace(id&&m[id]?'/tasarim/'+(g&&v[id]?.[g]||m[id])+'/'+(g&&v[id]?.[g]?'?gorsel='+encodeURIComponent(g):''):'/galeri/');})();</script>
</head>
<body>
  <p>Tasarım sayfası taşındı. <a href="/galeri/">Galeriye gidin</a>.</p>
</body>
</html>
`);
}

function buildAliases() {
  const paths=new Set(designs.map(designUrl));
  for(const d of sources){
    const url=designUrl(d);if(paths.has(url))continue;
    const target=designUrl(byId[d.id]);
    write(url+'index.html',shell({pathname:url,title:`${d.name} adresi — DOKU`,description:'Tasarımın güncel adresine geçin.',noindex:true,
      extraHead:`<meta http-equiv="refresh" content="0;url=${target}">`,
      body:`<main id="main-content" class="listing"><h1>${esc(d.name)}</h1><a href="${target}">Tasarımı gör</a></main>`}));
  }
}

// ---------- 404, robots, sitemap ----------
function buildSupport() {
  const body = `  <main id="main-content" class="listing">
    <h1>Bu sayfa bulunamadı.</h1>
    <p class="listing-lead">Adres değişmiş olabilir.</p>
    <nav aria-label="Devam edin"><ul class="theme-list"><li><a href="/galeri/">Galeri</a></li><li><a href="/">Ana sayfa</a></li></ul></nav>
  </main>`;
  write('/404.html', shell({pathname: '/404.html', title: 'Sayfa bulunamadı — DOKU', description: 'Aradığınız sayfa bulunamadı.', noindex: true, body}));
  write('/robots.txt', `User-agent: *\nAllow: /\nDisallow: /hesap/\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
buildAccount();
  const urls = ['/', '/galeri/', '/anahtar-kelimeler/', '/kaplamalar/', '/ozel-tasarim/', '/hizmet/', '/mimarlar/', '/iletisim/', ...legal.sayfalar.map(legalUrl), ...designs.map(designUrl)];
  write('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
}

function buildLegacyCategoryRedirects() {
  const destinations = [
    ['/mekanlar/', ''], ['/tasarimlar/', ''],
    ...COLLECTIONS.map(c => [collectionUrl(c), c.name]),
    ...areas.map(area => [areaUrl(area), area.name]),
    ...themes.map(theme => [themeUrl(theme), theme.name])
  ];
  for (const [url, term] of destinations) {
    const target = '/galeri/' + (term ? `?q=${encodeURIComponent(term)}` : '');
    write(url + 'index.html', `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=${esc(target)}"><title>Galeriye yönlendiriliyor — DOKU</title><script>location.replace(${JSON.stringify(target)});</script></head><body><main><p>Bu adres galeriye taşındı. <a href="${esc(target)}">Galeride gör</a></p></main></body></html>`);
  }
}

// ---------- eski ve yayından çekilen dosyaları temizle ----------
function cleanup() {
  for (const rel of ['app.js', 'style.css', 'atelier.css', 'atelier.js', 'catalog.js', 'urun/product.js', 'urun/product.css']) fs.rmSync(path.join(DIST, rel), {force: true});
  fs.rmSync(path.join(DIST, 'tasarim'), {recursive: true, force: true});
  for (const dir of ['tema', 'mekan', 'mekanlar', 'alan', 'tasarimlar', 'anahtar-kelimeler', 'kaplamalar', 'ozel-tasarim', 'hizmet', 'mimarlar', 'iletisim', 'yasal']) fs.rmSync(path.join(DIST, dir), {recursive: true, force: true});
  // Yayındaki hiçbir tasarımda kullanılmayan görseller yayından çekilir.
  // Asıllar git geçmişinde durur; geri almak için catalog.json'u düzeltip git'ten geri getirin.
  const used = new Set(designs.flatMap(d => d.images));
  for (const f of fs.readdirSync(path.join(DIST, 'assets'))) {
    const m = f.match(/^(?:doku|thumb)-(\d{3})(?:-900)?\.webp$/);
    if (m && !used.has(Number(m[1]))) fs.rmSync(path.join(DIST, 'assets', f));
  }
  const ogDir = path.join(DIST, 'og');
  if (fs.existsSync(ogDir)) {
    const keep = new Set(['ana-sayfa.jpg', 'galeri.jpg', 'anahtar-kelimeler.jpg', 'mekanlar.jpg', 'kaplamalar.jpg', 'ozel-tasarim.jpg', 'iletisim.jpg', ...COLLECTIONS.map(c => 'mekan-' + c.slug + '.jpg'), ...areas.map(area => 'alan-' + area.slug + '.jpg'), ...designs.map(d => d.slug + '.jpg'), ...themes.map(t => 'tema-' + t.slug + '.jpg')]);
    for (const f of fs.readdirSync(ogDir)) if (!keep.has(f)) fs.rmSync(path.join(ogDir, f));
  }
}

// ---------- iç sayfalar: Mekânlar, Mekân listeleri, Tasarımlar, Özel tasarım, İletişim ----------
const homeSrc = () => fs.readFileSync(path.join(SRC, 'index.html'), 'utf8').replace('{{assembly}}', assembly);
function sectionOf(html, cls) {
  const start = html.indexOf(`<section class="${cls}"`);
  if (start < 0) throw Error('Bölüm bulunamadı: ' + cls);
  return html.slice(start, html.indexOf('</section>', start) + '</section>'.length);
}
const resolveUrls = html => html.replace(/\{\{url:([A-Z]{2}-\d{3})\}\}/g, (_, id) => { const d = byId[id]; if (!d || d.hidden) throw Error('Yayında olmayan tasarım: ' + id); return designUrl(d); });
const pageHero = (label, title, lead) => `  <section class="page-hero" aria-labelledby="page-title"><p class="section-label">${label}</p><h1 id="page-title">${title}</h1>${lead ? `<p>${lead}</p>` : ''}</section>`;
const ctaBand = (text, url = '/iletisim/', label = 'Projenizi konuşalım') => `<div class="cta-band"><p>${text}</p><a class="contact-link" href="${url}">${label} </a></div>`;
const byCollection = c => designs.filter(d => d.collection === c.key || d.sourceIds.some(id => c.designIds?.includes(id)));
async function spaceCards() {
  return `<div class="spaces-grid">${COLLECTIONS.map(c => `<article class="space-card"><a href="${collectionUrl(c)}" tabindex="-1" aria-hidden="true"><img data-asset="${c.cover}" data-sizes="(max-width:590px) 100vw, (max-width:850px) 50vw, 33vw" alt="" loading="lazy"></a><div><span>${esc(c.name)} · ${byCollection(c).length} tasarım</span><h3>${esc(c.name)}</h3><p>${esc(c.lead)}</p><a href="${collectionUrl(c)}">${esc(c.name)} tasarımlarını gör </a></div></article>`).join('')}</div>`;
}
async function writePage({url, title, description, ogKey, ogImg, body, nav, crumbs, scripts = ''}) {
  const og = await ogImage(ogKey, ogImg);
  const html = await expandImages(shell({pathname: url, title, description, image: og, nav, body, extraHead: crumbs ? breadcrumbLd(crumbs) + '\n  ' : '', scripts}));
  write(url + 'index.html', html);
}

async function buildPlaces() {
  const rows = await Promise.all(COLLECTIONS.map(async c => `  <section class="page-section" aria-labelledby="row-${c.slug}"><div class="row-head"><h2 id="row-${c.slug}">${esc(c.title)}</h2><a href="${collectionUrl(c)}">Tümü (${byCollection(c).length}) </a></div><ul class="card-grid">${(await Promise.all(byCollection(c).slice(0, 8).map(card))).join('')}</ul></section>`));
  const body = `  <main id="main-content">
${pageHero('Mekâna göre keşif', 'Nereden başlamak istersiniz?', '')}
  <section class="spaces" aria-label="Mekânlar">${await spaceCards()}</section>
${rows.join('\n')}
  <section class="page-section">${ctaBand('Mekânınızı anlatın, birlikte seçelim.')}</section>
  </main>`;
  await writePage({url: '/mekanlar/', title: 'Mekâna göre duvar tasarımları — DOKU', description: 'Ev, çocuk odası ve işletmeler için DOKU duvar tasarımları. Mekânınıza göre seçin, ölçünüze göre uyarlayalım.', ogKey: 'mekanlar', ogImg: 765, body, nav: '/mekanlar/'});
}

async function buildCollection(c) {
  const url = collectionUrl(c), list = byCollection(c);
  const seo = site.seo?.spaces?.[c.slug];
  const crumbs = [{name: 'Ana sayfa', url: '/'}, {name: 'Mekânlar', url: '/mekanlar/'}, {name: c.name, url}];
  const body = `  ${breadcrumb(crumbs)}
  <main id="main-content" class="listing">
    <h1>${esc(c.title)}</h1>
    <p class="listing-lead">${esc(seo?.intro || c.lead)}</p>
    <ul class="card-grid">${(await Promise.all(list.map(card))).join('')}</ul>
    ${ctaBand('Mekânınıza özel bir tasarım konuşalım.', '/iletisim/?mekan=' + encodeURIComponent(c.key === 'Çocuk' ? 'Bebek veya çocuk odası' : c.key))}
    <nav aria-label="Mekânlar"><ul class="theme-list">${COLLECTIONS.map(x => `<li><a href="${collectionUrl(x)}"${x === c ? ' aria-current="page"' : ''}>${esc(x.name)}</a></li>`).join('')}</ul></nav>
  </main>`;
  await writePage({url, title: seo?.title || `${c.title} — DOKU`, description: seo?.description || `${c.lead} ${list.length} DOKU tasarımı.`, ogKey: 'mekan-' + c.slug, ogImg: c.cover, body, nav: '/mekanlar/', crumbs});
}

async function buildArea(area) {
  const url = areaUrl(area);
  const crumbs = [{name: 'Ana sayfa', url: '/'}, {name: 'Alanlar', url: '/#alanlar'}, {name: area.name, url}];
  const body = `  ${breadcrumb(crumbs)}
  <main id="main-content" class="listing">
    <h1>${esc(area.name)} için duvar tasarımları</h1>
    <p class="listing-lead">Bu alana uyarlanabilecek ${area.designs.length} tasarım konsepti. Ölçü ve kaplama proje görüşmesinde belirlenir.</p>
    <ul class="card-grid">${(await Promise.all(area.designs.map(card))).join('')}</ul>
    ${ctaBand('Alanınızı anlatın, tasarımı birlikte uyarlayalım.')}
  </main>`;
  await writePage({url, title: `${area.name} için duvar tasarımları — DOKU`, description: `${area.name} için seçilen DOKU duvar tasarımlarını inceleyin. Beğendiğiniz konsepti alanınızın ölçüsüne göre uyarlayalım.`, ogKey: 'alan-' + area.slug, ogImg: byId[area.cover].images[0], body, nav: '/mekanlar/', crumbs});
}

async function buildCustom() {
  const stages = [
    ['/assets/ozel-proje-fotograf.jpg','Müşterinin fotoğrafı','Müşterinin paylaştığı fotoğraf'],
    ['ozel-proje-cizim','Tasarım','Fotoğrafın çizime dönüştürülmüş hâli'],
    ['ozel-proje-uygulama','Uygulama','Tasarımın duvara uygulanmış hâli']
  ];
  const body = `  <main id="main-content">
    <h1 class="sr-only">Özel tasarım</h1><section class="custom-hero" aria-label="Özel tasarım uygulama örneği"><img data-asset="ozel-proje-uygulama" data-sizes="100vw" alt="Özel tasarımın çocuk odası duvarına uygulanmış hâli" fetchpriority="high"></section>
    <section class="custom-steps" aria-label="Fotoğraftan duvara üç adım"><ol>${stages.map(([src,label,alt],i) => `<li><figure>${src.startsWith('/') ? `<img src="${src}" width="335" height="597" alt="${alt}" loading="lazy">` : `<img data-asset="${src}" data-sizes="(max-width:700px) 33vw, 30vw" alt="${alt}" loading="lazy">`}<figcaption><span>0${i+1}</span> ${label}</figcaption></figure></li>`).join('')}</ol></section>
  </main>`;
  await writePage({url: '/ozel-tasarim/', title: site.seo?.customDesign?.title || 'Fotoğraftan ve isimden özel duvar tasarımı — DOKU', description: site.seo?.customDesign?.description || 'Kendi fotoğrafınızdan, bir harften veya aile adınızdan kaplamalı panellerle size özel duvar tasarımı. Fotoğraftan çizime, çizimden duvara.', ogKey: 'ozel-tasarim', ogImg: 'ozel-proje-uygulama', body, nav: '/ozel-tasarim/'});
}

async function buildKeywordDirectory() {
  const body = `<main id="main-content" class="keyword-page"><h1>Anahtar kelimeler</h1>${keywordCards(discoveryKeywords)}</main>`;
  await writePage({url:'/anahtar-kelimeler/', title:'Anahtar kelimeler — DOKU', description:'DOKU tasarımlarında en çok kullanılan anahtar kelimeler. Kelimeyi seçerek ilgili tasarımları görün.', ogKey:'anahtar-kelimeler', ogImg:26, body});
}

async function buildContact() {
  const questions = sectionOf(homeSrc(), 'questions');
  const body = `  <main id="main-content">
${projectForm().replace('<h2 id="project-title">', '<h1 id="project-title">').replace('anlatın.</h2>', 'anlatın.</h1>').replace('<a href="/galeri/">Önce galeriye bakmak istiyorum', `<ul class="contact-facts"><li><strong>WhatsApp</strong><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener noreferrer">${site.phoneDisplay}</a></li></ul><a href="/galeri/">Önce galeriye bakmak istiyorum`)}
    ${questions}
  </main>`;
  await writePage({url: '/iletisim/', title: 'İletişim ve proje görüşmesi — DOKU', description: 'Duvarınızı anlatın; mekân, ölçü ve fikrinizle hazırlanan mesajı WhatsApp üzerinden DOKU’ya gönderin.', ogKey: 'iletisim', ogImg: 771, body, nav: '/iletisim/', scripts: `<script src="${asset('/home.js')}" defer></script>`});
}

async function buildMaterials() {
  const sections = materials.families.map((family,index) => {
    const refs=materials.references.filter(ref=>ref.familyId===family.id);
    return `<section class="page-section material-section" aria-labelledby="material-${index}">
      <div class="row-head"><h2 id="material-${index}">${esc(family.name)}</h2><span>${refs.length} seri</span></div>
      <ul class="material-grid">${refs.map(ref=>`<li class="material-card material-cartela"><details><summary><span class="material-previews">${ref.swatches.slice(0,4).map(s=>`<img src="${s.image}" width="${s.w}" height="${s.h}" alt="" loading="lazy" decoding="async">`).join('')}</span><span class="material-heading"><strong>${esc(ref.collection)}</strong><span>${ref.swatches.length} renk · <b>Gör</b></span></span></summary><ul class="swatch-grid">${ref.swatches.map((swatch,i)=>`<li><button type="button" data-enlarge="swatch-${ref.id}-${i}" aria-label="${esc(swatch.code)} kartelasını büyüt"><img id="swatch-${ref.id}-${i}" data-preview-label="Kartela" src="${swatch.image}" width="${swatch.w}" height="${swatch.h}" alt="${esc(swatch.code)} kaplama kartelası" loading="lazy" decoding="async"><span>${esc(swatch.code)}</span></button><a class="swatch-select" data-material-code="${esc(swatch.code)}" hidden>Bu kaplamayı seç</a></li>`).join('')}</ul></details></li>`).join('')}</ul>
    </section>`;
  }).join('\n');
  const body = `<main id="main-content">
    <h1 class="materials-title">Doku ve rengi seçin.</h1>
    ${sections}
  </main>`;
  await writePage({url: '/kaplamalar/', title: 'Kumaş ve Deri Kaplama Kartelaları | DOKU', description: 'DOKU için kumaş ve deri kaplama kartelalarını inceleyin. Renkleri ve kartela kodlarını görün.', ogKey: 'kaplamalar', ogImg: 731, body, nav: '/kaplamalar/', scripts: `<script src="${asset('/materials.js')}" defer></script>`});
}

// ---------- müşteri merkezi: hizmet ve mimarlar ----------
const SERVICE_STEPS = [
  ['Talep', 'Mekânı, duvarı ve fikrinizi yazın. Fotoğraf ve ölçü varsa ekleyin.'],
  ['Yerinde ölçü', 'Duvarı yerinde ölçer, ışığı ve mekânı birlikte değerlendiririz.'],
  ['Tasarım ve çizim', 'Duvarınıza özel kompozisyonu çizer, kaplama ve renkleri öneririz.'],
  ['Revize', 'Çizim üzerinde istediğiniz değişiklikleri yapar, son hâlini birlikte onaylarız.'],
  ['Teklif ve kapora', 'Ölçü, kaplama ve kalınlığa göre net teklif; onayla üretime alınır.'],
  ['Üretim', 'Paneller ölçünüze göre kesilir, dolgulanır ve kaplanır.'],
  ['Montaj', '5 m² üzeri projelerde 2.000 TL/m². 5 m² ve altında montaj yok; paneller gizli geçme sistemiyle kolayca takılır.'],
    ['Teslim süresi', '5 m² ve altı: üretim 1–3 gün + kargo 1–3 gün. 5 m² üzeri: süre işe göre birlikte belirlenir.'],
  ['Garanti ve bakım', 'Teslimden sonra da yanınızdayız: garanti ve bakım hizmeti.']
];
const stepsList = () => `<ol class="process-steps">${SERVICE_STEPS.map(([h, p], i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol>`;
const specList = () => `<dl class="spec-list"><div><dt>Malzeme</dt><dd>${esc(site.material)}</dd></div><div><dt>Kalınlık</dt><dd>${esc(site.thickness)}</dd></div><div><dt>Bitiş</dt><dd>${esc(site.finish)}</dd></div><div><dt>Ses</dt><dd>${esc(site.sound)}</dd></div><div><dt>Montaj</dt><dd>${esc(site.mounting)}</dd></div><div><dt>Ölçü</dt><dd>${esc(site.size)}</dd></div><div><dt>Teslim</dt><dd>${esc(site.delivery)}</dd></div></dl>`;

async function buildService() {
  const body = `  <main id="main-content">
${pageHero('Hizmet', 'Ölçüden bakıma, tek elden.', 'Ölçü, tasarım, üretim, montaj ve bakım. Duvarınızın her adımında yanınızdayız.')}
    <section class="process" aria-labelledby="service-title"><div class="process-heading"><p class="section-label">Nasıl çalışırız?</p><h2 id="service-title">Sekiz adımda duvarınız.</h2><p>Her adımda ne olacağını bilirsiniz; onayınız olmadan bir sonraki adıma geçilmez.</p></div>${stepsList()}</section>
    <section class="page-section service-split" aria-labelledby="care-title"><div><p class="section-label">Teslimden sonra</p><h2 id="care-title">Garanti ve bakım.</h2><p>Duvarınız teslimle bitmez. Garanti kapsamı teklifte yazılı olarak verilir; bakım ve yenileme için bize her zaman ulaşabilirsiniz.</p></div><div><p class="section-label">Teknik bilgi</p>${specList()}</div></section>
    <section class="page-section">${ctaBand('Duvarınızı anlatın; ölçü randevusunu birlikte planlayalım.')}</section>
  </main>`;
  await writePage({url: '/hizmet/', title: 'Hizmet: ölçü, tasarım, üretim, montaj ve bakım — DOKU', description: 'DOKU premium duvar hizmeti: yerinde ölçü, tasarım ve revize, özel üretim, gizli geçme montaj, garanti ve bakım.', ogKey: 'hizmet', ogImg: 771, body, nav: '/hizmet/'});
}

async function buildArchitects() {
  const body = `  <main id="main-content">
${pageHero('Mimarlar ve iç mimarlar için', 'Projenizdeki duvar, bizim işimiz.', 'Çiziminizle veya ölçünüzle çalışırız. Tasarımı projenize uyarlar, üretir ve takarız.')}
    <section class="page-section service-split" aria-labelledby="arch-title"><div><p class="section-label">Birlikte çalışma</p><h2 id="arch-title">Size kalan tek iş: onay.</h2><ul class="arch-list"><li>Çizim, ölçü veya render ile başlarız.</li><li>Tasarım ve revizeyi proje sürecinize göre yürütürüz.</li><li>Kaplama ve renk numunesi göndeririz.</li><li>Üretim, montaj ve teslimi biz üstleniriz.</li><li>Proje bazlı teklif; tekrar eden işlerde süreklilik.</li></ul></div><div><p class="section-label">Teknik bilgi</p>${specList()}</div></section>
    <section class="page-section">${ctaBand('Projenizi paylaşın; çiziminize göre dönüş yapalım.', '/iletisim/?rol=mimar&mekan=' + encodeURIComponent('İşletme'), 'Proje paylaş')}</section>
  </main>`;
  await writePage({url: '/mimarlar/', title: 'Mimarlar ve iç mimarlar için duvar tasarımı — DOKU', description: 'Mimar ve iç mimar projeleri için ölçüye özel yumuşak kaplamalı duvar panelleri: çizim, numune, üretim ve montaj tek elden.', ogKey: 'mimarlar', ogImg: 791, body, nav: '/mimarlar/'});
}

// ---------- yasal sayfalar (data/yasal.json → /yasal/<slug>/) ----------
const legal = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'yasal.json'), 'utf8'));
const legalUrl = p => `/yasal/${p.slug}/`;
async function buildLegal() {
  const s = legal.satici;
  for (const k of ['adres', 'eposta']) if (!s[k]) console.warn(`UYARI: data/yasal.json satici.${k} boş.`);
  const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => esc(s[k] || '[doldurulacak]'));
  for (const p of legal.sayfalar) {
    const body = `  <main id="main-content" class="listing legal">
    <h1>${esc(p.baslik)}</h1>
${p.bolumler.map(([h, t]) => `    <section><h2>${esc(h)}</h2><p>${fill(t)}</p></section>`).join('\n')}
    <p class="listing-lead">Son güncelleme: ${today}</p>
  </main>`;
    await writePage({url: legalUrl(p), title: `${p.baslik} — DOKU`, description: p.ozet, ogKey: 'ana-sayfa', ogImg: 'hero-doku-v2', body, nav: ''});
  }
}

cleanup();
await buildHome();
for (const d of designs) await buildDesign(d);
await buildGallery();
await buildKeywordDirectory();
await buildCustom();
await buildContact();
await buildMaterials();
await buildService();
await buildArchitects();
await buildLegal();
buildLegacy();
buildAliases();
buildLegacyCategoryRedirects();
buildSupport();
for (const img of designs.flatMap(d => d.images)) fs.rmSync(path.join(DIST, 'assets', `doku-${pad(img)}.webp`), {force:true});
console.log(`Yayında ${designs.length} tasarım, ${themes.length} tema, ${hiddenDesigns.length} gizli. Tarih ${today}.`);
