import type { AnyCommandEnvelope, BuildingState, MatchState, PlayerId, Vec2 } from "@rift-empire/shared";
import {
  BuildingType,
  PROTOTYPE_1V1_BUILD,
  PROTOTYPE_1V1_MAP,
  UnitType,
} from "@rift-empire/shared";

export type BuildRejectReason =
  | "unknown_player"
  | "builder_not_found"
  | "not_worker"
  | "wrong_owner"
  | "unsupported_building_type"
  | "insufficient_resources"
  | "out_of_bounds"
  | "placement_overlap";

export type BuildApplyResult =
  | { ok: true; buildingId: string; costPaid: number }
  | { ok: false; reason: BuildRejectReason };

function dist2(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function costAndHp(type: BuildingType): { cost: number; hp: number } | null {
  switch (type) {
    case BuildingType.DropOff:
      return {
        cost: PROTOTYPE_1V1_BUILD.COST_DROP_OFF,
        hp: PROTOTYPE_1V1_BUILD.HP_DROP_OFF,
      };
    case BuildingType.Production:
      return {
        cost: PROTOTYPE_1V1_BUILD.COST_PRODUCTION,
        hp: PROTOTYPE_1V1_BUILD.HP_PRODUCTION,
      };
    default:
      return null;
  }
}

function isInMapBounds(pos: Vec2, radius: number): boolean {
  const { WIDTH, HEIGHT } = PROTOTYPE_1V1_MAP;
  return (
    pos.x >= radius &&
    pos.x <= WIDTH - radius &&
    pos.y >= radius &&
    pos.y <= HEIGHT - radius
  );
}

function overlapsExistingBuildings(
  pos: Vec2,
  radius: number,
  state: MatchState,
): boolean {
  const minDist = 2 * radius;
  const minDist2 = minDist * minDist;
  for (const b of Object.values(state.buildings)) {
    if (dist2(pos, b.position) < minDist2) {
      return true;
    }
  }
  return false;
}

export function tryApplyBuild(
  state: MatchState,
  cmd: Extract<AnyCommandEnvelope, { kind: "build" }>,
  allocateBuildingId: () => string,
): BuildApplyResult {
  const { playerId, payload } = cmd;
  const { builderUnitId, buildingType, position } = payload;
  const r = PROTOTYPE_1V1_BUILD.FOOTPRINT_RADIUS;

  if (!state.players[playerId]) {
    return { ok: false, reason: "unknown_player" };
  }

  const unit = state.units[builderUnitId];
  if (!unit) {
    return { ok: false, reason: "builder_not_found" };
  }
  if (unit.type !== UnitType.Worker) {
    return { ok: false, reason: "not_worker" };
  }
  if (unit.ownerPlayerId !== playerId) {
    return { ok: false, reason: "wrong_owner" };
  }

  if (
    buildingType !== BuildingType.DropOff &&
    buildingType !== BuildingType.Production
  ) {
    return { ok: false, reason: "unsupported_building_type" };
  }

  const stats = costAndHp(buildingType);
  if (!stats) {
    return { ok: false, reason: "unsupported_building_type" };
  }

  const player = state.players[playerId]!;
  if (player.resources.primary < stats.cost) {
    return { ok: false, reason: "insufficient_resources" };
  }

  if (!isInMapBounds(position, r)) {
    return { ok: false, reason: "out_of_bounds" };
  }

  if (overlapsExistingBuildings(position, r, state)) {
    return { ok: false, reason: "placement_overlap" };
  }

  const id = allocateBuildingId();
  const building: BuildingState = {
    id,
    ownerPlayerId: playerId,
    position: { x: position.x, y: position.y },
    hp: stats.hp,
    maxHp: stats.hp,
    type: buildingType,
    isConstructed: true,
  };

  state.buildings[id] = building;
  player.resources.primary -= stats.cost;

  return { ok: true, buildingId: id, costPaid: stats.cost };
}
