---
name: 19-image-media-optimization
description: Web görselleri, video/medya yükleme, responsive kaynaklar, format, sıkıştırma, CDN veya LCP medya performansını optimize eder. Yalnız dekoratif CSS değişikliğinde kullanma.
---

# Image and Media Optimization

Görsel doğruluğunu ve erişilebilirliği koruyarak aktarılan baytı ve render gecikmesini azalt.

## Girdiler

- Etkilenen sayfalar, kaynak medya dosyaları ve mevcut build/CMS/CDN hattı
- Hedef viewport/DPR, kalite gereksinimi ve başlangıç performans ölçümü
- Ürün/marka doğruluğu, alt metin ve lisans/kaynak kısıtları

## Akış

1. LCP, içerik, ürün, thumbnail ve dekoratif medyayı ayır; boyut, format, transfer ve kullanım yerini ölç.
2. Gerçek render boyutuna uygun kaynaklar üret; `srcset`/`sizes`, width/height veya aspect-ratio ile layout shift’i önle.
3. İçeriğe uygun modern format ve kaliteyi değerlendir; okunabilirlik veya ürün detayını bozacak aşırı sıkıştırma yapma.
4. LCP görselini eager/high-priority tut; ekran dışı içeriği lazy-load et; video poster/preload ve autoplay tercihlerini ölçerek belirle.
5. Alt metin, caption, dosya adı ve CMS metadata’sını içeriğin gerçek anlamıyla eşleştir.
6. Cache/CDN anahtarları ve invalidation etkisini kontrol et; önce/sonra ağ ve görsel karşılaştırması yap.

## Değişmezler

- Ürünü farklı renk, özellik veya kategoriyle gösteren medya kullanma ya da üretme.
- Orijinal kaynağı geri dönüşsüz biçimde ezme; optimize çıktıyı yeniden üretilebilir tut.
- Yalnız dosya boyutuna bakıp LCP, decode, kalite ve responsive davranışı göz ardı etme.

## Çıktı ve tamamlanma

Değişen medya, boyut/format farkı, LCP ve transfer ölçümü, responsive görsel seçimi ve görsel QA raporlanır. 360 ve 1440 px dahil hedef ekranlarda kırpma/bozulma olmadan doğrulanmalıdır.
