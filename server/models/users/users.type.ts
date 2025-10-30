import { users } from '@/utils/db/schema/users';

export type NewUser = typeof users._.inferInsert;
export type User = typeof users._.inferSelect;
