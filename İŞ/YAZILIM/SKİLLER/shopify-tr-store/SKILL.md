---
name: shopify-tr-store
description: Türkiye Shopify vitrini için iyzico, TRY, KVKK, mesafeli satış, Dawn TR ve 0-fiyat davranışını uygular. Shopify Payments, Stripe veya TR dışı mağazada kullanma. Use when the user runs /shopify-tr-store or the store sells in Turkey with iyzico, KVKK, mesafeli satış, or TRY.
---

# Shopify TR Store

TR satışında Shopify Payments yok. Ödeme üçüncü parti. Hukuki metin uydurulmaz.

## Girdiler

- Shop, para birimi, dil
- Ödeme uygulaması (iyzico/PayTR) kurulu mu
- Onaylı unvan, adres, MERSİS, kargo adı — yoksa boş bırak
- Mevcut politika sayfaları ve cookie davranışı

## Akış

1. `shop.currencyCode` TRY, vitrin dili TR olsun.
2. Ödemeyi Admin uygulamalarından doğrula. Kurulu değilse “iyzico panelden bağlanacak” yaz; sahte taksit vaadi koyma.
3. Fiyat 0 ise tutarı 0.00 TL gösterme. Metin: “Fiyat için yazın” → `/pages/iletisim`. Sepete ekleme.
4. Kargo firması ve ücretsiz eşik doğrulanmadan kargo ücreti veya “X kargo” yazma.
5. Gizlilik, iade, mesafeli satış, KVKK: onaylı kimlik gelmeden unvan/vergi/MERSİS basma.
6. Cookie: isteğe bağlı ölçüm consent’siz çalışmasın. Hukuki sınıflandırma uydurma; `cookie-consent-privacy` akışına uy.
7. Suni deri ana vitrine eşit kapı olmasın; ayrı koleksiyon/sayfa.
8. Checkout’a özel app ile dokunma.

## Değişmezler

- Sahte yorum, sahte stok, sahte “en çok satan”.
- Taksit sayısı doğrulanmadan yazılmaz.
- `purchase` eventi yalnız gerçek başarılı siparişte.

## Çıktı

TRY/TR kanıtı, ödeme durumu, 0-fiyat UX, politika boşlukları, cookie envanteri.
