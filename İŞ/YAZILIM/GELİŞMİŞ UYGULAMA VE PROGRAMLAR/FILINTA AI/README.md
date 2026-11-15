# FILINTA AI · Interface Lab v1.4.1

FILINTA AI için yalnızca frontend çalışan, **backend/API/veritabanı/oturum servisi olmayan** bir UI prototipidir.

## Bu revizyonda

- İşaretlenen üst/yan alanlar ve gereksiz küçük metinler kaldırıldı.
- Sol menü sadeleştirildi; alanlar ayrı sayfalarda korunarak yoğunluk azaltıldı.
- Sayfa üstü gezinme aksiyonları eklendi: **önceki / sonraki / özet kopyala**.
- Boş/dummy butonlar gerçek işlevlere bağlandı: örnek veri yükleme, profil uygulama, yönlendirme, kopyalama ve simülasyon tetikleme.
- Renk paleti daha profesyonel, daha sakin bir koyu tema olacak şekilde güncellendi.

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim paketi:

```bash
npm run build
npm run preview
```

## Notlar

- Sol kenar çubuğunda 18 bağımsız sayfa vardır.
- Model, ağırlık, attention, eğitim ve çıktı değerleri **sentetik/örnektir**.
- Tüm hesaplamalar tarayıcı içindeki JavaScript kodunda çalışır. Gerçek model eğitimi veya model inference işlemi yoktur.
- Uzak API, CDN, harici görsel/font çağrısı ve telemetri bağlantısı yoktur.

Kaynaklar: `src/main.jsx` ve `src/styles.css`.
