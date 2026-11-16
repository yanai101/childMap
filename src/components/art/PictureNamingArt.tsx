import React from 'react';
import type { PictureNamingItem } from '../../content/storyHouse';

interface PictureNamingArtProps {
  illustrationKey: PictureNamingItem['illustrationKey'];
  className?: string;
}

export const PictureNamingArt: React.FC<PictureNamingArtProps> = ({
  illustrationKey,
  className = 'w-64 h-64',
}) => {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="איור לשיום"
    >
      <rect x="8" y="8" width="224" height="224" rx="28" fill="#fffbeb" stroke="#fde68a" strokeWidth="4" />

      {illustrationKey === 'dog' && (
        <g>
          <ellipse cx="120" cy="192" rx="64" ry="12" fill="#e7e5e4" />
          {/* Tail */}
          <path d="M168 152 Q196 132 186 112" fill="none" stroke="#b45309" strokeWidth="10" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="126" cy="154" rx="46" ry="32" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          {/* Legs */}
          <rect x="92" y="168" width="14" height="26" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          <rect x="144" y="168" width="14" height="26" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          {/* Head */}
          <circle cx="88" cy="106" r="36" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
          {/* Floppy Ears */}
          <ellipse cx="56" cy="108" rx="12" ry="24" fill="#92400e" transform="rotate(14 56 108)" />
          <ellipse cx="120" cy="108" rx="12" ry="24" fill="#92400e" transform="rotate(-14 120 108)" />
          {/* Snout */}
          <ellipse cx="88" cy="118" rx="18" ry="13" fill="#fef3c7" />
          <ellipse cx="88" cy="113" rx="7" ry="5" fill="#1c1917" />
          <path d="M81 124 Q88 130 95 124" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="76" cy="96" r="5" fill="#1c1917" />
          <circle cx="100" cy="96" r="5" fill="#1c1917" />
          {/* Collar */}
          <rect x="68" y="136" width="40" height="9" rx="4" fill="#ef4444" />
        </g>
      )}

      {illustrationKey === 'butterfly' && (
        <g>
          {/* Upper wings */}
          <ellipse cx="82" cy="94" rx="44" ry="34" fill="#f472b6" stroke="#9d174d" strokeWidth="3" transform="rotate(-18 82 94)" />
          <ellipse cx="158" cy="94" rx="44" ry="34" fill="#f472b6" stroke="#9d174d" strokeWidth="3" transform="rotate(18 158 94)" />
          {/* Lower wings */}
          <ellipse cx="88" cy="148" rx="34" ry="28" fill="#fb7185" stroke="#9d174d" strokeWidth="3" transform="rotate(14 88 148)" />
          <ellipse cx="152" cy="148" rx="34" ry="28" fill="#fb7185" stroke="#9d174d" strokeWidth="3" transform="rotate(-14 152 148)" />
          {/* Wing spots */}
          <circle cx="76" cy="90" r="12" fill="#fef08a" />
          <circle cx="164" cy="90" r="12" fill="#fef08a" />
          <circle cx="88" cy="148" r="8" fill="#bae6fd" />
          <circle cx="152" cy="148" r="8" fill="#bae6fd" />
          {/* Body */}
          <rect x="112" y="76" width="16" height="94" rx="8" fill="#451a03" />
          <circle cx="120" cy="70" r="12" fill="#451a03" />
          {/* Antennae */}
          <path d="M114 60 Q100 36 88 42" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <path d="M126 60 Q140 36 152 42" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="42" r="4" fill="#f59e0b" />
          <circle cx="152" cy="42" r="4" fill="#f59e0b" />
        </g>
      )}

      {illustrationKey === 'frog' && (
        <g>
          {/* Lily pad */}
          <ellipse cx="120" cy="182" rx="76" ry="18" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          {/* Hind legs */}
          <ellipse cx="74" cy="164" rx="22" ry="14" fill="#4ade80" stroke="#166534" strokeWidth="3" />
          <ellipse cx="166" cy="164" rx="22" ry="14" fill="#4ade80" stroke="#166534" strokeWidth="3" />
          {/* Body */}
          <ellipse cx="120" cy="144" rx="46" ry="36" fill="#4ade80" stroke="#166534" strokeWidth="3" />
          <ellipse cx="120" cy="152" rx="30" ry="22" fill="#dcfce7" />
          {/* Eyes */}
          <circle cx="96" cy="96" r="18" fill="#4ade80" stroke="#166534" strokeWidth="3" />
          <circle cx="144" cy="96" r="18" fill="#4ade80" stroke="#166534" strokeWidth="3" />
          <circle cx="96" cy="96" r="10" fill="#ffffff" />
          <circle cx="144" cy="96" r="10" fill="#ffffff" />
          <circle cx="96" cy="96" r="5" fill="#1c1917" />
          <circle cx="144" cy="96" r="5" fill="#1c1917" />
          {/* Smile */}
          <path d="M94 128 Q120 146 146 128" fill="none" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}

      {illustrationKey === 'elephant' && (
        <g>
          <ellipse cx="124" cy="190" rx="68" ry="12" fill="#e2e8f0" />
          {/* Body */}
          <ellipse cx="136" cy="140" rx="50" ry="40" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          {/* Legs */}
          <rect x="98" y="160" width="18" height="32" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <rect x="148" y="160" width="18" height="32" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          {/* Big Ear */}
          <ellipse cx="114" cy="108" rx="28" ry="34" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
          <ellipse cx="114" cy="110" rx="18" ry="24" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="84" cy="104" r="34" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          {/* Trunk */}
          <path
            d="M54 108 C36 118, 34 152, 54 156 C66 158, 66 144, 58 142 C48 140, 50 124, 62 120"
            fill="#94a3b8"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Eye */}
          <circle cx="72" cy="96" r="5" fill="#1e293b" />
          <circle cx="73.5" cy="94.5" r="1.8" fill="#ffffff" />
          {/* Tusk */}
          <path d="M62 122 Q52 132 62 136" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      )}

      {illustrationKey === 'key' && (
        <g transform="rotate(-25 120 120)">
          {/* Key bow (ring) */}
          <circle cx="76" cy="120" r="34" fill="#fbbf24" stroke="#b45309" strokeWidth="4" />
          <circle cx="76" cy="120" r="14" fill="#fffbeb" stroke="#b45309" strokeWidth="3" />
          {/* Key shaft */}
          <rect x="108" y="111" width="84" height="18" rx="6" fill="#fbbf24" stroke="#b45309" strokeWidth="4" />
          {/* Teeth */}
          <rect x="150" y="129" width="12" height="22" rx="3" fill="#fbbf24" stroke="#b45309" strokeWidth="3.5" />
          <rect x="172" y="129" width="12" height="16" rx="3" fill="#fbbf24" stroke="#b45309" strokeWidth="3.5" />
        </g>
      )}

      {illustrationKey === 'umbrella' && (
        <g>
          {/* Handle */}
          <path d="M120 112 L120 176 C120 192, 142 192, 142 178" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
          {/* Tip */}
          <line x1="120" y1="42" x2="120" y2="56" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
          {/* Canopy */}
          <path d="M42 116 C42 64, 198 64, 198 116 Q172 104 146 116 Q120 104 94 116 Q68 104 42 116 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="3.5" />
          <path d="M94 116 C98 74, 142 74, 146 116 Q120 104 94 116 Z" fill="#fef08a" stroke="#991b1b" strokeWidth="2.5" />
          {/* Raindrops */}
          <path d="M62 44 Q58 54 62 58 Q66 54 62 44 Z" fill="#38bdf8" />
          <path d="M178 48 Q174 58 178 62 Q182 58 178 48 Z" fill="#38bdf8" />
          <path d="M150 34 Q146 44 150 48 Q154 44 150 34 Z" fill="#38bdf8" />
        </g>
      )}

      {illustrationKey === 'cup' && (
        <g>
          <ellipse cx="116" cy="186" rx="54" ry="10" fill="#e2e8f0" />
          {/* Handle */}
          <path d="M154 96 C188 96, 188 152, 150 152" fill="none" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" />
          {/* Cup body */}
          <path d="M72 78 L160 78 L148 178 C147 184, 85 184, 84 178 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="3.5" />
          {/* Rim */}
          <ellipse cx="116" cy="78" rx="44" ry="11" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
          {/* Cute star */}
          <circle cx="116" cy="128" r="14" fill="#fef08a" opacity="0.9" />
        </g>
      )}

      {illustrationKey === 'bicycle' && (
        <g>
          {/* Wheels */}
          <circle cx="68" cy="156" r="32" fill="none" stroke="#334155" strokeWidth="7" />
          <circle cx="68" cy="156" r="8" fill="#64748b" />
          <circle cx="172" cy="156" r="32" fill="none" stroke="#334155" strokeWidth="7" />
          <circle cx="172" cy="156" r="8" fill="#64748b" />
          {/* Frame */}
          <path d="M68 156 L108 112 L154 112 L118 156 Z" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinejoin="round" />
          <line x1="172" y1="156" x2="148" y2="94" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          {/* Handlebars */}
          <path d="M148 94 L162 88" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          {/* Seat */}
          <line x1="108" y1="112" x2="100" y2="94" stroke="#334155" strokeWidth="5" />
          <rect x="86" y="88" width="26" height="9" rx="4" fill="#1e293b" />
        </g>
      )}

      {illustrationKey === 'jumping' && (
        <g>
          {/* Puddle / Ground */}
          <ellipse cx="120" cy="196" rx="68" ry="12" fill="#38bdf8" opacity="0.6" />
          {/* Motion lines */}
          <path d="M64 158 L54 172" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M176 158 L186 172" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          {/* Child jumping */}
          <circle cx="120" cy="64" r="22" fill="#fed7aa" stroke="#9a3412" strokeWidth="2.5" />
          <path d="M100 56 Q120 34 140 56" fill="#78350f" />
          <circle cx="113" cy="64" r="2.8" fill="#1c1917" />
          <circle cx="127" cy="64" r="2.8" fill="#1c1917" />
          <path d="M113 73 Q120 79 127 73" fill="none" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
          {/* Shirt */}
          <rect x="102" y="88" width="36" height="44" rx="10" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
          {/* Raised arms */}
          <path d="M102 96 L74 68" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          <path d="M138 96 L166 68" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          {/* Bent legs in air */}
          <path d="M110 132 L92 162 L106 168" fill="none" stroke="#1d4ed8" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M130 132 L148 162 L134 168" fill="none" stroke="#1d4ed8" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {illustrationKey === 'reading' && (
        <g>
          {/* Cushion */}
          <ellipse cx="120" cy="192" rx="68" ry="14" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2.5" />
          {/* Girl head */}
          <circle cx="120" cy="72" r="24" fill="#fed7aa" stroke="#9a3412" strokeWidth="2.5" />
          <path d="M94 74 C94 42, 146 42, 146 74" fill="#92400e" />
          <circle cx="113" cy="72" r="2.8" fill="#1c1917" />
          <circle cx="127" cy="72" r="2.8" fill="#1c1917" />
          <path d="M114 82 Q120 87 126 82" fill="none" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
          {/* Shirt */}
          <path d="M92 100 L148 100 L156 154 L84 154 Z" fill="#ec4899" stroke="#be185d" strokeWidth="2.5" />
          {/* Open Book */}
          <path d="M68 122 L120 132 L120 176 L68 166 Z" fill="#ffffff" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          <path d="M172 122 L120 132 L120 176 L172 166 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          <line x1="80" y1="138" x2="108" y2="143" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="148" x2="108" y2="153" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="132" y1="143" x2="160" y2="138" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="132" y1="153" x2="160" y2="148" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
