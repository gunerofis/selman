# 07 Performans ve test

Amaç: Kritik oyun akışlarını ve gerçek Android performansını yeterli kanıtla kontrol etmek.

## Çalışma sırası

performance-optimization, game-playtest, MDN Canvas optimizasyonu ve DevTools. Test altyapısı için mevcut package.json esas alınır.

## Uygulama

1. Yeni kayıt, kayıt yükleme, savaş/atlama, ödül, eşya kuşanma, satın alma ve yetersiz kaynak için kısa kritik akış listesi hazırla.
2. Ölçüm aşamasında kare süresi, uzun görev, açılış süresi, görsel belleği ve ekran değişiminde sızıntıya bak.
3. Görsel boyutu/atlas önbelleği gibi tek darboğazı ölç; yalnız onu değiştirdikten sonra aynı senaryoyu karşılaştır.
4. Arka plan/geri dönüş, çevrimdışı açılış, dokunma ve ekran oranlarını fiziksel Android üzerinde ele al. Emülasyon fiziksel cihaz sonucu sayılmaz.

## Bitiş ölçütü

Bitiş iddiası ilgili akışın kanıtına dayanır; performans hedefi ölçülen cihazla birlikte kayıtlıdır.

## Kaynaklar

- [K38 — MDN Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas): Çizim tekrarları, katmanlama, ölçekleme ve Canvas optimizasyonu.
- [K39 — Chrome Performance](https://developer.chrome.com/docs/devtools/performance): Kare süresi, ana iş parçacığı ve performans kaydı.
- [K40 — Chrome Memory problems](https://developer.chrome.com/docs/devtools/memory-problems): Bellek sızıntısı, heap ve ayrılan nesneler.
- [K41 — Remote debug Android WebViews](https://developer.chrome.com/docs/devtools/remote-debugging/webviews): Fiziksel Android cihazdaki WebView sorunlarını ayıklama.
- [K42 — Playwright Introduction](https://playwright.dev/docs/intro): Kritik web akışlarını otomatik doğrulama; mevcut hızlı referans aşamasında çalıştırılmaz.
- [K43 — Playwright Emulation](https://playwright.dev/docs/emulation): Viewport ve dokunma emülasyonu; fiziksel cihaz kontrolünün yerine geçmez.
- [K44 — Node.js Test runner](https://nodejs.org/api/test.html): Veri, savaş, kayıt ve ekonomi mantığını arayüzden bağımsız test etme.
- [K45 — Android Game quality](https://developer.android.com/games/guidelines): Android oyun kalite ve cihaz davranışları.

## Kullanıcı özeti

Bu görev kaynak toplama işidir; oyun testi yapılmadı. Hızlı referans aşamasındaki test/derleme yasağı korunur. Sonraki QA aşamasında gereksiz tam tekrar yapılmaz.

