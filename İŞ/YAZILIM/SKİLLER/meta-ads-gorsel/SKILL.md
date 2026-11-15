---
name: meta-ads-gorsel
description: Meta Ads için ürün reklamı görsellerini güncel web kaynaklarıyla araştır, tasarla ve üret. Ürün doğruluğu, mobil okunurluk ve yerleşime uygun dosya teslimi için kullan; bütçe veya kampanya yönetimi için kullanma.
---

# Meta Ads ürün görseli

Çıktı: doğru ürünü gösteren, seçilen Meta reklam alanına uygun bir görsel; kısa tasarım kararı ve kaynak/üretim kaydı. Güzel görünümü ölçülmüş satış başarısı olarak sunma.

## Üretimden önce

- Kullanıcının ürününü, sitesini ve istediği çıktıyı koru. Eski tasarım veya şablon yasaklandıysa önceki görselleri referans olarak açma ve prompta taşıma. Gerçek ürün fotoğrafı tasarım şablonu sayılmaz.
- Resmi ürün sayfasını canlı aç. Model/kod, renk, bölüm sayısı, malzeme ve hedef adresi doğrula. Gösterilecek fiyat/indirim, kampanya süresi, teslimat veya hediye varsa kendi kaynağını ayrıca doğrula. Boş alanı iddiayla doldurma.
- Kaynak fotoğrafın tam boy sürümünü incele. Kapak, çekmece, bölücüler, kilit, kulp ve ürün oranlarını görselde kontrol et. Fotoğraftaki aksesuarların pakete dahil olduğu doğrulanmadıysa bunu ima eden kompozisyon kurma; varsa boş ürün fotoğrafını kullan.
- Yaş, cinsiyet, gelir, müşteri yorumu veya en çok satan iddiasını tahmin etme. Eksik hedef kitle verisi tasarımı engellemiyorsa demografik vaat eklemeden ürünün doğrulanmış kullanımına odaklan.

## Webden tasarım kararı

İlk uygulamada [kaynak notunu](references/web-kaynaklari.md) oku. Yeni işte seçilen yerleşimin güncel Meta Ads Guide sayfasını yeniden aç; arama özetiyle yetinme. Erişim engelinde mevcut tarayıcıyla resmi sayfayı oku veya doğrulanamayan kuralı belirsiz bırak. Kaynağın adresini, erişim tarihini ve kapsamını kaydet.

Üç şeyi ayır:

1. **Teknik gereklilik:** dosya türü/boyutu, kabul edilen oran ve minimum genişlik gibi kaynakta gereklilik olan alanlar.
2. **Platform tavsiyesi:** önerilen çözünürlük, metin uzunluğu ve güvenli alan. Tavsiyeyi yükleme zorunluluğu diye yazma.
3. **Tasarım tercihi:** mesaj, fon, renk, yazı karakteri ve yerleşim. Bunları kaynağın dayattığı veya performansı kanıtlanmış kararlar gibi sunma.

Meta Blueprint'in mobil okunurluk, tek odak ve kullanımın anlaşılması ilkelerini uygula. Tek ana mesaj seç; gerçek ürün farkını görünür kıl. Ürün fotoğrafı ve kısa açıklamayı birlikte değerlendiren e-ticaret araştırmalarının reklam dönüşüm testi olmadığını açık tut. Kullanıcının istemediği ek konsept veya varyant sayısını zorunlu kılma.

## Yerleşim ve üretim

- Akış ile Stories/Reels için aynı kırpmayı otomatik kullanma. Kullanıcının istediği yerleşimleri ayrı düzenle. Yalnız statik akış istendiyse video veya kampanya kurulumu ekleme.
- 26.10.2026 doğrulama başlangıcı: Instagram Feed satış görseli için 4:5, 1440×1800; Instagram Stories görseli için 9:16, 1440×2560 tavsiye ediliyor. Bu sayıları kalıcı standart sayma; güncel sayfayla kontrol et.
- Stories için aynı tarihteki resmi tavsiye: temel öğeleri üst yaklaşık %14, alt %35 ve yan %6 dışında tut. Piksel hesabında kenar payını yukarı yuvarla. Reels veya farklı formatta aynı sınırları doğrulamadan genelleme yapma.
- Özgün reklam görselini yerleşik `image_gen` ile üret. Yerel kaynakları önce `view_image` ile incele. Referansların rolünü belirt; yalnız doğrulanmış ürün fotoğraflarını ürün kimliği için ver. CLI/API yolunu kendiliğinden seçme.
- Promptta kullanım alanını, oranı, ürün referansını, değişmeyecek fiziksel özellikleri, kısa mesajı, birebir Türkçe metni ve kaçınılacak eklemeleri belirt. Birleşik görseli tekrar işlerken ürün ayrıntılarının kaymasını özellikle denetle.
- Ürüne ait bölme, renk, malzeme veya parça ekleme/çıkarma. Kaynaktaki ürünü başka bir modele dönüştürme. Kaynak fotoğrafı yeniden üretildiyse piksel düzeyinde korunduğunu söyleme; yapısal/renk kontrolünün gerçek kapsamını yaz.
- Görseldeki yazı ve düğme tıklanabilir bağlantı değildir. Yönlendirme adresini teslim kaydına yaz; gerçek CTA reklam kurulurken platformdan seçilir. Üretim izni reklam yayını veya harcama izni oluşturmaz.

## Teslim kontrolü

Görseli tam boy ve mobildeki yaklaşık görünümünde aç. Türkçe harfleri, tüm metinleri, bölme sayısını, fotoğrafla model eşleşmesini, kırpmayı ve güvenli alanı kontrol et. Dosyanın gerçek piksel ölçüsünü, türünü ve boyutunu ölç; promptta istenen ölçüyü gerçek çıktı sanma. Hata varsa yalnız gerekli düzeltmeyi yap ve tekrar kontrol et.

Nihai görseli göster; dosya, prompt, ürün/kaynak adresi ve doğrulama sınırını kısa kayda al. Kullanıcının belirlediği klasörü kullan; eski kaydın üzerine yazmadan önce geçerli yedek kuralını uygula. Eski raporları yeni tasarım kanıtı gibi kullanma. Sonucu yalnız gerçekten tamamlandığı düzeyde bildir.

## Kullanıcı özeti

Önce gerçek ürün ve güncel Meta kuralları doğrulanır. Görsel tek mesajla hazırlanır; ürün, metin, mobil görünüm ve dosya ölçüleri kontrol edilerek teslim edilir.
