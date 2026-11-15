---
name: gof-admin-panel-ux
description: Tasarla veya yenile: ürün, sipariş, müşteri, içerik ya da ayar yönetilen görev odaklı web admin panelleri. Genel vitrin sitesi ve yalnız küçük stil düzeltmeleri için kullanma.
---

# Admin paneli deneyimi

Önce mevcut yetkileri, veri kaynaklarını ve gerçekten çalışan işlemleri çıkar. Paneli vitrin sayfası gibi değil, sık tekrarlanan görevleri az adımda tamamlatan bir çalışma alanı olarak tasarla.

Bilgi mimarisini kullanıcının görevlerine göre kur. En sık kullanılan bölümleri kısa isimlerle kalıcı gezinmeye yerleştir; sayfa başlığında yalnız o sayfaya ait birincil ve ikincil eylemler bulunsun. Aynı bağlantıları ana içerikte tekrarlama. Masaüstünde sol navigasyon, dar ekranda açılır menü kullan; mevcut konum her zaman belli olsun.

Liste ekranlarında arama, anlamlı filtreler, sonuç sayısı, açık durum etiketleri ve satır başına tek odaklı eylem sun. Ayrıntılı düzenlemeyi satır içinde aşırı sıkıştırmak yerine seçilen kaydın düzenleme yüzeyinde aç. Değişmemiş alanları kaydetme; kaydedilmemiş değişikliği görünür kıl.

Özet ekranı karar vermeyi kolaylaştırmalı: işlem gerektiren kayıtlar, durum dağılımı ve yakın değişiklikler. İşlevsiz grafik veya sahte ölçüm ekleme.

Formlarda yalnız gereken alanları iste; etiket, yardım, doğrulama ve hata metnini alanla ilişkilendir. Başarı ve hata durumlarını görünür ve programatik olarak bildir. Modal açıldığında odağı içine al, kapanınca tetikleyiciye döndür. DOM ve görsel sıra mantıklı eşleşsin.

Silme, arşivleme, toplu durum değişikliği gibi geri dönüşü zor eylemlerde kapsamı açıkça göster ve uygun onay kullan. Arşivlemeyi silme gibi sunma. Kullanıcının seçimini işlem sürerken koru; ağ hatasında başarı mesajı verme.

Bu işte yeni bilgi mimarisi veya kapsamlı panel kuruluyorsa [araştırma özeti](references/research.md) dosyasını oku.
