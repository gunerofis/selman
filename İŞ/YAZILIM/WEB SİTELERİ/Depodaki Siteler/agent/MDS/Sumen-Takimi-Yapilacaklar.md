# Sümen Takımı — Geliştirme Yapılacakları

> Son uygulama: 27 Ağustos 2026  
> `[x]` tamamlandı, `[~]` kısmen tamamlandı veya iş kararı bekliyor, `[ ]` bekliyor.

## Son uygulama özeti

- 100 ürünün ürün türü ve SEO açıklaması tamamlandı; eksik SEO başlıkları dolduruldu.
- 699 ürün görseli ve 10 blog kapak görselinin alt metni tamamlandı.
- Eksik 66 SKU benzersiz kodlarla dolduruldu.
- 18 içerikli koleksiyonun görseli ve SEO alanları tamamlandı; koleksiyon adları ve iki sorunlu URL düzeltildi.
- Canlı tema güncellendi; ana sayfa ürün yükü azaltıldı, heading/kontrast/klavye odağı ve responsive görseller düzeltildi.
- Boş `frontpage` koleksiyonu kaldırıldı ve `/collections/all` adresine 301 yönlendirme doğrulandı.
- 100 ürüne model, malzeme, renk, parça sayısı ve kullanım alanı standardı uygulandı; bütün ürün kategorileri yaprak kategoriye taşındı.
- Search & Discovery içinde kullanım alanı, malzeme, model, parça sayısı ve renk filtreleri etkinleştirildi.
- 10 blog yazısına doğal iç bağlantılar ve eksik özetler eklendi; Unicode blog adresi ASCII adrese taşındı.
- Gülka Ofis Gereçleri konum adresi yapılandırılmış şehir, ilçe, posta kodu ve telefon alanlarına ayrıldı.
- Arama, sepet, slider ve ürün varyantlarında Enter/Space klavye desteği canlı temada doğrulandı.
- Bakım, kurumsal hediye, hukuk bürosu ve ölçü/parça seçimi konularında SEO alanları tamamlanmış 4 blog taslağı oluşturuldu.
- Lighthouse: Performans `44 → 53`, Erişilebilirlik `86 → 100`, SEO `92 → 100`, LCP `7,9 sn → 5,7 sn`, TBT `1,32 sn → 0,83 sn`.

Tarih: 27 Ağustos 2026  
Mağaza: `https://www.sumentakimi.com`

## Çalışma varsayımı

- Ürün varyantlarında stok takibi bilinçli olarak kapalıdır.
- Ürünler sonsuz stok mantığıyla satılacaktır.
- Stok takibini açmak veya stok adedi girmek bu çalışma listesine dahil değildir.

## 1. Ödeme ve dönüşüm hunisi

Mevcut son 180 gün özeti:

`888 oturum → 23 sepete ekleme → 21 ödeme sayfası → 2 tamamlanan sipariş`

- [ ] iyzico ile gerçek mobil test siparişi ver.
- [ ] Android Chrome üzerinde başarılı ödeme akışını test et.
- [ ] iPhone/Safari üzerinde başarılı ödeme akışını test et.
- [ ] 3D Secure başarılı, başarısız ve kullanıcı tarafından iptal edilen akışları test et.
- [ ] Başarısız kart ödemesinde gösterilen hata mesajını kontrol et.
- [ ] Başarısız ödeme sonrasında sepete geri dönüşün çalıştığını doğrula.
- [ ] `₺2.000` altındaki siparişte `₺200` kargo ücretini doğrula.
- [ ] `₺2.000` ve üzerindeki siparişte ücretsiz kargoyu doğrula.
- [ ] İndirim kodunun ödeme ekranında doğru çalıştığını test et.
- [ ] E-posta aboneliği karşılığındaki `%10` indirim vaadinin otomatik ve anlaşılır biçimde teslim edildiğini doğrula.
- [ ] Kargo adresi telefon numarası alanını en azından isteğe bağlı hâle getirmeyi değerlendir.
- [ ] Müşteri sipariş, ödeme, kargo ve iade bildirimlerini uçtan uca test et.
- [x] Aktif checkout yapılandırması ile taslak yapılandırmayı karşılaştır; iki yapılandırmada da özel override olmadığını doğrula.
- [ ] Kullanılmayan checkout taslağına açıklayıcı ad ver veya daha sonra temizleme planına al.
- [x] Ödeme sayfasına ulaşıp satın almayan kullanıcıların ayrıldığı adımı haftalık takip görevine ekle.

Hedefler:

- Ödeme sayfasından siparişe geçiş oranını önce `%20+`, ardından `%35+` seviyesine çıkarmak.
- Genel mağaza dönüşümünü önce `%0,5+`, ardından `%1+` seviyesine taşımak.

## 2. Mobil performans

Başlangıç ölçümü:

| Metrik | Mevcut |
|---|---:|
| Lighthouse performans | 44/100 |
| LCP | 7,9 sn |
| TBT | 1.320 ms |
| Etkileşime hazır olma | 12,7 sn |
| Sayfa ağırlığı | 3.269 KiB |
| Ağ isteği | 350 |
| DOM elemanı | 4.622 |

- [x] Shopify Forms uygulamasının ana sayfadaki global yükünü Lighthouse ile değerlendir; en büyük kullanılmayan JavaScript kaynağı olduğunu kaydet.
- [ ] Form satış veya e-posta dönüşümü getirmiyorsa global app embed'ini kapat.
- [ ] Form gerekli ise yalnızca ihtiyaç duyulan akışta yüklenmesini sağlayacak alternatif kurgu oluştur.
- [x] Ana sayfadaki ilk ürün listesini 12 üründen 6–8 ürüne düşürmeyi test et.
- [x] “En Çok Satanlar” listesini 16 üründen 8 ürüne düşürmeyi test et.
- [ ] Aşağıdaki ürün listelerini gerçek lazy render veya kullanıcı etkileşimi sonrasında yükle.
- [ ] Ürün kartlarında ilk görsel dışındaki medya ve renk görsellerini ilk sayfa yükünden çıkar.
- [ ] `snippets/scripts.liquid` içindeki modülleri template ve section ihtiyacına göre koşullu yükle.
- [ ] Ürün formu, varyant, galeri, fiyat, slider ve video modüllerini kullanılmadıkları sayfalarda yükleme.
- [ ] Ana hero görselinin ayrı mobil sürümünü üret.
- [ ] Hero görselinin mobil dosya boyutunu azalt.
- [ ] Hero görselindeki render gecikmesini azaltmak için gereksiz üst katman ve JavaScript işini kaldır.
- [x] Ürün kartı `sizes`/`srcset` değerlerini gerçek mobil gösterim genişliği olan yaklaşık 229–310 px'e göre düzenle.
- [x] Blog ve koleksiyon görsellerinde doğru responsive image boyutlarını kullan.
- [ ] Sayfa DOM büyüklüğünü azaltmak için görünmeyen slider öğelerini başlangıçta üretme.
- [x] Shopify Inbox ve müşteri hesabı bileşenlerinin ana iş parçacığı etkisini Lighthouse ağ kaydında ölç.
- [x] Her performans değişikliğinden sonra yerel mobil Lighthouse testini tekrar çalıştır.

Hedefler:

- Lighthouse performans: `70+`, sonraki aşamada `85+`.
- LCP: `2,5 sn` veya altı.
- TBT: `300 ms` veya altı.
- Toplam istek: ilk aşamada `200` altı.
- Sayfa ağırlığı: ilk aşamada `2 MB` altı.

## 3. Ürün SEO başlıkları ve meta açıklamaları

Mevcut durum:

- 100/100 üründe özel SEO açıklaması eksik.
- 85/100 üründe özel SEO başlığı eksik.
- Ürün açıklamalarının tamamı meta açıklama için fazla uzun.

- [x] Son 180 günlük giriş oturumları ve satış verisine göre öncelikli 20 ürünü belirle.
- [x] İlk 20 ürün için 50–60 karakterlik özgün SEO başlığı yaz.
- [x] İlk 20 ürün için 140–160 karakterlik özgün meta açıklaması yaz.
- [x] Sonraki aşamada kalan 80 ürünü tamamla.
- [ ] Başlıklarda model, malzeme, parça sayısı ve ana kullanım amacını tutarlı sırada kullan.
- [ ] Meta açıklamalarında ürün faydası, malzeme, kullanım alanı ve teslimat avantajını doğal biçimde belirt.
- [x] Anahtar kelime doldurma ve birbirinin kopyası açıklamalar kullanma.
- [x] SEO değişikliklerinden önce ürün URL'lerini ve olası redirect ihtiyacını kaydet.

## 4. Benzer ürünleri model/varyant yapısında birleştirme

Mevcut durum:

- Birebir aynı başlığa sahip 9 grupta toplam 50 ürün var.
- Renk kelimeleri çıkarıldığında 82 ürün birbirine çok yakın model kümelerine giriyor.

- [x] Pulsar ürün ailesini model bazında analiz et.
- [x] Vega ürün ailesini model ve parça sayısına göre analiz et.
- [x] Venüs ürün ailesini model ve parça sayısına göre analiz et.
- [x] Bulut ürün ailesini model bazında analiz et.
- [x] Deri masa pedi ürünlerini tek ürün altında renk varyantları olarak değerlendirmeye al.
- [x] Evrak rafı renklerini tek ürün/varyant yapısına alma ihtimalini değerlendir.
- [x] Deri masaüstü isimliği renklerini tek ürün/varyant yapısına alma ihtimalini değerlendir.
- [x] Kristal isimliklerde aksesuar farkı ile yalnızca renk farkını birbirinden ayır.
- [x] Birleştirilecek ürünlerde fiyat, görsel, SEO, URL, yorum ve satış geçmişi taşıma planı oluştur.
- [ ] Kapatılacak eski ürün URL'lerinden yeni ana ürün URL'sine 301 yönlendirmesi oluştur.
- [ ] Birleştirme sonrasında sitemap ve canonical bağlantıları kontrol et.

## 5. Ürün verisi standardı

- [x] SKU'su eksik olan 66 varyant için tutarlı kod şeması oluştur.
- [x] Yeni ürünler için önerilen SKU formatını belirle: `MODEL-RENK-PARCA`.
- [x] SKU değerlerinin benzersizliğini kontrol et.
- [x] 100 ürünün ürün türü alanlarını doldur.
- [x] Shopify standart ürün kategorilerini seç.
- [x] Model, malzeme, renk, parça sayısı ve kullanım alanı için metafield standardı oluştur.
- [x] Search & Discovery filtrelerini bu alanlara bağla.
- [x] Barkodu yalnızca POS, pazar yeri veya lojistik kanalı gerektiren ürünlerde tamamlama kuralını oluştur; rastgele barkod üretme.
- [x] Ürün başlığı yazım standardı oluştur.
- [x] “Deri”, “suni deri”, “hakiki deri” ifadelerini 100 ürünün malzeme alanında doğrulanmış değerlerle standardize et.

## 6. Ürün ve içerik görsellerinin alt metinleri

Mevcut durum:

- İncelenen 699 ürün görselinin tamamında alt metin boş.
- 10 blog kapak görselinin tamamında alt metin boş.
- Ana hero görselinde alt niteliği eksik.

- [x] Ana hero görseline uygun alt metin ekle.
- [x] İlk 20 önemli ürünün bütün görsellerine alt metin ekle.
- [x] Sonraki aşamada kalan ürün görsellerini tamamla.
- [x] 10 blog kapak görseline alt metin ekle.
- [x] Dekoratif arayüz görsellerini erişilebilirlik ağacından çıkar; anlam taşıyan ürün, koleksiyon, blog ve hero görsellerinde açıklayıcı alt metin kullan.
- [x] Anlam taşıyan görsellerde model, renk, malzeme ve kullanım bağlamını kısa biçimde belirt.
- [x] Aynı ürünün bütün görsellerine aynı alt metni kopyalama.
- [x] Alt metinleri anahtar kelime listesine dönüştürme.

## 7. Sayfa başlıkları ve meta açıklamaları

- [x] Ana sayfada tek bir H1 bırak.
- [x] Görünür ve fayda odaklı ana H1 oluştur.
- [x] “En Çok Satanlar” başlığını H2 yap.
- [x] Hakkımızda sayfasına tek bir H1 ekle.
- [x] SSS sayfasına tek bir H1 ekle.
- [x] İletişim sayfasına 140–160 karakterlik meta açıklaması ekle.
- [x] SSS sayfasına 140–160 karakterlik meta açıklaması ekle.
- [x] Blog liste sayfasına 140–160 karakterlik meta açıklaması ekle.
- [x] Hakkımızda sayfasının 320 karakterlik meta açıklamasını kısalt.
- [x] Ana sayfanın 250 karakterlik meta açıklamasını kısalt.
- [x] Ürün kartlarının heading seviyelerini sayfa hiyerarşisine uygun hâle getir.
- [x] H1 → H2 → H3 sırasını bütün ana şablonlarda doğrula.

## 8. Koleksiyon ve URL temizliği

- [x] Boş `frontpage` koleksiyonunu yayından kaldır.
- [x] `frontpage` için `/collections/all` hedefine 301 yönlendirmesi ekle.
- [x] `bp` koleksiyonuna kullanıcıya anlamlı ad ve handle ver.
- [x] `ençok` koleksiyonunu “En Çok Satanlar” olarak düzelt.
- [x] `Kristal & Cam İsimliker` yazımını “Kristal & Cam İsimlikler” olarak düzelt.
- [x] Unicode sorunlu `i̇ndirim` handle'ını ASCII bir handle'a taşı.
- [x] Unicode sorunlu blog handle'ını ASCII bir handle'a taşı.
- [x] Değişen her handle için 301 yönlendirmesi oluştur.
- [x] Açıklaması yetersiz 4 koleksiyonun giriş metnini geliştir.
- [x] Özel SEO açıklaması eksik 3 koleksiyonu tamamla.
- [x] Kalan 18 içerikli koleksiyon için uygun koleksiyon görseli oluştur veya seç.
- [x] Altbilgi menüsü ve Hızlı Yardım menüsünü anlaşılır iki sütunlu bilgi mimarisinde düzenle.
- [x] Koleksiyonların sitemap, canonical ve menü bağlantılarını değişiklik sonrasında test et.

## 9. Erişilebilirlik

Başlangıç Lighthouse erişilebilirlik skoru: `86/100`.

- [x] İndirim öncesi fiyat renginin kontrastını en az `4,5:1` yap.
- [x] Kapalı drawer ve modal içindeki odaklanabilir öğeleri uygun odak yönetimiyle devre dışı bırak.
- [x] `aria-hidden="true"` içindeki odaklanabilir öğeleri düzelt.
- [x] Heading sırasını düzelt.
- [x] Klavyeyle ana menü kullanımını test et.
- [x] Klavyeyle arama penceresini test et.
- [x] Klavyeyle sepet çekmecesini test et.
- [x] Klavyeyle ürün varyantlarını test et.
- [x] Slider önceki/sonraki kontrollerinin erişilebilir adlarını doğrula.
- [x] Görsel ve heading düzeltmelerinden sonra Lighthouse/axe testini tekrarla.

## 10. Kargo, teslimat, pazarlar ve konumlar

Mevcut durum:

- Türkiye pazarı aktif.
- Kullanıma hazır olmayan 28 ülkelik uluslararası kargo bölgesi var.
- Uluslararası kargo ücreti `₺840` olarak tanımlı.
- İki gönderim konumunda aynı `₺200` ücret fakat farklı teslim süreleri var.
- Yerel teslimat ve mağazadan teslim açık.

- [x] Yalnızca Türkiye'ye satış yapılacaksa 28 ülkelik kullanılmayan uluslararası bölgeyi kaldırma planı oluştur.
- [x] Uluslararası satış yapılacaksa Markets, dil, para birimi, vergi ve teslim süresi planını oluştur.
- [ ] Örnektepe konumundaki `3–5 iş günü` teslim süresini doğrula.
- [ ] Gülka Ofis Gereçleri konumundaki `1–2 iş günü` teslim süresini doğrula.
- [ ] İki konumun teslim süresi ve sipariş yönlendirme kurallarını standardize et.
- [ ] `₺2.000` ücretsiz kargo eşiğinin iki konumda da aynı çalıştığını doğrula.
- [x] Gülka Ofis Gereçleri konum adresini şehir, ilçe, posta kodu ve telefon alanlarına doğru şekilde ayır.
- [ ] Yerel teslimatın kapsama alanı, ücret ve sürelerini kontrol et.
- [ ] Mağazadan teslim alma noktasının adres ve çalışma saatlerini kontrol et.
- [x] Kullanılmayan teslimat yöntemlerini kapatma planına al.

## 11. Blog ve organik trafik

- [x] Blog liste sayfasına meta açıklaması ekle.
- [x] Blog kapak görsellerinin alt metinlerini tamamla.
- [x] Birbirine yakın “Sümen Takımı Nedir?” içerikleri için ana rehber ve destek içerikleri mimarisi oluştur.
- [x] Benzer yazılar arasında canonical/birleştirme ihtiyacını değerlendir.
- [x] 10 blog yazısından ürün, koleksiyon ve SSS sayfalarına doğal iç bağlantılar ekle.
- [x] Blog yazılarını konu kümelerine ayır:
  - [x] Sümen takımı ana rehberi
  - [x] Hakiki deri ve suni deri karşılaştırması
  - [x] Yönetici ofisi düzeni
  - [x] Bakım ve temizlik — yayın taslağı hazır
  - [x] Hediye seçimi — yayın taslağı hazır
  - [x] Hukuk bürosu ve kurumsal kullanım — yayın taslağı hazır
  - [x] Satın alma rehberi
- [ ] Google Search Console mülkünü doğrula.
- [ ] Sitemap'i Search Console'a gönder.
- [ ] Dizin kapsamı, canonical ve sayfa deneyimi raporlarını haftalık kontrol et.
- [ ] En çok gösterim alıp düşük tıklama alan sayfaların başlıklarını iyileştir.

## 12. Marka ve güven tutarlılığı

- [ ] `info@sumentakimi.com` veya `destek@sumentakimi.com` adresi oluştur.
- [ ] Mağaza iletişim e-postasını markalı alan adına taşı.
- [ ] İletişim sayfasındaki `info@gunerofis.com` adresinin kullanım amacını netleştir.
- [ ] Sipariş bildirimlerinde aynı marka ve e-posta kimliğini kullan.
- [ ] Politika sayfalarında aynı şirket unvanı, adres, telefon ve e-posta bilgisini kullan.
- [~] Footer'a şirket unvanı, telefon ve açık adresi ekle; markalı destek e-postası oluşturulduğunda aynı alana ekle.
- [x] Footer'a güvenli ödeme, ücretsiz kargo eşiği ve iade politikası bağlantısını sade biçimde ekle.
- [ ] Politika başlıklarının yönetim tarafındaki İngilizce adlarını Türkçeleştirmeyi değerlendir.

## 13. Analitik ve haftalık takip

- [x] Her pazartesi 09.00'da çalışan haftalık dönüşüm takibini oluştur.
- [x] Aşağıdaki metrikleri haftalık takip görevine ekle:
  - [x] Oturum
  - [x] Ürün görüntüleme
  - [x] Sepete ekleme oranı
  - [x] Ödeme sayfasına geçiş oranı
  - [x] Tamamlanan sipariş oranı
  - [x] Toplam satış
  - [x] Ortalama sipariş değeri
  - [x] İade/iptal oranı
  - [x] Mobil ve masaüstü dönüşüm farkı
- [ ] iyzico başarısız ödeme oranını takip et.
- [x] En çok terk edilen ödeme adımını haftalık takip raporuna ekle.
- [x] Tema değişikliklerinden önce ve sonra Lighthouse sonuçlarını sakla.
- [ ] SEO değişikliklerinden önce ve sonra Search Console gösterim/tıklama sonuçlarını karşılaştır.

## Uygulama sırası

### İlk 3 gün

- [ ] iyzico ve checkout testleri.
- [ ] Kargo ücretleri ve konum teslim süreleri doğrulaması.
- [ ] Kargo telefon alanı kararı.
- [ ] Forms app embed ve ana sayfa yükü kararı.
- [ ] İlk 20 SEO öncelikli ürünün seçimi.

### İlk 7 gün

- [x] Hero ve ana sayfa ürün listesi performans düzenlemeleri.
- [x] Ana sayfa, iletişim, SSS ve blog H1/meta düzeltmeleri.
- [x] İlk 20 ürünün SEO başlık ve açıklamaları.
- [x] İlk 20 ürünün görsel alt metinleri.
- [x] Koleksiyon adı/handle düzeltme planı.

### İlk 30 gün

- [ ] Benzer ürünleri varyant yapısında birleştirme.
- [x] Tüm ürün SEO açıklamalarını tamamlama.
- [x] Tüm ürün ve blog görsel alt metinlerini tamamlama.
- [x] Ürün türü, kategori, SKU ve metafield standardını tamamlama.
- [ ] Tema JavaScript'ini koşullu yükleme.
- [x] Koleksiyon, URL ve redirect temizliğini bitirme.
- [~] Haftalık dönüşüm takip görevini ve tablosunu devreye al; Search Console erişimi sağlandığında SEO verisini aynı rapora ekle.

## Tamamlanma kriterleri

- [ ] Mobil Lighthouse performans skoru en az 70.
- [ ] LCP en fazla 2,5 saniye.
- [ ] TBT en fazla 300 ms.
- [ ] Ödeme sayfasından siparişe geçiş en az `%20`.
- [x] İlk 20 ürünün SEO alanları ve görsel alt metinleri eksiksiz.
- [x] Bozuk/Unicode handle'lar 301 yönlendirmeleriyle düzeltilmiş.
- [x] H1 ve heading yapısı bütün temel şablonlarda doğru.
- [ ] Kargo ücretleri ve teslim süreleri iki konumda tutarlı.
- [ ] Marka iletişim bilgileri tek alan adı altında tutarlı.
- [ ] Search Console ve haftalık Shopify dönüşüm takibi çalışıyor.
