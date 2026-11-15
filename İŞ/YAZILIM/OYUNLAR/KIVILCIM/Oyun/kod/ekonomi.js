// EKONOMİ — tek kaynak. Fiyat, ödül, oran, hak ve çarpanlar burada durur.
// Ekran kodu sayı tanımlamaz; buradan okur. Sahibi: Claude (bkz. Notlar/Is_Listesi.md).
const EKONOMI={
 surum:4,
 baslangic:{tier:1,rarity:0},
 // Üst şeritte görünen paralar. Kristal ve enerji yok.
 paralar:{gold:'Altın',gems:'Elmas',arenaCoin:'Arena Jetonu',guildCoin:'Lonca Jetonu'},
 // Çantada duran malzemeler.
 malzemeler:{ore:'Cevher',feed:'Yem',eggs:'Yumurta',feather:'Tüy',shards:'Kalıntı Parçası',chests:'Erzak Sandığı'},
 // Günlük giriş hakları; Türkiye saatiyle gece yarısı yenilenir. Seferde hak yok.
 gunlukHak:{hunt:5,regional:3,daily:1,world:3,arena:5,guildBoss:1,guildWar:1,casino:3},
 hakAdi:{hunt:'Av',regional:'Bölge Bossu',daily:'Günlük Boss',world:'Dünya Bossu',arena:'Arena',guildBoss:'Lonca Bossu',guildWar:'Lonca Savaşı',casino:'Şans'},
 // Bir kaynağın en kolay bulunduğu ekran: [hub eylemi, ad].
 kaynakYeri:{gold:['map','Sefer'],gems:['events','Etkinlikler'],ore:['av','Av'],feed:['market','Market'],eggs:['boss','Boss'],feather:['boss','Boss'],shards:['boss','Bölge Bossu'],arenaCoin:['arena','Arena'],guildCoin:['guild','Lonca'],chests:['market','Market']},
 av:{hedefAltin:5,hedefCevher:1,tamAvCevher:1},
 ilkGecis:{gems:1,bolgeSonuSandik:1},
 bolgeBossu:{ilk:{shards:3},tekrar:{gold:10}},
 gunlukBossElmas:[[1,3],[.5,2],[.25,1]], // [hasar oranı, elmas]
 dunyaBossu:{shards:1},
 arena:{zafer:12,yenilgi:-8,jeton:2,jetonluZafer:3},
 lonca:{bagis:20,bagisJeton:1,bossHasar:2,bossZafer:5,savasZafer:3,savasKatilim:1,savasPuan:2},
 posta:{feed:1,gems:1},
 erzakSandigi:{gold:10,feed:1,sans:1.5},
 kristalKuru:2, // eski kayıt: 2 kristal = 1 elmas
 // Boşta Ganimet: oyun kapalıyken birikir.
 bosta:{enCokSaat:12,enAzDakika:5,altin:[30,6],xp:[6,2],cevher:[1,.5]} // [taban, ilerleme başına] saatlik
};

// —— Güç ——
function guc(s){return healthOf(s)+10*attack(s);}
const onerilenBellek={};
// Bir karşılaşmayı otomatik savaşla kazanan en düşük güç (can = 10 × saldırı dengesinde).
function onerilenGuc(index){
 if(onerilenBellek[index]!=null)return onerilenBellek[index];
 const e=encounters[index];if(!e)return 0;
 const kazanir=a=>{
  const f={index,at:0,maxHp:a*10,hp:a*10,enemyHp:e.enemies.map(x=>x.hp),target:0,atk:a,guardAt:-guardCooldown,nextStrike:ms(BALANCE.hero.firstHitSec),normalNext:e.enemies.map(()=>0),heavyNext:e.enemies.map(()=>0),petHeal:0,charmHeal:0,paused:false,lastEvent:null,end:null};
  autoAdvance(f,limit);return f.end==='win';
 };
 let lo=1,hi=4;while(!kazanir(hi)&&hi<8192)hi*=2;
 while(lo<hi){const mid=(lo+hi)>>1;if(kazanir(mid))hi=mid;else lo=mid+1;}
 return onerilenBellek[index]=lo*20;
}

// —— Günlük haklar ——
function hakTuru(index){
 const e=encounters[index];if(!e)return null;
 if(isHunt(index))return 'hunt';
 if(index===BRIDGE||e.kind==='regional')return 'regional';
 return EKONOMI.gunlukHak[e.kind]?e.kind:null;
}
function hakKalan(s,tur){return Math.max(0,EKONOMI.gunlukHak[tur]-(dayBook(s).used[tur]||0));}
// Girişin kapalı olma sebebi; açıksa boş metin. Kilit ve hak mesajlarının tek kaynağı.
function girisNedeni(s,index){
 const e=encounters[index];if(!e)return 'Karşılaşma bulunamadı.';
 if(!allowed(index,s)){
  if(e.kind==='guildBoss'||e.kind==='guildWar')return 'Önce loncaya katıl.';
  if(e.kind==='hunt')return (e.region+1)+'-1 bölümünü tamamla.';
  if(index===BRIDGE)return '1-3 bölümünü tamamla.';
  if(e.kind==='regional')return s.cleared.includes((e.region+1)+'-3')?'Önce '+routeName(e.previous)+' bossunu yen.':(e.region+1)+'-3 bölümünü tamamla.';
  const pos=route.indexOf(index);return pos>0?encounters[route[pos-1]].id+' bölümünü tamamla.':'Kilitli.';
 }
 const tur=hakTuru(index);
 if(tur&&!developerFree(s)&&hakKalan(s,tur)<=0)return EKONOMI.hakAdi[tur]+' hakkı bitti ('+EKONOMI.gunlukHak[tur]+' / '+EKONOMI.gunlukHak[tur]+'). Gece yarısı yenilenir.';
 return '';
}
// Yetersiz kaynak penceresi için: eksik kalemler ve bulunacağı ekran.
function eksikler(s,cost){
 if(developerFree(s))return [];
 return Object.entries(cost).filter(([k,v])=>(s[k]||0)<v).map(([k,v])=>({key:k,ad:moneyNames[k]||k,gerek:v,var:s[k]||0,yer:EKONOMI.kaynakYeri[k]||null}));
}

// —— Boşta Ganimet ——
function bostaOran(s){
 const n=s.cleared.length,b=EKONOMI.bosta;
 return {gold:b.altin[0]+n*b.altin[1],xp:b.xp[0]+n*b.xp[1],ore:b.cevher[0]+campaignMastery(s)*b.cevher[1]};
}
function bostaGanimet(s,now=Date.now()){
 const tavan=EKONOMI.bosta.enCokSaat*3600000,sure=Math.max(0,Math.min(now-(s.idleAt||now),tavan)),saat=sure/3600000,o=bostaOran(s);
 return {sure,dolu:sure>=tavan,hazir:sure>=EKONOMI.bosta.enAzDakika*60000,gold:Math.floor(o.gold*saat),xp:Math.floor(o.xp*saat),ore:Math.floor(o.ore*saat)};
}
function bostaTopla(s,now=Date.now()){
 const g=bostaGanimet(s,now);if(!g.hazir)return null;
 give(s,{gold:g.gold,xp:g.xp,ore:g.ore});s.idleAt=now;return g;
}

// —— Kayıt göçü: v4 ——
// Tek ekipman sistemi (eski silahlar ekipmana çevrilir), kristal → elmas, enerji kaldırılır.
function gocEt(s,raw){
 const eski=Array.isArray(raw.items)?raw.items:[],ekipmanli=Array.isArray(raw.gear);
 s.gear=(s.gear||[]).map(g=>({...g,sockets:[...(g.sockets||[])]}));s.worn={...s.worn};
 let hancer=ekipmanli?null:s.gear.find(g=>g.slot==='silah')||null,kilic=null;
 if(ekipmanli&&eski.includes('item_dagger'))hancer=gearGrant(s,'silah',1,0);
 if(eski.includes('item_kilic'))kilic=gearGrant(s,'silah',2,1,[0,3,8][Math.min(2,raw.upgrades?.item_kilic||0)]);
 if(!ekipmanli||!wornGear(s,'silah')){const sec=raw.equipped==='item_kilic'&&kilic?kilic:hancer||kilic;if(sec)s.worn.silah=sec.id;}
 for(const [slot] of gearSlots){
  if(wornGear(s,slot))continue;
  delete s.worn[slot];
  const iyi=s.gear.filter(g=>g.slot===slot).sort((a,b)=>gearPower(b)-gearPower(a))[0];
  if(iyi)s.worn[slot]=iyi.id;
 }
 s.items=[];s.upgrades={};
 s.gems=(s.gems||0)+Math.ceil((raw.crystals||0)/EKONOMI.kristalKuru);s.crystals=0;
 delete s.energy;delete s.energyAt;
 s.version=EKONOMI.surum;
}

// Arayüzün aynı ödül tablosunu göstermesi için salt okunur görünüm.
function karsilasmaOdulu(s,index){
 const e=encounters[index],E=EKONOMI;if(!e)return {};
 if(isHunt(index))return {gold:e.enemies.length*E.av.hedefAltin,ore:e.enemies.length*E.av.hedefCevher+E.av.tamAvCevher};
 if(index===BRIDGE||e.kind==='regional')return {...((index===BRIDGE?s.bossPaidDay:s.dailyBossDays[regionalKey(e)])===rewardDay()?E.bolgeBossu.tekrar:E.bolgeBossu.ilk)};
 if(e.kind==='daily')return {gems:E.gunlukBossElmas[0][1]};
 if(e.kind==='world')return {...E.dunyaBossu};
 if(e.kind==='arena')return dayBook(s).arenaWins<E.arena.jetonluZafer?{arenaCoin:E.arena.jeton}:{};
 const first=!s.cleared.includes(e.id),reward={gold:first?e.gold:BALANCE.repeatGold,xp:first?e.xp:BALANCE.repeatXp};
 if(first){reward.gems=E.ilkGecis.gems;if(e.final)reward.chests=E.ilkGecis.bolgeSonuSandik;}
 return reward;
}

function ayristirmaOdulu(g){return {ore:g.tier+g.rarity,gold:Math.floor(gearSellValue(g)/2)};}


// Koleksiyonların içerik ve gelişim verisi.
EKONOMI.gelisim={seviye:20,yildiz:5,auraSeviye:5,petDestek:.25,petYetenekSeviyeleri:[0,5,10],yumurtaBedeli:1,kalintiParca:6,kalintiCan:3,kalintiSet:4,kalintiSetCan:6,kanatSet:4,kanatSetCan:8,tilsimSeviye:10,tilsimCarpan:.2};
// PETLER — 8 pet, hepsinin görseli hazır. Her petin savaşta ayrı bir yeteneği var; değer seviyeyle büyür:
// değer = taban + artış × seviye (aşağı yuvarlanır). gorsel: ikon anahtarı, atlas: savaş canlandırması.
EKONOMI.gelisim.nefesAralik=6000;
EKONOMI.petler=[
 {id:'ak',name:'Akboynuz',r:1,stat:'hp',base:0,cost:{},gorsel:'pet_akboynuz',atlas:'pet_akboynuz_actor',ability:'Şifa',
  yetenek:{tur:'sifa',taban:6,artis:2,metin:n=>'Can %40’ın altına düşünce bir kez '+n+' can yeniler.'}},
 {id:'pet_kopek',name:'Çoban Köpeği',r:1,stat:'atk',base:1,cost:{feed:3,gold:60},gorsel:'pet_kopek',atlas:'pet_kopek_actor',ability:'Sadık Isırık',
  yetenek:{tur:'isirik',taban:1,artis:.25,metin:n=>'Hedef düşmana her vuruşta +'+n+' hasar.'}},
 {id:'pet_kedi',name:'Benekli Kedi',r:2,stat:'atk',base:1,cost:{eggs:1,gold:90},gorsel:'pet_kedi',atlas:'pet_kedi_actor',ability:'Çevik Pati',
  yetenek:{tur:'savustur',taban:6,artis:-.15,metin:n=>'Her '+n+'. normal darbeyi savuşturur.'}},
 {id:'pet_boynuz',name:'Boz Geyik',r:2,stat:'hp',base:4,cost:{eggs:2,gold:120},gorsel:'pet_boynuz',atlas:'pet_boynuz_actor',ability:'Rüzgâr Koşusu',
  yetenek:{tur:'hiz',taban:40,artis:8,metin:n=>'Saldırı hızı %'+Math.round(n/10)+' artar.'}},
 {id:'tilki',name:'Kızıl Tilki',r:3,stat:'atk',base:2,cost:{feed:3,gold:70},gorsel:'icon_pet_tilki',atlas:'pet_tilki_actor',ability:'Keskin Pençe',
  yetenek:{tur:'cift',taban:6,artis:-.1,metin:n=>'Her '+n+'. vuruş çift hasar verir.'}},
 {id:'pet_kaplumbaga',name:'Taş Kaplumbağa',r:3,stat:'hp',base:8,cost:{eggs:3,gold:160},gorsel:'pet_kaplumbaga',atlas:'pet_kaplumbaga_actor',ability:'Taş Kabuk',
  yetenek:{tur:'kabuk',taban:2,artis:.4,metin:n=>'Ağır darbelerden '+n+' daha az hasar alırsın.'}},
 {id:'pet_baykus',name:'Ay Baykuşu',r:4,stat:'hp',base:6,cost:{eggs:4,gold:220},gorsel:'pet_baykus',atlas:'pet_baykus_actor',ability:'Ay Gözü',
  yetenek:{tur:'goz',taban:300,artis:60,metin:n=>'Savunma '+(n/1000).toLocaleString('tr-TR')+' sn daha çabuk hazır olur.'}},
 {id:'pet_ejder',name:'Yavru Ejder',r:5,stat:'atk',base:3,cost:{eggs:5,gold:300},gorsel:'pet_ejder',atlas:'pet_ejder_actor',ability:'Ejder Nefesi',
  yetenek:{tur:'nefes',taban:6,artis:1.2,metin:n=>'Her 6 saniyede bütün düşmanlara '+n+' hasar verir.'}}
];
// Ekranlar pet ikonunu icon_pet_<id> adıyla arar; hazır görseller bu ada bağlanır.
for(const pet of EKONOMI.petler)if(!ART['icon_pet_'+pet.id]&&ART[pet.gorsel])ART['icon_pet_'+pet.id]=ART[pet.gorsel];
function petVerisi(id){return EKONOMI.petler.find(v=>v.id===id)||null;}
function petYetenekDegeri(s,id,seviye=lvlOf(s,'pet',id)){const y=petVerisi(id)?.yetenek;return y?Math.floor(y.taban+y.artis*seviye):0;}
function petYetenekMetni(s,id,seviye){const p=petVerisi(id);return p?p.yetenek.metin(petYetenekDegeri(s,id,seviye)):'';}
// Savaşa giren yoldaşın yeteneği: {tur, n}. Kilitliyse ya da pet yoksa null.
function petSavas(s){const id=petOf(s),p=petVerisi(id);return p&&s.unlocks.includes(id)?{tur:p.yetenek.tur,n:petYetenekDegeri(s,id)}:null;}
// KANATLAR — 12 kanat, 3 set. r: nadirlik sırası (0 Gri … 7 Işıldayan). ek: ikinci stat. gorsel: ikon, giyim: sırttaki çizim.
// Görseli gelmeyen kanat kilitli görünür, satın alınabilir; çizim gelince kendiliğinden bağlanır.
EKONOMI.kanatlar=[
 {id:'turna',name:'Turna Kanatları',r:2,stat:'hp',base:5,set:'gok',cost:{ore:3,gold:50},gorsel:'icon_wing_turna',giyim:'wing_turna'},
 {id:'wing_ay',name:'Ay Kanatları',r:2,stat:'hp',base:6,set:'gok',cost:{feather:3,gold:110},gorsel:'wing_ay',giyim:'wing_ay_wear'},
 {id:'wing_firtina',name:'Fırtına Kanatları',r:3,stat:'atk',base:2,set:'gok',cost:{feather:4,gold:160},gorsel:'wing_firtina',giyim:'wing_firtina_wear'},
 {id:'kuzgun',name:'Kuzgun Kanatları',r:4,stat:'atk',base:2,set:'gok',cost:{feather:3,gold:120},gorsel:'icon_wing_kuzgun',giyim:'wing_kuzgun'},
 {id:'wing_buzul',name:'Buzul Kanatları',r:3,stat:'hp',base:7,set:'mevsim',cost:{feather:4,gold:160},gorsel:'wing_buzul',giyim:'wing_buzul_wear'},
 {id:'wing_kizilyaprak',name:'Kızıl Yaprak Kanatları',r:3,stat:'atk',base:2,set:'mevsim',cost:{feather:4,gold:160},gorsel:'wing_kizilyaprak',giyim:'wing_kizilyaprak_wear'},
 {id:'wing_golge',name:'Gölge Kanatları',r:4,stat:'atk',base:3,set:'mevsim',cost:{feather:6,gold:240},gorsel:'wing_golge',giyim:'wing_golge_wear'},
 {id:'wing_gunes',name:'Güneş Kanatları',r:5,stat:'hp',base:14,set:'mevsim',cost:{feather:8,gold:340},gorsel:'wing_gunes',giyim:'wing_gunes_wear'},
 {id:'wing_anka',name:'Anka Kanatları',r:5,stat:'atk',base:4,set:'efsane',cost:{feather:8,gold:340},gorsel:'wing_anka',giyim:'wing_anka_wear'},
 {id:'wing_ejder',name:'Ejder Kanatları',r:6,stat:'atk',base:5,set:'efsane',cost:{feather:11,gold:480,gems:10},gorsel:'wing_ejder',giyim:'wing_ejder_wear'},
 {id:'wing_yildiz',name:'Yıldız Kanatları',r:6,stat:'hp',base:18,set:'efsane',cost:{feather:11,gold:480,gems:10},gorsel:'wing_yildiz',giyim:'wing_yildiz_wear'},
 {id:'wing_hiclik',name:'Hiçlik Kanatları',r:7,stat:'atk',base:6,ek:{hp:20},set:'efsane',cost:{feather:15,gold:700,gems:25},gorsel:'wing_hiclik',giyim:'wing_hiclik_wear'}
];
// Set etkisi sahip olunan parça sayısına göre açılır (kuşanmak gerekmez).
EKONOMI.kanatSetleri=[
 {id:'gok',name:'Gök Yolcusu',iki:{hp:6},dort:{atk:3}},
 {id:'mevsim',name:'Dört Mevsim',iki:{atk:2},dort:{hp:16}},
 {id:'efsane',name:'Kadim Efsane',iki:{atk:4},dort:{hp:30,atk:4}}
];
function kanatSetDurumu(s){return EKONOMI.kanatSetleri.map(set=>{const parcalar=EKONOMI.kanatlar.filter(k=>k.set===set.id),sahip=parcalar.filter(k=>s.unlocks.includes(k.id)).length;return {...set,parcalar:parcalar.map(k=>k.id),sahip,ikiAcik:sahip>=2,dortAcik:sahip>=4};});}
// AURALAR — 12 aura, her biri 5 seviye (etki = taban × seviye). tur: ekrandaki süzgeç.
EKONOMI.auralar=[
 {id:'yaprak',name:'Yaprak Halkası',tur:'Saldırı',stat:'atk',base:1,cost:{gold:90,ore:2},gorsel:'aura_yaprak'},
 {id:'sis',name:'Sis Halkası',tur:'Yaşam',stat:'hp',base:8,cost:{gems:3},gorsel:'aura_sis'},
 {id:'aura_ruzgar',name:'Rüzgâr Halkası',tur:'Saldırı',stat:'atk',base:1,cost:{gold:140,ore:3},gorsel:'aura_ruzgar'},
 {id:'aura_dalga',name:'Dalga Halkası',tur:'Yaşam',stat:'hp',base:10,cost:{gold:160,ore:3},gorsel:'aura_dalga'},
 {id:'aura_kar',name:'Kar Çemberi',tur:'Yaşam',stat:'hp',base:12,cost:{gems:4},gorsel:'aura_kar'},
 {id:'aura_kul',name:'Kül Çemberi',tur:'Saldırı',stat:'atk',base:2,cost:{gems:5},gorsel:'aura_kul'},
 {id:'aura_koz',name:'Köz Çemberi',tur:'Saldırı',stat:'atk',base:2,cost:{gems:6,ore:4},gorsel:'aura_koz'},
 {id:'aura_ay',name:'Ay Tacı',tur:'Yaşam',stat:'hp',base:14,cost:{gems:6,ore:4},gorsel:'aura_ay'},
 {id:'aura_isik',name:'Işık Halesi',tur:'Yaşam',stat:'hp',base:16,cost:{gems:8},gorsel:'aura_isik'},
 {id:'aura_golge',name:'Gölge Halkası',tur:'Saldırı',stat:'atk',base:3,cost:{gems:8},gorsel:'aura_golge'},
 {id:'aura_yildiz',name:'Yıldız Halesi',tur:'Saldırı',stat:'atk',base:3,cost:{gems:10,ore:6},gorsel:'aura_yildiz'},
 {id:'aura_ejder',name:'Ejder Halesi',tur:'Özel',stat:'atk',base:4,ek:{hp:12},cost:{gems:14,ore:8},gorsel:'aura_ejder'}
];
// Görsel bağlantıları: ekranlar icon_wing_<id>, wing_<id> (sırtta) ve icon_aura_<id> adlarını arar.
for(const k of EKONOMI.kanatlar){const ikon=ART[k.gorsel],giyim=ART[k.giyim]||ikon;if(ikon&&!ART['icon_wing_'+k.id])ART['icon_wing_'+k.id]=ikon;if(giyim&&k.giyim!=='wing_'+k.id)ART['wing_'+k.id]=giyim;}
for(const a of EKONOMI.auralar)if(ART[a.gorsel]&&!ART['icon_aura_'+a.id])ART['icon_aura_'+a.id]=ART[a.gorsel];
function gorselVar(grup,id){return !!ART[(grup==='wings'?'icon_wing_':grup==='auras'?'icon_aura_':grup==='pet'?'icon_pet_':'icon_'+grup+'_')+id];}
EKONOMI.kalintilar=['Kırık Mühür','Orman Tohumu','Maden Çekirdeği','Bataklık Muskası','Mercan Kalbi','Spor Kristali','Lahit Anahtarı','Kum Saati','Kale Sancağı','Buz Prizması','Tapınak Gözü','Yıldız Küresi'].map((name,i)=>({id:i?'relic_'+i:'muhur',name,region:i,cost:{shards:6+i},stat:i%2?'atk':'hp',base:i%2?1:3,set:Math.floor(i/4),cap:20}));
// Kalıntı, tılsım ve taş görselleri. Ekranlar icon_relic_<id>, icon_charm_<id>, icon_stone_<id> adlarını arar.
['relic_muhur','relic_tohum','relic_cekirdek','relic_muska','relic_mercan','relic_spor','relic_anahtar','relic_kumsaati','relic_sancak','relic_prizma','relic_goz','relic_kure'].forEach((g,i)=>{const k=EKONOMI.kalintilar[i];k.gorsel=g;if(ART[g])ART['icon_relic_'+k.id]=ART[g];});
for(const ad of ['tas','av','dis','dugum','damla','can','pul','boncuk'])if(ART['charm_'+ad])ART['icon_charm_'+ad]=ART['charm_'+ad];
for(const ad of ['safir','topaz','ametist','oniks'])if(ART['stone_'+ad])ART['icon_stone_'+ad]=ART['stone_'+ad];
EKONOMI.unvanlar=[
 {id:'gecit',name:'Geçit Bekçisi',type:'İlerleme',metric:'stage',goal:'1-3',hp:2},
 {id:'duello',name:'Düellocu',type:'Savaş',metric:'arena',goal:1,atk:1},
 {id:'fatih',name:'Eşik Fatihi',type:'İlerleme',metric:'stage',goal:'17-3',atk:3,hp:5},
 ...[['Yolcu',1],['İz Sürücü',3],['Köy Muhafızı',5],['Orman Dostu',10],['Demir Yürek',20],['Geçit Savaşçısı',30]].map(([name,goal],i)=>({id:'title_win_'+i,name,type:'Savaş',metric:'wins',goal,atk:1+Math.floor(i/3),hp:0})),
 ...[['Avcı',1],['Usta Avcı',5],['Yaban Bekçisi',15],['Av Efendisi',30]].map(([name,goal],i)=>({id:'title_hunt_'+i,name,type:'Savaş',metric:'hunts',goal,hp:2+i*2})),
 ...[['Gezgin',3],['Yol Ustası',9],['Bölge Kaşifi',18],['Ufuk Bekçisi',30]].map(([name,goal],i)=>({id:'title_route_'+i,name,type:'İlerleme',metric:'cleared',goal,hp:3+i})),
 {id:'title_guild',name:'Sancak Yoldaşı',type:'Özel',metric:'guild',goal:1,hp:4},
 {id:'title_donate',name:'Cömert Yürek',type:'Özel',metric:'donated',goal:200,hp:5},
 {id:'title_arena',name:'Arena Muhafızı',type:'Savaş',metric:'arena',goal:10,atk:2}
];
function koleksiyonAciklamasi(item){if(item.yetenek)return item.ability+': '+item.yetenek.metin(Math.floor(item.yetenek.taban));return item.stat?(item.stat==='atk'?'Saldırı':'Can')+' +'+item.base+'.':[(item.atk?'Saldırı +'+item.atk:''),(item.hp?'Can +'+item.hp:'')].filter(Boolean).join(' · ');}
function gelisimKataloglari(){return {pet:EKONOMI.petler,wings:EKONOMI.kanatlar,auras:EKONOMI.auralar,relic:EKONOMI.kalintilar,titles:EKONOMI.unvanlar};}
function gelisimHazirla(s){
 s.profileId||='KV-'+uid().replace(/-/g,'').slice(0,8).toUpperCase();
 s.collectionLevels||={};s.auraEssence??=0;s.charmLevels||={};s.chestPity||={};s.achievementsTaken||=[];s.appearance||={portrait:'default',frame:'gold',showcase:[]};s.notificationSettings||={rewards:true,battles:true,events:true};s.marketBook||={};
 if(s.relicActive&&!s.unlocks.includes('muhur'))s.unlocks.push('muhur');
 // Kalıptan üretilmiş eski kimlikler görseli olan içeriğe taşınır.
 for(const [grup,eski,yeni] of [['pet','pet_kurt','pet_kopek'],['pet','pet_kaplan','pet_kaplumbaga'],['wings','wing_orman','wing_kizilyaprak'],['wings','wing_buz','wing_buzul'],['auras','aura_kor','aura_koz'],['auras','aura_buz','aura_kar'],['auras','aura_toprak','aura_kul'],['auras','aura_deniz','aura_dalga']]){
  if(!s.unlocks.includes(eski))continue;
  s.unlocks=s.unlocks.filter(v=>v!==eski);if(!s.unlocks.includes(yeni))s.unlocks.push(yeni);
  if(s.slots[grup]===eski)s.slots[grup]=yeni;if(s.supportPet===eski)s.supportPet=yeni;
  for(const alan of ['petLevel','petStar','wingLevel','wingPhase','wingRunes'])if(s[alan]?.[eski]!=null){if(s[alan][yeni]==null||s[alan][eski]>s[alan][yeni])s[alan][yeni]=s[alan][eski];delete s[alan][eski];}
  const k=grup+':'+eski;if(s.collectionLevels[k]!=null){s.collectionLevels[grup+':'+yeni]=Math.max(s.collectionLevels[grup+':'+yeni]||0,s.collectionLevels[k]);delete s.collectionLevels[k];}
 }
 if(s.guild){loncaDefteri(s);loncaDefteri(s,'weekly');}
 s.mailCreated||=rewardDay();
 return s;
}
function koleksiyonSeviye(s,group,id){return s.collectionLevels?.[group+':'+id]||(s.unlocks.includes(id)?1:0);}
function koleksiyonBedeli(s,group,id){const level=koleksiyonSeviye(s,group,id);return group==='auras'?{auraEssence:level,gold:40*level}:group==='relic'?{shards:level,gold:30*level}:{ore:level,gold:25*level};}
function koleksiyonYukselt(s,group,id){
 const item=gelisimKataloglari()[group]?.find(v=>v.id===id),level=koleksiyonSeviye(s,group,id),cap=group==='auras'?EKONOMI.gelisim.auraSeviye:EKONOMI.gelisim.seviye;
 if(!item||!s.unlocks.includes(id)||level>=cap||!spend(s,koleksiyonBedeli(s,group,id)))return false;
 s.collectionLevels[group+':'+id]=level+1;return true;
}
function koleksiyonBonusu(s,stat){
 let sum=0;
 for(const [group,list] of Object.entries(gelisimKataloglari())){
  if(group==='relic'){for(const item of list)if(s.unlocks.includes(item.id)&&item.stat===stat)sum+=item.base*koleksiyonSeviye(s,group,item.id);continue;}
  const item=list.find(v=>v.id===s.slots[group]);if(!item)continue;
  if(group==='titles')sum+=item[stat]||0;
  else{const kat=group==='auras'?koleksiyonSeviye(s,group,item.id):1;if(item.stat===stat)sum+=item.base*kat;sum+=(item.ek?.[stat]||0)*kat;}
 }
 if(stat==='hp')sum+=Math.floor(EKONOMI.kalintilar.filter(v=>s.unlocks.includes(v.id)).length/EKONOMI.gelisim.kalintiSet)*EKONOMI.gelisim.kalintiSetCan;
 for(const set of kanatSetDurumu(s)){if(set.ikiAcik)sum+=set.iki[stat]||0;if(set.dortAcik)sum+=set.dort[stat]||0;}
 return sum;
}
function unvanDurumu(s,id){
 const item=EKONOMI.unvanlar.find(v=>v.id===id);if(!item)return {ready:false,value:0,goal:1,text:'Unvan bulunamadı.',target:'map'};
 const metric=item.metric,value=metric==='stage'?Number(s.cleared.includes(item.goal)):metric==='cleared'?s.cleared.length:metric==='guild'?Number(s.guild):metric==='donated'?s.donated:s.stats[metric]||0,goal=metric==='stage'?1:item.goal;
 const labels={wins:'Zafer',hunts:'Tam av',arena:'Arena zaferi',cleared:'Bölüm',guild:'Loncaya katıl',donated:'Altın bağışı'};
 return {ready:value>=goal,value:Math.min(value,goal),goal,text:metric==='stage'?item.goal+' bölümünü tamamla.':labels[metric]+': '+value+' / '+goal,target:metric==='arena'?'arena':metric==='hunts'?'av':metric==='guild'||metric==='donated'?'guild':'map'};
}
function petYetenekleri(s,id){const item=EKONOMI.petler.find(v=>v.id===id),level=lvlOf(s,'pet',id);return [
 {name:item.ability,icon:['sifa','kabuk','goz','savustur'].includes(item.yetenek.tur)?'heart':'sword',level:0,text:petYetenekMetni(s,id)},
 {name:'Eğitim Gücü',icon:item.stat==='hp'?'heart':'sword',level:EKONOMI.gelisim.petYetenekSeviyeleri[1],text:(item.stat==='hp'?'Can':'Saldırı')+' +'+petValue(s,id,item.stat)},
 {name:'Destek Bağı',icon:'paw',level:EKONOMI.gelisim.petYetenekSeviyeleri[2],text:'Destek bonusu: %'+EKONOMI.gelisim.petDestek*100}
 ].map(skill=>({...skill,open:level>=skill.level}));}
function yumurtaAc(s){if(!spend(s,{eggs:EKONOMI.gelisim.yumurtaBedeli}))return false;const closed=EKONOMI.petler.filter(v=>!s.unlocks.includes(v.id));if(closed.length){const item=closed[gearRand(closed.length)];s.unlocks.push(item.id);return item.name;}give(s,{feed:1});return 'Yem';}
function enIyiKusan(s){for(const [slot] of gearSlots){const best=s.gear.filter(g=>g.slot===slot).sort((a,b)=>gearPower(b)-gearPower(a))[0];if(best)s.worn[slot]=best.id;}return true;}
function ucGelisimBedeli(g){const cost={};for(let plus=g.plus;plus<Math.min(g.plus+3,GEAR_MAX_PLUS);plus++)for(const [key,n] of Object.entries(gearUpCost({...g,plus})))cost[key]=(cost[key]||0)+n;return cost;}
function ucGelisim(s,id){const g=s.gear.find(v=>v.id===id);if(!g||g.plus>=GEAR_MAX_PLUS)return false;let changed=false;for(let i=0;i<3&&g.plus<GEAR_MAX_PLUS;i++){if(!spend(s,gearUpCost(g)))break;changed=true;if(gearRand(100)<gearUpChance(g))g.plus++;}return changed;}
function gelisimAktar(s,fromId,toId){const from=s.gear.find(g=>g.id===fromId),to=s.gear.find(g=>g.id===toId);if(!from||!to||from===to||from.slot!==to.slot||from.plus<=to.plus)return false;to.plus=from.plus;from.plus=0;return true;}


EKONOMI.basari={ilk:{gold:20,gems:1},demirci:{gold:30,ore:2},bolge:{gold:40,gems:2}};
function basarimlar(s){return [
 {id:'first',name:'İlk Zafer',icon:0,value:Math.min(1,s.stats.wins||0),goal:1,reward:EKONOMI.basari.ilk,target:'map'},
 {id:'forge',name:'Demirci Çırağı',icon:1,value:Number(s.gear.some(g=>g.plus>0)),goal:1,reward:EKONOMI.basari.demirci,target:'forge'},
 ...regions.map(([name],i)=>({id:'region-'+i,name:name+' Fatihi',icon:2,value:route.filter(n=>regionOf(n)===i&&s.cleared.includes(encounters[n].id)).length,goal:referenceRouteNodes(i).length,reward:EKONOMI.basari.bolge,target:'map'}))
 ].map(item=>({...item,done:item.value>=item.goal,claimed:s.achievementsTaken.includes(item.id)}));}
function gelisimKomut(s,action,d){
 if(action==='uiRelicOpen'){
  const item=EKONOMI.kalintilar.find(v=>v.id===d.id);if(!item||s.unlocks.includes(item.id)||!spend(s,item.cost))return false;
  s.unlocks.push(item.id);if(item.id==='muhur')s.relicActive=true;return true;
 }
 if(action==='uiCollectionUp')return koleksiyonYukselt(s,d.group,d.id);
 if(action==='uiBestWear')return enIyiKusan(s);
 if(action==='uiGearThree')return ucGelisim(s,d.id);
 if(action==='uiGearTransferDo')return gelisimAktar(s,d.from,d.id);
 if(action==='uiPetEgg')return yumurtaAc(s);
 if(action==='uiPetSupport'){if(!s.unlocks.includes(d.id)||petOf(s)===d.id||lvlOf(s,'pet',d.id)<EKONOMI.gelisim.petYetenekSeviyeleri[2])return false;s.supportPet=d.id;return true;}
 if(action==='uiIdleClaim')return bostaTopla(s)||false;
 if(action==='uiAchievementClaim'){const item=basarimlar(s).find(v=>v.id===d.id);if(!item||!item.done||item.claimed)return false;s.achievementsTaken.push(item.id);give(s,item.reward);return true;}
 if(action==='uiCharmUp'){const row=collections.charm.find(v=>v[0]===d.id),level=s.charmLevels[d.id]||0;if(!row||!s.unlocks.includes(d.id)||level>=EKONOMI.gelisim.tilsimSeviye||!spend(s,{ore:level+1,gold:25*(level+1)}))return false;s.charmLevels[d.id]=level+1;return true;}
 if(action==='uiNotification'){if(!Object.hasOwn(s.notificationSettings,d.key))return false;s.notificationSettings[d.key]=!s.notificationSettings[d.key];return true;}
 if(action==='uiAppearance'){if(d.group==='frame'&&['gold','silver','red'].includes(d.key))s.appearance.frame=d.key;else if(d.group==='portrait'&&['default','hero'].includes(d.key))s.appearance.portrait=d.key;else return false;return true;}
 if(action==='uiShowcase'){const item=basarimlar(s).find(v=>v.id===d.id);if(!item?.done)return false;const list=s.appearance.showcase;s.appearance.showcase=list.includes(d.id)?list.filter(v=>v!==d.id):[...list,d.id].slice(-3);return true;}
 return false;
}
async function gelisimAction(action,el){
 const d=el.dataset||{};
 if(action==='uiIdle'){
  const value=bostaGanimet(state);openModal('Boşta Ganimet',uiRewards({gold:value.gold,xp:value.xp,ore:value.ore})+'<p>'+Math.floor(value.sure/60000)+' dakika · En çok '+EKONOMI.bosta.enCokSaat+' saat</p>',tag('Topla','uiIdleClaim',value.hazir?'':'disabled','uiButton primary'));return true;
 }
 if(action==='uiGearTransfer'){
  const source=state.gear.find(g=>g.id===d.id),targets=source?state.gear.filter(g=>g.id!==source.id&&g.slot===source.slot&&g.plus<source.plus):[];
  openModal('Geliştirme Aktarımı',targets.length?'<p>Kaynak eşyanın geliştirmesi sıfırlanır.</p><div class="uiActions">'+targets.map(g=>tag(gearName(g)+' +'+g.plus,'uiGearTransferDo','data-from="'+source.id+'" data-id="'+g.id+'"','uiButton')).join('')+'</div>':uiEmpty('swap','Aktarıma uygun ekipman yok.'));return true;
 }
 if(!['uiRelicOpen','uiCollectionUp','uiBestWear','uiGearThree','uiGearTransferDo','uiPetEgg','uiPetSupport','uiIdleClaim','uiAchievementClaim','uiCharmUp','uiNotification','uiAppearance','uiShowcase'].includes(action))return false;
 if(modal.open)modal.close();await changeState(s=>gelisimKomut(s,action,d));return true;
}


// 13.11.2026 birleşimi: Grok'un bağımsız çanta korumaları, mevcut değerlerle.
function taslariIade(s,g){
 s.stones||={};
 for(const k of g.sockets||[])if(k&&stones[k])s.stones[k]=(s.stones[k]||0)+1;
}
function topluEsya(s,ids,mode){
 if(!Array.isArray(ids)||!ids.length||!['scrap','sell'].includes(mode))return false;
 const selected=[...new Set(ids)].map(id=>(s.gear||[]).find(g=>g.id===id));
 if(selected.some(g=>!g||s.worn?.[g.slot]===g.id))return false;
 const reward={};
 for(const g of selected){
  const gain=mode==='sell'?{gold:gearSellValue(g)}:ayristirmaOdulu(g);
  for(const [k,n] of Object.entries(gain))reward[k]=(reward[k]||0)+n;
  taslariIade(s,g);
 }
 s.gear=s.gear.filter(g=>!selected.includes(g));give(s,reward);
 return {count:selected.length,reward};
}
function petGoster(s,id,stat){
 const item=EKONOMI.petler.find(v=>v.id===id);
 return petValue(s,id,stat)+(item?.stat===stat?item.base:0);
}


// 13.11.2026 kullanıcı kararı: yalnız Market / Sandıklar.
// Fiyatlar geçici; var olan sandık ödülleri ve diğer mağazalar değiştirilmez.
EKONOMI.marketSandiklari=[
 {id:'daily',name:'Günlük Sandık',short:'Günlük',daily:true,cost:{gold:1}},
 {id:'traveler',name:'Yolcu Sandığı',short:'Yolcu',profile:'t1',cost:{gems:1}},
 {id:'hunter',name:'Avcı Sandığı',short:'Avcı',profile:'t2',cost:{gems:1}},
 {id:'guardian',name:'Muhafız Sandığı',short:'Muhafız',profile:'t3',cost:{gems:1}},
 {id:'knight',name:'Şövalye Sandığı',short:'Şövalye',profile:'t4',cost:{gems:1}},
 {id:'king',name:'Kral Sandığı',short:'Kral',profile:'t5',cost:{gems:1}},
 {id:'dragon',name:'Ejder Sandığı',short:'Ejder',profile:'t5',cost:{gems:1}},
 {id:'uber',name:'UBER Sandık',short:'UBER',profile:'uber',cost:{gems:1}},
 {id:'crystal',name:'Kristal Sandık',short:'Kristal',profile:'uber',cost:{gems:1}}
];
function marketSandikBedeli(item,count){
 return Object.fromEntries(Object.entries(item.cost).map(([key,value])=>[key,value*count]));
}
function marketSandikAc(s,id,count){
 const item=EKONOMI.marketSandiklari.find(v=>v.id===id);
 if(!item||!Number.isInteger(count)||count<1||count>20||s.fight)return false;
 const today=rewardDay(),row=item.daily?null:chestLine.find(v=>v[0]===item.profile);
 if(item.daily&&(count!==1||s.marketDailyChest===today))return false;
 if(!item.daily&&!row)return false;
 if(!spend(s,marketSandikBedeli(item,count)))return false;
 const items=[],reward={};
 if(item.daily){
  const r=EKONOMI.erzakSandigi;
  reward.gold=r.gold;reward.feed=r.feed;
  items.push(rollGear(s,campaignMastery(s)+1,r.sans));
  s.marketDailyChest=today;
 }else{
  const tier=campaignMastery(s)+1+Math.floor(chestLine.indexOf(row)*1.5);
  for(let n=0;n<count;n++)for(let i=0;i<row[3];i++){
   const g=rollGear(s,tier,row[4]);g.plus=row[5];items.push(g);
  }
  reward.eggs=(row[0]==='uber'?3:1)*count;
  reward.feather=(row[0]==='uber'?3:1)*count;
 }
 give(s,reward);
 return {name:item.name,items,reward,count};
}

// Kullanıcının 13.11.2026 referansı. Kilit yalnız seçimi korur; açmayı engellemez.
EKONOMI.marketSandiklari.forEach(item=>{item.locked=true;});
EKONOMI.marketUrunleri=[
 ['ore','Demir cevheri','Kaynak','gold'],['copper','Bakır','Kaynak','gold'],['silver','Gümüş','Kaynak','gold'],['wood','Odun','Kaynak','gold'],['leather','Deri','Kaynak','gold'],['cloth','Kumaş','Kaynak','gold'],
 ['feed','Yoldaş yemi','Kaynak','gold'],['health_potion','Can iksiri','İksir','gold'],['mana_potion','Mana iksiri','İksir','gold'],['whetstone','Bileme taşı','Geliştirme','gold'],['armor_polish','Zırh cilası','Geliştirme','gold'],['power_stone','Güç taşı','Geliştirme','gold'],
 ['chests','Erzak sandığı','Özel','gems'],['arena_ration','Arena erzağı','Özel','gems'],['magic_dust','Büyü tozu','Geliştirme','gems'],['ancient_key','Kadim anahtar','Özel','gems'],['rune_crystal','Rün kristali','Geliştirme','gems'],['holy_seal','Kutsal mühür','Özel','gems'],
 ['eggs','Yoldaş yumurtası','Özel','gems'],['luck_charm','Şans tılsımı','Özel','gems'],['protection_seal','Koruma mührü','Geliştirme','gems'],['enchant_scroll','Efsun parşömeni','Geliştirme','gems'],['light_essence','Işık özü','Geliştirme','gems'],['dragon_scale','Ejder pulu','Geliştirme','gems']
].map(([id,name,category,currency],index)=>({id,name,category,currency,index,cost:{[currency]:1},draft:true}));
function marketUrunBedeli(item,count){return {[item.currency]:count};}
function marketUrunAl(s,id,count){
 const item=EKONOMI.marketUrunleri.find(v=>v.id===id);
 if(!item||!Number.isSafeInteger(count)||count<1||count>999||s.fight)return false;
 if(!spend(s,marketUrunBedeli(item,count)))return false;
 // Referansta bir ürün alınır. Yeni malzemelere varsayımsal etki atanmaz.
 give(s,{[item.id]:count});return true;
}

// İkinci kademe Market taslakları. Stat, seviye, stok ve yenilenme dengesi eklenmez.
for(const [section,names] of [
 ['Arena',['Arena Kılıcı','Savaş Miğferi','Aslan Kalkanı','Arena Mızrağı','Savaş Eldiveni','Yakut Yüzük','Savaş Sancağı','Kraliyet Zırhı','Bileme Taşı','Büyü Parşömeni','Arena Madalyası','Şampiyon Kupası']],
 ['Lonca',['Demir Külçesi','Kadim Parşömen','Savaş İksiri','Lonca Mührü','Usta Rünü','Lonca Sancağı']]
])names.forEach((name,index)=>EKONOMI.marketUrunleri.push({id:'draft_'+(section==='Arena'?'arena':'guild')+'_'+index,name,index,section,currency:'gold',cost:{gold:1},draft:true}));


// 13.11.2026: kullanıcının devrettiği yerel Lonca görev kararı.
// Ödüller denge öncesi görev başına 1 jetondur; ilerleme gerçek işlemlerden gelir.
EKONOMI.loncaGorevleri=[
 {id:'donate',name:'Lonca Bağışı Yap',icon:'coin',daily:1,weekly:5,target:'guildLayoutContribution',reward:1},
 {id:'arena',name:'Arena Zaferi Kazan',icon:'sword',daily:1,weekly:5,target:'arena',reward:1},
 {id:'battle',name:'Lonca Savaşını Tamamla',icon:'flag',daily:1,weekly:5,target:'guildTaskWar',reward:1},
 {id:'hunt',name:'Tam Av Yap',icon:'paw',daily:1,weekly:10,target:'av',reward:1}
];
function loncaDonemi(period,day=rewardDay()){
 if(period==='daily')return day;
 const date=new Date(day+'T00:00:00Z');date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);return date.toISOString().slice(0,10);
}
function loncaDefteri(s,period='daily',now=Date.now()){
 const key=loncaDonemi(period,rewardDay(now));
 if(!s.guildTasks||typeof s.guildTasks!=='object'||Array.isArray(s.guildTasks))s.guildTasks={version:1};
 let book=s.guildTasks[period];
 if(!book||typeof book!=='object'||Array.isArray(book)||book.key!==key)book=s.guildTasks[period]={key,counts:{},claimed:{}};
 if(!book.counts||typeof book.counts!=='object'||Array.isArray(book.counts))book.counts={};
 if(!book.claimed||typeof book.claimed!=='object'||Array.isArray(book.claimed))book.claimed={};
 for(const task of EKONOMI.loncaGorevleri){const n=book.counts[task.id];book.counts[task.id]=Number.isSafeInteger(n)&&n>0?n:0;book.claimed[task.id]=book.claimed[task.id]===true;}
 return book;
}
function loncaIlerle(s,id,day=rewardDay()){
 if(!s.guild||!EKONOMI.loncaGorevleri.some(v=>v.id===id))return;
 for(const period of ['daily','weekly']){const b=loncaDefteri(s,period);if(b.key===loncaDonemi(period,day))b.counts[id]++;}
}
function loncaSavasKaydi(s,f){
 if(!s.guild||!['win','lose','timeout','draw'].includes(f.end))return;
 const kind=encounters[f.index]?.kind,day=f.date||rewardDay();
 if(kind==='arena'&&f.end==='win')loncaIlerle(s,'arena',day);
 if(isHunt(f.index)&&f.end==='win')loncaIlerle(s,'hunt',day);
 if(kind==='guildWar'||kind==='guildBoss')loncaIlerle(s,'battle',day);
}
function loncaGorevAl(s,period,id){
 if(!s.guild||s.fight||!['daily','weekly'].includes(period))return false;
 const task=EKONOMI.loncaGorevleri.find(v=>v.id===id);if(!task)return false;
 const b=loncaDefteri(s,period);if(b.claimed[id]||b.counts[id]<task[period])return false;
 b.claimed[id]=true;give(s,{guildCoin:task.reward});return true;
}
function loncayaKatil(s){if(s.guild)return false;s.guild=true;s.guildJoinedDay||=rewardDay();loncaDefteri(s);loncaDefteri(s,'weekly');return true;}
function loncaBagisYap(s){if(!s.guild||!spend(s,{gold:EKONOMI.lonca.bagis}))return false;s.donated+=EKONOMI.lonca.bagis;s.guildCoin+=EKONOMI.lonca.bagisJeton;loncaIlerle(s,'donate');return true;}

// Aynı ürün kimlikleri korunur; kategori eşlemesi satın alma kaydını değiştirmez.
EKONOMI.marketKategorileri=['Tümü','Ekipman','Malzeme','Özel'];
for(const item of EKONOMI.marketUrunleri.filter(v=>v.section)){
 const categories=item.section==='Arena'?['Ekipman','Ekipman','Ekipman','Ekipman','Ekipman','Ekipman','Özel','Ekipman','Malzeme','Malzeme','Özel','Özel']:['Malzeme','Malzeme','Malzeme','Özel','Malzeme','Özel'];
 item.category=categories[item.index];
}
