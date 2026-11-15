import { MatchRoom } from "./MatchRoom.js";

/** 1v1 prototip oda — matchmaking yok, doğrudan yaşam döngüsü testi için. */
export function createPrototypeRoom(matchId?: string): MatchRoom {
  const mid = matchId ?? `match-${Date.now()}`;
  return new MatchRoom(mid);
}

export function joinPrototypeRoom(
  room: MatchRoom,
  guestId: string,
): ReturnType<MatchRoom["joinPlayer"]> {
  return room.joinPlayer(guestId);
}

export function tryStartPrototypeMatch(room: MatchRoom): ReturnType<MatchRoom["startMatch"]> {
  return room.startMatch();
}

export function tickRoomOnce(room: MatchRoom): void {
  room.tickRoomOnce();
}

export function cleanupRoom(room: MatchRoom): ReturnType<MatchRoom["cleanup"]> {
  return room.cleanup();
}
