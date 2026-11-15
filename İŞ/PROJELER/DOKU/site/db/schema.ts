import {sqliteTable,text,integer,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const keywordImages=sqliteTable('keyword_images',{
  imageCode:text('image_code').primaryKey(),tagsJson:text('tags_json').notNull(),revision:integer('revision').notNull(),
  updatedAt:text('updated_at').notNull(),operationId:text('operation_id').notNull()
});
export const keywordHistory=sqliteTable('keyword_history',{
  operationId:text('operation_id').primaryKey(),imageCode:text('image_code').notNull(),revision:integer('revision').notNull(),
  beforeJson:text('before_json').notNull(),afterJson:text('after_json').notNull(),actorId:text('actor_id').notNull(),
  actorEmail:text('actor_email').notNull(),action:text('action').notNull(),createdAt:text('created_at').notNull()
},table=>[uniqueIndex('keyword_history_image_revision').on(table.imageCode,table.revision)]);
