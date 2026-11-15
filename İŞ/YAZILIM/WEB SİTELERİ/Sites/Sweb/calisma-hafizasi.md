# SWEB — Çalışma hafızası

**Okuma sırası — 23.10.2026:** Aşağıdaki 15 Eylül “Açık öncelikler” ve eski katalog bilgisi, dosyanın sonundaki 19 Eylül kapsam değişikliğinden öncedir. En son kayıtlı ürün kapsamı yalnız saat ve mücevher kutularıdır. Bugünkü canlı durum ayrıca doğrulanmadı; eski açık maddeler otomatik görev değildir.

**Proje:** `www.gunerofis.online` / Sweb
**Kod kökü:** `C:\Users\Guner Office\Desktop\selman\WEB\Sites\Sweb`
**Ana kaynaklar:** gerçek kaynak kod; eski denetim ve form kayıtları `Desktop\_ARŞİV\CSV\Kayıt Dizini.csv` içindeki `Sweb` grubunda
**Son kontrol:** 15 Eylül 2026

## Kararlar

- Görünen marka adı `Sweb` olarak kalacak.
- Güner Ofis ile görünür marka bağlantısı kurulmayacak; ancak doğrulanmış resmî satıcı bilgileri hukuki alanlarda kullanılacak.
- Kalıcı alan adı kararı bekliyor; mevcut hedef `https://www.gunerofis.online`.
- Bilinmeyen KEP, IBAN, çalışma günü, kargo firması/ücreti ve saklama süresi gibi alanlar uydurulmayacak.
- Açık yayın izni olmadan deploy, push veya canlı veri değişikliği yapılmayacak.

## Doğrulanmış mevcut durum

- Resmî unvan, MERSİS, vergi dairesi/no, adres ve telefon kaynak kodda doldurulmuş.
- Destek ve hukuki e-posta adresleri `gunerofis.com` alan adına çekilmiş.
- Ödeme formunda 81 il ve Türkiye mobil/sabit telefon doğrulaması mevcut.
- Ücretsiz kargo ifadesi varsayılan site ayarında düzeltilmiş.
- Sitemap üretim scripti ve Product/ItemList JSON-LD altyapısı mevcut.
- İletişim kartlarındaki tekrar ve çelişen yardım metni kaynak kodda giderilmiş.

## Açık öncelikler

1. Canlı sitedeki Bomonti/Örnektepe çelişkisini kaynakta tamamen kaldırmak.
2. “Tüm Ürünler” sayfasının kapsamını doğru adlandırmak veya tüm ürün ailelerini gerçekten listelemek.
3. Masa koleksiyonlarının ad/açıklama/içerik uyumunu düzeltmek.
4. CLIK genel malzeme ifadesini P-7001 masif ahşap istisnasıyla uyumlu hâle getirmek.
5. S-8008 ürün bilgisinde ölçü, malzeme, stok ve seçim sürecindeki bilinmeyenleri açıkça belirtmek.
6. Bülten tekrarını azaltmak ve CLIK/SLAC/DESQ adlarının ürün ailesi olduğunu açıklamak.
7. Teknik SEO, mobil, erişilebilirlik ve performans fazlarını gerçek build/tarayıcı çıktısıyla tamamlamak.

## Kanıt durumu

- `SWEB.txt` bulguları: geçmiş canlı inceleme kaydı; dosya mevcut yerde bulunamadı. Her madde kaynak kod ve yeni render ile yeniden doğrulanmalı.
- `SITE-DENETIM-PLAN.md` (ortak arşivde): kaynak kodla desteklenen 14 Eylül denetimi; bazı maddeler 15 Eylül kodunda zaten çözülmüş.
- Kaynak kod bulguları: doğrudan doğrulandı.
- Canlı site ve ödeme akışı: bu hafıza güncellemesinde henüz yeniden doğrulanmadı.

## 15 Eylül 2026 — İlk uygulama paketi

- Ana sayfadaki Bomonti metni kaldırıldı; yönetilen Örnektepe/Beyoğlu adresi kullanılıyor.
- `/koleksiyon` “Ürün kataloğu” olarak doğru kapsamla adlandırıldı.
- Masa koleksiyonlarının ad ve açıklamaları gerçek ürün içerikleriyle eşleştirildi.
- CLIK genel malzeme metni, P-7001 masif ahşap istisnasıyla uyumlu hâle getirildi.
- CLIK ürün başlıklarında kapasite ve ayırt edici özellik öne alındı.
- CLIK ürün sayfalarına ölçü, gövde/kaplama, iç malzeme, stok/üretim ve renk/iç kumaş bilgi durumları eklendi; fiyatlarda KDV ve satın alma güvenceleri görünür oldu.
- Saat ve mücevher listesine fiyat ve isim sıralaması eklendi.
- Kemer düzenleyici ile ütü masası “Ofis” yerine “Giyinme & Çamaşır” kategorisine taşındı.
- Ürün mozaiğinde çift tıklama kaldırıldı; ürünler tek dokunuşla açılıyor.
- Mobil ana ürün görseli ile bilgi kartının üst üste binmesi giderildi.
- Ana sayfadaki ikinci bülten formu kaldırıldı; footer formu tek kayıt noktası olarak kaldı.
- Canonical, robots ve sitemap alan adı `https://www.gunerofis.online` olarak tekilleştirildi; sitemap 913 URL ile yeniden üretildi.
- Doğrulama: typecheck, lint, 24 storefront testi, 8 katalog/sitemap testi ve Cloudflare production build geçti. 390 px tarayıcı kontrolünde yatay taşma ve console hatası görülmedi.

## 19 Eylül 2026 — Katalog sadeleştirme

- Kullanıcı kapsamı: yalnızca saat ve mücevher kutuları kalacak; organizerler ve gerçek deri ürün ailesi tamamen kaldırılacak.
- Aktif LINES yalnızca CLIK; 51 fiyatlı ürün ve 101 saat/mücevher tasarım kaydı korunuyor. Diğer ürün kaynakları boşaltıldı; CLIK arşivindeki üç organizer kaydı da çıkarıldı.
- Ana sayfa, kategori sayfası, menüler, footer, arama, hediye rehberi ve tasarım seçenekleri güncellendi. Eski sepetlerde kaldırılan aileler eleniyor; sunucu sipariş doğrulaması aktif kataloğu kullanıyor.
- Eski ürün/kategori yolları 404; sitemap 80 URL. Kaldırılan public ürün görselleri proje dışındaki geri alma yedeğine taşındı.
- Yedek: C:/Users/Guner Office/Documents/Codex/2026-09-19/sw/work/sweb-before-cleanup
- Doğrulama: 24 storefront testi, 5 katalog testi, typecheck ve Cloudflare build başarılı. Dev ve production preview masaüstü/mobil renderları kontrol edildi; bozuk görsel, konsol hatası ve yatay taşma yok.
- Production preview için public script okumasına diğer public okuyucularla aynı veritabanı-yok fallback eklendi; admin yetkileri değişmedi.
- Bu çalışma canlıya yayınlanmadı.
