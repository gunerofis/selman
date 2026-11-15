import type {
  AckPayload,
  CommandSimulationOutcomePayload,
  MatchResultPayload,
  MatchStatePayload,
  RoomStatePayload,
  TransportErrorPayload,
  TransportEventPayload,
} from "@rift-empire/shared";

export type ConnectionState = "disconnected" | "connecting" | "connected";

/** Son çözülen enqueue ACK (commandId eşlemesi). */
export interface LastResolvedCommandInfo {
  commandId: number;
  roomId: string;
  forKind: string;
  ok: boolean;
  reasonCode?: string;
}

export interface ClientStore {
  connectionState: ConnectionState;
  roomStatePayload: RoomStatePayload | null;
  matchStatePayload: MatchStatePayload | null;
  matchResultPayload: MatchResultPayload | null;
  lastEvent: TransportEventPayload | null;
  lastError: TransportErrorPayload | null;
  lastAck: AckPayload | null;
  lastResolvedCommand: LastResolvedCommandInfo | null;
  /** Son simülasyon outcome (transport `command_outcome`). */
  lastSimulationOutcome: CommandSimulationOutcomePayload | null;
  simulationOutcomeHistory: CommandSimulationOutcomePayload[];
}

export function createInitialClientStore(): ClientStore {
  return {
    connectionState: "disconnected",
    roomStatePayload: null,
    matchStatePayload: null,
    matchResultPayload: null,
    lastEvent: null,
    lastError: null,
    lastAck: null,
    lastResolvedCommand: null,
    lastSimulationOutcome: null,
    simulationOutcomeHistory: [],
  };
}

export const SIMULATION_OUTCOME_HISTORY_MAX = 32;
