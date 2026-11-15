# Kritik akışlar ve risk

Siteye uygun yolları seç; var olmayan bir özelliği eksik diye raporlama.

Mağaza için: hedef sayfaya giriş → ürün/koleksiyon bulma → ürün bilgisini anlama → varsa varyant/kişiselleştirme → sepete ekleme → sepet verisini doğrulama → izin verilen ödeme öncesi sınıra kadar ilerleme. Satışa dönük kontrol, gerçek satın alma yetkisi değildir.

Sümen/isimlik gibi özelleştirilen ürünlerde özellikle seçilen renk/parça/isim ile önizleme, özet ve sepet verisi uyuşuyor mu bak. Boş/uzun/özel karakterli değerleri gerektiği kadar dene. Eski konuşmadaki ürün/parça/renk adetlerini sabit kabul etme.

İçerik/landing sayfasında: ana mesaj, gerçek ürün uyumu, ana eylemin hedefi, ilgili bağlantılar ve mobilde görünürlük. Dashboard/araçta: temel giriş → hesaplama/işlem → gerçek sonuç → hata/boş durumdan geri dönüş.

Görsel ve etkileşim kontrolünde: yatay taşma, sticky katmanın içeriği kapatması, dokunma alanı, klavye odak sırası, modal açma/kapama, okunabilirlik ve azaltılmış hareket. Gerekli gerçek etkileşimi denemeden erişilebilirlik ağacından tüm bunları geçti sayma.

Risk sınıflaması önerisi: Engelleyici = ana işlem tamamlanamıyor veya ciddi veri/ücret riski; Kritik = önemli akış bazı yaygın koşullarda bozuk; Orta = belirgin sürtünme; Düşük = işlem engellemeyen küçük düzenleme. Siteye erişilememesi otomatik site arızası değildir; araç/erişim sorunu olabilir.

Test verisi gerekiyorsa izole oturum ve sentetik veri kullan. Canlı iletişim formu dışarı e-posta gönderebilir; bir “gönder” tıklamasının etkisini testten önce değerlendir. İzin yoksa o son adımı atla ve sınırı bildir. Paylaşılan harici ortamlardaki kayıtları izinsiz oluşturma veya temizleme.

Tekrar kontrolünde aynı URL, viewport, oturum ve davranışı mümkün olduğunca eşleştir. Kalan sorunları göster; aynı kök nedenin kopyalarını çoğaltma. Yapılmayan ödemeyi, ölçülmeyen performansı veya görülmeyen mobil ekranı geçmiş test gibi sunma.

Resmî destek: `https://developer.chrome.com/docs/lighthouse/accessibility/scoring`. Bu protokol kullanıcı iş akışlarına göre hazırlanmış test tasarımıdır; sertifikasyon veya eksiksiz WCAG denetimi değildir.
