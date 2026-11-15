import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import Search from '../src/search-core.mjs';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist/galeri/index.html'), 'utf8');
const payload = html.match(/<script\b(?=[^>]*\bid="gallery-data")[^>]*>([\s\S]*?)<\/script>/);
assert.ok(payload, 'Galeri arama verisi bulunmalı.');
const records = JSON.parse(payload[1]);
const entries = records.map(Search.makeEntry);
const codes = query => Search.search(entries, query).map(item => item.imageCode);
const imageCodes = records.map(item => item.imageCode);
assert.equal(new Set(imageCodes).size, 107, 'Bütün görseller aramaya bir kez girmeli.');
assert.deepEqual(codes(''), imageCodes, 'Boş arama bütün görselleri göstermeli.');
assert.deepEqual(codes('tam duvar').sort(), ["G-012","G-037","G-050","G-068","G-109","G-125","G-839","G-840","G-841","G-842","G-843","G-844","G-846","G-847","G-848","G-849","G-850","G-851","G-852","G-853","G-854","G-855","G-856","G-857","G-859","G-860","G-861","G-862","G-863","G-864","G-866","G-868","G-869","G-871","G-873","G-875","G-876","G-877"], 'Tam duvar araması seçili tam duvar kaplamalarını bulmalı.');
assert.deepEqual(codes('xyzbulunmayan'), [], 'Sıfır eşleşme gösterilmemeli.');
assert.deepEqual(codes('ve'), [], 'Tek başına bağlaç sonuç üretmemeli.');
assert.deepEqual(codes('doğa ve botanik'), codes('doğa botanik'), 'Bağlaç aramayı değiştirmemeli.');
const nature = Search.search(entries, 'doğa botanik');
assert.ok(nature.length > 0);
assert.ok(nature.every(item => item.designCode !== 'DK-057'), 'FB amblemi doğa ve botanik aramasında görünmemeli.');
const matchCount = item => ['doga', 'botanik'].filter(term => item.terms.has(term)).length;
if (entries.some(item => matchCount(item) === 2)) assert.ok(nature.some(item => matchCount(item) === 2), 'İki kelimeyi de taşıyan görseller olmalı.');
assert.ok(nature.some(item => matchCount(item) === 1), 'Tek kelime eşleşenler de gösterilmeli.');
assert.ok(nature.every(item => matchCount(item) > 0), 'Sıfır eşleşme araya karışmamalı.');
for (let i = 1; i < nature.length; i++) assert.ok(matchCount(nature[i - 1]) >= matchCount(nature[i]), 'En çok kelime eşleşen önce gelmeli.');
const fiveTerms = Search.parseQuery('yuvarlak çocuk ev yatak pembe');
const fiveResults = Search.search(entries, 'yuvarlak çocuk ev yatak pembe');
const fiveCount = item => fiveTerms.filter(term => item.terms.has(term)).length;
assert.ok(fiveResults.length > 0 && fiveResults.every(item => fiveCount(item) > 0), 'Beş kelimelik aramada sıfır eşleşme gizlenmeli.');
for (let i = 1; i < fiveResults.length; i++) assert.ok(fiveCount(fiveResults[i - 1]) >= fiveCount(fiveResults[i]), 'Beş kelimede eşleşme sayısı azalan sırada olmalı.');
assert.deepEqual(codes('mavi, daire / ofis'), codes('mavi daire ofis'));
assert.deepEqual(codes('blue round office'), codes('mavi daire ofis'));
assert.deepEqual(codes('YEŞİL ÇOCUK'), codes('yesil cocuk'));
const knownTerm = [...entries[0].terms].find(term => /^[a-z]{3,}$/.test(term));
assert.ok(codes(`${knownTerm} unicorn`).length > 0, 'Bilinmeyen kelime diğer eşleşmeleri silmemeli.');
assert.deepEqual(codes('DK-999'), [], 'Bilinmeyen kod sonuç üretmemeli.');
assert.deepEqual(codes('G-999'), [], 'Bilinmeyen görsel kodu sonuç üretmemeli.');
assert.deepEqual(codes(imageCodes[0]), [imageCodes[0]], 'Görsel kodu tam eşleşmeli.');
for (const record of records) {
  assert.ok(codes(record.imageCode).includes(record.imageCode), `${record.imageCode}: kodla bulunmalı.`);
  assert.ok(codes(record.designCode).includes(record.imageCode), `${record.imageCode}: ürün koduyla bulunmalı.`);
}
console.log(`GEÇTİ: ${entries.length} görsel; ayrı kelime eşleşmesi, sıralama, sıfır eşleşme ve kod araması.`);

