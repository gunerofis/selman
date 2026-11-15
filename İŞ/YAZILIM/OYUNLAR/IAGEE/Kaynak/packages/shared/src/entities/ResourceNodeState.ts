import type { EntityId } from "../ids.js";
import type { Vec2 } from "./Vec2.js";

export interface ResourceNodeState {
  id: EntityId;
  position: Vec2;
  amountRemaining: number;
  maxAmount: number;
}
