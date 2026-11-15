# Üretim Promptları — PIXEL ART yeniden tasarım (tüm set: v1 + v2)

> Manifest: [assets-v2.csv](assets-v2.csv) · Mimari: [../mimari-v2.md](../mimari-v2.md) · Üst plan: [../oyun.md](../oyun.md).
> **YÖN DEĞİŞİKLİĞİ (kullanıcı, 2026-06-17):** Eski "flat vector mint-yeşil çizgi film"
> stili bırakıldı. Yeni stil = **retro pixel art**. Bu dosya artık **tüm görsel asset'leri**
> (eski 9 + yeni 12 = 21 görsel) baştan, tek tutarlı pixel-art kimliğinde üretir.
> (Eski flat-vector prompt dosyaları `prompts.md` / `external-image-prompts.md` **silindi**.)
> Sprite/UI key color = magenta `#FF00FF` (cutout için). Sesler stilden etkilenmez (en altta).

---

## 🎯 ANA PROMPT (önce bunu ver — tüm görsellerin ortak çerçevesi)
> Üretime başlamadan sohbete **bu bloğu** yapıştır. Sonra her görseli `Next asset — <id>: <desc>`
> ile tek tek iste. Model bağlamı hatırlar → set tek elden çıkmış gibi olur. İlk görsel `hero`
> olsun; sonrakileri üretirken üretilen önceki pixel'leri stil referansı olarak ekle.

```
You are producing a cohesive set of RETRO PIXEL ART game assets for a cute-but-deceptive side-scrolling platformer called "Goatcha!". Every asset MUST share one consistent pixel-art identity so the whole set looks like one authentic 16-bit game.

PIXEL ART STYLE (apply to every image, never deviate):
- True retro 16-bit pixel art: hard crisp square pixels, NO anti-aliasing, NO blur, NO soft gradients, NO smooth vector curves. Shading done with clean dithering or flat color bands only.
- Low-resolution sprite look on a visible pixel grid; chunky readable pixels, not high-detail illustration.
- Bold dark pixel outline around each object; strong silhouette readable at small size.
- Limited cohesive palette across the WHOLE set (~16-24 colors total). Warm, bright, cheerful daytime mood: sunny greens, warm cream/sand stone, and a sunset-orange + cream hero that pops against the world.
- Cute, friendly, slightly mischievous tone. Hazards/traps are only SUBTLY hinted (a faint darker/dusty-red pixel tint) and must blend with the environment, never glow or scream "danger" — camouflage is core to the gameplay joke.

GLOBAL RULES (apply to every image):
- Strict flat side-view (2D platformer), eye-level. No perspective, no isometric, no 3D tilt.
- A SINGLE centered object/element, full body visible, nothing cropped at the edges.
- Solid uniform bright magenta #FF00FF background (chroma key for cutout) — no shadow on it, no ground plane, no scenery behind the object.
- Keep one consistent pixel scale across the whole set (same effective pixel size). A hero is ~1 unit tall; each asset lists its relative scale — keep proportions believable.
- Same palette, same outline weight, same dithering style on every asset. Do NOT add new accent colors unless the description asks.
- I will attach previously generated assets as reference — match their pixel size, palette, and proportions exactly.

I will now send you assets one by one. Keep ALL of the above and only change the subject I describe.
```

> **Pixel-perfect ipucu:** Bu modeller "pixel-art görünümü" üretir ama tam grid hizalı
> olmayabilir. Gerekirse üretilen görseli küçük bir çözünürlüğe (örn. 64–128 px) **nearest-
> neighbor** ile küçültüp tekrar büyüterek gridi sertleştir. Renk sayısını sınırlamak için
> palet kuantizasyonu (posterize) uygulanabilir.

---

## GÖRSELLER — her biri için `Next asset — <id>: <desc>`
> Model: `nano_banana_2`, resolution `1k`. Aşağıdaki `desc` SADECE özneyi tanımlar — stil ANA
> PROMPT'tan gelir (tekrar yazma). Üretim sonrası sprite/UI → `remove_background` (şeffaf PNG),
> `design/assets/<id>.png` olarak kaydet (id'ler birebir).

### Çekirdek (eski v1 — yeniden, pixel)
| id | scale | desc |
|---|---|---|
| `hero` | 1.0 | a round, cute, cheerful little hero character, facing right |
| `tile_ground` | tile | a seamless tileable stone/grass ground block that repeats horizontally and vertically with no visible seam |
| `bg_main` | bg (16:9) | a simple sunny sky with distant rolling hills, parallax background, muted so foreground stays readable, no characters, no UI |
| `door_goal` | 2.0 | a friendly inviting level exit door |
| `ui_retry` | ui | a circular retry/restart arrow icon |

> `hero` için: temel sprite üretilince animasyon (idle/run/jump) S-kodda squash/stretch ile
> yapılacak (v1 kararı korunuyor); ayrı frame şart değil. İstersen run/jump için 2-3 poz da üretilebilir.

### Tuzaklar / mekanikler (eski + yeni — pixel)
| id | scale | desc |
|---|---|---|
| `trap_spike` | 0.6 | a row of pointed floor spikes, only subtly hinted, blends with the ground |
| `trap_ceiling_spike` | 0.8 | a cluster of spikes mounted on the ceiling, points facing down |
| `trap_fakeplatform` | 1.0 | a platform block that looks exactly like a normal safe platform (the betrayal is that it secretly collapses) |
| `trap_spring` | 0.8 | a springy coiled bounce pad |
| `trap_movingblock` | 1.0 | a movable stone block that tips/slides |
| `deco_spike_plastic` | 0.6 | obviously harmless fake plastic toy spikes in cheerful bright colors, clearly soft and silly |
| `door_runner` | 2.0 | a level exit door with a subtle sly mischievous little face, hinting it is secretly alive |

### Yeni mekanik UI / zone / fx (yeni v2 — pixel)
| id | scale | desc |
|---|---|---|
| `ui_button_press` | 1.0 | a big glossy red arcade push button with a bold upward arrow, looking irresistibly tempting to press |
| `fx_gas_zone` | 2.0 | a soft semi-transparent toxic green gas cloud with a small radiation hazard sign (this is a non-solid trigger area, hazy look) |
| `ui_invert_indicator` | ui | a small icon of two crossed left-right arrows meaning reversed controls |
| `ui_countdown_frame` | ui | a rounded countdown timer badge frame with a hollow empty center (the number is drawn by the engine) |
| `ui_fake_victory` | ui (16:9) | a celebratory victory banner ribbon with confetti and an empty blank center for big text (must look like a genuine win screen) |
| `fx_invisible_dust` | 0.4 | a faint small puff of pale dust particles, very subtle |

### "Büyük Final" blöf süsleri (yeni v2 — DEKORATİF, hitbox yok — pixel)
| id | scale | desc |
|---|---|---|
| `deco_sawblade` | 1.4 | a large menacing circular saw blade with sharp teeth (pure decoration / bluff) |
| `deco_laser_beam` | 2.0 | a glowing horizontal red laser beam with emitter nodes at both ends (pure bluff) |
| `deco_fireball` | 0.9 | a fierce fireball with a flaming trail (pure bluff) |

---

## SESLER (stilden ETKİLENMEZ — model `mirelo_text_to_audio` / `sonilo_music`)
> v1 sesleri (`sfx_jump`, `sfx_death`, `sfx_trap`, `music_main`) zaten üretildi → `design/assets/`.
> Pixel art geçişi sesleri değiştirmez. Aşağıdakiler yeni (v2) ve hâlâ üretilecek.

| id | duration | prompt |
|---|---|---|
| `sfx_button` | 1s | `a satisfying arcade button click immediately followed by an ominous low thunk, the sound of pressing something you shouldn't have` |
| `sfx_countdown_tick` | 1s | `a soft neutral single clock tick, clean and minimal, suitable to repeat once per second` |
| `sfx_fake_win` | 2s | `a short cheerful victory jingle that cuts off abruptly into silence, a celebration that betrays` |

> İsteğe bağlı: yeni pixel/retro hava için seslere de "chiptune / 8-bit / retro game SFX"
> eklenebilir — ama v1 sesleriyle tutarlılık için şimdilik mevcut tonda bırakıldı.

---

## Üretim sonrası
1. Sprite/UI → `remove_background` (şeffaf PNG). `tile_ground`/`bg_main` opak kalır.
2. `design/assets/<id>.png` olarak kaydet (assets-v2.csv id'leriyle birebir; eski dosyaların ÜZERİNE yaz).
3. Tüm seti tek contact sheet'te diz → pixel boyutu/palet/ölçek tutarlılığını göz ile kontrol et.
4. Eksik/bozuk olanı yeniden üret. Gerekirse nearest-neighbor küçültme + palet kuantizasyonu ile gridi sertleştir.
