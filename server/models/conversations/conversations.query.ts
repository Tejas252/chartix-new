import { eq, and, desc, isNull, sql } from 'drizzle-orm';
import { db } from '@/utils/db';
import { conversations, messages } from '@/utils/db/schema/conversations';
import { type QueryResult } from 'pg';
import { NewConversation, Conversation, NewMessage, Message } from './conversations.type';
import { files } from '@/utils/db/schema';
import { File } from '../files/files.type';

/**
 * Conversation Repository - Handles all database operations for conversations
 */
export const conversationRepository = {
  /**
   * Create a new conversation
   */
  async createConversation(data: Omit<NewConversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values({
        ...data,
        id: undefined, // Let the database generate the ID
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return newConversation;
  },

  /**
   * Get a conversation by ID
   */
  async getConversationById(id: string): Promise<{conversations : Conversation,files:File | null} | undefined> {
    // Join with the files table if your schema allows (adjust table/field names as appropriate)
    const [result] = await db
      .select()
      .from(conversations)
      // Join with the "files" table if your schema has that relationship
      .leftJoin(
        files, 
        eq(conversations.fileId, files?.id)
      )
      .where(eq(conversations.id, id))
      .limit(1);

    // If your DB/ORM doesn't return 'file' as property, adapt accordingly
    return result;
  },

  /**
   * Get conversations by user ID with pagination
   */
  async getConversationsByUser(
    conversationId:string,
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ conversations: Conversation[], total: number }> {
    const results = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.userId, userId),eq(conversations.id,conversationId)))
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(eq(conversations.userId, userId));

    return {
      conversations: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Get conversations by team ID with pagination
   */
  async getConversationsByTeam(
    teamId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ conversations: Conversation[], total: number }> {
    const results = await db
      .select()
      .from(conversations)
      .where(eq(conversations.teamId, teamId))
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(eq(conversations.teamId, teamId));

    return {
      conversations: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Update a conversation
   */
  async updateConversation(
    id: string,
    updates: Partial<Omit<NewConversation, 'id' | 'createdAt' | 'userId' | 'teamId'>>
  ): Promise<Conversation | undefined> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();

    return updatedConversation;
  },

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(id: string): Promise<boolean> {
    // First delete all messages in the conversation
    await db
      .delete(messages)
      .where(eq(messages.conversationId, id));

    // Then delete the conversation
    const [deletedConversation] = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning({ id: conversations.id });

    return !!deletedConversation;
  },

  /**
   * Add a message to a conversation
   */
  async addMessage(data: Omit<NewMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {

    console.log("NEW MESSAGE:",data)

    const [newMessage] = await db
      .insert(messages)
      .values({
        ...data,
        id: undefined, // Let the database generate the ID
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Update the conversation's updatedAt timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, data.conversationId));

    return newMessage;
  },

  /**
   * Get messages for a conversation with pagination
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ messages: Message[], total: number }> {
    const results = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.conversationId, conversationId));

    return {
      messages: results.reverse(), // Return in chronological order
      total: Number(total?.count) || 0
    };
  },

  /**
   * Update a message
   */
  async updateMessage(
    id: string,
    updates: Partial<Omit<NewMessage, 'id' | 'createdAt' | 'conversationId'>>
  ): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(messages.id, id))
      .returning();

    return updatedMessage;
  },

  /**
   * Delete a message
   */
  async deleteMessage(id: string): Promise<boolean> {
    const [deletedMessage] = await db
      .delete(messages)
      .where(eq(messages.id, id))
      .returning({ id: messages.id });

    return !!deletedMessage;
  },
};

export default conversationRepository;