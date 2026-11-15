import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "./db.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const db = createDb(config.DATABASE_URL);
const here = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(here, "..", "migrations", "001_init.sql");

try {
  const sql = await readFile(migrationPath, "utf8");
  await db.query(sql);
  console.log("Migration completed.");
} finally {
  await db.end();
}
