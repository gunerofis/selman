import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { audit, transaction } from '../store.mjs';
import { enqueueOrderEvent, fail } from '../orders.mjs';

const DEFAULT_API_VERSION='2026-07';
const PAGE_SIZE=100;
const MAX_PAGES=100;

function parseEnvFile(path) {
  if(!path)return {};
  const result={};
  for(const rawLine of readFileSync(path,'utf8').split(/\r?\n/)) {
    const line=rawLine.trim();
    if(!line||line.startsWith('#'))continue;
    const separator=line.indexOf('=');
    if(separator<1)continue;
    const key=line.slice(0,separator).trim();
    let value=line.slice(separator+1).trim();
    if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);
    result[key]=value;
  }
  return result;
}

export function normalizeShopDomain(value) {
  if(typeof value!=='string')fail(400,'Shopify mağaza adresi gerekli');
  const domain=value.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/$/,'');
  if(!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain))fail(400,'Geçersiz Shopify mağaza adresi');
  return domain;
}

function credentials(env=process.env,settings={}) {
  const fileValues={...parseEnvFile(env.SHOPIFY_CREDENTIALS_FILE),...parseEnvFile(env.SHOPIFY_SECRETS_FILE)};
  const clientId=settings.clientId||(settings.clientIdEnv&&(env[settings.clientIdEnv]||fileValues[settings.clientIdEnv]))||env.SHOPIFY_CLIENT_ID||env.SHOPIFY_API_KEY||fileValues.SHOPIFY_CLIENT_ID||fileValues.SHOPIFY_API_KEY;
  const clientSecret=(settings.secretEnv&&(env[settings.secretEnv]||fileValues[settings.secretEnv]))||env.SHOPIFY_CLIENT_SECRET||env.SHOPIFY_API_SECRET||fileValues.SHOPIFY_CLIENT_SECRET||fileValues.SHOPIFY_API_SECRET;
  if(!clientId||!clientSecret)fail(503,'Shopify uygulama kimlik bilgileri yapılandırılmamış');
  return {clientId,clientSecret};
}

export async function requestShopifyToken(shopDomain,{fetchImpl=fetch,env=process.env,settings={}}={}) {
  const {clientId,clientSecret}=credentials(env,settings);
  const body=new URLSearchParams({grant_type:'client_credentials',client_id:clientId,client_secret:clientSecret});
  const response=await fetchImpl(`https://${normalizeShopDomain(shopDomain)}/admin/oauth/access_token`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok||!payload.access_token) {
    const code=payload.error||payload.error_description||`HTTP ${response.status}`;
    fail(response.status===401||response.status===403?502:503,`Shopify erişimi kurulamadı: ${code}`);
  }
  return payload.access_token;
}

const ORDERS_QUERY=`query OrkestraOrders($after: String, $query: String) {
  orders(first: ${PAGE_SIZE}, after: $after, sortKey: UPDATED_AT, query: $query) {
    edges {
      cursor
      node {
        id
        name
        createdAt
        processedAt
        updatedAt
        cancelledAt
        tags
        displayFinancialStatus
        displayFulfillmentStatus
        currencyCode
        subtotalPriceSet { shopMoney { amount currencyCode } }
        totalShippingPriceSet { shopMoney { amount currencyCode } }
        currentTotalTaxSet { shopMoney { amount currencyCode } }
        totalDiscountsSet { shopMoney { amount currencyCode } }
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        customer { id displayName email phone }
        email
        phone
        shippingAddress { name company address1 address2 city province zip country countryCodeV2 phone }
        lineItems(first: 100) {
          nodes {
            id sku name quantity
            product { id }
            variant { id }
            originalUnitPriceSet { shopMoney { amount currencyCode } }
            discountedTotalSet { shopMoney { amount currencyCode } }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const PRODUCTS_QUERY=`query OrkestraProducts($after: String, $query: String) {
  products(first: ${PAGE_SIZE}, after: $after, sortKey: UPDATED_AT, query: $query) {
    edges {
      cursor
      node {
        id title handle vendor productType status updatedAt
        featuredMedia { preview { image { url } } }
        variants(first: 100) {
          nodes {
            id title sku barcode price inventoryQuantity
            inventoryItem { id tracked }
            selectedOptions { name value }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

async function fetchShopifyConnection({shopDomain,accessToken,query,variables,fetchImpl,apiVersion,errorLabel}) {
  const response=await fetchImpl(`https://${normalizeShopDomain(shopDomain)}/admin/api/${apiVersion}/graphql.json`,{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json','X-Shopify-Access-Token':accessToken},
    body:JSON.stringify({query,variables})
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)fail(502,`${errorLabel} isteği başarısız: HTTP ${response.status}`);
  if(payload.errors?.length)fail(502,`${errorLabel} isteği başarısız: ${payload.errors.map(item=>item.message).join('; ')}`);
  return payload.data;
}

export async function fetchShopifyOrders({shopDomain,accessToken,since,fetchImpl=fetch,apiVersion=DEFAULT_API_VERSION}) {
  const items=[];
  let after=null;
  const query=since?`updated_at:>='${since}'`:null;
  for(let page=0;page<MAX_PAGES;page++) {
    const response=await fetchImpl(`https://${normalizeShopDomain(shopDomain)}/admin/api/${apiVersion}/graphql.json`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','X-Shopify-Access-Token':accessToken},
      body:JSON.stringify({query:ORDERS_QUERY,variables:{after,query}})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)fail(502,`Shopify sipariş isteği başarısız: HTTP ${response.status}`);
    if(payload.errors?.length)fail(502,`Shopify sipariş isteği başarısız: ${payload.errors.map(item=>item.message).join('; ')}`);
    const connection=payload.data?.orders;
    if(!connection)fail(502,'Shopify sipariş yanıtı geçersiz');
    items.push(...connection.edges.map(edge=>edge.node));
    if(!connection.pageInfo.hasNextPage)return items;
    after=connection.pageInfo.endCursor;
  }
  fail(502,'Shopify sipariş sayfalama sınırı aşıldı');
}

export async function fetchShopifyProducts({shopDomain,accessToken,since,fetchImpl=fetch,apiVersion=DEFAULT_API_VERSION}) {
  const items=[];
  let after=null;
  const query=since?`updated_at:>='${since}'`:null;
  for(let page=0;page<MAX_PAGES;page++) {
    const data=await fetchShopifyConnection({shopDomain,accessToken,query:PRODUCTS_QUERY,variables:{after,query},fetchImpl,apiVersion,errorLabel:'Shopify ürün'});
    const connection=data?.products;
    if(!connection)fail(502,'Shopify ürün yanıtı geçersiz');
    items.push(...connection.edges.map(edge=>edge.node));
    if(!connection.pageInfo.hasNextPage)return items;
    after=connection.pageInfo.endCursor;
  }
  fail(502,'Shopify ürün sayfalama sınırı aşıldı');
}

const stableHash=value=>createHash('sha256').update(value).digest('hex').slice(0,40);

function productionTags(env=process.env) {
  return new Set((env.SHOPIFY_PRODUCTION_TAGS||'üretim,imalat,production').split(',').map(value=>value.trim().toLocaleLowerCase('tr-TR')).filter(Boolean));
}

export function shopifyOrderEvent(order,account,existing,{env=process.env}={}) {
  const version=Date.parse(order.updatedAt);
  if(!Number.isSafeInteger(version)||version<1)fail(502,'Shopify sipariş güncelleme zamanı geçersiz');
  const eventType=order.cancelledAt?'order.cancelled':!existing?'order.created':existing.status==='cancelled'?'order.restarted':'order.updated';
  const configuredTags=productionTags(env);
  const needsProduction=(order.tags||[]).some(tag=>configuredTags.has(String(tag).toLocaleLowerCase('tr-TR')));
  const country=order.shippingAddress?.countryCodeV2||null;
  const shopMoney=value=>({amount:Number(value?.shopMoney?.amount)||0,currency:value?.shopMoney?.currencyCode||order.currencyCode||'TRY'});
  const total=shopMoney(order.currentTotalPriceSet),subtotal=shopMoney(order.subtotalPriceSet),shipping=shopMoney(order.totalShippingPriceSet),tax=shopMoney(order.currentTotalTaxSet),discount=shopMoney(order.totalDiscountsSet);
  const financial=String(order.displayFinancialStatus||'unknown').toLowerCase();
  const fulfillmentRaw=String(order.displayFulfillmentStatus||'unfulfilled').toLowerCase();
  const fulfillmentStatus={fulfilled:'fulfilled',partially_fulfilled:'partial',on_hold:'on_hold',scheduled:'scheduled',unfulfilled:'unfulfilled',in_progress:'in_progress',pending_fulfillment:'in_progress',open:'in_progress',restocked:'unfulfilled'}[fulfillmentRaw]||'unknown';
  const lines=(order.lineItems?.nodes||[]).filter(line=>Number(line.quantity)>0).map(line=>({
    externalProductId:line.product?.id||line.id,
    externalVariantId:line.variant?.id||null,
    sku:line.sku||null,
    title:line.name||'Shopify ürünü',
    quantity:Number(line.quantity),
    unit:'adet',
    unitPrice:Number(line.originalUnitPriceSet?.shopMoney?.amount)||0,
    lineTotal:Number(line.discountedTotalSet?.shopMoney?.amount)||0,
    currency:line.discountedTotalSet?.shopMoney?.currencyCode||total.currency,
    raw:{lineItemId:line.id}
  }));
  return {
    eventId:`shopify-${stableHash(`${account.id}|${order.id}|${order.updatedAt}|${eventType}`)}`,
    eventType,
    orderId:order.id,
    sourceVersion:version,
    customerId:order.customer?.id||null,
    needsProduction,
    international:Boolean(country&&country!=='TR'),
    commerce:{
      orderNumber:order.name||null,
      placedAt:order.createdAt||null,
      processedAt:order.processedAt||null,
      currency:total.currency,
      amounts:{subtotal:subtotal.amount,shipping:shipping.amount,tax:tax.amount,discount:discount.amount,total:total.amount},
      paymentStatus:financial,
      fulfillmentStatus,
      returnStatus:financial.includes('refund')?'returned':'none',
      customer:{name:order.customer?.displayName||order.shippingAddress?.name||null,email:order.customer?.email||order.email||null,phone:order.customer?.phone||order.phone||order.shippingAddress?.phone||null},
      shippingAddress:order.shippingAddress||null,
      rawSnapshot:order
    },
    lines
  };
}

function upsertShopifyCatalog(db,account,products,now) {
  const selectProduct=db.prepare('SELECT id FROM channel_products WHERE account_id=? AND external_id=?');
  const selectVariant=db.prepare('SELECT id FROM channel_variants WHERE account_id=? AND external_id=?');
  const insertProduct=db.prepare(`INSERT INTO channel_products(id,account_id,external_id,title,handle,vendor,product_type,status,featured_image_url,source_updated_at,first_seen_at,last_seen_at,raw_json,deleted_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`);
  const updateProduct=db.prepare(`UPDATE channel_products SET title=?,handle=?,vendor=?,product_type=?,status=?,featured_image_url=?,source_updated_at=?,last_seen_at=?,raw_json=?,deleted_at=NULL WHERE id=?`);
  const insertVariant=db.prepare(`INSERT INTO channel_variants(id,account_id,channel_product_id,external_id,title,sku,barcode,price,currency,inventory_quantity,inventory_tracked,options_json,source_updated_at,first_seen_at,last_seen_at,raw_json,deleted_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`);
  const updateVariant=db.prepare(`UPDATE channel_variants SET channel_product_id=?,title=?,sku=?,barcode=?,price=?,currency=?,inventory_quantity=?,inventory_tracked=?,options_json=?,source_updated_at=?,last_seen_at=?,raw_json=?,deleted_at=NULL WHERE id=?`);
  let variantCount=0;
  for(const product of products) {
    const productRow=selectProduct.get(account.id,product.id),productId=productRow?.id??randomUUID();
    const productArgs=[product.title||'Adsız ürün',product.handle||null,product.vendor||null,product.productType||null,String(product.status||'active').toLowerCase(),product.featuredMedia?.preview?.image?.url||null,product.updatedAt||null,now,JSON.stringify(product),productId];
    if(productRow)updateProduct.run(...productArgs);
    else insertProduct.run(productId,account.id,product.id,...productArgs.slice(0,7),now,...productArgs.slice(7,9));
    for(const variant of product.variants?.nodes??[]) {
      const variantRow=selectVariant.get(account.id,variant.id),variantId=variantRow?.id??randomUUID();
      const currency='TRY';
      const variantArgs=[productId,variant.title||'Varsayılan',variant.sku||null,variant.barcode||null,Number(variant.price)||0,currency,Number.isFinite(Number(variant.inventoryQuantity))?Number(variant.inventoryQuantity):null,Number(Boolean(variant.inventoryItem?.tracked)),JSON.stringify(variant.selectedOptions??[]),product.updatedAt||null,now,JSON.stringify(variant),variantId];
      if(variantRow)updateVariant.run(...variantArgs);
      else insertVariant.run(variantId,account.id,productId,variant.id,...variantArgs.slice(1,10),now,...variantArgs.slice(10,12));
      variantCount++;
      const mapped=variant.sku?db.prepare('SELECT id FROM products WHERE brand=? AND sku=?').get(account.brand,variant.sku):null;
      if(mapped)db.prepare("INSERT INTO mappings(account,kind,external_id,entity_id) VALUES(?,?,?,?) ON CONFLICT(account,kind,external_id) DO UPDATE SET entity_id=excluded.entity_id").run(account.id,'variant',variant.id,mapped.id);
    }
  }
  return {productCount:products.length,variantCount};
}

export async function syncShopifyAccount(db,accountId,{fetchImpl=fetch,env=process.env}={}) {
  const account=db.prepare('SELECT * FROM accounts WHERE id=?').get(accountId);
  if(!account)fail(404,'Hesap bulunamadı');
  if(account.platform!=='shopify')fail(409,'Hesap Shopify bağlantısı değil');
  const connection=db.prepare('SELECT * FROM account_connections WHERE account_id=?').get(account.id);
  if(!connection)fail(409,'Shopify mağaza adresi yapılandırılmamış');
  let settings={};
  try { settings=JSON.parse(connection.settings_json||'{}'); } catch { fail(500,'Shopify hesap ayarı geçersiz'); }
  const startedAt=new Date().toISOString();
  const overlapSince=account.last_sync_at?new Date(Math.max(0,new Date(account.last_sync_at).getTime()-120000)).toISOString():null;
  const token=await requestShopifyToken(connection.shop_domain,{fetchImpl,env,settings});
  const orders=await fetchShopifyOrders({shopDomain:connection.shop_domain,accessToken:token,since:overlapSince,fetchImpl,apiVersion:env.SHOPIFY_API_VERSION||DEFAULT_API_VERSION});
  let catalog=[],catalogError=null;
  try { catalog=await fetchShopifyProducts({shopDomain:connection.shop_domain,accessToken:token,since:overlapSince,fetchImpl,apiVersion:env.SHOPIFY_API_VERSION||DEFAULT_API_VERSION}); }
  catch(error) { catalogError=error; }
  const inboxIds=[];
  let duplicates=0,stale=0,catalogResult={productCount:0,variantCount:0};
  transaction(db,()=>{
    for(const order of orders) {
      const existing=db.prepare('SELECT * FROM order_cache WHERE account=? AND external_id=?').get(account.id,order.id);
      const event=shopifyOrderEvent(order,account,existing,{env});
      if(existing&&event.sourceVersion<=existing.source_version){stale++;continue;}
      const queued=enqueueOrderEvent(db,account.id,event,event.eventType);
      if(queued.duplicate)duplicates++;else inboxIds.push(queued.inboxId);
    }
    if(!catalogError)catalogResult=upsertShopifyCatalog(db,account,catalog,startedAt);
    else db.prepare('INSERT INTO integration_errors(id,brand,account_id,inbox_id,code,message,status,context_json,created_at,resolved_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),account.brand,account.id,null,'shopify_catalog_sync_failed',catalogError.message,'open',JSON.stringify({dataset:'products',status:catalogError.status??500}),startedAt,null);
    db.prepare("UPDATE accounts SET connection_status='connected',last_sync_at=? WHERE id=?").run(startedAt,account.id);
    audit(db,`connector:${account.id}`,account.brand,'account.reconciled',null,{account:account.id,sourceCount:orders.length,queued:inboxIds.length,duplicates,stale,...catalogResult,catalogError:catalogError?.message??null});
  });
  return {account:account.id,sourceCount:orders.length,queued:inboxIds.length,duplicates,stale,inboxIds,...catalogResult,catalogError:catalogError?.message??null,lastSyncAt:startedAt};
}

export async function processNextShopifySyncJob(db,options={}) {
  const job=db.prepare("SELECT j.* FROM connector_sync_jobs j JOIN accounts a ON a.id=j.account_id WHERE j.status='pending' AND a.platform='shopify' ORDER BY j.created_at LIMIT 1").get();
  if(!job)return null;
  const startedAt=new Date().toISOString();
  const claimed=db.prepare("UPDATE connector_sync_jobs SET status='running',started_at=? WHERE id=? AND status='pending'").run(startedAt,job.id);
  if(!claimed.changes)return null;
  try {
    const result=await syncShopifyAccount(db,job.account_id,options);
    const completedAt=new Date().toISOString();
    db.prepare("UPDATE connector_sync_jobs SET status='completed',result_json=?,error_json=NULL,completed_at=? WHERE id=?").run(JSON.stringify(result),completedAt,job.id);
    return {id:job.id,status:'completed',...result};
  } catch(error) {
    const completedAt=new Date().toISOString();
    const account=db.prepare('SELECT brand FROM accounts WHERE id=?').get(job.account_id);
    transaction(db,()=>{
      db.prepare("UPDATE connector_sync_jobs SET status='failed',error_json=?,completed_at=? WHERE id=?").run(JSON.stringify({message:error.message,status:error.status??500}),completedAt,job.id);
      db.prepare("UPDATE accounts SET connection_status='error' WHERE id=?").run(job.account_id);
      db.prepare('INSERT INTO integration_errors(id,brand,account_id,inbox_id,code,message,status,context_json,created_at,resolved_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),account?.brand??'*',job.account_id,null,'shopify_sync_failed',error.message,'open',JSON.stringify({jobId:job.id,status:error.status??500}),completedAt,null);
    });
    return {id:job.id,status:'failed',error:error.message};
  }
}
