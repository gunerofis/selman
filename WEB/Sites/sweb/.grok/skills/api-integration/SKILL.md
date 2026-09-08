---
name: api-integration
description: Harici REST, GraphQL, SOAP, SDK veya webhook entegrasyonunu auth, sözleşme, hata, rate limit ve idempotency ile geliştirir. Uygulama içi sıradan fonksiyon çağrısında kullanma. Use when the user runs /api-integration.
---

# API Integration

Harici servis sınırını doğrulanmış sözleşme, kontrollü hata davranışı ve gözlemlenebilirlikle yönet.

## Girdiler

- Sağlayıcının güncel resmî dokümanı, ortam/base URL ve endpoint sözleşmesi
- Auth yöntemi, rate limit, timeout, pagination ve webhook özellikleri
- Mevcut API client katmanı, veri modeli ve başarı/hata kabul senaryoları

## Akış

1. API sürümünü, endpoint/field sözleşmesini, auth ve sandbox imkanını resmî dokümanla doğrula; alan uydurma.
2. Mevcut ortak client, retry, hata ve observability yapısını yeniden kullan; sağlayıcı kodunu uygulama alan mantığından ayır.
3. Secret’ı server-side ortam/binding üzerinden kullan; log, frontend bundle veya hata mesajına sızdırma.
4. Açık timeout, iptal, sınırlı backoff/jitter ve rate-limit davranışı uygula. Yalnız güvenli/idempotent istekleri otomatik retry et.
5. Yanıtı runtime’da doğrula; pagination, partial response, null/unknown alan ve sürüm değişikliğini kontrollü işle.
6. Webhook’ta imza, timestamp/replay, duplicate ve sıra dışı teslimi doğrula; işi idempotent yap.
7. Mock/contract ve mümkünse sandbox testlerinde başarı, 4xx, 5xx, timeout, rate limit ve bozuk yanıt senaryolarını çalıştır.

## Değişmezler

- Açık izin olmadan production’da veri oluşturan/değiştiren API çağrısı yapma.
- Non-idempotent POST/ödeme/sipariş isteğini körlemesine retry etme.
- Sağlayıcı hatasını başarıya çevirme veya hassas response gövdesini loglama.

## Çıktı ve tamamlanma

Sözleşme/field eşlemesi, auth ve secret yönetimi, retry/timeout politikası, test kanıtı ve sağlayıcı kesintisi davranışı raporlanır. Başarısız ve bozuk yanıt yolları doğrulanmadan tamamlandı deme.
