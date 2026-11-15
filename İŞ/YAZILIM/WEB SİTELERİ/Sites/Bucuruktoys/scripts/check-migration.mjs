import { readFile,stat } from 'node:fs/promises';
import { resolve,join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
const source=JSON.parse(await readFile(join(root,'Arşiv/Cloudflare Taşıma Öncesi 2026-11-11/Veri.json'),'utf8'));
let missing=0,invalid=0;
for(const object of source.storage_objects.filter(o=>o.bucket_id==='product-images')) {
  const target=resolve(root,'public/files/product-images',object.name);
  if(!target.startsWith(resolve(root,'public/files/product-images')+'\\')&&!target.startsWith(resolve(root,'public/files/product-images')+'/'))throw new Error('Invalid object path');
  try {
    const size=(await stat(target)).size;
    const hash=createHash('md5').update(await readFile(target)).digest('hex');
    if(size!==object.metadata.size||hash!==object.metadata.eTag.replaceAll('"',''))invalid++;
  }catch(e){if(e.code==='ENOENT')missing++;else throw e;}
}
if(missing||invalid){console.error(`Yayın durduruldu: ${missing} kaynak görsel eksik, ${invalid} dosya doğrulanamadı.`);process.exit(1);}
const sql="SELECT (SELECT count(*) FROM uploaded_files WHERE bucket='print-request-files') private_files,(SELECT count(*) FROM admin_credentials) credentials,(SELECT count(*) FROM admin_users WHERE is_active=1) admins,(SELECT count(*) FROM products WHERE image_url LIKE '%supabase.co%' OR gallery LIKE '%supabase.co%') legacy_images";
const raw=execFileSync(process.execPath,[join(root,'node_modules/wrangler/bin/wrangler.js'),'d1','execute','bucuruktoys','--remote','--command',sql,'--json'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']});
const result=JSON.parse(raw)[0].results[0];
if(result.private_files!==source.storage_objects.filter(o=>o.bucket_id==='print-request-files').length||result.credentials<result.admins||result.legacy_images){console.error('Yayın durduruldu: özel dosyalar, yönetici girişi veya görsel bağlantıları henüz tamamlanmadı.');process.exit(1);}
console.log('Dosya ve giriş aktarımı kontrolü geçti.');
