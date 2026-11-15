# Ana iş ve alt iş

## Kayıt

Ana iş: kullanıcı isteğinin başlığı, kısa açıklaması, tek durumu ve varsa plan günü. İç sistem kimliği arayüz metni değildir. Alt iş aynı veri kaynağında ana kimliğe bağlanır; ana listede bağımsız görev gibi çoğaltılmaz.

Örnek: “Site taraması” ana işidir. “İletişim sayfasındaki yazım hatası düzeltildi.” bitmiş alt iştir. “X ürününün görselini bulamadım; fotoğraf gerekli.” açık alt iştir. Bu örnekler gerçek bulgu değildir.

## Görünen durumlar

- Devam ediyor: uygulama veya kontrol sürer.
- Senden bekleniyor: açık karar, bilgi, giriş, yetki veya doğrulama gerekir.
- Tamamlandı: sonuç doğrulandı ve açık alt iş kalmadı.
- İptal: iş iptal edilmiştir; tamamlanan sayılmaz.

Veritabanında önceki ajan yürütme durumu korunabilir; kullanıcıya ikinci bir durum sistemi sunulmaz. Geriye uyumlu yürütme alanları onay sınırını korur, bütün görünen durumlar tek ortak dönüşümden gelir.

## Kullanıcıdan beklenen

Talep ilk bölümde tek açık cümledir: ne bulunamadı, nerede sorun var veya kullanıcı hangi bilgiyi/işlemi sağlamalı? Teknik günlük buraya taşınmaz. Onay bekleyen kayıtta Onayla, Revize, Red en üsttedir. Bilgi isteğinde cevap aynı işte kaydedilir.

Onaylanan kapsam değişirse onay geçersizleşir. Kullanıcının doğrudan sohbet yetkisi yalnız verdiği kapsamda geçerlidir. Agent kendi kaydına uygulama onayı vermez. Test verisi ayrı ortamda onaylanabilir; gerçek kayıttaki karar değiştirilmez.

## Kapanış

Açık alt iş varsa sunucu kapanışı reddeder. Alt iş ekleme/revizyon, bitmiş ana işin altına sessizce yeni açık kapsam koymaz. Ana iş yeniden açılacaksa bu açık bir durum değişikliğidir. Döngü, kendine bağlama ve iç içe sınırsız hiyerarşi kabul edilmez.

Kart özeti ayrı kısa anlam taşır. Eski uzun raporun ilk karakterleri otomatik özet diye sunulmaz. Ayrıntı ve tarihli geçmiş korunur.
