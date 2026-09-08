# Güner Ofis — Büyüme Planı Kaynak Dosyası

> Bu dosya, Güner Ofis için hazırlanan dijital pazarlama / SEO / dönüşüm büyüme stratejisinin ana kaynağıdır.
> Görevler sırayla bu plana göre verilecektir. Her yeni görev öncesi bu dosya okunmalı, tamamlanan
> maddeler işaretlenmeli ve ilerleme burada güncel tutulmalıdır.

## Durum Takibi — Uygulama Sırası (kullanıcı tarafından belirlendi)

- [ ] 1. Ölçüm sistemi (GA4, Search Console, Pixel, dönüşüm takibi)
- [ ] 2. Google Merchant Center
- [ ] 3. Google İşletme Profili + yorumlar
- [ ] 4. Google Ads
- [x] 5. Adres düzeltme — Onur Sok. No:8 tek doğru adres, diğeri silinecek (2026-08-20 tamamlandı)
- [x] 6. `/` → `/en/` yönlendirme sorunu (2026-08-20 kullanıcı kendisi çözdü)
- [x] 7. "Wholesale Women Clothing" ifadesi — canlıda artık görünmüyor (2026-08-20, bkz. not)
- [ ] 8. Sosyal medya stratejisi
- [ ] 9. Sosyal medyada satış hunisi
- [ ] 10. B2B / kurumsal satış
- [ ] 11. LinkedIn
- [ ] 12. İhracat
- [ ] 13. Pazaryerleri
- [ ] 14. CRM
- [ ] 15. Ürün stratejisi
- [ ] 16. Güven unsurları
- [ ] 17. 90 günlük işleyiş (revize edilecek)
- [ ] 18. SEO — en son, sürekli devam eden iş

**Platform:** Site Faprika (faprika.com) altyapısında. Madde 5-6-7 admin panelinden düzeltilir.

---

## Öncelik sırası

| Sıra   | Alan                                    |           Etki | Başlama                 |
| ------ | --------------------------------------- | -------------: | ------------------------ |
| **1**  | Web sitesi teknik + dönüşüm altyapısı   |  🔴 Çok yüksek | Hemen                   |
| **2**  | Google Search + Merchant Center         |  🔴 Çok yüksek | Hemen                   |
| **3**  | Google İşletme Profili + yorumlar       |  🔴 Çok yüksek | Hemen                   |
| **4**  | SEO / kategori hakimiyeti               |  🔴 Çok yüksek | 1. hafta                |
| **5**  | Google Ads                              |      🟠 Yüksek | Altyapı bittikten sonra |
| **6**  | Instagram / Reels / TikTok / Shorts     |      🟠 Yüksek | 2. hafta                |
| **7**  | B2B / kurumsal satış                    |      🟠 Yüksek | 2–4. hafta              |
| **8**  | İhracat / yabancı pazar                 |      🟠 Yüksek | 1–2. ay                 |
| **9**  | CRM / tekrar satış / WhatsApp / e-posta | 🟡 Orta-yüksek | 1. ay                   |
| **10** | Marka / PR / backlink / iş birlikleri   |        🟡 Orta | Sürekli                 |

---

# 1. Önce web sitesini kusursuzlaştır

Şu anda burada hâlâ birkaç temel sorun var.

### 🔴 Öncelikli

**A. Türk kullanıcı `/` adresine girince İngilizce `/en/` açılıyor.** Bugünkü kontrolde bu hâlâ gerçekleşiyor.

Doğrusu:

- `gunerofis.com/` → Türkçe
- `gunerofis.com/en/` → İngilizce
- `/ar/` → Arapça
- otomatik zorunlu dil yönlendirmesi olmamalı
- canonical + hreflang düzgün kurulmalı

**B. Firma bilgilerinin her yerde aynı olması lazım.**

Şu anda sitede:

- bir yerde **Onur Sok. No:8**
- başka yerde **Etibank Cad. No:39/7**

görünüyor.

Google açısından:

**Firma adı + adres + telefon = tek standart.**

Site, Google Maps, Instagram, Facebook, kataloglar ve diğer firma dizinleri aynı bilgiyi göstermeli.

**C. İngilizce sitede hâlâ Türkçe içerikler var.**

Örneğin:

- "Kristal Sümen Takımları"
- "Deri Kutular"
- "Yazı Tahtaları"
- "Çöp Kovaları"

ve footer'da tamamen alakasız:

**"Wholesale Women Clothing"**

görünüyor.

Bunlar temizlenmeli.

---

# 2. Ölçüm sistemi kurulmalı

Reklama para harcamadan önce:

- Google Analytics 4
- Google Search Console
- Google Merchant Center
- Google Ads
- Google Ads dönüşüm takibi
- Meta Pixel
- Meta Conversion API mümkünse
- satın alma dönüşümü
- sepete ekleme
- ödeme başlatma
- WhatsApp tıklama
- telefon tıklama
- teklif formu
- bayi başvurusu

ölçülmeli.

Yani artık sadece:

> "Siteye 5.000 kişi geldi."

demeyeceğiz.

Şunu bileceğiz:

> 5.000 ziyaret → 310 sepete ekleme → 96 ödeme → 51 sipariş → 184.000 TL ciro.

---

# 3. Google Merchant Center

**Güner Ofis için en önemli büyüme alanlarından biri bu.**

Tüm ürünleri Merchant Center'a düzgün feed olarak gönderelim:

- ürün adı
- ürün açıklaması
- fiyat
- stok
- marka
- GTIN varsa GTIN
- MPN / stok kodu
- renk
- materyal
- görsel
- kargo
- teslimat süresi

Google'ın ücretsiz ürün listelemeleri ürünleri **Google Search, Maps, Images, Lens, YouTube, Shopping ve Gemini** gibi yüzeylerde ücretsiz gösterebiliyor.

Son konuşulan **GTIN işinin** önemi de burada ortaya çıkıyor.

Ürün sayfalarında ayrıca:

`Product + Offer + AggregateRating/Review`

structured data düzgün olmalı. Google, e-ticaret sitelerinde structured data'nın ürünleri daha doğru anlamasına yardımcı olduğunu açıkça belirtiyor.

---

# 4. Google İşletme Profili

Burayı ayrı bir satış kanalı gibi yöneteceğiz.

Google'ın kendi açıklamasına göre yerel sıralamanın temel bileşenleri:

**Alaka + Mesafe + Belirginlik/Popülerlik.** Yorum sayısı ve olumlu puanlar da belirginliğe katkıda bulunabiliyor.

Yapılacak:

- doğru ana kategori
- tüm ikincil kategoriler
- eksiksiz açıklama
- ürünler
- hizmetler
- web sitesi
- WhatsApp/telefon
- çalışma saatleri
- 50+ kaliteli gerçek fotoğraf
- atölye görüntüleri
- üretim görüntüleri
- mağaza
- ürünler
- paketleme
- video
- düzenli Google gönderileri

### En önemlisi: yorum sistemi

Her siparişten birkaç gün sonra müşteriye:

**Google yorum bağlantısı**

gönderilmeli.

Hedef sadece yıldız değil.

Müşterinin doğal biçimde:

> "Güner Ofis'ten hakiki deri sümen takımı aldım…"

gibi ürünle ilgili detay vermesi son derece değerlidir.

Sahte yorum kullanılmaz.

---

# 5. SEO

Burada klasik:

> "Her gün blog yazalım."

yaklaşımını istemiyoruz.

Önce **para getiren sorguları ele geçireceğiz.**

### Ana kümeler

**Sümen**

- sümen takımı
- sümen seti
- deri sümen takımı
- hakiki deri sümen takımı
- lüks sümen takımı
- ahşap sümen takımı
- yönetici masa seti
- makam masa seti

**Hediye**

- yönetici hediyesi
- müdüre hediye
- patrona hediye
- kurumsal hediye
- kişiye özel masa seti

**Kutular**

- saat kutusu
- deri saat kutusu
- lüks saat kutusu
- gözlük kutusu
- tesbih kutusu

**B2B**

- sümen takımı üreticisi
- deri ürün imalatçısı
- kurumsal deri ürün üreticisi
- özel üretim deri ürün
- otel deri ekipmanları üreticisi

Her sorgunun **doğru kategori/landing page'i** olacak.

Ürün sayfaları da birbirinin kopyası olmayacak.

Şu anda Google ürünleri ve bazı blog içeriklerini zaten indeksliyor; yani sıfırdan başlanmıyor. Örneğin deri sümen kategorisi ve ürün sayfaları Google tarafından taranmış durumda.

---

# 6. Google Ads

SEO sonucunu beklerken satın alma niyeti yüksek kullanıcıyı Ads ile yakalarız.

Sıralama:

### 1 — Search Ads

Önce:

**"hakiki deri sümen takımı"**

gibi satın almaya yakın sorgular.

### 2 — Shopping

Merchant Center ürünleri.

### 3 — Performance Max

Feed kaliteli hale geldikten sonra.

### 4 — Remarketing

Siteye girip:

- satın almayan
- sepete ekleyen
- ürün inceleyen

kişilere tekrar ulaşılır.

### İlk aşamada yapılmayacak:

Geniş hedefli, "herkese Güner Ofis reklamı gösterelim" kampanyası.

Para yakar.

---

# 7. Sosyal medya stratejisini değiştirmek

Instagram'ı sadece:

> ürün fotoğrafı → fiyat → satın al

hesabı haline getirmemek lazım.

Güner Ofis'in çok daha güçlü bir avantajı var:

## **Üretici olması.**

Bu ciddi içerik avantajı.

### İçerik motoru

Her hafta içerikler şu 6 gruptan çıkmalı:

1. **Üretim**
   - deri kaplama
   - kesim
   - montaj
   - paketleme

2. **Ürün detayları**
   - deri yakın çekim
   - füme cam
   - ahşap
   - mekanizma
   - kişiselleştirme

3. **Dönüşüm**
   - boş masa → Güner Ofis masa

4. **Kişiselleştirme**
   - isim
   - logo
   - renk
   - özel üretim

5. **Sosyal kanıt**
   - müşteri siparişleri
   - ihracat kolileri
   - kurumsal siparişler

6. **Ürün hikâyesi**
   - "Bu ürün neden böyle tasarlandı?"
   - "Hakiki deri ile suni deri farkı"
   - "7 parça mı 14 parça mı?"

Aynı çekim:

**Instagram Reels + TikTok + YouTube Shorts**

olarak kullanılabilir.

Tek çekimden 3 kanal beslenir.

---

# 8. Sosyal medyada takipçi değil satış hunisi

Akış:

**Reels**
↓ ürünü merak et
↓ profil
↓ ürün/kategori
↓ site
↓ sepete ekleme
↓ satın alma
↓ remarketing
↓ Google yorumu
↓ yeniden pazarlama

Asıl KPI:

- takipçi değil
- beğeni değil

**ciro / dönüşüm / müşteri edinme maliyeti.**

---

# 9. B2B Güner Ofis için çok büyük fırsat

B2C kadar önemli ikinci motor bu.

Sitede şirketin özel üretim yaptığı ve toplu sipariş alabildiği belirtiliyor. Ayrıca 13 ülkeye ihracat yapıldığı ifade ediliyor.

Ayrı bir:

## **Kurumsal & Özel Üretim**

sayfası oluşturulmalı.

Hedef:

- şirketler
- holdingler
- bankalar
- hukuk büroları
- belediyeler
- kamu kurumları
- oteller
- mimarlık şirketleri
- iç mimarlar
- mobilyacılar
- kurumsal hediye firmaları
- promosyon firmaları

CTA:

**"Kurumsal teklif alın"**

Form:

- firma
- adet
- ürün
- logo
- renk
- teslim tarihi
- telefon
- e-posta

---

# 10. LinkedIn

Instagram'dan farklı kullanılmalı.

Burada:

> "Yeni sümen modelimiz."

yerine:

> "250 adet logolu deri masa setinin üretim ve sevkiyatını tamamladık."

çok daha değerli.

Hedef:

- satın alma müdürleri
- şirket sahipleri
- ofis yöneticileri
- mimarlar
- otel satın almacıları
- kurumsal hediye şirketleri

---

# 11. İhracat

Burada mevcut avantaj ciddi.

İngilizce site tamamen düzgün hale getirildikten sonra:

### İlk hedef pazarlar

- ABD
- Almanya
- İngiltere
- Körfez ülkeleri
- Hollanda
- Fransa

Ürün bazlı İngilizce SEO:

- luxury desk set
- leather desk set
- executive desk accessories
- leather desk pad
- personalized desk set
- corporate executive gifts
- leather hotel accessories
- watch storage box

Ayrıca B2B için:

**OEM / Private Label / Custom Manufacturing**

sayfası oluşturulmalı.

Bu, yabancı toptancı için "biz üreticiyiz" mesajını netleştirir.

---

# 12. Pazaryerleri

Web sitesi ana merkez olacak ama dağıtım kanalları açılır:

### Türkiye

- Trendyol
- Hepsiburada
- Amazon Türkiye

### Uluslararası

ürün uygunluğuna göre:

- Amazon
- Etsy
- eBay
- Alibaba / B2B platformları

Ama amaç müşteriyi pazaryerine bağımlı hale getirmek değil.

**Güner Ofis markasını büyütmek.**

---

# 13. CRM

İlk satın alma sonrasında müşteriyi kaybetmemek gerekir.

### Otomasyon

**Sipariş** → teşekkür

**Teslimat** → kullanım/bakım bilgisi

**+5 gün** → Google yorum isteği

**+30 gün** → tamamlayıcı ürün

**+90/180 gün** → yeni ürün / hediye / kampanya

B2B müşteriler ayrıca ayrı tutulmalı.

---

# 14. Ürün stratejisi

Sadece mevcut kataloğa trafik çekmek yetmez.

Ürünleri üç gruba ayırırız:

### A — Trafik ürünleri

Uygun fiyatlı, kullanıcıyı markaya sokan ürün.

### B — Ana ciro ürünleri

4.000–12.000 TL gibi ana ürün grubu.

### C — Halo ürünler

20.000–50.000+ TL premium ürünler.

Halo ürün çok satılmak zorunda değil.

Markaya:

**"lüks üretici"**

algısı kazandırır.

Hakiki deri sümenlerde şu anda 12.500 TL ve 27.500 TL gibi ürünlerin bulunması bu premium konumlandırmaya zaten imkân veriyor.

---

# 15. Güven unsurları

Anasayfada çok net şekilde gösterilmeli:

**1995'ten beri üretim**

**13 ülkeye ihracat**

**Türkiye'nin 81 iline teslimat**

**Kendi üretimimiz**

**Özel üretim**

**Kişiselleştirme**

**2 yıl garanti**

Bunların çoğu zaten şirket bilgilerinde mevcut.

Fakat bunlar "Hakkımızda" içinde saklı kalmamalı.

Satın alma kararının verildiği yerlerde görünmeli.

---

# 16. 90 günlük işleyiş

### 🔴 İlk 7 gün — Temel

1. `/ → /en/` sorununu çöz
2. canonical/hreflang
3. sitemap/robots
4. Türkçe/İngilizce karışıklıkları
5. adres/telefon standardizasyonu
6. mobil sorunlar
7. hız/görsel optimizasyonu
8. Analytics/Search Console
9. dönüşüm takibi
10. Merchant Center feed

### 🟠 Gün 8–30 — Google hakimiyeti

11. Merchant ücretsiz listeler
12. Product schema
13. Google İşletme Profili
14. Google yorum sistemi
15. ana kategorilerin SEO'su
16. ürün SEO'su
17. Google Search Ads
18. Shopping
19. remarketing

### 🟡 Gün 15–45 — Sosyal

20. Instagram içerik sistemi
21. TikTok
22. YouTube Shorts
23. gerçek üretim videoları
24. UGC/müşteri içerikleri
25. Meta remarketing

### 🟢 Gün 30–90 — Ölçekleme

26. kurumsal satış sayfası
27. LinkedIn
28. bayi/toptan sistemi
29. İngilizce B2B landing pages
30. OEM/private label
31. ihracat reklamları
32. CRM
33. e-posta/WhatsApp otomasyonları
34. PR/backlink
35. mimar–otel–kurumsal hediye iş birlikleri

---

## Genel sistem mantığı

**Google** → mevcut talebi yakala

**SEO** → ücretsiz ve sürekli talep oluştur

**Merchant** → ürünleri Google ekosistemine dağıt

**Instagram/TikTok/YouTube** → yeni talep ve marka arzusu yarat

**Remarketing** → kaçan müşteriyi geri getir

**B2B** → büyük sipariş getir

**İhracat** → döviz bazlı büyüme

**CRM** → aynı müşteriden tekrar gelir

Bu sırada **ilk iş sosyal medya değil**. Önce web + Google + ölçüm altyapısı. Çünkü bunlar düzgün değilken sosyal medya ve reklama verilen her ek trafik kısmen boşa gider.

---

**2026-08-20 — Ölçüm sistemi (madde 1) denetimi:**

- Faprika panelinde 3 ayrı hazır modül var: `/admin/analytics/` (eski Universal Analytics), `/admin/googleanalytics/` (GA4), `/admin/adwords/` (Google Ads).
- **Universal Analytics:** `UA-84300680-1`, Enabled=kapalı. Zaten önemsiz — Google UA'yı 2023-2024'te tamamen kapattı, veri toplamıyor.
- **GA4 paneli:** "İzleme Kimliği" alanına yanlışlıkla GTM container ID'si (`GTM-KGB4VN8`) girilmiş — gerçek bir GA4 Measurement ID (`G-XXXXXXXXXX`) yok. Enabled=açık ama ID geçersiz olduğu için çalışmıyor.
- **Google Ads paneli:** Aynı hata — "AdwordsId"/"AdwordsLabel" alanlarına da GTM ID girilmiş, gerçek AW ID buradan gelmiyor.
- **Canlı sitede gerçekte çalışan:** GTM container (`GTM-KGB4VN8`) yükleniyor, bunun üzerinden Google Ads conversion (`AW-873140307`) ateşleniyor, Meta Pixel (`464903674718973`) çalışıyor. Yani gerçek tracking GTM konteynerinin **içinde** (tagmanager.google.com) kurulu — Faprika panelindeki alanlar kullanılmıyor/çöp veri.
- **Bilinmiyor (GTM içine bakmadan göremem):** GTM içinde GA4 tag'i var mı, hangi conversion event'leri (sepete ekleme/satın alma/WhatsApp tık) tanımlı.
- Search Console doğrulama etiketi sitede bulunamadı.
- **Blocker:** Google hesabına (Tag Manager/Analytics/Ads/Search Console) girmem gerekiyor ama şifre girme kuralım buna izin vermiyor — Faprika'da yaptığımın aksine burada şifre kullanamam. İki seçenek: (1) kendi bilgisayarındaki Chrome'da zaten Google'a giriş yapılıysa, o oturumu kullanarak (şifresiz) devam edebilirim, (2) beni GTM/GA4/Search Console/Ads hesaplarına "kullanıcı" olarak ekleyebilirsin.

**Kullanıcı ekleme yol haritası (2026-08-20):**

Benim kendi Google hesabım yok. Süreç: bir Google hesabı (kendi ikinci hesabın veya yeni açtığın bir hesap) her platforma "kullanıcı" olarak eklenir → o hesaba kendi gerçek Chrome'unda SEN bir kez giriş yaparsın (şifreyi ben görmem/girmem) → sonra ben o oturumu (Claude in Chrome) kullanarak işlemleri yaparım.

1. **Search Console** — search.google.com/search-console → Ayarlar → Kullanıcılar ve izinler → Kullanıcı ekle → e-posta + "Tam" yetki
2. **Google Analytics (GA4)** — analytics.google.com → Yönetici (sol alt dişli) → Mülk erişim yönetimi → + → Kullanıcı ekle → e-posta + "Düzenleyici" rolü
3. **Google Tag Manager** — tagmanager.google.com → GTM-KGB4VN8 container → Yönetici → Kullanıcı Yönetimi → + → e-posta + "Yayınlama" izni
4. **Google Ads** — ads.google.com → Araçlar (İngiliz anahtarı ikonu) → Kurulum → Erişim ve güvenlik → + → e-posta + "Yönetici" erişimi
5. **Google Merchant Center** (madde 2 için önceden hazırlık) — merchants.google.com → Ayarlar (dişli) → Hesap erişimi → Kullanıcı ekle → e-posta + "Yönetici" erişimi

Hepsi eklendikten sonra: o hesapla Claude in Chrome'da bir kez giriş yap, haber ver, devam edeyim.

**2026-08-20 — Sosyal medya bar: telefon + YouTube eklendi:**

- Script id=70 ("YENİ SOSYAL MEDYA İKONLARI SK"): en üste Telefon butonu eklendi (beyaz zemin/siyah ikon, `tel:+902122103391`), YouTube linki dolduruldu (kanal: UCq4weesoulSlqeuOrzTD8dA), en altta kırmızı zemin/beyaz ikon.
- **Yan bulgu:** Script id=60 ("YENİ CSS SK", ana tema) içinde eski/leftover bir kural vardı — sosyal rail butonlarını POZİSYONA göre (nth-child 1/2/3) `!important` ile renklendiriyordu. Telefon ilk sıraya gelince bu eski kural onu yanlışlıkla yeşil (WhatsApp rengi) yapıyordu. O bloğu id=60'tan temizledim, renkler artık sadece id=70'in class bazlı kurallarıyla yönetiliyor. Canlıda doğrulandı, tüm butonlar doğru renkte.

**2026-08-20 — Ölçüm altyapısı ÇÖZÜLDÜ (madde 1 büyük ölçüde tamam):**

Gerçek teşhis (ilk sanılandan farklı çıktı): Google Ads Dönüşüm ID/Etiket aramak **gereksizmiş**. Ads dönüşümleri zaten GTM konteyneri içinden `AW-873140307` ile çalışıyordu (hesapta 29 satın alma kayıtlı). Asıl sorunlar başkaydı:

1. **GTM iki kez yükleniyordu.** Sebep: GA4 panelinin "İzleme Kodu" şablonuna GA4 gtag kodu yerine GTM snippet'i yapıştırılmış. Panel `GoogleId` alanını hiç kullanmıyordu → bu yüzden `G-2NG845Z493` girmek tek başına hiçbir işe yaramadı.
2. **GA4 hiç veri toplamıyordu.** Aynı sebep.
3. **Her sayfada JS hatası vardı.** Adwords paneli bozuk remarketing kodu basıyordu: `var google_conversion_id = GTM-KGB4VN8;` (tırnaksız → `ReferenceError: GTM is not defined`). `conversion.js` boşuna yükleniyordu.

Yapılanlar:
- **Adwords paneli kapatıldı** (Enabled=false). İçindeki "Dönüşüm Kodu" zaten sadece GTM snippet'iydi, GTM site geneli zaten yükleniyor — kayıp yok. Bozuk remarketing kodu ve JS hatası gitti. Ads dönüşümleri GTM'den çalışmaya devam ediyor.
- **GA4 panelinin İzleme Kodu şablonu düzeltildi**: GTM snippet'i yerine gerçek gtag şablonu (`{GOOGLEID}` placeholder'ı ile). `{CUSTOMER_TRACKING}` ve `{ECOMMERCE_TRACKING}` korundu ama `try { ... } catch(e) {}` içine alındı — çünkü `{ECOMMERCE_TRACKING}` anasayfada değişmeden kalıp hata veriyordu (kategori/sepet/ürün sayfalarında düzgün doluyor).

Canlıda doğrulanan sonuç:
- GTM 2 kez değil **1 kez** yükleniyor
- GA4 `G-2NG845Z493` çalışıyor: `config` + `user_id` + `view_item_list` (items array, item_id/name/price ile) gönderiyor — yani e-ticaret takibi aktif
- `AW-873140307` Ads dönüşümü hâlâ çalışıyor
- Anasayfada konsol hatası **0** (önceden 2)

Ek temizlik (2026-08-20): Adwords panelindeki ölü `GTM-KGB4VN8` değerleri (Dönüşüm Kimliği + Etiketi) silindi, Criteo `00000` silindi — panel ileride yanlışlıkla açılırsa çöp veri basmasın diye. Eski tip remarketing (`pagead/conversion.js`) canlıdan tamamen kalktı; güncel remarketing zaten GTM içindeki `AW-873140307` gtag'i üzerinden çalışıyor. UA paneli kapalı ve atıl, dokunulmadı.

Kalan / sonraki adımlar:
- Sipariş tamamlandı sayfası gerçek bir siparişle test edilmeli (purchase event'i GA4'e düşüyor mu)
- Search Console doğrulaması hâlâ yok
- GTM içine erişim gerekiyor: WhatsApp tıklama, telefon tıklama, teklif formu gibi mikro dönüşümler oradan kurulacak
- Universal Analytics (`UA-84300680-1`) kapalı, Google onu tamamen kapattı — dokunmaya gerek yok
- Criteo paneli `00000` placeholder ama kapalı, zararsız

**2026-08-20 — Reklam öncesi site + panel denetimi:**

Search Console zaten kurulu (domain/DNS doğrulaması ile — meta etiket yok, bu yüzden önce yanlışlıkla "eksik" demiştim). 3 ayda 3.471 organik tıklama, trend yukarı. Merchant Center bloklu değil.

Reklam öncesi düzeltilmesi gerekenler (kanıtlı):

**A. Merchant Center / Shopping'i bloklayanlar**
1. **Ürün adlarında keyword stuffing** — `/masa-ustu-gerecleri/` kategorisinde 96 üründen **18'i (%19)** pipe ile ayrılmış 8-9 anahtar kelime içeriyor, 169 karaktere kadar. Örn: "Kahverengi Deri Magazinlik | Deri Magazinlik | Dosya Organizer | Dosya Kutusu | Dosya Saklama | Dergi Arşiv Klasörü | Deri Dosyalık | Deri Aksesuar | Deri Ofis Aksesuarı". Merchant Center politika ihlali → ürün reddi. İngilizce sitede de aynı sorun var.
2. **Ürün sayfalarında JSON-LD yok** — `application/ld+json` script sayısı 0. Product/Offer/AggregateRating şeması hiç yok. Google fiyat/stok doğrulayamıyor.
3. **Stok miktarı tüm ürünlerde 0** (783 ürün) — stok takibi kapalı görünüyor. Merchant Center'da her şey "stokta" görünecek.

**B. Reklam parasını yakan dönüşüm sorunları**
4. **One-page checkout KAPALI** (`OnePageCheckoutEnabled: false`) — çok adımlı ödeme, sepet terk oranını artırır. Üyeliksiz alışveriş açık (iyi).
5. **Ürün sayfasında hiç güven unsuru yok** — 12.500 TL'lik üründe garanti/iade/güvenli ödeme/"1995'ten beri üretici" hiçbiri yok. (Plan madde 15 tam bunu söylüyordu.)
6. **Ürün yorumları boş** — Google'da 5 yıldızlı gerçek yorumlar var ama ürün sayfasında sosyal kanıt yok.
7. **Stok durumu gösterilmiyor** — sadece "Stok Kodu GNR102" yazıyor, "stokta var" sinyali yok.
8. **Mobilde Sepete Ekle 762px'de** — isimlik simülatörünün altında kalıyor, ilk ekranda zor görülüyor. Reklam trafiğinin çoğu mobil olacak.

**C. Veri tutarsızlığı**
9. Aynı üründe 3 farklı parça sayısı: URL `hakiki-deri-sumen-takimi-8-parca`, başlık "7 Parça", açıklama "17 parçadan oluşan".
10. Katalogda "- kopya" ekli duplike ürünler var.

**D. Ads hesabı**
11. Çok fazla **birincil** dönüşüm tanımlı (Sayfa görüntüleme, Etkileşim, İndirme, Sepete ekleme). Akıllı teklif ucuz/değersiz dönüşümlere optimize eder. Sadece "Satın alma" birincil olmalı.
12. Hesapta zaten 23 kampanya var — yenisini açmadan önce hangileri aktif/harcıyor kontrol edilmeli.

**İyi durumda olanlar:** Üyeliksiz alışveriş açık, canlı isimlik önizleme simülatörü (güçlü fark yaratıcı, reklamda kullanılmalı), kargo süresi belirtilmiş, sayfa hızı makul (567KB / DCL 1.37s), mobilde yatay taşma yok.

**2026-08-20 — Reklam öncesi 2 kritik düzeltme yapıldı:**

**İş 2 — Product schema (JSON-LD):** Tüm ürün sayfalarına tek scriptle (Script Yönetimi, "Ürün Schema (JSON-LD)", Ürün sayfa tipi, TR) Product+Offer JSON-LD eklendi. Sayfadaki `view_item` verisinden ad/SKU/fiyat/marka/görsel okuyup üretiyor. 2 üründe canlı doğrulandı (geçerli JSON). Not: şu an sadece TR; EN/AR için ayrı script gerekir.

**İş 1 — Keyword stuffing temizliği:** 783 üründen 94'ü isimde 2+ pipe ile 8-9 anahtar kelime içeriyordu. 93'ü temizlendi (yedek: [urun-isim-yedek.md]). Yöntem: gizli iframe'de edit sayfası açılıp canlı form FormData ile aynen alınıp sadece `Name` değiştirilerek POST edildi — fiyat/SKU/açıklama/EN-AR isim/SeName dahil diğer 160 alan bozulmadı (test + 8 örnek + tam katalog taramasıyla doğrulandı, 0 hata). Renkler: ön ekte yoksa son segmentten, o da yoksa SKU'dan kurtarıldı. Kalan tek stuffed = **914** (346'nın "- kopya"sı, aynı GTIN → SİLİNMELİ, bilerek atlandı).

Kalan pre-existing sorunlar (kullanıcı kararı):
- 914 silinmeli.
- "3'lü/Deri Masa Sümeni" grubunda birkaç ürün aynı renk+isme sahip (GNR 303/304/305 seri farkı isimde yok) — beden/seri farkı varsa eklenmeli.
- Ürün adlarındaki EN/AR (İngilizce/Arapça) isimler hâlâ stuffed — İngilizce site işiyle birlikte yapılacak.
- Aynı üründe parça sayısı çelişkisi (URL 8-parca / başlık 7 Parça / açıklama 17 parça — Stok Kodu GNR102) düzeltilmedi.

## Notlar / İlerleme Günlüğü

**2026-08-20 — Site incelemesi (5, 6, 7. madde bulguları):**

- Platform: **Faprika** (faprika.com) e-ticaret altyapısı. Tüm düzeltmeler admin panelden yapılır.
- **Madde 5 — Adres:** Doğru adres `Örnektepe Mah. Onur Sok. No:8 Beyoğlu/İstanbul` (TR site + Bize Ulaşın sayfasında zaten doğru). Yanlış adres `Örnektepe Mah. Etibank Cad. No:39/7` sadece **`/en/` sayfasının footer'ında** görünüyor. Panelde: Dil Yönetimi → İngilizce → Footer/İletişim Bilgileri alanı, TR ile aynı adrese güncellenecek.
- **Madde 6 — `/` → `/en/` yönlendirme:** Test tarayıcısında TR ana sayfa doğru açıldı (otomatik yönlendirme oluşmadı) — sorun tarayıcı diline/konuma bağlı koşullu tetikleniyor. Panelde: Ayarlar → Dil Ayarları/Çoklu Dil bölümünde "tarayıcı diline göre otomatik yönlendir" seçeneği kapatılacak, varsayılan dil TR'ye sabitlenecek.
- **Madde 7 — "Wholesale Women Clothing":** Kategori değil, **footer sütun başlığı** (müşteri hizmetleri linkleri bloğunun EN başlığı) yanlış çevrilmiş/kalmış. `/en/` anasayfa footer, "About Us / Privacy Agreement / ..." linklerinin üstündeki `<h5>` başlığı. Panelde: Dil Yönetimi → Metin Çevirileri (EN) → ilgili footer blok başlığı "Customer Service" gibi doğru metinle değiştirilecek.
- **Blocker:** Faprika admin panel erişimim yok, bu 3 maddeyi ben doğrudan uygulayamam. Kullanıcı ya panel erişimi verecek ya da adımları kendisi uygulayacak.

**2026-08-20 — Panel erişimiyle uygulanan düzeltmeler:**

- **Madde 5 — TAMAMLANDI:** Admin → Mağaza Yönetimi → Mağaza Düzenle → İngilizce sekmesi → Mağaza Adresi alanı `Etibank Cad. No:39/7` → `Onur Sok. No:8` olarak güncellendi, kaydedildi. Canlıda `/en/` sayfasında doğrulandı.
- **Madde 7 — Muhtemelen kendiliğinden düzeldi:** İlk kontrolde footer başlığı "Wholesale Women Clothing" idi. Panelde (Dil Kaynakları, Kategoriler, Markalar, Script Yönetimi) kaynağı aranıp bulunamadı — hiçbir yerde kayıtlı değil. Madde 5 kaydından sonra 3 ayrı taze (no-cache, cf-cache-status: DYNAMIC) istekte başlık doğru şekilde "CUSTOMER SERVICES" görünüyor. Muhtemelen platform tarafı geçici bir önbellek/render sorunuydu, mağaza ayarları kaydı tetikleyip düzeltmiş olabilir. **Kullanıcı tarayıcıda hard refresh ile doğrulamalı**, tekrar ederse Faprika desteğine bildirilmeli.
- **Madde 6 — Çözülemedi, netleştirme gerekiyor:** Mağaza Ayarları'nda "Varsayılan Dil" zaten Türkçe, otomatik dil yönlendirme diye bir toggle panelde yok. Test taramalarında `/` hep doğru TR açıldı, sorun tekrar üretilemedi. Muhtemelen kullanıcının/ziyaretçinin tarayıcı diline bağlı bir davranış — bug değil, kullanıcı testinde hangi cihaz/tarayıcı/dil ayarıyla karşılaştığı netleşmeden çözülemez.
