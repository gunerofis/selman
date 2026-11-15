// entities.js — Oyun varlıklarının (hero + tuzaklar) tanımı ve çalışma-zamanı fabrikası.
// Session 3A: hero'ya ek olarak spring/fakePlatform/movingBlock tuzaklarının
// çalışma-zamanı (mutable) örnekleri burada üretilir. levels.js saf VERİ tutar;
// her seviyeye girişte buildRuntimeLevel o veriyi klonlayıp tetiklenme/çökme/hareket
// durumlarını ekler — böylece ölünce/seviyeye dönünce tuzaklar sıfırlanır.
// Tüm gövdeler AABB (eksen-hizalı dikdörtgen): {x, y, w, h}.

import { HERO_W, HERO_H } from './levels.js';

// --- Tuzak ayar sabitleri ---
export const FAKE_COLLAPSE_DELAY = 0.10; // sahte platform basıldıktan sonra çökme gecikmesi (sn)

// Kahraman state'i. Konum sol-üst köşe (x,y); hız (vx,vy) px/sn.
export function createHero(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    w: HERO_W,
    h: HERO_H,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,        // 1 = sağ (hero.png varsayılanı), -1 = sol (kodda flip)
    coyote: 0,        // coyote-time sayacı (sn)
    jumpBuffer: 0,    // jump-buffer sayacı (sn)
    cutLock: false,   // true iken değişken-zıplama kesmesi uygulanmaz (yay fırlatması için)
    squash: 1,        // squash/stretch görsel ölçeği
  };
}

// Hero'yu verilen spawn noktasına ışınla (anında restart / yeni seviye).
export function respawnHero(hero, spawn) {
  hero.x = spawn.x;
  hero.y = spawn.y;
  hero.vx = 0;
  hero.vy = 0;
  hero.onGround = false;
  hero.facing = 1;
  hero.coyote = 0;
  hero.jumpBuffer = 0;
  hero.cutLock = false;
  hero.squash = 1;
}

// --- Tuzak fabrikaları (saf veriden mutable çalışma-zamanı örneği) ---

function createFakePlatform(def) {
  return {
    x: def.x, y: def.y, w: def.w, h: def.h,
    triggered: false,  // hero üstüne bastı mı
    timer: 0,          // tetiklenmeden bu yana geçen süre
    collapsed: false,  // çöktü mü (artık katı değil, çizilmez)
  };
}

function createSpring(def) {
  // Yay bir tetik bölgesidir (katı değil): üstüne inince yukarı fırlatır.
  return { x: def.x, y: def.y, w: def.w, h: def.h };
}

function createMovingBlock(def) {
  return {
    x: def.x, y: def.y, w: def.w, h: def.h,
    x0: def.x, y0: def.y,                 // başlangıç konumu (referans)
    move: { dx: def.move.dx, dy: def.move.dy },
    delay: def.delay,
    speed: def.speed,
    triggered: false,  // hero üstüne bastı mı
    timer: 0,          // tetiklenmeden bu yana geçen süre
    prog: 0,           // kat edilen mesafe (px, hareket vektörü boyunca)
  };
}

// update fonksiyonları — sabit dt ile çağrılır (deterministik).

export function updateFakePlatform(f, dt) {
  if (f.triggered && !f.collapsed) {
    f.timer += dt;
    if (f.timer >= FAKE_COLLAPSE_DELAY) f.collapsed = true;
  }
}

export function updateMovingBlock(m, dt) {
  if (!m.triggered) return;
  m.timer += dt;
  if (m.timer < m.delay) return;
  const total = Math.hypot(m.move.dx, m.move.dy);
  if (total === 0 || m.prog >= total) return;
  m.prog = Math.min(total, m.prog + m.speed * dt);
  const t = m.prog / total;
  m.x = m.x0 + m.move.dx * t;
  m.y = m.y0 + m.move.dy * t;
}

// Bir seviye VERİSİNİ alıp oynanabilir çalışma-zamanı kopyası üret.
// Platform/spike/door statik → sığ klonlanır; tuzaklar mutable fabrika ile.
export function buildRuntimeLevel(def) {
  return {
    name: def.name,
    worldW: def.worldW,
    spawn: { x: def.spawn.x, y: def.spawn.y },
    solution: def.solution,
    platforms: def.platforms.map((p) => ({ ...p })),
    fakePlatforms: def.fakePlatforms.map(createFakePlatform),
    springs: def.springs.map(createSpring),
    movingBlocks: def.movingBlocks.map(createMovingBlock),
    spikes: def.spikes.map((s) => ({ ...s })),
    door: { ...def.door },
  };
}
