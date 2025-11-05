"use client";

import { useRef, useState, useEffect } from "react";
import { MessageSquareIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  PromptInput,
  PromptInputBody,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { Message, MessageContent } from "../ai-elements/message";
import { Response } from "../ai-elements/response";
import { nanoid } from "zod";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useChartStore } from "@/stores/chartStore";
import { UniversalChartFormat } from "@/types/chart";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface ChatSectionProps {
  className?: string; 
}

function ChatSectionContent({ className, workspaceId }: ChatSectionProps & { workspaceId: string }) {
  const [inputValue, setInputValue] = useState("");
  const { setData } = useChartStore()
  const { setMessages, messages: storeMessages, isMessagesLoading } = useWorkspace()
  console.log("🚀 ~ ChatSectionContent ~ storeMessages:", storeMessages)
  console.log("🚀 ~ ChatSectionContent ~ isMessagesLoading:", isMessagesLoading)
  
  const { messages, setMessages:updateMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        conversationId: workspaceId
      }
    }),
    messages: [], // Start with empty messages; we'll update them when API data is available
    onError: (error: any) => {
      console.error('Chat error:', error)
    },
    onToolCall: (toolCall) => {
      console.log('Tool call:', toolCall)
    },
    onData: (part) => {
      if (part.type === "data-notification") toast.success(part?.data?.message);
      if (part.type === "data-chart") {
        console.log("🚀 ~ onData ~ part.data:", part)
        setData(part?.data?.normalized as UniversalChartFormat);
      }
    }
  });

  // Sync messages to the store whenever messages change
  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);
  
  // When storeMessages change (newly loaded from API after initial render), update the chat messages
  useEffect(() => {
    if (storeMessages && storeMessages.length > 0 && messages.length === 0) {
      // Only update if chat currently has no messages (i.e., initial load)
      console.log("Updating chat with initial messages from store:", storeMessages);
      updateMessages(storeMessages);
    }
  }, [storeMessages, messages, updateMessages]);


  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async() => {
    if (!inputValue.trim()) return;

    sendMessage({text:inputValue})
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b h-[57px]">
        <h2 className="text-lg font-semibold">Ask AI</h2>
      </div>

      {/* Messages */}
      <Conversation className="relative size-full" style={{ height: '498px' }}>
        <ConversationContent>
          {isMessagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                <p>Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-6" />}
              title="Start a conversation"
              description="Messages will appear here as the conversation progresses."
            />
          ) : (
            messages.map(({ id, role, parts }, index) => (
              <Message from={role?.toLowerCase()} key={id}>
                <MessageContent>
                  {parts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      return (
                        <div key={partIndex} className="whitespace-pre-wrap">
                          <Response>{part.text}</Response>
                        </div>
                      );
                    }else if("text-response" in part){
                      return (
                        <div key={partIndex} className="whitespace-pre-wrap">
                          <Response>{part?.["text-response"] as string}</Response>
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="px-6 py-4 border-t">
        <div className="flex items-center gap-2">
          <PromptInput globalDrop multiple onSubmit={handleSendMessage} className="w-full flex items-center">
            <PromptInputBody className="w-full max-h-[100px] overflow-auto">
              <PromptInputTextarea
                onChange={(e) => setInputValue(e.target.value)}
                ref={textareaRef}
                value={inputValue}
              />
            </PromptInputBody>
            <PromptInputToolbar className="flex justify-end">
              <PromptInputSubmit status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

export function ChatSection({ className }: ChatSectionProps) {
  const {workspaceId} = useWorkspace()
  console.log("🚀 ~ ChatSection ~ workspaceId:", workspaceId)

  if(!workspaceId){
    return null
  }

  return <ChatSectionContent className={className} workspaceId={workspaceId} />;
}
