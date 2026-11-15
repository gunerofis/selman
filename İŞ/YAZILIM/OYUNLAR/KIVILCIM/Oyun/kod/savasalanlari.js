// Av, Sefer, Boss, Arena ve Demirci: kullanıcı referansları ve mevcut kayıt.
let savasHedef=0,savasForgeOrder=false;
const savasViews={av:['Av','av'],map:['Sefer','sefer2'],boss:['Boss','boss2'],arena:['Arena','arena2'],forge:['Demirci','demirci2']};
function savasScreen(key,body){
 const xs=key==='forge'?[[1244,70],[1366,68],[1480,64],[1590,66]]:key==='map'?[[1035,78],[1210,77],[1381,67],[1536,103]]:[[1090,64],[1250,68],[1416,62],[1545,96]];
 const wallet=xs.map(([x,w],i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],x,13,w,52,'','<span class="refWalletValue">'+profileNumber([state.gold,state.gems,state.crystals,energyNow(state)][i])+(i===3&&key!=='forge'?'/'+energyCap:'')+'</span>')).join('');
 return '<section class="refViewport" aria-label="'+savasViews[key][0]+'"><div class="refScreen refAlan refCombat combat-'+key+'">'+currencyPlate(savasViews[key][1]+'_taban')+refButton('Geri','back',18,7,85,78)+wallet+body+'</div></section>';
}
function savasText(t,x,y,w,h,cls=''){return refValue(t,x,y,w,h,'savasText '+cls);}
function savasButton(t,a,x,y,w,h,data='',cls=''){return refButton(t,a,x,y,w,h,data,'<span class="savasButton '+cls+'">'+safeText(t)+'</span>');}
function savasEnemyImage(e){const src=ART[foeKey(e.id)];return src?'<img alt="" src="'+src+'">':glyph('shield');}
function savasRegionList(current,action,x,y,w,h,count){
 const first=Math.max(0,Math.min(current,regions.length-count));
 let html='';for(let j=0;j<count;j++){const r=first+j;html+=refButton(regions[r][0],action,x,y+j*h,w,h-10,'data-i="'+r+'" aria-pressed="'+(r===current)+'"','<span class="savasRegion '+(r===current?'on':'')+'"><b>Bölüm '+(r+1)+'</b><span>'+safeText(regions[r][0])+'</span>'+(!allowed((action==='huntRegion'?huntingGrounds[r]:referenceRouteNodes(r)[0]),state)?glyph('lock'):'')+'</span>');}
 return html;
}
function savasRegionArrows(r,action,x,y,w){return savasButton('‹',action,x,y,38,36,'data-i="'+(r-1)+'" '+(r===0?'disabled':''),'small')+savasText((r+1)+' / '+regions.length,x+39,y,w-78,36,'small')+savasButton('›',action,x+w-38,y,38,36,'data-i="'+(r+1)+'" '+(r===regions.length-1?'disabled':''),'small');}
function savasHunt(){
 const r=selectedHuntRegion,idx=huntingGrounds[r],enc=encounters[idx],open=allowed(idx,state),en=enc.enemies[Math.min(savasHedef,enc.enemies.length-1)],book=dayBook(state),left=hakKalan(state,'hunt'),blocked=!!girisNedeni(state,idx);
 let body=savasRegionList(r,'huntRegion',33,236,380,128,4)+savasRegionArrows(r,'huntRegion',51,743,348);
 body+=alanBox(roomCanvas('enemy'),449,80,740,517,'savasActor')+savasText(foeNames[en.id]||en.name||routeName(idx),1312,138,317,63,'title')
  +savasText('Av Hedefi',1352,207,200,32,'rarity')+savasText('Düşman Canı',1318,273,240,43)+savasText(en.hp,1558,273,65,43,'number')
  +savasText(developerFree(state)?'∞':left+' / '+EKONOMI.gunlukHak.hunt,1513,341,110,44,'number');
 body+=enc.enemies.map((e,j)=>refButton(foeNames[e.id]||e.name,'savasHuntTarget',473+j*235,607,219,179,'data-i="'+j+'" aria-pressed="'+(j===savasHedef)+'"',refCrop('av_taban',473,607,219,179)+'<span class="savasHuntCard">'+savasEnemyImage(e)+'<strong>'+safeText(foeNames[e.id]||e.name||'Hedef '+(j+1))+'</strong></span>'+(j===savasHedef?'<span class="alanCardChosen"></span>':''))).join('');
 body+=alanBox(['gold','ore'].map((k,j)=>panelReward(k,karsilasmaOdulu(state,idx)[k])).join(''),1242,468,383,116,'savasRewards')
  +savasButton(blocked?'Kilitli':'Ava Başla','startHunt',1230,641,410,110,blocked?'disabled':'')
  +savasText(book.hunts+' Tam Av',544,839,206,50,'number')+alanBox(alanProgress(Math.min(3,book.hunts),3,'Av nöbeti'),756,853,540,34)
  +savasButton('Ödülü Gör','savasHuntReward',1341,822,211,80,'data-i="'+idx+'"','small');
 return savasScreen('av',body);
}
function savasCampaign(){
 const r=regionOf(chosenStage),ids=referenceRouteNodes(r),e=encounters[chosenStage],first=!state.cleared.includes(e.id),open=allowed(chosenStage,state),done=ids.filter(i=>state.cleared.includes(encounters[i].id)).length;
 const reward=karsilasmaOdulu(state,chosenStage);
 let body=savasRegionList(r,'referenceRegion',22,158,307,141,3)+savasRegionArrows(r,'referenceRegion',35,586,280);
 body+=refButton('Normal','referenceNormal',425,95,233,67,'aria-pressed="true"')+refButton('Elit','referenceNormal',661,95,200,67,'disabled')+refButton('Kâbus','referenceNormal',862,95,238,67,'disabled');
 const p=[[367,655],[731,504],[1116,328]];
 body+='<svg class="campaignPath" viewBox="0 0 1672 941" aria-hidden="true"><path d="M367 655 Q555 605 731 504 T1116 328" fill="none" stroke="#58381d" stroke-width="12"/><path d="M367 655 Q555 605 731 504 T1116 328" fill="none" stroke="#ffd47a" stroke-width="5" stroke-dasharray="9 10"/></svg>';
 body+=ids.map((id,j)=>{const [x,y]=p[j],en=encounters[id],yes=state.cleared.includes(en.id),can=allowed(id,state);return refButton(en.id+' '+routeName(id),'referenceStage',x-55,y-53,110,110,'data-i="'+id+'" aria-pressed="'+(id===chosenStage)+'"','<span class="savasMapNode '+(id===chosenStage?'on':'')+' '+(!can?'locked':'')+'">'+refCrop('sefer_referansi',343,592,66,66)+'</span>')+savasText(en.id+(yes?' ✓':''),x-71,y+62,142,39,'nodeName');}).join('');
 body+=savasText(e.id,1386,130,234,65,'huge')+savasText(routeName(chosenStage),1283,212,338,60,'title')
  +savasText('Düşman Canı',1326,295,222,42)+savasText(e.enemies.reduce((n,v)=>n+v.hp,0),1548,295,80,42,'number')+savasText('0',1563,350,62,44,'number')
  +savasText(first?'İlk Zafer Ödülü':'Tekrar Ödülü',1373,441,250,40,'rewardHeading')
  +alanBox(Object.entries(reward).filter(([,n])=>n>0).map(([k,n])=>panelReward(k,n)).join(''),1280,511,352,132,'savasRewards')
  +savasButton('Savaşa Gir','start',1262,678,393,91,open?'':'disabled')
  +savasText(done+' / '+ids.length,414,845,125,43,'number')+alanBox(alanProgress(done,ids.length,'Bölge ilerlemesi'),557,865,964,20);
 return savasScreen('map',body);
}
function savasBoss(){
 const ids=bossIndices(),idx=chosenBoss(),e=encounters[idx],enemy=e.enemies[0],open=allowed(idx,state),used=dayBook(state).used[hakTuru(idx)]||0,left=hakKalan(state,hakTuru(idx));
 const rewards=karsilasmaOdulu(state,idx);

 let body=['Bölge','Günlük','Dünya'].map((key,j)=>savasButton(key,'bossTab',29+j*131,204,128,35,'data-key="'+key+'" aria-pressed="'+(key===bossTab)+'"','small'+(key===bossTab?' on':''))).join('');
 body+=alanBox(ids.map((id,j)=>{const en=encounters[id],yes=allowed(id,state);return '<button class="savasBossCard '+(idx===id?'on':'')+'" data-act="roomBossSelect" data-i="'+id+'" aria-pressed="'+(idx===id)+'" aria-label="'+safeText(routeName(id))+'"><span>'+savasEnemyImage(en.enemies[0])+'</span><strong>'+safeText(routeName(id))+'</strong>'+(!yes?glyph('lock'):'')+'</button>';}).join(''),30,244,391,510,'savasBossList');
 if(bossTab==='Bölge')body+=savasText(regions[selectedBossRegion][0],42,774,368,38,'small')+savasRegionArrows(selectedBossRegion,'bossRegion',45,819,366);
 body+=savasText(routeName(idx),766,90,295,75,'title')+savasText(bossTab==='Bölge'?'Bölüm '+(selectedBossRegion+1):bossTab,793,161,239,40,'subtitle')
  +alanBox(roomCanvas('enemy'),448,214,672,650,'savasActor')
  +savasText('Düşman Canı',1240,176,280,44)+savasText(enemy.hp,1518,176,105,44,'number')
  +savasText('Gücün',1240,237,246,44)+savasText(guc(state),1485,237,138,44,'number')
  +savasText('Günlük Hak',1240,297,254,44)+savasText(Number.isFinite(left)?left+' / '+EKONOMI.gunlukHak[hakTuru(idx)]:'Sınırsız',1482,297,142,44,'number')
  +alanBox(Object.entries(rewards).map(([k,n])=>panelReward(k,n)).join(''),1181,420,440,156,'savasRewards')
  +savasText(state.bestTimes[idx]!=null?seconds(state.bestTimes[idx])+' sn':'—',1477,598,152,57,'number')
  +savasButton(open?'Meydan Oku':'Kilitli',idx===BRIDGE?'startBoss':'trialStart',1168,679,462,95,'data-i="'+idx+'" '+(girisNedeni(state,idx)?'disabled':''))
  +savasButton('Ödüller','savasBossRewards',1187,797,421,66,'data-i="'+idx+'"');
 return savasScreen('boss',body);
}
function savasArena(){
 const book=dayBook(state),rewards=Math.max(0,EKONOMI.arena.jetonluZafer-book.arenaWins);
 let body=savasText(profileName(),67,338,298,61,'title')+savasText(guc(state),238,409,123,50,'number')
  +savasText('—',288,501,76,47,'number')+savasText(state.stats.arena||0,288,573,76,47,'number')+savasText('Giriş · '+hakKalan(state,'arena')+' / '+EKONOMI.gunlukHak.arena,128,651,239,47,'entryLabel')
  +savasText('Yerel Antrenman',846,100,274,64,'title')+savasText((state.stats.rating||0)+' Puan',866,167,220,45,'subtitle')
  +savasButton('Rakip Seç','savasRival',1225,197,298,57,'','dark');
 body+=trials.arena.map((idx,j)=>{const x=529+j*343,en=encounters[idx],foe=en.enemies[0];return refButton(routeName(idx),'rival',x,281,301,365,'data-key="'+safeText(routeName(idx))+'" aria-pressed="'+(rival===j)+'"',rival===j?'<span class="alanCardChosen"></span>':'')+savasText(routeName(idx),x+28,518,252,42,'arenaName')+savasText('Can '+foe.hp+' · Saldırı '+foe.normalDamage,x+31,572,249,39,'arenaStat')+savasText('+'+EKONOMI.arena.zafer+' Puan'+(rewards?' · '+EKONOMI.arena.jeton+' Jeton':''),x+31,622,249,36,'arenaStat')+savasButton('Düello','trialStart',x+27,667,251,62,'data-i="'+idx+'" '+(girisNedeni(state,idx)?'disabled':''));}).join('');
 body+=refButton('Rakipler','savasArenaTab',46,816,465,94,'data-key="Rakipler"')+refButton('Savunma','savasArenaTab',515,816,357,94,'data-key="Savunma"')+refButton('Savaş Geçmişi','savasArenaTab',876,816,379,94,'data-key="Savaş Geçmişi"')+refButton('Ödüller','savasArenaTab',1260,816,357,94,'data-key="Ödüller"');
 return savasScreen('arena',body);
}
function savasForge(){
 if(!forgeSlot)forgeSlot='silah';
 const tab=forgeTabs.some(t=>t[0]===forgeTab)?forgeTab:'Yükselt',list=forgeList();
 if(savasForgeOrder)list.sort((a,b)=>gearPower(b)-gearPower(a));
 const sel=list.find(g=>g.id===forgeSel)||list[0],labels=['Geliştirme','Birleştirme','Taş','Kademe','Ayrıştırma'];
 let body=currencyPlate(({'Birleştir':'demirci_birlestirme_20261113','Yükselt':'demirci_gelistirme_20261113','Taş İşle':'demirci_tas_20261113','Kademe':'demirci_kademe_20261113','Parçala':'demirci_ayristirma_20261113'}[tab]))+refButton('Geri','back',29,11,78,75);
 body+='<nav class="forgeReferenceTabs" '+refAt(171,111,1348,67)+'>'+forgeTabs.map(([key],i)=>tag(labels[i],'forgeTab','data-key="'+key+'" aria-pressed="'+(key===tab)+'"','forgeReferenceTab'+(key===tab?' selected':''))).join('')+'</nav>';
 body+=[['Altın','gold',state.gold,1093,88],['Elmas','gem',state.gems,1256,68],['Kristal','crystal',state.crystals||0,1402,65],['Enerji','energy',energyNow(state)+'/20',1533,95]].map(([name,action,n,x,w])=>refButton(name,action,x,27,w,31,'','<span class="guildLayoutWallet">'+safeText(typeof n==='number'?profileNumber(n):n)+'</span>')).join('');
 const cats=[['silah','Silah'],['zirh','Zırh'],['kask','Miğfer'],['run','Rün'],['cizme','Çizme'],['yuzuk','Takı']];
 body+='<nav class="forgeReferenceCategories" '+refAt(75,248,123,604)+'>'+cats.map(([slot,name])=>tag(gearSlotIcon(slot),'savasForgeSlot','data-slot="'+slot+'" aria-label="'+name+'" title="'+name+'" aria-pressed="'+(forgeSlot===slot)+'"','forgeReferenceCategory'+(forgeSlot===slot?' selected':''))).join('')+'</nav>';
 if(tab!=='Parçala')body+='<div class="forgeReferenceInventory" '+(tab==='Yükselt'?refAt(211,226,151,633):refAt(211,239,299,611))+'>'+list.map(g=>tag(gearCell(g),'forgeSel','data-id="'+g.id+'" aria-label="'+safeText(gearName(g))+' +'+g.plus+'" aria-pressed="'+(sel?.id===g.id)+'"','forgeReferenceItem'+(sel?.id===g.id?' selected':''))).join('')+(list.length?'':'<p>Ekipman yok.</p>')+'</div>';
 if(tab==='Taş İşle')return forgeStoneReference(body,sel);
 if(tab==='Kademe')return forgeTierReference(body,sel);
 if(tab==='Parçala')return forgeScrapReference(body,list);
 if(tab==='Birleştir')return forgeMergeReference(body,sel);
 if(tab==='Yükselt')return forgeUpgradeReference(body,sel);
 body+='<div class="forgeReferenceHero" '+refAt(538,288,627,331)+'>'+(sel?'<img alt="'+safeText(gearName(sel))+'" src="'+gearIconSrc(sel.slot,sel.tier)+'">':'')+'</div>';
 body+=refValue(sel?gearName(sel)+' +'+sel.plus:'Ekipman Seç',708,239,295,43,'forgeReferenceName');
 body+='<div class="forgeReferencePanel" '+refAt(1200,300,402,544)+'></div>';
 body+=refValue(labels[forgeTabs.findIndex(v=>v[0]===tab)],1234,238,321,42,'forgeReferenceHeading');
 if(sel){
  const stat=gearSlot[sel.slot].stat,cost=gearUpCost(sel),max=sel.plus>=GEAR_MAX_PLUS,current=gearBonus(sel,stat),next=gearBase(sel,Math.min(GEAR_MAX_PLUS,sel.plus+1))+current-gearBase(sel);
  let detail=alanStats([[stat==='atk'?'sword':'heart',stat==='atk'?'Saldırı':'Can',tab==='Yükselt'?current+' → '+next:current]]),mats='',action='',label='',attrs='data-id="'+sel.id+'" ';
  if(tab==='Yükselt'){mats=alanCost(cost);action='gearUp';label=max?'Azami':'Geliştir';attrs+=max||!afford(state,cost)?'disabled':'';}
  if(tab==='Birleştir'){
   const groups=mergeGroups(state),group=groups.find(([k])=>k===sel.slot+':'+sel.rarity)||groups[0];
   detail=alanParagraph(group?'3 eşya → '+rarities[group[1][0].rarity+1]:'Aynı yuva ve nadirlikte üç eşya gerekir.',0,0,400,90,'savasStatic');
   mats=group?group[1].slice(0,3).map(g=>'<span class="gxCell r'+g.rarity+'">'+gearIcon(g.slot,g.tier)+'</span>').join(''):'';action='forgeMerge';label='Birleştir';attrs=group?'data-key="'+group[0]+'"':'disabled';
  }
  if(tab==='Taş İşle'){
   detail+='<div class="savasSockets">'+sel.sockets.map((k,i)=>k?'<button class="alanRune" data-act="forgePullOne" data-id="'+sel.id+'" data-i="'+i+'" aria-label="'+stoneMeta[k][0]+' çıkar"><span class="gxStone '+k+'"></span></button>':'<span class="alanRune"></span>').join('')+'</div>';
   mats=Object.keys(stoneMeta).map(k=>'<button class="savasStone" data-act="gearSocket" data-id="'+sel.id+'" data-stone="'+k+'" '+(!sel.sockets.includes(null)||!developerFree(state)&&!(state.stones?.[k]>0)?'disabled':'')+'><span class="gxStone '+k+'"></span><b>'+stoneMeta[k][0]+' '+(state.stones?.[k]||0)+'</b></button>').join('');
   action='forgePull';label='Taşı Çıkar';attrs+=!sel.sockets.some(Boolean)||!afford(state,{gold:50})?'disabled':'';
  }
  if(tab==='Kademe'){const c=gearTierCost(sel),last=sel.tier>=GEAR_MAX_TIER,mates=tierMates(state,sel);detail=alanParagraph('T'+sel.tier+' → T'+(last?sel.tier:sel.tier+1),0,0,400,90,'savasStatic');mats=alanCost(c)+'<span class="savasMate">'+mates.length+' / 1 Eş Ekipman</span>';action='forgeTier';label=last?'Azami':'Kademe Yükselt';attrs+=last||!developerFree(state)&&!mates.length||!afford(state,c)?'disabled':'';}
  if(tab==='Parçala'){detail+=alanParagraph('Taşlar geri gelir.',0,0,400,60,'savasStatic');mats=panelReward('ore',sel.tier+sel.rarity)+panelReward('gold',Math.floor(gearSellValue(sel)/2));action='forgeScrap';label='Parçala';attrs+=state.worn?.[sel.slot]===sel.id?'disabled':'';}

  body+='<div class="forgeReferenceStats" '+refAt(1213,308,375,133)+'>'+detail+(tab==='Yükselt'?'<strong>+'+sel.plus+' → +'+(max?sel.plus:sel.plus+1)+'</strong>':'')+'</div>';
  body+='<div class="forgeReferenceMaterials" '+refAt(1213,522,375,197)+'>'+mats+'</div>';
  body+=refValue(tab==='Parçala'?'Kazanılacak Malzemeler':'Gerekli Malzemeler',1235,462,321,43,'forgeReferenceHeading');
  body+=refButton(label,action,1217,764,379,75,attrs,'<span class="forgeReferenceAction">'+safeText(label.toLocaleUpperCase('tr-TR'))+'</span>');
 }else body+=refValue('Soldan bir ekipman seç.',1215,390,375,80,'forgeReferenceEmpty');
 return '<section class="refViewport" aria-label="Demirci"><div class="refScreen forgeReferenceLayout">'+body+'</div></section>';
}
function referenceCombat(key){return ({av:savasHunt,map:savasCampaign,boss:savasBoss,arena:savasArena,forge:savasForge}[key])();}
function paintCombat(){
 if(!['av','boss'].includes(view)||!main.querySelector('.refCombat'))return false;const can=$('venueCanvas');if(!can)return true;
 const {c,w,h}=context(can),enc=view==='boss'?encounters[chosenBoss()]:encounters[huntingGrounds[selectedHuntRegion]],enemy=enc.enemies[view==='av'?Math.min(savasHedef,enc.enemies.length-1):0];
 c.clearRect(0,0,w,h);figure(c,w*.5,h*.98,Math.min(h*.95,w*.88),enemy.id,0,0);return true;
}
async function combatAction(action,el){
 if(await forgeLayoutAction(action,el))return true;
 const d=el.dataset||{};
 if(action==='savasHuntReward'){openModal('Av Ödülü',uiRewards(karsilasmaOdulu(state,Number(d.i))));return true;}
 if(action==='savasHuntTarget'){savasHedef=Number(d.i);render();return true;}
 if(action==='savasForgeSlot'){forgeSlot=d.slot||null;forgeSel=null;render();return true;}
 if(action==='savasForgeSort'){savasForgeOrder=!savasForgeOrder;render();return true;}
 if(action==='savasRival'){rival=(rival+1)%trials.arena.length;render();return true;}
 if(action==='savasArenaTab'){
  // Sekmeler ekrandan çıkarmaz: Ödüller arena jetonu dükkânını burada açar.
  if(d.key==='Ödüller')openModal('Arena Ödülleri',dukkanPenceresi('arena','arenaCoin','Günün ilk '+EKONOMI.arena.jetonluZafer+' zaferi: '+EKONOMI.arena.jeton+' jeton'),dukkanDugmesi('arena'));
  else if(d.key==='Savunma')openModal('Savunma',alanStats([['heart','Can',healthOf(state)],['sword','Saldırı',attack(state)]]));
  else if(d.key==='Savaş Geçmişi')openModal('Savaş Geçmişi',(state.log||[]).filter(v=>trials.arena.some(i=>routeName(i)===v.title)).map(v=>'<p>'+safeText(v.title)+' · '+({win:'Zafer',lose:'Yenilgi',draw:'Beraberlik',timeout:'Süre Doldu',exit:'Geri Çekilme'}[v.end]||'—')+' · '+safeText(v.day)+'</p>').join('')||'Henüz düello yok.');
  return true;
 }
 if(action==='savasBossRewards'){const e=encounters[Number(d.i)];openModal('Ödüller',e.kind==='daily'?EKONOMI.gunlukBossElmas.map(([ratio,n])=>'%'+ratio*100+' hasar: '+n+' elmas').join(' · '):e.kind==='world'?'Hasar verilen deneme: 1 kalıntı parçası.':'Günün ilk zaferi: 3 kalıntı parçası. Tekrar zaferi: 10 altın.');return true;}
 return false;
}

function forgeMergeReference(body,sel){
 const candidates=sel?(state.gear||[]).filter(g=>g.slot===sel.slot&&g.rarity===sel.rarity&&state.worn?.[g.slot]!==g.id).sort((a,b)=>b.tier-a.tier).slice(0,3):[];
 const ready=candidates.length===3&&sel.rarity<rarities.length-1;
 const result=ready?{...candidates[0],rarity:candidates[0].rarity+1,plus:Math.max(...candidates.map(g=>g.plus)),sockets:[]}:null;
 const card=(g,x,y,w,h,extra='')=>'<div class="forgeMergeCard '+extra+'" '+refAt(x,y,w,h)+'>'+(g?gearCell(g):'<span class="forgeMergeEmpty">Ekipman seç</span>')+'</div>';
 body+=card(candidates[0],620,317,173,202)+card(candidates[1],937,317,174,202);
 // Mevcut birleştirme kuralı üç eşya; referansın iki ana yuvasının yanında üçüncü eşya görünür.
 body+=card(candidates[2],1041,457,69,64,'third');
 body+=card(result,1312,286,234,262,'result');
 body+=refValue(result?gearName(result):'Yeni Ekipman',1334,514,189,35,'forgeMergeResultName');
 body+='<div class="forgeMergeSummary" '+refAt(627,709,865,59)+'><span>Gerekli: 3 Eşya</span><span>0 Altın</span><span>'+ (ready?'Hazır':'Eksik Ekipman')+'</span></div>';
 body+=refButton('Birleştir','forgeMerge',840,790,416,67,'data-key="'+(sel?sel.slot+':'+sel.rarity:'')+'" '+(ready?'':'disabled'),'<span class="forgeReferenceAction">BİRLEŞTİR</span>');
 return '<section class="refViewport" aria-label="Demirci · Birleştirme"><div class="refScreen forgeReferenceLayout">'+body+'</div></section>';
}

function forgeUpgradeReference(body,sel){
 const max=!!sel&&sel.plus>=GEAR_MAX_PLUS,cost=sel?gearUpCost(sel):{},ready=!!sel&&!max&&afford(state,cost);
 const stat=sel?gearSlot[sel.slot].stat:'atk',current=sel?gearBonus(sel,stat):0,next=sel?gearBase(sel,Math.min(GEAR_MAX_PLUS,sel.plus+1))+current-gearBase(sel):0;
 body+='<div class="forgeReferenceHero forgeUpgradeHero" '+refAt(406,286,811,298)+'>'+(sel?'<img src="'+gearIconSrc(sel.slot,sel.tier)+'" alt="'+safeText(gearName(sel))+'">':'')+'</div>';
 body+=refValue(sel?gearName(sel)+' +'+sel.plus:'Ekipman Seç',648,235,335,44,'forgeReferenceName');
 body+=refValue(sel?'+'+sel.plus+' → +'+(max?sel.plus:sel.plus+1):'—',631,657,338,40,'forgeReferenceName');
 body+=refValue(sel?(stat==='atk'?'Saldırı':'Can')+'  '+current+' → '+next:'Ekipman seç',508,710,594,43,'forgeUpgradeStat');
 body+='<div class="forgeUpgradeCost" '+refAt(434,791,757,67)+'>'+(sel?Object.entries(cost).map(([key,n])=>'<span>'+objectArt(key)+'<span>'+safeText(moneyNames[key]||key)+'<b>'+profileNumber(state[key]||0)+' / '+profileNumber(n)+'</b></span></span>').join(''):'')+'</div>';
 body+=refValue(sel&&!max?'%'+gearUpChance(sel):'—',1340,378,187,75,'forgeUpgradeChance');
 body+=refValue(!sel?'Ekipman seç':max?'Azami':ready?'✓ Hazır':'Yetersiz malzeme',1304,579,250,44,'forgeUpgradeReady');
 body+=refButton(max?'Azami':'Geliştir','gearUp',1258,727,345,88,'data-id="'+(sel?.id||'')+'" '+(ready?'':'disabled'),'<span class="forgeReferenceAction">'+(max?'AZAMİ':'GELİŞTİR')+'</span>');
 return '<section class="refViewport" aria-label="Demirci · Geliştirme"><div class="refScreen forgeReferenceLayout forgeUpgradeLayout">'+body+'</div></section>';
}

let forgeStoneSelected='yakut';
const forgeScrapSelection=new Set();
function forgeLayoutFinish(body,tab){return '<section class="refViewport" aria-label="Demirci · '+tab+'"><div class="refScreen forgeReferenceLayout forgeExtraLayout">'+body+'</div></section>';}
function forgeLayoutImage(g,x,y,w,h,tone=''){return '<div class="forgeExtraImage '+tone+'" '+refAt(x,y,w,h)+'>'+(g?'<img alt="'+safeText(gearName(g))+'" src="'+gearIconSrc(g.slot,g.tier)+'">':'<span>Ekipman seç</span>')+'</div>';}
function forgeStoneArt(k){return ART['icon_stone_'+k]?'<img alt="" src="'+ART['icon_stone_'+k]+'">':'<span class="gxStone '+k+'"></span>';}
function forgeStoneReference(body,sel){
 const key=Object.hasOwn(stoneMeta,forgeStoneSelected)?forgeStoneSelected:'yakut',stone=stoneMeta[key],count=state.stones?.[key]||0;
 body+=forgeLayoutImage(sel,573,319,421,452);
 body+='<div class="forgeStonePedestal" '+refAt(1005,537,132,117)+'>'+forgeStoneArt(key)+'</div>';
 body+='<div class="forgeStoneChoices" '+refAt(1210,245,393,255)+'>'+Object.keys(stoneMeta).map(k=>tag(forgeStoneArt(k)+'<small>'+stoneMeta[k][0]+'</small>','forgeStonePick','data-stone="'+k+'" aria-pressed="'+(key===k)+'"','forgeStoneChoice'+(key===k?' selected':''))).join('')+'</div>';
 body+='<div class="forgeExtraDetails" '+refAt(1216,538,382,194)+'><h3>'+stone[0]+' Taşı</h3><p>'+(stone[1]==='atk'?'Saldırı':'Can')+' · '+count+' Adet</p><p>0 Altın</p></div>';
 body+='<div class="forgeRealSockets" '+refAt(645,710,285,59)+'>'+(sel?(sel.sockets.length?sel.sockets.map((k,i)=>k?tag(forgeStoneArt(k),'forgePullOne','data-id="'+sel.id+'" data-i="'+i+'" aria-label="'+stoneMeta[k][0]+' çıkar"','forgeSocket'): '<span class="forgeSocket empty" aria-label="Boş yuva"></span>').join(''):'Taş yuvası yok'):'')+'</div>';
 const ready=sel&&sel.sockets.includes(null)&&(developerFree(state)||count>0);
 body+=refButton('Taşı Tak','gearSocket',1216,760,386,80,'data-id="'+(sel?.id||'')+'" data-stone="'+key+'" '+(ready?'':'disabled'),'<span class="forgeReferenceAction">TAŞI TAK</span>');
 return forgeLayoutFinish(body,'Taş');
}
function forgeTierReference(body,sel){
 const max=sel&&sel.tier>=GEAR_MAX_TIER,cost=sel?gearTierCost(sel):{},mates=sel?tierMates(state,sel):[],next=sel?{...sel,tier:Math.min(GEAR_MAX_TIER,sel.tier+1)}:null;
 body+='<div class="forgeTierTrack" '+refAt(567,226,673,85)+'>'+(sel?Array.from({length:5},(_,i)=>{const n=Math.min(GEAR_MAX_TIER,Math.max(1,sel.tier-2)+i);return '<span class="'+(n===sel.tier?'selected':'')+'">T'+n+'</span>';}).join(''):'')+'</div>';
 body+=forgeLayoutImage(sel,566,358,282,288,'blue')+forgeLayoutImage(next,953,358,281,288,'purple');
 body+=refValue(sel?'Mevcut · T'+sel.tier:'Ekipman seç',608,734,216,60,'forgeTierCaption')+refValue(next?'Sonraki · T'+next.tier:'—',994,734,216,60,'forgeTierCaption');
 body+='<div class="forgeExtraDetails forgeTierMaterials" '+refAt(1300,327,309,353)+'>'+(sel?'<div class="forgeMate">'+(mates[0]?gearCell(mates[0]):gearIcon(sel.slot,sel.tier))+'<span>Eş Ekipman<br>'+mates.length+' / 1</span></div>'+alanCost(cost)+'<p>Başarı %100</p>':'Ekipman seç')+'</div>';
 const ready=sel&&!max&&(developerFree(state)||mates.length>0)&&afford(state,cost);
 body+=refButton(max?'Azami':'Kademe Yükselt','forgeTier',1295,731,324,78,'data-id="'+(sel?.id||'')+'" '+(ready?'':'disabled'),'<span class="forgeReferenceAction">'+(max?'AZAMİ':'KADEME YÜKSELT')+'</span>');
 return forgeLayoutFinish(body,'Kademe');
}
function forgeScrapReference(body,list){
 const selected=list.filter(g=>forgeScrapSelection.has(g.id)&&state.worn?.[g.slot]!==g.id),reward={};
 for(const g of selected)for(const [k,n] of Object.entries(ayristirmaOdulu(g)))reward[k]=(reward[k]||0)+n;
 body+=refValue(selected.length+' seçili',1018,222,129,32,'forgeScrapCount');
 body+='<div class="forgeScrapGrid" '+refAt(258,277,868,520)+'>'+list.map(g=>{const worn=state.worn?.[g.slot]===g.id,picked=selected.includes(g);return tag(gearCell(g)+(picked?'<b class="forgeScrapTick">✓</b>':worn?'<b class="forgeScrapTick">🔒</b>':''),'forgeScrapPick','data-id="'+g.id+'" aria-label="'+safeText(gearName(g))+'" aria-pressed="'+picked+'" '+(worn?'disabled':''),'forgeScrapItem'+(picked?' selected':''));}).join('')+'</div>';
 body+='<div class="forgeScrapTotals" '+refAt(1213,453,391,198)+'>'+Object.entries(reward).map(([k,n])=>'<div>'+objectArt(k)+'<span>'+safeText(moneyNames[k])+'</span><b>'+profileNumber(n)+'</b></div>').join('')+(selected.length?'':'<p>Ekipman seç</p>')+'</div>';
 body+=refButton('Tümünü Seç','forgeScrapAllPick',428,818,224,42,'','<span class="forgeSelectLink">Tümünü Seç</span>')+refButton('Seçimi Temizle','forgeScrapClear',725,818,257,42,'','<span class="forgeSelectLink">Seçimi Temizle</span>');
 body+=refButton('Ayrıştır','forgeScrapPicked',1214,762,389,78,selected.length?'':'disabled','<span class="forgeReferenceAction">AYRIŞTIR</span>');
 return forgeLayoutFinish(body,'Ayrıştırma');
}
async function forgeLayoutAction(action,el){
 const d=el.dataset||{};
 if(action==='forgeStonePick'){if(stoneMeta[d.stone])forgeStoneSelected=d.stone;render();return true;}
 if(action==='forgeScrapPick'){const g=forgeList().find(v=>v.id===d.id);if(g&&state.worn?.[g.slot]!==g.id){if(forgeScrapSelection.has(g.id))forgeScrapSelection.delete(g.id);else forgeScrapSelection.add(g.id);}render();return true;}
 if(action==='forgeScrapAllPick'){forgeList().filter(g=>state.worn?.[g.slot]!==g.id).forEach(g=>forgeScrapSelection.add(g.id));render();return true;}
 if(action==='forgeScrapClear'){forgeScrapSelection.clear();render();return true;}
 if(action==='forgeScrapPicked'){
  const ids=forgeList().filter(g=>forgeScrapSelection.has(g.id)&&state.worn?.[g.slot]!==g.id).map(g=>g.id);let done=false;
  await changeState(s=>{if(s.fight||!ids.length)return false;const items=ids.map(id=>s.gear.find(g=>g.id===id));if(items.some(g=>!g||s.worn?.[g.slot]===g.id))return false;for(const g of items){give(s,ayristirmaOdulu(g));taslariIade(s,g);}s.gear=s.gear.filter(g=>!ids.includes(g.id));done=true;});
  if(done){forgeScrapSelection.clear();forgeSel=null;render();toast(ids.length+' eşya ayrıştırıldı.');}return true;
 }
 return false;
}
