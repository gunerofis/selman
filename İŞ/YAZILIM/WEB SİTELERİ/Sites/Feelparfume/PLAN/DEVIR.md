# feelparfume — Devir Notu (29.09.2026)

## Konum
- Proje: `Desktop\selman\WEB\Sites\parfum` (TanStack Start + Cloudflare Workers + Postgres/PGLite).
- Kaynak: eski Sweb sürüm #60 (Cloudflare version `fb3858ff`), içi soyuldu. Asıl `sweb ARŞİV CLD` klasörüne dokunulmadı.
- Plan: `PLAN/PLAN.md` · Araştırma: `PLAN/ARASTIRMA.md` · Ürün şablonu: `PLAN/urun-sablonu.csv`.

## Çalıştırma
- `npm run dev` → http://localhost:8080 (şu an arka planda açık, log: `dev.log`).
- Admin: `/admin`, kullanıcı adı boş, parola `.grok/app-env.json` içinde (`SWEB_ADMIN_PASSWORD`). Dosya git dışı.
- Katalog paneli: `/katalog-yonetimi`.
- Tip kontrolü: `npx tsc --noEmit` (temiz).

## Yapılanlar
- Marka `feelparfume`, alan adı `www.feelparfume.com` (varsayım), Cloudflare worker adı `feelparfume`; henüz yayınlanmadı.
- Şirket/iletişim bilgileri örnek değer: `src/lib/brand.ts` ve `src/lib/site-config.ts` (yönetim panelinden değişir).
- Parfüm modeli: `src/lib/perfume.ts` (cinsiyet, konsantrasyon, koku ailesi, mevsim, uyarılar).
- Katalog veritabanında: `migrations/0009_perfume_catalog.sql` (perfume_brands, perfume_products, perfume_variants).
  - Okuma/yazma: `src/lib/catalog-db.server.ts`; sunucu fonksiyonları: `src/lib/catalog.ts`; CSV: `src/lib/catalog-csv.ts`.
  - Kök rota kataloğu yükler (`__root.tsx` beforeLoad + loader), `PRODUCTS` global olarak doldurulur.
  - Varyant = hacim; sepette `color` alanı hacim kimliğini taşır (`"50ml"`). Fiyat sunucuda `unitPrice` ile hesaplanır.
- Örnek veri: 16 ürün (`src/lib/sample-products.ts`), boş veritabanına otomatik yüklenir. Kapatma: `src/lib/catalog-mode.ts` → `SHOW_SAMPLE_PRODUCTS = false`.
- Sayfalar: ana sayfa, `/koleksiyon` (filtreler), `/kategori/*`, `/urun/$sku` (ml, nota piramidi, performans, INCI), `/koku-testi`, `/marka`, `/nota`, `/karsilastir`, sepet/ödeme, yasal sayfalar (kozmetik hijyen istisnası eklendi), dinamik `/sitemap.xml`.

## Bilinen durum
- Ödeme hâlâ "sipariş talebi" (kart çekilmez); PayTR Faz 3'te.
- Eski "lines" sistemi (`/urunler`) boş duruyor, `/koleksiyon`'a yönleniyor.
- Katalog tüm ürünlerle HTML'e gömülüyor; ürün sayısı binleri geçerse sayfalamaya çevrilmeli.

## Sıradaki
Faz 2 (görseller) → Faz 3 (PayTR, sipariş durumları, kupon) → PLAN.md sırası.
