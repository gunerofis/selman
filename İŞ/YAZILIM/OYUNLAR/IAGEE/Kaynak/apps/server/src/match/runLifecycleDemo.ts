import { BuildingType, UnitType } from "@rift-empire/shared";
import {
  cleanupRoom,
  createPrototypeRoom,
  joinPrototypeRoom,
  tickRoomOnce,
  tryStartPrototypeMatch,
} from "../room/prototypeRoom.js";

/**
 * Room → join ×2 → ready → start → kısa gameplay → surrender → ended → cleanup → cleaned.
 */
export function runLifecycleDemo(matchId: string): void {
  const room = createPrototypeRoom(matchId);
  console.log("[demo] room created", room.getRoomDebugReadout());

  const j0 = joinPrototypeRoom(room, "guest-a");
  console.log("[demo] join1", j0, "readout", room.getRoomDebugReadout());

  const j1 = joinPrototypeRoom(room, "guest-b");
  console.log("[demo] join2", j1, "state=", room.state, "filled=", room.getRoomDebugReadout().filledSlotCount);

  const st = tryStartPrototypeMatch(room);
  console.log("[demo] tryStart", st, "running=", room.state, room.session !== null);

  if (!room.session) {
    console.log("[demo] abort: no session");
    return;
  }

  const session = room.session;
  let seq = 1;

  session.enqueueCommand({
    playerId: "p0",
    kind: "gather",
    issuedAtTick: 0,
    commandId: seq++,
    payload: {
      workerEntityId: "unit-p0-w0",
      resourceNodeId: "resource-node-near-p0",
    },
  });

  session.enqueueCommand({
    playerId: "p0",
    kind: "build",
    issuedAtTick: 0,
    commandId: seq++,
    payload: {
      builderUnitId: "unit-p0-w0",
      buildingType: BuildingType.Production,
      position: { x: 70, y: 100 },
    },
  });

  for (let i = 0; i < 6; i++) {
    tickRoomOnce(room);
  }

  const p0Prod = Object.values(session.state.buildings).find(
    (b) => b.ownerPlayerId === "p0" && b.type === BuildingType.Production,
  );
  if (!p0Prod) {
    console.log("[demo] abort: no p0 Production");
    return;
  }

  session.enqueueCommand({
    playerId: "p0",
    kind: "train",
    issuedAtTick: session.state.tick,
    commandId: seq++,
    payload: {
      productionBuildingId: p0Prod.id,
      unitType: UnitType.Melee,
    },
  });

  session.enqueueCommand({
    playerId: "p0",
    kind: "move",
    issuedAtTick: session.state.tick,
    commandId: seq++,
    payload: {
      unitIds: ["unit-p0-w0"],
      target: { x: 88, y: 100 },
    },
  });

  for (let i = 0; i < 5; i++) {
    tickRoomOnce(room);
  }

  session.enqueueCommand({
    playerId: "p1",
    kind: "surrender",
    issuedAtTick: session.state.tick,
    commandId: seq++,
    payload: {},
  });

  tickRoomOnce(room);

  console.log("[demo] after surrender room.state=", room.state, "phase=", room.session?.state.phase);
  console.log("[demo] room readout", room.getRoomDebugReadout());

  const cu = cleanupRoom(room);
  console.log("[demo] cleanup", cu, "final", room.getRoomDebugReadout());
}
