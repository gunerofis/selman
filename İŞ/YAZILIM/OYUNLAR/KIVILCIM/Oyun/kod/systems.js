let casinoSelection='',marketTab='Mağaza',bossTab='Bölge',rival=0;
const regionForStage=i=>regions[regionOf(i)];
function campaignPage(){
 const r=regionOf(chosenStage),data=regions[r],indices=route.slice(r*3,r*3+3),enc=encounters[chosenStage],first=!state.cleared.includes(enc.id);
 const picker='<div class="regionPicker">'+tag('‹','regionPick','aria-label="Önceki bölge" data-i="'+(r-1)+'" '+(!r?'disabled':''),'minor')+'<span><b>'+data[0]+'</b> · '+(r+1)+' / '+regions.length+'</span>'+tag('›','regionPick','aria-label="Sonraki bölge" data-i="'+(r+1)+'" '+(r===regions.length-1?'disabled':''),'minor')+'</div>';
 const routeTiles=indices.map((id,j)=>{const s=encounters[id],done=state.cleared.includes(s.id);return tag('<span class="sigil"><i>'+(done?'✓':j+1)+'</i></span><strong>'+routeName(id)+'</strong><small>'+s.id+' · '+(done?'Tamamlandı':allowed(id,state)?'Açık':'Kilitli')+'</small>','selectStage','data-i="'+id+'" aria-pressed="'+(chosenStage===id)+'"','stop '+(chosenStage===id?'active':''));}).join('');
 const reward={gold:first?enc.gold:BALANCE.repeatGold,xp:first?enc.xp:BALANCE.repeatXp};if(first&&enc.kind==='campaign'){reward.gems=1;if(enc.final)reward.chests=1;}
 return section(data[0]+' yolu',picker+'<div class="route">'+routeTiles+'</div><div class="panel stack"><div class="kicker">'+enc.id+' / '+(indices[2]===chosenStage?'BÖLGE BOSSU':enc.enemies.length>1?'GRUP SAVAŞI':'DÜELLO')+'</div><h3>'+routeName(chosenStage)+'</h3><p>'+enc.enemies.map(e=>foeNames[e.id]+' · '+e.hp+' can').join('　/　')+'</p>'+(enc.tactic!==undefined?'<div class="tactic"><b>'+tactics[enc.tactic][0]+'</b> · '+tactics[enc.tactic][1]+'</div>':'')+'<p class="muted">'+(first?'İlk geçiş':'Tekrar')+' · '+lootText(reward)+(first&&enc.firstClearBonus?' · Köy Kılıcı':'')+(first&&enc.final?' · +2 saldırı ve +3 can':'')+'</p><div class="row">'+tag(allowed(chosenStage,state)?'Savaşa gir':'Önceki durağı tamamla','start',!allowed(chosenStage,state)?'disabled':'')+tag('Ekipman','equip','','action sub')+tag('Demirci','forge','','action sub')+'</div></div>','SEFER HARİTASI');
}
function tabs(list,selected,actName){return '<div class="tabs">'+list.map(t=>tag(t,actName,'data-key="'+t+'" aria-pressed="'+(t===selected)+'"','tab '+(t===selected?'on':''))).join('')+'</div>';}
function rowCard(name,info,button){return '<article class="lineCard"><div><h3>'+name+'</h3><p class="muted">'+info+'</p></div><div>'+button+'</div></article>';}
function startTrial(idx,label){
 const k=encounters[idx].kind,used=dayBook(state).used[k]||0,can=allowed(idx,state)&&(!quotas[k]||used<quotas[k]);
 return tag(can?label:'Hak kapalı','trialStart','data-i="'+idx+'" '+(!can?'disabled':''));
}
let selectedBossRegion=0,selectedHuntRegion=0;
function zonePicker(r,action){
 const step=(n,label,symbol)=>tag(symbol,action,'aria-label="'+label+'" data-i="'+n+'" '+(!regions[n]?'disabled':''),'minor');
 return '<div class="regionPicker">'+step(r-1,'Önceki bölge','‹')+'<span><b>'+regions[r][0]+'</b> · '+(r+1)+' / '+regions.length+'</span>'+step(r+1,'Sonraki bölge','›')+'</div>';
}
function regionalHuntPage(){
 const r=selectedHuntRegion,i=huntingGrounds[r],open=allowed(i,state);
 const names=encounters[i].enemies.map(e=>'<span>'+foeNames[e.id]+'</span>').join('');
 return section('Av',zonePicker(r,'huntRegion')+modeCover('av',routeName(i),regions[r][0].toLocaleUpperCase('tr')+' · 3 HEDEF')+'<div class="panel stack"><div class="tracks">'+names+'</div><p>Her hedef 5 altın ve 1 cevher verir. Üç hedefi avlarsan 1 ek cevher kazanırsın.</p><div class="stats"><span class="stat">Enerji <b id="energyInline">'+energyLabel(state)+'</b></span><span class="stat">Cevher <b>'+state.ore+'</b></span></div><div class="row">'+tag(open?'Ava gir · 2 enerji':(r+1)+'-1 durağını tamamla','startHunt',!open||(!developerFree(state)&&energyNow(state)<huntCost)?'disabled':'')+tag('Demirci','forge','','action sub')+'</div></div>');
}
function bossesPage(){
 const head=tabs(['Bölge','Günlük','Dünya'],bossTab,'bossTab');let cards='';
 if(bossTab==='Bölge'){
  const r=selectedBossRegion;cards=zonePicker(r,'bossRegion');
  for(const [rank,i] of bossLadders[r].entries()){
   const e=encounters[i],open=allowed(i,state),paid=(i===BRIDGE?state.bossPaidDay:state.dailyBossDays[regionalKey(e)])===rewardDay();
   const info=open?e.enemies[0].hp+' can · '+(paid?'10 altın':'Bugünün ilk zaferi 3 kalıntı parçası'):rank?'Önce '+routeName(bossLadders[r][rank-1])+' düellosunu kazan.':(r+1)+'-3 durağını tamamla.';
   const button=open?(i===BRIDGE?tag('Boss’a meydan oku','startBoss'):startTrial(i,'Düelloya gir')):tag('Kilitli','trialStart','disabled','minor');
   cards+=rowCard(routeName(i),info+(open&&e.tactic!=null?' · '+tactics[e.tactic][0]:''),button);
  }
 }else{
  const k=bossTab==='Günlük'?'daily':'world',i=trials[k][0],left=Math.max(0,quotas[k]-(dayBook(state).used[k]||0));
  cards=rowCard(routeName(i),k==='daily'?'%25 / %50 / %100 hasarda 1 / 2 / 4 kristal.':'Her hasarlı deneme 1 kalıntı parçası. En iyi hasarın '+(state.stats.world||0)+'.',startTrial(i,'Meydan oku'));
  cards+='<p class="muted">Bugün kalan hak '+left+' / '+quotas[k]+' · Türkiye saatiyle gece yarısı yenilenir.</p>';
 }
 return section('Boss',head+'<div class="stack">'+cards+tag('Kalıntılar','relic','','action sub')+'</div>','SAVAŞ ALANLARI');
}
function arenaPage(){const idx=trials.arena[rival],op=encounters[idx];
 return section('Arena','<div class="duelLine"><div><b>Kahraman</b><small>'+healthOf(state)+' can</small></div><strong aria-label="düello">⚔</strong><div><b>'+op.title+'</b><small>'+op.enemies[0].hp+' can</small></div></div>'+tabs(trials.arena.map(routeName),op.title,'rival')+'<div class="panel stack"><div class="stats"><b>Yerel antrenman · 1v1</b><span>'+ (state.stats.rating||0)+' puan</span><span>'+state.arenaCoin+' arena jetonu</span></div><p>30 saniye sonunda kalan can yüzdesi yüksek olan kazanır. İlk üç günlük galibiyetin her biri 2 jeton verir.</p><div class="row">'+startTrial(idx,'Düelloya gir')+tag('Arena mağazası','arenaStore','','action sub')+'</div></div>');
}
function guildPage(){
 if(!state.guild)return section('Lonca',modeCover('guild','Geçit Muhafızları','YEREL LONCA')+'<div class="panel stack"><p>Sancağa katıl. Lonca karşılaşmaları bu cihazda bilgisayar rakipleriyle oynanır.</p><div>'+tag('Loncaya katıl','joinGuild')+'</div></div>');
 return section('Geçit Muhafızları',modeCover('guild','Geçit Muhafızları','YEREL LONCA')+'<div class="balanceLine"><span>'+state.guildCoin+' jeton</span><span>'+state.donated+' altın bağış</span></div><div class="stack">'+rowCard('Lonca Bossu','Günde 1 giriş. Hasar için 2, zafer için toplam 5 jeton.',startTrial(trials.guildBoss[0],'Boss’a saldır'))+rowCard('Sancak düellosu','Günde 1 düello. Zafer 3 jeton ve 2 lonca puanı.',startTrial(trials.guildWar[0],'Sancağı savun'))+rowCard('Lonca sandığı','20 altın bağışla, 1 lonca jetonu kazan.',tag('Bağışla','donate',afford(state,{gold:20})?'':'disabled'))+tag('Lonca mağazası','guildStore','','action sub')+'</div>');
}
const eventsList=[
 ['hunt','Av nöbeti','Üç avı bütün hedefleri indirerek bitir.',3,{chests:1}],
 ['win','Zafer günü','Herhangi bir savaşta iki galibiyet al.',2,{gems:2}],
 ['arena','Düello çağrısı','Bir arena galibiyeti al.',1,{crystals:2}]
];
function eventCount(b,k){return k==='hunt'?b.hunts:k==='arena'?b.arenaWins:b.wins;}
function rankings(){const recent=state.log.slice(0,5).map(r=>'<div class="record"><span>'+r.title+'</span><b>'+({win:'Zafer',lose:'Yenilgi',timeout:'Süre doldu',draw:'Beraberlik',exit:'Geri çekilme'}[r.end])+'</b></div>').join('');const times=Object.entries(state.bestTimes).filter(([k])=>encounters[k]).sort((a,b)=>a[1]-b[1]).slice(0,8);
 return section('Kişisel rekorlar','<div class="grid">'+[['Arena puanı',state.stats.rating||0],['Dünya bossu hasarı',state.stats.world||0],['Lonca puanı',state.stats.guildScore||0]].map(([n,v])=>'<div class="panel bigStat"><small>'+n+'</small><b>'+v+'</b></div>').join('')+'</div><div class="panel spaced stack"><h3>En hızlı zaferlerin</h3>'+(times.length?times.map(([i,t],k)=>'<div class="record"><span>'+(k+1)+'. '+routeName(Number(i))+'</span><b>'+seconds(t)+' sn</b></div>').join(''):'İlk zaferin burada görünür.')+'</div>'+(recent?'<div class="panel stack"><h3>Son karşılaşmalar</h3>'+recent+'</div>':''),'BU CİHAZDA');
}
function mailPage(){return section('Posta',rowCard('Geçit erzağı','Köyden yolculuğa çıkanlar için 1 yem ve 1 elmas.',tag(state.mailTaken?'Alındı':'Eki al','claimMail',state.mailTaken?'disabled':'')));}
function noticePage(){const b=dayBook(state),ready=eventsList.filter(([k,, ,goal])=>!b.flags[k]&&eventCount(b,k)>=goal);
 const entries=[];if(!state.mailTaken)entries.push(['Postada erzak var','mail']);if(canForge(state,upgradeOffer(state)))entries.push(['Kılıcını yükseltebilirsin','forge']);if(ready.length)entries.push(['Etkinlik ödülün hazır','events']);if(state.chests)entries.push(['Açılabilir sandık · '+state.chests,'bag']);
 return section('Bildirimler','<div class="stack">'+(entries.map(([n,k])=>rowCard(n,'',tag('Aç',k))).join('')||'<p class="panel">Bekleyen ödül yok.</p>')+'</div>');}
function extraReceipt(r){const k=encounters[r.index].kind,dest=k==='arena'?'arena':k?.startsWith('guild')?'guild':'boss',gain={...r.extra};
 return section(routeName(r.index),'<div class="panel receipt stack"><div class="kicker">'+encounters[r.index].id+'</div><h1>'+({win:'Zafer',lose:'Yenilgi',exit:'Geri çekildin',timeout:'Süre doldu',draw:'Beraberlik'})[r.end]+'</h1><p>'+seconds(r.at)+' sn · '+r.hp+' can</p><p class="reward">'+(lootText(gain)||'Ödül yok.')+'</p><p>'+ (r.note||'')+'</p><div class="row">'+tag(titleOf[dest]+' merkezine dön',dest)+tag('Merkeze dön','hub','','action sub')+'</div></div>');
}
// Ekran içi pencereler. Kural: sekmeler başka ekrana geçirmez; ilgili içerik yerinde açılır.
function dukkanPenceresi(key,para,not){const g=goods[key];return '<p>'+safeText(not)+'</p><p><b>'+(state[para]||0)+'</b> '+moneyNames[para]+'</p><p>'+safeText(g.name)+' · '+lootText(g.gain)+'</p>';}
function dukkanDugmesi(key){const g=goods[key];return tag('Al · '+lootText(g.cost),'buy','data-key="'+key+'" '+(afford(state,g.cost)?'':'disabled'));}
function altinKazanPenceresi(){openModal('Altın Kazan','<p>Sefer: her zaferde altın.</p><p>Av: hedef başına '+EKONOMI.av.hedefAltin+' altın.</p><p>Boşta Ganimet: oyun kapalıyken birikir.</p>',tag('Sefer','map')+tag('Av','av','','action sub'));}
function gunlukOdulPenceresi(){const b=dayBook(state);openModal('Günlük Ödül',eventsList.map(([k,ad,,hedef,odul])=>'<p>'+safeText(ad)+' · '+Math.min(eventCount(b,k),hedef)+' / '+hedef+' · '+lootText(odul)+(b.flags[k]?' ✓':'')+'</p>').join(''),tag('Etkinlikler','events'));}
function sandikPenceresi(){openModal('Sandıklar','<p>Elmasla sandık açılır. Sandıklar ekipman, tüy ve yumurta verir.</p>',tag('Market','shopChests'));}
function bildirimAyarPenceresi(){const n=state.notificationSettings||{};openModal('Bildirim Ayarları',[['rewards','Ödüller'],['battles','Savaşlar'],['events','Etkinlikler']].map(([k,ad])=>tag(ad+' · '+(n[k]?'Açık':'Kapalı'),'bildirimAyar','data-key="'+k+'" aria-pressed="'+!!n[k]+'"','action sub')).join(''));}
async function changeState(work,message){
 let changed=false;state=await transact(s=>{if(s.fight)return false;changed=work(s)!==false;return changed;});
 if(state.fight){reflect(state);return;}render();if(changed){tell();if(message)toast(message);}
}
async function systemAction(action,b){
 if(await gelisimAction(action,b))return true;
 const d=b.dataset;
 switch(action){
 case 'regionPick':{const r=Number(d.i);if(!regions[r])break;chosenStage=route.slice(r*3,r*3+3).find(i=>!state.cleared.includes(encounters[i].id))??route[r*3+2];render();break;}
 case 'huntRegion':case 'bossRegion':{const r=Number(d.i);if(!regions[r])break;if(action==='huntRegion')selectedHuntRegion=r;else selectedBossRegion=r;render();break;}
 case 'bossTab':bossTab=d.key;render();break;
 case 'trialStart':await begin(Number(d.i));break;
 case 'rival':rival=trials.arena.findIndex(i=>routeName(i)===d.key);render();break;
 case 'arenaStore':case 'guildStore':marketTab=action==='arenaStore'?'Arena':'Lonca';await navigate('market');break;
 case 'marketTab':marketTab=d.key;render();break;
 case 'shopEarn':altinKazanPenceresi();break;
 case 'shopDaily':gunlukOdulPenceresi();break;
 case 'shopChestInfo':sandikPenceresi();break;
 case 'bildirimAyar':await changeState(s=>{if(!s.notificationSettings||!Object.hasOwn(s.notificationSettings,d.key))return false;s.notificationSettings[d.key]=!s.notificationSettings[d.key];});bildirimAyarPenceresi();break;
 case 'buy':if(modal.open)modal.close();await changeState(s=>{const g=goods[d.key];if(!g||!spend(s,g.cost))return false;give(s,g.gain);},'Çantana eklendi.');break;
 case 'openChest':await changeState(s=>{if(!spend(s,{chests:1}))return false;give(s,{gold:10,feed:1});rollGear(s,campaignMastery(s)+1,1.5);},'10 altın, 1 yem ve bir eşya.');break;
 case 'claimMail':await changeState(s=>{if(s.mailTaken)return false;s.mailTaken=true;give(s,EKONOMI.posta);},'Erzak çantana eklendi.');break;
 case 'claimEvent':await changeState(s=>{const b=dayBook(s),ev=eventsList.find(e=>e[0]===d.key);if(!ev||b.flags[d.key]||eventCount(b,d.key)<ev[3])return false;b.flags[d.key]=true;give(s,ev[4]);},'Etkinlik ödülü alındı.');break;
 case 'joinGuild':if(modal.open)modal.close();await changeState(loncayaKatil);break;
 case 'donate':if(modal.open)modal.close();await changeState(loncaBagisYap,'1 lonca jetonu kazandın.');break;
 case 'collectItem':await changeState(s=>{const item=collections[d.key]?.find(row=>row[0]===d.id);if(!item)return false;
  if(!s.unlocks.includes(d.id)){if(d.key==='titles'&&!titleReady(s,d.id)||!spend(s,item[3]))return false;s.unlocks.push(d.id);}
  s.slots[d.key]=d.id;},'Kuşanıldı.');break;
 case 'removeSlot':await changeState(s=>{if(d.key==='pet')return false;delete s.slots[d.key];});break;
 case 'trainPet':await changeState(s=>{const id=d.id||petOf(s);if(!s.unlocks.includes(id))return false;const l=lvlOf(s,'pet',id);if(l>=MAX_LVL||!spend(s,petUpCost(s,id)))return false;s.petLevel||={};s.petLevel[id]=l+1;if(id==='ak'&&s.training<3)s.training++;},'Eğitim tamamlandı.');break;
 case 'table':casinoSelection=d.key;render();break;
 case 'allTables':casinoSelection='';render();break;
 case 'tableInfo':openModal(games[d.key][0],games[d.key][1]);break;
 case 'deal':await changeState(s=>dealRound(s,d.key,d.practice==='1'));break;
 case 'tableMove':await changeState(s=>playRound(s,d.id,Number(d.step),d.choice));break;
 default:return false;
 }
 return true;
}
