# Ürün, varyant, kişiselleştirme ve sepet

Gerçek ürün/varyant modeli ile yalnız görsel seçimi ayır. Fiyat veya stok etkileyen seçimleri gerçek satış modeliyle bağla; istemcide görünen fiyatın ödeme tutarını tek başına değiştirdiğini varsayma. Sayfa içi önizleme üretim veya sipariş verisinin yerine geçmez.

İsim, unvan veya logo gibi kişiselleştirme alanlarını mevcut ürün formu/line item properties yaklaşımına göre bağla; mağazanın kullandığı uygulamayı veya bundle akışını bozmadan ilerle. Dosya yüklemesi için mevcut yetkili çözümü kullan. Yeni yükleme servisini, kişisel veri toplamayı veya depolamayı kendiliğinden ekleme.

Kontrol edilecek durumları değişikliğe göre seç: farklı varyant, satılamayan varyant, boş/zorunlu alan, uzun isim, özel karakter, aynı üründen farklı özelleştirmeler. Seçim özeti, görsel önizleme ve sepete taşınan veri birbiriyle uyumlu olsun.

Sepete eklemede doğru varyant, adet ve ilgili özelliklerin taşındığını mevcut API/tema yöntemleriyle doğrula. Ağ hatasında başarı gösterme; çift tıklama ve yeniden başlatmanın istemsiz mükerrer ekleme yaratmadığını kontrol et. Bir işlemi kullanıcıya ait canlı sepette tekrarlamadan önce etkisini değerlendir; mümkünse izole test oturumu kullan.

Mağazanın para birimi, locale ve mevcut biçimlendirmesini koru. Sabit fiyat ve hard-coded ürün bağlantısıyla dinamik veriyi taklit etme. İşlev testi gerçek ücretli sipariş vermeyi gerektirmez; satın alma, ödeme ve harici bildirim sınırını açık yetki olmadan geçme.

Kaynak başlangıcı: `https://shopify.dev/docs/storefronts/themes/architecture`. İlgili product form, Ajax Cart API, varyant ve line item properties dokümanlarını uygulanan yöntem için doğrula; burada evrensel API sürümü sabitlenmemiştir.
