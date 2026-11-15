---
name: gof-admin-operations
description: Yönetim panellerinde gerçek CRUD, durum değişikliği, toplu işlem, denetim kaydı ve güvenli sunucu doğrulaması kur veya incele. Yalnız görsel dashboard tasarımı için kullanma.
---

# Admin veri işlemleri

Önce mevcut veri şemasını ve sunucu işlevlerini çıkar; arayüzde yalnız gerçek backend işlemlerini göster. Yeni işlem gerekiyorsa veri modelini, sunucu doğrulamasını ve arayüz geri bildirimini birlikte tamamla.

Kimlik doğrulama ve yetki kontrolünü her okuma/yazma sunucu sınırında uygula. Gizli değerleri istemciye gönderme. Girdileri şemayla doğrula, sorguları parametreli tut ve aynı site/CSRF korumasını mevcut mimariye uygun sürdür.

Durum değişikliklerini açık bir yaşam döngüsüyle modelle. Aktif, pasif ve arşiv ayrı anlamlar taşıyorsa birbirine karıştırma. Değişiklikleri mümkünse atomik uygula ve önceki/sonraki değerle denetim kaydı tut.

Toplu işlemlerde seçilen kayıtları ve hedef durumu özetle; kısmi başarısızlığı başarılı gibi gösterme. Aynı istek tekrarlandığında beklenmeyen çift etki üretmemesi gereken işlemleri idempotent tasarla.

Liste sorgularında ölçek için sayfalama, filtre ve sıralamayı sunucuya taşıma gereğini veri büyüklüğüne göre değerlendir. Küçük sabit katalogda istemci filtresi kabul edilebilir; büyüyen veya kişisel veri içeren kayıtlarda gerekli alanları sunucuda seç.

Her yazma sonrası kullanıcıya açık başarı/hata durumu ver ve görünümü sunucu gerçeğiyle eşitle. Oturum süresi dolması, boş sonuç, ağ hatası ve doğrulama hatasını ayrı ele al.

Uygulama veya denetim sırasında [işlem kontrol listesi](references/operations.md) dosyasını oku.
