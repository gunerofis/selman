for(let n=1;n<=6;n++)document.documentElement.style.setProperty('--scene_'+n,'url('+ART['scene_'+n]+')');
document.documentElement.style.setProperty('--objects','url('+ART.objects+')');
// Scene-based hub destinations. Gameplay and persistence stay in the existing engine.
const roomBanks={forge:[1,0],equip:[1,1],market:[1,2],bag:[1,3],pet:[2,0],wings:[2,1],charm:[2,2],auras:[2,3],relic:[3,0],titles:[3,1],profile:[3,2],rank:[3,3],av:[4,0],map:[4,1],boss:[4,2],arena:[4,3],guild:[5,0],casino:[5,1],events:[5,2],gold:[5,3],energy:[6,0],mail:[6,1],notices:[6,2],settings:[6,3]};
const roomSelection={goods:'ore',bag:'item_dagger',boss:0,pet:'ak',wings:'turna',charm:'tas',titles:'gecit',auras:'yaprak'};
const glyphPaths={
 edit:'m4 16 12-12 4 4-12 12-5 1Zm10-10 4 4M3 21h18',trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
 potion:'M9 2h6m-5 0v7l-5 9c-1 2 0 4 2 4h10c2 0 3-2 2-4l-5-9V2M8 15h8',
 back:'M15 5 8 12l7 7M8 12h13',next:'m9 5 7 7-7 7M3 12h13',check:'m5 12 5 5L20 6',
 sword:'m5 19 3-3m-3-3 6 6m-3-3L18 4l2-1-1 3L8 16',heart:'M12 20S2 14 3 8c1-5 7-5 9-1 2-4 8-4 9 1 1 6-9 12-9 12Z',
 shield:'M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6Z',star:'m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z',
 lock:'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Zm7 4v3',coin:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 8h6v8H9Z',
 gem:'m3 8 5-5h8l5 5-9 13Zm0 0h18M8 3l4 18 4-18',energy:'m14 2-9 12h6l-1 8 9-13h-6Z',
 chest:'M3 10V8c0-7 18-7 18 0v2M3 10h18v11H3Zm7-2h4v6h-4Z',ore:'m3 19 2-10 7-7 7 4 3 13ZM5 9l7 4 7-7m-7 7v8',
 leaf:'M20 3C5 2 1 8 5 15s15 4 15-12ZM4 21 17 6',wing:'M3 18C3 7 12 4 21 3c-2 7-6 15-18 15Zm1-1L18 6M8 15l3 3m1-7 3 4',
 paw:'M7 13c-6 8 16 8 10 0-4-5-6-5-10 0ZM5 5v3m5-6v5m5-5v5m5-2v3',crown:'m3 7 5 4 4-8 4 8 5-4-2 12H5Zm2 12h14',
 ring:'M19 15a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM8 5l4-3 4 3-4 5Z',aura:'M21 13c0 4-4 7-9 7s-9-3-9-7 4-7 9-7 9 3 9 7Zm-15 0c0 2 3 4 6 4s6-2 6-4M12 2v7',
 mail:'M3 5h18v14H3Zm0 0 9 8 9-8',bell:'M5 17h14l-2-4V8a5 5 0 0 0-10 0v5Zm4 3h6',
 gear:'M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
 map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16',flag:'M5 22V3c6-4 8 4 15 0v11c-7 4-9-4-15 0',
 trophy:'M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3c0 4 4 4 5 4m9-7h4v3c0 4-4 4-5 4m-4 3v6m-5 0h10',
 hammer:'m4 20 9-9m-4-7 4-3 8 8-3 4ZM3 18l3 3',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 10v7m0-11v1',swap:'M3 7h17l-4-4M21 17H4l4 4',
 bag:'M7 7V5a5 5 0 0 1 10 0v2M4 7h16l2 14H2Zm4 4v5m8-5v5',moon:'M20 16A9 9 0 0 1 8 3a9 9 0 1 0 12 13Z',
 dice:'M4 3h16v18H4Zm4 4h.1m7 0h.1M12 12h.1M8 17h.1m7 0h.1',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v6l4 2',
 book:'M3 3h7l2 3 2-3h7v17h-7l-2 2-2-2H3Zm9 3v16',motion:'M3 8h12l-4-4m10 12H9l4 4'
};
function glyph(key){return '<svg viewBox="0 0 24 24" aria-hidden="true" class="glyph"><path d="'+(glyphPaths[key]||glyphPaths.star)+'"/></svg>';}
function safeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const roomIcons={feather:'wing',eggs:'paw',gold:'coin',gems:'gem',crystals:'gem',ore:'ore',feed:'leaf',shards:'star',chests:'chest',xp:'star',arenaCoin:'sword',guildCoin:'flag',energy:'energy'};
const roomIconAssets={gold:'rw_gold',gems:'rw_gem',crystals:'rw_gem',chests:'rw_chest',xp:'rw_star',ore:'res_ore',feed:'res_feed',shards:'res_shard',feather:'res_feather',eggs:'res_egg',arenaCoin:'res_arena',guildCoin:'res_guild',ticket:'res_ticket'};
const roomSprites={item_kilic:0,item_dagger:1,ore:2,feed:3,chests:4,gems:5,crystals:5,tas:6,av:7,tilki:8,turna:9,kuzgun:10,seal:11};
function roomSprite(key){const n=roomSprites[key];return '<span class="roomSprite" aria-hidden="true" style="--object-x:'+((n%4)/3*100)+'%;--object-y:'+(Math.floor(n/4)/2*100)+'%"></span>';}
function drawRoomSprite(c,key,x,y,w,h){const p=images.objects;if(p?.complete&&p.naturalWidth){const n=roomSprites[key],sw=p.naturalWidth/4,sh=p.naturalHeight/3;c.drawImage(p,n%4*sw,Math.floor(n/4)*sh,sw,sh,x,y,w,h);}}
function objectArt(key,cls=''){if(Object.hasOwn(roomSprites,key))return roomSprite(key);const name=roomIconAssets[key]||key,src=ART['icon_'+name]||ART[name];return src?'<img class="objectArt '+cls+'" src="'+src+'" alt="">':glyph(roomIcons[key]||key);}
function lootMedals(values){return '<div class="lootMedals">'+Object.entries(values).filter(([,n])=>n>0).map(([k,n])=>'<span title="'+n+' '+(moneyNames[k]||k)+'" aria-label="'+n+' '+(moneyNames[k]||k)+'">'+glyph(roomIcons[k]||'star')+'<b>'+n+'</b></span>').join('')+'</div>';}
function roomPill(icon,value,label=''){return '<span class="roomPill"'+(label?' title="'+safeText(label)+'"':'')+'>'+glyph(icon)+'<b>'+safeText(value)+'</b></span>';}
function roomOrb(label,action,data='',icon='star',selected=false,caption=true){return tag('<span class="orbFace">'+glyph(icon)+'</span>'+(caption?'<span class="orbCaption">'+safeText(label)+'</span>':'<span class="screenReader">'+safeText(label)+'</span>'),action,data+' aria-label="'+safeText(label)+'"'+(['roomSelect','marketTab','bossTab','rival','profileTab'].includes(action)?' aria-pressed="'+selected+'"':''),'roomOrb'+(selected?' selected':''));}
function roomAction(label,action,attrs='',secondary=false){return tag(label,action,attrs,secondary?'roomAction secondary':'roomAction');}
function roomDock(content){return '<div class="roomDock">'+content+'</div>';}
function roomHeading(title,sub=''){return '<div class="roomHeading"><h3>'+safeText(title)+'</h3>'+(sub?'<p>'+safeText(sub)+'</p>':'')+'</div>';}
function roomCanvas(kind='hero'){return '<canvas id="venueCanvas" class="roomActor actor-'+kind+'" aria-label="'+(kind==='pet'?'Seçili yoldaş':'Karakter önizlemesi')+'"></canvas>';}
function artVenueShell(key,title,body,extra=''){
 const [bank,tile]=roomBanks[key],surface=venues[key][1];
 return '<section class="venue venue-'+key+' surface-'+surface+' artRoom '+extra+'" aria-label="'+safeText(title)+'" style="--atlas:var(--scene_'+bank+');--tile-x:'+(tile%2?100:0)+'%;--tile-y:'+(tile>1?100:0)+'%"><div class="roomScenery" aria-hidden="true"></div><div class="roomVeil" aria-hidden="true"></div><div class="roomTop">'+tag(glyph('back'),'back','aria-label="Geri"','roomBack')+'<h2>'+safeText(title)+'</h2></div><div class="roomStage">'+body+'</div></section>';
}
function roomTabs(names,selected,action,icons=[]){return '<nav class="roomTabs" aria-label="Bölümler">'+names.map((n,i)=>roomOrb(n,action,'data-key="'+n+'"',icons[i]||'star',selected===n)).join('')+'</nav>';}
function roomInfo(title,text){return roomOrb(title,'roomInfo','data-title="'+safeText(title)+'" data-text="'+safeText(text)+'"','info',false,false);}
function collectionChoice(key){return collections[key].find(r=>r[0]===roomSelection[key])||collections[key][0];}
function roomCollect(key){
 const [id,name,desc,cost]=collectionChoice(key),owned=state.unlocks.includes(id),on=state.slots[key]===id,ready=key!=='titles'||titleReady(state,id);
 const icon={pet:'paw',wings:'wing',charm:'ring',titles:'crown',auras:'aura'}[key];
 const choices='<div class="selectionRail">'+collections[key].map(([v,n])=>roomOrb(n,'roomSelect','data-group="'+key+'" data-key="'+v+'"',icon,v===id)).join('')+'</div>';
 let focus=['pet','wings','auras'].includes(key)?roomCanvas(key==='pet'?'pet':'hero'):'<div class="relicObject '+key+'-object">'+(key==='charm'?roomSprite(id):glyph(icon))+'</div>';
 const condition=key==='titles'?({gecit:'Köy 1-3',duello:'1 Arena zaferi',fatih:'Seferi tamamla'})[id]:'';
 let detail=roomHeading(name,desc)+(owned?'':lootMedals(cost))+(condition&&!owned?roomPill(ready?'check':'lock',condition):'');
 let actions=roomAction(on?'Kuşanıldı':owned?'Kuşan':ready?'Aç ve kuşan':'Kilitli','collectItem','data-key="'+key+'" data-id="'+id+'" '+(on||!owned&&(!ready||!afford(state,cost))?'disabled':''));
 if(key==='pet'&&id==='ak'){detail+='<div class="trainingArc">'+roomPill('paw',state.training+' / 3','Eğitim')+roomPill('leaf',state.feed,'Yem')+'</div>';actions+=roomAction('Eğit','trainPet',state.feed<1||state.training>=3?'disabled':'',true);}
 else if(key!=='pet'&&state.slots[key])actions+=roomAction('Çıkar','removeSlot','data-key="'+key+'"',true);
 return artVenueShell(key,titleOf[key],choices+focus+'<div class="focusDetails">'+detail+'</div>'+roomDock(actions));
}
function roomForge(){
 const offer=upgradeOffer(state),level=state.upgrades.item_kilic||0,has=state.items.includes('item_kilic');
 const marks='<div class="forgeMarks" aria-label="Seviye '+level+' / 2">'+[0,1,2].map(n=>'<span class="'+(has&&n<=level?'lit':'')+'">'+glyph('moon')+'</span>').join('')+'</div>';
 return artVenueShell('forge','Demirci','<div class="forgeWeapon">'+roomSprite('item_kilic')+'</div>'+marks+'<div class="focusDetails">'+roomHeading(weaponName('item_kilic'),!has?'Köy girişinde kazanılır':offer?'':'En yüksek seviye')+roomPill('sword','+'+bonus(state,'item_kilic')+(offer?' → +'+(bonus(state,'item_kilic')+2):''),'Silah bonusu')+(offer?lootMedals({gold:offer.gold,ore:offer.ore}):'')+'</div><div class="materialTray">'+roomPill('coin',state.gold,'Altın')+roomPill('ore',state.ore,'Cevher')+'</div>'+roomDock(roomAction(offer?'Yükselt':'Yükseltildi','upgrade','data-level="'+level+'" '+(!canForge(state,offer)?'disabled':''))+roomOrb('Sefer','map','','map')+(level===1?roomOrb('Cevher avı','av','','ore'):'')));
}
const marketShelves={Mağaza:['ore','ration'],Sandıklar:['chest'],Arena:['arena'],Lonca:['guild']};
const goodsVisual={ore:'ore',ration:'feed',chest:'chests',gems:'gems',arena:'chests',guild:'chests'};
function roomMarket(){
 const keys=marketShelves[marketTab]||marketShelves.Mağaza,selected=keys.includes(roomSelection.goods)?roomSelection.goods:keys[0],g=goods[selected];
 const shelf='<div class="marketObjects">'+keys.map(k=>tag('<span class="merchObject">'+objectArt(goodsVisual[k])+'</span><span class="objectName">'+goods[k].name+'</span>'+lootMedals(goods[k].cost),'roomSelect','data-group="goods" data-key="'+k+'" aria-pressed="'+(k===selected)+'"','marketObject'+(k===selected?' selected':''))).join('')+'</div>';
 let dock=lootMedals(g.gain)+roomAction('Al','buy','data-key="'+selected+'" '+(!afford(state,g.cost)?'disabled':''));
 if(marketTab==='Sandıklar')dock+=roomAction('Sandık aç · '+state.chests,'openChest',state.chests<1?'disabled':'',true);
 return artVenueShell('market','Market',roomTabs(Object.keys(marketShelves),marketTab,'marketTab',['bag','chest','swap','sword','flag'])+shelf+roomDock(dock));
}
function roomBag(){
 const pockets=[...weapons().map(k=>[k,weaponName(k),1]),['ore','Cevher',state.ore],['feed','Yem',state.feed],['shards','Kalıntı parçası',state.shards],['chests','Sandık',state.chests]];
 const choice=pockets.find(([k])=>k===roomSelection.bag)||pockets[0],k=choice[0],isWeapon=weapons().includes(k);
 const draw=v=>objectArt(v);
 const grid='<div class="satchelSlots">'+pockets.map(([v,n,count])=>tag(draw(v)+'<b>'+count+'</b><span>'+safeText(n)+'</span>','roomSelect','data-group="bag" data-key="'+v+'" aria-label="'+safeText(n)+'" aria-pressed="'+(v===k)+'"','satchelSlot'+(v===k?' selected':''))).join('')+'</div>';
 const action=isWeapon?roomAction('Ekipmanda incele','bagPick','data-key="'+k+'"'):k==='chests'?roomAction('Sandık aç','openChest',state.chests<1?'disabled':''):roomAction(k==='feed'?'Petler':k==='shards'?'Kalıntılar':'Demirci',k==='feed'?'pet':k==='shards'?'relic':'forge');
 return artVenueShell('bag','Çanta',grid+'<div class="bagPreview">'+draw(k)+roomHeading(choice[1],String(choice[2]))+'</div>'+roomDock(action));
}
function roomRelic(){const filled=state.relicActive?6:Math.min(6,state.shards);const seal='<div class="livingSeal" aria-label="'+filled+' / 6 mühür parçası"><div>'+roomSprite('seal')+'<b>'+filled+' / 6</b></div>'+Array.from({length:6},(_,i)=>'<span class="sealShard '+(i<filled?'filled':'')+'" style="--n:'+i+'">'+glyph('gem')+'</span>').join('')+'</div>';return artVenueShell('relic','Kalıntılar',seal+'<div class="focusDetails">'+roomHeading('Kırık Mühür','Kalıcı +3 can')+roomPill('heart',healthOf(state),'Azami can')+roomPill('star',state.shards,'Kalıntı parçası')+'</div>'+roomDock(roomAction(state.relicActive?'Mühür etkin':'Birleştir','makeRelic',state.relicActive||!afford(state,{shards:6})?'disabled':'')+roomOrb('Bölge Bossu','boss','','shield')));}
function roomPicker(r,action){return '<div class="roomRegion">'+roomOrb('Önceki bölge',action,'data-i="'+(r-1)+'" '+(!r?'disabled':''),'back',false,false)+'<span><b>'+regions[r][0]+'</b><small>'+(r+1)+' / '+regions.length+'</small></span>'+roomOrb('Sonraki bölge',action,'data-i="'+(r+1)+'" '+(r===regions.length-1?'disabled':''),'next',false,false)+'</div>';}
function roomEnemyCard(e){return '<div class="enemyToken">'+glyph(enemyInfo[e.id]?.form==='beast'?'paw':'shield')+'<span>'+foeNames[e.id]+'</span><small>'+e.hp+' '+glyph('heart')+'</small></div>';}
function roomCampaign(){
 const r=regionOf(chosenStage),indices=route.slice(r*3,r*3+3),enc=encounters[chosenStage],first=!state.cleared.includes(enc.id),open=allowed(chosenStage,state);
 const reward={gold:first?enc.gold:BALANCE.repeatGold,xp:first?enc.xp:BALANCE.repeatXp};if(first&&enc.kind==='campaign'){reward.gems=1;if(enc.final)reward.chests=1;}
 const nodes='<div class="mapRoute">'+indices.map((id,j)=>{const done=state.cleared.includes(encounters[id].id),can=allowed(id,state);return tag('<span class="orbFace">'+glyph(done?'check':can?(j===2?'shield':'sword'):'lock')+'</span><b>'+encounters[id].id+'</b><small>'+routeName(id)+'</small>','selectStage','data-i="'+id+'" aria-pressed="'+(id===chosenStage)+'"','mapNode node-'+j+(id===chosenStage?' selected':'')+(!can?' locked':''));}).join('')+'</div>';
 return artVenueShell('map','Sefer',roomPicker(r,'regionPick')+'<span class="screenReader">'+regions[r][0]+' yolu</span>'+nodes+'<div class="mapEncounter">'+roomHeading(routeName(chosenStage))+enc.enemies.map(roomEnemyCard).join('')+(enc.tactic!==undefined?roomInfo(tactics[enc.tactic][0],tactics[enc.tactic][1]):'')+'</div>'+roomDock(lootMedals(reward)+roomAction(open?'Başla':'Kilitli','start',open?'':'disabled')+roomOrb('Ekipman','equip','','sword')+roomOrb('Demirci','forge','','hammer')));
}
function roomHunt(){const r=selectedHuntRegion,i=huntingGrounds[r],open=allowed(i,state);return artVenueShell('av','Av',roomPicker(r,'huntRegion')+roomCanvas()+'<div class="huntTargets">'+encounters[i].enemies.map(roomEnemyCard).join('')+'</div><div class="materialTray">'+roomPill('energy','2','Av giriş bedeli')+'<small id="energyInline">'+energyLabel(state)+'</small></div>'+roomDock(roomAction(open?'Ava Çık':'Kilitli','startHunt',!open||(!developerFree(state)&&energyNow(state)<huntCost)?'disabled':'')+roomInfo('Ganimet','Her hedef 5 altın ve 1 cevher. Tam avda 1 ek cevher.')+roomOrb('Demirci','forge','','hammer')));}
function bossIndices(){return bossTab==='Bölge'?bossLadders[selectedBossRegion]:trials[bossTab==='Günlük'?'daily':'world'];}
function chosenBoss(){const ids=bossIndices();return ids.includes(roomSelection.boss)?roomSelection.boss:ids.find(i=>allowed(i,state))??ids[0];}
function roomBoss(){
 const ids=bossIndices(),idx=chosenBoss(),e=encounters[idx],open=allowed(idx,state),used=dayBook(state).used[e.kind]||0,left=quotas[e.kind]?Math.max(0,quotas[e.kind]-used):null;
 const choices='<div class="bossChoices">'+ids.map((i,j)=>tag('<span class="orbFace">'+glyph(allowed(i,state)?'shield':'lock')+'</span><span class="orbCaption">'+(j+1)+'</span>','roomBossSelect','data-i="'+i+'" aria-label="'+safeText(routeName(i))+'" aria-pressed="'+(i===idx)+'"','roomOrb'+(i===idx?' selected':''))).join('')+'</div>';
 const paid=(idx===BRIDGE?state.bossPaidDay:state.dailyBossDays[regionalKey(e)])===rewardDay(),rewards=bossTab==='Bölge'?(paid?{gold:10}:{shards:3}):bossTab==='Günlük'?{crystals:4}:{shards:1};
 const action=idx===BRIDGE?roomAction('Meydan Oku','startBoss',open?'':'disabled'):roomAction('Meydan Oku','trialStart','data-i="'+idx+'" '+(!open||left===0?'disabled':''));
 return artVenueShell('boss','Boss',roomTabs(['Bölge','Günlük','Dünya'],bossTab,'bossTab',['shield','clock','star'])+(bossTab==='Bölge'?roomPicker(selectedBossRegion,'bossRegion'):'')+choices+roomCanvas('enemy')+'<div class="focusDetails">'+roomHeading(routeName(idx),open?'':'Önceki karşılaşmayı tamamla')+roomPill('heart',e.enemies[0].hp,'Can')+(left!==null?roomPill('clock',left+' / '+quotas[e.kind],'Kalan hak'):'')+'</div>'+roomDock(lootMedals(rewards)+action+roomOrb('Kalıntılar','relic','','star')));
}
function roomArena(){const idx=trials.arena[rival],op=encounters[idx];return artVenueShell('arena','Arena',roomCanvas('versus')+'<div class="duelNames"><div>'+roomHeading('Kahraman')+roomPill('heart',healthOf(state))+'</div><span>'+glyph('sword')+'</span><div>'+roomHeading(op.title)+roomPill('heart',op.enemies[0].hp)+'</div></div>'+roomTabs(trials.arena.map(routeName),op.title,'rival',['shield','sword','crown'])+'<div class="materialTray">'+roomPill('trophy',state.stats.rating||0,'Puan')+roomPill('coin',state.arenaCoin,'Arena jetonu')+'<small>Yerel antrenman · 1v1</small></div>'+roomDock(roomAction('Düello','trialStart','data-i="'+idx+'"')+roomOrb('Mağaza','arenaStore','','bag')+roomInfo('Arena','30 saniye sonunda can yüzdesi yüksek olan kazanır. İlk üç günlük galibiyet: 2 jeton.')));}
function roomGuild(){
 const title=roomHeading('Geçit Muhafızları','Yerel lonca');
 if(!state.guild)return artVenueShell('guild','Lonca','<div class="guildGreeting">'+glyph('flag')+title+'</div>'+roomDock(roomAction('Loncaya Katıl','joinGuild')));
 const opts=[['Boss','trialStart','data-i="'+trials.guildBoss[0]+'"','shield',trials.guildBoss[0]],['Sancak','trialStart','data-i="'+trials.guildWar[0]+'"','flag',trials.guildWar[0]],['Mağaza','guildStore','','bag',null]];
 return artVenueShell('guild','Lonca','<div class="guildGreeting">'+title+roomPill('coin',state.guildCoin,'Lonca jetonu')+roomPill('coin',state.donated,'Toplam bağış')+'</div><div class="guildActions">'+opts.map(([n,a,d,i,idx])=>{const kind=idx!==null?encounters[idx].kind:null;return roomOrb(n,a,d+(kind&&(dayBook(state).used[kind]||0)>=quotas[kind]?' disabled':''),i);}).join('')+'</div>'+roomDock(lootMedals({gold:20})+roomAction('Bağış','donate',state.gold<20?'disabled':'')+roomInfo('Lonca','Karşılaşmalar bu cihazda bilgisayar rakiplerine karşı oynanır. 20 altın bağış: 1 lonca jetonu.')));
}
function roomEvents(){const b=dayBook(state);return artVenueShell('events','Etkinlikler','<div class="questBanners">'+eventsList.map(([k,n,d,goal,g],i)=>{const count=Math.min(goal,eventCount(b,k)),done=b.flags[k];return '<article class="questBanner"><div class="questCrest">'+glyph(['paw','trophy','sword'][i])+'</div><h3>'+n+'</h3><div class="questProgress" style="--progress:'+count/goal*100+'%">'+count+' / '+goal+'</div>'+lootMedals(g)+roomAction(done?'Alındı':'Ödülü Al','claimEvent','data-key="'+k+'" '+(done||count<goal?'disabled':''))+roomInfo(n,d)+'</article>';}).join('')+'</div><span class="dayStamp">'+b.date+'</span>');}
function roomRank(){const scores=[['Arena','sword',state.stats.rating||0],['Dünya Bossu','shield',state.stats.world||0],['Lonca','flag',state.stats.guildScore||0]],times=Object.entries(state.bestTimes).filter(([k])=>encounters[k]).sort((a,b)=>a[1]-b[1]).slice(0,8);return artVenueShell('rank','Kişisel Rekorlar','<div class="recordMedals">'+scores.map(([n,i,v])=>'<div>'+glyph(i)+'<b>'+v+'</b><span>'+n+'</span></div>').join('')+'</div><div class="personalTimes"><h3>En hızlı zaferler</h3>'+(times.length?times.map(([i,t],k)=>'<div><b>'+(k+1)+'</b><span>'+routeName(Number(i))+'</span><strong>'+seconds(t)+' sn</strong></div>').join(''):'<p>İlk zaferini bekliyor.</p>')+(state.log.length?'<h3 class=recentHeading>Son karşılaşmalar</h3>'+state.log.slice(0,5).map(r=>'<div><span>'+safeText(r.title)+'</span><strong>'+({win:'Zafer',lose:'Yenilgi',timeout:'Süre doldu',draw:'Beraberlik',exit:'Geri çekilme'}[r.end]||r.end)+'</strong></div>').join(''):'')+'</div>');}
function roomProfile(){
 const names=['Özet','İstatistikler','Başarımlar','Koleksiyon'],level=1+Math.floor(Math.sqrt(state.xp/100)),low=(level-1)**2*100,high=level**2*100;let content='';
 if(profileTab==='Koleksiyon')content='<div class="collectionList">'+weapons().map(k=>'<span>'+swordIcon(k)+weaponName(k)+'</span>').join('')+Object.values(collections).flat().filter(r=>state.unlocks.includes(r[0])).map(r=>'<span>'+glyph('star')+r[1]+'</span>').join('')+(state.relicActive?'<span>'+glyph('star')+'Kırık Mühür</span>':'')+[...new Set(state.seen||[])].map(id=>'<span>'+glyph('shield')+safeText(foeNames[id]||id)+'</span>').join('')+'</div>';
 else if(profileTab==='Başarımlar')content='<div class="achievementList">'+regions.map((r,i)=>'<span>'+glyph(state.cleared.includes((i+1)+'-3')?'check':'lock')+'<b>'+r[0]+'</b><small>'+route.slice(i*3,i*3+3).filter(j=>state.cleared.includes(encounters[j].id)).length+' / 3</small></span>').join('')+'</div>';
 else content='<div class="profileMedals">'+[['Güç','star',healthOf(state)+10*attack(state)],['Saldırı','sword',attack(state)],['Can','heart',healthOf(state)]].map(([n,i,v])=>'<div>'+glyph(i)+'<b>'+v+'</b><small>'+n+'</small></div>').join('')+'</div>'+roomHeading(weaponName(state.equipped),'Seviye '+level)+'<div class="xpTrack" role="progressbar" aria-label="Deneyim" aria-valuenow="'+state.xp+'" aria-valuemin="'+low+'" aria-valuemax="'+high+'"><i style="width:'+((state.xp-low)/(high-low)*100)+'%"></i></div><small>'+state.xp+' / '+high+' XP</small>';
 return artVenueShell('profile','Profil',roomCanvas()+'<div class="profileContent">'+content+'</div>'+roomTabs(names,profileTab,'profileTab',['eye','sword','trophy','book']));
}
function roomMail(){return artVenueShell('mail','Posta','<div class="letterContent">'+glyph('mail')+'<h3>Geçit Erzağı</h3><p>Yolculuğun için.</p>'+lootMedals({feed:1,gems:1})+'</div>'+roomDock(roomAction(state.mailTaken?'Alındı':'Al','claimMail',state.mailTaken?'disabled':'')));}
function roomNotices(){const b=dayBook(state),entries=[];if(!state.mailTaken)entries.push(['Erzak','mail','mail']);if(canForge(state,upgradeOffer(state)))entries.push(['Yükseltme','forge','hammer']);if(eventsList.some(([k,,,goal])=>!b.flags[k]&&eventCount(b,k)>=goal))entries.push(['Ödül','events','chest']);if(state.chests)entries.push(['Sandık · '+state.chests,'bag','chest']);return artVenueShell('notices','Bildirimler','<div class="noticeScrolls">'+(entries.length?entries.map(([n,k,i])=>tag(glyph(i)+'<b>'+n+'</b><span>'+glyph('next')+'</span>',k,'','noticeScroll')).join(''):'<div class="quietNotice">'+glyph('check')+'<span>Bekleyen ödül yok</span></div>')+'</div>');}
function roomUtility(key){
 if(key==='gold')return artVenueShell(key,'Altın','<div class="goldTotal">'+roomPill('coin',state.gold)+'</div><div class="mintLinks">'+roomOrb('Market','market','','bag')+roomOrb('Demirci','forge','','hammer')+'</div>');
 if(key==='settings')return artVenueShell(key,'Ayarlar','<div class="clockControls"><label>Hareket efektleri</label>'+tag(glyph('motion')+'<span class="toggleTrack '+(state.settings.motion?'on':'')+'"><i></i></span><b>'+(state.settings.motion?'Açık':'Kapalı')+'</b>','toggleMotion','role="switch" aria-checked="'+state.settings.motion+'" aria-label="Hareket efektleri"','motionControl')+'</div>');
 const n=energyNow(state);return artVenueShell(key,'Enerji','<div class="springRunes">'+Array.from({length:energyCap},(_,i)=>'<span class="'+(i<n?'lit':'')+'">'+glyph('energy')+'</span>').join('')+'</div><div class="energyReadout"><meter id="energyMeter" min="0" max="'+energyCap+'" value="'+n+'" aria-label="Enerji"></meter><h3 id="energyRoom">'+energyLabel(state)+'</h3></div>'+roomDock(roomAction('Ava Git','av')));
}
function renderArtVenue(key){if(collections[key])return roomCollect(key);const pages={forge:roomForge,equip:roomEquipment,market:roomMarket,bag:roomBag,relic:roomRelic,map:roomCampaign,av:roomHunt,boss:roomBoss,arena:roomArena,guild:roomGuild,events:roomEvents,rank:roomRank,profile:roomProfile,mail:roomMail,notices:roomNotices,casino:casinoPage};return pages[key]?pages[key]():roomUtility(key);}
function roomUiAction(action,el){const d=el.dataset;if(action==='roomSelect'){if(Object.hasOwn(roomSelection,d.group))roomSelection[d.group]=d.key;render();return true;}if(action==='roomBossSelect'){const i=Number(d.i);if(bossIndices().includes(i))roomSelection.boss=i;render();return true;}if(action==='roomInfo'){openModal(safeText(d.title),safeText(d.text));return true;}return false;}
function paintVenue(){
 if(paintCombat())return;
 const can=$('venueCanvas');if(!can||!['equip','pet','wings','auras','titles','profile','av','boss','arena'].includes(view))return;
 const {c,w,h}=context(can);c.clearRect(0,0,w,h);const size=Math.min(h*.92,w*.9),x=w*.5,y=h*.98;
 if(view==='pet'){if(collectionChoice('pet')[0]==='tilki')drawRoomSprite(c,'tilki',x-size*.5,y-size,size,size);else img(c,'companion',x-size*.34,y-size,size*.68,size);return;}
 if(view==='boss'){const e=encounters[chosenBoss()].enemies[0];figure(c,x,y,Math.min(h*.91,w*.7),e.id,0,0);return;}
 if(view==='arena'){heroArt(c,w*.25,y,size*.9,state.equipped);figure(c,w*.76,y,size*.9,encounters[trials.arena[rival]].enemies[0].id,0,0);return;}
 const actual=state;
 try{state={...actual,slots:{...actual.slots}};if(view==='wings'||view==='auras')state.slots[view]=collectionChoice(view)[0];const wing=state.slots.wings;if(wing&&!images['wing_'+wing]?.naturalWidth&&Object.hasOwn(roomSprites,wing)){drawRoomSprite(c,wing,x-size*.67,y-size*.99,size*1.34,size*1.03);state.slots.wings=null;}if(view!=='auras'||collectionPreviewVisible)drawAura(c,x,y,size);heroArt(c,x,y,size,view==='equip'?chosenWeapon:state.equipped);}finally{state=actual;}
}
