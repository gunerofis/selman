import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const syntaxFiles=['public/app.js','apps/api/server.mjs','apps/worker/worker.mjs','core/store.mjs','core/orders.mjs','core/connectors/shopify.mjs','core/connectors/google.mjs','scripts/start-local.mjs','scripts/migrate.mjs','scripts/backup.mjs','scripts/restore-verify.mjs'];
for(const file of syntaxFiles){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);}
const tests=[...readdirSync('tests',{withFileTypes:true}).filter(item=>item.isFile()&&item.name.endsWith('.test.mjs')).map(item=>join('tests',item.name)),...readdirSync(join('tests','acceptance'),{withFileTypes:true}).filter(item=>item.isFile()&&item.name.endsWith('.test.mjs')).map(item=>join('tests','acceptance',item.name))];
const result=spawnSync(process.execPath,['--test',...tests],{stdio:'inherit'});
process.exit(result.status??1);
