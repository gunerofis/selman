---
name: catalog-photo-unbrand
description: Kaynak ürün fotoğrafından markasız tek hero görsel üretir, SKU kodunu koda basar, isteğe bağlı Shopify medyasına yükler. Çok açılı set, logo ekleme veya fiyat işinde kullanma. Use when the user runs /catalog-photo-unbrand or asks for unbranded product photos, ST SKU stamps, logo removal, or one hero image per product.
---

# Catalog Photo Unbrand

Görsel model yazıyı bozar. SKU’yu PIL veya System.Drawing ile bas.

## Girdiler

- Kaynak katalog (HTML/JSON) veya klasör
- SKU öneki (ör. `ST`) ve 1’den artan numara
- Çıktı klasörü
- Shopify’a basılacaksa `shopify-live-ops` kimliği

## Akış

1. Kaynakları parse et; her SKU için tek `data-full`/hero URL indir.
2. `image_edit` ile aynı açı ve deri rengi kalsın. Logo, damga, basılı isim, paket yazısı çıksın. Adım başına en fazla 6–8 çağrı; 429’da bekle.
3. Üretilen dosyayı `unbranded/{SKU}.jpg` kaydet. Sohbette görseli yeniden gösterme.
4. Damga: sol alt, beyaz zemin, siyah `ST0001` biçimi. Kaynak `unbranded`, çıktı ayrı klasör. Damgayı modele yazdırma.
5. Kör kontrol: marka adı/damga kalmışsa bir kez daha `image_edit`; SKU metni yanlışsa kodla bas, modelle düzeltme.
6. Siteye ekleme istenirse `shopify-live-ops`: tek medya, `inventoryPolicy: CONTINUE`, fiyat yoksa 0 basıp vitrinde “Fiyat için yazın” (`shopify-tr-store`).
7. 2./3./4. açı istenmediyse üretme.

## Değişmezler

- Rakip markayı vitrin logosu olarak bırakma.
- Model adını (Perge, Laodikya vb.) ürün başlığına taşıma.
- Orijinal kaynak dosyayı ezme.

## Çıktı

SKU listesi, üretilen/atlanan, damga doğrulaması, yüklenen product id/handle.
