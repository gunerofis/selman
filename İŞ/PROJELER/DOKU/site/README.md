# DOKU sitesi

- Vitrin: `src/`, `data/`, `assets/`; üretim `tools/build.mjs`.
- Etiket yönetimi: `/yonetim/`; ChatGPT girişi, `DOKU_ADMIN_EMAIL` yönetici hesabı, D1 `DB`.
- `data/keywords.json` başlangıç etiketleri; D1 kayıtları önceliklidir. Kaydet galeri aramasına yansır. Yedek ve geçmiş paneldedir.
- Şema: `db/schema.ts`; SQL geçişleri: `drizzle/`. Üretim geçişlerini Sites uygular.

## Komutlar

```text
node scripts/build-runtime.mjs
node tools/check.mjs
node tools/search-check.mjs
node tools/admin-check.mjs
node scripts/run-framework.mjs dev --port 4182 --hostname 127.0.0.1
```

Sites yayını kendi `build-site.mjs` ve kaynak paketi akışını kullanır. Üretim çıktısı `dist/client` ve `dist/server`; eski statik `dist/` dosyaları korunur.

Yerel `.dev.vars`: `DOKU_ADMIN_EMAIL=seedy@sites.test`. Yerel giriş `/signin-with-chatgpt?return_to=/yonetim/`; test kimliği üretimde kullanılmaz.
