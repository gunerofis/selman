// ÇANTA · DEMİRCİ · PETLER · KANATLAR · MARKET — ortak gx görsel dili.
const stoneMeta={yakut:['Yakut','atk','#d8382c'],zumrut:['Zümrüt','hp','#2fae6a']};
const matMeta={ore:['Cevher','ore'],feed:['Yem','leaf'],shards:['Kalıntı parçası','star'],feather:['Tüy','wing'],eggs:['Yumurta','paw'],auraEssence:['Aura Özü','aura']};
const petMeta=Object.fromEntries(EKONOMI.petler.map(item=>[item.id,{r:item.r,stat:item.stat}]));
const wingMeta=Object.fromEntries(EKONOMI.kanatlar.map(item=>[item.id,{r:item.r,stat:item.stat}]));
const MAX_LVL=EKONOMI.gelisim.seviye,MAX_STAR=EKONOMI.gelisim.yildiz;
function petOf(s){return s.slots?.pet||'ak';}
function lvlOf(s,group,id){return (s[group==='pet'?'petLevel':'wingLevel']||{})[id]||0;}
function starOf(s,id){return (s.petStar||{})[id]||0;}
function petValue(s,id,stat){
 const m=petMeta[id];if(!m||m.stat!==stat)return 0;
 const lvl=lvlOf(s,'pet',id);return Math.round((stat==='hp'?lvl*2:Math.floor(lvl/2))*(1+starOf(s,id)*.2));
}
function wingValue(s,id,stat){
 const m=wingMeta[id];if(!m||m.stat!==stat)return 0;
 const lvl=lvlOf(s,'wing',id);return stat==='hp'?lvl*3:Math.floor(lvl*.6);
}
function companionBonus(s,stat){const support=s.supportPet&&s.supportPet!==petOf(s)?Math.floor(petValue(s,s.supportPet,stat)*EKONOMI.gelisim.petDestek):0;return petValue(s,petOf(s),stat)+support+(s.slots?.wings?wingValue(s,s.slots.wings,stat):0);}

function petUpCost(s,id){const l=lvlOf(s,'pet',id);return {feed:1+Math.floor(l/4)};}
function wingUpCost(s,id){const l=lvlOf(s,'wing',id);return {feather:1+Math.floor(l/5),gold:30*(l+1)};}
function starCost(n){return {eggs:n+1};}

// ——— Çanta ———
let bagTab='all',bagSel=null;
function bagEntries(){
 const out=[];
 for(const k of weapons())out.push({t:'gear',k,r:k==='item_kilic'?1:0,n:weaponName(k),plus:state.upgrades[k]||0,art:objectArt(k),group:'gear'});
 for(const g of (state.gear||[]).slice().sort((a,b)=>gearPower(b)-gearPower(a)))out.push({t:'item',g,group:'gear'});
 for(const [k,[n]] of Object.entries(stoneMeta))if((state.stones||{})[k])out.push({t:'stone',k,n,count:state.stones[k],group:'stone'});
 for(const [k,[n,ic]] of Object.entries(matMeta))if(state[k])out.push({t:'mat',k,n,ic,count:state[k],group:'mat'});
 for(const item of EKONOMI.marketUrunleri)if(!matMeta[item.id]&&item.id!=='chests'&&state[item.id])out.push({t:'mat',k:item.id,n:item.name,ic:'ore',count:state[item.id],group:'mat'});
 if(state.chests)out.push({t:'chest',k:'chests',n:'Sandık',ic:'chest',count:state.chests,group:'chest'});
 return out;
}
function bagCell(e){
 if(e.t==='item')return gearCell(e.g);
 if(e.t==='gear')return '<span class="gxCell r'+e.r+'">'+e.art+'<i>T1</i>'+(e.plus?'<b>+'+e.plus+'</b>':'')+'</span>';
 if(e.t==='stone')return '<span class="gxCell r2"><span class="gxStone '+e.k+'"></span><b>'+e.count+'</b></span>';
 if(EKONOMI.marketUrunleri.some(v=>v.id===e.k))return '<span class="gxCell r0">'+marketShopIcon(EKONOMI.marketUrunleri.find(v=>v.id===e.k))+'<b>'+e.count+'</b></span>';
 return '<span class="gxCell r0">'+objectArt(e.k==='chests'?'chests':e.k)+'<b>'+e.count+'</b></span>';
}
function bagKey(e){return e.t==='item'?e.g.id:e.t+':'+e.k;}
function roomBag(){
 const all=bagEntries(),list=bagTab==='all'?all:all.filter(e=>e.group===bagTab);
 const sel=list.find(e=>bagKey(e)===bagSel)||list[0],tabs='<div class="gxTabs">'+bagTabs().map(([k,n,ic])=>tag(glyph(ic)+'<small>'+n+'</small>','bagTab','data-key="'+k+'" aria-pressed="'+(k===bagTab)+'"','gxTab'+(k===bagTab?' on':''))).join('')+'</div>';
 const cells=list.map(e=>tag(bagCell(e),'bagSel','data-key="'+bagKey(e)+'" aria-label="'+safeText(e.t==='item'?gearName(e.g):e.n)+'" aria-pressed="'+(sel&&bagKey(sel)===bagKey(e))+'"','gxItem'+(sel&&bagKey(sel)===bagKey(e)?' on':'')+(e.t==='item'&&state.worn?.[e.g.slot]===e.g.id?' worn':'')));
 const grid='<div class="gxBag">'+cells.join('')+Array(Math.max(0,24-cells.length)).fill('<span class="gxItem blank"></span>').join('')+'</div>';
 let detail='<div class="gxDetail empty">'+glyph('bag')+'</div>';
 if(sel){
  let art='',name='',sub='',line='',acts='';
  if(sel.t==='item'){const g=sel.g,stat=gearSlot[g.slot].stat,worn=state.worn?.[g.slot]===g.id,d=gearDelta(g);
   art=gearCell(g,'','big');name='<h3 class="gxName r'+g.rarity+'">'+gearName(g)+(g.plus?' +'+g.plus:'')+'</h3>';sub='T'+g.tier+' · '+rarities[g.rarity];
   line=glyph(stat==='atk'?'sword':'heart')+'<b>'+gearBonus(g,stat)+'</b>'+(!worn&&d?'<em class="'+(d>0?'up':'down')+'">'+(d>0?'▲':'▼')+Math.abs(d)+'</em>':'');
   acts=tag(worn?'Çıkar':'Kuşan',worn?'gearOff':'gearWear','data-id="'+g.id+'"','gxBtn')+tag('Demirci','forge','','gxBtn sub');
  }else if(sel.t==='gear'){art='<span class="gxCell big r'+sel.r+'">'+sel.art+'</span>';name='<h3 class="gxName r'+sel.r+'">'+sel.n+'</h3>';sub='T1 · '+rarities[sel.r];
   line=glyph('sword')+'<b>'+bonus(state,sel.k)+'</b>';
   acts=tag(state.equipped===sel.k?'Kuşanıldı':'Kuşan','bagPick','data-key="'+sel.k+'" '+(state.equipped===sel.k?'disabled':''),'gxBtn');
  }else if(sel.t==='stone'){art='<span class="gxCell big r2"><span class="gxStone '+sel.k+'"></span></span>';name='<h3 class="gxName r2">'+sel.n+'</h3>';sub=sel.count+' adet';
   line=glyph(stoneMeta[sel.k][1]==='atk'?'sword':'heart')+'<b>+'+stoneValue(sel.k,10)+'</b><span class="gxNext">T10 eşyada</span>';
   acts=tag('Ekipman','equip','','gxBtn');
  }else{art='<span class="gxCell big r0">'+objectArt(sel.k==='chests'?'chests':sel.k)+'</span>';name='<h3 class="gxName r0">'+sel.n+'</h3>';sub=sel.count+' adet';
   acts=sel.k==='chests'?tag('Aç','openChest','','gxBtn'):tag(sel.k==='feed'?'Petler':sel.k==='feather'?'Kanatlar':sel.k==='eggs'?'Petler':sel.k==='shards'?'Kalıntılar':'Demirci',sel.k==='feed'||sel.k==='eggs'?'pet':sel.k==='feather'?'wings':sel.k==='shards'?'relic':'forge','','gxBtn');
  }
  detail='<div class="gxDetail">'+art+'<div class="gxInfo">'+name+'<p>'+sub+'</p>'+(line?'<p class="gxLine">'+line+'</p>':'')+'</div><div class="gxActs">'+acts+'</div></div>';
 }
 return artVenueShell('bag','Çanta','<div class="gx gxWide">'+tabs+detail+grid+'</div>');
}
function bagTabs(){return [['all','Tümü','bag'],['gear','Ekipman','sword'],['stone','Taş','gem'],['mat','Malzeme','ore'],['chest','Sandık','chest']];}

// ——— Demirci ———
let forgeTab='Yükselt',forgeSel=null;  // sekme listesi demirci.js içinde
function mergeGroups(s){
 const map={};
 for(const g of s.gear||[]){if(s.worn?.[g.slot]===g.id||g.rarity>=rarities.length-1)continue;const k=g.slot+':'+g.rarity;(map[k]||=[]).push(g);}
 return Object.entries(map).filter(([,v])=>v.length>=3);
}
function doMerge(s,list){
 const three=list.slice().sort((a,b)=>b.tier-a.tier).slice(0,3),tier=three[0].tier,rarity=three[0].rarity+1,slot=three[0].slot;
 if(!developerFree(s)){for(const g of three)taslariIade(s,g);s.gear=s.gear.filter(g=>!three.includes(g));}s.gearSeq=(s.gearSeq||0)+1;
 const made={id:'g'+s.gearSeq,slot,tier,rarity,plus:Math.max(...three.map(g=>g.plus)),sockets:Array(raritySockets[rarity]).fill(null)};
 s.gear.push(made);return made;
}
function roomForge(){
 const gear=(state.gear||[]).filter(g=>state.worn?.[g.slot]!==g.id),sel=gear.find(g=>g.id===forgeSel)||null;
 const icons={'Yükselt':'hammer','Birleştir':'swap','Taş':'gem','Parçala':'sword'};
 const tabs='<div class="gxTabs">'+Object.keys(icons).map(n=>tag(glyph(icons[n])+'<small>'+n+'</small>','forgeTab','data-key="'+n+'" aria-pressed="'+(n===forgeTab)+'"','gxTab'+(n===forgeTab?' on':''))).join('')+'</div>';
 let body='',dock='';
 if(forgeTab==='Birleştir'){
  const groups=mergeGroups(state);
  body='<div class="fgRows">'+(groups.length?groups.map(([k,v])=>{const [slot,r]=k.split(':'),top=v.slice().sort((a,b)=>b.tier-a.tier).slice(0,3);
   return '<div class="fgRow">'+top.map(g=>gearCell(g)).join('')+'<span class="fgArrow">'+glyph('next')+'</span>'+'<span class="gxCell r'+(Number(r)+1)+'">'+gearIcon(slot,top[0].tier)+'<i>T'+top[0].tier+'</i></span>'+tag('Birleştir','forgeMerge','data-key="'+k+'"','gxBtn sub')+'</div>';}).join(''):'<p class="fgNone">'+glyph('info')+' Aynı yuvadan ve aynı nadirlikten üç eşya gerekir.</p>')+'</div>';
  dock=tag('Hepsini birleştir','forgeMergeAll',groups.length?'':'disabled','gxBtn');
 }else{
  const list=forgeTab==='Taş'?gear.filter(g=>g.sockets.length):gear;
  const cells=list.map(g=>tag(gearCell(g),'forgeSel','data-id="'+g.id+'" aria-label="'+gearName(g)+'" aria-pressed="'+(sel===g)+'"','gxItem'+(sel===g?' on':'')));
  const legacy=forgeTab==='Yükselt'?tag('<span class="gxCell r1">'+objectArt('item_kilic')+'<i>T1</i>'+((state.upgrades.item_kilic||0)?'<b>+'+state.upgrades.item_kilic+'</b>':'')+'</span>','forgeSel','data-id="legacy" aria-pressed="'+(forgeSel==='legacy')+'"','gxItem'+(forgeSel==='legacy'?' on':''))+'':'';
  body='<div class="gxBag">'+legacy+cells.join('')+Array(Math.max(0,18-cells.length)).fill('<span class="gxItem blank"></span>').join('')+'</div>';
  let panel='<div class="gxDetail empty">'+glyph('hammer')+'</div>';
  if(forgeSel==='legacy'&&forgeTab==='Yükselt'){
   const offer=upgradeOffer(state),lvl=state.upgrades.item_kilic||0;
   panel='<div class="gxDetail"><span class="gxCell big r1">'+objectArt('item_kilic')+'</span><div class="gxInfo"><h3 class="gxName r1">'+weaponName('item_kilic')+'</h3><p>T1 · Yeşil</p><p class="gxLine">'+glyph('sword')+'<b>'+bonus(state,'item_kilic')+'</b>'+(offer?'<span class="gxNext">+'+(lvl+1)+' → '+(bonus(state,'item_kilic')+2)+'</span>':'')+'</p></div><div class="gxActs">'+tag(offer?'Yükselt<small>'+glyph('coin')+offer.gold+(offer.ore?' '+glyph('ore')+offer.ore:'')+'</small>':'Azami','upgrade','data-level="'+lvl+'" '+(!canForge(state,offer)?'disabled':''),'gxBtn')+'</div></div>';
  }else if(sel){
   const stat=gearSlot[sel.slot].stat,cost=gearUpCost(sel),max=sel.plus>=GEAR_MAX_PLUS,st=state.stones||{},free=sel.sockets.includes(null);
   let acts='';
   if(forgeTab==='Yükselt')acts=tag('Güçlendir<small>'+(max?'MAX':glyph('coin')+cost.gold+(cost.ore?' '+glyph('ore')+cost.ore:''))+'</small>','gearUp','data-id="'+sel.id+'" '+(max||!afford(state,cost)?'disabled':''),'gxBtn');
   else if(forgeTab==='Taş')acts=(free?Object.keys(stoneMeta).map(k=>tag('<span class="gxStone '+k+'"></span><small>'+(st[k]||0)+'</small>','gearSocket','data-id="'+sel.id+'" data-stone="'+k+'" '+(st[k]?'':'disabled'),'gxBtn sub stone')).join(''):'')+(sel.sockets.some(Boolean)?tag('Taşı çıkar<small>'+glyph('coin')+'50</small>','forgePull','data-id="'+sel.id+'" '+(state.gold<50?'disabled':''),'gxBtn sub'):'');
   else acts=tag('Parçala<small>'+glyph('ore')+(sel.tier+sel.rarity)+' '+glyph('coin')+Math.floor(gearSellValue(sel)/2)+'</small>','forgeScrap','data-id="'+sel.id+'"','gxBtn');
   panel='<div class="gxDetail">'+gearCell(sel,'','big')+'<div class="gxInfo"><h3 class="gxName r'+sel.rarity+'">'+gearName(sel)+(sel.plus?' +'+sel.plus:'')+'</h3><p>T'+sel.tier+' · '+rarities[sel.rarity]+'</p><p class="gxLine">'+glyph(stat==='atk'?'sword':'heart')+'<b>'+gearBonus(sel,stat)+'</b>'+(forgeTab==='Yükselt'&&!max?'<span class="gxNext">+'+(sel.plus+1)+' → '+gearBase(sel,sel.plus+1)+'</span>':'')+'</p></div><div class="gxActs">'+acts+'</div></div>';
  }
  body=panel+body;
  if(forgeTab==='Parçala')dock=tag('Gri ve yeşilleri parçala','forgeScrapLow','','gxBtn sub');
 }
 return artVenueShell('forge','Demirci','<div class="gx gxWide">'+tabs+body+(dock?'<div class="gxDock">'+dock+'</div>':'')+'</div>');
}

// ——— Petler ———
let petTab='Seviye';
function roomPet(){
 const id=roomSelection.pet||'ak',owned=state.unlocks.includes(id),m=petMeta[id]||{r:0,stat:'hp'},lvl=lvlOf(state,'pet',id),star=starOf(state,id),active=state.slots.pet===id;
 const row=collections.pet.find(r=>r[0]===id)||collections.pet[0];
 const rail='<div class="gxRail">'+collections.pet.map(([v,n])=>tag('<span class="gxCell r'+(petMeta[v]?.r||0)+'">'+(ART['icon_pet_'+v]?'<img alt="" src="'+ART['icon_pet_'+v]+'">':glyph('paw'))+(state.unlocks.includes(v)?'<b>'+lvlOf(state,'pet',v)+'</b>':'')+'</span><small>'+n+'</small>','roomSelect','data-group="pet" data-key="'+v+'" aria-pressed="'+(v===id)+'"','gxSlot'+(v===id?' on':''))).join('')+'</div>';
 const stars='<div class="ptStars">'+Array.from({length:MAX_STAR},(_,i)=>'<span class="'+(i<star?'lit':'')+'">'+glyph('star')+'</span>').join('')+'</div>';
 const tabs='<div class="gxTabs">'+[['Seviye','paw'],['Yıldız','star'],['Yetenek','book']].map(([n,ic])=>tag(glyph(ic)+'<small>'+n+'</small>','petTab','data-key="'+n+'" aria-pressed="'+(n===petTab)+'"','gxTab'+(n===petTab?' on':''))).join('')+'</div>';
 let panel='';
 if(!owned){
  panel='<div class="gxActs">'+tag('Aç<small>'+Object.entries(row[3]).map(([k,v])=>glyph(roomIcons[k]||'star')+v).join(' ')+'</small>','collectItem','data-key="pet" data-id="'+id+'" '+(afford(state,row[3])?'':'disabled'),'gxBtn')+'</div>';
 }else if(petTab==='Seviye'){
  const cost=petUpCost(state,id),max=lvl>=MAX_LVL;
  panel='<p class="gxLine">'+glyph(m.stat==='atk'?'sword':'heart')+'<b>'+petValue(state,id,m.stat)+'</b>'+(max?'':'<span class="gxNext">Sv.'+(lvl+1)+' → '+Math.round((m.stat==='hp'?(lvl+1)*2:Math.floor((lvl+1)/2))*(1+star*.2))+'</span>')+'</p><div class="gxActs">'+tag(active?'Yanında':'Yanına al','collectItem','data-key="pet" data-id="'+id+'" '+(active?'disabled':''),'gxBtn')+tag('Eğit<small>'+(max?'MAX':glyph('leaf')+cost.feed)+'</small>','trainPet','data-id="'+id+'" '+(max||!afford(state,cost)?'disabled':''),'gxBtn sub')+'</div>';
 }else if(petTab==='Yıldız'){
  const cost=starCost(star),max=star>=MAX_STAR;
  panel='<p class="gxLine">'+glyph('star')+'<b>'+star+' / '+MAX_STAR+'</b><span class="gxNext">Her yıldız +%20</span></p><div class="gxActs">'+tag('Yıldız<small>'+(max?'MAX':glyph('paw')+cost.eggs)+'</small>','petStar','data-id="'+id+'" '+(max||!afford(state,cost)?'disabled':''),'gxBtn')+tag('Yumurta al','market','','gxBtn sub')+'</div>';
 }else{
  panel='<div class="ptSkills">'+[0,1,2].map(i=>{const need=[1,3,5][i],open=star>=need;return '<span class="ptSkill'+(open?' open':'')+'">'+glyph(open?['heart','sword','aura'][i]:'lock')+'<small>'+(open?['İyileştirme','Keskinlik','Koruma'][i]:need+'★')+'</small></span>';}).join('')+'</div>';
 }
 return artVenueShell('pet','Petler','<div class="gx gxSplit">'+rail+'<div class="gxMid">'+roomCanvas('pet')+stars+'</div><div class="gxSide">'+tabs+'<div class="gxDetail col"><div class="gxInfo"><h3 class="gxName r'+m.r+'">'+row[1]+(lvl?' Sv.'+lvl:'')+'</h3><p>'+rarities[m.r]+' · '+safeText(row[2])+'</p></div>'+panel+'</div></div></div>');
}

// ——— Kanatlar ———
function roomWings(){
 const id=roomSelection.wings||'turna',owned=state.unlocks.includes(id),m=wingMeta[id]||{r:0,stat:'hp'},lvl=lvlOf(state,'wing',id),on=state.slots.wings===id;
 const row=collections.wings.find(r=>r[0]===id)||collections.wings[0],cost=wingUpCost(state,id),max=lvl>=MAX_LVL,phase=Math.min(4,Math.floor(lvl/5));
 const rail='<div class="gxRail">'+collections.wings.map(([v,n])=>tag('<span class="gxCell r'+(wingMeta[v]?.r||0)+'">'+(ART['icon_wing_'+v]?'<img alt="" src="'+ART['icon_wing_'+v]+'">':glyph('wing'))+(state.unlocks.includes(v)?'<b>+'+lvlOf(state,'wing',v)+'</b>':'')+'</span><small>'+n+'</small>','roomSelect','data-group="wings" data-key="'+v+'" aria-pressed="'+(v===id)+'"','gxSlot'+(v===id?' on':''))).join('')+'</div>';
 const track='<div class="wgTrack" aria-label="Evre '+(phase+1)+' / 5">'+Array.from({length:5},(_,i)=>'<span class="'+(i<=phase?'lit':'')+'">'+glyph('wing')+'</span>').join('')+'</div>';
 let acts='';
 if(!owned)acts=tag('Aç<small>'+Object.entries(row[3]).map(([k,v])=>glyph(roomIcons[k]||'star')+v).join(' ')+'</small>','collectItem','data-key="wings" data-id="'+id+'" '+(afford(state,row[3])?'':'disabled'),'gxBtn');
 else acts=tag(on?'Çıkar':'Kuşan',on?'removeSlot':'collectItem','data-key="wings" data-id="'+id+'"','gxBtn')+tag('Güçlendir<small>'+(max?'MAX':glyph('wing')+cost.feather+' '+glyph('coin')+cost.gold)+'</small>','wingUp','data-id="'+id+'" '+(max||!afford(state,cost)?'disabled':''),'gxBtn sub');
 const line=owned?'<p class="gxLine">'+glyph(m.stat==='atk'?'sword':'heart')+'<b>'+(wingValue(state,id,m.stat)+(on?0:0))+'</b>'+(max?'':'<span class="gxNext">+'+(lvl+1)+' → '+(m.stat==='hp'?(lvl+1)*3:Math.floor((lvl+1)*.6))+'</span>')+'</p>':'';
 return artVenueShell('wings','Kanatlar','<div class="gx gxSplit">'+rail+'<div class="gxMid">'+roomCanvas('hero')+track+'</div><div class="gxSide"><div class="gxDetail col"><div class="gxInfo"><h3 class="gxName r'+m.r+'">'+row[1]+(lvl?' +'+lvl:'')+'</h3><p>'+rarities[m.r]+' · '+safeText(row[2])+'</p></div>'+line+'<div class="gxActs">'+acts+'</div></div></div></div>');
}

// ——— Market ———
const chestLine=[
 ['t1','Yolcu Sandığı',{gold:250},1,1,0],['t2','Avcı Sandığı',{gold:900},1,2.5,0],
 ['t3','Muhafız Sandığı',{gems:5},2,6,0],['t4','Şövalye Sandığı',{gems:15},2,18,1],
 ['t5','Ejder Sandığı',{gems:40},3,60,2],['uber','UBER Sandık',{gems:120},5,400,5]
];
function chestRarity(luck){let r=0;for(let i=rarities.length-1;i>0;i--)if(1000/luck<rarityOdds[i]*1.6){r=i;break;}return r;}
function roomMarket(){
 const tabs=['Sandıklar','Mağaza','Arena','Lonca'];
 const t=tabs.includes(marketTab)?marketTab:'Sandıklar';
 const head='<div class="gxTabs">'+tabs.map((n,i)=>tag(glyph(['chest','bag','swap','sword','flag'][i])+'<small>'+n+'</small>','marketTab','data-key="'+n+'" aria-pressed="'+(n===t)+'"','gxTab'+(n===t?' on':''))).join('')+'</div>';
 if(t==='Sandıklar'){
  const tier=campaignMastery(state)+1;
  const cards=chestLine.map(([k,n,cost,count,luck,plus],i)=>'<article class="mkChest c'+i+'"><span class="mkLid">'+(ART['icon_chest_'+k]?'<img alt="" src="'+ART['icon_chest_'+k]+'">':objectArt('chests'))+'</span><h3 class="gxName r'+chestRarity(luck)+'">'+n+'</h3><p class="gxLine">'+glyph('sword')+'<b>'+count+'</b><span class="gxNext">T'+Math.max(1,Math.min(GEAR_MAX_TIER,tier+Math.floor(i*1.5)))+'</span>'+(plus?'<span class="gxNext">+'+plus+'</span>':'')+'</p><p class="mkOdds">'+rarities.slice(Math.max(0,chestRarity(luck)-1)).slice(0,3).map((r,j)=>'<span class="r'+(Math.max(0,chestRarity(luck)-1)+j)+'">'+r+'</span>').join('')+'</p>'+tag('Aç<small>'+Object.entries(cost).map(([c,v])=>glyph(roomIcons[c]||'coin')+v).join(' ')+'</small>','openGearChest','data-key="'+k+'" '+(afford(state,cost)?'':'disabled'),'gxBtn')+'</article>').join('');
  return artVenueShell('market','Market','<div class="gx gxWide">'+head+'<div class="mkRow">'+cards+'</div></div>');
 }
 const shelves={'Mağaza':['ore','ration','chest'],'Arena':['arena'],'Lonca':['guild']}[t];
 const sel=shelves.includes(roomSelection.goods)?roomSelection.goods:shelves[0],g=goods[sel];
 const cards=shelves.map(k=>tag('<span class="gxCell big r'+(k==='gems'?2:0)+'">'+objectArt(goodsVisual[k])+'</span><b>'+goods[k].name+'</b><span class="gxLine">'+Object.entries(goods[k].cost).map(([c,v])=>glyph(roomIcons[c]||'coin')+'<b>'+v+'</b>').join('')+'</span>','roomSelect','data-group="goods" data-key="'+k+'" aria-pressed="'+(k===sel)+'"','mkGood'+(k===sel?' on':''))).join('');
 return artVenueShell('market','Market','<div class="gx gxWide">'+head+'<div class="mkRow">'+cards+'</div><div class="gxDock">'+tag('Al','buy','data-key="'+sel+'" '+(afford(state,g.cost)?'':'disabled'),'gxBtn')+(state.chests?tag('Sandık aç · '+state.chests,'openChest','','gxBtn sub'):'')+'</div></div>');
}

// ——— Eylemler ———
async function roomsAction(action,el){
 const d=el.dataset||{};
 if(action==='bagTab'){bagTab=d.key;bagSel=null;render();return true;}
 if(action==='bagSel'){bagSel=d.key;render();return true;}
 if(action==='forgeTab'){forgeTab=d.key;forgeSel=null;render();return true;}
 if(action==='forgeSel'){forgeSel=d.id;render();return true;}
 if(action==='petTab'){petTab=d.key;render();return true;}
 let note='';
 const jobs={
  forgeMerge:s=>{const [slot,r]=d.key.split(':'),list=(s.gear||[]).filter(g=>g.slot===slot&&g.rarity===Number(r)&&s.worn?.[g.slot]!==g.id);if(list.length<3||Number(r)>=rarities.length-1)return false;const made=doMerge(s,list);note=rarities[made.rarity]+' '+gearSlot[made.slot].name;},
  forgeMergeAll:s=>{let n=0;for(let pass=0;pass<12;pass++){const groups=mergeGroups(s);if(!groups.length)break;for(const [,list] of groups){if(list.length>=3){doMerge(s,list);n++;}}}if(!n)return false;note=n+' birleştirme';},
  forgePull:s=>{const g=(s.gear||[]).find(x=>x.id===d.id),i=g?.sockets.findIndex(Boolean);if(!g||i<0||!spend(s,{gold:50}))return false;s.stones||={};s.stones[g.sockets[i]]=(s.stones[g.sockets[i]]||0)+1;g.sockets[i]=null;},
  forgeScrap:s=>{const g=(s.gear||[]).find(x=>x.id===d.id);if(!g||s.worn?.[g.slot]===g.id)return false;give(s,{ore:g.tier+g.rarity,gold:Math.floor(gearSellValue(g)/2)});for(const k of g.sockets)if(k){s.stones||={};s.stones[k]=(s.stones[k]||0)+1;}s.gear=s.gear.filter(x=>x!==g);note='Parçalandı';},
  forgeScrapLow:s=>{const low=(s.gear||[]).filter(g=>g.rarity<=1&&s.worn?.[g.slot]!==g.id);if(!low.length)return false;for(const g of low){give(s,ayristirmaOdulu(g));taslariIade(s,g);}s.gear=s.gear.filter(g=>!low.includes(g));note=low.length+' eşya parçalandı';},
  petStar:s=>{const star=starOf(s,d.id);if(star>=MAX_STAR||!spend(s,starCost(star)))return false;s.petStar||={};s.petStar[d.id]=star+1;note=(star+1)+' yıldız';},
  wingUp:s=>{const lvl=lvlOf(s,'wing',d.id);if(lvl>=MAX_LVL||!spend(s,wingUpCost(s,d.id)))return false;s.wingLevel||={};s.wingLevel[d.id]=lvl+1;note='+'+(lvl+1);},
  openGearChest:s=>{const row=chestLine.find(c=>c[0]===d.key);if(!row||!spend(s,row[2]))return false;
   const tier=campaignMastery(s)+1+Math.floor(chestLine.indexOf(row)*1.5);
   for(let i=0;i<row[3];i++){const g=rollGear(s,tier,row[4]);g.plus=row[5];}
   give(s,{eggs:row[0]==='uber'?3:1,feather:row[0]==='uber'?3:1});note=row[3]+' eşya';}
 };
 if(!jobs[action])return false;
 const next=await transact(s=>{if(s.fight)return false;return jobs[action](s);});
 if(next.fight){reflect(next);return true;}
 state=next;if(['forgeScrap','forgeScrapLow','forgeMerge','forgeMergeAll'].includes(action))forgeSel=null;
 tell();render();if(note)toast(note);return true;
}

// pet ve kanat kendi ekranlarını kullanır; diğer koleksiyonlar eski kalıpta kalır.
function renderArtVenue(key){
 if(Object.hasOwn(savasViews,key))return referenceCombat(key);
 if(Object.hasOwn(alanTitles,key))return referenceAlan(key);
 if(key==='gold'||key==='gem')return currencyShop(key);
 if(key==='market')return referenceMarket();
 if(key==='map')return referenceCampaign();
 if(key==='mail')return referenceMail();
 if(key==='notices')return referenceNotices();
 if(key==='settings')return referenceSettings();
 if(key==='casino'&&!state.gameRound&&!casinoSelection)return referenceChance();
 const special={pet:roomPet,wings:roomWings};
 if(special[key])return special[key]();
 if(collections[key])return roomCollect(key);
 const pages={forge:roomForge,equip:roomEquipment,market:roomMarket,bag:roomBag,relic:roomRelic,map:roomCampaign,av:roomHunt,boss:roomBoss,arena:roomArena,guild:roomGuild,events:roomEvents,rank:roomRank,profile:roomProfile,mail:roomMail,notices:roomNotices,casino:casinoPage};
 return pages[key]?pages[key]():roomUtility(key);
}
