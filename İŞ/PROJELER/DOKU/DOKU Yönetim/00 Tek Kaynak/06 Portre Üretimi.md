# Portre üretimi (fotoğraftan tasarım)

DOKU'nun en öncelikli fotoğraf işi: kişiyi, kimliğini kaybetmeden tasarıma çevirmek. Yüz kuralları: [05](<05 Yüz Kuralları.md>).

Portre de 4 adımlı tasarım akışına uyar ([08](<08 Görsel Üretim Akışı.md>)). 1. adımda 2D kapalı alan çizimi için portre fotoğrafı referans alınır.

## Ana ilke
Geometri fotoğraftan **izlenir**, görsel modeline **çizdirilmez.**
Model yüzü yeniden çizer: kimlik kaybı, parça içinde gölge, havada biten çizgi, derzsiz renk değişimi çıkar. Bu yüzden yüz bölgesine model dokunmaz.

## Yöntem
1. Kişiyi fotoğraftan ayır.
2. Renk-ton dağılımına göre parçalara böl.
3. Her parçayı tek renge boya.
4. Her bölücü çizgi kendisinde, başka çizgide ya da kenarda başlayıp biter.
5. Renkleri karteladaki en yakın renklere eşle. Eşleme geometriyi değiştirmez.

## Araç: doku_portre.py
- Çalıştır: `python doku_portre.py foto.jpg cikti/` · kurulum: `pip install mediapipe opencv-python scipy`.
- Çıktılar: `1_duz.png` tek renkli parçalar · `2_harita.png` sınırlar · `3_render.png` derz/radius görünümü · `4_parcalar.svg` vektör · `5_renkler.txt` renkler ve parça sayıları.
- Ayarlar: `TON` (cilt 4, saç 4, giysi 4, arka plan 1) · `M_ORAN` şekil yumuşaklığı · `MIN_ORAN` en küçük detay · `GOZBEBEGI_ORAN`, `YANSIMA_ORAN` · `--arkaplan sade`.
- Dosya elde yoksa Faris'ten istenir.

## Akış
1. Haritayı çıkar (araç veya vektör).
2. [05 kontrolünü](<05 Yüz Kuralları.md>) yap.
3. Renkleri kartelaya eşle.
4. Saç, giysi, arka planda düzeltme gerekirse yalnız o bölge düzenlenir. **Yüz parçaları kilitli.**
5. Mekân görselinde harita/render olduğu gibi kullanılır. Model yüzü değiştirdiyse sonuç atılır.

## Fotoğraf düzeltme isteklerinde
- Yalnız istenen bölüm (ör. hatalı duvar/yüzey) değişir. Yüz, mimik, atmosfer aynen kalır.
- İstenen sınırın dışına çıkıp görseli yeniden üretmek hatadır.

## Örnek konu seti (konuşulmuş)
Damat–gelin, anne–bebek, iki sevgili, anne–baba–iki çocuk ve üç konu daha: duygu taşıyan, gerçek fotoğraflar. Yapay/duygusuz stok fotoğraf yok.
