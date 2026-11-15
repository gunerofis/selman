// Kullanıcının sekiz ekran referansı; bütün işlemler mevcut oyun sistemlerine bağlıdır.
let alanPetTab='Petler',alanWingTab='Koleksiyon',alanRelicTab='Koleksiyon',alanAuraFilter='Tümü',alanTitleFilter='Tümü',alanOwnedFilter=false,alanWingOwned=false,alanGuildTab='Genel Bakış',alanEventFilter='Tüm Etkinlikler',alanEvent='hunt',alanRankTab='Güç Sıralaması',alanRankScope='Genel';
const alanTitles={charm:'Tılsım',pet:'Petler',wings:'Kanatlar',relic:'Kalıntılar',auras:'Auralar',titles:'Unvanlar',guild:'Lonca',events:'Etkinlikler',rank:'Sıralama'};
const alanPlates={pet:'pet_taban',wings:'kanat_taban',relic:'kalinti_taban',auras:'aura_taban',titles:'unvan_taban',guild:'lonca_taban',events:'etkinlik_taban',rank:'siralama_taban'};
function alanBox(html,x,y,w,h,cls=''){return '<div class="alanBox '+cls+'" '+refAt(x,y,w,h)+'>'+html+'</div>';}
function alanButton(label,action,x,y,w,h,attrs='',cls=''){const trim=cls==='ornate'||cls==='cover'?refCrop('kalinti_taban',1326,718,254,64):'';return refButton(label,action,x,y,w,h,attrs,trim+'<span class="alanLabel '+cls+'">'+safeText(label)+'</span>');}
function alanHeading(label,x,y,w){return refValue(label,x,y,w,45,'alanHeading');}
function alanParagraph(text,x,y,w,h,cls=''){return refValue(text,x,y,w,h,'alanParagraph '+cls);}
function alanCost(cost){return developerFree(state)?'<span class="alanFree">Bedelsiz</span>':Object.entries(cost).filter(([,n])=>n>0).map(([k,n])=>'<span class="alanCostItem '+((state[k]||0)<n?'short':'')+'">'+objectArt(k)+'<b>'+profileNumber(state[k]||0)+' / '+profileNumber(n)+'</b><small>'+safeText(moneyNames[k])+'</small></span>').join('');}
function alanStats(rows){return rows.map(([icon,name,value])=>'<div class="alanStat">'+glyph(icon)+'<span>'+safeText(name)+'</span><b>'+safeText(value)+'</b></div>').join('');}
function alanStars(n,max=5){return '<div class="alanStars" aria-label="'+n+' / '+max+'">'+Array.from({length:max},(_,i)=>'<span class="'+(i<n?'lit':'')+'">★</span>').join('')+'</div>';}
function alanProgress(value,max,label){return '<div class="alanProgress" role="progressbar" aria-label="'+safeText(label)+'" aria-valuemin="0" aria-valuenow="'+value+'" aria-valuemax="'+max+'"><i style="width:'+Math.min(100,value/max*100)+'%"></i><span>'+value+' / '+max+'</span></div>';}
function alanArt(key){return ART[key]?'<img src="'+ART[key]+'" alt="">':glyph(key);}
function alanScreen(key,body){return '<section class="refViewport" aria-label="'+alanTitles[key]+'"><div class="refScreen refAlan alan-'+key+'">'+currencyPlate(alanPlates[key])+alanWallet(key)+body+'</div></section>';}
function alanWallet(key){
 const simple=['pet','wings','relic'].includes(key),social=['rank','events'].includes(key),guild=key==='guild';
 const positions=guild?[[1097,80],[1251,80],[1397,75],[1535,110]]:simple?[[1328,45],[1423,45],[1516,45],[1603,49]]:social?(key==='rank'?[[806,62],[991,63],[1155,63],[1300,85]]:[[846,67],[994,67],[1143,65],[1295,78]]):[[1000,61],[1171,69],[1336,65],[1500,102]];
 let html=refButton('Geri','back',14,6,85,78)+positions.map(([x,w],i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],x,13,w,47,'','<span class="refWalletValue alanWallet">'+profileNumber([state.gold,state.gems,state.crystals,energyNow(state)][i])+(i===3&&!simple?'/'+energyCap:'')+'</span>')).join('');
 if(social)for(const [i,k] of ['mail','notices','settings'].entries())html+=refButton({mail:'Posta',notices:'Bildirimler',settings:'Ayarlar'}[k],k,1441+i*78,5,72,67);
 if(key==='auras'||key==='titles')html+=refButton('Bilgi','alanInfo',key==='auras'?350:374,12,64,63,'data-key="'+key+'"');
 return html;
}
function alanTopTabs(names,selected,group,x=420,y=81,w=215,h=52){return names.map((name,i)=>{const disabled=group==='relic'&&['Güçlendirme','Rezonans'].includes(name)||group==='guild'&&name==='Mağaza'&&!state.guild||group==='rankScope'&&(name==='Arkadaş'||name==='Bölge'&&alanRankTab!=='Sefer Sıralaması');const box=group==='pet'?[[151,324],[520,308],[878,306],[1228,303]][i]:group==='guild'?[[148,322],[471,244],[716,262],[980,306],[1288,258]][i]:[x+i*(w+4),w];return refButton(name,'alanTab',box[0],y,box[1],h,'data-group="'+group+'" data-key="'+name+'" aria-pressed="'+(name===selected)+'" '+(disabled?'disabled':''),'<span class="alanTabMark '+(name===selected?'on':'')+'"><span>'+name+'</span></span>');}).join('');}
function alanCategoryIcon(group,i){const sources={auras:['aura_referans',53,195+i*84,67,63],titles:['unvan_referans',61,185+i*87,59,63],rank:['siralama_referans',45,155+i*81,49,51]};const src=sources[group];return src?'<i class="alanCategoryIcon">'+refCrop(...src)+'</i>':'';}
function alanCategories(names,selected,group,x,y,w,h,step){return names.map((name,i)=>refButton(name,'alanFilter',x,y+i*step,w,h,'data-group="'+group+'" data-key="'+name+'" aria-pressed="'+(name===selected)+'"','<span class="alanCategoryMark '+(name===selected?'on':'')+'">'+alanCategoryIcon(group,i)+'<span>'+name+'</span></span>')).join('');}
function alanCollectAttrs(key,id,disabled=false){return 'data-key="'+key+'" data-id="'+id+'" '+(disabled?'disabled':'');}
function alanOwned(id){return state.unlocks.includes(id);}
function alanPet(){
 const [id,name,desc,cost]=collectionChoice('pet'),owned=alanOwned(id),active=petOf(state)===id,lvl=lvlOf(state,'pet',id),stars=starOf(state,id),starTab=alanPetTab==='Bağ',upgrade=starTab?starCost(stars):petUpCost(state,id),max=starTab?stars>=MAX_STAR:lvl>=MAX_LVL;
 let body='';
 body+=collections.pet.map(([v,n],i)=>refButton(n,'roomSelect',32+(i%2)*195,122+Math.floor(i/2)*225,184,211,'data-group="pet" data-key="'+v+'" aria-pressed="'+(v===id)+'"',
  '<span class="alanPetCardArt">'+alanArt('icon_pet_'+v)+'</span><strong class="alanPetCardName">'+n+'</strong><small class="alanPetCardMeta">'+(alanOwned(v)?'Sv. '+lvlOf(state,'pet',v)+(petOf(state)===v?' · Yanında':''):'Kilitli')+'</small>'+(v===id?'<span class="alanCardChosen"></span>':''))).join('');
 body+=alanBox(roomCanvas('pet'),789,92,383,443,'alanPetPreview')+refValue(name,731,540,305,56,'alanHeroName')+refValue(owned?'Sv. '+lvl+' · '+rarities[petMeta[id].r]:'Kilitli',652,608,379,34,'alanSubName');
 body+=alanBox(alanStats([['heart','Can','+'+petGoster(state,id,'hp')],['sword','Saldırı','+'+petGoster(state,id,'atk')]]),532,663,584,44,'alanInlineStats');
 body+=alanButton(active?'Yanında':'Yanına Al','collectItem',550,728,234,63,alanCollectAttrs('pet',id,active||!owned),'dark')
  +alanButton(!owned?'Aç':max?'Azami':starTab?'Yıldız Ver':'Eğit',!owned?'collectItem':starTab?'alanPetStar':'trainPet',816,726,272,66,!owned?alanCollectAttrs('pet',id,!afford(state,cost)):'data-id="'+id+'" '+(max||!afford(state,upgrade)?'disabled':''));
 body+=alanHeading(alanPetTab==='Yetenek'?'Yetenekler':alanPetTab==='Bağ'?'Yıldız Bağı':alanPetTab==='Bakım'?'Bakım':'Yetenekler',1220,112,403)
  +alanBox(alanArt('icon_pet_'+id),1229,173,109,108,'alanSkillArt')
  +alanParagraph(petYetenekMetni(state,id),1219,299,403,39,'center')
  +alanHeading('Bağ Etkisi',1220,342,403)
  +alanBox(alanStats([['heart','Can','+'+petGoster(state,id,'hp')],['sword','Saldırı','+'+petGoster(state,id,'atk')]]),1219,395,402,67,'alanInlineStats')
  +alanHeading('İlerleme',1220,473,403)+alanBox(alanStars(stars),1260,526,330,43)
  +alanBox(alanProgress(lvl,MAX_LVL,'Pet seviyesi'),1221,576,408,26)
  +alanBox(alanCost(owned?upgrade:cost),1225,628,399,116,'alanCosts')
  +alanTopTabs(['Petler','Yetenek','Bağ','Bakım'],alanPetTab,'pet',151,844,324,62);
 if(alanPetTab==='Yetenek')body+=alanParagraph(petYetenekleri(state,id).map(sk=>(sk.open?'✓ ':'○ ')+sk.name+': '+sk.text).join(' · '),476,130,305,146,'alanSkillDescription');
 return alanScreen('pet',body);
}
function alanWings(){
 const [id,name,desc,cost]=collectionChoice('wings'),owned=alanOwned(id),on=state.slots.wings===id,lvl=wingLevelOf(state,id),phase=wingPhase(state,id),cap=wingCap(state,id),stat=wingMeta[id].stat,evo=alanWingTab==='Yükseltme',runes=alanWingTab==='Geliştirme';
 let body=alanTopTabs(['Koleksiyon','Geliştirme','Yükseltme','Görünüm'],alanWingTab,'wings');
 body+=alanButton(alanWingOwned?'Sahip Olunan':'Tümü','alanOwnedWings',58,170,293,44,'','filter');
 const rows=collections.wings.filter(([v])=>!alanWingOwned||alanOwned(v));
 body+=rows.map(([v,n],i)=>refButton(n,'roomSelect',43+(i%3)*134,235+Math.floor(i/3)*136,124,126,'data-group="wings" data-key="'+v+'" aria-pressed="'+(v===id)+'"','<span class="alanWingCardArt">'+alanArt('icon_wing_'+v)+'</span><small class="alanWingCardMeta">'+(alanOwned(v)?'+'+wingLevelOf(state,v):'Kilitli')+'</small>'+(v===id?'<span class="alanCardChosen"></span>':''))).join('');
 body+=alanBox(roomCanvas('hero'),466,174,788,525,'alanWingPreview')
  +refButton('Önceki Kanat','alanWingCycle',479,445,56,72,'data-step="-1"')+refButton('Sonraki Kanat','alanWingCycle',1194,445,56,72,'data-step="1"');
 body+=refValue(name,1293,185,338,64,'alanDetailName')+refValue(rarities[wingMeta[id].r],1351,251,225,33,'alanRarity')
  +alanBox(alanStars(phase+1),1327,291,283,38)+alanHeading(evo?'Evrim':runes?'Rünler':'Özellikler',1294,343,319);
 const base=stat==='hp'?5:2,cur=base+wingStat(state,id,stat),next=base+wingStat(state,id,stat,lvl+1);
 if(runes){
  body+=alanBox('<div class="alanRunes">'+wingRunes(state,id).map((k,i)=>tag(k?'<span class="gxStone '+k+'"></span>':glyph(i>0&&!phase?'lock':'gem'),'wingRunePull','data-id="'+id+'" data-i="'+i+'" '+(owned&&k?'':'disabled'),'alanRune')).join('')+'</div><div class="alanRuneActions">'+Object.keys(stoneMeta).map(k=>tag(stoneMeta[k][0]+' · '+(state.stones[k]||0),'wingRuneSet','data-id="'+id+'" data-stone="'+k+'" '+(owned&&(developerFree(state)||state.stones[k]>0)&&wingRunes(state,id).slice(0,phase?2:1).includes(null)?'':'disabled'),'panelSmallOption')).join('')+'</div>',1300,401,312,164);
 }else body+=alanBox(alanStats([[stat==='hp'?'heart':'sword',stat==='hp'?'Can':'Saldırı','+'+cur],['wing','Evre',(phase+1)+' / '+WING_EVRE],['star','Seviye',lvl+' / '+cap]]),1304,397,307,112);
 const upgrade=evo?wingEvoCost(state,id):wingUpCost(state,id),max=evo?phase>=WING_EVRE-1:lvl>=MAX_LVL,blocked=evo?lvl<cap:lvl>=cap;
 body+=alanHeading(owned?(evo?'Evrim Gereksinimi':alanWingTab==='Koleksiyon'?'Kanat Etkisi':runes?'Kuşanma':'Geliştirme'):'Kuşanma Gereksinimi',1293,528,334);
 body+=alanParagraph(!owned?desc:evo?'Seviye '+cap+' · Evre '+(phase+1)+' → '+Math.min(5,phase+2):alanWingTab==='Geliştirme'?(stat==='hp'?'Can':'Saldırı')+' +'+cur+' → +'+next+' · Başarı %'+wingUpChance(state,id):desc,1300,579,313,61);
 if(!owned||alanWingTab==='Geliştirme'||evo)body+=alanBox(alanCost(owned?upgrade:cost),1303,640,310,50,'alanCosts compact');
 let action='collectItem',label=on?'Çıkar':owned?'Kuşan':'Aç ve Kuşan',attrs=alanCollectAttrs('wings',id,!owned&&!afford(state,cost));
 if(on){action='removeSlot';attrs='data-key="wings"';}
 if(owned&&(alanWingTab==='Geliştirme'||evo)){action=evo?'wingEvo':'wingUp';label=max?'Azami':blocked?(evo?'Seviye '+cap+' Gerekir':'Evrim Gerekir'):evo?'Evrim':'Güçlendir';attrs='data-id="'+id+'" '+(max||blocked||!afford(state,upgrade)?'disabled':'');}
 body+=alanButton(label,action,1320,701,215,56,attrs);
 body+=collections.wings.slice(Math.floor(collections.wings.findIndex(([v])=>v===id)/2)*2,Math.floor(collections.wings.findIndex(([v])=>v===id)/2)*2+2).map(([v,n],i)=>refButton(n,'roomSelect',615+i*121,716,102,73,'data-group="wings" data-key="'+v+'" aria-pressed="'+(v===id)+'"','<span class="alanSmallArt">'+alanArt('icon_wing_'+v)+'</span>'+(v===id?'<span class="alanCardChosen"></span>':''))).join('');
 body+=alanBox(alanStats([['wing','Kanatlar',collections.wings.filter(([v])=>alanOwned(v)).length+' / '+collections.wings.length],['star','Seviye',lvl+' / '+MAX_LVL],[stat==='hp'?'heart':'sword',stat==='hp'?'Can':'Saldırı','+'+cur]]),101,837,1490,57,'alanInlineStats');
 return alanScreen('wings',body);
}
function alanRelic(){
 const count=state.relicActive?6:Math.min(6,state.shards),art=refCrop('kalinti_referans',58,248,92,72),active=state.relicActive;
 let body=alanTopTabs(['Koleksiyon','Birleştirme','Güçlendirme','Rezonans'],alanRelicTab,'relic',419,79,215,53);
 body+=refButton('Kırık Mühür','alanInfo',42,235,128,138,'data-key="relic"','<span class="alanRelicCardArt">'+art+'</span><small class="alanRelicCardMeta">'+(active?'Etkin':count+' / 6')+'</small><span class="alanCardChosen"></span>');
 const pts=[[651,176],[948,175],[552,295],[1052,295],[606,425],[1007,431]];
 pts.forEach(([x,y],i)=>{body+=alanBox('<span class="alanShard '+(i<count?'filled':'')+'">'+objectArt('shards')+'</span>',x,y,94,87);});
 body+=refValue('Kırık Mühür',707,559,322,41,'alanDetailName')+refValue(active?'Etkin':'Birleştirilmedi',707,604,322,29,'alanSubName')
  +alanBox(alanStats([['star','Kalıntı parçası',state.shards+' / 6'],['heart','Can','+3']]),524,638,619,48,'alanInlineStats')
  +alanParagraph(active?'Mühür etkin · Kalıcı +3 can':'Altı kalıntı parçasını birleştir.',518,700,628,39,'center')
  +alanButton(active?'Mühür Etkin':'Birleştir','makeRelic',596,756,260,52,active||!afford(state,{shards:6})?'disabled':'','cover')
  +refButton('Detay','alanInfo',887,756,201,52,'data-key="relic"')
  +alanHeading('Kırık Mühür',1282,163,340)+alanBox(art,1394,216,140,128)
  +alanHeading('Özellikler',1282,357,340)+alanBox(alanStats([['heart','Kalıcı Can','+3'],['star','Parça',count+' / 6']]),1294,411,309,86)
  +alanHeading(alanRelicTab==='Rezonans'?'Mühür Etkisi':'Kalıntı Etkisi',1282,508,340)
  +alanParagraph('Birleştirildiğinde azami can kalıcı olarak 3 artar.',1295,557,311,75)
  +alanHeading('Boss Kaynağı',1282,641,340)
  +alanButton('Bölge Bossu','boss',1326,718,254,57,'','dark')
  +alanBox(alanStats([['book','Koleksiyon',(active?'1':'0')+' / 1'],['star','Kalıntı parçası',state.shards],['heart','Etkin Can Bonusu',active?'+3':'+0']]),97,840,1490,56,'alanInlineStats');
 return alanScreen('relic',body);
}
function alanAuraIcon(id){return id==='yaprak'?refCrop('aura_referans',563,194,131,121):refCrop('aura_referans',783,638,124,111);}
function alanAuras(){
 const [id,name,desc,cost]=collectionChoice('auras'),owned=alanOwned(id),on=state.slots.auras===id,aura=EKONOMI.auralar.find(v=>v.id===id),auraLevel=Math.max(1,koleksiyonSeviye(state,'auras',id));
 const rows=collections.auras.filter(([v])=>alanAuraFilter==='Tümü'||(alanAuraFilter==='Saldırı'&&EKONOMI.auralar.find(item=>item.id===v)?.stat==='atk')||(alanAuraFilter==='Yaşam'&&EKONOMI.auralar.find(item=>item.id===v)?.stat==='hp'));
 let body=alanCategories(['Tümü','Saldırı','Savunma','Yaşam','Destek','Özel'],alanAuraFilter,'auras',31,185,248,79,84);
 body+=alanCatalogViewport(rows.map(([v,n],i)=>refButton(n,'roomSelect',319+(i%4)*211,182+Math.floor(i/4)*210,199,200,'data-group="auras" data-key="'+v+'" aria-pressed="'+(v===id)+'"','<span class="alanAuraCardArt">'+alanAuraIcon(v)+'</span><strong class="alanAuraCardName">'+n+'</strong><small class="alanAuraCardMeta">'+(state.slots.auras===v?'Kuşanıldı':alanOwned(v)?'Açık':'Kilitli')+'</small>'+(v===id?'<span class="alanCardChosen"></span>':''))).join(''),319,182,832,620);
 if(!rows.length)body+=alanParagraph('Bu kategoride aura yok.',361,220,733,63,'center alanEmpty');
 body+=alanBox(alanAuraIcon(id),1342,169,150,134)+refValue(name,1227,310,372,59,'alanDetailName')
  +refValue(on?'Kuşanıldı':owned?'Açık':'Kilitli',1227,373,372,31,'alanSubName')
  +alanHeading('Aura Etkisi',1221,423,388)+alanBox(alanStats([[aura?.stat==='hp'?'heart':'sword',aura?.stat==='hp'?'Can':'Saldırı','+'+((aura?.base||0)*(owned?auraLevel:1))]]),1228,482,365,55)
  +alanHeading(owned?'Durum':'Kuşanma Gereksinimi',1221,581,388)
  +(owned?alanParagraph(desc,1244,643,346,58):alanBox(alanCost(cost),1244,627,346,103,'alanCosts'))
  +alanButton(on?'Çıkar':owned?'Kuşan':'Aç ve Kuşan',on?'removeSlot':'collectItem',1232,747,363,75,on?'data-key="auras"':alanCollectAttrs('auras',id,!owned&&!afford(state,cost)),'ornate');
 return alanScreen('auras',body);
}
function alanTitleCondition(id){const row=unvanDurumu(state,id);return [row.text,row.value,row.goal];}

function alanTitleStats(id){const item=EKONOMI.unvanlar.find(v=>v.id===id);return [['sword','Saldırı',item?.atk?'+'+item.atk:'—'],['heart','Can',item?.hp?'+'+item.hp:'—']];}

function alanTitlesPage(){
 const [id,name,desc]=collectionChoice('titles'),on=state.slots.titles===id,ready=titleReady(state,id),[condition,value,max]=alanTitleCondition(id),owned=alanOwned(id);
 const rows=collections.titles.filter(([v])=>(alanTitleFilter==='Tümü'||EKONOMI.unvanlar.find(item=>item.id===v)?.type===alanTitleFilter)&&(!alanOwnedFilter||alanOwned(v)));
 let body=alanCategories(['Tümü','İlerleme','Savaş','Etkinlik','Özel'],alanTitleFilter,'titles',39,173,237,77,87)
  +refValue('('+collections.titles.filter(([v])=>alanOwned(v)).length+' / '+collections.titles.length+')',557,168,137,36,'alanSmallCount')
  +alanButton(alanOwnedFilter?'Sahip Olunan':'Tümü','alanOwnedTitles',748,160,187,47,'','filter');
 body+=alanCatalogViewport(rows.map(([v,n],i)=>refButton(n,'roomSelect',317,240+i*92,628,84,'data-group="titles" data-key="'+v+'" aria-pressed="'+(v===id)+'"','<span class="alanTitleBadge color-'+i+'">'+glyph('crown')+'<strong>'+n+'</strong>'+glyph('star')+'</span><span class="alanTitleStatus">'+(state.slots.titles===v?'✓ Kullanılıyor':titleReady(state,v)?'○':glyph('lock'))+'</span>'+(v===id?'<span class="alanCardChosen"></span>':''))).join(''),317,240,628,545);
 if(!rows.length)body+=alanParagraph('Bu kategoride unvan yok.',364,257,525,58,'center alanEmpty');
 body+=refValue(name,1162,202,383,54,'alanDetailName')+alanParagraph(desc,1075,306,522,63,'center')
  +alanBox(alanStats(alanTitleStats(id)),1060,419,519,139)+alanParagraph(condition,1060,624,526,47)
  +alanBox(alanProgress(value,max,'Kazanım koşulu'),1066,676,507,24)
  +alanButton(on?'Kullanılıyor':ready?'Kuşan':'Kilitli','collectItem',1154,739,341,64,alanCollectAttrs('titles',id,on||!ready),'dark');
 if(on)body+=alanButton('Çıkar','removeSlot',1510,744,88,50,'data-key="titles"','small');
 return alanScreen('titles',body);
}
function alanGuild(){
 if(['Genel Bakış','Üyeler','Görevler'].includes(alanGuildTab))return guildReferenceLayout();
 const member=state.guild,b=dayBook(state),boss=trials.guildBoss[0],war=trials.guildWar[0],bossLeft=Math.max(0,quotas.guildBoss-(b.used.guildBoss||0)),warLeft=Math.max(0,quotas.guildWar-(b.used.guildWar||0));
 let body=guildPageNavigation('war');
 body+=refValue('Geçit Muhafızları',111,500,370,57,'alanGuildName')+refValue(member?'Yerel Lonca':'Katılmadın',151,570,291,34,'alanSubName')
  +alanBox(alanProgress(member?1:0,1,'Lonca üyeliği'),117,615,358,32)
  +alanBox(alanStats([['flag','Üye',member?'1':'0'],['trophy','Lonca Puanı',state.stats.guildScore||0]]),119,676,354,111)
  +alanParagraph(alanGuildTab==='Üyeler'?(member?profileName():'Henüz üye değilsin.'):alanGuildTab==='Görevler'?'Lonca karşılaşmaları':alanGuildTab==='Lonca Savaşı'?'Kül Sancağı':'Geçit Muhafızları',564,294,468,73,'center alanAnnouncement')
  +refValue(alanGuildTab==='Üyeler'?'Bu cihazdaki üye':'Yerel lonca',570,408,457,29,'alanSubName');
 const taskRows=[['Lonca Bossu',boss,bossLeft],['Sancak Düellosu',war,warLeft]];
 body+=alanBox(taskRows.map(([n,i,left])=>'<div class="alanGuildTask"><span>'+glyph(i===boss?'shield':'sword')+n+'</span><small>'+left+' / 1 hak</small>'+tag('Başla','trialStart','data-i="'+i+'" '+(!member||!left?'disabled':''),'panelSmallOption')+'</div>').join(''),541,550,509,161);
 body+=refButton('Bağış Yap','donate',525,753,253,55,!member||!afford(state,{gold:20})?'disabled':'')
  +refButton('Lonca Üyeleri','alanTab',795,753,273,55,'data-group="guild" data-key="Üyeler"')
  +alanButton(member?'Sancağı Savun':'Loncaya Katıl',member?'trialStart':'joinGuild',1168,478,402,63,member?'data-i="'+war+'" '+(!warLeft?'disabled':''):'');
 body+=alanHeading('Lonca Üyesi',1126,586,468)
  +alanBox(member?'<div class="alanMember">'+refCrop('profil_canli_taban',166,94,214,203)+'<strong>'+safeText(profileName())+'</strong><small>Bu cihazda</small></div>':'<p class="alanMemberEmpty">Henüz üye değilsin.</p>',1140,639,440,151)
  +alanParagraph(member?'20 altın bağış · 1 lonca jetonu':'Geçit Muhafızları',503,844,853,43)
;
 body+=refValue('Jeton: '+profileNumber(state.guildCoin)+' · Bağış: '+profileNumber(state.donated),1140,785,440,20,'alanGuildBalance');
 return alanScreen('guild',body);
}
function alanDailyRemaining(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()).split(':').map(Number),minutes=1440-parts[0]*60-parts[1];return Math.floor(minutes/60)+'sa '+minutes%60+'dk';}
function alanEvents(){
 const b=dayBook(state),daily=alanEventFilter==='Tüm Etkinlikler'||alanEventFilter==='Günlük Etkinlikler',rows=daily?eventsList:[],ev=rows.find(v=>v[0]===alanEvent)||rows[0];
 let body=alanCategories(['Tüm Etkinlikler','Süreli Etkinlikler','Günlük Etkinlikler','Haftalık Etkinlikler','Özel Etkinlikler'],alanEventFilter,'events',23,192,271,79,88);
 body+=rows.map(([key,name,desc,goal],i)=>refButton(name,'alanEvent',327,210+i*116,667,104,'data-key="'+key+'" aria-pressed="'+(ev?.[0]===key)+'"','<span class="alanEventIcon">'+refCrop('etkinlik_referans',345,214+[0,1,2][i]*116,83,88)+'</span><strong class="alanEventName">'+name+'</strong><span class="alanEventDesc">'+desc+'</span><span class="alanEventTime">Günlük<br>'+Math.min(goal,eventCount(b,key))+' / '+goal+'</span>'+(ev?.[0]===key?'<span class="alanCardChosen"></span>':''))).join('');
 body+=alanBox('',328,210+rows.length*116,667,575-rows.length*116,'alanEventUnused');
 if(!ev)body+=alanParagraph('Bu kategoride etkinlik yok.',371,239,558,71,'center alanEmpty')+refValue('Etkinlik Yok',1077,163,450,63,'alanEventDetailName')+alanButton('Ödül Yok','alanInfo',1170,766,334,65,'disabled','cover');
 else{
  const [key,name,desc,goal,gain]=ev,count=Math.min(goal,eventCount(b,key)),done=b.flags[key];
  body+=refValue(name,1077,169,354,58,'alanEventDetailName')+refValue(alanDailyRemaining(),1467,191,151,39,'alanEventCountdown')
   +alanParagraph(desc,1073,258,540,65)+alanParagraph(name,1155,373,432,33)
   +alanBox(alanProgress(count,goal,name),1156,409,434,24)
   +alanParagraph(b.date+' · Günlük',1155,467,432,34)
   +alanBox(Object.entries(gain).map(([k,n])=>panelReward(k,n)).join(''),1102,632,473,107,'alanRewards')
   +alanButton(done?'Alındı':'Ödülü Al','claimEvent',1170,766,334,65,'data-key="'+key+'" '+(done||count<goal?'disabled':''),'cover');
 }
 return alanScreen('events',body);
}
function alanRank(){
 const tabs=['Güç Sıralaması','Arena Sıralaması','Lonca Sıralaması','Sefer Sıralaması','Sezon Sıralaması'],mode=tabs.indexOf(alanRankTab),score=[guc(state),state.stats.rating||0,state.stats.guildScore||0,state.cleared.length,state.stats.wins||0][mode];
 const times=Object.entries(state.bestTimes||{}).filter(([i])=>encounters[i]&&(alanRankScope!=='Bölge'||regionOf(Number(i))===regionOf(currentStage()))).sort((a,b)=>a[1]-b[1]).slice(0,8),log=(state.log||[]).slice(0,8);
 let body=alanCategories(tabs,alanRankTab,'rank',26,143,268,77,81)
  +refValue('Kişisel Rekorlar',427,109,253,42,'alanRankTitle')+refValue('Bu cihazda',432,154,241,27,'alanSmallCount')
  +alanTopTabs(['Genel','Bölge','Arkadaş'],alanRankScope,'rankScope',735,119,166,56)
  +refValue('—',1375,195,180,67,'alanRankPlace')+alanParagraph(['Güç','Arena Puanı','Lonca Puanı','Tamamlanan Bölüm','Zafer'][mode],1305,301,151,44)
  +refValue(profileNumber(score),1454,301,158,44,'alanRankScore');
 const headers=mode>=3?['Sıra','Karşılaşma','Sonuç',mode===3?'Süre':'Tarih']:['Sıra','Oyuncu','Lonca',['Güç','Puan','Puan'][mode]];
 body+=alanBox(headers.map((s,i)=>'<span>'+s+'</span>').join(''),329,206,873,38,'alanRankHeaders');
 const items=mode===3?times.map(([i,t],n)=>[n+1,routeName(Number(i)),'Zafer',seconds(t)+' sn']):mode===4?log.map((r,i)=>[i+1,r.title,{win:'Zafer',lose:'Yenilgi',exit:'Geri çekilme',timeout:'Süre doldu',draw:'Beraberlik'}[r.end]||r.end,r.day]):[[null,profileName(),state.guild?'Geçit Muhafızları':'—',profileNumber(score)]];
 body+=alanBox(items.length?items.map(r=>'<div class="alanRankRow"><b>'+safeText(r[0]??'—')+'</b><strong>'+safeText(r[1])+'</strong><span>'+safeText(r[2])+'</span><b>'+safeText(r[3])+'</b></div>').join(''):'<p class="alanRankEmpty">Henüz kayıt yok.</p>',326,258,881,475,'alanRankRows');
 body+=alanBox('<span>—</span><strong>'+safeText(profileName())+' <small>Sen</small></strong><span>'+safeText(state.guild?'Geçit Muhafızları':'—')+'</span><b>'+profileNumber(score)+'</b>',334,770,873,52,'alanRankSelf')
  +alanHeading('Kişisel İstatistikler',1307,373,308)
  +alanBox(alanStats([['sword','Arena Puanı',state.stats.rating||0],['shield','Dünya Bossu Hasarı',state.stats.world||0],['flag','Lonca Puanı',state.stats.guildScore||0]]),1307,434,305,105)
  +alanHeading('Sefer İlerlemesi',1307,556,309)
  +alanBox(alanProgress(state.cleared.filter(v=>/^\d+-[123]$/.test(v)).length,route.length,'Sefer ilerlemesi'),1307,623,305,28)
  +alanButton(mode===1?'Arena’ya Git':mode===2?'Loncaya Git':'Sefere Git',mode===1?'arena':mode===2?'guild':'map',1298,744,325,68);
 return alanScreen('rank',body);
}
function referenceAlan(key){if(collectionLayoutKeys.includes(key))return collectionReferenceLayout(key);return ({pet:alanPet,wings:alanWings,relic:alanRelic,auras:alanAuras,titles:alanTitlesPage,guild:alanGuild,events:alanEvents,rank:alanRank}[key])?.();}
async function alanAction(action,el){
 if(await collectionLayoutAction(action,el))return true;
 const d=el.dataset||{};
 if(action==='guildTaskPeriod'){if(['daily','weekly'].includes(d.key)){guildTaskPeriod=d.key;render();}return true;}
 if(action==='guildTaskWar'){alanGuildTab='Lonca Savaşı';await navigate('guild');return true;}
 if(action==='guildTaskClaim'){let claimed=false;await changeState(s=>{claimed=loncaGorevAl(s,d.period,d.id);return claimed;});if(claimed)toast('Görev ödülü alındı.');return true;}
 if(action==='guildMarketLink'){marketTab='Lonca';await navigate('market');return true;}
 if(action==='guildLayoutContribution'){openModal('Lonca Katkısı',state.guild?'': 'Loncaya Katıl',state.guild?tag('Katkı Yap · '+EKONOMI.lonca.bagis+' altın','donate',afford(state,{gold:EKONOMI.lonca.bagis})?'':'disabled','action'):tag('Loncaya Katıl','joinGuild','','action'));return true;}
 if(action==='alanTab'){
  if(d.group==='pet')alanPetTab=d.key;
  if(d.group==='wings')alanWingTab=d.key;
  if(d.group==='relic')alanRelicTab=d.key;
  if(d.group==='guild'){if(d.key==='Mağaza'){marketTab='Lonca';await navigate('market');return true;}alanGuildTab=d.key;}
  if(d.group==='rankScope'){if(d.key==='Arkadaş'){openModal('Arkadaş','Arkadaş sıralaması bulunmuyor.');return true;}alanRankScope=d.key;}
  render();return true;
 }
 if(action==='alanFilter'){
  if(d.group==='auras')alanAuraFilter=d.key;
  if(d.group==='titles')alanTitleFilter=d.key;
  if(d.group==='events')alanEventFilter=d.key;
  if(d.group==='rank'){alanRankTab=d.key;if(d.key!=='Sefer Sıralaması')alanRankScope='Genel';}
  render();return true;
 }
 if(action==='alanOwnedWings'||action==='alanOwnedTitles'){if(action==='alanOwnedWings')alanWingOwned=!alanWingOwned;else alanOwnedFilter=!alanOwnedFilter;render();return true;}
 if(action==='alanEvent'){alanEvent=d.key;render();return true;}
 if(action==='alanWingCycle'){const i=collections.wings.findIndex(([v])=>v===roomSelection.wings);roomSelection.wings=collections.wings[(i+Number(d.step)+collections.wings.length)%collections.wings.length][0];render();return true;}
 if(action==='alanPetStar'){await changeState(s=>{if(!s.unlocks.includes(d.id))return false;const n=starOf(s,d.id);if(n>=MAX_STAR||!spend(s,starCost(n)))return false;s.petStar||={};s.petStar[d.id]=n+1;});return true;}
 if(action==='alanInfo'){const info={auras:['Auralar','Yaprak Halkası +1 saldırı, Sis Halkası +8 can verir. Tek aura kuşanılır.'],titles:['Unvanlar','Unvanlar sefer ve Arena başarılarıyla açılır. Tek unvan kullanılır.'],relic:['Kırık Mühür','6 kalıntı parçası birleştirildiğinde kalıcı +3 can kazanılır.']};const [title,text]=info[d.key]||['Bilgi',''];openModal(title,text);return true;}
 return false;
}

function alanCatalogViewport(html,x,y,w,h){
 const local=html.replace(/left:([\d.]+)%;top:([\d.]+)%;width:([\d.]+)%;height:([\d.]+)%/g,(_,l,t,b,c)=>'left:'+((Number(l)*16.72-x)/w*100)+'%;top:'+((Number(t)*9.41-y)/h*100)+'%;width:'+(Number(b)*16.72/w*100)+'%;height:'+(Number(c)*9.41/h*100)+'%');
 return '<div class="alanBox" '+refAt(x,y,w,h).replace('style="','style="overflow:auto;scrollbar-width:thin;')+'>'+local+'</div>';
}

// 2. kademe yerleşim çalışması. Referansın örnek içerikleri taslaktır;
// üye, görev, sayaç ve ödül verisi olarak kayda yazılmaz.
let guildTaskPeriod='daily',guildMemberQuery='';
function guildLiveBox(html,x,y,w,h,cls=''){return collectionPanel(html,x,y,w,h,'guildLiveBox '+cls);}
function guildReferenceLayout(){
 const kind={'Genel Bakış':'genel','Üyeler':'uyeler','Görevler':'gorevler'}[alanGuildTab],member=state.guild,daily=loncaDefteri(state),weekly=loncaDefteri(state,'weekly');
 let body=currencyPlate('lonca_'+kind+'_20261113')+refButton('Geri','back',28,10,78,74)+guildPageNavigation(kind);
 body+=[['Altın','gold',state.gold,1093,88],['Elmas','gem',state.gems,1256,68],['Kristal','crystal',state.crystals||0,1402,65],['Enerji','energy',energyNow(state)+'/20',1533,95]].map(([name,action,n,x,w])=>refButton(name,action,x,27,w,31,'','<span class="guildLayoutWallet">'+safeText(typeof n==='number'?profileNumber(n):n)+'</span>')).join('');
 if(kind==='genel'){
  body+=guildLiveBox('<h2>Geçit Muhafızları</h2><p>Yerel Lonca</p><strong>'+ (member?'Üyesin':'Henüz katılmadın')+'</strong>'+(!member?tag('LONCAYA KATIL','joinGuild','','guildLiveAction'):'<p>'+safeText(profileName())+'</p>'),183,472,335,273,'guildBannerText');
  body+=guildLiveBox(glyph('flag')+'<span>Üyeler</span><b>'+(member?'1':'0')+'</b>'+tag('GÖR','alanTab','data-group="guild" data-key="Üyeler"','guildTextAction'),609,234,306,119,'guildMetric');
  body+=guildLiveBox(glyph('trophy')+'<span>Lonca Puanı</span><b>'+profileNumber(state.stats.guildScore||0)+'</b>',944,234,319,119,'guildMetric');
  body+=guildLiveBox(glyph('coin')+'<span>Haftalık Bağış</span><b>'+profileNumber(weekly.counts.donate*EKONOMI.lonca.bagis)+'</b>',1288,234,324,119,'guildMetric');
  body+=guildLiveBox('<h3>Lonca Duyurusu</h3><p>Günlük görevler ve lonca karşılaşmaları hazır.</p>'+tag('GÖREVLERE GİT','alanTab','data-group="guild" data-key="Görevler"','guildLiveAction'),615,388,990,167,'guildAnnouncementLive');
  body+=guildLiveBox('<h3>Lonca Savaşı</h3><p>Boss · '+Math.max(0,quotas.guildBoss-(dayBook(state).used.guildBoss||0))+' / '+quotas.guildBoss+' hak</p><p>Sancak düellosu · '+Math.max(0,quotas.guildWar-(dayBook(state).used.guildWar||0))+' / '+quotas.guildWar+' hak</p>'+tag('SAVAŞA GİT','alanTab','data-group="guild" data-key="Lonca Savaşı"','guildLiveAction'),620,596,457,203);
  body+=guildLiveBox('<h3>Günlük Katkı</h3><p>'+daily.counts.donate+' bağış · '+profileNumber(daily.counts.donate*EKONOMI.lonca.bagis)+' altın</p><p>'+EKONOMI.lonca.bagis+' altın → '+EKONOMI.lonca.bagisJeton+' lonca jetonu</p>'+tag(member?'KATKI YAP':'LONCAYA KATIL',member?'guildLayoutContribution':'joinGuild','','guildLiveAction'),1085,596,520,203);
  body+=guildLiveBox('<b>Lonca Jetonu: '+profileNumber(state.guildCoin)+'</b><span>Toplam bağış: '+profileNumber(state.donated)+' altın</span>',63,858,1520,49,'guildStatusStrip');
 }else if(kind==='uyeler'){
  body+=guildLiveBox('<h3>Üyeler · '+(member?'1':'0')+'</h3><label>'+glyph('eye')+'<input id="guildMemberSearch" aria-label="Üyelerde ara" placeholder="Oyuncu ara…" value="'+safeText(guildMemberQuery)+'"></label><span>Yerel Lonca</span>',92,194,1530,69,'guildMemberTools');
  const found=member&&profileName().toLocaleLowerCase('tr-TR').includes(guildMemberQuery.toLocaleLowerCase('tr-TR'));
  body+=guildLiveBox('<table class="guildMemberTable"><thead><tr><th>Oyuncu</th><th>Seviye</th><th>Rol</th><th>Toplam Bağış</th><th>Durum</th><th></th></tr></thead><tbody>'+(found?'<tr><td>'+safeText(profileName())+'</td><td>'+(1+Math.floor(Math.sqrt(state.xp/BALANCE.level2TotalXp)))+'</td><td>Üye</td><td>'+profileNumber(state.donated)+'</td><td>Bu cihazda</td><td>'+tag('PROFİL','profile','','guildLiveAction')+'</td></tr>':'<tr><td colspan="6">'+(member?'Aramana uygun üye yok.':'Henüz loncaya katılmadın.')+'</td></tr>')+'</tbody></table>'+(!member?tag('LONCAYA KATIL','joinGuild','','guildLiveAction'):'')+'<span class="guildMemberTotal">'+(found?'1 / 1':'0')+'</span>',92,278,1530,595,'guildMembersLive');
 }else{
  const b=loncaDefteri(state,guildTaskPeriod),tasks=EKONOMI.loncaGorevleri,done=tasks.filter(v=>b.claimed[v.id]).length;
  body+=guildLiveBox(['daily','weekly'].map(p=>tag(p==='daily'?'Günlük':'Haftalık','guildTaskPeriod','data-key="'+p+'" aria-pressed="'+(guildTaskPeriod===p)+'"','guildLiveAction'+(guildTaskPeriod===p?' selected':''))).join('')+'<span>'+(guildTaskPeriod==='daily'?'Yenilenme: 00.00':'Yenilenme: Pazartesi 00.00')+'</span>',117,194,1470,60,'guildTaskTabs');
  body+=guildLiveBox('<h3>Alınan Ödüller</h3>'+alanProgress(done,tasks.length,'Lonca görev ödülleri') ,99,264,1477,93,'guildTaskSummary');
  body+=guildLiveBox(tasks.map(task=>{const value=Math.min(b.counts[task.id],task[guildTaskPeriod]),claimed=b.claimed[task.id],ready=value>=task[guildTaskPeriod],action=!member?'joinGuild':claimed?'guildTaskClaim':ready?'guildTaskClaim':task.target,label=!member?'KATIL':claimed?'ALINDI':ready?'ÖDÜLÜ AL':'GİT';return '<article class="guildTaskRow">'+glyph(task.icon)+'<div><h3>'+task.name+'</h3>'+alanProgress(value,task[guildTaskPeriod],task.name)+'</div><span class="guildTaskReward">'+glyph('flag')+task.reward+' jeton</span>'+tag(label,action,'data-id="'+task.id+'" data-period="'+guildTaskPeriod+'" '+(claimed?'disabled':''),'guildLiveAction')+'</article>';}).join(''),101,376,1476,470,'guildTasksLive');
 }
 return '<section class="refViewport" aria-label="Lonca · '+alanGuildTab+'"><div class="refScreen guildReferenceLayout">'+body+'</div></section>';
}
document.addEventListener('input',event=>{if(event.target.id!=='guildMemberSearch')return;const {value,selectionStart}=event.target;guildMemberQuery=value;render();const input=document.getElementById('guildMemberSearch');input?.focus();input?.setSelectionRange(selectionStart,selectionStart);});

function guildPageNavigation(kind){
 const y=kind==='genel'?113:107;
 const tabs=['Genel Bakış','Üyeler','Görevler','Lonca Savaşı'];
 let html='<nav class="guildPageTabs" aria-label="Lonca sekmeleri" '+refAt(146,y,1395,65)+'>'+tabs.map(name=>tag(name,'alanTab','data-group="guild" data-key="'+name+'" aria-pressed="'+(alanGuildTab===name)+'"','guildPageTab'+(alanGuildTab===name?' selected':''))).join('')+'</nav>';
 const linkY=kind==='uyeler'?837:kind==='war'?845:kind==='genel'?864:879;
 html+=refButton('Lonca Mağazası →','guildMarketLink',1200,linkY,260,44,'','<span class="guildMarketLink">Lonca Mağazası <b>↗</b></span>');
 return html;
}

// Ekipman 2. kademe: mevcut koleksiyonlar, referans yerleşimleri.
const collectionLayoutKeys=['pet','wings','charm','relic','titles','auras'];
const collectionLayoutNames=['Pet','Kanat','Tılsım','Kalıntı','Unvan','Aura'];
let collectionRelicId='muhur',collectionPreviewVisible=true,collectionTitleVisible=true;
function collectionPanel(html,x,y,w,h,cls=''){return '<div class="collectionPanel '+cls+'" '+refAt(x,y,w,h)+'>'+html+'</div>';}
function collectionArt(key,id){
 const list=key==='pet'?EKONOMI.petler:key==='wings'?EKONOMI.kanatlar:key==='auras'?EKONOMI.auralar:[];
 const item=list.find(v=>v.id===id);if(item?.gorsel&&ART[item.gorsel])return alanArt(item.gorsel);
 if(key==='charm')return alanArt('icon_charm_'+id);
 if(key==='relic'){const relic=EKONOMI.kalintilar.find(v=>v.id===id);return alanArt(relic?.gorsel||'icon_relic_'+id);}
 return glyph(key==='titles'?'crown':'star');
}
function collectionPetPreview(id){const source=petVerisi(id)?.gorsel,key='preview_'+(source||'').replace(/^icon_/,'');return ART[key]?alanArt(key):collectionArt('pet',id);}
function collectionCards(key,rows,selected,cls=''){
 return rows.map(([id,name])=>tag(collectionArt(key,id)+'<span>'+safeText(name)+'</span><small>'+(key==='titles'?(titleReady(state,id)?'':'Kilitli'):alanOwned(id)?(key==='pet'?'Sv. '+lvlOf(state,'pet',id):key==='wings'?'+'+wingLevelOf(state,id):'Açık'):'Kilitli')+'</small>',key==='relic'?'collectionRelicSelect':'roomSelect','data-group="'+key+'" data-key="'+id+'" aria-pressed="'+(id===selected)+'"','collectionCard '+cls+(id===selected?' selected':''))).join('');
}
function collectionEquip(key,id,cost,label='KUŞAN'){
 const on=key==='pet'?petOf(state)===id:state.slots[key]===id,owned=alanOwned(id);
 return tag(on?'ÇIKAR':owned?label:'AÇ VE '+label,on?'removeSlot':'collectItem',on?'data-key="'+key+'"':alanCollectAttrs(key,id,!owned&&!afford(state,cost)),'collectionAction');
}
function collectionHero(x,y,w,h){return collectionPanel(roomCanvas('hero'),x,y,w,h,'collectionScene');}
function collectionReferenceLayout(key){
 const index=collectionLayoutKeys.indexOf(key);
 let body=currencyPlate('ekipman_'+key+'_20261113')+refButton('Geri','back',17,8,69,63,'','<span class="collectionBack">'+glyph('back')+'</span>');
 if(key==='auras')body+=refValue('Ekipman',105,8,260,55,'collectionHeading');
 body+=collectionPanel(collectionLayoutKeys.map((k,i)=>tag(collectionLayoutNames[i],'collectionNavigate','data-key="'+k+'" aria-pressed="'+(k===key)+'"','collectionTab'+(k===key?' selected':''))).join(''),236,74,1119,71,'collectionTabs');
 body+=collectionPanel(['gold','gem','crystal','energy'].map((k,i)=>tag(hudIcon(k)+'<b>'+profileNumber([state.gold,state.gems,state.crystals,energyNow(state)][i])+(i===3?'/'+energyCap:'')+'</b>',k,'aria-label="'+['Altın','Elmas','Kristal','Enerji'][i]+'"','collectionMoney')).join(''),1190,12,465,48,'collectionWallet');
 if(key==='pet'||key==='wings'){
  const [id,name,desc,cost]=collectionChoice(key),owned=alanOwned(id),pet=key==='pet',lvl=pet?lvlOf(state,'pet',id):wingLevelOf(state,id),cap=pet?MAX_LVL:wingCap(state,id),upgrade=pet?petUpCost(state,id):wingUpCost(state,id);
  body+=collectionPanel(collectionCards(key,collections[key],id),pet?124:126,190,pet?260:209,651,'collectionRail');
  body+=pet?collectionPanel(collectionPetPreview(id),405,178,759,670,'collectionScene collectionPetScene'):collectionHero(358,175,858,663);
  const stat=pet?'atk':wingMeta[id].stat,cur=pet?petGoster(state,id,'atk'):wingStat(state,id,stat),next=pet?null:wingStat(state,id,stat,lvl+1);
  let detail='<h2>'+safeText(name)+'</h2><h3>'+(pet?'Sv. '+lvl:'Aşama '+(wingPhase(state,id)+1))+'</h3>'+alanProgress(lvl,cap,'Seviye')+'<div class="collectionStats">'+alanStats(pet?[['sword','Saldırı','+'+cur],['heart','Can','+'+petGoster(state,id,'hp')]]:[[stat==='hp'?'heart':'sword',stat==='hp'?'Can':'Saldırı','+'+cur+' → +'+next],['wing','Seviye',lvl+' / '+cap]])+'</div>';
  if(pet)detail+='<div class="collectionSkills">'+petYetenekleri(state,id).map(sk=>'<span title="'+safeText(sk.text)+'" class="'+(sk.open?'':'locked')+'">'+glyph('star')+'<small>'+safeText(sk.name)+'</small></span>').join('')+'</div>';
  detail+='<div class="collectionCosts">'+alanCost(owned?upgrade:cost)+'</div><div class="collectionBottom">'+tag('GELİŞTİR',pet?'trainPet':'wingUp','data-id="'+id+'" '+(!owned||lvl>=cap||!afford(state,upgrade)?'disabled':''),'collectionAction')+(pet?collectionEquip(key,id,cost,'ÇAĞIR'):'')+'</div>';
  body+=collectionPanel(detail,pet?1187:1240,188,pet?414:359,642,'collectionDetail');
  if(!pet)body+=collectionPanel(collectionEquip(key,id,cost),1024,765,184,61,'collectionEquipFloat');
 }else if(key==='titles'){
  const [id,name]=collectionChoice(key),ready=titleReady(state,id),on=state.slots.titles===id,[condition,value,max]=alanTitleCondition(id);
  body+=collectionPanel(collectionCards(key,collections[key],id,'collectionTitleCard'),123,190,480,630,'collectionRail collectionTitleRail');
  body+=collectionHero(638,278,612,555);
  body+=collectionPanel(collectionTitleVisible?safeText(name):'',685,192,513,72,'collectionHeroTitle');
  body+=collectionPanel('<h2>'+glyph('crown')+'</h2><h3>Unvan Etkisi</h3>'+alanStats(alanTitleStats(id))+tag('Göster: '+(collectionTitleVisible?'Açık':'Kapalı'),'collectionTitleToggle','','collectionToggle')+'<p>'+safeText(condition)+'</p>'+alanProgress(value,max,'Kazanım koşulu')+'<div class="collectionBottom">'+tag(on?'KULLANILIYOR':'UNVANI KULLAN','collectItem',alanCollectAttrs(key,id,on||!ready),'collectionAction')+(on?tag('Çıkar','removeSlot','data-key="titles"','collectionToggle'):'')+'</div>',1280,190,310,631,'collectionDetail');
 }else if(key==='auras'){
  const [id,name,desc,cost]=collectionChoice(key),on=state.slots.auras===id;
  body+=collectionHero(335,151,1003,515);
  body+=collectionPanel('<h3>'+safeText(name)+'</h3><p>'+(on?'Etkin':'Etkin değil')+'</p>',49,163,304,99,'collectionAuraName');
  body+=collectionPanel(tag('Efekti Göster: '+(collectionPreviewVisible?'Açık':'Kapalı'),'collectionAuraToggle','','collectionToggle'),1353,164,277,55,'collectionAuraToggle');
  body+=collectionPanel(collectionCards(key,collections[key],id),102,687,1215,157,'collectionAuraRail');
  body+=collectionPanel(collectionEquip(key,id,cost,'ETKİNLEŞTİR'),1380,731,263,70,'collectionEquipFloat');
 }else if(key==='relic'){
  const rows=EKONOMI.kalintilar,sel=rows.find(v=>v.id===collectionRelicId)||rows[0],owned=alanOwned(sel.id)||sel.id==='muhur'&&state.relicActive;
  body+=collectionPanel('<span>Tümü</span><strong>Toplanan '+rows.filter(v=>alanOwned(v.id)||v.id==='muhur'&&state.relicActive).length+' / '+rows.length+'</strong>',150,193,1400,51,'collectionRelicFilter');
  body+=collectionPanel(collectionCards(key,rows.map(v=>[v.id,v.name]),sel.id),145,274,1410,410,'collectionRelicShelf');
  body+=collectionPanel('<h2>'+safeText(sel.name)+'</h2><span>'+(sel.stat==='hp'?'Can':'Saldırı')+' +'+sel.base*Math.max(1,koleksiyonSeviye(state,'relic',sel.id))+'</span><div class="collectionCosts">'+alanCost(owned?koleksiyonBedeli(state,'relic',sel.id):sel.cost)+'</div>'+tag(owned?'GELİŞTİR':'ETKİNLEŞTİR',owned?'uiCollectionUp':'uiRelicOpen','data-group="relic" data-id="'+sel.id+'" '+(owned?(koleksiyonSeviye(state,'relic',sel.id)>=sel.cap||!afford(state,koleksiyonBedeli(state,'relic',sel.id))?'disabled':''):!afford(state,sel.cost)?'disabled':''),'collectionAction'),46,747,1580,91,'collectionRelicBottom');
 }else if(key==='charm'){
  const [id,name,desc,cost]=collectionChoice(key),on=state.slots.charm===id,active=state.slots.charm;
  body+=collectionPanel('<span>Yuvalar '+(active?1:0)+' / 1</span>',478,149,251,44,'collectionHeroTitle');
  body+=collectionPanel('<div class="collectionCharmRing"><div class="collectionCharmCenter">'+glyph('star')+'</div><div class="collectionCharmSocket">'+(active?collectionArt(key,active):glyph('gem'))+'</div></div>',275,200,650,550,'collectionCharmWheel');
  body+=collectionPanel('<header>Tümü <span>'+collections.charm.filter(([v])=>alanOwned(v)).length+' / '+collections.charm.length+'</span></header><div class="collectionCharmGrid">'+collectionCards(key,collections.charm,id)+'</div>',1063,172,512,574,'collectionCharmInventory');
  body+=collectionPanel(collectionArt(key,id)+'<h2>'+safeText(name)+'</h2><span>'+safeText(desc)+'</span><span>'+(on?'✓ Takılı':'')+'</span>'+collectionEquip(key,id,cost,'YERLEŞTİR'),119,781,1463,71,'collectionCharmBottom');
 }
 return '<section class="refViewport" aria-label="Ekipman · '+collectionLayoutNames[index]+'"><div class="refScreen collectionReferenceLayout collection-'+key+'">'+body+'</div></section>';
}
async function collectionLayoutAction(action,el){
 const d=el.dataset||{};
 if(action==='collectionNavigate'&&collectionLayoutKeys.includes(d.key)){await navigate(d.key,collectionLayoutKeys.includes(view));return true;}
 if(action==='collectionRelicSelect'){collectionRelicId=d.key;render();return true;}
 if(action==='collectionTitleToggle'){collectionTitleVisible=!collectionTitleVisible;render();return true;}
 if(action==='collectionAuraToggle'){collectionPreviewVisible=!collectionPreviewVisible;render();return true;}
 return false;
}
