# 2D çizim kuralları

Tasarımın ilk aşaması. Sadece çizgi. Bu çizgiler CNC kesim yoludur.

## Kurallar
1. Beyaz zemin, siyah çizgi.
2. Bütün çizgiler aynı kalınlıkta.
3. Renk, gri, gölge, dolgu, doku yok.
4. Her çizgi başka bir çizgiye, kendisine ya da dış kenara bağlanır. **Yarıda bitmez, incelip kaybolmaz.**
5. Çizgiler birleştiği yerde tam birleşir: arada boşluk, karşı tarafa taşan uç yok.
6. Bir sınır = tek çizgi. Çift çizgi yok.
7. Her çizgi iki parçayı ayırır. Süs, tarama, saç teli, tüy, damar çizgisi yok.
8. Her kapalı alan = bir parça = bir renk.
9. Tasarımın dış kenarı kapalı bir çerçevedir.
10. Sivri uç, ince köprü, minik ada yok; iç köşeler hafif yuvarlak. (Portrede küçük parça serbest.)
11. Yazı, numara, logo yok (istenmedikçe).

## Kontrol: kova testi
Her alanı kova aracıyla doldur.
- Renk komşu alana taşıyorsa o alanın çizgisi açıktır → kapat.
- Hiçbir alanı bölmeyen çizgi varsa → sil ya da kenara bağla.
- Test geçmeden boyamaya geçilmez.

## GPT istemi
```
Clean 2D line drawing of [konu]. Black lines on pure white, all lines the same thickness. No color, no gray, no shading, no fill, no texture. Every line connects at both ends to another line or the outer frame; no line stops in the middle. Lines meet exactly, with no gaps and no overshoot. No decorative strokes, hatching, hair or fur strands. Every enclosed area is one future piece. Closed outer frame. [Ölçü/oran]
```

## Sonra
1. Çizim vektöre çevrilir; bu dosya aynı zamanda CNC kesim dosyasıdır.
2. Boyama kodla yapılır: her kapalı alana karteladan tek renk.
3. Boyalı harita görsel modeline verilir; model yalnız kaplamaya çevirir ([08](<08 Görsel Üretim Akışı.md>)).
