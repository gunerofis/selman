---
name: auth-and-permissions
description: Kimlik doğrulama, oturum, rol, izin, sahiplik veya yetkisiz erişim değişikliklerini tasarlar ve doğrular. Yalnız giriş ekranının görsel düzenlemesinde kullanma. Use when the user runs /auth-and-permissions.
---

# Auth and Permissions

Kimlik doğrulama ile yetkilendirmeyi ayrı ele al; güvenlik kararını yalnız arayüze bırakma.

## Girdiler

- Kullanıcı/servis aktörleri, roller, kaynaklar ve izin matrisi
- Mevcut auth sağlayıcısı, session/token yaşam döngüsü ve korunan route/API’ler
- Beklenen izin değişikliği ve geriye uyumluluk ihtiyacı

## Akış

1. Mevcut giriş, çıkış, parola/kurtarma, session yenileme ve authorization kontrol noktalarını bul.
2. Her kaynak için izin, sahiplik ve tenant sınırını açık bir matrisle tanımla; belirsizlikte erişimi varsayılan olarak reddet.
3. Kontrolleri güvenilir sunucu sınırında uygula. UI gizleme yalnız kullanılabilirlik katmanıdır.
4. Cookie, CSRF, CORS, token saklama/rotasyon/iptal, açık yönlendirme, brute force ve kullanıcı adı keşfi risklerini kullanılan modele göre incele.
5. İzin verilen, reddedilen, süresi dolmuş, iptal edilmiş ve başka kullanıcı/tenant kaynağına erişim senaryolarını test et.

## Değişmezler

- Auth sağlayıcısını veya parola politikasını kullanıcı istemeden değiştirme.
- Secret, token, session ID veya kişisel veriyi loglama ya da fixture içine gerçek değerle koyma.
- Admin veya test bypass’ını production kodunda açık bırakma.
- Production kullanıcı/rol verisini açık izin olmadan değiştirme.

## Çıktı ve tamamlanma

Değişen izin matrisi, uygulanan kontrol noktaları, test edilen olumlu/olumsuz senaryolar ve kalan riskleri raporla. Tamamlanma için doğrudan API erişiminin de UI ile aynı izinleri uyguladığı kanıtlanmalıdır.
