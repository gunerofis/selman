---
name: security-review
description: Kimlik doğrulama, admin, API, form, dosya yükleme, veritabanı, dependency ve deployment değişikliklerini tehdit ve veri sızıntısı açısından inceler. Sıradan stil değişikliğinde kullanma. Use when the user runs /security-review.
---

# Security Review

Güvenlik sınırını sunucuda uygula; inceleme talebini kullanıcı izni olmadan canlı sisteme saldırı veya veri değişikliği yetkisi sayma.

## Girdiler

- Aktörler, güven sınırları, korunan kaynaklar ve hassas veri türleri
- Etkilenen route/API, auth/session, veri tabanı, upload ve dış servisler
- Ortamlar, mevcut güvenlik kontrolleri ve kabul edilen test kapsamı

## Akış

1. Girdi kaynaklarını, güven sınırlarını, yetki kararlarını ve veri akışını çıkar.
2. XSS, CSRF, injection, path traversal, SSRF, açık yönlendirme, CORS ve yetkisiz kaynak erişimini görevle orantılı incele.
3. Authentication ile authorization'ı ayır; rol, sahiplik ve tenant kontrolünü güvenilir sunucu sınırında doğrula.
4. Session/cookie, rate limit, brute-force, güvenlik başlıkları ve hata mesajlarında bilgi sızıntısını kontrol et.
5. Upload'da sunucu tarafı tür, boyut, içerik, güvenli ad ve erişim kontrolünü doğrula.
6. Secret, token, PII, kart/veri gövdesi ve stack trace'in kod, istemci bundle, log veya dokümana sızmadığını kontrol et.
7. Dependency ve deployment risklerini kanıtla; canlı ortamda yıkıcı veya sömürücü test yapmadan önce açık yetki iste.

## Beklenen çıktı

- Etki ve sömürülebilirliğe göre önceliklendirilmiş bulgular
- Dosya/akış kanıtı, güvenli düzeltme ve doğrulama yöntemi
- Yanlış pozitifler, kapsam dışı alanlar ve kalan risk

## Tamamlanma ölçütü

Kritik güven sınırları sunucuda doğrulanmış, secret/PII sızıntısı bulunmamış veya giderilmiş ve kalan risk açıkça raporlanmıştır.
