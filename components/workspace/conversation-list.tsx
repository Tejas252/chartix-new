"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageCircle, FileText, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  title: string;
  fileName: string;
  lastMessage: any;
  lastMessageAt: string;
  user: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ConversationResponse {
  data: Conversation[];
  pagination: Pagination;
}

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [searchTerm, currentPage]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        page: currentPage.toString(),
        limit: "10"
      });

      const response = await fetch(`/api/conversations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      
      const data: ConversationResponse = await response.json();
      setConversations(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load conversations. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => fetchConversations()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Your Conversations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {conversations.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No conversations found
              </p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <Link 
                    key={conversation.id} 
                    href={`/workspace/${conversation.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{conversation.title}</h3>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4 mr-1" />
                              <span className="truncate">{conversation.fileName}</span>
                            </div>
                            {/* {conversation.lastMessage && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {typeof conversation.lastMessage === 'object' && 
                                  conversation.lastMessage.text 
                                  ? conversation.lastMessage.text 
                                  : conversation.lastMessage?.parts?.find((mes) => mes?.type === "text")?.text
                                  }
                              </p>
                            )} */}
                          </div>
                          <div className="ml-4 text-right text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {pagination.pages} ({pagination.total} total)
                </div>
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}