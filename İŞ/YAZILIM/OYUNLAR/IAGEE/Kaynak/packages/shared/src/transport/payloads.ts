import type { EndReason } from "../match/EndReason.js";
import type { MatchPhase } from "../match/MatchPhase.js";
import type { PlayerId } from "../ids.js";
import type { PlayerState } from "../entities/PlayerState.js";
import type { UnitState } from "../entities/UnitState.js";
import type { BuildingState } from "../entities/BuildingState.js";
import type { ResourceNodeState } from "../entities/ResourceNodeState.js";
import type { RoomLifecycleState } from "./roomLifecycle.js";
import type { CommandKind } from "../protocol/CommandKind.js";

export interface RoomStatePayload {
  roomId: string;
  roomState: RoomLifecycleState;
  filledSlotCount: number;
  slots: { p0: string | null; p1: string | null };
}

export interface MatchStatePayload {
  matchId: string;
  phase: MatchPhase;
  tick: number;
  players: Record<string, PlayerState>;
  units: Record<string, UnitState>;
  buildings: Record<string, BuildingState>;
  resourceNodes: Record<string, ResourceNodeState>;
}

export interface MatchResultPayload {
  winnerPlayerId: PlayerId | null;
  loserPlayerId: PlayerId | null;
  endReason: EndReason;
  tickEnded: number;
  durationTicks: number | null;
}

export type TransportEventKind = "match_started" | "match_ended" | "command_rejected";

export interface TransportEventPayload {
  event: TransportEventKind;
  roomId: string;
  detail?: string;
  commandId?: number;
  /** command_rejected vb. için kısa makine kodu (UI/telemetri). */
  reasonCode?: string;
}

export interface TransportErrorPayload {
  code: string;
  message?: string;
  commandId?: number;
  roomId?: string;
}

/** enqueue_command yanıtı — her komut `commandId` ile eşlenir. */
export interface AckPayload {
  forKind: string;
  ok: boolean;
  commandId: number;
  roomId: string;
  /** `ok: false` iken validation / iş kuralı reddi kodu. */
  reasonCode?: string;
}

/** Simülasyon tick’inde kuyruktan işlenen komutun tek seferlik sonucu (enqueue ACK’tan ayrı). */
export type SimulationCommandOutcomeStatus =
  | "applied"
  | "rejected_in_simulation"
  | "no_effect";

export interface CommandSimulationOutcomePayload {
  roomId: string;
  commandId: number;
  kind: CommandKind;
  status: SimulationCommandOutcomeStatus;
  /** `rejected_in_simulation` / `no_effect` için kısa makine kodu. */
  reasonCode?: string;
}
