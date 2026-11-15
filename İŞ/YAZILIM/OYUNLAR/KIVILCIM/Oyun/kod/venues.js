// The location illustration and its working surface belong to the same hub destination.
const venues={
 market:['Kapalı çarşı','counter'],casino:['Oyun salonu','table'],guild:['Sancak salonu','hall'],
 forge:['Demirci ocağı','workshop'],events:['İlan meydanı','board'],rank:['Zafer merdivenleri','monument'],
 equip:['Silahlık','rack'],pet:['Akboynuz korusu','grove'],wings:['Kanat terası','terrace'],
 relic:['Mühür sunağı','altar'],charm:['Kuyumcu tezgâhı','jeweler'],titles:['Şeref galerisi','gallery'],auras:['Halka bahçesi','garden'],
 av:['Avcı kampı','camp'],map:['Haritacı masası','atlas'],boss:['Mühürlü kapı','gate'],arena:['Düello avlusu','duel'],
 bag:['Yolcu heybesi','satchel'],profile:['Kahraman güncesi','journal'],mail:['Posta güvercinliği','letter'],notices:['Çan kulesi','belfry'],
 settings:['Saatçi atölyesi','clock'],gold:['Darphane','mint'],gem:['Elmas Mağazası','mint'],energy:['Yolcu pınarı','spring']
};
function venuePage(key,title,body){return artVenueShell(key,title,body,'legacyStage');}

function emblem(icon){return '<span class="emblem" aria-hidden="true">'+icon+'</span>';}
const insignia={ak:'♘',tilki:'❧',turna:'❧',kuzgun:'◆',tas:'◉',av:'✧',gecit:'⚜',duello:'⚔',fatih:'♛',yaprak:'❧',sis:'☾'};
function collectionEntry(key,row){
 const [id,name,desc,cost]=row,on=state.slots[key]===id,owned=state.unlocks.includes(id),ready=key!=='titles'||titleReady(state,id);
 const unlock=key==='titles'?({gecit:'Köy 1-3 zaferi',fatih:'Hiçlik 17-3 zaferi',duello:'1 Arena galibiyeti'})[id]:lootText(cost);
 const button=tag(on?'Kuşanıldı':owned?'Kuşan':ready?'Aç ve kuşan':'Kilitli','collectItem','data-key="'+key+'" data-id="'+id+'" '+(on||!owned&&(!ready||!afford(state,cost))?'disabled':''));
 return '<article class="collectible item-'+id+(on?' worn':'')+'">'+emblem(insignia[id])+'<div><h3>'+name+'</h3><p>'+desc+'</p>'+(!owned?'<small>'+unlock+'</small>':'')+'</div>'+button+'</article>';
}
function collectionRoom(key){
 const items=collections[key].map(x=>collectionEntry(key,x)).join('');
 const undo=state.slots[key]&&key!=='pet'?tag('Çıkar','removeSlot','data-key="'+key+'"','action sub'):'';
 let body='<div class="collectionObjects">'+items+'</div>'+undo;
 if(key==='pet')body+='<div class="feedBox"><div><h3>Akboynuz eğitimi</h3><p>Seviye '+state.training+' / 3 · '+state.feed+' yem</p><small>1 yem, savaşta iyileşmeyi 5 artırır.</small></div>'+tag('Eğit','trainPet',state.feed<1||state.training>=3?'disabled':'')+'</div>';
 return venuePage(key,titleOf[key],body);
}
function marketCounter(){const shelves={Mağaza:['ore','ration'],Sandıklar:['chest'],Arena:['arena'],Lonca:['guild']};
 const marks={ore:'⬙',ration:'❧',chest:'▣',gems:'◆',arena:'⚔',guild:'⚜'};
 const shelf=shelves[marketTab].map(k=>{const g=goods[k];return '<article class="merchandise">'+emblem(marks[k])+'<h3>'+g.name+'</h3><p>'+lootText(g.gain)+'</p>'+tag('Al · '+lootText(g.cost),'buy','data-key="'+k+'" '+(!afford(state,g.cost)?'disabled':''))+'</article>';}).join('');
 return venuePage('market','Market',tabs(Object.keys(shelves),marketTab,'marketTab')+'<div class="shopShelf">'+shelf+'</div><div class="purse">'+['gold','gems','crystals','arenaCoin','guildCoin'].map(k=>'<span>'+state[k]+' '+moneyNames[k]+'</span>').join('')+'</div>'+(marketTab==='Sandıklar'?rowCard('Çantadaki sandıklar',state.chests+' sandık · Her sandık 10 altın ve 1 yem içerir.',tag('Sandık aç','openChest',state.chests<1?'disabled':'')):''));
}
function relicAltar(){
 const filled=state.relicActive?6:Math.min(6,state.shards);
 const ring='<div class="stoneSeal" aria-label="'+filled+' / 6 mühür parçası">'+Array.from({length:6},(_,i)=>'<i class="'+(i<filled?'insetStone':'')+'" style="--n:'+i+'"></i>').join('')+'<b>'+filled+' / 6</b></div>';
 return venuePage('relic','Kalıntılar','<div class="sealWork">'+ring+'<div><h3>Kırık Mühür</h3><p>Altı parçayı birleştir. Azami canın kalıcı olarak 3 artsın.</p><small>'+state.shards+' kalıntı parçası · '+healthOf(state)+' azami can</small></div></div><div class="row">'+tag(state.relicActive?'Mühür etkin':'Birleştir · 6 parça','makeRelic',state.relicActive||state.shards<6?'disabled':'')+tag('Bölge Bossu','boss','','action sub')+'</div>');
}
function noticeBoard(){const b=dayBook(state);
 return venuePage('events','Etkinlikler','<p class="boardDate">'+b.date+' · Günlük ilanlar</p><div class="pinnedNotes">'+eventsList.map(([k,n,d,goal,g])=>{
 const count=Math.min(goal,eventCount(b,k));return '<article class="paperNote"><h3>'+n+'</h3><p>'+d+'</p><progress value="'+count+'" max="'+goal+'" aria-label="'+n+'"></progress><small>'+count+' / '+goal+' · '+lootText(g)+'</small>'+tag(b.flags[k]?'Alındı':'Ödülü al','claimEvent','data-key="'+k+'" '+(b.flags[k]||count<goal?'disabled':''))+'</article>';
 }).join('')+'</div>');
}
function utilityRoom(key){
 if(key==='settings')return venuePage(key,'Ayarlar','<div class="switchWork"><h3>Hareket efektleri</h3><p>'+(state.settings.motion?'Açık':'Kapalı')+'</p>'+tag(state.settings.motion?'Hareketi azalt':'Hareketi aç','toggleMotion')+'</div>');
 if(key==='gold')return venuePage(key,'Altın','<div class="mintBalance">'+emblem('●')+'<strong>'+state.gold+'</strong><p>Seferlerden kazandığın altını harca.</p><div class="row">'+tag('Markete git','market')+tag('Demirciye git','forge','','action sub')+'</div></div>');
 return venuePage(key,'Enerji','<div class="poolGauge"><meter id="energyMeter" aria-label="Enerji" value="'+energyNow(state)+'" max="'+energyCap+'"></meter><h3 id="energyRoom">'+energyLabel(state)+'</h3><p>Av girişi 2 enerji. Sefer ve Bölge Bossu ücretsiz.</p>'+tag('Avcı kampına git','av')+'</div>');
}
