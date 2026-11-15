# DOKU — galeri ve teklif yolu geliştirmesi

30 Eylül 2026. Kullanıcı hero çalışmasını bırakarak sitenin geliştirilmesini istedi.

## Uygulananlar

- Galeri görselleri tam içerik genişliğinde, 1 px aralıkla, 850 px üstünde 5 ve altındaki genişliklerde 2 sütun gösterilir. Kart adları/kodları ekran okuyucu için korunur. Görsellerin responsive boyutları yeni sütunlarla eşleşir.
- Arama, mekân ve tema filtreleri doğal `details` alanında açılır; seçili filtreler ve sonuç adedi sürekli erişilebilir. Türkçe arama, kombine filtreler, derin bağlantı, boş sonuç ve temizleme korunur. Tam duvar/bölgesel etiketleri de aranabilir.
- Galeriden tasarıma giderken yalnız aynı sekmenin filtre URL'si, görsel çapası ve tasarım kimliği sessionStorage içinde tutulur. Tasarımda galeri dönüş bağlantısı aynı filtreye ve görsele gider. Dış adresler reddedilir; depolama engelliyse normal galeri bağlantısı çalışır.
- Ana sayfa, iletişim ve tasarım formlarına isteğe bağlı tam duvar/bölgesel uygulama seçimi eklendi. Seçim hazırlanmış WhatsApp mesajına taşınır; tasarım görselini değiştirirken korunur.
- Var olan SSS'ye kullanıcı tarafından doğrulanan kaplama ve uygulama bilgisi eklendi. Yeni ana sayfa bölümü yok; hero ve ana sayfanın 12 görseli korunur.

## Doğrulama

- `npm --prefix tools run build`: 64 yayındaki tasarım, 8 tema, 5 gizli.
- `npm --prefix tools run check`: 83 HTML ve 81 sitemap adresi geçti.
- Yerel tarayıcıda 145 işlev kontrolü ve 7 WCAG A/AA otomatik denetimi geçti. 320, 390, 850, 851, 1440 px genişlikler; sütun sayısı, tam genişlik, 1 px derz, mobil taşma, filtre birleştirme, boş sonuç, klavye odağı, galeri dönüşü, uygulama mesajları, mevcut seçici, dış adres ve depolama engeli durumları kontrol edildi.
- Mobil ve masaüstü galeri ekran görüntüleri incelendi. Kontrol çıktısı yerelde `dok/work/site-improve-20260930/qa.json`; test `dok/work/site-improve-qa.cjs`.
- Gerçek WhatsApp gönderimi yapılmadı; doğrulanan sonuç hazırlanmış mesaj içeriğidir.
