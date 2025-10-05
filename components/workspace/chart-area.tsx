"use client";

import { Share2, Menu, PanelRightClose, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/workspace-context";

export function ChartArea() {
  const { state, dispatch } = useWorkspace();

  const toggleChat = () => {
    dispatch({ type: "TOGGLE_CHAT" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b h-[57px]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          <span>Home</span>
          <span>/</span>
          <span className="text-foreground">How popular are America's richest?</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden lg:flex"
            onClick={toggleChat}
            title={state.isChatVisible ? "Hide chat" : "Show chat"}
          >
            {state.isChatVisible ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="flex-1 p-6">
        <Card className="h-full flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <div className="w-full max-w-2xl mx-auto h-96 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Chart Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your chart will appear here
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
