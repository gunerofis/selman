// Çanta: referanslardaki kategori şeridi, eşya ızgarası ve sağ ayrıntı alanı.
let cantaQuery='',cantaOrder='power';
function cantaName(e){return e.t==='item'?gearName(e.g)+(e.g.plus?' +'+e.g.plus:''):e.n;}
function cantaRarity(e){return e.t==='item'?e.g.rarity:e.r??(e.t==='stone'?2:0);}
function cantaScore(e){return e.t==='item'?gearPower(e.g):e.t==='gear'?bonus(state,e.k)*10:0;}
function cantaStat(icon,label,value,delta=0){return '<div class="ctStat">'+glyph(icon)+'<span>'+safeText(label)+'</span><b>'+safeText(value)+'</b>'+(delta?'<em class="'+(delta>0?'up':'down')+'">'+(delta>0?'+':'')+delta+'</em>':'')+'</div>';}
function cantaDetail(e){
 if(!e)return '<div class="ctNoSelection">'+glyph('bag')+'<p>Eşya seçilmedi.</p></div>';
 const rarity=cantaRarity(e);let rows='',actions='',subtitle='',worn=false;
 if(e.t==='item'){
  const g=e.g,stat=gearSlot[g.slot].stat,cost=gearUpCost(g),max=g.plus>=GEAR_MAX_PLUS;worn=state.worn?.[g.slot]===g.id;
  subtitle='T'+g.tier+' · '+gearSlot[g.slot].name;
  rows=cantaStat(stat==='atk'?'sword':'heart',stat==='atk'?'Saldırı':'Can',gearBonus(g,stat),worn?0:gearDelta(g));
  if(g.sockets.length)rows+=cantaStat('gem','Taş yuvası',g.sockets.filter(Boolean).length+' / '+g.sockets.length);
  actions=tag(glyph('sword')+(worn?'Çıkar':'Kuşan'),worn?'gearOff':'gearWear','data-id="'+g.id+'"','ctAction primary')
   +tag(glyph('eye')+'Karşılaştır','cantaCompare','data-id="'+g.id+'"','ctAction')
   +tag(glyph('next')+'Geliştir'+(max?'': '<small>'+glyph('coin')+cost.gold+(cost.ore?' '+glyph('ore')+cost.ore:'')+'</small>'),'gearUp','data-id="'+g.id+'" '+(max||!afford(state,cost)?'disabled':''),'ctAction')
   +(worn?'':tag(glyph('coin')+'Sat <small>'+gearSellValue(g)+'</small>','cantaSell','data-id="'+g.id+'"','ctAction'));
 }else if(e.t==='gear'){
  worn=state.equipped===e.k&&!wornGear(state,'silah');subtitle='T1 · Silah';
  rows=cantaStat('sword','Saldırı',bonus(state,e.k));
  actions=tag(glyph('sword')+(worn?'Kuşanıldı':'Kuşan'),'cantaWear','data-key="'+e.k+'" '+(worn?'disabled':''),'ctAction primary')
   +tag(glyph('hammer')+'Geliştir','forge','','ctAction');
 }else if(e.t==='stone'){
  subtitle='Taş';rows=cantaStat('gem','Adet',e.count);
  actions=tag(glyph('gem')+'Taş Tak','cantaStone','','ctAction primary');
 }else{
  subtitle=e.t==='chest'?'Sandık':'Malzeme';rows=cantaStat(e.t==='chest'?'chest':e.ic||'ore','Adet',e.count);
  const destinations={feed:['pet','Petler','paw'],eggs:['pet','Petler','paw'],feather:['wings','Kanatlar','wing'],shards:['relic','Kalıntılar','star'],ore:['forge','Demirci','hammer'],auraEssence:['auras','Auralar','aura']};
  const destination=e.t==='chest'?['openChest','Aç','chest']:destinations[e.k];
  if(destination){const [action,label,icon]=destination;actions=tag(glyph(icon)+label,action,'','ctAction primary');}
 }
 return '<div class="ctPreview">'+bagCell(e)+'</div><h3 class="gxName r'+rarity+'">'+safeText(cantaName(e))+'</h3><p class="ctItemType">'+safeText(subtitle)+'</p>'
  +(e.t==='item'||e.t==='gear'?'<div class="ctRarity r'+rarity+'">'+safeText(rarities[rarity])+'</div>':'')
  +(worn?'<span class="ctWorn">'+glyph('check')+'Kuşanıldı</span>':'')
  +'<div class="ctItemStats">'+rows+'</div><div class="ctDetailActions">'+actions+'</div>';
}
function roomBag(){
 const all=bagEntries(),query=cantaQuery.toLocaleLowerCase('tr-TR');
 const list=all.filter(e=>(bagTab==='all'||e.group===bagTab)&&(!query||cantaName(e).toLocaleLowerCase('tr-TR').includes(query))).sort((a,b)=>cantaOrder==='rarity'?cantaRarity(b)-cantaRarity(a)||cantaScore(b)-cantaScore(a):cantaScore(b)-cantaScore(a));
 const selected=list.find(e=>bagKey(e)===bagSel)||list[0];
 const tabs='<nav class="ctTabs" aria-label="Çanta kategorileri">'+bagTabs().map(([key,name,icon])=>tag(glyph(icon)+'<span>'+name+'</span>','bagTab','data-key="'+key+'" aria-pressed="'+(key===bagTab)+'"','ctTab'+(key===bagTab?' selected':''))).join('')+'</nav>';
 const low=all.filter(e=>e.t==='item'&&e.g.rarity<=1&&state.worn?.[e.g.slot]!==e.g.id);
 const toolbar='<div class="ctToolbar"><span class="ctCount">'+glyph('bag')+'<b>'+all.length+'</b></span><label class="ctSearch">'+glyph('eye')+'<input id="cantaSearch" type="text" role="searchbox" inputmode="search" placeholder="Ara…" aria-label="Çantada ara" value="'+safeText(cantaQuery)+'" autocomplete="off"></label>'+tag(glyph('swap')+'<span>Sırala: '+(cantaOrder==='power'?'Güç':'Kalite')+'</span>','cantaSort','aria-label="Eşya sıralamasını değiştir"','ctSort')+'</div>';
 const cells=list.map(e=>{const worn=e.t==='item'?state.worn?.[e.g.slot]===e.g.id:e.t==='gear'?state.equipped===e.k&&!wornGear(state,'silah'):false;
  return tag(bagCell(e)+(worn?'<span class="ctEquipped">'+glyph('check')+'</span>':''),'bagSel','data-key="'+bagKey(e)+'" aria-label="'+safeText(cantaName(e))+'" aria-pressed="'+(selected===e)+'"','ctCell'+(selected===e?' selected':'')+(worn?' equipped':''));
 }).join('');
 const empty=!list.length?'<p class="ctEmptyMessage" role="status">'+(query?'Aramana uygun eşya yok.':'Bu kategoride eşya yok.')+'</p>':'';
 const blanks=Array(Math.max(0,32-list.length)).fill('<span class="ctCell ctEmpty" aria-hidden="true"></span>').join('');
 return '<section class="venue venue-bag surface-satchel artRoom ctRoom" aria-label="Çanta"><img class="ctBackdrop" src="'+(ART.hub_scene_full||ART.scene)+'" alt="" aria-hidden="true"><div class="ctVeil" aria-hidden="true"></div><div class="roomTop">'+tag(glyph('back'),'back','aria-label="Geri"','roomBack')+'<h2>'+glyph('bag')+' Çanta</h2></div><div class="ctLayout"><div class="ctInventory">'+tabs+'<section class="ctPanel ctStorage">'+toolbar+'<div class="ctGrid" aria-label="Çantadaki eşyalar">'+empty+cells+blanks+'</div><div class="ctFoot"><span>'+glyph('bag')+' '+list.length+' eşya</span>'+tag('Gri / yeşil sat · '+low.length,'cantaSellLow',low.length?'':'disabled','ctSmallButton')+tag(glyph('sword')+'Ekipman','equip','','ctSmallButton')+'</div></section></div><aside class="ctPanel ctDetail" aria-label="Seçili eşya">'+cantaDetail(selected)+'</aside></div></section>';
}
async function cantaAction(action,el){
 if(action==='cantaStone'){forgeTab='Taş İşle';forgeSlot=null;forgeSel=null;await act('forge',el);return true;}
 if(action==='cantaSell'){
  const g=(state.gear||[]).find(v=>v.id===el.dataset.id);if(!g||state.worn?.[g.slot]===g.id)return true;
  openModal('Eşya Satışı',safeText(gearName(g))+' · '+gearSellValue(g)+' altın'+(g.sockets.some(Boolean)?'<p>Takılı taşlar çantaya döner.</p>':''),tag('Sat','gearSell','data-id="'+g.id+'"','gxBtn'));return true;
 }
 if(action==='cantaCompare'){
  const g=state.gear.find(v=>v.id===el.dataset.id);if(!g)return true;
  const wornItem=wornGear(state,g.slot);
  const rows=['atk','hp'].map(stat=>{
   const chosen=gearBonus(g,stat),current=wornItem?gearBonus(wornItem,stat):g.slot==='silah'&&stat==='atk'?bonus(state,state.equipped):0,delta=chosen-current;
   return '<p>'+(stat==='atk'?'Saldırı':'Can')+': '+current+' → '+chosen+' ('+(delta>0?'+':'')+delta+')</p>';
  }).join('');
  openModal('Karşılaştır','<p>'+safeText(gearName(g))+'</p><p>'+(wornItem?safeText(gearName(wornItem)):'Bu yuvada kuşanılmış eşya yok.')+'</p>'+rows);return true;
 }
 if(action==='cantaSellLow'){
  const ids=state.gear.filter(g=>g.rarity<=1&&state.worn?.[g.slot]!==g.id).map(g=>g.id);
  if(!ids.length)return true;
  const gold=state.gear.filter(g=>ids.includes(g.id)).reduce((sum,g)=>sum+gearSellValue(g),0);
  openModal('Toplu Satış',ids.length+' kuşanılmamış gri / yeşil eşya · '+gold+' altın',
   tag('Sat','cantaSellConfirm','data-ids="'+ids.join(',')+'"','gxBtn'));
  return true;
 }
 if(action==='cantaSellConfirm'){
  let result=false;await changeState(s=>{result=topluEsya(s,String(el.dataset.ids||'').split(',').filter(Boolean),'sell');return !!result;});
  if(modal.open)modal.close();
  toast(result?lootText(result.reward):'Satış yapılamadı.');return true;
 }
 if(action==='cantaSort'){cantaOrder=cantaOrder==='power'?'rarity':'power';render();return true;}
 if(action==='cantaWear'){chosenWeapon=el.dataset.key;await act('wear',el);return true;}
 return false;
}
document.addEventListener('input',event=>{
 if(event.target.id!=='cantaSearch')return;
 const value=event.target.value,position=event.target.selectionStart;
 cantaQuery=value;render();const input=document.getElementById('cantaSearch');input?.focus();
 if(input&&position!==null)input.setSelectionRange?.(position,position);
});
