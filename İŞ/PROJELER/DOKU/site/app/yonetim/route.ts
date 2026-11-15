import {env} from 'cloudflare:workers';
import {adminSession} from '../../server/admin-auth.mjs';
import html from '../../src/yonetim.html?raw';
export const dynamic='force-dynamic';
export async function GET(request:Request){
  const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
  if(!(await adminSession(request,env))) return new Response(null,{status:302,headers:{...headers,Location:'/yonetim/giris/'}});
  return new Response(html,{headers});
}
