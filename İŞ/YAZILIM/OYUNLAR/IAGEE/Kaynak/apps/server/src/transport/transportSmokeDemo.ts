import WebSocket from "ws";
import { startTransportServer } from "./wsHub.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitOpen(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    ws.once("open", () => resolve());
    ws.once("error", reject);
  });
}

/**
 * Yerel WebSocket sunucusu + iki istemci: join → start → komut → tick ile state → surrender → result.
 */
export async function runTransportSmokeDemo(): Promise<void> {
  const { port, close } = await startTransportServer(0);
  console.log("[smoke] server port", port);

  const a = new WebSocket(`ws://127.0.0.1:${port}`);
  const b = new WebSocket(`ws://127.0.0.1:${port}`);
  await Promise.all([waitOpen(a), waitOpen(b)]);

  let lastTick = 0;
  function track(ws: WebSocket): void {
    ws.on("message", (d) => {
      try {
        const o = JSON.parse(d.toString()) as { kind?: string; payload?: { tick?: number } };
        if (o.kind === "match_state" && typeof o.payload?.tick === "number") {
          lastTick = o.payload.tick;
        }
      } catch {
        /* ignore */
      }
    });
  }
  track(a);
  track(b);

  const roomId = await new Promise<string>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("room_id timeout")), 3000);
    const onMsg = (d: WebSocket.RawData) => {
      try {
        const o = JSON.parse(d.toString()) as { kind: string; payload: { roomId: string } };
        if (o.kind === "room_state" && o.payload.roomId) {
          clearTimeout(t);
          a.removeListener("message", onMsg);
          resolve(o.payload.roomId);
        }
      } catch {
        /* ignore */
      }
    };
    a.on("message", onMsg);
    a.send(JSON.stringify({ kind: "join_room", payload: { guestId: "smoke-a" } }));
  });

  b.send(JSON.stringify({ kind: "join_room", payload: { guestId: "smoke-b", roomId } }));
  await sleep(80);

  a.send(JSON.stringify({ kind: "start_match", payload: { roomId } }));
  await sleep(200);

  const tickForCmd = lastTick;
  a.send(
    JSON.stringify({
      kind: "enqueue_command",
      payload: {
        roomId,
        command: {
          playerId: "p0",
          kind: "gather",
          issuedAtTick: tickForCmd,
          commandId: 1,
          payload: {
            workerEntityId: "unit-p0-w0",
            resourceNodeId: "resource-node-near-p0",
          },
        },
      },
    }),
  );
  await sleep(250);

  b.send(
    JSON.stringify({
      kind: "enqueue_command",
      payload: {
        roomId,
        command: {
          playerId: "p1",
          kind: "surrender",
          issuedAtTick: lastTick,
          commandId: 2,
          payload: {},
        },
      },
    }),
  );
  await sleep(400);

  await close();
  console.log("[smoke] done (closed server)");
}
