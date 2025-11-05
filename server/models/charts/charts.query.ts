import { eq, and, desc, sql, asc } from 'drizzle-orm';
import { db } from '@/utils/db';
import { charts, chartVersions, chartShareLinks } from '@/utils/db/schema/charts';
import { NewChart, Chart, NewChartVersion, ChartVersion, NewChartShareLink, ChartShareLink } from './charts.type';
import { files } from '@/utils/db/schema/files';
import { File } from '../files/files.type';
import { folders } from '@/utils/db/schema/folders';

/**
 * Chart Repository - Handles all database operations for charts
 */
export const chartRepository = {
  /**
   * Create a new chart
   */
  async createChart(data: Omit<NewChart, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chart> {
    const [newChart] = await db
      .insert(charts)
      .values({
        ...data,
        id: undefined, // Let the database generate the ID
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return newChart;
  },

  /**
   * Get a chart by ID
   */
  async getChartById(id: string): Promise<{ charts: Chart, files: File | null } | undefined> {
    const [result] = await db
      .select()
      .from(charts)
      .leftJoin(
        files,
        eq(charts.fileId, files?.id)
      )
      .where(eq(charts.id, id))
      .limit(1);

    return result;
  },

  /**
   * Get charts by user ID with pagination
   */
  async getChartsByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(and(eq(charts.userId, userId), eq(charts.visibility, 'PRIVATE')))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(and(eq(charts.userId, userId), eq(charts.visibility, 'PRIVATE')));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Get charts by team ID with pagination
   */
  async getChartsByTeam(
    teamId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(and(eq(charts.teamId, teamId), eq(charts.visibility, 'PRIVATE')))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(and(eq(charts.teamId, teamId), eq(charts.visibility, 'PRIVATE')));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Get charts by folder ID with pagination
   */
  async getChartsByFolder(
    folderId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(eq(charts.folderId, folderId))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(eq(charts.folderId, folderId));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Get charts by file ID with pagination
   */
  async getChartsByFile(
    fileId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(eq(charts.fileId, fileId))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(eq(charts.fileId, fileId));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Get charts by conversation ID with pagination
   */
  async getChartsByConversation(
    conversationId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(eq(charts.conversationId, conversationId))
      .orderBy(desc(charts.createdAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(eq(charts.conversationId, conversationId));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Search charts by title
   */
  async searchChartsByTitle(
    userId: string,
    searchTerm: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(and(
        eq(charts.userId, userId),
        sql`lower(${charts.title}) LIKE ${`%${searchTerm.toLowerCase()}%`}`
      ))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(and(
        eq(charts.userId, userId),
        sql`lower(${charts.title}) LIKE ${`%${searchTerm.toLowerCase()}%`}`
      ));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Update a chart
   */
  async updateChart(
    id: string,
    updates: Partial<Omit<NewChart, 'id' | 'createdAt' | 'userId' | 'teamId'>>
  ): Promise<Chart | undefined> {
    const [updatedChart] = await db
      .update(charts)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(charts.id, id))
      .returning();

    return updatedChart;
  },

  /**
   * Delete a chart and all its versions and share links
   */
  async deleteChart(id: string): Promise<boolean> {
    // First delete all chart versions
    await db
      .delete(chartVersions)
      .where(eq(chartVersions.chartId, id));

    // Then delete all chart share links
    await db
      .delete(chartShareLinks)
      .where(eq(chartShareLinks.chartId, id));

    // Then delete the chart
    const [deletedChart] = await db
      .delete(charts)
      .where(eq(charts.id, id))
      .returning({ id: charts.id });

    return !!deletedChart;
  },

  /**
   * Create a new chart version
   */
  async createChartVersion(data: Omit<NewChartVersion, 'id' | 'createdAt'>): Promise<ChartVersion> {
    const [newVersion] = await db
      .insert(chartVersions)
      .values({
        ...data,
        id: undefined, // Let the database generate the ID
        createdAt: new Date(),
      })
      .returning();

    return newVersion;
  },

  /**
   * Get chart versions by chart ID with pagination
   */
  async getChartVersions(
    chartId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ versions: ChartVersion[], total: number }> {
    const results = await db
      .select()
      .from(chartVersions)
      .where(eq(chartVersions.chartId, chartId))
      .orderBy(desc(chartVersions.createdAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chartVersions)
      .where(eq(chartVersions.chartId, chartId));

    return {
      versions: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Create a new chart share link
   */
  async createChartShareLink(data: Omit<NewChartShareLink, 'id' | 'createdAt'>): Promise<ChartShareLink> {
    const [newShareLink] = await db
      .insert(chartShareLinks)
      .values({
        ...data,
        id: undefined, // Let the database generate the ID
        createdAt: new Date(),
      })
      .returning();

    return newShareLink;
  },

  /**
   * Get chart share link by token
   */
  async getChartShareLinkByToken(token: string): Promise<ChartShareLink | undefined> {
    const [result] = await db
      .select()
      .from(chartShareLinks)
      .where(eq(chartShareLinks.token, token))
      .limit(1);

    return result;
  },

  /**
   * Get chart by slug
   */
  async getChartBySlug(slug: string): Promise<{ charts: Chart, files: File | null } | undefined> {
    const [result] = await db
      .select()
      .from(charts)
      .leftJoin(
        files,
        eq(charts.fileId, files?.id)
      )
      .where(eq(charts.slug, slug))
      .limit(1);

    return result;
  },

  /**
   * Get chart by message ID
   */
  async getChartByMessageId(messageId: string): Promise<{ charts: Chart, files: File | null } | undefined> {
    const [result] = await db
      .select()
      .from(charts)
      .leftJoin(
        files,
        eq(charts.fileId, files?.id)
      )
      .where(eq(charts.messageId, messageId))
      .limit(1);

    return result;
  },

  /**
   * Get public charts with pagination
   */
  async getPublicCharts(
    limit: number = 20,
    offset: number = 0
  ): Promise<{ charts: Chart[], total: number }> {
    const results = await db
      .select()
      .from(charts)
      .where(eq(charts.visibility, 'PUBLIC'))
      .orderBy(desc(charts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(charts)
      .where(eq(charts.visibility, 'PUBLIC'));

    return {
      charts: results,
      total: Number(total?.count) || 0
    };
  },

  /**
   * Delete chart share link by ID
   */
  async deleteChartShareLink(id: string): Promise<boolean> {
    const [deletedLink] = await db
      .delete(chartShareLinks)
      .where(eq(chartShareLinks.id, id))
      .returning({ id: chartShareLinks.id });

    return !!deletedLink;
  },
};

export default chartRepository;