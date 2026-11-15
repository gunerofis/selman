export type { EntityId, PlayerId, MatchId } from "./ids.js";
export { MatchPhase } from "./match/MatchPhase.js";
export type { EndReason } from "./match/EndReason.js";
export type { MatchResult } from "./match/MatchResult.js";
export type { MatchState } from "./match/MatchState.js";
export { createInitialMatchState } from "./match/createInitialMatchState.js";
export { createPrototype1v1MatchState } from "./bootstrap/createPrototype1v1MatchState.js";
export {
  PROTOTYPE_1V1_ECONOMY,
  PROTOTYPE_1V1_GATHER,
  PROTOTYPE_1V1_BUILD,
  PROTOTYPE_1V1_MAP,
  PROTOTYPE_1V1_PLAYER_IDS,
  PROTOTYPE_1V1_SLOTS,
  PROTOTYPE_1V1_TRAIN,
  PROTOTYPE_1V1_MOVE,
  PROTOTYPE_1V1_COMBAT,
} from "./content/prototype1v1Constants.js";
export type { Prototype1v1PlayerSlot } from "./content/prototype1v1Constants.js";
export type { PlayerState } from "./entities/PlayerState.js";
export type { UnitState } from "./entities/UnitState.js";
export type { BuildingState } from "./entities/BuildingState.js";
export type { ResourceNodeState } from "./entities/ResourceNodeState.js";
export type { Vec2 } from "./entities/Vec2.js";
export { UnitType } from "./entities/UnitType.js";
export { BuildingType } from "./entities/BuildingType.js";
export type { CommandKind } from "./protocol/CommandKind.js";
export type { CommandEnvelope } from "./protocol/CommandEnvelope.js";
export type {
  AnyCommandEnvelope,
  CommandEnvelopeBase,
} from "./protocol/AnyCommandEnvelope.js";
export type {
  MoveCommandPayload,
  AttackCommandPayload,
  GatherCommandPayload,
  BuildCommandPayload,
  TrainCommandPayload,
  SurrenderCommandPayload,
} from "./protocol/commandPayloads.js";
export { isAnyCommandEnvelope } from "./protocol/commandGuards.js";
export type {
  CommandRejectionReason,
  CommandValidationResult,
} from "./protocol/CommandValidation.js";
export type {
  RoomLifecycleState,
  RoomStatePayload,
  MatchStatePayload,
  MatchResultPayload,
  TransportEventKind,
  TransportEventPayload,
  TransportErrorPayload,
  AckPayload,
  CommandSimulationOutcomePayload,
  SimulationCommandOutcomeStatus,
  ClientTransportMessage,
  JoinRoomPayload,
  StartMatchPayload,
  EnqueueCommandPayload,
  GetRoomStatePayload,
  CleanupRoomPayload,
  ServerTransportMessage,
} from "./transport/index.js";
export { isClientTransportMessage, isServerTransportMessage } from "./transport/index.js";
