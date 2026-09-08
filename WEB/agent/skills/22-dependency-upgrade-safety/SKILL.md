---
name: 22-dependency-upgrade-safety
description: Paket, framework, runtime veya lock dosyası sürüm yükseltmesini uyumluluk ve güvenlik açısından planlar, uygular ve test eder. Sürüm değiştirmeyen sıradan kod görevinde kullanma.
---

# Dependency Upgrade Safety

Yükseltmeyi küçük, açıklanabilir ve geri alınabilir tut; tüm bağımlılıkları gerekçesiz yenileme.

## Girdiler

- Manifest/lock dosyaları, paket yöneticisi ve runtime sürümü
- Hedef paket/sürüm, yükseltme nedeni ve varsa güvenlik advisory’si
- Mevcut test/build komutları, deployment ortamı ve uyumluluk kısıtları

## Akış

1. Paket yöneticisini ve workspace sınırını lock dosyası/CI ile doğrula; mevcut bağımlılık ağacını kaydet.
2. Hedef sürümün resmî changelog, migration guide, peer/runtime gereksinimi ve breaking change’lerini incele.
3. En küçük yeterli sürüm aralığını seç; doğrudan ve transitif değişiklikleri ayrı göster.
4. Lock dosyasını yalnız mevcut paket yöneticisiyle üret; lifecycle script ve yeni paket kaynağı riskini incele.
5. Typecheck, unit/integration/E2E, build, bundle ve kritik runtime akışlarını çalıştır; deprecation ve console uyarılarını değerlendir.
6. Güvenlik açığı için advisory’nin gerçekten etkilenen yol ve sürümle ilişkisini doğrula; çözümü yalnız tarayıcı puanına indirgeme.

## Değişmezler

- Paket yöneticisini, registry’yi veya geniş sürüm grubunu kullanıcı istemeden değiştirme.
- Testi geçirme uğruna lock dosyasını elle düzenleme, hatayı ignore etme veya güvenlik kontrolünü devre dışı bırakma.
- Otomatik major upgrade veya production deploy yapma.

## Çıktı ve tamamlanma

Sürüm farkı, transitif değişiklikler, migration kodu, test sonuçları, bilinen risk ve rollback yöntemi raporlanır. Yalnız hedeflenen bağımlılıkların değiştiği diff ile doğrulanmalıdır.
