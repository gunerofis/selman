import net from "node:net";
import WebSocket from "ws";

const host = "127.0.0.1";
const port = 8765;
const url = `ws://${host}:${port}`;

function tcpCheck() {
  return new Promise((resolve, reject) => {
    const s = net.createConnection({ port, host }, () => {
      s.end();
      resolve("tcp_ok");
    });
    s.setTimeout(4000);
    s.on("timeout", () => {
      s.destroy();
      reject(new Error("tcp_timeout"));
    });
    s.on("error", reject);
  });
}

async function main() {
  await tcpCheck();
  console.log(`[probe] TCP ${host}:${port} — bağlandı`);

  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });
  console.log(`[probe] WebSocket ${url} — açıldı`);

  const join = JSON.stringify({
    kind: "join_room",
    payload: { guestId: "probe-guest", roomId: undefined },
  });
  ws.send(join);

  const msg = await new Promise((resolve, reject) => {
    ws.once("message", (data) => resolve(data.toString()));
    ws.once("error", reject);
    setTimeout(() => reject(new Error("ws_message_timeout")), 5000);
  });
  console.log("[probe] İlk sunucu mesajı:", msg.slice(0, 500));

  ws.close();
  console.log("[probe] Tamam.");
}

main().catch((e) => {
  console.error("[probe] HATA:", e.message);
  process.exit(1);
});
