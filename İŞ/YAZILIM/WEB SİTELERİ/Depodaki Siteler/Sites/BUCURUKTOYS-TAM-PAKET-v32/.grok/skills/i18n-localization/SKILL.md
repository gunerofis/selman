---
name: i18n-localization
description: Çok dilli içerik, locale route’u, çeviri anahtarı, tarih/sayı/para biçimi, hreflang veya RTL davranışını geliştirir ve doğrular. Tek dilde küçük metin düzeltmesinde kullanma. Use when the user runs /i18n-localization.
---

# Internationalization and Localization

Dil değişimini yalnız metin çevirisi değil route, veri, biçim ve yön davranışı olarak ele al.

## Girdiler

- Desteklenen locale’ler, varsayılan/fallback dili ve URL stratejisi
- Çeviri kaynağı/CMS, locale algılama ve kullanıcı tercihi saklama yöntemi
- Etkilenen sayfalar, dinamik içerik ve SEO ilişkileri

## Akış

1. Hardcoded metinleri, çeviri anahtarlarını, çoğul/cinsiyet kurallarını ve eksik anahtar davranışını çıkar.
2. Tarih, saat, sayı, para birimi, ölçü ve sıralamayı locale-aware API’lerle biçimlendir; veri değerini çeviri metnine gömme.
3. Route, canonical, sitemap ve `hreflang` ilişkisini karşılıklı ve doğru dil/bölge kodlarıyla kur.
4. Dil seçiminin navigasyon, query, oturum ve yeniden yüklemede nasıl korunacağını doğrula.
5. Arapça için `lang`, `dir="rtl"`, logical CSS özellikleri, ikon yönü, odak sırası ve metin taşmasını ayrıca test et.
6. TR, EN ve AR için uzun/kısa içerik, eksik çeviri, fallback ve 360–1440 px görünümü kontrol et.

## Değişmezler

- Ürün özelliği, teslimat, garanti veya hukuki metni çeviri sırasında uydurma.
- Çeviri metnini CSS pseudo-content ile üretme.
- Bir dilde URL veya SEO ilişkisini değiştirirken diğer locale’leri yetim bırakma.

## Çıktı ve tamamlanma

Değişen anahtar/route’lar, fallback davranışı, hreflang ilişkileri ve locale bazlı testleri raporla. RTL ve dinamik biçimlendirme gerçek render’da doğrulanmadan tamamlandı deme.
