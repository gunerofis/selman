---
name: 14-payment-checkout
description: Ödeme, checkout, sipariş oluşturma, sağlayıcı dönüşü, webhook, iade veya ödeme durumu akışlarını güvenli ve idempotent biçimde geliştirir. Yalnız ürün kartı görünümünde kullanma.
---

# Payment and Checkout

Sipariş ve ödeme durumunu sunucu kaynaklı, izlenebilir ve tekrar isteklere dayanıklı tut.

## Girdiler

- Ödeme sağlayıcısı ve güncel resmî entegrasyon dokümanı
- Para birimi, vergi/kargo/indirim hesaplama kaynağı ve sipariş durum modeli
- Sandbox/test erişimi, callback/webhook URL’leri ve kabul senaryoları

## Akış

1. Sepet toplamı, sipariş oluşturma, ödeme başlatma, dönüş URL’si ve webhook akışının mevcut kaynaklarını haritala.
2. Tutarı ve para birimini güvenilir sunucuda yeniden hesapla; istemciden gelen toplamı kaynak kabul etme.
3. Sipariş ve ödeme oluşturma için idempotency, benzersiz transaction eşlemesi ve yeniden yükleme/çift tıklama koruması uygula.
4. Webhook imzasını, timestamp/replay korumasını, sıra dışı/tekrar teslimi ve geç gelen durum güncellemelerini doğrula.
5. Başarılı, reddedilen, iptal, timeout, 3DS/ek doğrulama, bekleyen ve tekrar deneme durumlarını görünür biçimde işle.
6. Sandbox’ta ağ hatası, callback yenileme, çift webhook ve tutar uyuşmazlığı senaryolarını test et.

## Değişmezler

- Açık kullanıcı izni olmadan gerçek ödeme, iade veya production siparişi üretme.
- Kart verisini uygulama sunucusuna alma veya loglama; sağlayıcının güvenli bileşenlerini koru.
- `purchase` analytics olayını yalnız kesin başarılı ve tekil siparişten sonra gönder.
- Başarısız ödemeyi başarılı sipariş gibi göstermeme; hatayı sessizce yutma.

## Çıktı ve tamamlanma

Durum geçişleri, idempotency anahtarı, webhook doğrulaması, sandbox kanıtı ve rollback yolunu raporla. Çift tahsilat/sipariş riski test edilmeden tamamlandı deme.
