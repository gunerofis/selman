# Project RIFT EMPIRE (IAGEE)

Monorepo: **paylaşılan şema** (`packages/shared`), **WebSocket + simülasyon** (`apps/server`), **istemci / tarayıcı demo** (`apps/client`).

## Gereksinimler

- Node.js **18+**

## Kurulum

```bash
npm install
```

## Derleme

```bash
npm run build
```

Sıra: `shared` → `server` → `client` (TypeScript) → `client` (Vite `build:browser`).

## Test

```bash
npm test
```

- **`test:unit`** (`npm run test:unit`): `node:test` + `tsx`, yalnızca `shared` derlenir; sunucu başlatılmaz. Kapsam:
  - `validateCommandEnvelope` (sunucu)
  - `dispatchCommand` / `otherPlayerId` (sunucu)
  - `MatchSession` yaşam döngüsü, gather/surrender tick (sunucu)
  - `createPrototype1v1MatchState` (shared)
  - transport `guards` + `isAnyCommandEnvelope` (shared)
- **`smoke:e2e`**: yerel sunucu subprocess + iki Node istemci; uçtan uca gather/build/train/move/attack/surrender/result.

Ayrıntılı log: `npm run smoke:e2e:verbose`. Port: `SMOKE_PORT=18766 npm run smoke:e2e:port`.

## Çalıştırma

**Sunucu** (varsayılan `PORT=8765`):

```bash
npm run start --workspace=@rift-empire/server
```

İsteğe bağlı ortam değişkenleri: `PORT` (varsayılan sunucu girişinde tanımlı), WebSocket için `WS_MAX_MESSAGE_BYTES` (varsayılan 262144), `WS_MAX_MESSAGES_PER_SECOND` (varsayılan 80; bağlantı başına saniyelik üst sınır), simülasyon tick aralığı için `MATCH_TICK_INTERVAL_MS` (varsayılan 150; kabul aralığı 50–2000 ms, ilk maç başlatıldığında konsola yazılır).

**Kopma:** Maç `running` iken bir istemcinin soketi kapanırsa maç `endReason: disconnect` ile biter; kopan yenilir, diğer oyuncu kazanır; `match_result` + `room_state` + `match_ended` yayınlanır. Lobide veya maç başlamadan kopma odada ek state değiştirmez (prototip).

**İstemci demo:** `error` zarfındaki yaygın kodlar (`rate_limited`, `payload_too_large`, `wrong_player`, `room_mismatch`, `no_session`, `not_in_room`, `room_full`, `parse_error`, `unknown_kind`, `room_not_found`, …) için ipuçları Türkçe; durum çubuğunda **Senin slot** (p0/p1) gösterilir.

**Tarayıcı (Vite)**:

```bash
npm run dev:browser --workspace=@rift-empire/client
```

İstemci tarafında WebSocket kapanınca `connectionState` `disconnected` olur; maç **Running** iken kopma tespit edilirse (yerel özet temizlenmeden önce) `lastError` alanına `transport_closed` yazılır — panelde “son hata” JSON’unda görünür.

Maç görünümünde sağ altta **minimap** (tüm harita özeti: düğüm / bina / birim) çizilir; ana tuvaldeki görünüm **kesik çizgili çerçeve** ile gösterilir; minimap üzerine **tıklayınca** kamera o dünya noktasına merkezlenir. **Space** ile (bir şey seçiliyken) kamera seçili birim / bina / düğüme odaklanır. İnşa modu şeridi varken minimap biraz yukarı kayar.

**Node transport demo** (önce `npm run build`):

```bash
npm run demo:transport --workspace=@rift-empire/client
```

## Dokümantasyon

Ürün ve teknik plan: `docs/` (özellikle `01`–`10`, `90_PROJECT_AUDIT_REPORT.txt`).

## Geliştirme önceliği (özet)

1. **Birinci plân**: çekirdek simülasyon, protokol, sunucu otoritesi, otomatik test / smoke.
2. **İkinci plân**: tarayıcı arayüzü polish (HUD, menü, animasyon, UX) — çekirdek stabil olduktan sonra.
