---
name: email-notification-flows
description: Transactional e-posta, bildirim, template, kuyruk, retry, tercih veya teslimat durumlarını geliştirir ve doğrular. Yalnız bağımsız pazarlama metni yazımında kullanma. Use when the user runs /email-notification-flows.
---

# Email and Notification Flows

Bildirimleri doğru alıcıya, doğru durumda, tekil ve kullanıcı tercihleriyle uyumlu gönder.

## Girdiler

- Tetikleyici olay, alıcı, kanal, template/locale ve gönderim sağlayıcısı
- Queue/retry/dedup modeli, consent/tercih kuralları ve teslimat durumları
- Test inbox/sandbox, kabul senaryoları ve güvenli örnek veri

## Akış

1. Olaydan bildirime durum geçişini ve tam olarak ne zaman gönderileceğini tanımla.
2. Queue işi, idempotency/dedup anahtarı, retry/backoff ve permanent failure davranışını uygula.
3. Alıcı, reply-to, konu, link ve template değişkenlerini server-side doğrula; HTML ve kullanıcı içeriğini güvenli escape et.
4. Token/link süre sonu, tek kullanımlık davranış, açık yönlendirme ve hesap keşfi risklerini kontrol et.
5. Locale, timezone, unsubscribe/tercih, zorunlu işlem bildirimi ve erişilebilir plain-text alternatifini doğrula.
6. Sandbox/test inbox’ta başarı, tekrar olay, gecikme, bounce, sağlayıcı hatası ve yanlış/eksik veri senaryolarını test et.

## Değişmezler

- Açık izin olmadan gerçek kullanıcıya e-posta, SMS, push veya webhook bildirimi gönderme.
- Mesaj gövdesi, token, e-posta adresi veya kişisel veriyi gereksiz loglama.
- Başarısız işi sonsuz retry döngüsüne sokma; gönderimi transaction rollback’inden önce kesinleşmiş sayma.

## Çıktı ve tamamlanma

Tetikleyici, dedup/retry politikası, template/locale kapsamı ve sandbox kanıtı raporlanır. Tek olayın yeniden işlendiğinde duplicate bildirim üretmediği doğrulanmalıdır.
