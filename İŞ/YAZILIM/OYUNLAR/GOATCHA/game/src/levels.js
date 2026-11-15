// levels.js — Motor v2 seviye verisi + bileşen fabrikaları + ortak sabitler.
//
// SESSION 9: level_tasarimlari.md'deki 12 final seviye, S8 motoru + v2 bileşen
// şemasıyla yazıldı. Her seviye konsept/çözüm/trol etkisine sadık; her birinin
// `solution` alanı çözüm yolunu (geçilebilirlik kanıtı) yazar.
//
// Bileşen modeli (mimari-v2.md §S1): Entity =
//   { id?, tags?, transform:{x,y,w,h}, visual?, collision?, hazard?, trigger?, dynamic? }
//   decorative = visual≠null && collision==null && hazard==null   (L4 plastik diken, L12 süs)
//   invisible  = visual==null && (collision≠null || hazard≠null)  (L3 köprü, L11 kapı)
//
// NOT: v2 aktör görselleri (gaz/spike/blok/buton) henüz placeholder — render renk-kodlu
// dikdörtgen çizer. Gerçek pixel-art assetler gelince ASSET_SRC + sprite adlarına bağlanır.
//
// Koordinat: dünya birimi = piksel, Y aşağı artar. Hero WORLD.h + pay altına düşerse ölür.

export const WORLD = { h: 720 };
export const HERO_H = 96;
export const HERO_W = 72;

export const SCALE = {
  spikeW: Math.round(0.6 * HERO_H),  // 58
  spikeH: Math.round(0.6 * HERO_H),
  doorW: Math.round(1.2 * HERO_H),   // 115
  doorH: Math.round(2.0 * HERO_H),   // 192
  blockW: Math.round(1.4 * HERO_H),  // 134
  blockH: Math.round(0.4 * HERO_H),  // 38
};

export const G = WORLD.h - 64;   // 656 — zemin üst yüzeyi
export const GH = 64;            // taban zemin kalınlığı
const SPAWN_Y = G - HERO_H;      // 560 — zeminde duran hero'nun y'si

// ============================================================================
// BİLEŞEN FABRİKALARI (Entity üretir — seviye yazımı kısa kalsın)
// ============================================================================
export function groundFloor(x, w, surfaceY = G) {
  return { tags: ['ground'], transform: { x, y: surfaceY, w, h: GH },
    visual: { sprite: 'ground', layer: 0 }, collision: { solid: true } };
}
export function platform(x, y, w, h, opts = {}) {
  return { id: opts.id, tags: ['platform', ...(opts.tags || [])],
    transform: { x, y, w, h },
    visual: opts.invisible ? null : { sprite: 'ground', layer: 0 },
    collision: { solid: true } };
}
// Sahte platform (L4): normal zemin gibi görünür, basınca çöker (driver:'collapse').
export function fakePlatform(x, y, w, h, opts = {}) {
  return { id: opts.id, tags: ['fake', ...(opts.tags || [])],
    transform: { x, y, w, h },
    visual: { sprite: 'ground', layer: 0 },
    collision: { solid: true },
    dynamic: { driver: 'collapse', delay: opts.delay != null ? opts.delay : 0.18 } };
}
export function invisibleSolid(x, y, w, h, opts = {}) {
  return { id: opts.id, tags: ['invisible', ...(opts.tags || [])],
    transform: { x, y, w, h }, visual: null, collision: { solid: true } };
}
export function spike(x, surfaceY = G, opts = {}) {
  const w = SCALE.spikeW, h = SCALE.spikeH;
  return { id: opts.id, tags: ['spike', ...(opts.tags || [])],
    transform: { x, y: surfaceY - h, w, h },
    visual: opts.invisible ? null : { sprite: 'spike', layer: 1 },
    hazard: { lethal: true, from: 'any' } };
}
// Tavan dikeni (yukarı fırlayan oyuncuyu öldürür → from:'bottom'). L3/L7.
export function ceilingSpike(x, ceilingY, opts = {}) {
  const w = SCALE.spikeW, h = SCALE.spikeH;
  return { id: opts.id, tags: ['spike', 'ceiling', ...(opts.tags || [])],
    transform: { x, y: ceilingY, w, h },
    visual: opts.invisible ? null : { sprite: 'ceiling_spike', layer: 1 },
    hazard: { lethal: true, from: 'bottom' } };
}
// Havadaki küçük görünmez diken (L12) — her yönden öldürür.
export function invisibleHazard(x, y, w, h, opts = {}) {
  return { id: opts.id, tags: ['spike', ...(opts.tags || [])],
    transform: { x, y, w, h }, visual: null, hazard: { lethal: true, from: opts.from || 'any' } };
}
// Dekoratif (görsel VAR, hitbox YOK): L4 plastik diken, L10 yem blok, L12 süs tuzak.
export function decorative(sprite, x, y, w, h, opts = {}) {
  return { id: opts.id, tags: ['decorative', ...(opts.tags || [])],
    transform: { x, y, w, h }, visual: { sprite, layer: opts.layer != null ? opts.layer : 1 } };
}
export function door(x, surfaceY = G, opts = {}) {
  return { id: opts.id, tags: ['door', ...(opts.tags || [])],
    transform: { x, y: surfaceY - SCALE.doorH, w: SCALE.doorW, h: SCALE.doorH },
    visual: opts.invisible ? null : { sprite: 'door', layer: 1 },
    _isGoal: true,
    dynamic: opts.scripted ? { driver: 'script' } : null };
}
export function zone(rect, handlers, opts = {}) {
  return { id: opts.id, tags: [...(opts.tags || [])],
    transform: { x: rect.x, y: rect.y, w: rect.w, h: rect.h },
    visual: opts.visual ? { sprite: opts.visual, layer: opts.layer != null ? opts.layer : 1 } : null,
    trigger: handlers };
}
// Basılabilir buton (L2): zemine oturan kısa tetik bölgesi + görsel.
export function button(id, x, handlers, opts = {}) {
  const w = opts.w || 96, h = opts.h || 54;
  return { id, tags: ['button'], transform: { x, y: G - h, w, h },
    visual: { sprite: opts.visual || 'btn', layer: 1 }, trigger: handlers };
}
export function movingBlock(x, y, motion, opts = {}) {
  const w = opts.w != null ? opts.w : SCALE.blockW, h = opts.h != null ? opts.h : SCALE.blockH;
  return { id: opts.id, tags: ['block', ...(opts.tags || [])],
    transform: { x, y, w, h },
    visual: opts.invisible ? null : { sprite: opts.sprite || 'movingblock', layer: 1 },
    collision: { solid: true },
    dynamic: { driver: 'auto', carry: opts.carry !== false, motion } };
}
export function launcher(x, y, opts = {}) {
  const w = opts.w != null ? opts.w : SCALE.blockW, h = opts.h != null ? opts.h : SCALE.blockH;
  return { id: opts.id, tags: ['block', 'launcher', ...(opts.tags || [])],
    transform: { x, y, w, h },
    visual: opts.invisible ? null : { sprite: 'ground', layer: 1 },
    collision: { solid: true },
    dynamic: { driver: 'script', carry: true } };
}

// ============================================================================
// 12 FINAL SEVİYE (level_tasarimlari.md'ye sadık)
// ============================================================================
export const levels = [

  // ── L1 — "Utangaç Kapı" ────────────────────────────────────────────────
  // Kapı yaklaşınca kaçar; 5 sn hareketsiz dur → kapı gelir → biter. Çözüm: SABIR.
  {
    name: 'Utangaç Kapı', worldW: 1700,
    spawn: { x: 140, y: SPAWN_Y },
    solution: 'Kapıyı kovalama (kaçar). 5 sn hiç hareket etme → kapı gelir, temas → win.',
    entities: [ groundFloor(0, 1700), door(1000, G, { id: 'door', scripted: true }) ],
    script: {
      state: { calling: false },
      onUpdate(ctx, dt) {
        const d = ctx.entity('door'), h = ctx.hero; if (!d) return;
        if (Math.abs(h.vx) > 25) ctx.state.calling = false;
        if (ctx.state.calling) return;
        const dist = (d.transform.x + d.transform.w / 2) - (h.x + h.w / 2);
        if (Math.abs(dist) < 380) {
          let nx = d.transform.x + Math.sign(dist || 1) * 210 * dt;
          nx = Math.max(0, Math.min(nx, 1700 - d.transform.w));
          d.transform.x = nx;
        }
      },
      onPlayerIdle(ctx, t) {
        if (t < 5) return;
        ctx.state.calling = true;
        const d = ctx.entity('door'), h = ctx.hero; if (!d) return;
        const dx = (h.x + h.w / 2) - (d.transform.x + d.transform.w / 2);
        ctx.nudge('door', Math.sign(dx || -1) * 300 * (1 / 120), 0);
      },
    },
  },

  // ── L2 — "Ters Psikoloji" ──────────────────────────────────────────────
  // Kapı zaten erişilir. "BAS" butonu cazip. Basılırsa tavandan giyotin düşer (ölüm).
  // Çözüm: butona BASMA — üzerinden zıplayıp kapıya git.
  {
    name: 'Ters Psikoloji', worldW: 1500,
    spawn: { x: 100, y: SPAWN_Y },
    solution: 'Butona basma; buton bölgesinin üstünden zıpla (zone kısa, jump apex temizler), kapıya yürü.',
    entities: [
      groundFloor(0, 1500),
      button('btn', 700, {
        onEnter: (ctx) => {
          if (ctx.state.pressed) return;
          ctx.state.pressed = true;
          ctx.startMotion('guillotine', { move: [0, 1], speed: 1500, range: 700, mode: 'oneway' });
        },
      }, { visual: 'btn' }),
      // Tavandan düşecek giyotin (başta yukarıda, script ile düşer) — ölümcül.
      { id: 'guillotine', tags: ['block'], transform: { x: 660, y: -200, w: 170, h: 170 },
        visual: { sprite: 'spike', layer: 2 }, hazard: { lethal: true, from: 'any' },
        dynamic: { driver: 'script' } },
      door(1300, G),
    ],
    script: { state: { pressed: false } },
  },

  // ── L3 — "Görünmez Güvenlik" ───────────────────────────────────────────
  // Uçurum üstünde GÖRÜNMEZ köprü. Başında yay (tuzak): basan yukarı fırlayıp gizli
  // tavan dikenine çarpar. Çözüm: yaya basma — üstünden zıpla, görünmez köprüde yürü.
  {
    name: 'Görünmez Güvenlik', worldW: 1500,
    spawn: { x: 100, y: SPAWN_Y },
    solution: 'Yay pad\'ine (x560-650) BASMA — üstünden zıpla; karşıda görünmez köprü (560-1040) seni taşır; kapıya yürü.',
    entities: [
      groundFloor(0, 560),
      invisibleSolid(560, G, 480, GH),          // görünmez köprü (uçurum üstü)
      groundFloor(1040, 460),
      // Yay tuzağı: üstüne basınca yukarı fırlatır (descending/standing iken)
      zone({ x: 560, y: G - 50, w: 95, h: 50 }, {
        onEnter: (ctx) => { if (ctx.hero.vy >= -10) ctx.launchHero(1500); },
      }, { visual: 'spring', tags: ['spring'] }),
      // Gizli tavan dikenleri (görünmez, yukarıdan öldürür) — fırlama apex'inde
      ceilingSpike(560, 150, { invisible: true }),
      ceilingSpike(620, 150, { invisible: true }),
      ceilingSpike(680, 150, { invisible: true }),
      door(1380, G),
    ],
  },

  // ── L4 — "Güvenli Dikenler" ────────────────────────────────────────────
  // Korkutucu dikenler DEKORATİF (hitbox yok). "Temiz" zemin taşları SAHTE (çöker → boşluk).
  // Çözüm: temiz taşlara basma; gerçek zemin (üstünde dekor diken olan) segmentlere zıpla.
  {
    name: 'Güvenli Dikenler', worldW: 1620,
    spawn: { x: 60, y: SPAWN_Y },
    solution: 'Sahte temiz taşlar (260-460,660-860,1060-1260) çöker → onlara BASMA. Dekoratif dikenli gerçek zemine (460,860) zıpla: 260→460→860→1260→kapı.',
    entities: [
      groundFloor(0, 260),
      fakePlatform(260, G, 200, GH),                     // çöker (boşluk)
      groundFloor(460, 200),                             // gerçek zemin (güvenli)
      decorative('spike', 470, G - 58, 58, 58), decorative('spike', 540, G - 58, 58, 58),
      fakePlatform(660, G, 200, GH),
      groundFloor(860, 200),
      decorative('spike', 870, G - 58, 58, 58), decorative('spike', 940, G - 58, 58, 58),
      fakePlatform(1060, G, 200, GH),
      groundFloor(1260, 360),
      decorative('spike', 1290, G - 58, 58, 58),
      door(1480, G),
    ],
  },

  // ── L5 — "Bozuk Klavye" ────────────────────────────────────────────────
  // Gaz/radyasyon alanına girince sol/sağ kontrol TERS döner. Çözüm: ters kontrolle dikenleri geç.
  {
    name: 'Bozuk Klavye', worldW: 1800,
    spawn: { x: 80, y: SPAWN_Y },
    solution: 'Gaz alanına (640-1040) girince kontroller ters döner; ters kontrolle iki dikeni geç, alandan çıkınca düzelir, kapıya ulaş.',
    entities: [
      groundFloor(0, 1800),
      zone({ x: 640, y: G - 320, w: 400, h: 320 }, {
        onEnter: (ctx) => { ctx.setInputInvert(true); ctx.setBanner('TERS KONTROL!', 'alandan çıkınca düzelir'); },
        onExit: (ctx) => { ctx.setInputInvert(false); ctx.clearBanner(); },
      }, { visual: 'fx_gas', tags: ['gas'] }),
      spike(1180, G), spike(1320, G),
      door(1640, G),
    ],
  },

  // ── L6 — "Sahte Zafer" ─────────────────────────────────────────────────
  // Kolay "kapı" → "BÖLÜM GEÇİLDİ!" YALANI belirir ama geçmez; tavandan blok düşer.
  // Gerçek kapı sağdaki duvarın arkasında. Çözüm: yalana kanma, sağa kaç, duvarı aş.
  {
    name: 'Sahte Zafer', worldW: 1700,
    spawn: { x: 100, y: SPAWN_Y },
    solution: 'Sahte kapıya (x700) değince banner yalanı + düşen blok başlar — DURMA, sağa koş, duvarı (x1100,h120) zıplayarak aş, gerçek kapıya (x1340) git.',
    entities: [
      groundFloor(0, 1700),
      // Sahte kapı: 'door' tag'li ama _isGoal:false → onDoorReach yalanı tetikler
      { id: 'fakedoor', tags: ['door'], transform: { x: 700, y: G - SCALE.doorH, w: SCALE.doorW, h: SCALE.doorH },
        visual: { sprite: 'door', layer: 1 }, _isGoal: false },
      // Sahte kapıdan sonra düşen ezici (script ile başlar)
      { id: 'crusher', tags: ['block'], transform: { x: 660, y: -220, w: 200, h: 200 },
        visual: { sprite: 'spike', layer: 2 }, hazard: { lethal: true, from: 'any' },
        dynamic: { driver: 'script' } },
      platform(1100, G - 120, 70, 120),                  // aşılması gereken duvar (zıplanabilir)
      door(1340, G, { id: 'realdoor' }),                 // gerçek hedef (duvar arkasında)
    ],
    script: {
      onDoorReach(ctx, d) {
        if (d.id === 'fakedoor') {
          ctx.setBanner('BÖLÜM GEÇİLDİ!', '...yoksa öyle mi?');
          ctx.startMotion('crusher', { move: [0, 1], speed: 320, range: 760, mode: 'oneway' });
        } else if (d.id === 'realdoor') {
          ctx.clearBanner();
        }
      },
    },
  },

  // ── L7 — "Hareketli Zemin… Ama Hangisi?" ───────────────────────────────
  // 3 blok: 1&3 güvenli; ORTADAKİ basılınca yukarı fırlar, tavan dikenine ezer.
  // Çözüm: ortayı atla — 1'den 3'e uzun zıpla.
  {
    name: 'Hareketli Zemin', worldW: 1500,
    spawn: { x: 80, y: SPAWN_Y },
    solution: 'Blok1\'e zıpla, ORTAYI ATLA (basınca yukarı fırlatıp tavan dikenine ezer), blok1(520)→blok3(800) uzun atla, sonra zemine→kapı.',
    entities: [
      groundFloor(0, 360),
      platform(380, G - 40, 140, 40, { id: 'b1' }),
      launcher(600, G - 40, { id: 'mid', w: 120, h: 40 }),    // ortadaki: basınca fırlar
      platform(800, G - 40, 140, 40, { id: 'b3' }),
      ceilingSpike(620, G - 360, { invisible: true }),        // ortanın üstünde gizli tavan dikeni
      groundFloor(1080, 420),
      door(1300, G),
    ],
    script: {
      state: { launched: false },
      onUpdate(ctx) {
        const h = ctx.hero;
        if (!ctx.state.launched && h.groundRef && h.groundRef.id === 'mid') {
          ctx.state.launched = true;
          ctx.startMotion('mid', { move: [0, -1], speed: 520, range: 340, mode: 'oneway' });
        }
      },
    },
  },

  // ── L8 — "Pac-Man Etkisi" ──────────────────────────────────────────────
  // Kapı solda, arada geçilmez duvar, sağ uçurum. Sağdan düş → ekran sarması → sol üstten in.
  // Çözüm: sağdaki uçuruma BİLEREK atla; karakter sol üstten düşüp kapının yanına iner.
  {
    name: 'Pac-Man Etkisi', worldW: 1280, cameraMode: 'fixed',
    spawn: { x: 820, y: SPAWN_Y },
    solution: 'Sol kapıya duvar (x540,tam boy) engel. Sağdaki uçuruma (x>1100) bilerek düş → script seni sol-üste sarar → sol zemine inip kapıya (x80) yürü.',
    entities: [
      groundFloor(0, 500),                               // sol zemin (kapı burada)
      door(80, G),
      platform(540, 300, 70, G - 300 + GH),              // geçilmez duvar (tam boy)
      groundFloor(640, 460),                             // sağ zemin (640-1100), sonrası uçurum
    ],
    script: {
      onUpdate(ctx) {
        const h = ctx.hero;
        // Sağ uçurumdan düşerken ekranı sar: sağ-alt → sol-üst (vy korunur).
        if (h.x > 1000 && h.y > G + 30) { h.x = 90; h.y = -120; }
      },
    },
  },

  // ── L9 — "Sabırsızın Sonu" ─────────────────────────────────────────────
  // Cam duvar arkasında kapı, "10 sn bekle" sayacı. 0'da tavan çöker (ceza!).
  // Gerçek çözüm: ~3 sn'de SOLDAKİ görünmez boşluktan (dekoratif zemin) aşağı düş → alt yoldaki gerçek kapı.
  {
    name: 'Sabırsızın Sonu', worldW: 1400,
    spawn: { x: 360, y: 380 - HERO_H },
    solution: 'Bekleme — sayaç 0\'da tavan çöker (ölüm). Sola yürü; x<300\'de zemin dekoratiftir (hitbox yok), düşersin → alt zemine (G) inip gerçek kapıya (x200) git.',
    entities: [
      // Üst kat (yüksek platform) + soldaki SAHTE (dekoratif) zemin
      platform(300, 380, 800, 28, { id: 'upper' }),
      decorative('ground', 0, 380, 300, 28),             // solda "zemin" görünür ama hitbox yok → düşülür
      platform(1000, 120, 60, 290),                      // cam duvar (üstte ileriyi keser)
      decorative('door', 1080, 380 - SCALE.doorH, SCALE.doorW, SCALE.doorH), // camın arkasındaki sahte "ödül" kapı (dekor)
      // Çöken tavan (sayaç 0'da düşer) — ölümcül
      { id: 'ceiling', tags: ['block'], transform: { x: 300, y: -160, w: 800, h: 160 },
        visual: { sprite: 'spike', layer: 2 }, hazard: { lethal: true, from: 'any' },
        dynamic: { driver: 'script' } },
      // Alt kat: gerçek yol + gerçek kapı
      groundFloor(0, 1400),
      door(200, G, { id: 'realdoor' }),
    ],
    script: {
      onEnter(ctx) { ctx.setCountdown('t', 10); },
      onTimer(ctx, name) {
        if (name === 't') ctx.startMotion('ceiling', { move: [0, 1], speed: 700, range: 620, mode: 'oneway' });
      },
      onDoorReach(ctx, d) { if (d.id === 'realdoor') ctx.clearBanner(); },
    },
  },

  // ── L10 — "Yerden Gelen Tehlike" ───────────────────────────────────────
  // Tepedeki "düşen bloklar" YEM (düşmez, dekoratif). Gerçek tehlike: zeminden yukarı
  // fırlayan diken. Çözüm: yere dikkat et, fırlayan diken noktasını zıplayarak geç.
  {
    name: 'Yerden Gelen', worldW: 1500,
    spawn: { x: 80, y: SPAWN_Y },
    solution: 'Tepedeki bloklar yem (düşmez). x500 zone\'una girince x640\'taki gizli yer-dikeni aktifleşip fırlar — x640\'ı zıplayarak geç, kapıya git.',
    entities: [
      groundFloor(0, 1500),
      // Yem: tepede asılı "düşen bloklar" (dekoratif, hareketsiz)
      decorative('spike', 400, 80, 90, 90), decorative('spike', 640, 60, 90, 90),
      decorative('spike', 880, 80, 90, 90),
      // Gerçek tehlike: zeminden fırlayan diken (başta pasif, zone ile aktif)
      { id: 'rise', tags: ['spike'], transform: { x: 612, y: G - 10, w: 70, h: 70 },
        visual: { sprite: 'spike', layer: 1 }, hazard: { lethal: true, from: 'any' },
        active: false, dynamic: { driver: 'script' } },
      zone({ x: 460, y: G - 120, w: 80, h: 120 }, {
        onEnter: (ctx) => {
          ctx.setActive('rise', true);
          ctx.startMotion('rise', { move: [0, -1], speed: 900, range: 80, mode: 'oneway' });
        },
      }, { tags: ['trip'] }),
      door(1320, G),
    ],
  },

  // ── L11 — "Koşan Kapı" ─────────────────────────────────────────────────
  // Sahte kapı oyuncuya hızla SALDIRIR (kapı kılıklı ölümcül blok). Gerçek görünmez kapı
  // spawn'ın SOLUNDA (arkasında). Çözüm: saldıran kapıdan kaç, sola yürü → görünmez kapı.
  {
    name: 'Koşan Kapı', worldW: 1500,
    spawn: { x: 1000, y: SPAWN_Y },
    solution: 'Sağdan saldıran sahte kapı (chaser) öldürür — ona koşma. SOLA kaç; spawn\'ın solundaki görünmez gerçek kapı (x70) ile temas → win.',
    entities: [
      groundFloor(0, 1500),
      door(70, G, { invisible: true }),                  // gerçek görünmez kapı (solda)
      // Saldıran sahte kapı: görünür kapı + ölümcül + script ile hero'ya sürülür
      { id: 'chaser', tags: ['door-fake'], transform: { x: 1420, y: G - SCALE.doorH, w: SCALE.doorW, h: SCALE.doorH },
        visual: { sprite: 'door_runner', layer: 2 }, hazard: { lethal: true, from: 'any' },
        dynamic: { driver: 'script' } },
    ],
    script: {
      onUpdate(ctx, dt) {
        const c = ctx.entity('chaser'), h = ctx.hero; if (!c) return;
        const dir = (h.x + h.w / 2) < (c.transform.x + c.transform.w / 2) ? -1 : 1;
        c.transform.x += dir * 300 * dt;                 // hero'ya doğru hızla saldır
      },
    },
  },

  // ── L12 — "Büyük Final (Anti-Klimaks)" ─────────────────────────────────
  // Onlarca diken/testere (hepsi DEKORATİF, hitbox yok). Tek gerçek tehlike: havadaki
  // minik GÖRÜNMEZ diken (zıplama yörüngesinde). Çözüm: hiçbir şey yapma, dümdüz yürü.
  {
    name: 'Büyük Final', worldW: 1600,
    spawn: { x: 60, y: SPAWN_Y },
    solution: 'Tüm gösterişli tuzaklar dekoratif (hitbox yok). ZIPLAMA — dümdüz yürü. Zıplarsan x800\'deki minik görünmez dikene çarparsın.',
    entities: [
      groundFloor(0, 1600),
      // Gösterişli ama zararsız dekor ordusu
      decorative('spike', 300, G - 120, 80, 120), decorative('spike', 420, 200, 100, 100),
      decorative('spike', 560, G - 90, 70, 90), decorative('spike', 760, 160, 120, 120),
      decorative('spike', 980, G - 110, 80, 110), decorative('spike', 1120, 220, 100, 100),
      decorative('spike', 1280, G - 100, 80, 100),
      // Tek gerçek tehlike: zıplama apex'inde minik görünmez diken
      invisibleHazard(786, G - 150, 30, 30),
      door(1480, G),
    ],
  },
];
