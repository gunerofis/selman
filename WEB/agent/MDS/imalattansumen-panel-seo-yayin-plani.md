# İmalattan Sümen — Panel SEO Yayın Planı

**Hazırlanma tarihi:** 27 Ağustos 2026  
**Durum:** Salt okunur panel keşfi tamamlandı; canlı sitede değişiklik yapılmadı  
**İlgili dosyalar:**

- `imalattansumen-kategori-seo-calismasi.md`
- `imalattansumen-kategori-seo-uygulama-paketi.md`

## 1. Amaç

Bu plan, hazırlanmış kategori SEO içeriklerinin Faprika yönetim panelindeki gerçek alanlara kontrollü biçimde aktarılması için oluşturulmuştur. Panelde 21 aktif kategori bulundu. Bunların 20'si ticari kategori SEO paketinde yer alıyor; `Sizden Gelenler` ayrı bir sosyal kanıt çalışması olarak tutuluyor.

Bu aşamada yapılanlar:

- Yönetim panelindeki kategori listesi okundu.
- Her kategorinin gerçek kayıt ID'si ve slug'ı eşleştirildi.
- Düzenleme formundaki gerçek alanlar belirlendi.
- Global title tekrarının kaynağı doğrulandı.
- Mevcut üst/alt içerik ve metadata kapsamı kaydedildi.
- Canlı siteye POST ile değişiklik gönderilmedi.

---

## 2. Paneldeki gerçek alan eşlemesi

Kategori düzenleme yolu:

`/admin/category/edit/{CATEGORY_ID}/`

| İçerik paketindeki alan | Panel alanı | Teknik ad | Önemli not |
|---|---|---|---|
| H1 / kategori adı | Kategori Adı | `Name` | H1, menü etiketi ve breadcrumb aynı alandan üretilebilir. Değişiklik navigasyonu da etkiler. |
| Üst kısa açıklama | Üst Alan İçeriği | `HeaderArea` | Ürün listesinden önce render ediliyor. TinyMCE HTML alanıdır. |
| Alt kapsamlı içerik + SSS | Kategori Açıklaması | `Description` | Ürün listesinden sonra render ediliyor. TinyMCE HTML alanıdır. |
| SEO title | Sayfa Başlığı | `MetaTitle` | Global mağaza adı ayrıca eklenir; alana marka tekrar yazılmamalı. |
| Meta description | Meta Açıklama | `MetaDescription` | Her kategori için benzersiz olmalı. |
| URL slug | Url | `SeName` | İlk uygulamada değiştirilmemeli. |
| Üst kategori | Üst Kategori | `ParentCategoryId` | Menü/breadcrumb yapısını etkiler; ayrı mimari dalgasında değiştirilmeli. |
| Sayfa başına ürün | Ürün Sayısı | `PageSize` | Şu anda tüm kategorilerde 96. Performans testiyle 24 veya 36'ya indirilmeli. |
| Şablon | Kategori Şablonu | `CategoryTemplateId` | ID 2 ve 12 şablon 2; diğerleri çoğunlukla şablon 1. Değiştirmeden önce görsel QA gerekir. |
| Yayın durumu | Aktif | `Published` | SEO güncellemesinde açık kalmalı. |
| Sıra | Sıra | `DisplayOrder` | Menü sırasını etkiler; içerik güncellemesinden ayrı ele alınmalı. |

### Ayrı H1 alanı yok

Panelde bağımsız bir H1 alanı bulunmadı. Canlı sayfadaki H1, `Name` alanından üretiliyor. Bu nedenle:

- Yalnızca SEO amacıyla kategori adını gereksiz yere uzatmayın.
- `Sümen Takımları` gibi güçlü ve doğal mevcut adlar korunabilir.
- `OFİS VE KIRTASİYE` gibi zayıf veya tamamen büyük harfli adlar kontrollü biçimde `Ofis Masaüstü Aksesuarları` olarak değiştirilebilir.
- `Ucuz Sümen Takımları` adı, ticari konumlandırma uygunsa `Uygun Fiyatlı Sümen Takımları` yapılabilir; slug ilk aşamada korunur.

---

## 3. Global title ayarı — önce çözülmesi gereken sistemik konu

Canlı panelde şu değerler doğrulandı:

| Ayar | Teknik ad | Mevcut değer | Hedef değer |
|---|---|---|---|
| Varsayılan Sayfa Başlığı | `SeoSettings.DefaultTitle` | `Sümen Takımı Modelleri ve Fiyatları - Deri & Ahşap Sümen Takımı \| İmalattan` | `Sümen Takımı Modelleri ve Fiyatları \| İmalattan` |
| Sayfa Başlığı Ayracı | `SeoSettings.PageTitleSeparator` | ` - ` | ` \| ` |
| Sayfa Başlığı Şablonu | `SeoSettings.PageTitleSeoAdjustment` | Mağaza adı sayfa başlığından sonra (`10`) | `---` (`0`) — global ek yok |

Panel yolu:

`/admin/setting/generalcommon/`

### Neden önce bu ayar?

Mevcut `10` ayarında kategori `MetaTitle` değeri, global varsayılan başlıkla otomatik birleştiriliyor. Örneğin panelde yaklaşık 63 karakter olan kategori başlığı, canlı HTML'de 140 karakteri aşabiliyor. Pilot sırasında varsayılan başlığı yalnızca `İmalattan` yapmak ana sayfa title'ını gereğinden fazla kısalttı. Ardından `---` (`0`) seçeneği canlı test edildi: ana sayfa anlamlı varsayılan title'ı kullanırken alt sayfa kendi `MetaTitle` değerini ek olmadan kullanıyor. Hedef yapı bu doğrulanmış davranışa göre belirlenmiştir.

### Değişiklik öncesi zorunlu test

Global ayar tüm siteyi etkileyebileceği için aşağıdaki URL tiplerinden en az ikişer örnek kaydedilmelidir:

- Ana sayfa
- Kategori
- Sayfalama URL'si
- Ürün
- Blog yazısı
- Kurumsal içerik sayfası

Her örnek için önceki `<title>` değeri kaydedilmeli. Ayar sonrası title'ın boş kalmadığı, marka tekrarının oluşmadığı ve anlamlı sayfa başlığının korunduğu doğrulanmalıdır.

### Kategori MetaTitle kuralı

Global ayar hedef değere getirildikten sonra kategori alanına marka dahil tam final title yazılmalıdır:

`Sümen Takımı Modelleri ve Fiyatları | İmalattan`

yazılmalıdır. `---` seçeneği bu değeri değiştirmeden render etmelidir:

`Sümen Takımı Modelleri ve Fiyatları | İmalattan`

Global varsayılan başlık alt sayfaya eklenmeyeceği için kategori alanındaki `| İmalattan` tekrar oluşturmaz.

---

## 4. Kategori ID ve URL eşleme tablosu

| ID | Panel kategori adı | Slug / canlı yol | Üst kategori ID | Şablon | Yayın dalgası |
|---:|---|---|---:|---:|---:|
| 8 | Sümen Takımları | `/sumen-takimlari/` | 0 | 1 | Pilot |
| 15 | Deri Sümen Takımları | `/deri-sumen-takimlari/` | 0 | 1 | 1 |
| 13 | Ahşap Sümen Takımları | `/ahsap-sumen-takimlari/` | 8 | 1 | 1 |
| 16 | Lüks Sümen Takımları | `/luks-sumen-takimlari/` | 0 | 1 | 1 |
| 23 | Ucuz Sümen Takımları | `/ucuz-sumen-takimlari/` | 0 | 1 | 1 |
| 1023 | Sümen Takımı Oluşturma | `/sumen-takimi-olusturma/` | 8 | 1 | 1 |
| 9 | OFİS VE KIRTASİYE | `/ofis-ve-kirtasiye/` | 0 | 1 | 2 |
| 12 | Masa İsimlikleri | `/masa-isimlikleri-3/` | 0 | 2 | 2 |
| 19 | Kristal Masa İsimlikleri | `/kristal-masa-isimlikleri/` | 0 | 1 | 2 |
| 14 | Evrak Rafları | `/evrak-raflari/` | 0 | 1 | 2 |
| 17 | Magazinlik & Dosyalık | `/magazinlik-dosyalik/` | 0 | 1 | 2 |
| 18 | Çöp Kovaları | `/cop-kovalari/` | 0 | 1 | 2 |
| 20 | Bayraklar | `/bayraklar/` | 0 | 1 | 3 |
| 22 | Masa Bayrakları | `/masa-bayraklari/` | 0 | 1 | 3 |
| 21 | Makam Bayrakları | `/makam-bayraklari/` | 0 | 1 | 3 |
| 4 | Kanvas Tablo | `/kanvas-tablo/` | 0 | 1 | 4 |
| 6 | Dekoratif Kanvas Tablo | `/dekoratif-kanvas-tablo-6/` | 0 | 1 | 4 |
| 5 | Atatürk Portreleri | `/ataturk-portreleri/` | 0 | 1 | 4 |
| 2 | Düğmeli Makam Panosu | `/dugmeli-makam-panosu/` | 0 | 2 | 4 |
| 3 | Resimli Makam Panoları | `/resimli-makam-panosu-51-2/` | 0 | 1 | 4 |
| 7 | Sizden Gelenler | `/sizden-gelenler/` | 0 | 1 | Ayrı sosyal kanıt işi |

### Dikkat edilmesi gereken mevcut hiyerarşi

Yalnızca iki ticari alt kategori şu anda gerçek üst kategoriye bağlı:

- Ahşap Sümen Takımları → Sümen Takımları
- Sümen Takımı Oluşturma → Sümen Takımları

Deri, Lüks ve Ucuz Sümen Takımları henüz üst kategori ID 8'e bağlı değil. Bayrak ve ofis aksesuarı alt kategorileri de düz seviyede. Hiyerarşi değişikliği menü, breadcrumb ve muhtemel URL/ürün listeleme davranışını etkileyebileceğinden metadata/içerik dalgasından sonra ayrı test edilmelidir.

---

## 5. Mevcut içerik ve ayar yedeği

Tüm kategoriler aktif ve `PageSize = 96` durumunda.

| ID | Kategori | Üst alan kelime | Alt açıklama kelime | Meta title uzunluğu | Meta description uzunluğu |
|---:|---|---:|---:|---:|---:|
| 2 | Düğmeli Makam Panosu | 0 | 0 | 64 | 155 |
| 3 | Resimli Makam Panoları | 0 | 0 | 72 | 158 |
| 4 | Kanvas Tablo | 0 | 0 | 60 | 150 |
| 5 | Atatürk Portreleri | 0 | 0 | 69 | 170 |
| 6 | Dekoratif Kanvas Tablo | 0 | 0 | 60 | 150 |
| 7 | Sizden Gelenler | 0 | 0 | 0 | 0 |
| 8 | Sümen Takımları | 0 | 173 | 63 | 134 |
| 9 | OFİS VE KIRTASİYE | 0 | 0 | 75 | 173 |
| 12 | Masa İsimlikleri | 0 | 207 | 68 | 148 |
| 13 | Ahşap Sümen Takımları | 0 | 249 | 73 | 182 |
| 14 | Evrak Rafları | 0 | 150 | 57 | 146 |
| 15 | Deri Sümen Takımları | 40 | 95 | 61 | 159 |
| 16 | Lüks Sümen Takımları | 42 | 208 | 54 | 154 |
| 17 | Magazinlik & Dosyalık | 0 | 81 | 71 | 147 |
| 18 | Çöp Kovaları | 0 | 210 | 59 | 159 |
| 19 | Kristal Masa İsimlikleri | 0 | 222 | 64 | 154 |
| 20 | Bayraklar | 0 | 101 | 61 | 179 |
| 21 | Makam Bayrakları | 0 | 101 | 61 | 179 |
| 22 | Masa Bayrakları | 0 | 101 | 61 | 179 |
| 23 | Ucuz Sümen Takımları | 0 | 201 | 59 | 149 |
| 1023 | Sümen Takımı Oluşturma | 0 | 67 | 0 | 0 |

Bu tablo tam HTML yedeği değildir. Canlı değişiklikten hemen önce her düzenlenen kaydın `Name`, `HeaderArea`, `Description`, `MetaTitle`, `MetaDescription`, `SeName`, `ParentCategoryId`, `CategoryTemplateId`, `PageSize`, `Published` ve `DisplayOrder` değerleri ayrı bir geri alma dosyasına eksiksiz kaydedilmelidir.

---

## 6. Güvenli yayın sırası

### Aşama A — Değişiklik öncesi yedek

1. Global SEO ayarlarının mevcut değerlerini kaydet.
2. Pilot kategori ID 8'in tüm form alanlarını ham HTML/JSON yedeğine al.
3. Canlı sayfanın title, meta, H1, canonical, üst içerik, alt içerik ve ürün sayısını kaydet.
4. Search Console son 28 günlük sayfa/sorgu verisini dışa aktar.

### Aşama B — Global title pilotu

1. Varsayılan başlığı `Sümen Takımı Modelleri ve Fiyatları | İmalattan` yap.
2. Ayracı ` | ` yap.
3. Şablonu `---` (`0`) yaparak global başlığın alt sayfalara otomatik eklenmesini kapat.
4. En az 10 farklı URL tipinde title kontrolü yap.
5. Beklenmeyen boş/çift title varsa önceki ayarları geri yükle.

### Aşama C — Pilot kategori ID 8

1. `MetaTitle`: `Sümen Takımı Modelleri ve Fiyatları | İmalattan`
2. `MetaDescription`: uygulama paketindeki değer
3. `HeaderArea`: uygulama paketindeki üst açıklamanın HTML karşılığı
4. `Description`: alt açıklama ve SSS'nin temiz HTML karşılığı
5. `Name`: ilk pilotta `Sümen Takımları` olarak korunabilir.
6. `SeName`: değiştirilmez.
7. `PageSize`: ilk içerik pilotunda 96 olarak kalır; performans değişikliği ayrı test edilir.
8. Kaydet ve önbelleği temizle yalnızca gerekli ise.

### Aşama D — Pilot QA

Canlı sayfada:

- 200 durum kodu
- Tek H1
- Final title: `Sümen Takımı Modelleri ve Fiyatları | İmalattan`
- Benzersiz meta description
- Self-canonical
- Üst içeriğin ürünlerden önce görünmesi
- Alt içeriğin ürünlerden sonra görünmesi
- İç bağlantıların 200 olması
- Mobil taşma/bozuk HTML olmaması
- Ürün gridinin çalışması
- Sayfa 2 bağlantısının çalışması

kontrol edilir.

### Aşama E — Dalga 1–4

Pilot 24–48 saat teknik olarak stabil kaldıktan sonra:

- Dalga 1: sümen kategorileri
- Dalga 2: ofis aksesuarları ve isimlikler
- Dalga 3: bayraklar
- Dalga 4: kanvas, portre ve makam panoları

Her dalga sonrasında en az bir mobil ve bir masaüstü sayfa örneği kaynak koduyla doğrulanır.

---

## 7. Ayrı teknik geliştirme işleri

Panel içeriği güncellemesi aşağıdaki sorunları tek başına çözmez.

### T1 — Sayfalama canonical

Mevcut `/sumen-takimlari/?pagenumber=2` canonical'ı ilk sayfaya gidiyor. Şablon/kod seviyesinde sayfa 2'nin kendisine canonical üretmesi gerekir.

Kabul kriteri:

- Sayfa 1 → self-canonical
- Sayfa 2 → `?pagenumber=2` self-canonical
- Sayfa 2 ürünleri crawl edilebilir bağlantılarla erişilebilir

### T2 — Sayfa başına ürün ve görsel performansı

Tüm kategoriler panelde `PageSize = 96`. Pilot olarak ID 8 ve 15'te 24 veya 36 test edilmeli.

Kabul kriteri:

- Sonraki sayfalara gerçek `<a href>` bağlantıları
- İlk ekran dışı görsellerde lazy loading
- Responsive `srcset` ve `sizes`
- Görsellerde width/height
- İlk satır/LCP görselinde yanlış lazy loading olmaması
- Filtre ve sıralamanın bozulmaması

### T3 — Kategori şeması

Şablona görünür breadcrumb ile aynı `BreadcrumbList`; ürün sırasıyla aynı `ItemList` eklenmeli. Schema görünmeyen bilgi içermemeli.

### T4 — Sitemap

- Yinelenen `/bize-ulasin/` kaydı kaldırılmalı.
- `lastmod` gerçek değişiklik tarihine bağlanmalı.
- Sayfalama ve parametre politikasıyla uyumlu olmalı.

### T5 — Bilgi mimarisi

ParentCategory değişiklikleri ayrı staging/pilot çalışması olmalı. Özellikle:

- Deri, Lüks ve Uygun Fiyatlı Sümen → Sümen Takımları
- Masa ve Makam Bayrakları → Bayraklar
- Evrak Rafları, Magazinlik, Çöp Kovaları → Ofis Masaüstü Aksesuarları

Değişiklik sonrası breadcrumb, menü, kategori ürün sayısı ve canonical yeniden kontrol edilmelidir.

---

## 8. Geri alma planı

Her yayın dalgası için:

1. Değişiklikten önce form alanlarını zaman damgalı yedekle.
2. Güncellenen kategori ID'lerini kayıt altına al.
3. Hatalı render, ürün kaybı, 5xx, canonical bozulması veya boş title durumunda önceki alanları geri yükle.
4. Global title ayarı sorun çıkarırsa üç SEO ayarını birlikte önceki değerlerine döndür.
5. URL/slug değiştirilmediği için içerik geri alımında yönlendirme ihtiyacı oluşmaz.

Global title önceki değerleri:

- DefaultTitle: `Sümen Takımı Modelleri ve Fiyatları - Deri & Ahşap Sümen Takımı | İmalattan`
- Separator: ` - `
- Adjustment: mağaza adı sayfa başlığından sonra

---

## 9. Uygulama öncesi onay noktası

Canlı sitede ilk değişiklik yapılmadan önce aşağıdaki kapsam ayrı ayrı onaylanmalıdır:

- Global title ayarının site genelinde değiştirilmesi
- Pilot kategori ID 8 metadata ve içerik güncellemesi
- Kategori adlarının/H1'lerin değiştirilip değiştirilmemesi
- `PageSize` değerinin 96'dan 24 veya 36'ya indirilmesi
- ParentCategory hiyerarşi değişikliklerinin bu çalışmaya dahil olup olmaması

En düşük riskli ilk yayın: global title düzeltmesi + ID 8 metadata/üst/alt içerik pilotudur. URL, kategori adı, parent, şablon ve ürün sayısı ilk pilotta korunur.

---

## 10. Pilot yayın kaydı — 27 Ağustos 2026

**Durum:** Başarıyla canlıya alındı  
**Pilot kategori:** ID 8 — Sümen Takımları  
**Geri alma yedeği:** `imalattansumen-seo-pilot-yedek-2026-08-27.md`

### Uygulanan global SEO değerleri

| Ayar | Yayındaki değer |
|---|---|
| `SeoSettings.DefaultTitle` | Sümen Takımı Modelleri ve Fiyatları \| İmalattan |
| `SeoSettings.PageTitleSeparator` | ` \| ` |
| `SeoSettings.PageTitleSeoAdjustment` | `0` — `---`, global ek yok |

İlk denemede varsayılan başlığın yalnızca `İmalattan` yapılması, ana sayfanın title'ını gereğinden fazla kısalttı. Bu değer kalıcı bırakılmadı. `---` seçeneği canlı URL örnekleriyle test edildi: ana sayfa varsayılan title'ı kullanırken kategori ve ürünler kendi `MetaTitle` değerlerini global ek olmadan kullanıyor.

### Kategori ID 8 üzerinde değiştirilen alanlar

| Alan | Yayındaki değer/sonuç |
|---|---|
| `MetaTitle` | Sümen Takımı Modelleri ve Fiyatları \| İmalattan |
| `MetaDescription` | Deri, ahşap, lüks ve uygun fiyatlı sümen takımı modellerini inceleyin. Yönetici ve makam masaları için kişiye özel seçenekleri imalatçıdan alın. |
| `HeaderArea` | Uygulama paketindeki kısa giriş HTML'i kaydedildi. |
| `Description` | Kısa giriş + seçim rehberi + SSS + altı kategori iç bağlantısı kaydedildi. |

### Korunan alanlar

| Alan | Değer |
|---|---|
| `Name` | Sümen Takımları |
| `SeName` | sumen-takimlari |
| `ParentCategoryId` | 0 |
| `CategoryTemplateId` | 1 |
| `PageSize` | 96 |
| `DisplayOrder` | 1 |

### Canlı QA sonucu

| Kontrol | Sonuç |
|---|---|
| Ana sayfa HTTP | 200 |
| Ana sayfa title | Sümen Takımı Modelleri ve Fiyatları \| İmalattan — 47 karakter |
| Kategori HTTP | 200 |
| Kategori title | Sümen Takımı Modelleri ve Fiyatları \| İmalattan — 47 karakter |
| Meta description | Hedef metinle bire bir, 144 karakter |
| H1 | 1 adet — Sümen Takımları |
| Canonical | https://www.imalattansumen.com/sumen-takimlari/ |
| Robots | index, follow |
| İlk sayfa ürün kartı | 96 |
| SSS | Görünür |
| İç bağlantılar | Altı hedef URL'nin tamamı 200 |
| URL/slug değişikliği | Yok |

### Şablon bulgusu

`HeaderArea` değeri panelde başarıyla saklanmasına rağmen varsayılan kategori şablonu ID 1 bu alanı canlı HTML'de render etmiyor. Bu nedenle kısa giriş, ziyaretçi ve arama motoru tarafından görünür olması için `Description` alanının başına da eklendi. Mevcut `Description` ürün gridinden sonra gösteriliyor.

Kalıcı şablon geliştirme işi:

- `HeaderArea`, H1 ile filtre/ürün gridinin arasında render edilmeli.
- Mobilde kısa giriş ürünleri gereğinden fazla aşağı itmemeli.
- Aynı metin alt açıklamada tekrar edilmemeli.
- Şablon yayına alındığında `Description` başındaki geçici kısa giriş kaldırılmalı.

### Açık kalan teknik konular

- `/sumen-takimlari/?pagenumber=2` hâlâ ilk sayfaya canonical veriyor.
- `PageSize` hâlâ 96; ilk sayfada 96 ürün ve yaklaşık 100 görsel yükleniyor.
- İlk ekran dışı görsellerde lazy loading/srcset işi açık.
- Kategori BreadcrumbList/ItemList şeması açık.
- Search Console yeniden tarama ve performans izleme işi açık.

### Pilot sonrası karar

Teknik yayın başarılıdır. Dalga 1'e geçmeden önce Search Console'da URL Inspection ile yeniden tarama istenmesi ve title/description görünümünün takip edilmesi önerilir. Sayfalama canonical ile görsel performans geliştirmeleri içerik yayılımından bağımsız teknik görevler olarak devam edebilir.

---

## 11. Dalga 1 yayın kaydı — 27 Ağustos 2026

**Durum:** Beş kategori başarıyla canlıya alındı ve ziyaretçiye açık sayfalarda doğrulandı  
**Geri alma yedeği:** `imalattansumen-seo-dalga1-yedek-2026-08-27.md`

### Yayınlanan kategoriler

| ID | Kategori / URL | Yayındaki MetaTitle | Title / meta uzunluğu | Ürün kartı |
|---:|---|---|---:|---:|
| 15 | Deri Sümen Takımları — `/deri-sumen-takimlari/` | Deri Sümen Takımı Modelleri ve Fiyatları \| İmalattan | 52 / 136 | 96 |
| 13 | Ahşap Sümen Takımları — `/ahsap-sumen-takimlari/` | Ahşap Sümen Takımı Modelleri \| İmalattan | 40 / 138 | 17 |
| 16 | Lüks Sümen Takımları — `/luks-sumen-takimlari/` | Lüks Sümen Takımları ve VIP Masa Setleri \| İmalattan | 52 / 129 | 40 |
| 23 | Ucuz Sümen Takımları — `/ucuz-sumen-takimlari/` | Uygun Fiyatlı Sümen Takımları \| İmalattan | 41 / 141 | 41 |
| 1023 | Sümen Takımı Oluşturma — `/sumen-takimi-olusturma/` | Kişiye Özel Sümen Takımı Oluştur \| İmalattan | 44 / 148 | 11 |

Her kategoride `MetaTitle`, `MetaDescription`, `HeaderArea` ve `Description` güncellendi. Varsayılan kategori şablonu `HeaderArea` alanını göstermediği için kısa giriş metni, pilotta uygulanan yöntemle `Description` alanının başında da yayınlandı.

### Korunan yapısal alanlar

- Kategori adları ve mevcut H1 metinleri
- `SeName` değerleri ve tüm kategori URL'leri
- `ParentCategoryId` değerleri
- `CategoryTemplateId` değerleri
- `PageSize = 96`
- `DisplayOrder` değerleri

### Canlı QA sonucu

| Kontrol | Sonuç |
|---|---|
| Kategori HTTP | 5/5 URL 200 |
| Title | 5/5 hedef değerle bire bir |
| Meta description | 5/5 hedef değerle bire bir |
| H1 | 5/5 sayfada tek H1 |
| Canonical | 5/5 sayfada kendine referans veren doğru URL |
| Robots | 5/5 sayfada `index, follow` |
| İçerik ve SSS başlıkları | 5/5 sayfada görünür |
| Benzersiz iç bağlantılar | 10/10 hedef URL 200 |
| Yapısal panel alanları | Değişmeden korundu |

ID 1023 sayfasının eski `Description` alanındaki ek `<h1>` yeni içerikte kaldırıldı. Böylece `/sumen-takimi-olusturma/` sayfasındaki iki H1 sorunu giderildi ve canlı sayfada yalnızca `Sümen Takımı Oluşturma` H1'i kaldı.

### Dalga 2 planı

Sıradaki düşük riskli yayın grubu, masaüstü aksesuarı ve isimlik kümeleridir:

1. Ofis Masaüstü Aksesuarları
2. Masa İsimlikleri
3. Kristal Masa İsimlikleri
4. Deri Evrak Rafları
5. Deri Magazinlik ve Dosyalıklar

Dalga 2'de önce kategori ID'leri ve mevcut yapısal alanlar panelden doğrulanacak, ayrı geri alma yedeği oluşturulacak, ardından aynı dört alan güncellenip canlı QA uygulanacaktır.

---

## 12. Dalga 2 yayın kaydı — 27 Ağustos 2026

**Durum:** Beş kategori başarıyla canlıya alındı ve açık sayfalarda doğrulandı  
**Geri alma yedeği:** `imalattansumen-seo-dalga2-yedek-2026-08-27.md`

### Yayınlanan kategoriler

| ID | Panel kategorisi / URL | Yayındaki MetaTitle | Title / meta uzunluğu | Şablon | Ürün kartı |
|---:|---|---|---:|---:|---:|
| 9 | OFİS VE KIRTASİYE — `/ofis-ve-kirtasiye/` | Ofis Masaüstü Aksesuarları \| İmalattan | 38 / 136 | 1 | 75 |
| 12 | Masa İsimlikleri — `/masa-isimlikleri-3/` | Masa İsimliği Modelleri ve Fiyatları \| İmalattan | 48 / 140 | 2 | 21 |
| 19 | Kristal Masa İsimlikleri — `/kristal-masa-isimlikleri/` | Kristal Masa İsimliği Modelleri \| İmalattan | 43 / 139 | 1 | 16 |
| 14 | Evrak Rafları — `/evrak-raflari/` | Deri Evrak Rafı ve Masaüstü Düzenleyiciler \| İmalattan | 54 / 130 | 1 | 30 |
| 17 | Magazinlik & Dosyalık — `/magazinlik-dosyalik/` | Deri Magazinlik ve Ofis Dosyalık Modelleri \| İmalattan | 54 / 129 | 1 | 10 |

Paneldeki mevcut kategori adları, slug'lar, üst kategori ilişkileri, şablonlar, `PageSize = 96` ve sıralama değerleri aynen korundu. İçerik paketindeki “Ofis Masaüstü Aksesuarları”, “Deri Evrak Rafları” ve “Deri Magazinlik ve Dosyalıklar” adları yalnızca arama niyeti/title/içerik dili olarak kullanıldı; mevcut H1 ve URL'ler değiştirilmedi.

### Canlı QA sonucu

| Kontrol | Sonuç |
|---|---|
| Kategori HTTP | 5/5 URL 200 |
| Title ve meta description | 5/5 hedef değerle bire bir |
| H1 | 5/5 sayfada tek H1 |
| Canonical | 5/5 doğru kendine referans veren URL |
| Robots | 5/5 `index, follow` |
| İçerik ve SSS başlıkları | 5/5 görünür |
| Kısa giriş görünme sayısı | 5/5 sayfada bir kez |
| Benzersiz iç bağlantılar | 10/10 URL 200 |

ID 12 kategori şablonu 2 kullanmasına rağmen `HeaderArea` alanı canlı sayfada ayrıca görünmedi. Kısa girişin `Description` başındaki geçici kopyası sayesinde içerik görünür oldu ve tekrar oluşmadı.

### Dalga 3 planı ve doğrulanmış panel eşlemesi

| Uygulama paketi bölümü | Panel ID | Mevcut panel adı |
|---|---:|---|
| Deri Ofis Çöp Kovaları | 18 | Çöp Kovaları |
| Ofis Bayrakları | 20 | Bayraklar |
| Masa Bayrakları | 22 | Masa Bayrakları |
| Makam Bayrakları | 21 | Makam Bayrakları |

Dalga 3 için sıradaki işlem: dört kategorinin mevcut metadata/HTML/yapısal alanlarını ayrı bir geri alma dosyasına kaydetmek; uygulama paketinin 12–15. bölümlerini yayınlamak; ardından aynı HTTP, title, meta, H1, canonical, robots, görünür içerik ve iç bağlantı QA setini çalıştırmaktır.

---

## 13. Dalga 3 yayın kaydı — 27 Ağustos 2026

**Durum:** Dört kategori başarıyla canlıya alındı ve açık sayfalarda doğrulandı  
**Geri alma yedeği:** `imalattansumen-seo-dalga3-yedek-2026-08-27.md`

### Yayınlanan kategoriler

| ID | Panel kategorisi / URL | Yayındaki MetaTitle | Title / meta uzunluğu | Ürün kartı |
|---:|---|---|---:|---:|
| 18 | Çöp Kovaları — `/cop-kovalari/` | Deri Ofis Çöp Kovası Modelleri \| İmalattan | 42 / 136 | 10 |
| 20 | Bayraklar — `/bayraklar/` | Masa ve Makam Bayrağı Modelleri \| İmalattan | 43 / 133 | 10 |
| 22 | Masa Bayrakları — `/masa-bayraklari/` | Masa Bayrağı Modelleri ve Fiyatları \| İmalattan | 47 / 142 | 4 |
| 21 | Makam Bayrakları — `/makam-bayraklari/` | Makam Bayrağı Modelleri ve Direkli Setler \| İmalattan | 53 / 137 | 6 |

Paneldeki kategori adları, slug'lar, üst kategori ilişkileri, şablonlar, `PageSize = 96` ve sıralama değerleri aynen korundu. Üç bayrak kategorisinde daha önce ortak kullanılan metadata ayrıştırılarak her sayfaya kendi arama niyetine uygun title, meta açıklaması ve kapsamlı içerik verildi.

### Canlı QA sonucu

| Kontrol | Sonuç |
|---|---|
| Kategori HTTP | 4/4 URL 200 |
| Title ve meta description | 4/4 hedef değerle bire bir |
| H1 | 4/4 sayfada tek H1 |
| Canonical | 4/4 doğru kendine referans veren URL |
| Robots | 4/4 `index, follow` |
| İçerik ve SSS başlıkları | 4/4 görünür |
| Kısa giriş görünme sayısı | 4/4 sayfada bir kez |
| Benzersiz iç bağlantılar | 8/8 URL 200 |

### Dalga 4 planı ve doğrulanmış panel eşlemesi

| Uygulama paketi bölümü | Panel ID | Mevcut panel adı |
|---|---:|---|
| Kanvas Tablolar | 4 | Kanvas Tablo |
| Dekoratif Kanvas Tablolar | 6 | Dekoratif Kanvas Tablo |
| Atatürk Portreleri | 5 | Atatürk Portreleri |
| Düğmeli Makam Panoları | 2 | Düğmeli Makam Panosu |
| Resimli Makam Panoları | 3 | Resimli Makam Panoları |

Dalga 4, uygulama paketindeki kalan 16–20. bölümleri kapsar. Önce beş kategorinin geri alma yedeği oluşturulacak; ardından içerikler yayınlanıp aynı canlı QA seti uygulanacaktır. Dalga 4 tamamlandığında uygulama paketindeki 20 kategorinin tamamı canlıya aktarılmış olacaktır.

---

## 14. Dalga 4 ve 20 kategorilik yayın kapanışı — 27 Ağustos 2026

**Durum:** Son beş kategori başarıyla canlıya alındı; uygulama paketindeki 20 kategorinin tamamı yayınlandı  
**Geri alma yedeği:** `imalattansumen-seo-dalga4-yedek-2026-08-27.md`

### Dalga 4'te yayınlanan kategoriler

| ID | Panel kategorisi / URL | Yayındaki MetaTitle | Title / meta uzunluğu | Şablon | Ürün kartı |
|---:|---|---|---:|---:|---:|
| 4 | Kanvas Tablo — `/kanvas-tablo/` | Kanvas Tablo Modelleri ve Fiyatları \| İmalattan | 47 / 141 | 1 | 96 |
| 6 | Dekoratif Kanvas Tablo — `/dekoratif-kanvas-tablo-6/` | Dekoratif Kanvas Tablo Modelleri \| İmalattan | 44 / 145 | 1 | 25 |
| 5 | Atatürk Portreleri — `/ataturk-portreleri/` | Atatürk Portresi ve Kanvas Tablo Modelleri \| İmalattan | 54 / 141 | 1 | 22 |
| 2 | Düğmeli Makam Panosu — `/dugmeli-makam-panosu/` | Düğmeli Makam Panosu Modelleri \| İmalattan | 42 / 132 | 2 | 1 |
| 3 | Resimli Makam Panoları — `/resimli-makam-panosu-51-2/` | Resimli Makam Panosu Modelleri \| İmalattan | 42 / 134 | 1 | 84 |

Paneldeki kategori adları, mevcut slug'lar, parent değerleri, kategori şablonları, `PageSize = 96` ve sıralama değerleri korundu. Şablon 2 kullanan ID 2 sayfasında kısa giriş yalnızca bir kez göründü; içerik tekrarı oluşmadı.

### Dalga 4 canlı QA sonucu

| Kontrol | Sonuç |
|---|---|
| Kategori HTTP | 5/5 URL 200 |
| Title ve meta description | 5/5 hedef değerle bire bir |
| H1 | 5/5 sayfada tek H1 |
| Canonical | 5/5 doğru kendine referans veren URL |
| Robots | 5/5 `index, follow` |
| İçerik ve SSS başlıkları | 5/5 görünür |
| Kısa giriş görünme sayısı | 5/5 sayfada bir kez |
| Benzersiz iç bağlantılar | 6/6 URL 200 |

### 20 kategorilik toplu regresyon testi

Tüm kategori dalgaları tamamlandıktan sonra uygulama paketindeki 20 URL baştan sona tekrar tarandı.

| Toplu kontrol | Sonuç |
|---|---|
| HTTP 200 | 20/20 |
| Hedef title | 20/20 |
| Hedef meta description | 20/20 |
| Tek H1 | 20/20 |
| Kendine referans veren canonical | 20/20 |
| Robots `index, follow` | 20/20 |
| Yinelenen title grubu | 0 |
| Yinelenen meta description grubu | 0 |
| Başarısız kategori | 0 |

### İçerik yayılımı sonrası teknik SEO önceliği

1. Sayfa 2 ve üzerindeki kategori URL'lerinin kendine referans veren canonical üretmesini sağlayacak tema/uygulama kodu düzeltmesi.
2. `HeaderArea` alanının H1 ile ürün gridinin arasında görünür biçimde render edilmesi; bu devreye alınınca `Description` başındaki geçici kısa giriş kopyalarının kaldırılması.
3. İlk ekran dışındaki ürün görsellerinde `loading="lazy"`, uygun boyutlandırma ve `srcset` uygulanması.
4. Kategori sayfalarına görünür içerikle uyumlu `BreadcrumbList` ve uygun olduğunda `ItemList` yapılandırılmış verisi eklenmesi.
5. Güncellenen URL'lerin Search Console URL Inspection ile taramaya gönderilmesi ve 28 günlük sorgu/CTR takibi.

Canonical kod düzeltmesi tamamlanana kadar `PageSize` değeri 96'dan düşürülmemelidir; aksi durumda yanlış canonical kullanan sayfa sayısı artacaktır.

---

## 15. Teknik SEO kaynak ve uygulanabilirlik incelemesi — 27 Ağustos 2026

### Kaynak/erişim sonucu

- Yerel bilgisayarda siteye ait `.sln` veya `.csproj` kaynak projesi bulunmadı.
- Canlı mağaza Faprika altyapısında çalışıyor; oturum çerezleri ve panel yolları bunu doğruluyor.
- Admin panelinde tema/kaynak dosyası düzenleyicisi veya genel eklenti yükleme arayüzü bulunmuyor.
- Panelde Faprika destek sistemi ve `/admin/faprika/createsupport/` yeni talep yolu mevcut.
- Bu nedenle canonical ve tema HTML'i değişiklikleri mevcut panel yetkisiyle güvenli biçimde uygulanamaz; Faprika servis/tema katmanında yapılmalıdır.

### Sayfalama kapsam ölçümü

| Kategori | Sayfa 1 | Sayfa 2 | Sayfa 2 canonical | Boş sayfa 3 |
|---|---:|---:|---|---|
| Sümen Takımları | 96 ürün | 35 ürün | Yanlış: sayfa 1 | HTTP 200, index/follow |
| Deri Sümen Takımları | 96 ürün | 3 ürün | Yanlış: sayfa 1 | HTTP 200, index/follow |
| Kanvas Tablo | 96 ürün | 16 ürün | Yanlış: sayfa 1 | HTTP 200, index/follow |

Üç geçerli ikinci sayfa da içerik taşımasına rağmen ilk sayfaya canonical veriyor. Ürün bulunmayan üçüncü sayfalar da 200 ve `index, follow` döndürüyor. Bu davranış kod/altyapı düzeltmesi gerektirir.

### Görsel performans ölçümü

- Panelde WebP dönüşümü açık, kalite 80, kayıpsız mod kapalı.
- 96 kategori ürün görselinde özel `/lazy-logo.jpg` + `data-src` lazy-load mekanizması kullanılıyor.
- Standart `loading="lazy"`, `srcset`, `sizes`, `width` ve `height` öznitelikleri yok.
- Örnek mevcut görseller, WebP kabul başlığına rağmen JPEG/PNG olarak servis edildi.
- Görsellerde bir yıllık public cache mevcut.

### Hazırlanan çıktı

Faprika'ya iletilecek tekrar üretim adımları, beklenen davranış ve kabul testleri `imalattansumen-faprika-teknik-seo-talebi.md` dosyasına yazıldı. Talep daha sonra kullanıcı onayıyla gönderildi; gönderim kaydı aşağıdaki bölümde yer alıyor.

### Robots ve sitemap doğrulaması

- `https://www.imalattansumen.com/robots.txt` HTTP 200 ve `text/plain` döndürüyor.
- Robots dosyasında `https://www.imalattansumen.com/sitemap.xml` doğru biçimde ilan edilmiş.
- XML sitemap HTTP 200 ve `application/xml` döndürüyor.
- Yayınlanan 20 kategori URL'sinin tamamı sitemap içinde: 20/20.
- Robots kuralları bu kategori yollarını engellemiyor.
- Sayfalama parametreleri robots ile engellenmediği için geçerli sayfa 2 URL'leri taranabilir; canonical kod düzeltmesi gerekliliği devam ediyor.

### Sonraki uygulama kapısı

Mevcut admin erişimiyle güvenli biçimde yapılabilen kategori içerik, metadata ve panel ayarı işleri tamamlandı. Canonical, geçersiz sayfa durum kodu, `HeaderArea` render'ı ve responsive görsel HTML'i için iki uygulanabilir yol bulunuyor:

1. Faprika destek talebini kullanıcı onayıyla `/admin/faprika/createsupport/` üzerinden göndermek.
2. Site tema/uygulama kaynak kodu ve dağıtım erişimini çalışma alanına sağlamak.

---

## 16. Faprika teknik SEO destek talebi — 27 Ağustos 2026

**Gönderim durumu:** Başarıyla gönderildi ve detay sayfasından doğrulandı

| Alan | Değer |
|---|---|
| Talep numarası | `38006` |
| Başlık | Kategori sayfalama canonical ve görsel HTML iyileştirmeleri |
| Gönderim zamanı | 27.08.2026 11:56:28 |
| İlk durum | Açık |
| Detay yolu | `/admin/faprika/editsupport/38006/` |

Talepte üç gerçek kategori sayfa 2 örneği, boş sayfa 3'lerin HTTP 200/index davranışı, beklenen canonical ve 404 kuralları, `HeaderArea` render sorunu ve responsive görsel HTML gereksinimleri iletildi. Başlık ve mesajdaki canonical örnekleri gönderim sonrası panel detay sayfasında doğrulandı.

Faprika yanıt verdiğinde talep numarası 38006 üzerinden yanıt okunmalı; düzeltme bildirildikten sonra bu plandaki canonical, boş sayfa, HeaderArea ve görsel kabul testleri canlıda yeniden çalıştırılmalıdır.

---

## 17. Gönderim sonrası schema ve URL normalizasyon denetimi — 27 Ağustos 2026

### Faprika talep durumu

- Talep: `38006`
- Kontrol anındaki durum: `Açık`
- Mesaj satırı: 3 — ilk teknik talep, schema/sosyal meta/URL normalizasyon mesajı ve sitemap kanıt mesajı
- Faprika yanıtı: Henüz yok

### Yapılandırılmış veri sonucu

| Kontrol | Sonuç |
|---|---:|
| JSON-LD bulunan kategori | 0/20 |
| BreadcrumbList | 0/20 |
| ItemList | 0/20 |
| Eksiksiz Open Graph seti | 0/20 |
| Twitter Card | 0/20 |

Örnek kategori şablonunda sıkı `itemtype`/`itemprop` kontrolü de boş çıktı. Önceki geniş “Product” metin eşleşmesi yapılandırılmış veri değil, tema içindeki sıradan bir metin eşleşmesiydi ve sonuçtan çıkarıldı.

### URL normalizasyon sonucu

| Varyant | HTTP davranışı | Canonical/sonuç |
|---|---|---|
| HTTP non-www | İki adet 301 | HTTPS www slash'sız URL'ye ulaşır |
| HTTP www | Bir adet 301 | HTTPS www slash'sız URL'ye ulaşır |
| HTTPS slash'sız | 200 | Canonical slash'lı temiz URL |
| Büyük harfli URL | 200 | Canonical küçük harfli temiz URL |
| `pagenumber=1` | 200 | Canonical temiz ana kategori URL'si |

Canonical etiketleri alternatif varyantları birleştiriyor; ancak tarama verimliliği ve tekil URL davranışı için tüm alternatiflerin tek adımda temiz URL'ye 301 yönlendirilmesi önerilir.

### Hazırlanan takip maddesi

Schema, sosyal meta ve URL normalizasyon bulguları `imalattansumen-faprika-teknik-seo-talebi.md` dosyasına “Gönderim sonrası ek bulgular” olarak eklendi. Kullanıcının tam yetkilendirmesi sonrasında bu maddeler talep `38006`ya ek mesaj olarak gönderildi. Talep detayında iki mesaj satırı ve “20 kategori sayfasında JSON-LD” metni doğrulandı; durum `Açık` kaldı.

---

## 18. Search Console erişim ve yeniden tarama hazırlığı — 27 Ağustos 2026

### Mülk erişimi

- `sc-domain:imalattansumen.com` alan mülküne mevcut hesapla erişim yok.
- `https://www.imalattansumen.com/` URL-prefix mülküne erişim mevcut.
- Doğru URL-prefix mülkü seçilerek işlemler yalnızca İmalattan Sümen üzerinde yürütüldü.

### Search Console anlık görünüm

| Gösterge | Değer |
|---|---:|
| Web arama tıklaması | 328 |
| Dizine eklenen sayfa | 273 |
| Dizine eklenmeyen sayfa | 1.625 |
| HTTPS sayfa | 169 |
| HTTPS olmayan | 0 |
| Geçerli ürün snippet'i | 140 |
| Geçersiz ürün snippet'i | 0 |
| Geçerli satıcı girişi | 140 |
| Geçersiz satıcı girişi | 0 |
| Geçerli içerik haritası | 140 |
| Geçersiz içerik haritası | 0 |

### Sitemap durumu

- Gönderilen sitemap: `/sitemap.xml`
- İlk gönderim: 10 Mart 2026
- Son okuma: 21 Ağustos 2026
- Durum: Başarılı
- Keşfedilen sayfa: 491
- Keşfedilen video: 0

### URL Inspection örneği

- Denetlenen URL: `https://www.imalattansumen.com/sumen-takimlari/`
- Durum: URL Google'da mevcut
- HTTPS: Sayfa HTTPS üzerinden sunuldu
- Sayfa değiştiği için “Dizine eklenmesini iste / Tekrar istek gönder” işlemi kullanılabilir.

Kullanıcının eylem anı onayı alındı ve Search Console gönderimleri uygulandı.

---

## 19. Search Console sitemap ve indeksleme gönderim kaydı — 27 Ağustos 2026

### Sitemap yeniden gönderimi

| Alan | Sonuç |
|---|---|
| Mülk | `https://www.imalattansumen.com/` |
| Site haritası | `/sitemap.xml` |
| Yeniden gönderim tarihi | 27 Ağustos 2026 |
| Search Console sonucu | Site haritası başarıyla gönderildi |
| Durum | Başarılı |
| Son okuma | 21 Ağustos 2026 |
| Keşfedilen sayfa | 491 |
| Keşfedilen video | 0 |

Google, site haritasını belirli aralıklarla yeniden işleyeceğini bildirdi. Bu gönderim sitemap içindeki 20 kategori URL'sinin tamamını yeniden keşif kapsamına alır.

### Ayrı URL Inspection istekleri

Search Console her URL için canlı dizine eklenebilirlik testi çalıştırdı. Aşağıdaki 11 kategori için “Dizine eklenmesi istendi” sonucu ekranda ayrı ayrı doğrulandı:

1. `https://www.imalattansumen.com/sumen-takimlari/`
2. `https://www.imalattansumen.com/deri-sumen-takimlari/`
3. `https://www.imalattansumen.com/ahsap-sumen-takimlari/`
4. `https://www.imalattansumen.com/luks-sumen-takimlari/`
5. `https://www.imalattansumen.com/ucuz-sumen-takimlari/`
6. `https://www.imalattansumen.com/sumen-takimi-olusturma/`
7. `https://www.imalattansumen.com/ofis-ve-kirtasiye/`
8. `https://www.imalattansumen.com/masa-isimlikleri-3/`
9. `https://www.imalattansumen.com/kristal-masa-isimlikleri/`
10. `https://www.imalattansumen.com/evrak-raflari/`
11. `https://www.imalattansumen.com/magazinlik-dosyalik/`

### Google günlük kotası nedeniyle yarına kalan URL'ler

12. URL olan `/cop-kovalari/` gönderiminde Search Console şu sonucu verdi: “Kota Aşıldı — günlük kotanızı aştığınız için bu isteği işleyemedik; yarın tekrar gönderin.” Bu nedenle aşağıdaki dokuz URL için ayrı URL Inspection isteği bugünkü oturumda işlenemedi:

1. `https://www.imalattansumen.com/cop-kovalari/`
2. `https://www.imalattansumen.com/bayraklar/`
3. `https://www.imalattansumen.com/masa-bayraklari/`
4. `https://www.imalattansumen.com/makam-bayraklari/`
5. `https://www.imalattansumen.com/kanvas-tablo/`
6. `https://www.imalattansumen.com/dekoratif-kanvas-tablo-6/`
7. `https://www.imalattansumen.com/ataturk-portreleri/`
8. `https://www.imalattansumen.com/dugmeli-makam-panosu/`
9. `https://www.imalattansumen.com/resimli-makam-panosu-51-2/`

Bu dokuz URL sitemap yeniden gönderimiyle Google'a zaten bildirildi. Ayrı öncelikli tarama isteği, Search Console günlük kotası yenilendiğinde tekrar uygulanmalıdır.

---

## 20. 20 kategorilik Search Console indeks kapsamı — 27 Ağustos 2026

Kota uyarısından sonra yeni indeksleme isteği göndermeden, 20 kategori URL'sinin mevcut Google indeks durumu URL Inspection üzerinden salt okunur olarak tek tek denetlendi. Her geçişte denetlenen hedef URL'nin sayfa kimliği doğrulandı.

| Küme | Google'da mevcut | Google'da yok |
|---|---:|---:|
| Sümen kategorileri | 6/6 | 0 |
| Ofis ve masaüstü aksesuarları | 6/6 | 0 |
| Bayrak kategorileri | 3/3 | 0 |
| Kanvas, portre ve makam panoları | 5/5 | 0 |
| **Toplam** | **20/20** | **0/20** |

Sonuç: Yayınlanan kategori SEO paketinin hedef URL'lerinin tamamı Google indeksinde mevcut. Günlük kota nedeniyle ayrı öncelikli tarama isteği gönderilemeyen dokuz URL de zaten Google'da bulunduğundan, yalnızca bu işlem için ertesi gün tekrar istek göndermek gerekli değildir. Bundan sonraki Search Console önceliği indeksleme isteği değil; sorgu, gösterim, tıklama, CTR ve ortalama konum takibidir.

---

## 21. Organik performans başlangıç ölçümü — son 28 gün

**Search Console tarih aralığı:** 28 Temmuz 2026–24 Ağustos 2026  
**Veri son güncellemesi:** Kontrol anından yaklaşık 5 saat önce  
**Önemli not:** Kategori SEO yayınları 27 Ağustos 2026'da tamamlandığı için bu dönem, değişiklik öncesi karşılaştırma tabanıdır. Yeni title, meta ve içeriklerin etkisi bu değerlerle kıyaslanmalıdır.

### Site geneli

| Metrik | Değer |
|---|---:|
| Tıklama | 132 |
| Gösterim | 3.408 |
| Ortalama CTR | %3,9 |
| Ortalama konum | 12,2 |

### 20 kategori toplamı

| Metrik | Değer |
|---|---:|
| Tıklama | 17 |
| Gösterim | 548 |
| Hesaplanan CTR | %3,10 |
| Google'da mevcut kategori | 20/20 |

### Kategori bazında başlangıç tablosu

| Kategori | Tıklama | Gösterim | Hesaplanan CTR |
|---|---:|---:|---:|
| Masa İsimlikleri | 2 | 146 | %1,37 |
| Sümen Takımları | 5 | 127 | %3,94 |
| Ahşap Sümen Takımları | 1 | 98 | %1,02 |
| Deri Sümen Takımları | 2 | 46 | %4,35 |
| Ucuz Sümen Takımları | 3 | 32 | %9,38 |
| Magazinlik & Dosyalık | 0 | 24 | %0 |
| Kristal Masa İsimlikleri | 2 | 23 | %8,70 |
| Evrak Rafları | 0 | 14 | %0 |
| Düğmeli Makam Panosu | 1 | 13 | %7,69 |
| Resimli Makam Panoları | 0 | 10 | %0 |
| Masa Bayrakları | 0 | 6 | %0 |
| Bayraklar | 1 | 3 | %33,33* |
| Kanvas Tablo | 0 | 3 | %0 |
| Çöp Kovaları | 0 | 3 | %0 |
| Lüks Sümen Takımları | 0 | 0 | — |
| Sümen Takımı Oluşturma | 0 | 0 | — |
| Ofis ve Kırtasiye | 0 | 0 | — |
| Makam Bayrakları | 0 | 0 | — |
| Dekoratif Kanvas Tablo | 0 | 0 | — |
| Atatürk Portreleri | 0 | 0 | — |

\* Üç gösterimlik örneklem karar vermek için yeterli değildir.

### İzleme önceliği

1. Yüksek gösterim ve düşük CTR nedeniyle `Masa İsimlikleri` ile `Ahşap Sümen Takımları` ilk CTR izleme grubudur.
2. `Magazinlik & Dosyalık`, `Evrak Rafları` ve `Resimli Makam Panoları` gösterim aldığı halde tıklama üretmeyen ikinci gruptur.
3. Sıfır gösterimli altı kategori için yeni içeriklerin keşfi, iç bağlantılar ve sorgu oluşumu takip edilmelidir.
4. İlk anlamlı karşılaştırma 28 günlük yeni veri tamamlandıktan sonra yapılmalıdır; ilk 7 gün yalnızca tarama ve anormal düşüş kontrolü için kullanılmalıdır.
5. Yeni veride gösterim artıp CTR düşerse title/meta varyantı; gösterim oluşmazsa iç bağlantı ve kategori niyeti; konum 8–20 aralığında kalırsa içerik kapsamı ve bağlantı otoritesi ele alınmalıdır.

---

## 22. Kategori iç bağlantı ağı denetimi ve düzeltmesi — 27 Ağustos 2026

### Denetim yöntemi

Yirmi kategori sayfası canlı HTML üzerinden tarandı. Menü ve ortak şablon bağlantılarından ayrı olarak yalnızca `.description-wrapper` içindeki bağlamsal kategori bağlantıları eşleştirildi.

### Bulgular

- 20/20 kategori global navigasyon üzerinden erişilebilir.
- 20/20 kategori açıklamasında başka ilgili kategorilere bağlamsal çıkış bulunuyor.
- `/ucuz-sumen-takimlari/` global navigasyonda bulunmasına rağmen diğer kategori açıklamalarından sıfır bağlamsal bağlantı alıyordu.
- Diğer kategoriler en az bir bağlamsal kategori bağlantısı alıyordu.

### Uygulanan değişiklik

Kategori ID 8 — `Sümen Takımları` açıklamasının “Renk ve parça sayısı” bölümüne aşağıdaki doğal bağlantı eklendi:

`<a href="/ucuz-sumen-takimlari/">uygun fiyatlı sümen takımları</a>`

**Geri alma yedeği:** `imalattansumen-seo-ic-link-yedek-2026-08-27.md`

### Canlı QA

| Kontrol | Sonuç |
|---|---|
| Ana kategori HTTP | 200 |
| Title | Korundu — `Sümen Takımı Modelleri ve Fiyatları \| İmalattan` |
| Meta description | Korundu |
| Canonical | `https://www.imalattansumen.com/sumen-takimlari/` |
| H1 | 1 adet |
| Açıklamadaki hedef bağlantı | 1 adet |
| Anchor metni | `uygun fiyatlı sümen takımları` |
| SSS içeriği | Korundu |

Sonuç: 20 kategorilik içerik kümesinde bağlamsal olarak tamamen bağlantısız kategori kalmadı.

---

## 23. Sitemap tekilleştirme ve lastmod denetimi — 27 Ağustos 2026

### Canlı sitemap ölçümü

| Kontrol | Sonuç |
|---|---:|
| HTTP | 200 |
| Content-Type | `application/xml` |
| Toplam `<loc>` satırı | 491 |
| Benzersiz URL | 490 |
| Yinelenen URL grubu | 1 |
| Parametreli URL | 0 |
| HTTP/non-www URL | 0 |
| Slash'sız URL | 0 |

Yinelenen kayıt:

- `https://www.imalattansumen.com/bize-ulasin/` — 2 kez

### Lastmod dağılımı

| Tarih | Kayıt |
|---|---:|
| 2026-08-27 | 490 |
| 2023-09-21 | 1 |

Ürünlerin tamamı 27 Ağustos'ta içerik olarak değişmediği halde 490 kaydın aynı `lastmod` değerini taşıması, sitemap üretim/çalışma tarihinin sayfa değişiklik tarihi gibi yazıldığını gösteriyor. Bu davranış Google'a gereksiz değişiklik sinyali gönderir ve `lastmod` güvenilirliğini düşürür.

### Faprika'ya gönderilen takip

Bu ölçümler ve aşağıdaki kabul kriterleri talep `#38006`ya üçüncü mesaj olarak gönderildi ve detay sayfasından doğrulandı:

1. `/bize-ulasin/` sitemap kaydı tekilleştirilmeli.
2. `lastmod`, yalnızca sayfanın ana içeriği, ürün verisi veya SEO alanları gerçekten değiştiğinde güncellenmeli.
3. Sitemap oluşturulma zamanı tüm kayıtlara `lastmod` olarak yazılmamalı.
4. Düzeltme sonrasında toplam `<loc>` sayısı ile benzersiz URL sayısı eşit olmalı.
5. XML geçerli kalmalı ve Search Console tarafından Başarılı okunmalı.

Talep durumu gönderim sonrasında `Açık`; henüz Faprika yanıtı yok.

---

## 24. Kategori açıklaması içerik temizliği — 27 Ağustos 2026

### Bulgu

- 19/20 kategori açıklamasında ziyaretçiye görünen `<p>---</p>` paragrafı bulundu.
- ID 3 — Resimli Makam Panoları açıklamasında ayraçtan sonra 1.932 karakterlik “Panel giriş kontrol tablosu” ve yayın sonrası iç operasyon notu canlıya taşınmıştı.
- Açıklama içinde H1 veya script bulunmadı.
- Taranan bağlamsal iç bağlantılarda 4xx/5xx hedef bulunmadı.

### Uygulama

- 18 kategoriden yalnızca sondaki görünür ayraç kaldırıldı.
- ID 3 açıklamasından ayraçla başlayan operasyon kuyruğu tamamen kaldırıldı.
- Diğer içerik, metadata ve yapısal alanlar korundu.

**Yedek:** `imalattansumen-seo-icerik-temizlik-yedek-2026-08-27.md`

### Toplu QA

| Kontrol | Sonuç |
|---|---:|
| Title | 20/20 |
| Meta description | 20/20 |
| Tek H1 | 20/20 |
| Self-canonical | 20/20 |
| Görünür SSS | 20/20 |
| `---` paragrafı yok | 20/20 |
| Panel operasyon notu yok | 20/20 |
| Kırık bağlamsal iç bağlantı | 0 |

---

## 25. Kategori bilgi mimarisi parent dalgası — 27 Ağustos 2026

### Uygulanan ilişkiler

| Alt kategori | ID | Eski parent | Yeni üst kategori | Parent ID |
|---|---:|---:|---|---:|
| Deri Sümen Takımları | 15 | 0 | Sümen Takımları | 8 |
| Lüks Sümen Takımları | 16 | 0 | Sümen Takımları | 8 |
| Ucuz Sümen Takımları | 23 | 0 | Sümen Takımları | 8 |
| Masa Bayrakları | 22 | 0 | Bayraklar | 20 |
| Makam Bayrakları | 21 | 0 | Bayraklar | 20 |
| Evrak Rafları | 14 | 0 | Ofis ve Kırtasiye | 9 |
| Magazinlik & Dosyalık | 17 | 0 | Ofis ve Kırtasiye | 9 |
| Çöp Kovaları | 18 | 0 | Ofis ve Kırtasiye | 9 |

ID 13 — Ahşap Sümen Takımları ve ID 1023 — Sümen Takımı Oluşturma zaten parent ID 8 altında olduğundan değiştirilmedi.

**Yedek:** `imalattansumen-seo-bilgi-mimarisi-pilot-yedek-2026-08-27.md`

### Kabul testi

| Kontrol | Sonuç |
|---|---:|
| Admin hedef parent değeri | 8/8 |
| Üst kategorili breadcrumb | 8/8 |
| URL korundu | 8/8 |
| Title korundu | 8/8 |
| Meta description korundu | 8/8 |
| Tek H1 | 8/8 |
| Self-canonical | 8/8 |
| Ürün sayısı korundu | 8/8 |
| Ana menü bağlantısı | 8/8 |

Bilgi mimarisi düzleşmiş yapıdan konu kümelerine dönüştürüldü; kategori URL'leri değiştirilmediği için yönlendirme ihtiyacı oluşmadı.

---

## 26. Kategori adı ve H1 hizalama — 27 Ağustos 2026

| ID | URL | Eski Name/H1 | Yeni Name/H1 | MetaTitle |
|---:|---|---|---|---|
| 9 | `/ofis-ve-kirtasiye/` | `OFİS VE KIRTASİYE ` | `Ofis Masaüstü Aksesuarları` | `Ofis Masaüstü Aksesuarları \| İmalattan` |
| 23 | `/ucuz-sumen-takimlari/` | `Ucuz Sümen Takımları` | `Uygun Fiyatlı Sümen Takımları` | `Uygun Fiyatlı Sümen Takımları \| İmalattan` |

Yalnızca `Name` alanları değiştirildi. Mevcut slug/URL, parent, metadata, içerik, şablon, PageSize, yayın durumu ve sıralama korundu.

**Yedek:** `imalattansumen-seo-kategori-adi-h1-yedek-2026-08-27.md`

### Son toplu regresyon

| Kontrol | Sonuç |
|---|---:|
| Kategori | 20/20 |
| Title | 20/20 |
| Meta description | 20/20 |
| Tek H1 | 20/20 |
| Self-canonical | 20/20 |
| Görünür SSS | 20/20 |
| Görünür `---` yok | 20/20 |
| Panel operasyon notu yok | 20/20 |
| Yinelenen title grubu | 0 |
| Yinelenen meta description grubu | 0 |

Yeni H1'ler mevcut SEO title ile aynı arama niyetini ve daha okunabilir kategori adlarını kullanıyor. URL değişmediği için yönlendirme gerekmedi.

---

## 27. Koleksiyon adı / H1 iyileştirme dalgası — 27 Ağustos 2026

| ID | URL | Eski Name/H1 | Yeni Name/H1 |
|---:|---|---|---|
| 20 | `/bayraklar/` | Bayraklar | Masa ve Makam Bayrakları |
| 4 | `/kanvas-tablo/` | Kanvas Tablo | Kanvas Tablolar |
| 6 | `/dekoratif-kanvas-tablo-6/` | Dekoratif Kanvas Tablo | Dekoratif Kanvas Tablolar |
| 2 | `/dugmeli-makam-panosu/` | Düğmeli Makam Panosu | Düğmeli Makam Panoları |

Yalnızca `Name` alanı değiştirildi; slug/URL ve tüm SEO/yapısal alanlar korundu. Masa ve Makam Bayrakları altındaki iki çocuk kategorinin breadcrumb'ı yeni üst kategori adını doğru biçimde kullanıyor.

### Regresyon

- Hedef Name/H1: 4/4
- Bayrak alt kategori breadcrumb: 2/2
- Title, meta, tek H1, self-canonical ve SSS: 20/20
- Yinelenen title grubu: 0
- Yinelenen meta description grubu: 0

---

## 28. Ofis aksesuarı Name/H1 arama niyeti hizalaması — 27 Ağustos 2026

Search Console değişiklik öncesi başlangıç verisinde gösterim aldığı halde tıklama üretmeyen ofis aksesuarları, ürün malzemesi ve mevcut SEO title ile hizalandı.

| ID | URL | Eski Name/H1 | Yeni Name/H1 |
|---:|---|---|---|
| 14 | `/evrak-raflari/` | Evrak Rafları | Deri Evrak Rafları |
| 17 | `/magazinlik-dosyalik/` | Magazinlik & Dosyalık | Deri Magazinlik ve Dosyalıklar |
| 18 | `/cop-kovalari/` | Çöp Kovaları | Deri Ofis Çöp Kovaları |

Yalnızca Name/H1 değişti. Üç kategori parent ID 9 altında kaldı; slug/URL, metadata, içerik, şablon ve ürün listeleri korundu.

### Kabul testi

- Hedef Name/H1: 3/3
- `Ofis Masaüstü Aksesuarları` breadcrumb: 3/3
- Title, meta, tek H1, self-canonical ve SSS: 20/20
- Yinelenen title/meta grubu: 0

### Hiyerarşi sonrası parent sayfalama kontrolü

| Üst kategori | Sayfa 1 ürün | Sayfa 2 ürün | Boş sonraki sayfa |
|---|---:|---:|---|
| Sümen Takımları | 96 | 36 | Sayfa 3: HTTP 200 |
| Ofis Masaüstü Aksesuarları | 77 | 0 | Sayfa 2: HTTP 200 |
| Masa ve Makam Bayrakları | 10 | 0 | Sayfa 2: HTTP 200 |

Sümen parent kümesine bir benzersiz ürün daha dahil oldu; sayfa 2 ürün sayısı 35'ten 36'ya çıktı. Boş sayfaların HTTP 200 ve sayfa 2 canonical sorunu Faprika `#38006` talebinin kapsamındadır.

---

## 29. Kanvas konu kümesi bilgi mimarisi — 27 Ağustos 2026

### Uygulanan ilişkiler

| Alt kategori | ID | Eski parent | Yeni üst kategori | Parent ID |
|---|---:|---:|---|---:|
| Dekoratif Kanvas Tablolar | 6 | 0 | Kanvas Tablolar | 4 |
| Atatürk Portreleri | 5 | 0 | Kanvas Tablolar | 4 |

Yalnızca `ParentCategoryId` değiştirildi. Ad/H1, slug/URL, açıklama, metadata, şablon, PageSize, yayın durumu ve sıralama korundu.

**Yedek:** `imalattansumen-seo-bilgi-mimarisi-pilot-yedek-2026-08-27.md`

### Canlı kabul testi

| Kontrol | Sonuç |
|---|---:|
| Admin hedef parent | 2/2 |
| Doğru üst kategorili breadcrumb | 2/2 |
| URL ve HTTP 200 | 2/2 |
| Title ve meta description | 2/2 |
| Tek H1 ve self-canonical | 2/2 |
| Ürün sayısı korundu | 2/2 — 25 ve 22 |
| Ana sayfa menü bağlantısı | 2/2 |

### Kanvas üst kategorisi sayfalaması

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Sayfa 1 ürün | 96 | 96 |
| Sayfa 2 ürün | 16 | 63 |
| Sayfa 3 ürün | 0 | 0 |

Kanvas kümesi konu ilişkisini breadcrumb ve site mimarisine yansıttı; URL değişikliği veya yeni dolu ürün sayfası oluşturmadı. Sayfa 2'nin üst kategori canonical'ını kullanması ve boş sayfa 3'ün HTTP 200 dönmesi, mevcut Faprika `#38006` teknik talebinin kapsamındadır.

### 20 kategorilik regresyon

| Kontrol | Sonuç |
|---|---:|
| HTTP 200 | 20/20 |
| Title | 20/20 |
| Meta description | 20/20 |
| Tek H1 | 20/20 |
| Self-canonical | 20/20 |
| Görünür SSS | 20/20 |
| Görünür ayraç yok | 20/20 |
| Panel operasyon notu yok | 20/20 |
| Yinelenen title grubu | 0 |
| Yinelenen meta description grubu | 0 |

---

## 30. Masa isimlikleri konu kümesi — 27 Ağustos 2026

| Alt kategori | ID | Eski parent | Yeni üst kategori | Parent ID |
|---|---:|---:|---|---:|
| Kristal Masa İsimlikleri | 19 | 0 | Masa İsimlikleri | 12 |

Yalnızca `ParentCategoryId` değiştirildi. Ad/H1, slug/URL, içerik, metadata, şablon, PageSize, yayın durumu ve sıralama korundu.

**Yedek:** `imalattansumen-seo-bilgi-mimarisi-pilot-yedek-2026-08-27.md`

### Kabul testi

| Kontrol | Sonuç |
|---|---|
| Admin parent | `12` |
| Breadcrumb | `Anasayfa > Masa İsimlikleri > Kristal Masa İsimlikleri` |
| HTTP / URL | 200 / korundu |
| Title | `Kristal Masa İsimliği Modelleri \| İmalattan` |
| Meta description | Korundu — 139 karakter |
| H1 | 1 adet |
| Canonical | Self-canonical |
| Ürün | 16 — korundu |
| Ana sayfa menüsü | Bağlantı korunuyor |
| Görsel tarayıcı QA | Geçti |

### Parent kapsamı

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Masa İsimlikleri sayfa 1 ürün | 21 | 26 |
| Sayfa 2 ürün | 0 | 0 |

Alt kategori ürünlerinin 11'i parent kategoride zaten bulunduğu için parent kapsamına 5 yeni benzersiz ürün eklendi; yeni bir dolu sayfa oluşmadı.

### Son genel regresyon

- 20/20 kategori HTTP 200
- 20/20 title ve meta description
- 20/20 tek H1 ve self-canonical
- 20/20 görünür SSS
- 20/20 içerik temizliği korundu
- 0 yinelenen title grubu
- 0 yinelenen meta description grubu
- Başarısız kontrol: 0

---

## 31. Kalan teknik SEO işleri takip turu — 27 Ağustos 2026

### Faprika talebi

- Talep `#38006` için Faprika'nın 14:25 yanıtı okundu: inceleme sürüyor, tamamlanmış düzeltme bildirilmedi.
- Canonical, boş sayfa, URL normalizasyonu, schema, OG/Twitter, responsive görsel ve sitemap testleri canlıda yeniden çalıştırıldı.
- Sorunların devam ettiği ölçümlerle doğrulandı.
- Panelde OG, Twitter ve WebP seçeneklerinin zaten açık olduğu; buna rağmen canlı çıktının oluşmadığı belgelendi.
- Güncel ölçümler aynı talebe dördüncü takip mesajı olarak gönderildi ve doğrulandı.

### Search Console ve sitemap

| Kontrol | Sonuç |
|---|---|
| Sitemap durumu | Başarılı |
| Gönderim / son okuma | 27 Ağustos 2026 |
| Google'ın keşfettiği sayfa | 491 |
| Canlı sitemap toplam / benzersiz | 491 / 490 |
| Yeniden gönderim | Yapılmadı — kaynak XML değişmedi |

### 28 günlük başlangıç ölçümü

| Dönem | Tıklama | Gösterim | TO | Ortalama konum |
|---|---:|---:|---:|---:|
| 28 Temmuz–24 Ağustos 2026 | 132 | 3.408 | %3,9 | 12,2 |

Search Console son güncellemesi 4 saat önceydi. Aynı değerler başlangıç/baseline olarak korundu.

### Otomatik takip

`İmalattan Sümen SEO takibi` adıyla 28 günde bir çalışan takip oluşturuldu. Her çalışmada Search Console performansı, kategori görünürlüğü, sitemap, Faprika `#38006` yanıtı ve canlı teknik kabul testleri kontrol edilecek.
