"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the state interface
interface WorkspaceState {
  isChatVisible: boolean;
  // Future: Add more state properties here
  // chartData: any;
  // messages: Message[];
  // selectedChartType: string;
  // etc.
}

// Define action types
type WorkspaceAction =
  | { type: "TOGGLE_CHAT" }
  | { type: "SHOW_CHAT" }
  | { type: "HIDE_CHAT" };
  // Future: Add more action types here
  // | { type: "SET_CHART_DATA"; payload: any }
  // | { type: "ADD_MESSAGE"; payload: Message }
  // | { type: "UPDATE_CHART_TYPE"; payload: string }

// Initial state
const initialState: WorkspaceState = {
  isChatVisible: true,
};

// Reducer function
function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction
): WorkspaceState {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return {
        ...state,
        isChatVisible: !state.isChatVisible,
      };
    case "SHOW_CHAT":
      return {
        ...state,
        isChatVisible: true,
      };
    case "HIDE_CHAT":
      return {
        ...state,
        isChatVisible: false,
      };
    // Future: Add more cases here
    // case "SET_CHART_DATA":
    //   return {
    //     ...state,
    //     chartData: action.payload,
    //   };
    default:
      return state;
  }
}

// Context interface
interface WorkspaceContextType {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
}

// Create context
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// Provider component
interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Custom hook to use the workspace context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
