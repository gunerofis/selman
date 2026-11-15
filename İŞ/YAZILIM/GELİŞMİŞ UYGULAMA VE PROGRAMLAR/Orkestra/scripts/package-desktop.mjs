import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const out=join('dist','Orkestra');
rmSync(out,{recursive:true,force:true}); mkdirSync(out,{recursive:true});
for (const item of ['apps','core','packages','public','scripts','tests','automation','docs','package.json','compose.yaml','Dockerfile','.env.example','README.md']) cpSync(item,join(out,item),{recursive:true});
writeFileSync(join(out,'Orkestra.cmd'),'@echo off\r\ncd /d "%~dp0"\r\nnode scripts/desktop-dev.mjs\r\n');
console.log(`Taşınabilir paket hazır: ${out}`);
