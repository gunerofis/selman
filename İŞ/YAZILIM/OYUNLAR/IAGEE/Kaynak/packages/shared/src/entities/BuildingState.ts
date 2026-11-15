import type { EntityId, PlayerId } from "../ids.js";
import type { Vec2 } from "./Vec2.js";
import type { BuildingType } from "./BuildingType.js";

export interface BuildingState {
  id: EntityId;
  ownerPlayerId: PlayerId;
  position: Vec2;
  hp: number;
  maxHp: number;
  type: BuildingType;
  /** İlk sürümde tamamlanmış spawn; ileride inşa süreci için kullanılabilir. */
  isConstructed: boolean;
}
