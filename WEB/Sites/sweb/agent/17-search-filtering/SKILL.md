---
name: 17-search-filtering
description: Site araması, autocomplete, filtre, facet, sıralama veya sonuç sayfalamasını geliştirir ve doğrular. Statik küçük liste ya da yalnız görsel form düzenlemesinde kullanma.
---

# Search and Filtering

Arama sonucunu veri kaynağı, URL durumu, performans ve SEO ile tutarlı tut.

## Girdiler

- Arama/index veri kaynağı, alanlar, dil ve eşleşme kuralları
- Filtre/facet/sıralama tanımları, katalog hacmi ve pagination modeli
- Beklenen URL, analytics ve indeksleme davranışı

## Akış

1. Query normalizasyonu, typo/fuzzy davranışı, filtre birleşim mantığı ve sıralama önceliklerini açıkça tanımla.
2. Kullanıcı girdisini güvenli biçimde doğrula; SQL/index injection ve sınırsız sorgu maliyetini önle.
3. Büyük veriyi istemciye tamamen yüklemek yerine mevcut server/index yeteneklerini kullan; debounce, iptal ve stale response koruması uygula.
4. Query, filtre, sıralama ve sayfayı paylaşılabilir URL durumuna bağla; geri/ileri ve yenileme davranışını koru.
5. Loading, empty, partial, error, no-more-results ve filtre temizleme durumlarını erişilebilir biçimde uygula.
6. Filtre URL’lerinin canonical/noindex stratejisini gerçek SEO gereksinimine göre doğrula; analytics eventlerini gerçek etkileşimde ve tekil gönder.
7. Kombinasyon, sınır değeri, özel karakter, çok dil, mobil ve performans testleri yap.

## Değişmezler

- Sonuç veya ürün verisini uydurma; görünen toplamı gerçek sorgu sonucuyla eşleştir.
- Yalnız istemci tarafı gizlemeyi güvenli filtreleme sayma.
- Her filtre kombinasyonunu kontrolsüz indekslenebilir URL’ye dönüştürme.

## Çıktı ve tamamlanma

Arama semantiği, veri kaynağı, URL/SEO davranışı, performans sınırı ve test matrisi raporlanır. Hızlı ardışık isteklerde eski sonucun yeniyi ezmediği doğrulanmadan tamamlandı deme.
