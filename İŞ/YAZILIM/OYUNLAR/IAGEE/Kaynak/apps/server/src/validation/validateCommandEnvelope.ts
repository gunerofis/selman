import {
  isAnyCommandEnvelope,
  MatchPhase,
  type AnyCommandEnvelope,
  type CommandValidationResult,
  type MatchState,
} from "@rift-empire/shared";

/** Basit tick penceresi: çok eski veya çok ileri `issuedAtTick` reddedilir. */
const MAX_TICK_LAG = 30;
const MAX_TICK_AHEAD = 2;

export function validateCommandEnvelope(
  state: MatchState,
  raw: unknown,
): CommandValidationResult {
  if (!isAnyCommandEnvelope(raw)) {
    return { ok: false, reason: "missing_or_invalid_fields" };
  }
  const cmd = raw as AnyCommandEnvelope;
  if (state.phase !== MatchPhase.Running) {
    return { ok: false, reason: "phase_not_running" };
  }
  if (!state.players[cmd.playerId]) {
    return { ok: false, reason: "unknown_player" };
  }
  if (cmd.issuedAtTick < 0 || cmd.issuedAtTick > state.tick + MAX_TICK_AHEAD) {
    return { ok: false, reason: "issued_tick_out_of_range" };
  }
  if (cmd.issuedAtTick < state.tick - MAX_TICK_LAG) {
    return { ok: false, reason: "issued_tick_out_of_range" };
  }
  if (!payloadMatchesKind(cmd)) {
    return { ok: false, reason: "payload_kind_mismatch" };
  }
  return { ok: true };
}

function payloadMatchesKind(cmd: AnyCommandEnvelope): boolean {
  const p = cmd.payload;
  switch (cmd.kind) {
    case "move": {
      const m = p as { unitIds?: unknown; target?: unknown };
      const t = m.target as { x?: unknown; y?: unknown } | null;
      const idsOk =
        Array.isArray(m.unitIds) &&
        m.unitIds.length > 0 &&
        m.unitIds.every((id) => typeof id === "string");
      return (
        idsOk &&
        t !== null &&
        typeof t === "object" &&
        typeof t.x === "number" &&
        typeof t.y === "number"
      );
    }
    case "attack":
      return (
        typeof (p as { attackerEntityId?: unknown }).attackerEntityId === "string" &&
        typeof (p as { targetEntityId?: unknown }).targetEntityId === "string"
      );
    case "gather":
      return (
        typeof (p as { workerEntityId?: unknown }).workerEntityId === "string" &&
        typeof (p as { resourceNodeId?: unknown }).resourceNodeId === "string"
      );
    case "build": {
      const b = p as {
        builderUnitId?: unknown;
        buildingType?: unknown;
        position?: unknown;
      };
      const pos = b.position as { x?: unknown; y?: unknown } | null;
      return (
        typeof b.builderUnitId === "string" &&
        typeof b.buildingType === "string" &&
        pos !== null &&
        typeof pos === "object" &&
        typeof pos.x === "number" &&
        typeof pos.y === "number"
      );
    }
    case "train":
      return (
        typeof (p as { productionBuildingId?: unknown }).productionBuildingId === "string" &&
        typeof (p as { unitType?: unknown }).unitType === "string"
      );
    case "surrender":
      return p === null || typeof p === "object";
    default:
      return false;
  }
}
