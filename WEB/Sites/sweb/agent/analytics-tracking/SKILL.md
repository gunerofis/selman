---
name: analytics-tracking
description: GA4, Ads, GTM, Meta Pixel, e-ticaret eventleri, form/tıklama dönüşümleri ve consent ilişkisini uygular veya denetler. Analytics dışı sıradan UI değişikliğinde kullanma.
---

# Analytics Tracking

Ölçümü tekil, olay kaynağıyla uyumlu, kişisel veriden arındırılmış ve izin durumuna bağlı tut.

## Girdiler

- Ölçüm sağlayıcısı, container/property/pixel yapısı ve ortamlar
- Event sözleşmesi, tetikleyici kullanıcı davranışı ve e-ticaret veri kaynağı
- Consent kategorileri, debug yöntemi ve kabul edilen doğrulama kanıtı

## Akış

1. Mevcut tag, container, script ve event üreticilerini çıkar; çift yükleme ve debug/production karışmasını bul.
2. Event adı, tetikleme anı, ürün ID/SKU, sayısal fiyat, para birimi ve transaction_id kaynağını açıkça eşleştir.
3. `view_item`, `add_to_cart`, `begin_checkout` ve `purchase` olaylarını yalnız karşılık gelen başarılı iş durumundan sonra üret.
4. Yeniden yükleme, tekrar render ve geri/ileri gezinmede duplicate event riskini engelle.
5. E-posta, telefon, adres veya serbest form metni gibi kişisel veriyi event parametrelerine koyma.
6. İsteğe bağlı ölçüm tag'lerini consent verilmeden çalıştırma; tercih değişikliği ve geri çekmeyi kapsa.
7. Debug görünümü veya gerçek network isteğinde event ve parametreleri doğrulamadan çalıştığını iddia etme.

## Beklenen çıktı

- Event ve veri kaynağı eşlemesi
- Duplicate/consent/PII bulguları ve uygulanan düzeltmeler
- Gerçek debug veya network doğrulama sonucu

## Tamamlanma ölçütü

Her event doğru iş olayında en fazla bir kez gönderilir, ticari parametreler kaynakla eşleşir, PII sızmaz ve consent davranışı kanıtlanır.
