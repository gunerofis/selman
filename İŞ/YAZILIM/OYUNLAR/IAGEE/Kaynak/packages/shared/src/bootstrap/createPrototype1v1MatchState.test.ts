import assert from "node:assert/strict";
import { test } from "node:test";
import { MatchPhase } from "../match/MatchPhase.js";
import { createPrototype1v1MatchState } from "./createPrototype1v1MatchState.js";

test("prototype 1v1 state has two players, bases, and resource nodes", () => {
  const s = createPrototype1v1MatchState("m-proto-test");
  assert.equal(s.phase, MatchPhase.Uninitialized);
  assert.ok(s.players.p0);
  assert.ok(s.players.p1);
  const bases = Object.values(s.buildings).filter((b) => b.type === "main_base");
  assert.equal(bases.length, 2);
  assert.ok(s.resourceNodes["resource-node-mid"]);
  const workers = Object.values(s.units).filter((u) => u.type === "worker");
  assert.ok(workers.length >= 2);
});
