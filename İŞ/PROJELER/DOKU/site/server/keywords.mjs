import catalog from '../data/catalog.json' with {type:'json'};
import seed from '../data/keywords.json' with {type:'json'};
import areas from '../data/areas.json' with {type:'json'};
import grouping from '../data/product-groups.json' with {type:'json'};
import {imageProducts, imageCode} from '../src/product-core.mjs';
import {effectiveTags, isRejectedKeyword} from '../src/keyword-policy.mjs';
import {adminSession} from './admin-auth.mjs';
const productsByImage = imageProducts(catalog, grouping);

export const fields = ['colors','forms','subjects','styles','tones','keywords'];
const labels = {colors:'Renk',forms:'Şekil',subjects:'Konu',styles:'Tarz',tones:'Renk tonu',keywords:'Arama kelimeleri'};
export const images = catalog.designs.filter(d => !d.hidden).flatMap(d => d.images.map(n => ({
  code:imageCode(n), designCode:productsByImage.get(imageCode(n)).id, name:productsByImage.get(imageCode(n)).name, collection:d.collection,
  image:`/assets/doku-${String(n).padStart(3,'0')}-900.webp`, thumb:`/assets/thumb-${String(n).padStart(3,'0')}.webp`,
  baseKeywords:[...seed.productGroups[productsByImage.get(imageCode(n)).id], ...areas.filter(a=>a.collection===d.collection || a.designs.includes(d.id)).map(a=>a.name),
    ...catalog.themes.filter(t=>d.theme===t.slug || d.collection===t.includeCollection || t.designIds?.includes(d.id)).map(t=>t.name)]
})));
const known = new Set(images.map(i=>i.code));
const json = (value,status=200) => new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
class ApiError extends Error { constructor(status,message){super(message);this.status=status;} }

export function validateTags(value) {
  if (!value || typeof value!=='object' || Array.isArray(value) || Object.keys(value).some(k=>!fields.includes(k))) throw new ApiError(422,'Etiket alanları geçersiz.');
  const result = {};
  for (const field of fields) {
    const list=value[field];
    if(!Array.isArray(list)||list.length<1||list.length>40) throw new ApiError(422,`${labels[field]}: 1–40 etiket girin.`);
    result[field]=list.map(term=>{
      if(typeof term!=='string') throw new ApiError(422,`${labels[field]}: etiket metin olmalı.`);
      const clean=term.normalize('NFC').trim().replace(/\s+/g,' ');
      if(!clean||clean.length>80||/[<>\u0000-\u001f|]/.test(clean)) throw new ApiError(422,`${labels[field]}: etiket 1–80 karakter olmalı.`);
      if(/\s/u.test(clean)) throw new ApiError(422,`${labels[field]}: her etiket tek kelime olmalı.`);
      if(isRejectedKeyword(clean)) throw new ApiError(422,`${labels[field]}: bu genel terim anahtar kelime olarak kullanılamaz.`);
      return clean;
    });
    if(new Set(result[field].map(t=>t.toLocaleLowerCase('tr-TR'))).size!==list.length) throw new ApiError(422,`${labels[field]}: aynı etiketi iki kez eklemeyin.`);
  }
  return result;
}
async function admin(request,env) {
  const user=await adminSession(request,env);
  if(!user) throw new ApiError(401,'Yönetim için giriş yapın.');
  return user;
}
function db(env) {if(!env.DB) throw new ApiError(503,'Etiket kayıt hizmeti hazır değil.');return env.DB;}
async function record(database,code) {
  const row=await database.prepare('SELECT tags_json, revision, updated_at FROM keyword_images WHERE image_code = ?').bind(code).first();
  return {code,tags:effectiveTags(seed.images[code], row?JSON.parse(row.tags_json):null),revision:row?.revision||0,updatedAt:row?.updated_at||null};
}
async function records(database) {
  const rows=await database.prepare('SELECT image_code, tags_json, revision, updated_at FROM keyword_images').all();
  const saved=new Map(rows.results.filter(r=>known.has(r.image_code)).map(r=>[r.image_code,r]));
  return images.map(image=>{
    const row=saved.get(image.code);
    return {...image,tags:effectiveTags(seed.images[image.code], row?JSON.parse(row.tags_json):null),revision:row?.revision||0,updatedAt:row?.updated_at||null};
  });
}
async function writeBody(request) {
  if(request.headers.get('Origin')!==new URL(request.url).origin || request.headers.get('X-Doku-Admin')!=='1') throw new ApiError(403,'Kayıt isteği bu yönetim ekranından yapılmalı.');
  if(!request.headers.get('Content-Type')?.startsWith('application/json')) throw new ApiError(415,'JSON gerekli.');
  if(Number(request.headers.get('Content-Length'))>24000) throw new ApiError(413,'Etiket kaydı çok büyük.');
  const raw=await request.text();
  if(raw.length>24000) throw new ApiError(413,'Etiket kaydı çok büyük.');
  let body;try{body=JSON.parse(raw);}catch{throw new ApiError(400,'Kayıt verisi okunamadı.');}
  if(!body||!Number.isSafeInteger(body.revision)||body.revision<0||!/^[a-f0-9-]{36}$/i.test(body.requestId||'')) throw new ApiError(422,'Sürüm veya işlem kodu geçersiz.');
  return body;
}
async function save(request,database,code,actor,restore) {
  const body=await writeBody(request);
  if(restore && (!Number.isSafeInteger(body.restoreRevision)||body.restoreRevision<0)) throw new ApiError(422,'Geri alınacak sürüm geçersiz.');
  const action=restore?`restore:${body.restoreRevision}`:'edit';
  let tags=restore?null:validateTags(body.tags);
  const prior=await database.prepare('SELECT image_code, actor_id, action, after_json FROM keyword_history WHERE operation_id = ?').bind(body.requestId).first();
  if(prior){
    if(prior.image_code!==code||prior.actor_id!==actor.id||prior.action!==action||(!restore && prior.after_json!==JSON.stringify(tags))) throw new ApiError(409,'İşlem kodu başka bir kayıt için kullanılmış.');
    return json(await record(database,code));
  }
  const before=await record(database,code);
  if(body.revision!==before.revision) throw new ApiError(409,'Bu görsel başka bir oturumda değişti. Güncel kaydı yükleyin.');
  if(restore){
    const target=body.restoreRevision===0
      ?await database.prepare('SELECT before_json AS tags_json FROM keyword_history WHERE image_code = ? ORDER BY revision ASC LIMIT 1').bind(code).first()
      :await database.prepare('SELECT after_json AS tags_json FROM keyword_history WHERE image_code = ? AND revision = ?').bind(code,body.restoreRevision).first();
    if(!target) throw new ApiError(404,'Eski sürüm bulunamadı.');
    tags=validateTags(effectiveTags(seed.images[code], JSON.parse(target.tags_json)));
  }
  const afterJson=JSON.stringify(tags), beforeJson=JSON.stringify(before.tags);
  if(afterJson===beforeJson) return json(before);
  const now=new Date().toISOString();
  const result=await database.batch([
    database.prepare(`INSERT INTO keyword_images (image_code,tags_json,revision,updated_at,operation_id) VALUES (?,?,1,?,?)
      ON CONFLICT(image_code) DO UPDATE SET tags_json=excluded.tags_json,revision=keyword_images.revision+1,updated_at=excluded.updated_at,operation_id=excluded.operation_id
      WHERE keyword_images.revision = ? RETURNING revision`).bind(code,afterJson,now,body.requestId,body.revision),
    database.prepare(`INSERT INTO keyword_history (operation_id,image_code,revision,before_json,after_json,actor_id,actor_email,action,created_at)
      SELECT ?,image_code,revision,?,?,?, ?,?,? FROM keyword_images WHERE image_code = ? AND operation_id = ?`).bind(body.requestId,beforeJson,afterJson,actor.id,actor.email,action,now,code,body.requestId)
  ]);
  if(!result[0].results?.length) throw new ApiError(409,'Bu görsel başka bir oturumda değişti. Güncel kaydı yükleyin.');
  return json(await record(database,code));
}
export async function handleKeywords(request,env) {
  try {
    const path=new URL(request.url).pathname.replace(/\/$/,'');
    if(path==='/api/keywords' && request.method==='GET') {
      const rows=await db(env).prepare('SELECT image_code, tags_json FROM keyword_images').all();
      return json({images:Object.fromEntries(rows.results.filter(r=>known.has(r.image_code)).map(r=>[r.image_code,effectiveTags(seed.images[r.image_code],JSON.parse(r.tags_json))]))});
    }
    const actor=await admin(request,env), database=db(env);
    if(path==='/api/admin/keywords' && request.method==='GET') return json({images:await records(database),user:actor.email});
    if(path==='/api/admin/keywords/export' && request.method==='GET') {
      const backup={version:2,exportedAt:new Date().toISOString(),products:seed.products,images:Object.fromEntries((await records(database)).map(r=>[r.code,r.tags]))};
      const response=json(backup);response.headers.set('Content-Disposition','attachment; filename="doku-etiket-yedek.json"');return response;
    }
    const match=path.match(/^\/api\/admin\/keywords\/(G-\d{3})(?:\/(history|restore))?$/);
    if(!match||!known.has(match[1])) throw new ApiError(404,'Görsel bulunamadı.');
    const [,code,operation]=match;
    if(operation==='history' && request.method==='GET') {
      const history=await database.prepare('SELECT revision, after_json, actor_email, action, created_at FROM keyword_history WHERE image_code = ? ORDER BY revision DESC LIMIT 20').bind(code).all();
      const initial=await database.prepare('SELECT before_json FROM keyword_history WHERE image_code = ? ORDER BY revision ASC LIMIT 1').bind(code).first();
      const versions=history.results.map(r=>({revision:r.revision,tags:effectiveTags(seed.images[code],JSON.parse(r.after_json)),actor:r.actor_email,action:r.action,at:r.created_at}));
      if(initial) versions.push({revision:0,tags:effectiveTags(seed.images[code],JSON.parse(initial.before_json)),actor:null,action:'initial',at:null});
      return json({versions});
    }
    if(!operation && request.method==='GET') return json(await record(database,code));
    if((!operation||operation==='restore')&&request.method==='POST') return await save(request,database,code,actor,operation==='restore');
    throw new ApiError(405,'Bu işlem desteklenmiyor.');
  }catch(error){
    if(error instanceof ApiError) return json({error:error.message},error.status);
    console.error('Keyword API failed',error?.message);
    return json({error:'Etiketler kaydedilemedi veya yüklenemedi. Tekrar deneyin.'},503);
  }
}
