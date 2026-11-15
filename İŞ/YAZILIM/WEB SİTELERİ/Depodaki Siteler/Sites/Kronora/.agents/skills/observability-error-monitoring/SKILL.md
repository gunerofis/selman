---
name: observability-error-monitoring
description: Production logları, metrikler, trace, hata izleme, alarm veya kaynak haritası entegrasyonunu tasarlar ve doğrular. Tek seferlik yerel console hatası ayıklamasında kullanma. Use when the user runs /observability-error-monitoring.
---

# Observability and Error Monitoring

Sorunları hassas veri sızdırmadan tespit edilebilir, ilişkilendirilebilir ve eyleme dönüştürülebilir yap.

## Girdiler

- Runtime/servis sınırları, mevcut gözlemlenebilirlik sağlayıcıları ve ortamlar
- Kritik kullanıcı akışları, hata sınıfları, SLO/uyarı ihtiyacı ve veri saklama politikası
- Mevcut correlation/request ID ve deployment sürüm bilgisi

## Akış

1. Mevcut log, metric, trace, frontend/backend hata yakalama ve alarm hattını çıkar; çift enstrümantasyonu bul.
2. Beklenen operasyonel soruyu cevaplayan düşük kardinaliteli sinyalleri seç; her şeyi kaydetmeye çalışma.
3. Yapılandırılmış loglara correlation, servis, sürüm ve güvenli hata sınıfı ekle; PII, secret, token, kart ve içerik gövdesini redakte et.
4. Hata sınırları ve merkezi handler’lar hatayı kullanıcıya anlaşılır gösterirken kök nedeni izlenebilir tutsun; hatayı sessizce yutma.
5. Sampling, kaynak haritası erişimi, environment ayrımı ve release etiketini doğrula.
6. Alarmı eylem, eşik, süre ve sahiplikle bağla; gürültü, tekrar ve alarm fırtınası riskini test ortamında kontrol et.

## Değişmezler

- Açık izin olmadan production alarmı veya veri saklama politikasını değiştirme.
- Gerçek kullanıcı verisini test hatası üretmek için kullanma; production’a kasıtlı hata gönderme.
- Gözlemleme istemcisinin uygulama hatasını veya kritik isteği engellemesine izin verme.

## Çıktı ve tamamlanma

Sinyal envanteri, redaksiyon, correlation akışı, alarm koşulu ve test kanıtı raporlanır. Kontrollü test sinyalinin doğru ortama tekil ulaştığı ve hassas veri içermediği doğrulanmalıdır.
