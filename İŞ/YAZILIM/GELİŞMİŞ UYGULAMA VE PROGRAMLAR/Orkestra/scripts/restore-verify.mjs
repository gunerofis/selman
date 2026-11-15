import { DatabaseSync } from 'node:sqlite';
import { existsSync,readdirSync,readFileSync } from 'node:fs';
import { join } from 'node:path';

if(!existsSync('backups'))throw new Error('Yedek klasörü yok.');
const latest=readdirSync('backups',{withFileTypes:true}).filter(item=>item.isDirectory()).map(item=>item.name).sort().at(-1);
if(!latest)throw new Error('Doğrulanacak yedek yok.');
const manifest=JSON.parse(readFileSync(join('backups',latest,'manifest.json'),'utf8'));
const db=new DatabaseSync(join('backups',latest,manifest.database),{readOnly:true});
try {
  const integrity=db.prepare('PRAGMA integrity_check').get();if(integrity.integrity_check!=='ok')throw new Error('Yedek bütünlük kontrolünden geçmedi.');
  const required=['users','grants','mappings','order_cache','tasks','audit','inbox_events','outbox_events','schema_migrations'];
  const found=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(item=>item.name));
  const missing=required.filter(name=>!found.has(name));if(missing.length)throw new Error(`Yedek şeması eksik: ${missing.join(', ')}`);
} finally { db.close(); }
console.log(`Yedek doğrulandı: ${latest}`);
