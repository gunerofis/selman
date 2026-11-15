# ChatGPT Plus / Google AI Pro — Görsel Üretim Paketi (Session 1)

> 9 statik görseli **senin** ChatGPT Plus veya Google AI Pro hesabından üreteceğiz
> (Higgsfield kredisi harcamamak için). Sesler + sonraki işler bende.
> Manifest: [assets.csv](assets.csv) · Durum: [../oyun.md](../oyun.md)

## ÖNEMLİ — tutarlılık için 3 kural
1. **Hepsini TEK sohbette üret** (ChatGPT'de tek konuşma). İlk görsel `hero` olsun;
   sonrakileri üretirken "aynı stil, aynı çizgi, aynı palet" de — model önceki
   görselleri hatırlar, oyun tek elden çıkmış gibi durur.
2. **Sprite ve UI görsellerinde "transparent background" iste** (PNG şeffaf).
   ChatGPT (GPT-image) şeffaf arka planı destekler. Zemin ve arka plan görselinde
   şeffaflık gerekmez.
3. İndirince **tam şu dosya adlarıyla** şuraya kaydet:
   `C:\Users\Administrator\Desktop\CLAUDE\design\assets\<id>.png`
   (örn. `hero.png`, `tile_ground.png`). Adları birebir tut — gerisini ben bağlarım.

## STYLE FORMULA (her prompta birebir gömülü — değiştirme)
```
Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset.
```

---

## 1) hero.png  (kare 1:1, ŞEFFAF arka plan)
```
A game sprite of a round, cute, cheerful hero character, single character, full body visible, centered, facing right, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no shadow on the ground, nothing cropped at the edges.
```

## 2) tile_ground.png  (kare 1:1, opak — şeffaflık YOK)
```
A seamless tileable game texture tile of mint-green and cream stone ground, uniform pattern density, that repeats horizontally and vertically with no visible seam. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. No border, no vignette, flat even lighting, no single focal object.
```

## 3) bg_main.png  (yatay/geniş, opak — 16:9'a en yakın boyut, örn. 1536x1024)
```
A game background of a soft sunny sky with distant rolling mint-green hills, wide establishing view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. No characters, no UI, slightly muted detail so foreground game elements stay readable, soft depth layering.
```

## 4) trap_spike.png  (kare 1:1, ŞEFFAF)
```
A game sprite of a row of pointed stone floor spikes, single object, full body visible, centered, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no ground plane, nothing cropped.
```

## 5) trap_fakeplatform.png  (kare 1:1, ŞEFFAF)
```
A game sprite of a deceptive innocent-looking platform block that looks exactly like a safe normal platform, single object, full body visible, centered, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no ground plane, nothing cropped.
```

## 6) trap_spring.png  (kare 1:1, ŞEFFAF)
```
A game sprite of a springy coiled bounce pad, single object, full body visible, centered, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no ground plane, nothing cropped.
```

## 7) trap_movingblock.png  (kare 1:1, ŞEFFAF)
```
A game sprite of a tipping movable stone block, single object, full body visible, centered, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no ground plane, nothing cropped.
```

## 8) door_goal.png  (kare 1:1, ŞEFFAF)
```
A game sprite of a friendly inviting level exit door, single object, full body visible, centered, side-view. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, no ground plane, nothing cropped.
```

## 9) ui_retry.png  (kare 1:1, ŞEFFAF)
```
A game UI element: a circular retry arrow icon, single element, centered. Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset. Transparent background, crisp edges, no drop shadow.
```

---

## Ürettikten sonra
Dosyaları `design/assets/` içine yukarıdaki adlarla kaydet, bana "görseller hazır" de.
Ben devralırım: (1) tutarlılık/ölçek kontrolü (contact sheet), (2) gerekirse arka plan
temizleme (Higgsfield `remove_background`), (3) eksik/bozuk olanı yeniden üretmen için
geri bildirim. Hero animasyonu Session 2'de kodla yapılacak (autosprite'a gerek yok).
