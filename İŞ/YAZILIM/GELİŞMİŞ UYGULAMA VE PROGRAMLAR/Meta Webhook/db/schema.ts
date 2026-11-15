import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const notifications = sqliteTable("meta_notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  digest: text("digest").notNull().unique(),
  object: text("object").notNull(),
  accountId: text("account_id").notNull(),
  fields: text("fields").notNull(),
  eventTime: integer("event_time").notNull(),
  receivedAt: integer("received_at").notNull(),
});
