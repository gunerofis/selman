import {
  isClientTransportMessage,
  type ClientTransportMessage,
  type CommandSimulationOutcomePayload,
  type PlayerId,
  type ServerTransportMessage,
} from "@rift-empire/shared";
import { WebSocketServer, WebSocket } from "ws";
import { cleanupRoom, tryStartPrototypeMatch } from "../room/prototypeRoom.js";
import { allRooms, getRoom, joinRoom } from "./roomRegistry.js";
import { makeCommandAck, tryCommandIdFromUnknownCommand } from "./commandAck.js";
import { toMatchResultPayload, toMatchStatePayload, toRoomStatePayload } from "./serialize.js";

interface SocketMeta {
  id: string;
  roomId: string | null;
  playerId: PlayerId | null;
  /** 1 saniyelik pencerede mesaj sayacı (spam / kaza koruması). */
  rateWindowStartMs: number;
  messagesInWindow: number;
}

/** UTF-8 bayt; JSON parse öncesi reddedilir (DoS / hatalı istemci). */
const MAX_WS_MESSAGE_BYTES = Number(process.env.WS_MAX_MESSAGE_BYTES ?? 262144);

/** Saniyede bağlantı başına üst sınır (enqueue spam vb.). */
const MAX_MESSAGES_PER_SEC = Number(process.env.WS_MAX_MESSAGES_PER_SECOND ?? 80);

/** Simülasyon tick aralığı (ms); çok düşük/yüksek değerler sınırlanır. */
const MATCH_TICK_INTERVAL_MS = Math.min(
  2000,
  Math.max(50, Number(process.env.MATCH_TICK_INTERVAL_MS ?? 150)),
);

let tickIntervalLogged = false;

function messageUtf8ByteLength(raw: string): number {
  return Buffer.byteLength(raw, "utf8");
}

function allowMessageThisSecond(meta: SocketMeta): boolean {
  const now = Date.now();
  if (now - meta.rateWindowStartMs >= 1000) {
    meta.rateWindowStartMs = now;
    meta.messagesInWindow = 0;
  }
  meta.messagesInWindow += 1;
  return meta.messagesInWindow <= MAX_MESSAGES_PER_SEC;
}

const sockets = new Map<WebSocket, SocketMeta>();

let connSeq = 0;
function newConnId(): string {
  connSeq += 1;
  return `conn-${connSeq}`;
}

let tickTimer: ReturnType<typeof setInterval> | null = null;

function send(ws: WebSocket, msg: ServerTransportMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function broadcastRoom(roomId: string, msg: ServerTransportMessage): void {
  const raw = JSON.stringify(msg);
  for (const [ws, meta] of sockets) {
    if (meta.roomId === roomId && ws.readyState === WebSocket.OPEN) {
      ws.send(raw);
    }
  }
}

/** Maç `disconnect` ile bittiğinde tick döngüsündeki ile aynı sonuç yayınları (command_outcome yok). */
function broadcastMatchEndedAfterDisconnect(roomId: string): void {
  const room = getRoom(roomId);
  if (!room) {
    return;
  }
  const mr = toMatchResultPayload(room);
  if (mr) {
    broadcastRoom(roomId, { kind: "match_result", payload: mr });
  }
  broadcastRoom(roomId, { kind: "room_state", payload: toRoomStatePayload(room) });
  broadcastRoom(roomId, {
    kind: "event",
    payload: { event: "match_ended", roomId },
  });
}

function ensureTickLoop(): void {
  if (tickTimer !== null) {
    return;
  }
  tickTimer = setInterval(() => {
    for (const room of allRooms()) {
      if (room.state !== "running" || !room.session) {
        continue;
      }
      const { outcomes: simOutcomes, endedAfterTick } = room.tickRoomOnce();
      for (const o of simOutcomes) {
        broadcastRoom(room.roomId, { kind: "command_outcome", payload: o });
      }
      if (endedAfterTick) {
        const mr = toMatchResultPayload(room);
        if (mr) {
          broadcastRoom(room.roomId, { kind: "match_result", payload: mr });
        }
        broadcastRoom(room.roomId, { kind: "room_state", payload: toRoomStatePayload(room) });
        broadcastRoom(room.roomId, {
          kind: "event",
          payload: { event: "match_ended", roomId: room.roomId },
        });
      } else if (room.session) {
        broadcastRoom(room.roomId, {
          kind: "match_state",
          payload: toMatchStatePayload(room.session),
        });
      }
    }

    let anyRunning = false;
    for (const r of allRooms()) {
      if (r.state === "running") {
        anyRunning = true;
        break;
      }
    }
    if (!anyRunning && tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }, MATCH_TICK_INTERVAL_MS);
}

function err(
  ws: WebSocket,
  code: string,
  message?: string,
  extras?: { commandId?: number; roomId?: string },
): void {
  send(ws, {
    kind: "error",
    payload: {
      code,
      message,
      ...extras,
    },
  });
}

function handleMessage(ws: WebSocket, raw: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    err(ws, "parse_error", "invalid_json");
    return;
  }

  if (!isClientTransportMessage(parsed)) {
    err(ws, "unknown_kind", "expected client transport envelope");
    return;
  }

  const msg = parsed as ClientTransportMessage;
  const meta = sockets.get(ws);
  if (!meta) {
    err(ws, "internal", "no_socket_meta");
    return;
  }

  switch (msg.kind) {
    case "join_room": {
      const r = joinRoom(msg.payload.guestId, msg.payload.roomId);
      if (!r.ok) {
        err(ws, r.reason, "join_failed");
        return;
      }
      meta.roomId = r.room.roomId;
      meta.playerId = r.slot;
      broadcastRoom(r.room.roomId, { kind: "room_state", payload: toRoomStatePayload(r.room) });
      return;
    }
    case "start_match": {
      if (!meta?.roomId || !meta.playerId) {
        err(ws, "not_in_room", "join_room first");
        return;
      }
      const room = getRoom(msg.payload.roomId);
      if (!room || room.roomId !== meta.roomId) {
        err(ws, "room_mismatch", "payload.roomId must match your room");
        return;
      }
      const st = tryStartPrototypeMatch(room);
      if (!st.ok) {
        err(ws, st.reason, "start_failed");
        return;
      }
      ensureTickLoop();
      broadcastRoom(room.roomId, {
        kind: "event",
        payload: { event: "match_started", roomId: room.roomId },
      });
      broadcastRoom(room.roomId, { kind: "room_state", payload: toRoomStatePayload(room) });
      if (room.session) {
        broadcastRoom(room.roomId, {
          kind: "match_state",
          payload: toMatchStatePayload(room.session),
        });
      }
      return;
    }
    case "enqueue_command": {
      const cmd = msg.payload.command;
      const cid = tryCommandIdFromUnknownCommand(cmd);
      const payloadRoomId = msg.payload.roomId;

      if (!meta?.roomId || !meta.playerId) {
        err(ws, "not_in_room", "join_room first", {
          commandId: cid || undefined,
          roomId: payloadRoomId,
        });
        return;
      }
      const room = getRoom(payloadRoomId);
      if (!room || room.roomId !== meta.roomId) {
        err(ws, "room_mismatch", "payload.roomId must match your room", {
          commandId: cid || undefined,
          roomId: payloadRoomId,
        });
        return;
      }
      if (room.state !== "running" || !room.session) {
        err(ws, "no_session", "match not running", {
          commandId: cid || undefined,
          roomId: room.roomId,
        });
        return;
      }
      if (cmd.playerId !== meta.playerId) {
        err(ws, "wrong_player", "command.playerId must match slot", {
          commandId: cid || undefined,
          roomId: room.roomId,
        });
        return;
      }
      const session = room.session;
      const beforeRej = session.getDebugReadout().rejectedEnqueueCount;
      session.enqueueCommand(cmd);
      const afterRej = session.getDebugReadout().rejectedEnqueueCount;
      const ackCid = tryCommandIdFromUnknownCommand(cmd) || cid;
      if (afterRej > beforeRej) {
        const reason =
          session.getDebugReadout().lastRejection?.reason ?? "missing_or_invalid_fields";
        send(
          ws,
          {
            kind: "ack",
            payload: makeCommandAck(room.roomId, ackCid, false, reason),
          },
        );
      } else {
        send(ws, {
          kind: "ack",
          payload: makeCommandAck(room.roomId, cmd.commandId, true),
        });
      }
      return;
    }
    case "get_room_state": {
      const room = getRoom(msg.payload.roomId);
      if (!room) {
        err(ws, "room_not_found", undefined);
        return;
      }
      send(ws, { kind: "room_state", payload: toRoomStatePayload(room) });
      return;
    }
    case "cleanup_room": {
      if (!meta?.roomId || !meta.playerId) {
        err(ws, "not_in_room", "join_room first");
        return;
      }
      const room = getRoom(msg.payload.roomId);
      if (!room || room.roomId !== meta.roomId) {
        err(ws, "room_mismatch", "payload.roomId must match your room");
        return;
      }
      const cu = cleanupRoom(room);
      if (!cu.ok) {
        err(ws, cu.reason, "cleanup_failed");
        return;
      }
      broadcastRoom(room.roomId, { kind: "room_state", payload: toRoomStatePayload(room) });
      return;
    }
    default:
      err(ws, "unknown_kind", "unhandled");
  }
}

export interface TransportServerHandle {
  port: number;
  close: () => Promise<void>;
}

export function startTransportServer(port: number): Promise<TransportServerHandle> {
  return new Promise((resolve, reject) => {
    const wss = new WebSocketServer({ port, host: "127.0.0.1" }, () => {
      const addr = wss.address();
      const p = typeof addr === "object" && addr !== null ? addr.port : port;

      wss.on("connection", (ws: WebSocket) => {
        sockets.set(ws, {
          id: newConnId(),
          roomId: null,
          playerId: null,
          rateWindowStartMs: 0,
          messagesInWindow: 0,
        });
        ws.on("message", (data) => {
          const meta = sockets.get(ws);
          if (!meta) {
            return;
          }
          const raw = typeof data === "string" ? data : data.toString();
          if (messageUtf8ByteLength(raw) > MAX_WS_MESSAGE_BYTES) {
            err(ws, "payload_too_large", "message exceeds limit");
            return;
          }
          if (!allowMessageThisSecond(meta)) {
            err(ws, "rate_limited", "too many messages per second");
            return;
          }
          handleMessage(ws, raw);
        });
        ws.on("close", () => {
          const meta = sockets.get(ws);
          sockets.delete(ws);
          if (!meta?.roomId || !meta.playerId) {
            return;
          }
          const room = getRoom(meta.roomId);
          if (!room) {
            return;
          }
          const ended = room.endMatchDueToDisconnect(meta.playerId);
          if (!ended.ok) {
            return;
          }
          broadcastMatchEndedAfterDisconnect(room.roomId);
        });
      });

      resolve({
        port: p,
        close: () =>
          new Promise((res) => {
            if (tickTimer !== null) {
              clearInterval(tickTimer);
              tickTimer = null;
            }
            wss.close(() => res());
          }),
      });
    });

    wss.on("error", reject);
  });
}
