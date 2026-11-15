# Şirketin tek merkezden yönetimi
Ana amaç: şirketin tüm organlarının ortak bir yönetim merkezinden izlenmesi, koordine edilmesi ve yetkili işlemlerinin yürütülmesi. Web siteleri ve satış kanalları bu yapının bileşenleridir.
Bu belge hedef modeldir; şirketin mevcut departman yapısının doğrulandığı anlamına gelmez.

| Yönetim alanı | Merkezi kapsam | Çalışma alanı |
|---|---|---|
| Üst yönetim | Hedef, öncelik, karar, sorumlu ve performans | 00_YONETIM |
| Web ve dijital satış | Dört SÜMEN, bir SWEB, kanal siparişleri | 01_WEB_SITELERI |
| Yurt dışı satış | Ülke, kanal, yabancı dilde site ve teslimat | 02_YURT_DISI |
| Ürün ve depo | Katalog, varyant, stok ve rezervasyon | 03_URUN_STOK |
| Finans ve muhasebe | Tahsilat, ödeme, gider, belge ve mutabakat | 04_MUHASEBE |
| Lojistik | Paket, kargo, teslimat ve iade | 05_KARGO |
| Toptan satış | Müşteri, teklif, vade ve toplu sipariş | 06_TOPTAN_SATIS |
| Teknoloji ve veri | Entegrasyon, erişim, kayıt ve yedekleme | 07_ALTYAPI |
| Yapay zekâ koordinasyonu | ChatGPT, Grok, Grokbot ve Codex görevleri | 11_YAPAY_ZEKA |
| Satın alma ve üretim | Tedarikçi, ihtiyaç, satın alma, üretim ve kalite | 12_SATIN_ALMA_URETIM |
| Müşteri ilişkileri | Talep, destek, şikâyet ve çözüm | 13_MUSTERI_ILISKILERI |
| Pazarlama | Kampanya, içerik, marka ve sonuç takibi | 14_PAZARLAMA |
| İnsan kaynakları ve idari işler | Personel süreçleri, görev ve şirket içi ihtiyaçlar | 15_INSAN_KAYNAKLARI_IDARI |

## Ortak yönetim ilkesi
Her iş için benzersiz iş kimliği, bağlı birim, iş sahibi, ilgili kayıt, durum, hedef tarih ve sonuç kanıtı tutulur. Birimler arası devirde aynı iş kimliği korunur; alt işler ana işe bağlanır.
Merkezde iş kuyruğu, karar bekleyen konular, süreç istisnaları, birim göstergeleri ve işlem geçmişi görünür olmalıdır. Bir ekranın görünmesi bağlantılı sistemde işlemin gerçekleştiğini kanıtlamaz; sonuç kaydı gerekir.
Her veri türünün yetkili ana kaynağı belirlenir. Ortak yönetim, tüm verilerin GitHub'a veya yapay zekâ sohbetlerine kopyalanması anlamına gelmez. Personel, müşteri ve finans kayıtları uygun erişimli sistemlerde tutulur; bu depo plan, yapılandırma ve anonim örnekler içindir.

## Birimler arası örnek
Satış talebi → teklif → stok / üretim ihtiyacı → satın alma → üretim / kalite → sevkiyat → tahsilat → müşteri desteği → yönetim raporu.
Her geçişte gönderen birim, alıcı sorumlu, gerekli veri ve kabul ölçütü belirlenir.

## Tamamlanan ortak yapı
Sözleşme / yükümlülük takibi 16_SOZLESME_UYUM; varlık / bakım 17_VARLIK_BAKIM alanındadır. Bu kapsamlar gerçek departman varlığı iddiası değildir.
[Görev ve devir](GOREV_VE_DEVIR.md), [rol / yetki](ROL_VE_YETKI.md), [birim kayıtları](kayitlar/birimler.json) ve [eksik bilgi kaydı](EKSIK_BILGI_KAYDI.md) ortak yönetim standardını oluşturur.
