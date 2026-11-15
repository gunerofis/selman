import { openStore } from '../core/store.mjs';
const db=openStore(process.env.DATABASE_PATH??'data/core.sqlite');
const applied=db.prepare('SELECT id,applied_at FROM schema_migrations ORDER BY id').all();
db.close();
console.log(`Şema güncel: ${applied.length} migration (${applied.map(item=>item.id).join(', ')}).`);
