export const salesStores=[
 {source:'gunerofis.com',label:'Güner Ofis'},
 {source:'sumentakimi.com.tr',label:'Sümen TR'}
];
export function inPeriod(row,period){
 if(!period||period==='all')return true;
 const [start,end]=period.split('..'),date=String(row.when||'').slice(0,10);
 return date>=start&&date<=(end||start);
}
export function storeSummary(rows){
 const stores=salesStores.map(store=>{
  const orders=rows.filter(row=>row.source===store.source);
  const cents=orders.filter(row=>String(row.countsAsSale)==='true').reduce((sum,row)=>sum+Math.round(Number(row.amount||0)*100),0);
  return {...store,orders:orders.length,cents};
 });
 return [...stores,{source:'total',label:'İki mağaza toplamı',orders:stores.reduce((sum,s)=>sum+s.orders,0),cents:stores.reduce((sum,s)=>sum+s.cents,0)}];
}
