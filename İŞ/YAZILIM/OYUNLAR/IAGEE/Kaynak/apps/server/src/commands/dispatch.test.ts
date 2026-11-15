import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPrototype1v1MatchState,
  MatchPhase,
  type AnyCommandEnvelope,
  type MatchState,
} from "@rift-empire/shared";
import { dispatchCommand, otherPlayerId, type IMatchCommandContext } from "./dispatch.js";

function baseCtx(state: MatchState): IMatchCommandContext {
  return {
    state,
    end: () => {},
    bumpStub: () => {},
    recordProcessed: () => {},
    applyGatherCommand: () => ({ ok: false, reason: "stub" }),
    applyBuildCommand: () => ({ ok: false, reason: "stub" }),
    applyTrainCommand: () => ({ ok: false, reason: "stub" }),
    applyMoveCommand: () => ({ ok: false, reason: "stub" }),
    applyAttackCommand: () => ({ ok: false, reason: "stub" }),
    applySurrenderCommand: () => ({ ok: false, reason: "stub" }),
  };
}

test("dispatchCommand routes move and returns applied outcome", () => {
  const state = createPrototype1v1MatchState("m-dispatch");
  state.phase = MatchPhase.Running;
  const cmd: AnyCommandEnvelope = {
    kind: "move",
    playerId: "p0",
    issuedAtTick: 0,
    commandId: 42,
    payload: { unitIds: ["unit-p0-w0"], target: { x: 70, y: 100 } },
  };
  const ctx: IMatchCommandContext = {
    ...baseCtx(state),
    applyMoveCommand: () => ({ ok: true }),
  };
  const o = dispatchCommand(ctx, cmd, "room-x");
  assert.equal(o.status, "applied");
  assert.equal(o.kind, "move");
  assert.equal(o.commandId, 42);
});

test("dispatchCommand returns rejected_in_simulation when apply fails", () => {
  const state = createPrototype1v1MatchState("m-dispatch2");
  state.phase = MatchPhase.Running;
  const cmd: AnyCommandEnvelope = {
    kind: "gather",
    playerId: "p0",
    issuedAtTick: 0,
    commandId: 1,
    payload: { workerEntityId: "unit-p0-w0", resourceNodeId: "resource-node-near-p0" },
  };
  const ctx: IMatchCommandContext = {
    ...baseCtx(state),
    applyGatherCommand: () => ({ ok: false, reason: "not_in_range" }),
  };
  const o = dispatchCommand(ctx, cmd, "room-x");
  assert.equal(o.status, "rejected_in_simulation");
  if (o.status === "rejected_in_simulation") {
    assert.equal(o.reasonCode, "not_in_range");
  }
});

test("otherPlayerId returns peer in 1v1 state", () => {
  const state = createPrototype1v1MatchState("m-op");
  assert.equal(otherPlayerId(state, "p0"), "p1");
  assert.equal(otherPlayerId(state, "p1"), "p0");
});
