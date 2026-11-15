import { randomUUID } from 'node:crypto';
import { audit, hash, transaction } from './store.mjs';

export function fail(status, message) { throw Object.assign(new Error(message), { status }); }
export function identifier(value) { return typeof value === 'string' && /^[a-zA-Z0-9_.:@/-]{1,160}$/.test(value); }

const eventTypes=new Set(['order.created','order.updated','order.cancelled','order.restarted']);
const paymentStatuses=new Set(['unknown','pending','authorized','expired','partially_paid','paid','partially_refunded','refunded','voided']);
const fulfillmentStatuses=new Set(['unknown','unfulfilled','partial','fulfilled','on_hold','scheduled']);
const returnStatuses=new Set(['none','requested','in_progress','returned']);
const optionalString=(value,max)=>value===undefined||value===null||(typeof value==='string'&&value.length<=max);
const nonNegative=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0;

function normalizeCommerce(input) {
  const commerce=input.commerce??{};
  const amounts=commerce.amounts??{};
  const customer=commerce.customer??{};
  const shippingAddress=commerce.shippingAddress??null;
  const currency=commerce.currency??'TRY';
  if(!optionalString(commerce.orderNumber,100)||!optionalString(commerce.placedAt,40)||!optionalString(commerce.processedAt,40)||
    !/^[A-Z]{3}$/.test(currency)||!nonNegative(amounts.subtotal??0)||!nonNegative(amounts.shipping??0)||
    !nonNegative(amounts.tax??0)||!nonNegative(amounts.discount??0)||!nonNegative(amounts.total??0)||
    !paymentStatuses.has(commerce.paymentStatus??'unknown')||!fulfillmentStatuses.has(commerce.fulfillmentStatus??'unfulfilled')||
    !returnStatuses.has(commerce.returnStatus??'none')||!optionalString(customer.name,200)||!optionalString(customer.email,254)||
    !optionalString(customer.phone,60)||!(shippingAddress===null||(typeof shippingAddress==='object'&&!Array.isArray(shippingAddress)))||
    !(commerce.rawSnapshot===undefined||commerce.rawSnapshot===null||(typeof commerce.rawSnapshot==='object'&&!Array.isArray(commerce.rawSnapshot)))) fail(400,'Geçersiz sipariş ticari bilgisi');
  if(commerce.placedAt&& !Number.isFinite(Date.parse(commerce.placedAt)))fail(400,'Geçersiz sipariş tarihi');
  if(commerce.processedAt&& !Number.isFinite(Date.parse(commerce.processedAt)))fail(400,'Geçersiz işlem tarihi');
  const address=shippingAddress?Object.fromEntries(Object.entries(shippingAddress).filter(([,value])=>value!==null&&value!==undefined&&value!=='').map(([key,value])=>[String(key).slice(0,40),String(value).slice(0,300)])):null;
  return {
    orderNumber:commerce.orderNumber?.trim()||null,
    placedAt:commerce.placedAt?new Date(commerce.placedAt).toISOString():null,
    processedAt:commerce.processedAt?new Date(commerce.processedAt).toISOString():null,
    currency,
    amounts:{subtotal:amounts.subtotal??0,shipping:amounts.shipping??0,tax:amounts.tax??0,discount:amounts.discount??0,total:amounts.total??0},
    paymentStatus:commerce.paymentStatus??'unknown',
    fulfillmentStatus:commerce.fulfillmentStatus??'unfulfilled',
    returnStatus:commerce.returnStatus??'none',
    customer:{name:customer.name?.trim()||null,email:customer.email?.trim()||null,phone:customer.phone?.trim()||null},
    shippingAddress:address,
    rawSnapshot:commerce.rawSnapshot??null
  };
}

export function normalizeOrderEvent(input,eventType=input.eventType??'order.created') {
  if (!eventTypes.has(eventType) || !identifier(input.eventId) || !identifier(input.orderId) ||
    (input.customerId !== undefined && input.customerId !== null && !identifier(input.customerId)) ||
    typeof input.needsProduction !== 'boolean' || typeof input.international !== 'boolean' ||
    !Number.isInteger(input.sourceVersion??1) || (input.sourceVersion??1) < 1 ||
    !Array.isArray(input.lines??[]) || (input.lines??[]).length > 100) fail(400,'Geçersiz sipariş olayı');
  const commerce=normalizeCommerce(input);
  const lines=(input.lines??[]).map((line,index)=>{
    if (!line || typeof line !== 'object' || !identifier(line.externalProductId??`line-${index+1}`) ||
      (line.externalVariantId !== undefined && line.externalVariantId !== null && !identifier(line.externalVariantId)) ||
      (line.sku !== undefined && line.sku !== null && (typeof line.sku !== 'string' || line.sku.length > 80)) ||
      typeof line.title !== 'string' || !line.title.trim() || line.title.length > 200 ||
      typeof line.quantity !== 'number' || !Number.isFinite(line.quantity) || line.quantity <= 0 ||
      !nonNegative(line.unitPrice??0)||!nonNegative(line.lineTotal??((line.unitPrice??0)*line.quantity))||
      !/^[A-Z]{3}$/.test(line.currency??commerce.currency)) fail(400,'Geçersiz sipariş kalemi');
    return {externalProductId:line.externalProductId??`line-${index+1}`,externalVariantId:line.externalVariantId??null,sku:line.sku?.trim()||null,title:line.title.trim(),quantity:line.quantity,unit:typeof line.unit==='string'&&line.unit.trim()?line.unit.trim().slice(0,30):'adet',unitPrice:line.unitPrice??0,lineTotal:line.lineTotal??((line.unitPrice??0)*line.quantity),currency:line.currency??commerce.currency,raw:line.raw&&typeof line.raw==='object'&&!Array.isArray(line.raw)?line.raw:null};
  });
  return {eventId:input.eventId,eventType,orderId:input.orderId,sourceVersion:input.sourceVersion??1,customerId:input.customerId??null,needsProduction:input.needsProduction,international:input.international,commerce,lines};
}

function mapExternal(db,accountId,kind,externalId,preferredId=null) {
  const found=db.prepare('SELECT entity_id FROM mappings WHERE account=? AND kind=? AND external_id=?').get(accountId,kind,externalId);
  if(found)return found.entity_id;
  const id=preferredId??randomUUID();
  db.prepare('INSERT INTO mappings(account,kind,external_id,entity_id) VALUES(?,?,?,?)').run(accountId,kind,externalId,id);
  return id;
}

function desiredTaskKinds(event) {
  const kinds=['invoice',event.international?'shipping.international':'shipping.domestic'];
  if(event.needsProduction)kinds.push('production');
  return kinds;
}

function syncTasks(db,account,order,event,now) {
  const desired=event.eventType==='order.cancelled'?[]:desiredTaskKinds(event);
  const existing=db.prepare('SELECT * FROM tasks WHERE order_id=?').all(order.id);
  for(const task of existing) {
    if(!desired.includes(task.kind)&&['pending','in_progress','blocked'].includes(task.status)) {
      db.prepare('UPDATE tasks SET status=?,cancel_reason=?,updated_at=? WHERE id=?').run('cancelled',event.eventType,now,task.id);
      audit(db,`connector:${account.id}`,account.brand,'task.status_changed',{id:task.id,status:task.status},{id:task.id,status:'cancelled',reason:event.eventType});
    }
  }
  for(const kind of desired) {
    const task=existing.find(item=>item.kind===kind);
    const rule=db.prepare('SELECT assignee FROM rules WHERE brand=? AND kind=?').get(account.brand,kind);
    if(!task) {
      const id=randomUUID();
      db.prepare('INSERT INTO tasks(id,brand,order_id,kind,assignee,status,updated_at) VALUES(?,?,?,?,?,?,?)').run(id,account.brand,order.id,kind,rule?.assignee??null,'pending',now);
      audit(db,`connector:${account.id}`,account.brand,'task.created',null,{id,orderId:order.id,kind,assignee:rule?.assignee??null});
    } else if(task.status==='cancelled'&&task.cancel_reason!=='manual'&&event.eventType!=='order.cancelled') {
      db.prepare('UPDATE tasks SET status=?,assignee=?,cancel_reason=NULL,updated_at=? WHERE id=?').run('pending',rule?.assignee??task.assignee,now,task.id);
      audit(db,`connector:${account.id}`,account.brand,'task.restarted',{id:task.id,status:'cancelled'},{id:task.id,status:'pending'});
    }
  }
  return desired;
}

function resolveLineProduct(db,account,line) {
  if(line.externalVariantId) {
    const variant=db.prepare('SELECT entity_id FROM mappings WHERE account=? AND kind=? AND external_id=?').get(account.id,'variant',line.externalVariantId);
    if(variant)return {productId:variant.entity_id,status:'mapped'};
  }
  const existing=db.prepare('SELECT entity_id FROM mappings WHERE account=? AND kind=? AND external_id=?').get(account.id,'product',line.externalProductId);
  if(existing)return {productId:existing.entity_id,status:'mapped'};
  if(!line.sku)return {productId:null,status:'not_required'};
  const product=db.prepare("SELECT id FROM products WHERE brand=? AND sku=? AND status='active'").get(account.brand,line.sku);
  if(!product)return {productId:null,status:'unmatched'};
  db.prepare('INSERT INTO mappings(account,kind,external_id,entity_id) VALUES(?,?,?,?)').run(account.id,'product',line.externalProductId,product.id);
  return {productId:product.id,status:'mapped'};
}

function replaceLines(db,account,order,event,now) {
  db.prepare('DELETE FROM order_lines WHERE order_id=?').run(order.id);
  const insert=db.prepare('INSERT INTO order_lines(id,order_id,external_product_id,product_id,sku,title,quantity,unit,mapping_status,created_at,updated_at,external_variant_id,unit_price,line_total,currency,raw_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  const seen=new Set();
  for(const line of event.lines) {
    let externalId=line.externalProductId;
    if(seen.has(externalId))externalId=`${externalId}#${line.externalVariantId||line.raw?.lineItemId||seen.size+1}`;
    if(seen.has(externalId))externalId=`${externalId}#${seen.size+1}`;
    seen.add(externalId);
    const linked=resolveLineProduct(db,account,line);
    insert.run(randomUUID(),order.id,externalId,linked.productId,line.sku,line.title,line.quantity,line.unit,linked.status,now,now,line.externalVariantId,line.unitPrice,line.lineTotal,line.currency,line.raw?JSON.stringify(line.raw):null);
  }
}

function syncCustomer(db,account,event,localCustomerId,now) {
  const details=event.commerce.customer;
  if(!localCustomerId||(!details.name&&!details.email&&!details.phone))return;
  const existing=db.prepare('SELECT * FROM customers WHERE id=?').get(localCustomerId);
  if(existing)db.prepare('UPDATE customers SET name=?,email=?,phone=?,updated_at=? WHERE id=?').run(details.name||existing.name,details.email||existing.email,details.phone||existing.phone,now,localCustomerId);
  else db.prepare('INSERT INTO customers(id,brand,name,kind,email,phone,status,notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(localCustomerId,account.brand,details.name||details.email||details.phone||'İsimsiz müşteri','customer',details.email,details.phone,'active',null,now,now);
  if(event.customerId)db.prepare(`INSERT INTO customer_identities(id,customer_id,account_id,provider,external_id,email,phone,first_seen_at,last_seen_at,raw_json)
    VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(provider,account_id,external_id) DO UPDATE SET customer_id=excluded.customer_id,email=excluded.email,phone=excluded.phone,last_seen_at=excluded.last_seen_at`).run(randomUUID(),localCustomerId,account.id,account.platform,event.customerId,details.email,details.phone,now,now,null);
}

function applyOrderEventTx(db,account,event) {
  const digest=hash(JSON.stringify(event));
  const seen=db.prepare('SELECT digest FROM events WHERE account=? AND event_id=?').get(account.id,event.eventId);
  if(seen) {
    if(seen.digest!==digest)fail(409,'Aynı olay kimliği farklı içerikle gönderildi');
    return {duplicate:true};
  }
  const now=new Date().toISOString();
  db.prepare('INSERT INTO events(account,event_id,digest,created_at) VALUES(?,?,?,?)').run(account.id,event.eventId,digest,now);
  const existing=db.prepare('SELECT * FROM order_cache WHERE account=? AND external_id=?').get(account.id,event.orderId);
  if(existing&&event.sourceVersion<=existing.source_version) {
    audit(db,`connector:${account.id}`,account.brand,'order.stale_ignored',null,{orderId:existing.id,eventType:event.eventType,sourceVersion:event.sourceVersion,currentVersion:existing.source_version});
    return {duplicate:false,stale:true,orderId:existing.id,taskCount:db.prepare('SELECT COUNT(*) AS n FROM tasks WHERE order_id=?').get(existing.id).n};
  }
  const orderId=existing?.id??mapExternal(db,account.id,'order',event.orderId);
  let customerId=event.customerId?mapExternal(db,account.id,'customer',event.customerId):existing?.customer_id??null;
  if(!customerId&&event.commerce.customer.email)customerId=db.prepare('SELECT id FROM customers WHERE brand=? AND LOWER(email)=LOWER(?) ORDER BY updated_at DESC LIMIT 1').get(account.brand,event.commerce.customer.email)?.id??null;
  if(!customerId&&(event.commerce.customer.name||event.commerce.customer.email||event.commerce.customer.phone))customerId=randomUUID();
  syncCustomer(db,account,event,customerId,now);
  const nextStatus=event.eventType==='order.cancelled'?'cancelled':event.eventType==='order.restarted'?'open':existing?.status==='cancelled'?'cancelled':'open';
  const commerce=event.commerce;
  const before=existing?{status:existing.status,sourceVersion:existing.source_version,needsProduction:!!existing.needs_production,international:!!existing.international,paymentStatus:existing.payment_status,fulfillmentStatus:existing.fulfillment_status,grandTotal:existing.grand_total,currency:existing.currency}:null;
  if(existing) {
    db.prepare(`UPDATE order_cache SET customer_id=?,needs_production=?,international=?,expires_at=?,status=?,source_version=?,updated_at=?,cancelled_at=?,
      order_number=?,placed_at=?,processed_at=?,currency=?,subtotal=?,shipping_total=?,tax_total=?,discount_total=?,grand_total=?,payment_status=?,fulfillment_status=?,return_status=?,
      customer_name=?,customer_email=?,customer_phone=?,shipping_address_json=?,raw_snapshot_json=?,source_updated_at=? WHERE id=?`).run(
      customerId,Number(event.needsProduction),Number(event.international),new Date(Date.now()+86400000).toISOString(),nextStatus,event.sourceVersion,now,nextStatus==='cancelled'?now:null,
      commerce.orderNumber,commerce.placedAt,commerce.processedAt,commerce.currency,commerce.amounts.subtotal,commerce.amounts.shipping,commerce.amounts.tax,commerce.amounts.discount,commerce.amounts.total,commerce.paymentStatus,commerce.fulfillmentStatus,commerce.returnStatus,
      commerce.customer.name,commerce.customer.email,commerce.customer.phone,commerce.shippingAddress?JSON.stringify(commerce.shippingAddress):null,commerce.rawSnapshot?JSON.stringify(commerce.rawSnapshot):null,event.sourceVersion>1000000000000?new Date(event.sourceVersion).toISOString():now,orderId);
  } else {
    db.prepare(`INSERT INTO order_cache(id,account,external_id,customer_id,needs_production,international,expires_at,status,source_version,updated_at,cancelled_at,
      order_number,placed_at,processed_at,currency,subtotal,shipping_total,tax_total,discount_total,grand_total,payment_status,fulfillment_status,return_status,customer_name,customer_email,customer_phone,shipping_address_json,raw_snapshot_json,source_updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      orderId,account.id,event.orderId,customerId,Number(event.needsProduction),Number(event.international),new Date(Date.now()+86400000).toISOString(),nextStatus,event.sourceVersion,now,nextStatus==='cancelled'?now:null,
      commerce.orderNumber,commerce.placedAt,commerce.processedAt,commerce.currency,commerce.amounts.subtotal,commerce.amounts.shipping,commerce.amounts.tax,commerce.amounts.discount,commerce.amounts.total,commerce.paymentStatus,commerce.fulfillmentStatus,commerce.returnStatus,
      commerce.customer.name,commerce.customer.email,commerce.customer.phone,commerce.shippingAddress?JSON.stringify(commerce.shippingAddress):null,commerce.rawSnapshot?JSON.stringify(commerce.rawSnapshot):null,event.sourceVersion>1000000000000?new Date(event.sourceVersion).toISOString():now);
  }
  const order=db.prepare('SELECT * FROM order_cache WHERE id=?').get(orderId);
  replaceLines(db,account,order,event,now);
  const kinds=syncTasks(db,account,order,event,now);
  const after={status:nextStatus,sourceVersion:event.sourceVersion,needsProduction:event.needsProduction,international:event.international,paymentStatus:commerce.paymentStatus,fulfillmentStatus:commerce.fulfillmentStatus,grandTotal:commerce.amounts.total,currency:commerce.currency,lineCount:event.lines.length,kinds};
  db.prepare('INSERT INTO order_history(id,order_id,event_type,source_version,before_json,after_json,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),orderId,event.eventType,event.sourceVersion,JSON.stringify(before),JSON.stringify(after),now);
  audit(db,`connector:${account.id}`,account.brand,event.eventType,before,after);
  return {duplicate:false,stale:false,orderId,taskCount:kinds.length,status:nextStatus,sourceVersion:event.sourceVersion};
}

export function ingest(db,accountId,input) {
  const event=normalizeOrderEvent(input,input.eventType??'order.created');
  const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(accountId);
  if(!account)fail(404,'Hesap bulunamadı');
  return transaction(db,()=>applyOrderEventTx(db,account,event));
}

export function enqueueOrderEvent(db,accountId,input,eventType=input.eventType??'order.created') {
  const event=normalizeOrderEvent(input,eventType);
  const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(accountId);
  if(!account)fail(404,'Hesap bulunamadı');
  const digest=hash(JSON.stringify(event));
  const existing=db.prepare("SELECT id,digest,status FROM inbox_events WHERE source='connector' AND account_id=? AND event_id=?").get(accountId,event.eventId);
  if(existing) {
    if(existing.digest!==digest)fail(409,'Aynı olay kimliği farklı içerikle gönderildi');
    return {duplicate:true,inboxId:existing.id,status:existing.status};
  }
  const id=randomUUID(),now=new Date().toISOString();
  db.prepare('INSERT INTO inbox_events(id,source,event_type,schema_version,account_id,correlation_id,payload_json,status,received_at,processed_at,event_id,digest,attempts,available_at,error_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,'connector',event.eventType,1,accountId,event.orderId,JSON.stringify(event),'received',now,null,event.eventId,digest,0,now,null);
  return {duplicate:false,inboxId:id,status:'received'};
}

export function recoverStuckInbox(db,olderThanMs=30000) {
  const threshold=new Date(Date.now()-olderThanMs).toISOString();
  return db.prepare("UPDATE inbox_events SET status='retry',available_at=?,error_json=? WHERE status='processing' AND received_at<?").run(new Date().toISOString(),JSON.stringify({message:'Worker yeniden başlatıldı; işlem geri alındı.'}),threshold).changes;
}

export function processNextInbox(db) {
  const now=new Date().toISOString();
  const row=db.prepare("SELECT * FROM inbox_events WHERE status IN ('received','retry') AND COALESCE(available_at,received_at)<=? ORDER BY received_at LIMIT 1").get(now);
  if(!row)return null;
  const claimed=db.prepare("UPDATE inbox_events SET status='processing',attempts=attempts+1 WHERE id=? AND status IN ('received','retry')").run(row.id);
  if(!claimed.changes)return null;
  try {
    return transaction(db,()=>{
      const current=db.prepare('SELECT * FROM inbox_events WHERE id=?').get(row.id);
      const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(current.account_id);
      if(!account)fail(404,'Hesap bulunamadı');
      const event=normalizeOrderEvent(JSON.parse(current.payload_json),current.event_type);
      const result=applyOrderEventTx(db,account,event);
      const completedAt=new Date().toISOString();
      db.prepare("UPDATE inbox_events SET status='processed',processed_at=?,error_json=NULL WHERE id=?").run(completedAt,current.id);
      db.prepare('INSERT INTO outbox_events(id,event_type,aggregate_id,payload_json,status,attempts,available_at,created_at,delivered_at) VALUES(?,?,?,?,?,?,?,?,?)').run(randomUUID(),`${event.eventType}.processed`,result.orderId??event.orderId,JSON.stringify(result),'pending',0,completedAt,completedAt,null);
      return {inboxId:current.id,...result};
    });
  } catch(error) {
    const current=db.prepare('SELECT attempts,account_id FROM inbox_events WHERE id=?').get(row.id);
    const account=db.prepare('SELECT brand FROM accounts WHERE id=?').get(current?.account_id);
    const retry=current&&current.attempts<3&&error.status>=500;
    const status=retry?'retry':'failed',availableAt=new Date(Date.now()+Math.max(1000,(current?.attempts??1)*2000)).toISOString();
    transaction(db,()=>{
      db.prepare('UPDATE inbox_events SET status=?,available_at=?,processed_at=?,error_json=? WHERE id=?').run(status,availableAt,new Date().toISOString(),JSON.stringify({message:error.message,status:error.status??500}),row.id);
      if(!retry)db.prepare('INSERT INTO integration_errors(id,brand,account_id,inbox_id,code,message,status,context_json,created_at,resolved_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),account?.brand??'*',current?.account_id??null,row.id,'order_event_failed',error.message,'open',JSON.stringify({status:error.status??500}),new Date().toISOString(),null);
    });
    return {inboxId:row.id,error:error.message,status};
  }
}

export function processNextOutbox(db) {
  const item=db.prepare("SELECT * FROM outbox_events WHERE status='pending' AND available_at<=? ORDER BY created_at LIMIT 1").get(new Date().toISOString());
  if(!item)return null;
  const now=new Date().toISOString();
  db.prepare("UPDATE outbox_events SET status='delivered',attempts=attempts+1,delivered_at=? WHERE id=? AND status='pending'").run(now,item.id);
  return {...item,status:'delivered',delivered_at:now};
}
