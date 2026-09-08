---
name: browser-qa
description: UI, responsive davranış, form, menü, modal, sepet, checkout, console veya network değişikliklerini gerçek tarayıcıda doğrular. Yalnız kaynak kod okuması veya unit test görevi için kullanma. Use when the user runs /browser-qa.
---

# Browser QA

Kodun niyetini değil, kullanıcının gerçek tarayıcıda gördüğü ve yaptığı şeyi doğrula.

## Girdiler

- Test edilecek URL/route, değişiklik ve kabul kriterleri
- Mevcut dev server veya canlı ortam ile güvenli test hesabı/verisi
- Hedef viewport, tarayıcı ve kritik kullanıcı akışı

## Akış

1. Projenin mevcut browser/E2E aracını bul; kullanılabiliyorsa Grok tarayıcı araçlarını tercih et, gereksiz yeni bağımlılık kurma.
2. Değişiklik öncesi veya son bilinen çalışan davranışı kaydet; doğru URL, HTTP durumu ve redirect zincirini doğrula.
3. Render edilmiş DOM, görünür metin, computed layout, console ve başarısız network isteklerini kontrol et.
4. İlgili akışı fare, dokunma ve klavye ile çalıştır; loading, hata, tekrar deneme ve başarı durumlarını gözle.
5. Görevle ilgili viewport'ları seç; geniş kapsamlı UI'da 360, 390, 768, 1024 ve 1440 px temel setini kullan.
6. Taşma, kırpılma, yatay scroll, focus, Escape, scroll lock, sticky/fixed çakışması ve dinamik yeniden render davranışını kontrol et.
7. Sepet/checkout gibi kritik akışlarda gerçek ödeme veya sipariş üretmeden güvenli test verisi kullan.

## Beklenen çıktı

- Test edilen URL, viewport ve akışlar
- Geçen kontroller ile yeniden üretilebilir hatalar
- Console/network kanıtı ve doğrulanamayan alanlar

## Tamamlanma ölçütü

Kabul kriterleri gerçek tarayıcıda kanıtlanmış, yeni kritik console/network hatası bulunmamış ve kalan açıklar açıkça raporlanmıştır.
