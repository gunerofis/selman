// DOKU yönetim girişi: tek şifre (DOKU_ADMIN_PASSWORD), imzalı çerez.
const COOKIE = 'doku_admin';
const MAX_AGE = 30 * 86400;
const enc = new TextEncoder();

async function sign(env, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode('doku-session|' + env.DOKU_ADMIN_PASSWORD), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function same(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function adminSession(request, env) {
  if (!env.DOKU_ADMIN_PASSWORD) return null;
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)doku_admin=([^;]+)/);
  if (!m) return null;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return null;
  if (!same(sig, await sign(env, exp))) return null;
  return {id: 'doku-admin', email: env.DOKU_ADMIN_EMAIL || 'info@dokuduvar.com'};
}

export async function passwordOk(env, value) {
  if (!env.DOKU_ADMIN_PASSWORD || typeof value !== 'string' || !value) return false;
  return same(await sign(env, 'pw|' + value), await sign(env, 'pw|' + env.DOKU_ADMIN_PASSWORD));
}

export async function sessionCookie(env) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${COOKIE}=${exp}.${await sign(env, exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
