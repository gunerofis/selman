import {env} from 'cloudflare:workers';
import {keywordRedirect} from '../../../server/categories.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.replace(/\/$/, '').split('/').pop() || '');
  if (!url.pathname.endsWith('/')) return Response.redirect(new URL(url.pathname + '/', url), 301);
  return keywordRedirect(env, slug, url);
}
