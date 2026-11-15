import type {
  AnyCommandEnvelope,
  ClientTransportMessage,
  PlayerId,
  Vec2,
} from "@rift-empire/shared";
import { BuildingType, isServerTransportMessage, MatchPhase, UnitType } from "@rift-empire/shared";
import {
  buildAttackCommand,
  buildBuildCommand,
  buildGatherCommand,
  buildMoveCommand,
  buildSurrenderCommand,
  buildTrainCommand,
  type EnvelopeContext,
} from "../commands/envelopeBuilders.js";
import { createInitialClientStore, type ClientStore } from "../state/clientStore.js";
import { applyServerMessage } from "./applyServerMessage.js";
import {
  makeCleanupRoom,
  makeEnqueueCommand,
  makeGetRoomState,
  makeJoinRoom,
  makeStartMatch,
} from "./outgoingMessages.js";
import type { TransportHandle, WebSocketConnectFn } from "./wsTransportTypes.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RiftClient {
  readonly store: ClientStore;
  readonly tag: string;
  private transport: TransportHandle | null = null;
  private commandSeq = 1;
  /** Son `match_state` tick’i; yoksa 0. */
  lastKnownTick = 0;
  /** Gönderilen komutların yerel etiketi — ACK ile `commandId` üzerinden eşlenir. */
  private readonly pendingCommandLabels = new Map<number, string>();

  constructor(tag: string) {
    this.tag = tag;
    this.store = createInitialClientStore();
  }

  private log(...args: unknown[]): void {
    console.log(`[client:${this.tag}]`, ...args);
  }

  /**
   * Bağlantı: Node için `connectNodeWebSocket`, tarayıcı için `connectBrowserWebSocket` iletin.
   */
  connect(url: string, connectFn: WebSocketConnectFn): Promise<void> {
    this.store.connectionState = "connecting";
    return new Promise((resolve, reject) => {
      this.transport = connectFn(url, {
        onOpen: () => {
          this.store.connectionState = "connected";
          resolve();
        },
        onError: (e) => {
          this.store.connectionState = "disconnected";
          this.resetLocalState();
          this.store.lastError = {
            code: "transport_error",
            message: e instanceof Error ? e.message : String(e),
          };
          reject(e);
        },
        onClose: () => {
          const wasRunning = this.store.matchStatePayload?.phase === MatchPhase.Running;
          this.store.connectionState = "disconnected";
          this.log("socket closed");
          this.resetLocalState();
          if (wasRunning) {
            this.store.lastError = {
              code: "transport_closed",
              message: "Bağlantı kapandı (maç sırasında).",
            };
          }
        },
        onMessage: (data) => this.handleIncoming(data),
      });
    });
  }

  private handleIncoming(raw: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      this.log("parse_error (non-json)", raw.slice(0, 200));
      return;
    }
    if (!isServerTransportMessage(parsed)) {
      this.log("unknown server envelope", parsed);
      return;
    }
    const r = applyServerMessage(this.store, parsed);
    if (r.tick !== undefined) {
      this.lastKnownTick = r.tick;
    }
    if (r.clearPendingCommands) {
      this.pendingCommandLabels.clear();
    }
  }

  send(msg: ClientTransportMessage): void {
    if (!this.transport) {
      this.log("send skipped: no transport");
      return;
    }
    this.transport.send(JSON.stringify(msg));
  }

  private nextCommandId(): number {
    const id = this.commandSeq;
    this.commandSeq += 1;
    return id;
  }

  private envelopeBase(): EnvelopeContext {
    return {
      commandId: this.nextCommandId(),
      issuedAtTick: this.lastKnownTick,
    };
  }

  joinRoom(guestId: string, roomId?: string): void {
    this.send(makeJoinRoom(guestId, roomId));
  }

  startMatch(roomId: string): void {
    this.send(makeStartMatch(roomId));
  }

  getRoomState(roomId: string): void {
    this.send(makeGetRoomState(roomId));
  }

  cleanupRoom(roomId: string): void {
    this.send(makeCleanupRoom(roomId));
  }

  enqueueCommand(roomId: string, command: AnyCommandEnvelope): void {
    this.send(makeEnqueueCommand(roomId, command));
  }

  /** ACK/error eşlemesi için bekleyen etiketi alır ve siler. */
  takePendingLabelForCommand(commandId: number): string | undefined {
    const v = this.pendingCommandLabels.get(commandId);
    if (v !== undefined) {
      this.pendingCommandLabels.delete(commandId);
    }
    return v;
  }

  /** Simülasyon outcome ile eşleme için etiketi okur (silmez). */
  peekPendingLabelForCommand(commandId: number): string | undefined {
    return this.pendingCommandLabels.get(commandId);
  }

  getPendingCommandsDebug(): Array<{ commandId: number; label: string }> {
    return [...this.pendingCommandLabels.entries()].map(([commandId, label]) => ({ commandId, label }));
  }

  private registerPending(command: AnyCommandEnvelope, label: string): void {
    this.pendingCommandLabels.set(command.commandId, label);
  }

  gather(roomId: string, playerId: PlayerId, workerEntityId: string, resourceNodeId: string): void {
    const cmd = buildGatherCommand(this.envelopeBase(), playerId, workerEntityId, resourceNodeId);
    this.registerPending(cmd, `gather ${workerEntityId}`);
    this.enqueueCommand(roomId, cmd);
  }

  queueBuild(
    roomId: string,
    playerId: PlayerId,
    builderUnitId: string,
    buildingType: BuildingType,
    position: Vec2,
  ): void {
    const cmd = buildBuildCommand(this.envelopeBase(), playerId, builderUnitId, buildingType, position);
    this.registerPending(cmd, `queueBuild ${buildingType}`);
    this.enqueueCommand(roomId, cmd);
  }

  train(
    roomId: string,
    playerId: PlayerId,
    productionBuildingId: string,
    unitType: UnitType,
  ): void {
    const cmd = buildTrainCommand(this.envelopeBase(), playerId, productionBuildingId, unitType);
    this.registerPending(cmd, `train ${unitType}`);
    this.enqueueCommand(roomId, cmd);
  }

  move(roomId: string, playerId: PlayerId, unitIds: string[], target: Vec2): void {
    const cmd = buildMoveCommand(this.envelopeBase(), playerId, unitIds, target);
    this.registerPending(cmd, `move ${unitIds.join(",")}`);
    this.enqueueCommand(roomId, cmd);
  }

  attack(roomId: string, playerId: PlayerId, attackerEntityId: string, targetEntityId: string): void {
    const cmd = buildAttackCommand(this.envelopeBase(), playerId, attackerEntityId, targetEntityId);
    this.registerPending(cmd, `attack ${attackerEntityId}→${targetEntityId}`);
    this.enqueueCommand(roomId, cmd);
  }

  surrender(roomId: string, playerId: PlayerId): void {
    const cmd = buildSurrenderCommand(this.envelopeBase(), playerId);
    this.registerPending(cmd, "surrender");
    this.enqueueCommand(roomId, cmd);
  }

  async waitForRoomId(timeoutMs = 5000): Promise<string> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const id = this.store.roomStatePayload?.roomId;
      if (id) {
        return id;
      }
      await sleep(20);
    }
    throw new Error("waitForRoomId timeout");
  }

  async waitForMatchResult(timeoutMs = 10000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.store.matchResultPayload !== null) {
        return;
      }
      await sleep(30);
    }
    throw new Error("waitForMatchResult timeout");
  }

  close(): void {
    this.transport?.close();
    this.transport = null;
  }

  /** Soket kapanınca / yeni oturum için istemci önbelleğini temizler (sunucu otoritesi değil). */
  resetLocalState(): void {
    this.store.roomStatePayload = null;
    this.store.matchStatePayload = null;
    this.store.matchResultPayload = null;
    this.store.lastEvent = null;
    this.store.lastError = null;
    this.store.lastAck = null;
    this.store.lastResolvedCommand = null;
    this.store.lastSimulationOutcome = null;
    this.store.simulationOutcomeHistory = [];
    this.lastKnownTick = 0;
    this.pendingCommandLabels.clear();
  }
}
