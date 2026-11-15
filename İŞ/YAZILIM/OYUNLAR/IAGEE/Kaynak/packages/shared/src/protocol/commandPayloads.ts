import type { BuildingType } from "../entities/BuildingType.js";
import type { UnitType } from "../entities/UnitType.js";
import type { Vec2 } from "../entities/Vec2.js";

export interface MoveCommandPayload {
  unitIds: string[];
  target: Vec2;
}

export interface AttackCommandPayload {
  attackerEntityId: string;
  targetEntityId: string;
}

export interface GatherCommandPayload {
  workerEntityId: string;
  resourceNodeId: string;
}

export interface BuildCommandPayload {
  /** Yerleştirmeyi talep eden worker. */
  builderUnitId: string;
  buildingType: BuildingType;
  position: Vec2;
}

/** Üretim binası üzerinden anlık unit oluşturma (Aşama 7). */
export interface TrainCommandPayload {
  /** `BuildingType.Production` olan bina id’si. */
  productionBuildingId: string;
  /** Üretilecek unit tipi (`Worker` | `Melee` | `Ranged`). */
  unitType: UnitType;
}

export interface SurrenderCommandPayload {
  note?: string;
}
