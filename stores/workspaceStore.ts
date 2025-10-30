import { create } from 'zustand';

// Define the state interface
interface WorkspaceState {
  isChatVisible: boolean;
  workspaceId?: string;
  // Future: Add more state properties here
  // chartData: any;
  // messages: Message[];
  // selectedChartType: string;
  // etc.
}

// Define the actions interface
interface WorkspaceActions {
  toggleChat: () => void;
  showChat: () => void;
  hideChat: () => void;
  setWorkspaceId: (id:string) => void;
  // Future: Add more actions here
  // setChartData: (data: any) => void;
  // addMessage: (message: Message) => void;
  // updateChartType: (type: string) => void;
}

// Combine state and actions
interface WorkspaceStore extends WorkspaceState, WorkspaceActions {}

// Create the store
const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  // Initial state
  isChatVisible: true,
  workspaceId:undefined,

  // Actions
  toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
  showChat: () => set({ isChatVisible: true }),
  hideChat: () => set({ isChatVisible: false }),
  setWorkspaceId: (id:string) => set({workspaceId:id})

  
  // Future: Add more actions here
  // setChartData: (data) => set({ chartData: data }),
  // addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  // updateChartType: (type) => set({ selectedChartType: type }),
}));

export { useWorkspaceStore };