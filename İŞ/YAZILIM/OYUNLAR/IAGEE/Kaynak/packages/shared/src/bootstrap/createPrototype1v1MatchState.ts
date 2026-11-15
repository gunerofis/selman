import type { EntityId, MatchId, PlayerId } from "../ids.js";
import type { BuildingState } from "../entities/BuildingState.js";
import { BuildingType } from "../entities/BuildingType.js";
import type { PlayerState } from "../entities/PlayerState.js";
import type { ResourceNodeState } from "../entities/ResourceNodeState.js";
import type { UnitState } from "../entities/UnitState.js";
import { UnitType } from "../entities/UnitType.js";
import type { Vec2 } from "../entities/Vec2.js";
import {
  PROTOTYPE_1V1_ECONOMY,
  PROTOTYPE_1V1_MAP,
  PROTOTYPE_1V1_PLAYER_IDS,
  PROTOTYPE_1V1_SLOTS,
} from "../content/prototype1v1Constants.js";
import { MatchPhase } from "../match/MatchPhase.js";
import type { MatchState } from "../match/MatchState.js";

function vec(x: number, y: number): Vec2 {
  return { x, y };
}

/**
 * İki oyuncu, ana üs, 3+3 worker, üç resource node (yakın / orta / yakın).
 * Phase: Uninitialized — `MatchSession.start()` ile Running olur.
 */
export function createPrototype1v1MatchState(matchId: MatchId): MatchState {
  const players: Record<string, PlayerState> = {};
  const units: Record<string, UnitState> = {};
  const buildings: Record<string, BuildingState> = {};
  const resourceNodes: Record<string, ResourceNodeState> = {};

  const midX = PROTOTYPE_1V1_MAP.WIDTH / 2;
  const midY = PROTOTYPE_1V1_MAP.HEIGHT / 2;

  const layouts: Array<{
    playerId: PlayerId;
    teamIndex: 0 | 1;
    basePos: Vec2;
    workerPositions: Vec2[];
  }> = [
    {
      playerId: PROTOTYPE_1V1_PLAYER_IDS[0],
      teamIndex: 0,
      basePos: vec(35, midY),
      workerPositions: [vec(52, midY), vec(48, midY - 10), vec(48, midY + 10)],
    },
    {
      playerId: PROTOTYPE_1V1_PLAYER_IDS[1],
      teamIndex: 1,
      basePos: vec(PROTOTYPE_1V1_MAP.WIDTH - 35, midY),
      workerPositions: [
        vec(PROTOTYPE_1V1_MAP.WIDTH - 52, midY),
        vec(PROTOTYPE_1V1_MAP.WIDTH - 48, midY - 10),
        vec(PROTOTYPE_1V1_MAP.WIDTH - 48, midY + 10),
      ],
    },
  ];

  for (const slot of layouts) {
    players[slot.playerId] = {
      id: slot.playerId,
      teamIndex: slot.teamIndex,
      resources: { primary: PROTOTYPE_1V1_ECONOMY.STARTING_PRIMARY_PER_PLAYER },
    };

    const baseId = `building-${slot.playerId}-main` as EntityId;
    buildings[baseId] = {
      id: baseId,
      ownerPlayerId: slot.playerId,
      position: { ...slot.basePos },
      hp: PROTOTYPE_1V1_ECONOMY.MAIN_BASE_HP,
      maxHp: PROTOTYPE_1V1_ECONOMY.MAIN_BASE_HP,
      type: BuildingType.MainBase,
      isConstructed: true,
    };

    for (let w = 0; w < PROTOTYPE_1V1_SLOTS.WORKERS_PER_PLAYER; w++) {
      const uid = `unit-${slot.playerId}-w${w}` as EntityId;
      units[uid] = {
        id: uid,
        ownerPlayerId: slot.playerId,
        position: { ...slot.workerPositions[w] },
        hp: PROTOTYPE_1V1_ECONOMY.WORKER_HP,
        maxHp: PROTOTYPE_1V1_ECONOMY.WORKER_HP,
        type: UnitType.Worker,
        gatherTargetNodeId: null,
        isGathering: false,
        nextGatherAllowedTick: 0,
        moveTargetPosition: null,
        isMoving: false,
        moveSpeed: 0,
        attackTargetEntityId: null,
        isAttacking: false,
        attackRange: 0,
        attackDamage: 0,
        attackIntervalTicks: 999,
        nextAttackAllowedTick: 0,
      };
    }
  }

  const nodes: Array<{ id: EntityId; pos: Vec2 }> = [
    { id: "resource-node-near-p0", pos: vec(62, midY) },
    { id: "resource-node-mid", pos: vec(midX, midY - 25) },
    { id: "resource-node-near-p1", pos: vec(PROTOTYPE_1V1_MAP.WIDTH - 62, midY) },
  ];

  for (const n of nodes) {
    resourceNodes[n.id] = {
      id: n.id,
      position: { ...n.pos },
      amountRemaining: PROTOTYPE_1V1_ECONOMY.RESOURCE_NODE_AMOUNT,
      maxAmount: PROTOTYPE_1V1_ECONOMY.RESOURCE_NODE_AMOUNT,
    };
  }

  return {
    matchId,
    tick: 0,
    phase: MatchPhase.Uninitialized,
    players,
    units,
    buildings,
    resourceNodes,
    result: null,
    matchStartTick: null,
    matchEndTick: null,
  };
}
