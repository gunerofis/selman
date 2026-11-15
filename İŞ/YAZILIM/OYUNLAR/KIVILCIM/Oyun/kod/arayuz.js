// Tek buton dili. Yerleşim ve işlem sahipleri mevcut ekranlarda kalır.
const K_UI={
 tabs:new Set(['collectionNavigate','marketTab','forgeTab','bagTab','profileTab','alanTab','alanFilter','gearCategory','marketShopFilter','marketSecondaryFilter','panelMailFilter','panelNoticeFilter','panelSettingsSection','panelQuality','panelFps','referenceNormal','referenceMapTab','savasArenaTab','guildTaskPeriod','bossTab','chanceTabHome','chanceGames','chanceTabBox','chanceTabEvent','chanceTickets']),
 cards:new Set(['roomSelect','gearSlot','gearSelect','bagSel','marketChestPick','referenceChestPick','marketShopPick','marketSecondaryPreview','collectionRelicSelect','forgeSel','forgeScrapPick','forgeStonePick','forgeSocket','savasForgeSlot','savasHuntTarget','roomBossSelect','rival','profileAchievement','panelMailRead','panelNoticeSelect','alanEvent','referenceStage','referenceRegion','huntRegion','shopSelect']),
 primary:new Set(['start','trialStart','huntStart','startHunt','startBoss','referenceQuickBattle','referenceQuickConfirmed','marketChestOpen','referenceChestOpen','marketShopBuy','marketSecondaryBuy','shopBuy','shopReview','developerGem','claimMail','claimEvent','eventClaim','guildTaskClaim','joinGuild','donate','guildLayoutContribution','gearWear','wear','wearGo','gearUp','gearSocket','forgeMerge','forgeTier','forgeScrap','forgeScrapPicked','collectItem','trainPet','wingUp','uiCollectionUp','uiRelicOpen','chancePlay','buy']),
 icons:{mail:'mail',notices:'bell',settings:'gear',profileEdit:'edit',panelMailDelete:'trash',referenceRegionInfo:'info',marketChestInfo:'info'},
 cardClasses:'.collectionCard,.ctCell,.refGearCell,.forgeReferenceItem,.forgeReferenceCategory,.forgeStoneCard,.forgeSocket,.savasBossCard,.weapon,.roomCard,.panelNoticeRow,.shopCard,.secondaryItemArt,.prAppearanceItem,.prCollectionItem,.prMedal,.tableChoice,.ktChest,.ktTile,.ktFoil,.ktLane,.gameTile',
 tabsClasses:'.tab,.ctTab,.collectionTab,.marketNavTab,.forgeReferenceTab,.guildPageTab,.secondaryFilter,.roomTab,.gxTab'
};
function uiRole(button){
 const a=button.dataset.act||'',ref=button.classList.contains('refHit');
 if(a==='back')return 'back';
 if(button.matches('.developerButton'))return 'secondary';
 if(button.matches('.collectionMoney,.resource,.hubResource')||ref&&['gold','gem','crystal','energy'].includes(a)&&button.querySelector('[class*="Wallet"],[class*="wallet"],.refHubResource'))return 'wallet';
 // Hub'un boyalı arma, portre ve ana savaş girişleri aynı altın/bordo dilindedir.
 if(button.closest('.ref-hub')&&!K_UI.icons[a])return 'scene';
 if(button.matches('[role="switch"]'))return 'switch';
 if(K_UI.icons[a]&&ref||button.matches('.ktOrb,.duelBtn'))return 'icon';
 if(ref&&['marketChestQuantity','marketShopQuantity','referenceQuantity','marketShopScroll'].includes(a))return 'step';
 if(a==='shopPick')return parseFloat(button.style.height)>10?'card':'tab';
 if(button.matches(K_UI.cardClasses)||K_UI.cards.has(a))return 'card';
 if(button.matches(K_UI.tabsClasses)||K_UI.tabs.has(a)&&!(a==='alanTab'&&button.matches('.guildLiveAction,.guildTextAction')))return 'tab';
 if(button.matches('.collectionAction,.ctAction.primary,.secondaryItemBuy')||K_UI.primary.has(a))return 'primary';
 if(button.matches('.action:not(.sub),.gxBtn:not(.sub),.roomAction:not(.secondary),.ktBtn:not(.sub)'))return 'primary';
 return 'secondary';
}
function uiFocusKey(el){return el?.matches?.('button')?['act','key','id','slot','group','i','step','save'].map(k=>[k,el.dataset[k]||'']):null;}
function uiRestoreFocus(key,scope=document){
 if(!key)return;
 const b=[...scope.querySelectorAll('button')].find(el=>!el.disabled&&key.every(([k,v])=>(el.dataset[k]||'')===v));
 b?.focus({preventScroll:true});
}
function uiPrepareControls(scope){
 for(const b of scope.querySelectorAll('button')){
  if(b.dataset.ui)continue;
  const role=uiRole(b),a=b.dataset.act||'',label=b.getAttribute('aria-label')||b.textContent.trim();
  b.dataset.ui=role;b.type='button';
  if(role==='tab'&&!b.hasAttribute('aria-pressed')){
   const selected=a==='savasArenaTab'?b.dataset.key==='Rakipler':a.startsWith('chanceTab')?(a===(chanceSelected===3?'chanceTabBox':chanceSelected===7?'chanceTabEvent':'chanceTabHome')):b.matches('.selected,.on,.active')||!!b.querySelector('.selected,.on');
   b.setAttribute('aria-pressed',String(selected));
  }
  if(b.classList.contains('refHit')&&['primary','secondary','tab','back','icon','step'].includes(role)){
   let html='';
   if(role==='back')html=glyph('back');
   else if(role==='icon')html=glyph(K_UI.icons[a]);
   else if(role==='step')html=a==='marketShopScroll'?(b.dataset.step==='-1'?'↑':'↓'):(b.dataset.step==='-1'?'−':'+');
   else {
    // Fiyatlı canlı etiketleri koru; yalnız resme gömülü etiketleri DOM'a al.
    const rich=b.querySelector('.shopBuy,.chanceOfferCost,.currencyComing,.shopFilter');
    html=rich?rich.innerHTML:safeText(label.replace(' · Kapalı',''));
   }
   const dot=b.querySelector('.refHubDot')?.outerHTML||'';
   b.innerHTML='<span class="kButtonLabel">'+html+'</span>'+dot;
  }
  if(role==='back'){b.setAttribute('aria-label','Geri');b.title='Geri';if(!b.classList.contains('refHit'))b.innerHTML=glyph('back');}
  if(b.classList.contains('collectionTab')){
   const key=b.dataset.key;
   b.innerHTML='<span class="kTabIcon">'+glyph({pet:'paw',wings:'wing',charm:'gem',relic:'star',titles:'crown',auras:'aura'}[key])+'</span><span>'+safeText(b.textContent)+'</span>';
  }
 }
}
