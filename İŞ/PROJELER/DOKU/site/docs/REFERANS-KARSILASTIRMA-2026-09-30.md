# DOKU — referans karşılaştırması ve uygulama

İnceleme tarihi: 30 Eylül 2026. Resmî siteler 1440 ve 390 px genişliklerde açıldı; açılış ve takip eden görsel bölümler incelendi. DOKU'nun yayımlanmış 27. sürümü aynı genişliklerde karşılaştırıldı.

## Neden bu üç site?

| Site | Seçim dayanağı | İncelenen güçlü yön |
| --- | --- | --- |
| [Moooi](https://www.moooi.com/en) | İç mekân ürünleri satan markanın dijital deneyimi; [Paper Play, 2023 Webby Best Visual Design kazananı](https://winners.webbyawards.com/2023/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/239484/moooi-paper-play). Ödül tarihî deneyime aittir; bugünkü ana sayfa ayrıca incelendi. | Büyük ürün sahnesi, kısa anlatım, görsel hikâyeden koleksiyonlara geçiş. |
| [Arte](https://www.arte-international.com/en) | DOKU ile aynı duvar yüzeyi alanı; ürünler, mekânlar, koleksiyonlar ve projeler ayrı keşif yolları sunuyor. Web arayüzü seçimim kendi inceleme değerlendirmeme dayanıyor. | Geniş kompozisyonlar, koleksiyon içeriğinin belirgin gruplandırılması, mobilde görsel ölçeğin korunması. |
| [Wall&decò](https://www.wallanddeco.com/en-us/) | Ölçüye özel duvar tasarımı ve kişiselleştirme modeli DOKU'nun müşteri yoluyla ilgili. Web arayüzü seçimim kendi inceleme değerlendirmeme dayanıyor. | Koleksiyon → tema → tasarım ilişkisi; [koleksiyon sayfasındaki](https://www.wallanddeco.com/en-us/catalog/collections/contemporary-wallpaper-collection/) görsel keşif; özel tasarım ve proje anlatımı. |

Bu karşılaştırma görülen arayüz ve gezinme yapısıyla sınırlıdır; sitelerin satış dönüşümü veya trafik başarısı ölçülmedi. Kaynaklardan görsel, metin, kod ya da marka biçimi alınmadı.

## DOKU ile karşılaştırma → uygulama

| DOKU'daki durum | Uygulanan karar |
| --- | --- |
| Açılıştaki iki eşit alan, yatay duvar kompozisyonunun kenarlarını dar kadrajda kesiyordu. | Başlık ve teklif açıklaması üstte; altta geniş, tek panoramik sahne. Mobilde görsel oranı yeniden düzenlendi. Ön yükleme ve responsive görsel boyutu yeni yerleşimle eşleştirildi. |
| Mobil seçkide dört tasarımın tamamı küçük ve dar görsel yüzeylerdi. | İlk ve son görsel tam genişlik, ortadaki ikisi yan yana. Fotoğraf sayısı değişmeden ölçek farkı oluşturuldu. |
| Seçki yalnız tekil ürünlere götürüyordu. | Seçkinin sonunda ev, çocuk odası ve işletme koleksiyonlarına doğrudan bağlantılar; görsel arşivine devam yolu. |
| Fotoğraf → çizim → uygulama örneği etkileşimli seçiciden sonra geliyordu. | Mevcut örnek seçkiden hemen sonra taşındı; DOKU'nun kişiye özel işi daha erken gösterildi. |
| Tema kapakları masaüstünde dört küçük kare görseldi. | İki geniş kolon ve yatay kadraj. Tema kapaklarının görsel yükleme boyutları güncellendi. Mobil iki kolon korundu. |

Görsel tez: **DOKU'nun duvarı geniş bir kompozisyon olarak görünür; sakin tipografi ve kısa yollar müşteriyi kendi mekânına uygun tasarıma taşır.** Pastel palet, Manrope/DM Sans, 12 ana sayfa görseli, mevcut katalog ve WhatsApp teklif yolu korundu. Yeni ana sayfa bölümü eklenmedi.

## Kontroller

- Üretim ve statik denetim geçti: 81 HTML, 79 sitemap adresi, 62 yayındaki tasarım.
- Bu değişiklik için 65 kontrol geçti: ana sayfa, temalar ve özel tasarım sayfaları; 320/390/768/1024/1440/1920 px genişlikler; taşma, tek ana başlık, 12 görsel, bölüm sırası, geniş açılış, koleksiyon bağlantıları ve teklif geçişleri. Ana sayfa ve temalar %200 yazıda taşmadı.
- Ana sayfa, temalar ve özel tasarım için 390/1440 px'de 6 axe A/AA taraması ihlalsiz geçti. Bu otomatik kapsam tam erişilebilirlik sertifikası değildir.
- Önceki 50 etkileşim kontrolü tekrar geçti. Önceki 66 görünüm matrisi ve 22 axe sonucu bu turda tekrar çalıştırılmadı.
- Testler yerel önizlemede yapıldı; WhatsApp hedefi testte karşılandı, gerçek mesaj gönderilmedi.

Kaynak: `src/index.html`, `src/doku.css`, `src/tasarim.css`, `tools/build.mjs`. Görsel inceleme ve kontrol dosyaları görev çalışma alanında `work/references-20260930/` altında tutuldu.
