import {FitChart} from './FitChart.jsx';
import {PeriodControl} from './PeriodControl.jsx';
import {FitTable} from './ScreenTools.jsx';
import React, { useEffect, useState } from "react";
import {EvidenceChart,DataComponent, DataTable, Button, Tabs, TabPanel, MetricCard, Section, SegmentedControl, SortableRegion, SortableItem, useDataApp, useSectionFilters} from "../../data-app-public.jsx";
import "./program.css";
import {MetaAdvertisingContent} from "./MetaAdvertisingContent.jsx";

const tl=n=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const count=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:3}).format(n);
const total=(rows,key)=>rows.reduce((a,r)=>a+Number(r[key]??0),0);
const group=(rows,keys,values)=>{
 const result=new Map();
 for(const row of rows){const id=keys.map(k=>row[k]).join("|");const out=result.get(id)??Object.fromEntries(keys.map(k=>[k,row[k]]));for(const k of values)out[k]=(out[k]??0)+Number(row[k]??0);result.set(id,out);}
 return [...result.values()];
};
const filters=[
 {id:"campaign",label:"Kampanya",field:"campaign",defaultValue:"all",queryIds:["ad_spend","ad_conversions"]},
 {id:"group",label:"Reklam grubu",field:"group",defaultValue:"all",queryIds:["ad_spend","ad_conversions"]}
];
const currencyColumn=(field,label)=>({field,label,renderCell:tl});
export function AdvertisingContent(){
 const [channel,setChannel]=useState("google");
 useEffect(()=>{const f=e=>{if(channel==="google"&&e.detail?.tab==="dashboard")location.reload()};window.addEventListener("hub-refresh",f);return()=>window.removeEventListener("hub-refresh",f)},[channel]);
 return <div className="advertising-content">
  <PeriodControl/><Tabs id="advertising-channel" label="Reklam kanalı" items={[{id:"google",label:"Google"},{id:"meta",label:"Meta"}]} value={channel} onChange={setChannel}/>
  <TabPanel tabsId="advertising-channel" tabId="google" active={channel==="google"} keepMounted><GoogleAdvertisingContent/></TabPanel>
  <TabPanel tabsId="advertising-channel" tabId="meta" active={channel==="meta"} keepMounted><MetaAdvertisingContent active={channel==="meta"}/></TabPanel>
 </div>;
}
function GoogleAdvertisingContent(){
 const app=useDataApp();
 const [level,setLevel]=useState("group"),[panel,setPanel]=useState("summary"),[visual,setVisual]=useState("chart");
 const [newData,setNewData]=useState(false);
 const scope=useSectionFilters(filters,{}, {id:"ads-scope"});
 useEffect(()=>{if(scope.values.group!=='all'&&!app.queries.ad_spend.rows.some(r=>(scope.values.campaign==='all'||r.campaign===scope.values.campaign)&&r.group===scope.values.group))scope.setFilter('group','all')},[scope.values.campaign,scope.values.group]);
 const summary=app.reviewedRows("daily_totals",["date"]);
 const totals=Object.fromEntries(["adSpend","siteSales","siteGross","refunds","siteOrders","siteUnits","adsPurchaseCount","adsPurchaseValue","shipping"].map(k=>[k,total(summary,k)]));
 const latest=[...summary].sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
 const a=scope.componentProps("ad_spend",["date","campaign","group","adId"]);
 const c=scope.componentProps("ad_conversions",["date","campaign","group","adId","action"]);
 const adSource=a.displayRows.filter(r=>r.spend>0);
 const convSource=c.displayRows.filter(r=>r.count>0||r.value>0);
 const keys=level==="campaign"?["campaign"]:level==="group"?["campaign","group"]:["campaign","group","adId","ad","url"];
 const spend=group(adSource,keys,["spend","clicks"]).sort((a,b)=>b.spend-a.spend);
 const denominator=total(spend,"spend");
 const spendRows=spend.map((r,i)=>({...r,rowId:String(i),share:denominator?r.spend/denominator:0}));
 const conversions=group(convSource,["campaign","group","adId","action","category","primaryPurchase"],["count","value"]).sort((a,b)=>b.value-a.value);
 const productsSource=app.reviewedRows("site_products",["date","productId"]);
 const products=group(productsSource,["productId","product","newProduct"],["units","amount"]).filter(r=>r.units>0).sort((a,b)=>b.amount-a.amount);
 const budget=latest?.currentDailyBudget;
 useEffect(()=>{
  const check=()=>fetch("/api/status",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(s=>{if(s?.status==="ok"&&s.updatedAt>app.snapshot.generatedAt)setNewData(true)}).catch(()=>{});
  const id=setInterval(check,60000);return()=>clearInterval(id);
 },[app.snapshot.generatedAt]);
 const metrics=[
  {id:"ad-spend-total",title:"Reklam harcaması",value:tl(totals.adSpend),foot:budget===undefined?"": "Güncel günlük bütçe "+tl(budget),tone:"spend",description:"Seçili günlerin tüm Google Ads harcaması. Günlük bütçe veri çekildiği andaki bütçedir; tarih aralığı için harcama sınırı değildir."},
  {id:"site-sales-total",title:"Site satışı",value:tl(totals.siteSales),foot:count(totals.siteOrders)+" sipariş · "+count(totals.siteUnits)+" ürün",tone:"income",description:"Tüm site: test, iptal ve ödemesi bekleyenler hariç ödenmiş web siparişleri. KDV ve kargo dahil; iadeler çıkarılır. Reklam filtresi site toplamını değiştirmez."},
  {id:"ads-purchase-total",title:"Ads satın alma değeri",value:tl(totals.adsPurchaseValue),foot:count(totals.adsPurchaseCount)+" satın alma atfı",tone:"attribution",description:"Google Ads / Shopify satın alma (GA4). Etkileşim tarihine göre atıf; kesirli değer gerçek sipariş adedi değildir. Site satışına eklenmez. Google Ads verisi sonradan değişebilir."}
 ];
 const spendColumns=[
  ...(level==="campaign"?[{field:"campaign",label:"Kampanya"}]:[{field:"group",label:"Reklam grubu",presentation:"identity",secondaryField:"campaign"}]),
  ...(level==="ad"?[{field:"adId",label:"Reklam",renderCell:(v,r)=><span title={r.url}>{v}</span>}]:[]),
  currencyColumn("spend","Harcama"),{field:"share",label:"Pay",renderCell:v=>new Intl.NumberFormat("tr-TR",{style:"percent",maximumFractionDigits:2}).format(v)},{field:"clicks",label:"Tıklama"}
 ];
 return <article className="sumen-program">
  <div className="sumen-period">

   <div className="sumen-run"><span className="sumen-dot" />Her gün 08:00 <span className="sumen-window">· 00:00–23:59</span></div>
   {newData&&<button className="sumen-new-data" onClick={()=>location.reload()}>Yeni veriyi aç</button>}
  </div>
  <div className="hub-filters hub-report-tabs">{[['summary','Özet'],['ads','Reklamlar'],['conversions','Dönüşümler'],['products','Site satışları']].map(([v,l])=><button key={v} aria-pressed={panel===v} onClick={()=>setPanel(v)}>{l}</button>)}</div>
  {!summary.length?<div role="status" className="sumen-empty">Bu tarih için kayıt yok.</div>:<>
   {panel==="summary"&&<><Section id="summary-heading" spacing="none" columns={3} kind="metrics">
    {metrics.filter(m=>app.visible(m.id)).map(m=><MetricCard variant="plain" key={m.id} id={m.id} title={m.title} queryId="daily_totals" sourceRows={summary} displayRows={summary} value={m.value} description={m.description} className={"sumen-metric "+m.tone}/>)}
   </Section><div className="sumen-metric-notes">{metrics.filter(m=>app.visible(m.id)).map(m=><span key={m.id}>{m.foot}</span>)}</div>
   {totals.refunds>0&&<div className="sumen-refund">Brüt {tl(totals.siteGross)} · İade {tl(totals.refunds)}</div>}
   <FitChart id="daily-financial-trend" queryId="daily_totals" title="Günlük harcama ve site satışı" rows={summary} sourceRows={summary} spec={{type:'bar',x:'date',y:'adSpend',fields:['adSpend','siteSales'],currency:'TRY',stackable:false,legend:{labels:{adSpend:'Reklam harcaması',siteSales:'Site satışı'}}}} height={Math.max(125,Math.min(290,innerHeight-455))}/></>}
   {panel==='ads'&&<section aria-label="Reklamlar"><div className="hub-ad-selectors"><div className="hub-filter-line"><strong>Kampanya</strong><div className="hub-filters">{["all",...new Set(app.queries.ad_spend.rows.map(r=>r.campaign))].map(v=><button key={v} aria-pressed={(scope.values.campaign||"all")===v} onClick={()=>scope.setFilter("campaign",v)}>{v==="all"?"Tüm kampanyalar":v}</button>)}</div></div><div className="hub-filter-line"><strong>Grup</strong><div className="hub-filters">{["all",...new Set(app.queries.ad_spend.rows.filter(r=>scope.values.campaign==="all"||r.campaign===scope.values.campaign).map(r=>r.group))].map(v=><button key={v} aria-pressed={(scope.values.group||"all")===v} onClick={()=>scope.setFilter("group",v)}>{v==="all"?"Tüm gruplar":v}</button>)}</div></div><div className="hub-filters"><button aria-pressed={visual==='chart'} onClick={()=>setVisual('chart')}>Grafik</button><button aria-pressed={visual==='table'} onClick={()=>setVisual('table')}>Ayrıntılar</button></div></div>
    <SortableRegion id="sumen-ads-layout" variant="freeform" authoredRevision={2} label="Reklam tabloları">
     {app.visible("spend-distribution")&&<SortableItem id="spend-distribution" label="Harcama dağılımı" kind="table">
      {visual==='chart'?<FitChart id="ad-spend-bars" queryId="ad_spend" title="Harcama dağılımı · TL" {...a} rows={spendRows} sourceRows={adSource} spec={{type:'horizontalBar',x:level==='campaign'?'campaign':level==='group'?'group':'adId',y:'spend',currency:'TRY'}} height={Math.max(130,Math.min(300,innerHeight-420))} headerControls={<SegmentedControl label="Harcama düzeyi" value={level} onChange={setLevel} options={[{value:"campaign",label:"Kampanya"},{value:"group",label:"Grup"},{value:"ad",label:"Reklam"}]} />}/>:<DataComponent id="spend-distribution" queryId="ad_spend" title="Harcama dağılımı" kind="table" variant="card" {...a} sourceRows={adSource} displayRows={spendRows} headerControls={<SegmentedControl label="Harcama düzeyi" value={level} onChange={setLevel} options={[{value:"campaign",label:"Kampanya"},{value:"group",label:"Grup"},{value:"ad",label:"Reklam"}]} />}>
       {spendRows.length?<FitTable rowKey="rowId" label="Reklam harcama dağılımı" rows={spendRows} columns={spendColumns} searchable={false} />:<div className="sumen-empty">Harcama yok.</div>}
      </DataComponent>}
     </SortableItem>}

    </SortableRegion>
   </section>}
   {panel==='conversions'&&<><div className="hub-muted">{scope.values.campaign==='all'?'Tüm kampanyalar':scope.values.campaign} · {scope.values.group==='all'?'Tüm gruplar':scope.values.group}</div><SortableRegion id="sumen-conversion-layout" variant="freeform" authoredRevision={1} label="Dönüşümler">     {app.visible("conversion-distribution")&&<SortableItem id="conversion-distribution" label="Dönüşümler" kind="table">
      <DataComponent id="conversion-distribution" queryId="ad_conversions" title="Dönüşümler" kind="table" variant="card" {...c} sourceRows={convSource} displayRows={conversions} description="Ads atfı. Yalnız gerçekleşen eylemler. Aynı satın almayı izleyen farklı eylemler toplanmaz. Satın alma sayısı kesirli olabilir.">
       {conversions.length?<FitTable rowKey="rowId" label="Gerçekleşen Ads dönüşümleri" rows={conversions.map((r,i)=>({...r,rowId:i}))} searchable={false} columns={[{field:"group",label:"Reklam grubu",presentation:"identity",secondaryField:"campaign"},{field:"adId",label:"Reklam"},{field:"action",label:"Dönüşüm"},{field:"count",label:"Adet / atıf",renderCell:count},currencyColumn("value","Değer")]} />:<div className="sumen-empty">Dönüşüm yok.</div>}
      </DataComponent>
     </SortableItem>}</SortableRegion></>}
   {panel==='products'&&<Section id="site-heading" title="Site satışları" spacing="section">
    {app.visible("site-products")&&<DataComponent id="site-products" queryId="site_products" title="Satılan ürünler" kind="table" variant="card" sourceRows={productsSource} displayRows={products} description="Ödenmiş sipariş ürünleri; tüm sipariş ve ürün indirimleri düşülmüş, kargo hariç, iade öncesi tutar. Reklamlarla satış eşleştirmesi yapılmaz. Yeni: 15 Ekim ve sonrası eklenen ürün.">
     {products.length?<FitTable rowKey="productId" label="Satılan site ürünleri" rows={products} columns={[{field:"product",label:"Ürün",renderCell:(v,r)=><span>{v}{r.newProduct&&<small className="sumen-new">Yeni</small>}</span>},{field:"units",label:"Adet"},currencyColumn("amount","Ürün tutarı")]} />:<div className="sumen-empty">Ödenmiş satış yok.</div>}
     {totals.shipping>0&&<div className="sumen-shipping">Kargo {tl(totals.shipping)}</div>}
    </DataComponent>}
   </Section>}
  </>}
 </article>;
}


