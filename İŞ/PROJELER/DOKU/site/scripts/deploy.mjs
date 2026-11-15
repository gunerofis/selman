// Cloudflare yayını: önce `npm run build`, sonra `node scripts/deploy.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const file = path.join(root, 'dist', 'server', 'wrangler.json');
const c = JSON.parse(fs.readFileSync(file, 'utf8'));
c.name = c.topLevelName = 'doku';
c.d1_databases = [{binding: 'DB', database_name: 'doku-db', database_id: '8d7231c3-fbb8-47e0-9bd8-ca8f8027b03d'}];
c.vars = {...c.vars, DOKU_ADMIN_EMAIL: 'info@dokuduvar.com'};
c.workers_dev = true;
c.routes = [{pattern: 'www.dokuduvar.com', custom_domain: true}, {pattern: 'dokuduvar.com', custom_domain: true}];
if (process.argv.includes('--no-domain')) delete c.routes;
fs.writeFileSync(file, JSON.stringify(c));
const r = spawnSync(process.execPath, [path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js'), 'deploy', '--config', file], {stdio: 'inherit', cwd: root});
process.exit(r.status ?? 1);
