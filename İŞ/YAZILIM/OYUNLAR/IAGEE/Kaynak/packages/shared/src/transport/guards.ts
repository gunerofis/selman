import type { ClientTransportMessage } from "./clientToServer.js";
import type { ServerTransportMessage } from "./serverToClient.js";

const CLIENT_KINDS = new Set([
  "join_room",
  "start_match",
  "enqueue_command",
  "get_room_state",
  "cleanup_room",
]);

const SERVER_KINDS = new Set([
  "room_state",
  "match_state",
  "event",
  "match_result",
  "error",
  "ack",
  "command_outcome",
]);

export const isClientTransportMessage = (value: unknown): value is ClientTransportMessage => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (typeof o.kind !== "string" || !CLIENT_KINDS.has(o.kind)) {
    return false;
  }
  if (o.payload === null || typeof o.payload !== "object") {
    return false;
  }
  return true;
};

export const isServerTransportMessage = (value: unknown): value is ServerTransportMessage => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (typeof o.kind !== "string" || !SERVER_KINDS.has(o.kind)) {
    return false;
  }
  if (o.payload === null || typeof o.payload !== "object") {
    return false;
  }
  return true;
};
