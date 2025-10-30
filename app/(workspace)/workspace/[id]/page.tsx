"use client";

import { ChatSection } from "@/components/workspace/chat-section";
import { ChartArea } from "@/components/workspace/chart-area";
import { FloatingOptions } from "@/components/workspace/floating-options";
import { useWorkspace } from "@/hooks/useWorkspace";
import { use, useEffect } from "react";


export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { state, workspaceId, setWorkspaceId } = useWorkspace();
  console.log("🚀 ~ WorkspacePage ~ workspaceId:", workspaceId)
  const { id } = use(params)

  useEffect(() => {
    setWorkspaceId(id)
  }, [id])


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chart Area */}
      <div className="flex-1 overflow-auto relative">
        <ChartArea />
        {/* Floating Options Bar */}
        <FloatingOptions />
      </div>

      {/* Chat Section - Hidden on tablet and below, toggleable on desktop */}
      <div
        className={`hidden lg:block border-l transition-all duration-300 ease-in-out ${state.isChatVisible ? "w-80" : "w-0 overflow-hidden"
          }`}
      >
        {state.isChatVisible && <ChatSection />}
      </div>
    </div>
  );
}
