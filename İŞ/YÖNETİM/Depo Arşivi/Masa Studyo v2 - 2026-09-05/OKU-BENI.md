# Masa Stüdyosu v2 arşivi

Arşiv tarihi: 5 Eylül 2026. Bu sistem, kullanıcının isteğiyle ürün kartlı oluşturucuya geçiş öncesinde korunmuştur.

## İçerik ve geri yükleme

`masa-studyo.liquid`: Canlı Shopify temasından indirilen masa üzerinde sürükle-bırak sisteminin tam kaynak kodu. Yalnızca Shopify Liquid ortamında çalışır; bağımsız HTML değildir.

Mağaza: sumentakimi.com.tr — Shopify mağaza kodu: b1zinb-wv.
Kaynak canlı tema: 192099647780.
Tam v2 tema yedeği: 192101941540 (5 Eylül 2026'da güncel canlıdan çoğaltıldı; değiştirilmeden saklanır).
192100565284 numaralı çalışma teması artık yeni kartlı oluşturucu için kullanılmaktadır; eski sistemi geri almak için onu kullanmayın.

Geri yüklemek için önce güncel temayı çoğaltın. Arşiv kodunu `sections/masa-studyo.liquid` dosyasına yerleştirin. Ana sayfa şablonunda masa-studyo bölümü etkin olmalıdır. Ayrı isimlik önizlemesi için mevcut `sections/canli-isimlik.liquid` dosyası korunmalıdır. Önizlemede test ettikten sonra canlıya uygulayın. Tüm eski temayı doğrudan yayınlamak, sonradan yapılmış diğer site değişikliklerini geri alabilir; yalnızca gerekli bölümü geri yükleyin.

Ürün görselleri dosya içinde Shopify CDN adresleriyle bağlıdır. Bu dosya tek başına çevrimdışı görsel paketi değildir; ilgili Shopify dosyalarını silmeyin. Kod 8 yüksek kaliteli siyah parça görselini, diğer renk kaynaklarını, isim/logo uygulamasını, hizalama, geçmiş ve PNG üretimini içerir.

Müşteri taslağı tarayıcıda `st-desk-draft-v2` anahtarında tutulur. Arşiv müşteri kişisel verisi içermez.

## Bilinen sınırlamalar

Fiziksel telefon dokunma testi yapılmamıştı. Oluşturulan PNG 2400 × 1600 olarak doğrulanmıştı; tarayıcı indirme olayı gözlemi sonuç vermemişti. Yeni kartlı sistemin amacı masa geometrisi, sürükleme ve perspektif karmaşıklığını kaldırmaktır.
