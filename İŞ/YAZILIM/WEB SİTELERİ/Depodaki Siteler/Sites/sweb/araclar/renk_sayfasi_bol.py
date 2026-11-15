"""Renk sayfalarını tek ürün görsellerine böler.

Sekiz renk aynı ürünü gösteriyor; site renk noktaları için ürün başına
ayrı görsel bekliyor. Kutular ızgara üstünden okunup görsel olarak
doğrulandı.

En alttaki (büyük) çekim komşu ürünlerle aynı sütunlarda üst üste
biniyor; dikdörtgen kutu ister istemez komşunun bir şeridini alıyor.
`tepe` ile o şeridi zemine boyamak denendi, düz gri dikdörtgen şeritten
daha kötü göründü — bırakıldı. Şerit bulanık arka plan gibi okunuyor,
ürünün kendisi kesilmiyor.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from kirp_yardimci import daralt

RENKLER = ['siyah', 'krem', 'lacivert', 'gri', 'beyaz', 'taba', 'bordo', 'kahve']

SAYFALAR = {
 '7062': dict(kutu=[(35,40,395,300),(405,45,760,305),(770,45,1125,305),(1140,45,1500,310),
                    (110,325,480,592),(530,332,900,578),(965,338,1340,588),(392,548,1180,950)],
              tepe=None),
 '7063': dict(kutu=[(55,55,370,355),(395,60,710,360),(755,70,1060,375),(1115,85,1430,380),
                    (110,360,475,635),(540,380,860,665),(965,390,1355,700),(415,605,1040,1010)],
              tepe=None),
 '7065': dict(kutu=[(25,50,400,310),(395,50,770,310),(770,50,1130,315),(1140,50,1510,315),
                    (215,305,555,540),(590,315,940,548),(950,315,1310,552),(375,495,1090,970)],
              tepe=None),
 '7066': dict(kutu=[(75,25,415,300),(455,25,760,300),(785,25,1105,300),(1150,25,1465,300),
                    (115,340,480,620),(565,348,975,578),(1040,348,1420,612),(425,490,1090,985)],
              tepe=None),
 '7067': dict(kutu=[(25,95,415,360),(400,100,775,360),(760,95,1120,355),(1120,100,1480,360),
                    (115,350,535,612),(565,345,990,608),(1025,345,1440,602),(375,600,1155,995)],
              tepe=None),
}

def zemin_rengi(a):
    ker = 8
    k = np.concatenate([a[:ker].reshape(-1,3), a[-ker:].reshape(-1,3),
                        a[:, :ker].reshape(-1,3), a[:, -ker:].reshape(-1,3)])
    return np.median(k, axis=0)

def tepe_kapat(im, tepe):
    """`tepe = (y, x0, x1)` — y'nin üstünde [x0,x1] dışı zemine boyanır."""
    y, x0, x1 = tepe
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    z = zemin_rengi(a)
    a[:y, :x0] = z
    a[:y, x1:] = z
    return Image.fromarray(np.clip(a, 0, 255).astype('uint8'))

def uret(hedef):
    os.makedirs(hedef, exist_ok=True)
    sonuc = {}
    for kod, s in SAYFALAR.items():
        im = Image.open(f'{kod}.png').convert('RGB')
        for renk, kutu in zip(RENKLER, s['kutu']):
            parca = im.crop(kutu)
            if renk == 'kahve' and s['tepe']:
                parca = tepe_kapat(parca, s['tepe'])
            parca = daralt(parca)
            parca.save(f'{hedef}/{kod}-{renk}.webp', 'WEBP', quality=92, method=6)
        sonuc[kod] = True
    return sonuc

if __name__ == '__main__':
    uret('cikti')
    for kod in SAYFALAR:
        ims = [Image.open(f'cikti/{kod}-{r}.webp') for r in RENKLER]
        W, H = 380, 300
        t = Image.new('RGB', (W*4, H*2), (255, 0, 255))
        for i, im in enumerate(ims):
            im.thumbnail((W-8, H-8))
            t.paste(im, ((i%4)*W + (W-im.width)//2, (i//4)*H + (H-im.height)//2))
        t.save(f'tabaka-{kod}.png')
    print('bitti')
