# İmalattan Sümen — Kategori SEO Çalışması

**Site:** https://www.imalattansumen.com/  
**Hazırlanma tarihi:** 27 Ağustos 2026  
**Kapsam:** Ticari kategori sayfaları, kategori mimarisi, teknik SEO, içerik, iç bağlantılar, yapılandırılmış veri, görsel performans ve ölçüm planı  
**Amaç:** Organik görünürlüğü artırırken kategori ziyaretçisini ürüne ve siparişe daha hızlı taşımak

> Bu çalışma canlı site, robots.txt, XML sitemap, kategori HTML çıktıları ve 27 Ağustos 2026 tarihindeki güncel arama sonuçları incelenerek hazırlanmıştır. Arama hacmi ve mevcut sıralama verileri Google Search Console veya Keyword Planner erişimi olmadan doğrulanamadığı için hayali hacim rakamları kullanılmamıştır. Anahtar kelime öncelikleri ticari niyet, ürün uyumu ve SERP gözlemlerine göre verilmiştir.

---

## 1. Yönetici özeti

Sitenin güçlü tarafı, sümen takımı ve makam/ofis aksesuarları konusunda geniş, niş ve ürünle doğrudan eşleşen bir kataloğa sahip olmasıdır. Ana kategoriler 200 durum kodu veriyor, kendilerine ait canonical etiketi taşıyor ve çoğunda tek H1 bulunuyor. Buna karşılık kategori şablonundaki bazı sistematik sorunlar organik performansı sınırlayabilir.

En yüksek etkili bulgular:

1. **Kategori title etiketleri aşırı uzun.** İncelenen sayfalarda title uzunluğu yaklaşık 101–154 karakter. Her title sonuna uzun ve tekrarlı bir site sloganı ekleniyor. Bu durum SERP'te kırpılma ve Google'ın title'ı yeniden yazma ihtimalini artırıyor.
2. **Bazı kategoriler aynı title ve meta description'ı kullanıyor.** Bayraklar, Makam Bayrakları ve Masa Bayrakları aynı metadata'ya sahip. Kanvas Tablo ile Dekoratif Kanvas Tablo da aynı metadata'yı kullanıyor.
3. **Sayfalama canonical kurgusu hatalı.** `/sumen-takimlari/?pagenumber=2` sayfasında yalnızca ikinci sayfada görülen 35 ürün bulunmasına rağmen canonical ilk kategori sayfasına işaret ediyor. İkinci sayfa kendi canonical'ını taşımalı.
4. **İlk sayfaya çok fazla ürün yükleniyor.** Sümen Takımları, Deri Sümen Takımları ve Kanvas Tablo kategorilerinin ilk sayfasında 96 ürün kartı ve yaklaşık 100 görsel bulunuyor.
5. **Görsellerde modern yükleme özellikleri yok.** Örneklenen yoğun kategori sayfalarında `loading="lazy"` ve `srcset` görülmedi. HTML çıktısı yaklaşık 248–295 KB, 100 görsel ve 19 script etiketi içeriyor.
6. **Kategori seviyesinde yapılandırılmış veri yok.** İncelenen kategori sayfalarında JSON-LD bulunmadı. Ürün sayfası örneğinde Product microdata bulundu; kategori şablonunda BreadcrumbList ve ItemList/CollectionPage verisi ayrıca planlanmalı.
7. **Kategori hiyerarşisi çoğunlukla düz.** Breadcrumb yapısı çoğu sayfada yalnızca `Anasayfa > Kategori`. Ana kategori–alt kategori ilişkileri belirgin değil.
8. **Bazı önemli kategorilerde kategori açıklaması yok.** Ofis ve Kırtasiye, Kanvas Tablo, Dekoratif Kanvas Tablo, Atatürk Portreleri, Düğmeli Makam Panosu ve Resimli Makam Panoları için şablondaki SEO açıklama alanı boş görünüyor.
9. **Sümen Takımı Oluşturma sayfasında iki H1 var.** Tek, açık ve benzersiz H1 kullanılmalı.
10. **Sitemap temizliği gerekiyor.** Sitemap'te 491 kayıt fakat 490 benzersiz URL var; `/bize-ulasin/` iki defa geçiyor. Ürün URL'lerinin büyük bölümü aynı günün `lastmod` değerini taşıyor; bu alan gerçek değişiklik tarihini yansıtmalı.

### Beklenen sonuç

İlk aşamada title/description düzeltmeleri, sayfalama canonical'ı, ürün sayısının azaltılması, lazy loading ve kategori hiyerarşisi uygulanırsa tarama verimliliği, SERP görünümü, mobil hız ve kategori–ürün keşfi birlikte iyileşir. İkinci aşamada içerik kümeleri, iç bağlantılar ve şema işaretlemeleriyle sitenin “sümen takımı”, “deri sümen takımı”, “masa isimliği”, “masa bayrağı” ve “makam panosu” konu otoritesi güçlendirilebilir.

---

## 2. İncelenen URL seti ve mevcut durum

XML sitemap taramasında:

- 491 URL kaydı bulundu.
- 490 benzersiz URL bulundu.
- 21 adet yüksek öncelikli (`priority 0.9`) sayfa kategori/landing sayfası adayı.
- 459 adet `priority 0.8` kayıt ağırlıklı olarak ürün sayfaları.
- `/bize-ulasin/` sitemap içinde iki defa yer alıyor.
- `Sizden Gelenler` ticari kategori değil; güven, sosyal kanıt ve kullanıcı üretimli içerik destek sayfası olarak değerlendirilmelidir.

### Kategori bazlı tarama özeti

“İlk sayfadaki ürün” sayısı HTML'de görülen ürün kartı adedidir. “SEO metni” yalnızca sayfanın kategori açıklaması bölümündeki yaklaşık kelime sayısıdır; menü, ürün adları ve footer dahil değildir.

| Kategori | İlk sayfadaki ürün | Sayfa adedi | SEO metni | Ana sorun |
|---|---:|---:|---:|---|
| Sümen Takımları | 96 | 2 | 173 | Fazla ürün/görsel, uzun title, sayfa 2 canonical hatası |
| Deri Sümen Takımları | 96 | 2 | 95 | Fazla ürün/görsel, ince kategori metni |
| Ahşap Sümen Takımları | 17 | 1 | 249 | Uzun title; metin arama niyetine göre yapılandırılmalı |
| Lüks Sümen Takımları | 40 | 1 | 208 | Uzun title; hakiki deri/VIP niyeti netleştirilmeli |
| Ucuz Sümen Takımları | 41 | 1 | 201 | “Ucuz” ile “uygun fiyatlı” niyetleri birlikte yönetilmeli |
| Sümen Takımı Oluşturma | 11 | 1 | 67 | İki H1, ince açıklama, kişiselleştirme akışı anlatılmıyor |
| Masa İsimlikleri | 21 | 1 | 207 | Uzun title; URL'de anlamsız `-3` eki |
| Kristal Masa İsimlikleri | 16 | 1 | 222 | Title hedefi “kristal sümen”e kayıyor |
| Ofis ve Kırtasiye | 75 | 1 | 0 | Açıklama yok, çok geniş kategori, 75 ürün |
| Evrak Rafları | 30 | 1 | 150 | “Evrak rafı/dosyalık/masaüstü organizer” kümesi geliştirilmeli |
| Magazinlik & Dosyalık | 10 | 1 | 81 | İnce içerik, terminoloji ve kullanım alanları eksik |
| Çöp Kovaları | 10 | 1 | 210 | H1 çok genel; “deri ofis çöp kovası” odağı güçlendirilmeli |
| Bayraklar | 10 | 1 | 101 | Alt kategorilerle aynı title ve description |
| Makam Bayrakları | 6 | 1 | 101 | Masa bayrağı metadata'sı kullanılıyor; niyet uyuşmazlığı |
| Masa Bayrakları | 4 | 1 | 101 | Ana/alt kategori cannibalization riski |
| Kanvas Tablo | 96 | 2 | 0 | Açıklama yok, 96 ürün ve görsel, uzun title |
| Dekoratif Kanvas Tablo | 25 | 1 | 0 | Açıklama yok; Kanvas Tablo ile aynı metadata |
| Atatürk Portreleri | 22 | 1 | 0 | Açıklama yok; ölçü, malzeme ve kullanım niyeti eksik |
| Düğmeli Makam Panosu | 1 | 1 | 0 | Tek ürünlü ince kategori; landing sayfası değeri oluşturulmalı |
| Resimli Makam Panoları | 84 | 1 | 0 | Açıklama yok, fazla ürün, anlamsız URL eki `-51-2` |

### Mevcut olumlu sinyaller

- İncelenen kategori URL'leri 200 durum kodu veriyor.
- Kategoriler genel olarak `index, follow` durumda.
- Birçok kategoride self-referencing canonical doğru.
- Çoğu kategoride tek ve kategoriyle uyumlu H1 var.
- Ürün sayfaları kategori gridinde gerçek `<a href>` bağlantılarıyla keşfedilebiliyor.
- Ürün sayfası örneğinde Product microdata mevcut.
- robots.txt; yönetim, sepet, hesap ve sipariş gibi indekslenmemesi gereken alanların çoğunu engelliyor.

---

## 3. Önceliklendirilmiş aksiyon listesi

### P0 — İlk 0–14 gün

1. Global title son ekini kısaltın. Kategori title şablonu: `Birincil Konu | İmalattan`.
2. Bayrak ve kanvas kategori gruplarındaki kopya title/description'ları benzersizleştirin.
3. `?pagenumber=2` ve sonraki gerçek sayfalama URL'lerine self-canonical verin.
4. Sayfalama URL'lerini gerçek bağlantılarla ardışık bağlayın; ilk sayfaya canonical vermeyin.
5. Sümen Takımı Oluşturma sayfasındaki çift H1'i teke indirin.
6. İlk yüklemede ürün sayısını 24–36 aralığına indirin; kalan ürünleri crawl edilebilir sayfalama ile sunun.
7. İlk ekran dışındaki ürün görsellerine lazy loading ekleyin; ilk satır/LCP görselini lazy yapmayın.
8. Görsellerde responsive `srcset`, `sizes`, width/height ve WebP/AVIF varyantları kullanın.
9. Sitemap'teki `/bize-ulasin/` tekrarını kaldırın ve `lastmod` değerini gerçek değişiklik tarihine bağlayın.
10. Search Console'da mevcut performansın ekran görüntüsünü/verisini alın: sorgu, sayfa, tıklama, gösterim, CTR ve ortalama konum.

### P1 — 15–45 gün

1. Aşağıdaki metadata haritasını tüm kategorilere uygulayın.
2. Breadcrumb hiyerarşisini ana kategori > alt kategori şeklinde kurun.
3. Kategori üstünde 60–100 kelimelik kısa giriş; ürünlerden sonra 400–800 kelimelik satın alma rehberi kullanın.
4. Açıklaması olmayan altı kategoriye özgün içerik ekleyin.
5. BreadcrumbList ve CollectionPage/ItemList JSON-LD şablonlarını ekleyip Rich Results Test ile doğrulayın.
6. Ana kategori sayfalarına görsel alt kategori kartları ekleyin.
7. “Sümen Takımları”, “Deri Sümen”, “Masa İsimlikleri” ve “Makam Panosu” kümelerinde iç bağlantı modülleri oluşturun.
8. Ürün kartlarında stok, malzeme, parça sayısı, kişiselleştirme ve kargo gibi seçim sinyallerini görünür hale getirin.
9. Search Console indeksleme raporunda parametre URL'lerini ve canonical seçimini kontrol edin.

### P2 — 46–90 gün

1. Google Merchant Center ürün feed'i ve ücretsiz listelemeleri kurun/iyileştirin.
2. Ürün schema verisini fiyat, stok, marka, SKU/GTIN uygunsa, kargo ve iade politikasıyla genişletin.
3. Kategori destek blog içeriklerini yayınlayın ve kategoriye bağlayın.
4. Gerçek müşteri fotoğraflarını kategori ve ürün seviyesinde izinli biçimde kullanın.
5. Kategori CTR testleri yapın; 28 günlük karşılaştırmalarda title/description varyantlarını değerlendirin.
6. Bağlantı kazanımı için ofis tasarımı, kurumsal hediye, iç mimari ve kamu/kurum tedarik içerikleri geliştirin.

---

## 4. Önerilen bilgi mimarisi

Önerilen yapı, mevcut URL'leri bir anda değiştirmeden menü, breadcrumb ve iç bağlantılarla kurulabilir.

~~~text
Ana Sayfa
├── Sümen Takımları
│   ├── Deri Sümen Takımları
│   ├── Ahşap Sümen Takımları
│   ├── Lüks Sümen Takımları
│   ├── Uygun Fiyatlı Sümen Takımları
│   └── Kişiye Özel Sümen Takımı Oluştur
├── Ofis Masaüstü Aksesuarları
│   ├── Masa İsimlikleri
│   │   └── Kristal Masa İsimlikleri
│   ├── Evrak Rafları
│   ├── Magazinlik ve Dosyalık
│   └── Deri Ofis Çöp Kovaları
├── Bayraklar
│   ├── Masa Bayrakları
│   └── Makam Bayrakları
└── Ofis Duvar Dekorasyonu
    ├── Kanvas Tablolar
    │   ├── Dekoratif Kanvas Tablolar
    │   └── Atatürk Portreleri
    └── Makam Panoları
        ├── Düğmeli Makam Panoları
        └── Resimli Makam Panoları
~~~

### URL değişikliği uyarısı

`/masa-isimlikleri-3/`, `/dekoratif-kanvas-tablo-6/` ve `/resimli-makam-panosu-51-2/` SEO açısından temiz olmayan URL'lerdir. Ancak `/dekoratif-kanvas-tablo/` ve `/resimli-makam-panosu/` adresleri şu anda ürün sayfaları tarafından kullanılıyor. Bu nedenle sadece kategori slug'ını değiştirmek çakışma yaratır.

İki güvenli seçenek vardır:

- **Kısa vadeli öneri:** Mevcut kategori URL'lerini koruyun; title, H1, breadcrumb ve iç bağlantıları düzeltin.
- **Planlı migrasyon:** Çakışan ürün URL'leri dahil tam URL haritası çıkarın, yeni benzersiz slug'lar belirleyin, bire bir 301 yönlendirmeleri uygulayın, canonical/sitemap/iç bağlantıları aynı anda güncelleyin ve Search Console'da izleyin.

Sırf URL güzel görünsün diye sıralama sinyali taşıyan mevcut URL'leri plansız değiştirmeyin.

---

## 5. Anahtar kelime ve arama niyeti haritası

Arama hacmi bilinmeden mutlak trafik tahmini yapılmamalıdır. Aşağıdaki harita, ticari niyet ve sayfa uyumuna göre önceliklendirilmiştir.

| Küme | Birincil sorgular | İkincil sorgular | Niyet | Hedef sayfa |
|---|---|---|---|---|
| Genel sümen | sümen takımı, sümen takımları | sümen takımı modelleri, sümen takımı fiyatları, masa sümeni | Ticari kategori | `/sumen-takimlari/` |
| Deri sümen | deri sümen takımı | hakiki deri sümen, deri masa seti, makam sümen takımı | Ticari/kalite | `/deri-sumen-takimlari/` |
| Ahşap sümen | ahşap sümen takımı | ceviz sümen takımı, ahşap masa seti, yönetici sümeni | Ticari | `/ahsap-sumen-takimlari/` |
| Premium | lüks sümen takımı | VIP sümen takımı, yönetici masa seti, makam masa seti | Yüksek değer | `/luks-sumen-takimlari/` |
| Fiyat odaklı | ucuz sümen takımı | uygun fiyatlı sümen takımı, ekonomik masa sümeni | Fiyat/ticari | `/ucuz-sumen-takimlari/` |
| Kişiselleştirme | kişiye özel sümen takımı | isimli sümen takımı, sümen takımı oluşturma, logolu masa seti | Yüksek dönüşüm | `/sumen-takimi-olusturma/` |
| İsimlik | masa isimliği | makam isimliği, kişiye özel masa isimliği, ofis isimliği | Ticari/hediye | `/masa-isimlikleri-3/` |
| Kristal isimlik | kristal masa isimliği | kristal makam isimliği, isimli kristal set | Ticari/kişisel | `/kristal-masa-isimlikleri/` |
| Evrak düzeni | evrak rafı | deri evrak rafı, masaüstü evrak düzenleyici, dosya rafı | Ticari/problem çözme | `/evrak-raflari/` |
| Magazinlik | magazinlik, dosyalık | deri magazinlik, ofis dosyalık, dergi düzenleyici | Ticari | `/magazinlik-dosyalik/` |
| Ofis aksesuarı | ofis masaüstü aksesuarları | deri ofis aksesuarları, masa düzenleyici set | Keşif/ticari | `/ofis-ve-kirtasiye/` |
| Çöp kovası | ofis çöp kovası | deri çöp kovası, masa altı çöp kovası, lüks ofis çöp kovası | Ticari | `/cop-kovalari/` |
| Masa bayrağı | masa bayrağı | Türk masa bayrağı, logolu masa bayrağı, ikili masa bayrağı | Ticari/kurumsal | `/masa-bayraklari/` |
| Makam bayrağı | makam bayrağı | Türk makam bayrağı, logolu makam bayrağı, direkli makam bayrağı | B2B/kurumsal | `/makam-bayraklari/` |
| Kanvas | kanvas tablo | kanvas tablo modelleri, ofis kanvas tablo, dekoratif tablo | Ticari/dekorasyon | `/kanvas-tablo/` |
| Atatürk | Atatürk portresi | Atatürk kanvas tablo, çerçeveli Atatürk portresi, ofis Atatürk tablosu | Ticari/kurumsal | `/ataturk-portreleri/` |
| Makam panosu | makam panosu | resimli makam panosu, düğmeli makam panosu, Atatürk makam panosu | Ticari/kurumsal | İlgili iki alt kategori |

### Cannibalization kuralları

- `/sumen-takimlari/` genel “sümen takımı” sorgusunu hedeflemeli; deri, ahşap, lüks ve uygun fiyat alt sayfaları kendi niteleyicilerine odaklanmalıdır.
- `/bayraklar/` keşif ve alt kategori seçimi sayfasıdır. “Masa bayrağı” hedefi `/masa-bayraklari/`, “makam bayrağı” hedefi `/makam-bayraklari/` olmalıdır.
- `/kanvas-tablo/` genel kategori; `/dekoratif-kanvas-tablo-6/` dekoratif desen ve yaşam alanı; `/ataturk-portreleri/` Atatürk/kurumsal kullanım niyetini hedeflemelidir.
- “Masa isimliği” ana hedefi Masa İsimlikleri; “kristal masa isimliği” ana hedefi Kristal Masa İsimlikleri olmalıdır.
- Ürün sayfaları çok genel kategori sorgusunu zorlamamalı; model, renk, malzeme, parça sayısı ve kullanım özelliklerini hedeflemelidir.

---

## 6. Hazır metadata ve H1 önerileri

Title'lar kısa, benzersiz ve sorgu odaklıdır. Google için katı bir karakter limiti yoktur; pratik hedef, mobilde aşırı kırpılmayacak şekilde çoğunlukla 50–60 karakter bandıdır. Meta description'lar sayfanın somut ürün seçimini ve değer önerisini özetlemelidir. Aşağıdaki tablolar panelin `MetaTitle` alanına marka dahil tam olarak girilecek final title'ı gösterir. Canlı pilotta global SEO başlık şablonu `---` olduğunda varsayılan başlığın alt sayfalara eklenmediği doğrulanmıştır.

### Sümen kategorileri

| URL | SEO title | H1 | Meta description |
|---|---|---|---|
| `/sumen-takimlari/` | Sümen Takımı Modelleri ve Fiyatları \| İmalattan | Sümen Takımı Modelleri | Deri, ahşap, lüks ve uygun fiyatlı sümen takımı modellerini inceleyin. Yönetici ve makam masaları için kişiye özel seçenekleri imalatçıdan alın. |
| `/deri-sumen-takimlari/` | Deri Sümen Takımı Modelleri ve Fiyatları \| İmalattan | Deri Sümen Takımları | Hakiki deri sümen takımı ve masa setlerini keşfedin. Farklı renk, parça sayısı ve kişiye özel isim seçenekleriyle ofisinize prestij katın. |
| `/ahsap-sumen-takimlari/` | Ahşap Sümen Takımı Modelleri \| İmalattan | Ahşap Sümen Takımları | Ceviz ve farklı ahşap yüzeylere sahip sümen takımlarını inceleyin. Makam ve yönetici masaları için şık, dayanıklı masa setlerini keşfedin. |
| `/luks-sumen-takimlari/` | Lüks Sümen Takımları ve VIP Masa Setleri \| İmalattan | Lüks Sümen Takımları | Hakiki deri ve ahşap detaylı lüks sümen takımlarıyla yönetici masanızı tamamlayın. VIP tasarım ve kişiye özel seçenekleri karşılaştırın. |
| `/ucuz-sumen-takimlari/` | Uygun Fiyatlı Sümen Takımları \| İmalattan | Uygun Fiyatlı Sümen Takımları | Bütçenize uygun sümen takımı modellerini renk, parça sayısı ve kullanım amacına göre karşılaştırın. Şık ofis masa setlerini imalatçıdan alın. |
| `/sumen-takimi-olusturma/` | Kişiye Özel Sümen Takımı Oluştur \| İmalattan | Kişiye Özel Sümen Takımı Oluştur | Renk, aksesuar, isim ve unvan seçeneklerini belirleyerek size özel sümen takımı oluşturun. Yönetici ve makam masanıza uygun seti kolayca tasarlayın. |

### Ofis masaüstü aksesuarları

| URL | SEO title | H1 | Meta description |
|---|---|---|---|
| `/ofis-ve-kirtasiye/` | Ofis Masaüstü Aksesuarları \| Deri Ofis Ürünleri | Ofis Masaüstü Aksesuarları | Deri evrak rafı, magazinlik, dosyalık ve ofis çöp kovası modellerini keşfedin. Düzenli ve şık çalışma alanı için uyumlu ürünleri karşılaştırın. |
| `/masa-isimlikleri-3/` | Masa İsimliği Modelleri ve Fiyatları \| İmalattan | Masa İsimliği Modelleri | Kişiye özel masa isimliği modellerini keşfedin. Makam, ofis ve kurumsal hediye için kristal, deri ve farklı tasarım seçeneklerini inceleyin. |
| `/kristal-masa-isimlikleri/` | Kristal Masa İsimliği Modelleri \| İmalattan | Kristal Masa İsimlikleri | İsim ve unvan baskılı kristal masa isimliklerini inceleyin. Makam odası, yönetici masası ve kurumsal hediyeler için şık modelleri keşfedin. |
| `/evrak-raflari/` | Deri Evrak Rafı ve Masaüstü Düzenleyiciler | Deri Evrak Rafları | Tekli ve çok katlı deri evrak rafı modelleriyle masanızı düzenleyin. Farklı renklerde şık masaüstü dosya düzenleyicileri keşfedin. |
| `/magazinlik-dosyalik/` | Deri Magazinlik ve Ofis Dosyalık Modelleri | Deri Magazinlik ve Dosyalıklar | Dergi, katalog ve dosyalar için deri magazinlik ve ofis dosyalıklarını inceleyin. Çalışma alanınıza uygun renk ve tasarımı seçin. |
| `/cop-kovalari/` | Deri Ofis Çöp Kovası Modelleri \| İmalattan | Deri Ofis Çöp Kovaları | Ofis ve makam odaları için deri çöp kovası modellerini keşfedin. Masa setinizle uyumlu renklerde şık ve dayanıklı seçenekleri inceleyin. |

### Bayrak kategorileri

| URL | SEO title | H1 | Meta description |
|---|---|---|---|
| `/bayraklar/` | Ofis Bayrakları \| Masa ve Makam Bayrağı Modelleri | Ofis Bayrakları | Masa bayrağı ve direkli makam bayrağı modellerini tek yerde karşılaştırın. Türk bayrağı, logolu, krom ve gold seçeneklerini keşfedin. |
| `/masa-bayraklari/` | Masa Bayrağı Modelleri ve Fiyatları \| İmalattan | Masa Bayrakları | Tekli, ikili, Türk bayraklı ve logolu masa bayrağı modellerini inceleyin. Krom ve gold direk seçenekleriyle profesyonel masa düzeni oluşturun. |
| `/makam-bayraklari/` | Makam Bayrağı Modelleri ve Direkli Setler | Makam Bayrakları | Türk ve logolu makam bayrağı setlerini inceleyin. Kurum, yönetici odası ve resmi alanlar için direkli, krom ve gold seçenekleri keşfedin. |

### Tablo, portre ve makam panosu kategorileri

| URL | SEO title | H1 | Meta description |
|---|---|---|---|
| `/kanvas-tablo/` | Kanvas Tablo Modelleri ve Fiyatları \| İmalattan | Kanvas Tablo Modelleri | Ev, ofis ve kurumlara uygun kanvas tablo modellerini ölçü, tema ve tasarıma göre inceleyin. Dekoratif ve Atatürk temalı seçenekleri keşfedin. |
| `/dekoratif-kanvas-tablo-6/` | Dekoratif Kanvas Tablo Modelleri \| İmalattan | Dekoratif Kanvas Tablolar | Ofis ve yaşam alanları için modern dekoratif kanvas tabloları inceleyin. Farklı tema, renk ve ölçülerde duvar dekorasyonu seçeneklerini keşfedin. |
| `/ataturk-portreleri/` | Atatürk Portresi ve Kanvas Tablo Modelleri | Atatürk Portresi Modelleri | Ofis, okul, kurum ve evler için Atatürk portresi modellerini inceleyin. Farklı ölçü ve tasarımlarda kanvas ve dekoratif seçenekleri keşfedin. |
| `/dugmeli-makam-panosu/` | Düğmeli Makam Panosu Modelleri \| İmalattan | Düğmeli Makam Panoları | Atatürk ve devlet büyükleri görselleriyle hazırlanan düğmeli makam panolarını inceleyin. Makam odanıza uygun ölçü ve tasarımı seçin. |
| `/resimli-makam-panosu-51-2/` | Resimli Makam Panosu Modelleri \| İmalattan | Resimli Makam Panoları | Ofis ve resmi kurumlara özel resimli makam panolarını inceleyin. Atatürk ve devlet büyükleri temalı farklı model ve ölçüleri keşfedin. |

### Metadata uygulama notları

- Global kategori title son eki yalnızca `| İmalattan` olmalı.
- H1 ile title bire bir aynı olmak zorunda değildir; anlam ve ana sorgu uyumu korunmalıdır.
- Aynı meta description farklı URL'lerde kullanılmamalıdır.
- Fiyatlar sık değişiyorsa title içinde sabit fiyat yazmayın.
- “%100 hakiki deri”, “ücretsiz kargo”, “aynı gün kargo” gibi iddiaları yalnızca gerçekten tüm ilgili ürünlerde geçerliyse kategori metadata'sında kullanın.

---

## 7. Kategori sayfası içerik şablonu

Kategori metni yalnızca uzunluk için yazılmamalı; ziyaretçinin seçim yapmasını kolaylaştırmalıdır.

### Önerilen sayfa sırası

1. Breadcrumb
2. Tek H1
3. 60–100 kelimelik kısa kategori girişi
4. Alt kategori kartları veya hızlı seçim bağlantıları
5. Filtre ve sıralama
6. Ürün grid'i
7. 400–800 kelimelik satın alma rehberi
8. Kategoriye özel SSS
9. İlgili kategoriler
10. Gerçek müşteri görselleri/yorumları

### Kısa girişte bulunması gerekenler

- Ürünün ne olduğu
- Kim için/nerede kullanıldığı
- Temel çeşitler
- Sitenin somut avantajı
- Ürün seçimine götüren kısa çağrı

### Alt içerikte bulunması gerekenler

- Malzeme farkları
- Boyut ve parça sayısı seçimi
- Kullanım alanları
- Kişiselleştirme seçenekleri
- Bakım ve temizlik
- Üretim/kargo süresi yalnızca doğrulanmış bilgiyle
- İade ve kişiye özel ürün koşullarına bağlantı
- İlgili kategori ve rehberlere doğal iç bağlantılar

### Kaçınılması gerekenler

- Aynı anahtar kelimeyi her paragrafta tekrarlamak
- Ürün gridini çok aşağı iten 1.000 kelimelik üst metin
- “kaliteli, şık, prestijli” gibi kanıtsız sıfatları arka arkaya kullanmak
- Birbirinin küçük varyasyonu olan kategori metinleri
- Kullanıcıya seçim yardımı vermeyen genel ofis/dekorasyon paragrafları
- Stokta veya üründe bulunmayan özellikleri kategori genelinde vaat etmek

---

## 8. Ana kategori için yayına hazır örnek metin

Aşağıdaki taslak `/sumen-takimlari/` sayfası için hazırlanmıştır. Üretim, malzeme ve kişiselleştirme iddiaları yayın öncesinde ürün gerçekleriyle kontrol edilmelidir.

### Üst kısa giriş

Sümen takımı; masa sümeni, kalemlik, notluk, kartvizitlik ve evrak rafı gibi parçaları bir araya getirerek çalışma masasını düzenleyen fonksiyonel bir ofis setidir. Deri, ahşap, lüks ve uygun fiyatlı sümen takımı modellerini renk, parça sayısı ve kullanım amacına göre karşılaştırabilirsiniz. Yönetici masası, makam odası veya kişiye özel kurumsal hediye için ihtiyacınıza uygun modeli seçin.

### Alt rehber metni

#### Sümen takımı seçerken nelere dikkat edilmeli?

Doğru sümen takımı, masanın ölçüsü ve günlük kullanım alışkanlığıyla uyumlu olmalıdır. Öncelikle ana sümen parçasının klavye, ekran ve evraklarla birlikte masaya rahatça sığıp sığmadığını değerlendirin. Çok sayıda belgeyle çalışanlar için tekli veya çok katlı evrak rafı bulunan setler daha işlevsel olabilir. Daha sade bir masa düzeni isteyenler ise az parçalı modelleri tercih edebilir.

Parça sayısı tek başına kalite göstergesi değildir. Kalemlik, notluk, kartvizitlik, isimlik, bardak altlığı ve evrak rafı gibi parçaların gerçekten kullanacağınız işlevlere karşılık gelmesi önemlidir. Ürün kartlarında set içeriğini ve ölçüleri açıkça karşılaştırın.

#### Deri, ahşap ve lüks sümen takımları arasındaki farklar

**Deri sümen takımları**, yumuşak yüzeyleri ve farklı renk seçenekleriyle modern ofislerden klasik makam odalarına kadar geniş bir kullanım alanına sahiptir. Bakım talimatı ve derinin türü ürün detayında kontrol edilmelidir.

**Ahşap sümen takımları**, doğal doku ve daha klasik bir görünüm isteyen kullanıcılar için uygundur. Ahşap tonu; masa, dolap ve diğer ofis mobilyalarıyla birlikte değerlendirilmelidir. Ceviz tonları sıcak ve geleneksel bir görünüm sağlarken koyu tonlar daha güçlü bir kontrast oluşturabilir.

**Lüks sümen takımları**, malzeme, işçilik, aksesuar sayısı ve kişiselleştirme seçenekleriyle öne çıkar. Yönetici odası, makam masası veya özel kurumsal hediye gibi temsil gücünün önemli olduğu kullanım alanlarında değerlendirilebilir.

#### Renk ve parça sayısı nasıl seçilir?

Siyah, kahverengi ve bordo tonları klasik ofis mobilyalarıyla kolay eşleşir. Gri, beyaz, mavi, yeşil veya daha canlı renkler modern çalışma alanlarında kişisel bir görünüm oluşturabilir. Renk seçerken masa yüzeyi, koltuk ve duvar tonlarını birlikte düşünün.

Küçük masalarda dört veya beş parçalı setler yeterli olabilir. Geniş yönetici masalarında evrak rafı, isimlik ve ek aksesuarlar içeren setler daha dengeli görünür. Ürün ölçülerini masanızın kullanılabilir alanıyla karşılaştırmadan sipariş vermeyin.

#### Kişiye özel sümen takımı

İsim, unvan veya kurum bilgisi eklenebilen modeller, yönetici masaları ve kurumsal hediyeler için kişisel bir seçenek sunar. Kişiselleştirme siparişlerinde yazım, büyük-küçük harf kullanımı ve unvan sırası ödeme öncesinde dikkatle kontrol edilmelidir. Tasarımı baştan belirlemek isteyenler [Kişiye Özel Sümen Takımı Oluştur](/sumen-takimi-olusturma/) sayfasını kullanabilir.

#### İlgili kategoriler

- [Deri Sümen Takımları](/deri-sumen-takimlari/)
- [Ahşap Sümen Takımları](/ahsap-sumen-takimlari/)
- [Lüks Sümen Takımları](/luks-sumen-takimlari/)
- [Uygun Fiyatlı Sümen Takımları](/ucuz-sumen-takimlari/)
- [Masa İsimlikleri](/masa-isimlikleri-3/)
- [Deri Evrak Rafları](/evrak-raflari/)

#### Sıkça sorulan sorular

**Sümen takımı hangi parçalardan oluşur?**  
Set içeriği modele göre değişir. Ana masa sümeni, kalemlik, notluk, kartvizitlik, bardak altlığı, evrak rafı ve isimlik sık görülen parçalardır. Her ürünün set içeriği ürün detayında ayrı ayrı kontrol edilmelidir.

**Masa ölçüsüne uygun sümen nasıl seçilir?**  
Sümenin en ve boy ölçüsünü masanın kullanılabilir yüzeyiyle karşılaştırın. Klavye, monitör ayağı ve evraklar için yeterli boşluk kaldığından emin olun.

**Deri sümen takımı nasıl temizlenir?**  
Ürünün malzeme ve bakım talimatı esas alınmalıdır. Genel olarak yüzeyi aşırı ıslatmadan, yumuşak ve hafif nemli bir bezle temizlemek; sert kimyasallardan kaçınmak daha güvenlidir.

**Kişiye özel isim veya unvan eklenebilir mi?**  
Kişiselleştirme sunulan modellerde isim ve unvan eklenebilir. Uygun alanlar ve üretim süresi ürün sayfasında veya sipariş akışında gösterilmelidir.

---

## 9. Diğer kategoriler için içerik brifleri

| Sayfa | Alt başlıklar | Yanıtlanacak sorular | İç bağlantılar |
|---|---|---|---|
| Deri Sümen | Hakiki/suni deri ayrımı; parça sayısı; renk; bakım; kişiselleştirme | Deri türü nedir? Hangi renk kolay eşleşir? Nasıl temizlenir? | Genel Sümen, Lüks Sümen, Oluşturma |
| Ahşap Sümen | Ahşap türü/ton; masa uyumu; set içeriği; bakım | Ceviz ton kime uygun? Çizilmeye karşı bakım nasıl? | Genel Sümen, Lüks Sümen, Masa İsimlikleri |
| Lüks Sümen | Malzeme; işçilik; VIP kullanım; hediye; kişiselleştirme | Lüks seti farklı yapan nedir? Yönetici hediyesi olur mu? | Deri Sümen, Ahşap Sümen, Oluşturma |
| Uygun Fiyatlı Sümen | Bütçe; temel parçalar; kullanım sıklığı; fiyat/işlev dengesi | Kaç parça yeterli? Ekonomik modelde neye bakılır? | Genel Sümen, Evrak Rafları |
| Sümen Oluşturma | Adım adım seçim; renk; aksesuar; yazı; onay; teslim | İsim nasıl yazılır? Hangi parçalar eklenir? İade koşulu nedir? | Deri, Ahşap, Lüks Sümen |
| Masa İsimliği | Malzeme; isim/unvan; kullanım alanı; hediye; ölçü | İsimlikte hangi bilgiler yazılır? Makam için hangi model? | Kristal İsimlik, Masa Bayrağı, Sümen |
| Kristal İsimlik | Kristal/akrilik ayrımı; baskı; ölçü; bakım | Logo eklenir mi? Kırılmaya karşı paketleme nasıl? | Masa İsimliği, Masa Bayrağı |
| Ofis Aksesuarları | Ürün grupları; uyumlu set oluşturma; renk; düzen | Hangi aksesuar ne işe yarar? Uyumlu set nasıl kurulur? | Evrak Rafı, Magazinlik, Çöp Kovası |
| Evrak Rafı | Tekli/çok katlı; masa ölçüsü; dosya kapasitesi; bakım | A4 evrak sığar mı? Kat sayısı nasıl seçilir? | Ofis Aksesuarı, Magazinlik, Sümen |
| Magazinlik | Dergi/dosya/katalog kullanımı; kapasite; konumlandırma | Masa üstü mü dolap içi mi? Hangi ölçüler uygun? | Evrak Rafı, Ofis Aksesuarı |
| Çöp Kovası | Hacim; iç kova; temizlik; renk uyumu | Deri yüzey nasıl temizlenir? Masa setiyle nasıl eşleşir? | Ofis Aksesuarı, Sümen |
| Bayraklar | Masa/makam farkı; Türk/logolu seçenek; direk rengi | Masa bayrağı ile makam bayrağı farkı nedir? | Masa Bayrağı, Makam Bayrağı |
| Masa Bayrağı | Tekli/ikili; logo; ölçü; krom/gold; kullanım | Logo dosyası nasıl olmalı? Tekli mi ikili mi? | Bayraklar, Masa İsimliği |
| Makam Bayrağı | Direk yüksekliği; kumaş; taban; kurum kullanımı | Set neleri içerir? Makam odasına hangi ölçü? | Bayraklar, Makam Panosu |
| Kanvas Tablo | Tema; ölçü; şase; çerçeve; asma; bakım | Duvara göre ölçü nasıl seçilir? Baskı malzemesi nedir? | Dekoratif Kanvas, Atatürk Portreleri |
| Dekoratif Kanvas | Renk/tema; oda tipi; set tablolar; ölçü | Ofiste hangi tema seçilir? Duvar rengiyle nasıl eşleşir? | Kanvas Tablo, Atatürk Portreleri |
| Atatürk Portreleri | Kullanım alanı; ölçü; baskı; çerçeve; paketleme | Okul/ofis için hangi ölçü? Kanvas mı çerçeveli mi? | Kanvas Tablo, Makam Panoları |
| Düğmeli Makam Panosu | Kapitone/düğmeli yapı; görsel kompozisyon; ölçü; montaj | Set içeriği nedir? Montaj nasıl yapılır? | Resimli Makam Panosu, Makam Bayrağı |
| Resimli Makam Panosu | Görsel düzen; ölçü; kurum tipi; montaj; paketleme | Hangi görseller bulunur? Özel ölçü yapılır mı? | Düğmeli Makam Panosu, Atatürk Portreleri |

### İçerik uzunluğu hedefi

- Ana hub kategoriler: 600–900 kelime
- Orta ölçekli ticari alt kategoriler: 400–700 kelime
- Tek ürünlü veya dar kategoriler: 250–450 kelime; gerekirse kategori yerine güçlü landing/product yaklaşımı
- SSS: 4–6 gerçek soru; ürün veya süreçte yanıtı bulunmayan iddialar eklenmemeli

Kelime sayısı hedef değil, kapsam kontrol aracıdır. Rakipten uzun olmak tek başına avantaj değildir.

---

## 10. Teknik SEO ayrıntıları

### 10.1 Title şablonu

Canlı panel incelemesinde `Genel Ayarlar > SEO` altında `Varsayılan Sayfa Başlığı` alanının kategoriye özgü title'ın sonuna otomatik eklendiği doğrulandı. Mevcut ayar şu uzun ifadeyi ekliyor:

`Sümen Takımı Modelleri ve Fiyatları - Deri & Ahşap Sümen Takımı | İmalattan`

Bu ek, kategori başlığıyla birleştiğinde 100 karakteri aşan tekrarlar yaratıyor. Canlı pilotla doğrulanan sistemik düzeltme: `SeoSettings.DefaultTitle` değerini `Sümen Takımı Modelleri ve Fiyatları | İmalattan`, `SeoSettings.PageTitleSeparator` değerini ` | ` ve `SeoSettings.PageTitleSeoAdjustment` seçimini `---` yapın. Böylece ana sayfa anlamlı varsayılan title'ı kullanır; alt sayfalar global eki otomatik almaz. Kategori `MetaTitle` alanlarına marka dahil tam ve benzersiz final title yazılır.

### 10.2 Sayfalama ve canonical

Mevcut örnek:

- Sayfa 1: `/sumen-takimlari/`
- Sayfa 2: `/sumen-takimlari/?pagenumber=2`
- Sayfa 2'de 35 farklı ürün var.
- Sayfa 2 canonical'ı sayfa 1'e gidiyor.

Önerilen:

- Sayfa 1 canonical: `/sumen-takimlari/`
- Sayfa 2 canonical: `/sumen-takimlari/?pagenumber=2`
- Her sayfa 200 ve index, follow olabilir.
- Sayfalar ardışık, crawl edilebilir `<a href>` bağlantılarıyla bağlı kalmalı.
- Tüm ürünler yalnızca kullanıcı tıklamasıyla çalışan JavaScript butonlarına bırakılmamalı.
- Kategori açıklamasının tamamı sadece sayfa 1'de gösterilebilir; sonraki sayfalarda kısa/tekrarsız başlık yeterlidir.

### 10.3 Filtre, görünüm ve sıralama parametreleri

Canlı sayfada `?v=f`, `?v=t` ve `?h=true` gibi varyasyonlar görüldü. Bu URL'ler aynı ürün koleksiyonunun görünüm veya stok varyantlarını üretiyorsa:

- Ana kategoriye canonical verilebilir.
- Arama sonuçlarında tutulmaları gerekmiyorsa `noindex, follow` uygulanabilir.
- Sonsuz kombinasyon üreten filtre URL'leri sitemap'e eklenmemeli.
- robots.txt ile engelleme, `noindex` sinyalinin görülmesini engelleyebileceği için tek başına indeks kontrolü olarak kullanılmamalı.
- Gerçek arama talebi olan kalıcı kombinasyonlar parametre yerine ayrı landing kategori olarak oluşturulmalı; örneğin “siyah deri sümen takımı” ancak yeterli ürün, talep ve benzersiz içerik varsa.

### 10.4 Ürün sayısı ve performans

Örnek yoğun kategori sayfalarında:

- 96 ürün kartı
- Yaklaşık 100 görsel
- 248–295 KB HTML
- 19 script etiketi
- 0 lazy yüklenen görsel
- 0 `srcset` kullanan görsel

Önerilen uygulama:

- İlk sayfada 24 veya 36 ürün.
- İlk ekran/ilk satır görselleri normal ve yüksek öncelikli; diğer ürün görselleri `loading="lazy"`.
- Responsive görsel için `srcset` ve `sizes`.
- Görsel etiketlerinde gerçek width/height ile layout kaymasını azaltma.
- WebP ve mümkünse AVIF; JPEG/PNG fallback.
- Liste görseli ile ürün detay büyük görselini ayırma.
- Görsel dosya adlarını ürün adı/modeliyle anlamlı hale getirme.
- CDN ve uzun süreli cache başlıklarını kontrol etme.
- Mobil gerçek kullanıcı verisini Search Console Core Web Vitals raporundan izleme.

PageSpeed API denemesi kota hatası verdiği için bu çalışmada doğrulanmış LCP/INP/CLS puanı yazılmamıştır. Uygulama öncesi ve sonrası PSI/Lighthouse ile aynı cihaz ve ağ profilinde ölçüm yapılmalıdır.

### 10.5 Görsel alt metinleri

Kategori ürün görsellerinde alt metin, ürünün görünür adını kısa ve doğal biçimde taşımalıdır.

İyi örnekler:

- `Siyah 10 parçalı deri sümen takımı`
- `Ceviz ahşap yönetici masa sümeni`
- `Krom direkli ikili Türk masa bayrağı`

Kaçınılacak örnek:

- `sümen sümen takımı ucuz sümen fiyatları en iyi sümen`

Dekoratif ikon ve boşluk görsellerinde boş alt (`alt=""`) kullanılabilir. Her görselde anahtar kelime doldurmak erişilebilirlik ve kalite açısından yanlıştır.

### 10.6 Sitemap

- Yinelenen `/bize-ulasin/` kaydını kaldırın.
- `lastmod` yalnızca sayfa anlamlı biçimde değiştiğinde güncellensin.
- Kategori ve ürün sitemap'leri ayrı dosyalara bölünebilir; mevcut 490 benzersiz URL için zorunlu değil ama izlemeyi kolaylaştırır.
- 3xx, 4xx, noindex veya başka URL'ye canonical veren sayfalar sitemap'te tutulmamalı.
- Sitemap Search Console'a gönderilmeli ve “Keşfedildi / Tarandı / Dizine eklendi” oranı izlenmeli.

### 10.7 Breadcrumb

Görsel ve yapılandırılmış breadcrumb şu mantığı izlemeli:

- `Ana Sayfa > Sümen Takımları > Deri Sümen Takımları`
- `Ana Sayfa > Ofis Masaüstü Aksesuarları > Masa İsimlikleri > Kristal Masa İsimlikleri`
- `Ana Sayfa > Bayraklar > Makam Bayrakları`
- `Ana Sayfa > Ofis Duvar Dekorasyonu > Makam Panoları > Resimli Makam Panoları`

Bu ilişki yalnızca schema içinde değil, sayfada görünen gerçek bağlantılarla kurulmalıdır.

### 10.8 Stokta olmayan ve boş kategoriler

- Geçici stok yoksa kategori 200 kalmalı; ilgili alternatif ürünler ve stok mesajı sunulmalı.
- Kalıcı olarak kaldırılan ürün eşdeğer ürüne veya en yakın alt kategoriye 301 yönlendirilebilir; alakasız ana sayfaya yönlendirilmemeli.
- Sıfır ürünlü filtre URL'leri indexlenmemeli.
- Tek ürünlü kategori, benzersiz sorgu talebi ve landing değeri yoksa ürün sayfasıyla birleştirme açısından değerlendirilmelidir.

---

## 11. Yapılandırılmış veri planı

### Kategori sayfaları

Önerilen tipler:

- `BreadcrumbList`
- `CollectionPage`
- Görünen ürünleri listeleyen `ItemList`

ItemList sıralaması HTML'deki ürün sırasıyla aynı olmalıdır. İşaretleme kullanıcıya görünmeyen ürün veya bilgi içermemelidir.

Örnek şablon:

~~~json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "CATEGORY_URL#webpage",
      "url": "CATEGORY_URL",
      "name": "CATEGORY_H1",
      "description": "CATEGORY_META_DESCRIPTION"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": "https://www.imalattansumen.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "PARENT_CATEGORY",
          "item": "PARENT_CATEGORY_URL"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "CATEGORY_H1",
          "item": "CATEGORY_URL"
        }
      ]
    },
    {
      "@type": "ItemList",
      "numberOfItems": 24,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "PRODUCT_URL_1"
        }
      ]
    }
  ]
}
~~~

### Ürün sayfaları

Mevcut örnekte Product microdata görülüyor. Aşağıdakiler gerçek veriye dayanıyorsa eksiksizleştirilmeli:

- name
- image
- description
- sku
- gtin/mpn varsa
- brand
- offers.price
- offers.priceCurrency
- offers.availability
- itemCondition
- shippingDetails
- hasMerchantReturnPolicy
- aggregateRating/review yalnızca gerçek ve kullanıcıya görünür yorumlardan
- varyant ilişkileri; renk ve parça sayısı ayrı ürün URL'leri ise ProductGroup yaklaşımı değerlendirilebilir

Schema tek başına sıralama garantisi değildir ve Google zengin sonuç göstermeyi garanti etmez. Rich Results Test, Schema Markup Validator ve Search Console iyileştirme raporlarıyla doğrulama yapılmalıdır.

---

## 12. İç bağlantı planı

### Ana kategori modülleri

`/sumen-takimlari/` üzerinde ürün gridinden önce veya sonra şu bağlantılar olmalı:

- Deri Sümen Takımları
- Ahşap Sümen Takımları
- Lüks Sümen Takımları
- Uygun Fiyatlı Sümen Takımları
- Kişiye Özel Sümen Takımı Oluştur

Her alt kategori, açıklama içinde ana Sümen Takımları sayfasına ve gerçekten ilgili 1–3 kardeş kategoriye dönmelidir.

### Çapraz satış bağlantıları

| Kaynak kategori | Hedef kategori | Önerilen anchor |
|---|---|---|
| Sümen Takımları | Masa İsimlikleri | kişiye özel masa isimlikleri |
| Deri Sümen | Evrak Rafları | uyumlu deri evrak rafları |
| Masa İsimlikleri | Masa Bayrakları | masa bayrağı modelleri |
| Makam Bayrakları | Makam Panoları | makam odası panoları |
| Kanvas Tablo | Atatürk Portreleri | Atatürk portresi modelleri |
| Ofis Aksesuarları | Çöp Kovaları | deri ofis çöp kovaları |
| Magazinlik | Evrak Rafları | masaüstü evrak düzenleyiciler |

### Blog destek içerikleri

Öncelikli makale başlıkları:

1. Sümen Takımı Nedir? Parçaları ve Kullanım Alanları
2. Deri Sümen Takımı Nasıl Temizlenir?
3. Yönetici Masası İçin Sümen Takımı Nasıl Seçilir?
4. Sümen Takımı Kaç Parça Olmalı?
5. Ahşap ve Deri Sümen Takımı Karşılaştırması
6. Kişiye Özel Yönetici Hediyesi Seçenekleri
7. Masa İsimliğinde İsim ve Unvan Nasıl Yazılmalı?
8. Makam Odası Aksesuarları Kontrol Listesi
9. Masa Bayrağı ile Makam Bayrağı Arasındaki Farklar
10. Makam Panosu Ölçüsü Nasıl Seçilir?
11. Ofis Duvarına Uygun Kanvas Tablo Ölçüsü Nasıl Hesaplanır?
12. Evrak Rafı ve Masaüstü Organizer ile Masa Düzeni

Her makale bir ana kategoriye birincil bağlantı vermeli; aynı anchor'ı zorla tekrarlamamalıdır. Kategori sayfası da ilgili rehbere “seçim rehberi” olarak bağlantı verebilir.

---

## 13. Kategori UX ve dönüşüm önerileri

SEO trafiği satışa dönüşmüyorsa çalışma yarım kalır. Kategori kartlarında şu bilgiler kolay taranmalıdır:

- Malzeme: hakiki deri, suni deri, ahşap, kristal vb.
- Parça sayısı
- Renk
- Kişiselleştirme var/yok
- Set içeriğinin kısa özeti
- Stok durumu
- Tahmini üretim/kargo süresi
- Fiyat ve varsa indirim
- Kullanıcı puanı yalnızca gerçek yorum varsa

### Filtre önerileri

Sümen kategorilerinde:

- Malzeme
- Renk
- Parça sayısı
- Fiyat aralığı
- Evrak rafı: yok/tekli/ikili
- Kişiselleştirme
- Stok durumu

Masa isimliklerinde:

- Malzeme
- Tek/çift kalem
- Bayraklı/bayraksız
- Logolu/logosuz
- Fiyat

Kanvas ve portrelerde:

- Ölçü
- Yatay/dikey
- Çerçeveli/çerçevesiz
- Tema
- Renk

Filtreler kullanıcıya fayda sağlamalı; her kombinasyonu indexlenebilir URL'ye dönüştürmemelidir.

### Güven ve E-E-A-T unsurları

- Gerçek üretim atölyesi fotoğrafları
- Malzeme açıklamaları ve bakım talimatları
- “İmalattan” iddiasını destekleyen üretim süreci
- Şirket unvanı, açık iletişim ve iade/teslimat bilgileri
- Kişiye özel ürünlerde prova/onay süreci
- Gerçek müşteri yorumları ve izinli kurulum/masa fotoğrafları
- Kategori veya rehber içeriğinin güncellenme tarihi
- Kurumsal sipariş ve toplu alım sürecinin açıklanması

`Sizden Gelenler` sayfası, kategori ve ürünlere bağlanan gerçek müşteri örnekleriyle güçlü bir sosyal kanıt merkezine dönüştürülebilir. Sahte, tekrar eden veya ürünle doğrulanamayan yorum kullanılmamalıdır.

---

## 14. Rakip/SERP gözlemleri

Güncel arama sonuçlarında büyük pazar yerleri ve fiyat karşılaştırma sayfaları yanında niş ofis/kırtasiye satıcıları görünmektedir. Öne çıkan ortak unsurlar:

- Ürün adedi ve kategori kapsamı görünür.
- Renk, marka ve fiyat gibi filtreler sunulur.
- Kategori altında seçim rehberi bulunur.
- Ürünlerde fiyat, stok, teslimat ve varyant bilgileri nettir.
- Masa isimliği sonuçlarında kullanım alanları (belediye, okul, hukuk bürosu, makam odası) ve kişiselleştirme güçlü biçimde işlenir.
- Bayrak sonuçlarında tekli/ikili/çoklu set, Türk/logolu seçenek, direk tipi, kumaş ve ölçü bilgisi sunulur.
- Kanvas/Atatürk ürünlerinde ölçü, çerçeve, baskı malzemesi, üretim ve teslimat detayları öne çıkar.

İmalattan Sümen'in ayrışma fırsatı, yalnızca “çok ürün” göstermek değil; **imalatçı bilgisi + kişiye özel üretim + uyumlu masa seti oluşturma + gerçek malzeme açıklaması** kombinasyonunu kategori seviyesinde kanıtlamaktır.

---

## 15. 90 günlük uygulama takvimi

### Hafta 1–2: Teknik temel

- Mevcut Search Console/G4 taban çizgisini dışa aktar.
- Global title şablonunu düzelt.
- Kopya metadata'yı benzersizleştir.
- Sayfa 2 self-canonical düzeltmesini yap.
- Çift H1'i kaldır.
- Sitemap tekrarını kaldır ve lastmod mantığını düzelt.
- Yoğun kategoriler için 24–36 ürünlük sayfalama testini hazırla.

### Hafta 3–4: Hız ve şablon

- Lazy loading, responsive görsel ve boyut niteliklerini uygula.
- İlk satır görsellerini LCP açısından ayrı ele al.
- Kategori üst/alt içerik alanlarını şablona ekle.
- Breadcrumb hiyerarşisini güncelle.
- Filtre URL politikası uygula.
- Staging veya sınırlı kategori grubunda QA yap.

### Hafta 5–6: Ana gelir kategorileri

- Sümen Takımları
- Deri Sümen Takımları
- Ahşap Sümen Takımları
- Lüks Sümen Takımları
- Sümen Takımı Oluşturma
- Masa İsimlikleri

Bu kategorilere metadata, içerik, alt kategori kartları ve iç bağlantıları uygula.

### Hafta 7–8: İkincil ticari kategoriler

- Ofis Masaüstü Aksesuarları
- Evrak Rafları
- Magazinlik ve Dosyalık
- Çöp Kovaları
- Bayraklar, Masa Bayrakları, Makam Bayrakları

### Hafta 9–10: Duvar dekorasyonu ve makam panoları

- Kanvas Tablo
- Dekoratif Kanvas Tablo
- Atatürk Portreleri
- Düğmeli Makam Panosu
- Resimli Makam Panoları

### Hafta 11–12: Şema, Merchant Center ve optimizasyon

- BreadcrumbList ve ItemList şemasını doğrula.
- Ürün Product verisini genişlet.
- Merchant Center feed'ini kontrol et.
- Search Console sorgu–sayfa eşleşmelerini incele.
- CTR düşük, konumu iyi kategorilerde title/description testi başlat.
- İlk içerik grubunun iç bağlantı ve dönüşüm performansını değerlendir.

---

## 16. Ölçüm planı ve KPI'lar

### Uygulama öncesi kaydedilecekler

Her kategori için son 28 ve önceki 28 gün:

- Organik tıklama
- Gösterim
- CTR
- Ortalama konum
- İlk 10 sorgu
- Organik oturum
- Ürün listeleme görüntüleme
- Ürün tıklama oranı
- Sepete ekleme
- Satın alma/lead
- Gelir

### 30/60/90 gün değerlendirmesi

| KPI | Beklenen yön | Yorum |
|---|---|---|
| Kategori gösterimleri | Artış | Yeni sorgu kapsamı ve daha iyi indekslenme |
| CTR | Artış | Kısa ve benzersiz title/description etkisi |
| Dizine eklenen sayfalama ürünleri | Artış | Self-canonical ve crawl edilebilir pagination etkisi |
| Mobil LCP/INP | İyileşme | Ürün/görsel sayısının azaltılması ve lazy loading |
| Kategori → ürün tıklama oranı | Artış | Filtre, kart bilgisi ve seçim içeriği etkisi |
| Organik dönüşüm oranı | Artış | Niyet uyumu ve güven unsurları |
| Parametre URL indeks sayısı | Azalış/kontrol | Faceted navigation politikasının sonucu |

### Karar kuralları

- Konum 3–10, CTR düşük: title/meta ve SERP niyetini yeniden test et.
- Gösterim artıyor, ürün tıklaması düşüyorsa: üst içeriği kısalt, filtre/kart UX'ini iyileştir.
- Çok sorgu tek sayfada karışıyorsa: alt kategori ihtiyacını değerlendir.
- İki kategori aynı sorguda dönüşümlü görünüyorsa: cannibalization için title/H1/iç bağlantı ayrımını güçlendir.
- Yeni içerik 8–12 hafta sonunda gösterim almıyorsa: talep, iç bağlantı, indeksleme ve içerik özgünlüğünü birlikte kontrol et.

---

## 17. Yayın öncesi QA kontrol listesi

Her kategori için:

- [ ] URL 200 durum kodu veriyor.
- [ ] Tek H1 var.
- [ ] Title benzersiz ve kısa.
- [ ] Meta description benzersiz ve sayfayla uyumlu.
- [ ] Self-referencing canonical doğru.
- [ ] Sayfa 2+ kendi canonical'ını taşıyor.
- [ ] Filtre/sıralama URL politikası doğru.
- [ ] Breadcrumb görünür ve tıklanabilir.
- [ ] BreadcrumbList şeması HTML ile aynı.
- [ ] Ürün bağlantıları gerçek `href` içeriyor.
- [ ] İlk ekran dışındaki görseller lazy load.
- [ ] Görsellerde width/height, uygun alt metin ve responsive kaynak var.
- [ ] Üst giriş ürünleri gereksiz yere aşağı itmiyor.
- [ ] Alt içerik kategoriye özgü ve seçim yardımı sunuyor.
- [ ] İç bağlantılar doğru hedefe gidiyor.
- [ ] Stok/fiyat/teslimat iddiaları doğru.
- [ ] Mobil görünüm ve filtre kullanımı test edildi.
- [ ] Rich Results Test kritik hata vermiyor.
- [ ] URL sitemap'te tek kez yer alıyor.
- [ ] Search Console URL Inspection ile render ve canonical kontrol edildi.
- [ ] GA4 e-ticaret olayları kategori → ürün → sepet akışını kaydediyor.

---

## 18. Yönetim panelinde uygulama sırası

Faprika yönetim panelindeki alan adları kuruluma göre değişebilir. Kategori düzenleme ekranında genel sıra şu olmalıdır:

1. Kategori adı/H1
2. SEO title
3. Meta description
4. Kategori üst kısa açıklaması
5. Kategori alt detay açıklaması
6. Kategori görseli ve alt metni
7. Üst kategori ilişkisi
8. URL/slug — yalnızca planlı migrasyon varsa
9. Index/follow ve canonical şablonu
10. Ürün sıralaması ve sayfa başına ürün sayısı

Önce `/sumen-takimlari/` üzerinde pilot uygulama yapılması; HTML, canonical, mobil görünüm ve ürün tıklamalarının doğrulanmasından sonra aynı şablonun diğer kategorilere yayılması önerilir.

---

## 19. Kaynaklar

### Site kaynakları

- [İmalattan Sümen ana sayfa](https://www.imalattansumen.com/)
- [Robots.txt](https://www.imalattansumen.com/robots.txt)
- [XML sitemap](https://www.imalattansumen.com/sitemap.xml)
- [Sümen Takımları kategorisi](https://www.imalattansumen.com/sumen-takimlari/)
- [Deri Sümen Takımları kategorisi](https://www.imalattansumen.com/deri-sumen-takimlari/)
- [Masa İsimlikleri kategorisi](https://www.imalattansumen.com/masa-isimlikleri-3/)

### Google Search Central

- [E-ticaret sayfalama ve artımlı yükleme önerileri](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [E-ticaret site yapısını Google'a anlatma](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Title link en iyi uygulamaları](https://developers.google.com/search/docs/appearance/title-link)
- [Meta description ve snippet önerileri](https://developers.google.com/search/docs/appearance/snippet)
- [Breadcrumb yapılandırılmış verisi](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Product yapılandırılmış verisine giriş](https://developers.google.com/search/docs/appearance/structured-data/product)
- [E-ticaret için yapılandırılmış veri](https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce)
- [Görsel SEO en iyi uygulamaları](https://developers.google.com/search/docs/appearance/google-images)

### Güncel SERP örnekleri

- [Cimri — Sümen Takımı](https://www.cimri.com/sumen-takimi/en-ucuz-beyaz-sumen-takimi-fiyatlari)
- [Aka Kırtasiye — Sümen Takımları](https://www.akakirtasiye.com.tr/sumen-takimlari/)
- [Beymen — Sümen Takımı](https://www.beymen.com/tr/sumen-takimi-97025?sayfa=-1)
- [İstanbul Plaket — Masa İsimlikleri](https://www.istanbulplaket.com/tr/masa-isimlikleri-istanbul--k)
- [Bayrakçım — Masa Bayrağı](https://www.bayrakcim.com/masa-bayragi)
- [Bayrakçım — Makam Bayrağı](https://www.bayrakcim.com/makam-bayragi)
- [Fupe Shop — Atatürk Kanvas Tablo](https://www.fupeshop.com/ataturk-kanvas-tablo)

---

## 20. Sonuç

En büyük fırsat yeni yüzlerce sayfa açmak değil, mevcut kategori şablonunu sistematik olarak düzeltmektir. İlk odak; title şablonu, sayfalama canonical'ı, ürün/görsel yükü, kategori hiyerarşisi ve benzersiz metadata olmalıdır. Ardından ana gelir kategorilerine seçim odaklı içerik, doğru iç bağlantılar ve doğrulanmış yapılandırılmış veri eklenmelidir.

Başarı ölçütü yalnızca sıralama değildir: kategori gösterimi ve CTR artarken ziyaretçinin doğru ürüne daha hızlı ulaşması, ürün tıklaması ve organik dönüşüm oranının da yükselmesi gerekir.
