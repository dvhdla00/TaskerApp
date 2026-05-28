export type Priority = 'low' | 'medium' | 'high';

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  dueTime?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  folderId: string;
  flagged: boolean;
}

export interface ProjectFolder {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  wallpaper: string;
}

export interface AppState {
  user: UserProfile;
  folders: ProjectFolder[];
  reminders: Reminder[];
}
