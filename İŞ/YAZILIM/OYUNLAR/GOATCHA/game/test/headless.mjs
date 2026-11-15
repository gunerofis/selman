// headless.mjs — S11 doğrulama koşumcusu.
// Tarayıcı global'lerini stub'lar, GERÇEK src/main.js'i yükler ve `window.__test`
// üzerinden 12 seviyeyi reaktif kontrolcülerle sürer. Amaç: his ayarı sonrası
// (kamera/ölüm/PHYS) 12 seviyenin GEÇİLEBİLİRLİĞİNİ + DETERMİNİZMİ doğrulamak.
//
// Çalıştır:  cd game && node test/headless.mjs
//
// NOT: Bu, motorun sahnelenme (render) yolunu çalıştırmaz; fixedUpdate mantık yolunu
// (gerçek main.js fixedUpdate + ctx + script'ler) çalıştırır — yani __test.step ile
// tarayıcıdaki ile aynı mantık. Render/asset gerektirmez.

// ─────────────────────────────────────────────────────────────────────────────
// 1) Tarayıcı global stub'ları
// ─────────────────────────────────────────────────────────────────────────────
class Ev {
  constructor(type, opts = {}) { this.type = type; Object.assign(this, opts); }
  preventDefault() {}
  stopPropagation() {}
}
globalThis.KeyboardEvent = Ev;
globalThis.Event = Ev;

// Basit EventTarget (window için): addEventListener/dispatchEvent gerçek çalışsın.
function makeEventTarget(base = {}) {
  const listeners = new Map(); // type -> Set<{fn,once}>
  base.addEventListener = (type, fn, opts) => {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add({ fn, once: !!(opts && opts.once) });
  };
  base.removeEventListener = (type, fn) => {
    const s = listeners.get(type); if (!s) return;
    for (const e of s) if (e.fn === fn) s.delete(e);
  };
  base.dispatchEvent = (ev) => {
    const s = listeners.get(ev.type); if (!s) return true;
    for (const e of [...s]) { e.fn(ev); if (e.once) s.delete(e); }
    return true;
  };
  return base;
}

// Genel sahte DOM elemanı (Proxy): bilinmeyen metot → no-op, prop'lar saklanır.
function makeEl(tag = 'div') {
  const store = {
    tagName: (tag || 'div').toUpperCase(),
    style: {},
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    children: [],
    textContent: '', innerHTML: '', value: '0', checked: false,
    disabled: false, title: '', width: 0, height: 0,
  };
  store.appendChild = (c) => { store.children.push(c); return c; };
  store.removeChild = (c) => c;
  store.setAttribute = () => {};
  store.getAttribute = () => null;
  store.querySelectorAll = () => Object.assign([], { forEach: Array.prototype.forEach });
  store.querySelector = () => null;
  store.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1280, height: 720 });
  store.focus = () => {};
  makeEventTarget(store);
  store.getContext = () => makeCtx2d();
  return new Proxy(store, {
    get(t, k) { if (k in t) return t[k]; return () => {}; },
    set(t, k, v) { t[k] = v; return true; },
  });
}

// Sahte 2D context — render bu testte çağrılmaz ama güvenli olsun.
function makeCtx2d() {
  return new Proxy({}, {
    get(_t, k) {
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'createPattern') return () => ({});
      if (k === 'createLinearGradient' || k === 'createRadialGradient')
        return () => ({ addColorStop() {} });
      if (k === 'canvas') return canvasEl;
      return () => {};
    },
    set() { return true; },
  });
}

// Element cache (id başına tutarlı eleman).
const elCache = new Map();
const canvasEl = makeEl('canvas');
elCache.set('game', canvasEl);

const documentStub = makeEventTarget({
  getElementById: (id) => {
    if (!elCache.has(id)) elCache.set(id, makeEl());
    return elCache.get(id);
  },
  querySelectorAll: () => Object.assign([], { forEach: Array.prototype.forEach }),
  querySelector: () => null,
  createElement: (tag) => makeEl(tag),
  body: makeEl('body'),
});

class FakeAudioCtx {
  constructor() { this.state = 'running'; this.destination = {}; }
  createGain() { return { gain: { value: 1 }, connect() {} }; }
  createBufferSource() { return { buffer: null, loop: false, connect() {}, start() {} }; }
  resume() { return Promise.resolve(); }
  decodeAudioData() { return Promise.resolve({}); }
}
const windowStub = makeEventTarget({
  innerWidth: 1280, innerHeight: 720,
  AudioContext: FakeAudioCtx, webkitAudioContext: FakeAudioCtx,
  bridge: undefined,
  devicePixelRatio: 1,
});

function defineGlobal(name, value) {
  try { Object.defineProperty(globalThis, name, { value, configurable: true, writable: true }); }
  catch { globalThis[name] = value; }
}
globalThis.window = windowStub;
globalThis.document = documentStub;
defineGlobal('navigator', { getGamepads: () => [], userAgent: 'node' });
defineGlobal('location', { search: '?debug=1', href: 'http://localhost/?debug=1' });
globalThis.requestAnimationFrame = () => 0;   // döngü auto-çalışmasın; __test.step ile sürülür
globalThis.cancelAnimationFrame = () => {};
globalThis.fetch = () => Promise.resolve({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)) });

const _ls = new Map();
globalThis.localStorage = {
  getItem: (k) => (_ls.has(k) ? _ls.get(k) : null),
  setItem: (k, v) => _ls.set(k, String(v)),
  removeItem: (k) => _ls.delete(k),
  clear: () => _ls.clear(),
};

globalThis.Image = class {
  constructor() { this.onload = null; this.onerror = null; this._src = ''; }
  set src(v) { this._src = v; queueMicrotask(() => this.onload && this.onload()); }
  get src() { return this._src; }
};

// window.* sık erişilen alanlar global'de de bulunsun (bazı kodlar window. ile erişiyor).
windowStub.localStorage = globalThis.localStorage;

// ─────────────────────────────────────────────────────────────────────────────
// 2) main.js'i yükle (stub'lar yerinde) ve init'i bekle
// ─────────────────────────────────────────────────────────────────────────────
await import('../src/main.js');
await new Promise((r) => setTimeout(r, 80));   // loadImages().then(begin) tamamlansın

const T = window.__test;
if (!T) { console.error('HATA: window.__test yok (debug kancası kurulmadı)'); process.exit(1); }

// PHYS override (deneysel süpürme için): JUMP=1060 node test/headless.mjs
const { PHYS } = await import('../src/physics.js');
if (process.env.JUMP) PHYS.jumpSpeed = +process.env.JUMP;
if (process.env.GRAV) PHYS.gravity = +process.env.GRAV;
if (process.env.RUN) PHYS.maxRunSpeed = +process.env.RUN;
if (process.env.JUMP || process.env.GRAV || process.env.RUN)
  console.log(`[PHYS override] jump=${PHYS.jumpSpeed} grav=${PHYS.gravity} run=${PHYS.maxRunSpeed}`);

// ─────────────────────────────────────────────────────────────────────────────
// 3) Girdi sürücüsü + reaktif kontrolcüler
// ─────────────────────────────────────────────────────────────────────────────
const pressed = new Set();
function setKey(code, down) {
  const is = pressed.has(code);
  if (down && !is) { pressed.add(code); T.press(code, true); }
  else if (!down && is) { pressed.delete(code); T.press(code, false); }
}
function applyDesired(d) {
  setKey('ArrowRight', !!d.right);
  setKey('ArrowLeft', !!d.left);
  setKey('Space', !!d.jump);
}
function releaseAll() { for (const c of [...pressed]) setKey(c, false); }

// Reaktif "koşucu": dir yönüne git, verilen x-pencerelerinde zıpla (apex'e kadar tut).
function runner({ dir = 1, jumpAt = [], useInvert = false, hold = 46 }) {
  let jt = 0, fired = [];
  return (s) => {
    const out = { left: false, right: false, jump: false };
    let go = dir;
    if (useInvert && s.inverted) go = -go;
    if (go > 0) out.right = true; else out.left = true;
    if (jt > 0) { out.jump = true; jt--; }
    if (s.hero.onGround) {
      for (let i = 0; i < jumpAt.length; i++) {
        const [lo, hi] = jumpAt[i];
        if (!fired[i] && s.hero.x >= lo && s.hero.x <= hi) { out.jump = true; jt = hold; fired[i] = true; break; }
      }
    }
    return out;
  };
}

function drive(levelIndex, controller, maxSteps = 2000) {
  releaseAll();
  T.load(levelIndex);
  let trace = 0;
  for (let i = 0; i < maxSteps; i++) {
    const s = T.snap();
    if (s.state === 'clear') return { ok: true, steps: i, s };
    if (s.state === 'dead') return { ok: false, steps: i, s, reason: 'ÖLDÜ' };
    applyDesired(controller(s, i) || {});
    T.step(1);
    trace ^= (Math.round(s.hero.x) * 31 + Math.round(s.hero.y) * 7 + i);
  }
  releaseAll();
  const s = T.snap();
  return { ok: s.state === 'clear', steps: maxSteps, s, reason: 'ZAMAN AŞIMI', trace };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) Seviye kontrolcüleri (level_tasarimlari.md çözümlerine göre)
// ─────────────────────────────────────────────────────────────────────────────
const idle = () => () => ({});                             // hiç girdi (fabrika)
const goLeft = () => () => ({ left: true });
const goRight = () => () => ({ right: true });

// L8 "Pac-Man": sağa koş, uçurumdan düş → script sol-üste sarar → kapıya (x80-195) homing.
function l8controller() {
  let wrapped = false, prevX = 820;
  return (s) => {
    const x = s.hero.x;
    if (!wrapped && prevX > 900 && x < 300) wrapped = true;  // sarma algıla
    prevX = x;
    if (!wrapped) return { right: true };
    if (!s.hero.onGround) return {};            // düşerken serbest bırak
    if (x > 150) return { left: true };          // kapıya (80-195) homing
    if (x < 90) return { right: true };
    return {};
  };
}
// L9 "Sabırsızın Sonu": sola yürü → dekoratif zeminden düş → alt yolda gerçek kapıya (x200-315) homing.
function l9controller() {
  return (s) => {
    if (s.hero.y < 450) return { left: true };   // üst platformdan sola yürü → düş
    if (s.hero.x < 200) return { right: true };  // alt yolda kapıya homing
    if (s.hero.x > 315) return { left: true };
    return {};
  };
}

const PLAN = [
  { i: 0,  name: 'Utangaç Kapı',   c: idle,                                                          max: 1400 },
  { i: 1,  name: 'Ters Psikoloji', c: () => runner({ jumpAt: [[600, 690]] }),                        max: 1200 },
  { i: 2,  name: 'Görünmez Güv.',  c: () => runner({ jumpAt: [[470, 545]] }),                        max: 1400 },
  { i: 3,  name: 'Güvenli Diken',  c: () => runner({ jumpAt: [[180, 215], [580, 615], [980, 1015]] }), max: 1600 },
  { i: 4,  name: 'Bozuk Klavye',   c: () => runner({ useInvert: true, jumpAt: [[1062, 1080]] }),      max: 1800 },
  { i: 5,  name: 'Sahte Zafer',    c: () => runner({ jumpAt: [[1010, 1095]] }),                       max: 1600 },
  { i: 6,  name: 'Hareketli Zem.', c: () => runner({ jumpAt: [[300, 330], [430, 470]] }),             max: 1600 },
  { i: 7,  name: 'Pac-Man',        c: l8controller,                                                  max: 2000 },
  { i: 8,  name: 'Sabırsızın Sonu', c: l9controller,                                                 max: 1400 },
  { i: 9,  name: 'Yerden Gelen',   c: () => runner({ jumpAt: [[485, 515]] }),                         max: 1600 },
  { i: 10, name: 'Koşan Kapı',     c: goLeft,                                                         max: 1400 },
  { i: 11, name: 'Büyük Final',    c: goRight,                                                        max: 1800 },
];

// ─── BF modu: L5 iki-diken iki-zıplama çözüm araması (BF=1 node test/headless.mjs) ──
if (process.env.BF) {
  // Strateji: gaz alanını ters-kontrolle geç; sonra spike1'den önce L1'de zıpla,
  // boşluğa in, spike2'den önce tekrar zıpla. L1 ve ikinci zıplama tetiğini tara.
  let best = null;
  for (let L1 = 1040; L1 <= 1180; L1 += 1) {
    for (let J2 = 1180; J2 <= 1320; J2 += 1) {
      releaseAll(); T.load(4);
      let j1 = false, j2 = false, jt = 0, ok = false, died = false;
      for (let i = 0; i < 600; i++) {
        const s = T.snap();
        if (s.state === 'clear') { ok = true; break; }
        if (s.state === 'dead') { died = true; break; }
        const out = { left: false, right: false, jump: false };
        let go = 1; if (s.inverted) go = -go;
        if (go > 0) out.right = true; else out.left = true;
        if (jt > 0) { out.jump = true; jt--; }
        if (s.hero.onGround) {
          if (!j1 && s.hero.x >= L1) { out.jump = true; jt = 50; j1 = true; }
          else if (j1 && !j2 && s.hero.x >= J2) { out.jump = true; jt = 50; j2 = true; }
        }
        applyDesired(out); T.step(1);
      }
      if (ok) { best = { L1, J2 }; break; }
    }
    if (best) break;
  }
  console.log('L5 brute-force:', best ? `ÇÖZÜM VAR L1=${best.L1} J2=${best.J2}` : 'ÇÖZÜM YOK (iki-zıplama)');
  process.exit(0);
}

// ─── WIN modu: L5 tek-zıplama liftoff tolerans penceresi (WIN=1 JUMP=.. node ..) ──
if (process.env.WIN) {
  const oks = [];
  for (let L1 = 1000; L1 <= 1180; L1 += 1) {
    releaseAll(); T.load(4);
    let j1 = false, jt = 0, ok = false;
    for (let i = 0; i < 600; i++) {
      const s = T.snap();
      if (s.state === 'clear') { ok = true; break; }
      if (s.state === 'dead') break;
      const out = { left: false, right: false, jump: false };
      if (s.inverted) out.left = true; else out.right = true;
      if (jt > 0) { out.jump = true; jt--; }
      if (s.hero.onGround && !j1 && s.hero.x >= L1) { out.jump = true; jt = 55; j1 = true; }
      applyDesired(out); T.step(1);
    }
    if (ok) oks.push(L1);
  }
  const w = oks.length;
  console.log(`L5 tek-zıplama geçer liftoff aralığı: ${w ? `${oks[0]}..${oks[w - 1]} (${w}px ≈ ${(w / 3.5).toFixed(0)} kare)` : 'YOK'}`);
  process.exit(0);
}

// ─── L7 modu: ilk-zıplama (zemin→b1) iniş toleransı, liftoff×hold 2B taraması ──
// b1 = x380-520 (top616). launcher 'mid' x600-720 (basınca ölüm). Tam zıplama b1'i
// aşıp launcher'a düşürürse → S11 buff'ının yan etkisi. JUMP=.. ile karşılaştırılabilir.
if (process.env.L7) {
  let onB1 = 0, onLauncher = 0, inGap = 0, total = 0;
  const landRows = [];
  for (let L1 = 250; L1 <= 360; L1 += 2) {
    for (let hold = 8; hold <= 55; hold += 1) {
      releaseAll(); T.load(6);
      let jt = 0, jumped = false, landedX = null, onMid = false;
      for (let i = 0; i < 240; i++) {
        const s = T.snap();
        if (s.state !== 'play') break;
        const out = { right: true, jump: false };
        if (jt > 0) { out.jump = true; jt--; }
        if (s.hero.onGround && !jumped && s.hero.x >= L1) { out.jump = true; jt = hold; jumped = true; }
        // ilk zıplamadan sonra ilk yere-iniş
        if (jumped && jt === 0 && s.hero.onGround && landedX === null && i > 5) {
          landedX = s.hero.x;
          onMid = (s.hero.groundRef !== null); // mid'e inerse script onu öldürür; konumla bak
          break;
        }
        applyDesired(out); T.step(1);
      }
      if (landedX !== null) {
        total++;
        if (landedX > 360 && landedX + 72 > 380 && landedX < 520) onB1++;
        else if (landedX + 72 > 600 && landedX < 720) onLauncher++;
        else inGap++;
      }
    }
  }
  console.log(`\nL7 ilk-zıplama (zemin→b1) iniş dağılımı [jump=${PHYS.jumpSpeed}]:`);
  console.log(`  toplam denenen=${total}  b1'e indi=${onB1}  launcher'a(ölüm)=${onLauncher}  boşluk/diğer=${inGap}`);
  console.log(`  → b1 oranı: ${(100 * onB1 / total).toFixed(0)}%  (yüksek = adil/forgiving)`);
  process.exit(0);
}

// ─── AUDIT modu: S12 adalet denetimi (AUDIT=1 node test/headless.mjs) ─────────
// Her seviyenin kritik zıplamasının liftoff TOLERANS penceresini ölçer (kaç px / kare
// hata payı). Dar pencere = "haksız/aşırı-tight". L5 gibi sorunları yakalar.
function runWithTriggers(levelIdx, triggers, useInvert, maxSteps) {
  releaseAll(); T.load(levelIdx);
  const fired = triggers.map(() => false);
  let jt = 0;
  for (let i = 0; i < maxSteps; i++) {
    const s = T.snap();
    if (s.state === 'clear') return true;
    if (s.state === 'dead') return false;
    const out = { left: false, right: false, jump: false };
    let go = 1; if (useInvert && s.inverted) go = -1;
    if (go > 0) out.right = true; else out.left = true;
    if (jt > 0) { out.jump = true; jt--; }
    if (s.hero.onGround) {
      for (let k = 0; k < triggers.length; k++) {
        if (!fired[k] && s.hero.x >= triggers[k]) { out.jump = true; jt = 55; fired[k] = true; break; }
      }
    }
    applyDesired(out); T.step(1);
  }
  return T.snap().state === 'clear';
}
function sweepWindow(levelIdx, baseTriggers, slot, lo, hi, useInvert, maxSteps = 1600) {
  const oks = [];
  for (let P = lo; P <= hi; P++) {
    const trig = [...baseTriggers]; trig[slot] = P;
    if (runWithTriggers(levelIdx, trig, useInvert, maxSteps)) oks.push(P);
  }
  if (!oks.length) return { w: 0, lo: null, hi: null };
  return { w: oks.length, lo: oks[0], hi: oks[oks.length - 1] };
}
if (process.env.AUDIT) {
  // Her satır: seviye, kritik zıplama açıklaması, sweep aralığı, taban tetikler, slot.
  const AUD = [
    { i: 1, d: 'L2 butonu aşan zıplama', base: [500], slot: 0, lo: 440, hi: 700, inv: false },
    { i: 2, d: 'L3 yay pad’ini aşan zıplama', base: [500], slot: 0, lo: 420, hi: 560, inv: false },
    { i: 3, d: 'L4 boşluk-1 (260-460)', base: [195, 595, 995], slot: 0, lo: 130, hi: 260, inv: false },
    { i: 3, d: 'L4 boşluk-2 (660-860)', base: [195, 595, 995], slot: 1, lo: 520, hi: 660, inv: false },
    { i: 3, d: 'L4 boşluk-3 (1060-1260)', base: [195, 595, 995], slot: 2, lo: 920, hi: 1060, inv: false },
    { i: 4, d: 'L5 iki diken (sabit, S11)', base: [1066], slot: 0, lo: 1000, hi: 1180, inv: true },
    { i: 5, d: 'L6 duvarı (x1100,h120) aşma', base: [1040], slot: 0, lo: 940, hi: 1100, inv: false },
    { i: 6, d: 'L7 1.zıplama (zemin→b1)', base: [300, 450], slot: 0, lo: 250, hi: 380, inv: false },
    { i: 6, d: 'L7 b1→b3 uzun atlama (ortayı atla)', base: [300, 450], slot: 1, lo: 380, hi: 540, inv: false },
    { i: 9, d: 'L10 fırlayan dikeni (x612) aşma', base: [500], slot: 0, lo: 420, hi: 560, inv: false },
  ];
  console.log('\n=== S12 ADALET DENETİMİ — kritik zıplama tolerans pencereleri ===');
  console.log('(pencere = geçer liftoff x aralığı; kare ≈ px/3.5; <5 kare = TIGHT, =0 = İMKÂNSIZ)\n');
  for (const a of AUD) {
    const r = sweepWindow(a.i, a.base, a.slot, a.lo, a.hi, a.inv);
    const frames = r.w / 3.5;
    const flag = r.w === 0 ? '❌ İMKÂNSIZ' : frames < 5 ? '⚠️  TIGHT' : '✅ ok';
    console.log(`${flag.padEnd(12)} ${a.d.padEnd(38)} pencere=${String(r.w).padStart(3)}px ≈ ${frames.toFixed(1).padStart(4)} kare` + (r.w ? `  [${r.lo}..${r.hi}]` : ''));
  }
  process.exit(0);
}

// ─── PROBE modu: PROBE=<idx> [DIR=left] node test/headless.mjs ───────────────
if (process.env.PROBE != null) {
  const idx = +process.env.PROBE;
  const dir = process.env.DIR === 'left' ? { left: true } : { right: true };
  releaseAll(); T.load(idx);
  console.log(`PROBE L${idx + 1} dir=${process.env.DIR || 'right'}`);
  for (let i = 0; i < (+process.env.STEPS || 400); i++) {
    const s = T.snap();
    if (i % 8 === 0 || s.state !== 'play')
      console.log(`  i=${String(i).padStart(3)} state=${s.state} x=${s.hero.x} y=${s.hero.y} vx=${s.hero.vx} vy=${s.hero.vy} g=${s.hero.onGround} inv=${s.inverted}`);
    if (s.state !== 'play') break;
    applyDesired(dir);
    T.step(1);
  }
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5) Koş + raporla
// ─────────────────────────────────────────────────────────────────────────────
let pass = 0;
const fails = [];
console.log('\n=== 12 SEVİYE GEÇİLEBİLİRLİK (headless, gerçek main.js) ===');
for (const p of PLAN) {
  const controller = p.c();            // her seviye için taze-state kontrolcü
  const r = drive(p.i, controller, p.max);
  const tag = r.ok ? 'GEÇTİ ' : 'KALDI ';
  console.log(
    `L${String(p.i + 1).padStart(2)} ${tag} ${p.name.padEnd(16)} ` +
    `adım=${String(r.steps).padStart(4)} state=${r.s.state} ` +
    `hero=(${r.s.hero.x},${r.s.hero.y})` + (r.ok ? '' : `  ← ${r.reason}`)
  );
  if (r.ok) pass++; else fails.push(p.i + 1);
}
console.log(`\nSonuç: ${pass}/12 geçildi` + (fails.length ? `  | KALAN: L${fails.join(', L')}` : ''));

// ─────────────────────────────────────────────────────────────────────────────
// 6) Determinizm: L7 (Pac-Man değil, jump-yoğun) iki kez aynı girdi → aynı sonuç
// ─────────────────────────────────────────────────────────────────────────────
function fingerprint(levelIndex, controller, steps) {
  releaseAll(); T.load(levelIndex);
  let h = 2166136261;
  for (let i = 0; i < steps; i++) {
    const s = T.snap();
    applyDesired(controller(s, i) || {});
    T.step(1);
    h = (h ^ (Math.round(s.hero.x) + Math.round(s.hero.y) * 65537 + Math.round(s.hero.vx) * 13)) >>> 0;
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}
const dctrlA = runner({ jumpAt: [[300, 330], [430, 470]] });
const dctrlB = runner({ jumpAt: [[300, 330], [430, 470]] });
const f1 = fingerprint(6, dctrlA, 400);
const f2 = fingerprint(6, dctrlB, 400);
console.log(`\nDeterminizm (L7, 400 adım): ${f1 === f2 ? 'TUTARLI' : 'BOZUK'} (f1=${f1} f2=${f2})`);

process.exit(fails.length === 0 && f1 === f2 ? 0 : 2);
