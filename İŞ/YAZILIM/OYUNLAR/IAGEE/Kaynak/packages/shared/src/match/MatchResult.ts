import type { PlayerId } from "../ids.js";
import type { EndReason } from "./EndReason.js";

export interface MatchResult {
  winnerPlayerId: PlayerId | null;
  loserPlayerId: PlayerId | null;
  endReason: EndReason;
  /** Maçın bittiği tick (Running iken üretilir, Ended ile sabitlenir). */
  tickEnded: number;
}
