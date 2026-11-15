/** Node `ws` veya tarayıcı `WebSocket` için ortak yüzey. */
export interface TransportHandle {
  send(text: string): void;
  close(): void;
}

export type WebSocketConnectFn = (
  url: string,
  handlers: {
    onOpen: () => void;
    onError: (e: unknown) => void;
    onClose: () => void;
    onMessage: (data: string) => void;
  },
) => TransportHandle;
