# Yapılandırılmış veri

Önce mevcut JSON-LD/microdata çıktısını ve kaynağını bul. Tema ve uygulamanın aynı varlık için ürettiği veriyi birlikte değerlendir; yeni Product bloğu eklemek ilk refleks olmasın. Bir sayfada birden fazla yapı bulunmasını tek başına hata sayma; gerçek çelişkiyi veya varlık karışmasını göster.

Türü sayfa amacına göre seç. Ürün, ürün varyantları, breadcrumb ve organizasyon aynı şey değildir. Product/Offer alanlarını gerçek ürün, fiyat, para birimi ve bulunabilirlik verisinden üret; görünür içerikle uyuşmasını kontrol et. Yorum, yıldız puanı, GTIN, sertifika, teslimat süresi veya üretim bilgisi uydurma.

Şema sözdizimi geçerliliği, Google özelliğine uygunluk ve sonuçlarda gösterim ayrı aşamalardır. Uyarı ile engelleyici hatayı ayır. Rich result görünümünü ve sıralama artışını garanti etme. JSON-LD'nin derlemeden sonra gerçek HTML'de nasıl çıktığını kontrol et; yalnız kaynak kod şablonunu görmek yeterli değildir.

Fiyat/varyant değişiminde JSON-LD'nin gerçek sayfa modeliyle tutarlılığını değerlendir. Kullanılan Shopify tema veya uygulaması zaten doğru veri üretiyorsa ikinci bir üretici ekleme. Düzeltmeyi veri kaynağında yap; elle sabit değerler ekleyerek hatayı gizleme.

FAQ metni yararlı olabilir; FAQ schema veya belirli rich result'ın her mağazada gösterileceği varsayımıyla içerik üretme. Google'ın güncel destek ve uygunluk şartlarını ilgili özelliğin resmî dokümanından doğrula.

Resmî başlangıç kaynağı: `https://developers.google.com/search/docs/appearance/structured-data/product` (12 Eylül 2026'da kontrol edildi).
