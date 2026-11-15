# Hata kataloğu

Görsel üretiminde tekrar eden hatalar. Her hata: görünüm → neden → önleme → düzeltme istemi.
Örnek görseller: `Görseller\06 Kalibrasyon\Hata Örnekleri`.

## H1 · Yarım kalan çizgi
- **Görünüm:** Parçanın ortasında başlayan ya da biten, incelerek kaybolan çizgi. Saç tutamı, tüy, kıvrım, yaprak damarı. (04.11 saç görseli)
- **Neden:** Model formu "işaret çizgisiyle" anlatıyor. Fiziksel olarak bu bir kesim değil; üretilemez.
- **Önleme:** "Every seam runs unbroken from one seam or edge to another." Tutam/tüy gerekiyorsa kapalı ayrı parça olarak iste. Çok parçalıysa B yolu (harita önce).
- **Kontrol:** Her çizgiyi iki ucuna kadar takip et.
- **Düzeltme:** Çizgi formu taşıyorsa en yakın derze uzatılır (yeni kapalı parça olur); taşımıyorsa tamamen silinir.
  ```
  Edit only the marked lines. Each marked line must either continue until it meets the nearest seam or edge, closing a new flat piece, or be removed completely. Keep everything else exactly the same.
  ```

## H2 · Derzsiz renk değişimi
- **Görünüm:** Renk, ton, doku ya da parça değişiyor ama arada derz yok. Özellikle gözler, iris, göz akı, burun, küçük ayrıntılar. (04.11 ahtapot gözü)
- **Neden:** Model küçük ayrıntıyı parça içine boyuyor.
- **Önleme:** Küçük parçaları istemde tek tek say: "the eye white, iris, pupil and highlight are each separate flat pieces with a seam all around". Yüzlerde C yolu.
- **Kontrol:** Göz ve küçük ayrıntı bölgelerini büyüt.
- **Düzeltme:**
  ```
  Edit only the marked area. Every color change inside it becomes a separate flat piece with the same fine seam as the rest of the wall (both edges slightly rounded). Do not change shapes or colors.
  ```

## H3 · Damar, çizgi, çukur, buruşukluk
- **Görünüm:** Yüzeyde damar, kırışık, ezik, çukur, keçe/kâğıt benzeri buruşuk doku. Çok parçalı işlerde her yerde. (04.11 kaplan)
- **Neden:** "Leather/texture/organic" kelimeleri ve parça yoğunluğu modeli dokuyu abartmaya itiyor.
- **Önleme:** "stretched taut and smooth, smooth even fine-grain surface". "textured, rustic, felt, crumpled" kullanma. Parça sayısını azalt.
- **Kontrol:** Büyük düz yüzlere bak; doku her parçada aynı ince ölçekte mi.
- **Düzeltme:**
  ```
  Keep every shape, seam and color. Make every panel surface taut, smooth and flat with only a fine even grain; remove all wrinkles, veins, dents and creases inside the pieces.
  ```

## H4 · Rastgele renk
- **Görünüm:** Konuda olmayan renkler: ağaçta turuncu gövde, mavi yaprak. (04.11 ağaç)
- **Neden:** Palet modele bırakılmış.
- **Önleme:** Palet tablosu üretimden önce yazılır; konunun gerçek renkleri → kartela kodu. İstemde "Colors only from: …".
- **Kontrol:** Her rengi konunun gerçeğiyle karşılaştır.
- **Düzeltme:**
  ```
  Keep every shape and seam exactly. Recolor only: [parça] → [renk/kod]. Use only these colors: [palet].
  ```

## H5 · Karmaşık alanda bozulma
- **Görünüm:** Sık ayrıntılı bölgede yarım çizgi, çukur, kararma, birbirine karışan parçalar.
- **Neden:** Model çok sayıda küçük parçayı tek seferde tutarlı çizemiyor.
- **Önleme:** Sadeleştir (küçük parçaları ana forma kat). Yetmiyorsa B veya C yolu. Başlangıç ölçütü ≈ 40 parça.
- **Düzeltme:** Bozuk bölgenin haritası ayrı çıkarılır, bölgesel düzeltmede referans verilir.

## H6 · Yanlış radius / derz
- **Görünüm:** Siyah kontur, açık yarık, kalın kanal, tek taraflı yuvarlama, şişkin/üst üste parça, ya da derzin tamamen silinmesi. (04.11 gerçek derz fotoğrafları doğrusunu gösterir)
- **Neden:** Model "upholstered panel" kalıbına gidiyor ya da derzi çizgi sanıyor.
- **Önleme:** [03](<03 Derz ve Radius.md>) istem cümlesi + kalibrasyon fotoğrafı referansı. "padded, upholstered, relief" kullanma.
- **Kontrol:** Figür–arka plan sınırı, aynı renkli komşular, küçük detay: üç bölgeyi büyüt.
- **Düzeltme:**
  ```
  Keep every shape and color. Make all pieces perfectly flat and flush in one plane. Redraw every seam as a hairline crease where two taut wrapped edges meet, each edge rolling over a tiny radius with a thin soft highlight on both sides. No black lines, no gaps, no raised pieces.
  ```

## Önceden görülmüş diğer hatalar
| Hata | Kural |
|---|---|
| Kolaj, birden çok tasarım bir karede | Tek sahne |
| Parça içinde boyalı gölge, iki tonlu yaprak | Her ton ayrı parça |
| Radiusu eksik yaprak damarı, dekoratif çizgi | H1 + H6 |
| Burun yuvarlak çıkıntıya dönmüş, kirpik/iris silinmiş | [05](<05 Yüz Kuralları.md>) |
| Tam duvarda çıplak duvar şeridi | Arka plan da parça |
| Sivri boynuz, ince bacak, ip/tel | Kalınlaştır, yuvarlat |
| İstenmemiş yazı, logo | Kaldır |
| Harfte gereksiz bölme (K), gereksiz iç çizgi (U) | Harf tek parça, iki yanı radiuslu |
