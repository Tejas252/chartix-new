export type UniversalChartFormat = {
    columns: { id: string; type: "dimension" | "measure" , datatype: "string" | "number" | "date"}[];
    rows: { x: string | number | Date; y: number; series?: string }[];
  };
  
  export type ChartType =
    | "bar"
    | "line"
    | "combo"
    | "pie"
    | "heatmap"
    | "funnel"
    | "scatter"
    | "candlestick";
  
  export type ChartAnnotation = {
    x?: number | string | Date;
    y?: number;
    label?: string;
    color?: string;
  };
  