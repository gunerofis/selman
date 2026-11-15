---
name: gof-shopify
description: Shopify tema/Liquid, section, snippet, ürün-varyant, kişiselleştirme, sepet veya temada görünmeyen bileşen işleri için kullan. Shopify dışı projelerde ve platform bilgisi gerektirmeyen küçük CSS/metin düzeltmelerinde kullanma.
---

# Shopify tema geliştirme

Önce mağaza, çalışma teması ve hedef template/bileşeni ayırt et; yalnız gerekli dosyaları ve çağıran yeri incele. Kullanıcı kaynak kod verdiğinde onu kullan; canlı tema ile yerel dosyayı aynı kabul etme. Kodun nereye ekleneceğini bilmeden ikinci bir global script üretme.

Mevcut Liquid ve tema mimarisini koru. Section, block, snippet veya asset seçimini gerçek kullanım belirlesin. Yeterli native çözüm varsa framework/uygulama ekleme. CSS ve JS'yi bileşene kapsa; aynı bileşenin iki örneği veya yeniden başlatılması çakışmasın. Tema ayarları ve kullanıcı içeriğini sıfırlama.

Section ekleme, template'e bağlama veya görünürlük hatasında [section ve görünürlük](references/section-ve-gorunurluk.md); varyant, özelleştirme veya sepet değişikliğinde [ürün ve kişiselleştirme](references/urun-kisisellestirme.md) rehberini oku. İki rehberi rutin olarak birlikte yükleme.

Gerçek ürün verileri, linkler ve mevcut yerelleştirmeyi kullan. Ürün id'si, fiyat, parça sayısı, stok ve malzemeyi uydurma. Kullanıcının istediği kod/karakter sınırını gerçekten ölç; belirli bir eski sınırı tüm işlere uygulama.

İlgili Liquid/JSON/JS kontrolünü mevcut araçlarla yap; Theme Check varsa uygun kapsamda kullan. Görünürlük değiştiyse hedef template'te ve mobilde doğrula. Araç yoksa kurulumda ısrar etmek yerine yapılabilen kontrolü ve eksik doğrulamayı ayır.

Kod tesliminde uygun olduğunda tek parça tamamlanmış section/snippet ve gereken tek bağlantı adımını ver. Projeyi düzenlediğinde kısa değişiklik özeti yeterlidir. Canlı temayı yayınlama, uygulama yükleme ve mağaza verisi değiştirme izinlerini ayrıca koru.
