# İşlevli sayfa/site uygulaması

Her istenen ana eylem için gerçek sonucu belirle: gezinme, yerel hesaplama, veri kaydetme veya harici gönderim. Kullanıcı veri kaydı istediyse yalnız görsel maket üretme. Yalnız prototip istediyse backend, üyelik ve veritabanı ekleme.

Mevcut yönlendirme, form ve veri katmanını kullan. Yeni projede ihtiyacı karşılayan en küçük uygulanabilir yapıyı seç; belirli bir framework veya hosting sağlayıcısını evrensel şart yapma. İstek gerektirmedikçe hesap sistemi, ödeme, takip kodu ve harici servis ekleme.

Gerçek veri ile demo verisini ayır. Ağ hatası, boş sonuç ve doğrulama hatası gibi ana akışın gerçekten karşılaşabileceği durumları göster. Ağ isteği başarısızken başarı mesajı verme; çalışmayan bağlantıları gerçek işlev gibi teslim etme. Harici gönderim entegrasyonu eksikse bunu açıkça belirt.

DOM'a güvenilmeyen veriyi bağlama uygun biçimde yerleştir. Kimlik bilgilerini istemciye gömme; özel verilere erişim kararlarını yalnız arayüzdeki gizleme ile verme. Riskli işlem veya kullanıcı verisi söz konusuysa gerekli kontrolü kapsam içinde uygula; tüm siteye kendiliğinden güvenlik denetimi açma.

Mevcut komutlarla derleme ve ilgili işlev kontrolünü yap. Mobilde birincil eylemi, klavyeyle kullanımını ve hatadan geri dönüşü doğrula. Yalnız build başarısı bir formun gerçekten gönderildiğini kanıtlamaz.

Kaynak doğrulaması: Uygulanan framework'ün kurulu sürümüne ait resmî doküman. Shopify projesinde kaynak: `https://shopify.dev/docs/storefronts/themes/architecture` (12 Eylül 2026'da kontrol edildi).
