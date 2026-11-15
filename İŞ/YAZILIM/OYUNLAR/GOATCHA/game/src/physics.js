// physics.js — Yerçekimi, yürüme ivmesi/sürtünmesi ve AABB çarpışma çözümü.
// Sabit timestep ile çağrılır (dt sabit), bu yüzden hareket deterministik (§12.1).
//
// Çarpışma yaklaşımı: eksen-ayrık (önce X taşı+çöz, sonra Y taşı+çöz). Bu, köşe
// yapışmasını ve tünellemeyi önler.
//
// stepHero ETİKETLİ "solid" listesi alır. Her solid: {x,y,w,h, kind, ref}.
// ⚠️ SESSION 7: Eski tip-özel iniş tetiği (fake çökme / moving kayma — `s.ref.triggered`)
// KALDIRILDI; o tuzak sistemi v1'e aitti. v2'de iniş, `collision.onLand` / `dynamic`
// bileşenine genelleştirilecek (mimari-v2.md §S4 + yeniden-kullanım haritası). `kind`/
// `ref` alanları o genel dağıtım için seam olarak korunur (şu an placeholder'da hep
// 'platform'). Yay fırlatması da v2'de bir `trigger.onEnter` preset'i olacak (§S2).

// --- Ayar (tuning) sabitleri — hepsi px ve px/sn cinsinden ---
export const PHYS = {
  gravity: 2600,        // px/sn²
  moveAccel: 9000,      // yatay ivme
  airAccel: 6000,       // havadayken biraz daha az kontrol
  maxRunSpeed: 420,     // yatay tavan hız
  groundFriction: 2400, // yerde tuş bırakınca yavaşlama
  airFriction: 400,     // havada hafif sürüklenme
  jumpSpeed: 1070,      // zıplama başlangıç dikey hızı (yukarı = negatif)
                        // S11: 980→1070. Sebep: L5'in iki dikeni (x1180&1320, 140px arayla)
                        // 980'de tek max-zıplamayla geçilemiyordu (havada-kalış penceresi
                        // 262px < gereken 270px) ve aradaki boşluğa temiz iniş de imkânsızdı
                        // → seviye matematiksel olarak GEÇİLEMEZDİ. 1070, tek zıplamayla iki
                        // dikeni geçmeye ~7 karelik (insancıl) tolerans penceresi verir; 12/12
                        // geçilebilirlik headless test ile doğrulandı (test/headless.mjs).
                        // apex 184→220px (+%19). Determinizm korunur (sabit, rastgelelik yok).
  maxFallSpeed: 1400,   // terminal düşüş hızı (tünelleme önlemi)
  coyoteTime: 0.10,     // yerden ayrıldıktan sonra zıplama izni (sn)
  jumpBufferTime: 0.12, // yere inmeden önce basılan zıplamayı hatırla (sn)
  cutJumpFactor: 0.45,  // zıpla tuşu erken bırakılınca yükselişi kes (değişken yükseklik)
  springSpeed: 1500,    // yay fırlatma dikey hızı (zıplamadan çok yüksek; sabit)
  springMinFall: 60,    // yay ancak hero bu hızla (veya daha hızlı) inerken tetiklenir
};

// İki AABB çakışıyor mu?
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function approach(value, target, delta) {
  if (value < target) return Math.min(value + delta, target);
  if (value > target) return Math.max(value - delta, target);
  return value;
}

// Hero'yu bir adım ilerlet. input: {left,right,jumpHeld,jumpPressed}.
// solids: etiketli katı AABB listesi {x,y,w,h,kind,ref}. dt: sabit adım süresi (sn).
// Geri dönüş: bu adımda zıplama tetiklendi mi (ses için, ileride).
export function stepHero(hero, input, solids, dt) {
  let jumped = false;

  // --- Yatay ivme / sürtünme ---
  const accel = hero.onGround ? PHYS.moveAccel : PHYS.airAccel;
  if (input.left && !input.right) {
    hero.vx = approach(hero.vx, -PHYS.maxRunSpeed, accel * dt);
    hero.facing = -1;
  } else if (input.right && !input.left) {
    hero.vx = approach(hero.vx, PHYS.maxRunSpeed, accel * dt);
    hero.facing = 1;
  } else {
    const fric = hero.onGround ? PHYS.groundFriction : PHYS.airFriction;
    hero.vx = approach(hero.vx, 0, fric * dt);
  }

  // --- Coyote-time & jump-buffer sayaçları ---
  if (hero.onGround) hero.coyote = PHYS.coyoteTime;
  else hero.coyote = Math.max(0, hero.coyote - dt);

  if (input.jumpPressed) hero.jumpBuffer = PHYS.jumpBufferTime;
  else hero.jumpBuffer = Math.max(0, hero.jumpBuffer - dt);

  // --- Zıplama (tek zıplama): buffer dolu + coyote içinde ---
  if (hero.jumpBuffer > 0 && hero.coyote > 0) {
    hero.vy = -PHYS.jumpSpeed;
    hero.onGround = false;
    hero.coyote = 0;
    hero.jumpBuffer = 0;
    hero.cutLock = false; // normal zıplamada değişken yükseklik AKTİF
    hero.squash = 1.18;   // hafif stretch
    jumped = true;
  }

  // Değişken zıplama yüksekliği: tuş erken bırakılırsa yükselişi kıs.
  // cutLock (yay fırlatması) sırasında uygulanmaz → tutarlı yüksek sıçrama.
  if (!input.jumpHeld && hero.vy < 0 && !hero.cutLock) {
    hero.vy *= PHYS.cutJumpFactor;
  }

  // --- Yerçekimi ---
  hero.vy = Math.min(hero.vy + PHYS.gravity * dt, PHYS.maxFallSpeed);
  // Tepe noktasından sonra (düşüşe geçince) cutLock serbest.
  if (hero.vy >= 0) hero.cutLock = false;

  // --- Hareket + çarpışma: önce X, sonra Y ---
  hero.onGround = false;
  hero.groundRef = null; // S8: bu adımda üstüne konulan solid'in ref'i (carry/launch için)

  // X ekseni
  hero.x += hero.vx * dt;
  for (const s of solids) {
    if (!aabbOverlap(hero, s)) continue;
    if (hero.vx > 0) {
      hero.x = s.x - hero.w; // sağdan çarptı → sol kenara yasla
    } else if (hero.vx < 0) {
      hero.x = s.x + s.w;    // soldan çarptı → sağ kenara yasla
    }
    hero.vx = 0;
  }

  // Y ekseni
  hero.y += hero.vy * dt;
  for (const s of solids) {
    if (!aabbOverlap(hero, s)) continue;
    if (hero.vy > 0) {
      hero.y = s.y - hero.h; // düşerken üstüne kondu
      hero.onGround = true;
      hero.groundRef = s.ref; // S8: carry/launch dağıtımı bu ref üzerinden (mimari-v2.md §S4)
    } else if (hero.vy < 0) {
      hero.y = s.y + s.h;    // başını tavana vurdu
    }
    hero.vy = 0;
  }

  // Squash/stretch görseli yumuşakça 1'e dönsün
  hero.squash = approach(hero.squash, 1, 3 * dt);

  return jumped;
}

// ⚠️ SESSION 7: `trySpringLaunch` KALDIRILDI (eski yay tuzağı, v1 levels.js'e bağlıydı).
// Tam kopyası `game-v1-archive/src/physics.js` içinde. v2'de yay, genel bir
// `trigger.onEnter` preset'i olarak yeniden kurulacak (mimari-v2.md §S2/§S4).
// `PHYS.springSpeed` / `PHYS.springMinFall` o yeniden kurulum için tuning olarak korunur.
