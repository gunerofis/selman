# 03 Kod ve oyun döngüsü

Amaç: Savaş, ekran ve çizim kodunun görevlerini ayırarak mevcut JavaScript oyununu sürdürülebilir geliştirmek.

## Çalışma sırası

MDN JavaScript ve Canvas temelleri; Anatomy of a video game; State ve Game Loop bölümleri. web-game-foundations'ın mimari ilkelerini mevcut motorla kullan.

## Uygulama

1. engine.js/world.js kuralları, app.js/art.js çizimi ve DOM ekranlarının veri akışını izle.
2. Savaş başlangıcı, devamı, atlama, zafer/yenilgi ve ödül için tek durum akışı belirle.
3. İlerleme hızını kare sayısına bağlama; zaman farkı, duraklama ve arka plandan dönme davranışını ele al.
4. Düşman kararları için önce basit durum makinesini değerlendir. Davranış ağacı yalnız ihtiyaç varsa açılır.

## Bitiş ölçütü

Çizim aynı ödülü yeniden üretmez; durum değişimleri tek yerde yönetilir. Dış motor örneği mevcut dosyaya doğrudan yapıştırılmaz.

## Kaynaklar

- [K14 — OpenAI Game Studio](https://github.com/openai/plugins/tree/main/plugins/game-studio): Web oyun mimarisi, arayüz, sprite ve playtest. Phaser/3D yönleri mevcut proje için koşullu.
- [K15 — MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide): Modüller, nesneler, hata işleme ve asenkron JavaScript temeli.
- [K16 — MDN Anatomy of a video game](https://developer.mozilla.org/en-US/docs/Games/Anatomy): Girdi, güncelleme ve çizim döngüsü; tarayıcı zamanlaması.
- [K17 — MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial): Canvas çizimi, dönüşümler, görsel yükleme ve animasyon.
- [K18 — Vite Guide](https://vite.dev/guide/): Projenin mevcut geliştirme ve modül düzeni.
- [K19 — Game Programming Patterns — State](https://gameprogrammingpatterns.com/state.html): Savaş ve ekran durumlarının geçişlerini ayırma.
- [K20 — Game Programming Patterns — Game Loop](https://gameprogrammingpatterns.com/game-loop.html): Simülasyon ve render zamanlamasını anlama.

## Kullanıcı özeti

Phaser, Three.js, React veya Unity geçişi bu paketin sonucu değildir. Paket yönlendiricilerinin motor varsayımları uygulanmaz.

