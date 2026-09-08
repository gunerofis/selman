---
name: accessibility-audit
description: Arayüzü semantic yapı, klavye, focus, form, ekran okuyucu adı, kontrast, zoom, hareket ve RTL açısından denetler ve düzeltir. Yalnız dekoratif metin değişikliğinde kullanma. Use when the user runs /accessibility-audit.
---

# Accessibility Audit

Arayüzü yalnız otomatik skorla değil, gerçek klavye ve kullanıcı akışı üzerinden doğrula.

## Girdiler

- Denetlenecek sayfa/component ve kritik kullanıcı görevleri
- Hedef dil, viewport, tema ve varsa modal/form/menü gibi etkileşimler
- Mevcut component sistemi ve erişilebilirlik araçları

## Akış

1. Landmark, heading, liste, tablo, button, link ve form semantiğini kontrol et; native HTML yeterliyse ARIA ekleme.
2. Tüm kritik akışı yalnız klavye ile çalıştır; görünür focus, sıra, skip davranışı ve klavye tuzaklarını incele.
3. Modal, drawer, menü ve accordion için açılma/kapanma, focus taşıma/geri verme, Escape ve arka plan etkileşimini doğrula.
4. Label, açıklama, zorunluluk, hata mesajı ve durum değişikliklerinin programatik ilişkisini kontrol et.
5. Görsel alt metni, kontrolün erişilebilir adını, kontrastı, yalnız renkle verilen anlamı ve dokunma hedefini değerlendir.
6. 200% zoom, küçük viewport, uzun Türkçe içerik, reduced-motion ve varsa RTL yönünü test et.
7. Otomatik denetim bulgularını manuel akışla doğrula; yanlış pozitifleri kanıtsız sorun olarak raporlama.

## Beklenen çıktı

- Kullanıcı akışına göre önceliklendirilmiş bulgular
- Uygulanan düzeltmeler ve manuel/otomatik doğrulama
- Kalan araç veya içerik sınırlamaları

## Tamamlanma ölçütü

Kritik görev klavye ve uygun semantics ile tamamlanabilir, focus ve hata davranışı anlaşılır, yeni ciddi erişilebilirlik regresyonu kalmaz.
