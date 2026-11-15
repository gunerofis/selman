---
name: orkestra-kayit
description: Orkestra iş kaydını isler.json üzerinden okur veya ekler. Üretilen IS_TAKIBI.md dosyasını elle düzenlemede kullanma.
---

# Orkestra kayıt

Kaynak JSON’dur. Üretilen görünüm elle düzeltilmez.

## Akış

1. Yolu HARİTA’dan al: `PD\Orkestra\OPERASYON\00_YONETIM\kayitlar\isler.json`.
2. `IS_TAKIBI.md` yalnız okunur. Değişiklik JSON’a yazılır, görünüm yeniden üretilir.
3. Shopify mağaza işi bu skill’in dışında `shopify-live-ops` ile yürür. Sipariş ve stok buradan canlıya yazılmaz.
4. Sonuç kayda kısa işlenir: kimlik, tarih, yapılan, doğrulama.

## Değişmezler

- Üretilen markdown’ı kaynak sanma.
- Canlı sipariş, fiyat veya stok değişikliği yok.
