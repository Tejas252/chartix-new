"use client";

import { Share2, Menu, PanelRightClose, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ResizableChart } from "./resizable-chart";
import { useChartStore } from "@/stores/chartStore";
import { useEffect } from "react";
import { ChartLoader } from "./chart-loader";

export function ChartArea() {
  const { state, dispatch } = useWorkspace();
  const { setData, setTitle, isLoading, data, title } = useChartStore();

  // Initialize chart data if it doesn't exist and not loading
  useEffect(() => {
    // Initialize with some default chart data only once if no data and not loading
    const chartState = useChartStore.getState();
    if (!isLoading && chartState.data.columns.length === 0) {
      // setData({
      //   columns: [
      //     { id: "name", type: "dimension", datatype: "string" },
      //     { id: "value", type: "measure", datatype: "number" }
      //   ],
      //   rows: [
      //     { x: "A", y: 30 },
      //     { x: "B", y: 40 },
      //     { x: "C", y: 35 },
      //     { x: "D", y: 50 },
      //     { x: "E", y: 45 }
      //   ]
      // });
      // Set a default title if none exists
      if (!chartState.title || chartState.title === 'Untitled Chart') {
        setTitle('Untitled Chart');
      }
    }
  }, [setData, setTitle, isLoading]); // This should run when setData, setTitle or isLoading changes

  const toggleChat = () => {
    dispatch({ type: "TOGGLE_CHAT" });
  };

  const hasData = data.columns.length > 0 && data.rows.length > 0;

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
          <span className="text-foreground">{title}</span>
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

      {/* Chart Area */}
      <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
        <div className="bg-muted/30 p-0 max-h-full max-w-full w-full flex items-center justify-center">
          {isLoading ? (
            // Custom animated chart loader
            <ChartLoader />
          ) : hasData ? (
            // Chart component when data is available
            <ResizableChart />
          ) : (
            // Empty state when no data
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Menu className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No chart data available</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Start a conversation to generate chart data. Ask questions about your data to see visualizations here.
              </p>
              <Button variant="outline" onClick={() => {
                // This would trigger a sample conversation or help the user get started
                console.log("Help user get started with creating a chart");
              }}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
