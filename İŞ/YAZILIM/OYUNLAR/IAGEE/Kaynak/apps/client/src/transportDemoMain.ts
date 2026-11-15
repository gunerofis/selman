import { connectNodeWebSocket } from "./transport/nodeWsConnect.js";
import { RiftClient } from "./transport/riftClient.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sunucu (`npm start` @rift-empire/server, varsayılan 8765) açıkken iki istemci omurgası.
 */
async function main(): Promise<void> {
  const url = process.env.WS_URL ?? "ws://127.0.0.1:8765";
  const a = new RiftClient("A");
  const b = new RiftClient("B");

  await a.connect(url, connectNodeWebSocket);
  await b.connect(url, connectNodeWebSocket);
  console.log("[demo] connected");

  a.joinRoom("client-demo-a");
  const roomId = await a.waitForRoomId();
  console.log("[demo] roomId", roomId, "A store.roomState", a.store.roomStatePayload?.roomState);

  b.joinRoom("client-demo-b", roomId);
  await sleep(80);
  console.log("[demo] B roomState", b.store.roomStatePayload?.filledSlotCount);

  a.startMatch(roomId);
  await sleep(250);
  console.log("[demo] match phase", a.store.matchStatePayload?.phase, "tick", a.lastKnownTick);

  a.gather(roomId, "p0", "unit-p0-w0", "resource-node-near-p0");
  await sleep(500);
  console.log("[demo] gather simulation outcome", a.store.lastSimulationOutcome);

  b.surrender(roomId, "p1");
  await sleep(400);

  await a.waitForMatchResult(15000);
  console.log("[demo] match_result", a.store.matchResultPayload);

  console.log("[demo] A lastEvent", a.store.lastEvent);
  console.log("[demo] B lastEvent", b.store.lastEvent);

  a.close();
  b.close();
  console.log("[demo] done");
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
