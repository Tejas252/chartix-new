import { eq, and, desc, sql, or } from 'drizzle-orm';
import { db } from '@/utils/db';
import { users } from '@/utils/db/schema/users';
import { NewUser, User } from './users.type';

/**
 * Users Repository - Handles all database operations for users, teams, and team members
 */
export const usersRepository = {
    // ==================== User Operations ====================

    /**
     * Create a new user
     */
    async createUser(data: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const [newUser] = await db
            .insert(users)
            .values({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return newUser;
    },

    /**
     * Get a user by ID
     */
    async getUserById(id: string): Promise<User | undefined> {
        const [result] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return result;
    },

    /**
     * Get a user by Clerk ID
     */
    async getUserByClerkId(clerkId: string): Promise<User | undefined> {
        const [result] = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId))
            .limit(1);

        return result;
    },

    /**
     * Get a user by email
     */
    async getUserByEmail(email: string): Promise<User | undefined> {
        const [result] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return result;
    },

    /**
     * Update a user
     */
    async updateUser(
        id: string,
        updates: Partial<Omit<NewUser, 'id' | 'createdAt' | 'clerkId'>>
    ): Promise<User | undefined> {
        const [updatedUser] = await db
            .update(users)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id))
            .returning();

        return updatedUser;
    },

    /**
     * Delete a user
     */
    async deleteUser(id: string): Promise<boolean> {
        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id });

        return !!deletedUser;
    },

    /**
     * Get all users with pagination
     */
    async getAllUsers(
        limit: number = 50,
        offset: number = 0
    ): Promise<{ users: User[], total: number }> {
        const results = await db
            .select()
            .from(users)
            .orderBy(desc(users.createdAt))
            .limit(limit)
            .offset(offset);

        const [total] = await db
            .select({ count: sql<number>`count(*)` })
            .from(users);

        return {
            users: results,
            total: Number(total?.count) || 0
        };
    },
}

//   // ==================== Team Operations ====================

//   /**
//    * Create a new team
//    */
//   async createTeam(data: Omit<NewTeam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
//     const [newTeam] = await db
//       .insert(teams)
//       .values({
//         ...data,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     return newTeam;
//   },

//   /**
//    * Get a team by ID
//    */
//   async getTeamById(id: string): Promise<Team | undefined> {
//     const [result] = await db
//       .select()
//       .from(teams)
//       .where(eq(teams.id, id))
//       .limit(1);

//     return result;
//   },

//   /**
//    * Get teams created by a user
//    */
//   async getTeamsByCreator(
//     createdById: string,
//     limit: number = 20,
//     offset: number = 0
//   ): Promise<{ teams: Team[], total: number }> {
//     const results = await db
//       .select()
//       .from(teams)
//       .where(eq(teams.createdById, createdById))
//       .orderBy(desc(teams.createdAt))
//       .limit(limit)
//       .offset(offset);

//     const [total] = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(teams)
//       .where(eq(teams.createdById, createdById));

//     return {
//       teams: results,
//       total: Number(total?.count) || 0
//     };
//   },

//   /**
//    * Get teams a user is a member of
//    */
//   async getTeamsByMember(
//     userId: string,
//     limit: number = 20,
//     offset: number = 0
//   ): Promise<{ teams: Team[], total: number }> {
//     const results = await db
//       .select({
//         id: teams.id,
//         name: teams.name,
//         createdById: teams.createdById,
//         createdAt: teams.createdAt,
//         updatedAt: teams.updatedAt,
//       })
//       .from(teams)
//       .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
//       .where(eq(teamMembers.userId, userId))
//       .orderBy(desc(teams.createdAt))
//       .limit(limit)
//       .offset(offset);

//     const [total] = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(teams)
//       .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
//       .where(eq(teamMembers.userId, userId));

//     return {
//       teams: results,
//       total: Number(total?.count) || 0
//     };
//   },

//   /**
//    * Update a team
//    */
//   async updateTeam(
//     id: string,
//     updates: Partial<Omit<NewTeam, 'id' | 'createdAt' | 'createdById'>>
//   ): Promise<Team | undefined> {
//     const [updatedTeam] = await db
//       .update(teams)
//       .set({
//         ...updates,
//         updatedAt: new Date(),
//       })
//       .where(eq(teams.id, id))
//       .returning();

//     return updatedTeam;
//   },

//   /**
//    * Delete a team
//    */
//   async deleteTeam(id: string): Promise<boolean> {
//     const [deletedTeam] = await db
//       .delete(teams)
//       .where(eq(teams.id, id))
//       .returning({ id: teams.id });

//     return !!deletedTeam;
//   },

//   // ==================== Team Member Operations ====================

//   /**
//    * Add a member to a team
//    */
//   async addTeamMember(data: Omit<NewTeamMember, 'id' | 'joinedAt'>): Promise<TeamMember> {
//     const [newMember] = await db
//       .insert(teamMembers)
//       .values({
//         ...data,
//         joinedAt: new Date(),
//       })
//       .returning();

//     return newMember;
//   },

//   /**
//    * Get team members
//    */
//   async getTeamMembers(
//     teamId: string,
//     limit: number = 50,
//     offset: number = 0
//   ): Promise<{ members: (TeamMember & { user: User })[], total: number }> {
//     const results = await db
//       .select({
//         id: teamMembers.id,
//         teamId: teamMembers.teamId,
//         userId: teamMembers.userId,
//         role: teamMembers.role,
//         joinedAt: teamMembers.joinedAt,
//         user: users,
//       })
//       .from(teamMembers)
//       .innerJoin(users, eq(teamMembers.userId, users.id))
//       .where(eq(teamMembers.teamId, teamId))
//       .orderBy(desc(teamMembers.joinedAt))
//       .limit(limit)
//       .offset(offset);

//     const [total] = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(teamMembers)
//       .where(eq(teamMembers.teamId, teamId));

//     return {
//       members: results,
//       total: Number(total?.count) || 0
//     };
//   },

//   /**
//    * Get a specific team member
//    */
//   async getTeamMember(teamId: string, userId: string): Promise<TeamMember | undefined> {
//     const [result] = await db
//       .select()
//       .from(teamMembers)
//       .where(and(
//         eq(teamMembers.teamId, teamId),
//         eq(teamMembers.userId, userId)
//       ))
//       .limit(1);

//     return result;
//   },

//   /**
//    * Update team member role
//    */
//   async updateTeamMemberRole(
//     teamId: string,
//     userId: string,
//     role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'
//   ): Promise<TeamMember | undefined> {
//     const [updatedMember] = await db
//       .update(teamMembers)
//       .set({ role })
//       .where(and(
//         eq(teamMembers.teamId, teamId),
//         eq(teamMembers.userId, userId)
//       ))
//       .returning();

//     return updatedMember;
//   },

//   /**
//    * Remove a member from a team
//    */
//   async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
//     const [deletedMember] = await db
//       .delete(teamMembers)
//       .where(and(
//         eq(teamMembers.teamId, teamId),
//         eq(teamMembers.userId, userId)
//       ))
//       .returning({ id: teamMembers.id });

//     return !!deletedMember;
//   },

//   /**
//    * Check if user is a team member
//    */
//   async isTeamMember(teamId: string, userId: string): Promise<boolean> {
//     const member = await this.getTeamMember(teamId, userId);
//     return !!member;
//   },

//   /**
//    * Check if user has specific role or higher in team
//    */
//   async hasTeamRole(
//     teamId: string,
//     userId: string,
//     minRole: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'
//   ): Promise<boolean> {
//     const member = await this.getTeamMember(teamId, userId);
//     if (!member) return false;

//     const roleHierarchy = { OWNER: 4, ADMIN: 3, EDITOR: 2, VIEWER: 1 };
//     return roleHierarchy[member.role] >= roleHierarchy[minRole];
//   },
// };

export default usersRepository;
