# Rol ve yetki tablosu
Bu tablo kişi ataması değildir. Birim ve rol kayıtları [birimler.json](kayitlar/birimler.json) içindedir. Aynı kişi birden çok rol üstlenebilir; görev kaydında rol ve kişi ayrı tutulur.

| İşlem / karar | İş sahibi | İnceleyen / ilgili birim | Yetki kapsamı |
|---|---|---|---|
| Şirket önceliği ve bütçe | YONETIM | İlgili birim + FINANS | Kayıtlı bütçe ve iş kapsamı |
| Katalog ve site değişikliği | DIJITAL | URUN_STOK | İlgili site / kanal |
| Stok sayımı ve düzeltme | URUN_STOK | FINANS / URETIM | Sayım veya hareket kanıtı |
| Satın alma ve üretim | URETIM | FINANS + ilgili satış birimi | Yetkili sipariş, bütçe, miktar |
| Fiyat / toptan teklif | TOPTAN | FINANS | Güncel fiyat ve teklif koşulları |
| Tahsilat, iade ve muhasebe | FINANS | Siparişin sahibi | Kaynak işlem ve tutar |
| Paket ve sevkiyat | LOJISTIK | URUN_STOK | Paket satırları ve teslimat kaydı |
| Müşteri yanıtı | MUSTERI | Gerekli süreç sahibi | Talep ve iletişim yetkisi |
| Kampanya ve yayın | PAZARLAMA | DIJITAL / FINANS | Kanal, içerik ve bütçe |
| Personel / idari kayıt | IDARI | İlgili yönetici | Göreve gerekli sınırlı veri |
| Sözleşme takibi | SOZLESME | YONETIM + ilgili uzman | Belge referansı ve vade takibi |
| Varlık / bakım | VARLIK | IDARI / TEKNOLOJI | Varlık sahibi ve bakım kapsamı |
| Sistem bağlantısı | TEKNOLOJI | Veri sahibi birim | Sistem ve işlem bazında erişim |
| AI görevi | Kaynak işin birimi | AI koordinasyonu | Görevde verilen veri ve işlem sınırı |

Yeni bir dış işlem yetkisi bu tabloyla kendiliğinden verilmez. Kullanıcının mevcut talimatı kapsamındaki işler tekrar onaya çıkarılmaz. Yeni onay gerektiğinde soyut plan yerine tamamlanmış ve incelenebilir işlem paketi sunulur.
Erişim matrisi sistem × rol × okuma / taslak / değiştirme / yayınlama alanlarıyla tutulur. Rol değişiminde erişimler güncellenir. Araçlar şirket iş sahibinin yerini almaz.
