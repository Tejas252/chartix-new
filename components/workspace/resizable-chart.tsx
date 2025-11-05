"use client";

import { useState, useRef, useEffect } from "react";
import { useChartStore } from "@/stores/chartStore";
import ChartRenderer from "@/components/charts/chartRenderer";
import { Card } from "@/components/ui/card";

export function ResizableChart() {
  const { width, height, type, data, updateDimensions } = useChartStore();
  const [currentDimensions, setCurrentDimensions] = useState({ width, height });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Update current dimensions when store dimensions change
  useEffect(() => {
    setCurrentDimensions({ width, height });
  }, [width, height]);

  // Get chart ID from store
  const chartId = useChartStore(state => state.id);

  // Handle dragging from different edges
  const startResizing = (direction: 'e' | 's' | 'se', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = currentDimensions.width;
    const startHeight = currentDimensions.height;
    
    let currentWidth = startWidth;
    let currentHeight = startHeight;
    
    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction.includes('e')) { // east (right)
        newWidth = Math.max(300, startWidth + (e.clientX - startX));
      }
      if (direction.includes('s')) { // south (bottom)
        newHeight = Math.max(200, startHeight + (e.clientY - startY));
      }
      if (direction === 'se') { // southeast (bottom-right)
        newWidth = Math.max(300, startWidth + (e.clientX - startX));
        newHeight = Math.max(200, startHeight + (e.clientY - startY));
      }
      
      currentWidth = newWidth;
      currentHeight = newHeight;
      
      const updatedDimensions = {
        width: newWidth,
        height: newHeight
      };
      
      setCurrentDimensions(updatedDimensions);
      updateDimensions(updatedDimensions.width, updatedDimensions.height);
    };

    const handleMouseUp = async () => {
      // Call API to save the new dimensions if chartId exists
      if (chartId) {
        try {
          const response = await fetch('/api/charts/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chartId,
              width: currentWidth,
              height: currentHeight
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to update chart size after resize:', await response.json());
          }
        } catch (error) {
          console.error('Error updating chart size after resize:', error);
        }
      } else {
        console.warn('No chart ID available, skipping API update after resize');
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={chartContainerRef}
      className="relative flex items-center justify-center"
      style={{ 
        width: currentDimensions.width, 
        height: currentDimensions.height,
      }}
    >
      <div className="w-full h-full">
        <Card className="w-full h-full p-4">
          <ChartRenderer 
            type={type} 
            data={data} 
            height={currentDimensions.height - 32} // Account for padding (p-4 = 1rem = 16px * 2)
          />
        </Card>
        
        {/* Edge resize handles */}
        {/* South (bottom) resize handle */}
        <div
          className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize hover:bg-primary/30 opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => startResizing('s', e)}
        />
        
        {/* East (right) resize handle */}
        <div
          className="absolute right-0 top-0 w-2 h-full cursor-e-resize hover:bg-primary/30 opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => startResizing('e', e)}
        />
        
        {/* Southeast (bottom-right) resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-primary/40"
          onMouseDown={(e) => startResizing('se', e)}
        >
          <svg 
            className="w-3 h-3 text-muted-foreground m-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 17l9.2-9.2M17 17V7H7" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}