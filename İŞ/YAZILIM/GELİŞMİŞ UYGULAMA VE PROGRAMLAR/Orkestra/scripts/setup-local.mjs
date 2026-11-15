import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { openStore, bootstrap, hash, transaction, audit } from '../core/store.mjs';

const root = process.cwd();
const dataDir = join(root,'data');
const envPath = join(root,'.env');
const keyPath = join(root,'.local-access-keys.txt');
const dbPath = join(dataDir,'core.sqlite');
mkdirSync(dataDir,{recursive:true});

if (existsSync(dbPath)) {
  console.log('Yerel veritabanı zaten var. Mevcut kurulum değiştirilmedi.');
  process.exit(0);
}

const people = [
  ['selman','Selman',['web','products','production','admin']],
  ['hasan','Hasan',['production','orders','inventory','customers']],
  ['ali','Ali',['finance','reports','tasks']],
  ['gulay','Gülay',['messages','orders','invoices','shipping']],
  ['korhan','Korhan',['international-sales','customers','shipping']]
];
const tokens = new Map(people.map(([id])=>[id,randomBytes(32).toString('base64url')]));
const ingestSecret=randomBytes(48).toString('base64url');
const db=openStore(dbPath);
try {
  bootstrap(db,tokens.get('selman'),{id:'selman',name:'Selman'});
  transaction(db,()=>{
    const now=new Date().toISOString();
    for (const [id,name,pins] of people.slice(1)) {
      db.prepare('INSERT INTO users(id,name,token_hash) VALUES(?,?,?)').run(id,name,hash(tokens.get(id)));
      const grants=id==='ali'?['orders.read','finance.summary']:['*'];
      for (const permission of grants) db.prepare('INSERT INTO grants VALUES(?,?,?)').run(id,'*',permission);
      db.prepare('INSERT INTO user_preferences VALUES(?,?,?,?)').run(id,'pinned_modules',JSON.stringify(pins),now);
      db.prepare('INSERT INTO user_preferences VALUES(?,?,?,?)').run(id,'hidden_modules','[]',now);
      db.prepare('INSERT INTO user_preferences VALUES(?,?,?,?)').run(id,'start_module',id==='ali'?'"orders"':'"home"',now);
      audit(db,'setup','*','user.created',null,{id,fullAccess:id!=='ali',permissions:grants});
    }
    db.prepare('INSERT INTO user_preferences VALUES(?,?,?,?)').run('selman','pinned_modules',JSON.stringify(people[0][2]),now);
    for (const brand of ['teknik','makro','guner']) db.prepare('INSERT OR IGNORE INTO accounts(id,brand,platform,status,connection_status) VALUES(?,?,?,?,?)').run(`${brand}-demo`,brand,'demo','ready','connected');
  });
} finally { db.close(); }

const env = `PORT=3187\nHOST=127.0.0.1\nDATABASE_PATH=data/core.sqlite\nBOOTSTRAP_TOKEN=${tokens.get('selman')}\nINGEST_SECRET=${ingestSecret}\nFEATURE_PIN=1122\nPASSWORDS_DISABLED=true\nDEFAULT_USER_ID=selman\n`;
writeFileSync(envPath,env,{encoding:'utf8',mode:0o600});
const access = ['ORKESTRA YEREL ERİŞİM ANAHTARLARI','Bu dosyayı paylaşmayın. Her kullanıcı kendi anahtarını kullanır.','',...people.map(([id,name])=>`${name} (${id}): ${tokens.get(id)}`),'','Klasör kilit kodu: 1122'].join('\n');
writeFileSync(keyPath,access,{encoding:'utf8',mode:0o600});
console.log(`Kurulum tamamlandı. Anahtarlar: ${keyPath}`);
