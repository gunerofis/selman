import { existsSync,mkdirSync,writeFileSync } from 'node:fs';
import { basename,join,resolve } from 'node:path';
import { openStore } from '../core/store.mjs';

const dbPath=process.env.DATABASE_PATH??'data/core.sqlite';
if(!existsSync(dbPath))throw new Error('Veritabanı bulunamadı.');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const dir=join('backups',stamp);mkdirSync(dir,{recursive:true});
const target=resolve(dir,basename(dbPath));
const db=openStore(dbPath);
try { db.exec(`VACUUM INTO '${target.replaceAll("'","''")}'`); }
finally { db.close(); }
writeFileSync(join(dir,'manifest.json'),JSON.stringify({createdAt:new Date().toISOString(),database:basename(dbPath),version:2,method:'sqlite-vacuum-into'},null,2));
console.log(`Yedek hazır: ${dir}`);
