export type Row = Record<string, unknown>;
export interface Statement {
  bind(..._values: unknown[]): Statement;
  all<T = Row>(): Promise<{ results: T[]; success: boolean }>;
  first<T = Row>(): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: { changes: number } }>;
}
export interface Database {
  prepare(_sql: string): Statement;
  batch<T = Row>(_statements: Statement[]): Promise<Array<{ results: T[]; success: boolean }>>;
}
export type AdminRole = "developer" | "owner" | "editor" | "viewer";
export type AdminUser = { id: string; email: string; role: AdminRole; displayName: string };
export type DataConfig = { db: Database; developerEmail: string; bucket: string; user?: AdminUser };
