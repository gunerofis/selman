---
name: site-renk
description: >
  My Store 7 ve Güner Ofis vitrininde site rengini beş role indirir.
  Yakın krem ve bej yığınını tek zemine çevirir; kart, menü ve form beyaz kalır.
  Tetik: site rengi, arkaplan rengi, yakın ton, palet, özgün renk, /site-renk.
---

# Site rengi

Beş rol. Altıncı ton ekleme. Krem, bej ve kırık beyaz rampası üretme.

| Rol | Renk | Yer |
|---|---|---|
| Zemin | `#c4b49a` | Sayfa, kahraman, alt bilgi |
| Yüzey | `#ffffff` | Kart, menü, form, çekmece, filtre |
| Mürekkep | `#3b281f` | Yazı, dolu düğme |
| Soluk | `#4a382e` | İkincil yazı |
| Çizgi | `#d9d0c4` | Kenar |

`color_palette.background` yüzeydir. Sayfa rengini ona bağlama. Horizon hazır ayarına dokunma.

Renk dosyaları: `assets/guner-design.css`, `config/settings_data.json` içindeki `current`, bölüm `background_color`, `sections/header-group.json`.

Mağaza `drsjpm-ey`. Canlı tema `159736594503`, ad `Güner Shopify Taşıma - Çalışma`. Yerel tema: `Desktop\Güner Ofis\02 Web\İşler ve Belgeler\Güner Shopify Taşıma - KRİTİK\tema`.

Canlı yetki varsa değişen dosyayı bir kez gönder: tema klasöründen `shopify.cmd theme push --store drsjpm-ey.myshopify.com --theme 159736594503 --allow-live --nodelete --force --only <dosya>`.

Kontrol, ekran görüntüsü ve tekrar test yok. Değiştir, gönder, dur.
