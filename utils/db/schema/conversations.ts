import { pgTable, text, timestamp, varchar, unique, index, json } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { messageRoleEnum } from './enums';

// Conversations table
export const conversations = pgTable('conversations', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  title: varchar('title'),
  userId: varchar('user_id'),
  teamId: varchar('team_id'),
  fileId: varchar('file_id'),
  status: varchar('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('conversations_user_id_idx').on(table.userId),
  index('conversations_team_id_idx').on(table.teamId),
  index('conversations_file_id_idx').on(table.fileId),
]);

// Messages table
export const messages = pgTable('messages', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  content: json('content'),
  role: messageRoleEnum('role').notNull(),
  conversationId: varchar('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  latencyMs: integer('latency_ms'),
  tokenIn: integer('token_in'),
  tokenOut: integer('token_out'),
  model: varchar('model'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('messages_conversation_id_idx').on(table.conversationId),
]);

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [conversations.teamId],
    references: [teams.id],
  }),
  file: one(files, {
    fields: [conversations.fileId],
    references: [files.id],
  }),
  messages: many(messages),
  charts: many(charts),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  chart: one(charts, {
    fields: [messages.id],
    references: [charts.messageId],
  }),
}));

// Import from other files to resolve circular dependencies
import { charts } from './charts';
import { integer } from "drizzle-orm/pg-core";
import { teams, users } from "./users";
import { files } from "./files";

