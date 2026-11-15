import {env} from 'cloudflare:workers';
import {passwordOk, sessionCookie} from '../../../server/admin-auth.mjs';
export const dynamic = 'force-dynamic';
const H = {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY'};
const page = (err = '') => `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>DOKU yönetim</title><style>body{font-family:system-ui,sans-serif;background:#f6f7f4;color:#202b28;display:grid;place-items:center;min-height:100vh;margin:0}form{display:grid;gap:12px;width:min(320px,90vw)}strong{font-size:28px}input,button{font:inherit;padding:12px;border:1px solid #c9ccc4;border-radius:8px}button{background:#202b28;color:#f6f7f4;border:0;cursor:pointer}p{color:#a33;margin:0}</style></head><body><form method="post"><strong>doku.</strong><input type="password" name="sifre" placeholder="Şifre" autocomplete="current-password" required autofocus>${err ? `<p>${err}</p>` : ''}<button>Giriş</button></form></body></html>`;
export async function GET() {
  return new Response(page(), {headers: H});
}
export async function POST(request: Request) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return new Response('Yasak', {status: 403});
  const form = await request.formData().catch(() => null);
  if (!(await passwordOk(env, form?.get('sifre')))) {
    await new Promise(r => setTimeout(r, 800));
    return new Response(page('Şifre yanlış.'), {status: 401, headers: H});
  }
  return new Response(null, {status: 303, headers: {...H, Location: '/yonetim/', 'Set-Cookie': await sessionCookie(env)}});
}
