import pg from "pg";

const { Pool } = pg;

export function createDb(connectionString: string) {
  return new Pool({
    connectionString,
    max: 12,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export type Db = ReturnType<typeof createDb>;
