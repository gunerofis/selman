import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const major=Number(process.versions.node.split('.')[0]);
const checks=[
  ['Node.js 24+',major>=24,process.version],
  ['.env',existsSync('.env'),'pnpm setup:local ile oluşturulur'],
  ['Veritabanı',existsSync('data/core.sqlite'),'pnpm setup:local ile oluşturulur'],
  ['Erişim anahtarları',existsSync('.local-access-keys.txt'),'pnpm setup:local ile oluşturulur'],
  ['Worker',existsSync('apps/worker/worker.mjs'),'apps/worker/worker.mjs'],
  ['Sürümlü migration',existsSync('packages/data/migrations/001_order_lifecycle.sql'),'packages/data/migrations']
];
let docker='bulunamadı';
try { docker=execFileSync('docker',['--version'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim(); } catch {}
checks.push(['Docker (isteğe bağlı)',docker!=='bulunamadı',docker]);
let postgres='bulunamadı';
try { postgres=execFileSync('psql',['--version'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim(); } catch {}
checks.push(['PostgreSQL',postgres!=='bulunamadı',postgres]);
for (const [name,ok,detail] of checks) console.log(`${ok?'✓':'!'} ${name}: ${detail}`);
if (!checks[0][1]) process.exitCode=1;
