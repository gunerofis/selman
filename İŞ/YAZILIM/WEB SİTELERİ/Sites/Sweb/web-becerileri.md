# SWEB — Kullanılacak skill haritası

**Son kontrol:** 15 Eylül 2026

## Aktif çekirdek

- `gof-living-summary`: Kaynakları, doğrulama durumunu ve proje hafızasını güncel tutar.
- `gof-web-ui` + `.grok/design-ui`: Mevcut tasarım dilini koruyarak mobil ve ürün arayüzü düzeltmeleri yapar.
- `.agents/frontend-ui-implementation`: Route ve component değişikliklerini mevcut React/TanStack mimarisine uygular.
- `.agents/ecommerce-integrity`: Ürün, set, fiyat, stok, sepet ve sipariş metinlerinin gerçek veriyle uyuşmasını denetler.
- `.agents/search-filtering`: Katalog, filtre, sıralama ve URL durumunu tutarlı hâle getirir.
- `gof-technical-seo` + `.agents/seo-audit`: Sitemap, metadata, canonical, 404 ve structured data düzeltmelerini doğrular.
- `gof-web-qa` + `.agents/browser-qa`: Masaüstü/mobil görünüm ve kritik alışveriş akışlarını gerçek tarayıcıda sınar.
- `.agents/release-verification`: Test, typecheck, build ve üretim çıktısı kontrollerini yürütür; açık izin olmadan yayın yapmaz.

## İlgili fazda kullanılacak

- `.agents/accessibility-audit`: Adlandırma, odak, kontrast, dokunma alanı ve semantik kontrolleri.
- `gof-web-performance` + `.agents/performance-audit`: Prod build üzerinden hız ve Core Web Vitals teşhisi.
- `.agents/image-media-optimization`: Büyük görseller, WebP dönüşümü, boyut ve `srcset` işleri.
- `.agents/cookie-consent-privacy`: Çerez tercihleri ve ödeme ekranındaki sabit katman çakışmaları.
- `.agents/payment-checkout`: Ödeme formu ve sipariş talebi akışının güvenli doğrulanması.
- `gof-admin-operations`: Yönetim panelindeki kalıcı site/katalog ayarları değiştirilecekse.

## Kullanılmayacak

- `imagegen`: Mevcut gerçek ürün görselleri varken yeni/sahte ürün görseli üretmeye gerek yok.
- Shopify ve Supabase skillleri: Bu proje Shopify veya Supabase tabanlı değil.

