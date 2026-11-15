---
name: gof-web-performance
description: Site hızı, LCP/INP/CLS, Lighthouse, yavaş etkileşim veya kaynak yükleme teşhisi için kullan. Genel SEO raporu, sıradan CSS değişikliği ve sadece erişilebilirlik denetimi için kullanma.
---

# Kanıta dayalı web performansı

Önce hedefi ayır: tek yavaş davranış, sayfa yüklemesi veya kapsamlı performans denetimi. Ortam, URL, cihaz ve veri kaynağını kaydet. Ölçüm/teşhis gerektiğinde [ölçüm rehberi](references/olcum-teshis.md) dosyasını oku; yalnız mevcut rapordaki bir terimi açıklarken gerekmeyebilir.

Gerçekten mevcut araçları kullan. Chrome DevTools MCP uygunsa onu; yoksa mevcut Lighthouse/PageSpeed raporu, başka yetkili ölçüm aracı veya sınırlı kaynak incelemesini değerlendir. Araç yokluğu sitenin kötü performans gösterdiğini kanıtlamaz. Sayısal sonuç yoksa sayı üretme. Kullanıcı özellikle belirli bir araç istediyse alternatifi eşdeğer tamamlanmış iş gibi sunma.

Core Web Vitals olan LCP, INP, CLS'yi yardımcı FCP, TTFB, TBT ve Speed Index'ten ayır. Laboratuvar, saha ve tahmini tasarrufu ayrı yaz. Etkileşim ölçmeden INP sonucu üretme; tek reload'u soğuk önbellek veya gerçek kullanıcı değerlendirmesi sayma.

Ağ, trace ve ilgili koddan kök nedeni doğrula. Bir yüklemede görünmeyen kaynağı tüm site için kullanılmıyor ilan etme. Önceliği gözlenen etki, güven ve riskle belirle; aracın 0 ms tahminini mutlak yararsızlık kanıtı sayma. Her kaynağa preload/defer ekleme.

Düzeltme istenmişse ilgili değişikliği yap, karşılaştırılabilir koşulda yeniden ölç. Erişilebilirlik ve tüm repo analizini her hız görevine zorunlu ekleme. Teslimde bulgu, ölçüm koşulu, önerilen/uygulanan değişiklik ve kalan belirsizlik yeterlidir.
