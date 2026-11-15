#!/usr/bin/env python3
"""
Katalog render'larını siteye hazırlar.

Görselin oranına, çerçevesine, hiçbir pikseline dokunulmaz. Tek yaptığı
sol alttaki gömülü katalog kodunu silmek — uygulama kodu kendi bandında
zaten yazıyor, ikisi birden görünmesin.

Boş alan görselin içine gömülmüyor: duvar karesi, kart ve ürün sayfası
görsel alanını 3:2 ayırıp altındaki boşluğa ad + kod yazıyor. Böylece
render kırpılmıyor, yazı da görselin üstüne binmiyor.

Yaptığı:
  1. Katalog render'ının sol altına gömülü ürün kodunu, hemen
     üstündeki temiz zeminin düşey aynasıyla siler (uygulama kodu
     kendi bandında zaten yazıyor; ikisi birden görünmesin).
  2. Genişliği hiç değiştirmeden yukarı ve aşağı zemin ekleyerek kareye
     tamamlar. Eklenen alan, kenar satırının kopyasıdır — stüdyo fonu
     düşey geçişli olduğu için ek yerinde çizgi oluşmaz.
     Boşluğun %20'si üste, %80'i alta gider: üstte ince boşluk,
     altta uygulamanın ad + kod bandının oturacağı alan.
  3. <kod>-1x1.png olarak yazar.

Kullanım:
  python3 araclar/render_1x1.py <kaynak-klasor> <hedef-klasor>

Kaynak dosya adı serbest; kod görselin içinden okunmaz, `KODLAR`
eşlemesinden veya dosya adındaki 4 haneli sayıdan alınır.
"""

import re
import sys
import pathlib
from PIL import Image, ImageChops, ImageDraw, ImageFilter

KOD_YUKSEK = 0.062      # kodun bulunduğu şerit: yüksekliğin bu oranı, alttan
KOD_ADAYLAR = (0.30, 0.26, 0.22, 0.18, 0.15, 0.12)   # yama genişliği adayları
YUMUSAMA = 0.30         # yamanın sağ kenarında geçiş yapılan kısım
DUZLUK = 11             # zemin sayılmak için satır medyanından izinli sapma


def _kod_sagi(im: Image.Image, bh: int) -> int:
    """Gömülü kodun sağ ucu. Yüksek geçiren filtre yumuşak vinyeti siler,
    geriye yalnız yazının keskin kenarları kalır. Soldan başlayan ilk
    bitişik koyu öbek kod kabul edilir; daha sağdaki ürün kenarları
    araya 40px'ten geniş boşluk girdiği için katılmaz."""
    w, h = im.size
    g = im.convert('L').crop((0, h - bh, round(w * 0.35), h))
    hp = ImageChops.subtract(
        g.filter(ImageFilter.GaussianBlur(9)), g, scale=1, offset=0)
    px = hp.load()
    koyu = [x for x in range(g.width)
            if max(px[x, y] for y in range(g.height)) > 14]
    if not koyu:
        return 0
    sag = koyu[0]
    for x in koyu:
        if x - sag > 40:
            break
        sag = x
    return sag


def _duz_mu(im: Image.Image, bw: int, bh: int) -> bool:
    """Kutu düz zemin mi, ürün/gölge giriyor mu? Ayna yaması yalnız düz
    zeminde güvenli; ürüne değerse onu çoğaltıp sahte yansıma yapar."""
    w, h = im.size
    kutu = im.convert('L').crop((0, h - 2 * bh, bw, h - bh))   # ayna kaynağı
    px = list(kutu.get_flattened_data()) if hasattr(kutu, 'get_flattened_data') \
        else list(kutu.getdata())
    for y in range(kutu.height):
        satir = sorted(px[y * bw:(y + 1) * bw])
        medyan = satir[bw // 2]
        if satir[-1] - medyan > DUZLUK or medyan - satir[0] > DUZLUK:
            return False
    return True


def kodu_kapat(im: Image.Image) -> Image.Image:
    """Sol alttaki gömülü katalog kodunu siler.

    Bu seride kod her zaman sol alt marjda, düz zemin üzerinde durur;
    ürün ve gölgesi hep daha sağdadır. O dikdörtgen, hemen üstündeki
    aynı boydaki bloğun düşey aynasıyla değiştirilir: ayna sayesinde
    üst ek yerindeki satır komşusuyla birebir aynı olur, zeminin düşey
    geçişi kırılmaz.

    Genişlik sabit değil. Ürünün sol alta ne kadar yaklaştığı görselden
    görsele değişiyor; sabit geniş yama bazı render'larda ürünün
    tabanını aynalayıp sahte yansıma yapıyordu. Bu yüzden en geniş
    adaydan başlanıp, kutunun tamamı düz zemin olan ilk genişlik
    seçilir. Yamanın sağ kenarı zeminin yatay geçişi yüzünden basamak
    yapacağı için son %30'unda doğrusal maskeyle özgüne karışır.
    """
    w, h = im.size
    bh = max(40, round(h * KOD_YUKSEK))

    # yama en az kodu ve sağındaki geçiş payını örtmeli
    enAz = round((_kod_sagi(im, bh) + 40) / (1 - YUMUSAMA))
    bw = None
    for oran in KOD_ADAYLAR:
        aday = round(w * oran)
        if aday >= enAz and _duz_mu(im, aday, bh):
            bw = aday
            break
    if bw is None:
        bw = max(enAz, round(w * KOD_ADAYLAR[-1]))

    yama = im.crop((0, h - 2 * bh, bw, h - bh)).transpose(Image.FLIP_TOP_BOTTOM)

    maske = Image.new('L', (bw, bh), 255)
    cizim = ImageDraw.Draw(maske)
    gecis = round(bw * YUMUSAMA)
    for i in range(gecis):
        x = bw - gecis + i
        cizim.line([(x, 0), (x, bh)], fill=round(255 * (1 - i / gecis)))

    im = im.copy()
    im.paste(yama, (0, h - bh), maske)
    return im, bw


def kod_bul(yol: pathlib.Path, esleme: dict[str, str]) -> str | None:
    if yol.name in esleme:
        return esleme[yol.name]
    m = re.search(r'\b(7\d{3}[a-c]?)\b', yol.stem)
    return m.group(1) if m else None


def calistir(kaynak: pathlib.Path, hedef: pathlib.Path, esleme: dict[str, str]):
    hedef.mkdir(parents=True, exist_ok=True)
    sonuc = []
    for p in sorted(kaynak.glob('*.png')) + sorted(kaynak.glob('*.jpg')):
        kod = kod_bul(p, esleme)
        if not kod:
            print(f'  atlandı (kod yok): {p.name}')
            continue
        im = Image.open(p).convert('RGB')
        w0, h0 = im.size
        im, bw = kodu_kapat(im)
        cikti = hedef / f'{kod}.webp'
        im.save(cikti, 'WEBP', quality=92, method=6)
        sonuc.append((kod, f'{w0}x{h0}', f'{w0/h0:.3f}', f'{bw}px',
                      f'{cikti.stat().st_size / 1024:.0f} KB'))
    return sonuc


if __name__ == '__main__':
    kaynak = pathlib.Path(sys.argv[1])
    hedef = pathlib.Path(sys.argv[2])
    esleme = {}
    eslemeDosya = kaynak / 'kodlar.txt'
    if eslemeDosya.exists():
        for satir in eslemeDosya.read_text(encoding='utf-8').splitlines():
            if '=' in satir:
                a, b = satir.split('=', 1)
                esleme[a.strip()] = b.strip()

    satirlar = calistir(kaynak, hedef, esleme)
    print(f'{"kod":6} {"boyut":12} {"oran":7} {"yama":7} dosya')
    for s in satirlar:
        print(f'{s[0]:6} {s[1]:12} {s[2]:7} {s[3]:7} {s[4]}')
    print(f'\n{len(satirlar)} görsel')
