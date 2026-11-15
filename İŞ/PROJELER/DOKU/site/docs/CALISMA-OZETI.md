# DOKU — çalışma özeti

## 11 Ekim 2026

- GS G-134/139/144/145 ve TS G-137/142/164/165 monogramları kaldırıldı. Yeni PNG kaynakları `assets/originals/2026-10-11-monogram-removal/` içindedir; tam görsel, 900 px ve kart sürümleri yenilendi. Built-in imagegen istemi: harf ve armayı kaldır; oda, palet, aslan/dalga temasını koru; geniş radiuslu panel parçaları kullan. Görsel etiketleri yeni kompozisyona göre güncellendi.
- Canlı `/yonetim/`: gerçek yönetici hesabıyla giriş, G-021'e etiket ekleme, Kaydet, sayfa yenileme, galeri/kategori eşleşmesi ve etiket silme GEÇTİ. Deneme etiketi silindi; önceki altı etiket grubu birebir korundu.
- Kaynak katalog: 271 kayıt, 415 görsel. `data/product-groups.json`: 326 gerçek ürün; türevler aynı kartta.
- `src/product-core.mjs`: ürün ayrımı ve eski görsel adresleri. TS, GS, BJK, FB ve Türkiye ayrı ürün kartları.
- `src/category-core.mjs`: her etiket bir kategori; bir görselde tek sayılır, tekrar sayısıyla sıralanır. 807 başlangıç kategorisi.
- `/tasarimlar/`, `/kategori/<slug>/` ve sitemap, yönetimdeki kalıcı etiket değişikliklerini okur.
- HTML ve sitemap Worker'dan sunulur; `dist/client` içinde aynı yolların statik kopyası tutulmaz. Yayın paketinde yalnız `dist/assets` kopyasını dışla: `TAR_OPTIONS='--force-local --exclude=dist/assets'`. Asıl görseller `dist/client/assets` içindedir.
- Kaplama kartela kaynağı yalnız DOKU YÖNETİM\06 KAPLAMALAR içinde tutulur; site kaynağında ve sitede yazılmaz.
- `node tools/build.mjs`, `node tools/check.mjs`, `node tools/search-check.mjs`, `node tools/admin-check.mjs`: GEÇTİ.

Güncelleme: 24 Eylül 2026. Proje dizini: `Documents/Codex/2026-09-23/mor-renkten-ka-daha-sade-daha/work/doku-site`.
Eski kopya `Documents/Codex/2026-09-21/sites-plugin-sites-openai-curated-remote_ESKI` (yayın dosyası devre dışı); oradan yayın yapılmaz.

## Nasıl üretilir
1. `cd tools` → ilk kez `npm install`.
2. Yeni görsel eklendiyse `node images.mjs` (900 px sürüm, 200 KB sınırı).
3. `node build.mjs` → `dist/` baştan üretilir.
4. `node check.mjs` → GEÇTİ görmeden yayınlama.

Elle düzenlenen kaynaklar: `data/catalog.json`, `data/site.json`, `src/*`. `dist/` içindeki HTML/CSS/JS elle düzenlenmez.

## Dosyalar
- `data/catalog.json`: 67 kayıt (62 yayında, 5 gizli), 8 tema.
- `data/site.json`: adres, WhatsApp, telefon.
- `src/`: ana sayfa şablonu, CSS, JS, fontlar.
- `tools/build.mjs`, `tools/images.mjs`, `tools/check.mjs`.
- `docs/PLAN.md`: iş listesi ve durum. `docs/NOTLAR.md`: bulgular.

## 24 Eylül 2026 doğrulaması
- `check.mjs`: 81 HTML, 79 sitemap adresi, kırık bağlantı yok, kulüp adı yok.
- Üst menüdeki 4 bağlantı ve "Projenizi konuşalım" gerçek sayfalara gidiyor; 7 sayfa türünde axe temiz, taşma yok.
- Playwright (390 px ve 1440 px): yatay taşma yok, konsol hatası yok, 12/12 ana sayfa görseli yüklendi.
- Ana sayfa indirmesi: mobil (3x ekran) 1,0 MB, masaüstü 0,8 MB. Önce 8,6 MB idi.
- axe (WCAG 2 A/AA): ana sayfa, galeri, tasarım, tema, 404 temiz.
- Eski `/urun/?tasarim=DK-031` → `/tasarim/gol-kiyisi/`; bilinmeyen kod → `/galeri/`.
- WhatsApp mesajı: tasarım adı, kod, görsel kodu, sayfa adresi, ölçü ve not doğru ekleniyor. Mesaj gönderilmedi.

## Açık kalanlar
- Fotoğraftan duvara çocuk fotoğrafı için yazılı ebeveyn izni (Faris).
- `.webp` MIME ve önbellek süresi barındırma tarafında; siteden değiştirilemiyor.
- Search Console kurulumu ve kendi alan adı.
