import { useState, useEffect } from 'react';
import { X, Flag } from 'lucide-react';
import type { Reminder, Priority, ProjectFolder } from '../types';

interface ReminderModalProps {
  reminder?: Reminder | null;
  folderId: string;
  folders: ProjectFolder[];
  onSave: (data: Omit<Reminder, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

export default function ReminderModal({ reminder, folderId, folders, onSave, onClose }: ReminderModalProps) {
  const [title, setTitle] = useState(reminder?.title ?? '');
  const [notes, setNotes] = useState(reminder?.notes ?? '');
  const [dueDate, setDueDate] = useState(reminder?.dueDate ?? '');
  const [dueTime, setDueTime] = useState(reminder?.dueTime ?? '');
  const [priority, setPriority] = useState<Priority>(reminder?.priority ?? 'medium');
  const [flagged, setFlagged] = useState(reminder?.flagged ?? false);
  const [selectedFolder, setSelectedFolder] = useState(reminder?.folderId ?? folderId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      flagged,
      folderId: selectedFolder,
      completed: reminder?.completed ?? false,
    });
  };

  const currentFolder = folders.find(f => f.id === selectedFolder);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-apple-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {reminder ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlagged(f => !f)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${flagged ? 'bg-orange-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={flagged ? 'Unflag' : 'Flag'}
            >
              <Flag size={15} className={flagged ? 'text-orange-500 fill-orange-500' : 'text-gray-400'} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Reminder title"
            autoFocus
            maxLength={200}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all font-medium"
          />

          {/* Notes */}
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={2}
            maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
          />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all"
                  style={{
                    borderColor: priority === p.value ? p.color : '#e5e7eb',
                    backgroundColor: priority === p.value ? `${p.color}15` : 'transparent',
                    color: priority === p.value ? p.color : '#6b7280',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Folder */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Folder
            </label>
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
              style={{ color: currentFolder?.color }}
            >
              {folders.map(f => (
                <option key={f.id} value={f.id} style={{ color: f.color }}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reminder ? 'Save Changes' : 'Add Reminder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
