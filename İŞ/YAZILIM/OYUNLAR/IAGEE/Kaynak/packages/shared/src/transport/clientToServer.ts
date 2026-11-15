import type { AnyCommandEnvelope } from "../protocol/AnyCommandEnvelope.js";

export interface JoinRoomPayload {
  guestId: string;
  /** Yoksa sunucu uygun bekleyen oda seçer veya yeni oda açar. */
  roomId?: string;
}

export interface StartMatchPayload {
  roomId: string;
}

export interface EnqueueCommandPayload {
  roomId: string;
  command: AnyCommandEnvelope;
}

export interface GetRoomStatePayload {
  roomId: string;
}

/** Oda yaşam döngüsü — maç otoritesi değil; `MatchRoom.cleanup()`. */
export interface CleanupRoomPayload {
  roomId: string;
}

/** İstemciden sunucuya — JSON gövdesi. */
export type ClientTransportMessage =
  | { kind: "join_room"; payload: JoinRoomPayload }
  | { kind: "start_match"; payload: StartMatchPayload }
  | { kind: "enqueue_command"; payload: EnqueueCommandPayload }
  | { kind: "get_room_state"; payload: GetRoomStatePayload }
  | { kind: "cleanup_room"; payload: CleanupRoomPayload };
