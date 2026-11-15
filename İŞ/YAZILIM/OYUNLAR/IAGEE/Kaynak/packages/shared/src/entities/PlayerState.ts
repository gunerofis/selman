import type { PlayerId } from "../ids.js";

/** 1v1: teamIndex 0 | 1. Kalıcı meta yok; maç içi state. */
export interface PlayerState {
  id: PlayerId;
  teamIndex: 0 | 1;
  resources: {
    /** Tek ana kaynak (MVP); isim sabit. */
    primary: number;
  };
}
