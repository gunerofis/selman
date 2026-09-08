---
name: 24-cookie-consent-privacy
description: Cookie banner, consent manager, analytics/reklam izni, tercih saklama veya gizlilik davranışını geliştirir ve doğrular. Cookie veya tracking içermeyen sıradan UI değişikliğinde kullanma.
---

# Cookie Consent and Privacy

İzin verilmeden önce isteğe bağlı izleyicilerin çalışmasını önle ve tercihi sonradan değiştirilebilir tut.

## Girdiler

- Hedef ülkeler/diller, geçerli gizlilik politikası ve hukuk ekibinin sınıflandırması
- Cookie/tag envanteri, consent platformu ve analytics/reklam entegrasyonları
- Tercih kategorileri, saklama süresi ve kullanıcı deneyimi gereksinimleri

## Akış

1. İlk sayfa yüklemesinde oluşan cookie, storage, pixel ve ağ isteklerini envanterle; sahip, amaç ve süreyi kaydet.
2. Zorunlu ile analytics/reklam/kişiselleştirme kategorilerini onaylı politika kaynağına göre ayır; hukuki sınıflandırma uydurma.
3. İsteğe bağlı tag’leri consent kararından önce blokla; varsayılan, kabul, reddet, kısmi izin ve geri çekme durumlarını uygula.
4. Tercih kaydını sürüm/timestamp ile güvenli tut; banner kapandıktan sonra ayarlara yeniden erişim sağla.
5. Klavye, focus, screen reader, mobil, TR/EN/AR ve RTL davranışını test et; kabulü reddetmeye göre yanıltıcı biçimde öne çıkarma.
6. Consent değişiminde tag’lerin yüklenme/durdurma ve veri silme kapasitesini gerçek network/storage çıktısıyla doğrula.

## Değişmezler

- Bu teknik kontrolü tek başına hukuki uyumluluk garantisi olarak sunma; güncel hukuk yorumu gerekiyorsa resmî kaynak ve yetkili değerlendirme iste.
- İzin verilmeden kişisel veri veya isteğe bağlı event gönderme.
- Mevcut consent durumunu debug/production ortamları arasında karıştırma.

## Çıktı ve tamamlanma

Cookie/tag envanteri, kategori eşlemesi, state akışı ve network/storage testleri raporlanır. İlk yüklemede izin öncesi isteğe bağlı tag çalışmadığı kanıtlanmalıdır.
