import WebSocket from "ws";
import type { WebSocketConnectFn } from "./wsTransportTypes.js";

/** Node terminal istemcisi — `ws` paketi. */
export const connectNodeWebSocket: WebSocketConnectFn = (url, h) => {
  const ws = new WebSocket(url);
  ws.once("open", () => h.onOpen());
  ws.once("error", (e) => h.onError(e));
  ws.on("close", () => h.onClose());
  ws.on("message", (data) => h.onMessage(data.toString()));
  return {
    send: (text: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(text);
      }
    },
    close: () => {
      ws.close();
    },
  };
};
