import type { MatchId } from "../ids.js";
import type { PlayerState } from "../entities/PlayerState.js";
import type { UnitState } from "../entities/UnitState.js";
import type { BuildingState } from "../entities/BuildingState.js";
import type { ResourceNodeState } from "../entities/ResourceNodeState.js";
import type { MatchResult } from "./MatchResult.js";
import type { MatchPhase } from "./MatchPhase.js";

/**
 * Merkezi maç state’i — simülasyon ve replikasyon için tek kaynak (şema).
 * Record kullanımı: id ile O(1) erişim; sıra garantisi için ayrı listeler ileride eklenebilir.
 *
 * Lifecycle:
 * - `tick`: simülasyon adımı sayacı; `start()` sonrası `tickOnce` ile artar.
 * - `matchStartTick`: `start()` anındaki tick (genelde 0).
 * - `matchEndTick`: `end()` anındaki tick; `result.tickEnded` ile aynı olmalı.
 */
export interface MatchState {
  matchId: MatchId;
  tick: number;
  phase: MatchPhase;
  players: Record<string, PlayerState>;
  units: Record<string, UnitState>;
  buildings: Record<string, BuildingState>;
  resourceNodes: Record<string, ResourceNodeState>;
  result: MatchResult | null;
  matchStartTick: number | null;
  matchEndTick: number | null;
}
