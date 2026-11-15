# Üretim Promptları — Session 1 (HAZIR, fire edilmeyi bekliyor)

> Bağlantı (Higgsfield MCP) düzeldiğinde bu promptlar **olduğu gibi** kullanılacak.
> STYLE FORMULA her görsel promptuna **byte-identical** gömülüdür — değiştirme.
> Manifest: [assets.csv](assets.csv). Durum: [../oyun.md](../oyun.md).

## STYLE FORMULA (onaylı, 2026-06-16 — değiştirilemez)
```
Flat vector cartoon with bold clean shapes and soft gradients, rounded friendly silhouettes outlined in thick charcoal-black lines. Environment rendered in soft mint-green and cream stone tones with warm amber shadows, the hero in contrasting sunset-orange and cream-white, hazards and traps marked with only a faint dusty-red tint that reveals itself on close inspection rather than glowing. Bright, cheerful daylight mood that turns every hidden trap into a cruel little joke. High contrast between foreground elements and background, clean readable silhouettes, consistent side-view perspective across every asset.
```

## Görseller — model: `nano_banana_2`, resolution: `1k`
Prompt yapısı = `<kind template> + <description> + <STYLE FORMULA> + <kind suffix>`.
Sprite/UI suffix'lerinde key color = magenta `#FF00FF`.

| id | aspect | template tipi |
|---|---|---|
| hero | 1:1 | sprite (magenta key) |
| tile_ground | 1:1 | tile (opak, key yok) |
| bg_main | 16:9 | background (opak, key yok) |
| trap_spike | 1:1 | sprite (magenta key) |
| trap_fakeplatform | 1:1 | sprite (magenta key) |
| trap_spring | 1:1 | sprite (magenta key) |
| trap_movingblock | 1:1 | sprite (magenta key) |
| door_goal | 1:1 | sprite (magenta key) |
| ui_retry | 1:1 | ui (magenta key) |

**sprite template:** `game sprite of <desc>, single character/object, full body visible, centered, <FORMULA>, on a solid uniform bright magenta #FF00FF background, no shadows cast on the background, no ground plane, nothing cropped at the edges`

**tile template:** `seamless tileable game texture tile of <desc>, uniform pattern density, <FORMULA>, perfectly seamless edges that wrap horizontally and vertically, no border, no vignette, flat even lighting, no single focal object`

**background template:** `game background of <desc>, wide establishing view, <FORMULA>, no characters, no UI elements, slightly muted detail so foreground game elements stay readable, soft depth layering`

**ui template:** `game UI element: <desc>, single element, centered, <FORMULA>, on a solid uniform bright magenta #FF00FF background, crisp edges, no drop shadow outside the element`

### description (desc) değerleri
- hero: `the round cheerful hero`
- tile_ground: `mint-green and cream stone ground`
- bg_main: `a soft sunny sky with distant rolling mint-green hills`
- trap_spike: `a row of pointed stone floor spikes`
- trap_fakeplatform: `a deceptive innocent-looking platform block`
- trap_spring: `a springy coiled bounce pad`
- trap_movingblock: `a tipping movable stone block`
- door_goal: `a friendly level exit door`
- ui_retry: `a circular retry arrow icon`

## Üretim sonrası işlem
1. **bg-removal**: hero + 5 tuzak/door sprite + ui_retry → `remove_background` (media_type: image) ile şeffaf PNG.
2. **hero animasyon**: bg-removed hero → `autosprite` (model: autosprite) ile 3 sheet:
   `kind: idle` (frame_count ~12), `kind: run` (~16), `kind: jump` (~14), frame_size 256, remove_bg default.
3. **contact sheet**: tüm spriteları relative_scale'lerine göre tile üzerine diz, göz kontrolü (hero ortamdan ayrışıyor mu, stil tutarlı mı).
4. **indir**: tüm final dosyaları `design/assets/`'a (curl mevcut).

## Sesler
| id | model | duration | prompt |
|---|---|---|---|
| sfx_jump | mirelo_text_to_audio | 1 | `a short bouncy cartoon jump hop, light springy boing, playful and cute` |
| sfx_death | mirelo_text_to_audio | 2 | `a short comedic cartoon failure sound, funny descending womp-womp, lighthearted goofy defeat` |
| sfx_trap | mirelo_text_to_audio | 1 | `a sudden comedic trap-triggered snap, surprising cartoon pop with a quick playful sting` |
| music_main | sonilo_music | 30 | `a light, cheerful, bouncy looping platformer tune, upbeat and playful with a deceptively innocent happy mood, instrumental, no lyrics` |
