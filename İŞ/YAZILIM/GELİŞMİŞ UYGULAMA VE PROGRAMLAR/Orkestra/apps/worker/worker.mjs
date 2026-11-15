import { randomUUID } from 'node:crypto';
import { openStore } from '../../core/store.mjs';
import { processNextInbox, processNextOutbox, recoverStuckInbox } from '../../core/orders.mjs';
import { processNextShopifySyncJob } from '../../core/connectors/shopify.mjs';
import { processNextGoogleSyncJob } from '../../core/connectors/google.mjs';

const db=openStore(process.env.DATABASE_PATH??'data/core.sqlite');
const instanceId=randomUUID();
let stopping=false;

function heartbeat(status='running',details={}) {
  const now=new Date().toISOString();
  db.prepare('INSERT INTO service_heartbeats(service,instance_id,status,last_seen_at,details_json) VALUES(?,?,?,?,?) ON CONFLICT(service) DO UPDATE SET instance_id=excluded.instance_id,status=excluded.status,last_seen_at=excluded.last_seen_at,details_json=excluded.details_json').run('worker',instanceId,status,now,JSON.stringify(details));
}

async function loop() {
  recoverStuckInbox(db);
  heartbeat('running',{pid:process.pid});
  console.log('Orkestra worker hazır.');
  while(!stopping) {
    const integration=await processNextGoogleSyncJob(db);
    const sync=await processNextShopifySyncJob(db);
    const inbox=processNextInbox(db);
    const outbox=processNextOutbox(db);
    heartbeat('running',{pid:process.pid,lastIntegrationSync:integration?.id??null,lastSync:sync?.id??null,lastInbox:inbox?.inboxId??null,lastOutbox:outbox?.id??null});
    if(!integration&&!sync&&!inbox&&!outbox)await new Promise(resolve=>setTimeout(resolve,350));
  }
}

async function close() {
  if(stopping)return;
  stopping=true;
  heartbeat('stopped',{pid:process.pid});
  db.close();
  process.exit(0);
}

process.on('SIGINT',close);
process.on('SIGTERM',close);
loop().catch(error=>{console.error('Worker durdu:',error.message);try{heartbeat('failed',{message:error.message});db.close();}finally{process.exit(1);}});
