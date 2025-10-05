import { pgTable, text, timestamp, varchar, unique, index, AnyPgColumn } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

// Folders table
export const folders = pgTable('folders', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  name: varchar('name').notNull(),
  userId: varchar('user_id').references(() => users.id, { onDelete: 'cascade' }),
  teamId: varchar('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  parentId: varchar('parent_id').references(():AnyPgColumn => folders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('folders_user_id_idx').on(table.userId),
  index('folders_team_id_idx').on(table.teamId),
  index('folders_parent_id_idx').on(table.parentId),
  unique().on(table.userId, table.teamId, table.parentId, table.name),
]);

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [folders.teamId],
    references: [teams.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folderToFolder',
  }),
  children: many(folders, { relationName: 'folderToFolder' }),
  files: many(files),
  charts: many(charts),
}));

// Import from other files to resolve circular dependencies
import { charts } from './charts';
import { users, teams } from './users';
import { files } from './files';