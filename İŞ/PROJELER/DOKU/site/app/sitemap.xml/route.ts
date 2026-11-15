import staticSitemap from '../../server/static-sitemap.json';
export const dynamic = 'force-dynamic';
export async function GET() {
  return new Response(typeof staticSitemap === 'string' ? staticSitemap : staticSitemap.xml, {headers:{'Content-Type':'application/xml; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}});
}
