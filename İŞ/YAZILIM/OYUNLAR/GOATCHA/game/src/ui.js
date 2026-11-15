// ui.js — Menü/ekran kabuğu (DOM overlay). Session 10.
// Başlık, seviye seçimi, duraklatma, ayarlar, oyun-bitti, nasıl-oynanır ekranlarını
// gösterir/gizler ve butonları main.js'in verdiği callback'lere bağlar.
//
// Mimari: Bu katman SADECE sunum/UI. Oyun mantığına (fixedUpdate) dokunmaz; main.js
// her ekran geçişinde döngüyü `paused` ile dondurur (determinizm korunur).

const $ = (id) => document.getElementById(id);

class UI {
  constructor() {
    this._cb = {};
    this._ctx = {};
    this._current = null;       // aktif ekran adı (null = gizli/oyunda)
    this._settingsReturn = 'title';
  }

  // callbacks: { onContinue, onNewGame, onPickLevel(i), onResume, onRestartLevel,
  //   onQuitToMenu, onReplayAll, onSetVolume(v0-1), onToggleMute(bool), onResetProgress, onHowToDone }
  // ctx: { levels, storage, audio }
  init(callbacks, ctx) {
    this._cb = callbacks;
    this._ctx = ctx;
    this._wire();
    this._syncSettings();
  }

  _wire() {
    const cb = this._cb;
    // Başlık
    $('mb-continue').onclick = () => cb.onContinue && cb.onContinue();
    $('mb-new').onclick = () => cb.onNewGame && cb.onNewGame();
    $('mb-select').onclick = () => { this.buildLevelGrid(); this.show('select'); };
    $('mb-settings').onclick = () => this.openSettings('title');
    // Seviye seçimi
    $('sel-back').onclick = () => this.show('title');
    // Duraklatma
    $('pm-resume').onclick = () => cb.onResume && cb.onResume();
    $('pm-restart').onclick = () => cb.onRestartLevel && cb.onRestartLevel();
    $('pm-settings').onclick = () => this.openSettings('pause');
    $('pm-menu').onclick = () => cb.onQuitToMenu && cb.onQuitToMenu();
    // Ayarlar
    $('set-volume').oninput = (e) => {
      const v = (+e.target.value) / 100;
      if (cb.onSetVolume) cb.onSetVolume(v);
      this._syncMuteFromAudio();
    };
    $('set-mute').onchange = (e) => { if (cb.onToggleMute) cb.onToggleMute(e.target.checked); };
    $('set-reset').onclick = () => {
      if (cb.onResetProgress) cb.onResetProgress();
      this.refreshTitle();
    };
    $('set-back').onclick = () => this.show(this._settingsReturn);
    // Oyun bitti
    $('ad-replay').onclick = () => cb.onReplayAll && cb.onReplayAll();
    $('ad-select').onclick = () => { this.buildLevelGrid(); this.show('select'); };
    $('ad-menu').onclick = () => cb.onQuitToMenu && cb.onQuitToMenu();
    // Nasıl oynanır
    $('howto-ok').onclick = () => cb.onHowToDone && cb.onHowToDone();
  }

  // --- Ekran gösterimi ---
  // name: 'title'|'select'|'pause'|'settings'|'alldone'|'howto' | null (gizle)
  show(name) {
    this._current = name;
    const overlay = $('overlay');
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    if (!name) { overlay.classList.remove('show'); document.body.classList.add('in-game'); return; }
    document.body.classList.remove('in-game');
    const el = $('screen-' + name);
    if (el) el.classList.add('active');
    overlay.classList.add('show');
    if (name === 'title') this.refreshTitle();
  }

  get current() { return this._current; }
  isOpen() { return !!this._current; }

  openSettings(returnTo) {
    this._settingsReturn = returnTo || 'title';
    this._syncSettings();
    this.show('settings');
  }

  // "Devam Et" sadece ilerleme varsa aktif.
  refreshTitle() {
    const has = this._ctx.storage && this._ctx.storage.hasProgress();
    const btn = $('mb-continue');
    btn.disabled = !has;
    btn.textContent = has ? `Devam Et (L${this._ctx.storage.unlocked + 1})` : 'Devam Et';
  }

  buildLevelGrid() {
    const { levels, storage } = this._ctx;
    const grid = $('level-grid');
    grid.innerHTML = '';
    levels.forEach((lv, i) => {
      const b = document.createElement('button');
      const unlocked = i <= storage.unlocked;
      const best = storage.best[i];
      const inner = document.createElement('span');
      inner.innerHTML = `${i + 1}` + (best ? `<div class="lvl-best">💀${best.deaths}</div>` : '');
      b.appendChild(inner);
      if (!unlocked) { b.classList.add('locked'); }
      else { b.onclick = () => this._cb.onPickLevel && this._cb.onPickLevel(i); }
      b.title = unlocked ? (lv.name || ('Seviye ' + (i + 1))) : 'Kilitli';
      grid.appendChild(b);
    });
  }

  setAllDoneStats({ levelCount, totalDeaths, runDeaths }) {
    $('alldone-stats').innerHTML =
      `Bütün <b>${levelCount}</b> seviyeyi bitirdin!<br />` +
      `Bu turda <b>💀 ${runDeaths}</b> kez öldün.<br />` +
      `<span style="opacity:.7;font-size:14px;">Toplam (tüm zamanlar): ${totalDeaths}</span>`;
  }

  _syncSettings() {
    const a = this._ctx.audio;
    if (!a) return;
    $('set-volume').value = Math.round(a.volume * 100);
    $('set-mute').checked = a.muted;
  }
  _syncMuteFromAudio() {
    const a = this._ctx.audio;
    if (a) $('set-mute').checked = a.muted;
  }
}

export const ui = new UI();
