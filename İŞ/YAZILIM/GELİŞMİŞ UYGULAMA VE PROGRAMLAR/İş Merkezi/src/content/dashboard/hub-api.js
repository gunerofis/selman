import {useCallback,useEffect,useState} from 'react';
let sessionPromise;
export async function session(){
 if(!sessionPromise)sessionPromise=fetch('/api/session',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('Yerel servise ulaşılamadı.');return r.json()}).catch(e=>{sessionPromise=null;throw e});
 return sessionPromise;
}
export async function api(name,body,retry=true){
 const s=await session();const r=await fetch('/api/'+name,{cache:'no-store',...(body?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF':s.csrf},body:JSON.stringify(body)}:{})});
 const d=await r.json();if(!r.ok){if(r.status===401){sessionPromise=null;if(retry)return api(name,body,false)}const e=Error(d.error||'İşlem tamamlanamadı.');e.conflict=r.status===409;throw e}return d;
}
export function useResource(name){
 const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const reload=useCallback(async()=>{setLoading(true);try{const d=await api(name);setData(d);setError('');return d}catch(e){setError(e.message);throw e}finally{setLoading(false)}},[name]);
 useEffect(()=>{let active=true;setData(null);setLoading(true);api(name).then(d=>{if(active){setData(d);setError('')}}).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false}},[name]);
 useEffect(()=>{const f=()=>{const visible=Array.from(document.querySelectorAll('.hub-workspace>[data-hub-page]')).find(n=>!n.hidden);if(visible)reload().catch(()=>{})};window.addEventListener('hub-refresh',f);return()=>window.removeEventListener('hub-refresh',f)},[reload]);
 return {data,setData,error,loading,reload};
}
export function useDirty(dirty){useEffect(()=>{const f=e=>{if(dirty){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',f);return()=>window.removeEventListener('beforeunload',f)},[dirty])}
export const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const dateLabel=d=>d?new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z')):'Tarihsiz';
export const lower=s=>String(s??'').toLocaleLowerCase('tr');
export const tl=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(Number(n||0));
export const parse=s=>{try{return Array.isArray(s)?s:JSON.parse(s||'[]')}catch{return []}};
export const safeUrl=s=>{try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}};

const eventTimes=new Map();
export function logEvent(area,action){const key=area+':'+action,now=Date.now();if(now-(eventTimes.get(key)||0)<30000)return;eventTimes.set(key,now);api('system-event',{area,action}).catch(()=>{});}
