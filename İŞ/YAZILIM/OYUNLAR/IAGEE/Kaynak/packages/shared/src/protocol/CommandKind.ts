/** Client → server komut ailesi — davranış sonraki aşamalarda (docs\03, \08). */
export type CommandKind =
  | "move"
  | "attack"
  | "gather"
  | "build"
  | "train"
  | "surrender";
