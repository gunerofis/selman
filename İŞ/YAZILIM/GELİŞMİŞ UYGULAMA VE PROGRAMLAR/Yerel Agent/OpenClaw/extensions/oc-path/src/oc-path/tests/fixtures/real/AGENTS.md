# real

Alan: İŞ/YAZILIM/GELİŞMİŞ UYGULAMA VE PROGRAMLAR/Yerel Agent/OpenClaw/extensions/oc-path/src/oc-path/tests/fixtures/real. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Mevcut dosya adlarını ve bağlantıları koru. Yalnız istenen dosyalarda çalış; sonucu kısa doğrula.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

## Roles

- planner: breaks down user goals into tasks
- executor: runs the planned tasks one at a time
- reviewer: checks output before user-visible writes

## Tools

- gh: GitHub CLI for issues, PRs, CI
- curl: HTTP client
- rg: ripgrep — fast file content search

## Boundaries

- never edit /etc, /usr, or system paths
- always confirm before destructive operations
- read SOUL.md before each session for persona context
