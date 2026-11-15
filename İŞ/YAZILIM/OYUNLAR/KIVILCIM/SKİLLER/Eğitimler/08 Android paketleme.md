# 08 Android paketleme

Amaç: Mevcut web oyunundan dağıtılabilir Android paketine geçişin gereksinimlerini belirlemek.

## Çalışma sırası

Android WebView ve Capacitor Android; mevcut Vite build düzeni. Capacitor burada adaydır, seçilmiş altyapı değildir.

## Uygulama

1. Paketleme kararı verildiğinde applicationId, desteklenen cihazlar, yön, geri düğmesi ve yaşam döngüsünü tanımla.
2. Vite asset yollarını, yerel içerik yüklemesini, ses yeniden başlamasını ve web kaydından uygulama kaydına geçişi ele al.
3. İmzalama anahtarı, versionCode/versionName ve geri alınabilir sürüm çıktısını tanımla; anahtarları bu kütüphaneye koyma.
4. Yayın gününde hedef API, AAB ve varsa yerel bileşenlerin 16 KB uyumluluğunu resmî belgelerden yeniden doğrula.

## Bitiş ölçütü

Seçilmiş Android yapısı ve fiziksel cihazda kayıt/geri dönüş davranışı kanıtlanır; yerel web önizlemesi Android teslimi sayılmaz.

## Kaynaklar

- [K25 — Capacitor Storage](https://capacitorjs.com/docs/guides/storage): Android sarmalayıcı seçilirse kayıt stratejisi ve WebView depolaması.
- [K46 — Capacitor Android](https://capacitorjs.com/docs/android): Web oyununu Android uygulamasına paketleme adayı; henüz teknoloji kararı değil.
- [K47 — Capacitor App](https://capacitorjs.com/docs/apis/app): Yaşam döngüsü, geri düğmesi ve uygulama olayları.
- [K48 — Android WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview): Web içeriğini Android uygulamasında çalıştırmanın resmî temeli.
- [K49 — Android App signing](https://developer.android.com/studio/publish/app-signing): İmzalama anahtarı, sürüm ve Play App Signing.
- [K50 — Android App Bundle](https://developer.android.com/guide/app-bundle): Google Play için uygulama paketleme biçimi.
- [K51 — Android target API policy](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en): Yayın günündeki hedef API şartını doğrulama; sabit sürüm varsayılmaz.
- [K52 — Android 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes): Paketin yerel bileşenleri varsa 16 KB sayfa uyumluluğu.

## Kullanıcı özeti

Android Studio, JDK, SDK veya Capacitor kurulmadı. Gerekli sürümler paketleme kararı ve mevcut ortam görülmeden kesinleştirilmez.

