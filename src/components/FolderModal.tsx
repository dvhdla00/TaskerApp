import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ProjectFolder } from '../types';
import FolderIcon from './FolderIcon';

const PRESET_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#d97706', '#65a30d', '#16a34a',
  '#0891b2', '#0284c7', '#4f46e5', '#9333ea',
  '#1a1a1a', '#6b7280', '#78716c', '#0f766e',
];

interface FolderModalProps {
  folder?: ProjectFolder | null;
  onSave: (data: Omit<ProjectFolder, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function FolderModal({ folder, onSave, onClose }: FolderModalProps) {
  const [name, setName] = useState(folder?.name ?? '');
  const [color, setColor] = useState(folder?.color ?? '#2563eb');
  const [description, setDescription] = useState(folder?.description ?? '');
  const [customColor, setCustomColor] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), color, description: description.trim() });
  };

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
            {folder ? 'Edit Folder' : 'New Folder'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center py-4 bg-gray-50/50">
          <div className="flex flex-col items-center gap-2">
            <FolderIcon color={color} size={72} className="folder-shadow" />
            <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate text-center">
              {name || 'Folder Name'}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Design Project"
              maxLength={40}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Description <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this folder for?"
              rows={2}
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
                />
              ))}
              <div className="relative">
                <button
                  className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors overflow-hidden"
                  style={customColor ? { backgroundColor: customColor } : {}}
                  onClick={() => document.getElementById('custom-color')?.click()}
                  title="Custom color"
                >
                  {!customColor && <span className="text-gray-400 text-xs">+</span>}
                </button>
                <input
                  id="custom-color"
                  type="color"
                  value={customColor || '#000000'}
                  onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-7 h-7"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: name.trim() ? color : '#9ca3af' }}
          >
            {folder ? 'Save Changes' : 'Create Folder'}
          </button>
        </div>
      </div>
    </div>
  );
}
