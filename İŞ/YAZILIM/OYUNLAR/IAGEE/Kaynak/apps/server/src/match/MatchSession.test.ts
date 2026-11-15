import assert from "node:assert/strict";
import { test } from "node:test";
import { MatchPhase } from "@rift-empire/shared";
import { MatchSession } from "./MatchSession.js";

test("MatchSession start sets Running and tick window accepts commands", () => {
  const s = new MatchSession("match-s1", "room-s1");
  s.initialize();
  assert.equal(s.state.phase, MatchPhase.Uninitialized);
  s.start();
  assert.equal(s.state.phase, MatchPhase.Running);
  assert.equal(s.state.matchStartTick, s.state.tick);
});

test("enqueueCommand rejects when phase is not Running", () => {
  const s = new MatchSession("match-s2", "room-s2");
  s.initialize();
  s.enqueueCommand({
    kind: "surrender",
    playerId: "p0",
    issuedAtTick: 0,
    commandId: 1,
    payload: {},
  });
  assert.equal(s.getDebugReadout().rejectedEnqueueCount, 1);
  assert.equal(s.getDebugReadout().acceptedEnqueueCount, 0);
});

test("gather command drains on tickOnce with applied outcome", () => {
  const s = new MatchSession("match-s3", "room-s3");
  s.initialize();
  s.start();
  s.enqueueCommand({
    kind: "gather",
    playerId: "p0",
    issuedAtTick: 0,
    commandId: 10,
    payload: {
      workerEntityId: "unit-p0-w0",
      resourceNodeId: "resource-node-near-p0",
    },
  });
  s.tickOnce();
  const out = s.takeSimulationOutcomes();
  assert.equal(out.length, 1);
  assert.equal(out[0]!.status, "applied");
  assert.equal(out[0]!.kind, "gather");
});

test("surrender ends match on tickOnce", () => {
  const s = new MatchSession("match-s4", "room-s4");
  s.initialize();
  s.start();
  s.enqueueCommand({
    kind: "surrender",
    playerId: "p1",
    issuedAtTick: 0,
    commandId: 2,
    payload: {},
  });
  s.tickOnce();
  assert.equal(s.state.phase, MatchPhase.Ended);
  assert.equal(s.state.result?.winnerPlayerId, "p0");
  assert.equal(s.state.result?.loserPlayerId, "p1");
});
