# Doğrulama

## Veri ve işlev

- Ana/alt iş ekleme; yinelenen kimliğin çoğalmaması; geçersiz ebeveyn, döngü ve açık alt işle kapanış reddi.
- Tek durumun liste, kontrol sayıları ve bütün filtrelerde aynı olması. Onay/ret/revizyon gerçek kayıtta sınanmaz; ayrı test verisi kullanılır.
- Hatalı sürüm 409; eksik oturum 401; yanlış Origin/CSRF veya yetki 403. Taslak girdi kaybolmaz.
- Kaydetme hata verince başarı görünmez. Başarıdan sonra sunucudan dönen kayıt kullanılır.
- İşlenmeyen kaynak, bilinmeyen durum ve boş veri uydurulmaz. Bağlantı durumu kaynak üreticisiyle eşleşir.
- Dosya açma yalnız mevcut izinli dosyayı açar; komut/script/yol dışına kaçış reddedilir.

## Görünüm

- Güncel masaüstü boyutunda ve 1024×600’de liste son satırı, sayaç, eylemler ve alt kenar görünür.
- Filtrelenmiş 10 kaydın sayfasında 7 görünüyorsa sayaç 1–7 / 10 der; sonraki sayfada kalan 3 görünür.
- Uzun Türkçe not; boş satır, emoji, dosya yolu ve çok uzun tek sözcükle metin kaybı kontrol edilir.
- Eski tarih taşıyan URL ile açılışta bugün seçilir. Google/Meta geçişi tek seçimi korur.
- Üst bardaki kaldırılması istenen düğmeler ve kart menüleri görünmez; ana menü İşler ile başlar.
- Onay gereken kayıtta karar düğmeleri ilk görünümde; engel/istenen bilgi anlaşılır.
- Instagram iki gezinme katmanında; işlevsiz ikon ve iç kimlik görünmez. Gerçek paylaşım yapılmaz.
- Yerel dosya bağlantısı açılır. Türkçe tarih, form etiketi, hata, boş sonuç ve erişilebilir adlar kontrol edilir.

## Kayıt

Anlamlı sonuçta mevcut ana işin kısa özetini güncelle. Gerekli teknik kanıt Ayrıntılar’a gider. Testi çalıştırmış olmak geçtiği anlamına gelmez. Ekran kontrolü durdurulduysa veya yapılamadıysa kapsamı açıkça yaz; tam kontrol iddiası kurma.
