// hud.js — Oyuncu-yüzü UI: ölüm sayacı, seviye göstergesi, cilalı alldone ekranı.
// Session 4: minimal HUD, oyunu kapatmayan, dokunmatik kontrollerle çakışmayan.
// Canvas üzerine çizim — DOM overlay gerektirmez.

// Ölüm sayacı pulse efekti
let deathPulse = 0;       // 0 = sakin, >0 = aktif pulse
let lastDeathCount = 0;   // son bilinen ölüm sayısı (değişimde pulse tetikle)

export function drawHUD(ctx, w, h, state, levelIndex, levelName, deaths, muted) {
  // Ölüm pulse kontrolü
  if (deaths > lastDeathCount) {
    deathPulse = 1;
    lastDeathCount = deaths;
  }
  if (deathPulse > 0) deathPulse = Math.max(0, deathPulse - 0.03);

  ctx.save();

  // ─── Ölüm Sayacı (sol üst) ───
  if (state === 'play' || state === 'dead') {
    const pulse = 1 + deathPulse * 0.25; // 1.0 → 1.25 scale
    const dx = 20;
    const dy = 36;

    ctx.save();
    ctx.translate(dx + 20, dy);
    ctx.scale(pulse, pulse);
    ctx.translate(-(dx + 20), -dy);

    // Yarı-saydam arka plan
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    roundRect(ctx, dx - 6, dy - 22, 90, 34, 8);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('💀 ' + deaths, dx + 6, dy - 5);
    ctx.restore();
  }

  // ─── Seviye Göstergesi (sağ üst) ───
  if (state === 'play' || state === 'dead') {
    const text = 'L' + (levelIndex + 1) + ' — ' + levelName;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    const tw = ctx.measureText(text).width;
    roundRect(ctx, w - tw - 26, 8, tw + 20, 28, 8);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w - 16, 22);
  }

  // ─── Mute Göstergesi (sağ üst, seviye altında) ───
  {
    const icon = muted ? '🔇' : '🔊';
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(icon, w - 14, 42);
  }

  ctx.restore();
}

// ─── Cilalı alldone ekranı ───
export function drawAllDone(ctx, w, h, deaths) {
  ctx.save();

  // Karartma overlay
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, w, h);

  // Tebrikler başlığı
  ctx.fillStyle = '#ffd84d';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎉 Tebrikler! 🎉', w / 2, h / 2 - 50);

  // Toplam ölüm
  ctx.fillStyle = '#fff';
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillText('Toplam ölüm: 💀 ' + deaths, w / 2, h / 2 + 10);

  // Baştan oyna
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Baştan oyna: R / dokun / A', w / 2, h / 2 + 55);

  ctx.restore();
}

// ─── Cilalı clear ekranı (seviye geçişi) ───
export function drawClear(ctx, w, h, levelIndex, levelName) {
  ctx.save();

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✅ Seviye Tamam!', w / 2, h / 2 - 10);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('L' + (levelIndex + 1) + ' — ' + levelName, w / 2, h / 2 + 30);

  ctx.restore();
}

// Yardımcı: yuvarlatılmış dikdörtgen
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Ölüm sayacını sıfırla (baştan oynarken) ───
export function resetHUD() {
  lastDeathCount = 0;
  deathPulse = 0;
}
