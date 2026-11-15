// input.js — Klavye + dokunmatik + gamepad girdisini TEK soyut input state'e indirir.
// Üçü de ilk sınıf (session2.md §3). Girdi fiziksel tuş koduna bağlı (harf değil),
// böylece klavye düzeni değişse de çalışır.
//
// Dışa verilen state her frame okunur:
//   left, right : bool (basılı tutuluyor mu)
//   jumpHeld    : bool (zıpla tuşu basılı mı — değişken zıplama yüksekliği için)
//   jumpPressed : bool (BU frame'de yeni basıldı mı — jump buffer için tek-atış)
// jumpPressed, tüketildikten sonra consumeJump() ile temizlenir.

export class Input {
  constructor(canvas) {
    this.left = false;
    this.right = false;
    this.jumpHeld = false;
    this.jumpPressed = false;

    // Kaynak başına basılı durum (birini bırakınca diğeri hâlâ basılıysa korunsun)
    this._kbLeft = false;
    this._kbRight = false;
    this._kbJump = false;
    this._touchLeft = false;
    this._touchRight = false;
    this._touchJump = false;
    this._padPrevJump = false;

    this._bindKeyboard();
    this._bindTouch(canvas);
  }

  _bindKeyboard() {
    const onKey = (e, down) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this._kbLeft = down; break;
        case 'ArrowRight':
        case 'KeyD':
          this._kbRight = down; break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          if (down && !this._kbJump) this.jumpPressed = true; // kenar tetikleme
          this._kbJump = down;
          e.preventDefault(); // sayfa kaymasın
          break;
        default:
          return;
      }
    };
    window.addEventListener('keydown', (e) => onKey(e, true));
    window.addEventListener('keyup', (e) => onKey(e, false));
  }

  _bindTouch(canvas) {
    // Ekran-üstü butonlar DOM'da (#touch-controls). Burada sadece event bağlıyoruz.
    const bind = (id, set) => {
      const el = document.getElementById(id);
      if (!el) return;
      const press = (v) => (e) => {
        e.preventDefault();
        set(v);
      };
      el.addEventListener('touchstart', press(true), { passive: false });
      el.addEventListener('touchend', press(false), { passive: false });
      el.addEventListener('touchcancel', press(false), { passive: false });
      // Fare ile de test edilebilsin (masaüstünde dokunmatik butonlara tıklayınca)
      el.addEventListener('mousedown', press(true));
      el.addEventListener('mouseup', press(false));
      el.addEventListener('mouseleave', press(false));
    };
    bind('btn-left', (v) => { this._touchLeft = v; });
    bind('btn-right', (v) => { this._touchRight = v; });
    bind('btn-jump', (v) => {
      if (v && !this._touchJump) this.jumpPressed = true;
      this._touchJump = v;
    });
  }

  _pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let padLeft = false, padRight = false, padJump = false;
    for (const pad of pads) {
      if (!pad) continue;
      // Sol stick yatay ekseni (deadzone) + d-pad
      const ax = pad.axes[0] || 0;
      if (ax < -0.35) padLeft = true;
      if (ax > 0.35) padRight = true;
      // D-pad: standart eşlemede buton 14 (sol), 15 (sağ)
      if (pad.buttons[14] && pad.buttons[14].pressed) padLeft = true;
      if (pad.buttons[15] && pad.buttons[15].pressed) padRight = true;
      // A tuşu (buton 0) = zıpla
      if (pad.buttons[0] && pad.buttons[0].pressed) padJump = true;
    }
    if (padJump && !this._padPrevJump) this.jumpPressed = true; // kenar tetikleme
    this._padPrevJump = padJump;
    return { padLeft, padRight, padJump };
  }

  // Her frame, fizik adımından önce çağrılır: tüm kaynakları birleştirir.
  update() {
    const { padLeft, padRight, padJump } = this._pollGamepad();
    this.left = this._kbLeft || this._touchLeft || padLeft;
    this.right = this._kbRight || this._touchRight || padRight;
    this.jumpHeld = this._kbJump || this._touchJump || padJump;
  }

  // Jump buffer tüketince çağrılır (tek zıplama bir kez tetiklensin).
  consumeJump() {
    this.jumpPressed = false;
  }
}
