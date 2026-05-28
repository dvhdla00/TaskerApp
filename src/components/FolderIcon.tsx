interface FolderIconProps {
  color: string;
  size?: number;
  className?: string;
}

export default function FolderIcon({ color, size = 64, className = '' }: FolderIconProps) {
  const darkerColor = adjustColor(color, -30);
  const lighterColor = adjustColor(color, 40);

  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 80 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`folder-body-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighterColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`folder-tab-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighterColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`folder-shine-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Folder tab */}
      <path
        d="M4 18 C4 16 5.5 14.5 7.5 14.5 L30 14.5 C32 14.5 33.5 13 34.5 11.5 L36.5 8 C37.5 6.5 39 5 41 5 L52 5 C54 5 55.5 6.5 55.5 8.5 L55.5 18 Z"
        fill={`url(#folder-tab-${color.replace('#', '')})`}
      />

      {/* Folder body */}
      <rect
        x="2"
        y="17"
        width="76"
        height="44"
        rx="6"
        ry="6"
        fill={`url(#folder-body-${color.replace('#', '')})`}
      />

      {/* Bottom shadow layer */}
      <rect
        x="2"
        y="43"
        width="76"
        height="18"
        rx="0"
        ry="0"
        fill={darkerColor}
        opacity="0.35"
      />
      <rect
        x="2"
        y="55"
        width="76"
        height="6"
        rx="0"
        ry="0"
        fill={darkerColor}
        opacity="0.2"
      />
      <rect
        x="2"
        y="55"
        width="76"
        height="6"
        rx="6"
        ry="6"
        fill={`url(#folder-body-${color.replace('#', '')})`}
      />

      {/* Shine overlay on body */}
      <rect
        x="2"
        y="17"
        width="76"
        height="22"
        rx="6"
        ry="6"
        fill={`url(#folder-shine-${color.replace('#', '')})`}
      />

      {/* Subtle inner border highlight */}
      <rect
        x="2.5"
        y="17.5"
        width="75"
        height="43"
        rx="5.5"
        ry="5.5"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
    </svg>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
