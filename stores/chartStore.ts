import { create } from 'zustand';
import { UniversalChartFormat, ChartType } from '@/types/chart';

type ChartState = {
  // Chart configuration
  type: ChartType;
  data: UniversalChartFormat;
  title: string;
  id?: string; // Optional chart ID
  
  // Chart dimensions
  width: number;
  height: number;
  
  // Loading state
  isLoading: boolean;
  
  // Floating options state
  sizeOpen: boolean;
  chartTypeOpen: boolean;
  
  // State management functions
  setType: (type: ChartType) => void;
  setData: (data: UniversalChartFormat) => void;
  setTitle: (title: string) => void;
  setChartId: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setDimensions: (width: number, height: number) => void;
  updateDimensions: (width?: number, height?: number) => void;
  
  // Floating options functions
  setSizeOpen: (open: boolean) => void;
  setChartTypeOpen: (open: boolean) => void;
};

// Default chart state
const defaultChartState: Omit<ChartState, 'setType' | 'setData' | 'setTitle' | 'setChartId' | 'setLoading' | 'setDimensions' | 'updateDimensions' | 'setSizeOpen' | 'setChartTypeOpen'> = {
  type: 'bar',
  data: {
    columns: [],
    rows: []
  },
  title: 'Untitled Chart',
  id: undefined,
  width: 800,
  height: 500,
  isLoading: false,
  sizeOpen: false,
  chartTypeOpen: false,
};

export const useChartStore = create<ChartState>((set, get) => ({
  ...defaultChartState,
  
  setType: (type) => set({ type }),
  
  setData: (data) => set({ data }),
  
  setTitle: (title) => set({ title }),
  
  setChartId: (id) => set({ id }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setDimensions: (width, height) => set({ width, height }),
  
  updateDimensions: (width, height) => {
    const current = get();
    set({
      width: width !== undefined ? width : current.width,
      height: height !== undefined ? height : current.height,
    });
  },
  
  setSizeOpen: (open) => set({ sizeOpen: open }),
  
  setChartTypeOpen: (open) => set({ chartTypeOpen: open }),
}));