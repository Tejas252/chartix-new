"use client";

import dynamic from "next/dynamic";
import { transformToApex } from "@/lib/helpers/chart-transformers";
import { UniversalChartFormat, ChartType, ChartAnnotation } from "@/types/chart";
import { useMemo } from "react";
import { useChartStore } from "@/stores/chartStore";
import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  type: ChartType;
  data: UniversalChartFormat;
  annotations?: ChartAnnotation[];
  height?: number;
};

type chartTypes = "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

export default function ChartRenderer({ type, data, annotations = [], height = 400 }: Props) {
  const { theme } = useTheme();
  const { series, options, chartType } = useMemo(() => {
    const result = transformToApex({ ...data }, type, [...annotations]);
    
    // Define theme-based colors
    const axisFontColor = theme === 'dark' ? '#ffffff' : '#374151'; // White in dark, gray in light
    const axisLineColor = theme === 'dark' ? '#4B5563' : '#9CA3AF'; // Different line color in dark mode
    
    // Create new options object with theme-aware axis configurations
    const themeAwareOptions: any = {
      ...result.options,
      tooltip: {
        ...(result.options.tooltip || {}),
        theme: theme || 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
        },
      },
    };
    
    // Only modify xaxis if it exists
    if (result.options.xaxis) {
      themeAwareOptions.xaxis = {
        ...result.options.xaxis,
      };
      
      if (result.options.xaxis.labels) {
        themeAwareOptions.xaxis.labels = {
          ...result.options.xaxis.labels,
          style: {
            ...(result.options.xaxis.labels.style || {}),
            colors: [axisFontColor],
            fontSize: 12,
          }
        };
      } else {
        themeAwareOptions.xaxis.labels = {
          style: {
            colors: [axisFontColor],
            fontSize: 12,
          }
        };
      }
      
      // Update axis line and tick colors
      if (result.options.xaxis.axisBorder) {
        themeAwareOptions.xaxis.axisBorder = {
          ...result.options.xaxis.axisBorder,
          color: axisLineColor,
        };
      } else {
        themeAwareOptions.xaxis.axisBorder = {
          color: axisLineColor,
        };
      }
      
      if (result.options.xaxis.axisTicks) {
        themeAwareOptions.xaxis.axisTicks = {
          ...result.options.xaxis.axisTicks,
          color: axisLineColor,
        };
      } else {
        themeAwareOptions.xaxis.axisTicks = {
          color: axisLineColor,
        };
      }
    }
    
    // Only modify yaxis if it exists
    if (result.options.yaxis) {
      if (Array.isArray(result.options.yaxis)) {
        // Handle multiple y-axes
        themeAwareOptions.yaxis = result.options.yaxis.map((axis: any) => {
          const newAxis: any = { ...axis };
          
          if (axis.labels) {
            newAxis.labels = {
              ...axis.labels,
              style: {
                ...(axis.labels.style || {}),
                colors: [axisFontColor],
                fontSize: 12,
              }
            };
          } else {
            newAxis.labels = {
              style: {
                colors: [axisFontColor],
                fontSize: 12,
              }
            };
          }
          
          return newAxis;
        });
      } else {
        // Handle single y-axis
        themeAwareOptions.yaxis = {
          ...result.options.yaxis,
        };
        
        if (result.options.yaxis.labels) {
          themeAwareOptions.yaxis.labels = {
            ...result.options.yaxis.labels,
            style: {
              ...(result.options.yaxis.labels.style || {}),
              colors: [axisFontColor],
              fontSize: 12,
            }
          };
        } else {
          themeAwareOptions.yaxis.labels = {
            style: {
              colors: [axisFontColor],
              fontSize: 12,
            }
          };
        }
      }
    }
    
    return { ...result, options: themeAwareOptions };
  }, [data, type, annotations, theme]);
  
  console.log("🚀 ~ ChartRenderer ~ chartType:", chartType)
  console.log("🚀 ~ ChartRenderer ~ options:", options)
  console.log("🚀 ~ ChartRenderer ~ series:", series)

  return (
    <div className={`w-full h-full ${theme === 'dark' ? 'dark' : ''}`}>
      <ReactApexChart
        key={type}
        options={options}
        series={series}
        type={(chartType ? chartType : type) as chartTypes}
        height={height}
        width="100%"
      />
    </div>
  );
}
