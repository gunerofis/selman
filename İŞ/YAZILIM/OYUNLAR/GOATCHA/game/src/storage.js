// storage.js — Kalıcı ilerleme + ayar kaydı (localStorage).
// Session 10. Gizli mod / kota dolu / engelli localStorage durumlarında SESSİZCE düşer
// (oyun asla bozulmaz; kayıt yoksa varsayılanlarla devam eder).
//
// Determinizm notu: Bu katman SADECE meta (kaç seviye açıldı, ayarlar). Oynanış
// mantığına (fixedUpdate) dokunmaz.

const KEY = 'goatcha.save.v1';

function defaults() {
  return {
    unlocked: 0,          // açılmış en yüksek seviye index'i (0 = sadece L1 açık)
    totalDeaths: 0,       // tüm zamanların toplam ölümü
    best: {},             // { [levelIndex]: { deaths, timeMs } } — seviye-başı en iyi
    seenHowTo: false,     // "nasıl oynanır" bir kez gösterildi mi
    settings: { volume: 1, muted: false },
  };
}

// Derin-ish birleştirme: kayıttaki eksik alanlar varsayılandan tamamlanır.
function merge(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  const out = { ...base, ...saved };
  out.settings = { ...base.settings, ...(saved.settings || {}) };
  out.best = { ...(saved.best || {}) };
  return out;
}

class Storage {
  constructor() {
    this._data = defaults();
    this._ok = false;
    try {
      const raw = localStorage.getItem(KEY);
      this._data = merge(defaults(), raw ? JSON.parse(raw) : null);
      this._ok = true;
    } catch (e) {
      console.warn('Kayıt okunamadı (varsayılanlarla devam):', e);
      this._data = defaults();
    }
  }

  _persist() {
    if (!this._ok) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(this._data));
    } catch (e) {
      this._ok = false; // bir kez başarısızsa bir daha denemeyelim
    }
  }

  // --- İlerleme ---
  get unlocked() { return this._data.unlocked; }
  get totalDeaths() { return this._data.totalDeaths; }
  get best() { return this._data.best; }
  get seenHowTo() { return this._data.seenHowTo; }
  hasProgress() { return this._data.unlocked > 0; }

  markHowToSeen() { this._data.seenHowTo = true; this._persist(); }

  // Seviye geçildiğinde: bir sonrakini aç + en iyi (ölüm/süre) kaydet.
  recordClear(levelIndex, levelDeaths, timeMs, levelCount) {
    const next = Math.min(levelIndex + 1, levelCount - 1);
    if (next > this._data.unlocked) this._data.unlocked = next;
    const prev = this._data.best[levelIndex];
    if (!prev || levelDeaths < prev.deaths || (levelDeaths === prev.deaths && timeMs < prev.timeMs)) {
      this._data.best[levelIndex] = { deaths: levelDeaths, timeMs };
    }
    this._persist();
  }

  addDeaths(n) { this._data.totalDeaths += n; this._persist(); }

  // --- Ayarlar ---
  get settings() { return this._data.settings; }
  setVolume(v) { this._data.settings.volume = Math.max(0, Math.min(1, v)); this._persist(); }
  setMuted(b) { this._data.settings.muted = !!b; this._persist(); }

  // Tüm ilerlemeyi sıfırla (ayarları korur).
  resetProgress() {
    const s = this._data.settings;
    this._data = defaults();
    this._data.settings = s;
    this._persist();
  }
}

export const storage = new Storage();
