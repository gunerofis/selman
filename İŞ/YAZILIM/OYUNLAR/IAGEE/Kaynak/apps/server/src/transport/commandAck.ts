import type { AckPayload } from "@rift-empire/shared";

export function makeCommandAck(
  roomId: string,
  commandId: number,
  ok: boolean,
  reasonCode?: string,
): AckPayload {
  const base: AckPayload = {
    forKind: "enqueue_command",
    ok,
    commandId,
    roomId,
  };
  if (reasonCode !== undefined && reasonCode !== "") {
    return { ...base, reasonCode };
  }
  return base;
}

export function tryCommandIdFromUnknownCommand(raw: unknown): number {
  if (raw === null || typeof raw !== "object") {
    return 0;
  }
  const id = (raw as { commandId?: unknown }).commandId;
  return typeof id === "number" && Number.isFinite(id) ? id : 0;
}
