import type { WebSocketConnectFn } from "./wsTransportTypes.js";

/** Tarayıcı native WebSocket. */
export const connectBrowserWebSocket: WebSocketConnectFn = (url, h) => {
  const ws = new WebSocket(url);
  ws.onopen = () => h.onOpen();
  ws.onerror = () => h.onError(new Error("websocket_error"));
  ws.onclose = () => h.onClose();
  ws.onmessage = (ev: MessageEvent) => h.onMessage(String(ev.data));
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
