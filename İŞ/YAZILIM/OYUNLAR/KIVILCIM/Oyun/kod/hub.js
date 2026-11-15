// Reference-shaped hub controls; all values and actions use the existing game state.
function hubFrame(key,kind='bar'){
 if(kind==='mode'){
 const crops={av:[249,678,316,222],map:[570,639,407,290],boss:[976,681,239,218],arena:[1215,678,247,226]},[x,y,w,h]=crops[key];
 return '<svg class="hubFrame referenceMode" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="crest-'+key+'"><path d="M'+w*.5+' 2 '+w*.64+' '+h*.07+' '+w*.88+' '+h*.17+' '+(w-2)+' '+h*.29+' '+(w-2)+' '+h*.77+' '+w*.84+' '+h*.91+' '+w*.5+' '+(h-2)+' '+w*.16+' '+h*.91+' 2 '+h*.77+' 2 '+h*.29+' '+w*.12+' '+h*.17+' '+w*.36+' '+h*.07+'Z"/></clipPath></defs><g clip-path="url(#crest-'+key+')"><use href="#hubReferenceSource" x="'+(-x)+'" y="'+(-y)+'"/></g></svg>';
 }
 if(leftNav.some(r=>r[0]===key)||rightNav.some(r=>r[0]===key))return '<svg class="hubFrame" viewBox="0 0 325 81" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="rim-'+key+'"><path clip-rule="evenodd" d="M28 0H298L325 40 298 81H28L0 40Z M35 14 15 40 35 67H290L309 40 290 14Z"/></clipPath><linearGradient id="charcoal-'+key+'" x2="0" y2="1"><stop stop-color="#373631"/><stop offset=".3" stop-color="#111415"/><stop offset="1" stop-color="#171919"/></linearGradient></defs><path d="M28 2H298L323 40 298 79H28L2 40Z" fill="url(#charcoal-'+key+')"/><g clip-path="url(#rim-'+key+')"><use href="#hubReferenceSource" x="-25" y="-583"/></g></svg>';

 const badge=kind==='mode',w=badge?280:360,h=badge?200:86;
 const outer=badge?'M140 3 174 19 243 39 274 65 274 153 246 177 175 187 140 198 105 187 34 177 6 153 6 65 37 39 106 19Z':'M28 3 332 3 357 43 332 83 28 83 3 43Z';
 const inner=badge?'M140 15 171 30 238 49 263 69 263 148 240 167 173 177 140 187 107 177 40 167 17 148 17 69 42 49 109 30Z':'M32 13 328 13 347 43 328 73 32 73 13 43Z';
 return '<svg class="hubFrame" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="metal-'+key+'" x2="0" y2="1"><stop stop-color="#fff1c8"/><stop offset=".15" stop-color="#9a6740"/><stop offset=".27" stop-color="#ffcc7d"/><stop offset=".49" stop-color="#6c4225"/><stop offset=".65" stop-color="#fff0c2"/><stop offset=".8" stop-color="#a16632"/><stop offset="1" stop-color="#e7ac60"/></linearGradient><linearGradient id="stone-'+key+'" x2=".7" y2="1"><stop stop-color="#393b39"/><stop offset=".28" stop-color="#141718"/><stop offset=".65" stop-color="#080b0e"/><stop offset="1" stop-color="#323331"/></linearGradient></defs><path d="'+outer+'" fill="url(#metal-'+key+')" stroke="#100b09" stroke-width="5"/><path d="'+outer+'" fill="none" stroke="#ffdfa3" stroke-width="1.4"/><path d="'+inner+'" fill="url(#stone-'+key+')" stroke="#3a251a" stroke-width="4"/><path d="'+inner+'" fill="none" stroke="#dfb678" stroke-width="1.2"/>'+(badge?'<path d="M23 137H257M28 142H252" stroke="#be9253" stroke-width="2"/><path d="m140 5 7 9-7 9-7-9Zm-129 63 6 7-6 7-5-7Zm258 0 5 7-5 7-6-7ZM140 179l6 8-6 8-6-8Z" fill="#fff1c7" stroke="#976029"/>':'<path d="M40 6H116M159 6H260M301 6H325M36 79H103M139 79H235M270 79H324" stroke="#fff3d0" stroke-width="3"/><path d="m20 23 7-11 9 1m-17 50 8 11 9-1m288-60 9-1 7 11m-16 50 9 1 7-11" fill="none" stroke="#fff1c8" stroke-width="3"/><path d="m77 3 4 4-4 4-4-4m204 68 4 4-4 4-4-4" fill="#e9bf7c" stroke="#734925"/>')+'</svg>';
}
function hudIcon(key){
 if(key==='gold')return '<svg class="hudIcon goldIcon" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="25" fill="#c77a19" stroke="#3d2210" stroke-width="4"/><circle cx="30" cy="30" r="21" fill="#ffca45" stroke="#fff1af" stroke-width="2"/><path d="m18 15 25 29m-23-2 23-28M15 37l9 8m12-29 8 8" stroke="#70400c" stroke-width="6"/><path d="m18 15 25 29m-23-2 23-28" stroke="#fff4bd" stroke-width="3"/></svg>';
 if(key==='energy')return '<svg class="hudIcon energyIcon" viewBox="0 0 60 60" aria-hidden="true"><path d="M26 3 8 32h20l-7 25L52 20H34L44 3Z" fill="#ffc72e" stroke="#402719" stroke-width="4"/><path d="M26 4 14 28h21l-10 22 22-27H29L39 5" fill="#ffe88c" stroke="#fff4cb" stroke-width="1.5"/></svg>';
 const blue=key==='crystal';return '<svg class="hudIcon" viewBox="0 0 60 60" aria-hidden="true"><path d="'+(blue?'M30 2 45 13 55 31 30 58 6 33 15 14Z':'M15 9 45 9 58 25 30 56 2 25Z')+'" fill="'+(blue?'#1476d7':'#b934ef')+'" stroke="#16192a" stroke-width="4"/><path d="M15 10 30 15 45 10 56 25 30 24 4 25ZM30 24 30 54 16 26Z" fill="'+(blue?'#80eaff':'#ed92ff')+'"/><path d="M15 10 30 15 45 10M4 25h52M16 25l14 29 14-29M30 15v9" fill="none" stroke="#fff0ff" stroke-width="1.7"/>'+(blue?'<path d="m30 2-8 20 15-7-7 39 17-27-12 5 9-17Z" fill="#d6ffff"/>':'')+'</svg>';
}
function hubReady(key){
 const day=dayBook(state),notes=state.notificationSettings||{},eventReady=notes.events!==false&&eventsList.some(([k,,,goal])=>!day.flags[k]&&eventCount(day,k)>=goal);
 const ready={mail:notes.rewards!==false&&!state.mailTaken,forge:canForge(state,upgradeOffer(state)),events:eventReady,bag:state.chests>0};
 return key==='notices'?panelNotifications().some(v=>!state.noticeRead?.includes(v.id)):!!ready[key];
}
function hubReadyDescription(key){return hubReady(key)?' aria-description="Hazır işlem var"':'';}

function hubDot(key){return hubReady(key)?'<i class="hubDot" aria-hidden="true"></i>':'';}
function hubHeader(){
 const level=1+Math.floor(Math.sqrt(state.xp/BALANCE.level2TotalXp)),low=(level-1)**2*BALANCE.level2TotalXp,high=level**2*BALANCE.level2TotalXp,power=healthOf(state)+10*attack(state);
 const player=tag('<span class="portraitMedal">'+artTag('portrait')+'<i></i><em>GEÇİTLER</em></span><span class="heroIdentity"><span class="heroName">'+hubFrame('name')+'<b>Lv.'+level+'</b><strong>Kahraman</strong></span><span class="heroPower">'+glyph('sword')+' Güç: '+power.toLocaleString('tr-TR')+'</span><span class="heroExperience"><i style="width:'+Math.max(0,Math.min(100,(state.xp-low)/(high-low)*100))+'%"></i><b>EXP</b><span>'+state.xp.toLocaleString('tr-TR')+' / '+high.toLocaleString('tr-TR')+'</span></span></span>','profile','aria-label="Profil resmi"','heroProfile');
 const resource=(key,n,action,label)=>tag(hubFrame('hud-'+key)+hudIcon(key)+'<b style="font-size:'+(String(n).length>8?'.8em':'1em')+'">'+n+'</b><small>+</small>',action,'aria-label="'+label+'"','hubResource');
 const chapter=tag(hubFrame('chapter')+'<span class="chapterMountain">◆</span><span><b>Bölüm '+encounters[currentStage()].id+'</b><small>'+[0,1,2].map(i=>'<i class="'+(state.cleared.includes((regionOf(currentStage())+1)+'-'+(i+1))?'done':'')+'">◆</i>').join('')+'</small></span>','chapter','aria-label="Bölüm '+encounters[currentStage()].id+'"','hubChapter');
 const tools=[['mail','Posta','mail'],['notices','Bildirimler','bell'],['settings','Ayarlar','gear']].map(([k,n,i])=>tag(glyph(i)+hubDot(k),k,'aria-label="'+n+'"'+hubReadyDescription(k),'hubTool')).join('');
 return player+'<div class="hubWallet">'+resource('gold',state.gold.toLocaleString('tr-TR'),'gold','Altın')+resource('gem',state.gems.toLocaleString('tr-TR'),'gem','Elmas')+resource('crystal',state.crystals.toLocaleString('tr-TR'),'crystal','Kristal')+resource('energy',energyNow(state)+'/'+energyCap,'energy','Enerji')+'</div>'+chapter+'<div class="hubTools">'+tools+'</div>';
}
function hubNavButton([key,label],mode=false){return tag(hubFrame(key,mode?'mode':'bar')+'<span class="hubButtonContent">'+artTag(key)+'<b>'+label+'</b></span>'+hubDot(key),key,'aria-label="'+label+'"'+hubReadyDescription(key),mode?'mode crestMode '+(key==='map'?'primary':''):'navBtn forgedNav');}

function paintHubScene(c,w,h){
 const picture=images.hub_scene_full||images.scene;if(!picture?.complete||!picture.naturalWidth)return;
 const scale=Math.max(w/picture.naturalWidth,h/picture.naturalHeight);
 c.drawImage(picture,(w-picture.naturalWidth*scale)/2,(h-picture.naturalHeight*scale)/2,picture.naturalWidth*scale,picture.naturalHeight*scale);
}


// Yeni Hub: kullanıcının ikinci referans kadrajı, gerçek değerler ve mevcut işlemler.
function referenceHub(){
 const level=1+Math.floor(Math.sqrt(state.xp/BALANCE.level2TotalXp));
 const low=(level-1)**2*BALANCE.level2TotalXp,high=level**2*BALANCE.level2TotalXp;
 const progress=Math.max(0,Math.min(100,(state.xp-low)/(high-low)*100));
 let body=refButton('Profil resmi','profile',24,8,451,151)
  +refValue('Lv.'+level,189,23,79,43,'refHubLevel')
  +refValue(profileName(),272,22,181,46,'refHubName')
  +refValue(profileNumber(healthOf(state)+10*attack(state)),291,78,173,38,'refHubPower');
 body+='<div class="refHubXp" '+refAt(187,128,305,19)+' role="progressbar" aria-label="Deneyim" aria-valuenow="'+state.xp+'" aria-valuemin="'+low+'" aria-valuemax="'+high+'"><i style="width:'+progress+'%"></i><b>EXP</b><span>'+profileNumber(state.xp)+' / '+profileNumber(high)+'</span></div>';
 const resources=[['Altın','gold',state.gold,492,557],['Elmas','gem',state.gems,678,743],['Kristal','crystal',state.crystals,865,931],['Enerji','energy',energyNow(state)+'/'+energyCap,1055,1112]];
 body+=resources.map(([name,key,n,x,vx])=>refButton(name,key,x,18,181,51,'','<span class="refHubResource refWalletValue" style="left:'+(vx-x)/1.81+'%">'+(typeof n==='number'?profileNumber(n):n)+'</span>')).join('');
 body+=refButton('Bölüm '+encounters[currentStage()].id,'chapter',1255,19,177,55)
  +refValue(encounters[currentStage()].id,1343,27,62,23,'refHubChapter')
  +'<div class="refHubStages" '+refAt(1310,51,62,15)+' aria-hidden="true">'+[0,1,2].map(i=>'<i class="'+(state.cleared.includes((regionOf(currentStage())+1)+'-'+(i+1))?'done':'')+'">◆</i>').join('')+'</div>';
 for(const [key,name,x] of [['mail','Posta',1443],['notices','Bildirimler',1523],['settings','Ayarlar',1598]])body+=refButton(name,key,x,12,66,65,hubReadyDescription(key),hubReady(key)?'<i class="refHubDot" aria-hidden="true"></i>':'');
 for(const [rows,x,w,ys] of [[leftNav,22,252,[242,313,385,455,526,597]],[rightNav,1411,242,[241,312,383,452,521,590,659]]]){
  body+=rows.map(([key,name],i)=>refButton(name,key,x,ys[i],w,60,hubReadyDescription(key),(key==='casino'?'<span class="refHubChanceName">Şans</span>':'')+(hubReady(key)?'<i class="refHubDot" aria-hidden="true"></i>':''))).join('');
 }
 body+=refButton('Çanta','bag',33,793,122,122,hubReadyDescription('bag'),hubReady('bag')?'<i class="refHubDot" aria-hidden="true"></i>':'');
 for(const [key,name,x,y,w,h] of [['av','Av',215,789,403,125],['map','Sefer',621,726,433,193],['boss','Boss',1056,779,286,133],['arena','Arena',1350,783,271,131]])body+=refButton(name,key,x,y,w,h);
 return '<section class="refViewport refHubViewport" aria-label="Ana ekran"><div class="refScreen ref-hub"><img class="refPlate" src="'+ART.hub_canli_taban+'" alt="" aria-hidden="true">'+body+'</div></section>';
}
