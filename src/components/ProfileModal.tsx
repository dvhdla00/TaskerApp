import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { UserProfile } from '../types';

const WALLPAPERS = [
  { id: 'gradient-sky', label: 'Sky', style: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 50%, #ddd6fe 100%)' },
  { id: 'gradient-sunset', label: 'Sunset', style: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fca5a5 70%, #f9a8d4 100%)' },
  { id: 'gradient-forest', label: 'Forest', style: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)' },
  { id: 'gradient-ocean', label: 'Ocean', style: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 40%, #7dd3fc 100%)' },
  { id: 'gradient-rose', label: 'Rose', style: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)' },
  { id: 'gradient-lavender', label: 'Lavender', style: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)' },
  { id: 'gradient-warm', label: 'Warm Sand', style: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fed7aa 100%)' },
  { id: 'gradient-midnight', label: 'Midnight', style: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%)' },
  { id: 'solid-white', label: 'Pure White', style: '#ffffff' },
  { id: 'solid-cream', label: 'Cream', style: '#fafaf8' },
  { id: 'solid-stone', label: 'Stone', style: '#f5f5f4' },
];

interface ProfileModalProps {
  user: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  onClose: () => void;
}

export default function ProfileModal({ user, onSave, onClose }: ProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [wallpaper, setWallpaper] = useState(user.wallpaper);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), wallpaper });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-apple-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile & Appearance</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              maxLength={40}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Wallpaper */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Wallpaper
            </label>
            <div className="grid grid-cols-4 gap-2">
              {WALLPAPERS.map(w => (
                <button
                  key={w.id}
                  onClick={() => setWallpaper(w.id)}
                  className="relative aspect-video rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95"
                  style={{ background: w.style }}
                  title={w.label}
                >
                  {wallpaper === w.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 py-0.5 bg-black/20">
                    <span className="text-white text-[9px] font-medium block text-center truncate px-1">{w.label}</span>
                  </div>
                </button>
              ))}
            </div>
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
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
