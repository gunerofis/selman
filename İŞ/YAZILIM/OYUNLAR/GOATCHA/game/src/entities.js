// entities.js — Oyun varlıklarının çalışma-zamanı fabrikası.
//
// SESSION 8 (Motor v2): buildRuntimeLevel artık v1'in tip-dizili şemasını değil,
// mimari-v2.md §S1 **bileşen modelini** klonlar: her seviye `entities[]` (bileşenli
// varlık) + opsiyonel `script` taşır. Klonla-ve-sıfırla deseni korundu (ölünce/dönünce
// trigger/dynamic durumları reset edilir).
//
// KORUNAN ÇEKİRDEK: createHero / respawnHero (v1'den aynen, + S8 groundRef alanı).
// Tüm gövdeler AABB (eksen-hizalı dikdörtgen): {x, y, w, h}.

import { HERO_W, HERO_H } from './levels.js';

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
    groundRef: null,  // S8: bu adımda üstünde durulan solid entity (carry/launch dağıtımı)
    facing: 1,        // 1 = sağ (hero.png varsayılanı), -1 = sol (kodda flip)
    coyote: 0,        // coyote-time sayacı (sn)
    jumpBuffer: 0,    // jump-buffer sayacı (sn)
    cutLock: false,   // true iken değişken-zıplama kesmesi uygulanmaz (yay/launch fırlatması için)
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
  hero.groundRef = null;
  hero.facing = 1;
  hero.coyote = 0;
  hero.jumpBuffer = 0;
  hero.cutLock = false;
  hero.squash = 1;
}

// --- Bileşenli entity klonlama (mimari-v2.md §S1) ---
// transform/visual/collision/hazard değer-kopyalanır (mutable çalışma-zamanı).
// trigger handler'ları ve script ref ile taşınır (fonksiyonlar paylaşılır, state ayrık).
function cloneDynamic(d) {
  const nd = { driver: d.driver || 'auto', carry: !!d.carry };
  if (d.launch != null) nd.launch = d.launch;
  if (d.delay != null) nd.delay = d.delay;   // 'collapse' sürücüsü için (sahte platform çökme gecikmesi)
  // 'auto' motion preset'i: {move:[dx,dy], speed, range, delay, mode} → çalışma durumu eklenir
  if (d.motion) nd._auto = { ...d.motion, t: 0, _trav: 0, _dir: 1, started: d.motion.delay ? false : true };
  return nd;
}

function cloneEntity(e) {
  return {
    id: e.id || null,
    tags: e.tags ? [...e.tags] : [],
    transform: { ...e.transform },
    visual: e.visual ? { ...e.visual } : null,
    collision: e.collision ? { ...e.collision } : null,
    hazard: e.hazard ? { ...e.hazard } : null,
    trigger: e.trigger || null,          // handler nesnesi (onEnter/onStay/onExit) ref ile
    dynamic: e.dynamic ? cloneDynamic(e.dynamic) : null,
    active: e.active !== false,
    _isGoal: !!e._isGoal,
    // çalışma-zamanı durumu (her yüklemede sıfırlanır):
    _wasInside: false,                   // trigger zone enter/exit takibi
    _doorReached: false,                 // onDoorReach tek-atış
    _home: { x: e.transform.x, y: e.transform.y }, // reset için orijinal konum
  };
}

// Bir seviye VERİSİNİ alıp oynanabilir çalışma-zamanı kopyası üret (mimari-v2.md §S8).
// scriptState: script'in serbest scratch'i — JSON-klonlanır (her yüklemede taze başlangıç).
export function buildRuntimeLevel(def) {
  return {
    name: def.name,
    worldW: def.worldW,
    cameraMode: def.cameraMode || 'follow',  // S5: 'follow' | 'fixed'
    wrapX: !!def.wrapX,                        // S5: ekran sarması
    spawn: { x: def.spawn.x, y: def.spawn.y },
    solution: def.solution,
    entities: (def.entities || []).map(cloneEntity),
    script: def.script || null,               // S3: onEnter/onUpdate/onPlayerIdle/...
    scriptState: def.script && def.script.state
      ? JSON.parse(JSON.stringify(def.script.state))
      : {},
  };
}
