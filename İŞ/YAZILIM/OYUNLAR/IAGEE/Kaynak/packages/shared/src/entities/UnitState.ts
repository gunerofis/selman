import type { EntityId, PlayerId } from "../ids.js";
import type { Vec2 } from "./Vec2.js";
import type { UnitType } from "./UnitType.js";

export interface UnitState {
  id: EntityId;
  ownerPlayerId: PlayerId;
  position: Vec2;
  hp: number;
  maxHp: number;
  type: UnitType;
  /** Aktif gather hedefi; yoksa nötr. */
  gatherTargetNodeId: EntityId | null;
  isGathering: boolean;
  /** `tick >= nextGatherAllowedTick` iken bir pulse uygulanır (basit zamanlama). */
  nextGatherAllowedTick: number;
  /** Hareket hedefi; dururken `null`. */
  moveTargetPosition: Vec2 | null;
  isMoving: boolean;
  /** Hareket halindeyken kullanılan hız (tick başına); dururken 0. */
  moveSpeed: number;
  /** Aktif saldırı hedefi (unit veya building id); yoksa `null`. */
  attackTargetEntityId: EntityId | null;
  isAttacking: boolean;
  attackRange: number;
  attackDamage: number;
  attackIntervalTicks: number;
  /** `tick >= nextAttackAllowedTick` iken menzil içindeyse vuruş uygulanır. */
  nextAttackAllowedTick: number;
}
