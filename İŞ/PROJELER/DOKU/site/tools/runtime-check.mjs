import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const stage=path.join(root,'.sites-runtime','static'),client=path.join(root,'dist','client');
const pages=JSON.parse(fs.readFileSync(path.join(root,'server','static-pages.json'),'utf8'));
const sitemap=JSON.parse(fs.readFileSync(path.join(root,'server','static-sitemap.json'),'utf8'));
let count=0;
function check(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory())check(file);else{const relative=path.relative(stage,file);
 if(e.name.endsWith('.html')||relative==='sitemap.xml'){
   assert.ok(!fs.existsSync(path.join(client,relative)),`Worker yolunu statik dosya atlıyor: ${relative}`);
   assert.ok(!fs.existsSync(path.join(root,'public',relative)),`Derleyici Worker yolunu statik dosya sayıyor: ${relative}`);
   const key='/'+relative.split(path.sep).join('/').replace(/index\.html$/,'');
   assert.equal(relative==='sitemap.xml'?sitemap:pages[key],fs.readFileSync(file,'utf8'),`Worker içeriği değişti: ${relative}`);
 }else{assert.ok(fs.existsSync(path.join(client,relative)),`Çalışan sitede dosya eksik: ${relative}`);assert.ok(fs.readFileSync(file).equals(fs.readFileSync(path.join(client,relative))),`Dosya değişti: ${relative}`);}count++;}
}}
check(stage);assert.ok(fs.existsSync(path.join(root,'dist','server','index.js')));
const hosting=JSON.parse(fs.readFileSync(path.join(root,'dist','.openai','hosting.json'),'utf8'));assert.equal(hosting.d1,'DB');assert.ok(!hosting.static);
console.log(`GEÇTİ: ${count} vitrin dosyası korundu, Worker ve DB çıktısı hazır.`);
