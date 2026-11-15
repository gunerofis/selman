import type { AnyCommandEnvelope, MatchState, UnitState, Vec2 } from "@rift-empire/shared";
import {
  BuildingType,
  PROTOTYPE_1V1_COMBAT,
  PROTOTYPE_1V1_MAP,
  PROTOTYPE_1V1_TRAIN,
  UnitType,
} from "@rift-empire/shared";

export type TrainRejectReason =
  | "unknown_player"
  | "building_not_found"
  | "wrong_owner"
  | "not_production_building"
  | "unsupported_unit_type"
  | "insufficient_resources";

export type TrainApplyResult =
  | { ok: true; unitId: string; costPaid: number }
  | { ok: false; reason: TrainRejectReason };

const SPAWN_OFFSETS: Vec2[] = [
  { x: 22, y: 0 },
  { x: -22, y: 0 },
  { x: 0, y: 22 },
  { x: 0, y: -22 },
];

function clampToMap(pos: Vec2): Vec2 {
  const m = 4;
  const { WIDTH, HEIGHT } = PROTOTYPE_1V1_MAP;
  return {
    x: Math.max(m, Math.min(WIDTH - m, pos.x)),
    y: Math.max(m, Math.min(HEIGHT - m, pos.y)),
  };
}

function spawnNearBuilding(buildingPos: Vec2, slot: number): Vec2 {
  const o = SPAWN_OFFSETS[slot % SPAWN_OFFSETS.length]!;
  return clampToMap({ x: buildingPos.x + o.x, y: buildingPos.y + o.y });
}

function combatFieldsForType(unitType: UnitType): {
  attackTargetEntityId: null;
  isAttacking: boolean;
  attackRange: number;
  attackDamage: number;
  attackIntervalTicks: number;
  nextAttackAllowedTick: number;
} {
  switch (unitType) {
    case UnitType.Melee:
      return {
        attackTargetEntityId: null,
        isAttacking: false,
        attackRange: PROTOTYPE_1V1_COMBAT.MELEE_RANGE,
        attackDamage: PROTOTYPE_1V1_COMBAT.MELEE_DAMAGE,
        attackIntervalTicks: PROTOTYPE_1V1_COMBAT.MELEE_ATTACK_INTERVAL_TICKS,
        nextAttackAllowedTick: 0,
      };
    case UnitType.Ranged:
      return {
        attackTargetEntityId: null,
        isAttacking: false,
        attackRange: PROTOTYPE_1V1_COMBAT.RANGED_RANGE,
        attackDamage: PROTOTYPE_1V1_COMBAT.RANGED_DAMAGE,
        attackIntervalTicks: PROTOTYPE_1V1_COMBAT.RANGED_ATTACK_INTERVAL_TICKS,
        nextAttackAllowedTick: 0,
      };
    case UnitType.Worker:
      return {
        attackTargetEntityId: null,
        isAttacking: false,
        attackRange: 0,
        attackDamage: 0,
        attackIntervalTicks: 999,
        nextAttackAllowedTick: 0,
      };
  }
}

function costAndHp(unitType: UnitType): { cost: number; hp: number } | null {
  switch (unitType) {
    case UnitType.Worker:
      return {
        cost: PROTOTYPE_1V1_TRAIN.COST_WORKER,
        hp: PROTOTYPE_1V1_TRAIN.HP_WORKER,
      };
    case UnitType.Melee:
      return {
        cost: PROTOTYPE_1V1_TRAIN.COST_MELEE,
        hp: PROTOTYPE_1V1_TRAIN.HP_MELEE,
      };
    case UnitType.Ranged:
      return {
        cost: PROTOTYPE_1V1_TRAIN.COST_RANGED,
        hp: PROTOTYPE_1V1_TRAIN.HP_RANGED,
      };
    default:
      return null;
  }
}

export function tryApplyTrain(
  state: MatchState,
  cmd: Extract<AnyCommandEnvelope, { kind: "train" }>,
  allocateUnitId: () => string,
  spawnSlot: number,
): TrainApplyResult {
  const { playerId, payload } = cmd;
  const { productionBuildingId, unitType } = payload;

  if (!state.players[playerId]) {
    return { ok: false, reason: "unknown_player" };
  }

  const building = state.buildings[productionBuildingId];
  if (!building) {
    return { ok: false, reason: "building_not_found" };
  }
  if (building.ownerPlayerId !== playerId) {
    return { ok: false, reason: "wrong_owner" };
  }
  if (building.type !== BuildingType.Production) {
    return { ok: false, reason: "not_production_building" };
  }

  const stats = costAndHp(unitType);
  if (!stats) {
    return { ok: false, reason: "unsupported_unit_type" };
  }

  const player = state.players[playerId]!;
  if (player.resources.primary < stats.cost) {
    return { ok: false, reason: "insufficient_resources" };
  }

  const id = allocateUnitId();
  const position = spawnNearBuilding(building.position, spawnSlot);
  const unit: UnitState = {
    id,
    ownerPlayerId: playerId,
    position: { x: position.x, y: position.y },
    hp: stats.hp,
    maxHp: stats.hp,
    type: unitType,
    gatherTargetNodeId: null,
    isGathering: false,
    nextGatherAllowedTick: 0,
    moveTargetPosition: null,
    isMoving: false,
    moveSpeed: 0,
    ...combatFieldsForType(unitType),
  };

  state.units[id] = unit;
  player.resources.primary -= stats.cost;

  return { ok: true, unitId: id, costPaid: stats.cost };
}
