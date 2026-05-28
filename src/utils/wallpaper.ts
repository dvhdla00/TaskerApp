export const WALLPAPER_STYLES: Record<string, string> = {
  'gradient-sky': 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 50%, #ddd6fe 100%)',
  'gradient-sunset': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fca5a5 70%, #f9a8d4 100%)',
  'gradient-forest': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
  'gradient-ocean': 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 40%, #7dd3fc 100%)',
  'gradient-rose': 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
  'gradient-lavender': 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
  'gradient-warm': 'linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fed7aa 100%)',
  'gradient-midnight': 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #fce7f3 100%)',
  'solid-white': '#ffffff',
  'solid-cream': '#fafaf8',
  'solid-stone': '#f5f5f4',
};

export function getWallpaperStyle(id: string): string {
  return WALLPAPER_STYLES[id] ?? WALLPAPER_STYLES['gradient-sky'];
}
