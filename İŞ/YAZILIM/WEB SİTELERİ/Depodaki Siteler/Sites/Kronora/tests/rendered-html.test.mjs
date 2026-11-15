import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build produces the required Sites worker artifacts", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
  const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
  assert.ok(worker.length > 1_000, "server worker should not be empty");
});

test("hosting artifact keeps the existing D1 and R2 bindings", async () => {
  const hosting = JSON.parse(await readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"));
  assert.deepEqual(hosting, { d1: "DB", project_id: "appgprj_6a893cb724f881918135e1d109a4a4b8", r2: "BUCKET" });
});
