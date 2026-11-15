# DOKU — okuma notları

Güncelleme: 24 Eylül 2026. Bulgular 24 Eylül değişikliklerinden **önceki** durumu anlatır; sonuç en altta. İş numaraları `PLAN.md`'de.

## Yapı (önce)
- Statik site, yayın klasörü `dist/` (`.openai/hosting.json`). Build adımı yoktu.
- Sayfalar: `/` (index + doku.css + atelier.js), `/galeri/` (sabit HTML, 67 bağlantı), `/urun/?tasarim=` (catalog.js + product.js ile JS'de dolar).
- Git temiz; yerel `main` origin'den 1 commit ileride (içerik canlıda zaten vardı).
- Görsel: 336 webp (34,8 MB; 168 büyük + 168 küçük) + 3 özel proje dosyası (PNG 2,4 MB ve 1,4 MB, JPG 25 KB).

## İçerik
- 67 tasarım. `catalog.js`'de 3 koleksiyon (Ev / Çocuk / İşletme). 9 tema yalnız kullanılmayan `app.js`'deydi. → #1, #5b
- `app.js` eski galeri: arama, filtre, sıralama, localStorage "kısa liste" vardı; canlıda hiçbiri yoktu.
- Kod `DK-001…` dizideki sıradan üretiliyordu; araya ekleme tüm kodları kaydırırdı. → #3
- Galeri ve ana sayfa bağlantıları elle yazılmıştı. → #4
- "Taraftar & spor" teması 11 tasarım: DK-056…059 kulüp adı taşıyordu, DK-061…067 kulüp renk/simgesine yakın. → #12
- Fotoğraftan duvara: gerçek müşteri + çocuk fotoğrafı; izin kaydı yok. → #13

## Google / teknik
- Tasarım sayfası HTML'i boştu; ad/açıklama JS ile geliyordu. Tek `/urun/` adresi. → #5, #6
- Canlıda `robots.txt` ve `sitemap.xml` 404; canonical, OG, JSON-LD yoktu. → #7
- Galeride `h1` ve atla bağlantısı yoktu; görsel alt metinleri boştu. → #10

## Görünüm / kod
- Gerçek palet yeşil: `--ink #202b28`, `--paper #f0f2ed`. Fontlar DM Sans + Manrope. Eski notlar bordo + Cormorant diyordu. → #2
- `app.js`, `style.css`, `atelier.css` hiçbir yerden çağrılmıyordu (46 KB). → #1
- `doku.css`: HTML'de olmayan `.manifesto` kuralları vardı. → #1
- Ürün sayfası `theme-color` farklıydı; küçük not rengi sınırda kontrast. → #10
- Ana sayfa 13 blok, 35 görsel. → #11

## Canlı ölçüm (önce, Playwright)
- Ana sayfa mobil (390 px): 8,6 MB, 35 görsel, 12.815 px boy. Masaüstü: 9,0 MB.
- Yatay taşma yok, konsol hatası yok.

## Barındırma (HTTP başlıkları)
- `.webp` dosyaları `application/octet-stream` geliyor; PNG/JPG doğru. → #17
- Tüm dosyalar `max-age=0, must-revalidate`. → #17
- Olmayan adres: gövdesi boş 404. `/galeri` → `/galeri/` 307. → #16
- Canlı HTML'e Cloudflare betiği ekleniyor; kaynakta yok, dokunma.
- Alan adı `*.chatgpt.site`. Kendi alan adı sonra bağlanacak.

## Çevre klasörler
- `Codex/2026-09-21/sites-plugin-sites-openai-curated-remote` aynı `project_id`'li eski kopyaydı; `_ESKI` yapıldı, `hosting.json.eski`. → #18
- Eski kopyadaki `work/validate-atelier.cjs` ve `publish-source.cjs` fikir olarak `tools/check.mjs`'e taşındı.
- `~/.codex/skills/doku-art-direction/SKILL.md`: "az görsel" diyor; yeni ana sayfa 11 görsel.

## Görseller
- Görsellerin tamamı yapay üretim konsept sahneleri; site "konsept" diye etiketliyor.
- Arma/monogramlı: 134, 139 (DK-056), 135, 140 (DK-057), 136, 141 (DK-058), 137, 142, 164, 165 (DK-059), 146, 147 (DK-062), 148, 149 (DK-063). Hepsi yayından çekildi. → #12
- Fotoğraftan duvara: gerçek çocuk yüzü açıkça görünüyor. → #13

## Sonuç (24 Eylül 2026, değişiklik sonrası)
- 62 tasarım + 8 tema + galeri + ana sayfa + 404 statik; 72 adres sitemap'te.
- Ana sayfa: 4 bölüm çıkarıldı, 12 görsel; mobil 1,0 MB, masaüstü 0,8 MB.
- `check.mjs` GEÇTİ; axe WCAG AA 5 sayfa temiz; 390 ve 1440 px'te taşma ve konsol hatası yok.
