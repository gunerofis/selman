---
name: repo-audit
description: Değişiklikten önce yeni, bilinmeyen veya çok dosyalı bir web deposunun teknoloji yığınını, komutlarını, mimarisini, mevcut değişikliklerini ve doğrulama risklerini çıkarır. Yeri ve etkisi zaten açık olan küçük metin değişikliklerinde kullanma. Use when the user runs /repo-audit.
---

# Repo Audit

Uygulama koduna dokunmadan önce deponun gerçek çalışma modelini ve güvenli değişiklik sınırını kanıtla.

## Girdiler

- Depo veya çalışma kökü
- Kullanıcının hedefi; varsa ilgili URL, hata, sayfa veya component
- Canlı ortam hedefleniyorsa açıkça belirtilmiş URL ve erişilebilir doğrulama araçları

## İş akışı

1. Gerçek depo kökünü belirle; kökten hedef dosyaya kadar geçerli `AGENTS.md` ve `AGENTS.override.md` dosyalarını oku.
2. `list_dir` ve `grep` ile klasörleri, README’leri, manifest/lock dosyalarını, CI ve deployment yapılandırmalarını bul. Vendor, cache, build çıktısı ve minified dosyaları kaynak kabul etme. Kabukta `rg`/`find` varsayma.
3. Git deposuysa `git status --short --branch` ile kullanıcı değişikliklerini kaydet. Değişiklikleri geri alma veya çalışma ağacını temizleme.
4. Framework/CMS, runtime, paket yöneticisi, route/component/service/API/veri tabanı yapısı ve ortam bağımlılıklarını dosya kanıtıyla belirle. Secret değerlerini okuma veya loglama; yalnız gerekli değişken adlarını ve servis ihtiyacını raporla.
5. Manifest, README ve CI’dan gerçek format, lint, typecheck, test, build, E2E, dev ve deployment komutlarını çıkar. Çelişkide lock dosyası ve CI davranışını özellikle incele; komut uydurma.
6. Hedef davranışın mevcut uygulamasını ve test kapsamını bul. Etkilenecek alanları, kırılma risklerini, gerekli browser/canlı doğrulamayı ve en küçük güvenli değişiklik sınırını belirle.
7. Canlı site ile kod arasında fark veya canlı hata varsa değişiklikten önce HTTP, redirect, render edilmiş DOM, console, network ve ilgili viewport kanıtını topla. Erişilemiyorsa bunu doğrulama açığı olarak belirt.

## Beklenen çıktı

- Teknoloji yığını ve onu kanıtlayan dosyalar
- Önemli klasörler ve mimari akış
- Paket yöneticisi ve gerçek çalışma/test/build/deployment komutları
- Git ve kullanıcı değişikliği durumu
- Ortam/servis ihtiyaçları; secret içermeden
- Test kapsamı ve doğrulama boşlukları
- Etkilenecek alanlar, başlıca riskler ve kabul kriterleri

## Tamamlanma ölçütü

Denetim, uygulanacak değişikliğin doğru kaynak dosyasını ve doğrulama yolunu gösterebildiğinde tamamdır. Teknoloji veya komut kanıtlanamıyorsa tahmin etme; bilinmeyen olarak raporla. Denetimin kendisi uygulama kodunu, bağımlılıkları, Git durumunu veya canlı ortamı değiştirmez.
