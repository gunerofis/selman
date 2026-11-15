import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { openStore, bootstrap } from '../core/store.mjs';
import { createApp } from '../apps/api/server.mjs';
import { processNextInbox } from '../core/orders.mjs';

const admin = 'a'.repeat(48), reader = 'b'.repeat(48), secret = 'c'.repeat(48);
let db, server, base;
before(async () => {
  db = openStore(); bootstrap(db,admin); server = createApp(db,{ingestSecret:secret});
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); db.close(); });
async function call(path,method='GET',data,token=admin,extra={}) {
  const res = await fetch(base+path,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',...extra},body:data === undefined ? undefined : JSON.stringify(data)});
  return {status:res.status,body:await res.json()};
}
async function rawGet(url,headers={}) {
  return await new Promise((resolve,reject)=>{
    const request=httpRequest(url,{headers},response=>{const chunks=[];response.on('data',chunk=>chunks.push(chunk));response.on('end',()=>resolve({status:response.statusCode,body:JSON.parse(Buffer.concat(chunks).toString())}));});
    request.on('error',reject);request.end();
  });
}
function event(eventId='event-1',orderId='order-1') { return {eventId,orderId,customerId:'customer-1',needsProduction:true,international:false}; }
async function deliver(input, {account='shop', timestamp=String(Date.now()), key=secret}={}) {
  const path = `/internal/accounts/${account}/order-created`;
  const signature = createHmac('sha256',key).update(`${timestamp}.${path}.`).update(JSON.stringify(input)).digest('hex');
  const accepted=await call(path,'POST',input,'',{'x-timestamp':timestamp,'x-signature':signature});
  if(accepted.status!==202)return accepted;
  const processed=processNextInbox(db);
  return {status:processed?.error?500:201,body:processed??accepted.body,accepted};
}
test('authentication and browser origin are enforced',async()=> {
  assert.equal((await call('/api/me','GET',undefined,'wrong')).status,401);
  assert.equal((await call('/api/me','GET',undefined,admin,{Origin:'https://example.com'})).status,403);
  assert.equal((await call('/api/me')).status,200);
});
test('password-free localhost mode keeps the configured user and permissions',async()=> {
  const localDb=openStore(); bootstrap(localDb,'d'.repeat(48),{id:'local-user',name:'Yerel kullanıcı'});
  const localServer=createApp(localDb,{ingestSecret:secret,passwordsDisabled:true,defaultUserId:'local-user'});
  await new Promise(resolve=>localServer.listen(0,'127.0.0.1',resolve));
  const localBase=`http://127.0.0.1:${localServer.address().port}`;
  try {
    const runtime=await fetch(localBase+'/api/runtime');
    const runtimeBody=await runtime.json();assert.equal(runtimeBody.passwordsDisabled,true);assert.equal(runtimeBody.users[0].id,'local-user');
    const me=await fetch(localBase+'/api/me');
    assert.equal(me.status,200);
    assert.equal((await me.json()).user.id,'local-user');
    assert.equal((await fetch(localBase+'/api/feature-access/web/unlock',{method:'POST'})).status,200);
    assert.deepEqual((await rawGet(localBase+'/api/runtime',{Host:'preview.example'})).body,{passwordsDisabled:false,users:[]});
    assert.equal((await rawGet(localBase+'/api/me',{Host:'preview.example'})).status,401);
  } finally {
    await new Promise(resolve=>localServer.close(resolve)); localDb.close();
  }
});
test('panel assets are public and same-origin API requests are allowed',async()=> {
  const page = await fetch(base+'/');
  assert.equal(page.status,200);
  assert.match(await page.text(),/İşletme Orkestratörü/i);
  assert.equal((await call('/api/me','GET',undefined,admin,{Origin:base})).status,200);
});
test('profile folder locks persist without changing API permissions',async()=> {
  assert.deepEqual((await call('/api/feature-access')).body.items,[]);
  assert.equal((await call('/api/feature-access/web/unlock','POST',{pin:'wrong'})).status,403);
  assert.equal((await call('/api/feature-access/web/unlock','POST',{pin:'1122'})).status,200);
  assert.equal((await call('/api/feature-access')).body.items[0].unlocked,1);
  assert.equal((await call('/api/feature-access/web/lock','POST')).status,200);
  assert.equal((await call('/api/feature-access')).body.items[0].unlocked,0);
});
test('order desk reads orders and the finance summary without the ledger',async()=> {
  const desk='e'.repeat(48);
  assert.equal((await call('/api/admin/users','POST',{id:'ali-desk',name:'Ali masa',token:desk,grants:[{brand:'*',permission:'orders.read'},{brand:'*',permission:'finance.summary'}]})).status,201);
  assert.equal((await call('/api/orders?brand=guner','GET',undefined,desk)).status,200);
  assert.equal((await call('/api/finance/summary?brand=guner','GET',undefined,desk)).status,200);
  assert.equal((await call('/api/customers?brand=guner','GET',undefined,desk)).status,403);
  assert.equal((await call('/api/invoices?brand=guner','GET',undefined,desk)).status,403);
  assert.equal((await call('/api/expenses?brand=guner','GET',undefined,desk)).status,403);
});
test('admin configures account, user and future task assignment',async()=> {
  assert.equal((await call('/api/admin/accounts','PUT',{id:'shop',brand:'guner',platform:'demo'})).status,200);
  assert.equal((await call('/api/admin/users','POST',{id:'reader',name:'Test user',token:reader,grants:[{brand:'guner',permission:'tasks.read'}]})).status,201);
  assert.equal((await call('/api/admin/rules','PUT',{id:'production-rule',brand:'guner',kind:'production',assignee:'reader'})).status,200);
  assert.equal((await call('/api/admin/accounts','PUT',{id:'shop',brand:'other',platform:'demo'})).status,409);
});
test('signed order produces mapping, tasks and audit atomically',async()=> {
  const response = await deliver(event()); assert.equal(response.status,201); assert.equal(response.body.taskCount,3);
  const tasks = (await call('/api/tasks?brand=guner')).body.items;
  assert.equal(tasks.length,3); assert.equal(tasks.find(t=>t.kind==='production').assignee,'reader');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM mappings').get().n,2);
  assert.equal((await call('/api/orders?brand=guner')).body.items[0].stale,0);
  assert.ok((await call('/api/audit?brand=guner')).body.items.some(x=>x.action==='order.created'));
});
test('event and order idempotency avoid duplicate work',async()=> {
  assert.equal((await deliver(event())).body.duplicate,true);
  assert.equal((await deliver(event('event-2'))).body.stale,true);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM tasks').get().n,3);
  assert.equal((await deliver({...event(),international:true})).status,409);
});
test('invalid signature, expired message and invalid schema create no records',async()=> {
  assert.equal((await deliver(event('bad-1','bad-1'),{key:'wrong'})).status,401);
  assert.equal((await deliver(event('bad-2','bad-2'),{timestamp:String(Date.now()-600000)})).status,401);
  assert.equal((await deliver({...event('bad-3','bad-3'),needsProduction:'yes'})).status,400);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM events').get().n,2);
});
test('brand and permission isolation applies to reads and writes',async()=> {
  assert.equal((await call('/api/tasks?brand=guner','GET',undefined,reader)).status,200);
  assert.equal((await call('/api/tasks?brand=other','GET',undefined,reader)).status,403);
  assert.equal((await call('/api/orders?brand=guner','GET',undefined,reader)).status,403);
  assert.equal((await call('/api/admin/accounts','PUT',{id:'x',brand:'guner',platform:'demo'},reader)).status,403);
  const id = db.prepare('SELECT id FROM tasks LIMIT 1').get().id;
  assert.equal((await call(`/api/tasks/${id}`,'PATCH',{status:'in_progress'},reader)).status,403);
});
test('task lifecycle rejects skipping or reopening completion',async()=> {
  const id = db.prepare('SELECT id FROM tasks LIMIT 1').get().id;
  assert.equal((await call(`/api/tasks/${id}`,'PATCH',{status:'done'})).status,409);
  assert.equal((await call(`/api/tasks/${id}`,'PATCH',{status:'in_progress'})).status,200);
  assert.equal((await call(`/api/tasks/${id}`,'PATCH',{status:'done'})).status,200);
  assert.equal((await call(`/api/tasks/${id}`,'PATCH',{status:'pending'})).status,409);
});
test('a database failure rolls back the entire order event',async()=> {
  db.exec("CREATE TRIGGER simulate_failure BEFORE INSERT ON tasks WHEN NEW.kind='invoice' BEGIN SELECT RAISE(ABORT,'simulated'); END;");
  assert.equal((await deliver(event('rollback','rollback'))).status,500);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM events WHERE event_id='rollback'").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM mappings WHERE external_id='rollback'").get().n,0);
  db.exec('DROP TRIGGER simulate_failure');
});
test('changed assignment only affects future tasks; international route is distinct',async()=> {
  assert.equal((await call('/api/admin/rules','PUT',{id:'production-rule',brand:'guner',kind:'production',assignee:null})).status,200);
  assert.equal((await deliver({...event('event-3','order-3'),international:true})).status,201);
  const tasks = (await call('/api/tasks?brand=guner')).body.items;
  assert.equal(tasks.filter(t=>t.kind==='production' && t.assignee==='reader').length,1);
  assert.equal(tasks.filter(t=>t.kind==='shipping.international').length,1);
});
test('expired cache is marked stale and invalid pagination is rejected',async()=> {
  db.exec("UPDATE order_cache SET expires_at='2000-01-01T00:00:00.000Z'");
  assert.ok((await call('/api/orders?brand=guner')).body.items.every(x=>x.stale===1));
  assert.equal((await call('/api/tasks?brand=guner&limit=-1')).status,400);
});
test('admin panel lists configuration and creates a demo order',async()=> {
  assert.ok((await call('/api/admin/accounts?brand=guner')).body.items.some(account=>account.id==='shop'));
  assert.ok((await call('/api/admin/integrations?brand=guner')).body.items.some(connection=>connection.id==='guner-faprika'));
  assert.equal((await call('/api/admin/rules?brand=guner')).body.items.length,1);
  assert.ok((await call('/api/admin/users?brand=guner')).body.items.some(user=>user.id==='reader'));
  assert.equal((await call('/api/admin/accounts?brand=guner','GET',undefined,reader)).status,403);
  assert.equal((await call('/api/admin/users/reader','PUT',{brand:'guner',permissions:['orders.read']})).status,200);
  assert.equal((await call('/api/orders?brand=guner','GET',undefined,reader)).status,200);
  assert.equal((await call('/api/tasks?brand=guner','GET',undefined,reader)).status,403);
  assert.equal((await call('/api/admin/users/admin','PUT',{brand:'guner',permissions:[]})).status,409);
  assert.equal((await call('/api/admin/accounts','PUT',{id:'demo-ui',brand:'guner',platform:'demo'})).status,200);
  const created = await call('/api/admin/demo-orders','POST',{account:'demo-ui',orderId:'UI-1001',customerId:'UI-CUSTOMER',needsProduction:false,international:true});
  assert.equal(created.status,202);
  assert.equal(processNextInbox(db).taskCount,2);
  const task = (await call('/api/tasks?brand=guner')).body.items.find(item=>item.external_order_id==='UI-1001');
  assert.equal(task.account,'demo-ui');
  assert.equal((await call('/api/admin/accounts','PUT',{id:'live-test',brand:'guner',platform:'shopify'})).status,200);
  assert.equal((await call('/api/admin/demo-orders','POST',{account:'live-test',orderId:'NOPE',needsProduction:false,international:false})).status,409);
});
