# 10 Yayın ve bakım

Amaç: Sürümün tekrarlanabilir teslimini, kayıt uyumunu ve yayın sonrası takibini hazırlamak.

## Çalışma sırası

Vite build/deploy; Pro Git; Android vitals. Yerelleştirme için Intl ve W3C. Gerçek çevrimiçi ihtiyaç onaylanırsa Nakama belgeleri.

## Uygulama

1. Sürüm dosyalarını, sürüm notunu ve eski kayıt uyumluluğunu tek teslim kaydına bağla.
2. Türkçe karakter, sayı, uzun metin ve farklı ekran boylarının davranışını ele al; metni görsele gömmeyi azalt.
3. Hata ve çökme takibinde gerekli olayı, kişisel veri sınırını ve tekrar üretme adımını tanımla.
4. Etkinlik tarihleri, günlük haklar ve ödül tekrarını içerik güncellemelerinde kontrol et; geri dönüş sürümünü koru.
5. Gerçek hesap/sıralama/lonca seçilirse kimlik, sunucu yetkisi, kayıt çatışması ve yetkili ödül işlemlerini ayrıca tasarla.

## Bitiş ölçütü

Bir sürümün kaynağı ve çıktısı eşleşir; geri dönüş ve kayıt geçişi bellidir. Yayından sonra gerçek hata verisi izlenebilir.

## Kaynaklar

- [K61 — Vite Production build](https://vite.dev/guide/build): Üretim çıktısı, asset yolları ve derleme ayarları.
- [K62 — Vite Static deployment](https://vite.dev/guide/static-deploy): Web sürümü dağıtımı ve preview sınırları.
- [K63 — Pro Git](https://git-scm.com/book/en/v2): Sürüm kontrolü, değişiklik geçmişi ve sürüm işaretleri.
- [K64 — GitHub Actions Node.js](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs): Gerekirse otomatik kontrol ve derleme; şu an kurulmadı.
- [K65 — Android vitals](https://developer.android.com/topic/performance/vitals): Yayın sonrası çökme, ANR, performans ve kalite takibi.
- [K66 — MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat): Yerelleştirilmiş sayı ve para gösterimi; oyun bakiyesi tek kaynaktan okunur.
- [K67 — W3C Internationalization quick tips](https://www.w3.org/International/quicktips/): Karakter kodlaması, metin, dil ve yerelleştirme temelleri.
- [K68 — Nakama Documentation](https://heroiclabs.com/docs/nakama/): Gerçek çevrimiçi hesap, sıralama veya lonca kararı verilirse sunucu seçeneği; mevcut NPC sistemine zorunlu değil.

## Kullanıcı özeti

Yerel NPC lonca/sıralama çevrimiçi altyapı kanıtı değildir. CI, sunucu, telemetri veya yayın servisi kurulmadı.

