---
name: seo-audit
description: Teknik SEO, indeksleme, URL, canonical, sitemap, metadata, dahili bağlantı ve structured data davranışını gerçek HTTP/render çıktısında denetler. Yalnız pazarlama metni yazımında kullanma.
---

# SEO Audit

SEO doğruluğunu kaynak koddaki niyetle değil, tarayıcıya ve arama motoruna ulaşan gerçek çıktıyla değerlendir.

## Girdiler

- Denetlenecek ortam, URL kümesi ve sayfa türleri
- Hedef ülke/dil, indeksleme amacı ve varsa Search Console/Merchant uyarısı
- Route, metadata, sitemap, robots ve katalog veri kaynakları

## Akış

1. HTTP durumunu, redirect zincirini, canonical'ı, robots meta'yı, robots.txt ve sitemap ilişkisini kontrol et.
2. Render edilmiş HTML'de title, meta description, H1/heading sırası, Open Graph ve önemli dahili bağlantıları doğrula.
3. Duplicate, yetim sayfa, kırık bağlantı, pagination/filtre URL'si, 404, soft-404 ve gereksiz noindex risklerini örneklerle incele.
4. Çok dil varsa reciprocal hreflang, dil/bölge kodu, canonical ve sitemap tutarlılığını kontrol et.
5. Structured data'yı render edilmiş HTML'den çıkar; görünür ad, URL, fiyat, para birimi, stok, SKU ve görselle karşılaştır.
6. Ürün/kategori URL'si değişecekse redirect ve dahili bağlantı geçişini yayın öncesi planla.
7. Güncel arama motoru veya schema kuralı belirleyiciyse yalnız resmî güncel kaynağı kullan.

## Beklenen çıktı

- URL ve sayfa türüne göre bulgu listesi
- Kanıt, etki ve önceliklendirilmiş düzeltme önerisi
- Doğrulanamayan dış araç/veri boşlukları

## Tamamlanma ölçütü

Kritik indeksleme ve schema iddiaları gerçek çıktı ile doğrulanmış, görünür içerik-veri uyumsuzlukları ve geçiş riskleri açıkça belirtilmiştir.
