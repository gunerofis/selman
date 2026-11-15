import type { AnyCommandEnvelope, MatchState, UnitState, Vec2 } from "@rift-empire/shared";
import { BuildingType, MatchPhase, UnitType } from "@rift-empire/shared";
import { clearAttackState, clearMovementState } from "./unitMovement.js";

export type AttackRejectReason =
  | "unknown_player"
  | "attacker_not_found"
  | "wrong_owner"
  | "attacker_cannot_attack"
  | "target_not_found"
  | "invalid_target_type"
  | "friendly_target"
  | "cannot_attack_self";

export type AttackApplyResult =
  | { ok: true; attackerId: string; targetId: string }
  | { ok: false; reason: AttackRejectReason };

export interface CombatHitInfo {
  attackerId: string;
  targetId: string;
  damage: number;
  targetHpAfter: number;
  kind: "unit" | "building";
}

export interface CombatDeathInfo {
  entityId: string;
  kind: "unit" | "building";
}

export interface CombatTickHooks {
  onHit?: (info: CombatHitInfo) => void;
  onDeath?: (info: CombatDeathInfo) => void;
  /** Sadece `MainBase` yıkıldığında; maç sonu için. */
  onMainBaseDestroyed?: (loserPlayerId: string) => void;
}

function clearGather(unit: UnitState): void {
  unit.gatherTargetNodeId = null;
  unit.isGathering = false;
  unit.nextGatherAllowedTick = 0;
}

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getTargetPosition(state: MatchState, id: string): Vec2 | null {
  const u = state.units[id];
  if (u) {
    return u.position;
  }
  const b = state.buildings[id];
  if (b) {
    return b.position;
  }
  return null;
}

function clearAttackersForTarget(state: MatchState, targetId: string): void {
  for (const u of Object.values(state.units)) {
    if (u.attackTargetEntityId === targetId) {
      clearAttackState(u);
    }
  }
}

export function tryApplyAttack(
  state: MatchState,
  cmd: Extract<AnyCommandEnvelope, { kind: "attack" }>,
  currentTick: number,
): AttackApplyResult {
  const { playerId, payload } = cmd;
  const { attackerEntityId, targetEntityId } = payload;

  if (!state.players[playerId]) {
    return { ok: false, reason: "unknown_player" };
  }
  const attacker = state.units[attackerEntityId];
  if (!attacker) {
    return { ok: false, reason: "attacker_not_found" };
  }
  if (attacker.ownerPlayerId !== playerId) {
    return { ok: false, reason: "wrong_owner" };
  }
  if (attacker.type === UnitType.Worker) {
    return { ok: false, reason: "attacker_cannot_attack" };
  }
  if (attackerEntityId === targetEntityId) {
    return { ok: false, reason: "cannot_attack_self" };
  }

  const tgtUnit = state.units[targetEntityId];
  const tgtBuilding = state.buildings[targetEntityId];
  if (state.resourceNodes[targetEntityId] !== undefined) {
    return { ok: false, reason: "invalid_target_type" };
  }
  if (!tgtUnit && !tgtBuilding) {
    return { ok: false, reason: "target_not_found" };
  }

  if (tgtUnit) {
    if (tgtUnit.ownerPlayerId === attacker.ownerPlayerId) {
      return { ok: false, reason: "friendly_target" };
    }
  } else if (tgtBuilding) {
    if (tgtBuilding.ownerPlayerId === attacker.ownerPlayerId) {
      return { ok: false, reason: "friendly_target" };
    }
  }

  clearMovementState(attacker);
  clearGather(attacker);
  attacker.attackTargetEntityId = targetEntityId;
  attacker.isAttacking = true;
  attacker.nextAttackAllowedTick = currentTick;

  return { ok: true, attackerId: attackerEntityId, targetId: targetEntityId };
}

/**
 * Önce geçersiz saldırı hedeflerini temizler, sonra menzil + cooldown ile hasar uygular.
 * Sıra: `MatchSession` içinde hareketten sonra, gather’dan önce.
 */
export function resolveCombatTick(
  state: MatchState,
  tick: number,
  hooks: CombatTickHooks,
): void {
  if (state.phase !== MatchPhase.Running) {
    return;
  }

  for (const u of Object.values(state.units)) {
    if (!u.isAttacking || !u.attackTargetEntityId) {
      continue;
    }
    const tid = u.attackTargetEntityId;
    const tpos = getTargetPosition(state, tid);
    if (!tpos) {
      clearAttackState(u);
      continue;
    }
    const tu = state.units[tid];
    const tb = state.buildings[tid];
    if (tu && tu.ownerPlayerId === u.ownerPlayerId) {
      clearAttackState(u);
      continue;
    }
    if (tb && tb.ownerPlayerId === u.ownerPlayerId) {
      clearAttackState(u);
      continue;
    }
  }

  const attackers = Object.values(state.units)
    .filter((u) => u.isAttacking && u.attackTargetEntityId !== null)
    .sort((a, b) => a.id.localeCompare(b.id));

  for (const a of attackers) {
    if (state.phase !== MatchPhase.Running) {
      return;
    }
    if (!a.isAttacking || !a.attackTargetEntityId) {
      continue;
    }

    const tid = a.attackTargetEntityId;
    const tpos = getTargetPosition(state, tid);
    if (!tpos) {
      clearAttackState(a);
      continue;
    }
    if (dist(a.position, tpos) > a.attackRange) {
      continue;
    }
    if (tick < a.nextAttackAllowedTick) {
      continue;
    }

    const tgtUnit = state.units[tid];
    const tgtBuilding = state.buildings[tid];
    if (!tgtUnit && !tgtBuilding) {
      clearAttackState(a);
      continue;
    }

    const dmg = a.attackDamage;

    if (tgtUnit) {
      if (tgtUnit.ownerPlayerId === a.ownerPlayerId) {
        clearAttackState(a);
        continue;
      }
      tgtUnit.hp -= dmg;
      hooks.onHit?.({
        attackerId: a.id,
        targetId: tid,
        damage: dmg,
        targetHpAfter: tgtUnit.hp,
        kind: "unit",
      });
      a.nextAttackAllowedTick = tick + a.attackIntervalTicks;
      if (tgtUnit.hp <= 0) {
        hooks.onDeath?.({ entityId: tid, kind: "unit" });
        delete state.units[tid];
        clearAttackersForTarget(state, tid);
      }
      continue;
    }

    if (tgtBuilding) {
      if (tgtBuilding.ownerPlayerId === a.ownerPlayerId) {
        clearAttackState(a);
        continue;
      }
      const isMain = tgtBuilding.type === BuildingType.MainBase;
      const owner = tgtBuilding.ownerPlayerId;
      tgtBuilding.hp -= dmg;
      hooks.onHit?.({
        attackerId: a.id,
        targetId: tid,
        damage: dmg,
        targetHpAfter: tgtBuilding.hp,
        kind: "building",
      });
      a.nextAttackAllowedTick = tick + a.attackIntervalTicks;
      if (tgtBuilding.hp <= 0) {
        hooks.onDeath?.({ entityId: tid, kind: "building" });
        delete state.buildings[tid];
        clearAttackersForTarget(state, tid);
        if (isMain) {
          hooks.onMainBaseDestroyed?.(owner);
          return;
        }
      }
    }
  }
}
