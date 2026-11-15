---
name: doku-gorsel
description: DOKU duvar/pano görseli üretirken, mevcut görseli düzeltirken, derz-radius veya üretilebilirlik değerlendirirken ve DOKU üretim kurallarını açıklarken kullan.
---

# DOKU görsel üretimi

Tek geçerli kaynak budur (04.11.2026). Eski tarifler (≈5 mm açık derz, 3–4 mm bitmiş boşluk, siyah kanal, görünmez birleşim, katmanlı kabartma) geçersiz. Eski görseller yalnız kompozisyon referansıdır. Yüz ve portre: **doku-portre**.

## 1. Fiziksel model
1. Eş kalınlıkta MDF + XPE köpük.
2. CNC 3–4 mm bıçakla çizgiden keser. **Her çizgi = iki komşu parçanın ortak sınırı = derz.**
3. Her parça tek kaplama; kaplama kenardan arkaya gerilir, arkadan zımbalanır. Önde zımba, dikiş, biye yok.
4. Germe her kenarda küçük radius oluşturur (R ≤ T, T = XPE kalınlığı).
5. Parçalar puzzle gibi dayanır; kesim boşluğu kapanır. 3–4 mm bıçak izi bitmiş derz değildir.

## 2. Derz
- Kesit: düz yüz → radius → ince temas → radius → düz yüz. **Her sınırın iki yanında radius.**
- Gerçek görünüm: kılcal koyu temas çizgisi, iki yanında dar yumuşak açık omuz (radiusa vuran ışık), sığ V. Yüzeyler aynı seviyede.
- Her sınırda aynı: arka plan, figür, aynı renkli komşular, göz/iris/göz bebeği, burun, dudak, tüy, harf, zemin/tavan/yan duvar kenarı. Üçlü/dörtlü birleşimde kesintisiz.
- Yok: siyah kontur, açık yarık, siyah dolgu, kalın kanal, beyaz şerit, tek taraflı radius, şişkin/üst üste parça, derzin silinmesi.
- Sayısal derz/radius değeri yazılmaz. Faris'in kalibrasyon fotoğrafı varsa derz/radius/ışık için ikinci referanstır.

## 3. Tasarım kuralları
- **Parça haritası:** duvar düz bir harita gibi bölünür; her nokta tek parçaya ait; bindirme, kot farkı yok.
- **Kapalı çizgi:** her çizgi kendisiyle, başka çizgiyle ya da kenarla birleşir. Ortada başlayan/biten, kaybolan çizgi yok. Saç teli, tüy, damar, kırışık çizgisi yok; form gerekiyorsa kapalı ayrı parça.
- **Renk = parça = derz:** her parça tek renk/ton/kaplama. Her renk/ton değişimi ayrı parça ve derzdir; göz, iris, yansıma, burun deliği gibi küçük ayrıntılar dahil. Parça içinde gölge, gradyan, boyalı ayrıntı yok. Aynı renk birden çok parçada olabilir.
- **Palet:** konunun gerçek renkleri, kartelaya eşlenmiş. Ağaçta kahve gövde, yeşil yaprak; konuda olmayan renk yok. Stilize palet yalnız açık istekle. Palet üretimden önce yazılır; model seçmez.
- **Sadelik:** ayrıntı yoğun alan sadeleştirilir; yetmiyorsa önce harita (Bölüm 6). Başlangıç ölçütü ≈ 40 parça.
- **Kaplanabilirlik:** en dar yerde iki radiustan sonra düz yüz kalır; sivri dış uç ve dar iç köşe yuvarlatılır; ince köprü, iğne uç, minik adacık yok. Sayısal minimum uydurma. Portrede en küçük parça sınırı yok.
- **Tanınırlık:** konu ilk bakışta tanınır; kaynak varsa silüet, oran, öğe sayısı, yerleşim korunur; derz motifi anlamsız yerden bölmez.
- **Kapsam:** tam duvar zemin–tavan, yan–yan; arka plan da parça. Pano pano ölçüsünde.
- Yazı, logo, kod, filigran yok; istenen DOKU harf/logo parçalardan kurulur, iki yanı radiuslu.

## 4. Malzeme ve ışık
- Kaplama gergin ve düz. **Damar, kırışık, çukur, buruşukluk yok.** Doku yalnız ince, düzgün gren/dokuma, her parçada aynı ölçek. Keçe, kâğıt, buruşuk deri görünümü yok.
- Süet/kadifede parçadan parçaya çok hafif parlaklık farkı doğal; renk değişmez.
- Işık yumuşak, dağınık, hafif yandan/üstten; derz gölgeleri tek yöne. Duvar karartılmaz; sert güneş, LED yok.

## 5. Kartela ve kod
- Renk/doku kaynağı yalnız https://www.dokuduvar.com/kaplamalar/ swatch görselleri. Alınamazsa söyle; doğrulanmamış kaplamayla üretme.
- Kod: `XX-05-11-13` — XX tam seri adının ilk iki harfi; rakamlar doğrulanmış renk numaraları; her renk bir kez. Birden çok seri ayrı satır, tam adla (Aspendos/Asos karışmaz). Görselden tahmin yok.
- Kod görsele yazılmaz; dosya adı `NN-Ad__XX-05-11.png`. Kod konsept referansıdır.
- Tedarikçi adı hiçbir çıktıda geçmez.

## 6. İş akışı
1. İşi ayır: üretim, düzeltme, yalnız kural. **Kural işinde görsel üretme.**
2. Yol seç: **A** az parça → tek adım · **B** çok parça/ince ayrıntı → önce düz renkli parça haritası, kontrol, sonra haritayı birebir koruyarak malzemeye çevir · **C** insan yüzü → doku-portre.
3. Palet tablosunu yaz (ad + kod + yer), swatch'ları ve kalibrasyon fotoğrafını referans ver.
4. Çekirdek istemi doldur.
5. Sayı verilmediyse tek görsel, tek çağrı. Varyant, kolaj, otomatik ikinci deneme yok.
6. Kontrol (Bölüm 9). Hata varsa açıkça söyle; istenmeden yeniden üretme.
7. Düzeltmede yalnız istenen hata değişir; kompozisyon, renk, kimlik, sahne korunur.
8. Kayıt: otomatik dosyayı yeniden render etme; yalnız kodlu ada çevir.
9. E-posta çıktısı: 1200×630, sRGB JPG, ≤150 KB, duvar ≥ %60, sağ alt sade.

B yolu harita istemi:
```
Flat vector piece map of [konu]. Only closed flat shapes, each one solid color from this palette: [palet]. Every boundary line connects at both ends to another boundary or the outer edge; no strokes, no open lines, no hair or fur lines, no shading, no gradients, no texture. Each color change is a separate shape.
```
B yolu render istemi:
```
Turn this exact piece map into a real DOKU wall. Keep every shape, boundary and color exactly as in the map; add no new lines, pieces or details. Each shape becomes one CNC-cut panel wrapped taut in [kaplama]. [çekirdeğin malzeme ve derz kısmı]
```

## 7. Çekirdek istem
Kısa ve olumlu. Negatif liste en sonda, tek satır.
```
Photorealistic interior photo. The wall is a flat jigsaw mosaic of CNC-cut panels, all the same thickness and perfectly flush in one plane. Each piece is one solid color of [kaplama], stretched taut and smooth over thin foam, with only a tiny rounded edge where the material wraps to the back. Pieces butt tightly together. Every seam is a hairline crease where two wrapped edges meet: both sides show a thin soft highlight and a faint shadow in a shallow V. Every seam runs unbroken from one seam or edge to another; every color change is its own piece with a seam around it. Smooth even fine-grain surface. Soft diffuse daylight from slightly above. Subject: [konu], built from interlocking flat shapes that share edges, none on top of another. Colors only from: [palet]. [Floor to ceiling, wall to wall | Panel only, size: ...].
Avoid: puffy or raised pieces, gaps, black outlines, open-ended lines, wrinkles, veins, dents, stitching, text.
```
- Kullan: flat, flush, single plane, taut, smooth, tiny rounded edge, hairline crease, shallow V-groove, interlocking, jigsaw, closed shapes.
- Kullanma: padded, upholstered, quilted, cushion, 3D, relief, embossed, layered, overlapping, sculpted, textured, rustic, felt, crumpled, fur/hair strands.
- Küçük ayrıntıları ayrı parça olarak say: "the eye white, iris, pupil and highlight are each separate flat pieces with a seam all around".

## 8. Hata → düzeltme
| Hata | Düzeltme istemi (yalnız işaretli alan, gerisi aynen) |
|---|---|
| Yarım çizgi | Each marked line either continues to the nearest seam or edge, closing a new flat piece, or is removed completely. |
| Derzsiz renk değişimi | Every color change becomes a separate flat piece with the same fine seam, both edges slightly rounded. |
| Damar/çukur/kırışık | Make every panel taut, smooth and flat with only a fine even grain; remove wrinkles, veins, dents. |
| Rastgele renk | Recolor only [parça] → [renk/kod]; use only [palet]. |
| Yanlış derz | All pieces flat and flush; every seam a hairline crease of two tiny rounded edges with a thin soft highlight on both sides; no black lines, gaps or raised pieces. |
| Karmaşık alan bozuk | O bölgenin haritasını çıkar, referans vererek bölgesel düzelt. |

## 9. Kabul
- [ ] Her çizginin iki ucu bağlı; yarım çizgi yok.
- [ ] Her renk değişiminde derz; küçük ayrıntılar dahil.
- [ ] Her sınırda iki taraflı küçük radius, ince sığ oluk; siyah kontur, yarık, şerit yok.
- [ ] Bütün yüzler aynı düzlemde, gergin; damar, çukur, kırışık yok.
- [ ] Renkler konuya uygun ve paletten; kartela doğrulanmış.
- [ ] Oluk inceliği tüm görselde aynı.
- [ ] Tek görsel; görselde kod yok; dosya adı kodlu.
- En az üç bölge büyütülür: figür–arka plan sınırı, aynı renkli komşular, en küçük ayrıntı. Kusursuzluk veya numuneyle birebir eşleşme iddia edilmez.
