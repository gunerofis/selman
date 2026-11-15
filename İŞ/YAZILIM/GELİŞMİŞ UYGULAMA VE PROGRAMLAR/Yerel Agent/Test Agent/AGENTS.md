# Test Agent

Alan: İŞ/YAZILIM/GELİŞMİŞ UYGULAMA VE PROGRAMLAR/Yerel Agent/Test Agent. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Mevcut dosya adlarını ve bağlantıları koru. Yalnız istenen dosyalarda çalış; sonucu kısa doğrula.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

# TEST_AGENT - Kural Dosyasi (AGENTS.md)

Bu klasor, yerel yapinin (Ollama + OpenCode) dosya okuma, duzenleme, komut/test calistirma ve tarayici kontrolu yeteneklerinin dogrulanmasi icin ayrilmistir. Uretim verisi icermez.

## Calistirma komutlari
- Sohbet/model dogrulamasi: `ollama run qwen3-16k "..."` veya OpenCode icinden `ollama/qwen3-16k`
- Test (komut): `node test.js`
- Test (tarayici): `node tarayici-test.mjs`
- Test (tarayici + ekran goruntusu): `node tarayici-test.mjs --shot`

## Kurallar
- `node_modules/` ve `.git/` icerigini degistirme; calistirma icin gerekli paketler burada tutulur.
- Silme, disari yayinlama (publish), repo disi klasore yazma veya disariya mesaj gonderme islemleri YALNIZ onay alindiktan sonra yapilir.
- Tarayici kontrolu icin ayrilmis Playwright profile kullanilir; kisiye ait tarayici oturumuna mudahale edilmez.
- Degisiklikler ana daldan ayrilmadikca dogrudan main'e itilmez; her is icin ayri dal acilir.
- Bu klasordeki dosyalar yalniz yerel test amaclidir; uretim site koduna baglanmaz.