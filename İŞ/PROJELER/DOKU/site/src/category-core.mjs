import {imageCode, imageProducts} from './product-core.mjs';
import {keywordFields, singleKeywords, effectiveTags} from './keyword-policy.mjs';

export {keywordFields};
const clean = value => String(value).normalize('NFC').trim().replace(/\s+/gu, ' ');
const key = value => clean(value).toLocaleLowerCase('tr-TR');
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const compare = new Intl.Collator('tr-TR').compare;

function hash(value) {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.codePointAt(0), 16777619);
  return (result >>> 0).toString(16).padStart(8, '0');
}

export function categorySlug(name) {
  const normalized = key(name);
  if (normalized === 'takımlar') return 'takimlar';
  if (normalized === 'ülkeler') return 'ulkeler';
  const stem = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/g, '') || 'etiket';
  return `${stem}-${hash(normalized)}`;
}

export const categoryUrl = category => `/kategori/${category.slug}/`;

const extraColorNames = ['kobalt', 'lila', 'mercan', 'adaçayı', 'hardal', 'zeytin', 'petrol'];
export function colorCategoryTerms(seed, overrides = {}) {
  return new Set(singleKeywords([...extraColorNames, ...Object.values(seed.images).flatMap(tags => [...tags.colors, ...tags.tones]),
    ...Object.values(overrides).flatMap(tags => [...(tags?.colors || []), ...(tags?.tones || [])])]).map(key));
}

export function imageKeywords(source, seed, code, product, overrides = {}, excludedColors = colorCategoryTerms(seed, overrides)) {
  const tags = effectiveTags(seed.images[code], overrides[code]);
  const structural = product?.affiliation ? [product.affiliation === 'TR' ? 'Ülkeler' : 'Takımlar'] : [];
  const terms = singleKeywords([...(seed.products[source.id] || []), ...['forms', 'subjects', 'styles', 'keywords'].flatMap(field => tags[field]), ...structural]);
  const unique = new Map();
  for (const term of terms) {
    if (typeof term !== 'string' || !clean(term) || excludedColors.has(key(term))) continue;
    if (!unique.has(key(term))) unique.set(key(term), clean(term));
  }
  return [...unique.values()];
}

export function buildCategories(catalog, seed, grouping, overrides = {}) {
  const products = imageProducts(catalog, grouping);
  const categories = new Map(), seen = new Set(), excludedColors = colorCategoryTerms(seed, overrides);
  for (const source of catalog.designs.filter(design => !design.hidden)) {
    for (const number of source.images) {
      const code = imageCode(number), product = products.get(code);
      if (!product || seen.has(code)) continue;
      seen.add(code);
      for (const name of imageKeywords(source, seed, code, product, overrides, excludedColors)) {
        const normalized = key(name);
        if (!categories.has(normalized)) categories.set(normalized, {name, slug:categorySlug(name), images:new Set(), products:new Set(), cover:number});
        const category = categories.get(normalized);
        category.images.add(code);
        category.products.add(product.id);
      }
    }
  }
  const result = [...categories.values()].map(category => ({
    name:category.name, slug:category.slug, count:category.images.size,
    productIds:[...category.products], imageCodes:[...category.images], cover:null
  }));
  result.sort((a, b) => b.count - a.count || compare(a.name, b.name));
  const usage = new Map();
  for (const category of result) for (const code of category.imageCodes) usage.set(code, (usage.get(code) || 0) + 1);
  const used = new Set();
  for (const category of result) {
    const code = category.imageCodes.filter(code => !used.has(code)).sort((a, b) => usage.get(a) - usage.get(b) || compare(a, b))[0];
    if (code) { used.add(code); category.cover = Number(code.slice(2)); }
  }
  if (new Set(result.map(category => category.slug)).size !== result.length) throw Error('Kategori adresleri çakıştı.');
  return result;
}

export function renderCategoryList(categories) {
  const cards = categories.map(category => {
    const cover = category.cover === null
      ? `<span class="area-card-image area-card-image--type" aria-hidden="true"><span>${esc(category.name)}</span></span>`
      : `<span class="area-card-image"><img src="/assets/doku-${String(category.cover).padStart(3, '0')}-900.webp" width="900" height="900" alt="" loading="lazy" decoding="async"></span>`;
    return `<li class="area-card" data-category-count="${category.count}"><a href="${categoryUrl(category)}">${cover}<span class="area-card-meta"><strong>${esc(category.name)}</strong><small>${category.count} görsel · ${category.productIds.length} ürün</small><span class="area-card-action">Gör</span></span></a></li>`;
  }).join('');
  return `<main id="main-content"><section class="page-hero" aria-labelledby="page-title"><p class="section-label">Tasarımlar</p><h1 id="page-title">Kategoriler</h1><p>En çok kullanılan etiketten başlayın.</p></section><section class="page-section" aria-labelledby="categories-title"><div class="row-head"><h2 id="categories-title">${categories.length} kategori</h2><a href="/galeri/">Galeri</a></div><ul class="area-grid" aria-label="Kategoriler">${cards}</ul></section></main>`;
}
