import type { MatchId } from "../ids.js";
import { MatchPhase } from "./MatchPhase.js";
import type { MatchState } from "./MatchState.js";

/** Boş maç state — spawn ve init sonraki aşamalarda doldurulacak. */
export function createInitialMatchState(matchId: MatchId): MatchState {
  return {
    matchId,
    tick: 0,
    phase: MatchPhase.Uninitialized,
    players: {},
    units: {},
    buildings: {},
    resourceNodes: {},
    result: null,
    matchStartTick: null,
    matchEndTick: null,
  };
}
