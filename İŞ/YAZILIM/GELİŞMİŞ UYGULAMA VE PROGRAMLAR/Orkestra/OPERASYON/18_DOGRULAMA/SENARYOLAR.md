# Kabul senaryoları
Aşağıdakiler yürütülmesi gereken işlev senaryolarıdır; gerçek sistem bağlantıları henüz kurulmadığından uygulanmadı.

| Kimlik | Senaryo | Beklenen sonuç |
|---|---|---|
| K-01 | Aynı sipariş olayı iki kez gelir | Tek sipariş ve tek stok rezervasyonu |
| K-02 | Son ürün için iki kanaldan eşzamanlı talep | Yetkili stok kaynağı çakışmayı yönetir; fazla satış görünür istisna olur |
| K-03 | 10 ürünün 6'sı kargoya verilir | Sevk 6, kalan 4; sipariş tamamı teslim sayılmaz |
| K-04 | Kısmi ödeme / iade ve komisyon | Brüt, net, açık bakiye ve düzeltmeler ayrıdır |
| K-05 | Satın alma kısmi kabul, üretim kalite hatası | Kalan tedarik ve sağlam / kusurlu miktar ayrı |
| K-06 | AI görev devri ve çelişen sonuç | Aynı iş / sürüm; çelişki kaydı ve insan iş sahibi |
| K-07 | İzin dışı birim verisine erişim | Sunucu isteği reddeder; veri açığa çıkmaz |
| K-08 | Dış işlemde zaman aşımı | Sonuç sorgulanır; mükerrer ödeme / sevk oluşturulmaz |
| K-09 | Personel rol değişimi / varlık devri | Eski erişim ve zimmet ayrı kapanır |
| K-10 | Destek talebi tekrar gelir | Tek kayıt; ilgili iade işi bitmeden yanlış kapanış yapılmaz |
| K-11 | Sözleşme vadesi / bakım planı | Sorumlu ve yaklaşan iş görünür |
| K-12 | Yedekten test ortamına dönüş | Veri bütünlüğü ve son işlem kimlikleri doğrulanır |

Yapısal kontroller ayrı olarak scripts/validate_structure.py ile çalışır. Bu kontrol işlev senaryolarının yerine geçmez.
