import {env} from 'cloudflare:workers';
import pages from '../../server/static-pages.json';
import catalog from '../../data/catalog.json';
import grouping from '../../data/product-groups.json';
import {legacyDestination} from '../../src/product-core.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
  const url=new URL(request.url),pathname=decodeURIComponent(url.pathname);
  if(pathname.endsWith('/index.html'))return Response.redirect(new URL(pathname.replace(/index.html$/,''),url),301);
  const target=legacyDestination(catalog,grouping,pathname.endsWith('/')?pathname:pathname+'/',url.searchParams.get('gorsel'));
  if(target){url.pathname=target;return Response.redirect(url,301);}
  if(pages[pathname])return new Response(pages[pathname],{headers:{'Content-Type':'text/html; charset=utf-8'}});
  if(pages[pathname+'/'])return Response.redirect(new URL(pathname+'/',url),301);
  if(env.ASSETS){const response=await env.ASSETS.fetch(url.href,{headers:Object.fromEntries(request.headers)});if(response.status!==404)return response;}
  return new Response(pages['/404.html'],{status:404,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
