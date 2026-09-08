"""Ofis koleksiyonu görsellerini siteye hazırlar.

Tekil çekimler zaten tek ürün ve temiz zeminde; yalnız webp'e çevriliyor,
kırpılmıyor. Masa pedinin tekil çekimi yok — numaralı set görselinden
kesiliyor; kutu ızgara üstünden okundu, komşu ürün girmiyor.

Kategori kapağı için masa sahnesi kullanılıyor; geniş oran korunuyor.
"""
import os
from PIL import Image

HEDEF = '/home/claude/sweb/public/urunler'
KAPAK = '/home/claude/sweb/public/kategori'

TEKIL = {
    '7102': 'telefon.png',
    '7103': 'bilek.png',
    '7104': 'kalem-tepsi.png',
    '7105': 'altlik.png',
    '7106': 'kablo.png',
    '7107': 'saat.png',
    '7108': 'kare-tepsi.png',
    '7109': 'kartvizit.png',
    '7110': 'uc-bolmeli.png',
    '7111': 'kulaklik.png',
}

def kaydet(im, yol, en_cok=1400):
    if im.width > en_cok:
        oran = en_cok / im.width
        im = im.resize((en_cok, round(im.height * oran)), Image.LANCZOS)
    im.convert('RGB').save(yol, 'WEBP', quality=90, method=6)
    return im.size

os.makedirs(HEDEF, exist_ok=True)
os.makedirs(KAPAK, exist_ok=True)

for kod, dosya in TEKIL.items():
    print(kod, kaydet(Image.open(dosya), f'{HEDEF}/{kod}.webp'))

# Masa pedi — numaralı set görselinden
ped = Image.open('anahtar.png').crop((170, 75, 1025, 470))
print('7101', kaydet(ped, f'{HEDEF}/7101.webp'))

# Kategori kapağı: masa sahnesi
print('kapak', kaydet(Image.open('masa-sahne.jpg'), f'{KAPAK}/ofis.webp', 1800))
