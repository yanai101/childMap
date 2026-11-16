import React from 'react';
import type { VillageBuilding } from '../../content/village';

interface BuildingArtProps {
  building: VillageBuilding;
  className?: string;
}

export const BuildingArt: React.FC<BuildingArtProps> = ({
  building,
  className = 'w-full h-36',
}) => {
  const { id, roofColor, wallColor, accentColor, available } = building;

  return (
    <svg
      viewBox="0 0 200 150"
      className={className}
      role="img"
      aria-label={building.name}
    >
      {/* Ground grass */}
      <ellipse cx="100" cy="136" rx="86" ry="11" fill={available ? '#bbf7d0' : '#e7e5e4'} />

      {/* Main building walls */}
      <rect
        x="38"
        y="62"
        width="124"
        height="72"
        rx="10"
        fill={wallColor}
        stroke={accentColor}
        strokeWidth="3.5"
      />

      {/* Roof */}
      <path
        d="M24 68 L100 20 L176 68 Z"
        fill={roofColor}
        stroke="#44403c"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Chimney */}
      <rect x="134" y="26" width="16" height="26" rx="3" fill="#b45309" stroke="#44403c" strokeWidth="2" />

      {/* Door */}
      <path
        d="M84 134 L84 96 A16 16 0 0 1 116 96 L116 134 Z"
        fill={accentColor}
        stroke="#44403c"
        strokeWidth="2.5"
      />
      <circle cx="92" cy="114" r="3" fill="#fef3c7" />

      {/* Windows */}
      <rect x="48" y="82" width="24" height="24" rx="5" fill="#ffffff" stroke="#44403c" strokeWidth="2" />
      <line x1="60" y1="82" x2="60" y2="106" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="48" y1="94" x2="72" y2="94" stroke="#94a3b8" strokeWidth="1.5" />

      <rect x="128" y="82" width="24" height="24" rx="5" fill="#ffffff" stroke="#44403c" strokeWidth="2" />
      <line x1="140" y1="82" x2="140" y2="106" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="128" y1="94" x2="152" y2="94" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Building-specific emblem on roof/gable */}
      {id === 'story-house' && (
        <g transform="translate(80, 38)">
          <path d="M2 4 L20 9 L20 26 L2 21 Z" fill="#fffbeb" stroke="#78350f" strokeWidth="2" />
          <path d="M38 4 L20 9 L20 26 L38 21 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
        </g>
      )}
      {id === 'numbers-shop' && (
        <g transform="translate(82, 36)">
          <rect width="36" height="22" rx="5" fill="#ffffff" stroke="#1e40af" strokeWidth="2" />
          <text x="18" y="16" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1d4ed8">1 2 3</text>
        </g>
      )}
      {id === 'builders-house' && (
        <g transform="translate(83, 36)">
          <rect x="0" y="10" width="14" height="14" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          <rect x="16" y="10" width="14" height="14" rx="2" fill="#34d399" stroke="#065f46" strokeWidth="1.5" />
          <rect x="8" y="0" width="14" height="12" rx="2" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1.5" />
        </g>
      )}
      {id === 'memory-forest' && (
        <g transform="translate(84, 34)">
          <circle cx="16" cy="14" r="13" fill="#a78bfa" stroke="#4c1d95" strokeWidth="2" />
          <circle cx="11" cy="12" r="3" fill="#fef3c7" />
          <circle cx="21" cy="12" r="3" fill="#fef3c7" />
          <polygon points="16,15 13,19 19,19" fill="#f59e0b" />
        </g>
      )}
      {id === 'craft-workshop' && (
        <g transform="translate(84, 36)">
          <ellipse cx="16" cy="13" rx="15" ry="11" fill="#fdf2f8" stroke="#9d174d" strokeWidth="2" />
          <circle cx="10" cy="10" r="3" fill="#ef4444" />
          <circle cx="18" cy="9" r="3" fill="#3b82f6" />
          <circle cx="22" cy="16" r="3" fill="#eab308" />
        </g>
      )}
      {id === 'sounds-house' && (
        <g transform="translate(86, 36)">
          <circle cx="10" cy="20" r="5" fill="#ffffff" stroke="#155e75" strokeWidth="2" />
          <path d="M15 20 L15 6 L27 3 L27 17" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="23" cy="17" r="4.5" fill="#ffffff" stroke="#155e75" strokeWidth="2" />
        </g>
      )}
      {id === 'friends-square' && (
        <g transform="translate(84, 36)">
          <path d="M16 24 C6 17, 4 8, 10 5 C14 3, 16 7, 16 9 C16 7, 18 3, 22 5 C28 8, 26 17, 16 24 Z" fill="#fff1f2" stroke="#9f1239" strokeWidth="2" />
        </g>
      )}
      {id === 'village-museum' && (
        <g transform="translate(84, 36)">
          <circle cx="16" cy="13" r="12" fill="#ecfccb" stroke="#3f6212" strokeWidth="2" />
          <path d="M6 13 Q16 5 26 13 Q16 21 6 13 Z" fill="#84cc16" opacity="0.6" />
        </g>
      )}
      {id === 'letters-house' && (
        <g transform="translate(82, 36)">
          <rect width="36" height="22" rx="5" fill="#ffffff" stroke="#854d0e" strokeWidth="2" />
          <text x="18" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a16207">א ב ג</text>
        </g>
      )}
    </svg>
  );
};
