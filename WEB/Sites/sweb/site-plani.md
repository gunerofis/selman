# Site Planı — kapanış

Kapsam: tasarım, arayüz, kod. Ürün/malzeme kararları Faris'te.
Yapım Cowork'te yürüyecek.

## Palet
```
--krem     #F7F1E8   sayfa
--kagit    #FDFAF6   kart, panel
--sut      #E9DCCB   blok, görsel arkası
--kahve    #4A3B2E   metin
--ikincil  #8A7866   yardımcı metin, mono
--dikis    #E3D8CA   hairline + kesikli çizgi
--taba     #A9743F   aksan
--bordo    #6B2D36   yalnız uyarı / indirim
pastel zemin: #EFE6DA #E4E5E2 #DDE1E6 #EDE2DB #E8DCDC #E3E0DC
```
Aksan sayfada en fazla üç yerde: link, aktif durum, seçili renk noktası. Buton dolgusu kahve.

## Tipografi
Archivo (display, geniş) · Instrument Sans (gövde) · JetBrains Mono (kod, ölçü, fiyat).
Ürün kodu ve fiyat her yerde mono. Ölçek 12/14/16/20/26/34/46.

## Yüzey
Köşe yuvarlaması 0 · gölge yok · ayırıcılar kesikli · görsel oranı 1:1.

## Görsel
Mevcut 3:2 aile render'ları kullanılıyor. Enine dokunulmaz, alt ve üst genişletilerek 1:1'e tamamlanır. Alt bantta ürün adı + kod, üstte ince boşluk.
Dosya adı: `7002-1x1.png`.

## Duvar
Merkezde en çok satan, çevrede diğerleri.
Çevre karesine tıkla → merkezle yer değiştirir, bilgileri açılır; merkezdeki onun yerine gider, bilgileri kapanır.

| Ekran | Izgara | Merkez | Ürün |
|---|---|---|---|
| ≥1440 | 6×6 | 4×4 | 21 |
| 768–1439 | 5×5 | 3×3 | 17 |
| <768 | 4×4 | 2×2 | 13 |

Tek sıralı liste, her kırılım ilk 21/17/13 öğeyi alır.
Başlangıçta sıralama rastgele; admin panelinden sürükle-sırala ile sabitlenir.
Çevre kareleri `<button>`, merkezdeki başlık `<a href>`. Yer değiştirme geçmişe yazılmaz. Klavye: Enter ile değiştirir, `aria-live` duyurur.
Üstte 8 renk noktası: duvarın tamamı o renge geçer, seçim URL'e yazılır.

## Hareket
Duvar yükleniş 40ms arayla · yer değiştirme 320ms FLIP · başka animasyon yok · `prefers-reduced-motion` desteklenir.

## Sayfalar
Anasayfa · kategori · ürün · koleksiyon · kurumsal teklif · atölye · iletişim · sepet · ödeme · hukuki (5) · 404.
Kategori ağacı sonra kurulacak.

## Dil
Ürün adı işlevle başlar, sıfat yok. Buton fiille başlar ve akış boyunca aynı kelimeyi taşır. Ölçü mm, ağırlık g, süre iş günü. Renk adları sabit liste.
Yasak: eşsiz, muhteşem, premium, lüks, özel tasarım.

## Teknik
Next.js (App Router) + Tailwind + Vercel. Ürün ve duvar sıralaması CMS/admin panelinden yönetilir.

## Fazlar
0 token + styleguide ✔ · 1 iskelet · 2 duvar · 3 kategori + ürün şablonu · 4 sepet/ödeme/teklif · 5 hukuki + form · 6 SEO/performans/erişilebilirlik · 7 QA + yayın.
