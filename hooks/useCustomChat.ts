import { useState, useCallback } from 'react';
import { UIMessage } from 'ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: Array<{
    type: 'text';
    text: string;
  }>;
  timestamp: Date;
}

interface ProcessedData {
  success: boolean;
  data: any;
  originalResponse?: string;
}

export function useCustomChat(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    setIsLoading(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: messageText }],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
        }),
      });

      const result: ProcessedData = await response.json();

      if (result.success) {
        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          parts: [{ 
            type: 'text', 
            text: JSON.stringify(result.data, null, 2) 
          }],
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setProcessedData(result.data);
      } else {
        throw new Error(result.originalResponse || 'Unknown error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        parts: [{ 
          type: 'text', 
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationId]);

  return {
    messages,
    sendMessage,
    isLoading,
    processedData,
  };
}
