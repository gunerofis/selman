import type {
  AnyCommandEnvelope,
  ClientTransportMessage,
} from "@rift-empire/shared";

export function makeJoinRoom(guestId: string, roomId?: string): ClientTransportMessage {
  return { kind: "join_room", payload: { guestId, roomId } };
}

export function makeStartMatch(roomId: string): ClientTransportMessage {
  return { kind: "start_match", payload: { roomId } };
}

export function makeEnqueueCommand(
  roomId: string,
  command: AnyCommandEnvelope,
): ClientTransportMessage {
  return { kind: "enqueue_command", payload: { roomId, command } };
}

export function makeGetRoomState(roomId: string): ClientTransportMessage {
  return { kind: "get_room_state", payload: { roomId } };
}

export function makeCleanupRoom(roomId: string): ClientTransportMessage {
  return { kind: "cleanup_room", payload: { roomId } };
}
