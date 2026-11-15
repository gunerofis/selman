# Asset listesi — tek liste

Son güncelleme: 13.11.2026. Oyunun ihtiyaç duyduğu her görsel burada. Gelenler listeden çıkarılır.

## Nasıl eklenir

1. Dosyayı aşağıdaki adla `Gelen` klasörüne bırak (PNG).
2. Bana "assetler geldi" de.
3. Dönüştürme: tek görseller `python Asset/asset_al.py`, animasyon katalogları `python Asset/atlas_al.py`. Orijinaller `Islenen` klasörüne taşınır.

## Reddedilen ikon turu — 13.11.2026

`Oyun/gorsel/arayuz/k_icon_*.svg` ve `k_scene_clean.png` kullanılmıyor; görsel dili bozan tur geri alındı. Dosyalar korunuyor, onaylı asset sayılmaz. Yeni üretim, ekranın kabul edilmiş boyalı görünümünü korumalı.

## Ortak kurallar

- Stil: boyalı fantastik RPG; koyu taş, eskitilmiş altın, kırmızı mine, fildişi. Yazısız, logosuz, arayüzsüz.
- Karakter: şeffaf PNG, tek figür, tam gövde, sola üç çeyrek dönük, gölgesiz.
- Arka plan: 1600×900 yatay, alt üçte biri boş zemin, ortada büyük nesne yok.
- İkon: şeffaf PNG, kare, tek nesne, ortalı.
- Dosya adı küçük harf, Türkçe karaktersiz, aşağıdaki gibi.

---

# KALAN İHTİYAÇ

## 1. Önceki animasyon kuyruğu — 19 ad

Katalogla aynı biçim: 1536×1536 şeffaf PNG (6×6 kare, kare 256×256) + aynı addaki JSON. Klipler: idle, run, attack, hit, guard, victory, defeat, heavy_windup, heavy_contact, heavy_recovery.

Bu 19 ad güncel 213 atlaslık katalogda yok. Üretimden önce güncel karşılaşma ve kilitli sandık adlarıyla eşleştirilmeli; eski adlardan yeni tasarım varsayılmaz.

Önceki listede atlası gelmeyen 14 düşman:

| Dosya | Yaratık |
|---|---|
| orman_bekci | Yaban domuzu |
| maden_iz | Cevher kurdu |
| mantar_bekci | Küf kurdu |
| kale_bekci | Sancaktar |
| buzul_iz | Kar kurdu |
| buzul_bekci | Buz bekçisi |
| tapinak_iz | Taş kobra |
| tapinak_bekci | Yeminli muhafız |
| kristal_iz | Cam kertenkele |
| yuva_iz | İşçi böcek |
| yuva_bekci | Nöbetçi arı |
| kule_iz | Taş kanat |
| volkan_iz | Lav tazısı |
| rasat_iz | Gece kuşu |

Diğer 5 atlas:

| Dosya | İçerik |
|---|---|
| hero_hub | Kahramanın ana ekrandaki bekleme döngüsü (4 kare) |
| wear_dagger | Hançerin ele takılan katmanı; kahraman atlasıyla aynı kare düzeni |
| wear_kilic | Köy Kılıcının ele takılan katmanı |
| chest_5 | Ejder Sandığı açılışı (closed, open, opened) |
| chest_free | Ücretsiz sandık açılışı |

## 2. Sıradaki sistemler için ikonlar

Şeffaf PNG 256×256.

| Dosya | İçerik |
|---|---|
| icon_title_gecit | Unvan — Geçit Bekçisi arması |
| icon_title_duello | Unvan — Düellocu arması |
| icon_title_fatih | Unvan — Eşik Fatihi arması |
| icon_petskill_can | Pet yeteneği — iyileştirme |
| icon_petskill_saldiri | Pet yeteneği — keskinlik |
| icon_petskill_koruma | Pet yeteneği — koruma |

## 3. İsteğe bağlı

| Dosya | İçerik |
|---|---|
| bg_hunt_<bölge> | Av için bölgeye ikinci arka plan (şu an Sefer ile aynısını kullanıyor) |
| foe_<bölge>_iz_2 vb. | İkinci pozlar; atlas gelmeyen yaratıklar için geçici çeşitlilik |

---

# GELEN VE BAĞLANAN

| Grup | Adet | Durum |
|---|---|---|
| Pet büyük önizlemeleri | 8 | Bağlandı; 7 üretim + Tilki aslı |
| Bölge savaş arka planı (bg_koy … bg_hiclik) | 17 | Bağlandı |
| Düşman çizimi (foe_*) | 174 | Bağlandı |
| Animasyon atlası | 213 | Bağlandı |
| Arayüz ikonu (katalogdan) | 212 | Bağlandı |
| Ekipman ikonu + 5 kademe görünümü (9 yuva) | 54 | Bağlandı (6 yuva etkin, 3'ü hazır bekliyor) |
| Kaynak ikonları, taşlar, sandıklar, mini oyun ikonları | 27 | Bağlandı |
| Düğme ve çerçeveler (btn_primary, btn_secondary, frame_slot, frame_panel) | 4 | Bağlandı |
| Ana sahne (hub_scene_full), pet_tilki, wing_turna, wing_kuzgun, aura_halka | 5 | Bağlandı |

## Adlandırma kuralı (yeni üretim için)

| Kalıp | Nereye |
|---|---|
| `bg_<bölge>` | Savaş arka planı |
| `foe_<düşman id>` | Düşman çizimi |
| `icon_gear_<yuva>` ve `icon_gear_<yuva>_<1-5>` | Ekipman, kademe görünümü |
| `icon_res_<kaynak>` | Kaynak |
| `icon_pet_<id>`, `icon_wing_<id>` | Pet, kanat |
| `icon_chest_<t1-t5,uber>` | Market sandığı |
| `icon_game_<oyun>` | Kumarhane masası |

Bölge kodları: koy, orman, maden, bataklik, ada, mantar, mezar, col, kale, buzul, tapinak, kristal, yuva, kule, volkan, rasat, hiclik.

## Klasörler

- `Gelen` — işlenmeyi bekleyen yeni görseller.
- `Islenen` — işlenmiş orijinaller (yedek; oyun bunları kullanmaz).
- `Kaynak` — ilk üretim panoları, sahne atlasları, ilk dört karakter.

## Kullanıcı özeti

Ekran kontrolünde belirlenen 8 büyük pet önizlemesi tamamlandı. 2 Tılsım ve 12 Kalıntı görseli zaten vardı; ekrana bağlandı. Önceki kuyrukta 19 atlas adı ve 6 ikon kaldı; üretim öncesi güncel sistemle eşleme gerekli.


13.11.2026 — Market Sandıklar kullanıcı referansı alındı: REF/Tamamlandı/Market Sandıklar 2026-11-13.png. Oyun anahtarı market_sandik_20261113. Yalnız Sandıklar alanında kullanılır.

## Ekran temizliğinde bağlananlar — 13.11.2026

- Demirci/Ekipman tür simgeleri: icon_gear_silah, zirh, kask, run, cizme, yuzuk; tek kaynak, yeni üretim yok.
- Eşya kartları: gearIcon(slot,tier); Çanta, Ekipman ve Demirci aynı görseli kullanır.
- Tılsım: charm_tas ve charm_av. Kalıntı: ekonomi.js içindeki 12 gorsel anahtarı. Yeni üretim yok.
- Pet kedi/kopek/baykus/ejder/kaplumbaga/boynuz ikonları gorsel/ikon içinde mevcut; eski eksik ikon satırları kaldırıldı.

### Kullanıcı özeti

Bu tur mevcut 14 koleksiyon asseti bağlandı; üretim ihtiyacı tekrar kontrol edildi. 7 büyük pet önizlemesi üretildi; Tilki için mevcut 768 px asıl kullanıldı. Sekizi oyuna bağlandı.

## Büyük pet önizlemeleri — 13.11.2026

Oyun dosyaları: `Oyun/gorsel/arayuz/preview_pet_<ad>.png`. `alanlar.js / collectionPetPreview` mevcut pet kataloğunun `gorsel` anahtarından seçer. Küçük ikon ve savaş atlasları korunur.

| Ad | Referans / kaynak | Boyut | Üretim / teknik kontrol |
|---|---|---|---|
| akboynuz | gorsel/ikon/pet_akboynuz.webp | 1254×1254 | image_gen · geçti |
| kopek | gorsel/ikon/pet_kopek.webp | 1254×1254 | image_gen · geçti |
| kedi | gorsel/ikon/pet_kedi.webp | 1254×1254 | image_gen · geçti |
| boynuz | gorsel/ikon/pet_boynuz.webp | 1254×1254 | image_gen · geçti |
| kaplumbaga | gorsel/ikon/pet_kaplumbaga.webp | 1254×1254 | image_gen · geçti |
| baykus | gorsel/ikon/pet_baykus.webp | 1254×1254 | image_gen · geçti |
| ejder | gorsel/ikon/pet_ejder.webp | 1254×1254 | image_gen · geçti |
| tilki | Asset/Islenen/pet_tilki.png | 768×768 | Projedeki asıl · geçti |

Araç: yerleşik image_gen; 7 ayrı referanslı üretim, transparent_background=true. Ortak istem: mevcut petin kimliğini, pozunu, sağa bakışını, renklerini, kıyafetini ve boyalı RPG görünümünü koru; düşük çözünürlük izlerini temizleyip ayrıntıyı artır; tek tam gövde, şeffaf PNG, yazı/çerçeve/gölge/ek nesne yok. Gerçek çıktı boyutu 1254 px; istenen asgari 768 px sağlandı. Kaynaklar proje görselleridir; dış stok asset kullanılmadı.

Kontrol: skill'in asset_report.py --require-alpha kontrolü 8 dosyada geçti; her dosyada gerçek şeffaf piksel var. Sekizi oyun ekranında açıldı; bozuk görsel/konsol hatası yok. Dosyalar kopyalandı, eski asıllar değişmedi.

Önceki Gorsel_Ihtiyac.md kaydındaki sonraki işler: 9 Arena portresi ve 24 pet yetenek ikonu. Bunlar mevcut 3 rakip/8 pet ve eski 6 ikon kuyruğuyla eşlenmeden üretime alınmaz.

### Kullanıcı özeti

Sekiz petin büyük önizlemesi hazır ve bağlı. Bu tur yeni ihtiyaç listesi açılmadı; bekleyen atlas/ikon eşlemeleri yukarıdadır.

## Ortak buton çerçeveleri — 13.11.2026

`Oyun/gorsel/arayuz` içinde dört yazısız SVG: `k_button_dark.svg`, `k_button_red.svg` (240×64), `k_button_round.svg`, `k_selection.svg` (80×80). CSS dokuz dilimli çerçeve olarak kullanır; farklı boylarda köşeler korunur. Kaynak: kullanıcının beş görseli, GORSEL_DIL.md üst bölümü. Kodla çizildi; yeni raster görsel ihtiyacı yok.

### Kullanıcı özeti

Ortak buton çerçeveleri üretildi ve oyuna bağlandı. Kaynak görseller değişmedi.

## Kullanıcı özeti — ikon turu

Son turdaki 53 sade simge ve ortak sahne kullanım dışıdır. Önceki ekran görselleri tekrar bağlıdır.
