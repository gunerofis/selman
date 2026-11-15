// main.js — Oyun döngüsü + state machine + render. Session 4: ses/cila/HUD entegrasyonu.
//
// Mimari (game-design-system §6.5/§12.1): mantık ve render AYRI.
//  - Mantık: SABİT timestep (FIXED_DT), biriken zamanı tüketerek ilerler → deterministik.
//  - Render: her animasyon karesinde bir kez, mantık state'inden çizer.
//  - Ses/cila/HUD SADECE sunum katmanı — determinizm etkilenmez.
//
// State machine:
//   'play'  → (diken/düşüş) → 'dead' → kısa gecikme → aynı seviyeyi yeniden yükle (traplar sıfır)
//   'play'  → (kapı)        → 'clear' → kısa geçiş → sonraki seviye (veya 'alldone')
//   'alldone' → (R/zıpla)   → ilk seviyeden yeniden başla
//
// Seviye verisi levels.js'te (saf veri); her seviyeye girişte entities.buildRuntimeLevel
// ile mutable çalışma-zamanı kopyası kurulur (tuzak tetik/çökme/hareket durumları).

import { Input } from './input.js';
import { stepHero, aabbOverlap, trySpringLaunch } from './physics.js';
import {
  createHero, respawnHero, buildRuntimeLevel,
  updateFakePlatform, updateMovingBlock,
} from './entities.js';
import { WORLD, levels } from './levels.js';
import { audio } from './audio.js';
import { shake, particles, flash } from './fx.js';
import { drawHUD, drawAllDone, drawClear, resetHUD } from './hud.js';

const FIXED_DT = 1 / 120;      // sabit simülasyon adımı (sn) — 120 Hz mantık
const MAX_FRAME = 0.25;        // tek frame'de en fazla bu kadar zaman tüket (spiral-of-death önlemi)
const RESTART_DELAY = 0.05;    // ölümden sonra restart gecikmesi (sn) — <150ms hedefi
const CLEAR_DELAY = 0.55;      // kapıya ulaşınca sonraki seviyeye geçiş gecikmesi (sn)

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const debug = new URLSearchParams(location.search).has('debug');

// --- Asset yükleme ---
const ASSET_SRC = {
  hero: 'assets/hero.png',
  ground: 'assets/tile_ground.png',
  bg: 'assets/bg_main.png',
  spike: 'assets/trap_spike.png',
  door: 'assets/door_goal.png',
  fakeplatform: 'assets/trap_fakeplatform.png', // hem uçan gerçek platform hem sahte için
  spring: 'assets/trap_spring.png',
  movingblock: 'assets/trap_movingblock.png',
  retry: 'assets/ui_retry.png',
};
const images = {};
let groundPattern = null;

function loadImages() {
  const entries = Object.entries(ASSET_SRC);
  return Promise.all(entries.map(([key, src]) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { images[key] = img; resolve(); };
    img.onerror = () => { console.warn('Asset yüklenemedi:', src); resolve(); };
    img.src = src;
  })));
}

// --- Oyun state'i ---
let levelIndex = 0;
let current = buildRuntimeLevel(levels[0]); // aktif seviyenin çalışma-zamanı kopyası
const hero = createHero(current.spawn);
let state = 'play';        // 'play' | 'dead' | 'clear' | 'alldone'
let deathTimer = 0;
let clearTimer = 0;
let deaths = 0;            // ölüm sayacı
const input = new Input(canvas);

// --- Ses unlock (ilk kullanıcı girdisinde) ---
let audioUnlocked = false;
function tryUnlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audio.unlock();
}
// Tüm girdi kaynaklarında unlock
window.addEventListener('keydown', tryUnlockAudio, { once: true });
window.addEventListener('touchstart', tryUnlockAudio, { once: true });
window.addEventListener('mousedown', tryUnlockAudio, { once: true });

// --- Mute toggle (M tuşu + DOM butonu) ---
function updateMuteBtn() {
  const btn = document.getElementById('btn-mute');
  if (btn) btn.textContent = audio.muted ? '🔇' : '🔊';
}
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') { audio.toggleMute(); updateMuteBtn(); }
});
window.addEventListener('toggle-mute', () => {
  audio.toggleMute(); updateMuteBtn();
});

// Belirli bir seviyeyi (yeniden) yükle: traplar sıfırlanır, hero spawn'a döner.
function loadLevel(i) {
  levelIndex = i;
  current = buildRuntimeLevel(levels[i]);
  respawnHero(hero, current.spawn);
  state = 'play';
  updateCamera();
}

// --- Kamera (yatay takip) ---
let camX = 0;
function updateCamera() {
  const target = hero.x + hero.w / 2 - canvas.width / 2;
  camX = Math.max(0, Math.min(target, current.worldW - canvas.width));
}

// Bu frame için katı (solid) AABB listesini kur. Hareketli blok konumu her adım
// değiştiğinden liste her fixedUpdate'te yeniden üretilir. Yay listede DEĞİL (katı değil).
function buildSolids() {
  const solids = [];
  for (const p of current.platforms) solids.push({ x: p.x, y: p.y, w: p.w, h: p.h, kind: 'platform', ref: p });
  for (const f of current.fakePlatforms) {
    if (!f.collapsed) solids.push({ x: f.x, y: f.y, w: f.w, h: f.h, kind: 'fake', ref: f });
  }
  for (const m of current.movingBlocks) solids.push({ x: m.x, y: m.y, w: m.w, h: m.h, kind: 'moving', ref: m });
  return solids;
}

// --- Sabit-adım mantık güncellemesi ---
function fixedUpdate(dt) {
  if (state === 'play') {
    const solids = buildSolids();

    // Tuzak tetik durumlarını kaydet (ses için önceki durum)
    const prevFakeTriggers = current.fakePlatforms.map(f => f.triggered);
    const prevMoveTriggers = current.movingBlocks.map(m => m.triggered);

    const preVy = hero.vy;                 // yay kararı için adım-öncesi düşüş hızı
    const jumped = stepHero(hero, input, solids, dt);
    input.consumeJump();

    // Zıplama sesi
    if (jumped) audio.play('jump');

    const sprung = trySpringLaunch(hero, current.springs, preVy);

    // Yay fırlatma sesi + partikül
    if (sprung) {
      audio.play('trap');
      particles.emit(hero.x + hero.w / 2, hero.y + hero.h, 6, '#d98fb0', { upward: true });
    }

    // Tuzak durum güncellemeleri (iniş tetikleri stepHero'da kuruldu)
    for (let i = 0; i < current.fakePlatforms.length; i++) {
      const f = current.fakePlatforms[i];
      // Yeni tetikleme → ses + partikül
      if (f.triggered && !prevFakeTriggers[i]) {
        audio.play('trap');
        particles.emit(f.x + f.w / 2, f.y + f.h, 5, '#c8a87a', { small: true });
      }
      updateFakePlatform(f, dt);
    }
    for (let i = 0; i < current.movingBlocks.length; i++) {
      const m = current.movingBlocks[i];
      // Yeni tetikleme → ses
      if (m.triggered && !prevMoveTriggers[i]) {
        audio.play('trap');
      }
      updateMovingBlock(m, dt);
    }

    // Ölüm 1: dikene değme (dürüst hitbox)
    for (const s of current.spikes) {
      if (aabbOverlap(hero, s)) { die(); return; }
    }
    // Ölüm 2: dünya altına düşme
    if (hero.y > WORLD.h + 80) { die(); return; }

    // Kazanma: kapıya ulaşma → seviye geçişi
    if (aabbOverlap(hero, current.door)) {
      state = 'clear';
      clearTimer = CLEAR_DELAY;
      flash.trigger(0.4);
      return;
    }
  } else if (state === 'dead') {
    deathTimer -= dt;
    if (deathTimer <= 0) loadLevel(levelIndex); // aynı seviyeyi sıfırla
  } else if (state === 'clear') {
    clearTimer -= dt;
    if (clearTimer <= 0) {
      if (levelIndex + 1 < levels.length) {
        showAdIfNeeded(levelIndex + 1);
        loadLevel(levelIndex + 1);
      }
      else state = 'alldone';
    }
  }
}

function die() {
  if (state !== 'play') return;
  deaths++;
  state = 'dead';
  deathTimer = RESTART_DELAY;

  // Ses + efektler
  audio.play('death');
  shake.trigger(6, 0.25);
  particles.emit(hero.x + hero.w / 2, hero.y + hero.h / 2, 10, '#ff6b35');
}

// --- Render ---
function drawBackground() {
  if (images.bg) {
    const img = images.bg;
    const scale = canvas.height / img.height;
    const w = img.width * scale;
    const par = -camX * 0.3; // paralaks
    let x = par % w;
    if (x > 0) x -= w;
    for (; x < canvas.width; x += w) {
      ctx.drawImage(img, x, 0, w, canvas.height);
    }
  } else {
    ctx.fillStyle = '#bfe9d0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawPlatforms() {
  if (!groundPattern && images.ground) {
    groundPattern = ctx.createPattern(images.ground, 'repeat');
  }
  for (const p of current.platforms) {
    const sx = p.x - camX;
    if (p.ground && groundPattern) {
      // Geniş taban zemini: tile_ground dokusuyla döşe
      ctx.save();
      ctx.translate(sx, p.y);
      const ts = 96 / images.ground.width;
      ctx.scale(ts, ts);
      ctx.fillStyle = groundPattern;
      ctx.fillRect(0, 0, p.w / ts, p.h / ts);
      ctx.restore();
    } else if (!p.ground && images.fakeplatform) {
      // Uçan gerçek platform: sahteyle AYNI sprite (ayırt edilemez — ihanet espirisi)
      ctx.drawImage(images.fakeplatform, sx, p.y, p.w, p.h);
    } else {
      ctx.fillStyle = p.ground ? '#8fd6a8' : '#a8d8c0';
      ctx.fillRect(sx, p.y, p.w, p.h);
    }
  }
}

function drawFakePlatforms() {
  for (const f of current.fakePlatforms) {
    if (f.collapsed) continue; // çöktü → çizilmez
    const sx = f.x - camX;
    if (images.fakeplatform) {
      ctx.drawImage(images.fakeplatform, sx, f.y, f.w, f.h);
    } else {
      ctx.fillStyle = '#a8d8c0';
      ctx.fillRect(sx, f.y, f.w, f.h);
    }
  }
}

function drawSprings() {
  for (const sp of current.springs) {
    const sx = sp.x - camX;
    if (images.spring) ctx.drawImage(images.spring, sx, sp.y, sp.w, sp.h);
    else { ctx.fillStyle = '#d98fb0'; ctx.fillRect(sx, sp.y, sp.w, sp.h); }
  }
}

function drawMovingBlocks() {
  for (const m of current.movingBlocks) {
    const sx = m.x - camX;
    if (images.movingblock) ctx.drawImage(images.movingblock, sx, m.y, m.w, m.h);
    else { ctx.fillStyle = '#b8a07a'; ctx.fillRect(sx, m.y, m.w, m.h); }
  }
}

function drawSpikes() {
  for (const s of current.spikes) {
    const sx = s.x - camX;
    if (images.spike) {
      ctx.drawImage(images.spike, sx, s.y, s.w, s.h);
    } else {
      ctx.fillStyle = '#c97b7b';
      ctx.beginPath();
      ctx.moveTo(sx, s.y + s.h);
      ctx.lineTo(sx + s.w / 2, s.y);
      ctx.lineTo(sx + s.w, s.y + s.h);
      ctx.fill();
    }
  }
}

function drawDoor() {
  const d = current.door;
  const sx = d.x - camX;
  if (images.door) ctx.drawImage(images.door, sx, d.y, d.w, d.h);
  else { ctx.fillStyle = '#e0a86b'; ctx.fillRect(sx, d.y, d.w, d.h); }
}

function drawHero() {
  const sx = hero.x - camX;
  const sy = hero.squash;
  const sxScale = 1 / sy;
  const drawW = hero.w * sxScale;
  const drawH = hero.h * sy;
  const ox = sx + hero.w / 2;
  const oy = hero.y + hero.h; // ayaklardan ölçekle (zemine yapışsın)

  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(hero.facing * 1, 1); // sola bakınca yatay flip
  if (images.hero) {
    ctx.drawImage(images.hero, -drawW / 2, -drawH, drawW, drawH);
  } else {
    ctx.fillStyle = '#ef8a4a';
    ctx.fillRect(-drawW / 2, -drawH, drawW, drawH);
  }
  ctx.restore();
}

function drawDebug(fps) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(8, 8, 270, 156);
  ctx.fillStyle = '#9effa0';
  ctx.font = '14px monospace';
  let y = 28;
  const line = (t) => { ctx.fillText(t, 16, y); y += 18; };
  line(`fps     ${fps.toFixed(0)}`);
  line(`state   ${state}`);
  line(`level   ${levelIndex} ${current.name}`);
  line(`pos     ${hero.x.toFixed(0)}, ${hero.y.toFixed(0)}`);
  line(`vel     ${hero.vx.toFixed(0)}, ${hero.vy.toFixed(0)}`);
  line(`onGround ${hero.onGround}`);
  line(`deaths  ${deaths}`);
  line(`Goatcha! — S4 debug`);
  ctx.restore();

  // Hitbox çizimleri
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00e0ff';
  ctx.strokeRect(hero.x - camX, hero.y, hero.w, hero.h);
  ctx.strokeStyle = '#ff4d4d';
  for (const s of current.spikes) ctx.strokeRect(s.x - camX, s.y, s.w, s.h);
  ctx.strokeStyle = '#ff8c2b'; // sahte platform
  for (const f of current.fakePlatforms) if (!f.collapsed) ctx.strokeRect(f.x - camX, f.y, f.w, f.h);
  ctx.strokeStyle = '#e84ddb'; // yay
  for (const sp of current.springs) ctx.strokeRect(sp.x - camX, sp.y, sp.w, sp.h);
  ctx.strokeStyle = '#c8a23a'; // hareketli blok
  for (const m of current.movingBlocks) ctx.strokeRect(m.x - camX, m.y, m.w, m.h);
  ctx.strokeStyle = '#ffd84d';
  ctx.strokeRect(current.door.x - camX, current.door.y, current.door.w, current.door.h);
}

function render(fps, frameDt) {
  // Görsel efektleri güncelle (render dt ile — deterministik olmayan, sunum katmanı)
  shake.update(frameDt);
  particles.update(frameDt);
  flash.update(frameDt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Oyun dünyasını shake ofseti ile çiz
  ctx.save();
  ctx.translate(shake.ox, shake.oy);

  drawPlatforms();
  drawFakePlatforms();
  drawSprings();
  drawMovingBlocks();
  drawSpikes();
  drawDoor();
  drawHero();
  particles.draw(ctx, camX);

  ctx.restore(); // shake ofseti sona erdi

  // State overlay'leri (shake'ten bağımsız)
  if (state === 'clear') {
    drawClear(ctx, canvas.width, canvas.height, levelIndex, current.name);
  } else if (state === 'alldone') {
    drawAllDone(ctx, canvas.width, canvas.height, deaths);
  }

  // Flash efekti (shake'ten bağımsız)
  flash.draw(ctx, canvas.width, canvas.height);

  // HUD (shake'ten bağımsız — sallanmasın)
  drawHUD(ctx, canvas.width, canvas.height, state, levelIndex, current.name, deaths, audio.muted);

  if (debug) drawDebug(fps);
}

// 'alldone' durumundan baştan başlat (R tuşu / zıpla / dokunmatik jump)
function bindRestart() {
  const restart = () => {
    if (state === 'alldone') { 
      deaths = 0; resetHUD(); 
      showAdIfNeeded(0, true);
      loadLevel(0); 
    }
  };
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR' || e.code === 'Space' || e.code === 'Enter') restart();
  });
  const jb = document.getElementById('btn-jump');
  if (jb) jb.addEventListener('touchstart', restart, { passive: true });
}

// --- Döngü ---
let paused = false;        // debug: true iken otomatik fixedUpdate durur (manuel step için)
let accumulator = 0;
let last = performance.now();
let fpsEMA = 60;

function frame(now) {
  let frameTime = (now - last) / 1000;
  last = now;
  if (frameTime > MAX_FRAME) frameTime = MAX_FRAME;

  if (frameTime > 0) fpsEMA = fpsEMA * 0.9 + (1 / frameTime) * 0.1;

  input.update();

  if (!paused) {
    accumulator += frameTime;
    while (accumulator >= FIXED_DT) {
      fixedUpdate(FIXED_DT);
      accumulator -= FIXED_DT;
    }
  } else {
    accumulator = 0; // duraklatınca zaman birikmesin (deterministik manuel adımlama)
  }

  updateCamera();
  try {
    render(fpsEMA, frameTime);
  } catch (err) {
    console.error('render hata:', err);
    throw err;
  }
  if (debug) {
    window.__game = { state, levelIndex, hero, deaths, camX, fps: fpsEMA, frames: (window.__game?.frames || 0) + 1 };
  }
  requestAnimationFrame(frame);
}

// --- Canvas boyutlandırma (sabit iç çözünürlük, CSS ile ölçek) ---
function resize() {
  const iw = window.innerWidth || 1280;
  const ih = window.innerHeight || 720;
  const aspect = iw / ih;
  canvas.height = WORLD.h;
  canvas.width = Math.round(WORLD.h * Math.max(1, Math.min(aspect, 2.2)));
}
window.addEventListener('resize', resize);

// --- Debug test kancası (sadece ?debug=1) — otomatik doğrulama için ---
if (debug) {
  window.__test = {
    load: (i) => loadLevel(i),
    snap: () => ({
      state, levelIndex, name: current.name,
      hero: { x: Math.round(hero.x), y: Math.round(hero.y), vx: Math.round(hero.vx), vy: Math.round(hero.vy), onGround: hero.onGround },
      fakes: current.fakePlatforms.map((f) => ({ triggered: f.triggered, collapsed: f.collapsed })),
      blocks: current.movingBlocks.map((m) => ({ x: Math.round(m.x), y: Math.round(m.y), triggered: m.triggered, prog: Math.round(m.prog) })),
      deaths,
    }),
    teleport: (x, y, vx = 0, vy = 0) => { hero.x = x; hero.y = y; hero.vx = vx; hero.vy = vy; hero.onGround = false; },
    press: (code, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code })),
    pause: (v) => { paused = v; },
    step: (n = 1) => { for (let i = 0; i < n; i++) { input.update(); fixedUpdate(FIXED_DT); } },
  };
}

// --- Playgama Bridge Entegrasyonu ---
function setupBridgeEvents() {
  if (!window.bridge) return;
  window.bridge.on('interstitial_state_changed', state => {
    if (state === 'opened') {
      paused = true;
      audio.setAdMute(true);
    } else if (state === 'closed' || state === 'failed') {
      paused = false;
      audio.setAdMute(false);
    }
  });
}

function showAdIfNeeded(levelIdx, force = false) {
  if (!window.bridge) return;
  if (force || (levelIdx > 0 && levelIdx % 3 === 0)) {
    window.bridge.showInterstitial();
  }
}

// --- Başlat ---
resize();
bindRestart();
loadImages().then(() => {
  if (window.bridge) {
    window.bridge.initialize().then(() => {
      window.bridge.sendMessage('game_ready');
      setupBridgeEvents();
      startGame();
    }).catch((e) => {
      console.warn('Bridge init failed:', e);
      startGame();
    });
  } else {
    startGame();
  }
});

function startGame() {
  updateCamera();
  last = performance.now();
  requestAnimationFrame(frame);
}
