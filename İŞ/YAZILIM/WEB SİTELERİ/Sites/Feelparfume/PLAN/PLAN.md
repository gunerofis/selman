# feelparfume — Site Geliştirme Planı

**Hedef:** Parfüm ve deneme boyu satan, mobilde hızlı, arama motorunda görünür, yasal metinleri tam bir site.
**Altyapı:** TanStack Start + Cloudflare Workers + Neon Postgres. Ödeme: PayTR. Kargo: Yurtiçi API.
**Veri:** Şimdilik örnek veri (16 ürün, örnek şirket bilgisi). Gerçek veri `urun-sablonu.csv` ile değişir.
**Kural:** Her faz: kod → test → ekran kontrolü → tek cümle rapor. Parantez içi: kullanılacak skill.

## Durum
Hazır: kategori, katalog filtreleri, ürün sayfası (ml, nota piramidi, kalıcılık/yayılım, içerik), koku testi, karşılaştırma, favoriler, sepet, yasal sayfalar, örnek veri.
**Faz 1 tamam:** veritabanı kataloğu, `/katalog-yonetimi` paneli, CSV içe/dışa aktarım, marka ve nota sayfaları, dinamik site haritası.
**Faz 2 tamam:** ürün başına şişe, kutu ve yakın plan; WebP 320/800/1500; tek kemik zemin; kaydırmalı, yakınlaştırmalı galeri ve video kaydı.
**Faz 3 tamam:** PayTR iframe, taksit, iade ve callback hazır; anahtar yokken kart kapalı. Stok ödeme onayında bir kez düşer. Posta kuyruğa yazılır, taşıyıcı yoksa gitmez. Fatura mağaza PDF’idir. Kupon, 30 günlük gerçek fiyat çizgisi, hediye paketi, not kartı ve fiyatsız irsaliye eklendi.
**Faz 4 tamam:** Yurtiçi SOAP, barkod ve takip linki hazır; anahtar yokken gönderi açılmaz. Kargo ücreti ve ücretsiz eşik `/yonetim` Kargo bölümünden. Yurt dışı gönderim kapalı.
**Faz 5 tamam:** Koku testi altı soru ve kayıt; sonuç postası kuyrukta tutulur. Ödenmiş deneme tutarı 30 gün içinde aynı şişede bir kez iner. Keşif seti tam beş deneme boyu, fiyat en ucuz beş deneme boyunun toplamı. Benzer kokular not ve aileyle sekiz öneri. Boş aramada koku testi. Mobilde filtre altta, üründe Öde.
**Faz 6 tamam:** Yorum yalnız teslim edilmiş siparişte, aynı e-posta ve ürün için; kalıcılık, yayılım ve mevsim puanı. Katalog puanı ve şema kayıt varken görünür. Parti no `/garanti` üzerinde sorgulanır. Güven şeridi ETBİS, 14 gün ve parti no; 3D Secure ve SSL ancak gerçekten varken yazılır.

## Faz 1 — Veri altyapısı
1. Ürün, varyant (ml/fiyat/stok/barkod), marka, nota tabloları Neon'a taşınır; kod içi veri kalkar.
2. CSV içe/dışa aktarım (şablon: `urun-sablonu.csv`). (xlsx)
3. Yönetim paneli: ürün, varyant, stok, görsel, öne çıkan, yayında/taslak.
4. Marka sayfaları `/marka/$slug` ve A–Z marka listesi.
5. Nota sayfaları `/nota/$slug` (vanilya, oud, gül…).

## Faz 2 — Görsel
1. Ürün başına 3 görsel: şişe, kutu, yakın plan; WebP 320/800/1500.
2. Arka plan temizleme ve tek tip zemin. (adobe-batch-edit-photos, image_remove_background, adobe-resize-photos-and-videos)
3. Galeri: kaydırmalı, yakınlaştırmalı; video desteği.

## Faz 3 — Ödeme ve sipariş
1. PayTR: 3D Secure, taksit tablosu ürün sayfasında, iade API.
2. Sipariş durumu: alındı → hazırlanıyor → kargoda → teslim; her adımda e-posta.
3. Stok ödeme onayında düşer; stok 0'da "Gelince haber ver".
4. e-Arşiv fatura PDF'i sipariş sayfasında.
5. Kupon: yüzde, tutar, ücretsiz kargo, ilk sipariş. İndirimde üstü çizili fiyat = son 30 günün en düşük fiyatı.
6. Hediye paketi, not kartı, fiyatsız irsaliye seçeneği.

## Faz 4 — Kargo
1. Yurtiçi API: barkod, takip no, takip linki.
2. Kargo ücreti kuralı ve ücretsiz kargo eşiği yönetim panelinden.
3. Yurt dışı gönderim kapalı.

## Faz 5 — Keşif ve dönüşüm
1. Koku testi v2: 6 soru, sonuç kaydı, sonuç e-postası.
2. Deneme boyu tutarı 30 gün içinde aynı ürünün şişesinde indirim olur.
3. Keşif seti oluşturucu: 5 deneme boyu seç, sabit fiyat.
4. Benzer kokular: nota + aile eşleşmesi, ürün başına 8 öneri.
5. Arama: marka/nota/ad, yazım hatası toleransı, sonuç yoksa koku testi.
6. Mobil: yapışkan sepete ekle, tek elle filtre, hızlı ödeme. (modern-web-guidance)

## Faz 6 — Yorum ve güven
1. Doğrulanmış yorum: yalnız teslim alan müşteri; kalıcılık/yayılım/mevsim puanı.
2. Ürün puanı katalog kartında ve Google şemasında.
3. Orijinallik sayfası ve parti no sorgulama formu.
4. Güven şeridi: 3D Secure, SSL, ETBİS, iade koşulu.

## Faz 7 — Üyelik ve sadakat
1. E-posta + Google girişi, adres defteri, sipariş geçmişi, favoriler hesapta.
2. Puan: 100 ₺ = 1 puan; doğum günü ve hoş geldin kuponu.
3. Hatırlatma: yeniden stok, fiyat düşüşü, satın alımdan 90 gün sonra "şişe bitiyor" (izinli).

## Faz 8 — SEO
1. Anahtar kelime haritası: kategori, marka, nota, niyet sorguları. (keyword-clustering, content-strategy)
2. Teknik: canonical, filtreli URL noindex, site haritası, Core Web Vitals. (technical-seo)
3. Şema: Product (GTIN, ml teklifleri, puan), Breadcrumb, FAQ, Organization. (schema-markup)
4. Rehber içerik ayda 4: EDP/EDT, mevsime göre parfüm, kalıcılık, hediye. (create-content, internal-linking)
5. Google Merchant Center + Meta katalog beslemesi; yapay zekâ arama görünürlüğü. (ai-visibility)

## Faz 9 — Pazarlama ve ölçüm
1. GA4 e-ticaret olayları, çerez onayına bağlı.
2. E-posta akışları: hoş geldin, terk edilen sepet, deneme sonrası, yorum isteği. (email-sequence)
3. Kampanya takvimi: Sevgililer, Anneler, Babalar Günü, Black Friday, yılbaşı. (campaign-plan)
4. Sosyal içerik planı ve zamanlama. (postiz, content-creation, adobe-create-social-variations)
5. Aylık panel: satış, dönüşüm, sepet ortalaması, deneme→şişe oranı. (build-dashboard, performance-report)

## Faz 10 — Tasarım
1. Logo, renk, tipografi, bileşen sistemi. (design-system, adobe-fonts, brand-review)
2. Ana sayfa, katalog, ürün, ödeme tasarım incelemesi. (design-critique, ux-copy)
3. Erişilebilirlik WCAG 2.1 AA. (accessibility-review)

## Faz 11 — Test ve yayın
1. Otomatik testler: fiyat, stok, kupon, ödeme geri çağrısı, sipariş durumu. (testing-strategy)
2. Uçtan uca: masaüstü + mobil, test kartıyla sipariş ve iade.
3. Güvenlik: panel 2FA, oran sınırlama, gizli anahtarlar. (code-review)
4. Yayın listesi: alan adı, SSL, yönlendirme, yedek, hata izleme. (deploy-checklist)
5. Örnek veri kapanır (`SHOW_SAMPLE_PRODUCTS = false`), gerçek veri yüklenir, yayın.

## Takvim
| Hafta | Faz |
|---|---|
| 1 | 1, 10.1 |
| 2 | 2, 3 |
| 3 | 4, 5, 6 |
| 4 | 7, 8.1–8.3, 11 → yayın |
| 5+ | 8.4–8.5, 9 |

## Ölçütler
Mobil LCP < 2,5 sn · INP < 200 ms · dönüşüm ≥ %1,5 · deneme→şişe ≥ %20 · yayında 0 örnek veri.
