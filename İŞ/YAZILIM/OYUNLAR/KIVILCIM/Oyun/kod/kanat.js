// KANATLAR — tezgâh kalıbı. Sekmeler: Güçlendir · Evrim · Rün.
// Seviye 0-20, her 5 seviyede evrim kapısı (5 evre). Güçlendirmenin başarı oranı var.
const WING_EVRE=5,WING_ADIM=5;
const wingNames={turna:'Turna Kanatları',kuzgun:'Kuzgun Kanatları'};
let wingTab='Güçlendir';
function wingPhase(s,id){return (s.wingPhase||{})[id]||0;}
function wingRunes(s,id){return (s.wingRunes||{})[id]||[null,null];}
function wingCap(s,id){return (wingPhase(s,id)+1)*WING_ADIM;}
function wingLevelOf(s,id){return (s.wingLevel||{})[id]||0;}
function wingStat(s,id,stat,lvl=wingLevelOf(s,id),faz=wingPhase(s,id)){
 const m=wingMeta[id];if(!m||m.stat!==stat)return 0;
 const taban=stat==='hp'?lvl*3:lvl*.6;
 let n=Math.floor(taban*(1+faz*.25));
 for(const k of wingRunes(s,id))if(k&&stoneMeta[k][1]===stat)n+=stoneValue(k,8+faz*3);
 return n;
}
function wingValue(s,id,stat){return wingStat(s,id,stat);}
function wingUpCost(s,id){const l=wingLevelOf(s,id);return {feather:1+Math.floor(l/5),gold:30*(l+1)};}
function wingUpChance(s,id){return Math.max(40,100-wingLevelOf(s,id)*3);}
function wingEvoCost(s,id){const f=wingPhase(s,id)+1;return {feather:8*f,gold:400*f};}
function wingOwned(id){return state.unlocks.includes(id);}

function roomWings(){
 const id=roomSelection.wings||'turna',m=wingMeta[id]||{r:0,stat:'hp'},row=collections.wings.find(r=>r[0]===id)||collections.wings[0];
 const sahip=wingOwned(id),lvl=wingLevelOf(state,id),faz=wingPhase(state,id),on=state.slots.wings===id,cap=wingCap(state,id);
 const ikon=v=>ART['icon_wing_'+v]?'<img alt="" src="'+ART['icon_wing_'+v]+'">':glyph('wing');
 const sekmeler=[['Güçlendir','wing'],['Evrim','star'],['Rün','gem']];
 const tabs='<nav class="tzTabs">'+sekmeler.map(([n,ic])=>tag('<span></span>'+glyph(ic)+n,'wingTab','data-key="'+n+'" aria-pressed="'+(n===wingTab)+'"','tzTab'+(n===wingTab?' on':''))).join('')+'</nav>';

 // sol: kanat listesi
 const liste=collections.wings.map(([v,n])=>{const o=state.unlocks.includes(v);
  return tag('<span class="tzCell r'+(wingMeta[v]?.r||0)+'">'+ikon(v)+(o&&wingLevelOf(state,v)?'<b>+'+wingLevelOf(state,v)+'</b>':'')+'</span><small>'+n.replace(' Kanatları','')+'</small>',
  'roomSelect','data-group="wings" data-key="'+v+'" aria-pressed="'+(v===id)+'"','tzItem'+(v===id?' on':'')+(state.slots.wings===v?' worn':'')+(o?'':' kilit'));}).join('');
 const sol='<aside class="tzPanel"><div class="tzHead">'+glyph('wing')+'Kanatlarım</div><div class="tzBody"><div class="tzList">'+liste+'</div></div></aside>';

 // orta: kahraman + evre yolu
 const yol='<div class="tzPath">'+Array.from({length:WING_EVRE},(_,i)=>{
  const dolu=i<faz,simdi=i===faz,gec=i*WING_ADIM;
  return '<span class="tzStep'+(dolu?' done':simdi?' now':'')+'">'+(i+1)+'<i>'+Array.from({length:WING_ADIM},(_,j)=>'<s class="'+(lvl>gec+j?'on':'')+'"></s>').join('')+'</i></span>';
 }).join('')+'</div>';
 const ad='<div class="tzName">'+ikon(id)+'<span class="gxName r'+m.r+'">'+(wingNames[id]||row[1])+(lvl?' +'+lvl:'')+'</span></div>';
 const orta='<div class="tzMid">'+roomCanvas('hero')+ad+yol+'</div>';

 // sağ: sekmeye göre işlem
 let bas='',govde='',eylem='';
 if(!sahip){
  bas='Kilitli';govde='<p class="tzNote">'+safeText(row[2])+'</p><div class="tzCost">'+Object.entries(row[3]).map(([k,v])=>'<span class="'+((state[k]||0)>=v?'':'az')+'">'+objectArt(k)+(state[k]||0)+' / '+v+'</span>').join('')+'</div>';
  eylem=tag('Aç','collectItem','data-key="wings" data-id="'+id+'" '+(afford(state,row[3])?'':'disabled'),'gxBtn');
 }else if(wingTab==='Evrim'){
  const son=faz>=WING_EVRE-1,hazir=lvl>=cap,bedel=wingEvoCost(state,id);
  bas='Evrim';
  govde='<div class="tzChip">'+(faz+1)+'. evre<span class="tzArrow">»</span><span class="to">'+(son?'son':(faz+2)+'. evre')+'</span></div>'
   +'<div class="tzRow">'+glyph('star')+'Evre gücü<b>%'+(faz*25)+' <span class="tzArrow">»</span> <em>%'+((faz+1)*25)+'</em></b></div>'
   +'<div class="tzRow">'+glyph(m.stat==='atk'?'sword':'heart')+'Azami seviye<b>'+cap+' <span class="tzArrow">»</span> <em>'+Math.min(20,cap+WING_ADIM)+'</em></b></div>'
   +(son?'<p class="tzNote">Kanat son evresinde.</p>':hazir?'<div class="tzCost">'+Object.entries(bedel).map(([k,v])=>'<span class="'+((state[k]||0)>=v?'':'az')+'">'+objectArt(k==='gold'?'gold':'feather')+v+'</span>').join('')+'</div>':'<p class="tzNote">Önce '+cap+'. seviyeye ulaş.</p>');
  eylem=tag('Evrim','wingEvo','data-id="'+id+'" '+(son||!hazir||!afford(state,bedel)?'disabled':''),'gxBtn');
 }else if(wingTab==='Rün'){
  const yuva=wingRunes(state,id),bosYuva=faz>0?2:1;
  bas='Rün';
  govde='<div class="tzSlots">'+[0,1].map(i=>{const k=yuva[i],acik=i<bosYuva;
   return acik?tag(k?'<span class="gxStone '+k+'"></span>':'','wingRunePull','data-id="'+id+'" data-i="'+i+'" '+(k?'':'disabled'),'tzSlot'+(k?' dolu':' bos')):'<span class="tzSlot bos" style="opacity:.4"></span>';}).join('')+'</div>'
   +'<p class="tzNote">'+(bosYuva<2?'İkinci yuva 2. evrede açılır.':'Rünü çıkarmak için yuvaya dokun.')+'</p>'
   +'<div class="tzCost">'+Object.keys(stoneMeta).map(k=>'<span>'+(ART['icon_stone_'+k]?'<img alt="" src="'+ART['icon_stone_'+k]+'">':'<span class="gxStone '+k+'"></span>')+((state.stones||{})[k]||0)+'</span>').join('')+'</div>';
  eylem=Object.keys(stoneMeta).map(k=>tag('<span class="gxStone '+k+'"></span>'+stoneMeta[k][0],'wingRuneSet','data-id="'+id+'" data-stone="'+k+'" '+((developerFree(state)||(state.stones||{})[k]>0)&&yuva.slice(0,bosYuva).includes(null)?'':'disabled'),'gxBtn sub stone')).join('');
 }else{
  const dolu=lvl>=cap,son=lvl>=20,bedel=wingUpCost(state,id),oran=wingUpChance(state,id);
  const su=wingStat(state,id,m.stat),sonraki=wingStat(state,id,m.stat,lvl+1);
  bas='Güçlendirme';
  govde='<div class="tzChip">+'+lvl+'<span class="tzArrow">»</span><span class="to">+'+(son?lvl:lvl+1)+'</span></div>'
   +'<div class="tzRow">'+glyph(m.stat==='atk'?'sword':'heart')+(m.stat==='atk'?'Saldırı':'Azami can')+'<b>'+su+' <span class="tzArrow">»</span> <em>'+sonraki+'</em></b></div>'
   +(son?'<p class="tzNote">Kanat azami seviyede.</p>':dolu?'<p class="tzNote">Devam etmek için Evrim gerekir.</p>':
     '<div class="tzCost">'+Object.entries(bedel).map(([k,v])=>'<span class="'+((state[k]||0)>=v?'':'az')+'">'+objectArt(k==='gold'?'gold':'feather')+v+'</span>').join('')+'</div><div class="tzOran">%'+oran+'<small>BAŞARI ORANI</small></div>');
  eylem=tag('Güçlendir','wingUp','data-id="'+id+'" '+(son||dolu||!afford(state,bedel)?'disabled':''),'gxBtn');
 }
 if(sahip)eylem+=tag(on?'Çıkar':'Kuşan',on?'removeSlot':'collectItem','data-key="wings" data-id="'+id+'"','gxBtn sub');
 const sag='<aside class="tzPanel"><div class="tzHead">'+glyph('wing')+bas+'</div><div class="tzBody">'+govde+'</div><div class="tzAct">'+eylem+'</div></aside>';
 return artVenueShell('wings','Kanatlar','<div class="tz">'+tabs+sol+orta+sag+'</div>');
}

async function wingAction(action,el){
 const d=el.dataset||{};
 if(action==='wingTab'){wingTab=d.key;render();return true;}
 if(!['wingUp','wingEvo','wingRuneSet','wingRunePull'].includes(action))return false;
 let not='',parla=false;
 const next=await transact(s=>{
  if(s.fight)return false;const id=d.id;if(!s.unlocks.includes(id))return false;
  s.wingLevel||={};s.wingPhase||={};s.wingRunes||={};s.stones||={};
  s.wingRunes[id]||=[null,null];
  if(action==='wingUp'){
   const l=wingLevelOf(s,id);
   if(l>=20||l>=wingCap(s,id)||!spend(s,wingUpCost(s,id)))return false;
   if(Math.random()*100<wingUpChance(s,id)){s.wingLevel[id]=l+1;not='+'+(l+1);parla=true;}
   else not='Güçlendirme tutmadı';
   return;
  }
  if(action==='wingEvo'){
   const f=wingPhase(s,id);
   if(f>=WING_EVRE-1||wingLevelOf(s,id)<wingCap(s,id)||!spend(s,wingEvoCost(s,id)))return false;
   s.wingPhase[id]=f+1;not=(f+2)+'. evre';parla=true;return;
  }
  if(action==='wingRuneSet'){
   const k=d.stone,bos=wingPhase(s,id)>0?2:1,i=s.wingRunes[id].slice(0,bos).indexOf(null);
   if(i<0||!stoneMeta[k]||(!developerFree(s)&&!(s.stones[k]>0)))return false;
   if(!developerFree(s))s.stones[k]--;s.wingRunes[id][i]=k;not=stoneMeta[k][0]+' takıldı';return;
  }
  const i=Number(d.i),k=s.wingRunes[id][i];
  if(!k)return false;s.stones[k]=(s.stones[k]||0)+1;s.wingRunes[id][i]=null;not=stoneMeta[k][0]+' çıkarıldı';
 });
 if(next.fight){reflect(next);return true;}
 state=next;tell();render();
 if(parla)document.querySelector?.('.tzMid')?.classList?.add('parla');
 if(not)toast(not);
 return true;
}
