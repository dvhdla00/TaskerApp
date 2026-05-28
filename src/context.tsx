import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { AppState, ProjectFolder, Reminder, UserProfile } from './types';
import { loadState, saveState, createFolder, createReminder } from './store';

type Action =
  | { type: 'SET_USER'; payload: Partial<UserProfile> }
  | { type: 'ADD_FOLDER'; payload: Omit<ProjectFolder, 'id' | 'createdAt'> }
  | { type: 'UPDATE_FOLDER'; payload: { id: string } & Partial<ProjectFolder> }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'ADD_REMINDER'; payload: Omit<Reminder, 'id' | 'createdAt'> }
  | { type: 'UPDATE_REMINDER'; payload: { id: string } & Partial<Reminder> }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'TOGGLE_REMINDER'; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, createFolder(action.payload)] };
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload.id ? { ...f, ...action.payload } : f
        ),
      };
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter(f => f.id !== action.payload),
        reminders: state.reminders.filter(r => r.folderId !== action.payload),
      };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, createReminder(action.payload)] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    case 'DELETE_REMINDER':
      return { ...state, reminders: state.reminders.filter(r => r.id !== action.payload) };
    case 'TOGGLE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload ? { ...r, completed: !r.completed } : r
        ),
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
