# Olay kaydı kuralı

Anlamlı bir iş paketi bitince, sorulmadan masaüstündeki `OLAY` klasörüne o günün kaydını yaz.

Klasör: `C:\Users\DELL\Desktop\OLAY`

## Dosya adı

`GG.AA.YYYY KISA-AD.md`

Kısa ad siteden ve iş türünden anlaşılır olsun.

Örnek: `02.09.2026 COMTR FRONT.md`  
(sumentakimi.com.tr vitrin / görünüm işi)

Aynı gün aynı siteye ek iş gelirse yeni dosya açma; mevcut kaydın altına ekle.

## Nasıl yaz

Hiç bilmeyen biri okusun, ne yapıldığını anlasın.

- Türkçe.
- Kısa başlık = ana iş.
- Altına bir cümle: ne değişti, sitede ne görünür oldu.
- Yanına veya hemen altına parantez içinde alt işler. Uzun anlatma.
- Kod, dosya yolu, GraphQL, secret, commit hash yazma.
- Fiyat, stok, sipariş uydurma.
- Yapılamayanı ayrı ve tek cümleyle yaz.

## Kalıp

```md
# GG.AA.YYYY KISA-AD

Site veya iş: ...

## Ana iş
Kısa cümle.
(alt iş 1; alt iş 2; alt iş 3)

## Ana iş
Kısa cümle.
(alt iş)
```

## Açık işler

Bitmeyen her iş tek dosyaya yazılır: `AÇIK İŞLER (ORTAK).md`

- Günlük olay kaydı = o gün **biten** iş.
- `AÇIK İŞLER (ORTAK).md` = hâlâ duran iş. Site site, tüm işler ortak.
- İş bitince o satırı açık işler dosyasından sil.
- Yeni açık iş çıkınca günlük kayda “yapılamayan” yaz; aynı işi açık işler dosyasına da ekle.
- Aynı üslup: kısa başlık, bir cümle, parantezde alt iş.
- Kod, secret, fiyat uydurma yok.

Kural dosyası bu klasörde durur: `OLAY KAYDI KURALI.md`
