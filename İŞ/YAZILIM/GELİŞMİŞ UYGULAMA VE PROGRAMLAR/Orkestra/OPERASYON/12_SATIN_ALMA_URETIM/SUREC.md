# Satın alma, üretim ve kalite
Talep → tedarikçi teklifleri → seçilen satın alma sürümü → sipariş → kısmi / tam mal kabul → stok. Satın alma talebi, tedarikçi siparişi ve tedarikçi faturası ayrı kayıtlardır.
Üretim: bağlı satış / stok ihtiyacı → ürün reçetesi ve sürümü → malzeme rezervasyonu → iş emri → fiilî tüketim → kalite kontrol → sağlam ürün / yeniden işlem / hurda → depoya giriş.
Alanlar: satın alma kimliği, tedarikçi referansı, SKU, miktar, birim, para birimi, teslim tarihi, sorumlu, kabul edilen miktar ve belge referansı. Üretimde ek olarak iş emri, reçete sürümü, planlanan / gerçekleşen süre ve miktar tutulur.
Kısmi mal kabulünde kalan miktar açık kalır. Sipariş vermek mal kabul değildir; mal kabul ödeme değildir. Fire ve yeniden işlem, sağlam ürün miktarına eklenmez.
Devirler: satın alma FINANS'a ödeme / belge referansı; üretim URUN_STOK'a kabul edilmiş miktar; gecikme satış sahibine etki ve yeni termin bildirir.
İlk test: 10 birim tedarik siparişinin 6 birimi kabul edilince kalan 4 görünür; 6 birim üretimin 1'i kalite dışıysa sağlam çıktı 5'tir. Gerçek reçete, kapasite ve kişiler envanterde doğrulanacak.
