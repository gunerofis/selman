/**
 * @rift-empire/server — minimal WebSocket transport (Build 11).
 */
import { startTransportServer } from "./transport/wsHub.js";

const port = Number(process.env.PORT ?? 8765);
void startTransportServer(port).then(({ port: p }) => {
  console.log(`[server] transport ws://127.0.0.1:${p}`);
});
