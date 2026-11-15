# Ölçüm ve teşhis

## Veri türü

Saha: gerçek kullanıcı verisi; kaynak, zaman aralığı, URL/origin kapsamı ve cihaz ayrımını kaydet. Laboratuvar: belirli ortam ve senaryo; cihaz/network/CPU, cache ve ölçülen etkileşimi belirt. Birinin sonucunu diğerinin yerine koyma. Saha verisi yoksa bunu düşük performans olarak yorumlama.

12 Eylül 2026'da doğrulanan iyi CWV eşikleri: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Saha değerlendirmesinde 75. yüzdelik ve üç metriğin birlikte değerlendirilmesi önemlidir. Eşik veya araç davranışı raporda belirleyiciyse güncel resmî tanımı kontrol et. TBT'yi INP adıyla raporlama.

## En küçük yararlı test

Önce istenen URL/davranışta mevcut sorunu yakala. Tam iz ve tüm ağ listesini her soruda dökme; önce ilgili özet ve kritik istek zincirini kullan. Anlamlı varyans varsa ölçümü karşılaştırılabilir koşullarda tekrarla; iyi görünen tek denemeyi seçme. Her görev için sabit test sayısı şartı koyma.

Reload cache temizlemez; soğuk test isteniyorsa gerçek cache ve service worker durumunu araçla doğrula. Araç şemalarını mevcut oturumdan oku; eski çağrı isimlerini tahmin ederek tekrar tekrar deneme. Ortam hatasında desteklenmeyen daemon/port/izin çözümü kurma.

## Kök neden dalları

LCP: gerçek LCP öğesini, TTFB'yi, kaynağın keşfini/yüklenmesini ve render gecikmesini ayır. Hero görselini neden göstermediğini anlamadan yalnız format değişikliği önerme.

INP/yavaş etkileşim: ilgili seçici, modal, sepet veya kişiselleştirme işlemini gerçekten çalıştır; uzun görev, handler ve görsel güncelleme gecikmesini ayır. Sayfa yüklemesi tek başına kullanıcı akışını temsil etmez.

CLS: kaymayı oluşturan öğe ve zamanı yakala; görsel boyutu, font ve sonradan eklenen içerik olasılıklarını kanıtla.

Kaynak yükü: kullanılmama sonucunu rota, varyant, mobil, onay/consent ve gecikmiş etkileşim kapsamıyla sınırla. Preconnect/preload yokluğu tek başına hata değildir. Shopify/CDN tarafından yönetilen sunucu ayarını tema geliştiricisinin değiştirebileceğini varsayma.

Erişilebilirlik ağacı; kontrast, odak görünürlüğü ve klavye akışının tamamını kanıtlamaz. Bunlar istenmişse ilgili görsel/etkileşim testi gerekir; salt hız raporuna otomatik tam erişilebilirlik denetimi ekleme.

## Sonuç

Ölçülen kazancı tahmini kazançtan ayır. Önce/sonra farklı koşullardaysa nedensel iyileşme ilan etme. Araç bağlantısı çözülemezse mevcut kaynaklarla yapılabilen incelemeyi bitir ve ölçülemeyen kısmı açık bırak.

Resmî kaynaklar: `https://web.dev/articles/vitals`; `https://shopify.dev/docs/storefronts/themes/best-practices/performance`; `https://developer.chrome.com/docs/lighthouse/accessibility/scoring` (12 Eylül 2026'da kontrol edildi).
