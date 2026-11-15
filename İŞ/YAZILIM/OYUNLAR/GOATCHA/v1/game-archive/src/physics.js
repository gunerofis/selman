// physics.js — Yerçekimi, yürüme ivmesi/sürtünmesi ve AABB çarpışma çözümü.
// Sabit timestep ile çağrılır (dt sabit), bu yüzden hareket deterministik (§12.1).
//
// Çarpışma yaklaşımı: eksen-ayrık (önce X taşı+çöz, sonra Y taşı+çöz). Bu, köşe
// yapışmasını ve tünellemeyi önler.
//
// Session 3A: stepHero artık düz platform yerine ETİKETLİ "solid" listesi alır.
// Her solid: {x,y,w,h, kind, ref}. kind ∈ 'platform'|'fake'|'moving'. Hero bir solid'in
// ÜSTÜNE inince (vy>0) o solid'in ref'ine tetik bırakır (fake çöker, moving kayar).
// Yay (spring) burada DEĞİL — main.js'te tetik bölgesi olarak işlenir (katı değildir).

// --- Ayar (tuning) sabitleri — hepsi px ve px/sn cinsinden ---
export const PHYS = {
  gravity: 2600,        // px/sn²
  moveAccel: 9000,      // yatay ivme
  airAccel: 6000,       // havadayken biraz daha az kontrol
  maxRunSpeed: 420,     // yatay tavan hız
  groundFriction: 2400, // yerde tuş bırakınca yavaşlama
  airFriction: 400,     // havada hafif sürüklenme
  jumpSpeed: 980,       // zıplama başlangıç dikey hızı (yukarı = negatif)
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
      // İniş tetiği: sahte platform çökmeye başlar, hareketli blok kaymaya başlar.
      if (s.ref && (s.kind === 'fake' || s.kind === 'moving')) s.ref.triggered = true;
    } else if (hero.vy < 0) {
      hero.y = s.y + s.h;    // başını tavana vurdu
    }
    hero.vy = 0;
  }

  // Squash/stretch görseli yumuşakça 1'e dönsün
  hero.squash = approach(hero.squash, 1, 3 * dt);

  return jumped;
}

// Yay tetik kontrolü (main.js'ten, stepHero'dan SONRA çağrılır). Yay katı değildir;
// hero yay pedinin üstündeki platforma indiğinde stepHero vy'yi sıfırlar, bu yüzden
// "iniyor mu" kararı adımdan ÖNCEKİ düşüş hızıyla (fallVy) verilir; çakışma ise
// adım SONRASI konumla test edilir. Böylece yürüyüş titreşimi tetiklemez ama gerçek
// iniş (zıplayıp düşme) tetikler. Geri dönüş: fırlatma uygulandı mı (ses için, ileride).
export function trySpringLaunch(hero, springs, fallVy) {
  if (fallVy < PHYS.springMinFall) return false; // sadece gerçek inişte (yürüyüş ~0)
  for (const sp of springs) {
    if (aabbOverlap(hero, sp)) {
      hero.y = sp.y - hero.h;   // yayın üstüne hizala
      hero.vy = -PHYS.springSpeed;
      hero.onGround = false;
      hero.cutLock = true;      // değişken-yükseklik kesmesi uygulanmasın
      hero.squash = 1.35;       // belirgin stretch
      return true;
    }
  }
  return false;
}
