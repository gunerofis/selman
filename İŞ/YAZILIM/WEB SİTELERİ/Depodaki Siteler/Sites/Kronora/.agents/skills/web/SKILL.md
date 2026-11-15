---
name: web
description: Tüm 25 WEB skill'ini tek tam geçişte, doğru sırada çalıştırır. Küçük veya tek konulu web işinde kullanma. Use when the user runs /web or asks to run all web skills together.
---

# WEB tam geçiş

Bu skill diğer skill gövdelerini kopyalamaz. Her fazda ilgili `SKILL.md` dosyasını `C:\Users\DELL\.grok\skills\<ad>\SKILL.md` yolundan tam oku ve onun akışını, değişmezlerini ve tamamlanma ölçütünü uygula.

Hedef, açıkça başka bir site verilmediyse mevcut çalışma dizinindeki projedir. Kod yazmadan önce `repo-audit` ile yığını kanıtla. Production'a deploy, push, gerçek ödeme, gerçek e-posta veya canlı veri değişikliği yapma.

## Sıra

1. `repo-audit`
2. `frontend-ui-implementation` — yalnız görünen UI/regresyon riski varsa; yoksa atla
3. `ecommerce-integrity`
4. `payment-checkout`
5. `auth-and-permissions`
6. `admin-panel`
7. `search-filtering`
8. `cms-content-management`
9. `i18n-localization`
10. `product-feed-merchant`
11. `image-media-optimization`
12. `seo-audit`
13. `analytics-tracking`
14. `cookie-consent-privacy`
15. `email-notification-flows`
16. `api-integration`
17. `observability-error-monitoring`
18. `performance-audit`
19. `accessibility-audit`
20. `security-review`
21. `backup-migration-rollback`
22. `dependency-upgrade-safety` — yalnız yükseltme/lock farkı varsa
23. `faprika-safe-customization` — yalnız Faprika veya panel enjeksiyonu kanıtlanırsa
24. `browser-qa`
25. `release-verification`

## Atlama kuralı

Altyapı yoksa (ör. ödeme sağlayıcısı, CMS, feed, Faprika, çok dil) o skill'i çalıştırma; uydurma. Atlanan skill adını ve gerekçesini rapora yaz. Var olan altyapıyı “yok” diye atlama.

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
