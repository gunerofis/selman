# DOKU — marka ve arayüz kararları

## 12 Ekim: arama ve görünüm
- Galeri, menü, ana sayfa ve ürün sayfalarında kategori gezintisi kaldırıldı; eski kategori adresleri galeri aramasına yönlenir.
- Arama yalnız tek sözcüklü görsel ve ürün etiketleriyle çalışır. Her sorgu sözcüğü ayrı puanlanır; sıfır eşleşme gösterilmez. 576 ürünün 695 görseli etiketlidir.
- FB amblem görsellerinden geniş “doğa” ve “botanik” etiketleri çıkarıldı. Galeri kapakları tekildir.
- Mobil hero görseli 16:9 tam gösterilir; ürün sayfasında görsel önce gelir. Ses ve ölçüye dair kesin vaatler kaldırıldı.
- Yasal metinlerdeki boş satıcı adresi ve e-posta alanları kullanıcının isteğiyle `[doldurulacak]` kalır.

## 11 Ekim: ana sayfa ve hero
- DOKU harfli konsept görseli hero alanının tam zeminidir; DK-070 ürün ve galeri kaydı yayından kaldırıldı.
- Hero araması ve Ara düğmesi korunur. Örnek arama bağlantıları ve istenen küçük başlıklar kaldırıldı; Tümü düğmesi belirginleştirildi.
- Kamuya açık açıklamalarda üretim çekirdeği ve kesim yöntemi anılmaz. Ayrı renk ve form parçaları arasındaki ince boşluklar doğru biçimde anlatılır.

Güncelleme: 11 Ekim 2026. Bordo palet ve Cormorant kullanılmaz; Manrope ve DM Sans korunur. Kullanıcının son tercihi profesyonel pastel renklerdir. Ön yüzün önceki kontrol kaydı: `FRONTEND-2026-09-30.md`.

## 11 Ekim: görsel etiketlerinin zenginleştirilmesi
- 177 görsel koduyla ayrı ayrı incelendi. `data/keywords.json` sürüm 2: renk, şekil ve konuya ek olarak `styles` (tarz), `tones` (renk tonu), `keywords` (müşteri ifadeleri) alanları her görselde zorunludur.
- Etiketler duvar kompozisyonunu anlatır. Minimal, modern, retro, botanik ve figüratif tarzlar; açık/koyu renkler, petrol mavisi, toz pembe ve toprak tonları yalnız uygun görsellere bağlanır. Belirsiz malzeme, meyve türü veya resmî marka bağlantısı eklenmez.
- Renk tonu ayrı eşleşir: açık bej ile koyu mavi içeren bir görsel “açık mavi” sonucuna girmez. Türkçe/ASCII, renklerin “mavisi/yeşili” biçimleri ve belirlenmiş eş anlamlılar desteklenir.
- Arama kontrolleri tarz, ton, meyveli dal, kitap okuyan figür ve yanlış görselin dışlanmasını da denetler. Önceki kod, filtre ve görsel ayrımı kontrolleri korunur.

## 10 Ekim: kaplama kartelaları
- `/kaplamalar/` üst ve alt menüden erişilir. Kumaş, deri ve PU seçenekleri `data/materials.json` içindeki kartelalara bağlanır; Türkiye'deki firmalar önce gösterilir.
- Bunlar numune değerlendirmesi için referanstır; DOKU stok ve tedarik ortaklığı iddiası yoktur. Teklif formları kaplama tercihi ve kartela renk kodunu mesaj taslağına taşır.
- Aynı sayfada genişlik × yükseklik üzerinden dikdörtgen duvar alanı hesaplanır; sonuç proje formuna ölçü olarak taşınır. Fiyat verilmez. İlerideki fiyat hesabı kaplama + MDF + XPE + diğer giderler + vergi + işçilik + kâr kalemlerini içerecek; formül kullanıcı tarafından ayrıca verilecek.

## 10 Ekim: anahtar kelime araması
- Ana hero: “Duvarınız için ne arıyorsunuz?” Büyük arama alanı, kısa “Ara” düğmesi; normal menü korunur. Arama `/galeri/?q=...` adresinde sonuçlanır.
- Kaynak `data/keywords.json`: 74 ürünün ortak anahtar kelimeleri; 177 görselin ayrı renk, şekil ve konu etiketleri. Alanlar `data/areas.json` ilişkilerinden aramaya katılır. Renkler duvar tasarımına aittir; mobilya renkleri kullanılmaz.
- Birden fazla kelime birlikte aranır. Türkçe/ASCII yazımı, belirlenmiş eş anlamlılar ve DK/G kodlarının boşluklu veya tiresiz biçimi desteklenir. Belirsiz tek harf hatası otomatik değiştirilmez; tek geçerli düzeltme varsa ziyaretçiye önerilir. Kodlar düzeltilmez.
- Arama, bir görselin rengini veya figürünü ürünün diğer görsellerine taşımaz. Ürün adı yalnız tam adla yedek arama sağlar. Görsel kartlarında DK ve G kodları görünür; kart doğru görseli açar, teklif mesajı aynı kodu taşır.
- Yeni ürün/görsel için etiketler zorunludur. `node tools/check.mjs` kod kapsamını, etiket ayrımını, Türkçeyi, çoklu kelimeyi ve eş anlamlıları da denetler. Masaüstü/mobil arama, filtre, boş sonuç, öneri ve seçilen görsel akışı tarayıcıda doğrulandı.

## 30 Eylül referans karşılaştırması
- Hero, kullanıcı tarafından verilen DOKU İmza (DK-070 / G-204) görselinin düzenlenmiş hâlidir. K'nin altındaki kahverengi üçgen açık zemine katılır; alt kol üst kolla aynı kahverengiye geçer. Harflerin mobilde kesilmemesi için bu hero 16:9 gösterilir. Yeni görseller ve üretim kaydı: `DOKU-YUKLEMELER-2026-09-30.md`. Önceki Henüz ve Eşik katalogda korunur.
- Moooi, Arte ve Wall&decò resmî siteleri DOKU'yla karşılaştırıldı. Seçim gerekçesi, gözlemler ve uygulama: `REFERANS-KARSILASTIRMA-2026-09-30.md`.
- Açılış geniş panoramik görsele geçti; mobil seçkide ilk ve son tasarım büyütüldü. Seçkiden üç mekân koleksiyonuna doğrudan geçiş eklendi.
- Fotoğraftan duvara örneği seçkiden sonra, etkileşimli seçiciden önce gelir. Tema kapakları masaüstünde iki geniş sütundur.

## 28 Eylül geliştirmesi
- Açılış açık zemin üzerinde, birincil eylem proje görüşmesi; arşiv ve mekâna göre keşif ikincil yollar. Başlık harf aralıkları açıldı, ana sayfa seçkisi asimetrik yerleşime geçti.
- Var olan sayfalar ve ana sayfa bölümleri korunur. Galeri araması ve filtreleri korunur; görünüm 5/2 sütundur. 9 Ekim 2026 itibarıyla 74 tasarımın tamamı yayındadır.
- Ana sayfa ve tasarım sayfalarında erişilebilir tam ekran görsel inceleme vardır. Büyütme, sığdırma, Escape ile kapatma ve açan düğmeye odak dönüşü desteklenir. Konsept etiketi inceleme ekranında da görünür.
- Tasarım seçici ve küçük görseller ok tuşları, Home ve End ile kullanılabilir. Seçim teklif mesajına taşınır.
- Ana sayfa, iletişim ve tasarım formlarında hazırlanan mesaj açılır önizlemede okunabilir. Mesaj WhatsApp'ta ziyaretçi tarafından gönderilir; kayıt veya gönderim başarısı gösterilmez.
- Mekân sayfasından iletişime geçildiğinde ilgili mekân önceden seçilir. Fotoğrafla başlama bağlantısı korunur.
- İç sayfaların başlıkları, tema kapakları, teklif alanları ve mobil yazı boyutları ortak görsel dille güncellendi.
- Mekân ve tema sayfalarının arama sonucu başlıkları birbirinden ayrılır; çocuk odası koleksiyonu ile çocuk teması aynı başlığı kullanmaz.
- Kaynak: `src/` ve `tools/build.mjs`; `dist/` yalnız üretim çıktısıdır.

## Konumlandırma
- Ana mesaj: **Duvarın da söz hakkı var.** Mekâna özel duvar tasarımı; ev, çocuk odası, işletme.
- Değer, tasarımın kişiye ve mekâna uyarlanmasından gelir. VIP rozeti, yapay kıtlık, indirim dili yok.
- Ürün bilgisi tek kaynak: proje kökü `urun/README.md` → sitede `data/site.json`. Kaplama: deri, süet, keten vb.; yumuşak dolgu; ses/gürültü azaltma (profesyonel yalıtım değil). Üretim yeri/atölye sitede anılmaz.
- Doğrulanmamış bilgi yok: el işçiliği oranı, teslim süresi, sertifika, referans, fiyat.
- Konsept uyarısı üç yerde durur, bölüm bölüm tekrarlanmaz: alt bilgi, tasarım sayfasındaki görsel rozeti, SSS. Gerçek iş yalnız "Fotoğraftan duvara" örneğidir.
- Metin kısa: başlık + tek cümle. Aynı bilgiyi (ölçü görüşmede netleşir, mesajı siz gönderirsiniz, konsept) sayfada bir kez söyle.

## Görsel dil
- Renk: açık zemin `#f6f7f4`, adaçayı `#dbe6df`, pastel vurgu `#c3d7cf`, sis mavisi `#dfe9ef`, açık taş `#eee8e1`; başlık `#344b4a`, yardımcı metin `#556967`. Koyu bölüm zeminleri yerine pastel yüzeyler kullanılır. Ortak palet `src/pastel.css` içinde yönetilir.
- Yazı: başlık Manrope, metin DM Sans. İkisi de siteye gömülü (`dist/fonts/`, OFL lisanslı).
- Küçük not metni en az 4.5:1 kontrast.

## Sayfa yapısı
- Ana sayfa: açılış → DOKU seçkisi (4 tasarım, menüde "Mekânlar") → alan kartları (20 kare kapak) → Fotoğraftan duvara → Hangi çizgi size yakın? (5 tasarım) → Her duvar başka bir form → Figürler → Nasıl ilerleriz? → Sorular → Proje formu. Alanlar `data/areas.json` dosyasından yönetilir; her yayımlanan tasarım en az bir alana bağlıdır. Kaldırılan: Nereden başlamak istersiniz?, Yeni bir çizgi bulun., Size ait bir işaret., Üç farklı çizgi.
- Üst menü: Mekânlar `/mekanlar/`, Tasarımlar `/tasarimlar/`, Galeri `/galeri/`, Özel tasarım `/ozel-tasarim/`; "Projenizi konuşalım" `/iletisim/`. Menü ve alt bilgi tüm sayfalarda aynı.
- `/mekanlar/` → `/mekan/ev/`, `/mekan/cocuk-odasi/`, `/mekan/isletme/`: koleksiyona göre listeler.
- `/tasarimlar/`: 8 tema kapağı. `/ozel-tasarim/`: fotoğraftan duvara, Size ait bir işaret, süreç. `/iletisim/`: proje formu + sorular; `?konu=fotograf` fikir alanını doldurur.
- `/galeri/`: 177 ayrı görsel; 850 px üstünde 5, mobilde 2 sütun. Kod, kısa ad ve renk/şekil özeti görünür. Arama/filtreler başlangıçta açıktır; seçili filtreler ve adet görünür. Her kart seçilen görsel koduyla tasarım sayfasını açar. Tasarımın galeri dönüş bağlantısı bu sekmedeki filtreleri ve son görseli korur.
- `/tasarim/<slug>/`: her tasarımın kendi sayfası; görseller, açıklama, tema bağlantısı, teklif formu, benzer tasarımlar.
- `/tema/<slug>/`: 8 tema sayfası.
- `/urun/?tasarim=DK-xxx`: eski adres; yeni sayfaya yönlendirir, `noindex`.

## Katalog kuralları

- `/yonetim/`: 177 görsel, G/DK kodu ve altı etiket grubu. ChatGPT girişi ve `DOKU_ADMIN_EMAIL` yönetici kontrolü gerekir. Kaydet, D1 kaydını ve galeri aramasını günceller. Yedek JSON ve sürüm geçmişinden geri alma vardır. `data/keywords.json` başlangıç verisidir; yönetimde kaydedilen etiketler önceliklidir ve sonraki site yayınlarında korunur.
- Kaynak: `data/catalog.json`. Kod (`DK-xxx`) kalıcıdır; sıra değişse de değişmez.
- 9 Ekim 2026 isteğiyle iki klasördeki bütün tasarımlar kataloğa alındı. Kulüp adı, resmî bağlantı veya lisans iddiası metinlerde kullanılmaz.
- Yeni tasarım önce kataloga eklenir; ana sayfaya otomatik eklenmez.

## İletişim
- WhatsApp `905434538864`. Site mesajı hazırlar, müşteri gönderir. Sipariş/ödeme tamamlandı denmez.
- Ana sayfa, iletişim ve tasarım formlarında tam duvar kaplama / bölgesel duvar dekorasyonu tercihi isteğe bağlıdır ve hazırlanan mesaja taşınır. Uygulama biçimi ve kaplama hakkında SSS metni kullanıcının üretim beyanına dayanır. Kontrol kaydı: `VITRIN-AKIS-2026-09-30.md`.
- Kendi alan adı sonra bağlanacak; o gün yalnız `data/site.json` içindeki `url` değişir ve site yeniden üretilir.
