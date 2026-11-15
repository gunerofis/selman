import { createSign, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { audit, transaction } from '../store.mjs';
import { fail } from '../orders.mjs';

const SUPPORTED_PROVIDERS=new Set(['google_analytics','google_search_console','google_tag_manager']);
const DATASETS={google_analytics:'summary',google_search_console:'search_performance',google_tag_manager:'containers'};
const SCOPES={
  google_analytics:['https://www.googleapis.com/auth/analytics.readonly'],
  google_search_console:['https://www.googleapis.com/auth/webmasters.readonly'],
  google_tag_manager:['https://www.googleapis.com/auth/tagmanager.readonly']
};

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

function serviceAccount(connection,env=process.env) {
  const values=parseEnvFile(env.INTEGRATION_SECRETS_FILE);
  const configured=env[connection.secret_ref]||values[connection.secret_ref];
  if(!configured)fail(503,'Google servis hesabı yapılandırılmamış');
  const path=isAbsolute(configured)?configured:resolve(configured);
  let credentials;
  try { credentials=JSON.parse(readFileSync(path,'utf8')); } catch { fail(503,'Google servis hesabı dosyası okunamadı'); }
  if(!credentials.client_email||!credentials.private_key||!credentials.token_uri)fail(503,'Google servis hesabı dosyası geçersiz');
  return credentials;
}

const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');

export async function googleAccessToken(connection,{fetchImpl=fetch,env=process.env}={}) {
  const credentials=serviceAccount(connection,env);
  const now=Math.floor(Date.now()/1000);
  const input=`${encode({alg:'RS256',typ:'JWT'})}.${encode({iss:credentials.client_email,scope:SCOPES[connection.provider].join(' '),aud:credentials.token_uri,iat:now,exp:now+3600})}`;
  const signer=createSign('RSA-SHA256');signer.update(input);
  const assertion=`${input}.${signer.sign(credentials.private_key,'base64url')}`;
  const response=await fetchImpl(credentials.token_uri,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok||!payload.access_token)fail(502,`Google yetkilendirmesi başarısız: ${payload.error_description||payload.error||`HTTP ${response.status}`}`);
  return payload.access_token;
}

function day(offset=0) {
  const date=new Date();date.setUTCDate(date.getUTCDate()+offset);return date.toISOString().slice(0,10);
}

async function googleJson(url,{accessToken,fetchImpl=fetch,method='GET',body}={}) {
  const response=await fetchImpl(url,{method,headers:{'Accept':'application/json','Authorization':`Bearer ${accessToken}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)fail(response.status===401||response.status===403?502:503,`Google veri isteği başarısız: ${payload.error?.message||`HTTP ${response.status}`}`);
  return payload;
}

export function supportsGoogleConnection(provider) { return SUPPORTED_PROVIDERS.has(provider); }
export function defaultGoogleDataset(provider) { return DATASETS[provider]??null; }

export async function fetchGoogleDataset(connection,{fetchImpl=fetch,env=process.env}={}) {
  if(!supportsGoogleConnection(connection.provider))fail(409,'Bu Google bağlantısı henüz eşitlemeyi desteklemiyor');
  if(!connection.external_account_id)fail(409,'Google hesap kimliği yapılandırılmamış');
  const accessToken=await googleAccessToken(connection,{fetchImpl,env});
  const periodStart=day(-7),periodEnd=day(0);
  if(connection.provider==='google_analytics') {
    const payload=await googleJson(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(connection.external_account_id)}:runReport`,{accessToken,fetchImpl,method:'POST',body:{dateRanges:[{startDate:periodStart,endDate:periodEnd}],metrics:[{name:'activeUsers'},{name:'sessions'},{name:'screenPageViews'},{name:'totalRevenue'}],limit:1}});
    return {dataset:'summary',periodStart,periodEnd,payload};
  }
  if(connection.provider==='google_search_console') {
    const property=encodeURIComponent(connection.external_account_id);
    const payload=await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${property}/searchAnalytics/query`,{accessToken,fetchImpl,method:'POST',body:{startDate:periodStart,endDate:periodEnd,dimensions:['query'],rowLimit:100}});
    return {dataset:'search_performance',periodStart,periodEnd,payload};
  }
  const payload=await googleJson(`https://tagmanager.googleapis.com/tagmanager/v2/accounts/${encodeURIComponent(connection.external_account_id)}/containers`,{accessToken,fetchImpl});
  return {dataset:'containers',periodStart:null,periodEnd:null,payload};
}

export async function syncGoogleConnection(db,connectionId,options={}) {
  const connection=db.prepare('SELECT * FROM integration_connections WHERE id=?').get(connectionId);
  if(!connection)fail(404,'Entegrasyon bulunamadı');
  const result=await fetchGoogleDataset(connection,options);
  const capturedAt=new Date().toISOString();
  transaction(db,()=>{
    db.prepare(`INSERT INTO integration_snapshots(id,connection_id,dataset,period_start,period_end,payload_json,source_updated_at,captured_at)
      VALUES(?,?,?,?,?,?,?,?)
      ON CONFLICT(connection_id,dataset,period_start,period_end) DO UPDATE SET payload_json=excluded.payload_json,source_updated_at=excluded.source_updated_at,captured_at=excluded.captured_at`).run(randomUUID(),connection.id,result.dataset,result.periodStart,result.periodEnd,JSON.stringify(result.payload),capturedAt,capturedAt);
    db.prepare("UPDATE integration_connections SET status='connected',last_sync_at=?,last_error_at=NULL,updated_at=? WHERE id=?").run(capturedAt,capturedAt,connection.id);
    audit(db,`connector:${connection.id}`,connection.brand,'integration.synced',null,{connection:connection.id,dataset:result.dataset,periodStart:result.periodStart,periodEnd:result.periodEnd});
  });
  return {connection:connection.id,dataset:result.dataset,periodStart:result.periodStart,periodEnd:result.periodEnd,capturedAt};
}

export async function processNextGoogleSyncJob(db,options={}) {
  const job=db.prepare(`SELECT j.* FROM integration_sync_jobs j JOIN integration_connections i ON i.id=j.connection_id
    WHERE j.status='pending' AND i.provider IN ('google_analytics','google_search_console','google_tag_manager') ORDER BY j.created_at LIMIT 1`).get();
  if(!job)return null;
  const startedAt=new Date().toISOString();
  const claimed=db.prepare("UPDATE integration_sync_jobs SET status='running',started_at=? WHERE id=? AND status='pending'").run(startedAt,job.id);
  if(!claimed.changes)return null;
  try {
    const result=await syncGoogleConnection(db,job.connection_id,options);
    const completedAt=new Date().toISOString();
    db.prepare("UPDATE integration_sync_jobs SET status='completed',result_json=?,error_json=NULL,completed_at=? WHERE id=?").run(JSON.stringify(result),completedAt,job.id);
    return {id:job.id,status:'completed',...result};
  } catch(error) {
    const completedAt=new Date().toISOString();
    const connection=db.prepare('SELECT brand FROM integration_connections WHERE id=?').get(job.connection_id);
    transaction(db,()=>{
      db.prepare("UPDATE integration_sync_jobs SET status='failed',error_json=?,completed_at=? WHERE id=?").run(JSON.stringify({message:error.message,status:error.status??500}),completedAt,job.id);
      db.prepare("UPDATE integration_connections SET status='error',last_error_at=?,updated_at=? WHERE id=?").run(completedAt,completedAt,job.connection_id);
      db.prepare('INSERT INTO integration_errors(id,brand,account_id,inbox_id,code,message,status,context_json,created_at,resolved_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),connection?.brand??'*',null,null,'google_sync_failed',error.message,'open',JSON.stringify({jobId:job.id,connectionId:job.connection_id,status:error.status??500}),completedAt,null);
    });
    return {id:job.id,status:'failed',error:error.message};
  }
}
