import { NextRequest } from "next/server";
import { authorizeUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { conversations, messages, files } from "@/utils/db/schema";
import { eq, or, and, like, desc, sql, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Get search and pagination parameters from query string
    const search = req.nextUrl.searchParams.get("search") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    // Validate pagination parameters
    const pageNumber = Math.max(1, page);
    const pageSize = Math.min(100, Math.max(1, limit)); // Max 100 per page, min 1

    // Get the authenticated user session
    const session = await authorizeUser(); // Authorize the user

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get total count for pagination (only for user's conversations)
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(
        and(
          or(
            like(conversations.title, `%${search}%`),
            exists(
              db
                .select()
                .from(messages)
                .where(
                  and(
                    eq(messages.conversationId, conversations.id),
                    like(sql<string>`(${messages.content})::text`, `%${search}%`)
                  )
                )
            )
          ),
          eq(conversations.userId, session.id)
        )
      );

    const totalCount = parseInt(String(totalCountResult[0]?.count || "0"));

    // Get conversations with pagination - only user's conversations
    // First get the conversation IDs with proper pagination
    const conversationIds = await db
      .select({ id: conversations.id })
      .from(conversations)
      .leftJoin(files, eq(conversations.fileId, files.id))
      .where(
        and(
          or(
            like(conversations.title, `%${search}%`),
            exists(
              db
                .select()
                .from(messages)
                .where(
                  and(
                    eq(messages.conversationId, conversations.id),
                    like(sql<string>`(${messages.content})::text`, `%${search}%`)
                  )
                )
            )
          ),
          eq(conversations.userId, session.id)
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    // If no conversations found, return empty result
    if (conversationIds.length === 0) {
      return new Response(
        JSON.stringify({
          data: [],
          pagination: {
            page: pageNumber,
            limit: pageSize,
            total: totalCount,
            pages: Math.ceil(totalCount / pageSize),
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Extract conversation IDs
    const ids = conversationIds.map(c => c.id);

    // Now get full conversation details for these IDs including the latest message
    const conversationsResult = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        fileName: files.name,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .leftJoin(files, eq(conversations.fileId, files.id))
      .where(inArray(conversations.id, ids))
      .orderBy(desc(conversations.updatedAt));

    // For each conversation, get the latest message
    const detailedConversations = [];
    for (const conv of conversationsResult) {
      // Get the latest message for this conversation
      const latestMessage = await db
        .select({ content: messages.content })
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      detailedConversations.push({
        id: conv.id,
        title: conv.title || `Conversation ${conv.id.slice(0, 8)}`,
        fileName: conv.fileName || "No file",
        lastMessage: latestMessage[0]?.content || null,
        lastMessageAt: conv.updatedAt.toISOString(),
        user: "Unknown"
      });
    }

    return new Response(
      JSON.stringify({
        data: detailedConversations,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total: totalCount,
          pages: Math.ceil(totalCount / pageSize),
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Helper functions for complex queries
import { exists, inArray } from "drizzle-orm";