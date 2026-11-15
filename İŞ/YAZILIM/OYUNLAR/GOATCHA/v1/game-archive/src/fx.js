// fx.js — Görsel efektler: screen shake + partikül havuzu + seviye geçiş flash.
// Session 4: cila (polish). Performans bütçesi korunur (§6.5):
// sıfır-allocation hedefi, partikül havuzu (pool). Determinizm etkilenmez (§12.1).

// ─── Screen Shake ───────────────────────────────────────────────────────
// Sönümlü salınım. trigger() çağrıldığında kamera ofset üretir.
// Küçük genlik, okunabilirlik bozulmasın (session4.md §8 notu).

export const shake = {
  _intensity: 0,
  _duration: 0,
  _elapsed: 0,
  _active: false,
  ox: 0,  // kamera X ofseti (render'da kullanılır)
  oy: 0,  // kamera Y ofseti

  trigger(intensity = 5, duration = 0.22) {
    this._intensity = intensity;
    this._duration = duration;
    this._elapsed = 0;
    this._active = true;
  },

  update(dt) {
    if (!this._active) return;
    this._elapsed += dt;
    if (this._elapsed >= this._duration) {
      this._active = false;
      this.ox = 0;
      this.oy = 0;
      return;
    }
    // Sönümlenme: 1 → 0
    const t = 1 - this._elapsed / this._duration;
    const amp = this._intensity * t;
    // Hızlı sinüs titreşimi
    const freq = 35;
    this.ox = Math.sin(this._elapsed * freq) * amp;
    this.oy = Math.cos(this._elapsed * freq * 1.3) * amp * 0.6;
  },
};

// ─── Partikül Havuzu ─────────────────────────────────────────────────────
// Önceden tahsis edilmiş (pre-allocated) dizi, runtime'da new/push yok.

const POOL_SIZE = 40;

function createParticle() {
  return {
    active: false,
    x: 0, y: 0,
    vx: 0, vy: 0,
    life: 0, maxLife: 0,
    size: 0,
    color: '#fff',
  };
}

const pool = [];
for (let i = 0; i < POOL_SIZE; i++) pool.push(createParticle());

export const particles = {
  // Patlama efekti: belirtilen konumda count adet partikül yay.
  emit(x, y, count, color, opts) {
    const speed = (opts && opts.speed) || 180;
    const upward = opts && opts.upward;
    const small = opts && opts.small;
    const life = small ? 0.25 : 0.4;
    const sz = small ? 3 : 5;

    for (let i = 0, emitted = 0; i < POOL_SIZE && emitted < count; i++) {
      const p = pool[i];
      if (p.active) continue;
      p.active = true;
      p.x = x + (Math.random() - 0.5) * 16;
      p.y = y + (Math.random() - 0.5) * 8;
      const angle = upward
        ? -Math.PI / 2 + (Math.random() - 0.5) * 1.2   // yukarı yelpaze
        : Math.random() * Math.PI * 2;                  // tam daire
      const spd = speed * (0.5 + Math.random() * 0.5);
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.life = life + Math.random() * 0.15;
      p.maxLife = p.life;
      p.size = sz + Math.random() * 2;
      p.color = color;
      emitted++;
    }
  },

  update(dt) {
    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 600 * dt; // hafif yerçekimi
    }
  },

  draw(ctx, camX) {
    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i];
      if (!p.active) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      const sz = p.size * alpha;
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - camX - sz / 2, p.y - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
  },
};

// ─── Seviye Geçiş Flash ──────────────────────────────────────────────────
// clear state'inde beyaz overlay, alpha 1→0 easing.

export const flash = {
  _active: false,
  _elapsed: 0,
  _duration: 0.4,

  trigger(duration = 0.4) {
    this._active = true;
    this._elapsed = 0;
    this._duration = duration;
  },

  update(dt) {
    if (!this._active) return;
    this._elapsed += dt;
    if (this._elapsed >= this._duration) {
      this._active = false;
    }
  },

  draw(ctx, w, h) {
    if (!this._active) return;
    const t = this._elapsed / this._duration;
    // easeOutQuad
    const alpha = 1 - t * t;
    ctx.globalAlpha = alpha * 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  },
};
