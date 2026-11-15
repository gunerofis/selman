# 09 Mağaza ödeme ve gizlilik

Amaç: Mağaza yayınına ve seçilirse gerçek ödeme/reklama ait eksikleri hazırlamak.

## Çalışma sırası

Google Play test, içerik ve Data safety belgeleri. Billing ve UMP yalnız bu gelir seçenekleri seçilirse okunur.

## Uygulama

1. Mağaza hesap türünü ve gerekli test yolunu gerçek hesaptan doğrula. Hedef yaş ve içerik derecelendirmesini oyunun gerçek içeriğiyle eşleştir.
2. Kullanılan SDK'ların topladığı/paylaştığı veriyi çıkar; beyanı ve gizlilik metnini gerçek davranıştan üret.
3. Ödeme seçilirse satın alma, iptal, bekleyen işlem, iade ve tek kez hak verme akışını; doğrulamayı ve yeniden denemeyi tasarla.
4. Satın alınan rastgele ödüller varsa güncel olasılık açıklama kuralını incele. Şans ekranlarının mağaza değerlendirmesini ayrıca ele al.
5. Mağaza simgesi, ekran görüntüsü ve açıklaması için güncel teknik şartları doğrula; çalışmayan özelliği varmış gibi tanıtma.

## Bitiş ölçütü

Yayın için gereken beyanlar ve görseller gerçek ürünle uyumludur; yerel altın/elmas işlemi gerçek ödeme altyapısı sayılmaz.

## Kaynaklar

- [K53 — Google Play testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en): Hesap türüne göre kapalı test ve üretim erişimi; hesap bilgileri bilinmiyor.
- [K54 — Google Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en): Kullanılan SDK ve veriye göre veri güvenliği beyanı.
- [K55 — Google Play content ratings](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en): İçerik derecelendirmesi ve hedef kitle soruları.
- [K56 — Google Play store listing assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en): Uygulama simgesi, ekran görüntüleri ve tanıtım görselleri.
- [K57 — Google Play Billing integration](https://developer.android.com/google/play/billing/integrate): Gerçek para ile dijital ürün satışı seçilirse satın alma akışı.
- [K58 — Google Play Billing security](https://developer.android.com/google/play/billing/security): Satın alma doğrulaması, yeniden deneme ve hak verme güvenliği.
- [K59 — Google Play Developer Policy](https://support.google.com/googleplay/android-developer/answer/18265346?hl=en): Ödemeler, rastgele ödüller ve yayın politikaları; yayında yeniden kontrol edilir.
- [K60 — Google Mobile Ads UMP](https://developers.google.com/admob/android/privacy): Reklam SDK'sı seçilirse kullanıcı gizlilik seçenekleri ve izin akışı.

## Kullanıcı özeti

Hesap, yaş grubu, pazar ve gelir modeli bilinmiyor. Satın alma, reklam kurulumu veya yayın yapılmadı.

