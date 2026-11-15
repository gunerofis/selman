import {PeriodControl} from './PeriodControl.jsx';
import {FitTable,Sections,PagedText,PagedInput,Pager} from './ScreenTools.jsx';
import React,{useState,useEffect,useRef} from 'react';
import {Button,DataComponent,DataTable,Dialog,SegmentedControl} from '../../data-app-public.jsx';
import {api,useResource,useDirty,day,dateLabel,tl,lower,session} from './hub-api.js';
import accountConfig from './order-accounts.json';
import {inPeriod,storeSummary} from './order-summary.js';
const {accounts,labels,icons:extraIcons}=accountConfig;
const brands=Object.keys(accounts);
const channels=['Web Sitesi'];
const channelLabel=c=>labels[c]||c;
const ownedChannels=b=>channels.filter(c=>accounts[b][c]);
const icons={Trendyol:'trendyol.ico',Hepsiburada:'hepsiburada.ico',Amazon:'amazon.ico',n11:'n11.png','Çiçeksepeti':'ciceksepeti.ico'};
const sources=(brand,c)=>c==='Web Sitesi'?brand==='Makro Ofis'?['sumentakimi.com','sumentakimi.com.tr']:['gunerofis.com','imalattansumen.com']:brand==='Makro Ofis'||['Amazon','idefix','Pazarama','eBay'].includes(c)?[]:[c];
const shift=(d,n)=>new Date(new Date((d||day())+'T12:00:00Z').getTime()+n*86400000).toISOString().slice(0,10);
export function state(c){if(!c)return 'Bilinmiyor';if(c.state==='error')return 'Getirilemedi';if(c.ready===false&&c.state==='disconnected')return 'Bağlı değil';if(c.ready!==true)return 'Doğrulanmadı';if(!c.lastSuccessUtc)return 'Kontrol edilmedi';return Date.now()-new Date(c.lastSuccessUtc).getTime()>900000?'Eski veri':'Güncel'}
export function OrdersContent({active=true}){
 const r=useResource('orders'),[brand,setBrand]=useState(''),[channel,setChannel]=useState(''),[when,setWhen]=useState(()=>day()+'..'+day()),[query,setQuery]=useState(''),[settings,setSettings]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [role,setRole]=useState('');useEffect(()=>{session().then(s=>setRole(s.role)).catch(()=>{})},[]);
 const refreshing=useRef(false);
 useEffect(()=>{if(active)refresh()},[active]);
 const linked=(b,c)=>sources(b,c).some(s=>r.data?.connections?.[s]?.ready);
 const periodRows=(r.data?.rows||[]).filter(o=>o.channel==='Web Sitesi'&&inPeriod(o,when));
 const rows=periodRows.filter(o=>(!brand||o.brand===brand)&&(!channel||o.channel===channel)&&lower(o.product+' '+o.orderNumber+' '+o.source).includes(lower(query)));
 const summary=storeSummary(periodRows);
 useEffect(()=>{const f=e=>{if(e.detail?.tab==='orders')refresh()};window.addEventListener('hub-refresh',f);return()=>window.removeEventListener('hub-refresh',f)},[]);
 async function refresh(){if(refreshing.current)return;refreshing.current=true;setBusy(true);setMessage('Siparişler getiriliyor…');try{const data=await api('orders-refresh',{});r.setData(data);setMessage(data.warning?'Bazı kaynaklar yenilenemedi; önceki kayıtlar korundu.':'Siparişler yenilendi.')}catch(e){setMessage(e.message)}finally{refreshing.current=false;setBusy(false)}}
 return <section className="hub-content hub-screen hub-orders">
  <div className="hub-toolbar"><input type="search" placeholder="Sipariş veya ürün ara" aria-label="Siparişlerde ara" value={query} onChange={e=>setQuery(e.target.value)}/>{role==='admin'&&<Button onClick={()=>setSettings(true)}>Ayarlar</Button>}</div>
  <PeriodControl label="Sipariş tarih aralığı" value={when} onChange={setWhen}/>
  {r.data&&<div id="order-store-summary" className="hub-store-sales" data-reviewed-rows data-query-id="order_register" aria-label="Mağaza satış özeti">{summary.map(s=><div key={s.source} data-store={s.source}><strong>{s.label}{s.source!=='total'&&<small>{state(r.data.connections?.[s.source])}</small>}</strong><b>{tl(s.cents/100)}</b><span>{s.orders.toLocaleString('tr-TR')} sipariş · satış tutarı</span></div>)}</div>}
  <div className="hub-filters"><button aria-pressed={!brand} onClick={()=>{setBrand('');setChannel('')}}>Tüm siparişler</button>{brands.map(b=><button key={b} aria-pressed={brand===b} onClick={()=>{setBrand(b);setChannel('')}}>{b}</button>)}</div>
  {message&&<p role="status" className="hub-muted">{message}</p>}
  <DataComponent id="order-register" queryId="order_register" title="Siparişler" kind="table" variant="card" sourceRows={rows} displayRows={rows} loading={r.loading&&!r.data} loadingError={r.error} onRetry={()=>r.reload().catch(()=>{})}>{rows.length?<FitTable label="Siparişler" rows={rows} rowKey="key" searchable={false} columns={[{field:'product',label:'Ürün',presentation:'identity',secondaryField:'orderNumber'},{field:'source',label:'Kaynak'},{field:'when',label:'Tarih',renderCell:v=>new Date(v).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})},{field:'status',label:'Durum'},{field:'amount',label:'Tutar',renderCell:tl}]}/>:<p className="hub-empty">{brand&&channel&&!linked(brand,channel)?'Bu kanalın bağlantısı doğrulanmadı.':'Sipariş yok.'}</p>}</DataComponent>

  <Settings open={settings} onClose={()=>setSettings(false)} connections={r.data}/>
 </section>;
}
const groups=[['Trendyol',[['TrendyolSellerId','Satıcı no'],['TrendyolApiKey','API anahtarı',true],['TrendyolApiSecret','API gizli anahtarı',true]]],['Hepsiburada',[['HbMerchantId','Mağaza no'],['HbUser','Kullanıcı'],['HbPassword','API şifresi',true]]],['n11',[['N11Key','API anahtarı',true],['N11Secret','API gizli anahtarı',true]]],['Çiçeksepeti',[['CsSellerId','Satıcı no'],['CsIntegrator','Entegratör'],['CsApiKey','API anahtarı',true]]]];
function Settings({open,onClose,connections}){const [dirty,setDirty]=useState(false);return <Dialog open={open} title="Sipariş bağlantı ayarları" onClose={()=>{if(!dirty||confirm("Kaydedilmemiş değişikliklerden vazgeçilsin mi?")){setDirty(false);onClose()}}} expanded>{open&&<><div className="hub-detail">{brands.map(b=><details key={b}><summary>{b} bağlantıları</summary><ConnectionList brand={b} data={connections}/></details>)}</div><SettingsForm onDirty={setDirty}/></>}</Dialog>}
function SettingsForm({onDirty}){
 const r=useResource('order-settings'),[draft,setDraft]=useState({}),[tab,setTab]=useState('web'),[site,setSite]=useState(0),[market,setMarket]=useState('Trendyol'),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');useDirty(Object.keys(draft).length>0);useEffect(()=>onDirty(Object.keys(draft).length>0),[draft,onDirty]);
 const v={...(r.data||{}),...draft};const websites=v.websites||[];
 async function save(){setBusy(true);setMsg('');try{r.setData(await api('order-settings',{...draft,revision:r.data.revision}));setDraft({});setMsg('Kaydedildi')}catch(e){setMsg(e.message)}finally{setBusy(false)}}
 if(!r.data)return <div className="hub-detail"><p>{r.error||'Yükleniyor…'}</p></div>;
 return <div className="hub-detail">{tab==='web'?<div><div className="hub-filters">{Array.from({length:5},(_,i)=><button key={i} aria-pressed={site===i} onClick={()=>setSite(i)}>Site {i+1}</button>)}</div>{[site].map(i=><div className="hub-web-row hub-settings-grid" key={i}>{['Site adı','Web adresi'].map((label,k)=><label className="hub-field" key={label}>{label+' '+(i+1)}<input value={websites[i]?.[k]||''} maxLength={k?500:100} onChange={e=>{const w=Array.from({length:5},(_,x)=>[...(websites[x]||['',''])]);w[i][k]=e.target.value;setDraft({...draft,websites:w})}}/></label>)}</div>)}</div>:<><div className="hub-filters">{groups.map(([name])=><button key={name} aria-pressed={market===name} onClick={()=>setMarket(name)}>{name}</button>)}</div>{groups.filter(([name])=>name===market).map(([name,fields])=><section key={name}><h3>{name}</h3><div className="hub-settings-grid">{fields.map(([key,label,secret])=><label className="hub-field" key={key}>{label}<input type={secret?'password':'text'} autoComplete="off" value={secret?draft[key]||'':v[key]||''} placeholder={secret&&r.data[key+'Saved']?'Kayıtlı — değiştirmek için yaz':''} onChange={e=>setDraft({...draft,[key]:e.target.value})}/>{secret&&r.data[key+'Saved']&&<label className="hub-inline"><input type="checkbox" checked={!!draft['clear'+key]} onChange={e=>setDraft({...draft,['clear'+key]:e.target.checked})}/>Kayıtlı anahtarı kaldır</label>}</label>)}</div></section>)}</>}
  <div className="hub-inline" style={{marginTop:20}}><Button disabled={busy||!Object.keys(draft).length} onClick={save}>{busy?'Kaydediliyor…':'Kaydet'}</Button><span role="status">{msg}</span></div>
 </div>;
}

function ConnectionList({brand,data}){const [page,setPage]=useState(0);const rows=ownedChannels(brand).flatMap(c=>{const src=sources(brand,c);return(src.length?src:[brand+'|'+c]).map(s=>({id:s,label:src.length?s:channelLabel(c)}))});return <>{rows.slice(page*4,page*4+4).map(r=><div className="hub-connection-row" key={r.id}><span>{r.label}{data?.connections?.[r.id]?.lastSuccessUtc&&<small>{new Date(data.connections[r.id].lastSuccessUtc).toLocaleString('tr-TR')}</small>}</span><span>{state(data?.connections?.[r.id])}</span></div>)}<Pager page={page} pages={Math.max(1,Math.ceil(rows.length/4))} onChange={setPage}/></>}
