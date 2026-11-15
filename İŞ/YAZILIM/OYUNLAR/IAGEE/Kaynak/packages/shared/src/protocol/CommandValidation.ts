/** Sunucu validation / enqueue reddi için kısa reason kodları. */
export type CommandRejectionReason =
  | "phase_not_running"
  | "missing_or_invalid_fields"
  | "unknown_player"
  | "issued_tick_out_of_range"
  | "payload_kind_mismatch";

export type CommandValidationResult =
  | { ok: true }
  | { ok: false; reason: CommandRejectionReason };
