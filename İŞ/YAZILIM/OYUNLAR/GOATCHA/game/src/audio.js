// audio.js — Web Audio API ses motoru. Session 4: sfx + müzik + mute.
//
// Mimari (session4.md): Web Audio tercih (düşük gecikme, çakışan sesler).
// İlk kullanıcı girdisinde AudioContext.resume() → autoplay engeli aşılır.
// Ses/cila SADECE sunum; mantık (fixedUpdate) etkilenmez (§12.1).

const ASSETS = {
  jump:  'assets/sfx_jump.mp3',
  death: 'assets/sfx_death.mp3',
  trap:  'assets/sfx_trap.mp3',
  music: 'assets/music_main.m4a',
};

// Ses seviyeleri (0-1)
const GAIN = {
  jump:  0.5,
  death: 0.6,
  trap:  0.5,
  music: 0.22,   // müzik alçak — sfx bastırılmasın
};

class AudioBus {
  constructor() {
    this._ctx = null;       // AudioContext — ilk girdide oluşturulur
    this._buffers = {};     // name → AudioBuffer
    this._masterGain = null;
    this._musicGain = null;
    this._musicSource = null;
    this._muted = false;
    this._adMuted = false;
    this._unlocked = false;
    this._loaded = false;
    this._volume = 1;       // kullanıcı ses seviyesi (0-1) — S10 ayarlar
  }

  // İlk kullanıcı girdisinde çağrılır (keydown/touchstart/gamepadbutton).
  // AudioContext oluştur, buffer'ları yükle, müziği başlat.
  async unlock() {
    if (this._unlocked) return;
    this._unlocked = true;

    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.connect(this._ctx.destination);
      this._musicGain = this._ctx.createGain();
      this._musicGain.gain.value = GAIN.music;
      this._musicGain.connect(this._masterGain);

      if (this._ctx.state === 'suspended') {
        await this._ctx.resume();
      }

      // Buffer'ları paralel yükle
      const entries = Object.entries(ASSETS);
      await Promise.all(entries.map(async ([name, src]) => {
        try {
          const resp = await fetch(src);
          const buf = await resp.arrayBuffer();
          this._buffers[name] = await this._ctx.decodeAudioData(buf);
        } catch (e) {
          console.warn('Ses yüklenemedi:', name, e);
        }
      }));

      this._loaded = true;
      this._updateGain();   // kayıtlı mute/volume ayarını uygula (S10)
      this._startMusic();
    } catch (e) {
      console.warn('AudioContext oluşturulamadı:', e);
    }
  }

  // SFX çal — her çağrıda yeni source (çakışan sesler desteklenir).
  play(name) {
    if (!this._loaded || !this._buffers[name] || !this._ctx) return;
    const source = this._ctx.createBufferSource();
    source.buffer = this._buffers[name];
    const gain = this._ctx.createGain();
    gain.gain.value = GAIN[name] || 0.5;
    gain.connect(this._masterGain);
    source.connect(gain);
    source.start(0);
  }

  // Müziği loop'la başlat.
  _startMusic() {
    if (!this._buffers.music || !this._ctx) return;
    if (this._musicSource) return; // zaten çalıyor
    const source = this._ctx.createBufferSource();
    source.buffer = this._buffers.music;
    source.loop = true;
    source.connect(this._musicGain);
    source.start(0);
    this._musicSource = source;
  }

  // Mute toggle (kullanıcı).
  toggleMute() {
    this._muted = !this._muted;
    this._updateGain();
    return this._muted;
  }

  // Reklam sırasında geçici mute (SDK tetikler).
  setAdMute(muted) {
    this._adMuted = muted;
    this._updateGain();
  }

  // Kullanıcı ses seviyesi (0-1) — S10 ayarlar slider'ı.
  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    this._updateGain();
  }

  // Kayıttan başlangıç ayarlarını uygula (unlock'tan önce de çağrılabilir).
  applySettings({ volume, muted } = {}) {
    if (typeof volume === 'number') this._volume = Math.max(0, Math.min(1, volume));
    if (typeof muted === 'boolean') this._muted = muted;
    this._updateGain();
  }

  setMuted(b) { this._muted = !!b; this._updateGain(); }

  _updateGain() {
    if (this._masterGain) {
      this._masterGain.gain.value = (this._muted || this._adMuted) ? 0 : this._volume;
    }
  }

  get muted() { return this._muted; }
  get volume() { return this._volume; }
}

export const audio = new AudioBus();
