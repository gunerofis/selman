---
name: 15-product-feed-merchant
description: Google Merchant veya benzeri kanallar için ürün feed’i, varyant, fiyat, stok, görsel ve hedef ülke uyumunu üretir ya da denetler. Site içi ürün kartı değişikliklerinde kullanma.
---

# Product Feed and Merchant

Feed çıktısını gerçek katalog verisi ve hedef kanalın güncel resmî kurallarıyla eşleştir.

## Girdiler

- Hedef kanal, ülke, dil, para birimi ve feed biçimi
- Ürün, varyant, fiyat, stok, URL, görsel, kargo/vergi veri kaynakları
- Mevcut feed üreticisi, zamanlama ve hata/uyarı raporları

## Akış

1. Her feed alanının sistemdeki tek gerçek kaynağını ve güncelleme zamanını belirle.
2. ID/SKU, `item_group_id`, başlık, açıklama, URL, görsel, durum, fiyat, para birimi ve stok eşleşmesini örnek ürünlerle doğrula.
3. Varyantları, çok dilli/ülkeli URL’leri, canonical ilişkisini ve yönlendirmeleri hedef kanal gereksinimine göre kontrol et.
4. Görünen ürün sayfası ile feed fiyatı, stok, görsel ve structured data arasında tutarlılık denetimi yap.
5. Güncel alan/politika kuralı gerekiyorsa yalnız hedef kanalın resmî dokümanını kullan; feed’i mümkünse resmî doğrulayıcıyla test et.
6. Değişiklik öncesi/sonrası ürün sayısı, eksik alan, reddedilen öğe ve örnek çıktı farkını raporla.

## Değişmezler

- Fiyat, stok, GTIN/MPN, marka, ürün özelliği, kargo veya kampanya bilgisini uydurma.
- Dinamik kataloğu elle çoğaltılmış statik feed ile iki ayrı doğruluk kaynağına bölme.
- Kanal hesabında veya canlı feed zamanlamasında açık izin olmadan değişiklik yapma.

## Çıktı ve tamamlanma

Alan eşleme tablosu, doğrulama sonuçları, reddedilen/uyarı alan öğeler ve yeniden üretim komutunu raporla. Feed ile gerçek ürün sayfası uyuşmadan tamamlandı deme.
