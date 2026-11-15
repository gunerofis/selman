# Yapay zekâ devir pilotu
Durum: test tarifi hazır; ChatGPT / Grok / Grokbot üzerinde yürütülmedi.
Anonim görev AI-DEMO-001: iki kanaldaki aynı örnek SKU için stok ve sipariş varsayımlarını tek operasyon işine dönüştür. Girdi: fiziksel stok 10, mevcut rezervasyon 3, yeni sipariş 2; ikinci bildirim aynı dış sipariş kimliğini taşır.
İlk araç görevi yapılandırır; ikinci araç varsayımları ve sayısal sonucu inceler. Grokbot yalnız gerçek işlevi doğrulanmışsa desteklediği devir adımına atanır. Aksi durumda manuel devir kaydıyla süreç sınanır.
Beklenen: yeni rezervasyon toplamı 5; kullanılabilir stok 5; tekrar bildirim stok etkisi oluşturmaz. Araç sonucu kaynak stok sistemini kendiliğinden güncellemez. Aynı iş kimliği ve girdi sürümü korunur.
Kabul: sonuçlar eşleşiyor veya fark gerekçesi kaydediliyor; iş sahibi sonucu inceliyor; görevin dışına çıkılmıyor. Test kanıtı gerçek çalışmadan sonra [kabul şablonuna](../18_DOGRULAMA/KABUL_KAYDI.md) yazılır.
