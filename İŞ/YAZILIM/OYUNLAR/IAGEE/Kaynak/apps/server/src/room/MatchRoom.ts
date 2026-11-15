import {
  MatchPhase,
  type CommandSimulationOutcomePayload,
  type MatchId,
  type PlayerId,
} from "@rift-empire/shared";
import { MatchSession } from "../match/MatchSession.js";
import type {
  MatchRoomResultSummary,
  PlayerSlots,
  RoomDebugReadout,
  RoomLifecycleState,
} from "./roomTypes.js";

let _roomSeq = 0;

function newRoomId(): string {
  _roomSeq += 1;
  return `room-${Date.now()}-${_roomSeq}`;
}

export class MatchRoom {
  readonly roomId: string;
  readonly matchId: MatchId;
  readonly createdAt: number;
  state: RoomLifecycleState;
  readonly playerSlots: PlayerSlots;
  session: MatchSession | null;
  /** `ended` anında doldurulur; `cleanup` sonrası da okunabilir. */
  lastResultSummary: MatchRoomResultSummary | null = null;

  constructor(matchId: MatchId) {
    this.roomId = newRoomId();
    this.matchId = matchId;
    this.createdAt = Date.now();
    this.state = "waiting";
    this.playerSlots = { p0: null, p1: null };
    this.session = null;
  }

  /** İlk boş slota misafir kimliği yerleştirir; iki slot dolunca `ready`. */
  joinPlayer(guestId: string): { ok: true; slot: "p0" | "p1" } | { ok: false; reason: string } {
    if (this.state === "cleaned" || this.state === "ended" || this.state === "running") {
      return { ok: false, reason: "room_not_joinable" };
    }
    if (this.state !== "waiting" && this.state !== "ready") {
      return { ok: false, reason: "room_not_joinable" };
    }
    if (this.playerSlots.p0 === null) {
      this.playerSlots.p0 = guestId;
      if (this.playerSlots.p1 !== null) {
        this.state = "ready";
      }
      return { ok: true, slot: "p0" };
    }
    if (this.playerSlots.p1 === null) {
      this.playerSlots.p1 = guestId;
      this.state = "ready";
      return { ok: true, slot: "p1" };
    }
    return { ok: false, reason: "room_full" };
  }

  /** `ready` iken prototip maçı başlatır. */
  startMatch(): { ok: true } | { ok: false; reason: string } {
    if (this.state !== "ready") {
      return { ok: false, reason: "not_ready" };
    }
    if (this.playerSlots.p0 === null || this.playerSlots.p1 === null) {
      return { ok: false, reason: "slots_incomplete" };
    }
    const session = new MatchSession(this.matchId, this.roomId);
    session.initialize();
    session.start();
    this.session = session;
    this.state = "running";
    return { ok: true };
  }

  /** Sadece `running` iken simülasyon tick’i; maç biterse `ended` + özet. */
  tickRoomOnce(): {
    outcomes: CommandSimulationOutcomePayload[];
    /** Bu tick sonrası oda `ended` olduysa true (transport yayını için). */
    endedAfterTick: boolean;
  } {
    if (this.state !== "running" || !this.session) {
      return { outcomes: [], endedAfterTick: false };
    }
    this.session.tickOnce();
    const outcomes = this.session.takeSimulationOutcomes();
    if (this.session.state.phase === MatchPhase.Ended) {
      this.lastResultSummary = buildResultSummary(this.session);
      this.state = "ended";
      return { outcomes, endedAfterTick: true };
    }
    return { outcomes, endedAfterTick: false };
  }

  /**
   * Bağlantı koptuğunda: maç `running` ve faz Running ise kopan yenilir, diğer oyuncu kazanır.
   * Lobide / maç öncesi için `not_running` döner (oda state’i değiştirilmez).
   */
  endMatchDueToDisconnect(leavingPlayerId: PlayerId): { ok: true } | { ok: false; reason: string } {
    if (this.state !== "running" || !this.session) {
      return { ok: false, reason: "not_running" };
    }
    if (this.session.state.phase !== MatchPhase.Running) {
      return { ok: false, reason: "match_not_running" };
    }
    const ids = Object.keys(this.session.state.players);
    if (!ids.includes(leavingPlayerId)) {
      return { ok: false, reason: "unknown_player" };
    }
    const winner = ids.find((id) => id !== leavingPlayerId) ?? null;
    if (winner === null) {
      return { ok: false, reason: "no_peer" };
    }
    this.session.end("disconnect", winner, leavingPlayerId);
    this.lastResultSummary = buildResultSummary(this.session);
    this.state = "ended";
    return { ok: true };
  }

  /** `running` dışındaki odalar için; session referansını kaldırır. */
  cleanup(): { ok: true } | { ok: false; reason: string } {
    if (this.state === "running") {
      return { ok: false, reason: "still_running" };
    }
    if (this.state === "cleaned") {
      return { ok: false, reason: "already_cleaned" };
    }
    this.session = null;
    this.state = "cleaned";
    return { ok: true };
  }

  getRoomDebugReadout(): RoomDebugReadout {
    const filled =
      (this.playerSlots.p0 !== null ? 1 : 0) + (this.playerSlots.p1 !== null ? 1 : 0);
    const matchStarted = this.session !== null || this.state === "ended" || this.state === "cleaned";
    const matchEnded = this.state === "ended" || this.state === "cleaned";
    return {
      roomId: this.roomId,
      matchId: this.matchId,
      state: this.state,
      filledSlotCount: filled,
      playerSlots: { ...this.playerSlots },
      matchStarted,
      matchEnded,
      resultSummary: this.lastResultSummary,
    };
  }
}

function buildResultSummary(session: MatchSession): MatchRoomResultSummary {
  const r = session.state.result;
  const start = session.state.matchStartTick;
  const endTick = r?.tickEnded ?? session.state.tick;
  const duration =
    start !== null && start !== undefined ? endTick - start : null;
  return {
    winnerPlayerId: r?.winnerPlayerId ?? null,
    loserPlayerId: r?.loserPlayerId ?? null,
    endReason: r?.endReason ?? "disconnect",
    tickEnded: r?.tickEnded ?? session.state.tick,
    matchStartTick: start,
    durationTicks: duration,
  };
}
