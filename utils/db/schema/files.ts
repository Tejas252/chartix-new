import { pgTable, text, timestamp, varchar, integer, unique, index } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { fileKindEnum } from './enums';

// Files table
export const files = pgTable('files', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  name: varchar('name').notNull(),
  kind: fileKindEnum('kind').notNull(),
  mimeType: varchar('mime_type'),
  size: integer('size'),
  url: varchar('url'),
  provider: varchar('provider'),
  bucket: varchar('bucket'),
  key: varchar('key'),
  checksum: varchar('checksum'),
  userId: varchar('user_id').references(() => users.id, { onDelete: 'cascade' }),
  teamId: varchar('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  folderId: varchar('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('files_user_id_idx').on(table.userId),
  index('files_team_id_idx').on(table.teamId),
  index('files_folder_id_idx').on(table.folderId),
  unique().on(table.folderId, table.name),
]);

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [files.teamId],
    references: [teams.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));

// Import from other files to resolve circular dependencies
import { conversations } from './conversations';
import { charts } from './charts';
import { teams, users } from "./users";import { folders } from "./folders";

