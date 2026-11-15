# 04 Kayıt ve veri güvenliği

Amaç: Oyuncu ilerlemesini sürüm geçişi, bozuk veri ve uygulama kapanışından korumak.

## Çalışma sırası

save-systems'ın veri/sürüm ilkeleri; mevcut kayit.js; MDN Web Storage ve IndexedDB. Android seçimi yapıldığında Capacitor Storage.

## Uygulama

1. Mevcut kayıt anahtarını, şema sürümünü ve dışa/içe aktarım akışını bul. Gerçek kullanıcı kaydını alıştırma verisi yapma.
2. Eski kayıt → yeni şema geçişini kopya veri üzerinde tarif et; bakiyeler, eşya kimlikleri ve tek seferlik ödüller için doğrulama belirle.
3. Bozuk JSON, desteklenmeyen yeni sürüm, eksik alan, tekrar yükleme ve yetersiz depolama durumlarının sonuçlarını yaz.
4. Kayıt değiştirilmeden önce doğrulama ve geri dönebilir kopya sınırını belirle. Tarayıcıda dosya yeniden adlandırma örneği yerine uygun storage işlemlerini kullan.

## Bitiş ölçütü

Kayıt hatasında mevcut ilerleme sessizce ezilmez; aktarım ve göçün geri dönüşü tanımlıdır.

## Kaynaklar

- [K21 — MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API): Mevcut tarayıcı kaydının origin ve senkron erişim davranışı.
- [K22 — MDN Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB): Büyüyen kayıtlar için işlemler ve sürüm geçişleri; seçim henüz yapılmadı.
- [K23 — MDN Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria): Tarayıcı depolama sınırları, kalıcılık ve veri kaybı koşulları.
- [K24 — OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html): Yerel kayıt ve istemci verisinin güven sınırları; güvensiz içeriği DOM'a aktarmama.
- [K25 — Capacitor Storage](https://capacitorjs.com/docs/guides/storage): Android sarmalayıcı seçilirse kayıt stratejisi ve WebView depolaması.

## Kullanıcı özeti

127.0.0.1:5173, localhost, başka port ve eski HTML adresi ayrı kayıtlardır. İstemcideki bakiye gerçek ödemeler için güvenilir sunucu kanıtı değildir.

