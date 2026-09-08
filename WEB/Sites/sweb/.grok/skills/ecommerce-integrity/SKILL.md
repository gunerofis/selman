---
name: ecommerce-integrity
description: Ürün, varyant, fiyat, stok, sepet, kampanya, sipariş ve ödeme verisinin uçtan uca bütünlüğünü korur ve denetler. E-ticaret verisini etkilemeyen sıradan görsel değişiklikte kullanma. Use when the user runs /ecommerce-integrity.
---

# Ecommerce Integrity

Ticari verinin tek gerçek kaynağını koru; görünüm veya istemci girdisini finansal doğruluk kaynağı sayma.

## Girdiler

- Ürün/katalog, fiyat, stok, kampanya ve sipariş veri kaynakları
- Etkilenen route, API, admin, sepet, checkout ve ödeme akışları
- Para birimi, vergi/kargo/indirim kuralları ve kabul senaryoları

## Akış

1. Ürün ID, varyant ID, SKU, slug, fiyat, para birimi, stok ve görsel alanlarının tek gerçek kaynağını haritala.
2. İstemciden gelen toplam, indirim, stok veya ödeme durumuna güvenme; sunucuda güvenilir veriden yeniden hesapla.
3. Sepete ekleme, sipariş ve ödeme işlemlerinde çift tetikleme, yarış durumu ve idempotency riskini kontrol et.
4. Ürün-görsel, varyant-seçenek, fiyat-eski fiyat ve stok-availability eşleşmesini temsilî kayıtlarla doğrula.
5. URL/slug değişikliğinde redirect, canonical, sepet kalıcılığı ve dış kanal etkisini planla.
6. Sahte yorum, stok, aciliyet, kampanya, teslimat veya ürün özelliği üretme; eksik ticari alanı kaynaktan doğrula.
7. Kritik akışı gerçek sipariş/ödeme oluşturmadan sandbox veya kontrollü test verisiyle doğrula.

## Beklenen çıktı

- Veri kaynağı ve akış haritası
- Bulunan bütünlük/idempotency riskleri ve düzeltmeler
- Test edilen ürün, sepet ve sipariş senaryoları

## Tamamlanma ölçütü

Tutar ve durumlar güvenilir sunucu kaynağıyla tutarlı, kritik işlemler tekrar isteklere dayanıklı ve ürün kimlikleri uçtan uca korunmuştur.
