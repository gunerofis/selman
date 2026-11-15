# Hub buton haritası

## Güncel durum — 13.11.2026

Alt bölümlerde önceki referans/öneri geçmişi vardır. Güncel kod ve kararlar: Notlar/Is_Listesi.md → Ekran temizliği. Market: Sandıklar / Mağaza / Arena / Lonca; Takas yok. Demirci: Geliştirme / Birleştirme / Taş / Kademe / Ayrıştırma. Çanta: Tümü / Ekipman / Taş / Malzeme / Sandık. Koleksiyonlar: Pet / Kanat / Tılsım / Kalıntı / Unvan / Aura.

Aynı ekipman türü Demirci ve Ekipman’da aynı simge kaynağını kullanır. Arena/Lonca: Tümü / Ekipman / Malzeme / Özel filtreleri çalışır. Lonca: gerçek yerel üye, bağış, günlük/haftalık görevler ve mevcut savaş geçişleri bağlıdır. Petlerin 8 büyük önizlemesi tamamlandı.

## Profil — uygulanan ekran, 12.11.2026

- Kullanıcının profil referansı uygulandı: solda Bilgiler, Başarılar, Görünüm, İstatistikler; ortada kahraman ve yoldaş; sağda canlı oyuncu bilgileri. Kaynak: `Oyun/kod/profil.js` ve `profil.css`.
- Koleksiyon, Bilgiler → Hesap ve İlerleme veya Görünüm → Koleksiyon üzerinden açılır. Görünümdeki seçimler ilgili mevcut oyun alanına gider. Kalem düğmesi kahraman adını aynı kayda yazar.
- Seviye, EXP, güç, can, saldırı, savunma oranı, saldırı hızı, bölüm, zafer ve koleksiyon mevcut oyun verisinden gelir. Görseldeki örnek sayılar, sunucu, sezon ve kale seviyesi eklenmedi.
- Başarılar: ilk zafer, ilk güçlendirme, Köy çıkışı ve 17 bölge tamamlama koşulu. Kilitli rozet koşulu açılır; ödül veya denge değişikliği yapılmadı.
- Referans: `Oyun/gorsel/arayuz/profil_referans.png`. Yazısız sahne: `profil_sahne.png`; dahili imagegen ile yalnız arayüz kaldırıldı, karakterler ve kadraj korundu.
- 12.11.2026 Vite düzeltmesi: sahne ayrı dosya olarak yüklenir; bilgiler/başarı/ilerleme panelleri ekran yüksekliğine uyar, dikey telefonda kaynak şeridi başlığa taşmaz. Dört sekme Codex tarayıcısında denendi. Görsel kontrol: 1280×720, 1280×618, 844×390, 667×375, 390×844. Derleme ve işlev testleri geçti; tarayıcı konsol hatası yok. İş Merkezi 4196 servisi kapalı olduğu için ortak kayıt güncellenemedi.

## Ana ekran görünümü — 11.11.2026

- Butonlar: referanstaki boyalı altın kenarlar ve Av/Sefer/Boss/Arena armaları mevcut referanstan çalışma anında alınır. Üst şerit: portre, seviye, güç, EXP; kaynaklar, bölüm ve üç araç.
- Kaynak: Oyun/kod/hub.js ve hub.css. Sayılar gerçek kayıt verisidir. VIP sistemi olmadığı için sahte VIP değeri eklenmedi; portre şeridi Geçitler olarak kullanılır.
- Kontrol: 27 giriş ve geri dönüş tarayıcıda çalıştı; 667×375, 844×390, 1280×720 ve 390×844 kontrol edildi. Büyük sayılar, enerji güncellemesi ve konsol kontrolü geçti. Oyun işlev testleri geçti.
- Etkileşim: basma/klavye odağı altın çerçevede görünür. Hazır etkinlik ödülü bildirim zilini de yakar; alınmış ödül işareti kapanır. Hareket ayarı ve sistemin azaltılmış hareket tercihi izlenir.
- Savaş: bu dört karakterde aynı çizimler; Arena/Köprü Haracı mevcut boyalı sahneleri kullanır. Can etiketleri gövdenin üstündedir.
- Sapma: mevcut temiz merkez sahnesi ekrana yayıldığı için kahraman referanstan daha büyük görünür. Referans kadrajında tam genişlikte temiz ana sahne asseti bekliyor. Fiziksel telefon testi yapılmadı.
- İki ayrı 6.1 Sol / yüksek sohbet: asset üretimi ve web araştırması. Çıktılar Asset_Uretim_Notu.md ve Mekanik_Arastirma.md içinde. Dört karakter önizleme ve savaşa bağlandı; araştırma önerileri uygulanmadı.
- İş: 01a5f472d0a047b1a80f489543df9ca1.

## Görsel dil — 11.11.2026

- Durum: 27 hub girişi için 24 ana ekran ve 2 Market görünümü, 7 panoda hazır. Bölüm göstergesi Sefer ile aynı ekrana gider.
- Kullanıcı görsel dili onayladı. 24 ekranın arayüzü uygulandı; mevcut işlemler canlı oyun verisine bağlı.
- Yatay telefon: panolarda 16:9 ekranlar; uygulamada 20:9 için sahne genişler, temel kontroller güvenli alanda kalır. Dokunma hedefi en az 44 mantıksal piksel; 667×375 ve 844×390 tarayıcı kontrolünde ana eylemler taşmıyor. Fiziksel telefon testi yapılmadı.
- Ortak dil: boyalı fantastik dünya, koyu taş, eskitilmiş altın, kırmızı mine, fildişi. Mevcut kahraman ve boynuzlu beyaz yoldaş korunur.
- Ortak kontroller: sol üst geri/başlık, üst kaynaklar, yuvarlak seçim yuvaları, işlev gerekiyorsa sağ altta tek kısa ana eylem.
- Alan kimliği: arayüz sahneye yerleşir; demirci örs, market tezgâh, envanter heybe, unvan sancak, kalıntı mühür kullanır. Uzun metin ve tekrarlanan büyük dikdörtgen paneller kullanılmaz.
- Durumlar: seçili öğe altın halka; kilitli öğe kilit simgesi; tamamlanan öğe onay işareti. Yalnız renge dayanılmaz.
- Sayılar, ödüller ve bazı kontrol/öğe çeşitleri temsili tasarım öğeleridir; mevcut oyun işlevi veya denge kararı değildir.
- Kaynak: mevcut hub referansı, kod/app.js ve kod/venues.js. Dahili imagegen kullanıldı; 01 numaralı pano sonraki üretimlere görsel referans oldu.
- Tasarım kaydı: b461548d3d4a4cc996c6447e2cec0c84. Uygulama: 6af3215f90cc433b957312e92f5f7ee5.
- Kaynak: Oyun/kod/rooms.js ve rooms.css. Çalışan dosya: Oyun/Kivilcim_Koy_Seferi.html.
- Üretim: Asset/Kaynak/Sahne Atlasları içinde 6 sahne atlası (24 ortam) ve 1 şeffaf nesne atlası (12 nesne). Oyun/gorsel/arayuz içinde sıkıştırılmış sürümler ve mevcut paket ikonları.
- Doğrulama: 24 ekran, 51 Sefer, 85 boss, 17 av, 9 mini oyun ve kayıt testleri geçti. Tarayıcıda ödül, eğitim, seçim ve kaynak kısayolları çalıştı; konsol hatası yok.
- Asset ihtiyacı: üç Arena rakibi ve ilk Köy bossu bağlandı; diğer bosslar için ortak stile uygun çizimler gerekli. Oyun_Asset_Listesi.md değiştirilmedi.

### Panolar ve üretim istemlerinin özeti

Her üretimde ortak istem: yatay telefon RPG ekranı, aynı boyalı dünya ve kontroller, az metin, sahneye yerleşen dokunulabilir nesneler. İlk altı pano 2×2, son pano üst-alt iki yatay ekrandır.

| Pano | Kapsam ve sahne |
|---|---|
| [01 Tezgah ve Eşyalar](../Asset/Kaynak/Hub%20Ekranları/01%20Tezgah%20ve%20Eşyalar.png) | Demirci/örs, Ekipman/karakter yuvaları, Market/tezgâh, Çanta/heybe |
| [02 Yoldaş ve Güç](../Asset/Kaynak/Hub%20Ekranları/02%20Yoldaş%20ve%20Güç.png) | Petler/koru, Kanatlar/teras, Tılsımlar/kuyumcu, Auralar/halka bahçesi |
| [03 Mühür ve Kimlik](../Asset/Kaynak/Hub%20Ekranları/03%20Mühür%20ve%20Kimlik.png) | Kalıntılar/mühür, Unvanlar/sancak, Profil/madalyon, Sıralama/kürsü |
| [04 Sefer ve Mücadele](../Asset/Kaynak/Hub%20Ekranları/04%20Sefer%20ve%20Mücadele.png) | Av/kamp, Sefer/harita, Boss/mühürlü kapı, Arena/düello avlusu |
| [05 Merkez ve Kaynaklar](../Asset/Kaynak/Hub%20Ekranları/05%20Merkez%20ve%20Kaynaklar.png) | Lonca/sancak salonu, Kumarhane/oyun masaları, Etkinlikler/görev sancakları, Altın/darphane |
| [06 Yardımcı Ekranlar](../Asset/Kaynak/Hub%20Ekranları/06%20Yardımcı%20Ekranlar.png) | Enerji/pınar, Posta/mektup, Bildirimler/çan kulesi, Ayarlar/mekanik kontroller |
| [07 Market Girişleri](../Asset/Kaynak/Hub%20Ekranları/07%20Market%20Girişleri.png) | Elmas+ → Market/Sandıklar; Kristal+ → Market/Takas |


Referans: Fantastik Türkçe RPG Hub Dünyası. Ekrandaki 27 giriş aşağıda görseldeki sırayla verilmiştir. Alt ekran adları ve işlemler tasarım önerisidir.

## Üst şerit

| Hub butonu | İlk açılan ekran | Sekmeler ve işlemler |
|---|---|---|
| **Profil resmi** | Karakter profili | Özet · İstatistikler · Başarımlar · Koleksiyon · Profil düzenleme. Koleksiyonda ekipman setleri, petler, kanatlar, kalıntılar, tılsımlar, unvanlar, auralar ve karşılaşılan düşmanlar görünür. Bir kayda dokununca ayrıntısı açılır. |
| **Altın +** | Altın / Darphane | Mevcut bakiye; Market ve Demirci geçişleri. Kodda mevcut hedef. |
| **Elmas +** | Market / Sandıklar | Kodda Sandıklar sekmesi seçili açılır. |
| **Kristal +** | Market / Takas | Kodda Takas sekmesi seçili açılır. |
| **Enerji +** | Enerji | Mevcut enerji, yenilenme süresi ve enerji yenileme. |
| **Bölüm göstergesi** | Sefer haritası | Mevcut bölge ve bölüm seçili açılır. Tamamlanan, açık ve kilitli duraklar görünür. |
| **Posta** | Gelen kutusu | Mesajı oku · Ekli ödülü al. |
| **Bildirim zili** | Bildirim merkezi | Yenilikler ve hazır işlemler. Kayda dokununca ilgili ekrana gider. |
| **Ayarlar** | Ayarlar | Ses · Müzik · Grafik · Dil · Hesap · Oyun bilgileri. |

## Sol sütun

| Hub butonu | İlk açılan ekran | Sekmeler ve işlemler |
|---|---|---|
| **Market** | Market | Mağaza · Sandıklar · Fırsatlar · Takas. Ürüne dokununca içerik ve bedel görünür. |
| **Kumarhane** | Oyun seçimi | Slot · Çark · Kutu · Yazı-tura · Hilo · Mayın · Yarış · Kazı-kazan · Dart. Her seçim kendi oyun masasını açar. |
| **Lonca** | Lonca merkezi | Üyeler · Lonca Bossu · Lonca Savaşı · Bağış · Lonca Mağazası. Loncasız oyuncuya önce lonca bulma ve kurma açılır. |
| **Demirci** | Demirci tezgâhı | Yükselt · Birleştir · Taş tak · Rün tak · Parçala · Dönüştür. Önce eşya seçilir, ardından bedel ve sonuç gösterilir. |
| **Etkinlikler** | Etkinlik takvimi | Aktif · Yaklaşan · Tamamlanan. Etkinlik detayında süre, katılım ve ödüller görünür. |
| **Sıralama** | Sıralama tabloları | Karakter gücü · Arena · Boss hasarı · Lonca. Oyuncunun kendi sırası her tabloda gösterilir. |

## Sağ sütun

| Hub butonu | İlk açılan ekran | Sekmeler ve işlemler |
|---|---|---|
| **Ekipman** | Kuşanım ekranı | Takılı parçalar · Uygun eşyalar · Setler. Bir parçayı seç, karşılaştır, kuşan veya çıkar. |
| **Petler** | Petler | Pet seç · Yanına al · Geliştir · Evrim · Yumurta aç. Aktif pet hub’da yoldaş olarak görünür. |
| **Kanatlar** | Kanatlar | Kanat seç · Kuşan · Geliştir · Evrim. Önizleme karakterin sırtında görünür. |
| **Kalıntılar** | Kalıntılar | Kalıntı seç · Kalıcı bonusu incele · Etkinleştir · Geliştir. |
| **Tılsımlar** | Tılsımlar | Tılsım seç · Savaş etkisini incele · Yuvaya tak · Geliştir. |
| **Unvanlar** | Unvanlar | Açılma koşulları · Kazanılan unvanlar · Gösterilecek unvanı seç. |
| **Auralar** | Auralar | Aura seç · Karakter üzerinde önizle · Bonusu incele · Etkinleştir. |

## Alt sıra · soldan sağa

| Hub butonu | İlk açılan ekran | Sekmeler ve işlemler |
|---|---|---|
| **Av** | Av bölgeleri | Bölge seç → Yaratık grubu ve ödülleri gör → Ava gir → Ganimeti al. |
| **Sefer** | Sefer haritası | Mevcut durak → Karşılaşma önizlemesi → Savaş → Sonuç → Sonraki durak. Merkezdeki büyük buton. |
| **Boss** | Boss seçimi | Bölge Bossları · Dünya Bossu · Günlük Boss. Hedefi seç → Hak ve ödülleri gör → Savaşa gir. Lonca Bossu, Lonca’dan açılır. |
| **Arena** | Arena merkezi | 1v1 · Dereceli · Sıralama · Ödüller · Arena Mağazası. Savaşta rakip önizlemesi → Düello → Sonuç. |

## Sol alt köşe

| Hub butonu | İlk açılan ekran | Sekmeler ve işlemler |
|---|---|---|
| **Çanta** | Envanter | Tümü · Ekipman · Malzemeler · Sandıklar · Tüketilebilirler · Özel eşyalar. Eşyadan ilgili işleme geçilir. Sandık burada açılır, ekipman kuşanmak için Ekipman’a geçilir. |

## Ekran davranışı

- Seviye, VIP, güç ve EXP profil alanındaki göstergelerdir. Kaynak sayacı ve yanındaki + aynı hedefe gider.
- Bölüm göstergesi ve Sefer aynı haritayı açar. Ana Yol için ayrı bir giriş bulunmaz.
- Hazır ödül işareti mevcut butonun üzerinde görünür. Posta, Bildirimler ve Koleksiyon tek noktadan açılır. Hub’da aktif hedef paneli yoktur.
- Alt ekran kapanınca oyuncu geldiği yere döner. Çanta’dan Ekipman’a girildiyse geri dönüş Çanta’yadır.

## Kullanıcı özeti

Ana ekranın butonları ve üst şeridi referansa göre yenilendi; 27 giriş çalışıyor. 24 alt ekran korunuyor. Dört karakter önizleme ve savaşa bağlandı; 10 kaynaklı mekanik bulgusu not olarak duruyor. Tam kadraj ana sahne ihtiyacı asset notunda.
