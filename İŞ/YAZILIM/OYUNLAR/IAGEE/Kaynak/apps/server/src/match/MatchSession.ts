import {
  createPrototype1v1MatchState,
  MatchPhase,
  type AnyCommandEnvelope,
  type CommandKind,
  type CommandRejectionReason,
  type CommandSimulationOutcomePayload,
  type EndReason,
  type MatchId,
  type MatchState,
  type PlayerId,
} from "@rift-empire/shared";
import {
  dispatchCommand,
  otherPlayerId,
  type ApplyCommandResult,
  type IMatchCommandContext,
} from "../commands/dispatch.js";
import {
  resolveGatheringTick,
  tryBindGather,
  type GatherPulseInfo,
  type GatherRejectReason,
} from "../simulation/gathering.js";
import {
  tryApplyBuild,
  type BuildRejectReason,
} from "../simulation/buildingPlacement.js";
import {
  tryApplyTrain,
  type TrainRejectReason,
} from "../simulation/unitTraining.js";
import {
  resolveMovementTick,
  tryApplyMove,
  type MoveRejectReason,
} from "../simulation/unitMovement.js";
import {
  resolveCombatTick,
  tryApplyAttack,
  type AttackRejectReason,
  type CombatDeathInfo,
  type CombatHitInfo,
} from "../simulation/combat.js";
import { validateCommandEnvelope } from "../validation/validateCommandEnvelope.js";

export interface MatchSessionDebugReadout {
  acceptedEnqueueCount: number;
  rejectedEnqueueCount: number;
  lastRejection: { reason: CommandRejectionReason; atTick: number } | null;
  processedCount: number;
  lastProcessed: { kind: CommandKind; commandId: number; playerId: PlayerId } | null;
  stubCounts: Partial<Record<CommandKind, number>>;
  pendingLength: number;
  workersInGatherStateCount: number;
  lastGatherBindFailure: { reason: GatherRejectReason } | null;
  lastGatherPulse: GatherPulseInfo | null;
  lastBuildRejectReason: BuildRejectReason | null;
  lastBuildSuccess: {
    playerId: PlayerId;
    buildingId: string;
    buildingType: string;
    position: { x: number; y: number };
    costPaid: number;
  } | null;
  buildingCountByPlayer: Record<PlayerId, number>;
  lastTrainRejectReason: TrainRejectReason | null;
  lastTrainSuccess: {
    playerId: PlayerId;
    unitId: string;
    unitType: string;
    costPaid: number;
    productionBuildingId: string;
  } | null;
  unitCountByPlayer: Record<PlayerId, number>;
  lastMoveRejectReason: MoveRejectReason | null;
  lastMoveSuccess: {
    playerId: PlayerId;
    unitIds: string[];
    target: { x: number; y: number };
  } | null;
  unitsMovingCount: number;
  lastAttackRejectReason: AttackRejectReason | null;
  lastAttackBind: { attackerId: string; targetId: string } | null;
  lastCombatHit: CombatHitInfo | null;
  lastDeath: CombatDeathInfo | null;
  unitsAttackingCount: number;
  lastSimulationCommandOutcome: CommandSimulationOutcomePayload | null;
  recentSimulationCommandOutcomes: readonly CommandSimulationOutcomePayload[];
}

const RECENT_SIM_OUTCOMES_MAX = 16;

/**
 * Sunucu maç oturumu — lifecycle + tick + komut kuyruğu.
 */
export class MatchSession implements IMatchCommandContext {
  readonly state: MatchState;
  readonly roomId: string;
  readonly pendingCommands: AnyCommandEnvelope[] = [];

  private _acceptedEnqueueCount = 0;
  private _rejectedEnqueueCount = 0;
  private _lastRejection: { reason: CommandRejectionReason; atTick: number } | null = null;
  private _processedCount = 0;
  private _lastProcessed: {
    kind: CommandKind;
    commandId: number;
    playerId: PlayerId;
  } | null = null;
  private readonly _stubCounts: Partial<Record<CommandKind, number>> = {};
  private _lastGatherBindFailure: { reason: GatherRejectReason } | null = null;
  private _lastGatherPulse: GatherPulseInfo | null = null;
  private _nextPlacedBuildingSeq = 0;
  private _lastBuildRejectReason: BuildRejectReason | null = null;
  private _lastBuildSuccess: MatchSessionDebugReadout["lastBuildSuccess"] = null;
  private _nextSpawnedUnitSeq = 0;
  private _lastTrainRejectReason: TrainRejectReason | null = null;
  private _lastTrainSuccess: MatchSessionDebugReadout["lastTrainSuccess"] = null;
  private _lastMoveRejectReason: MoveRejectReason | null = null;
  private _lastMoveSuccess: MatchSessionDebugReadout["lastMoveSuccess"] = null;
  private _lastAttackRejectReason: AttackRejectReason | null = null;
  private _lastAttackBind: MatchSessionDebugReadout["lastAttackBind"] = null;
  private _lastCombatHit: CombatHitInfo | null = null;
  private _lastDeath: CombatDeathInfo | null = null;
  private _simulationOutcomesThisTick: CommandSimulationOutcomePayload[] = [];
  private _lastSimulationCommandOutcome: CommandSimulationOutcomePayload | null = null;
  private readonly _recentSimulationOutcomes: CommandSimulationOutcomePayload[] = [];

  constructor(matchId: MatchId, roomId: string) {
    this.state = createPrototype1v1MatchState(matchId);
    this.roomId = roomId;
  }

  initialize(): void {
    if (this.state.phase !== MatchPhase.Uninitialized) {
      return;
    }
    const playerCount = Object.keys(this.state.players).length;
    if (playerCount !== 2) {
      throw new Error(`MatchSession.initialize: beklenen 2 oyuncu, gelen ${playerCount}`);
    }
  }

  start(): void {
    if (this.state.phase !== MatchPhase.Uninitialized) {
      return;
    }
    this.state.phase = MatchPhase.Running;
    this.state.matchStartTick = this.state.tick;
  }

  enqueueCommand(raw: unknown): void {
    const v = validateCommandEnvelope(this.state, raw);
    if (!v.ok) {
      this._rejectedEnqueueCount += 1;
      this._lastRejection = { reason: v.reason, atTick: this.state.tick };
      return;
    }
    this._acceptedEnqueueCount += 1;
    this.pendingCommands.push(raw as AnyCommandEnvelope);
  }

  tickOnce(): void {
    if (this.state.phase !== MatchPhase.Running) {
      return;
    }
    this._drainCommandQueue();
    if (this.state.phase !== MatchPhase.Running) {
      return;
    }
    this._onSimulationTick();
    this.state.tick += 1;
  }

  end(reason: EndReason, winnerPlayerId: PlayerId | null, loserPlayerId: PlayerId | null): void {
    if (this.state.phase !== MatchPhase.Running) {
      return;
    }
    this.state.phase = MatchPhase.Ended;
    this.state.matchEndTick = this.state.tick;
    this.state.result = {
      winnerPlayerId,
      loserPlayerId,
      endReason: reason,
      tickEnded: this.state.tick,
    };
  }

  getDebugReadout(): MatchSessionDebugReadout {
    const workersInGatherStateCount = Object.values(this.state.units).filter(
      (u) => u.isGathering && u.gatherTargetNodeId !== null,
    ).length;
    const buildingCountByPlayer: Record<PlayerId, number> = {};
    for (const pid of Object.keys(this.state.players)) {
      buildingCountByPlayer[pid] = 0;
    }
    for (const b of Object.values(this.state.buildings)) {
      buildingCountByPlayer[b.ownerPlayerId] =
        (buildingCountByPlayer[b.ownerPlayerId] ?? 0) + 1;
    }
    const unitCountByPlayer: Record<PlayerId, number> = {};
    for (const pid of Object.keys(this.state.players)) {
      unitCountByPlayer[pid] = 0;
    }
    for (const u of Object.values(this.state.units)) {
      unitCountByPlayer[u.ownerPlayerId] =
        (unitCountByPlayer[u.ownerPlayerId] ?? 0) + 1;
    }
    const unitsMovingCount = Object.values(this.state.units).filter((u) => u.isMoving).length;
    const unitsAttackingCount = Object.values(this.state.units).filter(
      (u) => u.isAttacking && u.attackTargetEntityId !== null,
    ).length;
    return {
      acceptedEnqueueCount: this._acceptedEnqueueCount,
      rejectedEnqueueCount: this._rejectedEnqueueCount,
      lastRejection: this._lastRejection,
      processedCount: this._processedCount,
      lastProcessed: this._lastProcessed,
      stubCounts: { ...this._stubCounts },
      pendingLength: this.pendingCommands.length,
      workersInGatherStateCount,
      lastGatherBindFailure: this._lastGatherBindFailure,
      lastGatherPulse: this._lastGatherPulse,
      lastBuildRejectReason: this._lastBuildRejectReason,
      lastBuildSuccess: this._lastBuildSuccess,
      buildingCountByPlayer,
      lastTrainRejectReason: this._lastTrainRejectReason,
      lastTrainSuccess: this._lastTrainSuccess,
      unitCountByPlayer,
      lastMoveRejectReason: this._lastMoveRejectReason,
      lastMoveSuccess: this._lastMoveSuccess,
      unitsMovingCount,
      lastAttackRejectReason: this._lastAttackRejectReason,
      lastAttackBind: this._lastAttackBind,
      lastCombatHit: this._lastCombatHit,
      lastDeath: this._lastDeath,
      unitsAttackingCount,
      lastSimulationCommandOutcome: this._lastSimulationCommandOutcome,
      recentSimulationCommandOutcomes: [...this._recentSimulationOutcomes],
    };
  }

  applyGatherCommand(cmd: Extract<AnyCommandEnvelope, { kind: "gather" }>): ApplyCommandResult {
    const r = tryBindGather(this.state, cmd, this.state.tick);
    if (!r.ok) {
      this._lastGatherBindFailure = { reason: r.reason };
      return { ok: false, reason: r.reason };
    }
    this._lastGatherBindFailure = null;
    return { ok: true };
  }

  applyBuildCommand(cmd: Extract<AnyCommandEnvelope, { kind: "build" }>): ApplyCommandResult {
    const r = tryApplyBuild(this.state, cmd, () => {
      this._nextPlacedBuildingSeq += 1;
      return `building-placed-${this.state.matchId}-${this._nextPlacedBuildingSeq}`;
    });
    if (!r.ok) {
      this._lastBuildRejectReason = r.reason;
      return { ok: false, reason: r.reason };
    }
    this._lastBuildRejectReason = null;
    const b = this.state.buildings[r.buildingId]!;
    this._lastBuildSuccess = {
      playerId: cmd.playerId,
      buildingId: r.buildingId,
      buildingType: b.type,
      position: { ...b.position },
      costPaid: r.costPaid,
    };
    return { ok: true };
  }

  applyTrainCommand(cmd: Extract<AnyCommandEnvelope, { kind: "train" }>): ApplyCommandResult {
    const slot = this._nextSpawnedUnitSeq;
    const r = tryApplyTrain(
      this.state,
      cmd,
      () => {
        this._nextSpawnedUnitSeq += 1;
        return `unit-spawned-${this.state.matchId}-${this._nextSpawnedUnitSeq}`;
      },
      slot,
    );
    if (!r.ok) {
      this._lastTrainRejectReason = r.reason;
      return { ok: false, reason: r.reason };
    }
    this._lastTrainRejectReason = null;
    const u = this.state.units[r.unitId]!;
    this._lastTrainSuccess = {
      playerId: cmd.playerId,
      unitId: r.unitId,
      unitType: u.type,
      costPaid: r.costPaid,
      productionBuildingId: cmd.payload.productionBuildingId,
    };
    return { ok: true };
  }

  applyMoveCommand(cmd: Extract<AnyCommandEnvelope, { kind: "move" }>): ApplyCommandResult {
    const r = tryApplyMove(this.state, cmd);
    if (!r.ok) {
      this._lastMoveRejectReason = r.reason;
      return { ok: false, reason: r.reason };
    }
    this._lastMoveRejectReason = null;
    this._lastMoveSuccess = {
      playerId: cmd.playerId,
      unitIds: r.unitIds,
      target: { ...r.target },
    };
    return { ok: true };
  }

  applyAttackCommand(cmd: Extract<AnyCommandEnvelope, { kind: "attack" }>): ApplyCommandResult {
    const r = tryApplyAttack(this.state, cmd, this.state.tick);
    if (!r.ok) {
      this._lastAttackRejectReason = r.reason;
      return { ok: false, reason: r.reason };
    }
    this._lastAttackRejectReason = null;
    this._lastAttackBind = { attackerId: r.attackerId, targetId: r.targetId };
    return { ok: true };
  }

  applySurrenderCommand(cmd: Extract<AnyCommandEnvelope, { kind: "surrender" }>): ApplyCommandResult {
    if (this.state.phase !== MatchPhase.Running) {
      return { ok: false, reason: "phase_not_running" };
    }
    const winner = otherPlayerId(this.state, cmd.playerId);
    const loser = cmd.playerId;
    this.end("surrender", winner, loser);
    return { ok: true };
  }

  recordProcessed(cmd: AnyCommandEnvelope): void {
    this._processedCount += 1;
    this._lastProcessed = {
      kind: cmd.kind,
      commandId: cmd.commandId,
      playerId: cmd.playerId,
    };
  }

  bumpStub(kind: CommandKind): void {
    this._stubCounts[kind] = (this._stubCounts[kind] ?? 0) + 1;
  }

  private _recordSimulationOutcome(o: CommandSimulationOutcomePayload): void {
    this._lastSimulationCommandOutcome = o;
    this._recentSimulationOutcomes.push(o);
    while (this._recentSimulationOutcomes.length > RECENT_SIM_OUTCOMES_MAX) {
      this._recentSimulationOutcomes.shift();
    }
  }

  /** Tick içinde drain sonrası taşıma için — her çağrıda önceki tick buffer’ını döner. */
  takeSimulationOutcomes(): CommandSimulationOutcomePayload[] {
    const out = this._simulationOutcomesThisTick;
    this._simulationOutcomesThisTick = [];
    return out;
  }

  private _drainCommandQueue(): void {
    while (
      this.pendingCommands.length > 0 &&
      this.state.phase === MatchPhase.Running
    ) {
      const cmd = this.pendingCommands.shift()!;
      const o = dispatchCommand(this, cmd, this.roomId);
      this._simulationOutcomesThisTick.push(o);
      this._recordSimulationOutcome(o);
    }
  }

  private _onSimulationTick(): void {
    resolveMovementTick(this.state);
    if (this.state.phase !== MatchPhase.Running) {
      return;
    }
    resolveCombatTick(this.state, this.state.tick, {
      onHit: (info) => {
        this._lastCombatHit = info;
      },
      onDeath: (info) => {
        this._lastDeath = info;
      },
      onMainBaseDestroyed: (loserPlayerId) => {
        const winner = Object.keys(this.state.players).find((id) => id !== loserPlayerId) ?? null;
        if (winner !== null) {
          this.end("base_destroyed", winner, loserPlayerId);
        }
      },
    });
    if (this.state.phase !== MatchPhase.Running) {
      return;
    }
    resolveGatheringTick(this.state, this.state.tick, (info) => {
      this._lastGatherPulse = info;
    });
  }
}
