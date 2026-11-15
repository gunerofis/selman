# TEST_AGENT

Yerel yapinin yetenek dogrulama klasoru. Amac: Ollama + OpenCode baglantisinin dosya okuma, duzenleme, komut/test ve tarayici kontrollerini ayri bir calisma alaninda kanitlamak.

## Durum cizelgesi
| Yetenek | Komut | Beklenen sonuc |
|---|---|---|
| Dosya okuma | `node test.js` | `ornek-metin.txt` icerigi konsolda |
| Komut/test | `node test.js` | `2+2=4` assertion GECTI, cikis kodu 0 |
| Tarayici kontrolu | `node tarayici-test.mjs` | `test-page.html` acilir, h1 okunur, cikis 0 |
| Duzenleme | (agent) | bosluk.txt duzenlenir, git diff gorulur |