"use client";

import { useState, useEffect } from "react";
import { Maximize2, BarChart3, Palette, MessageSquare, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatSection } from "./chat-section";
import { useChartStore } from "@/stores/chartStore";
import { ChartType } from "@/types/chart";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function FloatingOptions() {
  const { isMobile, isTablet, isMobileOrTablet } = useMediaQuery();
  const [open, setOpen] = useState(false);
  const chartId = useChartStore(state => state.id);
  const chartType = useChartStore(state => state.type);
  const width = useChartStore(state => state.width);
  const height = useChartStore(state => state.height);
  const sizeOpen = useChartStore(state => state.sizeOpen);
  const chartTypeOpen = useChartStore(state => state.chartTypeOpen);
  
  const setType = useChartStore(state => state.setType);
  const setDimensions = useChartStore(state => state.setDimensions);
  const setSizeOpen = useChartStore(state => state.setSizeOpen);
  const setChartTypeOpen = useChartStore(state => state.setChartTypeOpen);
    console.log("🚀 ~ FloatingOptions ~ sizeOpen:", sizeOpen);
  
  const [sizeInputs, setSizeInputs] = useState({ 
    width: width.toString(), 
    height: height.toString() 
  });

  // Sync sizeInputs with store values when they change
  useEffect(() => {
    setSizeInputs({
      width: width.toString(),
      height: height.toString()
    });
  }, [width, height]);

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newWidth = parseInt(sizeInputs.width) || width;
    const newHeight = parseInt(sizeInputs.height) || height;
    
    // Update local store
    setDimensions(newWidth, newHeight);
    
    // Only update if chartId exists
    if (!chartId) {
      console.warn('No chart ID available, skipping API update');
      setSizeOpen(false);
      return;
    }
    
    // Send update to backend API
    try {
      const response = await fetch('/api/charts/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartId,
          width: newWidth,
          height: newHeight
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update chart size:', await response.json());
      }
    } catch (error) {
      console.error('Error updating chart size:', error);
    }
    
    setSizeOpen(false);
  };

  const handleChartTypeChange = async (newType: ChartType) => {
    // Update local store
    setType(newType);
    
    // Only update if chartId exists
    if (!chartId) {
      console.warn('No chart ID available, skipping API update');
      setChartTypeOpen(false);
      return;
    }
    
    // Send update to backend API
    try {
      const response = await fetch('/api/charts/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartId,
          type: newType
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update chart type:', await response.json());
      }
    } catch (error) {
      console.error('Error updating chart type:', error);
    }
    
    setChartTypeOpen(false);
  };

  const chartTypes: ChartType[] = ["bar", "line", "pie", "scatter", "heatmap", "funnel", "candlestick", "combo"];

  const options = [
    { icon: Maximize2, label: "Size", action: () => {} },
    { icon: BarChart3, label: "Chart type", action: () => {} },
    { icon: Palette, label: "Color", action: () => console.log("Color") },
    { icon: MessageSquare, label: "Annotate", action: () => console.log("Annotate") },
    { icon: Database, label: "Edit data", action: () => console.log("Edit data") },
  ];

  return (
    <>
      {isMobileOrTablet ? (
        /* Mobile/Tablet floating bar with chat popover */
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[90]">
          <div className="flex items-center gap-2 bg-background border rounded-full shadow-lg px-3 py-2">
            <Popover open={sizeOpen} onOpenChange={setSizeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 data-[state=open]:bg-primary/10"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 z-[100] border-2" align="center">
                <form onSubmit={handleSizeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={sizeInputs.width}
                      onChange={(e) => setSizeInputs({...sizeInputs, width: e.target.value})}
                      min="300"
                      max="1200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={sizeInputs.height}
                      onChange={(e) => setSizeInputs({...sizeInputs, height: e.target.value})}
                      min="200"
                      max="800"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Apply
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
            
            <Popover open={chartTypeOpen} onOpenChange={setChartTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 data-[state=open]:bg-primary/10"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 z-[100] border-2" align="center">
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((type) => (
                    <Button
                      key={type}
                      variant={chartType === type ? "secondary" : "ghost"}
                      size="sm"
                      className="capitalize"
                      onClick={() => handleChartTypeChange(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
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
      ) : (
        /* Desktop floating bar */
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[90]">
          <div className="flex items-center gap-1 bg-background border rounded-full shadow-lg px-2 py-2">
            <Popover open={sizeOpen} onOpenChange={setSizeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-primary/10 data-[state=open]:bg-primary/10"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="text-sm">Size</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 z-[100] border-2" align="center">
                <form onSubmit={handleSizeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={sizeInputs.width}
                      onChange={(e) => setSizeInputs({...sizeInputs, width: e.target.value})}
                      min="300"
                      max="1200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={sizeInputs.height}
                      onChange={(e) => setSizeInputs({...sizeInputs, height: e.target.value})}
                      min="200"
                      max="800"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Apply
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
            
            <Popover open={chartTypeOpen} onOpenChange={setChartTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-primary/10 data-[state=open]:bg-primary/10"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Chart type</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 z-[100] border-2" align="center">
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((type) => (
                    <Button
                      key={type}
                      variant={chartType === type ? "secondary" : "ghost"}
                      size="sm"
                      className="capitalize"
                      onClick={() => handleChartTypeChange(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            {options.slice(2).map((option, index) => (
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
      )}
    </>
  );
}
