import { create } from 'zustand';
import { UIMessage } from 'ai';

// Define the state interface
interface WorkspaceState {
  isChatVisible: boolean;
  workspaceId?: string;
  messages: UIMessage[];
  isMessagesLoading: boolean;
  // Future: Add more state properties here
  // chartData: any;
  // selectedChartType: string;
  // etc.
}

// Define the actions interface
interface WorkspaceActions {
  toggleChat: () => void;
  showChat: () => void;
  hideChat: () => void;
  setWorkspaceId: (id:string) => void;
  setMessages: (messages: UIMessage[]) => void;
  addMessage: (message: UIMessage) => void;
  setIsMessagesLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
  // Future: Add more actions here
  // setChartData: (data: any) => void;
  // updateChartType: (type: string) => void;
}

// Combine state and actions
interface WorkspaceStore extends WorkspaceState, WorkspaceActions {}

// Create the store
const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  // Initial state
  isChatVisible: true,
  workspaceId:undefined,
  messages: [],
  isMessagesLoading: false,

  // Actions
  toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
  showChat: () => set({ isChatVisible: true }),
  hideChat: () => set({ isChatVisible: false }),
  setWorkspaceId: (id:string) => set({workspaceId:id}),
  setMessages: (messages: UIMessage[]) => set({ messages }),
  addMessage: (message: UIMessage) => set((state) => ({ messages: [...state.messages, message] })),
  setIsMessagesLoading: (isLoading: boolean) => set({ isMessagesLoading: isLoading }),
  clearMessages: () => set({ messages: [] })
  
  // Future: Add more actions here
  // setChartData: (data) => set({ chartData: data }),
  // updateChartType: (type) => set({ selectedChartType: type }),
}));

export { useWorkspaceStore };