// Kullanıcının profil referansı: boyalı sahne, canlı metin ve gerçek kontroller.
function profileNumber(n){return Number(n||0).toLocaleString('tr-TR');}
function profileName(){return typeof state.profileName==='string'&&state.profileName.trim()?state.profileName:'Kahraman';}
function profileAchievements(){
 const wins=state.stats?.wins||0,up=(state.gear||[]).some(g=>g.plus>0)||Object.values(state.upgrades||{}).some(n=>n>0);
 return [
  {id:'first',name:'İlk Zafer',icon:0,done:wins>0||state.cleared.length>0},
  {id:'forge',name:'Demirci Çırağı',icon:1,done:up},
  {id:'explore',name:'Şehir Kaşifi',icon:2,done:state.cleared.includes('1-3')},
  ...regions.map(([name],i)=>({id:'region-'+i,name:name+' Fatihi',icon:0,done:state.cleared.includes((i+1)+'-3')}))
 ].map(a=>{const reward=basarimlar(state).find(v=>v.id===a.id);return reward?{...a,...reward,icon:a.icon}:a;});
}
function profileCollection(){
 const entries=[...Object.keys(weaponNames).map(id=>({id,name:weaponNames[id],owned:state.items.includes(id),icon:'sword',action:'equip'})),
  ...Object.entries(collections).flatMap(([key,rows])=>rows.map(([id,name])=>({id,name,owned:state.unlocks.includes(id),icon:{pet:'paw',wings:'wing',charm:'ring',titles:'crown',auras:'aura'}[key],action:key}))),
  {id:'seal',name:'Kırık Mühür',owned:!!state.relicActive,icon:'star',action:'relic'}];
 const enemies=[...new Set(encounters.flatMap(e=>e.enemies.map(v=>v.id)))];
 return entries.concat(enemies.map(id=>({id,name:foeNames[id]||id,owned:(state.seen||[]).includes(id),icon:'shield'})));
}
function profileFrame(id,kind='panel',selected=false){
 const nav=kind==='nav',w=nav?316:606,h=nav?90:158;
 const x=nav?4:1053,y=nav?(selected?156:265):275;
 const outer=nav?'M31 2H286L314 44 287 88H30L2 45Z':'M17 2H590L604 16V143L590 156H16L2 143V17Z';
 const inner=nav?'M35 12H280L300 44 279 77H36L16 45Z':'M22 9H585L596 21V138L585 148H22L10 138V22Z';
 return '<svg class="prTrim" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="pr-'+id+'"><path clip-rule="evenodd" d="'+outer+' '+inner+'"/></clipPath></defs><path d="'+outer+'" fill="'+(selected?'#751412':'#151413')+'"/><g clip-path="url(#pr-'+id+')"><use href="#profilPaintSource" x="-'+x+'" y="-'+y+'"/></g><path d="'+inner+'" fill="none" stroke="#d3a55b" stroke-opacity=".45" stroke-width="1"/></svg>';
}
function profileMedal(index){return refCrop('profil_kullanici_referansi',[99,270,442][index],551,157,125,'prMedalArt');}
function profilePanel(id,title,icon,body,extra=''){
 return '<section class="prPanel '+extra+'">'+profileFrame(id)+'<div class="prPanelInner"><h3>'+glyph(icon)+title+'</h3><div class="prDivider" aria-hidden="true">◇</div>'+body+'</div></section>';
}
function profileStat(icon,label,value,cls=''){
 return '<div class="prStat '+cls+'">'+glyph(icon)+'<span>'+label+'</span><b>'+safeText(value)+'</b></div>';
}
function profileBadge(a){return tag(profileMedal(a.icon)+'<span>'+safeText(a.name)+'</span>'+(a.done?'':'<i>'+glyph('lock')+'</i>'),'profileAchievement','data-key="'+a.id+'" aria-label="'+safeText(a.name)+(a.done?' · Kazanıldı':' · Kilitli')+'"','prAchievement'+(a.done?' earned':' locked'));}
function profileInfo(){
 const list=profileAchievements(),done=list.filter(a=>a.done).length,collection=profileCollection(),owned=collection.filter(c=>c.owned).length;
 const speed=1/BALANCE.hero.attackPeriodSec,guard=Math.round((1-BALANCE.guard.damageMultiplier)*100),region=regionOf(currentStage());
 const stats='<div class="prStatGrid">'+profileStat('heart','Can',profileNumber(healthOf(state)),'health')+profileStat('shield','Savunma','%'+guard)+profileStat('sword','Saldırı',profileNumber(attack(state)))+profileStat('motion','Hız',speed.toLocaleString('tr-TR')+'/sn')+'</div>';
 const medals='<div class="prAchievements">'+list.slice(0,3).map(profileBadge).join('')+'</div>';
 const progress=[['sword','Bölüm',encounters[currentStage()].id,'map'],['map','Bölge',regions[region][0],'map'],['trophy','Zafer',profileNumber(state.stats?.wins||0),'rank'],['book','Koleksiyon',owned+' / '+collection.length,'profileTab']].map(([icon,label,value,action])=>tag(glyph(icon)+'<span>'+label+'</span><b>'+safeText(value)+'</b>',action,action==='profileTab'?'data-key="Koleksiyon"':'','prProgressItem')).join('');
 return profilePanel('stats','Temel Nitelikler','sword',stats,'prBasics')+profilePanel('achievements','Başarılar <span class="prCount">'+done+' / '+list.length+'</span>','trophy',medals,'prAwards')+profilePanel('progress','Hesap ve İlerleme','book','<div class="prProgress">'+progress+'</div>','prAccount');
}
function profileAchievementList(){
 const list=profileAchievements();return profilePanel('all-achievements','Başarılar <span class="prCount">'+list.filter(a=>a.done).length+' / '+list.length+'</span>','trophy','<div class="prAllAchievements">'+list.map(profileBadge).join('')+'</div>','prFullPanel');
}
function profileAppearance(){
 const slots=[['equip','Ekipman',wornGear(state,'silah')?gearName(wornGear(state,'silah')):weapons().includes(state.equipped)?weaponName(state.equipped):'—','sword'],...['pet','wings','charm','titles','auras'].map(key=>[key,titleOf[key],collections[key].find(r=>r[0]===state.slots[key])?.[1]||'—',{pet:'paw',wings:'wing',charm:'ring',titles:'crown',auras:'aura'}[key]])];
 return profilePanel('appearance','Görünüm','eye','<div class="prAppearance">'+slots.map(([key,name,value,icon])=>tag(glyph(icon)+'<span><small>'+name+'</small><b>'+safeText(value)+'</b></span>'+glyph('next'),key,'','prAppearanceItem')).join('')+'</div>'+tag(glyph('book')+'Koleksiyon','profileTab','data-key="Koleksiyon"','prCollectionLink'),'prFullPanel');
}
function profileStatistics(){
 const rows=[['trophy','Galibiyet',state.stats?.wins||0],['paw','Tamamlanan av',state.stats?.hunts||0],['sword','Arena zaferi',state.stats?.arena||0],['crown','Arena puanı',state.stats?.rating||0],['shield','Dünya Bossu hasarı',state.stats?.world||0],['flag','Lonca puanı',state.stats?.guildScore||0],['map','Sefer ilerlemesi',state.cleared.length+' / '+route.length]];
 const times=Object.entries(state.bestTimes||{}).filter(([i])=>encounters[i]).sort((a,b)=>a[1]-b[1]).slice(0,3);
 return profilePanel('statistics','İstatistikler','trophy','<div class="prStatistics">'+rows.map(([icon,label,value])=>profileStat(icon,label,typeof value==='number'?profileNumber(value):value)).join('')+'</div>'+(times.length?'<h4 class="prSubheading">En Hızlı Zaferler</h4>'+times.map(([i,time])=>'<div class="prTime"><span>'+safeText(routeName(Number(i)))+'</span><b>'+seconds(time)+' sn</b></div>').join(''):''),'prFullPanel');
}
function profileCollectionPage(){
 const entries=profileCollection(),owned=entries.filter(c=>c.owned);
 return profilePanel('collection','Koleksiyon <span class="prCount">'+owned.length+' / '+entries.length+'</span>','book','<div class="prCollection">'+owned.map(c=>c.action?tag(glyph(c.icon)+'<span>'+safeText(c.name)+'</span>',c.action,'','prCollectionItem'):'<div class="prCollectionItem">'+glyph(c.icon)+'<span>'+safeText(c.name)+'</span></div>').join('')+'</div>','prFullPanel');
}

// Referans koordinatları: 1672 × 941. Metin ve kontroller canlıdır.
function refAt(x,y,w,h){return 'style="left:'+x/16.72+'%;top:'+y/9.41+'%;width:'+w/16.72+'%;height:'+h/9.41+'%"';}
function refCrop(key,x,y,w,h,cls=''){return '<svg class="refCrop '+cls+'" viewBox="'+x+' '+y+' '+w+' '+h+'" aria-hidden="true"><image href="'+ART[key]+'" width="1672" height="941"/></svg>';}
function refButton(label,action,x,y,w,h,data='',body=''){
 return tag(body||'<span class="screenReader">'+safeText(label)+'</span>',action,refAt(x,y,w,h)+' aria-label="'+safeText(label)+'" '+data,'refHit');
}
function refWallet(kind){
 const xs=kind==='profile'?[1264,1375,1490,1598]:[1225,1348,1477,1592];
 return [state.gold,state.gems,state.crystals,energyNow(state)].map((n,i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],xs[i],10,65,45,'','<span class="refWalletValue">'+profileNumber(n)+'</span>')).join('');
}
function refScreen(kind,body){return '<section class="refViewport" aria-label="'+(kind==='profile'?'Oyuncu Profili':'Ekipman')+'"><div class="refScreen ref-'+kind+'"><img class="refPlate" src="'+ART[kind==='profile'?'profil_canli_taban':'ekipman_canli_taban']+'" alt="" aria-hidden="true">'+refButton('Geri','back',25,9,75,75)+refWallet(kind)+body+'</div></section>';}
function refValue(value,x,y,w,h,cls=''){return '<div class="refValue '+cls+'" '+refAt(x,y,w,h)+'>'+safeText(value)+'</div>';}
function profileHistory(){
 const rows=(state.log||[]).map(r=>'<div class="refLog"><strong>'+safeText(r.title)+'</strong><span>'+safeText({win:'Zafer',lose:'Yenilgi',timeout:'Süre doldu',draw:'Beraberlik',exit:'Geri çekilme'}[r.end]||r.end)+'</span></div>').join('');
 return profilePanel('history','Geçmiş','book','<div class="refHistory">'+(rows||'<p>Henüz etkinlik yok.</p>')+'</div>','prFullPanel');
}
function roomProfile(){
 const level=1+Math.floor(Math.sqrt(state.xp/BALANCE.level2TotalXp)),low=(level-1)**2*BALANCE.level2TotalXp,high=level**2*BALANCE.level2TotalXp;
 const progress=Math.max(0,Math.min(100,(state.xp-low)/(high-low)*100));
 const title=collections.titles.find(r=>r[0]===state.slots.titles)?.[1]||'Kahraman';
 const a=profileAchievements(),c=profileCollection(),overview=['Özet','Bilgiler'].includes(profileTab);
 let body=refValue(profileName(),677,160,310,68,'refHeroName')+refButton('Kahraman adını düzenle','profileEdit',995,174,48,48)
  +refValue(title,775,241,205,43,'refTitle')+refValue('ID: '+(state.profileId||'—'),695,299,135,34,'refId')
  +refValue('Sv. '+level,578,348,92,47,'refLevel')
  +'<div class="refExperience" '+refAt(699,351,472,28)+' role="progressbar" aria-label="Deneyim" aria-valuenow="'+state.xp+'" aria-valuemin="'+low+'" aria-valuemax="'+high+'"><i style="width:'+progress+'%"></i><span>'+profileNumber(state.xp)+' / '+profileNumber(high)+'</span></div>'
  +refValue('Lonca: '+(state.guild?'Geçit Muhafızları':'Yok'),748,393,170,39,'refGuild')+refValue('Bölge: '+regions[regionOf(currentStage())][0],1001,393,180,39,'refRegion')
  +refValue(profileNumber(guc(state)),1250,252,210,75,'refPower');
 if(overview){
  body+=a.slice(0,3).map((v,i)=>refButton(v.name,'profileAchievement',94+171*i,548,160,172,'data-key="'+v.id+'"',v.done?'':'<span class="refLocked">'+glyph('lock')+'</span>')).join('')
   +refValue(profileNumber(state.stats?.wins),748,549,127,48,'refScore')+refValue(encounters[currentStage()].id,990,549,122,48,'refScore')
   +refValue(c.filter(v=>v.owned).length+' / '+c.length,751,643,130,45,'refScore')+refValue(a.filter(v=>v.done).length+' / '+a.length,993,643,123,45,'refScore');
  const logs=(state.log||[]).slice(0,2);
  body+=logs.length?logs.map((r,i)=>'<div class="refRecent" '+refAt(1300,550+i*92,304,76)+'><strong>'+safeText(r.title)+'</strong><span>'+safeText({win:'Zafer',lose:'Yenilgi',timeout:'Süre doldu',draw:'Beraberlik',exit:'Geri çekilme'}[r.end]||r.end)+'</span></div>').join(''):refValue('Henüz etkinlik yok.',1300,550,300,70,'refEmpty');
 }else{
  const content=profileTab==='Başarımlar'?profileAchievementList():profileTab==='İstatistikler'?profileStatistics():profileTab==='Geçmiş'?profileHistory():profileCollectionPage()+profileAppearance();
  body+='<div class="refProfilePage" '+refAt(63,479,1560,276)+'>'+content+'</div>';
 }
 const tabs=[['Özet','Genel Bakış',76,368],['Başarımlar','Başarılar',443,294],['İstatistikler','İstatistikler',739,326],['Koleksiyon','Vitrin',1069,275],['Geçmiş','Geçmiş',1348,282]];
 body+=tabs.map(([key,label,x,w],i)=>{
  const selected=key===profileTab||(i===0&&overview);
  let art='';
  if((i===0&&!selected)||(i>0&&selected))art='<span class="refTabState '+(selected?'selected':'')+'">'+glyph(['profile','trophy','rank','book','book'][i])+'<b>'+label+'</b></span>';
  return refButton(label,'profileTab',x,807,w,79,'data-key="'+key+'" aria-pressed="'+selected+'"',art);
 }).join('');
 return refScreen('profile',body);
}
async function profileAction(action,el){
 if(action==='profileAchievement'){
  const a=profileAchievements().find(v=>v.id===el.dataset.key);if(!a)return true;
  const conditions={first:'Bir savaş kazan.',forge:'Bir eşyayı güçlendir.',explore:'Köy 1-3 durağını tamamla.'};
  const region=a.id.startsWith('region-')?Number(a.id.slice(7)):null;
  const reward=basarimlar(state).find(v=>v.id===a.id);openModal(a.name,(a.done?'Kazanıldı':conditions[a.id]||regions[region][0]+' bölgesinin üç durağını tamamla.')+(reward?uiRewards(reward.reward):''),reward?.done?tag(reward.claimed?'Alındı':'Ödülü Al','uiAchievementClaim','data-id="'+reward.id+'" '+(reward.claimed?'disabled':''),'gxBtn'):'');return true;
 }
 if(action==='profileEdit'){
  openModal('Kahraman Adı','<label class="prNameLabel" for="profileNameInput">Ad</label><input id="profileNameInput" class="prNameInput" type="text" maxlength="24" required value="'+safeText(profileName())+'" autocomplete="off">',tag('Kaydet','profileSave','','gxBtn'));
  $('profileNameInput').focus?.();return true;
 }
 if(action==='profileSave'){
  const name=$('profileNameInput').value.trim().replace(/\s+/g,' ').slice(0,24);if(!name)return true;
  state=await transact(s=>{if(s.fight)return false;s.profileName=name;});
  if(state.fight){reflect(state);return true;}modal.close();tell();render();return true;
 }
 return false;
}

function uiRewards(rewards){return Object.entries(rewards).filter(([,n])=>n>0).map(([k,n])=>panelReward(k,n)).join('');}
function uiEmpty(icon,message,action='',label='Git'){return '<p>'+safeText(message)+'</p>'+(action?tag(safeText(label),action,'','gxBtn'):'');}
function uiLocked(reason){if(reason)openModal('Kilitli',safeText(reason));}
