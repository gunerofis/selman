const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{webcrypto}=require('crypto');
const {createCanvas,Image,Path2D}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas' : '@napi-rs/canvas');
const {js,manifest}=require('./test-ortami.cjs');
class Elem{
 constructor(id){this.id=id;this.style={setProperty(){}};this.dataset={};this.children={};this.open=false;this.textContent='';}
 set innerHTML(markup){this.markup=markup;this.targets=[...markup.matchAll(/class="target"[^>]+data-i="(\d+)"/g)].map(m=>new Elem('t'+m[1]));}
 get innerHTML(){return this.markup||'';}
 querySelector(k){return this.children[k]||=new Elem(k);}
 querySelectorAll(k){return this.targets||[];}
 setAttribute(k,v){this[k]=v;}
 addEventListener(){}
 showModal(){this.open=true;}
 close(){this.open=false;}
 insertAdjacentHTML(k,v){this.markup+=v;}
}
const shared={data:undefined,serial:Promise.resolve()};
function mockDB(){return {transaction(){const tx={};let write,request,abort=false;
 tx.objectStore=()=>({get(){request={};return request;},put(v){write=structuredClone(v);}});
 tx.abort=()=>{abort=true;};
 shared.serial=shared.serial.then(()=>new Promise(r=>setImmediate(()=>{request.result=structuredClone(shared.data);request.onsuccess();if(abort)tx.onabort();else{if(write)shared.data=write;tx.oncomplete();}r();})));
 return tx;
}};}
let screen=[1280,620];
function app(qa=true){
 const els={},listeners={};
 function canvas(name){const can=createCanvas(...screen);can.getBoundingClientRect=()=>({width:screen[0],height:screen[1]});return can;}
 const doc={
 getElementById(id){if(!els[id]){els[id]=id.endsWith('Canvas')?canvas(id):new Elem(id);if(id==='asset-manifest')els[id].textContent=manifest;}return els[id];},
 createElement:t=>t==='canvas'?canvas(''):new Elem(t),documentElement:new Elem('root'),hidden:false,
 addEventListener(type,cb){listeners[type]=cb;}
 };
 const window={addEventListener(){}};const idb={open(){const req={};setImmediate(()=>{req.result=mockDB();req.onsuccess();});return req;}};
 const ctx=vm.createContext({document:doc,window,crypto:webcrypto,location:{hash:qa?'#qa':''},Image,Path2D,performance,devicePixelRatio:1,requestAnimationFrame(){},indexedDB:idb,structuredClone,setTimeout,clearTimeout,console});
 vm.runInContext(js,ctx);
 return {ctx,doc,els,listeners,run:expr=>vm.runInContext(expr,ctx),act:(name,data={})=>vm.runInContext('act('+JSON.stringify(name)+',{dataset:'+JSON.stringify(data)+'})',ctx),s:()=>structuredClone(vm.runInContext('state',ctx)),f:()=>structuredClone(vm.runInContext('fight',ctx))};
}
const wait=()=>new Promise(res=>setTimeout(res,50));
async function run(){
 let a=app();await wait();await a.run('Promise.allSettled(Object.values(images).map(im=>im.decode()))');await a.run('drawHub()');fs.writeFileSync('kod/test-cikti/hub-canvas.jpg',a.els.hubCanvas.toBuffer('image/jpeg'));
 // Four authored actors must bypass the generic ward/beast/shade placeholders.
 const artProof=a.run(`(()=>{const previous=state;try{
  state={...state,settings:{...state.settings,motion:false}};
  const drawn=[],turns=[],c={save(){},restore(){},translate(){},rotate(a){turns.push(a)},drawImage(im){drawn.push(Object.keys(images).find(k=>images[k]===im))}};
  for(const id of ['trial_0','trial_1','trial_2','kopru_haraci'])figure(c,50,200,180,id,1,true);
  if(drawCharacterArt(c,50,200,180,'unknown_enemy'))throw Error('Unknown actor should use its existing fallback');
  if(turns.length)throw Error('Reduced motion actor rotated');
  return drawn;
 }finally{state=previous}})()`);
 assert.deepEqual(Array.from(artProof),['arena_rival_guard','arena_rival_hunter','arena_rival_warden','boss_koy_1']);
 const dotProof=a.run(`(()=>{const previous=state;try{
  state={...defaults(),...baseGrowth(),mailTaken:true,book:null};const b=dayBook(state);b.hunts=0;b.arenaWins=0;b.wins=0;
  if(hubReady('notices'))throw Error('Empty notification badge');
  const [key,,,goal]=eventsList[0];if(key==='hunt')b.hunts=goal;else if(key==='arena')b.arenaWins=goal;else b.wins=goal;
  if(!hubReady('events')||!hubReady('notices'))throw Error('Event reward not reflected in the hub');
  b.flags[key]=true;if(hubReady('events')||hubReady('notices'))throw Error('Claimed reward still marked ready');
  return true;
 }finally{state=previous}})()`);
 assert.equal(dotProof,true);
 console.log('PASS: four actor images mapped in preview/battle renderer, reduced motion, event-only notification and claimed reward cleanup.');
 assert.equal(a.s().gold,0);assert.equal(a.els.main.innerHTML.match(/data-act=/g).length,18);assert.equal(a.els.top.innerHTML.match(/data-act=/g).length,9);
 await a.act('chapter');assert(a.els.main.innerHTML.includes('Köy yolu'));await a.act('back');await a.act('profile');await a.act('profileTab',{key:'Koleksiyon'});assert(a.els.main.innerHTML.includes('Akboynuz'));
 await a.act('map');await a.act('start');let step=(t,cmd=null)=>a.run('KivilcimQA.step('+t+','+JSON.stringify(cmd)+')'.replace('',''));
 // The QA interface lives on the browser window in this harness.
 step=(t,cmd=null)=>a.run('window.KivilcimQA.step('+t+','+JSON.stringify(cmd)+')');
 await step(5100);fs.writeFileSync('kod/test-cikti/battle-canvas.jpg',a.els.arenaCanvas.toBuffer('image/jpeg'));await step(15000);
 assert.deepEqual([a.s().gold,a.s().xp,a.s().receipt.hp],[60,20,60]);a=app();await wait();assert.equal(a.run('view'),'result');
 await a.act('rewardEquip');await a.act('wearGo');assert.equal(a.s().equipped,'item_kilic');await a.act('start');await a.act('target',{i:'1'});await step(1000);assert.deepEqual([...a.f().enemyHp],[143,135]);
 await step(6100);await a.act('pause');a=app();await wait();assert.equal(a.f().paused,true);await a.act('resume');assert.equal(a.f().at,6100);
 await step(16000);assert.equal(a.s().receipt.hp,47);await a.act('forge');await a.act('upgrade');await a.act('upgrade');assert.equal(a.s().gold,80);assert.equal(a.s().upgrades.item_kilic,1);
 await a.act('map');await a.act('start');await step(4800,{type:'guard'});await step(10800,{type:'guard'});await step(20000);
 assert.deepEqual([a.s().gold,a.s().xp,a.s().receipt.hp,a.s().receipt.at],[200,100,28,20000]);
 await a.act('map');await a.act('selectStage',{i:'0'});await a.act('start');await step(15000);assert.deepEqual([a.s().gold,a.s().xp,a.s().items.length],[215,105,2]);
 await a.act('hub');await a.act('bag');await a.act('bagPick',{key:'item_dagger'});await a.act('wear');await a.act('back');assert.equal(a.run('view'),'bag');assert.equal(a.s().equipped,'item_dagger');
 const scenario=(i,w='item_kilic',lv=0)=>a.run('window.KivilcimQA.scenario('+i+','+JSON.stringify(w)+','+lv+')');
 for(const [guards,t,hp,res] of [[[],17000,0,'lose'],[[4800,10800],23000,16,'win']]){
  await scenario(2);for(const t of guards)await step(t,{type:'guard'});await step(30000);assert.deepEqual([a.s().receipt.at,a.s().receipt.hp,a.s().receipt.end],[t,hp,res]);
 }
 for(const [when,hp] of [[4350,64],[4360,82]]){await scenario(2);await step(when,{type:'guard'});await step(5000);assert.equal(a.f().hp,hp);await step(5200,{type:'guard'});assert.equal(a.f().guardAt,when);}
 await scenario(1);await step(16000);assert.equal(a.s().receipt.hp,36);
 for(const [hp,outcome] of [[360,'win'],[361,'timeout']]){await scenario(0,'item_dagger');a.run('fight.hp=999;fight.enemyHp[0]='+hp);await step(30000);assert.equal(a.s().receipt.end,outcome);}
 await scenario(0,'item_dagger');await step(3200);const stale=a;const b=app();await wait();assert.equal(b.f().at,3200);
 await b.run('window.KivilcimQA.step(15000)');await stale.run('window.KivilcimQA.step(15000)');assert.equal(shared.data.gold,60);assert.equal(shared.data.items.filter(x=>x==='item_kilic').length,1);
 a=b;await a.act('hub');await a.act('forge');await a.run('transact(s=>{s.gold=59}).then(s=>state=s)');await a.act('upgrade');assert.equal(a.s().gold,59);assert.equal(a.s().upgrades.item_kilic||0,0);
 await a.run('transact(s=>{s.customOldField=77; delete s.settings;delete s.version;}).then(s=>state=s)');const resumed=app();await wait();assert.equal(resumed.s().customOldField,77);assert.equal(resumed.s().gold,59);assert.equal(resumed.s().settings.motion,true);
 a=resumed;await a.act('map');await a.act('start');await a.act('pause');await a.act('exit');assert.equal(a.s().receipt.end,'exit');assert.equal(a.s().receipt.gold,0);
 screen=[390,550];await a.act('hub');a.run('drawHub()');fs.writeFileSync('kod/test-cikti/hub-mobile-canvas.jpg',a.els.hubCanvas.toBuffer('image/jpeg'));

 shared.data=undefined;a=app();await wait();await a.act('boss');await a.act('startBoss');assert.equal(a.f(),null);
 await a.act('av');await a.act('startHunt');assert.equal(a.s().energy,18);await step(1100,{type:'target',index:2});assert.equal(a.f().target,2);await step(3200);fs.writeFileSync('kod/test-cikti/hunt-canvas.jpg',a.els.arenaCanvas.toBuffer('image/jpeg'));
 a=app();await wait();assert.equal(a.f().at,3200);assert.equal(a.s().energy,18);await step(30000);assert.equal(a.s().receipt.kills,3);assert.equal(a.s().gold,15);assert.equal(a.s().ore,4);assert.equal(a.s().cleared.length,0);
 await a.act('av');await a.act('startHunt');await step(7000);await a.act('pause');await a.act('exit');assert.equal(a.s().receipt.kills,1);assert.equal(a.s().receipt.ore,0);assert.equal(a.s().ore,4);assert.equal(a.s().energy,16);
 await a.act('av');await a.act('startHunt');await step(7000);a.run('fight.hp=1');await step(30000);assert.equal(a.s().receipt.end,'lose');assert.equal(a.s().receipt.gold,5);assert.equal(a.s().receipt.ore,1);
 const en=a.run('(()=>{const s={energyAt:0,energy:17};return [energyNow(s,599999),energyNow(s,600000),energyNow(s,3000000),spendEnergy(s,1000000),s.energyAt,s.energy]})()');assert.deepEqual([...en],[17,18,20,true,600000,16]);
 await a.run('transact(s=>{s.energy=0;s.energyAt=Date.now();}).then(s=>state=s)');await a.act('av');await a.act('startHunt');assert.equal(a.f(),null);assert.equal(a.s().energy,0);
 await a.run('transact(s=>{s.cleared=stages.map(t=>t.id);s.gold=160;s.ore=4;s.items.push("item_kilic");s.equipped="item_kilic";}).then(s=>state=s)');
 await a.act('forge');await a.act('upgrade',{level:'0'});await a.act('upgrade',{level:'0'});assert.equal(a.s().gold,100);await a.act('upgrade',{level:'1'});await a.act('upgrade',{level:'1'});assert.equal(a.s().gold,0);assert.equal(a.s().ore,0);assert.equal(a.run('attack(state)'),19);
 const winBoss=async()=>{await a.act('boss');await a.act('startBoss');await step(4800,{type:'guard'});await step(10800,{type:'guard'});await step(30000);assert.equal(a.s().receipt.end,'win');};
 await winBoss();assert.equal(a.s().shards,3);assert.equal(a.s().gold,0);await winBoss();assert.equal(a.s().shards,3);assert.equal(a.s().gold,10);
 assert.equal(a.run('rewardDay(Date.parse("2026-11-11T21:00:00Z"))'),'2026-11-12');
 await a.run('transact(s=>{s.bossPaidDay="2020-01-01";}).then(s=>state=s)');await winBoss();assert.equal(a.s().shards,6);await a.act('relic');await a.act('makeRelic');await a.act('makeRelic');assert.equal(a.s().shards,0);assert(a.s().relicActive);await a.act('boss');await a.act('startBoss');assert.equal(a.f().hp,103);
 console.log('PASS v1.1: hunt admission and cooldown, three targets, partial/full/abandon drops, resume, one-time upgrade, regional boss daily/reset, relic crafting and health.');
 shared.data=undefined;a=app();await wait();
 const routes=await a.run('route.slice()');assert.equal(routes.length,51);assert.equal(a.run('regionalBosses.length'),17);
 await a.act('mail');await a.act('claimMail');await a.act('claimMail');assert.equal(a.s().feed,1);assert.equal(a.s().gems,1);
 await a.act('pet');await a.act('trainPet');assert.equal(a.s().training,1);
 for(const viewName of ['arena','boss','market','casino','guild','rank','events','wings','titles','charm','auras','notices','profile','relic','bag','av','forge']){
   await a.act(viewName);assert(!a.els.main.innerHTML.includes('sonraki üretim'));assert(!a.els.main.innerHTML.includes('undefined'),viewName);
 }
 // Every hub destination must load its own painting and reachable action surface.
 const roomKeys=a.run('Object.keys(venues)');
 assert.equal(roomKeys.length,24);
 const painted=new Set();
 for(const key of roomKeys){
  await a.act('hub');await a.act(key);
  assert(a.els.main.innerHTML.includes('class="venue venue-'+key+' surface-'),key);
  assert(a.els.main.innerHTML.includes('data-act="back"'),key);
  assert(!a.els.main.innerHTML.includes('undefined'),key);
  const source=a.run('ART.room_'+key);assert(source.startsWith('data:image/webp;base64,'),key);painted.add(source);
  await a.act('back');assert.equal(a.run('view'),'hub',key);
 }
 assert.equal(painted.size,24);
 await a.act('settings');const motion=a.s().settings.motion;await a.act('toggleMotion');assert.equal(a.s().settings.motion,!motion);
 await a.act('gem');assert(a.els.main.innerHTML.includes('Yolcu Sandığı'));await a.act('crystal');assert(a.els.main.innerHTML.includes('Kristal takası'));
 console.log('PASS: 24 distinct venue illustrations and live surfaces, direct entry and return, settings, wallet shortcuts.');
 // Play through all story encounters with normal damage, real rewards and crafted equipment.
 const proof=a.run(`(()=>{
  const s=defaults(),out=[];
  function clear(index){
   const f=freshFight(s,index);s.fight=f;
   const incoming=[...new Set(encounters[index].enemies.flatMap(e=>e.heavy))].sort((a,b)=>a-b);
   for(const at of incoming){if(f.end)break;advance(f,at-120,{type:'guard'});}
   if(!f.end)advance(f,limit);
   settle(s,f);if(f.end!=='win')throw Error('Unbeaten stage '+encounters[index].id+' '+f.end+' '+f.hp+' '+f.enemyHp);
   return f;
  }
  for(const i of route){
   if(!allowed(i,s))throw Error('Locked stage '+i);
   const f=clear(i);out.push([encounters[i].id,f.at]);
   if(i===0){s.equipped='item_kilic';const o=upgradeOffer(s);if(!canForge(s,o))throw Error('upgrade');s.gold-=o.gold;s.upgrades.item_kilic=1;}
   if(i===2){spendEnergy(s);clear(HUNT);const o=upgradeOffer(s);if(!canForge(s,o))throw Error('no ore');s.gold-=o.gold;s.ore-=o.ore;s.upgrades.item_kilic=2;}
  }
  return {count:s.cleared.length,mastery:campaignMastery(s),last:out.at(-1),gems:s.gems,endTitle:titleReady(s,'fatih')};
 })()`);
 assert.equal(proof.count,51);assert.equal(proof.mastery,16);assert.equal(proof.endTitle,true);assert.equal(proof.gems,48);console.log('Complete unaided campaign simulation:',proof);
 // Restore a populated 1.1 state and play the first new map through the normal UI command path.
 shared.data={version:2,gold:200,xp:100,items:['item_kilic','item_dagger'],equipped:'item_kilic',upgrades:{item_kilic:2},cleared:['1-1','1-2','1-3'],ore:8,seen:[],receipt:null,pending:false};a=app();await wait();
 await a.act('map');assert.equal(a.run('chosenStage'),routes[3]);assert(a.els.main.innerHTML.includes('Orman yolu'));await a.act('start');await step(30000);assert.equal(a.s().receipt.first,true);assert(a.s().cleared.includes('2-1'));assert.equal(a.s().gems,1);
 await a.act('arena');await a.act('trialStart',{i:a.run('trials.arena[0]')});await step(30000);assert.equal(a.s().arenaCoin,2);assert.equal(a.s().stats.rating,12);await a.act('arenaStore');await a.act('buy',{key:'arena'});assert.equal(a.s().chests,1);await a.act('openChest');assert.equal(a.s().feed,1);assert.equal(a.s().chests,0);
 await a.act('boss');const trial=k=>a.run('trials['+JSON.stringify(k)+'][0]');await a.act('trialStart',{i:trial('daily')});await step(4800,{type:'guard'});await step(11800,{type:'guard'});await step(30000);assert(a.s().crystals>0);await a.act('boss');await a.act('trialStart',{i:trial('daily')});assert.equal(a.f(),null);
 for(let j=0;j<3;j++){await a.act('trialStart',{i:trial('world')});await step(30000);await a.act('boss');}assert.equal(a.s().book.used.world,3);assert(a.s().stats.world>0);await a.act('trialStart',{i:trial('world')});assert.equal(a.f(),null);
 await a.act('guild');await a.act('joinGuild');await a.act('donate');assert.equal(a.s().guildCoin,1);await a.act('trialStart',{i:trial('guildWar')});await step(30000);assert(a.s().guildCoin>1);await a.act('guildStore');await a.act('buy',{key:'guild'});
 await a.act('events');await a.act('claimEvent',{key:'win'});const gem=a.s().gems;await a.act('claimEvent',{key:'win'});assert.equal(a.s().gems,gem);
 await a.act('wings');await a.act('collectItem',{key:'wings',id:'turna'});assert.equal(a.s().slots.wings,'turna');assert.equal(a.run('healthOf(state)'),105);await a.act('removeSlot',{key:'wings'});assert.equal(a.run('healthOf(state)'),100);
 await a.act('titles');await a.act('collectItem',{key:'titles',id:'gecit'});assert.equal(a.s().slots.titles,'gecit');
 await a.act('claimMail');await a.act('pet');await a.act('trainPet');assert.equal(a.s().training,1);
 const keys=a.run('Object.keys(games)');assert.equal(keys.length,9);
 for(const key of keys){
  await a.act('casino');await a.act('table',{key});await a.act('deal',{key,practice:'1'});const bal=a.s().gold;
  const round=a.s().gameRound;assert.equal(round.game,key);
  const cmd=async(choice)=>{const r=a.s().gameRound;await a.act('tableMove',{id:r.id,step:String(r.step),choice});};
  if(key==='scratch'){await cmd('0');a=app();await wait();await a.act('casino');assert.equal(a.s().gameRound.shown.length,1);await cmd('1');await cmd('2');}
  else if(key==='mine'){const safe=[0,1,2,3,4,5,6,7,8].find(i=>!round.traps.includes(i));await cmd(String(safe));await cmd('cash');}
  else if(key==='coin')await cmd('yazi');else if(key==='hilo')await cmd('up');else if(key==='race'||key==='box')await cmd('0');else await cmd('go');
  assert.equal(a.s().gameRound,null,key);assert.equal(a.s().gold,bal);assert.equal(a.s().gameResult.game,key);
 }
 assert.equal(a.s().book.casino,0);
 for(let i=0;i<3;i++){await a.act('deal',{key:'box'});const r=a.s().gameRound,pick=r.boxes.findIndex(b=>b.gold);await a.act('tableMove',{id:r.id,step:'0',choice:String(pick)});const paid=a.s().gold;await a.act('tableMove',{id:r.id,step:'0',choice:String(pick)});assert.equal(a.s().gold,paid);}
 await a.act('deal',{key:'box'});assert.equal(a.s().gameRound,null);assert.equal(a.s().book.casino,3);
 console.log('PASS v2: 51 campaign wins, 17 boss links, old save upgrade, new UI destinations, pet/wing/title effects, market, daily limits, world record, guild, event claims, all nine tables, resumed scratch game, single payment and daily tickets.');

 const regionalProof=a.run(`(()=>{
  const s=defaults(),prizes=new Set(),titles=new Set();
  if(allowed(huntingGrounds[1],s)||allowed(BRIDGE,s))throw Error('New save gate');
  s.cleared=route.map(i=>encounters[i].id);s.equipped='item_kilic';s.upgrades.item_kilic=2;s.slots.titles='fatih';
  function play(i){
   if(!admit(s,i))throw Error('Admission '+i);
   const f=freshFight(s,i);s.fight=f;
   const hits=[...new Set(encounters[i].enemies.flatMap(e=>e.heavy))].sort((a,b)=>a-b);
   for(const hit of hits){if(f.end)break;advance(f,hit-100,{type:'guard'});}
   if(!f.end)advance(f,limit);
   if(f.end!=='win'||!settle(s,f))throw Error(routeName(i)+' '+f.end);
   return s.receipt;
  }
  for(const [r,ladder] of bossLadders.entries()){
   for(const [rank,i] of ladder.entries()){
    if(ladder[rank+1]&&allowed(ladder[rank+1],s))throw Error('Boss order');
    const loot=play(i);if((loot.shards||loot.extra.shards)!==3)throw Error('First win');
    if((play(i).gold||s.receipt.extra.gold)!==10)throw Error('Repeat win');
    prizes.add(i);titles.add(routeName(i));
   }
   s.energy=4;s.energyAt=Date.now();const prize=play(huntingGrounds[r]);
   if(prize.kills!==3||prize.gold!==15||prize.ore!==4||s.energy!==2)throw Error('Hunt payout');
  }
  return [prizes.size,titles.size,huntingGrounds.length];
 })()`);
 assert.deepEqual(Array.from(regionalProof),[85,85,17]);
 await a.act('av'); await a.act('huntRegion',{i:'1'});assert(a.els.main.innerHTML.includes('Diken böceği'));
 await a.act('startHunt');assert.equal(a.f().index,a.run('huntingGrounds[1]'));await step(30000);assert(a.els.main.innerHTML.includes('AV GANİMETİ'));
 await a.act('boss');await a.act('bossTab',{key:'Bölge'});await a.act('bossRegion',{i:'1'});assert(a.els.main.innerHTML.includes('Orman Atası'));
 console.log('PASS: 85 named bosses, sequential unlocks, 170 boss battles, 17 three-target hunts, energy and per-boss daily rewards, hunt and boss selectors.');

 // Check production scheduling with a varying frame budget and the normal click dispatcher.
 shared.data=undefined;const prod=app(false);await wait();await prod.act('hub');await prod.act('map');await prod.act('start');prod.run('lastFrame=1000;tick(3000);tick(7250);tick(16000)');await wait();
 assert.equal(prod.s().receipt.end,'win');assert.equal(prod.s().receipt.at,15000);assert.equal(prod.run('window.KivilcimQA'),undefined);
 // Otomatik savaş ve atlama: girişsiz boss galibiyeti, tek dokunuşla sonuç.
 shared.data=undefined;const auto=app(false);await wait();
 const autoEnd=auto.run(`(()=>{const s=defaults();s.items.push('item_kilic');s.equipped='item_kilic';const f=freshFight(s,2);autoAdvance(f,limit);return [f.end,f.at<=limit,f.hp>0];})()`);
 assert.deepEqual(Array.from(autoEnd),['win',true,true]);
 await auto.act('hub');await auto.act('map');await auto.act('start');assert.equal(auto.run('view'),'battle');assert(!auto.els.main.innerHTML.includes('data-act="guard"'));
 await auto.act('skip');assert.equal(auto.run('view'),'result');assert.equal(auto.s().receipt.end,'win');assert.equal(auto.s().fight,null);
 console.log('PASS: auto battle wins the first boss without input; skip settles a fight once.');
 // Ekipman: kademe/nadirlik/güçlendirme/taş, kuşanınca güç artar, satınca çantadan çıkar.
 shared.data=undefined;const g=app();await wait();
 assert.equal(g.s().gear.length,3);const hp0=g.run('healthOf(state)'),atk0=g.run('attack(state)');
 const kask=g.s().gear.find(x=>x.slot==='kask');await g.act('equip');assert(g.els.main.innerHTML.includes('gxBag'));
 await g.act('gearSelect',{id:kask.id});await g.act('gearWear',{id:kask.id});assert.equal(g.run('healthOf(state)'),hp0+8);
 await g.run('transact(s=>{s.gold=1000;s.ore=50;s.stones={yakut:1};const w=rollGear(s,20,1e9,"silah");w.rarity=7;w.sockets=[null,null,null,null];}).then(s=>state=s)');
 const w=g.s().gear.at(-1);assert.equal(w.tier,20);await g.act('gearWear',{id:w.id});const a1=g.run('attack(state)');assert(a1>atk0);
 await g.act('gearUp',{id:w.id});assert.equal(g.s().gear.at(-1).plus,1);assert(g.run('attack(state)')>a1);assert.equal(g.s().gold,1000-15*20);
 await g.act('gearSocket',{id:w.id,stone:'yakut'});assert.equal(g.s().gear.at(-1).sockets[0],'yakut');assert.equal(g.s().stones.yakut,0);
 await g.act('gearSell',{id:w.id});assert.equal(g.s().gear.length,4);await g.act('gearOff',{id:w.id});await g.act('gearSell',{id:w.id});assert.equal(g.s().gear.length,3);assert.equal(g.run('attack(state)'),atk0);
 // Çanta, Demirci (birleştir/parçala/taş), Pet seviye-yıldız, Kanat güçlendirme, Market sandığı.
 await g.run('transact(s=>{s.gold=9000;s.gems=400;s.ore=60;s.feed=9;s.feather=9;s.eggs=9;s.stones={yakut:2};s.gear=[];s.worn={};for(let i=0;i<3;i++){const x=rollGear(s,4,1,"yuzuk");x.rarity=2;x.sockets=[null];}}).then(s=>state=s)');
 await g.act('bag');assert(g.els.main.innerHTML.includes('gxBag'));
 await g.act('forge');await g.act('forgeTab',{key:'Birleştir'});assert(g.els.main.innerHTML.includes('forgeMerge'));
 await g.act('forgeMergeAll');assert.deepEqual([g.s().gear.length,g.s().gear[0].rarity],[1,3]);
 const ring=g.s().gear[0];await g.act('forgeTab',{key:'Taş'});await g.act('forgeSel',{id:ring.id});await g.act('gearSocket',{id:ring.id,stone:'yakut'});
 await g.act('forgePull',{id:ring.id});assert.equal(g.s().stones.yakut,2);
 await g.act('forgeTab',{key:'Parçala'});const ore0=g.s().ore;await g.act('forgeScrap',{id:ring.id});assert.equal(g.s().gear.length,0);assert(g.s().ore>ore0);
 const hp1=g.run('healthOf(state)');await g.act('pet');await g.act('trainPet',{id:'ak'});assert.equal(g.s().petLevel.ak,1);assert.equal(g.run('healthOf(state)'),hp1+2);
 await g.act('petStar',{id:'ak'});assert.equal(g.s().petStar.ak,1);assert.equal(g.s().eggs,8);
 await g.act('wings');await g.act('collectItem',{key:'wings',id:'turna'});
 // Kanat: 5 seviye sonra evrim kapısı, rün yuvası, başarı oranı.
 await g.run('transact(s=>{s.feather=99;s.gold=99999;s.stones={zumrut:2};s.wingLevel={turna:5}}).then(s=>state=s)');
 assert.equal(g.run("wingCap(state,'turna')"),5);
 await g.act('wingUp',{id:'turna'});assert.equal(g.s().wingLevel.turna,5);
 await g.act('wingTab',{key:'Evrim'});await g.act('wingEvo',{id:'turna'});
 assert.equal(g.s().wingPhase.turna,1);assert.equal(g.run("wingCap(state,'turna')"),10);
 assert.equal(g.run("wingStat(state,'turna','hp')"),Math.floor(5*3*1.25));
 await g.act('wingTab',{key:'Rün'});await g.act('wingRuneSet',{id:'turna',stone:'zumrut'});
 assert.equal(g.s().wingRunes.turna[0],'zumrut');assert.equal(g.s().stones.zumrut,1);
 await g.act('wingRunePull',{id:'turna',i:'0'});assert.equal(g.s().stones.zumrut,2);
 await g.run('transact(s=>{s.wingLevel={turna:0};s.wingPhase={turna:0};s.slots.wings="turna"}).then(s=>state=s)');
 assert.equal(g.run('healthOf(state)'),hp1+2+5);
 await g.act('market');await g.act('marketTab',{key:'Sandıklar'});await g.act('openGearChest',{key:'uber'});
 assert.equal(g.s().gear.length,5);assert(g.s().gear.every(x=>x.plus===5));assert.equal(g.s().gems,400-120);
 // Profil: boş kayıt, gerçek ilerleme, sekmeler, ad kaydı ve metin güvenliği.
 shared.data=undefined;const p=app();await wait();await p.act('profile');
 assert(p.run('portableSaveValid({format:"kivilcim-save",version:1,player:state})'));
 assert(!p.run('portableSaveValid({format:"other",version:1,player:state})'));
 assert(!p.run('portableSaveValid({format:"kivilcim-save",version:1,player:{...state,gold:-1}})'));
 assert(p.els.main.innerHTML.includes('prRoom'));
 assert.equal(p.run('profileAchievements().filter(a=>a.done).length'),0);
 assert(p.run('profileCollection().some(c=>c.id==="ak"&&c.owned)'));
 for(const tab of ['Başarımlar','Görünüm','İstatistikler','Koleksiyon','Özet']){
  await p.act('profileTab',{key:tab});assert(!p.els.main.innerHTML.includes('undefined'),tab);
  const text=p.els.main.innerHTML.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,'');
  assert(!text.includes('NaN'),tab);assert(p.els.main.innerHTML.includes('data-act="back"'));
 }
 const beforeName=p.s();await p.act('profileEdit');assert(p.els.modal.innerHTML.includes('profileNameInput'));
 p.doc.getElementById('profileNameInput').value='   ';await p.act('profileSave');assert.equal(p.s().profileName,undefined);
 p.doc.getElementById('profileNameInput').value='  Ak   Yıldız  ';await p.act('profileSave');assert.equal(p.s().profileName,'Ak Yıldız');
 assert(p.els.main.innerHTML.includes('Ak Yıldız'));assert.equal(p.els.modal.open,false);
 const afterName=p.s();for(const key of Object.keys(beforeName))if(!['revision','book'].includes(key))assert.deepEqual(afterName[key],beforeName[key],key);
 const again=app();await wait();await again.act('profile');assert.equal(again.s().profileName,'Ak Yıldız');
 await again.act('profileEdit');again.doc.getElementById('profileNameInput').value='<img src=x onerror=1>';
 await again.act('profileSave');assert(!again.els.main.innerHTML.includes('<img src=x'));assert(again.els.main.innerHTML.includes('&lt;img'));
 await again.act('profileEdit');again.doc.getElementById('profileNameInput').value='a'.repeat(40);await again.act('profileSave');assert.equal(again.s().profileName.length,24);
 await again.run('transact(s=>{s.xp=438;s.stats.wins=3;s.cleared=["1-1","1-2","1-3"];s.upgrades.item_kilic=1;s.seen=["haydut"];}).then(s=>state=s)');
 await again.act('profile');assert(again.els.main.innerHTML.includes('Lv.3'));assert(again.els.main.innerHTML.includes('438 / 900'));
 assert(again.run('profileAchievements().slice(0,3).every(a=>a.done)'));
 await again.act('profileAchievement',{key:'first'});assert(again.els.modal.innerHTML.includes('Kazanıldı'));
 await again.act('close');await again.act('profileTab',{key:'Görünüm'});await again.act('wings');assert.equal(again.run('view'),'wings');
 await again.act('profile');await again.act('back');assert.equal(again.run('view'),'hub');
 console.log('PASS: profile tabs, empty and advanced saves, achievement conditions, collection, XP, persisted rename, blank/long names, escaped markup, appearance links and return.');
 console.log('PASS: bag, forge merge/socket/scrap, pet level+star, wing upgrade, market chest.');
 console.log('PASS: gear tiers, rarity, enhancement, sockets, wear/remove, sell.');
 console.log('PASS. Vite source order tested: deterministic battles, rewards, two simulated saves, pause/restore, source UI, portable save validation, canvas scene renders.');
}
run().catch(e=>{console.error(e);process.exit(1);});
