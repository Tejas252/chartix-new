"use client";

import { Sidebar } from "@/components/workspace/sidebar";
import { ChatSection } from "@/components/workspace/chat-section";
import { ChartArea } from "@/components/workspace/chart-area";
import { FloatingOptions } from "@/components/workspace/floating-options";
import { WorkspaceProvider, useWorkspace } from "@/contexts/workspace-context";

function WorkspaceContent() {
  const { state } = useWorkspace();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 overflow-auto relative">
          <ChartArea />
          {/* Floating Options Bar */}
          <FloatingOptions />
        </div>

        {/* Chat Section - Hidden on tablet and below, toggleable on desktop */}
        <div
          className={`hidden lg:block border-l transition-all duration-300 ease-in-out ${
            state.isChatVisible ? "w-80" : "w-0 overflow-hidden"
          }`}
        >
          {state.isChatVisible && <ChatSection />}
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}
