const games={
 slot:['Slot','Üç makarayı çevir. İkili eşleşme 6, üçlü 24 altın.','✣'],
 wheel:['Çark','Çarkı döndür. Ödül, ibrenin durduğu dilimdir.','◉'],
 box:['Kutu','Üç kapalı kutudan birini seç. İçinden altın, yem veya cevher çıkar.','▣'],
 coin:['Yazı-tura','Paranın yüzünü tahmin et. Doğru tahmin 10 altın.','◐'],
 hilo:['Hilo','Sıradaki kartın daha yüksek veya düşük olduğunu tahmin et. As en küçüktür.','♠'],
 mine:['Mayın','İki mayın gizli. Güvenli her hücre 3 altın. Üçüncü hücrede ödül otomatik alınır.','✹'],
 race:['Yarış','Dört koşucudan birini seç. Birincilik 20 altın.','⚑'],
 scratch:['Kazı-kazan','Üç alanı aç. İki aynı sembol 6, üç aynı sembol 18 altın.','▧'],
 dart:['Dart','Nişangâh merkeze geldiğinde at. Merkez 12, iç halka 6, dış halka 2 altın.','◎']
};
const faces=['☾','♜','✦','❖'],horses=['Alaz','Poyraz','Kül','Sedef'],wheelGifts=[{gold:3},{gold:5},{feed:1},{gold:2},{ore:1},{gold:7}];
function randomInt(max){const bytes=new Uint32Array(1);crypto.getRandomValues(bytes);return Math.floor(bytes[0]/4294967296*max);}
function shuffle(values){const copy=values.slice();for(let i=copy.length-1;i>0;i--){const n=randomInt(i+1);[copy[i],copy[n]]=[copy[n],copy[i]];}return copy;}
function dealRound(s,game,practice){
 if(!Object.hasOwn(games,game)||s.gameRound)return false;
 const book=dayBook(s);if(!practice&&book.casino>=3&&!developerFree(s))return false;
 if(!practice&&!developerFree(s))book.casino++;
 const first=1+randomInt(13);
 s.gameRound={id:uid(),game,practice,step:0,started:Date.now(),shown:[],first,
  next:shuffle(Array.from({length:13},(_,i)=>i+1).filter(n=>n!==first))[0],
  traps:shuffle([0,1,2,3,4,5,6,7,8]).slice(0,2),boxes:shuffle([{gold:6},{feed:1},{ore:1}]),
  marks:Array.from({length:3},()=>randomInt(faces.length)),pick:randomInt(6),order:shuffle([0,1,2,3])};
 s.gameResult=null;return true;
}
function dartDistance(round,time=Date.now()){return Math.sin((time-round.started)/620);}
function endRound(s,round,label,gain={}){
 const prize=round.practice?{}:gain;give(s,prize);
 s.gameResult={title:games[round.game][0],game:round.game,label,gain:prize,practice:round.practice,show:{marks:round.marks,pick:round.pick,first:round.first,next:round.next,order:round.order,shown:round.shown,traps:round.traps,boxes:round.boxes,choice:round.choice}};
 s.gameRound=null;return true;
}
function playRound(s,id,step,choice){
 const r=s.gameRound;if(!r||r.id!==id||r.step!==step)return false;
 r.choice=choice;
 if(choice==='exit')return endRound(s,r,'Tur kapatıldı.');
 const index=Number(choice),go=choice==='go',hasIndex=n=>/^\d+$/.test(choice)&&Number.isInteger(index)&&index>=0&&index<n;
 const faceResult=()=>{const distinct=new Set(r.marks).size;return distinct===1?3:distinct===2?2:0;};
 switch(r.game){
 case 'slot':if(go){const n=faceResult();return endRound(s,r,r.marks.map(i=>faces[i]).join('　│　'),{gold:n===3?24:n===2?6:0});}break;
 case 'wheel':if(go)return endRound(s,r,'Dilim '+(r.pick+1)+' · '+lootText(wheelGifts[r.pick]),wheelGifts[r.pick]);break;
 case 'box':if(hasIndex(3))return endRound(s,r,(index+1)+'. kutu açıldı.',r.boxes[index]);break;
 case 'coin':if(choice==='yazi'||choice==='tura'){const face=r.pick%2?'tura':'yazi';return endRound(s,r,(face==='tura'?'Tura':'Yazı')+' geldi.',{gold:face===choice?10:0});}break;
 case 'hilo':if(choice==='up'||choice==='down')return endRound(s,r,'♠ '+r.first+'　→　♠ '+r.next,{gold:((r.next>r.first)===(choice==='up'))?8:0});break;
 case 'race':if(hasIndex(4))return endRound(s,r,'Bitiş sırası · '+r.order.map(i=>horses[i]).join(' › '),{gold:r.order[0]===index?20:0});break;
 case 'mine':
  if(choice==='cash'&&r.shown.length)return endRound(s,r,r.shown.length+' güvenli hücre.',{gold:r.shown.length*3});
  if(!hasIndex(9)||r.shown.includes(index))break;
  if(r.traps.includes(index))return endRound(s,r,'Mayına bastın · '+(index+1)+'. hücre.');
  r.shown.push(index);r.step++;if(r.shown.length===3)return endRound(s,r,'Üç güvenli hücre.',{gold:9});return true;
 case 'scratch':
  if(!hasIndex(3)||r.shown.includes(index))break;
  r.shown.push(index);r.step++;if(r.shown.length===3){const n=faceResult();return endRound(s,r,r.marks.map(i=>faces[i]).join('　'),{gold:n===3?18:n===2?6:0});}return true;
 case 'dart':if(go){const dist=Math.abs(dartDistance(r));return endRound(s,r,dist<.14?'Tam merkez':dist<.45?'İç halka':'Dış halka',{gold:dist<.14?12:dist<.45?6:2});}break;
 }
 return false;
}
// Şans görünümü: her masanın kendi oyun yüzeyi var. Kurallar "i" düğmesinin arkasında.
const gameSvg={
 slot:'<rect x="6" y="10" width="36" height="28" rx="4"/><path d="M18 10v28M30 10v28"/><circle cx="12" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/><circle cx="36" cy="24" r="2.5"/>',
 wheel:'<circle cx="24" cy="26" r="17"/><path d="M24 9v34M9.3 17.5l29.4 17M9.3 34.5l29.4-17"/><path d="M20 3h8l-4 7z" fill="currentColor"/>',
 box:'<path d="M7 23h34v17H7z"/><path d="M7 23c0-8 6-13 17-13s17 5 17 13"/><rect x="21" y="20" width="6" height="8" rx="1"/>',
 coin:'<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="12"/><path d="M24 17l5 7-5 7-5-7z"/>',
 hilo:'<rect x="7" y="12" width="19" height="27" rx="3"/><rect x="22" y="8" width="19" height="27" rx="3"/><path d="M31.5 27V16m-4 4l4-4 4 4"/>',
 mine:'<circle cx="24" cy="26" r="10"/><path d="M24 11v5M24 36v5M9 26h5M34 26h5M13.5 15.5l3.5 3.5M31 33l3.5 3.5M34.5 15.5L31 19M17 33l-3.5 3.5"/>',
 race:'<path d="M12 6v37"/><path d="M12 9h25l-6 8 6 8H12"/>',
 scratch:'<rect x="6" y="11" width="36" height="26" rx="4"/><path d="M12 30l5-10 5 8 5-10 5 8 4-6"/>',
 dart:'<circle cx="22" cy="26" r="17"/><circle cx="22" cy="26" r="10"/><circle cx="22" cy="26" r="3" fill="currentColor"/><path d="M42 6L25 23M42 6v7M42 6h-7"/>'
};
const faceSvg=[
 '<path d="M30 6a18 18 0 1 0 12 30A20 20 0 0 1 30 6z"/>',
 '<path d="M13 42V19h-3V7h6v5h5V7h6v5h5V7h6v12h-3v23z"/>',
 '<path d="M24 4l6 13 14 1-11 10 4 14-13-8-13 8 4-14L4 18l14-1z"/>',
 '<path d="M24 3l16 21-16 21L8 24z"/>'
];
const spadeSvg='<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 5C14 17 7 22 7 30a8 8 0 0 0 14 5l-3 8h12l-3-8a8 8 0 0 0 14-5c0-8-7-13-17-25z"/></svg>';
const mineSvg='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">'+gameSvg.mine+'</svg>';
function gameIcon(key){return ART['icon_game_'+key]?'<img alt="" src="'+ART['icon_game_'+key]+'">':'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+gameSvg[key]+'</svg>';}
function face(i){return '<svg class="ktFace" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">'+faceSvg[i]+'</svg>';}
function lootChips(gain){
 const icon={gold:'icon_rw_gold',gems:'icon_rw_gem',chests:'icon_rw_chest'};
 return Object.entries(gain||{}).filter(([k,v])=>moneyNames[k]&&v>0).map(([k,v])=>'<span class="ktChip">'+(ART[icon[k]]?'<img alt="'+moneyNames[k]+'" src="'+ART[icon[k]]+'"><b>+'+v+'</b>':'<b>+'+v+'</b> '+moneyNames[k])+'</span>').join('');
}
function casinoPage(){
 const round=state.gameRound,result=state.gameResult,book=dayBook(state);
 if(!round&&!casinoSelection){
  return section('Şans','<div class="balanceLine">Fiş <b>'+(developerFree(state)?'∞':3-book.casino)+' / 3</b></div><div class="gameGrid">'+Object.entries(games).map(([key,[name]])=>tag('<i>'+gameIcon(key)+'</i><b>'+name+'</b>','table','data-key="'+key+'"','gameTile')).join('')+'</div>','OYUN SALONU');
 }
 const key=round?.game||casinoSelection,game=games[key],R=round,done=!round&&result?.game===key,X=done?result.show:null;
 const mv=(html,choice,cls,extra='')=>tag(html,'tableMove','data-id="'+R.id+'" data-step="'+R.step+'" data-choice="'+choice+'" '+extra,cls);
 const same=(list,i)=>list.filter(v=>v===list[i]).length>1,picked=i=>X&&String(X.choice)===String(i);
 let surface='',controls='';
 if(key==='slot'){
  surface='<div class="ktRow">'+[0,1,2].map(i=>'<span class="ktReel'+(X&&same(X.marks,i)?' hit':'')+'">'+(X?face(X.marks[i]):'')+'</span>').join('')+'</div>';
  if(R)controls=mv('Çevir','go','ktBtn');
 }else if(key==='wheel'){
  const p=(deg,r)=>[(50+r*Math.cos(deg*Math.PI/180)).toFixed(1),(50+r*Math.sin(deg*Math.PI/180)).toFixed(1)];
  const slices=wheelGifts.map((g,i)=>{const a=p(i*60-120,46),b=p(i*60-60,46),m=p(i*60-90,31),[k,v]=Object.entries(g)[0];
   return '<path d="M50 50L'+a[0]+' '+a[1]+'A46 46 0 0 1 '+b[0]+' '+b[1]+'Z" fill="'+(i%2?'#2a2630':'#8f3328')+'" stroke="#bc9559" stroke-width=".8"/><text x="'+m[0]+'" y="'+m[1]+'" dy="3" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="'+(k==='gold'?12:7)+'" fill="'+(k==='gold'?'#f0c75e':'#f4ead5')+'" transform="rotate('+(i*60)+' '+m[0]+' '+m[1]+')">'+(k==='gold'?v:k==='feed'?'Yem':'Cevher')+'</text>';}).join('');
  surface='<div class="ktWheel'+(X?' done':'')+'" style="--a:'+(X?-X.pick*60-1080:0)+'deg"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48.5" fill="#17151d" stroke="#bc9559" stroke-width="2"/>'+slices+'<circle cx="50" cy="50" r="6" fill="#bc9559" stroke="#17151d"/></svg><i></i></div>';
  if(R)controls=mv('Çevir','go','ktBtn');
 }else if(key==='box'){
  const chest=ART.icon_rw_chest?'<img alt="" src="'+ART.icon_rw_chest+'">':'';
  surface='<div class="ktRow">'+[0,1,2].map(i=>R?mv(chest,String(i),'ktChest','aria-label="'+(i+1)+'. kutu"'):'<span class="ktChest'+(X?(picked(i)?' open':' dim'):'')+'">'+(picked(i)?lootChips(X.boxes[i]):chest)+'</span>').join('')+'</div>';
 }else if(key==='coin'){
  surface='<div class="ktCoin'+(X?' done':'')+'"><b>'+(X?(X.pick%2?'T':'Y'):'')+'</b></div>';
  if(R)controls=mv('Yazı','yazi','ktBtn')+mv('Tura','tura','ktBtn');
 }else if(key==='hilo'){
  const name=n=>({1:'A',11:'J',12:'Q',13:'K'})[n]||n,card=n=>'<span class="ktCard'+(n?'':' back')+'">'+(n?spadeSvg+'<b>'+name(n)+'</b>':'')+'</span>';
  surface='<div class="ktRow">'+card(R?R.first:X?.first)+card(X?.next)+'</div>';
  if(R)controls=mv('▼','down','ktBtn','aria-label="Daha düşük"')+mv('▲','up','ktBtn','aria-label="Daha yüksek"');
 }else if(key==='mine'){
  const coin=ART.icon_rw_gold?'<img alt="" src="'+ART.icon_rw_gold+'">':'';
  surface='<div class="ktGrid">'+Array.from({length:9},(_,i)=>{const safe=(R||X)?.shown?.includes(i),trap=X?.traps?.includes(i);
   return R&&!safe?mv('',String(i),'ktTile','aria-label="'+(i+1)+'. hücre"'):'<span class="ktTile'+(safe?' safe':trap?(picked(i)?' boom':' trap'):' flat')+'">'+(safe?coin:trap?mineSvg:'')+'</span>';}).join('')+'</div>';
  if(R&&R.shown.length)controls=mv('Al · '+R.shown.length*3,'cash','ktBtn');
 }else if(key==='race'){
  surface='<div class="ktLanes'+(X?' done':'')+'">'+horses.map((name,i)=>{const rank=X?X.order.indexOf(i):-1,inner='<i style="--x:'+(X?[86,66,52,40][rank]:4)+'%">'+name[0]+'</i><b>'+name+'</b>';
   return R?mv(inner,String(i),'ktLane'):'<span class="ktLane'+(picked(i)?' mine':'')+(rank===0?' first':'')+'">'+inner+'</span>';}).join('')+'</div>';
 }else if(key==='scratch'){
  surface='<div class="ktRow">'+[0,1,2].map(i=>{const open=!!X||!!R?.shown.includes(i),marks=(X||R)?.marks;
   return R&&!open?mv('',String(i),'ktFoil','aria-label="'+(i+1)+'. alan"'):'<span class="ktFoil'+(open?' open':'')+(X&&same(X.marks,i)?' hit':'')+'">'+(open?face(marks[i]):'')+'</span>';}).join('')+'</div>';
 }else{
  const ring=done?(result.label==='Tam merkez'?0:result.label==='İç halka'?1:2):9;
  surface='<div class="ktDart r'+ring+'"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" class="d2"/><circle cx="50" cy="50" r="30" class="d1"/><circle cx="50" cy="50" r="11" class="d0"/></svg>'+(R?'<div class="dartTrack"><i id="dartSight"></i></div>':'')+'</div>';
  if(R)controls=mv('At','go','ktBtn');
 }
 const head='<div class="ktHead"><span class="ktTag">Fiş <b>'+(developerFree(state)?'∞':3-book.casino)+' / 3</b></span>'+(R?.practice||(done&&result.practice)?'<span class="ktTag">Alıştırma</span>':'')+tag('i','tableInfo','data-key="'+key+'" aria-label="Kurallar"','ktOrb')+'</div>';
 const res=done?'<div class="tableResult ktResult">'+(lootChips(result.gain)||'<span class="ktChip none">—</span>')+'<small>'+result.label+'</small></div>':'';
 const dock=R?controls+mv('✕','exit','ktOrb','aria-label="Turu bırak"'):tag('Oyna','deal','data-key="'+key+'" '+(book.casino>=3&&!developerFree(state)?'disabled':''),'ktBtn')+tag('Alıştırma','deal','data-key="'+key+'" data-practice="1"','ktBtn sub')+tag('Oyunlar','allTables','','ktBtn sub');
 return section(game[0],'<div class="kt kt-'+key+'">'+head+'<div class="ktSurface">'+surface+'</div>'+res+'<div class="ktDock">'+dock+'</div></div>','ŞANS');
}
