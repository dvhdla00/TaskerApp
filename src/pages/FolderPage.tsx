import { useState } from 'react';
import { ArrowLeft, Plus, Flag, Trash2, Pencil, MoreHorizontal, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context';
import type { Reminder } from '../types';
import FolderIcon from '../components/FolderIcon';
import ReminderModal from '../components/ReminderModal';
import FolderModal from '../components/FolderModal';
import { getWallpaperStyle } from '../utils/wallpaper';

interface FolderPageProps {
  folderId: string;
  onBack: () => void;
}

export default function FolderPage({ folderId, onBack }: FolderPageProps) {
  const { state, dispatch } = useApp();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const folder = state.folders.find(f => f.id === folderId);
  const reminders = state.reminders.filter(r => r.folderId === folderId);
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  const wallpaperStyle = getWallpaperStyle(state.user.wallpaper);

  if (!folder) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: wallpaperStyle }}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">Folder not found</p>
          <button onClick={onBack} className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSaveReminder = (data: Omit<Reminder, 'id' | 'createdAt'>) => {
    if (editingReminder) {
      dispatch({ type: 'UPDATE_REMINDER', payload: { id: editingReminder.id, ...data } });
    } else {
      dispatch({ type: 'ADD_REMINDER', payload: data });
    }
    setShowReminderModal(false);
    setEditingReminder(null);
  };

  const handleDeleteReminder = (id: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
    setMenuOpenId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: wallpaperStyle }}>
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft size={16} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FolderIcon color={folder.color} size={36} className="folder-shadow flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-gray-900 truncate">{folder.name}</h1>
              {folder.description && (
                <p className="text-xs text-gray-500 truncate">{folder.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFolderModal(true)}
              className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors shadow-sm"
              title="Edit folder"
            >
              <Pencil size={14} className="text-gray-500" />
            </button>
            <button
              onClick={() => { setEditingReminder(null); setShowReminderModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm hover:shadow transition-shadow"
              style={{ backgroundColor: folder.color }}
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {/* Stats bar */}
        <div className="flex items-center gap-6 px-1">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{activeReminders.length}</span> remaining
          </span>
          {completedReminders.length > 0 && (
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{completedReminders.length}</span> completed
            </span>
          )}
        </div>

        {/* Active reminders */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden shadow-apple">
          {activeReminders.length === 0 ? (
            <div
              className="p-8 text-center cursor-pointer hover:bg-white/50 transition-colors"
              onClick={() => setShowReminderModal(true)}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No reminders yet — tap to add one</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100/60">
              {activeReminders.map(reminder => (
                <ReminderRow
                  key={reminder.id}
                  reminder={reminder}
                  folderColor={folder.color}
                  menuOpenId={menuOpenId}
                  onToggle={() => dispatch({ type: 'TOGGLE_REMINDER', payload: reminder.id })}
                  onEdit={() => { setEditingReminder(reminder); setShowReminderModal(true); setMenuOpenId(null); }}
                  onDelete={() => handleDeleteReminder(reminder.id)}
                  onMenuToggle={() => setMenuOpenId(menuOpenId === reminder.id ? null : reminder.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Completed section */}
        {completedReminders.length > 0 && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden shadow-apple">
            <button
              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-gray-500 hover:bg-white/50 transition-colors"
              onClick={() => setShowCompleted(v => !v)}
            >
              <span>Completed ({completedReminders.length})</span>
              {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showCompleted && (
              <ul className="divide-y divide-gray-100/40">
                {completedReminders.map(reminder => (
                  <ReminderRow
                    key={reminder.id}
                    reminder={reminder}
                    folderColor={folder.color}
                    menuOpenId={menuOpenId}
                    onToggle={() => dispatch({ type: 'TOGGLE_REMINDER', payload: reminder.id })}
                    onEdit={() => { setEditingReminder(reminder); setShowReminderModal(true); setMenuOpenId(null); }}
                    onDelete={() => handleDeleteReminder(reminder.id)}
                    onMenuToggle={() => setMenuOpenId(menuOpenId === reminder.id ? null : reminder.id)}
                    muted
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {menuOpenId && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
      )}

      {showReminderModal && (
        <ReminderModal
          reminder={editingReminder}
          folderId={folderId}
          folders={state.folders}
          onSave={handleSaveReminder}
          onClose={() => { setShowReminderModal(false); setEditingReminder(null); }}
        />
      )}

      {showFolderModal && (
        <FolderModal
          folder={folder}
          onSave={data => { dispatch({ type: 'UPDATE_FOLDER', payload: { id: folderId, ...data } }); setShowFolderModal(false); }}
          onClose={() => setShowFolderModal(false)}
        />
      )}
    </div>
  );
}

interface ReminderRowProps {
  reminder: Reminder;
  folderColor: string;
  menuOpenId: string | null;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMenuToggle: () => void;
  muted?: boolean;
}

function ReminderRow({ reminder, folderColor, menuOpenId, onToggle, onEdit, onDelete, onMenuToggle, muted }: ReminderRowProps) {
  const priorityDot: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#94a3b8',
  };

  const isOverdue = reminder.dueDate && !reminder.completed
    ? reminder.dueDate < new Date().toISOString().split('T')[0]
    : false;

  return (
    <li className={`group relative flex items-start gap-3 px-5 py-3.5 hover:bg-white/50 transition-colors ${muted ? 'opacity-60' : ''}`}>
      {/* Checkbox */}
      <button
        className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110 active:scale-95"
        onClick={onToggle}
      >
        {reminder.completed ? (
          <CheckCircle2 size={20} style={{ color: folderColor }} />
        ) : (
          <Circle size={20} className="text-gray-300 hover:text-gray-400" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
        <div className="flex items-start gap-2">
          <span className={`text-sm font-medium leading-5 ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {reminder.title}
          </span>
          {reminder.flagged && !reminder.completed && (
            <Flag size={12} className="text-orange-400 fill-orange-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
        {reminder.notes && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{reminder.notes}</p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {reminder.dueDate && (
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
              {formatDate(reminder.dueDate)}{reminder.dueTime ? ` · ${reminder.dueTime}` : ''}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: priorityDot[reminder.priority] }}
            title={`${reminder.priority} priority`}
          />
        </div>
      </div>

      {/* More button */}
      <button
        className="flex-shrink-0 w-7 h-7 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-white shadow-sm mt-0.5 z-20"
        onClick={e => { e.stopPropagation(); onMenuToggle(); }}
      >
        <MoreHorizontal size={14} className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {menuOpenId === reminder.id && (
        <div
          className="absolute top-10 right-4 z-30 bg-white rounded-xl shadow-apple-lg border border-gray-100 overflow-hidden min-w-[140px]"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onEdit}
          >
            <Pencil size={14} className="text-gray-400" />
            Edit
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            onClick={onDelete}
          >
            <Trash2 size={14} className="text-red-400" />
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
