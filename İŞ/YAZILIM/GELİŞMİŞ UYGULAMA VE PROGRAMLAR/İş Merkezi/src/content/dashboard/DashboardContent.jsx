import React,{useEffect,useRef,useState} from 'react';
import {useDashboardTabs,SegmentedControl} from '../../data-app-public.jsx';
import {SettingsContent} from './SettingsContent.jsx';
import {JobsContent} from './JobsContent.jsx';
import {WorkContent} from './WorkContent.jsx';
import {InformationContent} from './InformationContent.jsx';
import {OrdersContent} from './OrdersContent.jsx';
import {AdvertisingContent} from './AdvertisingContent.jsx';
import {GunerTransferContent} from './GunerTransferContent.jsx';
import {session,logEvent} from './hub-api.js';
import './hub.css';
import './comfort.css';
export function DashboardContent(){
 const {activeTabId}=useDashboardTabs([{id:'jobs',label:'İşler',filterIds:[]},{id:'guner-transfer',label:'Güner taşıma',filterIds:[]},{id:'products',label:'Ürünler',filterIds:[]},{id:'orders',label:'Siparişler',filterIds:[]},{id:'instagram',label:'Instagram',filterIds:[]},{id:'dashboard',label:'Reklam ve Satış',filterIds:['date']},{id:'settings',label:'Ayarlar',filterIds:[]}]);
 const selected=activeTabId||'jobs';const [visited,setVisited]=useState(['jobs']);
 useEffect(()=>{logEvent(selected,'alan-açıldı');setVisited(old=>old.includes(selected)?old:[...old,selected])},[selected]);
 const pages={settings:<SettingsContent/>,jobs:<JobsContent/>,'guner-transfer':<GunerTransferContent/>,products:<WorkContent view="products"/>,orders:<OrdersContent active={selected==='orders'}/>,instagram:<Social/>,dashboard:<AdvertisingContent/>};
 useEffect(()=>{const f=e=>{if(e.detail?.tab==='instagram')Array.from(document.querySelectorAll('iframe.hub-embed')).filter(el=>!el.closest('[hidden]')).forEach(el=>el.contentWindow?.postMessage({type:'hub-refresh'},location.origin))};window.addEventListener('hub-refresh',f);return()=>window.removeEventListener('hub-refresh',f)},[]);
 return <div className="hub-workspace" data-dashboard-layout={['jobs','guner-transfer','products','orders','instagram','settings','dashboard'].includes(selected)?'viewport':undefined}>{visited.map(id=><div key={id} data-hub-page={id} hidden={selected!==id}>{pages[id]}</div>)}</div>;
}
function Social(){const [brand,setBrand]=useState('guner');return <section className="hub-content hub-social"><div className="hub-toolbar"><SegmentedControl label="Instagram" value={brand} onChange={setBrand} options={[{value:'guner',label:'Güner Ofis'},{value:'makro',label:'Makro Ofis'}]}/></div>{['guner','makro'].map(b=><div key={b} hidden={brand!==b}><Embedded active={brand===b} src={'/instagram/'+b+'/'} title={b==='guner'?'Güner Instagram planı':'Makro Instagram planı'}/></div>)}</section>}
function Embedded({src,title,active=true}){const [ready,setReady]=useState(false),[error,setError]=useState('');useEffect(()=>{if(active)session().then(()=>setReady(true)).catch(e=>setError(e.message))},[active]);return error?<p>{error}</p>:ready?<iframe onLoad={e=>{const styles=getComputedStyle(document.documentElement),tokens=Object.fromEntries(['surface','background','text','secondary','border','control','accent'].map(key=>[key,styles.getPropertyValue('--'+key).trim()]));e.currentTarget.contentWindow?.postMessage({type:'hub-theme',tokens},location.origin)}} className="hub-embed" title={title} src={src}/>:<p className="hub-muted">Yükleniyor…</p>}
