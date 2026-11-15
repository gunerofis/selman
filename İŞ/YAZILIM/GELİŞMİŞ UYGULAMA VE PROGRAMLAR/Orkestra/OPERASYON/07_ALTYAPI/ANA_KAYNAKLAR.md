# Ana veri kaynakları ve bağlantı sözleşmesi
Sistem kimlikleri ve durumları [sistemler.json](../00_YONETIM/kayitlar/sistemler.json) içindedir. İnsanların kullandığı ürün adı ile kurulmuş API bağlantısı farklı alanlardır.

| Veri | Sahip birim | Şimdiki ana kaynak | Bağlantı yönü taslağı |
|---|---|---|---|
| Plan / skill / geliştirme görevi | TEKNOLOJI / YONETIM | Bu Git deposu | Yerel ↔ GitHub; çatışma otomatik çözülmez |
| Ürün / stok | URUN_STOK | Seçilecek | Yetkili stok kaynağı → kanallar |
| Sipariş | DIJITAL / TOPTAN | İlgili satış kaynağı; sistem seçilecek | Kanal → operasyon |
| Ödeme / finansal belge | FINANS | Sağlayıcı / muhasebe sistemi; seçilecek | Kaynak → mutabakat görünümü |
| Sevkiyat | LOJISTIK | Kargo sistemi; seçilecek | Yetkili talep → kargo; durum → operasyon |
| Üretim / satın alma | URETIM | Seçilecek | Plan ve gerçek hareketler ayrı |
| Müşteri talebi | MUSTERI | Seçilecek | Kanal → destek kaydı |
| Personel / sözleşme | IDARI / SOZLESME | Erişimi sınırlı sistem; seçilecek | Merkeze yalnız gerekli referans / durum |
| AI sonucu | Kaynak işin birimi | Göreve bağlı doğrulanmış çıktı | Araç → sonuç kaydı |

Her bağlantının kayıt alanları: kimlik, kaynak, hedef, veri sahibi, aktarım yönü, okuma / yazma kapsamı, anahtar ve alan eşlemeleri, tetikleme, son başarılı aktarım, hata sahibi, doğrulama kanıtı.
Durum sırası: belirlenecek → tanimli → test → aktif. Hata alanı bağlantı durumundan ayrıdır. Aktif bağlantı için test kanıtı gerekir. Aynı verinin iki yazarı gerekiyorsa alan bazında üstün kaynak açıkça belirlenir.
