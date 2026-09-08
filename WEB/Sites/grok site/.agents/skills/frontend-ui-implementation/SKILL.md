---
name: frontend-ui-implementation
description: Tasarım, ekran görüntüsü, içerik veya mevcut tasarım sistemi üzerinden üretime uygun yeni sayfa, component, responsive arayüz ya da kapsamlı UI yenilemesi uygular. Yalnız hata teşhisi veya browser testi için kullanma. Use when the user runs /frontend-ui-implementation.
---

# Frontend UI Implementation

Yeni arayüzü mevcut uygulamanın mimarisi, içerik kaynağı ve tasarım sistemiyle bütünleştir.

## Girdiler

- Kullanıcı hedefi, görünür içerik, gerekli durumlar ve kabul kriterleri
- Mevcut framework, route/component yapısı, stil sistemi ve kullanılabilir varlıklar
- Hedef viewport'lar, etkileşimler ve korunması gereken mevcut davranış

## Akış

1. Kaynak component ve stilleri bul; mevcut renk, tipografi, spacing, container ve responsive kuralları çıkar.
2. Tam yeniden tasarımda kabul edilmiş görsel konsepti; mevcut tasarımda ise var olan component sistemini kaynak kabul et.
3. En küçük anlamlı görünüm dilimini semantic HTML, doğru native kontroller ve kapsüllenmiş stillerle uygula.
4. Loading, empty, error, disabled, success, hover, focus ve touch durumlarını gereken ölçüde kapsa.
5. CMS veya ürün verisini görünüm içine kopyalama; gerçek veri sözleşmesini ve mevcut route davranışını koru.
6. Mobil, tablet, masaüstü, uzun içerik, klavye ve reduced-motion davranışını doğrula; browser QA'yı `browser-qa` ile tamamla.

## Beklenen çıktı

- Mevcut mimariye uyan üretim kodu
- Değişen görünüm ve etkileşimlerin listesi
- Responsive ve erişilebilirlik doğrulama kanıtı
- Bilinen sapmalar veya ertelenen durumlar

## Tamamlanma ölçütü

Arayüz gerçek içerikle çalışır, kritik durumlar ve hedef viewport'lar doğrulanır, mevcut veri/SEO/iş akışında yeni regresyon oluşmaz.
