// Market ve Sefer: kullanıcı referansları, mevcut ürün/karşılaşma verileri.
let referenceChest=4,referenceQuantity=1,referenceMapTab='Bilgi';
function developerControl(){return tag(developerFree(state)?'Geliştirici · Bedelsiz':'Geliştirici','developerToggle','aria-pressed="'+developerFree(state)+'" '+(fight||observer?'disabled':''),'developerButton'+(developerFree(state)?' enabled':''));}
function screenWallet(xs,withCap=false){
 return [state.gold,state.gems,state.crystals,energyNow(state)].map((n,i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],xs[i],10,i===3&&withCap?101:67,45,'','<span class="refWalletValue">'+profileNumber(n)+(i===3&&withCap?'/'+energyCap:'')+'</span>')).join('');
}
function marketChestArt(i){
 const art=i===4?refCrop('market_referansi',350,179,291,182):refCrop('market_referansi',[140,392,643,899,1150,1402][i],477,171,78);
 return '<div class="marketHeroArt">'+art+'</div>';
}
function referenceCost(cost){return developerFree(state)?'<b>Bedelsiz</b>':Object.entries(cost).map(([k,n])=>glyph({gold:'coin',gems:'gem',crystals:'crystal',arenaCoin:'sword',guildCoin:'flag'}[k]||'coin')+'<b>'+profileNumber(n)+'</b>').join('');}
function referenceMarket(){
 if(marketTab==='Sandıklar')return marketChestPage();
 if(marketTab==='Arena'||marketTab==='Lonca')return marketSecondaryPage();
 marketTab='Mağaza';return marketShopPage();
}
function marketNavigation(){
 return '<nav class="marketNavigation" aria-label="Market bölümleri" '+refAt(301,72,960,55)+'>'+['Sandıklar','Mağaza','Arena','Lonca'].map(name=>tag(name,'marketTab','data-key="'+name+'" aria-pressed="'+(marketTab===name)+'"','marketNavTab'+(marketTab===name?' selected':''))).join('')+'</nav>';
}
function referenceRouteNodes(r){return route.filter(i=>regionOf(i)===r);}
function referenceCampaign(){
 const r=regionOf(chosenStage),indices=referenceRouteNodes(r),e=encounters[chosenStage],first=!state.cleared.includes(e.id);
 const reward={gold:first?e.gold:BALANCE.repeatGold,xp:first?e.xp:BALANCE.repeatXp};
 if(first&&(e.kind||'campaign')==='campaign'){reward.gems=1;if(e.final)reward.chests=1;}
 let body=currencyPlate('sefer_taban')+screenWallet([794,978,1150,1314],true)+refButton('Geri','back',25,5,80,80);
 for(const [key,name,x] of [['mail','Posta',1450],['notices','Bildirimler',1530],['settings','Ayarlar',1601]])body+=refButton(name,key,x,6,60,60);
 body+=refValue('Bölüm '+(r+1),398,92,252,33,'campaignChapter')+refValue(regions[r][0],398,126,252,30,'campaignRegion')
  +refButton('Önceki bölge','referenceRegion',332,96,63,62,'data-i="'+(r-1)+'" '+(r===0?'disabled':''))
  +refButton('Sonraki bölge','referenceRegion',648,96,66,62,'data-i="'+(r+1)+'" '+(r===regions.length-1?'disabled':''))
  +refButton('Bölge bilgisi','referenceRegionInfo',733,101,42,45)
  +refButton('Normal','referenceNormal',795,98,151,52,'aria-pressed="true"')
  +refButton('Elit · Kapalı','referenceNormal',948,98,132,52,'disabled title="Kapalı"')
  +refButton('Kâbus · Kapalı','referenceNormal',1080,98,136,52,'disabled title="Kapalı"');
 const from=Math.min(r,regions.length-4);
 for(let j=0;j<4;j++){
  const region=from+j,ids=referenceRouteNodes(region),can=ids.some(id=>allowed(id,state)),chosen=r===region,y=179+j*106;
  body+=refButton(regions[region][0],'referenceRegion',34,y,260,88,'data-i="'+region+'" aria-pressed="'+chosen+'"','<span class="campaignRegionText '+(chosen?'selected':'')+'"><b>Bölüm '+(region+1)+'</b><span>'+safeText(regions[region][0])+'</span>'+(!can?glyph('lock'):'')+'</span>');
 }
 // Gerçek sefer durakları; referanstaki örnek yedi durak kayıt yapısına eklenmez.
 const points=indices.length===3?[[375,626],[699,459],[1124,342]]:indices.map((id,i)=>[375+749*i/Math.max(1,indices.length-1),626-284*i/Math.max(1,indices.length-1)]);
 const path=indices.length===3?'M315 665 Q340 645 375 626 C430 585 452 510 520 550 S635 600 699 459 S840 455 920 405 S1050 430 1124 342':'M'+points.map(([x,y])=>x+','+y).join(' L');
 body+='<svg class="campaignPath" viewBox="0 0 1672 941" aria-hidden="true"><path d="'+path+'" fill="none" stroke="#492c13" stroke-width="14"/><path d="'+path+'" fill="none" stroke="#ffc85d" stroke-width="6" stroke-dasharray="8 10"/></svg>';
 body+=indices.map((id,i)=>{
  const [x,y]=points[i],enc=encounters[id],done=state.cleared.includes(enc.id),open=allowed(id,state),boss=i===indices.length-1;
  const art=boss?refCrop('sefer_referansi',1062,280,145,108):refCrop('sefer_referansi',343,592,66,66);
  return refButton(enc.id+' '+routeName(id),'referenceStage',x-(boss?78:44),y-(boss?83:44),boss?156:88,boss?166:88,'data-i="'+id+'" aria-pressed="'+(chosenStage===id)+'"','<span class="campaignNode '+(boss?'campaignBoss ':'')+(chosenStage===id?'selected':'')+(!open?' locked':'')+'">'+art+(!open?'<i>'+glyph('lock')+'</i>':'')+'</span>')
   +refValue(enc.id+(done?' ✓':''),x-67,y+(boss?58:40),134,34,'campaignNodeLabel');
 }).join('');
 body+=refValue(e.id,1289,101,180,32,'campaignStageId')+refValue(routeName(chosenStage),1288,132,337,40,'campaignStageName');
 body+=[['Bilgi',1251,138],['Düşman',1391,130],['Ödüller',1522,121]].map(([key,x,w],i)=>refButton(key,'referenceMapTab',x,194,w,46,'data-key="'+key+'" aria-pressed="'+(referenceMapTab===key)+'"',i===0&&referenceMapTab===key||i>0&&referenceMapTab!==key?'':'<span class="refCategoryState '+(referenceMapTab===key?'selected':'')+'">'+key+'</span>')).join('');
 if(referenceMapTab==='Düşman'){
  body+='<div class="campaignEnemies" '+refAt(1270,252,350,431)+'>'+e.enemies.map(enemy=>'<div>'+glyph('shield')+'<strong>'+safeText(foeNames[enemy.id]||enemy.id)+'</strong><span>'+enemy.hp+' Can</span></div>').join('')+'</div>';
 }else{
  body+=refValue(referenceMapTab==='Ödüller'?(first?'İlk tamamlama ödülleri':'Tekrar ödülleri'):(e.tactic!==undefined?tactics[e.tactic][1]:e.enemies.map(v=>foeNames[v.id]||v.id).join(' · ')),1278,251,348,59,'campaignDescription')
   +refValue('Düşman Canı',1328,319,228,37,'campaignStatLabel')+refValue(profileNumber(e.enemies.reduce((n,v)=>n+v.hp,0)),1543,319,85,37,'campaignStatValue')
   +refValue('Enerji Tüketimi',1328,364,235,37,'campaignStatLabel')+refValue('0',1543,364,85,37,'campaignStatValue')
   +refValue(first?'İlk Tamamlama Ödülü':'Tekrar Ödülü',1283,419,324,35,'campaignRewardHeading')
   +'<div class="campaignRewards" '+refAt(1284,465,340,86)+'>'+Object.entries(reward).filter(([k,n])=>n>0).map(([k,n])=>'<span>'+(k==='xp'?refCrop('sefer_referansi',1307,468,62,56):objectArt(k))+'<b>'+profileNumber(n)+'</b><small>'+safeText(moneyNames[k]||k)+'</small></span>').join('')+'</div>'
   +refValue('Olası Düşen Ödüller',1283,564,324,35,'campaignRewardHeading')
   +'<div class="campaignDrops" '+refAt(1285,607,330,71)+'>'+['silah','yakut','feather','eggs'].map((icon,i)=>'<span>'+(i===0?referenceGearArt('silah',r+1):i===1&&ART.icon_stone_yakut?'<img alt="" src="'+ART.icon_stone_yakut+'">':objectArt(icon))+'<small>'+['Ekipman','Taş','Tüy','Yumurta'][i]+'</small></span>').join('')+'</div>';
 }
 const open=allowed(chosenStage,state),done=indices.filter(id=>state.cleared.includes(encounters[id].id)).length;
 body+=refButton('Savaşa Gir','start',1265,714,368,69,open?'':'disabled')+refButton('Hızlı Savaş','referenceQuickBattle',1055,745,172,51,open?'':'disabled')
  +refValue(done+' / '+indices.length,197,858,113,42,'campaignProgressValue')
  +'<div class="campaignProgressFill" '+refAt(345,873,735,10)+'><i style="width:'+done/indices.length*100+'%"></i></div>';
 body+=indices.map((id,i)=>refValue(state.cleared.includes(encounters[id].id)?'✓ '+(i+1):i+1,[592,795,1004][i]||1004,862,84,37,'campaignMilestone')).join('');
 return '<section class="refViewport" aria-label="Sefer"><div class="refScreen ref-campaign">'+body+'</div></section>';
}
async function referenceScreensAction(action,el){
 if(await marketSecondaryAction(action,el))return true;
 if(await marketShopAction(action,el))return true;
 if(await marketChestAction(action,el))return true;
 const d=el.dataset||{};
 if(action==='developerToggle'){
  state=await transact(s=>{if(s.fight)return false;s.settings||={};s.settings.developerFree=!developerFree(s);});tell();render();return true;
 }
 if(action==='developerGem'){
  const item=currencyGemPreview[Number(d.i)];if(!developerFree(state)||!item)return true;
  await changeState(s=>{if(!developerFree(s))return false;give(s,{gems:item[0]+item[1]});},'Elmas eklendi.');return true;
 }
 if(action==='market'){marketTab='Sandıklar';return false;}
 if(action==='referenceChestPick'){const n=Number(d.i);if(chestLine[n]){referenceChest=n;referenceQuantity=1;render();}return true;}
 if(action==='referenceQuantity'){referenceQuantity=Math.max(1,Math.min(20,referenceQuantity+Number(d.step)));render();return true;}
 if(action==='referenceChestOpen'){
  const row=chestLine[referenceChest],count=referenceQuantity,cost=Object.fromEntries(Object.entries(row[2]).map(([k,v])=>[k,v*count]));
  await changeState(s=>{if(!spend(s,cost))return false;for(let n=0;n<count;n++){
   const tier=campaignMastery(s)+1+Math.floor(referenceChest*1.5);
   for(let i=0;i<row[3];i++){const g=rollGear(s,tier,row[4]);g.plus=row[5];}
   give(s,{eggs:row[0]==='uber'?3:1,feather:row[0]==='uber'?3:1});
  }},count*row[3]+' eşya eklendi.');return true;
 }
 if(action==='referenceOdds'){
  const row=chestLine[referenceChest];
  openModal(row[1],'<div class="referenceOdds">'+rarities.map((name,i)=>{const a=i===0?1000:Math.min(1000,rarityOdds[i]*row[4]),b=i===rarities.length-1?0:Math.min(1000,rarityOdds[i+1]*row[4]);return '<p>'+name+' <b>%'+((a-b)/10).toLocaleString('tr-TR',{maximumFractionDigits:2})+'</b></p>';}).join('')+'</div>');return true;
 }
 if(action==='referenceRegion'){
  const r=Number(d.i);if(regions[r]){const ids=referenceRouteNodes(r);chosenStage=ids.find(i=>!state.cleared.includes(encounters[i].id))??ids[ids.length-1];referenceMapTab='Bilgi';render();}return true;
 }
 if(action==='referenceStage'){const i=Number(d.i);if(route.includes(i)){chosenStage=i;referenceMapTab='Bilgi';render();}return true;}
 if(action==='referenceMapTab'){if(['Bilgi','Düşman','Ödüller'].includes(d.key)){referenceMapTab=d.key;render();}return true;}
 if(action==='referenceRegionInfo'){const r=regionOf(chosenStage);openModal(regions[r][0],referenceRouteNodes(r).map(id=>safeText(encounters[id].id+' · '+routeName(id))).join('<br>'));return true;}
 if(action==='referenceNormal')return true;
 if(action==='referenceQuickBattle'){if(state.settings.quickBattleConfirm){openModal('Hızlı Savaş',safeText(routeName(chosenStage)),tag('Savaşa Gir','referenceQuickConfirmed','','gxBtn'));return true;}action='referenceQuickConfirmed';}
 if(action==='referenceQuickBattle'||action==='referenceQuickConfirmed'){if(modal.open)modal.close();await begin(chosenStage);if(fight&&!finishing&&!observer){autoAdvance(fight,limit);await finish();}return true;}
 return false;
}


// Market / Sandıklar — kullanıcının 1672 × 941 referansının aynı çizimi.
let marketChestSelected='crystal',marketChestQuantity=1;
const marketChestPicture='market_sandik_20261113';
const marketChestRects=[
 [134,188,245,204],[392,190,246,202],[650,190,248,202],
 [134,407,245,204],[392,407,246,204],[650,407,248,204],
 [134,625,245,213],[392,625,246,213],[650,625,248,213]
];
// Yalnız sandığın resmi: isim ve fiyatlar önizlemeye büyütülmez.
const marketChestArtRects=[
 [161,215,190,113],[432,214,167,100],[696,203,162,113],
 [175,415,174,114],[428,410,174,119],[675,412,207,145],
 [153,632,218,138],[418,628,198,143],[662,637,226,153]
];
function marketChestItem(){return EKONOMI.marketSandiklari.find(v=>v.id===marketChestSelected)||EKONOMI.marketSandiklari[0];}
function marketChestGem(){return '<span class="sandikGem">'+refCrop(marketChestPicture,228,574,27,23)+'</span>';}
function marketChestPage(){
 const selected=marketChestItem(),index=EKONOMI.marketSandiklari.indexOf(selected);
 const claimed=selected.daily&&state.marketDailyChest===rewardDay();
 if(selected.daily)marketChestQuantity=1;
 const cost=marketSandikBedeli(selected,marketChestQuantity),blocked=claimed||!afford(state,cost);
 let body=currencyPlate(marketChestPicture)+refButton('Geri','back',24,10,61,58);
 // Diğer dört sekmenin mevcut sayfaları ve davranışları korunur.
 body+=marketNavigation();
 // Referanstaki cüzdan çizimi; görünen sayılar mevcut kayıttan gelir.
 const wallet=[['Altın','gold',state.gold,1342,43],['Elmas','gem',state.gems,1429,47],['Kristal','crystal',state.crystals||0,1518,40],['Enerji','energy',energyNow(state),1602,48]];
 body+=wallet.map(([name,action,value,x,w])=>{const number=profileNumber(value),size=Math.min(1.75,w/(Math.max(1,number.length)*.62*16.72));return refButton(name,action,x,21,w,34,'','<span class="sandikWalletNumber" style="font-size:'+size+'cqw">'+number+'</span>');}).join('');
 body+='<div class="sandikCards" role="group" aria-label="Sandıklar">';
 EKONOMI.marketSandiklari.forEach((item,i)=>{
  const [x,y,w,h]=marketChestRects[i],active=item.id===selected.id,used=item.daily&&state.marketDailyChest===rewardDay();
  let content='';
  // Kristal kartındaki çizilmiş seçimi, başka kart seçilince nötr çerçeveye al.
  if(i===8&&!active)content+='<span class="sandikCrystalNeutral">'+refCrop(marketChestPicture,662,637,225,191)+'</span>';
  if(i===0)content+='<span class="sandikDailyName">'+safeText(item.short)+'</span><span class="sandikPrice sandikDailyPrice">'+(used?'Alındı':'1 altın')+'</span>';
  else content+='<span class="sandikPrice sandikPrice-'+i+'">'+marketChestGem()+'<b>'+item.cost.gems+'</b></span>';
  if(active&&i!==8)content+='<span class="sandikSelection" aria-hidden="true"></span>';
  content+='<span class="screenReader">'+safeText(item.name)+(item.daily?(used?' · Bugün alındı':' · Günde bir · 1 altın'):' · 1 elmas')+'</span>';
  body+=refButton(item.name,'marketChestPick',x,y,w,h,'data-id="'+item.id+'" aria-pressed="'+active+'"',content);
 });
 body+='</div>';
 // İlk görünümde Kristal sandığın büyük çizimi doğrudan referansın kendisidir.
 if(index!==8){
  const [ax,ay,aw,ah]=marketChestArtRects[index];
  body+='<div class="sandikHeroSurface" '+refAt(937,177,638,528)+' aria-hidden="true"><div class="sandikHeroGlow sandikTone-'+index+'"></div><div class="sandikHeroArt">'+refCrop(marketChestPicture,ax,ay,aw,ah)+'</div></div>';
 }
 body+=refButton(selected.name+' içeriği','marketChestInfo',1518,185,45,43);
 body+=refButton('Adedi azalt','marketChestQuantity',1016,748,48,48,'data-step="-1" '+(marketChestQuantity<=1?'disabled':''))
  +refValue(marketChestQuantity,1065,752,71,39,'sandikQuantity')
  +refButton('Adedi artır','marketChestQuantity',1136,748,48,48,'data-step="1" '+(selected.daily||marketChestQuantity>=20?'disabled':''));
 const label=claimed?'BUGÜN ALINDI':selected.daily?'SANDIĞI AÇ · 1 ALTIN':'SANDIĞI AÇ';
 body+=refButton(label,'marketChestOpen',1224,742,338,62,
  (blocked?'disabled ':'')+'title="'+(claimed?'Gece yarısı yenilenir.':!afford(state,cost)?'Yetersiz elmas':selected.daily?'Günlük sandık · 1 altın':marketChestQuantity+' elmas')+'"',
  '<span class="sandikOpenState '+(blocked?'blocked':'')+'">'+(selected.daily?'<span>'+label+'</span>':'')+'</span>');
 return '<section class="refViewport" aria-label="Market · Sandıklar"><div class="refScreen ref-market refChestMarket">'+body+'</div></section>';
}
async function marketChestAction(action,el){
 if(!action.startsWith('marketChest'))return false;
 const d=el.dataset||{};
 if(action==='marketChestPick'){
  if(EKONOMI.marketSandiklari.some(v=>v.id===d.id)){marketChestSelected=d.id;marketChestQuantity=1;render();}
  return true;
 }
 if(action==='marketChestQuantity'){
  const step=Number(d.step);if(![-1,1].includes(step))return true;
  marketChestQuantity=marketChestItem().daily?1:Math.max(1,Math.min(20,marketChestQuantity+step));render();return true;
 }
 if(action==='marketChestInfo'){
  const item=marketChestItem(),row=chestLine.find(v=>v[0]===item.profile);
  const rewards=item.daily?{gold:EKONOMI.erzakSandigi.gold,feed:EKONOMI.erzakSandigi.feed}:{eggs:row[0]==='uber'?3:1,feather:row[0]==='uber'?3:1};
  const n=item.daily?1:row[3];
  openModal(item.name,'<p>'+n+' ekipman</p>'+uiRewards(rewards)+(item.daily?'<p>Günde bir kez, 1 altın. Gece yarısı yenilenir.</p>':'<p>Bir sandık: '+item.cost.gems+' elmas.</p>'));return true;
 }
 if(action==='marketChestOpen'){
  const id=marketChestItem().id,count=marketChestQuantity;let result=false;
  await changeState(s=>{result=marketSandikAc(s,id,count);return !!result;});
  if(state.fight)return true;
  if(!result){toast(marketChestItem().daily?(state.marketDailyChest===rewardDay()?'Günlük sandık bugün alındı.':'Yetersiz altın.'):'Yetersiz elmas.');return true;}
  openModal(result.name,'<div class="sandikRewards">'+uiRewards(result.reward)+result.items.map(g=>'<div>'+gearCell(g)+'<span>'+safeText(gearName(g))+'</span></div>').join('')+'</div>');
  return true;
 }
 return false;
}

const marketShopPicture='market_magaza_20261113';
let marketShopCategory='Tümü',marketShopCurrency='all',marketShopSelected='feed',marketShopQuantity=1;
function marketShopItems(){return EKONOMI.marketUrunleri.filter(v=>!v.section&&(marketShopCategory==='Tümü'||v.category===marketShopCategory)&&(marketShopCurrency==='all'||v.currency===marketShopCurrency));}
function marketShopIcon(item){if(item.section)return marketSecondaryIcon(item);return refCrop(marketShopPicture,[75,346,602,858,1115,1370][item.index%6],246+Math.floor(item.index/6)*145,110,112);}
function marketShopPrice(item,count=1){return glyph(item.currency==='gold'?'coin':'gem')+'<b>'+count+'</b>';}
function marketShopPage(){
 const items=marketShopItems(),selected=items.find(v=>v.id===marketShopSelected)||items[0];
 if(selected)marketShopSelected=selected.id;
 let body=currencyPlate(marketShopPicture)+refButton('Geri','back',25,9,61,58);
 body+=marketNavigation();
 body+=[['Altın','gold',state.gold,1340],['Elmas','gem',state.gems,1430],['Kristal','crystal',state.crystals||0,1519],['Enerji','energy',energyNow(state),1605]].map(([name,action,n,x])=>refButton(name,action,x,20,47,36,'','<span class="shopWallet">'+profileNumber(n)+'</span>')).join('');
 body+=[['Tümü',220,164],['Kaynak',390,174],['Geliştirme',575,184],['İksir',773,162],['Özel',947,161]].map(([name,x,w])=>refButton(name,'marketShopFilter',x,153,w,43,'data-key="'+name+'" aria-pressed="'+(name===marketShopCategory)+'"','<span class="shopFilter '+(name===marketShopCategory?'selected':'')+'">'+(name==='Tümü'?'':glyph({Kaynak:'ore',Geliştirme:'hammer','İksir':'potion','Özel':'star'}[name]))+name+'</span>')).join('');
 body+=refButton('Para birimi','marketShopCurrency',1242,153,252,43,'','<span class="shopFilter">'+({all:'Altın / Elmas',gold:'Altın',gems:'Elmas'}[marketShopCurrency])+glyph('swap')+'</span>');
 body+='<div class="shopGrid" '+refAt(63,232,1548,565)+'>'+items.map(item=>tag('<span class="shopArt">'+marketShopIcon(item)+'</span><span class="shopName">'+safeText(item.name)+'</span><span class="shopPrice">'+marketShopPrice(item)+'</span>','marketShopPick','data-id="'+item.id+'" aria-label="'+item.name+' · 1 '+(item.currency==='gold'?'altın':'elmas')+'" aria-pressed="'+(selected?.id===item.id)+'"','shopCard'+(selected?.id===item.id?' selected':''))).join('')+'</div>';
 body+=refButton('Yukarı kaydır','marketShopScroll',1618,233,30,29,'data-step="-1"')+refButton('Aşağı kaydır','marketShopScroll',1618,773,30,29,'data-step="1"');
 body+='<div class="shopSelected" '+refAt(151,819,620,69)+'>'+(selected?'<span>'+marketShopIcon(selected)+'</span><b>'+safeText(selected.name)+'</b>':'')+'</div>';
 body+=refButton('Adedi azalt','marketShopQuantity',900,830,48,48,'data-step="-1" '+(marketShopQuantity<=1?'disabled':''))+refValue(marketShopQuantity,952,835,68,38,'shopQuantity')+refButton('Adedi artır','marketShopQuantity',1022,830,48,48,'data-step="1" '+(marketShopQuantity>=999?'disabled':''));
 body+=refButton('SATIN AL','marketShopBuy',1165,827,360,54,(!selected||!afford(state,marketUrunBedeli(selected,marketShopQuantity))?'disabled':''),'<span class="shopBuy">SATIN AL '+(selected?marketShopPrice(selected,marketShopQuantity):'')+'</span>');
 return '<section class="refViewport" aria-label="Market · Mağaza"><div class="refScreen ref-market refShopMarket">'+body+'</div></section>';
}
async function marketShopAction(action,el){
 if(!action.startsWith('marketShop'))return false;
 const d=el.dataset||{};
 if(action==='marketShopScroll'){document.querySelector('.shopGrid')?.scrollBy({top:Number(d.step)*150,behavior:'smooth'});return true;}
 if(action==='marketShopFilter'){if(['Tümü','Kaynak','Geliştirme','İksir','Özel'].includes(d.key))marketShopCategory=d.key;marketShopQuantity=1;}
 if(action==='marketShopCurrency'){marketShopCurrency={all:'gold',gold:'gems',gems:'all'}[marketShopCurrency];marketShopQuantity=1;}
 if(action==='marketShopPick'&&marketShopItems().some(v=>v.id===d.id)){marketShopSelected=d.id;marketShopQuantity=1;}
 if(action==='marketShopQuantity'&&[-1,1].includes(Number(d.step)))marketShopQuantity=Math.max(1,Math.min(999,marketShopQuantity+Number(d.step)));
 if(action==='marketShopBuy'){
  const id=marketShopSelected,count=marketShopQuantity,item=marketShopItems().find(v=>v.id===id);if(!item)return true;
  let bought=false;await changeState(s=>{bought=marketUrunAl(s,id,count);return bought;});
  toast(bought?count+' '+item.name+' alındı.':'Satın alınamadı.');return true;
 }
 render();return true;
}

function marketSecondaryPicture(section){return section==='Arena'?'market_arena_20261113':'market_lonca_20261113';}
function marketSecondaryIcon(item){
 const arena=item.section==='Arena',col=item.index%(arena?4:2),row=Math.floor(item.index/(arena?4:2));
 return arena?refCrop(marketSecondaryPicture(item.section),384+col*301,224+row*223,238,131):refCrop(marketSecondaryPicture(item.section),132+col*735,320+row*180,185,137);
}
let marketSecondaryCategory={Arena:'Tümü',Lonca:'Tümü'};
function marketSecondaryItems(section=marketTab,category=marketSecondaryCategory[section]){return EKONOMI.marketUrunleri.filter(v=>v.section===section&&(category==='Tümü'||v.category===category));}
function marketSecondaryPage(){
 const arena=marketTab==='Arena',items=marketSecondaryItems(),category=marketSecondaryCategory[marketTab];
 let body=currencyPlate(marketSecondaryPicture(marketTab))+refButton('Geri','back',25,9,61,58)+marketNavigation();
 body+=[['Altın','gold',state.gold,1340],['Elmas','gem',state.gems,1430],['Kristal','crystal',state.crystals||0,1519],['Enerji','energy',energyNow(state),1605]].map(([name,action,n,x])=>refButton(name,action,x,20,47,36,'','<span class="secondaryWallet">'+profileNumber(n)+'</span>')).join('');
 const filters=EKONOMI.marketKategorileri.map(name=>tag(glyph({Tümü:'bag',Ekipman:'sword',Malzeme:'hammer','Özel':'star'}[name])+name,'marketSecondaryFilter','data-key="'+name+'" aria-pressed="'+(name===category)+'"','secondaryFilter'+(name===category?' selected':''))).join('');
 body+=collectionPanel(filters,...(arena?[103,247,183,299]:[140,196,978,60]),'secondaryFilters '+(arena?'vertical':''));
 if(arena)body+=refValue(profileNumber(state.gold),1158,174,101,28,'secondaryNumber');
 else body+=refValue(profileNumber(state.guildCoin||0),1420,87,108,29,'secondaryNumber');
 body+=refValue('Sınırsız stok',arena?1334:1338,arena?166:205,249,44,'secondaryNumber');
 const cards=items.map(item=>'<article class="secondaryCard"><button class="secondaryItemArt" data-act="marketSecondaryPreview" data-id="'+item.id+'" aria-label="'+safeText(item.name)+' ayrıntıları">'+marketSecondaryIcon(item)+'</button><div class="secondaryItemInfo"><h3>'+safeText(item.name)+'</h3><span class="secondaryItemPrice">'+marketShopPrice(item)+'</span>'+tag('AL','marketSecondaryBuy','data-id="'+item.id+'" aria-label="'+safeText(item.name)+' al" '+(afford(state,item.cost)?'':'disabled'),'secondaryItemBuy')+'</div></article>').join('');
 body+=collectionPanel(cards||'<p class="secondaryEmpty" role="status">Bu kategoride ürün yok.</p>',...(arena?[300,221,1295,648]:[109,292,1497,541]),'secondaryGrid '+(arena?'arenaGrid':'guildGrid'));
 return '<section class="refViewport" aria-label="Market · '+marketTab+'"><div class="refScreen ref-market refSecondaryMarket">'+body+'</div></section>';
}
async function marketSecondaryAction(action,el){
 if(!action.startsWith('marketSecondary'))return false;
 if(action==='marketSecondaryFilter'){if(EKONOMI.marketKategorileri.includes(el.dataset.key)){marketSecondaryCategory[marketTab]=el.dataset.key;render();}return true;}
 const item=EKONOMI.marketUrunleri.find(v=>v.section&&v.id===el.dataset.id);if(!item)return true;
 if(action==='marketSecondaryPreview'){
  openModal(item.name,'<div class="secondaryPreview">'+marketSecondaryIcon(item)+'<span>'+glyph('coin')+' 1</span></div>',tag('AL','marketSecondaryBuy','data-id="'+item.id+'" '+(afford(state,item.cost)?'':'disabled'),'action'));return true;
 }
 if(action==='marketSecondaryBuy'){
  let bought=false;await changeState(s=>{bought=marketUrunAl(s,item.id,1);return bought;});
  if(bought)modal.close();toast(bought?item.name+' alındı.':'Satın alınamadı.');return true;
 }
 return false;
}
