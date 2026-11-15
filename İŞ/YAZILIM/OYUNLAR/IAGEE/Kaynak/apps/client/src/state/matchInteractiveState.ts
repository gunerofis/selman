import type { BuildingType } from "@rift-empire/shared";
import type { MatchViewCamera } from "../browser/matchViewCamera.js";
import { defaultMatchViewCamera } from "../browser/matchViewCamera.js";

export type SelectedEntityKind = "unit" | "building" | null;

export type HoverEntityKind = "unit" | "building" | "resourceNode" | null;

/** Browser-only; authoritative `match_state` ile karıştırılmaz. */
export type BuildModeType = BuildingType.DropOff | BuildingType.Production;

export interface MatchInteractiveState {
  selectedEntityId: string | null;
  selectedEntityKind: SelectedEntityKind;
  /** Düşman seçildiğinde true — komut verilmez, yalnızca bilgi. */
  selectionInspectOnly: boolean;
  hoverEntityId: string | null;
  hoverEntityKind: HoverEntityKind;
  lastIssuedContextCommand: string | null;
  /** Worker `selectedEntityId` ile build modu; sol tık world pozisyonunda `queueBuild`. */
  buildMode: BuildModeType | null;
  /** Tuval pan / zoom (yalnızca istemci). */
  camera: MatchViewCamera;
  /** Hasar flash: entityId → performance.now() sonrası. */
  damageFlashUntil: Map<string, number>;
  prevUnitHp: Map<string, number>;
  prevBuildingHp: Map<string, number>;
}

export function createMatchInteractiveState(): MatchInteractiveState {
  return {
    selectedEntityId: null,
    selectedEntityKind: null,
    selectionInspectOnly: false,
    hoverEntityId: null,
    hoverEntityKind: null,
    lastIssuedContextCommand: null,
    buildMode: null,
    camera: defaultMatchViewCamera(),
    damageFlashUntil: new Map(),
    prevUnitHp: new Map(),
    prevBuildingHp: new Map(),
  };
}

export function resetMatchInteractiveState(s: MatchInteractiveState): void {
  s.selectedEntityId = null;
  s.selectedEntityKind = null;
  s.selectionInspectOnly = false;
  s.hoverEntityId = null;
  s.hoverEntityKind = null;
  s.lastIssuedContextCommand = null;
  s.buildMode = null;
  s.camera = defaultMatchViewCamera();
  s.damageFlashUntil.clear();
  s.prevUnitHp.clear();
  s.prevBuildingHp.clear();
}
