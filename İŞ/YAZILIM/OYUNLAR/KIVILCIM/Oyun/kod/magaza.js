// Kullanıcının üç mağaza referansı. Alışveriş mevcut kayıt işlemini kullanır.
let currencyPage='overview',currencyPick=0,currencyPurchasing=false;
// 12.11.2026: kullanıcı seçimi ajana bıraktı; 1 ve 3 numaralı referansın ortak paketleri.
const currencyGoldPackages=[{gold:100,gems:10},{gold:300,gems:25},{gold:600,gems:45},{gold:1500,gems:100}];
const currencyGemPreview=[[60,0],[300,30],[980,120],[1980,360],[3280,680]];
function currencyPackage(i){return currencyGoldPackages?.[i]||null;}
function currencyPlate(key){return '<img class="refPlate" src="'+ART[key]+'" alt="" aria-hidden="true">';}
function currencyPiece(key,sx,sy,sw,sh,x,y,w=sw,h=sh,cls=''){
 return '<div class="currencyPiece '+cls+'" '+refAt(x,y,w,h)+'>'+refCrop(key,sx,sy,sw,sh)+'</div>';
}
function currencyWallet(style){
 const boxes=style==='overview'?[[1107,15,142,50,1160,81],[1258,15,119,50,1310,51],[1390,15,99,50,1438,44],[1504,15,130,50,1551,80]]:
  style==='review'?[[1029,24,142,52,1084,74],[1192,24,131,52,1248,65],[1350,24,105,52,1397,55],[1480,24,149,52,1530,97]]:
  [[1076,22,116,54,1130,62],[1210,22,119,54,1265,62],[1343,22,104,54,1392,53],[1466,22,147,54,1518,94]];
 return boxes.map(([x,y,w,h,vx,vw],i)=>refButton(['Altın','Elmas','Kristal','Enerji'][i],['gold','gem','crystal','energy'][i],x,y,w,h,'','<span class="currencyWalletValue refWalletValue" style="left:'+(vx-x)/w*100+'%;width:'+vw/w*100+'%">'+(i===3?energyNow(state)+'/'+energyCap:profileNumber([state.gold,state.gems,state.crystals][i]))+'</span>')).join('');
}
function currencyOverview(kind){
 const gold=kind==='gold',key='magaza_pano',menuY=gold?108:580;
 let body=currencyPlate('magaza_sahne')
  +currencyPiece(key,25,gold?0:475,390,79,25,0)
  +currencyPiece(key,1103,8,550,59,1103,8)
  +currencyWallet('overview')+refButton('Geri','back',46,7,65,65)
  +currencyPiece(key,62,menuY,273,327,62,243)
  +currencyPiece(key,gold?323:328,gold?170:638,gold?334:307,gold?285:273,324,345,gold?334:307,gold?285:273);
 const menus=gold?[
  ['Altın Paketleri','shopOverview',true],['Altın Kazan','shopEarn',true],['Günlük Ödül','shopDaily',true],['Haftalık Paket','shopUnavailable',false]
 ]:[['Elmas Paketleri','gem',true],['Sandıklar','shopChestInfo',true],['Aylık Kart','shopUnavailable',false],['Özel Paketler','shopUnavailable',false]];
 body+=menus.map(([label,act,enabled],i)=>refButton(label,act,75,247+i*75,248,65,enabled?'':'disabled title="Yakında"')).join('');
 if(gold){
  for(let i=0;i<4;i++){
   const x=[674,913,1152,1391][i],p=currencyPackage(i);
   body+=currencyPiece(key,x,132,223,259,x,298)
    +refValue(p?profileNumber(p.gold):'—',x+30,431,170,44,'currencyGoldAmount')
    +refValue(p?profileNumber(p.gems):'—',x+114,492,76,38,'currencyGoldCost')
    +refButton('Altın paketi '+(i+1),'shopSelect',x,298,223,259,'data-i="'+i+'"');
  }
 }else{
  for(let i=0;i<5;i++){
   const x=[642,842,1040,1238,1436][i],amount=currencyGemPreview[i];
   body+=currencyPiece(key,x,620,194,266,x,297)
    +refValue(profileNumber(amount[0]),x+25,403,146,42,'currencyGemAmount')
    +(amount[1]?refValue('+'+profileNumber(amount[1]),x+47,448,103,28,'currencyGemBonus'):'')
    +refButton('Elmas paketi '+profileNumber(amount[0])+' · Yakında','developerGem',x+15,493,169,47,(developerFree(state)?'data-i="'+i+'"':'disabled title="Yakında"'),'<span class="currencyComing">'+(developerFree(state)?'Bedelsiz':'Yakında')+'</span>');
  }
 }
 return '<section class="refViewport" aria-label="'+(gold?'Altın Paketleri':'Elmas Paketleri')+'"><div class="refScreen ref-currency currency-overview">'+body+'</div></section>';
}
function currencyGoldDetail(){
 const review=currencyPage==='review',xs=review?[535,799,1062,1326]:[508,782,1057,1331];
 const p=currencyPackage(currencyPick);
 let body=currencyPlate(review?'altin_onay_taban':'altin_taban')+currencyWallet(review?'review':'detail')
  +refButton('Geri','back',20,10,88,88);
 for(let i=0;i<4;i++){
  const x=xs[i],pack=currencyPackage(i);
  body+=refValue(pack?profileNumber(pack.gold)+' Altın':'—',x+20,review?310:300,204,50,'currencyPackageAmount')
   +refValue(pack?profileNumber(pack.gems):'—',x+(review?117:125),review?567:542,81,50,'currencyPackageCost')
   +refButton('Altın paketi '+(i+1),'shopPick',x,review?289:275,review?240:249,review?352:399,'data-i="'+i+'" aria-pressed="'+(currencyPick===i)+'"',currencyPick===i?'<span class="currencySelected" aria-hidden="true"></span>':'');
  if(!review)body+=refButton(currencyPick===i?'Seçili':'Seç','shopPick',x+29,601,193,55,'data-i="'+i+'" aria-pressed="'+(currencyPick===i)+'"','<span class="currencySelectText">'+(currencyPick===i?'Seçili':'Seç')+'</span>');
 }
 body+=refValue('Bakiyen '+profileNumber(state.gems)+' Elmas',review?836:823,review?690:716,244,42,'currencyBalance')
  +refButton('Satın Al',review?'shopBuy':'shopReview',review?747:746,review?755:775,review?332:314,68,(p&&afford(state,{gems:p.gems})?'':'disabled')+' title="'+(!p?'Paket miktarı bekleniyor':afford(state,{gems:p.gems})?'Satın Al':'Yetersiz elmas')+'"');
 return '<section class="refViewport" aria-label="'+(review?'Altın satın alma onayı':'Altın Yükle')+'"><div class="refScreen ref-currency currency-detail">'+body+'</div></section>';
}
function currencyShop(kind){return kind==='gem'||currencyPage==='overview'?currencyOverview(kind):currencyGoldDetail();}
async function currencyAction(action,el){
 if(action==='gem'){currencyPage='overview';await navigate('gem');return true;}
 if(action==='gold'){currencyPage='overview';return false;}
 if(action==='back'&&view==='gold'&&currencyPage!=='overview'){currencyPage=currencyPage==='review'?'detail':'overview';render();return true;}
 if(action==='shopChests'){marketTab='Sandıklar';await navigate('market');return true;}
 if(action==='shopOverview'){currencyPage='overview';render();return true;}
 if(action==='shopUnavailable')return true;
 if(action==='shopSelect'||action==='shopPick'){
  const i=Number(el.dataset.i);if(!Number.isInteger(i)||i<0||i>3)return true;
  currencyPick=i;if(action==='shopSelect')currencyPage='detail';render();return true;
 }
 if(action==='shopReview'){
  const pack=currencyPackage(currencyPick);if(!pack||!afford(state,{gems:pack.gems}))return true;
  currencyPage='review';render();return true;
 }
 if(action==='shopBuy'){
  const pack=currencyPackage(currencyPick);if(!pack||currencyPurchasing||view!=='gold'||currencyPage!=='review')return true;
  currencyPurchasing=true;let changed=false;
  try{
   state=await transact(s=>{if(s.fight||!spend(s,{gems:pack.gems}))return false;give(s,{gold:pack.gold});changed=true;});
   if(state.fight){reflect(state);return true;}
   currencyPage='detail';tell();render();if(changed)toast(profileNumber(pack.gold)+' altın eklendi.');
  }finally{currencyPurchasing=false;}
  return true;
 }
 return false;
}
