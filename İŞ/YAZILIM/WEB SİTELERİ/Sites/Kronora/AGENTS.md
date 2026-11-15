# Kronora

Alan: İŞ/YAZILIM/WEB SİTELERİ/Sites/Kronora. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Kaynak dosyalarda çalış. Paket ve kilit dosyasından komutları doğrula. Canlı yayına yalnız açık kullanıcı talebiyle geç.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

# Kronora Site Çalışma Talimatı

Bu depo Kronora e-ticaret sitesinin uygulama köküdür. Değişiklikleri bu klasör içinde yap; kullanıcı açıkça istemedikçe başka bir projeye, canlı ortama veya uzak Git deposuna yazma.

## Değişmez katalog kuralı

- Eski/legacy bir prompt verildiğinde onun tema, sayfa yapısı, renk, tipografi, bileşen, metin yerleşimi veya teknik kurulum talimatlarını uygulama.
- Legacy prompttan yalnız ürünler, ürün alanları ve ürün SEO verileri çıkarılabilir: ad, slug/URL, kategori, SKU, fiyat, eski fiyat, para birimi, kısa/uzun açıklama, stok/teslimat, seçenekler, görseller, meta başlık, meta açıklama ve anahtar kelimeler.
- Mevcut katalog kaynağı `app/products.json`; D1 çalışma modeli `app/lib/store.ts` ve `db/schema.ts` üzerinden bu veriyi tüketir. Yeniden tasarım sırasında bu sözleşmeyi ve ürün slug'larını gerekçesiz değiştirme.
- Başlangıç baz çizgisi: 30 ürünün tamamında meta başlık, meta açıklama, anahtar kelime ve görsel bulunuyor. `app/products.json` SHA-256 değeri: `522DBF97594CEE540D839ED518E4604F354E12E1086CEF04A5F41A84D0CF9E9A`.
- Katalog veya SEO alanı değişecekse önce eski/yeni ürün sayısını, slug eşleşmesini ve boşalan alanları raporla. Kullanıcının ürün verisini kaybetme veya görsel tasarım uğruna SEO içeriğini silme.

## Depo ve çalışma modeli

- Yığın: Next.js 16, React 19, TypeScript, Vite/Vinext ve Cloudflare Workers.
- Kalıcı veri: Cloudflare D1 + Drizzle; medya: R2. Mantıksal binding'ler `.openai/hosting.json` içindedir.
- Paket yöneticisi: npm; `package-lock.json` tek yetkili kilit dosyasıdır. Başka lock dosyası üretme.
- Temel alanlar: `app/` route ve UI, `app/api/` sunucu uçları, `app/lib/` veri/iş mantığı, `db/` şema, `drizzle/` migration, `worker/` Worker girişi, `public/` statik medya.
- Doğrulanmış komutlar: `npm run dev`, `npm run build`, `npm test`, `npm run lint`, `npm run db:generate`. Scriptler Bash kullandığı için Windows'ta uygun Bash ortamı olmadan komutları uydurma; mevcut Sites çalışma akışını koru.
- `.openai/hosting.json` bulunduğu için Sites kurallarını kullan. Kullanıcı açıkça istemedikçe deploy, push, commit, veri migration'ı veya canlı kaynak değişikliği yapma.

## Skill seçimi

Her görevde bütün skill'leri birden çalıştırma. Önce ilgili `SKILL.md` dosyasını tam oku, sonra yalnız görev kapsamındaki skill'leri kullan.

- Çok dosyalı/bilinmeyen değişiklik: `repo-audit`
- Yeni sayfa/component/responsive UI uygulaması: `frontend-ui-implementation`
- Gerçek tarayıcı, responsive, console ve network doğrulaması: `browser-qa`
- Teknik SEO, indeksleme ve structured data: `seo-audit`
- Ürün, fiyat, stok, sepet ve sipariş bütünlüğü: `ecommerce-integrity`
- Analytics, dönüşüm eventleri ve consent ilişkisi: `analytics-tracking`
- Core Web Vitals, bundle ve runtime performansı: `performance-audit`
- Klavye, focus, semantics, kontrast ve zoom: `accessibility-audit`
- Auth/API/upload/veri güvenlik incelemesi: `security-review`
- Release öncesi doğrulama ve rollback hazırlığı: `release-verification`
- Faprika/panel enjeksiyonlu özelleştirme: `faprika-safe-customization` — bu projede yalnız altyapı değişirse kullan
- Auth, rol ve izin: `auth-and-permissions`
- Yönetim paneli ve yetkili CRUD: `admin-panel`
- Sepet, sipariş, ödeme ve webhook: `payment-checkout`
- Merchant/feed: `product-feed-merchant`
- Çok dil, locale, hreflang/RTL: `i18n-localization`
- Arama, filtre, sıralama: `search-filtering`
- İçerik modeli ve editör akışı: `cms-content-management`
- Ürün görselleri, R2 ve medya performansı: `image-media-optimization`
- Üretim hata/metric/trace: `observability-error-monitoring`
- D1/Drizzle şema ve geri dönüş: `backup-migration-rollback`
- Paket/runtime yükseltmesi: `dependency-upgrade-safety`
- Sipariş/işlem bildirimleri: `email-notification-flows`
- Cookie, tracking ve gizlilik: `cookie-consent-privacy`
- Harici servis/API/webhook: `api-integration`

Web skill’lerinin geçerli yolu işlem öncesi doğrulanır; eski `C:\Users\DELL` yolu kullanılmaz. Tasarım konsepti eski prompttan türetilmez; yeni görsel yön kullanıcı isteği ve korunmuş katalog içeriğinden oluşturulur.

## Güvenli değişiklik ve doğrulama

- Başlamadan önce `git status --short --branch` çalıştır; kullanıcı değişikliklerini geri alma.
- Secret değerlerini okuma veya loglama. Auth ve admin kontrollerini yalnız arayüze bırakma.
- Para, stok, indirim ve sipariş toplamının güvenilir sunucu tarafında hesaplanmasını koru.
- Ürün detaylarında metadata, canonical/OG ihtiyacı, Product/Offer JSON-LD, sitemap ve robots davranışını birlikte doğrula.
- Görsel yeniden tasarımda önce kabul edilebilir konsepti oluştur; sonra küçük bir ilk görünüm dilimi, ardından kalan sayfalar. Ürün metni ve SEO alanlarını dekoratif kopyayla değiştirme.
- Değişiklik kapsamına uygun lint/build/test ve tarayıcı doğrulaması yap. Başarısız kontrolü gizleme; nedeni ve doğrulanamayan kısmı açıkça belirt.
