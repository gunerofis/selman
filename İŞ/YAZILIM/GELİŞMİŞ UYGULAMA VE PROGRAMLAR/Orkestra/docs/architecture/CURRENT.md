# Orkestra yerel MVP mimarisi

Bu klasör, masaüstünde çalışan yerel MVP ve hedef monorepo sınırlarını birlikte taşır. Şu anda çalışma zamanı Node.js 24, aynı-origin HTTP paneli, ayrı API/worker süreçleri ve yerel SQLite veritabanıdır. Docker bu bilgisayarda kurulu olmadığı için PostgreSQL, pg-boss, n8n ve reverse proxy üretim çalışma zamanı olarak etkin değildir.

Çalışan çekirdek: beş tam yetkili kullanıcı, kullanıcı bazlı görünüm tercihleri, sürümlü migration, kalıcı inbox/outbox worker kuyruğu, sipariş olay alımı, ürün eşleme, idempotency, görev/atama/durum geçmişi, güncelleme/iptal/yeniden başlatma/yeniden eşitleme, kalıcı entegrasyon hataları, müşteriler, ürünler, doğrulanmamış 1000 açılış stoğu, stok sayımı ve rezervasyonu, teklifler, üretim işleri, bildirim veri modeli, audit ve demo connector.

`011_commerce_core.sql` ile ortak ticaret çekirdeği genişletildi. Siparişler artık kanal sipariş numarası, sipariş/işlem zamanı, para birimi ve tutar kırılımı, ödeme/hazırlama/iade durumları, müşteri iletişimi, teslimat adresi ve ham kaynak anlık görüntüsünü saklar. Sipariş kalemlerinde dış varyant kimliği ve ticari tutarlar bulunur. Kanal ürünleri, varyantları, kanal stok seviyeleri, iadeler ve geri ödemeler için ortak tablolar eklendi.

Shopify eşitlemesi siparişlerle birlikte ürün ve varyant kataloğunu da artımlı olarak alır. SKU eşleşmeleri yerel ürüne otomatik bağlanır; eşleşmeyen sipariş kalemleri ve kanal varyantları panelden kontrollü biçimde yerel ürüne bağlanabilir. Sipariş paneli müşteri, toplam, ödeme, hazırlama, kargo ve görev durumlarını ortak görünümde gösterir; Ürünler klasöründe gerçek kanal kataloğu yüzeyi bulunur.

`012_operations_core.sql`–`014_customer_backfill.sql` ile stok hareketi/rezervasyon, BOM, üretim operasyonu, malzeme ihtiyacı, satın alma talebi, müşteri kimliği/not/görüşme, shipment/package/takip olayı, gider, mutabakat ve dış işlem onay geçmişi eklendi. Panel bu kayıtları gerçek API uç noktalarıyla yönetir; satış, stok/üretim ve finans raporları yalnız kalıcı yerel veriden hesaplanır. Dış sistemde yazma işlemleri açık kullanıcı onayı ve idempotency anahtarı olmadan kuyruğa alınmaz.

Hedef sınırlar `apps/`, `packages/`, `automation/`, `infra/` ve `tests/` altında ayrılmıştır. Harici connector, Electron kalıcı platform profilleri, PostgreSQL kuyruğu, n8n ve AI sağlayıcıları gerçek hesap bilgileri gelmeden etkinleştirilmez.
