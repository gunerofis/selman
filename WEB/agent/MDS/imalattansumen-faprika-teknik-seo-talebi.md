# İmalattan Sümen — Faprika Teknik SEO Talebi

**Hazırlanma tarihi:** 27 Ağustos 2026  
**Site:** https://www.imalattansumen.com  
**Panel talep yolu:** `/admin/faprika/createsupport/`

Bu metin Faprika panelindeki “Destek Sistemi > Yeni Talep” alanından gönderilmiştir.

## Gönderim kaydı

- Talep numarası: `38006`
- Gönderim zamanı: `27.08.2026 11:56:28`
- İlk durum: `Açık`
- Panel detay yolu: `/admin/faprika/editsupport/38006/`
- Başlık ve mesaj içindeki canonical örnekleri gönderim sonrasında detay sayfasından doğrulandı.

## Önerilen talep başlığı

Kategori sayfalama canonical, geçersiz sayfa ve görsel HTML iyileştirmeleri

## Gönderilecek talep metni

Merhaba,

Mağazamızın kategori sayfalarında sayfalama URL'leriyle ilgili teknik SEO sorunu bulunuyor. Geçerli ikinci sayfalar ürün göstermesine rağmen canonical etiketi ilk kategori sayfasını işaret ediyor:

- `https://www.imalattansumen.com/sumen-takimlari/?pagenumber=2` — 35 ürün var; canonical `/sumen-takimlari/`
- `https://www.imalattansumen.com/deri-sumen-takimlari/?pagenumber=2` — 3 ürün var; canonical `/deri-sumen-takimlari/`
- `https://www.imalattansumen.com/kanvas-tablo/?pagenumber=2` — 16 ürün var; canonical `/kanvas-tablo/`

Ayrıca aynı kategorilerde `?pagenumber=3` gibi ürün bulunmayan sayfalar HTTP 200 ve `index, follow` döndürüyor.

Beklenen düzeltme:

1. Ürün içeren geçerli sayfalama URL'leri tam URL'lerine kendine referans veren canonical üretmeli. Örnek: sayfa 2 canonical'ı `...?pagenumber=2` olmalı.
2. `pagenumber=1` ana kategori URL'sine yönlendirilmeli veya canonical ana temiz URL olmalı.
3. Son sayfanın ötesindeki boş/geçersiz sayfalar tercihen HTTP 404 döndürmeli; en azından indekslenebilir boş 200 sayfa oluşmamalı.
4. Sıralama ve takip parametreleri canonical'a eklenmemeli; yalnızca geçerli sayfalama parametresi korunmalı.
5. Sayfa 2+ title'larında istenirse “Sayfa 2” benzeri ayırt edici ek kullanılmalı.

Ek tema bulguları:

- Kategori panelindeki `HeaderArea` alanı hem kategori şablonu 1 hem şablon 2'de kaydediliyor fakat canlı HTML'de render edilmiyor. Bu alanın H1 ile ürün gridinin arasında bir kez gösterilmesini rica ediyoruz.
- Ürün görsellerinde özel `data-src` lazy-load mekanizması çalışıyor ve medya ayarında WebP dönüşümü açık. Ancak mevcut görseller JPEG/PNG olarak servis ediliyor.
- Kategori ürün görsellerinde `srcset`, `sizes`, `width` ve `height` öznitelikleri bulunmuyor. Responsive görsel ve boyut özniteliklerinin eklenmesini; ilk ekran dışı görsellerin lazy, LCP adayı ilk görselin eager/öncelikli yüklenmesini rica ediyoruz.

Düzeltme sonrası aşağıdaki URL'lerde canonical, HTTP durum kodu, robots ve ürün sayısı birlikte kontrol edilmelidir.

Teşekkürler.

## Kabul testi

| Test | Beklenen sonuç |
|---|---|
| Geçerli kategori sayfa 2 | HTTP 200, ürün var, canonical aynı sayfa 2 URL'si |
| `pagenumber=1` | Temiz kategori URL'si veya ona canonical |
| Ürün bulunmayan sayfa 3+ | HTTP 404; indekslenebilir boş 200 olmamalı |
| Sıralama parametreleri | Canonical temiz kategori/sayfalama URL'si |
| HeaderArea | H1 ile ürün gridi arasında bir kez görünür |
| Ürün görselleri | İlk kritik görsel hariç lazy; `width`, `height`, `srcset`, `sizes` mevcut |

## Mevcut ölçüm özeti

- Sümen Takımları sayfa 1/2 ürün sayısı: 96 / 35
- Deri Sümen Takımları sayfa 1/2 ürün sayısı: 96 / 3
- Kanvas Tablo sayfa 1/2 ürün sayısı: 96 / 16
- Bu üç kategorinin boş sayfa 3 URL'leri: HTTP 200, `index, follow`, canonical sayfa 1
- Sümen Takımları ilk HTML'i: 100 görsel etiketi; 96 ürün görselinde `/lazy-logo.jpg` + `data-src`
- Standart `loading="lazy"`: 0
- `srcset`: 0
- `width`/`height`: 0
- Panel `PictureConvertToWebP`: açık
- WebP kalite: 80
- Örnek mevcut görseller: JPEG/PNG içerik türünde, `Cache-Control: public,max-age=31536000`

## Gönderim sonrası ek bulgular

Bu bölüm talep `38006` oluşturulduktan sonra tespit edilmiş ve kullanıcı yetkisiyle aynı talebe ek mesaj olarak gönderilmiştir.

- Ek mesaj doğrulaması: Talep detayında iki mesaj satırı mevcut
- Ek mesaj içeriği: Schema, sosyal meta ve URL normalizasyon bulguları
- Talep durumu: `Açık`

### Yapılandırılmış veri ve sosyal meta

- 20 kategori sayfasında JSON-LD: 0/20
- `BreadcrumbList`: 0/20
- `ItemList`: 0/20
- Eksiksiz Open Graph seti: 0/20
- Twitter Card: 0/20
- Örnek kategori şablonunda `itemtype` ve `itemprop` microdata bulunmuyor.
- Kategori breadcrumb'ı kullanıcıya görünür olsa da yapılandırılmış veri olarak işaretlenmemiş.

Önerilen ek geliştirme:

1. Site genelinde `Organization` veya uygun `OnlineStore` JSON-LD.
2. Kategori sayfalarında görünür breadcrumb ile bire bir uyumlu `BreadcrumbList`.
3. Kategori ürün sırasını temsil eden, gerçek görünen ürünlerle uyumlu `ItemList`.
4. Kategoriye özel `og:title`, `og:description`, `og:url`, `og:image` ve Twitter Card etiketleri.

### URL normalizasyonu

- `http://imalattansumen.com/...` önce HTTPS non-www, sonra HTTPS www adresine gidiyor: iki yönlendirme.
- `http://www.imalattansumen.com/...` tek yönlendirmeyle HTTPS www adresine gidiyor.
- Slash'sız kategori URL'si HTTP 200 dönüyor; canonical slash'lı temiz URL.
- Büyük harfli kategori URL'si HTTP 200 dönüyor; canonical küçük harfli temiz URL.
- `?pagenumber=1` HTTP 200 dönüyor; canonical temiz ana kategori URL'si.

Canonical birleştirmesi mevcut olsa da önerilen davranış, alternatif URL'lerin tek adımda küçük harfli, www, HTTPS ve slash'lı temiz URL'ye 301 yönlendirilmesidir. `pagenumber=1` de temiz kategori URL'sine 301 yönlendirilmelidir.

## Sitemap tekilleştirme ve lastmod bulgusu — 27 Ağustos 2026

- Canlı sitemap: `https://www.imalattansumen.com/sitemap.xml`
- Toplam `<loc>` satırı: 491
- Benzersiz URL: 490
- Yinelenen URL: `https://www.imalattansumen.com/bize-ulasin/` — 2 kez
- Parametreli, HTTP/non-www veya slash'sız URL: 0
- `lastmod=2026-08-27`: 490 kayıt
- `lastmod=2023-09-21`: 1 kayıt

İstenen düzeltme: yinelenen kayıt tekilleştirilmeli ve `lastmod` sitemap oluşturulma tarihinden değil, ilgili sayfanın gerçek içerik/ürün/SEO değişiklik tarihinden üretilmelidir. Bu kanıtlar talep `#38006`ya üçüncü mesaj olarak gönderildi ve panelde doğrulandı.

## Faprika yanıtı ve dördüncü takip — 27 Ağustos 2026

Faprika 27 Ağustos 2026 14:25:31 tarihinde şu kapsamda yanıt verdi: konu inceleniyor ve bilgi aktarılacak. Tamamlanmış düzeltme veya yayın tarihi bildirilmedi; talep durumu `Açık` kaldı.

Yanıt sonrasında canlı testler yeniden çalıştırıldı:

- Sümen sayfa 2: 36 ürün; canonical ve title hâlâ sayfa 1 ile aynı.
- Deri Sümen sayfa 2: 3 ürün; canonical sayfa 1.
- Kanvas sayfa 2: 63 ürün; canonical sayfa 1.
- Üç örnekte boş sayfa 3: HTTP 200, 0 ürün, `index, follow`.
- 20 kategoride JSON-LD, BreadcrumbList, ItemList, eksiksiz OG ve Twitter Card: 0/20.
- Genel Ayarlar'da `CanonicalUrlsEnabled`, `OpenGraphMetaTags` ve `TwitterMetaTags` işaretli olmasına rağmen canlı kategori HTML'inde OG/Twitter çıktısı yok.
- Medya Ayarları'nda WebP dönüşümü açık ve kalite 80; buna rağmen 798 kategori görselinde `srcset`, `width` ve `height` sayısı 0.
- Sitemap hâlâ 491 `<loc>` ve 490 benzersiz URL; lastmod dağılımı değişmedi.

Bu kanıtlarla talep `#38006`ya dördüncü takip mesajı gönderildi ve mesajın talep detayında görünür olduğu doğrulandı. Faprika'dan tema/uygulama düzeltmelerinin yayına alınması ve tamamlanma zamanının paylaşılması istendi.
