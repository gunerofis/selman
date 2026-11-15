import { spawn } from 'node:child_process';

const children=[
  spawn(process.execPath,['apps/api/server.mjs'],{stdio:'inherit',env:process.env}),
  spawn(process.execPath,['apps/worker/worker.mjs'],{stdio:'inherit',env:process.env})
];
let stopping=false;

function stop(signal='SIGTERM') {
  if(stopping)return;
  stopping=true;
  for(const child of children)if(!child.killed)child.kill(signal);
}

for(const child of children)child.on('exit',code=>{if(!stopping&&code!==0){stop();process.exitCode=code??1;}});
process.on('SIGINT',()=>stop('SIGINT'));
process.on('SIGTERM',()=>stop('SIGTERM'));
await Promise.all(children.map(child=>new Promise(resolve=>child.on('exit',resolve))));
