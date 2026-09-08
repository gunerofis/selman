# BÜCÜRÜKTOYS — Proje Devir Notları

## Güncel durum

- Geçici canlı site: https://katalog.bucuruktoys.workers.dev
- Hedef alan adı: https://www.bucuruktoys.com
- Yayındaki sürüm: 32
- Yönetim paneli: `/admin`
- İçerik ve ayar yönetimi: `/admin/yonetim`
- 3D ürün yönetimi: `/admin/3d-urunler`
- Sites proje kimliği: `appgprj_6a5b8d36247c8191b6386e365c787948`
- Supabase proje kimliği: `qpwoxhkfouaofjnqeswm`
- Kaynak sürüm: `425565b46da1a472368bbb0469391d7d00c0b903`

## Paket içeriği

- Next.js/Vinext uygulama kaynakları
- Tüm genel site, ürün, kategori, teklif, bayi ve 3D sayfaları
- Tam kapsamlı yönetim paneli
- Supabase tablo, RLS, fonksiyon ve katalog SQL dosyaları
- Ürün ve 3D katalog verileri
- Ürün görselleri ve kaynak WhatsApp görselleri
- Yayınlama yapılandırması
- Kurulum ve veri notları

`node_modules`, derleme çıktıları, Git geçmişi, gerçek `.env` dosyaları, parolalar ve gizli anahtarlar pakete eklenmemiştir.

## Yerel çalıştırma

1. Node.js 20 veya üzerini kurun.
2. Proje klasöründe `npm install` çalıştırın.
3. `.env.example` dosyasını `.env.local` adıyla kopyalayın ve gerçek değerleri girin.
4. Geliştirme için `npm run dev`, üretim kontrolü için `npm run build` çalıştırın.

## Gerekli ortam değişkenleri

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` veya `SUPABASE_ANON_KEY`
- `ADMIN_EMAILS`
- `SUPABASE_STORAGE_BUCKET`

Gerçek değerler güvenlik nedeniyle bu ZIP içinde bulunmaz. Sites ortam değişkenlerinde tanımlıdır.

## Yönetici girişi

- Yetkili ana hesap: `slmnkrkmz1@gmail.com`
- İlk girişte `/admin` sayfasına e-posta yazılır ve **Şifremi oluştur / sıfırla** kullanılır.
- Roller: geliştirici, sahip, editör, görüntüleyici.
- Geliştirici rolü yalnızca Selman Korkmaz için yapılandırılmış tek hesaba atanabilir. Geliştirici ve sahip yönetici hesaplarını; editör içerik ve operasyonları yönetir; görüntüleyici yalnızca okur.

## Canlı veritabanı özeti — 27 Ağustos 2026

- 79 ürün, tamamı yayında
- 210 adet 3D ürün kaydı, 30 tanesi yayında
- 7 kategori
- 6 yönetilebilir içerik sayfası
- 8 site ayarı
- 1 aktif yönetici

Müşteri teklifleri, bayi başvuruları ve kişisel veriler güvenlik nedeniyle ZIP'e aktarılmamıştır. Veritabanını yeniden kurmak için `supabase/` klasöründeki SQL dosyaları bulunur; mevcut canlı kayıtların tam yedeği yönetim panelindeki **Yedekleme** bölümünden yetkili kullanıcı tarafından indirilebilir.

## Yönetim kapsamı

- Ürün CRUD, görsel yükleme, fiyat, maliyet, stok, kritik stok ve yayın durumu
- Toplu CSV içe/dışa aktarma
- Stok hareketleri ve işlem yapan yönetici kaydı
- Teklif, bayilik ve 3D talep durumları, iç not, silme ve CSV dışa aktarma
- 3D ürün CRUD, teknik üretim bilgileri, fiyat, görsel ve yayın durumu
- Kategori yönetimi
- Sayfa içerikleri ve SEO alanları
- İletişim/site ayarları
- Yönetici ve rol yönetimi
- Güvenli şifre kurtarma ve açığa çıkan yönetici oturumlarını anında geçersizleştirme
- Denetim günlüğü
- Tam JSON yönetim yedeği

## Önemli dosyalar

- `README.md`: temel proje bilgisi
- `.env.example`: ortam değişkeni şablonu
- `.openai/hosting.json`: Sites bağlantısı
- `supabase/schema.sql`: ana veritabanı şeması
- `supabase/admin_control_center_20260827.sql`: kapsamlı yönetim merkezi şeması
- `docs/ADMIN_PANEL_KURULUMU.md`: yönetim paneli kurulum notları
- `app/admin/`: yönetim arayüzleri
- `app/api/admin/`: yönetim API'leri
- `lib/supabase-server.ts`: sunucu veri/yetki katmanı

## Yayınlama

Proje Cloudflare Workers üzerinde yayınlanır. `wrangler.jsonc` içindeki `katalog` Worker yapılandırması kullanılır; dağıtımdan önce üretim derlemesi ve `wrangler deploy --dry-run` kontrolü yapılır. `www.bucuruktoys.com` Shopify üzerinden yönetildiği için alan adı yönlendirmesi, mevcut DNS kayıtları ve kesintisiz geçiş planı doğrulandıktan sonra tamamlanmalıdır.
