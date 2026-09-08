"""Ofis koleksiyonunun kalan görselleri.

İki kaynak:
- Numaralı set görselindeki 10 numaralı kare tepsi (tekil çekimi yok).
- İkinci set görselindeki on ürün — hepsi tam deri kaplama, siyah gövde yok.
  Tekil çekimleri gelmedi; kutular ızgara üstünden okundu.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from kirp_yardimci import daralt

HEDEF = '/home/claude/sweb/public/urunler'

# ikinci set: kod -> kaba kutu
IKINCI = {
    '7113': (20, 150, 452, 432),    # evrak tepsisi
    '7114': (408, 205, 722, 432),   # kare tepsi
    '7115': (748, 75, 968, 432),    # dosya standı
    '7116': (985, 200, 1320, 415),  # kağıtlık
    '7117': (1320, 180, 1668, 465), # tablet standı
    '7118': (30, 585, 370, 800),    # üç bölmeli tepsi
    '7119': (368, 538, 722, 812),   # tablet standı (büyük)
    '7120': (740, 550, 915, 805),   # kalemlik
    '7121': (972, 578, 1300, 812),  # mendillik
    '7122': (1330, 650, 1668, 815), # dikdörtgen tepsi
}

set2 = Image.open('ikinci-set.png').convert('RGB')
for kod, kutu in IKINCI.items():
    parca = daralt(set2.crop(kutu))
    parca.save(f'{HEDEF}/{kod}.webp', 'WEBP', quality=92, method=6)
    print(kod, parca.size)

# numaralı setteki ikinci (derin) kare tepsi
anahtar = Image.open('anahtar.png').convert('RGB')
derin = daralt(anahtar.crop((800, 625, 1045, 815)))
derin.save(f'{HEDEF}/7112.webp', 'WEBP', quality=92, method=6)
print('7112', derin.size)
