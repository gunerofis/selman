import assert from 'node:assert/strict';
const base=process.env.QA_URL||'http://127.0.0.1:8792';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('This test only runs against a local database.');
let session='';let count=0;
async function api(path,{method='GET',body,cookie=true}={}) {
  const r=await fetch(base+path,{method,headers:{...(method!=='GET'?{Origin:base}:{}),...(cookie&&session?{Cookie:session}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  return {status:r.status,data:await r.json().catch(()=>null),response:r};
}
const key='bt_'+Buffer.alloc(32,5).toString('base64url');
let r=await api('/api/admin/products',{cookie:false});assert.equal(r.status,401);count++;
r=await api('/api/admin/login',{method:'POST',body:{email:'qa@example.test',password:key}});assert.equal(r.status,200);
session=r.response.headers.get('set-cookie').split(';')[0];count++;
r=await api('/api/admin/config');assert.equal(r.data.authenticated,true);count++;
r=await api('/api/admin/products');assert.equal(r.status,200);assert.equal(r.data.products.length,207);const publishedCount=r.data.products.filter(p=>p.isPublished&&p.category!=='3d').length;count++;
r=await api('/api/admin/print-products');assert.equal(r.status,200);assert.equal(r.data.products.length,4);count++;
r=await api('/api/admin/control');assert.equal(r.status,200);assert.equal(r.data.categories.length,7);assert.equal(r.data.pages.length,6);count++;
const payload={sku:'QA-TEST',name:'QA fixture',category:'fun',pack:'one',stock:2,price:null};
r=await api('/api/admin/products',{method:'POST',body:payload});assert.equal(r.status,201);const id=r.data.product.id;count++;
try {
  r=await api('/api/admin/inventory',{method:'POST',body:{productId:id,change:3,reason:'QA fixture'}});assert.equal(r.status,200);assert.equal(r.data.product.stock,5);count++;
  r=await api('/api/admin/inventory',{method:'POST',body:{productId:id,change:-6,reason:'QA fixture'}});assert.equal(r.status,409);count++;
  r=await api('/api/admin/products');assert.equal(r.data.products.find(p=>p.id===id).stock,5);count++;
  const form=new FormData();form.set('file',new File([new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80])],'qa.webp',{type:'image/webp'}));
  const upload=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Origin:base,Cookie:session},body:form});assert.equal(upload.status,200);
  const {url}=await upload.json();assert.equal((await fetch(url)).status,200);count++;
}finally{await api('/api/admin/products?id='+id,{method:'DELETE'});}
const denied=await fetch(base+'/api/admin/products',{method:'POST',headers:{Origin:'https://evil.test',Cookie:session,'Content-Type':'application/json'},body:JSON.stringify(payload)});assert.equal(denied.status,403);count++;
r=await api('/api/products');assert.equal(r.status,200);assert.equal(r.data.source,'database');assert.equal(r.data.products.length,publishedCount);count++;
await api('/api/admin/logout',{method:'POST'});r=await api('/api/admin/products');assert.equal(r.status,401);count++;
console.log(`${count} local HTTP checks passed: admin login, all catalogs, management, stock, upload, logout.`);
