# Ürün duvarı konsept görselleri

Ürün duvarı 20 model ailesi ve her aile için Krem, Kahve, Bordo, Taba ve Siyah olmak üzere beş görsel varyant kullanır.

- Mevcut altı model ailesi canlı katalogdaki 30 gerçek ürün kaydına ve kendi ürün sayfalarına bağlıdır.
- Yeni 14 model ailesi tasarım çalışmasıdır; fiyat, stok veya satın alma bağlantısı taşımaz ve arayüzde **Konsept · Yakında** olarak işaretlenir.
- Konsept görseller yapay zekâ ile, açık nötr fonda aynı ürün tasarımının beş malzeme rengi korunacak şekilde üretilmiştir.
- Renk seçimi tema veya arka plan rengini değiştirmez; CSS filtresi uygulamaz. Her modelin ilgili görsel dosyasını çağırır.
- Konseptler üretim, ölçü, malzeme, stok ve fiyat doğrulanmadan satışa açılmamalıdır.

Kaynak görseller 4×4 temas sayfalarından `scripts/crop-concept-sheets.mjs` ile 720×720 WebP varlıklarına ayrılır. Çıktılar `public/product-concepts` dizinindedir.
