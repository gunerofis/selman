"""Sayfadaki büyük (kahve) çekimi ayırır.

Bölge komşuların alt kenarını da alıyor. Bölge içindeki en büyük bağlı
bileşen ürünün kendisi; kırpma o bileşenin sınırlarına göre yapılıyor,
kalan parçalar zemine boyanıyor. Böylece hem ürün kesilmiyor hem
komşudan şerit kalmıyor.
"""
import numpy as np
from PIL import Image
from scipy import ndimage as nd

def kirp(im, kutu, esik=22, marj=0.035):
    p = im.crop(kutu)
    a = np.asarray(p).astype(np.int16)
    h, w, _ = a.shape
    ker = 8
    k = np.concatenate([a[:ker].reshape(-1,3), a[-ker:].reshape(-1,3),
                        a[:, :ker].reshape(-1,3), a[:, -ker:].reshape(-1,3)])
    z = np.median(k, axis=0)
    m = np.abs(a - z).sum(axis=2) > esik
    m = nd.binary_closing(m, structure=np.ones((5, 5)))
    m = nd.binary_fill_holes(m)
    et, n = nd.label(m)
    if n == 0:
        return p
    boy = nd.sum(m, et, range(1, n + 1))
    ana = int(np.argmax(boy)) + 1
    yabanci = m & (et != ana)
    b = a.copy()
    b[nd.binary_dilation(yabanci, structure=np.ones((3, 3)))] = z
    ys, xs = np.where(et == ana)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    py = int((y1 - y0) * marj) + 8
    px = int((x1 - x0) * marj) + 8
    kesit = (max(0, x0 - px), max(0, y0 - py), min(w, x1 + px), min(h, y1 + py))
    return Image.fromarray(np.clip(b, 0, 255).astype('uint8')).crop(kesit)
