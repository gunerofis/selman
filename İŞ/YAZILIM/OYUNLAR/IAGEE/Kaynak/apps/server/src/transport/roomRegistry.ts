import { MatchRoom } from "../room/MatchRoom.js";

const rooms = new Map<string, MatchRoom>();

export function registerRoom(room: MatchRoom): void {
  rooms.set(room.roomId, room);
}

export function getRoom(roomId: string): MatchRoom | undefined {
  return rooms.get(roomId);
}

export function allRooms(): IterableIterator<MatchRoom> {
  return rooms.values();
}

function findJoinableRoom(): MatchRoom | null {
  for (const room of rooms.values()) {
    if (room.state === "cleaned") {
      continue;
    }
    if (room.state === "ended" || room.state === "running") {
      continue;
    }
    if (room.playerSlots.p0 === null || room.playerSlots.p1 === null) {
      return room;
    }
  }
  return null;
}

/**
 * `roomId` verilmişse o odaya katıl; yoksa uygun bekleyen oda veya yeni oda.
 */
export function joinRoom(
  guestId: string,
  roomId?: string,
):
  | { ok: true; room: MatchRoom; slot: "p0" | "p1" }
  | { ok: false; reason: string } {
  if (roomId) {
    const room = rooms.get(roomId);
    if (!room) {
      return { ok: false, reason: "room_not_found" };
    }
    const j = room.joinPlayer(guestId);
    if (!j.ok) {
      return { ok: false, reason: j.reason };
    }
    return { ok: true, room, slot: j.slot };
  }

  const joinable = findJoinableRoom();
  if (joinable) {
    const j = joinable.joinPlayer(guestId);
    if (!j.ok) {
      return { ok: false, reason: j.reason };
    }
    return { ok: true, room: joinable, slot: j.slot };
  }

  const room = new MatchRoom(`match-${Date.now()}`);
  registerRoom(room);
  const j = room.joinPlayer(guestId);
  if (!j.ok) {
    return { ok: false, reason: j.reason };
  }
  return { ok: true, room, slot: j.slot };
}
