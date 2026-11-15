// levels.js — Veri-tabanlı çok-seviyeli sistem (Session 3A).
// Session 2'nin tek sabit seviyesi, `levels[]` dizisinin ilk elemanı olarak korundu.
// Tasarım (veri) ile motor (kod) ayrı: bu dosya SADECE saf veri + ortak sabitler içerir;
// çalışma-zamanı durumu (tetiklenme/çökme/hareket) entities.js buildRuntimeLevel ile üretir.
//
// Koordinat sistemi: dünya birimi = piksel. Y aşağı doğru artar (canvas standardı).
// Dünya yüksekliği sabit (WORLD.h). Bir seviyenin genişliği `worldW` ile değişir.
// Hero WORLD.h + pay kadar altına düşerse ölür.

export const WORLD = {
  h: 720, // görünür yükseklik; oyuncu bunun altına düşerse ölür
};

// Kahraman referans yüksekliği (px). Diğer asset ölçekleri bunun katı (assets.csv):
//   spike=0.6, door=2.0, spring=0.8, movingblock=1.0, fakeplatform=1.0.
export const HERO_H = 96;
export const HERO_W = 72; // hero.png 1:1 ama oyuncu gövdesi biraz dar çizilir

// assets.csv göreli ölçeklerinden türetilen piksel boyutları (hero=1.0).
export const SCALE = {
  spikeW: Math.round(0.6 * HERO_H),
  spikeH: Math.round(0.6 * HERO_H),
  doorW: Math.round(1.2 * HERO_H),
  doorH: Math.round(2.0 * HERO_H),
  springW: Math.round(0.8 * HERO_H),
  springH: Math.round(0.8 * HERO_H),
  blockW: Math.round(1.0 * HERO_H),
  blockH: Math.round(1.0 * HERO_H),
};

const G = WORLD.h - 64;   // zemin üst yüzeyi (geniş taban platformları buraya oturur)
const GH = 64;            // taban zemin kalınlığı

// Yardımcı: belirli bir x'te, yüzeyi y olan bir kapı (door=2.0*hero) üret.
function door(x, surfaceY) {
  return { x, y: surfaceY - SCALE.doorH, w: SCALE.doorW, h: SCALE.doorH };
}
// Yardımcı: bir platformun üstüne oturan diken (spike=0.6*hero).
function spikeOn(x, surfaceY) {
  return { x, y: surfaceY - SCALE.spikeH, w: SCALE.spikeW, h: SCALE.spikeH };
}

// ============================================================================
// SEVİYELER
// Her seviye şeması:
//   { name, worldW, spawn:{x,y}, solution, platforms[], fakePlatforms[],
//     springs[], movingBlocks[], spikes[], door }
// platforms: katı zeminler. ground:true → geniş taban (tile_ground ile çizilir);
//            ground yoksa "uçan platform" (trap_fakeplatform sprite — sahteyle aynı görünür).
// movingBlocks: {x,y,w,h, move:{dx,dy}, delay, speed} — tetiklenince move kadar kayar.
// ============================================================================

// Yay fabrikası kısayolu: pad üst yüzeyi surfaceY olan bir platformun üstüne yay oturt.
function springOn(x, surfaceY) {
  return { x, y: surfaceY - SCALE.springH, w: SCALE.springW, h: SCALE.springH };
}

// Zorluk eğrisi (§7.1/§7.2): L1-2 saf hareket; L3-5 her mekanik GÜVENLİ tanıtım;
// L6-10 kombinasyon + tırmanış. Her seviye kısa; her ölüm anında restart.
// Doğrulanmış fizik zarfı: zıplama ~184px yükseklik, ~280px yatay menzil;
// yay fırlatması ~430px (sağ basılı ~460px sağa süzülür); blok 0.45s sonra düşer.
export const levels = [
  // ========================================================================
  // L1 "Merhaba" — Hareketin temeli: yürü, zıpla, bir dikenin üstünden atla.
  // (Session 2'de tarayıcıda doğrulanmış geometri.)
  // ========================================================================
  {
    name: 'Merhaba',
    worldW: 2400,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'Sağa yürü; üç uçan platformu zıplayarak geç; 1080 platformundaki dikenin ' +
      'üstünden atla; yükselen basamağa çık; bitiş zeminindeki kapıya ulaş.',
    platforms: [
      { x: 0, y: G, w: 560, h: GH, ground: true },
      { x: 720, y: G - 96, w: 240, h: 32 },
      { x: 1080, y: G - 96, w: 320, h: 32 },
      { x: 1520, y: G - 176, w: 200, h: 32 },
      { x: 1820, y: G, w: 580, h: GH, ground: true },
    ],
    fakePlatforms: [], springs: [], movingBlocks: [],
    spikes: [spikeOn(1200, G - 96)],
    door: door(2180, G),
  },

  // ========================================================================
  // L2 "Tirman" — Saf platforming: 5 dar basamaklı yay-yukarı/aşağı kavis. Tuzak yok.
  // ========================================================================
  {
    name: 'Tirman',
    worldW: 2100,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'Beş dar basamağı (540/780/1020/1260/1500) sırayla zıplayarak geç — önce yukarı ' +
      'sonra aşağı kavis. Bitiş zeminine inip kapıya yürü. Tüm boşluklar ~90px, geçilebilir.',
    platforms: [
      { x: 0, y: G, w: 420, h: GH, ground: true },
      { x: 540, y: G - 76, w: 150, h: 32 },
      { x: 780, y: G - 116, w: 150, h: 32 },
      { x: 1020, y: G - 156, w: 150, h: 32 },
      { x: 1260, y: G - 116, w: 150, h: 32 },
      { x: 1500, y: G - 76, w: 150, h: 32 },
      { x: 1700, y: G, w: 400, h: GH, ground: true },
    ],
    fakePlatforms: [], springs: [], movingBlocks: [], spikes: [],
    door: door(1960, G),
  },

  // ========================================================================
  // L3 "Guvenme" — FAKE PLATFORM güvenli tanıtım: çöker ama altta yakalama platformu var.
  // (3A'da doğrulandı: 0.10s destek → çöker → y544 güvenli iniş, ölüm yok.)
  // ========================================================================
  {
    name: 'Guvenme',
    worldW: 1700,
    spawn: { x: 70, y: G - HERO_H },
    solution:
      'Cazip platforma (600) zıpla — ÇÖKER ve seni hemen altındaki gerçek yakalama ' +
      'platformuna (560) düşürür (ölmezsin). Oradan 960 basamağına zıpla, bitiş ' +
      'zeminindeki kapıya ulaş. Çöküş hissedilir ama her zaman geçilebilir.',
    platforms: [
      { x: 0, y: G, w: 440, h: GH, ground: true },
      { x: 560, y: 640, w: 300, h: 28 },              // yakalama platformu (fake'in altında)
      { x: 960, y: G - 96, w: 160, h: 32 },
      { x: 1180, y: G, w: 520, h: GH, ground: true },
    ],
    fakePlatforms: [{ x: 600, y: 540, w: 200, h: 32 }],
    springs: [], movingBlocks: [], spikes: [],
    door: door(1460, G),
  },

  // ========================================================================
  // L4 "Yaylan" — SPRING güvenli tanıtım: tek yay ile yüksek platforma fırla.
  // (3A'da doğrulandı: sağ basılı fırlatma x989,y204 ile 760 platformuna iner.)
  // ========================================================================
  {
    name: 'Yaylan',
    worldW: 1700,
    spawn: { x: 70, y: G - HERO_H },
    solution:
      'Başlangıç zemininden yay pedine (500) küçük bir zıplayışla in → yukarı fırlatılırsın. ' +
      'SAĞI basılı tut, yüksek platforma (760) süzül; oradan 1080 basamağına inip bitiş ' +
      'zeminindeki kapıya ulaş.',
    platforms: [
      { x: 0, y: G, w: 440, h: GH, ground: true },
      { x: 500, y: 600, w: 140, h: 32 },              // yay pedi
      { x: 760, y: 300, w: 280, h: 32 },              // fırlatma sonrası yüksek iniş
      { x: 1080, y: 440, w: 200, h: 32 },
      { x: 1320, y: G, w: 380, h: GH, ground: true },
    ],
    fakePlatforms: [],
    springs: [springOn(522, 600)],
    movingBlocks: [], spikes: [],
    door: door(1560, G),
  },

  // ========================================================================
  // L5 "Kaygan" — MOVING BLOCK güvenli tanıtım: bloğa bas, düşmeden sağa kaç.
  // (3A'da doğrulandı: 0.45s destek → düşer/boşluk açar, hero taşınmaz.)
  // ========================================================================
  {
    name: 'Kaygan',
    worldW: 1800,
    spawn: { x: 70, y: G - HERO_H },
    solution:
      'Hareketli bloğa (640) zıpla; 0.45s sonra düşmeye başlar, altında boşluk açılır. ' +
      'Blok düşmeden HIZLA sağdaki gerçek platforma (900) zıpla, oradan bitiş zeminindeki ' +
      'kapıya ulaş. Geç kalırsan boşluğa düşersin → tekrar dene.',
    platforms: [
      { x: 0, y: G, w: 480, h: GH, ground: true },
      { x: 900, y: G - 116, w: 240, h: 32 },          // kaçış platformu
      { x: 1240, y: G, w: 560, h: GH, ground: true },
    ],
    fakePlatforms: [], springs: [],
    movingBlocks: [
      { x: 640, y: G - 96, w: SCALE.blockW, h: SCALE.blockH, move: { dx: 0, dy: 360 }, delay: 0.45, speed: 240 },
    ],
    spikes: [],
    door: door(1520, G),
  },

  // ========================================================================
  // L6 "Sahte Yol" — FAKE zorlaştı: ardışık ÇİFT sahte. İki kez üst üste ihanet;
  // her biri altındaki yakalama platformuna düşürür (ölüm yok ama ritim/tempo gerek).
  // ========================================================================
  {
    name: 'Sahte Yol',
    worldW: 1680,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'İlk cazip platforma (520) zıpla — ÇÖKER, altındaki yakalama platformuna (640) ' +
      'düşersin. Oradan ikinci cazip platforma (840) zıpla — o da ÇÖKER, ikinci ' +
      'yakalama platformuna (640) düşersin. Sonra bitiş zeminine zıpla, kapıya ulaş. ' +
      'İki ihanet de yakalanır; hiç ölmeden geçilir ama tempoyu bulman gerek.',
    platforms: [
      { x: 0, y: G, w: 420, h: GH, ground: true },
      { x: 500, y: 640, w: 260, h: 28 },              // 1. yakalama (fake1 altında)
      { x: 820, y: 640, w: 260, h: 28 },              // 2. yakalama (fake2 altında)
      { x: 1140, y: G, w: 540, h: GH, ground: true },
    ],
    fakePlatforms: [
      { x: 520, y: 540, w: 160, h: 32 },              // 1. sahte
      { x: 840, y: 540, w: 160, h: 32 },              // 2. sahte
    ],
    springs: [], movingBlocks: [], spikes: [],
    door: door(1420, G),
  },

  // ========================================================================
  // L7 "Sek Sek" — SPRING + DİKEN: yay ile dikenli zemini aşıp yüksek platforma in.
  // ========================================================================
  {
    name: 'Sek Sek',
    worldW: 2150,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'Yay pedine (500) in → fırla. SAĞI basılı tut: aşağıdaki dikenli zemini aşıp ' +
      'yüksek platforma (760) konarsın. Oradan 1120 basamağına, sonra bitiş zeminindeki ' +
      'kapıya in. Sağı bırakırsan dikenlere düşersin.',
    platforms: [
      { x: 0, y: G, w: 440, h: GH, ground: true },
      { x: 500, y: 600, w: 140, h: 32 },              // yay pedi
      { x: 760, y: G, w: 520, h: GH, ground: true },  // ALÇAK dikenli zemin (tehdit)
      { x: 760, y: 300, w: 300, h: 32 },              // yüksek iniş platformu
      { x: 1120, y: 440, w: 200, h: 32 },
      { x: 1360, y: G, w: 790, h: GH, ground: true },
    ],
    fakePlatforms: [],
    springs: [springOn(522, 600)],
    movingBlocks: [],
    spikes: [spikeOn(820, G), spikeOn(940, G), spikeOn(1060, G)], // dikenli zemin
    door: door(1900, G),
  },

  // ========================================================================
  // L8 "Coken Kopru" — MOVING + FAKE kombinasyonu.
  // ========================================================================
  {
    name: 'Coken Kopru',
    worldW: 1950,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'Hareketli bloğa (600) zıpla, düşmeden gerçek 860 platformuna kaç. Sonra 1120 ' +
      'platformuna zıpla — o SAHTE, çöker ve altındaki yakalama platformuna (640) ' +
      'düşürür. Oradan bitiş zeminine zıpla, kapıya ulaş.',
    platforms: [
      { x: 0, y: G, w: 440, h: GH, ground: true },
      { x: 860, y: 540, w: 160, h: 32 },              // bloktan kaçış (gerçek)
      { x: 1100, y: 640, w: 240, h: 28 },             // yakalama (fake'in altında)
      { x: 1400, y: G, w: 550, h: GH, ground: true },
    ],
    fakePlatforms: [{ x: 1120, y: 540, w: 160, h: 32 }],
    springs: [],
    movingBlocks: [
      { x: 600, y: G - 96, w: SCALE.blockW, h: SCALE.blockH, move: { dx: 0, dy: 360 }, delay: 0.45, speed: 240 },
    ],
    spikes: [],
    door: door(1700, G),
  },

  // ========================================================================
  // L9 "Karisik" — SPRING → yüksek platform → MOVING block → kaçış. Üç mekanik zincir.
  // ========================================================================
  {
    name: 'Karisik',
    worldW: 2200,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'Yay pedine (460) in → fırla, SAĞI basılı tut, yüksek platforma (760) süzül. ' +
      '1080 basamağına zıpla, oradan hareketli bloğa (1280). Blok 0.4s sonra düşer — ' +
      'hızla 1480 kaçış platformuna atla, bitiş zeminine inip kapıya ulaş.',
    platforms: [
      { x: 0, y: G, w: 400, h: GH, ground: true },
      { x: 460, y: 600, w: 130, h: 32 },              // yay pedi
      { x: 760, y: 320, w: 260, h: 32 },              // yüksek iniş
      { x: 1080, y: 440, w: 150, h: 32 },
      { x: 1480, y: 500, w: 200, h: 32 },             // bloktan kaçış
      { x: 1720, y: G, w: 480, h: GH, ground: true },
    ],
    fakePlatforms: [],
    springs: [springOn(482, 600)],
    movingBlocks: [
      { x: 1280, y: 440, w: SCALE.blockW, h: SCALE.blockH, move: { dx: 0, dy: 300 }, delay: 0.4, speed: 240 },
    ],
    spikes: [],
    door: door(2060, G),
  },

  // ========================================================================
  // L10 "Final" — Doruk: hareket → yay → yüksek → moving block → kaçış → kapı.
  // ========================================================================
  {
    name: 'Final',
    worldW: 2600,
    spawn: { x: 80, y: G - HERO_H },
    solution:
      'İki basamağı (540/760) geç, yay pedine (980) in → fırla, SAĞI basılı tut, yüksek ' +
      'platforma (1260) süzül. 1560 basamağına zıpla, hareketli bloğa (1820) — düşmeden ' +
      '2080 kaçış platformuna atla, bitiş zeminine inip kapıya ulaş. Final!',
    platforms: [
      { x: 0, y: G, w: 420, h: GH, ground: true },
      { x: 540, y: 560, w: 140, h: 32 },
      { x: 760, y: 560, w: 140, h: 32 },
      { x: 980, y: 600, w: 150, h: 32 },              // yay pedi
      { x: 1260, y: 300, w: 280, h: 32 },             // yüksek iniş
      { x: 1560, y: 420, w: 150, h: 32 },
      { x: 2080, y: 520, w: 180, h: 32 },             // bloktan kaçış
      { x: 2320, y: G, w: 280, h: GH, ground: true },
    ],
    fakePlatforms: [],
    springs: [springOn(1002, 600)],
    movingBlocks: [
      { x: 1820, y: 420, w: SCALE.blockW, h: SCALE.blockH, move: { dx: 0, dy: 300 }, delay: 0.4, speed: 240 },
    ],
    spikes: [],
    door: door(2460, G),
  },
];
