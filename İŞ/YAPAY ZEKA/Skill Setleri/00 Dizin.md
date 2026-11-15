# Skill Setleri — skill merkezi

Güncelleme: 2026-11-04. Bilgisayardaki kişisel skill'lerin **tek** yeri burasıdır. Bir skill yalnız burada düzenlenir; başka yerde kopyası tutulmaz.

## Ajanlar buradan okur

| Ajan | Okuduğu yol | Bağlantı |
|---|---|---|
| Grok | `~\.grok\skills`, `~\.agents\skills`, `~\.claude\skills` | üçü de bu klasöre bağlantı; Grok aynı adı tek sayar |
| Codex (GPT) | `~\.agents\skills` | bu klasöre bağlantı. `~\.codex\skills` içinde yalnız Codex'in kendi `.system` klasörü kalır |
| Claude Code | `~\.claude\skills` | bu klasöre bağlantı |

Bağlantı (junction) kopya değildir: aynı klasör üç yerden görünür. Yeni skill bu klasöre `ad\SKILL.md` olarak eklenir; üç ajan da kendiliğinden görür.

Bu klasörü okuyamayan iki yer:
- **ChatGPT web (GPT'ler):** skill elle yüklenir.
- **Claude uygulaması:** hesap skill'leridir; sohbette öneri kartıyla kaydedilir. `doku-gorsel`, `doku-portre`, `net-cikti` orada durur.

Dokunulmaz: `~\.codex\skills\.system`, `~\.grok\bundled`, eklenti ve pazaryeri önbellekleri. Bunları araçlar kendi yönetir.

## Skill'ler (52)

Kapalı alan skill'leri yalnız kullanıcı o adı görevde yazarsa kullanılır: `doku-art-direction` (DOKU), `feelparfume-vitrin` (Feelparfume).

| Grup | Skill'ler | Önceki yer |
|---|---|---|
| Çalışma biçimi | `net-dogrudan-cikti`, `arac-secimi`, `gof-living-summary` | Codex, burası |
| Web sırası | `web` (hepsini sırayla çalıştırır), `repo-audit`, `release-verification`, `dependency-upgrade-safety`, `backup-migration-rollback` | Grok Skilleri |
| Arayüz | `frontend-design`, `frontend-ui-implementation`, `gof-web-ui`, `product-design`, `accessibility-audit`, `i18n-localization`, `site-renk` | Codex, Grok, .agents, Grok Skilleri |
| Yönetim paneli | `admin-panel`, `gof-admin-panel-ux`, `gof-admin-operations`, `auth-and-permissions`, `cms-content-management` | Codex, Grok Skilleri |
| E-ticaret | `ecommerce-integrity`, `payment-checkout`, `search-filtering`, `product-feed-merchant`, `email-notification-flows`, `faprika-safe-customization` | Grok Skilleri |
| Shopify | `gof-shopify`, `shopify-live-ops`, `shopify-tr-store`, `shopify-alt-text`, `shopify-seo-metadata` | .agents, Grok, Grok Skilleri |
| SEO | `seo-audit`, `gof-technical-seo`, `gof-seo-content` | .agents, Grok Skilleri |
| Hız ve test | `performance-audit`, `gof-web-performance`, `image-media-optimization`, `browser-qa`, `gof-web-qa`, `observability-error-monitoring` | .agents, Grok Skilleri |
| Güvenlik ve izin | `security-review`, `cookie-consent-privacy`, `analytics-tracking`, `api-integration` | Grok Skilleri |
| Görsel ve reklam | `catalog-photo-unbrand`, `meta-ads-gorsel`, `reklam-okuma`, `instagram-plani` | Codex, Grok Skilleri, burası |
| İş kaydı | `is-merkezi`, `orkestra-kayit` | Codex, burası |
| Kapalı alan | `doku-art-direction`, `feelparfume-vitrin` | Codex, Grok Skilleri |

Aynı işi yapan iki skill varsa sıra: `web` akışındaki skill önce, `gof-*` ikinci.

## Projenin içinde kalanlar

Bunlar o projeyle birlikte çalışır, yerinde bırakıldı. Merkezdeki skill'in eski kopyalarıdır veya yalnız o projeye aittir:

| Yer | İçerik |
|---|---|
| `Web\Sites\Sweb\.agents\skills`, `Web\Sites\Kronora\.agents\skills` | 26'şar web skill'i; merkezdekiyle aynı (yalnız `web` bir sürüm eski) |
| `Web\Sites\Sweb\.grok\skills` | 18 Grok App Builder skill'i (oyun, `threejs`, `xai-api`…) |
| `DOKU\site\.agents\skills` | `doku-yonetim`, `doku-vitrin`, `doku-google-kalite` (kapalı) |
| `Programlar\Program Dosyaları\Orkestra\OPERASYON\.agents\skills` | 13 `operasyon-*` skill'i |

## Kayıt

- Taşıma listesi: `selman\Kayıt\Skill Merkezi 2026-11-04.csv` (48 taşıma, 3 bağlantı).
- Geri alma: `selman\Kayıt\Skill Merkezi Geri Al 2026-11-04.ps1`.
- Boşalan eski klasörler: `Desktop\_SİLİNECEK\Skill Merkezi 2026-11-04`.
- Ham kopya yığını (çalışan set değil): `Yapay Zeka\Skill Kopyaları 2026-10-24`.
