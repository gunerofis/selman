// Mantık testi: ekran işaretlemesine bağlı değil. Kayıt, göç, haklar, ödüller, güç, boşta ganimet.
// Çalıştır: node kod/mantik-test.cjs
const vm=require('vm'),assert=require('node:assert/strict'),{webcrypto}=require('crypto');
const {createCanvas,Image,Path2D}=require('@napi-rs/canvas');
const {js,manifest}=require('./test-ortami.cjs');
class Elem{
 constructor(id){this.id=id;this.style={setProperty(){}};this.dataset={};this.children={};this.open=false;this.textContent='';this.classList={add(){},remove(){},toggle(){},contains(){return false;}};}
 set innerHTML(m){this.markup=m;}get innerHTML(){return this.markup||'';}
 querySelector(k){return this.children[k]||=new Elem(k);}querySelectorAll(){return [];}
 setAttribute(k,v){this[k]=v;}getAttribute(k){return this[k];}removeAttribute(){}addEventListener(){}append(){}
 showModal(){this.open=true;}close(){this.open=false;}insertAdjacentHTML(k,v){this.markup=(this.markup||'')+v;}
 getBoundingClientRect(){return {width:1280,height:720,left:0,top:0};}
}
const shared={data:undefined,serial:Promise.resolve()};
function mockDB(){return {transaction(){const tx={};let write,request,abort=false;
 tx.objectStore=()=>({get(){request={};return request;},put(v){write=structuredClone(v);}});
 tx.abort=()=>{abort=true;};
 shared.serial=shared.serial.then(()=>new Promise(r=>setImmediate(()=>{request.result=structuredClone(shared.data);request.onsuccess();if(abort)tx.onabort();else{if(write)shared.data=write;tx.oncomplete();}r();})));
 return tx;
}};}
function app(){
 const els={};
 const canvas=()=>{const c=createCanvas(1280,720);c.getBoundingClientRect=()=>({width:1280,height:720});return c;};
 const doc={getElementById(id){if(!els[id]){els[id]=id.endsWith('Canvas')?canvas():new Elem(id);if(id==='asset-manifest')els[id].textContent=manifest;}return els[id];},
  createElement:t=>t==='canvas'?canvas():new Elem(t),documentElement:new Elem('root'),body:new Elem('body'),hidden:false,addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}};
 const idb={open(){const req={};setImmediate(()=>{req.result=mockDB();req.onsuccess();});return req;}};
 const ctx=vm.createContext({document:doc,window:{addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}})},navigator:{},localStorage:{getItem(){return null;},setItem(){}},crypto:webcrypto,location:{hash:'#qa'},Image,Path2D,performance,devicePixelRatio:1,requestAnimationFrame(){},indexedDB:idb,structuredClone,setTimeout,clearTimeout,setImmediate,console,Intl,MutationObserver:undefined});
 vm.runInContext(js,ctx);
 return {run:e=>vm.runInContext(e,ctx)};
}
const wait=(n=80)=>new Promise(r=>setTimeout(r,n));
let fails=0;const ok=(name,fn)=>{try{fn();console.log('GEÇTİ  '+name);}catch(e){fails++;console.log('KALDI  '+name+' → '+String(e.message).split('\n')[0]);}};
(async()=>{
 const a=app();await wait(200);
 ok('oyun açılıyor, kayıt v4',()=>{assert.equal(a.run('typeof state'),'object');assert.equal(a.run('state.version'),a.run('EKONOMI.surum'));});
 ok('yeni oyuncu: 6 yuva kuşanılı, enerji/kristal yok',()=>{const r=a.run('(()=>{const s=defaults();return [s.gear.length,Object.keys(s.worn).length,attack(s),healthOf(s),"energy" in s,s.crystals||0,s.items.length]})()');assert.deepEqual([...r],[6,6,17,126,false,0,0]);});
 ok('göç v3: silahlar ekipmana, kristal elmasa, enerji silinir',()=>{const r=a.run(`(()=>{const raw={version:3,gold:5,gems:1,crystals:5,energy:7,energyAt:1,items:['item_dagger','item_kilic'],equipped:'item_kilic',upgrades:{item_kilic:2},gear:[{id:'g1',slot:'kask',tier:1,rarity:0,plus:0,sockets:[]}],gearSeq:1,worn:{},cleared:[]};const s=normalize(raw),w=wornGear(s,'silah');const again=normalize(JSON.parse(JSON.stringify(s)));return [s.version,s.gems,'energy' in s,w.tier,w.rarity,w.plus,gearBonus(w,'atk'),!!wornGear(s,'kask'),s.gear.length,again.gear.length,s.equipped]})()`);assert.deepEqual([...r],[4,4,false,2,1,8,9,true,3,3,'item_kilic']);});
 ok('göç v2 (ekipmansız eski kayıt)',()=>{const r=a.run(`(()=>{const s=normalize({version:2,gold:200,items:['item_kilic','item_dagger'],equipped:'item_dagger',upgrades:{},cleared:['1-1']});return [s.gear.filter(g=>g.slot==='silah').length,wornGear(s,'silah').tier,Object.keys(s.worn).length]})()`);assert.deepEqual([...r],[2,1,6]);});
 ok('günlük hak: av 5, bölge bossu 3, arena 5; geliştirici modunda sınırsız',()=>{const r=a.run(`(()=>{const s=defaults();s.cleared=['1-1','1-2','1-3'];const say=i=>{let n=0;while(n<20&&admit(s,i))n++;return n;};const out=[say(HUNT),say(BRIDGE),say(trials.arena[0]),girisNedeni(s,HUNT)!=='',hakKalan(s,'hunt')];s.settings.developerFree=true;out.push(admit(s,HUNT),girisNedeni(s,HUNT));s.settings.developerFree=false;s.book.date='2000-01-01';out.push(admit(s,HUNT));return out})()`);assert.deepEqual([...r],[5,3,5,true,0,true,'',true]);});
 ok('kilit sebepleri metin veriyor',()=>{const r=a.run(`(()=>{const s=defaults();return [girisNedeni(s,0),girisNedeni(s,1),girisNedeni(s,BRIDGE),girisNedeni(s,huntingGrounds[1]),girisNedeni(s,trials.guildBoss[0])]})()`);assert.equal(r[0],'');for(const t of [...r].slice(1))assert(t.length>5,t);});
 ok('1-1 ilk geçiş: 1 elmas + Köy Kılıcı (T2 yeşil), tekrar geçişte yok',()=>{const r=a.run(`(()=>{const s=defaults();const oyna=()=>{const f=freshFight(s,0);s.fight=f;autoAdvance(f,limit);settle(s,f);return s.receipt;};const r1=oyna(),g=s.gear.find(x=>x.id===r1.gear);const gems1=s.gems;const r2=oyna();return [r1.end,r1.first,gems1,g?.slot,g?.tier,g?.rarity,r1.item,r2.first,s.gems,gearName(g)]})()`);assert.deepEqual([...r],['win',true,1,'silah',2,1,null,false,1,'Köy Kılıcı']);});
 ok('Köy ustalık sayılıyor (17 bölge)',()=>{assert.equal(a.run(`(()=>{const s=defaults();s.cleared=route.map(i=>encounters[i].id);return campaignMastery(s)})()`),17);});
 ok('günlük boss elmas verir, kristal vermez',()=>{const r=a.run(`(()=>{const s=defaults();const i=trials.daily[0];admit(s,i);const f=freshFight(s,i);s.fight=f;f.enemyHp=[0];f.end='win';f.at=1000;settle(s,f);return [s.gems,s.crystals||0]})()`);assert.deepEqual([...r],[3,0]);});
 ok('boşta ganimet: 5 dk altı yok, 6 saat birikir, 12 saatte dolar',()=>{const r=a.run(`(()=>{const s=defaults(),t=1e12;s.idleAt=t;const a0=bostaTopla(s,t+60000);const g6=bostaGanimet(s,t+6*3600000),g30=bostaGanimet(s,t+30*3600000);const gold0=s.gold;const got=bostaTopla(s,t+6*3600000);return [a0,g6.gold,g6.xp,g6.ore,g30.dolu,g30.gold,s.gold-gold0,s.idleAt===t+6*3600000]})()`);assert.deepEqual([...r],[null,180,36,6,true,360,180,true]);});
 ok('önerilen güç: her karşılaşma için hesaplanıyor, yeni oyuncu 1-1 için yeterli',()=>{const r=a.run(`(()=>{const all=encounters.map((e,i)=>onerilenGuc(i));return [all.every(n=>n>0&&n<200000),guc(defaults())>=onerilenGuc(0),onerilenGuc(0),onerilenGuc(route[50]),guc(defaults())]})()`);console.log('        1-1 önerilen '+r[2]+' · 17-3 önerilen '+r[3]+' · yeni oyuncu gücü '+r[4]);assert(r[0]);assert(r[1]);});
 ok('yetersiz kaynak listesi yer gösteriyor',()=>{const r=a.run(`eksikler(defaults(),{gold:30,ore:2})`);assert.equal(r.length,2);assert.equal(r[0].yer[0],'map');});
 // —— Petler ——
 ok('8 pet: görsel, canlandırma ve yetenek metni hazır',()=>{const r=a.run(`EKONOMI.petler.map(p=>[p.id,!!ART['icon_pet_'+p.id],!!atlasDefs[p.atlas],petYetenekMetni(defaults(),p.id,10).length>10,collections.pet.some(c=>c[0]===p.id)])`);assert.equal(r.length,8);for(const row of r)assert.deepEqual([...row].slice(1),[true,true,true,true],row[0]);});
 ok('pet yetenekleri savaşta çalışıyor (seviye 10)',()=>{const r=a.run(`(()=>{const kur=id=>{const s=defaults();if(id){s.unlocks.push(id);s.slots.pet=id;s.petLevel={[id]:10};}else s.slots.pet='yok';return s;};
  const f=id=>{const s=kur(id);return freshFight(s,2);};const out={};
  out.sifa=f('ak').petHeal;out.hiz=f('pet_boynuz').period;out.goz=f('pet_baykus').guardCd;
  let x=f('pet_kopek'),b=f(null);const fark=attack(kur('pet_kopek'))-attack(kur(null));advance(x,1000);advance(b,1000);out.isirik=(340-x.enemyHp[0])-(340-b.enemyHp[0])-fark;
  x=f('tilki');const atk=x.atk;advance(x,4000);const once=x.enemyHp[0];advance(x,5000);out.cift=(once-x.enemyHp[0])/atk;
  x=f('pet_kaplumbaga');b=f(null);advance(x,5000);advance(b,5000);out.kabuk=(b.maxHp-b.hp)-(x.maxHp-x.hp);
  x=f('pet_kedi');advance(x,10000);out.savustur=x.normals;const kedi=x.maxHp-x.hp;b=f(null);advance(b,10000);out.savusturFark=(b.maxHp-b.hp)-kedi;
  x=f('pet_ejder');b=f(null);const ef=attack(kur('pet_ejder'))-attack(kur(null));advance(x,6000);advance(b,6000);out.nefes=(340-x.enemyHp[0])-(340-b.enemyHp[0])-ef*6;
  return out})()`);assert.deepEqual({...r},{sifa:26,hiz:880,goz:3100,isirik:3,cift:2,kabuk:6,savustur:4,savusturFark:6,nefes:18});});
 ok('eski kalıp pet kimlikleri yeni petlere taşınıyor',()=>{const r=a.run(`(()=>{const s=defaults();s.unlocks.push('pet_kurt');s.slots.pet='pet_kurt';s.petLevel={pet_kurt:4};const n=normalize(JSON.parse(JSON.stringify(s)));return [n.slots.pet,n.unlocks.includes('pet_kopek'),n.unlocks.includes('pet_kurt'),n.petLevel.pet_kopek]})()`);assert.deepEqual([...r],['pet_kopek',true,false,4]);});
 // —— Kanatlar ve Auralar ——
 ok('12 kanat, 3 set (4er parça); 12 kanadın ikonu ve sırt çizimi bağlı',()=>{const r=a.run(`[EKONOMI.kanatlar.length,kanatSetDurumu(defaults()).map(x=>x.parcalar.length).join(),EKONOMI.kanatlar.filter(k=>ART['icon_wing_'+k.id]&&images['wing_'+k.id]).length,new Set([...EKONOMI.kanatlar,...EKONOMI.auralar,...EKONOMI.petler].map(v=>v.id)).size]`);assert.deepEqual([...r],[12,'4,4,4',12,32]);});
 ok('kanat seti: 2 ve 4 parçada etki açılır; ikinci stat sayılır',()=>{const r=a.run(`(()=>{const s=gelisimHazirla(defaults()),hp0=healthOf(s),atk0=attack(s);s.unlocks.push('turna','wing_ay');const hp2=healthOf(s)-hp0;s.unlocks.push('wing_firtina','kuzgun');const atk4=attack(s)-atk0;s.unlocks.push('wing_hiclik');s.slots.wings='wing_hiclik';return [hp2,atk4,attack(s)-atk0-atk4,healthOf(s)-hp0-hp2]})()`);assert.deepEqual([...r],[6,3,6,20]);});
 ok('12 aura, 12 ikon; seviye etkiyi çarpar',()=>{const r=a.run(`(()=>{const s=gelisimHazirla(defaults()),atk0=attack(s),hp0=healthOf(s);s.unlocks.push('aura_ejder');s.slots.auras='aura_ejder';s.collectionLevels['auras:aura_ejder']=3;return [EKONOMI.auralar.length,EKONOMI.auralar.filter(x=>ART['icon_aura_'+x.id]).length,attack(s)-atk0,healthOf(s)-hp0]})()`);assert.deepEqual([...r],[12,12,12,36]);});
 ok('kalıntı 12, tılsım 8, yeni taş 4 görseli bağlı',()=>{const r=a.run(`[EKONOMI.kalintilar.filter(k=>ART['icon_relic_'+k.id]).length,['tas','av','dis','dugum','damla','can','pul','boncuk'].filter(k=>ART['icon_charm_'+k]).length,['safir','topaz','ametist','oniks'].filter(k=>ART['icon_stone_'+k]).length]`);assert.deepEqual([...r],[12,8,4]);});
 // —— Gezinme ——
 const gez=await a.run(`(async()=>{const out=[],git=async(n,d={})=>{await act(n,{dataset:d});out.push(view);};
  await git('hub');await git('bag');await git('equip');await git('back');await git('back');
  await git('arena');await git('savasArenaTab',{key:'Ödüller'});modal.close();await git('arenaStore');await git('back');await git('back');
  await git('casino');await git('chanceTabBox');await git('chanceTabEvent');await git('back');
  await git('gold');await git('shopEarn');await git('shopDaily');modal.close();await git('back');
  await git('settings');await git('panelSettingsSection',{key:'Bildirim'});modal.close();await git('back');
  await transact(s=>{s.guild=true;}).then(s=>state=s);await git('guild');await git('alanTab',{group:'guild',key:'Mağaza'});modal.close();await git('back');return out.join()})()`);
 ok('Geri önceki ekrana döner; sekmeler ekrandan çıkarmaz',()=>assert.equal(gez,'hub,bag,equip,bag,hub,arena,arena,market,arena,hub,casino,casino,casino,hub,gold,gold,gold,hub,settings,settings,hub,guild,guild,hub'));
 // Bilgi: denge duvarı. Her zaferden sonra en iyi eşyayı kuşanarak seferde nereye kadar gidiliyor?
 const duvar=a.run(`(()=>{const s=defaults();let son='';for(const i of route){let kazandi=false;for(let deneme=0;deneme<3&&!kazandi;deneme++){const f=freshFight(s,i);s.fight=f;autoAdvance(f,limit);settle(s,f);kazandi=f.end==='win';for(const [slot] of gearSlots){const iyi=s.gear.filter(g=>g.slot===slot).sort((x,y)=>gearPower(y)-gearPower(x))[0];if(iyi)s.worn[slot]=iyi.id;}}if(!kazandi)return 'Takıldığı bölüm: '+encounters[i].id+' · güç '+guc(s)+' · önerilen '+onerilenGuc(i);son=encounters[i].id;}return 'Sefer baştan sona geçiliyor ('+son+') · son güç '+guc(s);})()`);
 console.log('BİLGİ  yalnız ganimetle, geliştirme yapmadan: '+duvar);
 console.log(fails?('\n'+fails+' test kaldı.'):'\nHepsi geçti.');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
