---
name: is-merkezi
description: İş Merkezi yerel uygulamasını geliştir, sadeleştir ve doğrula; ana iş–alt iş takibini, sipariş bağlantılarını, ortak tarih ve Türkçe arayüzü koru. Site taşıma ve reklam kampanyası uygulaması için kullanma.
---

# İş Merkezi

## Başlangıç

Önce Desktop/AGENTS.md, Desktop/HARİTA.md ve programın Kurallar.md ile AGENTS.md dosyalarını oku. Program kökü `C:/Users/Guner Office/Desktop/selman/Programlar/Program Dosyaları/İş Merkezi`.

Kaynağı okumadan mevcut işlev, bağlantı, sayı veya izin hakkında karar verme. Kullanıcı sayısı örneği kabul ölçütüdür; bugünkü kayıt sayısını sabitleme. Kaynak tarihi ile bugünkü kontrolü ayır. Kaynağı olmayan alanı bilinmiyor bırak.

Bu paket 30.10.2026 kullanıcı talepleri ve [birincil web kaynakları](references/kaynaklar.md) temelinde hazırlandı. Web ilkeleri ile bu uygulamaya özel kararlar aynı şey değildir.

## İş seçimi

- Arayüz ve gezinme: [arayüz](references/arayuz.md).
- İş kaydı, alt iş ve kullanıcıdan beklenen: [iş akışı](references/is-akisi.md).
- API, bağlantı, dosya açma ve derleme: [uygulama](references/uygulama.md).
- Kontrol ve teslim: [doğrulama](references/dogrulama.md).
- Talebin tamamını kontrol etmek için [kabul listesi](references/kabul.md).

## Değişmez çalışma düzeni

1. Kullanıcının verdiği görev bir ana iştir. Başlık ve kısa açıklama yeterlidir.
2. Görev sırasında bulunan işler aynı ana işin altında tutulur. Yapılan küçük düzeltme tek cümleyle bitmiş alt işe yazılır.
3. Karar, yetki veya bilgi gereken alt iş açık kalır. Kullanıcıya ne gerektiği ilk bakışta anlaşılır.
4. Açık alt iş varken ana iş tamamlanamaz. Bütün alt işler bittiğinde ve görev doğrulandığında ana iş kapatılır.
5. Listede tek durum gösterilir. Sayaç, liste, kontrol sonucu ve kapanış aynı durum işlevini kullanır.
6. Uzun rapor Ayrıntılar içindedir; kartta açıkça yazılmış kısa özet gösterilir. Kısaltma kelime ortasında yapılamaz.
7. Tekrarlayan sekme, düğme ve ayrı pencere oluşturma. Mevcut yüzeyi güncelle.
8. İş kayıtlarına yalnız yerel servis API’siyle yaz. SQLite/JSON çalışma kaydını elle değiştirme. Sürüm çakışmasında metni koru.
9. Kullanıcı kararı ve uygulama yetkisini koru. Sade arayüz gerekçesiyle sunucu onayını, CSRF’yi veya yerel erişim sınırını kaldırma.
10. Yalnız istenen işi uygula. Güner taşıma, canlı mağaza, reklam, müşteri veya hesap işlemi bu skill’i kullanmakla yetkilendirilmez.

## Teslim

Değişen veri ve işlevleri gerçek API ile; yerleşim, Türkçe metin ve etkileşimleri gerçek ekranda doğrula. Test için gerçek işleri onaylama veya kapatma; ayrı test kaynağı kullan. Uygulanmayan kontrolü geçti diye yazma. Sonuç, kısa kayıt ve varsa gerçek engel yeterlidir.
