let mailFilter='Tümü',noticeFilter='Tümü',noticeSelected='',settingsSection='Ses',chanceSelected=0;
const chanceCards=[['Dilek Sunağı','box'],['Günlük Çekiliş','slot'],['Çark-ı Şans','wheel'],['Gizem Sandıkları','box'],['Hazine Biletleri','scratch'],['Yıldız Dileği','dart'],['Kader Jetonları','coin'],['Etkinlik Çekilişi','race']];
const panelSettingDefaults={motion:true,quality:'Yüksek',fps:60,lowPower:false,vibration:false,quickBattleConfirm:false};
function panelHeader(kind){
 const xs=kind==='mail'?[838,1050,1271,1472]:[858,1034,1197,1345];
 let html=[state.gold,state.gems,state.crystals,energyNow(state)].map((n,i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],xs[i],23,i===3?113:78,54,'','<span class="refWalletValue panelWallet">'+profileNumber(n)+(i===3?'/'+energyCap:'')+'</span>')).join('');
 html+=refButton('Geri','back',kind==='mail'?52:66,12,96,96);
 if(kind!=='mail')for(const [key,label,x] of [['mail','Posta',1487],['notices','Bildirimler',1552],['settings','Ayarlar',1611]])html+=refButton(label,key,x,30,61,60);
 return html;
}
function panelScreen(kind,body){return '<section class="refViewport" aria-label="'+({mail:'Posta',notices:'Bildirimler',settings:'Ayarlar',chance:'Şans'}[kind])+'"><div class="refScreen ref-panel ref-'+kind+'">'+currencyPlate({mail:'posta_taban',notices:'bildirim_taban',settings:'ayarlar_taban',chance:'sans_taban'}[kind])+body+'</div></section>';}
function panelReward(key,n){return '<span class="panelReward">'+objectArt(key)+'<b>'+profileNumber(n)+'</b><small>'+safeText(moneyNames[key]||key)+'</small></span>';}
function referenceMail(){
 const present=!state.mailDeleted,pending=present&&!state.mailTaken;
 let body=panelHeader('mail');
 for(const [i,key] of ['Tümü','Sistem','Ödüller'].entries())body+=refButton(key,'panelMailFilter',113+i*210,132,211,66,'data-key="'+key+'" aria-pressed="'+(mailFilter===key)+'"',i===0&&mailFilter===key||i>0&&mailFilter!==key?'':'<span class="refCategoryState '+(mailFilter===key?'selected':'')+'">'+key+'</span>');
 if(present){
  body+='<div class="panelMailUnused" '+refAt(110,327,632,412)+' aria-hidden="true"></div>';
  body+=refButton('Geçit Erzağı','panelMailRead',110,226,632,94,'aria-pressed="true"','<span class="panelMailTitle">Geçit Erzağı</span><span class="panelMailMeta">Sistem · '+(state.mailTaken?'Alındı':'Ödül')+'</span>')
   +refValue('Geçit Erzağı',935,155,607,61,'panelDetailTitle')+refValue('Sistem',936,218,470,30,'panelMeta')
   +refValue('Yolculuğun için 1 yem ve 1 elmas.',830,296,703,104,'panelBodyText')
   +'<div class="panelMailRewards" '+refAt(967,535,400,128)+'>'+panelReward('feed',1)+panelReward('gems',1)+'</div>';
 }else body+=refValue('Posta kutun boş.',228,241,455,55,'panelEmpty');
 body+=refButton('Tümünü Al','claimMail',276,775,318,70,pending?'':'disabled')
  +refButton(state.mailTaken?'Alındı':'Al','claimMail',1305,750,271,76,pending?'':'disabled',state.mailTaken?'<span class="panelActionLabel">Alındı</span>':'')
  +refButton('Alınmış postayı kaldır','panelMailDelete',839,750,83,75,present&&state.mailTaken?'':'disabled');
 return panelScreen('mail',body);
}
function panelNotifications(){
 const notes=state.notificationSettings||{},rows=[];
 if(notes.rewards!==false&&!state.mailTaken&&!state.mailDeleted)rows.push({id:'mail',group:'Sistem',title:'Postada erzak var',body:'Geçit Erzağı postası: 1 yem ve 1 elmas.',target:'mail',action:'Postaya Git'});
 if(notes.rewards!==false&&canForge(state,upgradeOffer(state)))rows.push({id:'forge-'+(state.upgrades.item_kilic||0),group:'Sistem',title:'Kılıcını yükseltebilirsin',body:'Demirci yükseltmesi hazır.',target:'forge',action:'Demirciye Git'});
 const day=dayBook(state);
 if(notes.events!==false)for(const [key,name,,goal,gain] of eventsList)if(!day.flags[key]&&eventCount(day,key)>=goal)rows.push({id:'event-'+day.date+'-'+key,group:'Etkinlik',title:name+' ödülü hazır',body:lootText(gain),target:'events',action:'Etkinliğe Git'});
 if(notes.rewards!==false&&state.chests)rows.push({id:'chests-'+state.chests,group:'Sistem',title:'Açılabilir sandık · '+state.chests,body:'Çantanda '+state.chests+' sandık var.',target:'bag',action:'Çantaya Git'});
 if(notes.battles!==false)for(const log of (state.log||[]).slice(0,6))rows.push({id:'battle-'+[log.day,log.title,log.end,log.at].join('|'),group:'Savaş',title:log.title,body:{win:'Zafer',lose:'Yenilgi',timeout:'Süre doldu',draw:'Beraberlik',exit:'Geri çekilme'}[log.end]||log.end,date:log.day,target:'map',action:'Sefere Git'});
 return rows;
}
function referenceNotices(){
 const all=panelNotifications(),rows=all.filter(v=>noticeFilter==='Tümü'||v.group===noticeFilter),selected=rows.find(v=>v.id===noticeSelected)||rows[0],unread=all.filter(v=>!state.noticeRead?.includes(v.id)).length;
 let body=panelHeader('notices');
 for(const [i,key] of ['Tümü','Sistem','Etkinlik','Savaş'].entries())body+=refButton(key,'panelNoticeFilter',100,177+i*99,251,84,'data-key="'+key+'" aria-pressed="'+(noticeFilter===key)+'"',i===0&&noticeFilter===key||i>0&&noticeFilter!==key?'':'<span class="refCategoryState '+(noticeFilter===key?'selected':'')+'">'+key+'</span>');
 body+='<div class="panelNoticeRows" '+refAt(396,169,708,450)+'>'+rows.map((row,i)=>tag('<span class="panelNoticeSymbol">'+refCrop('bildirim_taban',row.group==='Savaş'?420:row.group==='Etkinlik'?420:425,row.group==='Savaş'?307:row.group==='Etkinlik'?190:423,56,64)+'</span><strong>'+safeText(row.title)+'</strong><span>'+safeText(row.date||row.group)+'</span>'+(!state.noticeRead?.includes(row.id)?'<i class="panelUnread"></i>':''),'panelNoticeSelect','data-id="'+safeText(row.id)+'" aria-pressed="'+(selected===row)+'"','panelNoticeRow'+(selected===row?' selected':''))).join('')+'</div>';
 if(!rows.length)body+=refValue('Bekleyen bildirim yok.',440,190,620,72,'panelEmpty');
 if(selected)body+=refValue(selected.title,1162,170,435,83,'panelNoticeTitle')+refValue(selected.date||selected.group,1165,244,430,29,'panelMeta')+refValue(selected.body,1164,307,432,263,'panelBodyText')
  +refButton(selected.action,selected.target,1245,664,343,66,'','<span class="panelActionLabel">'+selected.action+'</span>');
 if(!selected)body+=refButton('Bildirim yok','chanceHome',1245,664,343,66,'disabled','<span class="panelActionLabel">—</span>');
 body+=refValue('Okunmamış: '+unread,421,626,650,30,'panelUnreadCount')+refButton('Tümünü Okundu İşaretle','panelNoticeAll',432,666,436,66,unread?'':'disabled');
 return panelScreen('notices',body);
}
function panelSwitch(key,label,x,y,disabled=false){const on=!!state.settings[key];return refButton(label,'panelSetting',x,y,90,45,'data-key="'+key+'" role="switch" aria-checked="'+on+'" '+(disabled?'disabled':''),'<span class="panelSwitch '+(on?'on':'')+'"><i></i></span>');}
function referenceSettings(){
 let body=panelHeader('settings');
 for(const [i,key] of ['Ses','Görüntü','Oynanış','Bildirim'].entries())body+=refButton(key,'panelSettingsSection',104,190+i*97,250,83,'data-key="'+key+'" aria-pressed="'+(settingsSection===key)+'"',settingsSection===key?'<span class="panelSettingsSelected"></span>':'');
 body+='<input class="panelSoundRange" '+refAt(649,254,361,24)+' type="range" min="0" max="100" value="0" disabled aria-label="Müzik · Kapalı"><input class="panelSoundRange" '+refAt(649,320,361,24)+' type="range" min="0" max="100" value="0" disabled aria-label="Efektler · Kapalı">';
 body+=panelSwitch('vibration','Titreşim',929,468,typeof navigator.vibrate!=='function')+panelSwitch('quickBattleConfirm','Hızlı Savaş Onayı',929,544)+panelSwitch('lowPower','Düşük Güç Modu',929,620)
  +refValue('Hareket Efektleri',497,690,351,34,'panelSettingLabel')+panelSwitch('motion','Hareket Efektleri',929,684);
 for(const [i,key] of ['Düşük','Orta','Yüksek','Ultra'].entries())body+=refButton(key,'panelQuality',1099+i*117,239,116,54,'data-key="'+key+'" aria-pressed="'+((state.settings.quality||'Yüksek')===key)+'"',(state.settings.quality||'Yüksek')===key?'<span class="panelSettingsSelected"></span>':'');
 body+=refValue('Kare Hızı',106,611,247,34,'panelSettingLabel');
 for(const [i,n] of [30,60,120].entries())body+=refButton(n+' FPS','panelFps',105+i*83,656,78,41,'data-value="'+n+'" aria-pressed="'+((state.settings.fps||60)===n)+'"','<span class="panelSmallOption '+((state.settings.fps||60)===n?'selected':'')+'">'+n+'</span>');
 body+='<div id="saveTransfer" class="panelSaveControls" '+refAt(1108,501,430,110)+'><button class="panelSmallOption" data-save="export">Kaydı dışa aktar</button><button class="panelSmallOption" data-save="import">Kaydı yükle</button><input type="file" id="saveTransferFile" accept="application/json,.json" hidden></div>';
 body+=refButton('Varsayılanları Sıfırla','panelDefaults',1140,644,392,66);
 return panelScreen('settings',body);
}
function chanceRemaining(){return developerFree(state)?'∞':Math.max(0,3-dayBook(state).casino);}
function chanceRewards(key){
 if(key==='box')return [['gold',6],['feed',1],['ore',1]];
 if(key==='wheel')return Object.entries(wheelGifts.reduce((a,v)=>Object.assign(a,v),{}));
 const amounts={slot:24,scratch:18,dart:12,coin:10,race:20,hilo:0,mine:9};
 return amounts[key]?[['gold',amounts[key]]]:[];
}
function referenceChance(){
 const [title,key]=chanceCards[chanceSelected],remaining=chanceRemaining(),gains=chanceRewards(key);
 let body=refButton('Geri','back',17,5,65,65);
 body+=[state.gold,state.gems,state.crystals,energyNow(state)].map((n,i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],1304+i*87,15,84,47,'','<span class="chanceWalletIcon">'+hudIcon(['gold','gem','crystal','energy'][i])+'</span><span class="chanceWalletValue refWalletValue">'+profileNumber(n)+'</span>')).join('');
 // Sekmeler Şans ekranından çıkarmaz: Sandıklar ve Etkinlik ilgili çekilişi seçer.
 const tabActions=['chanceTabHome','chanceGames','chanceTabBox','chanceTabEvent','chanceTickets'];
 for(const [i,name] of ['Dilekler','Çekilişler','Sandıklar','Etkinlik','Biletler'].entries())body+=refButton(name,tabActions[i],369+i*212,71,207,47);
 for(const [i,[name,game]] of chanceCards.entries()){
  const row=Math.floor(i/2),x=i%2?269:30,y=[154,338,511,664][row],h=[172,162,143,127][row];
  body+=refButton(name,'chanceSelect',x,y,222,h,'data-i="'+i+'" aria-pressed="'+(chanceSelected===i)+'"',chanceSelected===i?'<span class="marketChosen"></span>':'')+refValue(remaining===0?'Alıştırma':developerFree(state)?'Bedelsiz':'1 hak',x+25,y+h-38,172,29,'chanceCardCost');
 }
 body+=refValue(title,612,151,486,48,'chanceTitle')+refValue(games[key][1],570,207,566,51,'chanceDescription')
  +'<div class="chanceRewards" '+refAt(1237,251,379,109)+'>'+gains.map(([k,n])=>panelReward(k,n)).join('')+'</div>'
  +'<div class="chanceCategories" '+refAt(1210,427,416,91)+'>'+gains.map(([k])=>'<span>'+objectArt(k)+'<small>'+safeText(moneyNames[k])+'</small></span>').join('')+'</div>'
  +refValue('Kalan Hak: '+remaining+(developerFree(state)?'':' / 3'),1205,612,418,44,'chanceRemaining')
  +refValue('Kalan Hak: '+remaining,561,623,259,32,'chanceRemaining')
  +refButton('1 Çekiliş','chancePlay',583,671,223,65,'data-key="'+key+'"')
  +refButton('10 Çekiliş · Kapalı','chanceHome',878,671,253,65,'disabled title="Kapalı"','<span class="panelDisabledShade"></span>')
  +refButton('Kurallar','tableInfo',1208,552,425,38,'data-key="'+key+'"')
  +refButton('Alıştırma','chancePractice',1290,679,252,46,'data-key="'+key+'"','<span class="panelSmallOption">Alıştırma</span>')
  +refValue('Mağaza',202,819,154,73,'chanceOffersTitle');
 for(const [i,k] of ['ore','ration','chest','gems'].entries()){
  const x=372+i*313,g=goods[k];
  body+='<div class="chanceOfferArt" '+refAt(x+15,831,94,80)+'>'+objectArt(goodsVisual[k])+'</div>'+refValue(g.name,x+117,829,175,30,'chanceOfferName')
   +refValue(lootText(g.gain),x+117,860,175,26,'chanceOfferMeta')+refButton(g.name+' al','buy',x+122,891,164,27,'data-key="'+k+'" '+(afford(state,g.cost)?'':'disabled'),'<span class="chanceOfferCost">'+referenceCost(g.cost)+'</span>');
 }
 return panelScreen('chance',body);
}
async function panelAction(action,el){
 const d=el.dataset||{};
 if(action==='mail'||action==='panelMailRead'){
  if(!state.mailRead){state=await transact(s=>{s.mailRead=true;});tell();}
  if(action==='panelMailRead'){render();return true;}return false;
 }
 if(action==='panelMailFilter'){mailFilter=d.key;render();return true;}
 if(action==='panelMailDelete'){if(!state.mailTaken)return true;state=await transact(s=>{if(!s.mailTaken)return false;s.mailDeleted=true;});tell();render();return true;}
 if(action==='panelNoticeFilter'){noticeFilter=d.key;noticeSelected='';render();return true;}
 if(action==='panelNoticeSelect'||action==='panelNoticeAll'){
  const ids=action==='panelNoticeAll'?panelNotifications().map(v=>v.id):[d.id];
  if(action==='panelNoticeSelect')noticeSelected=d.id;
  state=await transact(s=>{s.noticeRead=[...new Set([...(s.noticeRead||[]),...ids])].slice(-100);});tell();render();return true;
 }
 if(action==='panelSettingsSection'){settingsSection=d.key;render();if(d.key==='Bildirim')bildirimAyarPenceresi();return true;}
 if(['panelSetting','panelQuality','panelFps','panelDefaults'].includes(action)){
  state=await transact(s=>{
   if(action==='panelDefaults')Object.assign(s.settings,panelSettingDefaults);
   else if(action==='panelQuality'&&['Düşük','Orta','Yüksek','Ultra'].includes(d.key))s.settings.quality=d.key;
   else if(action==='panelFps'&&[30,60,120].includes(Number(d.value)))s.settings.fps=Number(d.value);
   else if(action==='panelSetting'&&['motion','lowPower','vibration','quickBattleConfirm'].includes(d.key))s.settings[d.key]=!s.settings[d.key];
   else return false;
  });tell();render();return true;
 }
 if(action==='chanceSelect'){if(chanceCards[Number(d.i)])chanceSelected=Number(d.i);render();return true;}
 if(action==='chanceHome')return true;
 if(action==='chanceTabHome'||action==='chanceTabBox'||action==='chanceTabEvent'){chanceSelected=action==='chanceTabBox'?3:action==='chanceTabEvent'?7:0;render();return true;}
 if(action==='chanceTickets'){openModal('Oyun Hakları','Kalan hak: '+chanceRemaining()+' / 3');return true;}
 if(action==='chanceGames'){openModal('Oyunlar','<div class="chanceGameList">'+Object.entries(games).map(([key,[name]])=>tag(name,'chancePlay','data-key="'+key+'"','panelSmallOption')).join('')+'</div>');return true;}
 if(action==='chancePlay'||action==='chancePractice'){
  if(!games[d.key])return true;if(modal.open)modal.close();casinoSelection=d.key;
  const practice=action==='chancePractice';
  if(!practice&&!developerFree(state)&&dayBook(state).casino>=EKONOMI.gunlukHak.casino){toast('Şans hakkı bitti.');return true;}
  await changeState(s=>dealRound(s,d.key,practice));
  return true;
 }
 return false;
}
