# Yapay zekâ bileşenleri
ChatGPT, Grok ve Grokbot kullanıcı tarafından mevcut araçlar olarak bildirildi ve OPERASYON kapsamına alındı. Codex mevcut kurulum ve geliştirme çalışmalarını yürütmektedir. Araçların hesap, sürüm, bağlantı ve otomasyon yetenekleri henüz envanterlenmemiştir.

| Bileşen | Başlangıç rol taslağı | Bağlantı durumu |
|---|---|---|
| ChatGPT | Şirket planları, süreç dokümanları, analiz ve karar hazırlığı | Operasyon entegrasyonu doğrulanmadı |
| Grok | Araştırma ve analiz görevleri, alternatif değerlendirmeler | Operasyon entegrasyonu doğrulanmadı |
| Grokbot | Tanımı ve mevcut işlevleri netleşince görev / bildirim / otomasyon rolü belirleme | Ürün kimliği ve erişim yöntemi belirlenecek |
| Codex | Çalışma ağacı, skill, yazılım ve entegrasyon geliştirme | Yerel klasör ve GitHub akışı kurulu |

Roller başlangıç taslağıdır; araç yeteneği veya erişimi varsayılmaz. Grokbot, adı benzer bir ürünle kendiliğinden eşleştirilmez.

## Ortak görev ve sonuç düzeni
Görev kaydı: iş kimliği, birim, amaç, iş sahibi, atanmış araç, izin verilen kapsam, girdi referansları, veri erişim sınırı, beklenen çıktı ve kabul ölçütü.
Sonuç kaydı: aynı iş kimliği, çıktı konumu, kaynak ve tarih, varsayımlar, doğrulama sonucu, açık konu ve sonraki sorumlu.
Bir işin tek sorumlu sahibi olur. Araçların farklı sonuçları otomatik olarak birbirinin üzerine yazılmaz; kaynaklarıyla birlikte karar kaydında değerlendirilir.
Sohbet içindeki sonuç ilgili iş kaydına bağlanmadan tamamlanmış şirket işi sayılmaz. Canlı işlemlerde hedef sistemin sonucu doğrulanır.

## Kurulum sırası
1. ChatGPT, Grok ve Grokbot için hesap sahibi, kullanım biçimi ve mevcut işlevleri envanterle.
2. Bir şirket içi örnek işte ortak görev / sonuç formatını manuel devirle doğrula.
3. Mevcut API veya diğer bağlantı seçeneklerini gerçek ürün belgeleri üzerinden incele.
4. Uygun bağlantıları yetki kapsamına göre kur; mükerrer işlem ve başarısız devir senaryolarını dene.
5. Başarılı pilotu birimlere genişlet; süre, hata ve tekrar iş oranını takip et.

## Kullanılabilir çalışma paketleri
[Görev şablonu](GOREV_SABLONU.md), [devir şablonu](DEVIR_SABLONU.md) ve [anonim pilot tarifi](PILOT_SENARYOSU.md) hazırdır. Araç atamaları [sistem envanterindeki](../00_YONETIM/kayitlar/sistemler.json) bağlantı durumuna göre yapılır. Kaynağı bu araçlar olsa bile ortak işin durumu merkezi iş kaydında tutulur.

## Agentin çalışmaya başlaması
Her araç için [başlangıç rehberi](AGENT_BASLANGIC.md), [görev yönlendirme tablosu](GOREV_YONLENDIRME.md) ve [kopyalanabilir giriş metni](AGENT_GIRIS_PROMPTU.md) vardır. Erişim biçimi doğrulanır; görev kapsamı belirlenir; yalnız ilgili kaynaklar okunur.
