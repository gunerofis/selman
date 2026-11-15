import type { AnyCommandEnvelope } from "@rift-empire/shared";
import type { PlayerId } from "@rift-empire/shared";
import { BuildingType, UnitType } from "@rift-empire/shared";
import type { Vec2 } from "@rift-empire/shared";

export interface EnvelopeContext {
  commandId: number;
  issuedAtTick: number;
}

export function buildGatherCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
  workerEntityId: string,
  resourceNodeId: string,
): Extract<AnyCommandEnvelope, { kind: "gather" }> {
  return {
    playerId,
    kind: "gather",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: { workerEntityId, resourceNodeId },
  };
}

export function buildBuildCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
  builderUnitId: string,
  buildingType: BuildingType,
  position: Vec2,
): Extract<AnyCommandEnvelope, { kind: "build" }> {
  return {
    playerId,
    kind: "build",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: { builderUnitId, buildingType, position },
  };
}

export function buildTrainCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
  productionBuildingId: string,
  unitType: UnitType,
): Extract<AnyCommandEnvelope, { kind: "train" }> {
  return {
    playerId,
    kind: "train",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: { productionBuildingId, unitType },
  };
}

export function buildMoveCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
  unitIds: string[],
  target: Vec2,
): Extract<AnyCommandEnvelope, { kind: "move" }> {
  return {
    playerId,
    kind: "move",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: { unitIds, target },
  };
}

export function buildAttackCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
  attackerEntityId: string,
  targetEntityId: string,
): Extract<AnyCommandEnvelope, { kind: "attack" }> {
  return {
    playerId,
    kind: "attack",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: { attackerEntityId, targetEntityId },
  };
}

export function buildSurrenderCommand(
  ctx: EnvelopeContext,
  playerId: PlayerId,
): Extract<AnyCommandEnvelope, { kind: "surrender" }> {
  return {
    playerId,
    kind: "surrender",
    issuedAtTick: ctx.issuedAtTick,
    commandId: ctx.commandId,
    payload: {},
  };
}
