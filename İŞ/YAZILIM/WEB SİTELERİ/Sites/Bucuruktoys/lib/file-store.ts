import type { DataConfig } from "./data-types";
import { authenticate } from "./admin-auth";
const BUCKETS=new Set(['product-images','print-request-files']);
const keyFor=(bucket:string,path:string)=>{
  if(!BUCKETS.has(bucket)||!path||path.length>500||path.split('/').some(p=>!p||p==='.'||p==='..'||!/^[-\w.]+$/.test(p)))throw new Error('Invalid file path');
  return bucket+'/'+path;
};
export async function saveFile(config:DataConfig,bucket:string,path:string,data:ArrayBuffer,contentType:string) {
  const key=keyFor(bucket,path);if(!data.byteLength||data.byteLength>12*1024*1024)throw new Error('Invalid file size');
  const digest=await crypto.subtle.digest('SHA-256',data);const sha=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
  const statements=[config.db.prepare('INSERT INTO uploaded_files(file_key,bucket,content_type,size,sha256) VALUES(?,?,?,?,?)').bind(key,bucket,contentType,data.byteLength,sha)];
  for(let offset=0,part=0;offset<data.byteLength;offset+=256*1024,part++)statements.push(config.db.prepare('INSERT INTO file_chunks(file_key,part,data) VALUES(?,?,?)').bind(key,part,data.slice(offset,offset+256*1024)));
  await config.db.batch(statements);
  return '/files/'+key;
}
export async function serveFile(config:DataConfig,request:Request,assets?:{fetch(_request:Request):Promise<Response>}) {
  const match=new URL(request.url).pathname.match(/^\/files\/([^/]+)\/(.+)$/);if(!match)return new Response('Not found',{status:404});
  let key:string;try{key=keyFor(match[1],decodeURIComponent(match[2]));}catch{return new Response('Not found',{status:404});}
  if(!['GET','HEAD'].includes(request.method))return new Response('Method Not Allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  const isPublic=match[1]==='product-images';
  if(!isPublic&&!await authenticate(config,request))return new Response('Unauthorized',{status:401,headers:{'Cache-Control':'no-store'}});
  const file=await config.db.prepare('SELECT content_type,size,sha256 FROM uploaded_files WHERE file_key=?').bind(key).first<{content_type:string;size:number;sha256:string}>();
  if(!file)return isPublic&&assets?assets.fetch(request):new Response('Not found',{status:404});
  const headers=new Headers({'Content-Type':file.content_type,'Content-Length':String(file.size),'X-Content-Type-Options':'nosniff','ETag':'"'+file.sha256+'"','Cache-Control':isPublic?'public, max-age=31536000, immutable':'private, no-store'});
  if(!isPublic)headers.set('Content-Disposition','attachment; filename="'+key.split('/').pop()+'"');
  if(request.headers.get('if-none-match')===headers.get('ETag'))return new Response(null,{status:304,headers});
  if(request.method==='HEAD')return new Response(null,{headers});
  const chunks=(await config.db.prepare('SELECT data FROM file_chunks WHERE file_key=? ORDER BY part').bind(key).all<{data:number[]|ArrayBuffer}>()).results;
  const bytes=new Uint8Array(file.size);let offset=0;
  for(const chunk of chunks){const b=new Uint8Array(chunk.data);bytes.set(b,offset);offset+=b.length;}
  if(offset!==file.size)return new Response('File unavailable',{status:503,headers:{'Cache-Control':'no-store'}});
  return new Response(bytes,{headers});
}
