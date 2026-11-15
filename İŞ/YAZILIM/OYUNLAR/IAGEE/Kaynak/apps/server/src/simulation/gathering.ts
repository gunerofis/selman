import type { AnyCommandEnvelope, MatchState, PlayerId } from "@rift-empire/shared";
import {
  MatchPhase,
  PROTOTYPE_1V1_GATHER,
  UnitType,
} from "@rift-empire/shared";

export type GatherRejectReason =
  | "unknown_player"
  | "unit_not_found"
  | "not_worker"
  | "wrong_owner"
  | "node_not_found"
  | "node_depleted";

export type GatherBindResult =
  | { ok: true }
  | { ok: false; reason: GatherRejectReason };

export interface GatherPulseInfo {
  tick: number;
  playerId: PlayerId;
  workerId: string;
  nodeId: string;
  amount: number;
  nodeRemainingAfter: number;
}

function clearWorkerGather(unitId: string, state: MatchState): void {
  const u = state.units[unitId];
  if (!u) {
    return;
  }
  u.gatherTargetNodeId = null;
  u.isGathering = false;
  u.nextGatherAllowedTick = 0;
}

export function tryBindGather(
  state: MatchState,
  cmd: Extract<AnyCommandEnvelope, { kind: "gather" }>,
  currentTick: number,
): GatherBindResult {
  const { playerId, payload } = cmd;
  const { workerEntityId, resourceNodeId } = payload;

  if (!state.players[playerId]) {
    return { ok: false, reason: "unknown_player" };
  }
  const unit = state.units[workerEntityId];
  if (!unit) {
    return { ok: false, reason: "unit_not_found" };
  }
  if (unit.type !== UnitType.Worker) {
    return { ok: false, reason: "not_worker" };
  }
  if (unit.ownerPlayerId !== playerId) {
    return { ok: false, reason: "wrong_owner" };
  }
  const node = state.resourceNodes[resourceNodeId];
  if (!node) {
    return { ok: false, reason: "node_not_found" };
  }
  if (node.amountRemaining <= 0) {
    return { ok: false, reason: "node_depleted" };
  }

  unit.gatherTargetNodeId = resourceNodeId;
  unit.isGathering = true;
  unit.nextGatherAllowedTick = currentTick;

  return { ok: true };
}

export function resolveGatheringTick(
  state: MatchState,
  tick: number,
  onPulse: (info: GatherPulseInfo) => void,
): void {
  if (state.phase !== MatchPhase.Running) {
    return;
  }

  const { AMOUNT_PER_PULSE, INTERVAL_TICKS } = PROTOTYPE_1V1_GATHER;

  for (const unit of Object.values(state.units)) {
    if (unit.isMoving || unit.isAttacking) {
      continue;
    }
    if (!unit.isGathering || unit.gatherTargetNodeId === null) {
      continue;
    }

    const nodeId = unit.gatherTargetNodeId;
    const node = state.resourceNodes[nodeId];

    if (!node || node.amountRemaining <= 0) {
      clearWorkerGather(unit.id, state);
      continue;
    }

    if (tick < unit.nextGatherAllowedTick) {
      continue;
    }

    const amount = Math.min(AMOUNT_PER_PULSE, node.amountRemaining);
    node.amountRemaining -= amount;

    const player = state.players[unit.ownerPlayerId];
    if (player) {
      player.resources.primary += amount;
    }

    unit.nextGatherAllowedTick = tick + INTERVAL_TICKS;

    onPulse({
      tick,
      playerId: unit.ownerPlayerId,
      workerId: unit.id,
      nodeId,
      amount,
      nodeRemainingAfter: node.amountRemaining,
    });

    if (node.amountRemaining <= 0) {
      clearWorkerGather(unit.id, state);
    }
  }
}
