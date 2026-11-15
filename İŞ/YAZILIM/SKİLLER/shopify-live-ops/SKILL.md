---
name: shopify-live-ops
description: Shopify mağaza kimliği, Admin GraphQL, Dawn/OS 2.0 tema dosyası, katalog, menü ve medya işlemlerini güvenli uygular. Faprika, Woo veya Next.js vitrinde kullanma. Use when the user runs /shopify-live-ops or work targets a Shopify store, Dawn, Liquid, themeFilesUpsert, productCreate, or myshopify.com.
---

# Shopify Live Ops

Önce mağazayı kanıtla. Yanlış shop’a yazma.

## Mağazalar

Shop kimliğini `Desktop\HARİTA.md` bölüm 4’ten al. Shop tablosunu burada kopyalama.

Sümen COM, Sümen TR ve İmalattan Sümen ayrı shop’tur. Görev biriyse diğerine yazma. Güner Ofis ve Deri Kutu da ayrı shop’tur.

## Girdiler

- Hedef shop domain
- `SHOPIFY_SHOP`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` — değerleri loglama
- Yerel tema kökü — haritadaki site klasörü
- Değişecek kaynak: tema dosyası, ürün, koleksiyon, menü, medya

## Auth

1. `POST https://{shop}/admin/oauth/access_token` — `grant_type: client_credentials`.
2. Token ile `Admin API 2024-10` GraphQL.
3. İlk sorgu: `shop { name myshopifyDomain primaryDomain { host } }`. Domain eşleşmezse dur.

## Tema

- Dawn OS 2.0: `templates/*.json`, `sections/*`, `snippets/*`, `layout/theme.liquid`.
- Canlıya dosya: `themeFilesUpsert` — `body: { type: TEXT, value }`. En fazla 50 dosya.
- Yeni tema: zip’i `stagedUploadsCreate` `resource: FILE` ile yükle, `themeCreate(source:)`, `processing` bitsin, `themePublish`. `resource: THEME` yok.
- JSON şablonlarda Shopify `/* auto-generated */` öneki olabilir; upsert düz JSON kabul eder.
- Kullanıcı açıkça yayın demeden `themePublish` veya canlı silme yapma. Katalog sıfırlama ayrı açık izin ister.

## Katalog

- Ürün: `productCreate(product: ProductCreateInput!, media:)`. `ProductInput.variants` yok.
- SKU/fiyat: default varyantı al, `productVariantsBulkUpdate`.
- Görsel: `stagedUploadsCreate` `PRODUCT_IMAGE` + `fileSize`, sonra `media.originalSource`.
- Koleksiyon silme alanı: `deletedCollectionId`.
- Menü: `menuUpdate` item tipi `[MenuItemUpdateInput!]!`.
- Throttle: `extensions.cost.throttleStatus`; düşükse bekle.

## Değişmezler

- Secret, token, `shpss_`/`shpat_` basma.
- Fiyat, stok, unvan, kargo adı, GTIN uydurma.
- `npx` PowerShell’de script yasağı: `npx.cmd` veya `node.exe`.

## Çıktı

Shop doğrulaması, değişen kaynak, GraphQL/userErrors, canlı URL kanıtı, rollback (önceki tema/yedek).
