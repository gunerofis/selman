import assert from "node:assert/strict";
import { test } from "node:test";
import { isAnyCommandEnvelope } from "./commandGuards.js";

test("isAnyCommandEnvelope accepts minimal valid gather", () => {
  assert.equal(
    isAnyCommandEnvelope({
      kind: "gather",
      playerId: "p0",
      issuedAtTick: 0,
      commandId: 1,
      payload: { workerEntityId: "w", resourceNodeId: "n" },
    }),
    true,
  );
});

test("isAnyCommandEnvelope rejects missing commandId", () => {
  assert.equal(
    isAnyCommandEnvelope({
      kind: "gather",
      playerId: "p0",
      issuedAtTick: 0,
      payload: {},
    }),
    false,
  );
});
