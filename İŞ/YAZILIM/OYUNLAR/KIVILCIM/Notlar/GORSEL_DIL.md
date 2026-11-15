# Kıvılcım tasarım dili

## Tasarımı koruma — 13.11.2026

İkon ve buton ortaklaştırması ekranın kabul edilmiş sahnesini, boyalı görsellerini, kompozisyonunu, dokusunu ve süslemelerini değiştirmez. Genel arka plan veya boş dikdörtgen panellerle toplu değiştirme yapılmaz. Bağımsız bileşenlere geçiş aynı görünümü koruyarak alan alan yapılır.

## Ortak buton dili — 13.11.2026

Kullanıcının güncel isteği: içerikten önce bütün buton ve gezinme yollarını ortaklaştır. Bu bölüm butonların önceki farklı stillerinin yerine geçer.

Kaynak: `C:\Users\Guner Office\Desktop\KIVILCIM\Geliştir` altındaki beş kullanıcı görseli:

- `Altı yuvalı tılsım altarı-3.png`
- `Beyaz altın kanat seçimi-7.png`
- `Ejder avcısı unvanı ekranı-5.png`
- `Ejder Kalbi Kalıntı Galerisi-4.png`
- `Göksel Kanat Geliştirme Ekranı-1.png`

- Ana işlem: bordo mine, pahlı altın kenar, krem serif büyük harf. Yardımcı işlem: aynı çerçeve, koyu zemin.
- Sekme/filtre: koyu plaka; seçili durum bordo ve altın vurgu. Koleksiyon sekmeleri aynı simge takımını kullanır.
- Geri/araç: yuvarlak koyu plaka ve altın simge. Eşya seçimi altın kenarla ayrılır; nadirlik görselleri korunur.
- Hover, basma, klavye odağı ve kapalı durum tek yerden gelir. Kapalı düğme saydamlaşmaz; alttaki resimli eski yazı görünmez.
- Boyalı hub armaları ve eşya görselleri korunur; etkileşim durumları ortak sisteme bağlıdır.
- Koleksiyon sekmesi ekran geçmişine yeni adım eklemez. Geri, gelinen üst ekrana döner; klavye odağı giriş düğmesine geri gelir. Lonca Mağazası ayrı bağlantı olarak kalır.
- Tek uygulama: `Oyun/kod/arayuz.js` rol/etiket/odak; `Oyun/kod/butonlar.css` görünüm. Konum ve ölçü ilgili ekran dosyasında kalır. Yeni düğmeler bu sistemi kullanır; ayrı renk/çerçeve üretilmez.
- Dört ölçeklenebilir SVG: `Oyun/gorsel/arayuz/k_button_dark.svg`, `k_button_red.svg`, `k_button_round.svg`, `k_selection.svg`. Referanslardan görsel olarak çıkarılıp kodla çizildi; kaynak PNG'ler değişmedi.
- Çanta geliştirici kontrolü başlıktaki boş alandadır; eşya işlemlerini örtmez.

Kullanılan kaynak: kalıcı yetenek paketindeki `game-ui-frontend` ve `game-ui-ux`. Renk kodları uygulama seçimidir; kaynak görsellerden kesin renk/font ölçümü iddiası yoktur.

12.11.2026. Kaynak: kullanıcının bu sohbette gönderdiği Oyuncu Profili ve Ekipman görselleri. Önceki kurallar geçersizdir. Aşağıdaki oranlar görsel okumaya dayalı yaklaşık değerlerdir; renk kodları ve yazı tipi adı henüz ölçülmedi.

## Kaynaklar

- `REF/Tamamlandı/Profil Referansı 2026-11-12.png`
- `REF/Tamamlandı/Ekipman Referansı 2026-11-12.png`

## Ortak görünüm

- Yatay, yaklaşık 16:9 kadraj. Sahne ekranı doldurur; karakter ve arayüz aynı resimli dünyanın parçalarıdır.
- Ayrıntılı boyalı doğu fantezisi: kırmızı ay, sisli dağlar, katlı çatılar, şelaleler, koyu taş kemerler, kızıl yapraklar ve ejderha işlemeli sancaklar.
- Beyaz saçlı kahraman; beyaz-kırmızı kürk, siyah ve altın zırh, kırmızı bağlar. Ekipman referansında beyaz yoldaş kahramanın arkasında durur. Karakterin bakış yönü, duruşu, silueti ve kadrajı ekranın kendi referansına uyar.
- Kömür ve sıcak siyah paneller, bordo-kızıl plakalar, aşınmış altın kenarlar, krem yazılar. Sisli arka plan daha soluk; karakter, nesneler ve çerçeveler daha keskindir.
- Panellerde koyu doku, kırık/pahlı köşeler, ince parlak kenar ve köşe işlemeleri birlikte bulunur. Süs yoğunluğu ve çerçeve kalınlığı referanstan alınır.
- Düğmeler uzun, uçları sivri veya pahlı plakalardır. Seçili sekme ve ana işlem kırmızı; diğerleri koyu renktir. Altın kenar, gölge ve kabartma derinlik verir.
- İkonlar boyalı ve hacimlidir. Altın metal simgeler, renkli taşlar ve ayrıntılı eşya çizimleri kullanılır. Basit sembol veya emojiyle karşılanmaz.
- Başlıklar büyük, krem renkli ve italik serif; diğer yazılar ve sayılar serif ağırlıklıdır. Koyu gölgeyle sahneden ayrılır. Kesin font görselden doğrulanamadı.
- Sol üstte altın kenarlı yuvarlak geri düğmesi ve ejderhalı kırmızı başlık plakası. Sağ üstte kaynak ikonu ve sayı çiftleri, büyük bir çevre paneli olmadan sıralanır.

## Profil yerleşimi

- Solda yakın kadraj kahraman; baş ve üst gövde yaklaşık ekranın sol üçte birini doldurur. Alt paneller karakterin önüne gelir.
- Üst ortada büyük yuvarlak arma, kahraman adı, ad düzenleme ikonu, kırmızı unvan şeridi, kimlik, mor deneyim çubuğu, seviye, lonca ve bölge bilgileri.
- Sağ üstte çapraz kılıçlarla asılı büyük kırmızı güç sancağı.
- Alt bölümde yan yana üç çerçeveli alan: Başarı Vitrini, Oyuncu Karnesi, Son Etkinlikler. Başlık plakaları üst kenarlarına oturur.
- En altta geniş sekme şeridi: Genel Bakış, Başarılar, İstatistikler, Vitrin, Geçmiş. Seçili Genel Bakış daha yüksek ve kırmızıdır.

## Ekipman yerleşimi

- Sahne ve tam boy kahraman solda yaklaşık %48, eşya alanı sağda yaklaşık %52 yer kaplar. Kahramanın başı, ayakları ve yoldaşı kadrajda kalır.
- Kahramanın iki yanında üçer kuşanılmış eşya yuvası; altta güç, saldırı ve can değerlerini taşıyan kırmızı plaka.
- Sağ üstte seçili eşyanın ikonu, adı, kademe/nadirlik ve değeri; sağında Kuşan ve Demirci düğmeleri.
- Altında Tümü, Silah, Zırh, Takı sekmeleri. Envanter referansta yedi sütun ve beş satırdır; altta kapasite sayacı vardır.
- Yuva içleri koyu ve dokuludur. Çerçeve rengi nadirliği ayırır; seçili yuvada daha parlak altın kenar görülür. Eşya çizimi yuvayı belirgin biçimde doldurur; kademe alt köşededir. Boş yuvalarda soluk yaprak motifi bulunur.

## Hub yerleşimi — 12.11.2026

Kaynak: `REF/Tamamlandı/Hub Referansı 01 2026-11-12.png` ve `REF/Tamamlandı/Hub Referansı 02 2026-11-12.png`. Uygulamada ikinci görselin kadrajı esas alınır.

- Ortada kanatlı beyaz saçlı kahraman ve sağında boynuzlu beyaz yoldaş. Şelaleli şehir ve köprüler sahnenin büyük bölümünü kaplar; karakter alt ortadaki kayalıkta durur.
- Sol üstte yuvarlak portre, kırmızı ad/seviye plakası, sarı güç satırı ve mor deneyim çubuğu. Üstte kaynak plakaları; sağ üstte bölüm, posta, bildirim ve ayarlar.
- Solda altı, sağda yedi koyu işlemeli plaka; boyalı ikonlar ve krem serif yazılar. Altta yuvarlak Çanta ile Av, büyük kırmızı Sefer, Boss ve Arena.
- Görseldeki örnek sayılar kullanılmaz. Bildirim noktaları yalnız mevcut oyunda hazır işlem varsa görünür.

## Altın ve Elmas mağazaları — 12.11.2026

Kaynaklar: `REF/Tamamlandı/Fantastik Asya Temalı Altın Mağazası-1.png`, `REF/Tamamlandı/Altın ve Elmas Mağazası Arayüzü-2.png`, `REF/Tamamlandı/Fantastik Altın Mağazası Arayüzü-3.png`.

- İkinci görselin iki yarısı paket listeleri için kullanılır: solda dikey kategori sancağı ve büyük altın/elmas sandığı, sağda çerçeveli paket kartları. Ortam, fenerli ahşap tezgâh ve şelaleli şehirdir. Yatay tek ekran için sahne tamamlanır; arayüz parçalarının oranları korunur.
- Üçüncü görsel altın seçimi, birinci görsel satın alma onayıdır. Dört resimli kart, nadirlikten bağımsız altın seçim kenarı, elmas bedeli, gerçek altın bakiyesi ve tek kırmızı Satın Al düğmesi.
- Kullanıcı paket seçimini ajana bıraktı. Birinci ve üçüncü görselin ortak değerleri kullanılır: 100 / 300 / 600 / 1.500 altın; 10 / 25 / 45 / 100 elmas. İşlem kayıtlı elması düşürür ve altını ekler; yetersiz bakiyede uygulanmaz.
- Elmas ekranının kartları referans görünümüdür. TL satın alma, aylık kart, haftalık ve özel paket altyapıları mevcut değildir; ilgili kontroller kapalıdır. Sandıklar mevcut markete, Altın Kazan sefere, Günlük Ödül mevcut etkinliklere bağlanır.

## Market ve Sefer — 12.11.2026

Kaynaklar: REF/Tamamlandı/Market.png ve REF/Tamamlandı/Hiçlik Vadisi’nde Sefer.png.

- Market: beş üst sekme, solda seçili sandık, sağda içerik/nadirlik/adet/açma paneli, ortada altı sandık kartı, altta gerçek malzemeler. Sayılar ve para birimleri mevcut ürün verisinden gelir; tanımsız günlük/sınırlı teklif ve sayaç eklenmez.
- Sefer: solda bölgeler, ortada boyalı harita ve gerçek duraklar, sağda Bilgi/Düşman/Ödüller, altta ilerleme. Her bölgenin üç gerçek durağı kullanılır; örnek yedi durak veya 18–20. bölgeler eklenmez. Ödül ve enerji gerçek karşılaşmadan gelir. Elit/Kâbus tanımlı olmadığından kapalıdır. Hızlı Savaş mevcut savaş atlama işlemini kullanır.
- Geliştirici düğmesi kullanıcının açık isteğidir; sağ alttadır. Açıkken oyun içi giderler uygulanmaz; bedel alanları Bedelsiz gösterir. Elmas paketleri bu modda ücretsiz denenebilir.

## Posta, Bildirimler, Ayarlar ve Şans — 12.11.2026

Kaynaklar: REF/Tamamlandı/Posta, Bildirimler ve Ayarlar Arayüzleri (1–3).png ile Şans Menüsü_ Temiz Kart Düzeni.png.

- Posta: üst kategoriler, solda gerçek posta listesi, sağda içerik ve ödüller; altta toplu alma, kaldırma ve alma. Örnek mesaj/tarih üretilmez.
- Bildirimler: solda kategori, ortada gerçek olaylar ve okundu durumu, sağda ayrıntı ve ilgili alana geçiş. Hazır ödül ve savaş geçmişi mevcut kayıttan gelir.
- Ayarlar: solda bölüm ve FPS seçimi, ortada ses/hareket/oynanış anahtarları, sağda kalite, kayıt aktarımı ve sıfırlama. Ses dosyası/oynatıcı yoktur; ses sürgüleri kapalıdır.
- Şans: solda sekiz boyalı kart, ortada seçili oyun ve ejderhalı sunak, sağda gerçek ödüller ve kalan hak, altta mevcut mağaza ürünleri. Kartlar mevcut mini oyunlara bağlanır; diğer oyunlar Çekilişler listesindedir. Yeni çekiliş ekonomisi ve onlu işlem tanımlanmaz. Hub adı da Şans olur.

## Koleksiyon, Lonca, Etkinlikler ve Sıralama — 12.11.2026

Kaynaklar `REF/Tamamlandı` altında: Ayaz Kurt Petler Ekranı; Kanatlar Koleksiyonu_ Kızıl Akkınat; Ejder Kalıntısı Birleştirme Altarı; Auralar_ Aslan Cesareti Paneli; Kızıl Sefer Unvanları Arayüzü; ChatGPT Görseli 12 Kas 2026 14_06_33 (Lonca); Kızıl Sefer Etkinlikleri Ekranı-1; Sezon 5 Güç Sıralaması-2.

- Petler: solda iki sütun yuvalar; ortada diz çöken kahraman ve seçili gerçek yoldaş, altta ad/istatistik/işlemler; sağda beceri ve gerçek gelişim bedeli. Alt sekmeler mevcut seviye ve yıldız işlemlerini sunar.
- Kanatlar: solda üç sütun koleksiyon; ortada seçili gerçek kanatla kahraman ve platform; sağda nadirlik/yıldız/istatistik/gelişim, altta koleksiyon özeti.
- Kalıntılar: solda koleksiyon, ortada altı parçalı ejderha sunağı, sağda gerçek kalıcı etki ve bölge bossu bağlantısı. Tanımlı kalıntı Kırık Mühürdür; yeni güçlendirme veya rezonans sistemi eklenmez.
- Auralar ve Unvanlar: solda kategori, ortada koleksiyon, sağda seçili öğe ve gerçek koşul/etki/işlem. Aura kilit açma ve kuşanma işlemlerini kullanır; örnek aura seviyeleri uygulanmaz.
- Lonca: solda sancak ve gerçek üyelik/puan; ortada duyuru ve iki görev; sağda savaş ve kayıtlı tek yerel üye; altta bağış ve mevcut mağaza. Sahte üyeler veya sohbet eklenmez.
- Etkinlikler: solda kategori, ortada üç gerçek günlük görev, sağda açıklama/ilerleme/ödül. Diğer kategoriler tanımlı etkinlik olmadığında boş gösterilir.
- Sıralama: solda türler, ortada gerçek kişisel rekorlar, altta oyuncu satırı, sağda kayıtlı istatistikler. Online sıra ve sezon bilgisi yoktur; örnek sezon veya oyuncu listesi üretilmez.

## Av, güncel Sefer, Boss, Arena ve Demirci — 12.11.2026

Kaynaklar `REF/Tamamlandı/ChatGPT Görseli 12 Kas 2026 14_16_05.png` (Av), `14_16_14` (Sefer), `14_16_16` (Boss), `14_16_18` (Arena) ve `Ejderha Kılıcı Demirci Atölyesi.png`.

- Av: solda bölge kartları; ortada gerçek seçili hedef ve altta üç önizleme; sağda can/enerji/ganimet ve Ava Başla; altta günlük gerçek av ilerlemesi. Görseldeki geyik yerine o bölgenin mevcut düşmanı çizilir. Başlat düğmesi bütün av karşılaşmasını oynatır.
- Sefer: son referansın daha açık şelaleli şehir kadrajı; solda üç bölge kartı, ortada gerçek üç durak ve çizili rota; sağda seçili durak, gerçek can, enerji ve ödül; altta bölge ilerlemesi. Önceki Sefer yerleşiminin yerini alır. Yeni 17-4…17-7 durakları veya yıldız sandığı ekonomisi eklenmez.
- Boss: solda kaydırılabilir gerçek boss listesi ve Bölge/Günlük/Dünya seçenekleri; ortada seçili gerçek düşman; sağda can, güç, giriş hakkı, ödül, en iyi süre ve mücadele. Örnek Köz Ejderi yerine mevcut karşılaşma kullanılır.
- Arena: solda kahraman kartı; üstte gerçek antrenman puanı, ortada üç mevcut rakip, gerçek can/saldırı ve Düello; altta Savunma, Savaş Geçmişi ve mevcut Arena mağazası. Rakip seçimi sabit üç rakip arasında geçer; yeni lig ve günlük giriş kotası tanımlanmaz.
- Demirci: ortada örs başındaki demirci; solda gerçek eşya ızgarası/kategori, üstte beş işlem, sağda seçili eşya, gerçek mevcut/sonraki etki ve bedel. Alt işlemler Birleştir, Ekipman ve Ayrıştır. Başarı ihtimali ve kademe/taş/harcama kuralları mevcut sistemden gelir.

## Uygulama sınırı

Her ekran kendi referansı ve komutuyla uygulanır; bu ekranların düzeni bütün ekranlara zorlanmaz. Yerleşim kadar karakter/nesne boyutu, kadraj, boyalı parçalar, doku, çerçeve, ikon ve yazı da eşleşmelidir. Gerekli görsel parçalar hazırlanıp kullanılır. Görseldeki sayılar örnektir; ekranda gerçek oyun verisi kullanılır. Sistem ve denge, kullanıcının ayrıca yetki verdiği paket seçimi ve bedelsiz mod dışında değişmez. Çalışan ekran görsel olarak kontrol edilir; ölçüm olmadan benzerlik yüzdesi söylenmez.

## Kullanıcı özeti

Butonlar beş güncel referanstan ortak sisteme bağlandı. Ana işlemler bordo, yardımcılar koyu, seçili sekmeler bordo, geri düğmeleri yuvarlak. Yerleşim ve içerik mevcut ekranlara aittir.

## Kullanıcı özeti — tasarım geri alındı

Son ikon turundaki sadeleştirme reddedildi. Önceki ekran tasarımları geri yüklendi; ortaklaştırma görsel kimliği değiştiremez.
