# İş Merkezi

## İki Shopify mağazası — 04.11.2026

İş `ac80adf8b6a24d279e242d106c73fc50`: Güner siparişleri artık `drsjpm-ey.myshopify.com` kaynağından okunur. Siparişler ekranında Güner Ofis, Sümen TR ve iki mağaza toplamı seçili tarih için sipariş sayısı ve satış tutarıyla gösterilir. Diğer siteler bu üçlü özete katılmaz; mevcut sipariş listesinde korunur.

Canlı kontrol: Güner 4.069, Sümen TR 162 tekil kayıt; tüm API sayfaları ve kesin sayılar eşleşti. Güner FAPRIKA-GECMIS kayıtlarında processedAt özgün tarihi kullanılır; FAPRIKA-ID etiketi eski yerel kaydı Shopify kimliğiyle eşler. Tekrar yenileme aynı sonuçları verdi. read_orders erişimi dışına çıkan kayıtlı geçmiş silinmez; mağazaların erişilemeyen geçmişinin eksiksizliği iddia edilmez. Satışa dahil etme kuralı mevcut countsAsSale alanıdır; test/iptal/iade/bekleyen ödeme kontrolleri geçti.

Doğrulama: 14 izole C# kontrolü, canlı kaynak ve eski kimlik eşlemesi, kuruş bazlı iki mağaza toplamı, tarih sınırları, yeniden okuma/yenileme, firma filtresi ve sayfalama geçti. Resmî derleme 234 korumalı dosyayı doğruladı. 1280×720 ve 1024×600 görünümü kontrol edildi. Kaynak: [Shopify sipariş API](https://shopify.dev/docs/api/admin-graphql/2026-07/queries/orders), [sipariş tarihleri ve erişim](https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Order).


## Sipariş kaynakları — 30.10.2026

İş `e4b08c48a5ed44ca9cefb2189e05bf58`: Güner siparişleri gunerofis.com’dan alınır. Kullanıcı onayıyla Faprika’da `İş Merkezi Sipariş Okuma` çıktısı (3) oluşturuldu: 15.09.2026 başlangıç, bitiş boş, yalnız Web, ürünler dahil XML, 1 parça. Mevcut çıktılar değiştirilmedi. Bağlantı yalnız merkezi erişim kaydında; programda veya notlarda anahtar tutulmaz. Onaylanan telefon anahtarı da merkezi kayıtta; çalışan sipariş yolu XML’dir.

Sümen TR her yenilemede tarih filtresiz bütün API sayfalarını okur. `ordersCount` kesin toplamıyla ve tekil kimliklerle uyuşmayan aktarım kaydedilmez. Test, iptal, iade ve farklı kanaldan kayıtlar listede kalır; satış tutarına yalnız uygun ödemeler girer. Sümen TR ve Güner web kayıtlarına 45 günlük silme uygulanmaz. Diğer kaynakların düzeni ve kanal düğmeleri korundu.

Son doğrulama: Güner 156 kayıt (15.09.2026’dan itibaren), Sümen TR 150 kayıt (04.09.2026’dan itibaren). Bugün Güner 5 kayıt / 13.500 TL toplam; ödenmiş satış 6.210 TL. Sümen TR 4 kayıt / 9.266 TL. API kimlikleri ve kaynak sayıları eşit; kaydet/yeniden oku, tekrar yenileme, iptal/iade, ürün adedi ve Türkiye tarihi kontrolleri geçti. Ekrana girişte ve mevcut Yenile düğmesinde kaynaklar yenilenir; zamanlayıcı eklenmedi. Servis açık kullanıcı onayıyla yeniden başlatıldı. Gerçek mağaza siparişlerinde yazma yapılmadı.

Mükerrer sipariş düzeltmesi (30.10.2026): Pazaryerleri pencere dışındaki eski siparişi tekrar döndürünce kayıt her yenilemede yeniden ekleniyordu. Artık aynı kaynakta aynı kimlik veya sipariş numarası eskisinin yerine yazılır; kayıtlı tekrarlar okumada temizlenir. OrdersRead/SettingsApi yeniden derlendi; eski sürüm _ARŞİV\İş Merkezi\2026-10-30 sipariş tekrar düzeltmesi.

Pazaryerleri kaldırıldı (30.10.2026): Siparişler ekranında yalnız Web Sitesi kanalı kalır; pazaryeri düğmeleri, kayıtları ve ayar sekmesi gizlendi, OrdersRead pazaryerinden çekmez. API ayarları silinmedi. Bağlantılar iş 994498a9e3e3476cb65121076eb84f05 (Pazaryeri siparişleri) altında. Eski dosyalar _ARŞİV\İş Merkezi\2026-10-30 pazaryerleri kaldırma.

## Ürün listesi — 30.10.2026

İş `8b4d92f8f65042e285a56023bc59ef1b`: 678 aktif Güner Ofis ürünü, mevcut 338 Makro kaydıyla tek listede; toplam 1.016 kayıt. Sütunlar Görsel → Ürün adı → Firma → Fiyat. Liste ada göre sıralanır; firma adıyla aranabilir. Güner kaynağı doğrulanmış `drsjpm-ey.myshopify.com` mağazasının Admin API’si; 14 sayfanın tamamı okundu. Ürün kimliği, başlık, mağaza bağlantısı, ilk görsel ve TRY varyant fiyat aralığı alındı. 678 ürünün görseli ve fiyatı mevcut. Önceki Makro kaynağında eşleşmeyen 31 eski kayıt boş alanlarıyla korundu.

Tek ürün verisi `src/data.json` → work_products; kaynaklar catalogEnrichment/catalogImports, kontrol zamanı catalogCheckedAt. Görseller uygulama verisine gömülü. Mevcut API ürün ayrıntılarını aynı kaynaktan verir; firma/görsel/fiyat ön yüzde aynı kimlikle eşlenir. Kayıtlar ada göre birleştirilmez. Derleme, API ile 1.016 kimlik eşitliği, iki firma araması, görseller, fiyat aralığı ve Güner ürün ayrıntısı kontrol edildi. Mağazada yazma işlemi yapılmadı.

## Sade İş Merkezi — 30.10.2026

İş: `f239f6d63fc544e19a40ac325912bccb`. Kaynaklı skill: `C:/Users/Guner Office/.codex/skills/is-merkezi/SKILL.md`; program AGENTS.md girişine bağlandı. Resmî kaynaklar ve kabul listesi skill referanslarında.

- İşler ilk sekme; ana iş ve tek katman alt iş düzeni var. Açık alt iş varken ana iş kapanmaz. Kartta kısa özet; tam geçmiş Ayrıntılar’da. Onayla/Revize/Red karar bölümünün üstünde.
- Liste, durum çipleri ve kontrol sonucu aynı durum kaynağından ana işleri sayar. Güncel sayılar sabitlenmez. Sayfalama gerçek görünen aralığı gösterir; notlar kelime sınırında ayrılır.
- Açılış tarihi bugün; adresin eski tarihleri geri yüklenmez. Tek Yenile, ortak düğme stilleri ve Türkçe tarih/sayı biçimleri var. Şablon üst barı ve kart menüleri gizli.
- Siparişler’de tek tarih ve firma filtresi; bağlantılar tek yönetici Ayarlar ekranında. Etiketler gerçek bağlantı alanlarından gelir. Bilinmeyen, bağlı değil ve eski veri ayrılır.
- Google/Meta ortak tarih kontrolünü kullanır. Instagram firma + içerik türü düzeninde; liste/ızgara görünüm seçimidir. İç kimlikler gizli; takvim gerçek plan kayıtlarını gösterir. Ürün numarası Ayrıntılar’da; bilgi girişi Ürünler → Ürün bilgileri içindedir. Kurallar ve Sistem Günlüğü Ayarlar altındadır.
- Dosya yolları kimlik/CSRF denetimli yerel açma işlemiyle çalışır. Kod ve metin Not Defteri’nde görüntülenir; betik çalıştırılmaz. Servis, çalışma verisi ve onay sınırı korunur.

Doğrulama: 21 izole API kontrolü, Türkçe metin/tarih dönüşümü ve resmî kaynak derlemesi geçti. Gerçek ekranda 1280×673 ve 1024×600, sayfalama, onay sırası, ana/alt iş, kısa not kaydı, ürün ayrıntısı, sipariş ayarları, ortak tarih, Instagram ve dosya açma kontrol edildi. Gerçek işleri onaylama, sipariş/hesap ayarı değiştirme veya paylaşım yapma testi yapılmadı. Güner taşıma iş içerikleri incelenmedi/değiştirilmedi.

## Güner taşıma — 30.10.2026

İş: 3ec63c53dbe54d0eac8c6a75011c8a73. Kaynak derlemesi geçti; build.ps1 kurulu aracı bulur ve doğrulanan yerel kaynakları derler. package-lock ve korunan 234 dosya değişmedi. Servis yenilendi; 53 kalan, 23 biten iş API ile aktarıldı. Önceki 19 izole API kontrolü geçti. Kullanıcı Esc ile bilgisayar kullanımını durdurdu; görsel kontrol ve düğme/not testi tamamlanmadı. İş bekliyor; zamanlayıcı eklenmedi.

## Önceki yapı — 26.10.2026

- İş `de00b54e264748909ae1176fca53d335`: İşler'de plan/öncelik, durum ve arşiv düğmeleri ayrıldı; İptal edilenler üstte, sayfalama üstte ve altta. Bilgi Girişi İşler içine alındı; tamamı dolu 76 kayıt Tamamlananlar görünümünde.
- Instagram Profil Tasarımı ve Sohbetler girişleri ve yerel erişim yolları kaldırıldı; kaynaklar silinmedi. Kurallar arama/sayfalama/ayrıntı ve Sistem Günlüğü görünümüyle açılır.
- Reklam ve Satış: kampanya/grup ayrı; Özet, Reklamlar, Dönüşümler ve Site satışları ayrı görünüm. Günlük bar grafiği, harcama dağılımı, tarih aralığı ve Bugün/Bu hafta/Bu ay/Bu yıl/Tümü; oklar aralığı bir gün kaydırır. Aralık filtreleri bütün günleri toplar; günlük güncelleme bu ayarı korur.
- Tek kontrol agentı: `01a178b8-ecf8-73a0-997b-b9337c36f7ce`, GPT 6.1 Sol / medium. İşler → GPT kontrol et aynı sohbete `codex queue` ile komut gönderir. Çift istek engellenir; sonuç kimliği ve oturum/CSRF doğrulanır. Zamanlayıcı eklenmedi. Agent Notları.md yalnız anlamlı çalışma/bulguda güncellenir. İlk gerçek kontrol ve programa sonuç bildirimi başarılı.
- Basit olay kaynağı: `Ekip/Kayitlar/Sistem Günlüğü.jsonl` (zaman, alan, işlem). Form metni, sır veya müşteri bilgisi yazılmaz; gezinme ve başarılı kayıt işlemlerinde yazılır. Arayüzde son 300 olay, kullanım sayılarında tüm kayıtlar bulunur.

- İş Merkezi ekran düzeni (iş `2878d451a03a4c05b53ba02fe5df0bdb`): İşler tek öncelik listesinde, Ürünler ekrana göre sayfalı, Bilgi Girişi tek kayıt/alan düzeninde, Siparişler firma/kanal seçimiyle çalışır. Ayrıntı, geçmiş ve ayarlar ayrı bölümlere ayrıldı. Arama, sıralama, kayıt ve onay işlevleri korundu.
- Instagram gönderileri, takvim, hikâyeler, metinler ve düzenleyici sayfalandı; profil tasarımında bölüm seçimi ve otomatik sığdırma var. Yerel veri kaynakları değişmedi.
- Doğrulama: resmi içerik derlemesi ve korumalı çalışma ortamı denetimi geçti. 1024×600, 1280×631 ve 1366×768 görünümlerinde ilgili ekranlar ölçüldü; ürün/bilgi sayfalaması, iş geçmişi, sipariş ayarları ve Instagram düzenleyicisi kontrol edildi. 338 ürün, 435 geçmiş kayıt ve 76 bilgi kaydı mevcut. Kontroller salt okunur yerel önizlemede yapıldı; canlı sipariş veya paylaşım yazılmadı. Yerel servis yeniden erişilebilir.

- 28.10.2026 Meta API bağlantısı doğrulandı (iş a56d1f364b7d423dbc0edbd8a424b021). Güner ve Makro reklam hesapları mevcut anahtarla bağlı; Güner için kullanıcı onayıyla yalnız performans okuma erişimi verildi. 19–27 Ekim verileri alındı. Yenile düğmesi, firma filtreleri ve resmî derleme doğrulandı. Ayrıntı reklam klasöründeki Meta Bağlantı Durumu 2026-10-26.json.

- Reklam ve Satış içinde Google ve Meta alt sekmeleri; Meta harcama ve dönüşümlerinde Tümü/Güner/Makro filtreleri çalışır. Makro canlı Instagram profil ölçümü bağlı; Güner yalnız kayıtlı profil bağlantısıdır. Güner satın alma tutarı Meta yanıtında boş; bilinmiyor olarak korunur.

- Sipariş hesap düğmeleri: Makro Ofis 4, Güner Ofis 9. Kullanıcının 26.10.2026 hesabı/platform listesi `src/content/dashboard/order-accounts.json` içinde; yeni bağlantı kurulmadı.

- Kurallar sekmesinin tek kaynağı `Kurallar.md` dosyasıdır. “Kural ekle” isteği aynı dosyaya işlenir; `Ekip/SyncRules.py` arayüz verisini üretir, ardından resmi uygulama derlenir. `build.ps1` bu eşitlemeyi otomatik çalıştırır. Servis yeniden başlatılmaz.

- Gerçek ChatGPT Data App: İş Takip'in uygulama kimliği, araç çubuğu, tema, düzenleme ve kaynak inceleme özellikleri korunur. React arayüzü `src/content/dashboard`; resmi derleme `dist`.
- Tek giriş: Programlar/İş Merkezi.lnk → `Başlat.pyw`. NetGeçiş aynı başlatıcıyı açar. Chrome/Edge uygulama penceresi kullanılır; sekme ve adres çubuğu görünmez. Yerel adres `http://127.0.0.1:4196/?tab=jobs`. WPF Windows arayüzü kullanılmaz.
- İşler, Ürünler, Bilgi Girişi, Siparişler, Instagram, Sohbetler, Reklam ve Satış aynı uygulamadadır. Uzun notlar Ayrıntılar altında; kapanan işler ayrı listede.
- İş kaynağı değişmedi: `Ekip/Kayitlar/ekip.sqlite`. API/CLI ve kullanıcı onay sınırı korunur. Tek kullanıcı, yalnız bu bilgisayarda.
- Geçmiş iş/ürün ve raporlar: `src/data.json`; kontrol notları `Veri/records/checks.json`; bilgi yanıtları mevcut Sümen TR dosyasında. Siparişler ve şifreli ayarlar AppData/Local/Siparisler içinde.
- Günlük rapor girişi `Veri/operations/update.mjs`; aynı komut resmi uygulama derlemesini de günceller. Veri ve derleme kimlikleri birlikte doğrulanır.
- Dahili araçlar `Moduller` altındadır. Eski İş Takip ve Windows arayüzü Desktop/_SİLİNECEK/İş Merkezi Önceki Yapı 2026-10-26 içinde korunur. Tarayıcı profil yedeği AppData/Local/IsMerkezi yerinde tutulur.
- Doğrulama: 54 iş kimliği, 435 geçmiş kayıt, 338 ürün, 76 bilgi kaydı korundu. Yerel erişim/CSRF, onay ve kapanış, ayar sürüm çakışması, anahtar gizleme ve günlük rapor derlemesi test edildi. Profil önizlemesinde eski kayıt boştu.

## Önceki sürümlerin geçmişi

Aşağıdaki tarihli kayıtlar geçmiş kararlardır; güncel yapı yukarıdadır.


## Sade yapı — 24.10.2026 (İş Merkezi Yeni, deneme)

| Parça | Görev |
|---|---|
| Hub.cs → IsMerkezi.exe | Sol menü. 2 tarayıcı: ana uygulama + Instagram/Profil/Sohbet (sırayla tek sayfa). |
| Ekip/server.py | Tek servis: işler (SQLite), geçmiş kontrol notları, bilgi girişi, siparişler, reklam/satış, online ekip. Dosya değişmedikçe önbellek. |
| Ekip/index.html, app.js, app.css | Tek sayfa arayüz. Bölümler sayfa içinde, anında geçiş. |
| Services.py | Instagram servisleri; aynı porta ikinci süreç açılmaz. |

- Kaldırılanlar: Bridge.cs, Workspace.html, modules.py/js, QueueStore.cs, Reklam için Node 4186 bağımlılığı (veri doğrudan İş Takip/src/data.json).
- Yazma kuralları aynı: sürüm (revision) kontrolü, çakışmada 409 ve "Güncel kaydı al", atomik yazım, bilgi yanıtlarında Arşiv kopyası.
- Deneme: `deneme.flag` varken port 4197, ayrı tarayıcı profili, kayıtlar `Ekip/Kayitlar/test` ve kopya veritabanına yazılır. Kurulumda bayrak taşınmaz; port 4196 ve gerçek kayıtlar.
- Ölçüm: bölüm geçişi 0–16 ms (eski: 100–330 ms donma); bellek ~300 MB (eski: ~750 MB, 8 sayfa süreci).

### İş ekranı düzeni — 24.10.2026
- Liste: Senden beklenen (GPT bilgi istiyor / onay bekliyor) → Agent çalışıyor → Geciken → Bugün → Bu hafta. Sonra, Tarihsiz, Tamamlanan, İptal, Geçmiş kayıtlar alttaki düğmelerde.
- İş sayfası yukarıdan aşağı: Senden beklenen (cevap kutusu veya Onayla/Reddet) → İstenen → Yapılanlar (tarihli notlar, son 2 görünür) → GPT kontrolü → Plan → Not ekle. Ekip durumu, Düzenle, İptal en altta.
- "Bilgi istiyor" cevabı açıklamanın altına tarihli eklenir ve GPT'ye yeniden gönderilir (revise).
- Kullanıcı kararları (Desktop/SORU.txt, 24.10.2026):
  - Onay: ekip durumu Tamamlandı olan iş onaylanınca kapanır (state completed), yeniden uygulanmaz. Yapılmamış işte onay = uygulama onayı (approved).
  - Ekip durumu: kullanıcı ve ekip değiştirebilir; iş sayfasının altında.
  - Giriş: masaüstünde şifre aynen kalır.
  - Geçmiş kayıtlar: yalnız arşiv (salt okunur).
  - Ürünler: bağlantı + ilgili işler + malzeme; eski notlar Detaylar'da, kaynak tarihiyle. Bilgi Girişi menüden kalktı, Ürünler içinden açılır.
  - Bilgi isteyen işe cevap: açıklamaya tarihli eklenir, yeniden incelemeye gider; uygulama/yayın onayı değildir.
  - Yeni iş: plan günü bugün varsayılan, değiştirilebilir; eski işlere tarih yazılmaz.
  - Instagram, Profil, Sohbetler İş Merkezi içinde kalır.
  - İşler sekmeleri: Öncelik, Açık, Bugün, Onay bekleyen, Tamamlanan. Kart: başlık, kısa durum, son not, Detaylar. Açılır menü yok; ekip ayar/bağlantı değiştiremez.

## Tek merkez geliştirme planı — 24.10.2026

**Amaç:** Yetkili kapsamımızdaki bütün işleri, siparişleri, ürün bilgilerini, içerikleri, kararları ve sonuçları tek yerden kontrol etmek. Her kayıtta ne yapıldığı, sorumlusu, bekleyen engel, kaynak ve son durum görülebilmeli.

**Durum:** 24.10.2026 kullanıcı isteğiyle ilk üç iş paketi uygulandı: ortak kuyruk/onay, yeniden inceleme, sipariş bağlantı durumları. Diğer paketler plan aşamasında; sabit adres ve yeni pazaryeri bağlantısı kurulmadı.

### Seçilen yapı

Mevcut İş Merkezi'nin ortak web arayüzü + tek uygulama servisi + ortak iş veritabanı olarak geliştirilmesi önerilir. Masaüstü aynı arayüzü açmalı; ayrı iş kuyruğu ve ayrı onay kuralları üretmemeli. İlk aşama bu bilgisayarda çalışır; bilgisayar kapalıyken dış erişim olmayacağı görünür olmalı.

İş Merkezi takip kayıtlarının asıl kaynağı olur. Siparişin asıl kaynağı ilgili mağaza/pazaryeri olarak kalır; buraya kaynak kimliğiyle güncel görüntüsü alınır. Dosyalar mevcut sahibi ve klasöründe kalır; merkezde ilişki ve kısa sonuç tutulur. Her veri türünün tek yazma sahibi belirlenir; aynı kayda JSON ve veritabanından bağımsız yazılmaz.

İlk aşamada mevcut SQLite kullanılabilir: tek sunucu üzerinden kısa işlemler; sürüm kontrolü, işlem bütünlüğü ve yedek. Çok sunucu veya yoğun eşzamanlı yazma ihtiyacı doğarsa PostgreSQL değerlendirilir. Bu geçiş şimdiki planın zorunlu işi değildir. [SQLite kullanım koşulları](https://www.sqlite.org/whentouse.html).

### Web araştırması ve tercih

| Seçenek | Belgelenen yaklaşım | Bizim işimize uygunluk değerlendirmesi |
|---|---|---|
| Mevcut İş Merkezi'ni geliştirmek | Kendi sipariş bağlantılarımız, firma eşleştirmemiz, yerel dosyalarımız ve GPT onay akışımız mevcut | Tercih: mevcut yatırımı kullanır; sade arayüzü ve yetkileri doğrudan işimize göre kurarız. Bakım ve test sorumluluğu bizde kalır. |
| Plane | Aynı iş kayıtlarını çoğaltmadan farklı filtre ve görünümler; proje takibi | İş listesi düzeni için iyi örnek. Mevcut sipariş, dosya ve GPT akışını taşımanın ek uyarlama gerektireceği değerlendirilmiştir; bu araştırmada hazır uyum doğrulanmadı. [Views](https://docs.plane.so/core-concepts/views). |
| ERPNext | Proje, görev, zaman/maliyet ve diğer işletme modülleriyle ilişkiler; koşullu rol bazlı onay akışları | Kayıt ilişkileri ve yetki modeli için iyi örnek. Mevcut basit takip talebine göre geçiş kapsamını büyüteceği değerlendirilmiştir. Muhasebe/stok/üretimin tamamını yönetme talebi gelirse yeniden değerlendirilir. [Projeler](https://docs.frappe.io/erpnext/projects-introduction), [Onay akışları](https://docs.frappe.io/erpnext/workflows). |

Karar bu üç yaklaşımın mevcut ihtiyaçlara göre karşılaştırılmasıdır; bütün ürünleri kapsayan bir pazar taraması veya kurulum denemesi değildir. Hazır sistemlerin pazaryerlerimizle hazır bağlantısı varsayılmadı.

### Ortak kayıt düzeni

- Firma → proje/iş alanı → iş. Firma eşleştirmesi: Güner Ofis altında imalattansumen.com; Makro Ofis altında sumentakimi.com ve sumentakimi.com.tr. Bağlanmamış kanallar açıkça belirtilir; Derikutu aktif sipariş kapsamına alınmaz.
- Her iş: tek kimlik, başlık, beklenen sonuç, firma/proje, sorumlu, öncelik, hedef tarih, ekip durumu, GPT inceleme/onay durumu, kaynak tarihi, bağlı kayıtlar, tarihli notlar ve sonuç kanıtı.
- İlişkiler: ürün, sipariş, site sayfası, içerik, reklam raporu ve dosya/karar. Bir ürün veya siparişten iş açıldığında ilgili kayıt otomatik bağlanır.
- Web/SEO, ürün geliştirme, üretim, içerik, reklam ve yazılım işleri aynı modelle izlenebilir. Alan bazlı düğmeler aynı kayıtları filtreler; ikinci iş listesi oluşturmaz.
- Eski işler geçmiş/referans görünümünde korunur. Eski açık etiketi yeni uygulama emri değildir. Seçilmiş kayıt ancak açıkça yeni iş olarak gönderilirse incelemeye girer.
- Sohbetlerden yalnız seçilen karar ve işler, kaynaklarıyla merkeze kaydedilir. Bütün sohbetleri veya kapalı özel alanları otomatik taramak kapsamda değildir.

### Ekran düzeni

| Ekran | Gösterilecek |
|---|---|
| Bugün | En önemli üç iş; onay bekleyenler; geciken/engellenen işler; güncel sipariş özeti |
| İşler | Tek liste; Benim işlerim, Tümü, Onay bekleyen, Bilgi gereken, Biten ve Geçmiş düğmeleri |
| Siparişler | Mevcut iki firma × altı kanal; kaynak bazında son başarılı getirme, bağlantı durumu, tarih ve arama |
| Ürünler | Ürün bilgisi, eksikler ve bağlı işler; Bilgi Girişi aynı ürünün içinde |
| İçerik | Instagram günlük seçimi, planı, bağlı görseller ve işler; eski planlar geçmiş olarak ayrılır |
| Reklam ve Satış | Tarihli sonuçlar, veri kaynağı, güncellik ve bağlı aksiyonlar |
| Kaynaklar | Seçilmiş dosyalar, kararlar ve sohbet okuyucu; ilgili işe bağlantı |

Ayarlar ve bağlantılar yalnız yöneticiye açık olur. Ana düğmeler görünür kalır; açılır menü kullanılmaz. Liste ilk bakışta başlık, durum, sorumlu ve tarihi gösterir; not düzenleyicisi yalnız ilgili işte açılır. Yeni bilgi gerektiğinde sessiz sayaç kullanılır; yazılan form yenileme nedeniyle kaybolmaz. Firma/proje filtreleri sayfalar arasında korunur. Ortak arama kayıt türünü ve firmayı gösterir.

### Yetki ve GPT akışı

Ekip iş ekler, durum/not ve izin verilen ürün bilgisini günceller. Yönetici bağlantı/ayarları yönetir ve somut uygulama kapsamını onaylar. GPT inceler, eksik bilgi ister ve sadece onaylanan sürümü uygular; kendisini onaylayamaz. Ortak ekip şifresi ilk aşamada korunur; seçilen isim beyana dayalıdır, doğrulanmış kimlik sayılmaz.

Yeni iş → GPT incelemesi → bilgi gerekiyorsa kullanıcı yanıtı → yeniden inceleme → yönetici onayı → uygulama → sonuç/kanıt → yönetici kontrolü.

Ekip durumu ve uygulama onayı ayrı alanlardır. “Tamamlandı” seçimi GPT'ye yetki vermez. Başlık, istenen sonuç veya uygulama kapsamı değişince önceki onay geçersizleşir. Reddedilen iş düzeltilebilir; tekrar onaydan geçer. İncelemede/uygulamada kesilen iş kanıt kontrolü olmadan ikinci kez çalıştırılmaz. Sonuçla birlikte değişen kayıt, doğrulama ve gerekiyorsa geri alma bilgisi saklanır. Dış işlem onayı somut işlem ve hedefi kapsamalıdır.

### Uygulama sırası ve bitiş ölçütleri

| Sıra | İş paketi | Tamamlanma ölçütü |
|---|---|---|
| 1 · Tamamlandı | Tek kuyruk ve ortak onay; mevcut kayıtların yedeği ve kontrollü geçişi | Masaüstü/online aynı iş kimliğini gösterir; eski işler kendiliğinden çalışmaz; iki agent aynı işi alamaz; ekip onay/ayar uçlarına erişemez. Kullanıcının tek kuyruk uygulama isteği kapsamında otomasyon aynı kaynağa geçirildi. |
| 2 · Tamamlandı | Bilgi ekle/yeniden incelet; kapsam sürümü ve onayın geçersizleşmesi | Bilgi gereken/reddedilen iş tekrar ilerler; kapsam değişince yeniden onay gerekir; yazılan taslak ve eski notlar korunur. |
| 3 · Tamamlandı | Sipariş bağlantı sağlığı ve tek eşitleme | Güncel / eski veri / bağlı değil / getirilemedi / gerçek sıfır ayrılır; her kaynağın başarı tarihi vardır; masaüstü ve online eşzamanlı getirme kayıp veya tekrar üretmez. |
| 4 | Bugün ekranı, tek İşler görünümü, sorumlu/tarih, ortak arama | Öncelikler ilk ekranda; tamamlananlar günlük listeyi doldurmaz; filtre ve taslaklar korunur; mobilde kullanılabilir. |
| 5 | Ürün/sipariş/içerikten iş; seçilmiş karar ve dosya bağlantıları | İlgili kaydın bütün açık işleri ve geçmişi tek yerden bulunur; aynı iş yeniden kopyalanmaz. |
| 6 | Sabit adres, görünür servis/agent sağlığı, yedek ve geri yükleme | Yeniden açılışta adres aynı; çevrimdışı durum görünür; ayrı test konumuna geri yüklenip kayıt sayısı/kimlikleri doğrulanır. DNS, hizmet/açılış ve otomasyon değişikliği henüz yapılmaz. |
| 7 | Erişim sağlamlaştırma | Ortak giriş kolaylığı korunarak daha uzun şifreler kullanıcı kararıyla seçilir; eski oturumlar kapanır; yönetici/ekip yetkileri doğrudan API testleriyle doğrulanır. Mevcut şifreler bu planla değiştirilmez. |

### Sabit erişim ve işletim

Geçici tünel yerine mevcut bilgisayara yönlenen kalıcı Cloudflare Tunnel ve sabit alt alan adı önerilir. Cloudflare belgeleri geçici adresin her çalıştırmada değiştiğini, kalıcı tünelin hesapta sabit kimlik taşıdığını belirtiyor. Uygulama için uygun alan adı/DNS erişimi ve hesap durumu doğrulanmalı; yeni alan adı veya ücretli plan gerekliliği varsayılmamalı. Bilgisayarın açık olma şartı devam eder. [Cloudflare tünel yapısı](https://developers.cloudflare.com/tunnel/concepts/).

Sistem sağlığı: son başarılı kaynak yenilemesi, GPT'nin son kontrolü, bekleyen iş sayısı ve son yedek. Agent çalışmıyorsa iş ekranda “inceleniyor” diye süresiz bırakılmaz. Yedek kapsamı: ortak iş veritabanı, kontrol notları, ürün bilgi yanıtları ve yapılandırma; erişim sırları ayrı korumalı işlemle ele alınır. Kaynak dosyalar taşınmaz, yedek kayıtları haritadaki arşiv düzenini izler.

**Genel bitiş ölçütü:** Yetkili kapsamdaki bir işin kaynağı, sorumlusu, son durumu, onayı ve sonucu masaüstünden ve webden aynı kimlikle bulunabilmeli; uygulama/bağlantı ayrıntıları ekip akışını zorlaştırmamalı.


---

23.10.2026 · Programlar → İş Merkezi. NetGeçiş kartı aynı uygulamayı açar.

## 24.10.2026 — Online ekip

- İş Merkezi → Online ekip: Ekip/Panel.pyw; 4196 loopback servisi, geçici Cloudflare HTTPS adresi. Bilgisayar ve panel açık kalır; yeniden açılışta adres değişir. Başlangıç kaydı eklenmedi.
- Online ekran: ekip işleri, mevcut iş takibi, ürünler, bilgi girişi, siparişler, Güner/Makro Instagram planları, sohbet okuyucu, reklam/satış kayıtları. İş kontrol notları ve ürün bilgileri masaüstüyle aynı kaynağa yazılır. Eski işler GPT kuyruğuna aktarılmaz.
- Siparişler: iki firma × altı kanal, tarih/arama, mevcut bağlantılardan salt okuma ile getirme. Kaynak ve son getirme tarihi görünür. Kurulmamış Makro pazaryerleri ve Amazon için bağlantı yok bilgisi korunur.
- Ekip ayar/bağlantı değiştiremez; sadece izinli API yolları açılır. Instagram ve raporlar takip içindir; yayın/reklam değişikliği endpointleri açılmaz. Sohbet dosyaları kullanıcının cihazından seçilir, sunucuya yüklenmez.
- Kaynak: Ekip/modules.py, modules.js, OrdersRead.cs/exe. Doğrulama: tüm veri bölümleri, yetkisiz erişim, gizli dosya ve ayar/yayın engeli, CSRF testleri geçti. Sipariş getirme tüm bağlı kaynaklarda başarılı; webde iki sıra altı sütun ve sohbet okuyucu görüntülendi.
- Ekip ortak şifreyle ekler ve durum/not günceller. Yönetici ayrı şifreyle incelemeyi onaylar/reddeder. Rol, CSRF, kaynak, oturum ve giriş denemesi kontrolü sunucuda; şifrelerin scrypt özeti saklanır. Merkezi erişim kaydındaki is_merkezi_ekip bölümünden yerel panelde kopyalanabilir.
- Veri: Ekip/Kayitlar/ekip.sqlite; atomik kayıt, sürüm ve denetim izi. Başlık/açıklama düzenlemesi kapsam sürümünü artırır, eski onayı kaldırır ve yeniden inceleme gerektirir. Ekip durumu uygulama onayı değildir.
- Saatlik agent: 01a16c6d-8819-7e02-816c-f8b0e25ea2ab, GPT-6.1 Sol/high. Ekip/server.py CLI: list, claim-review, review; web yönetici onayı sonrası claim, complete/block. Eski JSON kuyruk yazıcısı kapatıldı; IsKuyrugu.exe aynı SQLite kuyruğuna yönlenir.
- Doğrulandı: rol engelleri, onaysız uygulama reddi, sürüm ve eşzamanlı claim, tekrar kayıt, HTTP giriş/çıkış, CSRF, özel dosya engeli. Gerçek HTTPS üzerinde iki rolün giriş/okuma/çıkışı ve Secure/HttpOnly çerezi geçti; gerçek kuyruğa test yazılmadı. Masaüstü derlendi.
- cloudflared 2026.10.3 resmi GitHub SHA256 doğrulandı. Geçici tünel sınırları: https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/

## Güncel yapı

- Tek gezinme: İşler, Ürünler, Bilgi Girişi, Siparişler, Instagram, Sohbetler, Reklam ve Satış.
- İşler/Ürünler/Bilgi Girişi: ortak arayüz, arama, filtre, sayfalama, ayrıntı ve kayıt durumu. Eski sunum ve aktarım düğmeleri ana uygulamadan çıkarıldı.
- Instagram: Güner/Makro/Profil Tasarımı. Tek yatay bölüm seçimi; takvim aynı görünümde açılır. Paylaşım işleyicileri korunur.
- Siparişler: mevcut yerel modül, mevcut şifreli ayar ve sipariş kaydı. Renkler ortak tasarıma uyar. Açılışta eşitleme yapılmaz.
- Sohbetler ve profil tasarımı: ortak açık renkler ve kontroller; özgün görüntüleme/düzenleme işlevleri korunur.
- Reklam ve Satış: mevcut raporun veri, grafik ve filtre işlevleri korunur; açık görünüm kullanılır.

## Kaynak ve veri

| Dosya | İşlev |
|---|---|
| Hub.cs | WPF gezinme, görünüm ömrü, tek pencere, yerel servisler, kapanış kontrolü |
| Workspace.html | İşler, ürünler, bilgi girişinin ortak arayüzü |
| Bridge.cs | Yalnız uygulamanın kendi sayfasından gelen izinli veri/kayıt istekleri |
| Instagram.js, Chat.css, Preview.css | Bölümlerin ortak tasarıma uyarlanması |
| Services.py | Mevcut Instagram işleyicilerini açar; açılışta bekleyen dış iletimleri tekrar göndermez |
| build.ps1 | Uygulamayı ve Siparişler kaynaklarını birlikte derler |

Asıl görev/ürün kaynağı: İş Takip\src\data.json. Kontrol notları: İş Takip\records\checks.json. Ürün bilgi yanıtları kendi mevcut Güner Ofis kaydında tutulur. Sipariş ayarları: AppData\Local\Siparisler. Uygulama tarayıcısı: AppData\Local\IsMerkezi\Browser. Mevcut kaynak klasörleri taşınmadı. Eski kayıt aktarımı bu revizyonun kapsamı değildir.

## Düzeltilen birleşim sorunları

- Aynı anda bölüm açılışında çift tarayıcı oluşturulması ve yanlış bölümün görünmesi önlendi; ortak tarayıcı ortamı bir kez hazırlanır.
- Bölüm değişiminde arama, liste ve açık form korunur. Başlatma/yükleme hatasında yeniden deneme vardır.
- Not ve bilgi kaydı mevcut sürüm numarasıyla yapılır. Çakışma başarısız sayılır; yazılan metin korunur, güncel kaydı alma seçeneği sunulur.
- Değişmemiş kayıt gönderilmez; kayıt sürerken form kilitlenir. Başarı yalnız API doğrulamasından sonra gösterilir.
- İş ve bilgi taslakları yerelde saklanır. Kaydetmeden kapanışta uyarı, kayıt/eşitleme sürerken kapanış engeli vardır. Sipariş ayarındaki yazılmamış değişiklik de kontrol edilir.
- Harici ürün bağlantıları tarayıcıda; marka geçişleri ve yerel takvim uygulama içinde açılır.

## Doğrulama

Gerçek Node işleyicilerinin çalışma klasöründeki ayrı kopyası 4198 portunda kullanıldı; gerçek kontrol notlarına ve bilgi yanıtlarına test kaydı yazılmadı. Görev notu kaydı, sürüm çakışması, taslağın korunması, güncel kayıt alma, bilgi kaydı ve bölüm dönüşünde durum koruma sınandı. Dokuz görünümün yüklenmesi ve ekran görüntüleri kontrol edildi. Sonuç: Kontrol\sonuc.txt. Canlı pazaryeri eşitlemesi ve sosyal içerik gönderimi bu kontrolde yapılmadı.

Önceki kaynak sürümleri Desktop\_ARŞİV ve CSV\Kayıt Dizini.csv içinde. Eski altı kısayol Desktop\_SİLİNECEK\İş Merkezi Öncesi Kısayollar içinde.

Raporun yinelenen İş takibi/Ürünler/Bilgi Girişi sekmeleri authored DashboardContent.jsx üzerinden kaldırıldı; mevcut grafik/filtre bileşeni ve tüm kaynak verisi korundu. Resmî Data derleyicisiyle separate-data derlemesi doğrulandı.

## 23.10.2026 — Sayfa metinleri ve web siteleri
- Tekrarlanan ÇALIŞMA ALANI, üç sayfa açıklaması ve sipariş tutarı açıklaması kaldırıldı.
- Siparişler → Web Siteleri: beş site adı/adresi kaydedilebilir. Sipariş entegrasyonları henüz kurulmadı.
- Kayıt: AppData\Local\Siparisler\web-siteleri.json. Önceki kayıt .bak olarak korunur. Adres/tekrar kontrolü, değişiklik çakışması ve kaydetmeden kapatma uyarısı var.
- Derleme başarılı. İzole testte beş site kaydedildi; yeniden açılışta ad/adresler doğrulandı.

## 23.10.2026 — Web sipariş bağlantıları
- sumentakimi.com.tr, sumentakimi.com, imalattansumen.com, derikutu.com: Shopify 2026-07 GraphQL ile canlı okuma doğrulandı. Son 7 gün sırasıyla 29, 0, 1, 0 web/manuel sipariş okundu; ortak siparisler.json kaydına işlendi.
- gunerofis.com: Faprika sipariş servis adresi/API belgesi eksik; bağlı gösterilmez. Kullanıcıdan belge veya sipariş XML bağlantısı istendi.
- Getir: pazaryerleri ve web siteleri aynı listede. Site filtreleri, bağlantı durumu, sayfalama ve kaynak bazında hata koruması eklendi. Erişimler merkezi API kaydından okunur; token diske yazılmaz. Kaynak kod: Siparişler/Websites.cs.
- Web kaynağı yalnız web ve shopify_draft_order kanallarıdır; test/ithal kanal kayıtları alınmaz. İptal, iade ve ödeme bekleyenler toplam dışıdır. Kısmi iade güncel tutarla hesaplanır. Mevcut dört mağaza TRY; başka para birimi gelirse karışık toplam yerine açık hata verir.
- Tarih/saat, tutar, iptal, iade, test siparişi, para birimi ve tekrarlı getirme testleri geçti. API sorguları yalnız okuma; dış sipariş değişikliği yok.
- Kaynak: https://shopify.dev/docs/api/admin-graphql/2026-07/queries/orders ve https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant

23.10.2026 kullanıcı kararı: Faprika API yok; gunerofis.com bağlantı kapsamından, filtrelerden ve hata bildiriminden çıkarıldı. Dört Shopify bağlantısı aktif. Faprika için beklenen işlem yok.

23.10.2026 — Sipariş ekranı sadeleştirildi: kaynaklar tek seçim alanında; ürün/sipariş no araması; tek birincil Yenile eylemi; Bağlantılar menüsünde pazaryeri/site ayarları. Küçük özet, renksiz kaynak etiketleri, kapalı ayrıntılar ve görünür hata özeti. İzole örnek kayıtlarla 1000×700 görünüm, kaynak filtresi, arama, boş sonuç ve hata özeti doğrulandı. Sipariş verisi değiştirilmedi.

23.10.2026 kullanıcı tercihi: açılır seçim ve menü kullanılmayacak; seçenekler düzenli, ayrı ve görünür düğmeler olacak. Siparişler: pazaryerleri ilk, dört web sitesi ikinci sırada. Seçili kaynak belirgin. Web siteleri ve pazaryeri ayarları doğrudan düğme; bağlantı sonuçları sürekli görünür. Görünüm ve filtre/arama testleri geçti.

23.10.2026 — İki marka / altı kanal: Güner Ofis ve Makro Ofis marka düğmeleri; her satırda WEB SİTESİ, TRENDYOL, HEPSİBURADA, AMAZON, N11, ÇİÇEKSEPETİ. Açılır seçim yok. Güner web kaynağı imalattansumen.com; Makro web kaynakları sumentakimi.com + sumentakimi.com.tr. Derikutu aktif eşitlemeden çıkarıldı; geçmiş dosyalar korundu. Trendyol satıcı hesabı merkezi Güner kaydıyla eşleşti. Makro pazaryeri hesapları ve Amazon bağlı değil; bu seçimler bağlantı kurulmadı gösterir. Marka, kaynak, arama, boş durum ve Amazon bağlantısız durum testleri geçti; 1000×700 görünüm kontrol edildi.
Logolar: İş Merkezi/Logolar; dört platformun resmi favicon dosyası, N11 için https://commons.wikimedia.org/wiki/File:N11_Logo_2025.svg kaynağındaki marka görseli. Web için yerel küre simgesi. Uygulama açılışında dış görsel isteği yok.

## 23.10.2026 — Kullanıcının iş kuyruğu
- İşler → Yeni iş ekle: başlık/açıklama, yerel taslak, kuyruk durumu ve sonuç; bekleyen iş iptal edilebilir. Eski 445 kaynak iş otomatik görev değildir.
- Kayıt: İş Merkezi/Kayıtlar/is-kuyrugu.json; önceki sürümler Kayıtlar/Geçmiş. Aynı dosyada süreç kilidi, sürüm kontrolü ve idempotent kayıt. Testler ayrı work klasöründe; gerçek kuyruk boş.
- Araç: IsKuyrugu.exe list; claim ID REVISION; complete veya block ID REVISION SONUC_DOSYASI. Sonuç dosyası UTF-8. JSON elle değiştirilmez. Claim sonrası dönen revision kullanılır.
- Saatlik sohbet otomasyonu: i-merkezi-i-kuyru-u, aktif. Kuyruk değişmedikçe sessiz; tamamlanan iş veya gereken girdide bildirir. Yerel geri alınabilir işler uygulanır; dış hesap/yayın/mesaj/para işlemlerinde açık kullanıcı onayı beklenir.
- Doğrulama: kayıt, tekrar gönderim, claim çakışması, sürüm, tamamlama ve iptal testleri geçti. Gerçek WebView üzerinde formdan ekleme, liste, HTML kaçışı ve taslak temizliği geçti. Uygulama derlendi.

24.10.2026: Yönetici şifresi kullanıcının isteğiyle değiştirildi; merkezi erişim kaydı güncellendi. Eski yönetici oturumları kapatıldı. Yeni şifreyle HTTPS girişi doğrulandı.

24.10.2026: Ekip şifresi kullanıcının isteğiyle değiştirildi; merkezi erişim kaydı güncellendi. Eski ekip oturumları kapatıldı. Yeni şifreyle HTTPS girişi doğrulandı.

## 24.10.2026 — Ortak kuyruk ve sipariş bağlantı durumları uygulandı

- Masaüstü İşler ve Siparişler, 4196'daki aynı kimlik doğrulamalı web ekranlarını kullanır. Ekip/yönetici yetkileri sunucuda uygulanır. Masaüstü yönetici bağlantı ayarları açılırken oturum rolü tekrar doğrulanır.
- Tek kuyruk Ekip/Kayitlar/ekip.sqlite. IsKuyrugu.exe list JSON dizisi döndürür; claim-review/review/claim/complete/block ortak server.py'ye yönlenir. Eski QueueStore yazmaya kapalı. Geçişte eski JSON kayıt sayısı 0, ortak kayıt sayısı 0; veritabanı tutarlı yedeği arşive alındı. Kaynak iş listeleri otomatik görev yapılmadı.
- scopeVersion ve approvedScope: onay title/details/review/sürüm kapsamına bağlı. Ekip notu onay değildir. Düzenleme, bilgi ekleme ve yeniden inceletme önceki onayı kaldırır; çalışan/incelemedeki kapsam değiştirilemez. İptal ve bütün geçişler denetim kaydına yazılır.
- Saatlik i-merkezi-i-kuyru-u talimatı aynı agent ve sıklık korunarak tek kuyruğa güncellendi; eski JSON'u uygulamaz. Yönetici onayı olmadan claim reddedilir.
- Sipariş bağlantı durumu siparisler.json içinde connectionStates ile aynı atomik kayıtta tutulur: kaynak, yapılandırma durumu, son deneme, son başarı, tarih kapsamı ve genel hata. Hata eski siparişleri/başarı tarihini silmez; sırlar istemciye taşınmaz. Güncel/Eski veri/Getirilemedi/Bağlı değil/Henüz kontrol edilmedi ayrılır; 15 dakikayı aşan başarı eski veri olur.
- Sipariş getirme ortak siparis-getirme.lock ile süreçler arasında kilitli; kaydetme kilit içinde biter. Web/masaüstü aynı yolu kullanır. Bağlı kaynaklardan canlı salt okuma yenilemesi başarılı. Yeni bağlantı veya dış sipariş değişikliği yapılmadı.
- Doğrulama: kuyruk rol/onay/sürüm/iki eşzamanlı claim; bilgi isteyen işin yeniden incelemesi; onaylı kapsam değişikliğinin claim'i engellemesi; CLI ortak kayıt ve onay engeli; HTTP oturum/CSRF/özel dosya/ayar-yayın engeli geçti. C# testinde gerçek sıfır/başarısız kaynak, son başarı koruma, kalıcılık ve dosya kilidi geçti. Masaüstü derlendi ve ortak ekranın açıldığı görüldü. İzole tarayıcıda ekleme/düzenleme/yeniden gönderme ve iki firma bağlantı durumları doğrulandı. Gerçek kuyruğa test işi eklenmedi.
- Online panel yeniden başlatıldı; geçici adresin güncel değeri Ekip/Kayitlar/runtime.json içinde. Panel kapanınca dış erişim kesilir; ortak yerel servis masaüstü için açık kalır. Gerekirse masaüstü ortak servisi başlatır; Windows başlangıç kaydı eklenmedi.


## Agent kayıt yöntemi — 24.10.2026

Kullanıcı görevi tek ana iştir. Bulguları ve küçük düzeltmeleri aynı kimliğin altında `parentId` ile alt iş olarak ekle; ayrı ana kayıt üretme. Küçük tek adımlı işi uzun kayda dönüştürme. Sonuç `Özet: ...` satırında 1–2 cümle; gerektiğinde teknik geçmiş Ayrıntılar altında. Biten iş Tamamlandı olarak kapanır.

- Yerel adres: `http://127.0.0.1:4196`. `GET /api/session` yerel oturum çerezini ve `csrf` döndürür; şifre veya ekip girişi yoktur.
- Aynı çerezle `GET /api/jobs` mevcut kayıtları döndürür.
- Yazmalarda `Origin: http://127.0.0.1:4196`, `Content-Type: application/json` ve `X-CSRF` zorunludur.
- `POST /api/add`: `id` (32 küçük hexadecimal UUID), `title` (3–160), `details` (en fazla 12000), `author` (2–80), kısa `summary` (280), gerekirse `parentId`, `need` (400) ve `status` (active/needs_user/completed). Yanıt kimliği geri okunur; tekrar çağrıda aynı id kullanılır.
- `POST /api/update`: `id`, güncel tamsayı `revision`, `status` (active/needs_user/completed/cancelled), kısa `summary`, gerekiyorsa `need`, korunmuş `note` (en fazla 12000), isteğe bağlı `plannedFor`. Eski CLI için `workStatus` alanı korunur. Açık alt iş varken kapanış reddedilir. Anlamlı değişiklikte tarihli `Özet: ...` ekle; her adımı yazma. Tamamlandı kaydı kapanır; çalışan/onaylı GPT uygulaması bununla gizlenmez.
- Tek yerel kullanıcı yönetici yetkisine sahiptir. Bu, agentın onay vermesi için yetki değildir. `/api/approve` yalnız kullanıcının somut açık onayıyla kullanılabilir. İnceleme/claim/onay sınırları korunur.
- `IsKuyrugu.exe list` aynı kayıtları döndürür. Agent claim-review/review ve onaylı claim/complete/block için CLI kullanır; SQLite doğrudan değiştirilmez.


İncelenen kayıt yolları: Hub.cs (masaüstü), Ekip/index.html (form ve durum), Ekip/server.py (roller, sürüm, denetim ve onay), Ekip/modules.py ve Bridge.cs (kaynaklar), QueueCli.cs ve QueueStore.cs (ortak/kapalı eski kuyruk), Services.py (Instagram servisleri). Eski ürün/iş kaynağı `İş Takip/src/data.json`, ortak yürütme kaydı `Ekip/Kayitlar/ekip.sqlite`; ikisi aynı şey değildir. Bu inceleme bütün ayrı programların işlev testinin tamamlandığı anlamına gelmez.

## Instagram hikâye dili — 24.10.2026

İş a730c8367cd84c919d872a856cf23264. Instagram → Güner ve Makro sayfalarına tek şablonlu üçer ürün tasarım önizlemesi eklendi. Post tasarımı Karar verilecek. Kaynak: Instagram Profil Önizleme/plan.html ve guner.html; marka Teslim.json ve ortak sosyal medya rehberi. Kullanıcı tasarım kararı bekleniyor; yayın yok.

## 24.10.2026 — İşlev kontrolü ve işlerin ayrılması

İş kimliği: 05c6cb31daca4503b8708084ebfccc4e. Sorumlu: programlar-devir sohbeti. Durum: arayüz uygulandı; plan günü servis yeniden başlatmasını bekliyor.

- Açık işler varsayılan; Bugün, Geciken, Onay bekleyen, Bilgi gereken, Tamamlanan, İptal edilen ve Tümü ayrı sayılı düğmeler. Bugün yalnız plan günü bugün olan açık işlerdir. Başlık/ayrıntı dışında düzenleme alanları ilgili karttan açılır.
- Ekip tamamlandı durumu açık listeden ayrılır; GPT uygulaması/onayı ayrı tutulur. Onaylı veya çalışan GPT işi ekip tamamlandı seçilerek gizlenmez. İptal edilen tamamlanan sayılmaz.
- Geçmiş iş ve ürün kayıtları kaynak tarihiyle ayrıldı. Eski eksik notu güncel iş etiketi değildir. Aynı ürün açıklamasında yinelenen kaynak notu bir kez gösterilir. Kaynak veri veya canlı ürün alanı değişmedi.
- Bilgi Girişi: Eksik/Tamamlanan/Tümü. Masaüstü filtre ve bilgi seçimlerinde görünür düğmeler. Eski kapalı kuyruk formu etkinleştirilmez.
- Aramada ön filtreleme nedeniyle kayıtların geri gelmemesi düzeltildi. Boş Instagram planı açıkça yazılır. Raporlarda yeni tarihler önce; sipariş özeti kayıtlı veri olarak etiketlenir.
- plannedFor alanı ve tarih doğrulaması kaynakta hazır. Yeni servis bu alanı ortak veritabanına ekler; eski istemci not güncellemesi planı silmez. Eski servis algılandığında tarih girişi kapalı ve yeniden başlatma gereği görünür.

| Kontrol | Sonuç |
|---|---|
| İş ekleme, plan günü, Bugün, tamamlandı ayrımı | İzole tarayıcı ve API testinde geçti |
| Rol, onay, kapsam, iki agent claim, CLI, CSRF | Testler geçti |
| Kontrol notu / ürün bilgisi yazma, tekrar okuma, sürüm çakışması | İzole Node servisinde geçti; gerçek ürün bilgisine test yazılmadı |
| Sipariş tarih/tutar/iptal/iade/tekrar, sıfır-hata ayrımı ve dosya kilidi | Testler geçti; yeni canlı sipariş işlemi yapılmadı |
| İşler, Geçmiş, Ürünler, Bilgi, Siparişler, Instagram iki marka, Sohbetler, Raporlar | Web ekranları açıldı; kaynak/boş/bağlı değil ayrımları görüldü |
| Sohbet WhatsApp/Meta ayrıştırması | Sentetik mesaj, Türkçe ve sıralama geçti |
| Masaüstü tam etkileşim kontrolü | Araç pencere görüntüsünü başka uygulamadan verdi; güvenilir tam test tamamlanmadı |
| Instagram yayın/iletim, profil düzenleme; gerçek sipariş/hesap işlemleri | Çalıştırılmadı; dış işlem kapsamı değil. Instagram tarafında başka çalışmanın değişiklikleri görüldü, üzerine yazılmadı |

Engel: çalışan 4196 servisinin yeniden başlatılması otomatik onay denetimince engellendi (ayrıntılı gerekçe yok). Yeniden başlatma yapılmadı; eski servis çalışıyor. Plan günü kaynakta ve testte hazır, gerçek kullanımda henüz etkin değil. İş bu nedenle tamamlandı işaretlenmedi. Masaüstünde açık eski sayfalar yenilenince dosya değişikliklerini alır. Bu kayıt tüm bağımsız masaüstü programlarının eksiksiz kontrol edildiği iddiası değildir; kontrol İş Merkezi birleşik kapsamındadır.

## 24.10.2026 — Kısa kartlar ve ekran yükü
- Ana liste: başlık, durum, son nottan en çok 150 karakter, plan günü ve Detaylar. Uzun kapsam, GPT incelemesi/sonucu ve not geçmişi yalnız detay penceresinde. Geçmiş silinmedi.
- Durum, plan ve kısa not girişleri detayda üstte; uzun geçmiş ayrı açılır bölümde. Yeni not mevcut geçmişe tarihli eklenir. Yetki ve revision denetimi korunur; hatalar detay içinde görünür.
- Performans: 15 kartlık sayfalama, aramada 120 ms bekleme, yalnız seçilen iş için editör, ekran dışı kartlarda ertelenmiş çizim. İzole 17 uzun kayıt testinde listede 15 kart, 120 öğe, 0 editör. Önceki 100 not satırı ve eklenen kısa not API üzerinden doğrulandı.
- Yerel /api/jobs beş ölçüm: 7.4 / 4.0 / 4.6 / 4.4 / 5.7 ms; 6 kayıt, 21 KB. Bu ölçüm sunucunun gecikme kaynağı olduğunu göstermedi; online erişim kapatılmadı. Genel bilgisayar kasmasının tamamen bittiği iddia edilmez.
- Güncelleme index.html dosyasında; servis yeniden başlatmadan sayfa yenilemesiyle alınır. Önceki plan günü servis engeli ayrı olarak sürüyor.

## Kısa özet ve takip düzeni — 24.10.2026

İş: 48a6260bdf444045b87ebce73f629875. Kartlar yalnız açıkça yazılmış Özet satırını gösterir; uzun teknik notlar kesilip karta taşınmaz. Geçmiş Ayrıntılar altında korunur. Ekip Tamamlandı işleri kapananlarda gösterilir; çalışan/onaylı uygulamalar gizlenmez. Ürün kaynağındaki istenmeyen karşı malzeme ID/fiyatı açıklaması 65 kayıttan kaldırıldı.

## Yalnız yerel kullanım — 24.10.2026

İş: bb865a55099d4464a23f6ff1b1ca3359. Ekip/şifre ekranı, isim girişi, Online ekip düğmesi kaldırıldı. Eski Panel.pyw yalnız yerel uygulamayı açar. Sunucu yalnız loopback kabul eder; yabancı Host, Origin, proxy başlıkları reddedilir. CSRF ve kullanıcı uygulama onayı korunur. Yerel oturum/dış erişim/ekip girişi ve kapanış testleri geçti; program derlenip servis yenilendi.


## Bugün ve plan günü doğrulaması — 24.10.2026

İş: 05c6cb31daca4503b8708084ebfccc4e. Bugün filtresi ve plan seçimi 11 izole API/JavaScript kontrolünden geçti. Yeni işler bugüne yazılıyor; eski tarihsiz ve bitmiş işler Bugün dışında. Gerçek açık işlerde bugün tarihli 0, tarihsiz 24 kayıt var; toplu tarih atanmadı.

Çalışan 4196 servisinde planning=true. Ayrı 14296 servisi/veritabanında mevcut app.js işleyicileriyle yeni kayıt, Bugün filtresi ve tarih seçme/kaldırma doğrulandı. Kod değişmedi; gerçek kayıtlara test veya toplu tarih yazılmadı. Görsel tarayıcı testi araç isteğinin cross-site başlığı nedeniyle yapılamadı; yerel erişim koruması korundu. Önceki servis engeli tarihsel kayıttır.

26.10.2026 Özet: Instagram gerçek yayın durumları, kanıt bağlantıları ve yayın saatleri plan saatlerinden ayrıldı. 12 kayıt eşleştirildi; 26 Ekim dört içerik onay bekliyor. Çalışan Moduller/Instagram Profil Önizleme ve bağımsız kopya güncellendi. API koruma/no-op testleri ve iki ekran doğrulandı. Sonuç Takibi.csv ve teslim kayıtları aynı durumları taşır. Makro bağlantı engeli açık; Grok son kontrolü bekleniyor.

## Kullanıcı özeti

İş Merkezi sadeleştirildi ve kontrol edildi. Ana işler alt işleriyle birlikte tutulur; karar gereken konu üstte, uzun geçmiş Ayrıntılar’dadır. Tarih, sayaç, dosya açma ve ortak kontroller düzeltildi. Kaynaklı skill kuruldu; yeni otomatik takip eklenmedi. Güner Ofis ve Makro Ofis ürünleri görsel, ad, firma ve fiyat sırasıyla aynı listededir. Güner’in 156 web siparişi kendi sitesinden, Sümen TR’nin geçmiş dahil 150 siparişi eksiksiz alınır. Sipariş ekranı açıldığında yenilenir; mevcut kanal düğmeleri korunur.

## Kullanıcı özeti — 04.11.2026

Güner ve Sümen TR Shopify satışları Siparişler ekranında ayrı ve toplam görünür. Açılışta ve Yenile düğmesiyle güncellenir; geçmiş tarih ve tekrar kayıt kontrolleri tamamlandı.
