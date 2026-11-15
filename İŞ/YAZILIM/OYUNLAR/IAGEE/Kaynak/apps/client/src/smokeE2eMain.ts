/**
 * E2E smoke: yerel server subprocess + iki Node istemci (Build 19+).
 * PASS = exit 0, FAIL = exit 1. Özet: `SMOKE_VERBOSE=1` ile ek log.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { createConnection } from "node:net";
import path from "node:path";
import {
  BuildingType,
  MatchPhase,
  UnitType,
  type CommandSimulationOutcomePayload,
} from "@rift-empire/shared";
import { connectNodeWebSocket } from "./transport/nodeWsConnect.js";
import { RiftClient } from "./transport/riftClient.js";

const SMOKE_VERBOSE = process.env.SMOKE_VERBOSE === "1";

function logVerbose(...args: unknown[]): void {
  if (SMOKE_VERBOSE) {
    console.log("[smoke:verbose]", ...args);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitTcpPortOpen(port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    function tryOnce(): void {
      const s = createConnection({ port, host: "127.0.0.1" }, () => {
        s.destroy();
        resolve();
      });
      s.on("error", () => {
        s.destroy();
        if (Date.now() >= deadline) {
          reject(new Error(`tcp_wait_timeout port=${port}`));
        } else {
          setTimeout(tryOnce, 40);
        }
      });
    }
    tryOnce();
  });
}

async function waitOutcomeAtIndex(
  client: RiftClient,
  index: number,
  kind: CommandSimulationOutcomePayload["kind"],
  status: CommandSimulationOutcomePayload["status"],
  timeoutMs: number,
): Promise<CommandSimulationOutcomePayload> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const h = client.store.simulationOutcomeHistory;
    if (h.length > index) {
      const o = h[index]!;
      if (o.kind === kind && o.status === status) {
        return o;
      }
      if (o.kind === kind && o.status === "rejected_in_simulation") {
        throw new Error(`unexpected_reject ${kind} ${o.reasonCode ?? ""}`);
      }
    }
    await sleep(25);
  }
  throw new Error(`outcome_timeout kind=${kind} status=${status} index=${index}`);
}

async function waitMatchRunning(client: RiftClient, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (client.store.matchStatePayload?.phase === MatchPhase.Running) {
      return;
    }
    await sleep(30);
  }
  throw new Error("match_running_timeout");
}

function serverEntryPath(): string {
  return path.join(__dirname, "..", "..", "server", "dist", "index.js");
}

interface StepResult {
  name: string;
  ok: boolean;
  reason?: string;
}

async function run(): Promise<{ steps: StepResult[]; pass: boolean; elapsedMs: number }> {
  const steps: StepResult[] = [];
  const port = Number(process.env.SMOKE_PORT ?? "18765");
  let child: ChildProcess | null = null;
  const startedAt = Date.now();

  const push = (name: string, ok: boolean, reason?: string): void => {
    steps.push({ name, ok, reason });
  };

  const finish = (pass: boolean): { steps: StepResult[]; pass: boolean; elapsedMs: number } => ({
    steps,
    pass,
    elapsedMs: Date.now() - startedAt,
  });

  try {
    logVerbose("SMOKE_PORT=", port, "server=", serverEntryPath());
    const entry = serverEntryPath();
    child = spawn(process.execPath, [entry], {
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderrBuf = "";
    child.stderr?.on("data", (c: Buffer) => {
      stderrBuf += c.toString();
    });
    child.on("error", (e) => {
      stderrBuf += String(e);
    });

    await waitTcpPortOpen(port, 12000).catch((e: Error) => {
      logVerbose("server stderr tail:", stderrBuf.slice(-600));
      throw new Error(
        `server_failed_start port=${port} ${e.message} stderr=${stderrBuf.slice(-400)}`,
      );
    });

    push("server_listen", true);
    logVerbose("tcp ok, connecting clients");

    const url = `ws://127.0.0.1:${port}`;
    const a = new RiftClient("smoke-a");
    const b = new RiftClient("smoke-b");

    await a.connect(url, connectNodeWebSocket);
    await b.connect(url, connectNodeWebSocket);
    push("two_clients_connected", true);

    a.joinRoom("smoke-e2e-a");
    const roomId = await a.waitForRoomId(8000);
    b.joinRoom("smoke-e2e-b", roomId);
    await sleep(120);

    if (a.store.roomStatePayload?.roomState !== "ready") {
      push("room_ready", false, `roomState=${a.store.roomStatePayload?.roomState}`);
      return finish(false);
    }
    push("room_ready", true);

    a.startMatch(roomId);
    try {
      await waitMatchRunning(a, 8000);
      push("match_running", true);
    } catch (e) {
      push("match_running", false, (e as Error).message);
      return finish(false);
    }
    if (a.store.matchStatePayload?.phase !== MatchPhase.Running) {
      push("match_phase", false, "not_running_after_wait");
      return finish(false);
    }

    let mark = a.store.simulationOutcomeHistory.length;
    a.gather(roomId, "p0", "unit-p0-w0", "resource-node-near-p0");
    try {
      await waitOutcomeAtIndex(a, mark, "gather", "applied", 10000);
      push("gather_applied", true);
    } catch (e) {
      push("gather_applied", false, (e as Error).message);
      return finish(false);
    }

    mark = a.store.simulationOutcomeHistory.length;
    a.queueBuild(roomId, "p0", "unit-p0-w0", BuildingType.Production, { x: 70, y: 100 });
    try {
      await waitOutcomeAtIndex(a, mark, "build", "applied", 10000);
      push("build_applied", true);
    } catch (e) {
      push("build_applied", false, (e as Error).message);
      return finish(false);
    }

    await sleep(200);
    const m0 = a.store.matchStatePayload;
    const prod = m0
      ? Object.values(m0.buildings).find(
          (b) => b.ownerPlayerId === "p0" && b.type === BuildingType.Production,
        )
      : undefined;
    if (!prod) {
      push("find_production", false, "no_production_building");
      return finish(false);
    }

    mark = a.store.simulationOutcomeHistory.length;
    a.train(roomId, "p0", prod.id, UnitType.Ranged);
    try {
      await waitOutcomeAtIndex(a, mark, "train", "applied", 10000);
      push("train_applied", true);
    } catch (e) {
      push("train_applied", false, (e as Error).message);
      return finish(false);
    }

    await sleep(100);
    const m1 = a.store.matchStatePayload;
    const ranged = m1
      ? Object.values(m1.units).find((u) => u.ownerPlayerId === "p0" && u.type === UnitType.Ranged)
      : undefined;
    if (!ranged) {
      push("find_ranged", false, "no_ranged_unit");
      return finish(false);
    }

    mark = a.store.simulationOutcomeHistory.length;
    a.move(roomId, "p0", [ranged.id], { x: 125, y: 100 });
    try {
      await waitOutcomeAtIndex(a, mark, "move", "applied", 10000);
      push("move_applied", true);
    } catch (e) {
      push("move_applied", false, (e as Error).message);
      return finish(false);
    }

    mark = a.store.simulationOutcomeHistory.length;
    a.attack(roomId, "p0", ranged.id, "unit-p1-w0");
    try {
      await waitOutcomeAtIndex(a, mark, "attack", "applied", 10000);
      push("attack_applied", true);
    } catch (e) {
      push("attack_applied", false, (e as Error).message);
      return finish(false);
    }

    mark = b.store.simulationOutcomeHistory.length;
    b.surrender(roomId, "p1");
    try {
      await waitOutcomeAtIndex(b, mark, "surrender", "applied", 10000);
      push("surrender_applied", true);
    } catch (e) {
      push("surrender_applied", false, (e as Error).message);
      return finish(false);
    }

    try {
      await a.waitForMatchResult(20000);
    } catch (e) {
      push("match_result", false, (e as Error).message);
      return finish(false);
    }
    if (!a.store.matchResultPayload) {
      push("match_result", false, "no_payload");
      return finish(false);
    }
    push("match_result", true);

    return finish(true);
  } catch (e) {
    push("fatal", false, (e as Error).message);
    logVerbose("fatal error:", e);
    return finish(false);
  } finally {
    if (child !== null && child.exitCode === null) {
      child.kill("SIGTERM");
      await sleep(120);
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
    }
  }
}

void (async () => {
  const { steps, pass, elapsedMs } = await run();
  const passedCount = steps.filter((s) => s.ok).length;
  const failedCount = steps.filter((s) => !s.ok).length;
  const failing = steps.find((s) => !s.ok);

  console.log("");
  console.log("=== SMOKE E2E ===");
  for (const s of steps) {
    const line = s.ok ? `  [OK] ${s.name}` : `  [XX] ${s.name}${s.reason ? ` — ${s.reason}` : ""}`;
    console.log(line);
  }
  console.log("");
  console.log("--- SUMMARY ---");
  console.log(`elapsed_ms: ${elapsedMs}`);
  console.log(`passed_steps: ${passedCount}`);
  console.log(`failed_steps: ${failedCount}`);
  console.log(`failing_step: ${failing ? failing.name : "—"}`);
  console.log("");
  if (pass) {
    console.log("RESULT: PASS");
    process.exit(0);
  } else {
    console.log("RESULT: FAIL");
    process.exit(1);
  }
})();
