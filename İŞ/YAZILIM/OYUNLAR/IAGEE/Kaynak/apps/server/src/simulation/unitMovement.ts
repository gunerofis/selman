import type { AnyCommandEnvelope, MatchState, UnitState, Vec2 } from "@rift-empire/shared";
import {
  PROTOTYPE_1V1_MAP,
  PROTOTYPE_1V1_MOVE,
  UnitType,
} from "@rift-empire/shared";

export type MoveRejectReason =
  | "unknown_player"
  | "empty_unit_selection"
  | "unit_not_found"
  | "wrong_owner"
  | "invalid_target_position";

export type MoveApplyResult =
  | {
      ok: true;
      unitIds: string[];
      target: Vec2;
    }
  | { ok: false; reason: MoveRejectReason };

function clearGather(unit: UnitState): void {
  unit.gatherTargetNodeId = null;
  unit.isGathering = false;
  unit.nextGatherAllowedTick = 0;
}

function speedForType(type: UnitType): number {
  switch (type) {
    case UnitType.Worker:
      return PROTOTYPE_1V1_MOVE.SPEED_WORKER;
    case UnitType.Melee:
      return PROTOTYPE_1V1_MOVE.SPEED_MELEE;
    case UnitType.Ranged:
      return PROTOTYPE_1V1_MOVE.SPEED_RANGED;
  }
}

function isTargetInMap(t: Vec2): boolean {
  const { WIDTH, HEIGHT } = PROTOTYPE_1V1_MAP;
  return (
    Number.isFinite(t.x) &&
    Number.isFinite(t.y) &&
    t.x >= 0 &&
    t.x <= WIDTH &&
    t.y >= 0 &&
    t.y <= HEIGHT
  );
}

function clampPosition(p: Vec2): Vec2 {
  const { WIDTH, HEIGHT } = PROTOTYPE_1V1_MAP;
  return {
    x: Math.max(0, Math.min(WIDTH, p.x)),
    y: Math.max(0, Math.min(HEIGHT, p.y)),
  };
}

/** Hareket durdurma — saldırı bağlanırken de kullanılır. */
export function clearMovementState(unit: UnitState): void {
  unit.isMoving = false;
  unit.moveTargetPosition = null;
  unit.moveSpeed = 0;
}

function finishMove(unit: UnitState): void {
  clearMovementState(unit);
}

export function clearAttackState(unit: UnitState): void {
  unit.attackTargetEntityId = null;
  unit.isAttacking = false;
  unit.nextAttackAllowedTick = 0;
}

/**
 * Move komutu: sahiplik ve hedef kontrolü; gather temizlenir, hedef ve hız atanır.
 */
export function tryApplyMove(
  state: MatchState,
  cmd: Extract<AnyCommandEnvelope, { kind: "move" }>,
): MoveApplyResult {
  const { playerId, payload } = cmd;
  const { unitIds, target } = payload;

  if (!state.players[playerId]) {
    return { ok: false, reason: "unknown_player" };
  }
  if (!Array.isArray(unitIds) || unitIds.length === 0) {
    return { ok: false, reason: "empty_unit_selection" };
  }
  if (!isTargetInMap(target)) {
    return { ok: false, reason: "invalid_target_position" };
  }

  const goal: Vec2 = { x: target.x, y: target.y };

  for (const uid of unitIds) {
    const unit = state.units[uid];
    if (!unit) {
      return { ok: false, reason: "unit_not_found" };
    }
    if (unit.ownerPlayerId !== playerId) {
      return { ok: false, reason: "wrong_owner" };
    }
  }

  for (const uid of unitIds) {
    const unit = state.units[uid]!;
    clearGather(unit);
    clearAttackState(unit);
    unit.moveTargetPosition = { x: goal.x, y: goal.y };
    unit.isMoving = true;
    unit.moveSpeed = speedForType(unit.type);
  }

  return { ok: true, unitIds: [...unitIds], target: goal };
}

/**
 * Her tick: hareket halindeki birimler hedefe doğru ilerler, varınca snap ve durur.
 * Konum her zaman harita içinde kalır.
 */
export function resolveMovementTick(state: MatchState): void {
  const thr = PROTOTYPE_1V1_MOVE.ARRIVE_THRESHOLD;

  for (const unit of Object.values(state.units)) {
    if (unit.isAttacking) {
      continue;
    }
    if (!unit.isMoving || unit.moveTargetPosition === null) {
      continue;
    }

    const target = unit.moveTargetPosition;
    const pos = unit.position;
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= thr) {
      unit.position = { x: target.x, y: target.y };
      unit.position = clampPosition(unit.position);
      finishMove(unit);
      continue;
    }

    const nx = dx / dist;
    const ny = dy / dist;
    const step = Math.min(unit.moveSpeed, dist);
    unit.position = clampPosition({
      x: pos.x + nx * step,
      y: pos.y + ny * step,
    });
  }
}
