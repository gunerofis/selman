// DEMİRCİ — tezgâh kalıbı. Sekmeler: Yükselt · Birleştir · Taş İşle · Kademe · Parçala.
const forgeTabs=[['Yükselt','hammer'],['Birleştir','swap'],['Taş İşle','gem'],['Kademe','star'],['Parçala','sword']];
let forgeSlot=null;
function gearUpChance(g){return g.plus<3?100:Math.max(35,100-g.plus*4);}
function gearTierCost(g){return {gold:120*g.tier,ore:2*g.tier};}
function tierMates(s,g){return (s.gear||[]).filter(x=>x.id!==g.id&&x.slot===g.slot&&x.tier===g.tier&&s.worn?.[x.slot]!==x.id);}
function matCell(key,have,need){return '<span class="tzMat'+(have>=need?'':' az')+'">'+objectArt(key)+'<b>'+have+' / '+need+'</b></span>';}
function forgeList(){
 const g=(state.gear||[]).filter(x=>!forgeSlot||x.slot===forgeSlot);
 return g.sort((a,b)=>b.tier-a.tier||b.rarity-a.rarity||b.plus-a.plus);
}
function forgePick(){const l=forgeList();return l.find(g=>g.id===forgeSel)||l[0]||null;}
function roomForge(){
 const tab=forgeTabs.some(t=>t[0]===forgeTab)?forgeTab:'Yükselt',sel=forgePick();
 const tabs='<nav class="tzTabs">'+forgeTabs.map(([n,ic])=>tag('<span></span>'+glyph(ic)+n,'forgeTab','data-key="'+n+'" aria-pressed="'+(n===tab)+'"','tzTab'+(n===tab?' on':''))).join('')+'</nav>';
 // sol — yuva süzgeci + eşyalar
 const suzgec='<div class="fgFilter">'+gearSlots.map(([k,n])=>tag(gearIcon(k),'forgeSlot','data-slot="'+k+'" aria-label="'+n+'" aria-pressed="'+(forgeSlot===k)+'"','fgFil'+(forgeSlot===k?' on':''))).join('')+'</div>';
 const kutular=forgeList().map(g=>tag('<span class="tzCell r'+g.rarity+'">'+gearIcon(g.slot,g.tier)+'<i>T'+g.tier+'</i>'+(g.plus?'<b>+'+g.plus+'</b>':'')+'</span>','forgeSel','data-id="'+g.id+'" aria-label="'+gearName(g)+'" aria-pressed="'+(sel&&sel.id===g.id)+'"','tzItem'+(sel&&sel.id===g.id?' on':'')+(state.worn?.[g.slot]===g.id?' worn':''))).join('');
 const sol='<aside class="tzPanel"><div class="tzHead">'+glyph('bag')+'Ekipmanlarım</div>'+suzgec+'<div class="tzBody"><div class="tzList">'+(kutular||'<p class="tzNote">Bu yuvada eşya yok.</p>')+'</div></div></aside>';
 // orta — örsün üstündeki eşya
 let orta='<div class="tzMid">'+(sel?'<div class="fgEmber"></div><img class="fgForged" alt="" src="'+gearIconSrc(sel.slot,sel.tier)+'">':'')
  +'<div class="fgRing">'+(sel?'<span class="tzCell r'+sel.rarity+'">'+gearIcon(sel.slot,sel.tier)+'<i>T'+sel.tier+'</i></span>':'<span class="tzCell r0"></span>')+'</div>';
 if(sel){
  orta+='<div class="tzName"><span class="gxName r'+sel.rarity+'">'+gearName(sel)+(sel.plus?' +'+sel.plus:'')+'</span></div>';
  const bas=Math.min(16,Math.max(0,sel.plus-1));
  orta+='<div class="tzPath">'+Array.from({length:5},(_,i)=>{const n=bas+i;
   return '<span class="tzStep'+(n<sel.plus?' done':n===sel.plus?' now':'')+'">+'+n+'</span>';}).join('')+'</div>';
 }else orta+='<div class="tzName">Eşya seç</div>';
 orta+='</div>';
 // sağ — işlem
 let bas='Yükseltme',govde='<p class="tzNote">Soldan bir eşya seç.</p>',eylem='';
 const stat=sel?gearSlot[sel.slot].stat:'atk',ikon=stat==='atk'?'sword':'heart';
 const satir=(ad,ic,a,b)=>'<div class="tzRow">'+glyph(ic)+ad+'<b>'+a+' <span class="tzArrow">»</span> <em>'+b+'</em>'+(b>a?'<u>(+'+(b-a)+')</u>':'')+'</b></div>';
 if(sel&&tab==='Yükselt'){
  const max=sel.plus>=GEAR_MAX_PLUS,bedel=gearUpCost(sel),su=gearBonus(sel,stat),sonra=gearBase(sel,sel.plus+1)+(gearBonus(sel,stat)-gearBase(sel,sel.plus)),oran=gearUpChance(sel),takili=state.worn?.[sel.slot]===sel.id;
  const ad=stat==='atk'?'Saldırı':'Can';
  govde='<div class="tzChip">+'+sel.plus+'<span class="tzArrow">»</span><span class="to">+'+(max?sel.plus:sel.plus+1)+'</span></div>'
   +satir(ad,ikon,su,max?su:sonra)
   +(takili?satir('Toplam',ikon,stat==='atk'?attack(state):healthOf(state),(stat==='atk'?attack(state):healthOf(state))+(max?0:sonra-su)):'')
   +(max?'<p class="tzNote">Azami güçlendirme.</p>':(bedel.ore?'<div class="tzHead">Gerekli malzeme</div><div class="tzMats">'+matCell('ore',state.ore,bedel.ore)+'</div>':'')+'<div class="tzOran'+(oran<60?' dusuk':'')+'">%'+oran+'<small>BAŞARI ORANI</small></div>');
  eylem=tag('Yükselt<small>'+objectArt('gold')+bedel.gold+'</small>','gearUp','data-id="'+sel.id+'" '+(max||!afford(state,bedel)?'disabled':''),'gxBtn');
 }else if(tab==='Birleştir'){
  const gruplar=mergeGroups(state);bas='Birleştirme';
  govde=gruplar.length?'<div class="tzBody">'+gruplar.map(([k,v])=>{const [slot,r]=k.split(':'),ucu=v.slice().sort((a,b)=>b.tier-a.tier).slice(0,3);
   return '<div class="fgTriple">'+ucu.map(g=>'<span class="tzCell r'+g.rarity+'">'+gearIcon(g.slot,g.tier)+'</span>').join('')+'<span class="fgArrow">'+glyph('next')+'</span><span class="tzCell r'+(Number(r)+1)+'">'+gearIcon(slot,ucu[0].tier)+'</span>'+tag('Birleştir','forgeMerge','data-key="'+k+'"','gxBtn sub')+'</div>';}).join('')+'</div>'
   :'<p class="tzNote">Aynı yuvadan ve aynı nadirlikten üç eşya gerekir.</p>';
  eylem=tag('Hepsini birleştir','forgeMergeAll',gruplar.length?'':'disabled','gxBtn');
 }else if(sel&&tab==='Taş İşle'){
  const yuva=sel.sockets,bos=yuva.includes(null),st=state.stones||{};bas='Taş işleme';
  govde=yuva.length?'<div class="tzSlots">'+yuva.map((k,i)=>k?tag('<span class="gxStone '+k+'"></span>','forgePullOne','data-id="'+sel.id+'" data-i="'+i+'"','tzSlot dolu'):'<span class="tzSlot bos"></span>').join('')+'</div>'
    +satir('Eşya',ikon,gearBonus(sel,stat),gearBonus(sel,stat))
    +'<div class="tzHead">Taş kesesi</div><div class="tzMats">'+Object.keys(stoneMeta).map(k=>'<span class="tzMat">'+(ART['icon_stone_'+k]?'<img alt="" src="'+ART['icon_stone_'+k]+'">':'<span class="gxStone '+k+'"></span>')+'<b>'+(st[k]||0)+'</b></span>').join('')+'</div>'
    +'<p class="tzNote">Takılı taşı geri almak için yuvaya dokun.</p>'
   :'<p class="tzNote">Bu eşyada taş yuvası yok. Mavi ve üstü nadirlikte yuva açılır.</p>';
  eylem=Object.keys(stoneMeta).map(k=>tag('<span class="gxStone '+k+'"></span>'+stoneMeta[k][0],'gearSocket','data-id="'+sel.id+'" data-stone="'+k+'" '+(bos&&(developerFree(state)||st[k]>0)?'':'disabled'),'gxBtn sub stone')).join('');
 }else if(sel&&tab==='Kademe'){
  const son=sel.tier>=GEAR_MAX_TIER,esler=tierMates(state,sel),bedel=gearTierCost(sel);bas='Kademe yükseltme';
  const su=gearBonus(sel,stat),sonra=Math.max(1,Math.round(gearSlot[sel.slot].base*(1+sel.tier*.4)*rarityMult[sel.rarity]*(1+sel.plus*.08)))+(su-gearBase(sel));
  govde='<div class="tzChip">T'+sel.tier+'<span class="tzArrow">»</span><span class="to">T'+(son?sel.tier:sel.tier+1)+'</span></div>'
   +satir('Eşya',ikon,su,son?su:sonra)
   +'<div class="tzHead">Gerekli malzeme</div><div class="tzMats">'
   +'<span class="tzMat'+(esler.length?'':' az')+'">'+(esler[0]?'<span class="tzCell r'+esler[0].rarity+'">'+gearIcon(sel.slot,sel.tier)+'</span>':gearIcon(sel.slot,sel.tier))+'<b>'+esler.length+' / 1</b></span>'
   +matCell('ore',state.ore,bedel.ore)+'</div>'
   +(son?'<p class="tzNote">Azami kademe.</p>':'<p class="tzNote">Aynı yuvadan aynı kademede bir eşya harcanır. Güçlendirme ve taşlar korunur.</p>');
  eylem=tag('Kademe yükselt<small>'+objectArt('gold')+bedel.gold+'</small>','forgeTier','data-id="'+sel.id+'" '+(son||(!developerFree(state)&&!esler.length)||!afford(state,bedel)?'disabled':''),'gxBtn');
 }else if(sel&&tab==='Parçala'){
  const takili=state.worn?.[sel.slot]===sel.id,dusuk=(state.gear||[]).filter(g=>g.rarity<=1&&state.worn?.[g.slot]!==g.id);bas='Parçalama';
  govde='<div class="tzMats"><span class="tzMat">'+objectArt('ore')+'<b>+'+(sel.tier+sel.rarity)+'</b></span><span class="tzMat">'+objectArt('gold')+'<b>+'+Math.floor(gearSellValue(sel)/2)+'</b></span></div>'
   +(sel.sockets.some(Boolean)?'<p class="tzNote">İçindeki taşlar geri gelir.</p>':'')
   +(takili?'<p class="tzNote">Takılı eşya parçalanamaz.</p>':'')
   +'<p class="tzNote">Gri ve yeşil: '+dusuk.length+' eşya.</p>';
  eylem=tag('Parçala','forgeScrap','data-id="'+sel.id+'" '+(takili?'disabled':''),'gxBtn')+tag('Gri ve yeşilleri parçala','forgeScrapLow',dusuk.length?'':'disabled','gxBtn sub');
 }
 const sag='<aside class="tzPanel"><div class="tzHead">'+glyph('hammer')+bas+'</div><div class="tzBody">'+govde+'</div><div class="tzAct">'+eylem+'</div></aside>';
 return artVenueShell('forge','Demirci','<div class="tz tz-forge">'+tabs+sol+orta+sag+'</div>');
}
async function forgeAction(action,el){
 const d=el.dataset||{};
 if(action==='forgeSlot'){forgeSlot=forgeSlot===d.slot?null:d.slot;forgeSel=null;render();return true;}
 if(action!=='forgeTier'&&action!=='forgePullOne')return false;
 let not='';
 const next=await transact(s=>{
  if(s.fight)return false;const g=(s.gear||[]).find(x=>x.id===d.id);if(!g)return false;
  if(action==='forgePullOne'){const i=Number(d.i),k=g.sockets[i];if(!k||!spend(s,{gold:50}))return false;s.stones||={};s.stones[k]=(s.stones[k]||0)+1;g.sockets[i]=null;not=stoneMeta[k][0]+' çıkarıldı';return;}
  const esler=tierMates(s,g);
  if(g.tier>=GEAR_MAX_TIER||(!developerFree(s)&&!esler.length)||!spend(s,gearTierCost(g)))return false;
  const harca=esler.sort((a,b)=>a.rarity-b.rarity||a.plus-b.plus)[0];
  if(!developerFree(s))s.gear=s.gear.filter(x=>x!==harca);g.tier++;not='T'+g.tier;
 });
 if(next.fight){reflect(next);return true;}
 state=next;tell();render();if(not)toast(not);
 return true;
}
