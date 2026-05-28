import { useState } from 'react';
import { Plus, Settings, MoreHorizontal, Pencil, Trash2, Flag, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context';
import type { ProjectFolder } from '../types';
import FolderIcon from '../components/FolderIcon';
import FolderModal from '../components/FolderModal';
import ProfileModal from '../components/ProfileModal';
import { getWallpaperStyle } from '../utils/wallpaper';

interface HomePageProps {
  onSelectFolder: (id: string) => void;
}

export default function HomePage({ onSelectFolder }: HomePageProps) {
  const { state, dispatch } = useApp();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ProjectFolder | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const wallpaperStyle = getWallpaperStyle(state.user.wallpaper);

  const getTotalReminders = (folderId: string) =>
    state.reminders.filter(r => r.folderId === folderId && !r.completed).length;

  const getCompletedCount = (folderId: string) =>
    state.reminders.filter(r => r.folderId === folderId && r.completed).length;

  const todayReminders = state.reminders.filter(r => {
    if (!r.dueDate || r.completed) return false;
    return r.dueDate === new Date().toISOString().split('T')[0];
  });

  const flaggedReminders = state.reminders.filter(r => r.flagged && !r.completed);
  const allIncomplete = state.reminders.filter(r => !r.completed);

  const handleSaveFolder = (data: Omit<ProjectFolder, 'id' | 'createdAt'>) => {
    if (editingFolder) {
      dispatch({ type: 'UPDATE_FOLDER', payload: { id: editingFolder.id, ...data } });
    } else {
      dispatch({ type: 'ADD_FOLDER', payload: data });
    }
    setShowFolderModal(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm('Delete this folder and all its reminders?')) {
      dispatch({ type: 'DELETE_FOLDER', payload: id });
    }
    setMenuOpenId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: wallpaperStyle }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setShowProfileModal(true)}
            >
              {state.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none mb-0.5">Good {getGreeting()}</p>
              <h1 className="text-base font-semibold text-gray-900 leading-none">{state.user.name}</h1>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors shadow-sm"
            title="Settings"
          >
            <Settings size={15} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            icon={<CheckCircle2 size={18} className="text-blue-500" />}
            label="All Reminders"
            count={allIncomplete.length}
            color="blue"
          />
          <SummaryCard
            icon={<Calendar size={18} className="text-orange-500" />}
            label="Today"
            count={todayReminders.length}
            color="orange"
          />
          <SummaryCard
            icon={<Flag size={18} className="text-red-500" />}
            label="Flagged"
            count={flaggedReminders.length}
            color="red"
          />
        </div>

        {/* Folders section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-700">My Projects</h2>
            <button
              onClick={() => { setEditingFolder(null); setShowFolderModal(true); }}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus size={16} />
              New Folder
            </button>
          </div>

          {state.folders.length === 0 ? (
            <div
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-12 text-center cursor-pointer hover:bg-white/70 transition-colors"
              onClick={() => setShowFolderModal(true)}
            >
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Plus size={24} className="text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm">Create your first project folder</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {state.folders.map(folder => {
                const pending = getTotalReminders(folder.id);
                const done = getCompletedCount(folder.id);
                const total = pending + done;

                return (
                  <div
                    key={folder.id}
                    className="relative group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-4 cursor-pointer hover:bg-white/80 hover:shadow-apple transition-all duration-200 select-none"
                    onClick={() => onSelectFolder(folder.id)}
                  >
                    {/* Context menu button */}
                    <button
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-white shadow-sm z-10"
                      onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === folder.id ? null : folder.id); }}
                    >
                      <MoreHorizontal size={14} className="text-gray-500" />
                    </button>

                    {/* Dropdown menu */}
                    {menuOpenId === folder.id && (
                      <div
                        className="absolute top-11 right-3 z-20 bg-white rounded-xl shadow-apple-lg border border-gray-100 overflow-hidden min-w-[140px]"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => { setEditingFolder(folder); setShowFolderModal(true); setMenuOpenId(null); }}
                        >
                          <Pencil size={14} className="text-gray-400" />
                          Edit
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => handleDeleteFolder(folder.id)}
                        >
                          <Trash2 size={14} className="text-red-400" />
                          Delete
                        </button>
                      </div>
                    )}

                    <FolderIcon color={folder.color} size={56} className="folder-shadow mb-3" />

                    <p className="text-sm font-semibold text-gray-800 truncate">{folder.name}</p>

                    {folder.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{folder.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium" style={{ color: folder.color }}>
                        {pending} {pending === 1 ? 'task' : 'tasks'}
                      </span>
                      {done > 0 && (
                        <span className="text-xs text-gray-400">· {done}/{total} done</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add folder card */}
              <div
                className="bg-white/40 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/60 p-4 cursor-pointer hover:bg-white/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[140px]"
                onClick={() => { setEditingFolder(null); setShowFolderModal(true); }}
              >
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <Plus size={20} className="text-gray-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">New Folder</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {menuOpenId && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
      )}

      {showFolderModal && (
        <FolderModal
          folder={editingFolder}
          onSave={handleSaveFolder}
          onClose={() => { setShowFolderModal(false); setEditingFolder(null); }}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          user={state.user}
          onSave={data => dispatch({ type: 'SET_USER', payload: data })}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: string }) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50/80',
    orange: 'bg-orange-50/80',
    red: 'bg-red-50/80',
  };
  return (
    <div className={`${bgColors[color]} backdrop-blur-sm rounded-2xl border border-white/40 px-4 py-3 flex items-center gap-3`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800 leading-tight">{count}</p>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
