---
name: cms-content-management
description: CMS içerik modeli, editör akışı, taslak/önizleme/yayın, sürümleme veya içerik API’si değişikliklerini geliştirir. Kaynak koddaki tek seferlik statik metin değişikliğinde kullanma. Use when the user runs /cms-content-management.
---

# CMS Content Management

İçerik modelini editör deneyimi, yayın güvenliği, frontend sözleşmesi ve SEO ile birlikte koru.

## Girdiler

- CMS türü, içerik tipleri/alanları, ilişkiler ve locale yapısı
- Editör rolleri, taslak-onay-yayın akışı ve önizleme modeli
- Frontend sorguları, webhook/cache davranışı ve migration ihtiyacı

## Akış

1. Mevcut içerik şemasını, required/default alanları, ilişkileri ve tüketen sayfaları çıkar.
2. Şema değişikliğini geriye uyumlu planla; mevcut girdilerin ve eski frontend sürümünün davranışını kontrol et.
3. Editör izinleri, field validation, zengin metin sanitization ve güvenli medya seçimini uygula.
4. Taslak, önizleme, planlı yayın, geri alma ve locale fallback akışlarını gerçek rol ve durumlarla test et.
5. Slug/URL, canonical, metadata, redirect ve cache invalidation etkisini doğrula.
6. Veri dönüşümü gerekiyorsa sayım, dry-run, yedek ve rollback planını `backup-migration-rollback` ile hazırla.

## Değişmezler

- Production içerik şemasını veya girdilerini açık izin olmadan toplu değiştirme.
- Zengin metni sanitization olmadan render etme; preview token veya taslak içeriği sızdırma.
- CMS verisiyle kod içi sabit veriyi sessizce iki doğruluk kaynağına dönüştürme.

## Çıktı ve tamamlanma

Şema farkı, etkilenen sorgular/sayfalar, editör akışı, migration ve rollback yolunu raporla. Taslak ile yayın içeriği ayrımı ve eski içerik uyumu doğrulanmadan tamamlandı deme.
