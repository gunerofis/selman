// main.js — Oyun döngüsü + state machine + render. Motor v2 (Session 8).
//
// Mimari (game-design-system §6.5/§12.1): mantık ve render AYRI.
//  - Mantık: SABİT timestep (FIXED_DT), biriken zamanı tüketerek ilerler → deterministik.
//  - Render: her animasyon karesinde bir kez, mantık state'inden çizer.
//  - Ses/cila/HUD/banner SADECE sunum katmanı — determinizm etkilenmez.
//
// State machine (GERÇEK — asla yalan söylemez, mimari-v2.md §S7):
//   'play'  → (ölüm) → 'dead' → kısa gecikme → aynı seviyeyi yeniden yükle
//   'play'  → (win)  → 'clear' → kısa geçiş → sonraki seviye (veya 'alldone')
//   'alldone' → (R/zıpla) → ilk seviyeden yeniden başla
//
// ── SESSION 8: MOTOR v2 (mimari-v2.md) ──────────────────────────────────────
// v1'in tip-özel draw*/update* dağıtımı yerine BİLEŞEN-SÜRÜCÜ dağıtım:
//   S1 bileşen modeli · S2 trigger zone · S3 script hook + ctx · S4 dynamic/carry
//   S5 ekran sarması + kamera modları · S6 input invert · S7 yalan banner/sayaç · S8 v2 loader
// "v2 çalışma sırası" (sabit adım, §c) fixedUpdate içinde sırayla uygulanır.

import { Input } from './input.js';
import { stepHero, aabbOverlap, PHYS } from './physics.js';
import { createHero, respawnHero, buildRuntimeLevel } from './entities.js';
import { WORLD, levels } from './levels.js';
import { audio } from './audio.js';
import { shake, particles, flash } from './fx.js';
import {
  drawHUD, drawAllDone, drawClear, resetHUD,
  drawBanner, drawCountdown, setBanner, clearBanner, setCountdown, resetFakeUI,
} from './hud.js';
import { storage } from './storage.js';
import { ui } from './ui.js';

const FIXED_DT = 1 / 120;      // sabit simülasyon adımı (sn) — 120 Hz mantık
const MAX_FRAME = 0.25;        // tek frame'de en fazla bu kadar zaman tüket (spiral-of-death önlemi)
const RESTART_DELAY = 0.05;    // ölümden sonra restart gecikmesi (sn)
const CLEAR_DELAY = 0.55;      // kapıya ulaşınca sonraki seviyeye geçiş gecikmesi (sn)

// ── S11: His (game feel) sunum sabitleri — TEK YER ──────────────────────────
// Hareket/zıplama sabitleri physics.js > PHYS'te (mantık). Burası SADECE sunum
// (kamera + ölüm dozu) → determinizmi/geçilebilirliği ETKİLEMEZ, sadece "his".
const FEEL = {
  // Kamera takibi: kare-hızından bağımsız üstel yumuşatma. Büyük λ = daha sıkı/anında
  // takip (lag az). 0 = takip yok. Hassas platformer için sıkı tutuldu (tehlikeyi
  // gizlememesi için). Ölüm/yükleme anında kamera ANINDA snap olur (snapCamera).
  camFollowLambda: 18,   // ~55ms zaman sabiti — hafif yumuşatma, fark edilir lag yok
  // Ölüm geri bildirimi dozu ("juicy ama yormayan", <1sn dönüş korunur):
  deathShakeAmp: 8,      // sarsıntı genliği (önceki 6)
  deathShakeDur: 0.22,   // sarsıntı süresi sn (önceki 0.25 — daha keskin)
  deathParticles: 14,    // patlama partikül sayısı (önceki 10)
  // S12: görünmez katı zemine (L3 köprü) inince adil "toz" ipucu partikül sayısı.
  revealDust: 6,         // küçük/yumuşak doz — sürprizi bozmadan "burada zemin var" der
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const debug = new URLSearchParams(location.search).has('debug');

// --- Asset yükleme ---
// Stil B (keçi/parlak fantezi) assetleri — yeni/ sheet'lerinden kesilip arkaplanları
// temizlendi (geçici "şimdilik" pass; ileride hepsi tek tek yeniden üretilecek).
// sprite adları levels.js'deki visual.sprite ile birebir eşleşir.
const ASSET_SRC = {
  hero: 'assets/hero.png',
  ground: 'assets/tile_ground.png',
  bg: 'assets/bg_main.png',
  door: 'assets/door_goal.png',
  spike: 'assets/trap_spike.png',
  spring: 'assets/trap_spring.png',
  btn: 'assets/ui_button_press.png',
  fx_gas: 'assets/fx_gas_zone.png',
  ceiling_spike: 'assets/trap_ceiling_spike.png',
  movingblock: 'assets/trap_movingblock.png',
  door_runner: 'assets/door_runner.png',
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
let deaths = 0;            // bu turdaki (run) ölüm sayacı — HUD
let levelDeaths = 0;      // bu seviyeye girişten beri ölüm (en-iyi kaydı için)
let levelStartMs = 0;     // bu seviyeye giriş zamanı (süre kaydı için)
const input = new Input(canvas);

// S10: kabuk/akış katmanı. 'game' = oynanış aktif; diğerleri menü (paused).
let screen = 'boot';       // 'boot'|'title'|'game'|'pause'|'select'|'settings'|'alldone'|'howto'

// --- v2 çalışma-zamanı katmanları (mimari-v2.md) ---
let inputInverted = false;             // S6: yatay kontrol ters mi
let idleTime = 0;                      // S3: hero kaç sn'dir hareketsiz (onPlayerIdle)
let winIntent = false, killIntent = false; // S3: script niyeti — motor çözer
const timers = new Map();              // S7: adlı zamanlayıcılar { remaining, fire?, display }

// --- Ses unlock (ilk kullanıcı girdisinde) ---
let audioUnlocked = false;
function tryUnlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audio.unlock();
}
window.addEventListener('keydown', tryUnlockAudio, { once: true });
window.addEventListener('touchstart', tryUnlockAudio, { once: true });
window.addEventListener('mousedown', tryUnlockAudio, { once: true });

// --- Mute kısayolu (M tuşu) — köşe butonu + ayarlar ile aynı kaynağı günceller ---
// (updateMuteBtn + kalıcılık aşağıda S10 kabuk bölümünde tanımlı.)
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') {
    audio.setMuted(!audio.muted);
    storage.setMuted(audio.muted);
    updateMuteBtn();
  }
});

// ============================================================================
// S3 — Script Context (ctx): script'in motora dokunabileceği TEK yüzey.
// mimari-v2.md §S3. Tüm mutasyonlar sabit-adım içinde olur (determinizm).
// Sunum çağrıları (setBanner/setCountdown) HUD'a yazar, MANTIĞI ETKİLEMEZ (§S7).
// ============================================================================
function entityById(id) {
  for (const e of current.entities) if (e.id === id) return e;
  return null;
}
const gameCtx = {
  get hero() { return hero; },
  get state() { return current.scriptState; },         // seviyeye özel serbest scratch
  entity(id) { return entityById(id); },
  query(tag) { return current.entities.filter((e) => e.tags.includes(tag)); },
  setActive(id, b) { const e = entityById(id); if (e) e.active = b; },
  moveTo(id, x, y) { const e = entityById(id); if (e) { e.transform.x = x; e.transform.y = y; } },
  nudge(id, dx, dy) { const e = entityById(id); if (e) { e.transform.x += dx; e.transform.y += dy; } },
  startMotion(id, motion) {
    const e = entityById(id);
    if (e && e.dynamic) {
      e.dynamic.driver = 'auto';
      e.dynamic._auto = { ...motion, t: 0, _trav: 0, _dir: 1, started: true };
    }
  },
  launchHero(vy) { hero.vy = -Math.abs(vy); hero.onGround = false; hero.cutLock = true; },
  setInputInvert(b) { inputInverted = b; },              // S6
  setBanner(text, sub) { setBanner(text, sub); },        // S7 (sunum)
  clearBanner() { clearBanner(); },
  setCountdown(name, seconds) { timers.set(name, { remaining: seconds, display: true }); setCountdown(name, seconds); },
  timer(name, seconds, fire) { timers.set(name, { remaining: seconds, fire, display: false }); },
  win() { winIntent = true; },                           // niyet — motor çözer
  kill() { killIntent = true; },
};

// Belirli bir seviyeyi (yeniden) yükle: tüm v2 durumları sıfırlanır, script.onEnter çağrılır.
function loadLevel(i) {
  levelIndex = i;
  current = buildRuntimeLevel(levels[i]);
  respawnHero(hero, current.spawn);
  state = 'play';
  // v2 katman sıfırlama (mimari-v2.md §S8 klonla-ve-sıfırla)
  inputInverted = false;
  idleTime = 0;
  winIntent = false; killIntent = false;
  timers.clear();
  resetFakeUI();                 // S7: yalan banner/sayaç temizlenir (sunum)
  if (current.script && current.script.onEnter) current.script.onEnter(gameCtx);
  updateCamera();
}

// --- Kamera (S5: follow | fixed) ---
let camX = 0;
function targetCamX() {
  if (current.cameraMode === 'fixed') return 0;
  const target = hero.x + hero.w / 2 - canvas.width / 2;
  return Math.max(0, Math.min(target, current.worldW - canvas.width));
}
// Anında konumlan (seviye yükleme / ölüm-restart / başlangıç) — lag/sürüklenme olmasın.
function snapCamera() { camX = targetCamX(); }
// S11: sunumda kare-hızından bağımsız yumuşatma (his). Mantığı ETKİLEMEZ (sadece çizim ofseti).
function smoothCamera(frameDt) {
  const tx = targetCamX();
  if (current.cameraMode === 'fixed' || FEEL.camFollowLambda <= 0) { camX = tx; return; }
  camX += (tx - camX) * (1 - Math.exp(-FEEL.camFollowLambda * frameDt));
  if (Math.abs(tx - camX) < 0.5) camX = tx;
}
// Geriye-uyum: eski çağrı adı → anında snap (loadLevel/startGame içinde kullanılır).
function updateCamera() { snapCamera(); }

// S1: bu frame için katı (solid) AABB listesini kur — `collision.solid && active`
// olan TÜM bileşenli entity'ler (mimari-v2.md §S1 buildSolids genellemesi).
function buildSolids() {
  const solids = [];
  for (const e of current.entities) {
    if (e.active && e.collision && e.collision.solid) {
      const t = e.transform;
      solids.push({ x: t.x, y: t.y, w: t.w, h: t.h, ref: e });
    }
  }
  return solids;
}

// --- S7: adlı zamanlayıcılar (sabit-adım) ---
function tickTimers(dt) {
  for (const [name, t] of timers) {
    t.remaining -= dt;
    if (t.display) setCountdown(name, Math.max(0, t.remaining));
    if (t.remaining <= 0) {
      timers.delete(name);
      if (t.fire) t.fire(gameCtx);
      if (current.script && current.script.onTimer) current.script.onTimer(gameCtx, name);
    }
  }
}

// --- S4: dynamic 'auto' motion ilerlet + carry (taşıma) ---
function isRiding(e) {
  // hero o solid'in üstünde mi (stepHero'nun son adımda set ettiği groundRef ile)
  return hero.groundRef === e;
}
function updateDynamics(dt) {
  for (const e of current.entities) {
    if (!e.active || !e.dynamic) continue;
    const dyn = e.dynamic;
    // 'collapse' sürücü (L4 sahte platform): hero üstüne basınca geri sayım → kaybolur.
    if (dyn.driver === 'collapse') {
      if (dyn._t == null && isRiding(e)) dyn._t = (dyn.delay != null ? dyn.delay : 0.25);
      if (dyn._t != null) { dyn._t -= dt; if (dyn._t <= 0) e.active = false; }
      continue;
    }
    if (dyn.driver !== 'auto' || !dyn._auto) continue;   // 'script' sürücü: konumu script verir
    const m = dyn._auto;
    if (!m.started) { m.t += dt; if (m.t < (m.delay || 0)) continue; m.started = true; }

    const len = Math.hypot(m.move[0], m.move[1]) || 1;
    const ux = m.move[0] / len, uy = m.move[1] / len;
    let dist = m.speed * dt;
    if (m.mode === 'oneway') {
      if (m._trav >= m.range) dist = 0; else m._trav += dist;
    } else { // pingpong (varsayılan)
      m._trav += dist;
      if (m._trav >= m.range) { m._dir *= -1; m._trav = 0; }
    }
    const dir = m._dir || 1;
    const oldX = e.transform.x, oldY = e.transform.y;
    e.transform.x += ux * dist * dir;
    e.transform.y += uy * dist * dir;
    // Carry: solid'in Δ'sı, üstündeki hero'ya da uygulanır (rider pattern, §S4).
    if (dyn.carry && isRiding(e)) {
      hero.x += e.transform.x - oldX;
      hero.y += e.transform.y - oldY;
    }
  }
}

// --- S2: trigger zone enter/stay/exit değerlendir → script callback (ctx ile) ---
function updateTriggers(dt) {
  for (const e of current.entities) {
    if (!e.active || !e.trigger) continue;
    const is = aabbOverlap(hero, e.transform);
    const was = e._wasInside;
    if (!was && is) { if (e.trigger.onEnter) e.trigger.onEnter(gameCtx, e); }
    else if (was && is) { if (e.trigger.onStay) e.trigger.onStay(gameCtx, dt, e); }
    else if (was && !is) { if (e.trigger.onExit) e.trigger.onExit(gameCtx, e); }
    e._wasInside = is;
  }
}

// --- S1: hazard taraması (from-yönü dahil) ---
function scanHazards() {
  for (const e of current.entities) {
    if (!e.active || !e.hazard || !e.hazard.lethal) continue;
    if (!aabbOverlap(hero, e.transform)) continue;
    const from = e.hazard.from || 'any';
    if (from === 'any') return true;
    if (from === 'top' && hero.vy >= 0) return true;     // yere inerken üstten basınca
    if (from === 'bottom' && hero.vy <= 0) return true;  // yukarı fırlarken tavana çarpınca
  }
  return false;
}

// --- S5: ekran sarması ---
function applyWrap() {
  if (hero.x > current.worldW) hero.x -= current.worldW;
  else if (hero.x + hero.w < 0) hero.x += current.worldW;
}

// Hedef kapı(lar) çözümü + onDoorReach (mimari-v2.md §S3/§S7).
function resolveDoors() {
  for (const e of current.entities) {
    if (!e.active || !e.tags.includes('door')) continue;
    if (!aabbOverlap(hero, e.transform)) continue;
    if (current.script && current.script.onDoorReach && !e._doorReached) {
      e._doorReached = true;
      current.script.onDoorReach(gameCtx, e);
    }
    if (e._isGoal) winIntent = true;   // gerçek hedef → win niyeti (motor uygular)
  }
}

// --- Sabit-adım mantık güncellemesi (mimari-v2.md "v2 çalışma sırası") ---
function fixedUpdate(dt) {
  if (state === 'play') {
    // 2. input modifier (S6 invert) — input.js çıktısı değişmez, üstüne ince katman
    const effInput = inputInverted
      ? { left: input.right, right: input.left, jumpHeld: input.jumpHeld, jumpPressed: input.jumpPressed }
      : input;

    // 3. script.onUpdate + zamanlayıcılar + idle (S3/S7)
    if (current.script && current.script.onUpdate) current.script.onUpdate(gameCtx, dt);
    tickTimers(dt);
    const moving = effInput.left || effInput.right || Math.abs(hero.vx) > 20;
    idleTime = moving ? 0 : idleTime + dt;
    if (current.script && current.script.onPlayerIdle) current.script.onPlayerIdle(gameCtx, idleTime);

    // 4+5. dynamic 'auto' motion + carry (S4)
    updateDynamics(dt);

    // 6. stepHero — KORUNAN ÇEKİRDEK (solids dynamics SONRASI kurulur)
    const wasGround = hero.onGround;
    const solids = buildSolids();
    const jumped = stepHero(hero, effInput, solids, dt);
    input.consumeJump();
    if (jumped) audio.play('jump');

    // S12: GÖRÜNMEZ ZEMİN "TOZ" İPUCU (okunabilirlik) — mimari-v2.md §f#4 reveal:'dustOnLand'.
    // Görünmez katı (L3 köprü) üstüne İLK inişte hafif toz → "burada zemin var" adil ipucu;
    // sürprizi bozmaz (oyuncu zaten basmış olur). Sunum-only; mantığı/determinizmi etkilemez.
    if (!wasGround && hero.onGround && hero.groundRef &&
        !hero.groundRef.visual && hero.groundRef.collision && hero.groundRef.collision.solid) {
      particles.emit(hero.x + hero.w / 2, hero.y + hero.h, FEEL.revealDust, '#e9dcff', { small: true, upward: true, speed: 90 });
    }

    // 7. trigger zone enter/stay/exit (S2) → 8. spring/launch zone preset'leri ctx ile
    updateTriggers(dt);

    // 9. hazard taraması (from-yönü) (S1)
    if (scanHazards()) { die(); return; }

    // 10. wrapX teleport (S5)
    if (current.wrapX) applyWrap();

    // Ölüm: dünya altına düşme
    if (hero.y > WORLD.h + 80) { die(); return; }

    // 11. win/kill niyetlerini + hedef kapıyı çöz → state (çekirdek karar verir)
    resolveDoors();
    if (killIntent) { killIntent = false; die(); return; }
    if (winIntent) {
      winIntent = false;
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
      // İlerleme kaydı: sonraki seviyeyi aç + bu seviyenin en iyi ölüm/süresini yaz.
      const timeMs = Math.round(performance.now() - levelStartMs);
      storage.recordClear(levelIndex, levelDeaths, timeMs, levels.length);
      if (levelIndex + 1 < levels.length) {
        showAdIfNeeded(levelIndex + 1);
        loadLevel(levelIndex + 1);
        levelDeaths = 0;
        levelStartMs = performance.now();
      } else {
        state = 'alldone';
        onAllDone();
      }
    }
  }
}

// Oyun bitti: istatistikleri hazırla + alldone menüsünü aç (S10).
function onAllDone() {
  ui.setAllDoneStats({
    levelCount: levels.length,
    totalDeaths: storage.totalDeaths,
    runDeaths: deaths,
  });
  openMenu('alldone');
}

function die() {
  if (state !== 'play') return;
  deaths++;
  levelDeaths++;
  storage.addDeaths(1);   // kalıcı toplam (tüm zamanlar)
  state = 'dead';
  deathTimer = RESTART_DELAY;
  audio.play('death');
  shake.trigger(FEEL.deathShakeAmp, FEEL.deathShakeDur);          // S11: doz FEEL'de
  particles.emit(hero.x + hero.w / 2, hero.y + hero.h / 2, FEEL.deathParticles, '#ff6b35');
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

// S1: bileşen-sürücü çizim. Görseli olan tüm aktif entity'ler layer sırasıyla.
// Asset yoksa renk-kodlu placeholder (gaz/spike/blok henüz üretilmedi).
function fallbackColor(e) {
  if (e.tags.includes('door')) return '#e0a86b';
  if (e.hazard) return '#d63a3a';
  if (e.trigger) return 'rgba(120,220,140,0.4)'; // gaz alanı
  if (e.tags.includes('decorative')) return '#9aa0a6';
  if (e.collision && e.collision.solid) return '#7a8b9a'; // hareketli/normal blok
  return '#a8d8c0';
}
function drawGround(sx, t) {
  ctx.save();
  ctx.translate(sx, t.y);
  const ts = 96 / images.ground.width;
  ctx.scale(ts, ts);
  ctx.fillStyle = groundPattern;
  ctx.fillRect(0, 0, t.w / ts, t.h / ts);
  ctx.restore();
}
function drawEntities() {
  if (!groundPattern && images.ground) {
    groundPattern = ctx.createPattern(images.ground, 'repeat');
  }
  const list = current.entities.filter((e) => e.active && e.visual);
  list.sort((a, b) => (a.visual.layer || 0) - (b.visual.layer || 0));
  for (const e of list) {
    const t = e.transform;
    const sx = t.x - camX;
    const sprite = e.visual.sprite;
    if (sprite === 'ground' && groundPattern) { drawGround(sx, t); continue; }
    const img = images[sprite];
    if (img) {
      if (e.visual.flip === 'v') {
        ctx.save();
        ctx.translate(sx, t.y + t.h);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0, t.w, t.h);
        ctx.restore();
      } else {
        ctx.drawImage(img, sx, t.y, t.w, t.h);
      }
    } else {
      ctx.fillStyle = fallbackColor(e);
      ctx.fillRect(sx, t.y, t.w, t.h);
    }
  }
}

function drawHero() {
  const sx = hero.x - camX;
  const sy = hero.squash;
  const sxScale = 1 / sy;
  const drawW = hero.w * sxScale;
  const drawH = hero.h * sy;
  const ox = sx + hero.w / 2;
  const oy = hero.y + hero.h;

  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(hero.facing * 1, 1);
  if (images.hero) {
    ctx.drawImage(images.hero, -drawW / 2, -drawH, drawW, drawH);
  } else {
    ctx.fillStyle = '#ef8a4a';
    ctx.fillRect(-drawW / 2, -drawH, drawW, drawH);
  }
  ctx.restore();
}

// S1: bileşen renk-kodlu debug çizimi (mimari-v2.md §S1).
//   solid=mavi · hazard=kırmızı · trigger=mor · decorative=gri kesik · invisible=sarı kesik
function strokeRectDashed(x, y, w, h, color) {
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}
function drawDebug(fps) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(8, 8, 290, 192);
  ctx.fillStyle = '#9effa0';
  ctx.font = '14px monospace';
  let y = 28;
  const line = (t) => { ctx.fillText(t, 16, y); y += 18; };
  line(`fps      ${fps.toFixed(0)}`);
  line(`state    ${state}`);
  line(`level    ${levelIndex} ${current.name}`);
  line(`pos      ${hero.x.toFixed(0)}, ${hero.y.toFixed(0)}`);
  line(`vel      ${hero.vx.toFixed(0)}, ${hero.vy.toFixed(0)}`);
  line(`onGround ${hero.onGround}`);
  line(`inverted ${inputInverted}  idle ${idleTime.toFixed(1)}`);
  line(`deaths   ${deaths}`);
  line(`Goatcha! — Motor v2 (S8) debug`);
  ctx.restore();

  ctx.lineWidth = 2;
  // Bileşenli entity'ler
  for (const e of current.entities) {
    if (!e.active) continue;
    const t = e.transform;
    const x = t.x - camX;
    const solid = e.collision && e.collision.solid;
    const haz = e.hazard;
    const trig = e.trigger;
    const dec = e.visual && !solid && !haz && !trig;
    const invis = !e.visual && (solid || haz);
    if (invis) { strokeRectDashed(x, t.y, t.w, t.h, '#ffe14d'); continue; }
    if (dec) { strokeRectDashed(x, t.y, t.w, t.h, '#9aa0a6'); continue; }
    if (trig) { ctx.strokeStyle = '#c46bff'; ctx.strokeRect(x, t.y, t.w, t.h); }
    if (solid) { ctx.strokeStyle = '#3aa0ff'; ctx.strokeRect(x, t.y, t.w, t.h); }
    if (haz) { ctx.strokeStyle = '#ff4d4d'; ctx.strokeRect(x, t.y, t.w, t.h); }
  }
  // Hero
  ctx.strokeStyle = '#00e0ff';
  ctx.strokeRect(hero.x - camX, hero.y, hero.w, hero.h);
}

function render(fps, frameDt) {
  shake.update(frameDt);
  particles.update(frameDt);
  flash.update(frameDt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  ctx.save();
  ctx.translate(shake.ox, shake.oy);

  drawEntities();
  drawHero();
  particles.draw(ctx, camX);

  ctx.restore(); // shake ofseti sona erdi

  // S7: yalan banner + sayaç (gerçek clear/alldone'dan AYRI sunum kanalı)
  drawCountdown(ctx, canvas.width, canvas.height);
  drawBanner(ctx, canvas.width, canvas.height);

  // Gerçek state overlay'leri
  if (state === 'clear') {
    drawClear(ctx, canvas.width, canvas.height, levelIndex, current.name);
  } else if (state === 'alldone' && screen !== 'alldone') {
    drawAllDone(ctx, canvas.width, canvas.height, deaths);
  }

  flash.draw(ctx, canvas.width, canvas.height);
  drawHUD(ctx, canvas.width, canvas.height, state, levelIndex, current.name, deaths, audio.muted);

  if (debug) drawDebug(fps);
}

// ─── S10: Kabuk / akış (menü ↔ oyun) ───────────────────────────────────────
function openMenu(name) {
  screen = name;
  paused = true;        // mantığı dondur (determinizm korunur)
  ui.show(name);
}
function enterGame() {
  screen = 'game';
  paused = false;
  input.consumeJump();  // menüde tamponlanan zıplama oyuna sızmasın
  ui.show(null);
}

// Belirli seviyeden temiz başla (run sayaçlarını sıfırla).
function startAt(i) {
  deaths = 0; levelDeaths = 0; resetHUD();
  levelStartMs = performance.now();
  loadLevel(i);
  enterGame();
}
function startFresh(force) {
  if (force) showAdIfNeeded(0, true);
  startAt(0);
}

function togglePause() {
  if (screen === 'game') openMenu('pause');
  else if (screen === 'pause') enterGame();
}

function updateMuteBtn() {
  const btn = document.getElementById('btn-mute');
  if (btn) btn.textContent = audio.muted ? '🔇' : '🔊';
}

// Menü/akış kabuğunu kur: ui callback'leri + köşe butonları + Esc/P + gamepad Start.
function setupShell() {
  ui.init({
    onContinue: () => startAt(storage.unlocked),
    onNewGame: () => { if (!storage.seenHowTo) openMenu('howto'); else startFresh(false); },
    onHowToDone: () => { storage.markHowToSeen(); startFresh(false); },
    onPickLevel: (i) => startAt(i),
    onResume: () => enterGame(),
    onRestartLevel: () => { levelDeaths = 0; levelStartMs = performance.now(); loadLevel(levelIndex); enterGame(); },
    onQuitToMenu: () => openMenu('title'),
    onReplayAll: () => startFresh(true),
    onSetVolume: (v) => {
      audio.setVolume(v); storage.setVolume(v);
      if (v > 0 && audio.muted) { audio.setMuted(false); storage.setMuted(false); }
      updateMuteBtn();
    },
    onToggleMute: (b) => { audio.setMuted(b); storage.setMuted(b); updateMuteBtn(); },
    onResetProgress: () => storage.resetProgress(),
  }, { levels, storage, audio });

  const mute = document.getElementById('btn-mute');
  if (mute) mute.onclick = () => { audio.setMuted(!audio.muted); storage.setMuted(audio.muted); updateMuteBtn(); };
  const pz = document.getElementById('btn-pause');
  if (pz) pz.onclick = () => togglePause();

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' || e.code === 'KeyP') { e.preventDefault(); togglePause(); }
  });

  updateMuteBtn();
}

// Gamepad Start (buton 9) ile duraklat-aç (kenar tetikleme).
let _padMenuPrev = false;
function pollPadMenu() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let start = false;
  for (const p of pads) { if (p && p.buttons[9] && p.buttons[9].pressed) start = true; }
  if (start && !_padMenuPrev) togglePause();
  _padMenuPrev = start;
}

// --- Döngü ---
let paused = false;
let accumulator = 0;
let last = performance.now();
let fpsEMA = 60;

function frame(now) {
  let frameTime = (now - last) / 1000;
  last = now;
  if (frameTime > MAX_FRAME) frameTime = MAX_FRAME;

  if (frameTime > 0) fpsEMA = fpsEMA * 0.9 + (1 / frameTime) * 0.1;

  input.update();
  pollPadMenu();

  if (!paused) {
    accumulator += frameTime;
    while (accumulator >= FIXED_DT) {
      fixedUpdate(FIXED_DT);
      accumulator -= FIXED_DT;
    }
  } else {
    accumulator = 0;
  }

  smoothCamera(frameTime);   // S11: sunumda yumuşak takip (yükleme/ölümde snapCamera anında konumlar)
  try {
    render(fpsEMA, frameTime);
  } catch (err) {
    console.error('render hata:', err);
    throw err;
  }
  if (debug) {
    window.__game = { state, levelIndex, hero, deaths, camX, fps: fpsEMA, inverted: inputInverted, frames: (window.__game?.frames || 0) + 1 };
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
      inverted: inputInverted, idle: +idleTime.toFixed(2), deaths,
    }),
    ent: (id) => { const e = entityById(id); return e ? { x: Math.round(e.transform.x), y: Math.round(e.transform.y), active: e.active } : null; },
    solids: () => buildSolids().map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h, tags: s.ref.tags })),
    teleport: (x, y, vx = 0, vy = 0) => { hero.x = x; hero.y = y; hero.vx = vx; hero.vy = vy; hero.onGround = false; },
    press: (code, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code })),
    pause: (v) => { paused = v; },
    step: (n = 1) => { for (let i = 0; i < n; i++) { input.update(); fixedUpdate(FIXED_DT); } },
  };
}

// --- Playgama Bridge Entegrasyonu ---
function setupBridgeEvents() {
  if (!window.bridge) return;
  window.bridge.on('interstitial_state_changed', (s) => {
    if (s === 'opened') {
      paused = true;
      audio.setAdMute(true);
    } else if (s === 'closed' || s === 'failed') {
      audio.setAdMute(false);
      if (screen === 'game') paused = false;   // menüdeysek kapalı kalsın
    }
  });
}

function showAdIfNeeded(levelIdx, force = false) {
  // Bridge yoksa veya showInterstitial henüz mevcut değilse (lokal/portal-dışı) sessizce geç.
  if (!window.bridge || typeof window.bridge.showInterstitial !== 'function') return;
  if (force || (levelIdx > 0 && levelIdx % 3 === 0)) {
    window.bridge.showInterstitial();
  }
}

// --- Başlat ---
resize();
audio.applySettings(storage.settings);   // kayıtlı ses/mute ayarını uygula
setupShell();                            // menü kabuğu + butonlar + callback'ler
loadImages().then(() => {
  // İlk seviyenin script.onEnter'ı boot'ta da çalışsın (backdrop için yüklü dursun)
  if (current.script && current.script.onEnter) current.script.onEnter(gameCtx);
  // Oyun döngüsü hep döner ama başlık menüsüyle (paused) açılır — direkt oynanışa düşmez.
  const begin = () => { openMenu('title'); startGame(); };
  if (window.bridge) {
    window.bridge.initialize().then(() => {
      window.bridge.sendMessage('game_ready');
      setupBridgeEvents();
      begin();
    }).catch((e) => {
      console.warn('Bridge init failed:', e);
      begin();
    });
  } else {
    begin();
  }
});

function startGame() {
  updateCamera();
  last = performance.now();
  requestAnimationFrame(frame);
}
