// Ürün ayrımı, görsel kapsamı ve etiketten kategori ilişkisi: node tools/group-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createProducts,imageCode,legacyDestination} from '../src/product-core.mjs';
import {buildCategories,categoryUrl,colorCategoryTerms} from '../src/category-core.mjs';
import {singleKeywords} from '../src/keyword-policy.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const catalog=read('data/catalog.json'),grouping=read('data/product-groups.json'),seed=read('data/keywords.json');
const sources=catalog.designs.filter(source=>!source.hidden);
const sourceById=new Map(sources.map(source=>[source.id,source]));
assert.equal(sources.length,107,'Kaynak katalog kayıtları korunmalı.');
const sourceImages=sources.flatMap(source=>source.images).sort((a,b)=>a-b);
assert.equal(sourceImages.length,107,'107 kaynak görsel korunmalı.');
assert.equal(new Set(sourceImages).size,107,'Kaynak görsel tekrar etmemeli.');
assert.equal(grouping.version,1);
assert.ok(Array.isArray(grouping.products)&&grouping.products.length>0);
const products=createProducts(catalog,grouping);
assert.equal(new Set(products.map(product=>product.id)).size,products.length,'Ürün kodları tekil olmalı.');
assert.equal(new Set(products.map(product=>product.slug)).size,products.length,'Ürün adresleri tekil olmalı.');
const groupedImages=products.flatMap(product=>product.images).sort((a,b)=>a-b);
assert.deepEqual(groupedImages,sourceImages,'Her G kodu tam bir üründe yer almalı.');
const productByImage=new Map(products.flatMap(product=>product.images.map(n=>[imageCode(n),product])));
for(const product of products){
  assert.ok(product.id&&product.slug&&product.name,`${product.id}: ürün kimliği`);
  assert.ok(product.sourceIds.length>0,`${product.id}: kaynak kodu yok`);
  assert.equal(new Set(product.sourceIds).size,product.sourceIds.length,`${product.id}: kaynak kodu tekrar ediyor`);
  for(const sourceId of product.sourceIds)assert.ok(sourceById.has(sourceId),`${product.id}: geçersiz kaynak ${sourceId}`);
  for(const number of product.images)assert.ok(product.sourceIds.some(sourceId=>sourceById.get(sourceId).images.includes(number)),`${imageCode(number)}: kaynak ilişkisi`);
}
const productOf=n=>productByImage.get(imageCode(n));
// Sabit örnek çiftleri yalnız ikisi de görünürken denetlenir (gizlenen tasarımlar silinmez).
const live=(a,b)=>productOf(a)&&productOf(b);
for(const [a,b] of [[66,16],[110,103],[91,71]])if(live(a,b))assert.equal(productOf(a).id,productOf(b).id,`G-${a}/G-${b}: aynı ürün`);
for(const [a,b] of [[50,32],[102,113]])if(live(a,b))assert.notEqual(productOf(a).id,productOf(b).id,`G-${a}/G-${b}: farklı ürün`);
for(const source of sources)for(const number of source.images){
  const pathname=`/tasarim/${source.slug}/`,target=`/tasarim/${productOf(number).slug}/`;
  assert.equal(legacyDestination(catalog,grouping,pathname,imageCode(number)),target===pathname?null:target,`${imageCode(number)}: eski bağlantı seçilen ürünü açmalı`);
}
// Kulüp ve ülke renklerine ait bütün varyantlar tek kartta toplanmalı.
for(const affiliation of ['TS','GS','BJK','FB','TR'])if(products.some(product=>product.affiliation===affiliation))assert.equal(products.filter(product=>product.affiliation===affiliation).length,1,`${affiliation}: tek ürün kartı`);
for(const [number,affiliation] of [[140,'FB'],[165,'TS'],[167,'TR'],[144,'GS'],[136,'BJK'],[155,'FB'],[151,'TS']])if(productOf(number))assert.equal(productOf(number).affiliation,affiliation,`${imageCode(number)}: takım/ülke ilişkisi`);
for(const [a,b] of [[220,252],[222,256],[250,254]])if(live(a,b))assert.equal(productOf(a).id,productOf(b).id,`${imageCode(a)}/${imageCode(b)}: yeni kayıt türevleri`);
for(const [a,b] of [[258,259],[259,260],[258,260]])if(live(a,b))assert.notEqual(productOf(a).id,productOf(b).id,`${imageCode(a)}/${imageCode(b)}: farklı anne kompozisyonları`);

const categories=buildCategories(catalog,seed,grouping);
const categoryByName=new Map(categories.map(category=>[category.name.normalize('NFC').trim().replace(/\s+/gu,' ').toLocaleLowerCase('tr-TR'),category]));
const colorTerms=colorCategoryTerms(seed);
for(const category of categories)assert.ok(!colorTerms.has(category.name.toLocaleLowerCase('tr-TR')),`${category.name}: renk kategorisi olmamalı`);
for(const category of categories)assert.ok(!/\s/u.test(category.name),`${category.name}: kategori tek kelime olmalı`);
const covers=categories.filter(category=>category.cover!==null).map(category=>category.cover);
assert.equal(new Set(covers).size,covers.length,'Hiçbir kategori kapak görseli tekrar kullanılmamalı.');
assert.equal(new Set(categories.map(category=>category.slug)).size,categories.length,'Kategori adresleri tekil olmalı.');
for(let i=1;i<categories.length;i++)assert.ok(categories[i-1].count>=categories[i].count,'Kategori sırası tekrar sayısına göre azalan olmalı.');
const expectedTerms=new Map();
for(const source of sources)for(const number of source.images){
  const code=imageCode(number),tags=seed.images[code],product=productOf(number);
  assert.ok(tags,`${code}: etiket yok`);
  const structural=product.affiliation?[product.affiliation==='TR'?'Ülkeler':'Takımlar']:[];
  const terms=[...(seed.products[source.id]||[]),...['forms','subjects','styles','keywords'].flatMap(field=>tags[field]||[]),...structural];
  const unique=new Set(singleKeywords(terms).map(term=>term.toLocaleLowerCase('tr-TR')).filter(term=>term&&!colorTerms.has(term)));
  for(const term of unique){if(!expectedTerms.has(term))expectedTerms.set(term,new Set());expectedTerms.get(term).add(code);}
}
assert.equal(categories.length,expectedTerms.size,'Her anahtar kelime tam bir kategori olmalı.');
for(const [term,expected] of expectedTerms){
  const category=categoryByName.get(term);assert.ok(category,`${term}: kategori eksik`);
  assert.deepEqual([...category.imageCodes].sort(),[...expected].sort(),`${term}: kategori görsel ilişkisi`);
  assert.equal(category.count,expected.size,`${term}: etiketin görsel tekrar sayısı`);
  assert.deepEqual([...category.productIds].sort(),[...new Set([...expected].map(code=>productByImage.get(code).id))].sort(),`${term}: kategori ürün ilişkisi`);
  if(category.cover!==null)assert.ok(expected.has(imageCode(category.cover)),`${term}: kategori kapağı`);
}
const teams=categories.find(category=>category.slug==='takimlar'),countries=categories.find(category=>category.slug==='ulkeler');
if(products.some(product=>product.affiliation)){
assert.ok(teams&&countries,'Takımlar ve Ülkeler kategorileri olmalı.');
assert.deepEqual(teams.productIds.slice().sort(),products.filter(product=>product.affiliation&&product.affiliation!=='TR').map(product=>product.id).sort());
assert.deepEqual(countries.productIds,products.filter(product=>product.affiliation==='TR').map(product=>product.id));
}
const firstCode=imageCode(sourceImages[0]),override=structuredClone(seed.images[firstCode]);
override.keywords.push('tekildenetim');
const updated=buildCategories(catalog,seed,grouping,{[firstCode]:override});
const added=updated.find(category=>category.name==='tekildenetim');
assert.equal(added?.count,1,'Kaydedilen yeni etiket kategoriye yansımalı.');
assert.deepEqual(added.productIds,[productByImage.get(firstCode).id]);
const obsolete=['duvar kompozisyonu','konsept','renk','renk tonları'];
const stale=structuredClone(seed.images['G-210']);
Object.assign(stale,{colors:['renk'],forms:['duvar kompozisyonu'],styles:['konsept'],tones:['renk tonları']});
const cleaned=buildCategories(catalog,seed,grouping,{'G-210':stale});
for(const term of obsolete)assert.ok(!cleaned.some(category=>category.name.toLocaleLowerCase('tr-TR')===term),`${term}: genel kategori kaldırılmalı`);
const sitemap=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
const site=read('data/site.json');
for(const category of categories)assert.ok(!sitemap.includes(`<loc>${site.url}${categoryUrl(category)}</loc>`),`${category.slug}: anahtar kelime sitemap'te kategori olmamalı`);
assert.ok(fs.existsSync(path.join(root,'app/kategori/[slug]/route.ts')),'Eski kategori yönlendirmesi eksik.');
console.log(`GEÇTİ: ${sources.length} kaynak, ${products.length} ürün, ${sourceImages.length} görsel; ${categories.length} tek sözcüklü arama etiketi.`);

