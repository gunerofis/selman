# Ürün ve stok
Ürün ailesi ile satılabilir varyantı ayır. Her varyanta benzersiz SKU; her kanala site kodu ve dış ürün kimliği bağla.
Kişiselleştirme varsa yazı, renk, malzeme ve üretim onayını sipariş satırında sakla.
Kullanılabilir stok = fiziksel stok - rezervasyon - satılamaz stok. Üretim kapasitesi fiziksel stok değildir.
İptalde rezervasyonu kaldır; iadede inceleme sonucuna göre stok kararı ver. Aynı sipariş olayının tekrarı stoğu ikinci kez azaltmamalı.
Kabul senaryoları: mükerrer SKU, eşleşmeyen varyant, son ürüne eşzamanlı sipariş, iptal ve tekrar gelen olay.