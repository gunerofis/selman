# server-methods

Alan: İŞ/YAZILIM/GELİŞMİŞ UYGULAMA VE PROGRAMLAR/Yerel Agent/OpenClaw/src/gateway/server-methods. Bu klasörde ilk bu AGENTS.md okunur; üst klasör kuralları geçerlidir.

Mevcut dosya adlarını ve bağlantıları koru. Yalnız istenen dosyalarda çalış; sonucu kısa doğrula.

Ana konumlar selman/HARİTA.md içindedir. Kişisel veri ve anahtar GitHub’a yüklenmez. GPT Damıtma için üst AGENTS.md özel izin yasağı geçerlidir.

## Mevcut proje kuralları

# Gateway Server Methods Notes

- agent session transcripts are a `parentId` chain/DAG; never append raw `type: "message"` entries via JSONL writes (missing `parentId` can sever the leaf path and break compaction/history). Always write transcript messages via `SessionManager.appendMessage(...)` (or a wrapper that uses it).
