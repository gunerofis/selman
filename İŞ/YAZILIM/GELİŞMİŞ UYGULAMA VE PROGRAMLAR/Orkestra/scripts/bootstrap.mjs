import { openStore, bootstrap } from '../core/store.mjs';
const db = openStore(process.env.DATABASE_PATH ?? 'data/core.sqlite');
try { bootstrap(db,process.env.BOOTSTRAP_TOKEN); console.log('İlk yerel yönetici oluşturuldu.'); }
finally { db.close(); }
