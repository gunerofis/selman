# İşletim, veri sınırları ve kurtarma
## Veri sınırı
Depoda planlar, skill'ler, kod ve anonim test kayıtları tutulur. Gerçek müşteri, personel, banka hareketi ve özel sözleşme dosyaları yetkili operasyon sisteminde kalır. Anahtarlar güvenli kasadadır. Dosya adı engellemesi içerik incelemesinin yerine geçmez.

## GitHub güncellemesi
Yetkili depo: https://github.com/gunerofis/OPERASYON; dal: main. Mevcut Codex otomasyonu 5 dakikalık kontrol sıklığıyla tanımlanmıştır; bu eşzamanlı dosya kilidi veya kesintisiz çalışma garantisi değildir. Çalışması yerel ortama, hesap erişimine ve zamanlayıcının çalışmasına bağlıdır.
Değişiklikler incelenir, doğrulama aracı çalıştırılır, normal commit / push yapılır. Uzak yalnız ileride ve yerel temizse fast-forward uygulanır. Ayrışma, sır veya erişim hatası sessizce atlanmaz; çalışma korunur ve hata bildirilir. Kullanıcı değişikliği silinmez.

## Olay kaydı
Olay kimliği, etkilenen sistem / iş, başlangıç, son başarılı işlem, etki, sorumlu, denenmiş işlem ve çözüm kanıtı kaydedilir. Başarısız işlemi tekrar etmeden dış sistemde oluşup oluşmadığı sorgulanır. Sonsuz yeniden deneme yapılmaz; tekrar sınırı bağlantı başına belirlenir.

## Yedek ve kurtarma
Git geçmişi sürümlü dosyaları kapsar; işlem veritabanı, sır kasası ve gitignore kapsamı için ayrı yedek gerekir. Her gerçek sistem için veri sahibi, yedek sıklığı, saklama süresi, kabul edilebilir veri kaybı ve geri dönüş süresi belirlenir.
Kurtarma denemesi ayrı test hedefinde yapılır. Kaynak bütünlüğü, son işlem kimlikleri ve tekrar olayların etkisi kontrol edilir; sonuç kaydedilir. Eski yazılım sürümüne dönüş dış sistemde gerçekleşmiş ödeme veya sevkiyatı geri almaz; bunlar ayrı düzeltme işidir.
