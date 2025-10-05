"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Give me sales by composite entity of customer & sales person",
      timestamp: "Today at 4:43 PM",
      isUser: true,
    },
    {
      id: "2",
      content:
        "Create a composite key of Customer Name and Sales Person Group by Customer & Sales Person and sum the Net Sales Total",
      timestamp: "Today at 4:44 PM",
      isUser: false,
    },
    {
      id: "3",
      content: "sales by sales person",
      timestamp: "Today at 4:44 PM",
      isUser: true,
    },
    {
      id: "4",
      content:
        "Group sales by sales person and sum the net sales total. Sort the total sales in descending order.",
      timestamp: "Today at 4:44 PM",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      isUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b h-[57px]">
        <h2 className="text-lg font-semibold">Ask AI</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              {message.isUser ? (
                <div className="bg-foreground text-background px-4 py-2.5 rounded-lg inline-block max-w-[85%]">
                  <p className="text-sm">{message.content}</p>
                </div>
              ) : (
                <div className="bg-muted px-4 py-2.5 rounded-lg max-w-[85%]">
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">{message.timestamp}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-6 py-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Press Enter to send, Shift+Enter for new line"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
