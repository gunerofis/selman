# test

Alan: İŞ/YAZILIM/GELİŞMİŞ UYGULAMA VE PROGRAMLAR/Yerel Agent/OpenClaw/test. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Mevcut dosya adlarını ve bağlantıları koru. Yalnız istenen dosyalarda çalış; sonucu kısa doğrula.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

# Test Rules

- Fake-timer tests in `unit-fast` belong in `vitest.unit-fast-fake-timers`: `unit-fast` is `isolate: false` and parallel, so fake timers share worker globals and can hang unrelated real-timer tests.
- Async E2E waits synchronize on the state an action produces, never on the action returning: #125441 process readiness after `spawn()`, #125456 committed form state before Save, #125548 durable draft persistence before reload. Do not substitute longer timeouts, sleeps, retry-wrapped downstream assertions, or trimmed expectation fields.
