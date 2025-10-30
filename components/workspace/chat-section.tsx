"use client";

import { useRef, useState } from "react";
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
import { DefaultChatTransport } from 'ai';
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface ChatSectionProps {
  className?: string; 
}

export function ChatSection({ className }: ChatSectionProps) {
  const [inputValue, setInputValue] = useState("");
  const {workspaceId} = useWorkspace()
  console.log("🚀 ~ ChatSection ~ workspaceId:", workspaceId)

  if(!workspaceId){
    return null
  }

  const { messages,setMessages, sendMessage, status, } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        conversationId:workspaceId // Replace with actual conversation ID
      }
    }),
    messages: [],
    onError: (error: any) => {
      console.error('Chat error:', error)
    },
    onToolCall: (toolCall) => {
      console.log('Tool call:', toolCall)
    },
    onData: (part) => {
      if (part.type === "data-notification") toast.success(part?.data?.message);
      if (part.type === "data-chart") console.log("Chart:", part.data);
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleSendMessage = async() => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      isUser: true,
    };

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
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquareIcon className="size-6" />}
              title="Start a conversation"
              description="Messages will appear here as the conversation progresses."
            />
          ) : (
            messages.map(({ id, role, parts }, index) => (
              <Message from={role} key={id}>
                <MessageContent>
                  {parts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      return (
                        <div key={partIndex} className="whitespace-pre-wrap">
                          <Response>{part.text}</Response>
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
