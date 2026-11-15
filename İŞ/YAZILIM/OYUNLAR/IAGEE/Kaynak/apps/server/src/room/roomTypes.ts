import type { EndReason, PlayerId, RoomLifecycleState } from "@rift-empire/shared";

export type { RoomLifecycleState };

export interface PlayerSlots {
  p0: string | null;
  p1: string | null;
}

export interface MatchRoomResultSummary {
  winnerPlayerId: PlayerId | null;
  loserPlayerId: PlayerId | null;
  endReason: EndReason;
  tickEnded: number;
  matchStartTick: number | null;
  /** `tickEnded - matchStartTick` (ikisi de doluysa). */
  durationTicks: number | null;
}

export interface RoomDebugReadout {
  roomId: string;
  matchId: string;
  state: RoomLifecycleState;
  filledSlotCount: number;
  playerSlots: PlayerSlots;
  matchStarted: boolean;
  matchEnded: boolean;
  resultSummary: MatchRoomResultSummary | null;
}
