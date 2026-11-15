---
name: arac-secimi
description: Claude, Codex, Antigravity, Gemini, Grok ve Grok bot arasından bu iş için tek aracı seçer. Aynı işi ikinci araçta yeniden başlatma.
---

# Araç seçimi

Bir iş bir araçta yürür. İkinci araca devir, ancak ilki durduysa ve iş kimliği yazıldıysa olur.

## Akış

1. Kullanıcı aracı bu görevde adlandırdıysa onu kullan.
2. Ad yoksa işe göre seç:
   - Grok: bu bilgisayardaki web, Shopify, görsel ve dosya işi.
   - Claude Code: kullanıcı Claude oturumundaysa uzun kod işi.
   - Codex: `Documents\Codex` altındaki iş ve `.codex\automations` kaydı. Açık otomasyon yalnız HARİTA’da yazılıysa çalışır.
   - Antigravity veya Gemini: kullanıcı o uygulamadaysa. Gemini MCP ayarı 24.10.2026’da boştu; sunucu uydurma.
   - Grok bot: WhatsApp bot kaynağı. Mağaza yönetimi ve reklam buradan yapılmaz.
3. İş Merkezi kaydı varsa aynı kimliği kullan. Yeni araç yeni iş açmaz.
4. Sonuç, işin kendi klasörüne yazılır. Sohbet özeti kayıt yerine geçmez.

## Değişmezler

- Kapalı alan adı yazılmadan açılmaz.
- Canlı yayın, ödeme, reklam bütçesi ve müşteri mesajı bu skill ile açılmaz.
- Pazaryeri skill önbelleğini çalışan set sanma. Set `Yapay Zeka\Skill setleri\00 Dizin.md` içindedir.
