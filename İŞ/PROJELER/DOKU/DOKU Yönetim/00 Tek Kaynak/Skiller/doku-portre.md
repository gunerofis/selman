---
name: doku-portre
description: DOKU için fotoğraftan portre tasarımı yaparken (kişiyi parçalara bölüp tek renkli parçalarla yeniden kurma), yüz/göz/dudak/burun parçalarını değerlendirirken ve kimliği korurken kullan.
---

# DOKU portre (fotoğraftan tasarım)

Derz, radius, kartela, kod ve istem kuralları **doku-gorsel** skill'inden alınır. Bu skill yalnız insan içeren tasarımları kapsar; yüz kuralları genel işlere karıştırılmaz.

## Ana ilke
Geometri fotoğraftan **izlenir**, görsel modeline **çizdirilmez.**
- Model yüzü yeniden çizer: kimlik kaybı, parça içinde gölge, havada biten çizgi, derzsiz renk değişimi.
- Parça haritası `doku_portre.py` (veya vektör) ile fotoğraftan çıkarılır. Model yüz bölgesine dokunmaz.

## 1. İş akışı
1. Fotoğrafı al. `doku_portre.py` elde yoksa Faris'ten iste.
2. Çalıştır: `python doku_portre.py foto.jpg cikti/` · kurulum: `pip install mediapipe opencv-python scipy`; modeller ilk çalıştırmada iner.
3. Çıktılar: `1_duz.png` tek renkli parçalar · `2_harita.png` sınırlar · `3_render.png` derz/radius · `4_parcalar.svg` vektör · `5_renkler.txt` renkler ve parça sayıları.
4. Bölüm 4 kontrolü.
5. Renkleri doğrulanmış kartelaya eşle (doku-gorsel Bölüm 5). Eşleme geometriyi değiştirmez.
6. Saç, giysi, arka planda düzeltme gerekirse yalnız o bölge. **Yüz parçaları kilitli.**
7. Mekân görselinde harita/render olduğu gibi kullanılır. Model yüzü değiştirdiyse sonuç atılır.
8. Fotoğraf düzeltme isteğinde yalnız istenen bölüm değişir; yüz, mimik, atmosfer aynen kalır.

## 2. Parça kuralları
- Tasarım çizgi değil **bölge haritası:** her piksel tek parçaya ait. Çizgi iki parçanın sınırıdır; kendine, başka çizgiye ya da kenara bağlanır.
- Her parça tek renk ve tek ton. Gölge ve ışık ayrı parça; parça içinde geçiş yok.
- **Her renk değişimi bir derzdir** — göz içindeki küçük parçalar dahil.
- En küçük parça sınırı yok (1×1 mm bile). Detay seviyesi estetik karardır; aşırı derz yüzü bozuyorsa ton sayısı azaltılır, ayrıntı silinmez.
- Saç tutamları kapalı parça; tel tel çizgi yok.

## 3. Yüz kuralları
**Göz (her göz ayrı):**
- Kaş: tek kapalı parça; kıl çizgisi yok.
- Üst kirpik/eyeliner: tek kapalı bant; kalınlık fotoğraftan; iç köşede ince, dışa kalın; kanat bandın parçası.
- Göz akı: iris dışındaki açık alan; genelde iç ve dış iki parça.
- İris: ayrı parça; çap fotoğraftan; büyütülmez, küçültülmez.
- Göz bebeği: iris içinde ayrı, eş merkezli; çap ≈ irisin 0,42'si; irisle karışmayacak kadar koyu.
- Işık yansıması: ayrı beyaz parça; iris–göz bebeği sınırında, fotoğraftaki yönde.
- Alt kirpik / göz altı: fotoğrafta varsa ayrı parça.
- Bu parçaların her sınırı derzdir.

**Burun:** ton parçalarıyla kurulur (köprü ışığı, yan gölge, uç, burun delikleri). Tek başına duran burun çizgisi yasak; yuvarlak çıkıntıya çevrilmez.

**Dudak:** üst ve alt ayrı parça; ağız çizgisi aralarındaki sınır; parlama varsa ayrı parça.

**Cilt:** 4 ton. Göz çukuru, yanak, burun yanı, çene, saç gölgesi ayrı parça; sınırlar yumuşak eğri.

**Kimlik:** oran, göz büyüklüğü, yüz şekli, baş eğimi, asimetri, saçın yüzü örttüğü yerler, makyaj, ifade fotoğraftaki gibi. Güzelleştirme, simetrikleştirme, göz büyütme, burun inceltme, karakterleştirme yok.

## 4. Kontrol
- [ ] Fotoğrafla yan yana: aynı kişi; oran ve eğim korunmuş.
- [ ] Her gözde kaş, kirpik bandı, göz akı, iris, göz bebeği, yansıma ayrı parça; aralarında derz.
- [ ] Burun ve dudak kapalı ton parçaları; havada biten çizgi yok.
- [ ] Parça içinde gölge/geçiş yok; her renk değişimi derz.
- [ ] Renkler kartelaya eşlenmiş; dosya adı kodlu.

## 5. Ayarlar (doku_portre.py başı)
- `TON`: sınıf başına ton (cilt 4, saç 4, giysi 4, arka plan 1).
- `M_ORAN`: şekil yumuşaklığı (büyürse sadeleşir).
- `MIN_ORAN`: en küçük detay (küçülürse incelir).
- `GOZBEBEGI_ORAN`, `YANSIMA_ORAN`: göz oranları.
- `--arkaplan sade`: arka plan tek parça.
