# sumentakimi.com.tr — frontend planı

Kaynak: masaüstü `Sumen takimi front.txt` (2 Eylül 2026, ilk okumada boştu; bu dosya kanonik kopyadır).  
Mağaza: `https://www.sumentakimi.com.tr/` — Shopify tema `Pastel Atelier` (canlı `t/2`).  
Yerel tema: `C:\Users\DELL\Desktop\sumentakimi-com-tr\theme\`  
SEO ajanı: Grok oturumu `01a06237-3ccc-7da3-be20-bb1a9f7e66e4` (URL, title, H1, koleksiyon, metafield, 301, schema).

Bu dosya SEO `PLAN.md` dosyasının yerine geçmez. Yalnız görünüm, tutarlılık ve arayüz hataları.

## Hedef

Sitedeki görsel sorunları çöz; bütün sayfaları aynı resmi dile çek. Parlak ve pastel ton yok. Dil: üretici, makam, kurumsal — vitrin oyuncağı değil.

## Palet (kilit)

| Token | Hex | Kullanım |
| --- | --- | --- |
| `--forest` | `#1F3A2E` | birincil, buton, odak, footer zemin |
| `--forest-deep` | `#14241C` | mürekkep, koyu metin, header çizgisi |
| `--cream` | `#F4EFE3` | sayfa zemini (vanilya/krem) |
| `--vanilla` | `#FBF6EC` | kart, form, modal yüzey |
| `--cream-dark` | `#E6DCC8` | bant, koleksiyon paneli, hover |
| `--muted` | `#5A6358` | ikincil metin |
| `--line` | `rgba(31,58,46,.22)` | ayırıcı |
| `--focus` | `#1F3A2E` | klavye odağı |

Yasak: lilac, blush, bebek mavisi, açık sage, neon, gradient, cam/blur vitrin efekti.  
Mevcut canlı tokenlar (`--snow #f7f7f3`, `--blue #dce8ef`, `--blush #eadddd`, `--lilac #d9d2e5`, `--sage #dce7df`) kalkacak; aynı CSS değişken adları yeni değerlere bağlanabilir ki HTML sınıf adları kırılmasın.

Tipografi: serif başlık (Bodoni/Didot ailesi durabilir), sans gövde. Radius 0–2 px. Gölge yok veya çok düşük. Hover ölçülü.

## SEO ajanı — dokunulmaz

- Title, meta, H1 metni, canonical, robots, sitemap
- Koleksiyon handle, menü URL, 301, sayfa/blog gövdesi
- Ürün vendor, metafield, fiyat, stok, SKU
- `graphql/`, `backup/`, `url-eslestirme.md`, SEO `PLAN.md`
- Beş ürün şablonunun **içerik mantığı** (`product.sumen` vb.)

Çakışma görülürse dur ve bildir. Görsel sınıf/renk değişimi içerik metnini değiştirmez.

## Güvenli dokunma alanı

- `assets/theme.css` (canlıda var, yerel kopyada yoktu)
- `layout/theme.liquid` theme-color
- Header dropdown zemin rengi
- Pastel panel sınıflarının CSS karşılığı (`panel-blue`, `panel-blush`, `panel-lilac`, `collection-story--blue` …)
- Boş filtre mesajı, yatay taşma, tutarsız kart/buton, mobil menü zemin
- Hero alt metnindeki “Pastel …” ifadesi (görsel marka; SEO ajanına haber)

## Sayfa tutarlılığı

Aynı krom her şablonda:

1. Header krem, orman yeşili marka, tek alt çizgi
2. Ana eylem: orman yeşili dolu buton, krem metin
3. İkincil: çerçeveli orman yeşili
4. Ürün kartı: krem zemin, serif başlık, fiyat orman yeşili değil mürekkep
5. Koleksiyon/ürün/sayfa/blog/sepet/arama/404 aynı token
6. Footer orman yeşili, krem yazı

Şablonlar: ana sayfa, koleksiyon, ürün (5 suffix), rehber, iletişim, hakkımızda, blog, sepet, arama, 404.

## Canlıda görülen sorunlar (2026-09-02)

- Tema adı ve hero alt metni “Pastel”; palet pastel mavi/pembe/lila
- Koleksiyon panelleri dört farklı parlak pastel
- `home-help` mavi bant, `home-assurances` lila, `service-rail` sage — sayfalar birbirine bağlanmıyor
- Ana sayfa “Seçili setler” kristal filtresi boş sonuç gösteriyor
- Yerel temada `assets/` yok; CSS yalnız Shopify CDN’de
- Header dropdown hâlâ `#f7f7f3`
- `theme-color` `#f7f7f3`

## 2026-09-02 yenileme (karmaşa)

Palet değişmişti; iskelet hâlâ “Pastel Atelier” dergi düzeniydi. Canlıda sadeleştirildi:

- Ana sayfa: hero + 4 koleksiyon kartı + 8 ürün + 3 yön + kişiselleştirme + 3 yazı + SSS + güven şeridi
- Kaldırılan: 01–05 cetvel, üst üste binen ürün görselleri, rastgele 8’li kütüphane, work-modes, story çemberi, 183 ürün sabiti, JS filtre boş sonucu
- Tipografi: Palatino/Georgia, başlık ~32–48px (92px değil)
- Header yapışkan, 4’lü düz ürün ızgarası, footer kompakt
- İletişimdeki büyük “S” mührü ve yörüngeler CSS ile gizlendi

SEO H1 / title / koleksiyon URL değişmedi.

## 2026-09-02 kapak + doluluk

Araştırma: lüks/B2B kataloglarda doluluk yeni bölümden değil tek tip kare, tarama satırı ve kart üzerindeki ölçü/malzeme satırından gelir.

Uygulanan:
- Ortak `media-plate`: 4:3, vanilya zemin, `object-fit: contain` — koleksiyon ve ürün kapakları aynı kare
- `/collections` numaralı listeden 15 kart ızgarasına
- Ana sayfa 12 ürün + parça sayısı şeridi (9/10/11/12, mevcut URL)
- Kartta metafield parça · malzeme
- Koleksiyon filtreleri Parça / Özellik / Fiyat gruplandı
- İletişim mührü kaldırıldı, gerçek görsel kondu

## Uygulama sırası

1. Canlı `theme.css` yedekle, yerel `assets/theme.css` oluştur — tamam
2. `:root` tokenlarını orman/krem yap; pastel değişkenleri yeniden bağla — tamam, canlı
3. Header, footer, buton, odak, selection — tamam, canlı
4. Koleksiyon/ürün/blog/iletişim bantlarını aynı kreme çek — token bağlandı, canlı
5. Boş filtre ve küçük UI hataları — kristal kart eklendi; ana sayfa filtre koleksiyon filtresini ezmiyor
6. Viewport 360–1440, klavye, reduced-motion — CSS mevcut; etkileşimli tarayıcı QA bu oturumda yok
7. Canlı yayın — 2026-09-02, tema `191944687908`, yalnız 5 dosya, `--nodelete`

## 2026-09-02 UX turu (canlı)

Baymard/Shopify 2026: galeri+zoom, CTA yanı teslimat metni (eşik yok), mobil yapışkan sepete ekle, koleksiyon `sort_by`, tahminî arama, sepet çekmecesi.

Uygulanan ve canlı (`191944687908`, `--only` + `--nodelete`):
- PDP: `data-product-gallery` küçük resim + zoom dialog; teslimat metni Gebze/İstanbul (teslimat sayfasından); `data-sticky-atc`
- Koleksiyon: native `sort_by` GET; 800px’te katalog 2 kolon
- Arama: `/search/suggest.json`; boş sonuçta deri/kristal/10 parça/tüm sümen
- Sepet: `/cart/add.js` çekmece; kargo notu eşiksiz; boş sepet 4 koleksiyon kartı
- Kargo tutarı, ücretsiz eşik, sahte yorum/stok yok

HTTP 200: ana, deri koleksiyon + `?sort_by=price-ascending`, Liya PDP, boş arama, sepet.
SEO H1/URL değişmedi.

## 2026-09-02 görsel kırpma

Canlı ürün fotoğrafları 2:3 (900×1350). Kart 4:3 + `%` padding + `overflow:hidden` üst/alt kesiyordu.
`theme.css` canlı: media-plate `2 / 3` contain, px inset; kart fiyat hizası; hero `3 / 2` contain; `object-fit:cover` kalmadı.

## 2026-09-02 filtre + navbar

Baymard 2025: yatay etiket şeridi >6–8 tipte zayıf; masaüstü sol sütun, mobil çekmece. Shopify: 5+ filtede sidebar.
Uygulanan: `filter-rail` 4 fieldset, AND, chip, ölü seçenek kapalı, URL yok. Navbar boşluk + 160ms hover; mega menü yok.

Mağaza: `b1zinb-wv.myshopify.com` (sumentakimi.com.tr). `sumen-takimi.myshopify.com` ayrı sitedir, dokunulmadı.

## Çakışma protokolü

SEO ajanı aynı anda `sections/*.liquid` ve `templates/*.json` yazıyor olabilir. Frontend önce CSS ve `theme-color`. Liquid’de yalnız renk/sınıf ve kesin UI hatası. Aynı dosyada içerik metni değişmişse dur.
