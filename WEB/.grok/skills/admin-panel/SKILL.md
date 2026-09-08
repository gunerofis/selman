---
name: admin-panel
description: Yönetim paneli, operasyon ekranı, yetkili CRUD, toplu işlem veya denetim arayüzü geliştirir ve güvenliğini doğrular. Halka açık pazarlama sayfalarında kullanma. Use when the user runs /admin-panel.
---

# Admin Panel

Operasyonel hızı artırırken yüksek etkili işlemleri görünür, yetkili, izlenebilir ve geri alınabilir tut.

## Girdiler

- Admin görevleri, kullanıcı rolleri ve yönetilen kaynaklar
- Mevcut panel route’ları, component sistemi, API’ler ve denetim kaydı ihtiyacı
- Liste hacmi, filtreler, toplu işlemler ve başarı ölçütleri

## Akış

1. En sık ve en riskli yönetim görevlerini, veri kaynaklarını ve mevcut izin kontrollerini çıkar.
2. Liste/detay/düzenleme akışını mevcut tasarım sistemiyle kur; loading, empty, error, conflict ve partial-success durumlarını kapsa.
3. Authorization, server-side validation, CSRF ve kaynak sahipliği kontrollerini `auth-and-permissions` ile uyumlu uygula.
4. Silme, yayınlama, iade, rol değiştirme ve toplu işlemde etkiyi açık göster; uygun doğrulama, idempotency ve geri alma yolu sağla.
5. Büyük listelerde pagination, arama ve filtrelemeyi veri kaynağında uygula; klavye, responsive görünüm ve 200% zoom kontrolü yap.
6. Kim-ne-zaman-ne-yaptı bilgisini hassas veri sızdırmadan denetim kaydına bağla.

## Değişmezler

- Yalnız route’u gizlemeyi güvenlik sayma.
- Production verisinde gerçek toplu işlem veya silme testini açık izin olmadan çalıştırma.
- Public cache veya indekslenebilir çıktı üzerinden admin verisi sızdırma.

## Çıktı ve tamamlanma

Ekran/route değişiklikleri, izin matrisi, kritik işlem korumaları ve test edilen durumları raporla. Yetkisiz erişim, hata durumu ve yüksek etkili işlemin yeniden gönderimi doğrulanmadan tamamlandı deme.
