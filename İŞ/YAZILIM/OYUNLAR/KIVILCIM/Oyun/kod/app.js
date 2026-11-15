const $=id=>document.getElementById(id), main=$('main'), topbar=$('top'), foot=$('foot'), modal=$('modal');
const stageNames=encounters.map((e,i)=>routeName(i));
const foeNames={...allNames,yaban_kopek:'Yaban köpeği',haydut:'Haydut',baskinci:'Baskıncı',kopru_haraci:'Köprü Haracı'};
const weaponNames={item_dagger:'Yolcu Hançeri',item_kilic:'Köy Kılıcı'};
const leftNav=[['market','Market'],['casino','Şans'],['guild','Lonca'],['forge','Demirci'],['events','Etkinlikler'],['rank','Sıralama']];
const rightNav=[['equip','Ekipman'],['pet','Petler'],['wings','Kanatlar'],['relic','Kalıntılar'],['charm','Tılsımlar'],['titles','Unvanlar'],['auras','Auralar']];
const bottomNav=[['av','Av'],['map','Sefer'],['boss','Boss'],['arena','Arena']];
const titleOf=Object.fromEntries([...leftNav,...rightNav,...bottomNav,['bag','Çanta'],['profile','Profil'],['settings','Ayarlar'],['mail','Posta'],['notices','Bildirimler']]);
let state, fight, view='hub', chosenStage=0, chosenWeapon=BALANCE.starterWeapon, equipFrom='hub',profileTab='Özet',busy=false,finishing=false,observer=false;
let lastFrame=0,lastWrite=0,carry=0,toastTimer,localPaused=false,learnedGuard=false;
let channel=null;try{if(typeof BroadcastChannel==='function')channel=new BroadcastChannel('kivilcim-sync'+(QA?'-qa':''));}catch{/* An opaque preview origin may disable cross-tab messaging. */}
function tag(text,action,other='',cls='action'){return '<button class="'+cls+'" data-act="'+action+'" '+other+'>'+text+'</button>';}
const keyByButton={portrait:'portrait_hero',market:'nav_market',casino:'hub_casino',guild:'hub_guild',forge:'tab_forge',events:'hub_events',rank:'hub_rank',equip:'hub_equipment',pet:'tab_pet',wings:'hub_wings',relic:'tab_relic',charm:'hub_charms',titles:'hub_titles',auras:'hub_auras',map:'mode_expedition',boss:'mode_boss',av:'mode_hunt',arena:'mode_arena',bag:'nav_bag'};
function artTag(k){return '<img src="'+(atlasDefs[keyByButton[k]||k]?.icon||ART[k])+'" alt="">';}
function section(title,body,over='KÖY SEFERİ'){if(venues[view]&&!observer)return venuePage(view,title,body);return '<section class="page"><div class="pageIn">'+tag('‹ Geri','back','','back')+'<div class="heading"><div><div class="kicker">'+over+'</div><h2>'+title+'</h2></div></div>'+body+'</div></section>';}
function weaponName(key){return (weaponNames[key]||'Silahsız')+(state.upgrades[key]?' +'+state.upgrades[key]:'');}
function openModal(title,body,buttons=''){modal.innerHTML='<div class="stack"><h3>'+title+'</h3><div>'+body+'</div><div class="row">'+buttons+tag('Kapat','close','','action sub')+'</div></div>';uiPrepareControls(modal);if(!modal.open)modal.showModal();}
function toast(text){$('toast').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').textContent='',2300);}
function setView(name){const changed=name!==view;view=name;lastFrame=performance.now();render();if(changed)window.scrollTo?.(0,0);}
function currentStage(){return route.find(i=>!state.cleared.includes(encounters[i].id))??route[route.length-1];}
function unlocked(i,s=state){return allowed(i,s);}
function header(){
 if(view==='hub'&&!fight&&!observer){topbar.innerHTML='';return;}
 const level=1+Math.floor(Math.sqrt(state.xp/BALANCE.level2TotalXp));
 const hudBusy=!!fight||observer;
 if(hudBusy){topbar.innerHTML='<div class="brand"><span class="crest">✦</span> KIVILCIM</div><span class="kicker">KÖY SEFERİ</span>';return;}
 const r=(symbol,n,action,label)=>tag('<span>'+symbol+'</span> <b>'+n+'</b><small>＋</small>',action,'aria-label="'+label+'"','resource');
 topbar.innerHTML='<div class="brand"><span class="crest">✦</span> KIVILCIM</div>'+tag(artTag('portrait')+' Sv. '+level,'profile','aria-label="Profil resmi"','profileBtn')+'<div class="hdrGroup wallet">'+r(hudIcon('gold'),state.gold,'gold','Altın')+r(hudIcon('gem'),state.gems,'gem','Elmas')+r(hudIcon('crystal'),state.crystals,'crystal','Kristal')+r(hudIcon('energy'),energyNow(state),'energy','Enerji')+tag('Bölüm '+encounters[currentStage()].id,'chapter','','minor')+'</div><div class="hdrGroup topAux">'+tag('✉','mail','aria-label="Posta"','minor')+tag('♢','notices','aria-label="Bildirimler"','minor')+tag('⚙','settings','aria-label="Ayarlar"','minor')+'</div>';
}

function navButton(row,mode=false){return hubNavButton(row,mode);}
function hub(){return referenceHub();}

function drawHub(){
 const can=$('hubCanvas');if(!can)return;const {c,w,h}=context(can);
 if(w/h>1.1&&state.slots.pet!=='tilki'&&!state.slots.wings&&!state.slots.auras){paintHubScene(c,w,h);}
 else {
  const im=images.valley,scale=Math.max(w/260,h/530);
  img(c,'valley',(w-260*scale)/2,(h-530*scale)/2,260*scale,530*scale);
  const ground=c.createLinearGradient(0,h*.70,0,h);ground.addColorStop(0,'#252a2a00');ground.addColorStop(1,'#292b27');c.fillStyle=ground;c.fillRect(0,h*.70,w,h*.3);
  const size=Math.min(h*.43,w*.62);drawAura(c,w*.43,h*.9,size);if(state.slots.pet==='tilki')drawFox(c,w*.63,h*.89,size*.46);else img(c,'companion',w*.60,h*.89-size*.68,size*.44,size*.68);heroArt(c,w*.43,h*.9,size,state.equipped);
 }
}
function stageMap(){return campaignPage();}
function swordIcon(k){if(k==='item_dagger')return artTag(k);return '<img alt="" src="'+swordImage+'">';}
const swordImage=(()=>{const can=document.createElement('canvas');can.width=80;can.height=112;const c=can.getContext('2d');c.translate(25,85);blade(c,'item_kilic');return can.toDataURL();})();
function weapons(){return state.items.filter(k=>Object.hasOwn(weaponNames,k));}
function equipment(){
 const k=chosenWeapon,atk=BALANCE.hero.baseAttack+bonus(state,k)+bonusAttack(state);
 return section('Ekipman','<div class="inventory"><div class="stack">'+weapons().map(it=>tag(swordIcon(it)+'<span><b>'+weaponName(it)+'</b><small>'+(state.equipped===it?'Kuşanıldı':'Çanta')+'</small></span>','pick','data-key="'+it+'"','weapon '+(k===it?'active':''))).join('')+'</div><div class="panel stack"><div class="kicker">SİLAH YUVASI</div><h3>'+weaponName(k)+'</h3><div class="stats"><div class="bigStat"><small>Mevcut saldırı</small><b>'+attack(state)+'</b></div><div class="bigStat"><small>Bu silahla</small><b>'+atk+'</b></div></div><p class="muted">'+(k==='item_kilic'?'Köy girişini temizlediğinde kazandığın kılıç.':'Yolculuğa başladığın kısa hançer.')+'</p><div class="row">'+tag(state.equipped===k?'Kuşanıldı':'Kuşan','wear',state.equipped===k?'disabled':'')+(equipFrom==='result'||equipFrom==='map'?tag('Kuşan ve devam et','wearGo','','action sub'):'')+'</div></div></div>');
}
function bag(){
 const materials=[['Cevher',state.ore,'⬙'],['Yem',state.feed,'❧'],['Kalıntı parçası',state.shards,'◇'],['Sandık',state.chests,'▣']];
 const pockets=materials.map(([name,n,icon])=>'<div class="pocket">'+emblem(icon)+'<span>'+name+'</span><b>'+n+'</b></div>').join('');
 return section('Çanta','<div class="pockets">'+pockets+'</div>'+tag('Sandık aç','openChest',state.chests<1?'disabled':'')+'<div class="weaponRoll"><h3>Silahlar</h3>'+weapons().map(k=>tag(swordIcon(k)+'<span><b>'+weaponName(k)+'</b><small>Ekipmanda incele</small></span>','bagPick','data-key="'+k+'"','weapon')).join('')+'</div>');
}
function energyLabel(s){const n=energyNow(s);if(n===energyCap)return n+' / '+energyCap+' · Dolu';
 const remaining=energyPeriod-Math.max(0,Date.now()-s.energyAt)%energyPeriod,sec=Math.ceil(remaining/1000);
 return n+' / '+energyCap+' · Sonraki enerji '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}
function modeCover(icon,title,meta){return '<div class="modeCover '+icon+'">'+artTag(icon)+'<div><div class="kicker">'+meta+'</div><h3>'+title+'</h3></div></div>';}
function huntPage(){return regionalHuntPage();}
function forge(){
 const offer=upgradeOffer(state),level=state.upgrades.item_kilic||0,has=state.items.includes('item_kilic');
 const cost=offer?offer.gold+' altın'+(offer.ore?' + '+offer.ore+' cevher':''):'';
 const rail='<div class="smithRail" aria-label="Silah seviyesi '+level+' / 2">'+[0,1,2].map(n=>'<span class="'+(has&&n<=level?'forged':'')+'">+'+n+'</span>').join('')+'</div>';
 return section('Demirci','<div class="smithBlade">'+swordIcon('item_kilic')+'</div>'+rail+'<div class="panel stack"><div class="kicker">SİLAH YÜKSELTME</div><h3>'+weaponName('item_kilic')+'</h3><div class="stats"><div class="bigStat"><small>Silah bonusu</small><b>+'+bonus(state,'item_kilic')+(offer?' → +'+(bonus(state,'item_kilic')+2):'')+'</b></div><div class="bigStat"><small>Altın</small><b>'+state.gold+'</b></div><div class="bigStat"><small>Cevher</small><b>'+state.ore+'</b></div></div><p class="muted">'+(!has?'Köy girişini geçerek kılıcı kazan.':offer?'Yükseltme bedeli '+cost+'.':'Kılıç en yüksek seviyede.')+'</p><div class="row">'+tag(offer?'Yükselt · +'+(level+1):'Yükseltildi','upgrade','data-level="'+level+'" '+(!canForge(state,offer)?'disabled':''))+(level===1?tag('Cevher avına git','av','','action sub'):'')+tag('Sefer haritası','map','','action sub')+'</div></div>');
}
function profile(){const tabs=['Özet','İstatistikler','Başarımlar','Koleksiyon'];let body='';
 if(profileTab==='Koleksiyon')body='Silahlar · '+weapons().map(weaponName).join(', ')+'<br>Gelişim · '+Object.values(collections).flat().filter(row=>state.unlocks.includes(row[0])).map(row=>row[1]).join(', ') +(state.relicActive?'<br>Kalıntı · Kırık Mühür':'')+'<br>Karşılaşılan düşmanlar · '+([...new Set((state.seen||[]).map(i=>foeNames[i]))].join(', ')||'Henüz karşılaşma yok');
 else if(profileTab==='Başarımlar')body=regions.map((r,i)=>(state.cleared.includes((i+1)+'-3')?'✓':'◇')+' '+r[0]+' · '+route.slice(i*3,i*3+3).filter(j=>state.cleared.includes(encounters[j].id)).length+'/3').join('<br>');
 else {const level=1+Math.floor(Math.sqrt(state.xp/100)),low=(level-1)**2*100,high=level**2*100;body='<div class="stats"><div class="bigStat"><small>Güç</small><b>'+(healthOf(state)+10*attack(state))+'</b></div><div class="bigStat"><small>Saldırı</small><b>'+attack(state)+'</b></div><div class="bigStat"><small>Can</small><b>'+healthOf(state)+'</b></div></div><p class="spaced">'+weaponName(state.equipped)+' · '+state.xp+' / '+high+' XP · Seviye '+level+'</p><div class="progress"><i style="width:'+((state.xp-low)/(high-low)*100)+'%"></i></div>';}
 return section('Karakter profili','<div class="tabs">'+tabs.map(t=>tag(t,'profileTab','data-key="'+t+'"','tab '+(t===profileTab?'on':''))).join('')+'</div><div class="panel">'+body+'</div>');}
function receipt(){const h=receiptBody(),r=state.receipt;return r?h.replace('<div class="row">',gearDropHtml(r)+'<div class="row">'):h;}
function receiptBody(){const r=state.receipt;if(!r)return stageMap();
 if(encounters[r.index].kind&&encounters[r.index].kind!=='campaign'&&!isHunt(r.index))return extraReceipt(r);
 if(isHunt(r.index)||r.index===BRIDGE){
  const hunt=isHunt(r.index),win=r.end==='win',reward=[[r.gold,'altın'],[(r.ore||0)+(r.extra?.ore||0),'cevher'],[r.shards,'kalıntı parçası']].filter(([n])=>n>0).map(([n,k])=>'+'+n+' '+k).join('　·　');
  return section(stageNames[r.index],'<div class="panel receipt stack"><div class="kicker">'+(hunt?'AV GANİMETİ':'BÖLGE BOSSU')+'</div><h1>'+(r.end==='exit'?'Geri çekildin':hunt?r.kills+' / 3 avlandı':win?'Zafer':'Düello sona erdi')+'</h1><p>'+seconds(r.at)+' sn　·　'+r.hp+' can</p><p class="reward">'+(reward||'Bu denemede ganimet yok.')+'</p><div class="row">'+tag(hunt?'Av alanına dön':'Boss alanına dön',hunt?'av':'boss')+tag(hunt?'Demirci':'Kalıntılar',hunt?'forge':'relic','','action sub')+tag('Merkeze dön','hub','','action sub')+'</div></div>');
 }
 const win=r.end==='win';return section(stageNames[r.index],'<div class="panel receipt stack"><div class="kicker">'+encounters[r.index].id+' · '+(r.first?'İLK GEÇİŞ':'SAVAŞ SONUCU')+'</div><h1>'+(win?(r.index===route[route.length-1]&&r.first?'Sefer tamamlandı':'Zafer'):r.end==='timeout'?'Süre doldu':r.end==='exit'?'Geri çekildin':'Yenilgi')+'</h1><div class="stats"><div class="bigStat"><small>Süre</small><b>'+seconds(r.at)+' sn</b></div><div class="bigStat"><small>Kalan can</small><b>'+r.hp+'</b></div></div><p class="reward">'+(win?'+'+r.gold+' altın　+'+r.xp+' XP'+(r.item?'　·　Köy Kılıcı':'')+(lootText(r.extra||{})?'　·　'+lootText(r.extra):'')+(r.note?'　·　'+r.note:''):'Bu denemede ödül kazanılmadı.')+'</p><div class="row">'+(r.item?tag('Kılıcı kuşan','rewardEquip'):win?tag(r.index===route[route.length-1]?'Tamamlanan sefer':'Sonraki durak','map'):tag('Tekrar dene','retry'))+(win&&r.index===2?tag('Bölge Bossu','boss','','action sub'):'')+tag('Ekipman','equip','','action sub')+tag('Demirci','forge','','action sub')+tag('Merkeze dön','hub','','action sub')+'</div></div>','SEFER');}
function seconds(n){return (n/1000).toLocaleString('tr-TR',{maximumFractionDigits:1});}
function battle(){
 const st=encounters[fight.index],kick=(st.kind&&st.region===undefined?'GEÇİT':regionForStage(fight.index)[0].toLocaleUpperCase('tr'))+' · '+st.id;
 return '<section class="duel"><div class="duelStage" id="arena"><canvas id="arenaCanvas"></canvas><div class="duelTitle"><small>'+kick+'</small><b>'+stageNames[fight.index]+'</b></div><b class="duelClock" id="timer"></b><div class="duelBtns">'+tag('Ⅱ','pause','aria-label="Durdur"','duelBtn')+tag('»','skip','aria-label="Savaşı atla"','duelBtn')+'</div><div class="plate heroPlate" id="heroPlate"><b>Kahraman</b><span class="hpBar"><i id="heroHealth"></i></span><span id="hpValue"></span></div>'+st.enemies.map((e,i)=>'<div class="target" data-i="'+i+'"><b>'+foeNames[e.id]+'</b><span class="hpBar"><i></i></span><span class="enemyValue"></span></div>').join('')+'</div></section>';
}
function render(){
 const focusKey=uiFocusKey(document.activeElement);
 document.documentElement.setAttribute('data-room',String(!!venues[view]&&!observer));
 document.documentElement.setAttribute('data-hub',String(view==='hub'&&!observer&&!fight));
 document.documentElement.setAttribute('data-fight',String(view==='battle'&&!!fight&&!observer));document.documentElement.setAttribute('data-view',view);
 document.documentElement.setAttribute('data-motion',String(!!state.settings.motion));document.documentElement.setAttribute('data-chance-menu',String(view==='casino'&&!state.gameRound&&!casinoSelection));
 header();foot.innerHTML='<span>'+ (view==='battle'?'Savaş · '+stageNames[fight.index]:'Kıvılcım　/　Geçitler')+'</span><span>'+ (QA?'Test kaydı':sessionOnly?'Oturumluk · Dosyayı indirerek kalıcı kaydet':observer?'Diğer sekmede açık':'Yerel kayıt')+'</span>';
 if(QA&&!observer){foot.insertAdjacentHTML('beforeend','<div class="qaTools">'+tag('Yeni test kaydı','qaReset','','minor')+tag('Boss senaryosu','qaBoss','','minor')+(fight?tag('+100 ms','qaSmall','','minor')+tag('+1 sn','qaSecond','','minor'):'')+'</div>');}
 if(observer){main.innerHTML=section('Savaş diğer sekmede','<div class="panel stack"><p>Bu denemeyi burada sürdürmek için kontrolü al.</p>'+tag('Burada sürdür','take')+'</div>');uiPrepareControls(document);return;}
 const pages={...Object.fromEntries(['settings','gold','energy'].map(k=>[k,()=>utilityRoom(k)])),casino:casinoPage,market:marketCounter,arena:arenaPage,guild:guildPage,events:noticeBoard,rank:rankings,mail:mailPage,notices:noticePage,...Object.fromEntries(Object.keys(collections).map(k=>[k,()=>collectionRoom(k)])),hub,map:stageMap,equip:equipment,bag,forge,profile,result:receipt,battle,av:huntPage,boss:bossesPage,relic:relicAltar};
 main.innerHTML=venues[view]?renderArtVenue(view):pages[view]();main.insertAdjacentHTML('beforeend',developerControl());uiPrepareControls(document);uiRestoreFocus(focusKey);if(view==='hub')drawHub();if(view==='battle')paintBattle();else if(venues[view])paintVenue();
}
function context(can){
 const bounds=can.getBoundingClientRect(),w=Math.max(1,bounds.width),h=Math.max(1,bounds.height),dpr=Math.min(devicePixelRatio||1,state?.settings?.lowPower?1:({'Düşük':.75,'Orta':1,'Yüksek':1.6,'Ultra':2}[state?.settings?.quality]||1.6));
 if(can.width!==Math.round(w*dpr)||can.height!==Math.round(h*dpr)){can.width=Math.round(w*dpr);can.height=Math.round(h*dpr);}
 const c=can.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return {c,w,h};
}
let sceneCache=null;
function paintBattle(){
 const f=fight,can=$('arenaCanvas');if(!can||!f)return;const {c,w,h}=context(can),defs=encounters[f.index].enemies;
 if(sceneCache?.width!==can.width||sceneCache?.height!==can.height||sceneCache.stage!==f.index){
  sceneCache=document.createElement('canvas');sceneCache.width=can.width;sceneCache.height=can.height;sceneCache.stage=f.index;landscape(sceneCache.getContext('2d'),can.width,can.height,f.index);
 }
 c.drawImage(sceneCache,0,0,w,h);
 const motion=state.settings.motion,footY=h*.76,size=Math.min(h*.54,w*.36),approach=motion?Math.min(1,f.at/820):1;
 // Karşı karşıya düzen: kahraman solda sabit, rakipler sağda yan yana.
 const positions=defs.length===3?[.5,.69,.88]:defs.length===2?[.6,.83]:[.72];
 const heroX=w*.24-(1-approach)*w*.10;
 const event=f.lastEvent,age=event?f.at-event.at:9999,pulse=motion&&age<260?Math.sin(Math.PI*age/260):0;
 const guardOn=f.guardAt<=f.at&&f.at<f.guardAt+guardLength;
 const px=Math.max(size*.43,heroX);drawAura(c,px,footY,size);
 ellipse(c,px,footY+3,size*.24,size*.032,'#312d2855');
 const petX=Math.max(size*.13,px-size*.55);
 // Yoldaş: kuşanılı petin kendi canlandırması; yoksa eski çizime düşer.
 if(!atlasPose(c,petVerisi(petOf(state))?.atlas||'pet_akboynuz_actor','idle',f.at,petX,footY,size*.33)){if(state.slots.pet==='tilki')drawFox(c,petX,footY,size*.30);else img(c,'companion',petX-size*.11,footY-size*.34,size*.23,size*.34);}
 heroArt(c,px,footY,size,f.weapon,pulse,guardOn);
 if(guardOn){c.save();c.strokeStyle='#f3deb0';c.lineWidth=4;c.beginPath();c.ellipse(px+size*.19,footY-size*.48,size*.21,size*.29,0,-1.38,1.38);c.stroke();c.restore();}
 let warning=false;
 const targetEls=main.querySelectorAll('.target');
 defs.forEach((e,i)=>{
  const x=w*positions[i],fh=size*(e.id==='yaban_kopek'?.7:foeForm(e.id)==='beast'?.88:1.14)*(defs.length===3?.86:1),hp=f.enemyHp[i],el=targetEls[i];
  el.hidden=!hp;if(!hp)return;
  let timeLeft=e.heavy[f.heavyNext[i]]-f.at,prep=timeLeft>=0&&timeLeft<=ms(BALANCE.heavyWarningSec);warning||=prep;
  ellipse(c,x,footY+3,fh*.28,fh*.045,'#41363166');
  if(f.target===i){c.beginPath();c.ellipse(x,footY+5,fh*.32,fh*.061,0,0,Math.PI*2);c.lineWidth=3;c.strokeStyle='#ffdc8e';c.stroke();}
  figure(c,x,footY,fh*.86,e.id,event?.incoming&&age<210?pulse:0,prep);
  if(prep){const cy=Math.max(22,footY-fh-17),a=14;shape(c,'M'+x+' '+(cy-a)+' l'+a+' '+a+' l-'+a+' '+a+' l-'+a+' -'+a+' Z','#9f352a','#fff0bb',2);c.fillStyle='white';c.font='bold 17px system-ui';c.textAlign='center';c.fillText('!',x,cy+6);c.fillStyle='#513831';c.fillRect(x-17,cy+19,34,4);c.fillStyle='#ffd88c';c.fillRect(x-17,cy+19,34*(1-timeLeft/ms(BALANCE.heavyWarningSec)),4);}
  if(event?.hit[i]&&age<340){c.fillStyle='#fff3d1';c.strokeStyle='#543b30';c.lineWidth=3;c.textAlign='center';c.font='bold 20px Georgia';const yy=footY-fh*.66-age*.06;c.strokeText('−'+event.hit[i],x,yy);c.fillText('−'+event.hit[i],x,yy);if(motion){c.strokeStyle='#ffe7b1';c.lineWidth=2;c.beginPath();c.arc(x,footY-fh*.5,fh*.23,-2.6,-.62);c.stroke();}}
  Object.assign(el.style,{left:x+'px',top:(footY+10)+'px'});
  el.setAttribute('aria-pressed',String(f.target===i));el.querySelector('i').style.width=hp/e.hp*100+'%';el.querySelector('.enemyValue').textContent=hp+' / '+e.hp;
 });
 $('timer').textContent=Math.ceil((limit-f.at)/1000);$('hpValue').textContent=f.hp+' / '+(f.maxHp||maxHp);$('heroHealth').style.width=f.hp/(f.maxHp||maxHp)*100+'%';
 Object.assign($('heroPlate').style,{left:px+'px',top:(footY+10)+'px'});
}
function persistSnapshot(){
 if(!fight||finishing||observer)return Promise.resolve();
 const snap=structuredClone(fight);
 return transact(s=>{
  if(s.fight?.id!==snap.id||s.fight.owner!==owner||s.fight.at>snap.at)return false;
  s.fight=snap;
 }).then(s=>{if(fight?.id===snap.id&&!finishing&&(s.fight?.owner!==owner||s.fight?.id!==snap.id))reflect(s);}).catch(storageError);
}
function storageError(err){console.error(err);localPaused=true;openModal('Kayıt açılamadı','İlerlemenin kaydedilebilmesi için dosyayı Chrome veya Edge’de normal bir pencerede aç.');}
function reflect(s){
 state=s;
 if(s.fight){observer=s.fight.owner!==owner;fight=observer?null:structuredClone(s.fight);view='battle';}
 else{observer=false;fight=null;view=s.pending?'result':'hub';}
 localPaused=!!fight?.paused;lastFrame=performance.now();carry=0;
 if(modal.open)modal.close();render();if(fight?.paused)pauseMenu();
}
function tell(){if(!sessionOnly)channel?.postMessage('changed');}
channel?.addEventListener('message',async()=>{if(!db||finishing)return;try{const s=await transact(()=>false);if(s.fight||fight||observer||s.pending)reflect(s);else{state=s;render();}}catch(e){storageError(e);}});
async function finish(){
 if(finishing||!fight?.end)return;
 finishing=true;const snap=structuredClone(fight);
 try{const s=await transact(s=>settle(s,snap));reflect(s);tell();}
 catch(e){storageError(e);}finally{finishing=false;}
}
function tick(now,command){
 if(!fight||observer||finishing||localPaused||document.hidden)return;
 const elapsed=(QA?0:Math.max(0,now-lastFrame))+carry,whole=Math.floor(elapsed);
 carry=elapsed-whole;lastFrame=now;
 if(command||QA)advance(fight,fight.at+whole,command);else autoAdvance(fight,fight.at+whole);
 if(state.settings.vibration&&fight.lastEvent?.incoming&&fight.lastEvent.at!==fight.lastVibrationAt){fight.lastVibrationAt=fight.lastEvent.at;navigator.vibrate?.(20);}
 if(fight.end){void finish();return;}
 if(command||fight.at-lastWrite>=250){lastWrite=fight.at;void persistSnapshot();}
}
let resourceSecond=-1,lastPageDay=rewardDay(),lastRenderedAt=0;
function frame(now){
 const fps=state?.settings?.lowPower?30:(state?.settings?.fps||60);if(now-lastRenderedAt<1000/fps-1){requestAnimationFrame(frame);return;}lastRenderedAt=now;
 if(view==='casino'&&state?.gameRound?.game==='dart'&&!document.hidden){const sight=$('dartSight');if(sight)sight.style.left=(50+47*dartDistance(state.gameRound))+'%';}
 if(!fight&&!document.hidden&&state&&Math.floor(now/1000)!==resourceSecond){resourceSecond=Math.floor(now/1000);const today=rewardDay();if(today!==lastPageDay){lastPageDay=today;render();}const badge=topbar.querySelector('[data-act="energy"] b');if(badge)badge.textContent=view==='hub'?energyNow(state)+'/'+energyCap:energyNow(state);const refEnergy=main.querySelector('.refHit[data-act=energy] .refWalletValue');if(refEnergy)refEnergy.textContent=profileNumber(energyNow(state))+(['hub','gold','gem','map','mail','notices','settings','events','rank','titles','auras','guild','av','boss','arena'].includes(view)?'/'+energyCap:'');if(view==='energy'&&$('energyRoom')){$('energyRoom').textContent=energyLabel(state);$('energyMeter').value=energyNow(state);}if(view==='av'){const label=$('energyInline');if(label)label.textContent=energyLabel(state);const entry=main.querySelector('[data-act="startHunt"]');if(entry)entry.disabled=!!girisNedeni(state,huntingGrounds[selectedHuntRegion]);}}
if(view==='battle'&&fight&&!document.hidden&&!finishing){tick(now);if(!finishing)paintBattle();}requestAnimationFrame(frame);}
async function begin(index){
 const reason=girisNedeni(state,index);if(reason){uiLocked(reason);return;}
 const s=await transact(s=>{
  if(s.fight||!unlocked(index,s))return false;
  if(!admit(s,index))return false;
  s.pending=false;s.fight=freshFight(s,index);s.seen=Array.from(new Set([...(s.seen||[]),...encounters[index].enemies.map(e=>e.id)]));
 });
 if(!s.fight){state=s;render();uiLocked(girisNedeni(s,index));return;}
 learnedGuard=false;lastWrite=0;reflect(s);tell();
}
// Geri izi: Geri düğmesi ana ekrana değil, gelinen ekrana döner. Hub'a varınca iz sıfırlanır;
// savaş ve sonuç ekranı ize yazılmaz. Ekran değişirken açık pencere kapanır.
let viewTrail=[];const viewReturnFocus=new Map();
async function navigate(name,geri=false){if(state.pending){state=await transact(s=>{if(s.fight||s.receipt?.id!==state.receipt?.id)return false;s.pending=false;});if(state.fight){reflect(state);return;}}
 if(!geri){if(name==='hub')viewTrail=[];else if(name!==view){viewTrail=viewTrail.filter(v=>v!==name);if(!['battle','result'].includes(view))viewTrail.push(view);viewTrail=viewTrail.slice(-10);}}
 if(modal.open&&name!==view)modal.close();
 const changed=name!==view;if(changed)viewReturnFocus.set(view,uiFocusKey(document.activeElement));
 setView(name);if(geri)uiRestoreFocus(viewReturnFocus.get(name));else if(changed)main.querySelector('button[data-act=back]')?.focus({preventScroll:true});}
function pauseMenu(){openModal('Durduruldu','',tag('Devam et','resume')+tag('Atla','skip','','action sub')+tag('Savaştan çekil','exit','','action sub'));}
async function pause(){
 if(!fight||finishing)return;tick(performance.now());if(finishing)return;
 localPaused=fight.paused=true;await persistSnapshot();pauseMenu();
}
async function resume(){if(modal.open)modal.close();if(!fight)return;localPaused=fight.paused=false;lastFrame=performance.now();carry=0;await persistSnapshot();}
modal.addEventListener('cancel',e=>{if(localPaused&&fight){e.preventDefault();void resume();}});
document.addEventListener('visibilitychange',()=>{if(!fight)return;if(document.hidden){lastFrame=0;void persistSnapshot();}else{lastFrame=performance.now();carry=0;}});
window.addEventListener('pagehide',()=>{void persistSnapshot();});
window.addEventListener('pageshow',()=>{lastFrame=performance.now();carry=0;});
function input(command){if(!fight||localPaused||finishing||observer)return;tick(performance.now(),command);if(command.type==='guard')learnedGuard=true;if(!finishing)paintBattle();}
document.addEventListener('keydown',e=>{if(!fight||modal.open||e.repeat||observer||document.hidden)return;if(e.key==='Escape'){void pause();}});
async function act(action,el){
 if(action==='close'){if(localPaused&&fight)return resume();modal.close();return;}
 if(action==='guard'||action==='target'){input(action==='guard'?{type:'guard'}:{type:'target',index:Number(el.dataset.i)});return;}
 if(QA&&action.startsWith('qa')){
  if(action==='qaReset')return window.KivilcimQA.reset();
  if(action==='qaBoss')return window.KivilcimQA.scenario(2);
  if(fight)return window.KivilcimQA.step(fight.at+(action==='qaSmall'?100:1000));
 }
 if(action==='take'){const s=await transact(s=>{if(!s.fight)return false;s.fight.owner=owner;});reflect(s);tell();return;}
 if(action==='pause')return pause();if(action==='resume')return resume();
 if(action==='exit'){if(modal.open)modal.close();if(fight){fight.end='exit';await finish();}return;}
 if(action==='skip'){if(fight&&!finishing&&!observer){if(modal.open)modal.close();localPaused=fight.paused=false;autoAdvance(fight,limit);await finish();}return;}
 if(fight||observer)return;
 if(await combatAction(action,el))return;
 if(await alanAction(action,el))return;
 if(await panelAction(action,el))return;
 if(await referenceScreensAction(action,el))return;
 if(await currencyAction(action,el))return;
 if(await cantaAction(action,el))return;
 if(await profileAction(action,el))return;
 if(await forgeAction(action,el))return;
 if(await wingAction(action,el))return;
 if(await roomsAction(action,el))return;
 if(await gearAction(action,el))return;
 if(roomUiAction(action,el))return;
 if(await systemAction(action,el))return;
 switch(action){
 case 'hub':return navigate('hub');
 case 'chapter':case 'map':chosenStage=currentStage();return navigate('map');
 case 'selectStage':chosenStage=Number(el.dataset.i);return render();
 case 'start':return begin(chosenStage);
 case 'startHunt':return begin(huntingGrounds[selectedHuntRegion]);
 case 'startBoss':return begin(BRIDGE);
 case 'retry':return begin(state.receipt.index);
 case 'back':if(view==='equip'&&equipFrom==='result'&&state.receipt)return setView('result');return navigate(viewTrail.pop()||'hub',true);
 case 'arena':case 'market':case 'guild':case 'events':case 'rank':case 'pet':case 'wings':case 'titles':case 'charm':case 'auras':case 'mail':case 'notices':case 'av':case 'boss':case 'relic':case 'bag':case 'forge':return navigate(action);
 case 'casino':casinoSelection=state.gameRound?.game||'';return navigate('casino');
 case 'profile':profileTab='Özet';return navigate('profile');
 case 'profileTab':profileTab=el.dataset.key;return render();
 case 'pick':chosenWeapon=el.dataset.key;return render();
 case 'rewardEquip':case 'bagPick':case 'equip':
  gearPick=null;gearFilter=null;equipFrom=view;chosenWeapon=action==='rewardEquip'?state.receipt.item:action==='bagPick'?el.dataset.key:state.equipped;return navigate('equip');
 case 'wear':case 'wearGo':
  state=await transact(s=>{if(s.fight||!s.items.includes(chosenWeapon))return false;s.equipped=chosenWeapon;if(s.worn)delete s.worn.silah;});if(state.fight)return reflect(state);tell();
  if(action==='wearGo'){chosenStage=currentStage();return navigate('map');}render();toast(weaponName(chosenWeapon)+' kuşanıldı.');return;
 case 'upgrade':{let paid=false;const previous=Number(el.dataset.level??(state.upgrades.item_kilic||0));
  state=await transact(s=>{const offer=upgradeOffer(s);if(s.fight||!canForge(s,offer)||offer.from!==previous)return false;if(!spend(s,{gold:offer.gold,ore:offer.ore}))return false;s.upgrades.item_kilic=offer.from+1;paid=true;});
  if(state.fight)return reflect(state);tell();render();if(paid)toast(weaponName('item_kilic'));return;
 }
 case 'makeRelic':state=await transact(s=>{if(s.fight||s.relicActive||!afford(s,{shards:6}))return false;spend(s,{shards:6});s.relicActive=true;});if(state.fight)return reflect(state);tell();render();return;

 case 'gold':case 'energy':return navigate(action);
 case 'gem':case 'crystal':case 'currencyMarket':marketTab=action==='gem'?'Sandıklar':'Mağaza';return navigate('market');
 case 'settings':return navigate('settings');
 case 'toggleMotion':state=await transact(s=>{s.settings.motion=!s.settings.motion;});tell();render();return;
 default:return;
 }
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled||busy)return;
 const a=b.dataset.act;if(a==='guard'||a==='target'){await act(a,b);return;}
 busy=true;try{await act(a,b);}catch(err){storageError(err);}finally{busy=false;}
});
function attachQA(){
 if(!QA)return;
 window.KivilcimQA={
  read:()=>structuredClone({state,fight,view}),
  reset:async()=>{const s=await transact(s=>Object.assign(s,defaults(),{seen:[]}));reflect(s);tell();},
  scenario:async(index,weapon='item_kilic',level=0)=>{const s=await transact(s=>{Object.assign(s,defaults(),{items:['item_dagger','item_kilic'],equipped:weapon,upgrades:{item_kilic:level},cleared:stages.slice(0,index).map(st=>st.id)});s.fight=freshFight(s,index);});reflect(s);},
  step:async(t,command)=>{if(!fight||observer)throw Error('Aktif yerel savaş gerekli.');advance(fight,t,command);if(fight.end)await finish();else{await persistSnapshot();paintBattle();}},
  engine:()=>({freshFight,advance,defaults,stages,owner,settle})
 };
}
window.addEventListener('resize',()=>{if(view==='hub')drawHub();else if(fight)paintBattle();else if(venues[view])paintVenue();});
async function init(){
 try{try{db=await connect();}catch(error){if(error?.name!=='SecurityError')throw error;sessionOnly=true;}const s=await transact(s=>{if(s.fight)s.fight.owner=owner;if(!s.gearSeq){rollGear(s,1,.001,'kask');rollGear(s,1,.001,'zirh');rollGear(s,1,.001,'cizme');}});reflect(s);attachQA();if(s.fight)tell();await Promise.allSettled(Object.values(images).map(im=>im.decode()));if(view==='hub')drawHub();else if(fight){sceneCache=null;paintBattle();}else if(venues[view])paintVenue();requestAnimationFrame(frame);}
 catch(e){main.textContent='Yerel kayda erişilemedi.';storageError(e);}
}
void init();
