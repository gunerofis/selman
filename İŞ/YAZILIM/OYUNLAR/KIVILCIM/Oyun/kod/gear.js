// EKİPMAN SİSTEMİ — kademe T1–T20, 8 nadirlik, +0…+20 güçlendirme, taş yuvaları.
// Yeni yuva eklemek için gearSlots tablosuna satır eklemek yeterli.
const gearSlots=[
 ['silah','Silah','atk','rw_sword',3],['yuzuk','Yüzük','atk','rw_ring',1.5],['run','Rün','atk','rw_rune',1.5],
 ['kask','Kask','hp','rw_helm',8],['zirh','Zırh','hp','rw_armor',12],['cizme','Çizme','hp','rw_boot',6]
];
const gearSlot=Object.fromEntries(gearSlots.map(r=>[r[0],{key:r[0],name:r[1],stat:r[2],icon:r[3],base:r[4]}]));
const rarities=['Gri','Yeşil','Mavi','Mor','Turuncu','Altın','Siyah','Işıldayan'];
const rarityMult=[1,1.3,1.7,2.2,2.9,3.8,5,6.6],raritySockets=[0,0,1,1,2,2,3,4];
const rarityOdds=[1000,500,240,110,50,20,6,1]; // binde; nadirlik n için eşik
const tierNames=['Yolcu','Köy','Demir','Çelik','Avcı','Muhafız','Gümüş','Şövalye','Kızıl','Gölge','Tunç','Fırtına','Altın','Ejder','Kadim','Yıldız','Kül','Hiçlik','Efsane','Kıvılcım'];
const stones={yakut:['Yakut','atk'],zumrut:['Zümrüt','hp']};
const GEAR_MAX_PLUS=20,GEAR_MAX_TIER=20;
function gearRand(max){const b=new Uint32Array(1);crypto.getRandomValues(b);return Math.floor(b[0]/4294967296*max);}
const gearNouns={silah:'Kılıcı',yuzuk:'Yüzüğü',run:'Rün Taşı',kask:'Kaskı',zirh:'Zırhı',cizme:'Çizmesi',eldiven:'Eldiveni',pelerin:'Pelerini',kolye:'Kolyesi'};
function gearName(g){return tierNames[g.tier-1]+' '+(gearNouns[g.slot]||gearSlot[g.slot].name);}
function stoneValue(kind,tier){return stones[kind][1]==='atk'?1+Math.floor(tier/4):4+tier;}
function gearBase(g,plus=g.plus){return Math.max(1,Math.round(gearSlot[g.slot].base*(1+(g.tier-1)*.4)*rarityMult[g.rarity]*(1+plus*.08)));}
function gearBonus(g,stat){
 let n=gearSlot[g.slot].stat===stat?gearBase(g):0;
 for(const k of g.sockets||[])if(k&&stones[k][1]===stat)n+=stoneValue(k,g.tier);
 return n;
}
function wornGear(s,slot){const id=s.worn?.[slot];return id?(s.gear||[]).find(g=>g.id===id)||null:null;}
function gearTotal(s,stat){let n=0;for(const [slot] of gearSlots){const g=wornGear(s,slot);if(g)n+=gearBonus(g,stat);}return n;}
function gearPower(g){return gearBonus(g,'hp')+10*gearBonus(g,'atk');}
function rollGear(s,tier,luck=1,slot){
 const roll=gearRand(1000)/luck;let rarity=0;
 for(let r=rarities.length-1;r>0;r--)if(roll<rarityOdds[r]){rarity=r;break;}
 s.gear||=[];s.gearSeq=(s.gearSeq||0)+1;
 const g={id:'g'+s.gearSeq,slot:slot||gearSlots[gearRand(gearSlots.length)][0],tier:Math.max(1,Math.min(GEAR_MAX_TIER,Math.round(tier))),rarity,plus:0,sockets:Array(raritySockets[rarity]).fill(null)};
 s.gear.push(g);return g;
}
function gearUpCost(g){return {gold:15*g.tier*(g.plus+1),ore:g.plus>=5?g.plus-4:0};}
function gearSellValue(g){return 5*g.tier*(g.rarity+1)+3*g.plus*g.tier;}
// Ganimet: ilk geçiş ve boss zaferi eşya verir; tam av ve boss bazen taş verir.
function gearDrops(s,f,receipt){
 const e=encounters[f.index],kind=e.kind,win=f.end==='win',region=e.region||0;
 if(!win)return;
 const bossLike=kind==='regional'||f.index===BRIDGE||['daily','world','guildBoss'].includes(kind);
 let got=null;
 if((!kind||kind==='campaign')&&f.index!==BRIDGE&&!isHunt(f.index)){if(receipt.first)got=e.firstClearBonus?gearGrant(s,'silah',2,1):rollGear(s,region+1,e.final||f.index===2?3:1);else if(gearRand(100)<25)got=rollGear(s,region+1,1);}
 else if(bossLike)got=rollGear(s,(kind==='regional'||f.index===BRIDGE?region+1+Math.floor((e.rank||0)*.75):campaignMastery(s)+1),2.5);
 else if(isHunt(f.index)&&receipt.kills===e.enemies.length&&gearRand(100)<40)got=rollGear(s,region+1,1);
 else if(kind==='arena'&&gearRand(100)<30)got=rollGear(s,campaignMastery(s)+1,1.5);
 if(got)receipt.gear=got.id;
 if(gearRand(100)<22){const k=gearRand(2)?'feather':'eggs';give(s,{[k]:1});receipt[k]=1;}
 if((bossLike&&gearRand(100)<35)||(isHunt(f.index)&&receipt.kills===e.enemies.length&&gearRand(100)<15)){
  const kind2=gearRand(2)?'yakut':'zumrut';s.stones||={};s.stones[kind2]=(s.stones[kind2]||0)+1;receipt.stone=kind2;
 }
}

// ——— Görünüm ———
let gearPick=null,gearFilter=null;
function gearIconSrc(slot,tier){const step=tier?Math.min(5,Math.max(1,Math.ceil(tier/4))):0;return (step&&ART['icon_gear_'+slot+'_'+step])||ART['icon_gear_'+slot]||ART['icon_'+gearSlot[slot].icon]||'';}
function gearIcon(slot,tier){const step=tier?Math.min(5,Math.max(1,Math.ceil(tier/4))):0;const src=(step&&ART['icon_gear_'+slot+'_'+step])||ART['icon_gear_'+slot]||ART['icon_'+gearSlot[slot].icon];return src?'<img alt="" src="'+src+'">':'';}
// Tür düğmelerinde tek kaynak; Demirci ve Ekipman aynı simgeyi kullanır.
function gearSlotIcon(slot){return '<span class="gearTypeIcon" aria-hidden="true">'+gearIcon(slot)+'</span>';}
function gearCell(g,extra='',cls=''){
 return '<span class="gxCell r'+g.rarity+' '+cls+'" '+extra+'>'+gearIcon(g.slot,g.tier)+'<i>T'+g.tier+'</i>'+(g.plus?'<b>+'+g.plus+'</b>':'')+(g.sockets.length?'<u>'+g.sockets.map(k=>'<s class="'+(k||'')+'"></s>').join('')+'</u>':'')+'</span>';
}
function gearDropHtml(r){
 const g=r.gear&&(state.gear||[]).find(x=>x.id===r.gear);
 if(!g&&!r.stone)return '';
 return '<div class="gxDrop">'+(g?gearCell(g)+'<span class="gxName r'+g.rarity+'">'+gearName(g)+'</span>':'')+(r.stone?'<span class="gxStone '+r.stone+'" title="'+stones[r.stone][0]+'"></span>':'')+'</div>';
}
function gearDelta(g){
 const stat=gearSlot[g.slot].stat,cur=g.slot==='silah'&&!wornGear(state,'silah')?bonus(state,state.equipped):(wornGear(state,g.slot)?gearBonus(wornGear(state,g.slot),stat):0);
 return gearBonus(g,stat)-cur;
}

function referenceGearArt(slot,tier=1){
 const step=Math.min(4,Math.floor((tier-1)/5));
 const positions={silah:[[839,333],[958,333],[1072,333],[1190,333]],zirh:[[839,440],[955,440],[1072,440],[1072,537]],kask:[[1307,439],[1538,439],[1424,537],[1538,537]],yuzuk:[[839,537],[1423,537],[1190,638],[1538,638]],run:[[1424,638],[955,638],[839,638],[1307,537]],cizme:[[839,738],[955,738],[1072,738],[1072,738]]};
 const [x,y]=(positions[slot]||positions.silah)[step];
 return refCrop('ekipman_esya_cizimleri',x,y,85,76,'refGearArt');
}
function referenceGearCell(g,legacy=false){return '<span class="refItemArt">'+gearIcon(g.slot,g.tier)+'</span><i>T'+g.tier+'</i>'+(g.plus?'<b>+'+g.plus+'</b>':'');}
function roomEquipment(){
 const gear=state.gear||[],legacy=weapons();
 const pick=gear.find(g=>g.id===gearPick)||(!legacy.length?(wornGear(state,'silah')||gear[0]||null):null);
 const k=legacy.includes(chosenWeapon)?chosenWeapon:state.equipped;
 const chosen=pick||{slot:'silah',tier:1,rarity:k==='item_kilic'?1:0,plus:state.upgrades[k]||0};
 const worn=pick?state.worn?.[pick.slot]===pick.id:state.equipped===k&&!wornGear(state,'silah');
 let body='';
 for(let i=0;i<gearSlots.length;i++){
  const [slot,name]=gearSlots[i],g=wornGear(state,slot),old=slot==='silah'&&!g;
  const label=g?gearName(g):old?weaponName(state.equipped):name+' · Boş';
  body+=refButton(label,'gearSlot',i<3?59:644,269+(i%3)*143,111,112,'data-slot="'+slot+'" aria-pressed="'+(gearFilter===slot)+'"','<span class="refWorn refSlotType">'+gearSlotIcon(slot)+(g||old?'<i>T'+(g?.tier||1)+'</i>':'')+'</span>');
 }
 body+=refValue(profileNumber(healthOf(state)+10*attack(state)),226,846,132,49,'refEquipStat')+refValue(profileNumber(attack(state)),444,846,80,49,'refEquipStat')+refValue(profileNumber(healthOf(state)),580,846,110,49,'refEquipStat');
 body+='<div class="refSelected r'+chosen.rarity+'" '+refAt(829,99,107,107)+'>'+referenceGearCell(chosen)+'</div>'
  +refValue(pick?gearName(pick)+(pick.plus?' +'+pick.plus:''):weaponName(k),951,91,235,43,'refGearName r'+chosen.rarity)
  +refValue('T'+chosen.tier+' · '+rarities[chosen.rarity],951,134,235,30,'refGearMeta')
  +'<div class="refSelectedStat" '+refAt(953,173,220,34)+'>'+glyph(gearSlot[chosen.slot].stat==='atk'?'sword':'heart')+profileNumber(pick?gearBonus(pick,gearSlot[pick.slot].stat):bonus(state,k))+'</div>';
 const wearAction=pick?(worn?'gearOff':'gearWear'):'wear';
 body+=refButton(worn?(pick?'Çıkar':'Kuşanıldı'):'Kuşan',wearAction,1194,128,207,61,(pick?'data-id="'+pick.id+'"':worn?'disabled':'')+' aria-pressed="'+worn+'"',worn?'<span class="refActionLabel">'+(pick?'Çıkar':'Kuşanıldı')+'</span>':'')
  +refButton('Demirci',pick?'gearManage':'forge',1426,128,206,61,pick?'data-id="'+pick.id+'"':'');
 const cats=[['all','Tümü'],['silah','Silah'],['armor','Zırh'],['jewel','Takı']];
 const current=gearFilter||'all';
 body+=cats.map(([id,name],i)=>refButton(name,'gearCategory',810+i*211,248,211,54,'data-key="'+id+'" aria-pressed="'+(current===id)+'"',((i===0&&current!=='all')||(i>0&&current===id))?'<span class="refCategoryState '+(current===id?'selected':'')+'">'+(i?glyph(['','sword','shield','ring'][i]):'')+name+'</span>':'')).join('');
 const included=g=>!gearFilter||gearFilter==='all'||g.slot===gearFilter||(gearFilter==='armor'&&['kask','zirh','cizme'].includes(g.slot))||(gearFilter==='jewel'&&['yuzuk','run'].includes(g.slot));
 const cells=[];
 if(!gearFilter||gearFilter==='all'||gearFilter==='silah')for(const id of legacy){const g={slot:'silah',tier:1,rarity:id==='item_kilic'?1:0,plus:state.upgrades[id]||0};cells.push(tag(referenceGearCell(g),'pick','data-key="'+id+'" aria-label="'+safeText(weaponName(id))+'" aria-pressed="'+(!pick&&k===id)+'"','refGearCell r'+g.rarity+(!pick&&k===id?' selected':'')+(state.equipped===id&&!wornGear(state,'silah')?' worn':'')));}
 for(const g of gear.filter(included).sort((a,b)=>gearPower(b)-gearPower(a)))cells.push(tag(referenceGearCell(g),'gearSelect','data-id="'+g.id+'" aria-label="'+safeText(gearName(g))+'" aria-pressed="'+(pick?.id===g.id)+'"','refGearCell r'+g.rarity+(pick?.id===g.id?' selected':'')+(state.worn?.[g.slot]===g.id?' worn':'')));
 const blanks=Math.max(0,35-cells.length);
 body+='<div class="refGearGrid" '+refAt(835,327,794,497)+' aria-label="Eşyalar">'+cells.join('')+Array(blanks).fill('<span class="refGearCell blank" aria-hidden="true">'+refCrop('ekipman_kullanici_referansi',1195,744,80,70)+'</span>').join('')+'</div>';
 // Oyunda sabit kapasite sınırı yok; referanstaki 60 gerçek değer olarak kullanılmaz.
 body+=refValue(profileNumber(gear.length+legacy.length)+' eşya',1200,840,128,44,'refCapacity');
 if(equipFrom==='result'||equipFrom==='map')body+=refButton('Kuşan ve devam','wearGo',1428,197,202,28,'','<span class="refContinue">Kuşan ve devam</span>');
 return refScreen('equip',body);
}
async function gearAction(action,el){
 if(action==='pick'){gearPick=null;return false;}
 if(!action.startsWith('gear'))return false;
 if(action==='gearCategory'){gearFilter=el.dataset.key==='all'?null:el.dataset.key;render();return true;}
 if(action==='gearManage'){
  const g=(state.gear||[]).find(v=>v.id===el.dataset.id);if(!g)return true;
  const cost=gearUpCost(g),max=g.plus>=GEAR_MAX_PLUS;
  const controls=tag('Güçlendir '+(max?'MAX':profileNumber(cost.gold)+' altın'+(cost.ore?' · '+cost.ore+' cevher':'')),'gearUp','data-id="'+g.id+'" '+(max||!afford(state,cost)?'disabled':''),'gxBtn');
  const sockets=g.sockets.includes(null)?Object.keys(stones).map(k=>tag(stones[k][0]+' tak · '+(state.stones?.[k]||0),'gearSocket','data-id="'+g.id+'" data-stone="'+k+'" '+(developerFree(state)||state.stones?.[k]?'':'disabled'),'gxBtn sub')).join(''):'';
  const sell=state.worn?.[g.slot]===g.id?'':tag('Sat · '+gearSellValue(g)+' altın','gearSell','data-id="'+g.id+'"','gxBtn sub');
  openModal(gearName(g),'<div class="refManage">'+controls+sockets+sell+tag('Demirciye git','forge','','gxBtn sub')+'</div>');return true;
 }
 if(['gearUp','gearSocket','gearSell'].includes(action)&&modal.open)modal.close();
 const d=el.dataset||{};
 if(action==='gearSelect'){gearPick=d.id;render();return true;}
 if(action==='gearSlot'){gearFilter=gearFilter===d.slot?null:d.slot;const g=wornGear(state,d.slot);if(gearFilter&&g)gearPick=g.id;else if(gearFilter==='silah'){gearPick=null;chosenWeapon=state.equipped;}render();return true;}
 let note='';
 const next=await transact(s=>{
  if(s.fight)return false;
  const g=(s.gear||[]).find(x=>x.id===d.id);if(!g)return false;
  s.worn||={};
  if(action==='gearWear'){s.worn[g.slot]=g.id;return;}
  if(action==='gearOff'){if(s.worn[g.slot]!==g.id)return false;delete s.worn[g.slot];return;}
  if(action==='gearUp'){const cost=gearUpCost(g);if(g.plus>=GEAR_MAX_PLUS||!spend(s,cost))return false;
   if(Math.random()*100<gearUpChance(g)){g.plus++;note=gearName(g)+' +'+g.plus;}else note='Yükseltme tutmadı';return;}
  if(action==='gearSocket'){const i=g.sockets.indexOf(null),k=d.stone;if(i<0||!stones[k]||(!developerFree(s)&&!(s.stones?.[k]>0)))return false;if(!developerFree(s))s.stones[k]--;g.sockets[i]=k;return;}
  if(action==='gearSell'){if(s.worn[g.slot]===g.id)return false;s.gold+=gearSellValue(g);taslariIade(s,g);s.gear=s.gear.filter(x=>x!==g);note='+'+gearSellValue(g)+' altın';return;}
  return false;
 });
 if(next.fight){reflect(next);return true;}
 state=next;if(action==='gearSell')gearPick=null;tell();render();if(note)toast(note);
 return true;
}

// Eksik devir bağlantıları: mevcut ekipman şemasını kullanır.
function gearGrant(s,slot,tier,rarity,plus=0){
 s.gear||=[];s.gearSeq=(s.gearSeq||0)+1;
 const item={id:'g'+s.gearSeq,slot,tier,rarity,plus,sockets:Array(raritySockets[rarity]).fill(null)};
 s.gear.push(item);return item;
}
function baslangicEkipmani(){
 const s={gear:[],worn:{},gearSeq:0};
 for(const [slot] of gearSlots){const item=gearGrant(s,slot,EKONOMI.baslangic.tier,EKONOMI.baslangic.rarity);s.worn[slot]=item.id;}
 return s;
}
