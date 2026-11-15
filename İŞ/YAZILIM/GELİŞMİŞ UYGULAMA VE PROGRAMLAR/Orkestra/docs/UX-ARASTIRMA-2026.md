# Orkestra yönetim uygulaması: UX ve görsel sistem araştırması

Tarih: 21 Eylül 2026

## Sonuç

Orkestra bir vitrin sitesi değil, gün boyu kullanılan masaüstü bir iş işletim sistemi olmalı. En önemli başarı ölçütü ekranda çok seçenek göstermek değil; kullanıcının “şimdi neye müdahale etmeliyim?” sorusunu birkaç saniyede cevaplamak ve siparişten ödemeye kadar işlemi bağlam kaybetmeden tamamlatmaktır.

## En önemli yapısal ilkeler

1. **Bilgi mimarisi departmanlardan önce gerçek görevleri izlemeli.** Kullanıcının sık yaptığı işler kalıcı gezinmede; seyrek ayarlar ise yönetim alanında bulunmalı. Shopify, navigasyonun kullanıcı görevlerinden üretilmesini, mümkün olan en az kategori kullanılmasını, kısa isimler seçilmesini ve ana navigasyonun içerikte tekrarlanmamasını öneriyor.

2. **Uygulama kabuğu ile çalışma yüzeyi ayrılmalı.** Kalıcı gezinme ürünün yönünü gösterir; orta alan seçilen kaydın listesini, ayrıntısını ve eylemlerini taşır. Carbon UI Shell, sol alanı ürün navigasyonu; sağ alanı sistem düzeyi yardımcı işlemler için tanımlar. Bu ayrım Orkestra’daki üst/sol/sağ düğme düzeninin aynı işi tekrar etmesini önler.

3. **“Bekleyen işler” bir navigasyon kopyası değil, operasyon kuyruğudur.** Sol tarafta bekleyen sipariş, iş, ödeme ve kargo gibi müdahale gerektiren filtreli görünümler bulunmalı. Tamamlanan kayıtlar bu hızlı kuyruğu şişirmemeli.

4. **Her liste gerçek iş yapabilmeli.** Arama, anlamlı filtre, sonuç sayısı, açık durum etiketi ve satırın bağlamına uygun tek ana eylem birlikte bulunmalı. Carbon, veri tablosu araç çubuğunu arama, filtre, görünüm ayarı ve birincil eylemler için öneriyor; yoğun veride tabloya mümkün olan en geniş alanın verilmesini istiyor.

5. **Ayrıntı gerektiğinde kademeli açılmalı.** Özet satır taranabilir kalmalı; siparişin ürün eşlemesi, görevleri, kargosu, faturası ve geçmişi ayrıntı yüzeyinde açılmalı. Karmaşık işlerde tam ekran çalışma yüzeyi kullanılabilir; ancak aynı ana eylem birden fazla yerde tekrarlanmamalı.

6. **Özet ekranı karar üretmeli.** Yalnız işlem gerektiren kayıtlar, durum dağılımı ve son önemli değişiklikler gösterilmeli. Dekoratif grafik ve sahte KPI eklenmemeli. Carbon dashboard rehberi, güçlü hiyerarşi, az sayıda metrik, tutarlı renk ataması ve dikkat dağıtan içeriğin kaldırılmasını öneriyor.

7. **Yetki, görünürlük ve kişiselleştirme ayrı kavramlar olmalı.** Kullanıcının bir modülü gizlemesi API yetkisini değiştirmemeli. Yönetici erişimi belirler; kullanıcı kendi çalışma yüzeyini düzenler. Görsel kilit yalnız sunucu tarafındaki yetki kontrolünün kullanıcıya yansımasıdır.

8. **İşlem durumu her zaman görünür olmalı.** Yükleniyor, boş, hata, kısmi veri, başarı ve güncel olmayan veri ayrı durumlar olarak ele alınmalı. Ağ hatasında başarı mesajı gösterilmemeli; kaydedilmemiş değişiklik varsa kullanıcı bağlamdan ayrılmadan önce uyarılmalı.

9. **Veri modeli ve süreç tasarımı arayüzden önce gelir.** Microsoft model odaklı uygulama rehberi önce iş verisinin modellenmesini, sonra süreçlerin tanımlanmasını, ardından uygulamanın oluşturulmasını öneriyor. Sipariş, müşteri, ürün, görev, kargo, fatura ve ödeme kayıtları aynı kimlik zinciriyle bağlanmalı; tekrar gelen olaylar idempotent işlenmeli.

10. **Erişilebilirlik masaüstü uygulamasında da temel gereksinimdir.** Metin kontrastı normal yazıda en az 4.5:1 olmalı; hedefler en az 24×24 px, konforlu kullanım için yaklaşık 44×44 px olmalı; görünür klavye odağı sağlanmalı ve renk tek başına anlam taşımamalı.

## Görsel sistem kararı

Önceki sıcak bej ve çok renkli pastel kategori sistemi, üç gezinme şeridini de aynı anda öne çıkarıyordu. Bu durum merkezi çalışma alanının hiyerarşisini zayıflatıyor ve uygulamayı bir iş aracından çok “uygulama başlatıcı” gibi gösteriyordu.

Yeni yön:

- Koyu lacivert/grafit uygulama kabuğu
- Açık, yüksek okunabilirlikte merkezi çalışma yüzeyi
- Seçim, odak ve birincil eylem için tek turkuaz marka rengi
- Kırmızı, sarı, yeşil ve mavi yalnız hata, uyarı, başarı ve süreç durumu için
- Daha az gölge, daha küçük köşe yarıçapı, daha net sınırlar
- Her kare düğmede sabit ikon–etiket düzeni
- Google, ChatGPT, YouTube ve Excel’de gerçek marka işaretleri; iş modüllerinde tutarlı çizgi ikonları
- Kullanıcı yoğun çalışıyorsa veri tablolarında kompakt; dokunma ağırlıklı kullanıyorsa rahat yoğunluk seçeneğine açık tasarım

Fluent, nötr renklerin yüzey ve hiyerarşiyi kurmasını; paylaşılan/semantik renklerin yalnız anlamlı durumlarda ve seyrek kullanılmasını öneriyor. Marka renginin büyük yüzeylerde aşırı kullanılmasının gezinmeyi zorlaştırabileceğini ayrıca belirtiyor. Bu nedenle kategori başına farklı pastel renk yerine tek vurgulu, nötr tabanlı sistem seçildi.

## Orkestra’ya uygulanan kararlar

- Üst şerit: ana iş alanları
- Sol şerit: yalnız bekleyen iş kuyrukları
- Sağ şerit: yönetim, bağlantı, denetim, hata, kişisel görünüm ve araçlar
- Orta alan: seçili listenin veya kaydın tek çalışma yüzeyi
- Renk sistemi: grafit kabuk + beyaz yüzey + turkuaz vurgu
- Düğme hiyerarşisi: normal, üzerine gelme, odak ve seçili durumlar net ayrıldı
- Durum renkleri dekorasyondan ayrıldı
- Liste ve form yüzeyleri daha sakin, daha geniş ve taranabilir hale getirildi

## Kaynaklar

- Shopify App Design Guidelines: https://shopify.dev/docs/apps/design
- Shopify Navigation: https://shopify.dev/docs/apps/design/navigation
- Shopify App Structure: https://shopify.dev/docs/apps/design/app-structure
- Carbon UI Shell Header: https://v10.carbondesignsystem.com/components/UI-shell-header/usage/
- Carbon Data Table: https://carbondesignsystem.com/components/data-table/usage/
- Carbon Dashboards: https://carbondesignsystem.com/data-visualization/dashboards/
- Carbon Tree View: https://carbondesignsystem.com/components/tree-view/usage/
- Fluent 2 Color: https://fluent2.microsoft.design/color
- Fluent 2 Design Tokens: https://fluent2.microsoft.design/design-tokens
- Microsoft Power Apps App Building: https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/app-building-steps
- Microsoft Productive Forms: https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/design-productive-forms
- W3C WCAG 2.2: https://www.w3.org/TR/wcag/
