"use client";

import { useState } from "react";
import { Maximize2, BarChart3, Palette, MessageSquare, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatSection } from "./chat-section";

export function FloatingOptions() {
  const [open, setOpen] = useState(false);

  const options = [
    { icon: Maximize2, label: "Size", action: () => console.log("Size") },
    { icon: BarChart3, label: "Chart type", action: () => console.log("Chart type") },
    { icon: Palette, label: "Color", action: () => console.log("Color") },
    { icon: MessageSquare, label: "Annotate", action: () => console.log("Annotate") },
    { icon: Database, label: "Edit data", action: () => console.log("Edit data") },
  ];

  return (
    <>
      {/* Desktop floating bar */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-background border rounded-full shadow-lg px-2 py-2">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full hover:bg-primary/10"
              onClick={option.action}
            >
              <option.icon className="h-4 w-4" />
              <span className="text-sm">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet floating bar with chat popover */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-background border rounded-full shadow-lg px-3 py-2">
          {options.slice(0, 3).map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-primary/10"
              onClick={option.action}
            >
              <option.icon className="h-4 w-4" />
            </Button>
          ))}
          
          {/* Chat Popover for mobile */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/10"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="w-[90vw] h-[70vh] p-0 mb-2"
            >
              <ChatSection />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/10"
            onClick={options[4].action}
          >
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
