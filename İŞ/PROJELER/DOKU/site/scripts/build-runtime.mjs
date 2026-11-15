import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
function run(args){const r=spawnSync(process.execPath,args,{stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
run(['tools/build.mjs']);
const stage=path.join(root,'.sites-runtime','static'),pub=path.join(root,'public');
for(const dir of [stage,pub]){
  if(!dir.startsWith(root+path.sep)||fs.lstatSync(dir,{throwIfNoEntry:false})?.isSymbolicLink())throw Error('Güvenli üretim dizini gerekli.');
  fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
}
for(const name of fs.readdirSync('dist'))if(!['client','server','.openai','_appgen_meta'].includes(name))fs.cpSync(path.join(root,'dist',name),path.join(stage,name),{recursive:true});
fs.cpSync(stage,pub,{recursive:true});
const client=path.join(root,'dist','client');
// Derleyicinin public dosya listesi de Worker sayfalarını gölgelememeli.
function workerPages(dir,base=dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(![pub,client].includes(base)||!file.startsWith(base+path.sep))throw Error('Güvenli istemci dizini gerekli.');
  if(entry.isDirectory())workerPages(file,base);
  else if(entry.name.endsWith('.html')||file===path.join(base,'sitemap.xml'))fs.unlinkSync(file);
}}
workerPages(pub);
const pages={};
function htmls(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);if(item.isDirectory())htmls(file);else if(item.name.endsWith('.html')){
    const relative='/'+path.relative(stage,file).split(path.sep).join('/');pages[relative.endsWith('/index.html')?relative.slice(0,-10):relative]=fs.readFileSync(file,'utf8');
  }
}}
htmls(stage);fs.mkdirSync('server',{recursive:true});fs.writeFileSync('server/static-pages.json',JSON.stringify(pages));
fs.writeFileSync('server/static-sitemap.json',JSON.stringify(fs.readFileSync(path.join(stage,'sitemap.xml'),'utf8')));
run(['scripts/run-framework.mjs','build']);
// HTML ve canlı sitemap Worker'dan gelir. Statik dosya katmanı bu yolları atlamaz.
workerPages(client);
fs.cpSync(stage,path.join(root,'dist'),{recursive:true});
run(['tools/runtime-check.mjs']);
