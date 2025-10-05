import { pgTable, text, timestamp, varchar, unique } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { roleEnum, inviteStatusEnum } from './enums';
import { folders } from "./folders";
import { files } from "./files";
import { charts, chartShareLinks, chartVersions } from "./charts";
import { conversations } from "./conversations";

// Users table
export const users = pgTable('users', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  clerkId: varchar('clerk_id').notNull().unique(),
  email: varchar('email').notNull().unique(),
  name: varchar('name'),
  imageUrl: varchar('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
});

// Teams table
export const teams = pgTable('teams', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  name: varchar('name').notNull(),
  createdById: varchar('created_by_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
});

// TeamMembers table
export const teamMembers = pgTable('team_members', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  teamId: varchar('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  unique().on(table.teamId, table.userId),
]);

// TeamInvites table
export const teamInvites = pgTable('team_invites', {
  id: varchar('id').primaryKey().notNull().$defaultFn(() => createId()),
  teamId: varchar('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  email: varchar('email').notNull(),
  role: roleEnum('role').default('VIEWER').notNull(),
  token: varchar('token').notNull().unique(),
  status: inviteStatusEnum('status').default('PENDING').notNull(),
  inviterId: varchar('inviter_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at'),
  acceptedById: varchar('accepted_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  files: many(files),
  charts: many(charts),
  conversations: many(conversations),
  teams: many(teams, { relationName: 'createdTeams' }),
  invitations: many(teamInvites, { relationName: 'invitations' }),
  sharedLinks: many(chartShareLinks),
  createdChartVersions: many(chartVersions),
  teamMembers: many(teamMembers),
  invites: many(teamInvites, { relationName: 'inviterInvites' }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [teams.createdById],
    references: [users.id],
    relationName: 'createdTeams',
  }),
  members: many(teamMembers),
  folders: many(folders),
  files: many(files),
  charts: many(charts),
  conversations: many(conversations),
  invites: many(teamInvites),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvites.teamId],
    references: [teams.id],
  }),
  inviter: one(users, {
    fields: [teamInvites.inviterId],
    references: [users.id],
    relationName: 'inviterInvites',
  }),
  acceptedBy: one(users, {
    fields: [teamInvites.acceptedById],
    references: [users.id],
    relationName: 'invitations',
  }),
}));
