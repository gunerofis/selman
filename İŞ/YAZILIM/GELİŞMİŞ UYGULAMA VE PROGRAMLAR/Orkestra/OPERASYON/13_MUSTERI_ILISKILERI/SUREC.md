# Müşteri ilişkileri
Talep → müşteri / sipariş referansı → konu ve öncelik → sorumlu → ilgili birime alt iş → müşteri yanıtı → çözüm kanıtı → kapanış.
Alanlar: talep kimliği, kaynak kanal kimliği, kaynak mesaj referansı, sipariş referansı, konu, durum, sorumlu, alınma zamanı, yanıt zamanı, çözüm ve yeniden açılma nedeni.
Kaynak kanal + dış talep kimliği ile mükerrer kayıt kontrol edilir. İade / hasar / gecikme talepleri kargo, ürün veya finans işine bağlanır. Yanıt verilmesi sorunun çözüldüğü anlamına gelmez.
Müşteriye mesaj göndermek için görev kapsamındaki iletişim yetkisi aranır; taslak hazırlama işi otomatik gönderim değildir. Yanıt süreleri iş hacmi ve çalışma saatleri doğrulandıktan sonra belirlenir.
İlk test: aynı talep iki kez gelince tek destek kaydı; müşteri iade isterken para iadesi tamamlanmadıysa kapanış yerine ilgili finans işi görünür.
