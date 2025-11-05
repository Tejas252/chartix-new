"use client";

import { ChatSection } from "@/components/workspace/chat-section";
import { ChartArea } from "@/components/workspace/chart-area";
import { FloatingOptions } from "@/components/workspace/floating-options";
import { useWorkspace } from "@/hooks/useWorkspace";
import { use, useEffect, useCallback } from "react";
import { useChartStore } from "@/stores/chartStore";
import { UniversalChartFormat } from "@/types/chart";


export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { state, workspaceId, setWorkspaceId, setMessages, setIsMessagesLoading } = useWorkspace();
  const { setData, setTitle, setChartId, setType, setDimensions, setLoading,height,width } = useChartStore();
  console.log("🚀 ~ WorkspacePage ~ workspaceId:", workspaceId)
  const { id } = use(params)

  useEffect(() => {
    setWorkspaceId(id)
  }, [id, setWorkspaceId])

  const fetchMessages = useCallback(async () => {
    try {
      setIsMessagesLoading(true);
      const response = await fetch(`/api/messages?conId=${workspaceId}`);
      const data = await response.json();
      
      if (data.success === false) {
        console.error('Error fetching messages:', data.message);
        return;
      }
      
      // Set the messages directly from the API response (already in correct format)
      const apiMessages = data?.messages || [];
      console.log("Setting messages from API:", apiMessages); // Debug log
      setMessages(apiMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsMessagesLoading(false);
    }
  }, [workspaceId, setIsMessagesLoading, setMessages]);

  // Fetch chart data for the conversation when the page loads
  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(`/api/charts/getchartFromConversation/${workspaceId}`);
      const result = await response.json();
      
      if (response.ok && result.data) {
        // Set the chart data from the API response
        const chartData: UniversalChartFormat = result.data;
        setData(chartData);
        
        // Set the chart title from the API response if available
        if (result.title) {
          setTitle(result.title);
        }
        
        // Set the chart ID from the API response if available
        if (result.id) {
          setChartId(result.id);
        }
        
        // Set chart dimensions and type from config if available
        if (result.config) {
          if (result.config.width && result.config.height) {
            setDimensions(result.config.width, result.config.height);
          }
          if (result.config.type) {
            setType(result.config.type);
          }
        }
      } else {
        console.error('Error fetching chart data:', result.error || result.message);
        // Optionally set default data if API call fails
        setData({
          columns: [
            { id: "name", type: "dimension", datatype: "string" },
            { id: "value", type: "measure", datatype: "number" }
          ],
          rows: [
            { x: "A", y: 30 },
            { x: "B", y: 40 },
            { x: "C", y: 35 },
            { x: "D", y: 50 },
            { x: "E", y: 45 }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Set default data on error
      setData({
        columns: [
          { id: "name", type: "dimension", datatype: "string" },
          { id: "value", type: "measure", datatype: "number" }
        ],
        rows: [
          { x: "A", y: 30 },
          { x: "B", y: 40 },
          { x: "C", y: 35 },
          { x: "D", y: 50 },
          { x: "E", y: 45 }
        ]
      });
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  }, [workspaceId, setData, setTitle, setChartId, setType, setDimensions, setLoading]);

  // Load messages and chart data when workspaceId changes
  useEffect(() => {
    if (workspaceId) {
      fetchMessages();
      fetchChartData();
    }
  }, [workspaceId, fetchMessages, fetchChartData]);


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
        {state.isChatVisible && !state.isMessagesLoading && <ChatSection />}
        {state.isChatVisible && state.isMessagesLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
              <p>Loading chat history...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
