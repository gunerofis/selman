import {FitChart} from './FitChart.jsx';
import {PeriodControl} from './PeriodControl.jsx';
import {FitTable} from './ScreenTools.jsx';
import React,{useState,useEffect} from 'react';
import {Button,DataComponent,DataTable,MetricCard,Section,SegmentedControl,SortableRegion,SortableItem,useDataApp,useSectionFilters} from '../../data-app-public.jsx';

import {api} from './hub-api.js';

const queries=['meta_totals','meta_spend','meta_conversions','instagram_sales','instagram_profiles'];
const brandFilters=[{id:'brand',label:'Firma',field:'brand',defaultValue:'all',queryIds:queries}];
const adFilters=[{id:'campaign',label:'Kampanya',field:'campaign',defaultValue:'all',queryIds:['meta_spend','meta_conversions']}];
const number=n=>n==null?'—':new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(n);
const money=(n,currency)=>n==null||!currency?'—':new Intl.NumberFormat('tr-TR',{style:'currency',currency,maximumFractionDigits:2}).format(n);
const sum=(rows,key)=>rows.length&&rows.every(r=>r[key]!=null&&Number.isFinite(Number(r[key])))?rows.reduce((a,r)=>a+Number(r[key]),0):null;
const currencyOf=rows=>{const values=[...new Set(rows.map(r=>r.currency))];return values.length===1&&values[0]?values[0]:null;};
const aggregate=(rows,keys,fields)=>{
 const grouped=new Map();
 for(const r of rows){const key=JSON.stringify(keys.map(k=>r[k]));if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(r);}
 return [...grouped.values()].map(group=>({...Object.fromEntries(keys.map(k=>[k,group[0][k]])),...Object.fromEntries(fields.map(k=>[k,sum(group,k)]))}));
};

export function MetaAdvertisingContent({active=true}){
 const app=useDataApp();
 const [connection,setConnection]=useState(null),[refreshing,setRefreshing]=useState(false),[refreshError,setRefreshError]=useState(''),[refreshed,setRefreshed]=useState(false);
 useEffect(()=>{let active=true;api('meta-status').then(r=>active&&setConnection(r)).catch(()=>{});return()=>{active=false;};},[]);
 const refresh=async()=>{setRefreshing(true);setRefreshError('');try{const day=app.filters.date;await api('meta-refresh',day&&day!=='all'?{since:day.split('..')[0],until:day.split('..').at(-1)}:{});setRefreshed(true);return true;}catch(e){setRefreshError(e.message);return false;}finally{setRefreshing(false);}};
 useEffect(()=>{const f=e=>{if(active&&e.detail?.tab==='dashboard')refresh().then(ok=>{if(ok)location.reload()})};window.addEventListener('hub-refresh',f);return()=>window.removeEventListener('hub-refresh',f)},[active,app.filters.date]);
 const brands=useSectionFilters([...brandFilters,...adFilters],{}, {id:'meta-scope'});
 const ads=brands;
 const [level,setLevel]=useState('group'),[panel,setPanel]=useState('summary');
 const select=(query,keys)=>brands.componentProps(query,keys);
 const t=select('meta_totals',['date','brand','accountId']);
 const sales=select('instagram_sales',['date','brand','store']);
 const profiles=select('instagram_profiles',['brand','profile']);
 const adScope=ads.componentProps('meta_spend',['date','brand','campaignId','groupId','adId','publisher']);
 const convScope=ads.componentProps('meta_conversions',['date','brand','campaignId','groupId','adId','action']);
 const selectedBrand=brands.values.brand||'all';
 const inBrand=r=>selectedBrand==='all'||r.brand===selectedBrand;
 const a=adScope;
 const c=convScope;
 const keys=level==='campaign'?['brand','currency','campaignId','campaign']:level==='group'?['brand','currency','campaignId','campaign','groupId','group']:['brand','currency','campaignId','campaign','groupId','group','adId','ad'];
 const spend=aggregate(a.displayRows,keys,['spend','clicks']).sort((a,b)=>(b.spend||0)-(a.spend||0));
 const conversions=aggregate(c.displayRows,['brand','currency','campaignId','campaign','groupId','group','adId','action'],['count','value']);
 const days=[...new Set(['meta_totals','instagram_sales'].flatMap(k=>(app.queries[k]?.rows||[]).map(r=>r.date)))].sort();
 const campaigns=[...new Set((app.queries.meta_spend?.rows||[]).filter(inBrand).map(r=>r.campaign))];
 useEffect(()=>{if(ads.values.campaign&&ads.values.campaign!=='all'&&!campaigns.includes(ads.values.campaign))ads.setFilter('campaign','all');},[selectedBrand,ads.values.campaign]);
 const boundBrands=app.snapshot.metaConnection?.brands||[];
 const available=app.snapshot.metaConnection?.state==='connected'&&(selectedBrand==='all'||boundBrands.includes(selectedBrand));
 const missingBrands=['Güner Ofis','Makro Ofis'].filter(b=>!boundBrands.includes(b));
 const empty=available?'Bu tarih için kayıt yok.':'Veri bağlantısı bekleniyor.';
 const metrics=[
  {id:'meta-ad-spend-total',title:'Reklam harcaması',scope:t,query:'meta_totals',value:money(sum(t.displayRows,'spend'),currencyOf(t.displayRows)),tone:'spend',foot:'',description:'Seçili firma ve günlerin Meta Ads harcaması. Para birimleri karıştırılmaz.'},
  {id:'instagram-sales-total',title:'Instagram kaynaklı satış',scope:sales,query:'instagram_sales',value:money(sum(sales.displayRows,'netSales'),currencyOf(sales.displayRows)),tone:'income',foot:sum(sales.displayRows,'orders')==null?'':number(sum(sales.displayRows,'orders'))+' sipariş',description:'Instagram yönlendirmesi doğrulanmış, ödenmiş site siparişleri. İptal ve test siparişleri hariç; iadeler düşülür. DM satışlarını kapsamaz.'},
  {id:'meta-purchase-total',title:'Meta satın alma değeri',scope:t,query:'meta_totals',value:money(sum(t.displayRows,'purchaseValue'),currencyOf(t.displayRows)),tone:'attribution',foot:sum(t.displayRows,'purchases')==null?'':number(sum(t.displayRows,'purchases'))+' satın alma atfı',description:'Meta’nın reklama atfettiği satın alma değeri. Instagram kaynaklı gerçek satışla toplanmaz. Atıf penceresi kaynakta tutulur.'}
 ];
 const step=direction=>{const index=days.indexOf(app.filters.date);const next=days[index<0?(direction<0?days.length-1:0):Math.max(0,Math.min(days.length-1,index+direction))];if(next)app.setFilter('date',next);};
 return <article className="sumen-program">
  <div className="sumen-period">
   
   <SegmentedControl label="Meta firması" value={selectedBrand} onChange={v=>brands.setFilter('brand',v)} options={[{value:'all',label:'Tümü'},{value:'Güner Ofis',label:'Güner Ofis'},{value:'Makro Ofis',label:'Makro Ofis'}]}/>
  </div>
  {!available&&<div className="meta-connection" role="status"><span>{selectedBrand==='all'?'Meta':selectedBrand} API bağlantısı bekleniyor.</span></div>}
  {available&&selectedBrand==='all'&&missingBrands.length>0&&<div className="meta-connection" role="status">{missingBrands.join(' ve ')} bağlantısı bekleniyor.</div>}
  {refreshError&&<div className="meta-connection" role="alert">{refreshError}</div>}
  <div className="hub-filters hub-report-tabs">{[['summary','Özet'],['ads','Reklamlar'],['conversions','Dönüşümler'],['profiles','Profiller']].map(([v,l])=><button key={v} aria-pressed={panel===v} onClick={()=>setPanel(v)}>{l}</button>)}</div>
  {panel==='summary'&&<Section id="meta-summary-heading" spacing="none" columns={3} kind="metrics">
   {metrics.filter(m=>app.visible(m.id)).map(m=><MetricCard variant="plain" key={m.id} id={m.id} title={m.title} queryId={m.query} {...m.scope} value={m.value} description={m.description} className={'sumen-metric '+m.tone}><div className="sumen-metric-foot">{m.foot}</div></MetricCard>)}
  </Section>}
  {panel==='summary'&&currencyOf(t.displayRows)&&t.displayRows.length>0&&<FitChart id="meta-daily-spend" queryId="meta_totals" title="Günlük Meta harcaması" rows={aggregate(t.displayRows,['date','currency'],['spend']).filter(r=>r.spend!=null)} sourceRows={t.sourceRows} spec={{type:'bar',x:'date',y:'spend',currency:currencyOf(t.displayRows)}}/>}
  {panel==='ads'&&<Section id="meta-ads-heading" title="Reklamlar" spacing="after-metrics" filters={campaigns.length?<div className="hub-filters">{['all',...campaigns].map(v=><button key={v} aria-pressed={(ads.values.campaign||'all')===v} onClick={()=>ads.setFilter('campaign',v)}>{v==='all'?'Tüm kampanyalar':v}</button>)}</div>:null}>
   <SortableRegion id="meta-ads-layout" variant="freeform" authoredRevision={1} label="Meta reklam tabloları">
    {app.visible('meta-spend-distribution')&&<SortableItem id="meta-spend-distribution" label="Harcama dağılımı" kind="table"><DataComponent id="meta-spend-distribution" queryId="meta_spend" title="Harcama dağılımı" kind="table" variant="card" {...a} displayRows={spend} headerControls={spend.length?<SegmentedControl label="Meta harcama düzeyi" value={level} onChange={setLevel} options={[{value:'campaign',label:'Kampanya'},{value:'group',label:'Grup'},{value:'ad',label:'Reklam'}]}/>:null}>
     {spend.length?<FitTable label="Meta reklam harcama dağılımı" rowKey="rowId" rows={spend.map((r,i)=>({...r,rowId:i}))} searchable={false} columns={[{field:level==='campaign'?'campaign':level==='group'?'group':'ad',label:level==='campaign'?'Kampanya':level==='group'?'Reklam grubu':'Reklam',presentation:'identity',secondaryField:'brand'},{field:'spend',label:'Harcama',renderCell:(v,r)=>money(v,r.currency)},{field:'clicks',label:'Bağlantı tıklaması',renderCell:number}]}/>:<div className="sumen-empty">{empty}</div>}
    </DataComponent></SortableItem>}

   </SortableRegion>
  </Section>}
  {panel==='conversions'&&<SortableRegion id="meta-conversion-layout" variant="freeform" authoredRevision={1} label="Dönüşümler">    {app.visible('meta-conversion-distribution')&&<SortableItem id="meta-conversion-distribution" label="Dönüşümler" kind="table"><DataComponent id="meta-conversion-distribution" queryId="meta_conversions" title="Dönüşümler" kind="table" variant="card" {...c} displayRows={conversions} description="Meta reklam atfı. Aynı satın almayı ölçen farklı dönüşüm eylemleri toplanmaz.">
     {conversions.length?<FitTable label="Meta dönüşümleri" rowKey="rowId" rows={conversions.map((r,i)=>({...r,rowId:i}))} searchable={false} columns={[{field:'group',label:'Reklam grubu',presentation:'identity',secondaryField:'brand'},{field:'action',label:'Dönüşüm'},{field:'count',label:'Adet / atıf',renderCell:number},{field:'value',label:'Değer',renderCell:(v,r)=>money(v,r.currency)}]}/>:<div className="sumen-empty">{empty}</div>}
    </DataComponent></SortableItem>}</SortableRegion>}
  {panel==='profiles'&&<Section id="meta-profiles-heading" title="Instagram profilleri" spacing="section">
   {app.visible('meta-instagram-profiles')&&<DataComponent id="meta-instagram-profiles" queryId="instagram_profiles" title="Profiller" kind="table" variant="card" {...profiles} description="Profil bağlantıları ve doğrulanmış güncel hesap ölçümleri."><FitTable label="Instagram profilleri" searchable={false} rowKey="profile" rows={profiles.displayRows} columns={[{field:'brand',label:'Firma'},{field:'profile',label:'Instagram'},...(profiles.displayRows.some(r=>r.followers!=null)?[{field:'followers',label:'Takipçi',renderCell:number}]:[]),...(profiles.displayRows.some(r=>r.posts!=null)?[{field:'posts',label:'Gönderi',renderCell:number}]:[]),{field:'url',label:'Profil',renderCell:v=><a className="meta-profile-link" href={v} target="_blank" rel="noreferrer">Profili aç ↗</a>}]}/></DataComponent>}
  </Section>}
 </article>;
}
