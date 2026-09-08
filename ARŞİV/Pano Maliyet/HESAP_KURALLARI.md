# Pano Maliyet Hesaplama Yazılımı — Sabit İş Kuralları

## 1. Amaç

Bu yazılım, özel ölçü girilen bir pano için aşağıdaki kalemlerin maliyetini hesaplar:

- MDF
- XBi
- Kumaş
- Alüminyum profil
- Diğer giderler

Malzemelerin **döviz cinsinden birim fiyatları sabittir**.  
Değişken olan, hesaplama anındaki **canlı döviz kurudur**.

Yazılım her hesaplamada güncel kuru alır, sabit döviz fiyatlarını TL'ye çevirir ve sonucu **TL olarak** verir.

---

# 2. Temel Fiyat Mantığı

## 2.1. Sabit döviz fiyatları

Her malzeme için kullanıcı tarafından tanımlanan:

- sabit döviz fiyatı
- döviz cinsi

bulunur.

Bu değerler kullanıcı değiştirmediği sürece değişmez.

Örnek mantık:

```text
XBi sabit fiyatı = 2 USD / m²
Canlı USD/TL kuru = 41,00

Güncel XBi TL fiyatı:
2 × 41,00 = 82,00 TL / m²
```

Kur daha sonra 42,00 olduğunda:

```text
2 × 42,00 = 84,00 TL / m²
```

Burada XBi'nin **2 USD fiyatı değişmez**.  
Sadece TL karşılığı canlı kura göre değişir.

Aynı mantık:

- MDF
- XBi
- Kumaş
- Alüminyum
- Diğer giderler

için geçerlidir.

---

# 3. Canlı Döviz Kuru

Her yeni maliyet hesabında:

1. Güncel döviz kuru alınır.
2. Sabit döviz fiyatları TL'ye çevrilir.
3. Malzeme hesapları güncel TL fiyatları üzerinden yapılır.
4. Sonuç TL olarak gösterilir.

Formül:

```text
Güncel TL birim fiyatı = Sabit döviz birim fiyatı × Canlı döviz kuru
```

Kur alınamıyorsa yanlış veya eski bir kurla sessizce hesap yapılmamalıdır.

---

# 4. Pano Ölçüleri

Hesaplama pano ölçülerini santimetre cinsinden alır.

Örnek:

```text
60 × 90 cm
90 × 180 cm
120 × 240 cm
```

XBi ve kumaş kurallarında ilk ölçü **yükseklik** olarak değerlendirilir.

Örnek:

```text
60 × 180
yükseklik = 60 cm
diğer ölçü = 180 cm
```

---

# 5. MDF Hesabı

## 5.1. Standart MDF plaka

```text
210 × 280 cm
```

## 5.2. Ana kural

Girilen pano ölçüsünden bir adet 210 × 280 cm MDF plakadan **kaç adet pano çıkıyorsa** hesaplanır.

Plakadaki tüm panolar **aynı yönde** dizilir. Dizilim:

- normal yönde
- 90° döndürülmüş yönde

olmak üzere iki seçenekten çok veren seçilir.

```text
Normal dizilim  = alt(210 / genişlik) × alt(280 / yükseklik)
Çevrik dizilim  = alt(210 / yükseklik) × alt(280 / genişlik)

Plakadan çıkan adet = max(normal, çevrik)
```

Amaç:

> Tek yönlü, sütun × satır dizilimiyle bir plakadan çıkan pano adedini bulmak.

**Plaka üzerinde yön karıştırılmaz.** Bir kısmı düz, bir kısmı çevrik yerleştirilerek elde edilen karma yerleşimler kullanılmaz. Kalan fireler alan olarak bir pano ölçüsünü karşılasa bile, parçalı kalacağı için sayıya dahil edilmez.

### Örnek

```text
210 × 280 plaka, 60 × 90 pano

Normal:  alt(210/90) × alt(280/60) = 2 × 4 = 8
Çevrik:  alt(210/60) × alt(280/90) = 3 × 3 = 9

Sonuç: 9 adet (çevrik, 3 × 3)
```

Karma yerleşimle 10 adet elde edilebilir (iki adet 60 cm genişliğinde sütun + kalan 90 cm'lik şeride yan çevrilmiş 4 pano) ancak bu kural gereği kullanılmaz.

Testere kesim payı:

```text
0
```

Ayrıca MDF için ayrı bir fire bedeli hesaplanmaz.

Fire, zaten bir plakadan çıkan maksimum pano adedine bölme mantığının içinde çözülmüş kabul edilir.

## 5.3. MDF maliyet formülü

```text
MDF pano maliyeti =
Güncel MDF plaka TL fiyatı
÷
210 × 280 plakadan çıkan maksimum pano adedi
```

## 5.4. Örnek

60 × 90 cm pano için bir plakadan maksimum 9 adet çıkıyorsa:

```text
MDF pano maliyeti =
MDF plaka TL fiyatı ÷ 9
```

Örneğin plaka TL karşılığı 800 TL olsaydı:

```text
800 ÷ 9 = 88,89 TL
```

Bu 800 TL yalnızca formülü anlatmak için örnektir.  
Yazılımda MDF fiyatı sabit TL olarak tutulmayacaktır.

## 5.5. MDF çıktısında gösterilecek bilgi

En az:

```text
MDF plaka ölçüsü
Pano ölçüsü
Bir plakadan çıkan adet ve kullanılan dizilim (sütun × satır, düz / çevrik)
Güncel MDF plaka TL karşılığı
Bir pano MDF maliyeti
```

gösterilmelidir.

## 5.6. MDF sınır durumu

Pano, 90° döndürme dahil, 210 × 280 cm plakaya fiziksel olarak sığmıyorsa sistem hesap uydurmamalı ve MDF için uygun olmadığını açıkça belirtmelidir.

---

# 6. XBi Hesabı

Malzemenin adı:

```text
XBi
```

"XP" olarak adlandırılmamalıdır.

## 6.1. Temel kural

XBi hesabı düz **m² hesabıdır**.

Ancak pano yüksekliği 100 cm'nin altındaysa maliyet hesabında yükseklik:

```text
100 cm
```

kabul edilir.

Yani:

- 50 cm → 100 cm
- 60 cm → 100 cm
- 70 cm → 100 cm
- 80 cm → 100 cm
- 90 cm → 100 cm

100 cm ve üzerindeki yüksekliklerde gerçek ölçü kullanılır.

## 6.2. XBi formülü

```text
Hesap yüksekliği =
max(pano yüksekliği, 100 cm)

XBi hesap alanı =
(Hesap yüksekliği / 100)
×
(Diğer ölçü / 100)

XBi maliyeti =
XBi hesap alanı
×
Güncel XBi TL/m² fiyatı
```

## 6.3. Örnekler

### 60 × 120 cm

```text
60 cm → 100 cm kabul edilir

1,00 × 1,20 = 1,20 m²
```

### 90 × 180 cm

```text
90 cm → 100 cm kabul edilir

1,00 × 1,80 = 1,80 m²
```

### 120 × 200 cm

```text
120 cm gerçek ölçü kullanılır

1,20 × 2,00 = 2,40 m²
```

## 6.4. XBi'de ayrıca fire hesabı yoktur

Eski:

- parça birleştirme
- 90 cm rulo
- kalan parçayı başka yerden tamamlama
- ayrı fire optimizasyonu

kuralları artık kullanılmayacaktır.

Son kural yalnızca yukarıdaki düz m² hesabıdır.

---

# 7. Kumaş Hesabı

## 7.1. Temel kural

Kumaş hesabında pano yüksekliği dikkate alınır.

Kumaş hesabında 140 cm kritik baz ölçüdür.

### Durum A — yükseklik 70 cm veya daha az

140 cm kumaş eninden iki sıra pano çıkabildiği kabul edilir.

Bu nedenle kumaş maliyeti:

```text
normal maliyet × 0,5
```

olarak hesaplanır.

### Durum B — yükseklik 70 cm'den büyük ve 140 cm'den küçük

Hesap yüksekliği:

```text
140 cm
```

kabul edilir.

`× 0,5` uygulanmaz.

### Durum C — yükseklik 140 cm veya daha fazla

Gerçek yükseklik kullanılır.

## 7.2. Kumaş formülü

Önce baz yükseklik:

```text
Eğer yükseklik <= 70 cm:
    baz yükseklik = 140 cm
    sıra katsayısı = 0,5

Eğer 70 cm < yükseklik < 140 cm:
    baz yükseklik = 140 cm
    sıra katsayısı = 1

Eğer yükseklik >= 140 cm:
    baz yükseklik = gerçek yükseklik
    sıra katsayısı = 1
```

Kumaş metretül tüketimi:

```text
Kumaş tüketimi =
(diğer ölçü / 100)
× sıra katsayısı
```

Baz yükseklik, hangi kumaş eni üzerinden maliyetlendirildiğinin açıklamasında gösterilir.

Kumaş maliyeti:

```text
Kumaş maliyeti =
Kumaş tüketimi (metretül)
×
Güncel kumaş TL/metretül fiyatı
```

## 7.3. Örnek

### 60 × 120 cm

60 cm <= 70 cm olduğu için iki sıra çıkar:

```text
Kumaş baz eni = 140 cm
Metretül = 1,20
Sıra katsayısı = 0,5

Faturalandırılan kumaş tüketimi:
1,20 × 0,5 = 0,60 metretül
```

### 90 × 180 cm

90 cm, 70'ten büyük ve 140'tan küçüktür:

```text
Kumaş baz eni = 140 cm
Metretül = 1,80
Sıra katsayısı = 1

Faturalandırılan kumaş tüketimi:
1,80 metretül
```

## 7.4. Kumaş tek parça kuralı

Kumaş uygulaması pano üzerinde tek parça olarak kabul edilir.

Parça birleştirme yapılmaz.

---

# 8. Alüminyum Profil Hesabı

## 8.1. Standart profil referansı

Bir alüminyum profil fiyatı:

```text
600 cm
```

uzunluk için tanımlanır.

## 8.2. Fire yok

Alüminyum için ayrıca fire hesaplanmaz.

Pano çevresi kadar profil kullanıldığı kabul edilir.

## 8.3. Çevre hesabı

```text
Çevre =
yükseklik + yükseklik + diğer ölçü + diğer ölçü
```

veya:

```text
Çevre = 2 × (yükseklik + diğer ölçü)
```

## 8.4. Alüminyum maliyet formülü

```text
Alüminyum maliyeti =
(Pano çevresi / 600)
×
Güncel 600 cm alüminyum profil TL fiyatı
```

## 8.5. Örnek

90 × 180 cm pano:

```text
90 + 90 + 180 + 180 = 540 cm
```

Maliyet:

```text
540 / 600
×
güncel 600 cm profil TL fiyatı
```

---

# 9. Diğer Giderler

Her **bir pano** için sabit bir "diğer giderler" kalemi eklenir.

Bu kalem, diğer malzemeler gibi **döviz endekslidir**: kullanıcı pano başına sabit bir **USD** tutarı girer, yazılım bunu hesaplama anındaki canlı kurla TL'ye çevirir.

Tutar arayüzde **düzenlenebilir bir girdidir** ve girilen değer bu bilgisayarda saklanır.

Bu gider:

- köşe kartonu
- bant
- küçük sarf malzemeleri
- benzeri yardımcı giderleri

temsil eder.

Bu tutar:

- sabit **döviz** fiyatıdır
- canlı kura bağlıdır
- TL karşılığı her hesaplamada yeniden oluşur

Formül:

```text
Diğer giderler TL = Sabit diğer gider USD × Canlı USD/TL kuru
```

---

# 10. Toplam Hammadde Maliyeti

Bir pano için:

```text
Toplam hammadde maliyeti (X) =
MDF maliyeti
+ XBi maliyeti
+ Kumaş maliyeti
+ Alüminyum maliyeti
+ diğer giderler (döviz endeksli)
```

Bu tutar **hammadde maliyetidir**; kâr ve işçilik içermez.

---

# 10.A. Kâr ve İşçilik

Kâr ve işçilik **ayrı ayrı kademeli olarak değil**, aynı taban üzerinden **eşzamanlı** eklenir.

Taban, 10. bölümdeki toplam hammadde maliyetidir (140 TL sabit gider dahil).

```text
İşçilik = X × 0,30
Kâr     = X × 0,25

Genel toplam = X + (X × 0,30) + (X × 0,25)
             = X × 1,55
```

Yani kâr, işçilik eklenmiş tutar üzerinden hesaplanmaz; her ikisi de doğrudan X üzerinden hesaplanır.

## Örnek

```text
X = 1.000,00 TL

İşçilik      = 300,00 TL
Kâr          = 250,00 TL
Genel toplam = 1.550,00 TL
```

Yanlış olurdu:

```text
1.000 × 1,30 = 1.300
1.300 × 1,25 = 1.625   ← kademeli, kullanılmaz
```

Genel toplam **KDV hariçtir**.

Sonuç:

```text
TL
```

olarak gösterilir.

---

# 11. Hesaplama Sırası

Her pano hesabında mantıksal sıra:

```text
1. Pano ölçülerini al
2. Canlı döviz kurunu al
3. Sabit döviz malzeme fiyatlarını güncel TL fiyatlarına çevir
4. MDF tek yönlü dizilim adedini hesapla (düz / çevrik, çok olanı seç)
5. MDF pano maliyetini hesapla
6. XBi hesap alanını belirle ve maliyeti hesapla
7. Kumaş baz eni / iki sıra kuralını uygula ve maliyeti hesapla
8. Alüminyum çevre maliyetini hesapla
9. Diğer gideri güncel TL'ye çevir ve ekle (sabit USD, düzenlenebilir)
10. Tüm kalemleri topla → toplam hammadde maliyeti (X)
11. İşçiliği hesapla: X × 0,30
12. Kârı hesapla: X × 0,25
13. Genel toplamı hesapla: X × 1,55
14. TL çıktı oluştur
```

---

# 12. Çıktıda Gösterilecek Bilgiler

Her hesaplamada en az aşağıdaki bilgiler bulunmalıdır:

```text
Pano ölçüsü

Canlı kullanılan döviz kuru / kurları

MDF:
- 210 × 280 plakadan çıkan adet ve dizilim (sütun × satır, düz / çevrik)
- güncel plaka TL karşılığı
- pano başına MDF maliyeti

XBi:
- gerçek pano yüksekliği
- maliyette kullanılan yükseklik
- hesaplanan m²
- güncel TL/m² fiyatı
- XBi maliyeti

Kumaş:
- gerçek pano yüksekliği
- hesapta kullanılan 140 cm baz kuralı
- iki sıra (×0,5) uygulanıp uygulanmadığı
- hesaplanan metretül
- güncel TL/metretül fiyatı
- kumaş maliyeti

Alüminyum:
- pano çevresi
- 600 cm profil TL karşılığı
- kullanılan oran
- alüminyum maliyeti

Diğer giderler:
- girilen sabit USD giderin güncel TL karşılığı

İşçilik:
- toplam hammadde maliyetinin %30'u

Kâr:
- toplam hammadde maliyetinin %25'i

Toplam:
- TL toplam hammadde maliyeti (detaysız)
- TL genel toplam (hammadde × 1,55, KDV hariç)
```

---

# 13. Sabit Olmayan / Şimdilik Karar Verilmeyecek Konular

Bu aşamada aşağıdaki konular hakkında karar verilmemelidir:

- programlama dili
- framework
- frontend teknolojisi
- backend teknolojisi
- masaüstü / web / mobil seçimi
- veritabanı
- hosting
- kullanıcı sistemi
- tasarım dili
- arayüz yapısı
- dosya formatları
- deployment yöntemi
- canlı kur sağlayıcısı
- teknik mimari

Bu belge yalnızca **iş kurallarını ve hesaplama mantığını sabitler**.

Teknik uygulama tercihlerine daha sonra karar verilecektir.

---

# 14. Değiştirilmemesi Gereken Kurallar

Ajan, açıkça yeni bir talimat verilmedikçe aşağıdaki kuralları değiştirmemelidir:

1. MDF plaka ölçüsü **210 × 280 cm**.
2. MDF'de ayrı fire bedeli yok.
3. MDF maliyeti, plakadan çıkan adet üzerinden bölünür.
4. MDF'de **tüm parçalar aynı yöndedir**; düz ve 90° çevrik dizilimden çok veren seçilir, **karma yerleşim kullanılmaz**.
5. MDF testere payı **yoktur**.
6. XBi düz m² hesabıdır.
7. XBi'de 100 cm altındaki yükseklik **100 cm** kabul edilir.
8. Kumaşta 140 cm altındaki yükseklik için **140 cm baz alınır**.
9. Kumaş yüksekliği 70 cm veya daha azsa **iki sıra** kabul edilir ve maliyet **×0,5** olur.
10. Kumaş tek parçadır.
11. Alüminyumda fire yoktur.
12. Alüminyum maliyeti pano çevresinin 600 cm profile oranıyla hesaplanır.
13. Her pano için diğer gider eklenir; **sabit USD** olarak girilir, canlı kurla TL'ye çevrilir, kullanıcı tarafından değiştirilebilir.
14. Malzemelerin **döviz cinsinden birim fiyatları sabittir**.
15. Değişken olan **canlı döviz kurudur**.
16. Çıktı TL olarak verilir.
17. Sabit TL malzeme fiyatları yazılım içine gömülmemelidir.
18. İşçilik **%30**, kâr **%25**'tir; ikisi de **toplam hammadde maliyeti** üzerinden hesaplanır.
19. Kâr ve işçilik **kademeli uygulanmaz**; genel toplam daima **hammadde × 1,55**'tir.

---

# 15. Ajana Uygulama Talimatı

Bu belgeyi uygularken:

> Buradaki hesap kurallarını kaynak kabul et. Eski veya genel üretim varsayımlarıyla değiştirme. Belirsiz olmayan hiçbir kural için yeni varsayım üretme. Şimdilik teknoloji, dil, framework, platform veya mimari seçimi yapma. Önce hesap motorunun bu belgeye göre matematiksel olarak tutarlı olmasını sağla. MDF maksimum adet hesabının doğru olması kritik önemdedir. Sabit döviz fiyatları ile canlı kur kavramlarını birbirine karıştırma: malzemenin döviz fiyatı kullanıcı değiştirmedikçe sabit, TL karşılığı ise her hesaplama anında canlı kura göre değişkendir.
