import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('.env')) {
  console.error('Önce pnpm setup:local çalıştırın.');
  process.exit(1);
}
const server=spawn(process.execPath,['--env-file-if-exists=.env','scripts/start-local.mjs'],{stdio:'inherit'});
const url='http://127.0.0.1:3187/';
const edge=join(process.env['ProgramFiles(x86)']??'C:\\Program Files (x86)','Microsoft','Edge','Application','msedge.exe');
setTimeout(()=>{
  if (process.platform==='win32' && existsSync(edge)) spawn(edge,[`--app=${url}`,'--kiosk','--start-maximized'],{detached:true,stdio:'ignore'}).unref();
  else console.log(`Uygulamayı açın: ${url}`);
},650);
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.kill(signal));
