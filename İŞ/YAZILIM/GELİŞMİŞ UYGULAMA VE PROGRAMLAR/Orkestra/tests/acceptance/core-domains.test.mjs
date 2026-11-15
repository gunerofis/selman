import test,{afterEach,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import { openStore, bootstrap } from '../../core/store.mjs';
import { createApp } from '../../apps/api/server.mjs';

const token='z'.repeat(48);
let db,server,base;
beforeEach(async()=>{db=openStore();bootstrap(db,token);server=createApp(db,{ingestSecret:'y'.repeat(48)});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;});
afterEach(async()=>{await new Promise(resolve=>server.close(resolve));db.close();});
async function call(path,method='GET',data){const response=await fetch(base+path,{method,headers:{Authorization:`Bearer ${token}`,...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});return {status:response.status,body:await response.json()};}

test('customer, product, stock count, quote and production stay consistent',async()=>{
  const customer=await call('/api/customers','POST',{brand:'guner',name:'Kabul Müşterisi',kind:'customer'});
  assert.equal(customer.status,201);
  const product=await call('/api/products','POST',{brand:'guner',sku:'KABUL-1',name:'Kabul Ürünü',unit:'adet'});
  assert.equal(product.status,201); assert.equal(product.body.openingQuantity,1000); assert.equal(product.body.verificationStatus,'unverified');
  const inventory=await call('/api/inventory?brand=guner');
  assert.equal(inventory.body.items[0].available,1000); assert.equal(inventory.body.items[0].verification_status,'unverified');
  const count=await call('/api/inventory/counts','POST',{brand:'guner',positionId:product.body.positionId,count:42,note:'Kabul sayımı'});
  assert.equal(count.status,201); assert.equal(count.body.verificationStatus,'verified');
  const quote=await call('/api/quotes','POST',{brand:'guner',number:'TKL-1',customerId:customer.body.id,currency:'TRY',total:1250});
  assert.equal(quote.status,201);
  const production=await call('/api/production','POST',{brand:'guner',code:'URET-1',productId:product.body.id,quantity:5});
  assert.equal(production.status,201);
  assert.equal((await call(`/api/production/${production.body.id}`,'PATCH',{status:'in_progress'})).status,200);
  const overview=await call('/api/overview?brand=guner');
  assert.equal(overview.body.counts.customers,1); assert.equal(overview.body.counts.products,1); assert.equal(overview.body.counts.stockPending,0); assert.equal(overview.body.counts.production,1);
  const audit=await call('/api/audit?brand=guner');
  assert.ok(audit.body.items.some(item=>item.action==='inventory.count_approved'));
});

test('shipping, invoicing and payments are managed with audited state transitions',async()=>{
  const customer=await call('/api/customers','POST',{brand:'guner',name:'Operasyon Müşterisi',kind:'customer'});
  const shipment=await call('/api/shipments','POST',{brand:'guner',orderId:null,carrier:'Yurtiçi Kargo',trackingNumber:'YK-TEST-1',note:'Kabul gönderisi'});
  assert.equal(shipment.status,201); assert.equal(shipment.body.status,'preparing');
  assert.equal((await call(`/api/shipments/${shipment.body.id}`,'PATCH',{status:'shipped'})).body.status,'shipped');
  assert.equal((await call(`/api/shipments/${shipment.body.id}`,'PATCH',{status:'in_transit'})).body.status,'in_transit');
  assert.equal((await call(`/api/shipments/${shipment.body.id}`,'PATCH',{status:'delivered'})).body.status,'delivered');
  const invoice=await call('/api/invoices','POST',{brand:'guner',number:'FTR-TEST-1',customerId:customer.body.id,currency:'TRY',total:500});
  assert.equal(invoice.status,201); assert.equal((await call(`/api/invoices/${invoice.body.id}`,'PATCH',{status:'issued'})).body.status,'issued');
  const payment=await call('/api/payments','POST',{brand:'guner',invoiceId:invoice.body.id,direction:'incoming',currency:'TRY',amount:500,method:'Banka havalesi',reference:'TEST'});
  assert.equal(payment.status,201);
  const invoices=await call('/api/invoices?brand=guner');
  assert.equal(invoices.body.items[0].status,'paid'); assert.equal(invoices.body.items[0].paid_total,500);
  const shipments=await call('/api/shipments?brand=guner');
  assert.equal(shipments.body.items[0].status,'delivered');
  const audit=await call('/api/audit?brand=guner');
  assert.ok(audit.body.items.some(item=>item.action==='shipment.status_changed'));
  assert.ok(audit.body.items.some(item=>item.action==='payment.created'));
});

test('operations, customer timeline, finance reports and external approvals stay traceable',async()=>{
  const customer=await call('/api/customers','POST',{brand:'guner',name:'Zincir Müşterisi',kind:'customer',email:'zincir@example.test'});
  assert.equal((await call(`/api/customers/${customer.body.id}/notes`,'POST',{body:'Öncelikli müşteri notu',pinned:true})).status,201);
  assert.equal((await call(`/api/customers/${customer.body.id}/interactions`,'POST',{kind:'call',direction:'outgoing',subject:'Sipariş teyidi',summary:'Müşteriyle görüşüldü'})).status,201);
  const customerDetail=await call(`/api/customers/${customer.body.id}`);
  assert.equal(customerDetail.body.notes.length,1);assert.equal(customerDetail.body.interactions.length,1);

  const material=await call('/api/products','POST',{brand:'guner',sku:'HAM-1',name:'Ham madde',unit:'adet'});
  const finished=await call('/api/products','POST',{brand:'guner',sku:'MAMUL-1',name:'Mamul',unit:'adet'});
  assert.equal((await call('/api/inventory/counts','POST',{brand:'guner',positionId:material.body.positionId,count:20,note:'Başlangıç sayımı'})).status,201);
  const reservation=await call('/api/inventory/reservations','POST',{brand:'guner',positionId:material.body.positionId,orderId:null,quantity:3});
  assert.equal(reservation.status,201);assert.equal((await call(`/api/inventory/reservations/${reservation.body.id}/release`,'POST',{})).body.status,'released');
  const bom=await call('/api/boms','POST',{brand:'guner',code:'REC-1',productId:finished.body.id,quantity:1,lines:[{productId:material.body.id,quantity:2,unit:'adet',wastePercent:5}]});
  assert.equal(bom.status,201);
  const production=await call('/api/production','POST',{brand:'guner',code:'URET-ZINCIR',productId:finished.body.id,quantity:4,priority:'high'});
  assert.equal(production.status,201);
  const needs=await call('/api/material-needs?brand=guner');assert.equal(needs.status,200);assert.ok(needs.body.items.some(item=>item.sku==='HAM-1'));
  const purchase=await call('/api/purchase-requests','POST',{brand:'guner',number:'SAT-1',priority:'urgent',lines:[{productId:material.body.id,quantity:10,unit:'adet',estimatedUnitCost:12,currency:'TRY'}]});
  assert.equal(purchase.status,201);assert.equal((await call(`/api/purchase-requests/${purchase.body.id}`,'PATCH',{status:'submitted'})).body.status,'submitted');

  const shipment=await call('/api/shipments','POST',{brand:'guner',orderId:null,carrier:'Yurtiçi Kargo',trackingNumber:'YK-ZINCIR'});
  assert.equal((await call(`/api/shipments/${shipment.body.id}/tracking-events`,'POST',{status:'in_transit',description:'Transfer merkezinde',location:'İstanbul'})).status,201);
  const shipmentDetail=await call(`/api/shipments/${shipment.body.id}`);assert.equal(shipmentDetail.body.events.length,1);assert.equal(shipmentDetail.body.shipment.status,'in_transit');

  assert.equal((await call('/api/expenses','POST',{brand:'guner',category:'Paketleme',currency:'TRY',amount:125,taxAmount:25})).status,201);
  const finance=await call('/api/finance/summary?brand=guner');assert.equal(finance.status,200);assert.equal(finance.body.expenses,125);
  assert.equal((await call('/api/reports/sales?brand=guner')).status,200);assert.equal((await call('/api/reports/inventory?brand=guner')).status,200);

  const proposal={brand:'guner',kind:'create_shipment',idempotencyKey:'shipment-proposal-test-1',summary:{shipmentId:shipment.body.id,carrier:'Yurtiçi Kargo'}};
  const operation=await call('/api/external-operations','POST',proposal);assert.equal(operation.status,201);assert.equal(operation.body.status,'awaiting_confirmation');
  const duplicate=await call('/api/external-operations','POST',proposal);assert.equal(duplicate.status,200);assert.equal(duplicate.body.duplicate,true);
  assert.equal((await call(`/api/external-operations/${operation.body.id}/confirm`,'POST',{})).body.status,'queued');
  const operationDetail=await call(`/api/external-operations/${operation.body.id}`);assert.equal(operationDetail.body.history.length,3);
});
