import assert from "node:assert/strict";
import { test } from "node:test";
import { isClientTransportMessage, isServerTransportMessage } from "./guards.js";

test("isClientTransportMessage accepts join_room", () => {
  const ok = isClientTransportMessage({
    kind: "join_room",
    payload: { guestId: "a" },
  });
  assert.equal(ok, true);
});

test("isClientTransportMessage rejects unknown kind", () => {
  assert.equal(
    isClientTransportMessage({
      kind: "unknown",
      payload: {},
    }),
    false,
  );
});

test("isServerTransportMessage accepts room_state", () => {
  assert.equal(
    isServerTransportMessage({
      kind: "room_state",
      payload: { roomId: "r" },
    }),
    true,
  );
});

test("isServerTransportMessage rejects non-object payload", () => {
  assert.equal(
    isServerTransportMessage({
      kind: "match_state",
      payload: null,
    }),
    false,
  );
});
