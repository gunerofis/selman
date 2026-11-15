import assert from "node:assert/strict";
import { test } from "node:test";
import { createPrototype1v1MatchState, MatchPhase } from "@rift-empire/shared";
import { validateCommandEnvelope } from "./validateCommandEnvelope.js";

function runningMatch() {
  const s = createPrototype1v1MatchState("match-unit-test");
  s.phase = MatchPhase.Running;
  s.tick = 10;
  s.matchStartTick = 0;
  return s;
}

test("rejects non-object envelope", () => {
  const s = runningMatch();
  const r = validateCommandEnvelope(s, null);
  assert.equal(r.ok, false);
  assert.equal(r.reason, "missing_or_invalid_fields");
});

test("rejects when phase is not Running", () => {
  const s = createPrototype1v1MatchState("m2");
  assert.equal(s.phase, MatchPhase.Uninitialized);
  const r = validateCommandEnvelope(s, {
    kind: "move",
    playerId: "p0",
    issuedAtTick: 0,
    payload: { unitIds: ["u1"], target: { x: 1, y: 2 } },
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "phase_not_running");
});

test("rejects unknown player", () => {
  const s = runningMatch();
  const r = validateCommandEnvelope(s, {
    kind: "move",
    playerId: "p99",
    issuedAtTick: 10,
    payload: { unitIds: ["unit-p0-w0"], target: { x: 90, y: 100 } },
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "unknown_player");
});

test("rejects issuedAtTick too far in the past", () => {
  const s = runningMatch();
  const r = validateCommandEnvelope(s, {
    kind: "move",
    playerId: "p0",
    issuedAtTick: 0,
    payload: { unitIds: ["unit-p0-w0"], target: { x: 90, y: 100 } },
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "issued_tick_out_of_range");
});

test("rejects payload that does not match kind", () => {
  const s = runningMatch();
  const r = validateCommandEnvelope(s, {
    kind: "move",
    playerId: "p0",
    issuedAtTick: 10,
    payload: { oops: true },
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "payload_kind_mismatch");
});

test("accepts valid move envelope", () => {
  const s = runningMatch();
  const r = validateCommandEnvelope(s, {
    kind: "move",
    playerId: "p0",
    issuedAtTick: 10,
    payload: { unitIds: ["unit-p0-w0"], target: { x: 90, y: 100 } },
  });
  assert.equal(r.ok, true);
});
