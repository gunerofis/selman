import type {
  AckPayload,
  CommandSimulationOutcomePayload,
  MatchResultPayload,
  MatchStatePayload,
  RoomStatePayload,
  TransportErrorPayload,
  TransportEventPayload,
} from "./payloads.js";

/** Sunucudan istemciye — JSON gövdesi. */
export type ServerTransportMessage =
  | { kind: "room_state"; payload: RoomStatePayload }
  | { kind: "match_state"; payload: MatchStatePayload }
  | { kind: "event"; payload: TransportEventPayload }
  | { kind: "match_result"; payload: MatchResultPayload }
  | { kind: "error"; payload: TransportErrorPayload }
  | { kind: "ack"; payload: AckPayload }
  | { kind: "command_outcome"; payload: CommandSimulationOutcomePayload };
