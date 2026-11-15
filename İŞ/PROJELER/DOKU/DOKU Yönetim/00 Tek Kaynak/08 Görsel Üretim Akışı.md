# Görsel üretim akışı

## Tasarım 4 adımda çıkar (Faris'in son kararı, 06.11.2026 — çelişkide bu geçerli)
1. **2D kapalı alan çizimi:** Tasarım 2D kapalı alan tekniğiyle çizilir. Portrede referans portre fotoğrafıdır.
2. **Kartela kodları:** Faris onay verince tasarıma göre karteladan renkler seçilir. İlgili kodlar parçaların üzerine yazılır.
3. **Kaplama işleme:** Kodlara ait kaplama dokusu ve renkleri parçalara işlenir.
4. **Radius ve derz:** Son aşamada tüm çizgilerin olduğu yerlere radius ve derz uygulanır.

Her adım ayrı bir görseldir ve kendi kuralları vardır: 1 → [15](<15 Çizim Kuralları.md>) · 2–3 → [07](<07 Malzeme Işık Kartela.md>) · 4 → [03](<03 Derz ve Radius.md>) · portre → [06](<06 Portre Üretimi.md>). Bir adım onaylanmadan sonrakine geçilmez.

GPT'de ve Claude'da aynı akış. Kural: [04](<04 Tasarım Kuralları.md>) · derz: [03](<03 Derz ve Radius.md>) · hata: [09](<09 Hata Kataloğu.md>) · kontrol: [10](<10 Kabul Kontrolü.md>).

## 0. İşi ayır
- Yeni tasarım / düzeltme / yalnız kural. **Kural işinde görsel üretilmez.**
- Sayı verilmediyse: bir görsel, bir üretim çağrısı. Varyant, kolaj, otomatik ikinci deneme yok.
- Hata sürüyorsa doğru diye sunulmaz; Faris istemeden yeniden üretilmez.

## 1. Yol seç

| Durum | Yol |
|---|---|
| Az parça (≈40 altı), büyük sade formlar | **A — tek adım** |
| Çok parça, ince ayrıntı, hayvan yüzü, karmaşık alan | **B — önce harita** |
| İnsan yüzü / portre | **C — koddan harita** ([06](<06 Portre Üretimi.md>)) |

Yarım çizgi, derzsiz renk, çukur ve kararma çoğunlukla modelin parça haritasını kendisi uydurmasından çıkar. B ve C bunu keser.

## 2. Hazırlık (her yol)
1. Konu, ürün türü (tam duvar / bölgesel / pano), ölçü.
2. **Palet tablosu:** her renk = ad + kartela kodu + nerede. Konunun gerçek renkleri.
3. Kartela swatch görselleri referans olarak eklenir.
4. Kalibrasyon fotoğrafı (`Görseller\06 Kalibrasyon`) ikinci referans: yalnız derz/radius/ışık için.

## 3A. Tek adım
Çekirdek istemi doldur (aşağıda) → üret → kontrol.

## 3B. Önce harita
0. **Önce 2D çizim:** [15 Çizim Kuralları](<15 Çizim Kuralları.md>) → kova testi → kodla boyama. Bu yol tercih edilir; aşağıdaki doğrudan harita istemi yedektir.
1. **Harita üret:** düz renkli parça haritası. Oda, doku, ışık, gölge yok.
   ```
   Flat vector piece map of [konu]. Only closed flat shapes, each one solid color from this palette: [palet]. Every boundary line connects at both ends to another boundary or the outer edge; no strokes, no open lines, no hair or fur lines, no shading, no gradients, no texture. Each color change is a separate shape. [Ölçü/oran].
   ```
2. **Haritayı kontrol et:** her çizginin iki ucu bağlı mı, her renk ayrı parça mı, palet doğru mu, parça sayısı makul mü. Hata haritada düzeltilir (yeni harita ya da bölgesel düzeltme).
3. **Render:** onaylı haritayı referans ver, yalnız malzemeye çevir.
   ```
   Turn this exact piece map into a real DOKU wall. Keep every shape, boundary and color exactly as in the map; add no new lines, pieces or details. Each shape becomes one CNC-cut panel wrapped taut in [kaplama]. [Çekirdeğin malzeme ve derz kısmı]
   ```
4. Render haritadan saptıysa: haritadaki o bölge referans verilerek bölgesel düzeltme.

## 3C. Portre
[06 Portre Üretimi](<06 Portre Üretimi.md>). Yüz parçaları kilitli; model yalnız kaplama, sahne ve yüz dışı bölgeler.

## 4. Çekirdek istem
Kısa ve olumlu yaz. Uzun yasak listesi modeli yasaklanana çeker. Negatif liste en sonda, tek satır.

```
Photorealistic interior photo. The wall is a flat jigsaw mosaic of CNC-cut panels, all the same thickness and perfectly flush in one plane. Each piece is one solid color of [kaplama], stretched taut and smooth over thin foam, with only a tiny rounded edge where the material wraps to the back. Pieces butt tightly together. Every seam is a hairline crease where two wrapped edges meet: both sides show a thin soft highlight and a faint shadow in a shallow V. Every seam runs unbroken from one seam or edge to another; every color change is its own piece with a seam around it. Smooth even fine-grain surface. Soft diffuse daylight from slightly above. Subject: [konu], built from interlocking flat shapes that share edges, none on top of another. Colors only from: [palet]. [Floor to ceiling, wall to wall | Panel only, size: ...].
Avoid: puffy or raised pieces, gaps, black outlines, open-ended lines, wrinkles, veins, dents, stitching, text.
```

**Kullan:** flat, flush, single plane, taut, smooth, thin foam, tiny rounded edge, hairline crease, shallow V-groove, interlocking, jigsaw, closed shapes.
**Kullanma:** padded, upholstered, quilted, cushion, 3D, relief, embossed, layered, overlapping, sculpted, textured, rustic, felt, crumpled, organic texture, detailed fur/hair strands.

Konuyu istif değil, kenar paylaşan yan yana şekiller olarak tarif et. Küçük ayrıntıları ayrı parça olarak say: "iris is its own piece with a seam all around".

GPT DOKU kurallarını biliyorsa istem kısa olabilir: "DOKU üretimi, konu: …, palet: …, kapsam: …". Hata tekrarlıyorsa çekirdek istem tam yazılır.

## 5. Fotoğraf ayarı (isteme son satır)

| Sunum | Satır |
|---|---|
| Tam duvar, odalı | Real interior photo, 35 mm, f/8, camera at 140 cm, square to the wall, verticals parallel. Wall 60–75% of frame. 4:5 |
| Bölgesel / pano | 50 mm, f/8, eye level, square to the wall; panel and margin fully visible. 4:5 |
| Odasız düz | 85 mm, f/11, straight on, no perspective, even margin. 4:5 |
| Yakın plan (derz/doku) | 100 mm macro, f/5.6, 40° from the side; 2–4 piece joint, radius and groove sharp. 4:5 |
| Sosyal / Reels | iPhone main camera, handheld, slight angle, natural light. 9:16 |

Gerçekçilik: mimari dergi fotoğrafı. Render pürüzsüzlüğü, HDR, aşırı doygunluk, renk filtresi, bokeh yok. Duvar ana konu; oda öne geçmez; ölçek tutarlı (kapı ≈ 200 cm, priz ≈ 8 cm).

## 6. Çıktı ölçüleri
| Kanal | Ölçü |
|---|---|
| Site / katalog | 4:5 · 2000×2500 |
| Site hero | 16:9 · 2560×1440 |
| Instagram gönderi | 4:5 · 1080×1350 |
| Reels / hikâye | 9:16 · 1080×1920 |
| E-posta | 1200×630 · sRGB JPG · ≤150 KB · duvar ≥ %60 · sağ alt sade |

E-posta boyutu bir boyutlandırmadır; yeni tasarım varyantı değildir.

## 7. Kayıt
- Dosya adı: `NN-Ad__XX-05-11.png`. Kod görsele yazılmaz.
- Otomatik kaydedilen dosya yeniden render edilmez; yalnız kodlu ada çevrilir.
- Yeni konsept → `Görseller\02 Onay Bekleyen`; deneme → `04 Denemeler`; hatalı → `03 Düzeltilecek` + `SORUNLAR.txt`. Görsel silinmez.
- Görsel İndeksi aynı işte güncellenir.
- Yapay görsel konsepttir; gerçek iş diye sunulmaz.

## 8. Düzeltme
- Yalnız istenen hata değişir; kompozisyon, renk, kimlik, sahne korunur.
- Hata türüne göre hazır düzeltme istemi: [09 Hata Kataloğu](<09 Hata Kataloğu.md>).
- Düzeltmeden sonra bütün görsel yeniden kontrol edilir.
