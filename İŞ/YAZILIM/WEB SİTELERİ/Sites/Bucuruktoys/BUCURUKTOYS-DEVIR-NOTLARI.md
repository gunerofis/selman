# BÜCÜRÜKTOYS — Proje Devir Notları

## Durum — 11.11.2026

Ücretsiz Cloudflare taşıma hazırlığı yapıldı. Canlı geçiş, Supabase dosya erişiminin açılmasını bekliyor. Kullanıcı ödeme ve abonelik istemiyor; ücretli hizmet açılmadı.

- Canlı site: https://www.bucuruktoys.com
- Worker: `katalog`; adres: https://katalog.bucuruktoys.workers.dev
- Korunan canlı sürüm: `490703b4-0efe-4ccd-adfc-31e2cb78b431` (Cloudflare sürüm 24).
- Cloudflare hesabı: `4a84519bceedefed36cb86f6bf37e4aa`; Wrangler profili: `bucuruktoys`.
- Hazırlanan D1: `bucuruktoys`, `875ef0d6-0271-45a7-ac30-581e7db90e2d`.
- Eski Supabase: `qpwoxhkfouaofjnqeswm`. Aynı projedeki diğer sitelerin tablolarına dokunulmadı.
- Eski Sites kaydı: `appgprj_6a5b8d36247c8191b6386e365c787948`, sürüm 32; Cloudflare sürümüyle karıştırılmaz.

## Hazırlanan yapı

Veriler D1 kullanıyor. Mevcut panel ve roller korunuyor. Giriş e-posta ve rastgele panel anahtarıyla yapılıyor. Oturum 30 gün geçerli; kullanımda yenileniyor. Anahtarlar yalnız merkezi `API ve Erişim Bilgileri.json` kaydının `bucuruktoys_cloudflare` bölümünde. Eski Supabase şifreleri yeni panelin giriş anahtarı değildir.

Mevcut ürün görselleri Worker statik dosyalarına taşınacak. Yeni yüklemeler D1 içinde tutuluyor; ürün görselleri tarayıcıda WebP biçimine küçültülüyor. R2 ve Cloudflare Access kullanılmıyor. Kaynak SQL dosyalarındaki kişisel form kaydı kapalı durumu hazırlıkta korunuyor; canlı izinler geçiş öncesi karşılaştırılmalı.

13 tablodaki 1.847 kayıt aktarıldı: 207 ürün, 4 adet 3D ürün, 7 kategori, 6 sayfa, 8 ayar, 2 yönetici; diğer satırlar analitik, stok ve işlem kayıtlarıdır.

## Doğrulama

- D1 dışa aktarımı ayrı SQLite veritabanına geri yüklendi. Bütün alanlar kaynak yedeğiyle aynı; bütünlük ve ilişki kontrolleri geçti.
- 24 yalıtılmış işlev testi ve 14 yerel HTTP testi geçti.
- TypeScript, hedef dosyaların lint kontrolü, üretim derlemesi ve yayın dry-run kontrolü geçti.
- Yerel tarayıcıda giriş, ürün listesi ve yönetim alt ekranı açıldı.

## Geçiş engeli

467 ürün görseli ve 2 özel dosya Supabase kota engeli nedeniyle indirilemiyor (HTTP 402). Eksik dosyalarla canlı geçiş yapılmadı. `npm run migration:check` şu anda eksik görseller nedeniyle yayını durduruyor.

Dosyalar açıldığında mevcut kayıtlar yeniden eşitlenmeli; dosyalar boyut ve özetleriyle doğrulanmalı. Ürün görselleri `public/files/product-images` altında tutulmalı; özel dosyalar yalnız D1 içinde kalmalı. D1 içindeki eski görsel adresleri değiştirilmeden geçiş tamamlanmış sayılmaz. Standart yayın komutu `npm run deploy`, dosya kontrolü geçmeden çalışmaz.

## Yedek ve geri dönüş

Yedek klasörü: `Arşiv/Cloudflare Taşıma Öncesi 2026-11-11`. `Kaynak.zip`, canlı Worker içeriği/ayarları, `Veri.json` ve doğrulanmış `D1 Doğrulama.sql` bulunur. `Veri.json` özel erişim verisi içerir; genel site dosyalarına konmaz.

Mevcut canlı Worker sürümü ve eski Supabase verisi korunuyor. Yeni yayın doğrulanmadan eski kaynak kaldırılmaz. Geri dönüşte yukarıdaki Cloudflare sürümü kullanılır; yeni sisteme yazılmış kayıtlar varsa önce korunur.

## Kullanıcı özeti

Ücretsiz altyapı ve mevcut admin panelinin yeni bağlantıları hazırlandı ve yerelde test edildi. Ödeme veya abonelik açılmadı. Supabase dosya erişimi kapalı olduğu için canlı geçiş bekliyor.
