---
name: backup-migration-rollback
description: Veri, şema, dosya, CMS veya deployment değişiklikleri için yedek, migration, restore ve rollback planı hazırlar ve güvenli doğrulama yapar. Sıradan salt-okunur şema incelemesinde kullanma. Use when the user runs /backup-migration-rollback.
---

# Backup, Migration and Rollback

Geri dönüş yolunu değişiklikten önce kanıtla; yedeğin varlığını restore edilebilirlik sanma.

## Girdiler

- Değişen veri/şema/dosya, ortam ve sahiplik
- Veri hacmi, kabul edilen kesinti, RPO/RTO ve uyumluluk gereksinimi
- Mevcut yedekleme, restore, migration ve deployment araçları

## Akış

1. Değişikliğin veri kaybı, kilitlenme, süre, geriye uyumluluk ve eski uygulama sürümü riskini sınıflandır.
2. Mevcut yedeğin kapsamını, şifrelemesini, saklama yerini, yaşını ve restore prosedürünü secret göstermeden doğrula.
3. Migration’ı mümkünse expand/migrate/contract olarak geriye uyumlu tasarla; uzun işlemleri batch/resume edilebilir yap.
4. Üretim kopyası olmayan güvenli ortamda dry-run yap; süre, kayıt sayısı, checksum/örnek doğruluk ve hata sonrası devam davranışını ölç.
5. Go/no-go ölçütü, gözlemleme, rollout sırası, rollback tetikleyicisi ve geri dönüşte veri birleştirme ihtiyacını yaz.
6. Production çalıştırma veya restore öncesi kullanıcıdan açık izin al; hedefi ve yedek kimliğini yeniden doğrula.

## Değişmezler

- Doğrulanmamış yedeği var kabul etme; production verisini silme, sıfırlama veya seed etme.
- Geri döndürülemez migration’ı açık risk, yedek ve kullanıcı izni olmadan çalıştırma.
- Secret veya kişisel veriyi migration loguna basma.

## Çıktı ve tamamlanma

Migration planı, dry-run kanıtı, veri doğrulama sorguları, rollout/rollback komutları ve durma koşulları raporlanır. Restore yolu en az güvenli ortamda doğrulanmadan production için hazır deme.
