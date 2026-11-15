# sweb

`site-plani.md` içindeki karara göre kurulan mağaza sitesi.
Next.js (App Router) · TypeScript · Tailwind v4 · Vercel.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
npm run typecheck

npm test                  # birim testleri (saf mantık)

npm start                 # ayrı terminalde
npm run qa                # yayın öncesi kontrol (QA_URL ile port değişir)
```

## Yapı

```
app/                 route'lar (App Router)
  page.tsx           anasayfa — duvar
  kategori/          dizin + [...dilim] (iç içe kategori)
  urun/[slug]/       ürün sayfası
  ara/               katalog araması (?s=)
  duvar-kur/         kendi duvarını kur (durum adres çubuğunda)
  tasarla/           tasarımını anlat → ürün + fiyat
  siparis/[jeton]/   müşterinin kendi sipariş durumu
  koleksiyon/ kurumsal-teklif/ atolye/ iletisim/
  sepet/ odeme/ odeme/tesekkurler/
  api/               siparis, teklif, iletisim, tasarim (sunucu doğrulaması)
  error.tsx global-error.tsx loading.tsx
  <5 hukuki sayfa>/  metin bekliyor
  globals.css        TOKEN SETİ — tek doğruluk kaynağı
  sitemap.ts robots.ts icon.png not-found.tsx
components/
  duzen/             Kap, Baslik, Etek
  kategori/          UrunKarti, Kirinti, Siralama
  sepet/             SepetSayaci, SepetListesi
  odeme/             OdemeAkisi
  form/              Form, MetinAlani, TeklifFormu, IletisimFormu
  gizlilik/          CerezBandi, CerezAyariBaglantisi
  hukuki/            HukukiSayfa
  ui/                Buton, Alan, Mono, Bolum, SpecTablosu, UrunGorseli, RenkNoktalari
  duvar/             Duvar + duvar.module.css
  urun/              UrunSecim
lib/
  urunler.ts         ürün veri sözleşmesi (CMS'e bağlanacak)
  arama.ts           Türkçe kök alma + katalog eşleşmesi (arama ve brif ortak)
  duvar-kur.ts       duvar kurucu durumu ve adres kodlaması
  son-bakilanlar.ts  tarayıcıdaki gezinme izi (sunucuya gitmez)
  depo.ts            Supabase kapısı — tek istemci, gizli anahtarlı yazma
  siparis-deposu.ts  sipariş kaydı ve jetonla okuma
  eposta.ts          e-posta gönderimi (sağlayıcı anahtarı yoksa yalnız log)
  kategoriler.ts     kategori ağacı, yol çözümleme, sıralama
  sepet.tsx          sepet durumu (localStorage, sekmeler arası eşlenik)
  cerez.tsx          çerez izni durumu
  dogrula.ts         form kuralları — istemci ve sunucu aynı dosyayı kullanır
  teslimat.ts        kargo ve ödeme seçenekleri
  istek-siniri.ts    kaba istek freni + bot tuzağı
  uretim.ts          üretim yetenekleri — yapay zekânın sınırı
  tasarim.ts         brif tipi, sistem talimatı, katalog eşleşmesi
  duvar.ts           ızgara kuralı + başlangıç sırası
  renkler.ts         sabit renk listesi
  bicim.ts           fiyat / ölçü / ağırlık / teslim biçimleri
  fonts.ts site.ts
public/urunler/          <kod>.webp — 80 ürün, orijinal boyutta
public/kategori/         <slug>.webp — kategori kapağı (şu an yalnız ofis)
                         <kod>-<renk>.webp — sekiz renk çekimi olan 5 ürün
public/urunler-bekleyen/ kodu belirsiz 9 görsel, kataloğa bağlı değil
testler/               birim testleri (node:test, npm test)
araclar/render_urun.py katalog kodunu siler, oranı korur
araclar/renk_sayfasi_bol.py  sekiz renkli sayfayı tek ürün görsellerine böler
araclar/ofis_gorselleri.py   ofis birinci serisinin tekil çekimlerini webp'e çevirir
araclar/ofis_ikinci_seri.py  ikinci seriyi set fotoğrafından keser
araclar/renk_sayfasi_bol2.py + buyuk.py  kodu basılı sekiz renkli sayfaları böler
araclar/qa.mjs         yayın öncesi kontrol
```

## Kurallar

- **Token.** Renk ve ölçü değeri component içine elle yazılmaz; `app/globals.css`
  içindeki `@theme` bloğu tek kaynaktır. Kök dizindeki `tokens.css` faz 0'dan
  kalan referanstır, build'e girmez.
- **Yüzey.** Köşe yuvarlaması ve gölge global olarak kapalı. Ayırıcılar kesikli.
- **Ölçek.** 12/14/16/20/26/34/46. Başka basamak eklenmez.
- **Mono.** Ürün kodu, ölçü ve fiyat her yerde mono.
- **Sayı.** Biçimlendirme yalnız `lib/bicim.ts` üzerinden.
- **Dil.** Ürün adı işlevle başlar. Buton fiille başlar ve akış boyunca aynı
  kelimeyi taşır. Yasak: eşsiz, muhteşem, premium, lüks, özel tasarım.

## Duvar

| Ekran | Izgara | Merkez | Görünen kare |
|---|---|---|---|
| ≥1440 | 6×6 | 4×4 | 21 |
| 768–1439 | 5×5 | 3×3 | 17 |
| <768 | 4×4 | 2×2 | 13 |

Tek liste render edilir; kırılım geçişi yalnız CSS ile yapılır
(`duvar.module.css` içindeki `nth-child` kuralları), böylece resize dinleyicisi
ve hydration uyuşmazlığı olmaz.

Yer değiştirme **View Transitions** ile 320ms sürer. Plandaki "320ms FLIP"
niyeti korunur; klasik transform-FLIP merkez ↔ çevre boyut farkında içeriği
bulanıklaştırdığı için tercih edilmedi. Desteklemeyen tarayıcıda değişim anında
olur, işlev korunur. `prefers-reduced-motion` her iki yolda da kapatır.

Çevre kareleri `<button>`, merkezdeki başlık `<a href>`. Enter ile değişir,
`aria-live` duyurur, yer değiştirme geçmişe yazılmaz. Renk seçimi URL'e yazılır
(`/?renk=lacivert`) ve geri tuşuyla dönülür.

## Kategori ağacı

İki seviye. `lib/kategoriler.ts` içindeki `ust` alanı bir kategoriyi alt
kategori yapar; başka değişiklik gerekmez. Route `/kategori/[...dilim]`,
yalnız kanonik yolu kabul eder — `/kategori/mutfak/kahve` açılır,
`/kategori/kahve` 404 verir, aynı içerik iki adreste görünmez.

Şu an tek iç içe örnek `mutfak → kahve` (7054, 7055); mekanizmayı
doğrulamak için kondu, ağacın gerçek şekli senin kararın. Bir kategori hem
kendi ürünlerini taşıyabilir hem alt kategorisi olabilir.

Sıralama (`?sirala=ad`) URL'e yazılır. Fiyata göre sıralama, fiyatlar
girilmeden anlamsız olacağı için eklenmedi.

## Sepet ve ödeme

Sepet tarayıcıda (`localStorage`) duruyor; satır yalnız kod, renk ve adet
tutuyor, ad/fiyat/görsel her açılışta katalogdan tazeleniyor — böylece eski
fiyat sepette donup kalmıyor. Sekmeler arası eşleniyor. Sayaç yalnız mount
sonrası basılıyor, sunucu çıktısıyla uyuşmazlık olmuyor.

`POST /api/siparis` formu **sunucuda yeniden doğruluyor** ve her kalemi
katalogdan yeniden fiyatlıyor; istemciden gelen fiyat kullanılmıyor.
Sipariş **ödeme sağlayıcısından bağımsız olarak önce kaydediliyor** —
yalnız loga düşen sipariş kaybolur. Kayıt bir jeton döndürüyor, müşteri
`/siparis/<jeton>` adresinden durumunu görüyor; aynı bağlantı e-postaya da
giriyor. Bu sayfa **ad, telefon ve açık adres göstermiyor** (yalnız
il/ilçe): bağlantı sızsa bile müşterinin kimliği sızmıyor, veritabanı
fonksiyonu o sütunları zaten döndürmüyor. Depo kapalıysa akış eski teşekkür
sayfasına düşüyor, sipariş yine alınıyor.

Ödeme sağlayıcısı hâlâ bağlanmadı; `TODO(faz 4b)` bloğu değişince akışın
kalanı aynı kalıyor.

Form hataları `:user-invalid` ile yalnız kullanıcı alandan çıktıktan veya
gönderdikten sonra görünüyor; yazarken erken uyarı çıkmıyor. Aynı kurallar
`lib/dogrula.ts` üzerinden hem istemcide hem sunucuda çalışıyor.

Formlarda ekrandan ve sekme sırasından çıkarılmış bir bot tuzağı var;
doluysa istek sessizce başarılı sayılıyor. API route'larında dakikada 8
istek freni var — sunucusuz ortamda her örnek kendi sayacını tuttuğu için
bu kaba bir fren, mutlak koruma değil; sağlayıcı bağlanırken Vercel
Firewall ya da paylaşımlı bir sayaç eklenmeli.

## Çerez izni

Ölçüm ve pazarlama çerezleri izin verilene kadar yüklenmiyor (KVKK ve GDPR
ikisi de önceden izin istiyor). Reddetmek kabul etmek kadar kolay, tercih
etekten her an geri alınabiliyor. Analytics eklendiğinde `useCerez().izinler`
kontrol edilerek yüklenmeli.

## Kontrast düzeltmesi

Faz 0 paletinin iki rengi WCAG AA'yı geçmiyordu: `--ikincil` #8A7866 krem
üzerinde 3.77:1, `--taba` #A9743F 3.56:1 (gereken 4.5:1). Ton korunarak
koyulaştırıldı — #6E6052 → 5.41:1, #825931 → 5.46:1. Metin olmayan yerler
(renk noktası çerçevesi) özgün tabayı `--taba-dolgu` ile kullanmayı sürdürüyor.
`tokens.css` ve `styleguide.html` hâlâ eski değerleri gösteriyor; onay verirsen
güncellerim.

## Tasarımınızı gönderin (`/tasarla`)

Müşteri istediği ürünü kendi cümleleriyle anlatıyor, forma/malzemeye/özelliğe
göre kriter işaretliyor. Gönderdiğinde bekleme ekranına geçiyor: yaklaşık 30
saniyelik ilerleme çubuğu ve **hemen altında** brifle eşleşen mevcut ürünler —
boş ekran beklemiyor, o sırada hazır ürünlerden seçebiliyor.

**Yetenek listesi tek kaynak.** `lib/uretim.ts` formları, malzemeleri,
özellikleri, ölçü sınırını ve **yapmadıklarımızı** tutuyor. Yapay zekânın
sistem talimatı bu dosyadan üretiliyor (`sistemTalimati()`), yani yetenek
değişince talimat da değişiyor — ikisi ayrışmıyor. Sayfadaki "Yapmadıklarımız"
kutusu da aynı listeden geliyor.

**Katalog eşleşmesi çalışıyor**, yapay zekâ gerekmiyor: brif kelimelere
ayrılıp Türkçe ekleri atılıyor, ürün adı 5, açıklama 2, kategori 1 puan
alıyor, seçilen formun örnek ürünlerine 3 puan ekleniyor.

**Sağlayıcı bağlı değil.** `TASARIM_SAGLAYICI_ANAHTARI` tanımlıysa
`oneriUret()` çağrılıyor; değilse talep sıraya alınıyor ve müşteriye e-posta
ile dönüleceği söyleniyor. Uydurma ürün ve uydurma fiyat döndürülmüyor —
yanlış fiyat vermek, fiyat vermemekten pahalı.

## Faz durumu

- [x] 0 — token + styleguide
- [x] 1 — iskelet
- [x] 2 — duvar (36 ürün bağlı)
- [x] 3 — kategori ağacı + ürün şablonu
- [x] 4 — sepet / ödeme / teklif gönderimi
- [x] 5 — form gönderimi + çerez izni + hukuki sayfa yapısı (metin bekliyor)
- [x] 6 — SEO / performans / erişilebilirlik
- [x] 7 — QA + yayın (Vercel, alan adı bekliyor)

## Görsel hattı

```bash
python3 araclar/render_urun.py <kaynak-klasor> public/urunler
```

**Render'a dokunulmuyor.** Ne kırpma var, ne oran değişikliği, ne de görselin
içine gömülen boşluk. Tek yapılan sol alttaki gömülü katalog kodunu silmek —
uygulama kodu kendi bandında zaten yazıyor, ikisi birden görünmesin. Silme,
kutunun hemen üstündeki temiz zeminin düşey aynasıyla; yamanın genişliği ürüne
değmeyecek şekilde görsel başına seçiliyor, sağ kenarı maskeyle karışıyor.

Boşluk görselin içinde değil, **yerleşimde**: duvar karesi ve kartlar görsel
alanı ile yazı bandını ayrı satırlara koyuyor, görsel `object-fit: contain`
ile hiçbir koşulda kırpılmıyor. Farklı oranlı render (7024, 5:4) da
kırpılmak yerine zemine yaslanıyor.

Çıktı `<kod>.webp`.

Kaynak → kod eşlemesi için kaynak klasöre `kodlar.txt` konur
(`dosya.png = 7047` satırları); dosya adında 4 haneli kod varsa gerek yok.

**Format:** Plan `.png` diyordu, `.webp` yazıldı. Aynı görseller PNG olarak
ortalama 1,9 MB, WebP q92 olarak 198 KB — 10 kat fark, gözle ayırt edilmiyor.
Next/Image zaten AVIF/WebP servis ettiği için PNG kaynak yalnız depoyu
şişiriyordu. Geri dönmek isterseniz `render_1x1.py` içinde tek satır.

## Açık konu — tekrar eden kodlar

`Ürün Main` klasöründeki 29 render'da gömülü kodlar tekil değil:

| Gömülü kod | Kaç görsel | Ne oldukları |
|---|---|---|
| 7006 | 3 | koltuk arkası organizeri · cep boşaltma kutusu · bardaklıklı vale tepsisi |
| 7013 | 2 | tezgâh altı çanta askısı · duvar kancaları |
| 7016 | 2 | küp saklama kutusu · dikdörtgen saklama kutusu |
| yok | 2 | ince çekmece seti · numaralandırılmış set içeriği şeması |

Bunlar farklı ürünler; aynı kodu taşıyorlar. Kod, URL'de ve duvarda
kimlik olarak kullanıldığı için tahminle atanmadı. Dokuzu da işlendi ama
`public/urunler-bekleyen/` içinde duruyor, kataloğa bağlı değil; dosya
adları geçici (`7006a`, `7006b`, `7006c`, `7013a`, `7013b`, `7016a`,
`7016b`, `kodsuz-01`, `kodsuz-02`). Doğru kodları verirsen yeniden
adlandırıp kataloğa eklerim.

Not: `kodsuz-02` aile çekimi değil, numaralandırılmış bir set içeriği
şeması — duvar karesi olmaya uygun değil, ayrıca değerlendirilmeli.

## Bekleyenler (Faris'te)

- **Ölçü, ağırlık, fiyat, teslim süresi, stok** → `lib/urunler.ts`. Şu an
  `null`; arayüzde "—" görünüyor ve fiyat girilmeden ürün JSON-LD'sine
  `Offer` yazılmıyor. Uydurulmadı.
- **Ad ve kategori onayı.** Adlar render'lardan okundu, plandaki kurala göre
  yazıldı (işlevle başlar, sıfat yok, küçük harf). Yedi kategori: banyo (6),
  mutfak (6), makyaj (4), giriş (8), çalışma (4), yatak odası (3), ev (5).
  Kategori ağacı plana göre sonra kurulacak; 7003 (araç) ve 7004 (evcil
  hayvan) şimdilik "ev" altında duruyor, kendi dallarını hak ediyorlar.
- **Renk seçeneği onayı.** Her ürüne sekiz rengin tamamı verildi; bazı
  render'larda yedi varyant sayılıyor (7025, 7041).
- **Tekrar eden kodlar** — yukarıdaki tablo.
- **Renk noktası için tekil render.** Ayrıntı aşağıda.
- Hukuki metinler (5 sayfa) ve atölye sayfası metni — sayfa yapısı,
  bölüm başlıkları ve içindekiler hazır, yalnız metin giriliyor
- **Ödeme sağlayıcısı** seçimi (iyzico, PayTR, Stripe…) → `app/api/siparis/route.ts`
- **E-posta servisi** (Resend, Postmark…) → `api/teklif`, `api/iletisim`, `api/tasarim`
- **Tasarım sağlayıcısı** → `app/api/tasarim/route.ts` içindeki `oneriUret()`.
  Metin modeli ürün önerisini ve fiyatı, görsel modeli konsept görselini
  üretecek. Fiyat formülü (malzeme + ölçü + adet → birim fiyat) senin maliyet
  verinle kurulacak.
- **Üretim yetenekleri onayı** → `lib/uretim.ts`. Şu an kataloğdan okunan
  aralıklar; form listesi, ölçü sınırı ve "yapmadıklarımız" senin onayını
  bekliyor. Yapay zekânın müşteriye ne vaat edebileceğini bu dosya belirliyor.
- **Kargo ücretleri ve süreleri** → `lib/teslimat.ts`
- **Sipariş kaydı** — şu an kalıcı kayıt yok, yalnız log
- Alan adı. Yayın: https://sweb-phi.vercel.app · `NEXT_PUBLIC_SITE_URL`
  varsayılanı buna ayarlı, kendi alan adın bağlanınca değiştir.

## Açık konu — renk noktası

Plan: "Üstte 8 renk noktası: duvarın tamamı o renge geçer." Eldeki
render'lar aile çekimi: tek karede sekiz rengin hepsi birden var. Bu yüzden
renk noktası şu an yalnız karenin zeminini değiştiriyor, ürünlerin rengini
değiştiremiyor.

Özelliğin planlandığı gibi çalışması için ürün başına sekiz tekil render
gerekiyor: `<kod>-<renk>-1x1.webp`. Veri sözleşmesi buna hazır; `gorsel`
alanı tek yol yerine renk → yol eşlemesine dönüşür.

Alternatif: renk noktası ürün sayfasında kalır, duvarda kaldırılır.

## Arama

`/ara?s=` — sunucuda üretiliyor, paylaşılabiliyor, geri tuşuyla dönülüyor.
Dizin `lib/arama.ts` içinde modül yüklenirken bir kez kuruluyor; 36 ürün
için ağ turu ya da arama servisi gerekmiyor.

Puan: ürün kodu tam yazılırsa 40 (o ürün her zaman başa gelir), kod parçası
12, ürün adı 5, açıklama 2, kategori 1, renk 1. Önek eşleşmesi ("kahv" →
"kahve") yarım puan alıyor — yarım kelime tam kelimeyi geçmiyor. Aynı
kelime bir üründe en ağır alandan bir kez sayılıyor. Eşit puanda kod
sırası; sonuç sırası her istekte aynı.

Türkçe kök alma ve durdurma listesi tasarım brifiyle **aynı dosyadan**
geliyor; iki yer ayrı ayrı ek atmıyor.

Sonuç yoksa `/tasarla` öneriliyor. Arama sayfaları `noindex, follow` —
içerik zaten kategori ve ürün sayfalarında.

## Renk görünümü

Kategori ve koleksiyon `?renk=` kabul ediyor: liste o renkte üretilen
ürünlere daralıyor, kart zeminleri o renge dönüyor. Duvardaki renk
seçimiyle aynı kural — URL'e yazılıyor, geri tuşu çalışıyor. Ürünlerin renk
listesi daraldığında süzgeç kendiliğinden anlam kazanıyor; şu an tüm
ürünler sekiz rengin hepsinde.

## E-posta

`lib/eposta.ts` tek kapı. `EPOSTA_ANAHTARI` tanımlıysa sağlayıcıya HTTP ile
gidiyor (paket eklenmedi), değilse yalnız log düşüyor. Gönderim başarısız
olsa da akış durmuyor — sipariş ve talep zaten kayıtlı. `EPOSTA_BILDIRIM`
tanımlıysa atölyeye kopya gidiyor.

Ortam değişkenleri: `EPOSTA_ANAHTARI`, `EPOSTA_GONDEREN` (doğrulanmış alan
adı), `EPOSTA_BILDIRIM`.

## Test

`npm test` — saf mantık: doğrulama, arama ve kökleme, kategori ağacı,
katalog bütünlüğü (kod/slug benzersizliği, görsel yolu, ad kuralı, renk
listesi), duvar ızgarası ve biçimler. Sunucuya bağlı dosyalar test
derlemesine girmiyor.

`npm run qa` — çalışan siteye karşı: sitemap'teki her sayfa 200, iç
linkler, axe WCAG 2.1 AA (1400px ve 390px), uçtan uca sipariş **ve sipariş
sayfasında kişisel veri sızmadığının kontrolü**, arama, çerez bandı,
konsol.

## Duvarını kur (`/duvar-kur`)

Müşteri kendi ızgarasını (3×3 – 6×6) kuruyor: hücreye basıyor, ürünü ve
rengini seçiyor. Sağdaki liste aynı ürün+renk hücrelerini tek kaleme
topluyor, tek adımda sepete geçiyor.

**Durum tamamen adres çubuğunda** (`?n=4&h=7042.taba,,7005.krem`):
kurulan duvar bağlantı olarak paylaşılıyor, geri tuşu adımları geri alıyor,
hesap gerekmiyor. Sıkıştırma kütüphanesi eklenmedi — biçim kısa ve okunur.
Adres boşsa tarayıcıdaki son duvar geri yükleniyor, sekme kapanınca emek
kaybolmuyor. Bozuk adres parçası sessizce boş hücreye düşüyor; bağlantı
kurcalansa da sayfa açılıyor.

Yerleştirme **sürükle-bırak değil, "hücreye bas → seç"**: dokunmatikte ve
klavyede aynı akış çalışıyor, ayrı bir erişilebilirlik yolu yazmak
gerekmiyor. Her hücre `<button>`, adı hücre numarasını ve içindekini
söylüyor. Yerleştirme View Transitions ile duvarla aynı süreyi kullanıyor.

Toplam, kalemlerden biri bile fiyatsızsa `—` — eksik veri toplanmıyor.

## Komut paleti (⌘K / Ctrl+K)

Her sayfada. Ürün, kategori ve sayfa arasında geziniyor; ok tuşları seçiyor,
Enter gidiyor, Esc kapatıyor. Eşleşme tarayıcıda yapılıyor, ağ turu yok.
`/ara` sayfası duruyor: palet klavye kısayolu, arama sayfası paylaşılabilir
adres — ikisi de `lib/arama.ts` kullanıyor, sonuç sırası aynı.

Kutu `showModal()` ile açılıyor (odak içeride kalıyor), `closedby="any"` ile
dışına basınca kapanıyor; desteklemeyen tarayıcı için yedek var. Başlıktaki
arama alanında ⌘K ipucu görünüyor — kısayolun varlığı keşfedilebilir olsun.

## Son bakılanlar

Ürün ve sepet sayfasında şerit. Yalnız tarayıcıda duruyor, sunucuya gitmiyor,
çerez gerektirmiyor — bu yüzden izin bandına girmiyor. Satırda yalnız ürün
kodu var; ad, fiyat ve görsel her açılışta katalogdan tazeleniyor. Okuma
mount sonrası yapılıyor, hydration uyuşmazlığı olmuyor.

## Renk çekimleri

Beş ürünün (7062, 7063, 7065, 7066, 7067) sekiz rengi de çekilmiş; her
biri tek bir sayfada yan yana geliyordu. `araclar/renk_sayfasi_bol.py`
sayfayı `<kod>-<renk>.webp` dosyalarına bölüyor. Kutular ızgara üstünden
okunup görsel olarak doğrulandı; kenarlar zemin farkına göre daraltılıyor,
görsele boşluk **eklenmiyor** — kırpma kuralı değişmedi.

En alttaki büyük çekim komşularıyla aynı sütunlarda üst üste bindiği için
dikdörtgen kutu komşudan ince bir şerit alıyor. Şeridi zemine boyamak
denendi; düz gri dikdörtgen, bulanık arka plandan daha kötü göründüğü için
bırakıldı.

`lib/urunler.ts` içindeki `renkGorselleri` alanı ve `gorselFor(urun, renk)`
işlevi iki durumu tek yerden çözüyor: rengin ayrı çekimi varsa görsel
değişiyor, yoksa yalnız zemin renkleniyor. Duvar, kategori kartı, ürün
sayfası, sepet, sipariş sayfası ve duvar kurucu aynı işlevi kullanıyor —
renk davranışı tek yerden değişiyor.

Ürün sayfasında renk durumu `UrunGorunumu` içinde; görsel ve seçim tek
kaynaktan besleniyor. Renkten etkilenmeyen bölümler (ölçü tablosu, teklif
kutusu) sunucuda üretilip `children` olarak geçiyor, istemciye taşınmıyor.

## Bekleyen ürün kimlikleri

- **7064 (laptop ve evrak folyosu)** — bilgi sayfasında ürün kodu yok;
  seride boş olan 7064 geçici verildi. Ölçüler sayfadan okundu
  (360 × 275 × 25 mm), fiyat ve ağırlık hâlâ boş.
- Aynı sayfadaki dördüncü renk **"antrasit"**; palette karşılığı olmadığı
  için `gri` ile eşlendi. Palet mi genişleyecek, eşleme mi kalacak — karar
  Faris'te.

## Ofis koleksiyonu

Otuz sekiz ürün, üç seri:

**Kodlu seri (7085–7103)** — katalog kodu sayfaların üstünde basılı,
sekiz rengin tamamı çekilmiş. Laptop standı, tablet standı, kulaklık
standı, evrak rafı, dosya bölmelisi, not kağıtlığı, kartvizit rafı,
broşürlük, yaka kartı tepsisi, yazıcı standı, duvar evrak cebi, kablo
kanalı, masa altı çanta rafı, çöp kutusu, masa düzenleyici, cihaz dokları.
Bunlarda renk seçimi görseli de değiştiriyor.

Kodu bekleyen iki seri:

**Birinci seri (7101–7112)** — siyah gövde, kahve deri.
Renk listesi bu yüzden tek — olmayan seçenek gösterilmiyor. Sekiz renk
render'ı gelirse `renkGorselleri` alanı diğer ürünlerdeki gibi doldurulur.

On ürünün tekil çekimi vardı, yalnız webp'e çevrildi — kırpılmadı. Masa
pedi ve ikinci (derin) kare tepsi tekil gelmediği için numaralı set
görselinden kesildi.

**İkinci seri (7113–7122)** — gövdesi de deri kaplı, siyah çerçeve yok.
Evrak tepsisi, kare tepsi, dosya standı, kağıtlık, tablet standı, bölmeli
tepsi, okuma standı, kalemlik, mendillik ve dikdörtgen tepsi. Tekil çekim
gelmediği için hepsi set fotoğrafından kesildi; çözünürlük listede yeterli,
ürün sayfasında tekil çekim geldiğinde değiştirilmeli.

**Kategori kapağı.** `lib/kategoriler.ts` içindeki `kapak` alanı tanımlıysa
kategori sayfasının başında geniş görsel basılıyor, tanımsızsa hiç yer
kaplamıyor. Ürün çekimi değil kurulum sahnesi: koleksiyonun bir arada nasıl
durduğunu gösteriyor. Yükseklik `max-h` ile sınırlı — kapak sayfayı
yutmuyor.

**Renk süzgeci daraldı.** Kategori ve koleksiyon sayfasındaki renk noktaları
artık yalnız o listede gerçekten üretilen renkleri gösteriyor. Ofis
koleksiyonunda tek nokta çıkıyor; sekiz nokta gösterip yedisinde boş liste
vermek kimseye bir şey anlatmıyordu.

### Bekleyen

- **Kodlar.** Kodsuz iki serinin kodu hâlâ yok; blok **79xx**'e taşındı.
  Gerçek katalog kodları 70xx aralığında (7085–7103 sayfalarından okundu)
  ve geçici blok oraya girmiş, 7102/7103 çakışmıştı. Artık ayrık; bir test
  bu ayrımı koruyor.
- **İkinci serinin tekil çekimleri.** Şu an set fotoğrafından kesilen
  görseller kullanılıyor. Tekil render gelince `araclar/ofis_gorselleri.py`
  ile aynı kalitede değiştirilir.
- **Kağıtlık (7116).** Formdan okundu — üstü kapalı, önü boydan boya açık.
  İşlevi farklıysa ad ve açıklama düzeltilmeli.
- **Renk.** Her iki seri de tek kaplamayla çekildi; sekiz renk render'ı
  gelirse `renkGorselleri` diğer ürünlerdeki gibi doldurulur.

## Sekiz renkli sayfaların bölünmesi

`araclar/renk_sayfasi_bol2.py` — kodu basılı katalog sayfalarını
`<kod>-<renk>.webp` dosyalarına ayırır. Her ürün için kaba bir bölge
tanımlı; bölge içindeki en büyük bağlı bileşen ürünün kendisi sayılıp
kırpma onun sınırlarına göre yapılıyor, bölgeye giren komşu parçalar
zemine boyanıyor (`araclar/buyuk.py`). Böylece bölge geniş verilebiliyor
ve ürün kesilmiyor.

Sayfaların çoğu aynı düzende (üstte dört, ortada üç, altta bir büyük);
düzeni farklı olan üç sayfa ve kenar farkı zayıf iki çekim dosyanın
içinde ayrıca tanımlı. Otomatik eşik taraması denendi — tek bir eşik
bütün ürünleri ayıramadığı için bölge yöntemi tercih edildi.

Birkaç büyük çekimde komşu ürünün ince bir şeridi kadrajda kalıyor;
dikdörtgen kırpma ile kaçınılmaz, bulanık arka plan gibi okunuyor.
