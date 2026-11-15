import type {
  MatchResultPayload,
  MatchStatePayload,
  RoomStatePayload,
} from "@rift-empire/shared";
import type { MatchRoom } from "../room/MatchRoom.js";
import type { MatchSession } from "../match/MatchSession.js";

export function toRoomStatePayload(room: MatchRoom): RoomStatePayload {
  const d = room.getRoomDebugReadout();
  return {
    roomId: d.roomId,
    roomState: d.state,
    filledSlotCount: d.filledSlotCount,
    slots: d.playerSlots,
  };
}

export function toMatchStatePayload(session: MatchSession): MatchStatePayload {
  const s = session.state;
  return {
    matchId: s.matchId,
    phase: s.phase,
    tick: s.tick,
    players: s.players,
    units: s.units,
    buildings: s.buildings,
    resourceNodes: s.resourceNodes,
  };
}

export function toMatchResultPayload(room: MatchRoom): MatchResultPayload | null {
  const r = room.lastResultSummary;
  if (!r) {
    return null;
  }
  return {
    winnerPlayerId: r.winnerPlayerId,
    loserPlayerId: r.loserPlayerId,
    endReason: r.endReason,
    tickEnded: r.tickEnded,
    durationTicks: r.durationTicks,
  };
}
