// Encounter IDs 0–4 are part of the original save format.
const regions=[
 ['Köy','koy','Köy girişi','Baskın','Köprü Haracı','Haydut','Baskıncı','village','#889c99','#a9977c'],
 ['Orman','orman','Geyik izi','Dikenli patika','Diken Boynuz','Çalı kurdu','Yaban domuzu','wood','#738c7a','#79866a'],
 ['Maden','maden','Kuyu ağzı','Kırık raylar','Kazma Diş','Cevher kurdu','Taş bekçisi','mine','#798288','#827c70'],
 ['Bataklık','bataklik','Saz geçidi','Balçık çemberi','Çamur Diş','Batak tazısı','Saz gölgesi','marsh','#8a9980','#747c61'],
 ['Ada','ada','Sığ kıyı','Mercan burnu','Mercan Kıskaç','Kıyı varanı','Kıskaçlı','coast','#729ca3','#b8a78c'],
 ['Mantar','mantar','Spor bahçesi','Mor halka','Spor Çanı','Spor bekçisi','Küf kurdu','wood','#9990a1','#83728a'],
 ['Mezar','mezar','Taş merdiven','Lahit avlusu','Kefen Bekçisi','Kemik nöbetçi','Kefen gölgesi','ruin','#858491','#7a797b'],
 ['Çöl','col','Tuz yolu','Serap kuyusu','Kum Avcısı','Kum tazısı','Akrep muhafız','dune','#c9ac89','#c9a674'],
 ['Kale','kale','Dış sur','Sancak avlusu','Kapı Koçu','Zırhlı nöbetçi','Sancaktar','ruin','#93959b','#888475'],
 ['Buzul','buzul','Donmuş iz','Buz yarığı','Kırağı Pençe','Kar kurdu','Buz bekçisi','ice','#8db0bb','#b8c4bc'],
 ['Tapınak','tapinak','Tunç kapı','Yemin avlusu','Tunç Gaga','Taş kobra','Yeminli muhafız','ruin','#a09985','#a39677'],
 ['Kristal','kristal','Kuvars izi','Ayna oluğu','Prizma Güvesi Anaç','Cam kertenkele','Kuvars kabuk','ice','#a49eaf','#9895a9'],
 ['Yuva','yuva','Kovan eşiği','Petek odası','Tünel Dişi','İşçi böcek','Nöbetçi arı','mine','#aaa185','#9b875f'],
 ['Kule','kule','Çan merdiveni','Saat odası','Çan Nöbetçisi','Taş kanat','Kule çırağı','ruin','#8d96a2','#858896'],
 ['Volkan','volkan','Köz yatağı','Obsidyen sırtı','Köz Çene','Lav tazısı','Kül bekçisi','mine','#a78279','#92695b'],
 ['Rasat','rasat','Yıldız geçidi','Mercek damı','Mercek Gözcüsü','Gece kuşu','Mercek gözü','ruin','#7e8ba6','#7f849b'],
 ['Hiçlik','hiclik','Sessiz eşik','Kırık ufuk','Sessiz Yankı','Yüzsüz gölge','Eşik dokuyucu','ice','#82798c','#796f86']
];
const tactics=[
 ['Öfke','Yaralı düşman yarı canın altında 2 fazla hasar verir.'],
 ['Taş zırh','Düşman her vuruştan 2 hasar emer. Ağır darbeyi savununca zırhı 4 saniye kırılır.'],
 ['Onarım','Her canlı düşman 5 saniyede bir 4 can yeniler.'],
 ['Çifte vuruş','Ağır darbenin ardından bir saniye sonra ikinci bir tehdit gelir.']
];
stages[2].final=true; // Köy de bölge ustalığı verir (BRIDGE kopyası etkilenmez).
const route=[0,1,2],regionalBosses=[BRIDGE],allNames={},enemyInfo={};
function addEncounter(data){return encounters.push(data)-1;}
function makeEnemy(id,name,form,hp,strength,offset=0){
 allNames[id]=name;enemyInfo[id]={form,name};
 return {id,hp,normalDamage:strength,heavyDamage:strength*3,normal:[2,6,10,14,18,22,26].map(n=>ms(n+offset)),heavy:[5,12,19,26].map(n=>ms(n+offset))};
}
for(let r=1;r<regions.length;r++){
 const [region,key,first,group,boss,one,two]=regions[r],str=4+Math.floor(r/4);
 const tactic=(r-1)%tactics.length;
 const form=['beast','ward','shade'][(r-1)%3],form2=form==='ward'?'shade':'ward';
 const scout=makeEnemy(key+'_iz',one,form,190+r*17,str);
 const ally=makeEnemy(key+'_bekci',two,form2,115+r*12,str,2);
 const chief=makeEnemy(key+'_basi',boss,r%3===0?'shade':r%3===1?'beast':'ward',340+r*32,str+2);
 if(tactic===3)for(const foe of [scout,ally,chief])foe.heavy=foe.heavy.flatMap(t=>[t,t+1000]).filter(t=>t<=limit);
 for(let j=0;j<3;j++){
  const enemies=j===0?[scout]:j===1?[{...scout,hp:120+r*10},ally]:[chief];
  const index=addEncounter({kind:'campaign',region:r,tactic,id:(r+1)+'-'+(j+1),title:[first,group,boss][j],enemies,gold:55+r*7+j*15,xp:25+r*2+j*8,firstClearBonus:null,final:j===2});
  route.push(index);
 }
 regionalBosses.push(addEncounter({kind:'regional',region:r,tactic,id:'BÖLGE BOSSU',title:boss,enemies:[chief]}));
}
const duelModes=[
 ['arena','Kalkan Ustası','ward',185,5],['arena','Bozkır İz Sürücüsü','beast',285,6],['arena','Gece Muhafızı','shade',390,7],
 ['daily','Günün Muhafızı','ward',420,7],['world','Kızıl Ufuk Devi','ward',1300,8],
 ['guildBoss','Sancak Yiyen','beast',680,7],['guildWar','Kül Sancağı','shade',330,6]
];
const trials={};
duelModes.forEach(([kind,name,form,hp,str],i)=>{
 const key='trial_'+i,index=addEncounter({kind,id:({arena:'ARENA',daily:'GÜNLÜK BOSS',world:'DÜNYA BOSSU',guildBoss:'LONCA BOSSU',guildWar:'LONCA SAVAŞI'})[kind],title:name,enemies:[makeEnemy(key,name,form,hp,str,i%2)]});
 (trials[kind]||=[]).push(index);
});
function regionOf(index){return encounters[index]?.region||0;}
function routeName(i){return encounters[i].title||['Köy girişi','Baskın','Köprü Haracı','Değirmen yolu','Köprü Haracı'][i];}
function campaignMastery(s){return route.filter(i=>encounters[i].final&&s.cleared.includes(encounters[i].id)).length;}
const moneyNames={gold:'altın',ore:'cevher',gems:'elmas',crystals:'kristal',arenaCoin:'arena jetonu',guildCoin:'lonca jetonu',shards:'kalıntı parçası',chests:'sandık',feed:'yem',feather:'tüy',eggs:'yumurta',xp:'XP',auraEssence:'aura özü'};
function lootText(values){return Object.entries(values).filter(([k,v])=>moneyNames[k]&&v>0).map(([k,v])=>v+' '+moneyNames[k]).join(' · ');}
function give(s,values){for(const [k,n] of Object.entries(values))s[k]=(s[k]||0)+n;}
function afford(s,cost){if(!cost||Object.entries(cost).some(([k,v])=>!Object.hasOwn(moneyNames,k)||!Number.isFinite(v)||v<0))return false;return developerFree(s)||Object.entries(cost).every(([k,v])=>(s[k]||0)>=v);}
function spend(s,cost){if(!afford(s,cost))return false;if(!developerFree(s))for(const [k,v] of Object.entries(cost))s[k]=(s[k]||0)-v;return true;}
function dayBook(s){
 const today=rewardDay();if(s.book?.date!==today)s.book={date:today,used:{},wins:0,hunts:0,arenaWins:0,flags:{},casino:0};
 return s.book;
}
// crystals (moneyNames, baseGrowth) ve goods.gems ESKİ: kristal kaldırıldı, bakiye hep 0. Ekranlar bırakınca silinecek.
const goods={
 ore:{name:'Demir cevheri',cost:{gold:30},gain:{ore:1}},
 chest:{name:'Erzak sandığı',cost:{gems:2},gain:{chests:1}},
 ration:{name:'Yoldaş yemi',cost:{gold:35},gain:{feed:1}},
 gems:{name:'Kristal takası',cost:{crystals:2},gain:{gems:1}},
 arena:{name:'Arena erzağı',cost:{arenaCoin:2},gain:{chests:1}},
 guild:{name:'Lonca ikmali',cost:{guildCoin:2},gain:{ore:2,feed:1}}
};
// Geçici Market bedelleri; ödül miktarları korunur.
for(const item of Object.values(goods))item.cost={[(item.cost.gems||item.cost.crystals)?'gems':'gold']:1};
const collections={...Object.fromEntries(Object.entries(gelisimKataloglari()).filter(([key])=>key!=='relic').map(([key,list])=>[key,list.map(item=>[item.id,item.name,koleksiyonAciklamasi(item),item.cost||{}])])),charm:[['tas','Taş Gözü','İlk ağır darbe savunmasında 4 can yeniler.',{ore:3,gold:40}],['av','Av Mührü','Tam avdan 1 ek cevher.',{arenaCoin:2}]]};

function titleReady(s,key){return unvanDurumu(s,key).ready;}

function baseGrowth(){return {gems:0,crystals:0,arenaCoin:0,guildCoin:0,chests:0,feed:0,training:0,guild:false,donated:0,book:null,gameRound:null,gameResult:null,mailTaken:false,unlocks:['ak'],slots:{pet:'ak'},gear:[],worn:{},stones:{},petLevel:{},petStar:{},wingLevel:{},wingPhase:{},wingRunes:{},feather:0,eggs:0,stats:{},bestTimes:{},dailyBossDays:{},log:[]};}
function bonusAttack(s){return campaignMastery(s)*2+koleksiyonBonusu(s,'atk');}

function extraHealth(s){return campaignMastery(s)*3+koleksiyonBonusu(s,'hp');}

function allowed(index,s){
 const e=encounters[index];if(!e)return false;
 if(index===HUNT)return true;
 if(index===BRIDGE)return s.cleared.includes('1-3');
 if(e.kind==='hunt')return s.cleared.includes((e.region+1)+'-1');
 if(e.kind==='regional')return s.cleared.includes((e.region+1)+'-3')&&(!e.rank||s.bestTimes[e.previous]!=null||(e.previous===BRIDGE&&!!s.bossPaidDay));
 if(e.kind==='guildBoss'||e.kind==='guildWar')return s.guild;
 if(trials[e.kind])return true;
 const pos=route.indexOf(index);return pos===0||pos>0&&s.cleared.includes(encounters[route[pos-1]].id);
}
const quotas=EKONOMI.gunlukHak;
// Giriş: kilit açık olmalı ve günlük hak kalmalı. Sebep metni: girisNedeni().
function admit(s,index){
 if(girisNedeni(s,index))return false;
 const tur=hakTuru(index);
 if(tur&&!developerFree(s)){const book=dayBook(s);if((book.used[tur]||0)>=quotas[tur])return false;book.used[tur]=(book.used[tur]||0)+1;}
 return true;
}
function recordOutcome(s,f,receipt){
 const e=encounters[f.index],kind=e.kind,win=f.end==='win',book=dayBook(s),sameDay=!f.date||book.date===f.date;
 const damage=e.enemies.reduce((sum,en,i)=>sum+Math.max(0,en.hp-f.enemyHp[i]),0);
 const loot={};let note='';
 if(win){s.stats.wins=(s.stats.wins||0)+1;if(sameDay)book.wins++;}
 if(isHunt(f.index)&&win){s.stats.hunts=(s.stats.hunts||0)+1;if(sameDay)book.hunts++;if(s.slots.charm==='av')loot.ore=1;}
 const E=EKONOMI,sefer=(!kind||kind==='campaign')&&!isHunt(f.index)&&f.index!==BRIDGE;
 if(sefer&&win&&receipt.first){loot.gems=E.ilkGecis.gems;if(e.final){loot.chests=E.ilkGecis.bolgeSonuSandik;note='Bölge ustalığı · +2 saldırı, +3 can';}}
 if(kind==='regional'&&win){
  const day=rewardDay();if(s.dailyBossDays[regionalKey(e)]===day)loot.gold=E.bolgeBossu.tekrar.gold;
  else{loot.shards=E.bolgeBossu.ilk.shards;s.dailyBossDays[regionalKey(e)]=day;}
 }
 if(kind==='arena'){
  const change=win?E.arena.zafer:f.end==='draw'?0:E.arena.yenilgi;s.stats.rating=Math.max(0,(s.stats.rating||0)+change);
  note='Antrenman puanı '+s.stats.rating;
  if(win){s.stats.arena=(s.stats.arena||0)+1;if(sameDay&&book.arenaWins++<E.arena.jetonluZafer)loot.arenaCoin=E.arena.jeton;}
 }
 if(kind==='daily'&&f.end!=='exit'){
  const ratio=damage/e.enemies[0].hp,kademe=E.gunlukBossElmas.find(([oran])=>ratio>=oran);if(kademe)loot.gems=kademe[1];
 }
 if(kind==='world'&&f.end!=='exit'&&damage){s.stats.world=Math.max(s.stats.world||0,damage);loot.shards=E.dunyaBossu.shards;note=damage+' hasar · kişisel rekor '+s.stats.world;}
 if(kind==='guildBoss'&&damage&&f.end!=='exit'){loot.guildCoin=win?E.lonca.bossZafer:E.lonca.bossHasar;s.stats.guildDamage=(s.stats.guildDamage||0)+damage;}
 if(kind==='guildWar'&&f.end!=='exit'){loot.guildCoin=win?E.lonca.savasZafer:E.lonca.savasKatilim;s.stats.guildScore=(s.stats.guildScore||0)+(win?E.lonca.savasPuan:0);}
 if(win){const key=String(f.index);s.bestTimes[key]=Math.min(s.bestTimes[key]??Infinity,f.at);}
 loncaSavasKaydi(s,f);
 give(s,loot);receipt.extra=loot;receipt.note=note;gearDrops(s,f,receipt);
 s.log=[{title:routeName(f.index),end:f.end,at:f.at,day:rewardDay()},...s.log].slice(0,12);
}

const regionRoster=[
 [["Köprü Haracı", "Kırık Mızrak", "Değirmen Devi", "Çete Reisi", "Sürgün Beyi"], []],
 [["Diken Boynuz", "Kızıl Pençe", "Kovuk Muhafızı", "Kök Ana", "Orman Atası"], [["mob_orman_yaban_domuzu", "Yaban domuzu"], ["mob_orman_kurt", "Kurt"], ["mob_orman_diken_bocek", "Diken böceği"]]],
 [["Kazma Diş", "Cevher Böceği", "Pas Ustası", "Kör Delici", "Demir Omurga"], [["mob_maden_kok_yarasa", "Kök yarasası"], ["mob_maden_tas_kene", "Taş kenesi"], ["mob_maden_cevher_kurdu", "Cevher kurdu"]]],
 [["Çamur Diş", "Batak Cadısı", "Kök Boğan", "Saz Ejderi", "Turba Devi"], [["mob_bataklik_suluk", "Sülük"], ["mob_bataklik_kurbaga", "Kurbağa"], ["mob_bataklik_saz_yilani", "Saz yılanı"]]],
 [["Mercan Kıskaç", "Tuz Basiliski", "Kırık Gemi Bekçisi", "Fırtına Varanı", "Gelgit Hükümdarı"], [["mob_ada_yengec", "Yengeç"], ["mob_ada_marti", "Martı"], ["mob_ada_varan", "Varan"]]],
 [["Spor Çanı", "Kök Miseli", "Mor Şapka", "Küf Çobanı", "Derin Ağ"], [["mob_mantar_spor_perisi", "Spor perisi"], ["mob_mantar_sap_bocek", "Şap böceği"], ["mob_mantar_kuf_kurdu", "Küf kurdu"]]],
 [["Kefen Bekçisi", "Kemik Ozan", "Lahit Muhafızı", "Kül Dul", "İsimsiz Kral"], [["mob_mezar_iskelet", "İskelet"], ["mob_mezar_mezar_guvesi", "Mezar güvesi"], ["mob_mezar_kefen_golge", "Kefen gölgesi"]]],
 [["Kum Avcısı", "Akrep Hanı", "Serap Bekçisi", "Tuz Yılanı", "Gömülü Hükümdar"], [["mob_col_akrep", "Akrep"], ["mob_col_kum_engeregi", "Kum engereği"], ["mob_col_cakal", "Çakal"]]],
 [["Kapı Koçu", "Siper Ağası", "Zincir Muhafızı", "Kara Sancak", "Kale Beyi"], [["mob_kale_piyade", "Piyade"], ["mob_kale_zirhli_kopek", "Zırhlı köpek"], ["mob_kale_sancaktar", "Sancaktar"]]],
 [["Kırağı Pençe", "Çığ Koçu", "Donmuş Nöbetçi", "Cam Diş", "Buzul Anası"], [["mob_buzul_kar_kurdu", "Kar kurdu"], ["mob_buzul_buz_yarasa", "Buz yarasası"], ["mob_buzul_fok", "Fok"]]],
 [["Tunç Gaga", "Yemin Bekçisi", "Mühür Kobra", "Çifte Muhafız", "Taş Kâhin"], [["mob_tapinak_tas_kobra", "Taş kobra"], ["mob_tapinak_yeminli_nobetci", "Yeminli nöbetçi"], ["mob_tapinak_tunc_kus", "Tunç kuş"]]],
 [["Prizma Güvesi Anaç", "Kuvars Gözcü", "Çatlak Golem", "Ayna İkizi", "Billur Taht"], [["mob_kristal_prizma_guvesi", "Prizma güvesi"], ["mob_kristal_cam_kertenkele", "Cam kertenkele"], ["mob_kristal_kuvars_bocek", "Kuvars böceği"]]],
 [["Tünel Dişi", "Kanatlı Anaç", "Zırhlı İşçi", "Peteğin Gözü", "Yuva Kraliçesi"], [["mob_yuva_larva", "Larva"], ["mob_yuva_isci_bocek", "İşçi böcek"], ["mob_yuva_nobetci_ari", "Nöbetçi arı"]]],
 [["Çan Nöbetçisi", "Basamak Avcısı", "Taş Kanat", "Saat Ustası", "Kule Naibi"], [["mob_kule_cirak", "Çırak"], ["mob_kule_gargoyl", "Gargoyl"], ["mob_kule_kule_kargasi", "Kule kargası"]]],
 [["Köz Çene", "Lav Tazısı", "Kül Taşıyıcı", "Obsidyen Boynuz", "Krater Kalbi"], [["mob_volkan_kor_kertenkele", "Kor kertenkelesi"], ["mob_volkan_is_guvesi", "İs güvesi"], ["mob_volkan_lav_kopek", "Lav köpeği"]]],
 [["Mercek Gözcüsü", "Çatı Kanadı", "Yörünge Bekçisi", "Ay Hesapçısı", "Son Göz"], [["mob_rasat_gece_kusu", "Gece kuşu"], ["mob_rasat_mercek_goz", "Mercek gözü"], ["mob_rasat_gok_guvesi", "Gök güvesi"]]],
 [["Sessiz Yankı", "Boşluk Dokumacı", "Yüzsüz Nöbetçi", "Kırık İkiz", "Eşik Yutan"], [["mob_hiclik_golge", "Gölge"], ["mob_hiclik_yankici", "Yankıcı"], ["mob_hiclik_bosluk_guvesi", "Boşluk güvesi"]]]
];

// Append encounters after the existing IDs so suspended fights still resolve correctly.
const huntingGrounds=[HUNT],bossLadders=[];
for(const [region,[names,prey]] of regionRoster.entries()){
 const zone=regions[region],primary=regionalBosses[region],base=encounters[primary].enemies[0];
 const ladder=[primary];
 for(let rank=1;rank<names.length;rank++){
  const tactic=(region+rank-1)%tactics.length;
  const boss=makeEnemy('boss_'+zone[1]+'_'+(rank+1),names[rank],['ward','beast','shade'][(region+rank)%3],
   Math.round(base.hp*(1+.06*rank)),Math.min(10,5+Math.floor(region/4)+Math.floor(rank/2)),rank%2);
  if(tactic===3)boss.heavy=boss.heavy.flatMap(t=>[t,t+1000]).filter(t=>t<=limit);
  ladder.push(addEncounter({id:'BÖLGE BOSSU',kind:'regional',region,rank,tactic,title:names[rank],previous:ladder[rank-1],enemies:[boss]}));
 }
 bossLadders.push(ladder);
 if(region){
  const enemies=prey.map(([id,name],j)=>makeEnemy(id,name,['beast','shade','ward'][j],90+region*8+j*8,3+Math.floor(region/7),j));
  enemies[0].heavy=[];enemies[1].heavy=[];
  huntingGrounds.push(addEncounter({id:'AV',kind:'hunt',region,title:zone[0]+' avı',enemies}));
 }
}
function isHunt(i){return i===HUNT||encounters[i]?.kind==='hunt';}
function regionalKey(e){return e.rank?e.region+':'+e.rank:e.id+e.region;}
