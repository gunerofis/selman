"""Sekiz renkli katalog sayfalarını tek ürün görsellerine böler.

Sayfalar aynı çekim düzeninde: üstte dört, ortada üç, altta bir büyük.
Her ürün için kaba bir bölge veriliyor; bölge içindeki en büyük bağlı
bileşen ürünün kendisi sayılıp kırpma onun sınırlarına göre yapılıyor,
bölgeye giren komşu parçalar zemine boyanıyor. Bölge geniş verilebilir,
ürün kesilmez.

Üç sayfada düzen farklı (büyük çekim satır içinde ya da solda); onlar
`OZEL` içinde ayrı tanımlı.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from buyuk import kirp
sys.path.insert(0, '/home/claude/sweb/araclar')
from kirp_yardimci import daralt

RENKLER = ['siyah', 'krem', 'lacivert', 'gri', 'beyaz', 'taba', 'bordo', 'kahve']

STANDART = [
    (   5,  15,  425,  330), (420,  15,  768,  330),
    ( 762,  15, 1132,  330), (1128, 15, 1531,  330),
    (  90, 322,  525,  612), (528, 322,  988,  612),
    ( 985, 322, 1505,  612), (265, 515, 1245, 1020),
]

OZEL = {
    # Büyük çekim ikinci satırın ortasında
    '7085': [(  60,  20,  430,  330), (420,  20,  770,  330),
             ( 770,  20, 1120,  330), (1120, 20, 1531,  330),
             (  55, 385,  470,  760), (900, 340, 1215,  725),
             (1225, 340, 1531,  720), (438, 318, 1195,  995)],
    '7087': [( 130,  20,  500,  410), (500,  20,  760,  410),
             ( 770,  20, 1110,  410), (1110, 20, 1440,  410),
             (  90, 420,  400,  740), (850, 400, 1180,  800),
             (1170, 400, 1510,  800), (330, 360,  960, 1010)],
    # Çöp kutusu sayfasında büyük çekim ikinci satırın içinde
    '7100': [(  40,  35,  370,  415), (405,  40,  735,  415),
             ( 795,  55, 1120,  425), (1155, 60, 1470,  425),
             (  45, 500,  352,  858), (360, 392,  625,  845),
             (1108, 412, 1428,  795), (600, 425, 1092, 1035)],
    # Duvara asılan cepler: aralar geniş, satır bantları farklı
    '7096': [( 235,  15,  465,  315), (485,  15,  720,  315),
             ( 765,  15,  995,  315), (1045, 15, 1285,  315),
             ( 380, 310,  600,  605), (650, 310,  875,  605),
             ( 930, 310, 1160,  605), (510, 598, 1050,  998)],
    # Büyük çekim solda
    '7093': [( 495,  95,  725,  478), (760,  95, 1005,  478),
             (1005,  95, 1220,  478), (1240, 95, 1510,  480),
             ( 665, 478,  910,  865), (930, 478, 1205,  868),
             (1205, 478, 1490,  865), ( 30, 120,  640,  935)],
}

# Bu kutularda bileşen ayıklama komşuyu ürüne bağlıyor; doğrudan
# kırpılıp yalnız kenar daraltması uygulanıyor.
SABIT = {
    ('7085', 'kahve'): (438, 318, 1195, 995),
    # Beyaz kutu açık zeminde; kenar farkı zayıf, bileşen ayıklaması
    # ürünün bir parçasını seçiyor. Kutu elle ölçüldü.
    ('7100', 'beyaz'): (48, 500, 350, 862),
}

# Bu sayfalarda ikinci satır ürünleri alçak; bölge kısaltılmazsa alttaki
# büyük çekimin üstü bölgeye giriyor.
KISA_SATIR = {'7086': 545, '7091': 548, '7099': 560}

def bolgeler(kod):
    b = list(OZEL.get(kod, STANDART))
    alt = KISA_SATIR.get(kod)
    if alt:
        b = [(x0, y0, x1, min(y1, alt)) if 4 <= i <= 6 else (x0, y0, x1, y1)
             for i, (x0, y0, x1, y1) in enumerate(b)]
    return b

def sayfa(kod, hedef):
    im = Image.open(f'{kod}.png').convert('RGB')
    for renk, kutu in zip(RENKLER, bolgeler(kod)):
        sabit = SABIT.get((kod, renk))
        # Sabit kutuda daraltma yok: bileşen ayıklaması komşuyu ürüne
        # bağladığı için kutu elle ölçüldü, olduğu gibi kullanılıyor.
        parca = im.crop(sabit) if sabit else kirp(im, kutu)
        parca.save(f'{hedef}/{kod}-{renk}.webp', 'WEBP', quality=92, method=6)

if __name__ == '__main__':
    import glob
    hedef = sys.argv[1]
    os.makedirs(hedef, exist_ok=True)
    kodlar = sys.argv[2:] or [f[:-4] for f in sorted(glob.glob('7*.png'))]
    for k in kodlar:
        sayfa(k, hedef)
        print(k)
