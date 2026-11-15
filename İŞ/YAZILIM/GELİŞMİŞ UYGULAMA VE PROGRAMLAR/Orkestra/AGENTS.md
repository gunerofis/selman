# Orkestra

Alan: İŞ/YAZILIM/GELİŞMİŞ UYGULAMA VE PROGRAMLAR/Orkestra. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Mevcut dosya adlarını ve bağlantıları koru. Yalnız istenen dosyalarda çalış; sonucu kısa doğrula.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

# Orkestra çalışma kuralları

- Gerçek bağlantısı olmayan modülü çalışıyor gibi gösterme; `Bağlantı gerekli` veya `Desteklenmiyor` durumunu kullan.
- Tüm okuma ve yazmalarda sunucu tarafı kimlik ve yetki kontrolü uygula.
- Parola, kişisel erişim anahtarı, cookie ve sağlayıcı tokenlarını repoya veya loglara yazma.
- Stok açılışı `1000 / unverified` olarak başlar; doğrulanmış stok veya kanal yayımı sayılmaz.
- Dış yazmalar açık teyit, idempotency anahtarı ve kalıcı işlem durumuna bağlanmadan etkinleştirilmez.
- Kullanıcı görünüm tercihini işlem yetkisinden ve arka plan otomasyonundan ayrı tut.
- Her yazma işlemi anlamlı audit kaydı üretir; demo veri gerçek entegrasyon başarısı sayılmaz.
- Değişiklikten sonra `pnpm check` çalıştır.
