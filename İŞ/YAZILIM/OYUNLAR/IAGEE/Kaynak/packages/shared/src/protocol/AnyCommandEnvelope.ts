import type { PlayerId } from "../ids.js";
import type {
  AttackCommandPayload,
  BuildCommandPayload,
  GatherCommandPayload,
  MoveCommandPayload,
  SurrenderCommandPayload,
  TrainCommandPayload,
} from "./commandPayloads.js";

/** Ortak üst alanlar — `kind` + `payload` her dalda ayrı. */
export interface CommandEnvelopeBase {
  playerId: PlayerId;
  issuedAtTick: number;
  commandId: number;
}

export type AnyCommandEnvelope =
  | (CommandEnvelopeBase & { kind: "move"; payload: MoveCommandPayload })
  | (CommandEnvelopeBase & { kind: "attack"; payload: AttackCommandPayload })
  | (CommandEnvelopeBase & { kind: "gather"; payload: GatherCommandPayload })
  | (CommandEnvelopeBase & { kind: "build"; payload: BuildCommandPayload })
  | (CommandEnvelopeBase & { kind: "train"; payload: TrainCommandPayload })
  | (CommandEnvelopeBase & { kind: "surrender"; payload: SurrenderCommandPayload });
