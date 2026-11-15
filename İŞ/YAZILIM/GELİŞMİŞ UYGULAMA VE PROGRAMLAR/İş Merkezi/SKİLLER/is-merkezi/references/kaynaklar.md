# Kaynaklar — 30.10.2026

Bu belge eğitim özetidir; bir sertifika veya eğitim tamamlama iddiası değildir. Resmî sayfalar webden okundu. İlk Türkçe hedefli çıkarım bazı sayfalarda bilgi bulamadı; React, MDN ve GitHub için sayfa metni ayrıca okundu.

| Kaynak | Doğrulanan ilke | İş Merkezi’ne uygulanışı |
|---|---|---|
| [React: State structure](https://react.dev/learn/choosing-the-state-structure) | Yinelenen ve türetilebilen durum saklamak senkron hatası doğurur. | Sayaç ve liste aynı kayıt/durumdan türetilir. |
| [Carbon: Data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines) | Tablo eylemleri hiyerarşik; sayfalama veri kümesini bölerek sunar. | Kısa satır, satırda tek açma eylemi; gerçek görünen satır aralığı. |
| [GOV.UK: Button](https://design-system.service.gov.uk/components/button/) | Birincil eylemi belirgin tut; gereksiz ikincil eylemleri azalt. | Birincil, ikincil ve tehlikeli düğme varyantları. |
| [GOV.UK: Tabs](https://design-system.service.gov.uk/components/tabs/) | Açık etiket ve kullanıcı ihtiyacına göre sıra; karşılaştırılması gereken içerikleri ayırma. | İşler ilk; aynı göreve ait kontroller aynı yüzeyde. |
| [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) | Biçim dil/yerel ayar ve saat dilimi seçeneklerine bağlıdır. | tr-TR ve Europe/Istanbul açıkça verilir. |
| [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) | Öğenin içerik/sınır kutusu değişimleri izlenebilir. | Satır kapasitesi gerçek kullanılabilir yüksekliğe göre ölçülür. |
| [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Yakınlaştırmada içerik ve işlev kaybolmamalıdır. | Normal masaüstünde sayfalama; dar/yakınlaştırılmış ekranda kesme yerine erişilebilir taşma. |
| [GitHub: Sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues) | Alt işler ana iş ilişkisini koruyarak görev parçalarını izletir. | En fazla ana iş + bir alt iş katmanı kullanıcı kararıdır. |

## Kaynak ile kullanıcı kararının sınırı

GitHub’ın kapanış davranışı bu uygulamanın zorunlu kuralı değildir. Açık alt iş varken kapanışı engellemek kullanıcının açık isteğidir. Ekranı kaydırmadan doldurma, açılır menüleri kaldırma, Instagram gezinmesini iki seviyeye indirme ve şablon üst barını gizleme de kullanıcı kararlarıdır. W3C dar ekranda kaydırmayı bütünüyle yasaklamaz; içeriği kırpmak erişilebilir çözüm değildir.
