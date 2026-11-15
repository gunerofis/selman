import type { DataConfig, Row, Statement } from "./data-types";
import { tableSchema } from "./data-schema";

const publicTables: Record<string,string> = { products:"is_published", print_products:"is_published", categories:"is_visible", content_pages:"is_published", site_settings:"is_public" };
const jsonColumns = new Set(["gallery","guides","sections","value","metadata","file_paths"]);
const booleanColumns = new Set(["is_published","is_featured","is_visible","is_public","is_active","is_price_visible"]);
const identifier = (value:string) => '"'+value+'"';
function columns(table:string) { const result:readonly string[]|undefined=tableSchema[table as keyof typeof tableSchema]; if(!result)throw new Error("Unknown table");return result; }
function column(table:string, name:string) { if(!columns(table).includes(name))throw new Error("Unknown column");return identifier(name); }
export function decodeRow(row:Row):Row {
  return Object.fromEntries(Object.entries(row).map(([k,v])=>[k,jsonColumns.has(k)&&typeof v==="string"?JSON.parse(v):booleanColumns.has(k)&&v!==null?Boolean(v):v]));
}
function encode(key:string,value:unknown) { return jsonColumns.has(key)?JSON.stringify(value):typeof value==="boolean"?Number(value):value; }
function permission(config:DataConfig,table:string,method:string) {
  if(!config.user) {if(method!=="GET"||!publicTables[table])throw new Error("forbidden");return;}
  if(method!=="GET"&&config.user.role==="viewer")throw new Error("forbidden");
  if(table==="admin_users"&&method!=="GET"&&!['developer','owner'].includes(config.user.role))throw new Error("forbidden");
}
function conditions(table:string,params:URLSearchParams) {
  const clauses:string[]=[];const values:unknown[]=[];
  for(const [key,value] of params) {
    if(['select','order','limit','on_conflict','offset'].includes(key))continue;
    const c=column(table,key);const dot=value.indexOf('.');const op=value.slice(0,dot);const raw=value.slice(dot+1);
    if(op==='in') {if(!raw.startsWith('(')||!raw.endsWith(')'))throw new Error('Invalid filter');clauses.push(`${c} IN (SELECT value FROM json_each(?))`);values.push(JSON.stringify(raw.slice(1,-1).split(',').map(v=>/^[0-9]+$/.test(v)?Number(v):v)));}
    else if(['eq','gte','gt','lte','lt'].includes(op)) {clauses.push(`${c} ${{eq:'=',gte:'>=',gt:'>',lte:'<=',lt:'<'}[op]} ?`);values.push(raw==='true'?1:raw==='false'?0:raw);}
    else throw new Error('Invalid filter');
  }
  return {clauses,values};
}
async function protectUsers(config:DataConfig,method:string,records:Row[],filters:ReturnType<typeof conditions>) {
  if(!config.user)throw new Error('forbidden');
  if(method!=='POST') {
    if(!filters.clauses.length)throw new Error('Missing user filter');
    const {results}=await config.db.prepare('SELECT email,role FROM admin_users WHERE '+filters.clauses.join(' AND ')).bind(...filters.values).all();
    for(const target of results) {
      if(target.email===config.user.email && (method==='DELETE'||records.some(r=>r.is_active===false||r.role&&r.role!==config.user!.role)))throw new Error('Kendi hesabınızı kapatamazsınız.');
      if(target.role==='developer'&&config.user.role!=='developer')throw new Error('Geliştirici hesabını yalnızca geliştirici yönetebilir.');
    }
  }
  for(const record of records) {
    if(record.role==='developer'&&(config.user.role!=='developer'||record.email!==config.developerEmail))throw new Error('forbidden');
  }
}
export async function queryData<T=unknown>(config:DataConfig,path:string,init:RequestInit & {credentialHash?:string}={},_accessToken?:string):Promise<T> {
  void _accessToken;
  const url=new URL(path,'https://data.internal');
  const rpc=url.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
  if(rpc)return await runOperation(config,rpc[1],JSON.parse(String(init.body||'{}'))) as T;
  const match=url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);if(!match)throw new Error('Unknown query');
  const table=match[1];columns(table);const method=(init.method||'GET').toUpperCase();permission(config,table,method);
  const params=url.searchParams;const filter=conditions(table,params);
  if(!config.user)filter.clauses.push(identifier(publicTables[table])+'=1');
  const where=filter.clauses.length?' WHERE '+filter.clauses.join(' AND '):'';
  if(method==='GET') {
    const select=params.get('select')||'*';const joins=select.match(/(?:quote_items|products)\([^)]*\)/g)||[];
    const flat=select.replace(/,?(?:quote_items|products)\([^)]*\)/g,'').split(',').filter(Boolean);
    const projection=flat.includes('*')?'*':flat.map(c=>column(table,c)).join(',');
    const order=params.get('order');const orderSql=order?' ORDER BY '+order.split(',').map(c=>{const [name,dir]=c.split('.');if(dir!=='asc'&&dir!=='desc')throw new Error('Invalid order');return column(table,name)+' '+dir;}).join(','):'';
    const limit=params.get('limit');if(limit&&!/^\d{1,6}$/.test(limit))throw new Error('Invalid limit');
    const rows=(await config.db.prepare(`SELECT ${projection} FROM ${identifier(table)}${where}${orderSql}${limit?' LIMIT '+Number(limit):''}`).bind(...filter.values).all()).results.map(decodeRow);
    if(joins.length&&rows.length) {
      for(const join of joins) {
        if(table==='quotes'&&join.startsWith('quote_items(')) {
          const children=(await config.db.prepare('SELECT * FROM quote_items WHERE quote_id IN (SELECT value FROM json_each(?))').bind(JSON.stringify(rows.map(r=>r.id))).all()).results.map(decodeRow);
          rows.forEach(r=>r.quote_items=children.filter(c=>c.quote_id===r.id));
        } else if(table==='inventory_movements'&&join==='products(sku,name)') {
          const children=(await config.db.prepare('SELECT id,sku,name FROM products WHERE id IN (SELECT value FROM json_each(?))').bind(JSON.stringify(rows.map(r=>r.product_id))).all()).results;
          rows.forEach(r=>r.products=children.find(c=>c.id===r.product_id)||null);
        } else throw new Error('Unknown relation');
      }
    }
    if(!config.user&&table==='products')rows.forEach(r=>{r.cost_price=null;r.supplier=null;});
    return rows as T;
  }
  const body=init.body?JSON.parse(String(init.body)):null;const records:Row[]=body?(Array.isArray(body)?body:[body]):[];
  if(table==='admin_users')await protectUsers(config,method,records,filter);
  const statements:Statement[]=[];
  if(method==='POST') {
    if(!records.length||records.length>500)throw new Error('Invalid batch');
    for(const record of records) {
      const names=Object.keys(record);const conflict=params.get('on_conflict');if(conflict&&!(table==='products'&&conflict==='sku'))throw new Error('Invalid conflict');
      const upsert=conflict?' ON CONFLICT('+column(table,conflict)+') DO UPDATE SET '+names.filter(n=>n!==conflict).map(n=>`${column(table,n)}=excluded.${column(table,n)}`).join(','):'';
      statements.push(config.db.prepare(`INSERT INTO ${identifier(table)} (${names.map(n=>column(table,n)).join(',')}) VALUES (${names.map(()=>'?').join(',')})${upsert} RETURNING *`).bind(...names.map(n=>encode(n,record[n]))));
    }
  } else if(method==='PATCH') {
    if(records.length!==1||!filter.clauses.length)throw new Error('Missing update filter');const r=records[0];const names=Object.keys(r);
    statements.push(config.db.prepare(`UPDATE ${identifier(table)} SET ${names.map(n=>column(table,n)+'=?').join(',')}${where} RETURNING *`).bind(...names.map(n=>encode(n,r[n])),...filter.values));
  } else if(method==='DELETE') {
    if(!filter.clauses.length)throw new Error('Missing delete filter');
    statements.push(config.db.prepare(`DELETE FROM ${identifier(table)}${where} RETURNING *`).bind(...filter.values));
  } else throw new Error('Unknown method');
  if(table==='admin_users'&&method==='PATCH'&&records.some(r=>r.is_active===false||r.role))statements.push(config.db.prepare('DELETE FROM admin_sessions WHERE email IN (SELECT email FROM admin_users'+where+')').bind(...filter.values));
  if(table==='admin_users'&&init.credentialHash) {
    const email=records[0]?.email;if(typeof email!=='string')throw new Error('Missing credential identity');
    statements.push(config.db.prepare("INSERT INTO admin_credentials(email,key_hash) VALUES(?,?) ON CONFLICT(email) DO UPDATE SET key_hash=excluded.key_hash,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')").bind(email,init.credentialHash));
    statements.push(config.db.prepare('DELETE FROM admin_sessions WHERE email=?').bind(email));
  }
  const result=await config.db.batch(statements);
  return result.slice(0,method==='POST'?records.length:1).flatMap(r=>r.results.map(decodeRow)) as T;
}

async function runOperation(config:DataConfig,name:string,p:Row) {
  if(name==='record_catalog_event') {
    const events=['product_view','offer_add','product_share','whatsapp_click','catalog_search','category_filter','catalog_print','catalog_pdf_download'];
    if(!events.includes(String(p.p_event_type)))throw new Error('Invalid event');
    await config.db.prepare('INSERT INTO analytics_events(event_type,product_id,sku,session_id,metadata) VALUES(?,?,?,?,?)').bind(p.p_event_type,p.p_product_id||null,p.p_sku||null,p.p_session_id||null,JSON.stringify(p.p_metadata||{})).run();return null;
  }
  if(name==='adjust_product_stock') {
    if(!config.user||config.user.role==='viewer')throw new Error('forbidden');
    const change=Number(p.p_change),id=Number(p.p_product_id);if(!Number.isSafeInteger(change)||!change||Math.abs(change)>999999||!Number.isSafeInteger(id))throw new Error('Invalid stock');
    // D1 batch is one transaction. CHECK(stock>=0) rolls the entire batch back.
    const result=await config.db.batch([
      config.db.prepare("UPDATE products SET stock=stock+?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? RETURNING *").bind(change,id),
      config.db.prepare('INSERT INTO inventory_movements(product_id,change,stock_before,stock_after,reason,actor_email) SELECT id,?,stock-?,stock,?,? FROM products WHERE id=?').bind(change,change,p.p_reason||null,config.user.email,id),
    ]);
    if(!result[0].results[0])throw new Error('product_not_found');return decodeRow(result[0].results[0]);
  }
  // Existing installation intentionally disables personal-data ingestion.
  // Keep that decision until separately enabled by the site owner.
  throw new Error('operation_disabled');
}
