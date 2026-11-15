import test,{afterEach,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { openStore,bootstrap } from '../../core/store.mjs';
import { enqueueOrderEvent,processNextInbox,processNextOutbox } from '../../core/orders.mjs';
import { createApp } from '../../apps/api/server.mjs';

const token='o'.repeat(48),operatorToken='p'.repeat(48);
let db,server,base;
beforeEach(async()=>{db=openStore();bootstrap(db,token);server=createApp(db,{ingestSecret:'s'.repeat(48)});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;});
afterEach(async()=>{await new Promise(resolve=>server.close(resolve));db.close();});
async function call(path,method='GET',data,accessToken=token){const response=await fetch(base+path,{method,headers:{Authorization:`Bearer ${accessToken}`,...(data!==undefined?{'Content-Type':'application/json'}:{})},body:data===undefined?undefined:JSON.stringify(data)});return {status:response.status,body:await response.json()};}
function work(){const inbox=processNextInbox(db);const outbox=processNextOutbox(db);return {inbox,outbox};}

test('demo order lifecycle is durable, assigned, idempotent and recoverable by reconcile',async()=>{
  assert.equal((await call('/api/admin/users','POST',{id:'operator',name:'Operatör',token:operatorToken,grants:[{brand:'guner',permission:'tasks.read'},{brand:'guner',permission:'tasks.update'},{brand:'*',permission:'preferences.write'}]})).status,201);
  assert.equal((await call('/api/admin/accounts','PUT',{id:'guner-demo-flow',brand:'guner',platform:'demo'})).status,200);
  for(const kind of ['invoice','production','shipping.domestic','shipping.international'])assert.equal((await call('/api/admin/rules','PUT',{id:`rule-${kind}`,brand:'guner',kind,assignee:'operator'})).status,200);
  const product=await call('/api/products','POST',{brand:'guner',sku:'FLOW-1',name:'Akış Ürünü',unit:'adet'});assert.equal(product.status,201);

  const created=await call('/api/admin/demo-orders','POST',{account:'guner-demo-flow',orderId:'FLOW-ORDER-1',customerId:'FLOW-CUSTOMER',needsProduction:true,international:false,lines:[{externalProductId:'source-product-1',sku:'FLOW-1',title:'Akış Ürünü',quantity:2,unit:'adet'}]});
  assert.equal(created.status,202);const first=work();assert.equal(first.inbox.taskCount,3);assert.equal(first.outbox.status,'delivered');
  const order=db.prepare("SELECT * FROM order_cache WHERE external_id='FLOW-ORDER-1'").get();assert.equal(order.source_version,1);
  assert.equal(db.prepare("SELECT entity_id FROM mappings WHERE account='guner-demo-flow' AND kind='product' AND external_id='source-product-1'").get().entity_id,product.body.id);
  assert.deepEqual(db.prepare('SELECT DISTINCT assignee FROM tasks WHERE order_id=?').all(order.id).map(row=>row.assignee),['operator']);
  const originalPayload=JSON.parse(db.prepare("SELECT payload_json FROM inbox_events WHERE event_id='demo:guner-demo-flow:FLOW-ORDER-1:1'").get().payload_json);
  assert.equal(enqueueOrderEvent(db,'guner-demo-flow',originalPayload,'order.created').duplicate,true);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM tasks WHERE order_id=?').get(order.id).n,3);

  assert.equal((await call('/api/admin/demo-orders/FLOW-ORDER-1','PATCH',{account:'guner-demo-flow',eventType:'order.updated',needsProduction:false,international:true})).status,202);work();
  let tasks=db.prepare('SELECT kind,status FROM tasks WHERE order_id=? ORDER BY kind').all(order.id);
  assert.equal(tasks.find(item=>item.kind==='production').status,'cancelled');assert.equal(tasks.find(item=>item.kind==='shipping.domestic').status,'cancelled');assert.equal(tasks.find(item=>item.kind==='shipping.international').status,'pending');

  const invoice=db.prepare("SELECT id FROM tasks WHERE order_id=? AND kind='invoice'").get(order.id);
  assert.equal((await call(`/api/tasks/${invoice.id}`,'PATCH',{status:'in_progress'},operatorToken)).status,200);
  assert.equal((await call('/api/admin/demo-orders/FLOW-ORDER-1','PATCH',{account:'guner-demo-flow',eventType:'order.cancelled'})).status,202);work();
  assert.equal(db.prepare('SELECT status FROM order_cache WHERE id=?').get(order.id).status,'cancelled');
  assert.ok(db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE order_id=? AND status='cancelled'").get(order.id).n>=3);

  assert.equal((await call('/api/admin/demo-orders/FLOW-ORDER-1','PATCH',{account:'guner-demo-flow',eventType:'order.restarted'})).status,202);work();
  assert.equal(db.prepare("SELECT status FROM tasks WHERE order_id=? AND kind='invoice'").get(order.id).status,'pending');
  assert.equal((await call('/api/admin/demo-orders/FLOW-ORDER-1','PATCH',{account:'guner-demo-flow',eventType:'order.updated',needsProduction:true,deliver:false})).status,200);
  assert.equal(db.prepare('SELECT source_version FROM order_cache WHERE id=?').get(order.id).source_version,4);
  const reconciled=await call('/api/admin/accounts/guner-demo-flow/reconcile','POST',{});assert.equal(reconciled.status,202);assert.equal(reconciled.body.queued,1);work();
  assert.equal(db.prepare('SELECT source_version FROM order_cache WHERE id=?').get(order.id).source_version,5);
  assert.equal(db.prepare("SELECT status FROM tasks WHERE order_id=? AND kind='production'").get(order.id).status,'pending');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM tasks WHERE order_id=?').get(order.id).n,4);

  const detail=await call(`/api/orders/${order.id}`);assert.equal(detail.status,200);assert.equal(detail.body.lines[0].mapping_status,'mapped');assert.equal(detail.body.history.length,5);
  const audit=await call('/api/audit?brand=guner');for(const action of ['order.created','order.updated','order.cancelled','order.restarted','account.reconciled'])assert.ok(audit.body.items.some(item=>item.action===action));
});

test('worker failures are persisted and personal visibility stays user-specific',async()=>{
  assert.equal((await call('/api/admin/users','POST',{id:'operator',name:'Operatör',token:operatorToken,grants:[{brand:'*',permission:'preferences.write'}]})).status,201);
  assert.equal((await call('/api/preferences','PUT',{key:'hidden_modules',value:['finance']},operatorToken)).status,200);
  assert.deepEqual((await call('/api/preferences','GET',undefined,operatorToken)).body.items.find(item=>item.pref_key==='hidden_modules').value,['finance']);
  assert.notDeepEqual((await call('/api/preferences')).body.items.find(item=>item.pref_key==='hidden_modules')?.value,['finance']);

  assert.equal((await call('/api/admin/accounts','PUT',{id:'bad-demo',brand:'guner',platform:'demo'})).status,200);
  const now=new Date().toISOString();db.prepare('INSERT INTO inbox_events(id,source,event_type,schema_version,account_id,correlation_id,payload_json,status,received_at,processed_at,event_id,digest,attempts,available_at,error_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),'connector','order.updated',1,'bad-demo','bad','{}','received',now,null,'bad-event','bad',0,now,null);
  assert.equal(processNextInbox(db).status,'failed');
  const errors=await call('/api/errors?brand=guner&status=all');assert.equal(errors.status,200);assert.equal(errors.body.items[0].code,'order_event_failed');
});
