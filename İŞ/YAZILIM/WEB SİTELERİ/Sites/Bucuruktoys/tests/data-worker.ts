import { queryData } from '../lib/data-query';
import { loginWithKey, authenticate, hashSecret, logoutSession, cookie, sameOrigin } from '../lib/admin-auth';
import { saveFile, serveFile } from '../lib/file-store';
import type { DataConfig } from '../lib/data-types';
export default {async fetch(request:Request,env:{DB:DataConfig['db']}) {
  const config:DataConfig={db:env.DB,developerEmail:'developer@example.test',bucket:'product-images'};
  const path=new URL(request.url).pathname;
  try {
    if(path.startsWith('/files/'))return serveFile(config,request);
    const body=await request.json() as Record<string,any>;
    if(path==='/query')return Response.json(await queryData({...config,user:body.user},body.path,body.init));
    if(path==='/login'){const token=await loginWithKey(config,body.email,body.key);return Response.json({ok:!!token},{status:token?200:401,headers:token?{'Set-Cookie':cookie(token)}:{}});}
    if(path==='/auth')return Response.json(await authenticate(config,request));
    if(path==='/logout')return Response.json({ok:true},{headers:{'Set-Cookie':await logoutSession(config,request)}});
    if(path==='/origin')return Response.json({ok:sameOrigin(request)});
    if(path==='/upload')return Response.json({path:await saveFile(config,body.bucket,body.path,new Uint8Array(body.data).buffer,body.type)});
    return new Response('Not found',{status:404});
  }catch(e){return Response.json({error:e instanceof Error?e.message:'error'},{status:400});}
}};
