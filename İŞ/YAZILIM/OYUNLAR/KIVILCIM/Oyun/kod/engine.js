const ms=s=>Math.round(s*1000);
const limit=ms(BALANCE.timeLimitSec), guardLength=ms(BALANCE.guard.durationSec), guardCooldown=ms(BALANCE.guard.cooldownSec);
const stages=BALANCE.stages.map(stage=>({...stage,enemies:stage.enemies.map(enemy=>({...enemy,normal:enemy.normalAtSec.map(ms),heavy:enemy.heavyAtSec.map(ms)}))}));
const HUNT=stages.length, BRIDGE=HUNT+1;
const huntPack=[
 {id:'yaban_kopek',hp:80,normalDamage:4,normal:[3,7,11,15,19,23,27],heavyDamage:0,heavy:[]},
 {id:'haydut',hp:115,normalDamage:5,normal:[2,6,10,14,18,22,26,30],heavyDamage:0,heavy:[]},
 {id:'baskinci',hp:120,normalDamage:4,normal:[4,12,20,28],heavyDamage:15,heavy:[7,15,23]}
].map(e=>({...e,normal:e.normal.map(ms),heavy:e.heavy.map(ms)}));
const encounters=[...stages,{id:'AV',enemies:huntPack},{...stages[2],id:'BÖLGE BOSSU'}];
function developerFree(s){return s?.settings?.developerFree===true;}
// ESKİ — enerji kaldırıldı (v4). Aşağıdaki dört ad yalnız eski ekran kodu kırılmasın diye duruyor;
// ekranlar enerjiyi göstermeyi bırakınca silinecek. Giriş sınırı: ekonomi.js → gunlukHak.
const energyCap=20,energyPeriod=600000,huntCost=0;
function energyNow(){return energyCap;}
function spendEnergy(){return true;}
const istanbulDay=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'});
function rewardDay(now=Date.now()){return istanbulDay.format(now);}
function upgradeOffer(s){
 const level=s.upgrades.item_kilic||0;
 if(level===0)return {from:0,gold:BALANCE.upgrade.gold,ore:0};
 if(level===1)return {from:1,gold:100,ore:4};
 return null;
}
function canForge(s,offer){return !!offer&&s.items.includes('item_kilic')&&afford(s,{gold:offer.gold,ore:offer.ore});}
function healthOf(s){return BALANCE.hero.hp+extraHealth(s)+gearTotal(s,'hp')+companionBonus(s,'hp');}
const uid=()=>crypto.randomUUID?.() || Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
const QA=location.hash==='#qa';
const owner=uid();
// v4: silah dahil bütün eşyalar gear/worn içinde. items/equipped/upgrades ESKİ alanlardır; boş tutulur,
// equipped yalnız kahraman çizimindeki silah görünümünü seçer. Ekranlar bırakınca silinecek.
const defaults=()=>({...baseGrowth(),...baslangicEkipmani(),version:EKONOMI.surum,idleAt:Date.now(),ore:0,shards:0,bossPaidDay:null,relicActive:false,revision:0,gold:0,xp:0,equipped:'item_dagger',items:[],upgrades:{},cleared:[],fight:null,receipt:null,pending:false,settings:{motion:true,developerFree:false,quality:'Yüksek',fps:60,lowPower:false,vibration:false,quickBattleConfirm:false}});
function normalize(raw){
 const base=defaults();if(!raw)return gelisimHazirla(base);
 const s={...base,...raw,version:Math.max(base.version,raw.version||0),settings:{...base.settings,...raw.settings},upgrades:{...raw.upgrades}};
 if((raw.version||0)<EKONOMI.surum)gocEt(s,raw);
 s.equipped=(wornGear(s,'silah')?.tier||1)>=2?'item_kilic':'item_dagger';
 return gelisimHazirla(s);
}
function bonus(s,key){return (BALANCE.weapons[key]||0)+(key===BALANCE.upgrade.item?(s.upgrades[key]||0)*BALANCE.upgrade.attackGain:0);} // ESKİ
function attack(s){return BALANCE.hero.baseAttack+bonusAttack(s)+gearTotal(s,'atk')+companionBonus(s,'atk');}
const maxHp=BALANCE.hero.hp;
function freshFight(s,index){
    // Yoldaş yeteneği (ekonomi.js → petler): sifa, isirik, savustur, hiz, cift, kabuk, goz, nefes.
    const pet=petSavas(s),tur=pet?.tur,period=ms(BALANCE.hero.attackPeriodSec);
    return {id:uid(),owner,index,date:rewardDay(),pet,petHeal:tur==='sifa'?pet.n:0,guardCd:guardCooldown-(tur==='goz'?pet.n:0),period:period-(tur==='hiz'?pet.n:0),nextBreath:tur==='nefes'?EKONOMI.gelisim.nefesAralik:null,strikes:0,normals:0,charmHeal:s.slots.charm==='tas'?4:0,at:0,maxHp:healthOf(s),hp:healthOf(s),enemyHp:encounters[index].enemies.map(e=>e.hp),target:0,atk:attack(s),weapon:s.equipped,guardAt:-guardCooldown,nextStrike:ms(BALANCE.hero.firstHitSec),normalNext:encounters[index].enemies.map(()=>0),heavyNext:encounters[index].enemies.map(()=>0),paused:false,lastEvent:null,end:null};
}
function advance(f,until,command){
    if(f.end||f.paused)return;
    until=Math.min(limit,Math.max(f.at,Math.floor(until)));
    const {enemies,tactic}=encounters[f.index],pet=f.pet,tur=pet?.tur;
    while(!f.end){
        let next=Math.min(f.nextStrike,limit);
        if(f.nextBreath)next=Math.min(next,f.nextBreath);
        enemies.forEach((e,i)=>{if(f.enemyHp[i]>0)next=Math.min(next,e.normal[f.normalNext[i]]??Infinity,e.heavy[f.heavyNext[i]]??Infinity);});
        const t=Math.min(until,next);
        f.at=t;
        if(t===until&&command){
            if(command.type==='guard'&&t>=f.guardAt+(f.guardCd??guardCooldown))f.guardAt=t;
            if(command.type==='target'&&f.enemyHp[command.index]>0)f.target=command.index;
        }
        if(next>until)break;
        const event={at:t,hit:[],incoming:0,blocked:false,heavy:false};
        if(t===f.nextStrike){
            f.nextStrike+=f.period||ms(BALANCE.hero.attackPeriodSec);
            f.strikes=(f.strikes||0)+1;
            const primary=f.target,kat=tur==='cift'&&f.strikes%pet.n===0?2:1;
            if(kat>1)event.double=true;
            f.enemyHp=f.enemyHp.map((hp,i)=>{
                if(!hp)return 0;
                const strike=i===primary?f.atk*kat+(tur==='isirik'?pet.n:0):Math.max(1,Math.floor(f.atk*kat*BALANCE.hero.splashFraction));
                const dmg=tactic===1&&t>=(f.armorBrokenUntil||0)?Math.max(1,strike-2):strike;
                event.hit[i]=dmg;return Math.max(0,hp-dmg);
            });
        }
        if(f.nextBreath&&t===f.nextBreath){
            f.nextBreath+=EKONOMI.gelisim.nefesAralik;event.breath=true;
            f.enemyHp=f.enemyHp.map((hp,i)=>{if(!hp)return 0;event.hit[i]=(event.hit[i]||0)+pet.n;return Math.max(0,hp-pet.n);});
        }
        if(!f.enemyHp[f.target])f.target=f.enemyHp.findIndex(h=>h>0);
        if(f.target<0)f.end='win';
        if(!f.end)enemies.forEach((e,i)=>{
            if(!f.enemyHp[i])return;
            for(const [times,cursor,damage] of [['normal','normalNext',e.normalDamage],['heavy','heavyNext',e.heavyDamage]]){
                if(e[times][f[cursor][i]]!==t)continue;
                f[cursor][i]++;
                if(times==='normal'&&tur==='savustur'){f.normals=(f.normals||0)+1;if(f.normals%pet.n===0){event.dodged=true;continue;}}
                const guarded=f.guardAt<=t&&t<f.guardAt+guardLength;
                const incoming=Math.max(1,damage+(tactic===0&&f.enemyHp[i]*2<e.hp?2:0)-(times==='heavy'&&tur==='kabuk'?pet.n:0));
                const value=guarded?Math.max(1,Math.floor(incoming*BALANCE.guard.damageMultiplier)):incoming;
                if(tactic===1&&guarded&&times==='heavy')f.armorBrokenUntil=t+4000;
                f.hp=Math.max(0,f.hp-value);event.incoming+=value;event.blocked=guarded;
                if(times==='heavy')event.heavy=true;
            }
        });
        if(tactic===2&&t%5000===0)f.enemyHp=f.enemyHp.map((hp,i)=>hp?Math.min(enemies[i].hp,hp+4):0);
        let heal=0;
        if(f.hp>0&&event.blocked&&event.heavy&&f.charmHeal){heal+=f.charmHeal;f.charmHeal=0;}
        if(f.hp>0&&f.hp<=(f.maxHp||maxHp)*.4&&f.petHeal){heal+=f.petHeal;f.petHeal=0;}
        if(heal){f.hp=Math.min(f.maxHp||maxHp,f.hp+heal);event.heal=heal;}
        f.lastEvent=event;
        if(!f.end&&!f.hp)f.end='lose';
        if(!f.end&&t===limit){
            if(encounters[f.index].kind==='arena'){
                const margin=f.hp*enemies[0].hp-f.enemyHp[0]*(f.maxHp||maxHp);
                f.end=margin>0?'win':margin<0?'lose':'draw';
            }else f.end='timeout';
        }
        if(t===until)break;
    }
}
// Otomatik savaş: ağır darbe geldiğinde savunma hazırsa kendiliğinden kullanılır. Oyuncudan giriş beklenmez.
function autoAdvance(f,until){
    until=Math.min(limit,Math.floor(until));
    const {enemies}=encounters[f.index];
    while(!f.end&&!f.paused&&f.at<until){
        let heavy=Infinity;
        enemies.forEach((e,i)=>{const t=e.heavy[f.heavyNext[i]];if(f.enemyHp[i]>0&&t!==undefined&&t>f.at&&t>=f.guardAt+(f.guardCd??guardCooldown))heavy=Math.min(heavy,t);});
        if(heavy<=until)advance(f,heavy,{type:'guard'});else advance(f,until);
    }
}
function settle(s,f){
    if(!s.fight||s.fight.id!==f.id||s.fight.owner!==owner||!f.end)return false;
    const st=encounters[f.index],win=f.end==='win',kills=f.enemyHp.filter(hp=>hp===0).length;
    // item: ESKİ alan, hep null. İlk geçiş eşyası artık receipt.gear ile gelir (bkz. gearDrops).
    let gold=0,xp=0,ore=0,shards=0,first=false,item=null;
    if(isHunt(f.index)){
        if(f.end!=='exit'){gold=kills*EKONOMI.av.hedefAltin;ore=kills*EKONOMI.av.hedefCevher+(kills===st.enemies.length?EKONOMI.av.tamAvCevher:0);}
    }else if(f.index===BRIDGE){
        if(win){const day=rewardDay();if(s.bossPaidDay===day)gold=EKONOMI.bolgeBossu.tekrar.gold;else{shards=EKONOMI.bolgeBossu.ilk.shards;s.bossPaidDay=day;}}
    }else if(win&&(!st.kind||st.kind==='campaign')){
        first=!s.cleared.includes(st.id);
        gold=first?st.gold:BALANCE.repeatGold;xp=first?st.xp:BALANCE.repeatXp;
        if(first)s.cleared.push(st.id);
    }
    s.gold+=gold;s.xp+=xp;s.ore+=ore;s.shards+=shards;
    s.receipt={id:f.id,index:f.index,end:f.end,at:f.at,hp:f.hp,gold,xp,ore,shards,kills,item,first};
    recordOutcome(s,f,s.receipt);
    s.pending=true;s.fight=null;
    return true;
}
function connect(){return new Promise((resolve,reject)=>{
    const req=indexedDB.open('kivilcim-koy-seferi'+(QA?'-qa':''),1);
    req.onupgradeneeded=()=>req.result.createObjectStore('records');
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
});}
let db,sessionOnly=false,sessionRecord;
function sessionTransaction(fn){
 const copy=normalize(structuredClone(sessionRecord));
 if(fn(copy)!==false){copy.revision++;sessionRecord=structuredClone(copy);}
 return Promise.resolve(copy);
}
function transact(fn){if(sessionOnly)return sessionTransaction(fn);return new Promise((resolve,reject)=>{
    const tx=db.transaction('records','readwrite'),store=tx.objectStore('records'),get=store.get('player');
    let saved,err;
    get.onsuccess=()=>{try{saved=normalize(get.result);if(fn(saved)!==false){saved.revision++;store.put(saved,'player');}}catch(e){err=e;tx.abort();}};
    tx.oncomplete=()=>resolve(saved);tx.onabort=tx.onerror=()=>reject(err||tx.error||new Error('Kayıt yazılamadı.'));
});}
