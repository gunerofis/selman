---
name: web
description: WEB skill'lerini tek tam geçişte, doğru sırada çalıştırır. Küçük veya tek konulu web işinde kullanma. Use when the user runs /web or asks to run all web skills together.
---

# WEB tam geçiş

Bu skill diğer skill gövdelerini kopyalamaz. Her fazda `selman\Web\agent\.grok\skills\<ad>\SKILL.md` dosyasını tam oku; akışını ve tamamlanma ölçütünü uygula. Eski `C:\Users\DELL` yolu kullanılmaz.

Hedef, açıkça başka bir site verilmediyse mevcut çalışma dizinindeki projedir. Kod yazmadan önce `repo-audit` ile yığını kanıtla. Production'a deploy, push, gerçek ödeme, gerçek e-posta veya canlı veri değişikliği yapma.

## Sıra

1. `repo-audit`
2. `shopify-live-ops` — yalnız Shopify kanıtlanırsa
3. `shopify-tr-store` — yalnız TR Shopify satışıysa
4. `catalog-photo-unbrand` — yalnız ürün görseli üretiliyor veya markasızlaştırılıyorsa
5. `frontend-ui-implementation` — yalnız görünen UI/regresyon riski varsa; yoksa atla
6. `ecommerce-integrity`
7. `payment-checkout`
8. `auth-and-permissions`
9. `admin-panel`
10. `search-filtering`
11. `cms-content-management`
12. `i18n-localization`
13. `product-feed-merchant`
14. `image-media-optimization`
15. `seo-audit`
16. `analytics-tracking`
17. `cookie-consent-privacy`
18. `email-notification-flows`
19. `api-integration`
20. `observability-error-monitoring`
21. `performance-audit`
22. `accessibility-audit`
23. `security-review`
24. `backup-migration-rollback`
25. `dependency-upgrade-safety` — yalnız yükseltme/lock farkı varsa
26. `faprika-safe-customization` — yalnız Faprika veya panel enjeksiyonu kanıtlanırsa
27. `browser-qa`
28. `release-verification`

## Atlama kuralı

Altyapı yoksa (ör. ödeme sağlayıcısı, CMS, feed, Shopify, Faprika, çok dil) o skill'i çalıştırma; uydurma. Atlanan skill adını ve gerekçesini rapora yaz. Var olan altyapıyı “yok” diye atlama.

## Rapor

Türkçe, tek rapor:

1. Sonuç
2. Çalıştırılan skill'ler
3. Atlanan skill'ler ve nedeni
4. Bulgular (öncelikli)
5. Değiştirilen dosyalar — bu geçiş varsayılan olarak denetimdir; kullanıcı düzeltme istemedikçe kod değiştirme
6. Doğrulama
7. Kalan risk
8. Geri alma — değişiklik yoksa “yok”
