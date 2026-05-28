import type { AppState, ProjectFolder, Reminder } from './types';

const STORAGE_KEY = 'tasker-app-state';

const DEFAULT_STATE: AppState = {
  user: {
    name: 'Your Name',
    wallpaper: 'gradient-sky',
  },
  folders: [
    {
      id: 'work',
      name: 'Work',
      color: '#2563eb',
      description: 'Work-related tasks and projects',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'personal',
      name: 'Personal',
      color: '#16a34a',
      description: 'Personal goals and reminders',
      createdAt: new Date().toISOString(),
    },
  ],
  reminders: [
    {
      id: 'r1',
      folderId: 'work',
      title: 'Review project proposal',
      notes: 'Check the Q3 proposal document',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
      flagged: true,
    },
    {
      id: 'r2',
      folderId: 'personal',
      title: 'Buy groceries',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
      flagged: false,
    },
  ],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as AppState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createFolder(partial: Omit<ProjectFolder, 'id' | 'createdAt'>): ProjectFolder {
  return {
    ...partial,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
}

export function createReminder(partial: Omit<Reminder, 'id' | 'createdAt'>): Reminder {
  return {
    ...partial,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
}
