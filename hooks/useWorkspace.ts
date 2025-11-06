import { useWorkspaceStore } from '@/stores/workspaceStore';
import { UIMessage } from 'ai';

// Custom hook to access workspace state and actions
// This maintains the same interface as the previous context-based implementation
export function useWorkspace() {
  const isChatVisible = useWorkspaceStore((store) => store.isChatVisible);
  const toggleChat = useWorkspaceStore((store) => store.toggleChat);
  const showChat = useWorkspaceStore((store) => store.showChat);
  const hideChat = useWorkspaceStore((store) => store.hideChat);
  const workspaceId = useWorkspaceStore((store) => store.workspaceId)
  const setWorkspaceId = useWorkspaceStore((store) => store.setWorkspaceId)
  const messages = useWorkspaceStore((store) => store.messages);
  const setMessages = useWorkspaceStore((store) => store.setMessages);
  const addMessage = useWorkspaceStore((store) => store.addMessage);
  const isMessagesLoading = useWorkspaceStore((store) => store.isMessagesLoading);
  const setIsMessagesLoading = useWorkspaceStore((store) => store.setIsMessagesLoading);
  const clearMessages = useWorkspaceStore((store) => store.clearMessages);
  const pendingPrompt = useWorkspaceStore((store) => store.pendingPrompt);
  const setPendingPrompt = useWorkspaceStore((store) => store.setPendingPrompt);
  const clearPendingPrompt = useWorkspaceStore((store) => store.clearPendingPrompt);

  return {
    state: { 
      isChatVisible,
      messages,
      isMessagesLoading,
      workspaceId,
      pendingPrompt,
    },
    dispatch: (action: { type: "TOGGLE_CHAT" | "SHOW_CHAT" | "HIDE_CHAT" }) => {
      switch (action.type) {
        case "TOGGLE_CHAT":
          toggleChat();
          break;
        case "SHOW_CHAT":
          showChat();
          break;
        case "HIDE_CHAT":
          hideChat();
          break;
      }
    },
    toggleChat,
    showChat,
    hideChat,
    workspaceId,
    setWorkspaceId,
    messages,
    setMessages,
    addMessage,
    isMessagesLoading,
    setIsMessagesLoading,
    clearMessages,
    pendingPrompt,
    setPendingPrompt,
    clearPendingPrompt,
  };
}