import type { ServerTransportMessage } from "@rift-empire/shared";
import { SIMULATION_OUTCOME_HISTORY_MAX, type ClientStore } from "../state/clientStore.js";

/** Sunucu mesajını store’a yazar; `match_state` ile güncellenen tick dışarı döner. */
export function applyServerMessage(
  store: ClientStore,
  msg: ServerTransportMessage,
): { tick?: number; clearPendingCommands?: boolean } {
  function clearMatchDerivedSnapshots(): void {
    store.matchStatePayload = null;
    store.matchResultPayload = null;
    store.lastAck = null;
    store.lastResolvedCommand = null;
    store.lastSimulationOutcome = null;
    store.simulationOutcomeHistory = [];
  }

  switch (msg.kind) {
    case "room_state": {
      store.lastError = null;
      const prevRoomId = store.roomStatePayload?.roomId;
      store.roomStatePayload = msg.payload;
      if (msg.payload.roomState === "cleaned") {
        clearMatchDerivedSnapshots();
        return { clearPendingCommands: true };
      }
      if (prevRoomId !== undefined && msg.payload.roomId !== prevRoomId) {
        clearMatchDerivedSnapshots();
        return { clearPendingCommands: true };
      }
      return {};
    }
    case "match_state":
      store.matchStatePayload = msg.payload;
      return { tick: msg.payload.tick };
    case "match_result":
      store.lastError = null;
      store.matchResultPayload = msg.payload;
      return {};
    case "event":
      store.lastEvent = msg.payload;
      return {};
    case "error":
      store.lastError = msg.payload;
      return {};
    case "ack": {
      store.lastAck = msg.payload;
      const p = msg.payload;
      store.lastResolvedCommand = {
        commandId: p.commandId,
        roomId: p.roomId,
        forKind: p.forKind,
        ok: p.ok,
        reasonCode: p.reasonCode,
      };
      return {};
    }
    case "command_outcome": {
      const p = msg.payload;
      store.lastSimulationOutcome = p;
      store.simulationOutcomeHistory.push(p);
      while (store.simulationOutcomeHistory.length > SIMULATION_OUTCOME_HISTORY_MAX) {
        store.simulationOutcomeHistory.shift();
      }
      return {};
    }
    default:
      return {};
  }
}
