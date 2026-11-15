# 06 Ses ve müzik

Amaç: Arayüz, savaş, ortam ve müziği ayrı kontrol edilebilen ses düzenine bağlamak.

## Çalışma sırası

Web Audio başlangıcı ve best practices; audio-design ile karışım/kanal tasarımı. Howler yalnız ihtiyaç varsa teknik seçenek.

## Uygulama

1. UI, isabet, ödül, tehlike, ortam ve müzik olaylarını mevcut akıştan çıkar; ses dosyası yoksa varmış gibi gösterme.
2. Master, müzik ve efekt kontrollerinin gerçek ses kazancına bağlanmasını tasarla.
3. İlk kullanıcı etkileşimi, autoplay engeli, uygulama arka planı ve yeniden açılış davranışlarını ele al.
4. Tekrarlanan seslerde eşzamanlılık, tekrar yoğunluğu ve bozulmayı değerlendir. Kritik bilgi ses kapalıyken de anlaşılır olmalı.

## Bitiş ölçütü

Sessize alma çalışır; sesler üst üste kontrolsüz birikmez; lisans ve atıf kaydı vardır.

## Kaynaklar

- [K33 — MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices): Ses yükleme, autoplay, kullanıcı kontrolü ve tarayıcı uyumu.
- [K34 — MDN Using Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API): AudioContext, ses kaynakları ve GainNode ile temel uygulama.
- [K35 — Howler.js](https://howlerjs.com/): Web sesini sadeleştiren isteğe bağlı kütüphane; oyuna eklenmedi.
- [K36 — Audacity Manual](https://manual.audacityteam.org/): Ses kesme, temizleme, seviye ve dışa aktarma.
- [K37 — Freesound lisans açıklamaları](https://freesound.org/help/faq/): Ses başına CC0/CC BY/CC BY-NC ve atıf koşulları; toplu kullanım izni değildir.

## Kullanıcı özeti

Godot/Unity mixer kodu Web Audio kodu değildir. Skill içindeki ses seviyesi hedefleri ölçüm için başlangıç örneğidir, Kıvılcım kararı değildir.

