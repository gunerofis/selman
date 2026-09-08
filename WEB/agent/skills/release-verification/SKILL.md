---
name: release-verification
description: PR, release veya production öncesi Git farkı, test, build, migration, ortam, SEO/analytics regresyonu ve rollback hazırlığını doğrular. Kullanıcıdan açık yayın izni gelmeden deploy etmez.
---

# Release Verification

Yayına hazır olmayı kanıtla; bu skill yayın yapma yetkisi vermez.

## Girdiler

- Yayın kapsamı, hedef ortam, commit/diff ve kabul kriterleri
- Gerçek build/test/browser komutları ile CI/deployment akışı
- Migration, ortam değişkeni, cache/CDN ve rollback yöntemi

## Akış

1. Git status ve diff'i incele; ilgisiz dosya, üretilmiş çıktı, secret ve kullanıcı değişikliği riskini ayır.
2. Değişikliğe uygun format, lint, typecheck, unit, integration, E2E ve build kontrollerini gerçek proje komutlarıyla çalıştır.
3. UI/runtime etkisini hedef URL ve viewport'larda doğrula; console/network ve kritik kullanıcı akışını kontrol et.
4. SEO, analytics, erişilebilirlik, performans, e-ticaret ve güvenlik regresyonlarını değişiklik kapsamına göre değerlendir.
5. Migration sırası, geriye uyumluluk, ortam değişkenleri, cache/CDN etkisi ve yayın sonrası smoke URL'lerini belirle.
6. Geri alma komutu/sürümü, veri geri dönüş sınırı ve rollback tetikleyicilerini yayın öncesi yaz.
7. Kullanıcının açık production izni yoksa deploy, push, merge veya canlı veri değişikliği yapma.

## Beklenen çıktı

- Geçen/kalan release kontrolleri ve kanıtları
- Blokerler, bilinen riskler ve yayın sonrası kontrol listesi
- Uygulanabilir rollback yöntemi

## Tamamlanma ölçütü

Kritik kontroller geçmiştir veya yayın blokeri açıkça belirtilmiştir; rollback uygulanabilir ve production mutasyonu açık kullanıcı iznine bağlıdır.
