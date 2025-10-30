import { useWorkspaceStore } from '@/stores/workspaceStore';

// Custom hook to access workspace state and actions
// This maintains the same interface as the previous context-based implementation
export function useWorkspace() {
  const isChatVisible = useWorkspaceStore((store) => store.isChatVisible);
  const toggleChat = useWorkspaceStore((store) => store.toggleChat);
  const showChat = useWorkspaceStore((store) => store.showChat);
  const hideChat = useWorkspaceStore((store) => store.hideChat);
  const workspaceId = useWorkspaceStore((store) => store.workspaceId)
  const setWorkspaceId = useWorkspaceStore((store) => store.setWorkspaceId)

  return {
    state: { isChatVisible },
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
  };
}