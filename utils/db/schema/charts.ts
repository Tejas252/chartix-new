import { pgTable, varchar, timestamp, index, json, unique, text } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { chartLibraryEnum, visibilityEnum } from './enums';
import { teams, users } from "./users";
import { folders } from "./folders";
import { files } from "./files";
import { conversations, messages } from "./conversations";

// Charts table
export const charts = pgTable('charts', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  title: varchar('title').notNull(),
  library: chartLibraryEnum('library').default('ECHARTS').notNull(),
  config: json('config').notNull(), // final chart config
  dataSpec: json('data_spec'), // data shape / selected columns / pipeline
  generationSteps: json('generation_steps'), // It Will Generate by AI
  userId: varchar('user_id').references(() => users.id, { onDelete: 'cascade' }),
  teamId: varchar('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  folderId: varchar('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  fileId: varchar('file_id').references(() => files.id, { onDelete: 'cascade' }),
  visibility: visibilityEnum('visibility').default('PRIVATE').notNull(),
  slug: varchar('slug').notNull().unique(),
  conversationId: varchar('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }),
  messageId: varchar('message_id').notNull().unique().references(() => messages.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('charts_user_id_idx').on(table.userId),
  index('charts_team_id_idx').on(table.teamId),
  index('charts_folder_id_idx').on(table.folderId),
  index('charts_file_id_idx').on(table.fileId),
  index('charts_conversation_id_idx').on(table.conversationId),
  index('charts_message_id_idx').on(table.messageId),
]);

// ChartVersions table
export const chartVersions = pgTable('chart_versions', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  chartId: varchar('chart_id').notNull().references(() => charts.id, { onDelete: 'cascade' }),
  config: json('config').notNull(),
  notes: varchar('notes'),
  createdById: varchar('created_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('chart_versions_chart_id_idx').on(table.chartId),
]);

// ChartShareLinks table
export const chartShareLinks = pgTable('chart_share_links', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  chartId: varchar('chart_id').notNull().references(() => charts.id, { onDelete: 'cascade' }),
  token: varchar('token').notNull().unique(),
  expiresAt: timestamp('expires_at'),
  createdById: varchar('created_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('chart_share_links_chart_id_idx').on(table.chartId),
  index('chart_share_links_created_by_id_idx').on(table.createdById),
]);

// Relations
export const chartsRelations = relations(charts, ({ one, many }) => ({
  user: one(users, {
    fields: [charts.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [charts.teamId],
    references: [teams.id],
  }),
  folder: one(folders, {
    fields: [charts.folderId],
    references: [folders.id],
  }),
  file: one(files, {
    fields: [charts.fileId],
    references: [files.id],
  }),
  conversation: one(conversations, {
    fields: [charts.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, {
    fields: [charts.messageId],
    references: [messages.id],
  }),
  versions: many(chartVersions),
  shares: many(chartShareLinks),
}));

export const chartVersionsRelations = relations(chartVersions, ({ one }) => ({
  chart: one(charts, {
    fields: [chartVersions.chartId],
    references: [charts.id],
  }),
  createdBy: one(users, {
    fields: [chartVersions.createdById],
    references: [users.id],
  }),
}));

export const chartShareLinksRelations = relations(chartShareLinks, ({ one }) => ({
  chart: one(charts, {
    fields: [chartShareLinks.chartId],
    references: [charts.id],
  }),
  createdBy: one(users, {
    fields: [chartShareLinks.createdById],
    references: [users.id],
  }),
}));