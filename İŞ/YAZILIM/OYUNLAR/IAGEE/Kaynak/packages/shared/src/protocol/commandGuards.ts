import type { CommandKind } from "./CommandKind.js";
import type { AnyCommandEnvelope } from "./AnyCommandEnvelope.js";

const KINDS: ReadonlySet<CommandKind> = new Set([
  "move",
  "attack",
  "gather",
  "build",
  "train",
  "surrender",
]);

/** Şema düzeyinde yüzeysel kontrol; sunucu validation tam doğrulama yapar. */
export function isAnyCommandEnvelope(value: unknown): value is AnyCommandEnvelope {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (typeof o.playerId !== "string") {
    return false;
  }
  if (typeof o.kind !== "string" || !KINDS.has(o.kind as CommandKind)) {
    return false;
  }
  if (typeof o.issuedAtTick !== "number" || !Number.isFinite(o.issuedAtTick)) {
    return false;
  }
  if (typeof o.commandId !== "number" || !Number.isFinite(o.commandId)) {
    return false;
  }
  if (o.payload === null || typeof o.payload !== "object") {
    return false;
  }
  return true;
}
