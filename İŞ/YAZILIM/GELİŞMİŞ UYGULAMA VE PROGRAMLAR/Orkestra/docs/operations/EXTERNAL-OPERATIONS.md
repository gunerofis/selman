# Dış işlem politikası

Dış sistemde yazma yapan her işlem `proposed → awaiting_confirmation → queued → executing → succeeded | failed | unknown | cancelled` yaşam döngüsünü kullanır. Bağlantı koptuğunda sonuç `unknown` olur; kaynakta idempotency anahtarı veya dış referans doğrulanmadan tekrar gönderilmez.

Görevin tamamlanması otomatik olarak fatura, kargo, ödeme, mesaj veya stok yayımı oluşturmaz. Bu işlemler hedef hesap, veri özeti ve kaynak sürümü görünür açık kullanıcı teyidi ister.
