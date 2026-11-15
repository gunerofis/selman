---
name: performance-audit
description: Sayfa yükleme, Core Web Vitals, bundle, görsel, font, üçüncü taraf ve runtime performansını ölçer ve hedefli biçimde iyileştirir. Ölçüm gerektirmeyen küçük kod temizliğinde kullanma. Use when the user runs /performance-audit.
---

# Performance Audit

Optimizasyonu tahminle değil, aynı koşullarda alınmış önce/sonra ölçümüyle yönlendir.

## Girdiler

- Hedef URL/route, cihaz, ağ profili ve kullanıcı akışı
- Mevcut build çıktısı, medya/font hattı ve üçüncü taraf scriptler
- Başarı metriği ve kabul edilebilir görsel/işlevsel ödünler

## Akış

1. Aynı ortam ve profilde başlangıç ölçümü al; LCP, CLS, etkileşim gecikmesi, transfer ve ana iş parçacığı maliyetini kaydet.
2. Ağ bağımlılık zinciri, render-blocking kaynak, büyük/yanlış boyutlu görsel, font, bundle ve üçüncü taraf maliyetini kanıtla.
3. En büyük kullanıcı etkisine sahip darboğazı seç; geniş kapsamlı veya kör optimizasyon yapma.
4. Kritik/LCP medyayı yanlışlıkla lazy-load etme; ekran dışı medya, width/height, responsive kaynak ve cache davranışını düzenle.
5. Kullanılmayan kodu, çift scripti, listener/observer sızıntısını, gereksiz render ve büyük DOM artışını incele.
6. Değişiklik sonrası aynı koşullarda yeniden ölç; görsel doğruluk, erişilebilirlik ve iş akışı regresyonunu kontrol et.

## Beklenen çıktı

- Önce/sonra metrikleri ve ölçüm koşulları
- Kanıtlanan darboğaz, yapılan değişiklik ve etkisi
- Kalan maliyetler ve doğrulama sınırlamaları

## Tamamlanma ölçütü

Hedef metrikte ölçülebilir iyileşme veya net bir blokaj kanıtı vardır; işlev, görsel kalite ve kritik yükleme davranışı bozulmamıştır.
