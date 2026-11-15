# DOKU — ön yüz etkileşim geliştirmesi

## Plan ve uygulama

1. Galeride etkin arama, mekân ve tema seçimlerini görünür yap; her birini ayrı kaldır. Klavye odağını ilgili alana döndür.
2. Galeriye geri dönüşte ve yeniden yüklemede URL'deki seçimlerle sonuçları eşleştir. Mevcut history.state ve hash bilgisini koru.
3. Ana sayfa seçicisinin görsel oranını sabitle; beş tasarım arasında yükseklik değişmesin.
4. Ana sayfa seçicisi ve ürünün ana görseli için gecikmiş yüklenme bildirimi, hata metni ve yeniden deneme ekle. Görsel kodu ve teklif bağlamını koru.
5. Teklif formlarında ölçü birimini görünür açıklamayla belirt; not sınırını karakter sayacıyla göster. Alanları isteğe bağlı tut.

## Araştırma

Erişim: 30 Eylül 2026. Yalnız birincil kaynaklar kullanıldı.

- [W3C WAI — Form bildirimleri](https://www.w3.org/WAI/tutorials/forms/notifications/): kısa ve düzeltme yolunu açıklayan bildirimler, alanla ilişkilendirilmiş açıklama. DOKU'da ölçü yardımı ve görsel hata bildirimi uygulandı; harici WhatsApp gönderimi için başarı iddiası eklenmedi.
- [web.dev — Back/forward cache](https://web.dev/articles/bfcache): tarayıcı geri/ileri gezinmesinde sayfa durumunu korur; pageshow ile durum güncellenebilir. DOKU'da galeri URL durumunu ve hazırlanan teklif mesajını pageshow sırasında eşleştirme uygulandı. unload dinleyicisi eklenmedi.
- [MDN — HTMLImageElement.decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode): görsel çözümleme başarısız olabilir. Var olan tam ekran inceleme korunarak sayfa içindeki görseller için load/error tabanlı görünür geri kazanım eklendi.

## Doğrulama

- Üretim ve statik kontrol: 81 HTML, 79 sitemap adresi, 62 tasarım geçti.
- Önceki 50 etkileşim kontrolü yeniden çalıştırıldı ve geçti. Önceki 66 görünüm matrisi tekrar çalıştırılmadı.
- Bu tur için 32 kontrol: filtre kaldırma/odak, üründen geri dönüş, yeniden yükleme, form sayacı, ürün görseli hata/yeniden deneme ve odak dönüşü, teklif bağlamı, beş ana sayfa seçimi ve sabit görsel yüksekliği geçti. Uzun filtre metni %200 yazı büyütmeyle taşmadı.
- Ana sayfa, filtreli galeri, ürün ve iletişim: 320/390/1440 px genişliklerde taşma kontrolü ve 12 axe A/AA taraması geçti. Otomatik tarama tam erişilebilirlik sertifikası değildir.
- Kontrol ortamı yerel önizlemedir. WhatsApp hedefleri yerelde karşılandı; gerçek mesaj gönderilmedi.
