import type {
  AnyCommandEnvelope,
  CommandKind,
  CommandSimulationOutcomePayload,
  EndReason,
  MatchState,
  PlayerId,
} from "@rift-empire/shared";

/** `MatchSession` ile döngüsel import yok; sadece ihtiyaç duyulan yüzey. */
export type ApplyCommandResult = { ok: true } | { ok: false; reason: string };

/** `MatchSession` ile döngüsel import yok; sadece ihtiyaç duyulan yüzey. */
export interface IMatchCommandContext {
  readonly state: MatchState;
  end(reason: EndReason, winnerPlayerId: PlayerId | null, loserPlayerId: PlayerId | null): void;
  bumpStub(kind: CommandKind): void;
  recordProcessed(cmd: AnyCommandEnvelope): void;
  applyGatherCommand(cmd: Extract<AnyCommandEnvelope, { kind: "gather" }>): ApplyCommandResult;
  applyBuildCommand(cmd: Extract<AnyCommandEnvelope, { kind: "build" }>): ApplyCommandResult;
  applyTrainCommand(cmd: Extract<AnyCommandEnvelope, { kind: "train" }>): ApplyCommandResult;
  applyMoveCommand(cmd: Extract<AnyCommandEnvelope, { kind: "move" }>): ApplyCommandResult;
  applyAttackCommand(cmd: Extract<AnyCommandEnvelope, { kind: "attack" }>): ApplyCommandResult;
  applySurrenderCommand(cmd: Extract<AnyCommandEnvelope, { kind: "surrender" }>): ApplyCommandResult;
}

function otherPlayerId(state: MatchState, playerId: PlayerId): PlayerId | null {
  const ids = Object.keys(state.players);
  return ids.find((id) => id !== playerId) ?? null;
}

function buildOutcome(
  roomId: string,
  cmd: AnyCommandEnvelope,
  r: ApplyCommandResult,
): CommandSimulationOutcomePayload {
  if (r.ok) {
    return {
      roomId,
      commandId: cmd.commandId,
      kind: cmd.kind,
      status: "applied",
    };
  }
  return {
    roomId,
    commandId: cmd.commandId,
    kind: cmd.kind,
    status: "rejected_in_simulation",
    reasonCode: r.reason,
  };
}

export function dispatchCommand(
  ctx: IMatchCommandContext,
  cmd: AnyCommandEnvelope,
  roomId: string,
): CommandSimulationOutcomePayload {
  ctx.recordProcessed(cmd);

  switch (cmd.kind) {
    case "move":
      return buildOutcome(roomId, cmd, ctx.applyMoveCommand(cmd));
    case "attack":
      return buildOutcome(roomId, cmd, ctx.applyAttackCommand(cmd));
    case "gather":
      return buildOutcome(roomId, cmd, ctx.applyGatherCommand(cmd));
    case "build":
      return buildOutcome(roomId, cmd, ctx.applyBuildCommand(cmd));
    case "train":
      return buildOutcome(roomId, cmd, ctx.applyTrainCommand(cmd));
    case "surrender": {
      const r = ctx.applySurrenderCommand(cmd);
      return buildOutcome(roomId, cmd, r);
    }
    default: {
      const _exhaustive: never = cmd;
      return _exhaustive;
    }
  }
}

export { otherPlayerId };
