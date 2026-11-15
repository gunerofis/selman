# Oyun tasarımı ve denge · v1

## 1. Oyuncunun ilk beş dakikası

1. Hub’da kahraman ve Akboynuz görünür. Oyuncu Sefer’e dokunur. Harita ilk durak olan Köy / 1-1 üzerinde açılır.
2. Tek haydutla karşılaşır. Kahraman yakına girer ve kendiliğinden vurur. Haydut ağır vuruşa hazırlanırken oyuncu Savun’a basmayı öğrenir.
3. Galibiyette 60 altın, 20 XP ve Köy Kılıcı kazanır. Sonuçtan Ekipman’a geçer. Hançer ve kılıç yan yana görünür. Kılıcı kuşanınca saldırı 12’den 15’e çıkar.
4. İkinci durakta iki düşman aynı anda saldırır. Oyuncu baskıncıya dokunursa asıl vuruşu ona yöneltir. Yanındaki haydut da süpürme hasarı alır.
5. Demirci’de kılıcını +1 yapabilir. Üçüncü durakta Köprü Haracı ile düello yapar. İki ağır darbeyi doğru zamanda karşılayarak temel kılıçla da kazanabilir.

Görsel referanstaki yüksek seviye, kaynak ve güç değerleri örnek hesaba aittir. Yeni oyuncunun gerçek değerleri aşağıdaki ekonomi tablosundan gelir.

İlk teslim bu üç durağı, tekrar oynamayı, Çanta → Ekipman dönüşünü ve Demirci’de ilk yükseltmeyi kapsar. Sonraki modların üretim sırası aşağıdadır.

## 2. Savaşın hissi ve oyuncunun iki kararı

| Karar | Oyuncu ne görür ve ne yapar? | Oyunun tepkisi |
|---|---|---|
| Kime vurayım? | Grup karşısında düşmana dokunur. Seçilenin ayak altında kesintisiz hedef halkası görünür. | Sonraki vuruş seçili düşmana tam, diğer canlı düşmanların her birine yarım hasar verir. İlk hedef kadrodaki ilk canlı düşmandır. Hedef ölünce aynı kuralla yenisi seçilir. |
| Ne zaman savunayım? | Düşman silahını kaldırır. Ağır vuruştan 0,90 saniye önce kendi üzerinde çentikli uyarı belirir. Oyuncu Savun’a dokunur. | Savunma anında başlar, 0,65 saniye açık kalır. Bu sırada gelen her darbe normal hasarının %25’ini verir. Yeniden kullanım, basıştan 4 saniye sonradır. |

- Savaş tek sabit alanda geçer. Yaklaşma otomatiktir. Bütün grup başlangıçtan itibaren sahnededir. Güç farkını silah, darbe tepkisi, can çubuğu ve sonuç süresi gösterir.
- İlk oyuncu vuruşu 1. saniyede, sonrakiler her 1 saniyede bir gelir. Hedef değiştirme ve savunma bu ritmi kesmez. İlk üç durakta kritik, rastgele ıskalama ve pet hasarı yoktur. Akboynuz oyuncuya görsel olarak eşlik eder.
- Hasar, vuruş anında bir kez hesaplanır. Ondalıklı hasar aşağı yuvarlanır. Hasar veren vuruşun alt sınırı 1’dir. Saldırı, düşmanın canından fazla vurursa artık hasar diğer hedefe taşınmaz.
- Normal hızda üst sınır 30 saniyedir. Son düşman düşünce anında galibiyet, kahraman düşünce yenilgi gelir. Süre dolduğunda düşman yaşıyorsa durak geçilemez. Aynı anda gerçekleşen olayların sırası oyuncu vuruşu → hayatta kalan düşmanların vuruşları → süre kontrolüdür. Savunma aralığı başlangıç anını içerir, bitiş anını dışarıda bırakır.
- Her deneme tam can ve hazır savunma ile başlar. Oyunu arka plana almak savaş saatini durdurur. Oyuncu yenilgi ekranından aynı donanımla yeniden deneyebilir veya Ekipman’a dönebilir.
- Dokunmatik ekranda düşman gövdesi ve altındaki hedef etiketi aynı seçim alanıdır. Fareyle tıklama aynı işi yapar. Klavyede 1–3 hedef seçer, boşluk savunur. İlk ağır vuruş uyarısında tek satır yardım görünür. Hub’a görev veya hedef paneli eklenmez.

## 3. Köy karşılaşmaları

| Durak | Düşman ve öğrettiği karar | İlk geçiş | Hesaplanmış sonuç |
|---|---|---|---|
| 1-1 · Köy girişi | 180 canlık haydut. Savunmayı güvenle deneme. | 60 altın, 20 XP, Köy Kılıcı | Hançer ve savunmasız oyunla 15 saniye, 60 can kalır. |
| 1-2 · Baskın | 150’şer canlı haydut ve baskıncı. İkisi aynı anda başlar. | 80 altın, 30 XP | Temel kılıç ve savunmasız oyunla 16 saniye. Haydut önce seçilirse 36, baskıncı önce seçilirse 47 can kalır. |
| 1-3 · Köprü | 340 canlık Köprü Haracı. Omuz kaldırma hareketi ağır darbenin habercisidir. | 120 altın, 50 XP | Temel kılıçla savunmasız oyuncu 17. saniyede düşer. 4,80 ve 10,80’de savunursa 23 saniyede 16 canla kazanır. +1 kılıçla aynı girişler 20 saniyede 28 can bırakır. |

Her düşmanın vuruş saniyeleri ve değerleri **Baslangic_Dengesi.json** dosyasındadır. Tablodaki sonuçlar bu değerlerle hesaplandı. İlk oynanış testinde ayrıca uyarının fark edilmesi, doğru düşmanın seçilebilmesi ve ekipman değişiminin anlaşılması ölçülür.

## 4. İlk ekonomi

| İşlem | Kural |
|---|---|
| Başlangıç | Seviye 1, 100 can, 10 taban saldırı, takılı hançer +2 saldırı. Altın ve XP sıfır. İlk üç durakta giriş ücretsiz. |
| Silah değiştirme | Aynı anda tek silah takılır. Hançer +2, Köy Kılıcı +5 saldırı verir. Eski silah Çanta’da kalır. |
| İlk yükseltme | Köy Kılıcı +0 → +1 için 60 altın. Başarı kesin. Silah bonusu +5 → +7. Toplam saldırı 15 → 17. |
| Tekrar | Geçilmiş bir durak her galibiyette 15 altın, 5 XP verir. İlk geçiş ödülü ve kılıç bir kez verilir. Yenilgi, süre aşımı ve savaştan çıkış sıfır ödül verir. |
| Seviye | Toplam 100 XP’de seviye 2. İlk pakette seviye bir ilerleme göstergesidir. Savaş istatistikleri yalnızca kuşanım ve yükseltmeyle değişir. |
| Güç göstergesi | Başlangıç paketinde güç = azami can + 10 × toplam saldırı. Hançer 220, kılıç 250, kılıç +1 270. Savaş hesabı doğrudan can ve saldırıyı okur. |
| Üç durak sonu | Tekrar yapmadan 260 altın ve 100 XP kazanılır. Bir yükseltmeden sonra bakiye 200 altındır. Seviye 2 ve Köy 1-3 tamamlandı görünür. |

## 5. Oyun modları ve ödül dağılımı

Aşağıdaki değerler üç duraktan sonraki sürüm için başlangıç ayarlarıdır. Geliştirme sırası Sefer → Av ve Bölge Bossu → Arena → günlük ve lonca içerikleridir.

| Mod | Karşılaşma ve bitiş | Giriş ve ödül |
|---|---|---|
| Sefer | Düello, eşzamanlı grup ve adlandırılmış boss durakları. Galibiyet yolu açar. | İlk üç durakta yukarıdaki tablo uygulanır. Sonraki bölgeler için ödül önizlemesinde ilk geçiş ve tekrar ayrı görünür. |
| Av | Açılmış bölgede 3 hedef birlikte gelir. 30 saniyede düşen hedef sayısı ganimeti belirler. | 2 enerji. Düşen hedef başına 5 altın ve 1 cevher. Üçü de düşerse 1 ek cevher. Savaşı elle terk etmek sıfır ödül verir. |
| Bölge Bossu | Sefer’de tanınan boss ile tekrar düello. Ödül yalnız galibiyette. | Köy 1-3 sonrasında Köprü Haracı açılır. Deneme ücretsiz. Boss başına günün ilk galibiyeti 3 kalıntı parçası, sonraki galibiyetler 10 altın. |
| Günlük Boss | Günün sabit hedefi. 30 saniye veya oyuncunun düşmesi denemeyi bitirir. | Günde 1 ödüllü giriş. Boss azami canının %25 / %50 / %100’ü kadar hasarda sırasıyla 1 / 2 / 4 kristal. Ulaşılan en yüksek kademe ödenir. |
| Dünya Bossu | 30 saniyede verilen hasar kaydedilir. Günün en iyi tek denemesi sıralamaya girer. | Günde 3 hak. Her tamamlanmış denemede en az bir hasar verilirse 1 kalıntı parçası. Sıralama ödülü ayrı dönem sonunda verilir. |
| Arena | 1v1. İki taraf da ayaktaysa 30. saniyede kalan can yüzdesi yüksek olan kazanır. Eşitlikte beraberlik. | İlk sürümde açıkça etiketlenen antrenman rakibi. Dereceli sürüm için öneri: galibiyet +12, yenilgi −8, beraberlik 0 puan; puan alt sınırı 0. İlk 3 günlük galibiyetin her biri 2 arena jetonu. |
| Lonca Bossu | Her üyenin tek denemedeki hasarı ortak boss canından düşer. | Üye başına günde 1 hak. Hasar veren üyeye 2 lonca jetonu; boss tamamlanınca katılımcı başına bir kez 3 jeton. |
| Lonca Savaşı | Üye eşleşmeleri 1v1. Düello sonucu lonca skoruna işlenir. | Üye başına turda 1 düello. Galibiyet 2, beraberlik 1, yenilgi 0 takım puanı. Tur sonu galibine 3, beraberlikte her katılımcıya 2, yenilene 1 lonca jetonu. |

Önerilen enerji ayarı 20 azami enerji ve 10 dakikada 1 yenilenmedir. Enerji yalnız Av girişinde düşer. Günlük haklar Türkiye saatiyle 00.00’da yenilenir. Ücretli giriş veya günlük hak, savaş başlatılırken bir kez düşer. Kayıtlı savaşın yeniden açılması aynı denemeyi sürdürür. Gerçek oyunculu sıralama, dereceli Arena ve lonca sonuçları ortak kayıt hizmetiyle açılır.

## 6. Karakter gelişimi ve yan sistemler

| Sistem | Oyuncunun kararı | İlk genişleme için denge |
|---|---|---|
| Ekipman ve Demirci | Bir yuvaya bir eşya. Önceki ve sonraki stat yan yana görünür. | İlk kılıç yükseltmesi yukarıdaki gibi. Sonraki +2 adımı 100 altın + 4 cevher, +2 saldırı. Bu malzeme bir tam Av ile kazanılır. |
| Pet | Bir yoldaş seçilir. | İlk üç durak sonrası, ilk yardımcı yetenek örneği: Akboynuz savaşta bir kez, oyuncu bir darbeden sağ çıkıp %40 can veya altına inince 10 can yeniler. |
| Kanat | Bir çift kuşanılır. | İlk kanat +5 azami can. Kanat önizlemesi sırt bağlantısında görünür. |
| Kalıntı | Parça biriktirilir, kalıcı özellik açılır. | İlk kalıntı 6 parça ve +3 azami can. İlk bölge bossunun iki günlük ödülü yeter. |
| Tılsım | Bir savaş etkisi seçilir. | Örnek ilk tılsım, savaşta ilk başarılı ağır darbe savunmasında 4 can yeniler. |
| Unvan | Kazanılan unvanlardan biri gösterilir. | İlk unvan Köy 1-3’ten sonra açılır. Genişleme sürümünde seçili ilk unvan +2 azami can verir. |
| Aura | Bir aura etkinleştirilir; önizleme gösterilir. | İlk aura +1 saldırı. Savaş uyarıları aura efektinin üzerinde çizilir. |
| Profil / Koleksiyon | Görülen ve sahip olunan kayıtlar ayrı izlenir. | İlk görülme savaşta, sahip olma ödül işleminde kaydedilir. Aynı eşyanın kopyaları koleksiyon sayısını artırmaz. |
| Market | Sandık içeriği ve bedeli satın almadan önce görünür. | Örnek sabit teklif 30 altın → 1 cevher. Arena ve lonca jetonları yalnız kendi mağazalarında harcanır. |
| Etkinlik / Sıralama | Etkinlik yeni bir amaç verir. Sıralama aynı kategoride oyuncuları karşılaştırır. | İlk örnek etkinlik 3 tam Av → 1 sandık, bir kez. Aynı hasar veya güç değerinde aynı derece gösterilir. |

Ek bonuslar önce sabit değer olarak toplanır. Bir yuvadan çıkarılan eşyanın bonusu bir kez silinir. İlk bölümün referans testleri yeni kayıtla çalışır. Sonraki bölgenin can ve hasarı, oyuncunun kuşandığı eşyaya göre gizlice değişmez.

## 7. Kumarhane

Dokuz oyun hub’daki aynı kapıdan açılır. İlk öneri günde 3 ücretsiz oyun fişidir. Tur başına 1 fiş harcanır. Çıkıp girmek fişi geri vermez. Tur sonucu kaydedilir, ödül bir kez alınır.

| Oyun | Turdaki karar veya hareket |
|---|---|
| Slot | Tek çekiş, üç makaranın son çizgisini değerlendir. |
| Çark | Tek çeviriş, durulan dilimin ödülünü al. |
| Kutu | Üç kapalı kutudan birini aç. |
| Yazı-tura | Yüz seç, parayı çevir. |
| Hilo | Açık karttan sonra yüksek veya düşük seç. Eşit kartta aynı turda yeniden çek. |
| Mayın | 3×3 tabloda iki mayından kaçın. Bir güvenli hücreden sonra ödülü alabilir, üçte turu tamamlayabilirsin. |
| Yarış | Dört koşucudan birini seç. Bitiş sırası kazananı belirler. |
| Kazı-kazan | Maskeyi kaldır ve eşleşmeyi açığa çıkar. |
| Dart | Hareketli nişangâhı durdur. Ödülü vurulan halka belirler. |

İlk prototip ödemesi için örnek: yazı-turada sabit %50 kazanma ve galibiyette 10 altın eşdeğeri; tur başına beklenen değer 5. Diğer sekiz oyunun ödül tabloları üretime alınırken aynı fiş için ortalama 4–6 altın eşdeğeri hedeflenir. Sandık, ekipman ve pet yumurtası özel ödül havuzuna konabilir. Bu havuzların oran ve karşılıkları tanımlandığında oyuncuya oyun ekranında gösterilir. Sefer’in ilk kılıcı ve ilk yükseltmesi doğrudan Sefer gelirinden karşılanır.

## 8. Dengeyi nasıl değiştireceğiz?

- İlk 5 yeni oyuncuda yalnız ilk oturumu gözle. Her durakta süre, seçilen ilk hedef, ağır vuruş sayısı, savunulan ağır vuruş, sonuç ve kalan can kaydedilsin.
- İlk hedefler: en az 4 kişi yardımsız 1-1’i geçsin; en az 4 kişi sonuç ekranından kılıcı kuşanabilsin; en az 3 kişi en geç üçüncü denemede boss’u geçsin. Bunlar ilk kullanım hedefleridir.
- Oyuncu ağır darbeyi görmüyorsa önce pozu ve işareti düzelt. Görüp sürekli erken basıyorsa uyarı veya savunma süresini tek tek dene. Hedefi okuyup doğru savunduğu halde süre yetmiyorsa boss canını incele.
- Her ayarda bir değişkeni değiştir. Yeni sayı tablosunu, referans sonuçları ve QA beklentilerini aynı sürümde güncelle.
