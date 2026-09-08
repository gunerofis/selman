"""Renk sayfalarından tek tek ürün görselini çıkarır.

Sayfada sekiz renk aynı ürünü gösteriyor; site sekiz renk noktası için
ürün başına ayrı görsel bekliyor.

Kaba kutu elle veriliyor ve YALNIZ o ürünü içermeli; kutu içindeki
zemin farkına göre kenarlar daraltılıyor. Kutu biraz genişse çıktı ürüne
oturuyor, komşu ürün kutuya girerse çıktı yanlış olur — bu yüzden her
sayfa için kutular ızgara üstünde okunup görsel olarak doğrulanıyor.
"""
from PIL import Image
import numpy as np
from scipy import ndimage as nd

MARJ = 0.04  # ürünün etrafında bırakılan nefes payı

def _maske(a, esik):
    h, w, _ = a.shape
    ker = 8
    kenar = np.concatenate([
        a[:ker].reshape(-1, 3), a[-ker:].reshape(-1, 3),
        a[:, :ker].reshape(-1, 3), a[:, -ker:].reshape(-1, 3),
    ])
    zemin = np.median(kenar, axis=0)
    return np.abs(a - zemin).sum(axis=2) > esik

def daralt(im, esik=20):
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    h, w, _ = a.shape
    m = nd.binary_closing(_maske(a, esik), structure=np.ones((5, 5)))
    # Satır/sütunun en az %1'i doluysa ürüne ait sayılır: gölge ve
    # sıkıştırma gürültüsü kenarı yanlış yere itmesin.
    satir = m.sum(axis=1) > max(4, w * 0.01)
    sutun = m.sum(axis=0) > max(4, h * 0.01)
    if not satir.any() or not sutun.any():
        return im
    y0, y1 = int(np.argmax(satir)), int(len(satir) - np.argmax(satir[::-1]))
    x0, x1 = int(np.argmax(sutun)), int(len(sutun) - np.argmax(sutun[::-1]))

    py = int((y1 - y0) * MARJ) + 8
    px = int((x1 - x0) * MARJ) + 8
    return im.crop((max(0, x0 - px), max(0, y0 - py), min(w, x1 + px), min(h, y1 + py)))

def kirp(kaynak, kutular, adlar, hedef_kalip, esik=20):
    im = Image.open(kaynak).convert('RGB')
    cikti = []
    for k, ad in zip(kutular, adlar):
        parca = daralt(im.crop(k), esik)
        yol = hedef_kalip.format(ad)
        parca.save(yol, 'WEBP', quality=92, method=6)
        cikti.append((ad, parca.size))
    return cikti


def temizle(im, esik=20):
    """Kırpma kutusuna giren komşu ürünü zeminle doldurur.

    Sayfadaki en alttaki (en büyük) ürün komşularıyla üst üste bindiği için
    dikdörtgen kutu onları da alıyor. Maskede en büyük bağlı bileşen ürünün
    kendisi; kalan parçalar zemin rengiyle kapatılıyor. Ürünün propları
    (şişe, fırça, anahtar) gövdeye değdiği için aynı bileşende kalıyor.
    """
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    h, w, _ = a.shape
    ker = 8
    kenar = np.concatenate([
        a[:ker].reshape(-1, 3), a[-ker:].reshape(-1, 3),
        a[:, :ker].reshape(-1, 3), a[:, -ker:].reshape(-1, 3),
    ])
    zemin = np.median(kenar, axis=0)
    m = np.abs(a - zemin).sum(axis=2) > esik
    m = nd.binary_closing(m, structure=np.ones((5, 5)))
    m = nd.binary_fill_holes(m)
    et, n = nd.label(m)
    if n <= 1:
        return im
    boy = nd.sum(m, et, range(1, n + 1))
    ana = int(np.argmax(boy)) + 1
    yabanci = m & (et != ana)
    if yabanci.sum() < 200:
        return im
    # Yumuşak kenar: sert kesim gözü rahatsız ediyor.
    yumusak = nd.binary_dilation(yabanci, structure=np.ones((3, 3)))
    b = a.copy()
    b[yumusak] = zemin
    b = np.clip(b, 0, 255).astype('uint8')
    return Image.fromarray(b)
