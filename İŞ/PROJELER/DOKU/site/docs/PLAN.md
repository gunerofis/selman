# DOKU — kusursuzlaştırma planı

## 11 Ekim 2026 galeri ve kategori planı

Uygulama tamamlandı: 415 görsel, 326 ürün kartı, 807 kategori; 67 seri ve 956 yerel kartela. Sekiz takım görselinin monogramları kaldırıldı. Gerçek hesapla giriş, etiket ekleme, kalıcı kayıt ve silme geçti.

- Görselleri incele; farklı tasarımları ayrı ürün yap.
- Aynı tasarımın renk ve mekân türevlerini bir kartta birleştir.
- Her takım için TS, GS, BJK veya FB kartı aç; ülke tasarımlarını ülke kartında topla.
- Takımlar ve Ülkeler kategorilerini ekle; kart içinde varyantları göster.
- Her etiketi kategori yap; görsellerdeki tekrar sayısına göre çoktan aza sırala.
- Bir ürünü tüm ilgili kategorilere bağla; yönetimde etiket değişince kategorileri güncelle.
- Kaplama kartela kaynağı yalnız DOKU YÖNETİM\06 KAPLAMALAR içinde tutulur; site kaynağında ve sitede yazılmaz.
- Kodları ve eski görsel adreslerini koru; kontrolleri çalıştır ve yayınla.

Güncelleme: 24 Eylül 2026. Yük: 100 üzerinden iş yükü. Durum: ☐ açık · ◐ kısmen · ☑ bitti.

| # | Durum | İş | Yük |
|---|---|---|---|
| 1 | ☑ | 9 tema `catalog`'a taşındı (taraftar teması kaldırıldı → 8). `app.js`, `style.css`, `atelier.css`, `atelier.js`, `catalog.js`, `urun/product.*` silindi. `doku.css`'ten ölü kurallar çıkarıldı. | 6 |
| 2 | ☑ | `docs/` canlıya eşitlendi: MARKA-KARARLARI, CALISMA-OZETI, iki proje becerisi. | 5 |
| 3 | ☑ | Tek kaynak `data/catalog.json`: sabit `id` + `slug` + `theme`, gizli kayıt desteği. | 20 |
| 4 | ☑ | `tools/build.mjs`: ana sayfa, galeri, tasarım, tema, 404, yönlendirme, sitemap, robots tek komutla üretilir. | 25 |
| 5 | ☑ | 62 statik tasarım sayfası `/tasarim/<slug>/`: HTML'de başlık, açıklama, görsel, canonical, OG, breadcrumb, benzer tasarımlar. | 30 |
| 5b | ☑ | 8 tema sayfası `/tema/<slug>/`. | 12 |
| 6 | ☑ | `/urun/?tasarim=DK-xxx` → yeni sayfa; bilinmeyen → galeri; `noindex`. | 8 |
| 7 | ☑ | `robots.txt`, `sitemap.xml` (72 adres), canonical, OG + 72 paylaşım görseli (`/og/`), Organization ve BreadcrumbList JSON-LD. | 15 |
| 8 | ☑ | PNG'ler WebP oldu: 3,8 MB → 110 KB. | 5 |
| 9 | ☑ | `srcset` (540/900/tam), 62 büyük görsel ≤200 KB, fontlar gömülü, Google Fonts kaldırıldı. | 25 |
| 10 | ☑ | Galeri: köşe logosu, gizli `h1`, atla bağlantısı, alt metinler. Tema rengi eşitlendi. axe WCAG AA: 5 sayfa temiz. | 8 |
| 11 | ☑ | Ana sayfadan 4 bölüm çıkarıldı (Nereden başlamak, Yeni bir çizgi, Size ait bir işaret, Üç farklı çizgi); 12 görsel; mobil 8,6 MB → 1,0 MB. | 30 |
| 12 | ☑ | Kulüp adları metinden kaldırıldı. 9 Ekim 2026 isteğiyle DK-056/057/058/059/062 ve 148/149 görselleri kataloğa geri alındı; resmî bağlantı iddiası eklenmedi. | 6 |
| 13 | ☐ | "Fotoğraftan duvara" çocuk fotoğrafı için ebeveynden yazılı kullanım izni al. (Faris) | 3 |
| 14 | ☑ | `tools/check.mjs`: bağlantı, srcset, id, canonical, h1, alt, sitemap, kulüp adı, gizli görsel, boyut. | 10 |
| 16 | ☑ | `404.html` eklendi. Barındırma bu dosyayı kullanıyor mu, yayından sonra kontrol et. | 3 |
| 17 | ☐ | `.webp` MIME ve önbellek süresi barındırmada; siteden değişmiyor. Kendi alan adına geçerken barındırma ayarında düzelt. | 6 |
| 18 | ☑ | Eski kopya `_ESKI` diye adlandırıldı, `hosting.json`'ı devre dışı. | 2 |
| 19 | ☐ | Yayından sonra: Search Console'a site + sitemap ekle; 2 hafta sonra kapsam ve hız raporunu oku. | 5 |
| 20 | ☑ | Üst menü gerçek sayfalara bağlandı: `/mekanlar/` + 3 mekân listesi (`/mekan/ev/`, `/mekan/cocuk-odasi/`, `/mekan/isletme/`), `/tasarimlar/` (8 tema), `/ozel-tasarim/`, `/iletisim/`. Ortak üst menü ve alt bilgi her sayfada. | 25 |
| 21 | ☑ | Tekrarlayan bilgi metinleri kısaltıldı/silindi; tasarım sayfasına önceki/sonraki gezinme ve mobilde form görünmeyince çıkan "teklif iste" çubuğu eklendi. | 10 |
| 15 | ◐ | Etiket yönetimi tamamlandı: 177 görsel, kalıcı kayıt, yönetici yetkisi, geçmiş, yedek ve geri alma. Diğer içerik yönetimi ayrı aşama. | 80 |

Kalan: 13, 17, 19 (14 puan) + diğer içerik yönetimi.

## 9 Ekim 2026 görsel kontrolü

- Kök klasörde 102 PNG, `2. parti` klasöründe 64 PNG: 166 kaynak görselin tamamı yayımlanan görsellerle bire bir eşleşiyor.
- Eksik 14 görsel G-134–137, G-139–142, G-146–149, G-164–165 olarak eklendi. 5 tasarım sayfası açıldı; G-148/149 DK-063'e bağlandı.
- Yayında 74 tasarım ve 177 galeri görseli var. `node tools/check.mjs`: 93 HTML, 91 sitemap adresi, 74 tasarım.
- GPT-5.6 Sol SEO metinleri ana sayfa, galeri, 8 tema, 3 mekân, özel tasarım ve 74 tasarım sayfasına uygulandı; 11 ürün açıklaması düzeltildi.

## Kararlar (24 Eylül 2026)
1. Ana sayfadan yalnız 4 bölüm çıkar: Nereden başlamak istersiniz?, Yeni bir çizgi bulun., Size ait bir işaret., Üç farklı çizgi. Diğerleri aynen kalır. (#11)
2. Kulüp adları kullanılmaz; arma/monogramlı görseller yayından çekildi, arşivde duruyor. (#12)
3. Galeride köşede küçük `doku.` logosu. (#10)
4. Yönetim paneli ayrı aşama. (#15)
5. Kendi alan adı sonra; o gün yalnız `data/site.json` → `url` değişir, `node build.mjs` çalışır.
