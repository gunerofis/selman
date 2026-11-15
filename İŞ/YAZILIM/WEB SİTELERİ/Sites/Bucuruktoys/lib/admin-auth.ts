import type { AdminUser, DataConfig, Row } from "./data-types";

export const SESSION_COOKIE="bt_admin";
const SESSION_SECONDS=30*86400;
export const validPanelKey=(key:string)=>/^bt_[A-Za-z0-9_-]{43}$/.test(key);
export function randomSecret() {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export async function hashSecret(value:string) {
  const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
}
function sameHash(a:string,b:string) {let mismatch=a.length^b.length;for(let i=0;i<64;i++)mismatch|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return mismatch===0;}
export function sessionToken(request:Request) {
  return request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1)||'';
}
export const cookie=(token:string,maxAge=SESSION_SECONDS)=>`${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
export function sameOrigin(request:Request) {return request.headers.get('origin')===new URL(request.url).origin;}
export async function loginWithKey(config:DataConfig,email:string,key:string) {
  if(!validPanelKey(key))return null;
  const row=await config.db.prepare('SELECT c.key_hash FROM admin_credentials c JOIN admin_users u ON u.email=c.email WHERE c.email=? AND u.is_active=1').bind(email).first<{key_hash:string}>();
  const candidate=await hashSecret(key);if(!sameHash(candidate,row?.key_hash||'0'.repeat(64)))return null;
  const token=randomSecret();const now=Date.now();
  await config.db.batch([
    config.db.prepare('INSERT INTO admin_sessions(token_hash,email,created_at,expires_at) VALUES(?,?,?,?)').bind(await hashSecret(token),email,now,now+SESSION_SECONDS*1000),
    config.db.prepare('DELETE FROM admin_sessions WHERE expires_at<?').bind(now),
  ]);
  return token;
}
export async function authenticate(config:DataConfig,request:Request):Promise<AdminUser|null> {
  const token=sessionToken(request);if(!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
  const user=await config.db.prepare('SELECT u.email,u.role,u.display_name FROM admin_sessions s JOIN admin_users u ON u.email=s.email WHERE s.token_hash=? AND s.expires_at>? AND u.is_active=1 AND s.created_at>=CAST(strftime(\'%s\',u.session_valid_after) AS INTEGER)*1000').bind(await hashSecret(token),Date.now()).first<Row>();
  if(!user)return null;
  if(!['developer','owner','editor','viewer'].includes(String(user.role)))return null;
  return {id:String(user.email),email:String(user.email),role:user.role as AdminUser['role'],displayName:String(user.display_name||user.email)};
}
export async function renewSession(config:DataConfig,request:Request) {
  const token=sessionToken(request);if(!token||!await authenticate(config,request))return null;
  const now=Date.now();await config.db.prepare('UPDATE admin_sessions SET expires_at=? WHERE token_hash=? AND expires_at<?').bind(now+SESSION_SECONDS*1000,await hashSecret(token),now+29*86400000).run();return cookie(token);
}
export async function logoutSession(config:DataConfig,request:Request) {
  const token=sessionToken(request);if(token)await config.db.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await hashSecret(token)).run();return cookie('',0);
}
