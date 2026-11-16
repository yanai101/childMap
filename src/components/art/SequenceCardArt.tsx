import React from 'react';
import type { SequenceCard } from '../../content/storyHouse';

interface SequenceCardArtProps {
  illustrationKey: SequenceCard['illustrationKey'];
  className?: string;
}

export const SequenceCardArt: React.FC<SequenceCardArtProps> = ({
  illustrationKey,
  className = 'w-full h-44',
}) => {
  return (
    <svg
      viewBox="0 0 220 180"
      className={className}
      role="img"
      aria-label="תמונת רצף סיפור"
    >
      {/* Sky & grass backdrop */}
      <rect width="220" height="180" rx="18" fill="#e0f2fe" />
      <rect y="128" width="220" height="52" rx="0" fill="#bbf7d0" />

      {/* Level A: 3-step flower story */}
      {illustrationKey === 'seed-plant' && (
        <g>
          {/* Pot */}
          <polygon points="74,108 146,108 136,158 84,158" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <rect x="68" y="98" width="84" height="14" rx="5" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
          {/* Soil */}
          <ellipse cx="110" cy="98" rx="34" ry="6" fill="#78350f" />
          {/* Bunny paw dropping seed */}
          <circle cx="110" cy="64" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <path d="M110 76 L110 90" stroke="#78350f" strokeWidth="2.5" strokeDasharray="3 3" />
          {/* Little bunny peeking */}
          <ellipse cx="52" cy="118" rx="16" ry="20" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="46" cy="92" rx="5" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="58" cy="92" rx="5" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="48" cy="114" r="2.5" fill="#1e293b" />
        </g>
      )}

      {illustrationKey === 'seed-water' && (
        <g>
          {/* Pot */}
          <polygon points="74,114 146,114 136,162 84,162" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <rect x="68" y="104" width="84" height="14" rx="5" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
          {/* Small green sprout */}
          <path d="M110 104 L110 82" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="100" cy="84" rx="10" ry="5" fill="#4ade80" transform="rotate(-25 100 84)" />
          <ellipse cx="120" cy="84" rx="10" ry="5" fill="#4ade80" transform="rotate(25 120 84)" />
          {/* Blue Watering Can */}
          <g transform="translate(132, 34) rotate(-18)">
            <rect x="18" y="14" width="38" height="28" rx="6" fill="#38bdf8" stroke="#0369a1" strokeWidth="2.5" />
            <path d="M18 28 L-4 18 L-6 25 L18 36 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
            <path d="M56 16 C68 16, 68 38, 56 38" fill="none" stroke="#0369a1" strokeWidth="4" />
          </g>
          {/* Water droplets */}
          <circle cx="118" cy="64" r="3" fill="#0284c7" />
          <circle cx="110" cy="72" r="3" fill="#0284c7" />
          <circle cx="124" cy="74" r="3" fill="#0284c7" />
        </g>
      )}

      {illustrationKey === 'seed-bloom' && (
        <g>
          {/* Sun */}
          <circle cx="180" cy="34" r="18" fill="#fde047" stroke="#eab308" strokeWidth="2.5" />
          {/* Pot */}
          <polygon points="74,116 146,116 136,164 84,164" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <rect x="68" y="106" width="84" height="14" rx="5" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
          {/* Tall stem & leaves */}
          <path d="M110 106 L110 56" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="94" cy="86" rx="14" ry="7" fill="#22c55e" transform="rotate(-25 94 86)" />
          <ellipse cx="126" cy="80" rx="14" ry="7" fill="#22c55e" transform="rotate(25 126 80)" />
          {/* Blooming flower */}
          <circle cx="110" cy="38" r="11" fill="#f43f5e" />
          <circle cx="126" cy="48" r="11" fill="#f43f5e" />
          <circle cx="120" cy="64" r="11" fill="#f43f5e" />
          <circle cx="100" cy="64" r="11" fill="#f43f5e" />
          <circle cx="94" cy="48" r="11" fill="#f43f5e" />
          <circle cx="110" cy="52" r="10" fill="#fde047" />
        </g>
      )}

      {/* Level B: 4-step picnic story */}
      {illustrationKey === 'picnic-pack' && (
        <g>
          {/* Indoor cozy wall & table */}
          <rect width="220" height="132" fill="#fef3c7" />
          <rect x="24" y="114" width="172" height="16" rx="4" fill="#b45309" />
          {/* Picnic Basket */}
          <rect x="74" y="76" width="72" height="38" rx="8" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <path d="M84 76 C84 48, 136 48, 136 76" fill="none" stroke="#78350f" strokeWidth="5" />
          {/* Apples going into basket */}
          <circle cx="100" cy="68" r="10" fill="#ef4444" />
          <circle cx="120" cy="66" r="10" fill="#ef4444" />
          <path d="M100 58 L103 52" stroke="#15803d" strokeWidth="2.5" />
          {/* Fox packing */}
          <circle cx="48" cy="84" r="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <polygon points="34,70 30,52 44,64" fill="#ea580c" />
          <polygon points="62,70 66,52 52,64" fill="#ea580c" />
          <circle cx="44" cy="82" r="2.5" fill="#1c1917" />
          <circle cx="54" cy="82" r="2.5" fill="#1c1917" />
        </g>
      )}

      {illustrationKey === 'picnic-walk' && (
        <g>
          {/* Winding village path */}
          <path d="M0 160 Q110 130 220 154 L220 180 L0 180 Z" fill="#fde68a" />
          {/* Sun & tree */}
          <circle cx="42" cy="36" r="16" fill="#fde047" />
          <rect x="172" y="76" width="12" height="54" fill="#92400e" />
          <circle cx="178" cy="64" r="26" fill="#22c55e" />
          {/* Fox walking with basket */}
          <ellipse cx="104" cy="124" rx="18" ry="22" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <circle cx="104" cy="86" r="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <polygon points="90,72 86,54 100,66" fill="#ea580c" />
          <polygon points="118,72 122,54 108,66" fill="#ea580c" />
          <circle cx="99" cy="84" r="2.5" fill="#1c1917" />
          <circle cx="110" cy="84" r="2.5" fill="#1c1917" />
          {/* Basket in paw */}
          <rect x="122" y="108" width="32" height="22" rx="5" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          <path d="M126 108 C126 94, 150 94, 150 108" fill="none" stroke="#78350f" strokeWidth="3" />
        </g>
      )}

      {illustrationKey === 'picnic-blanket' && (
        <g>
          {/* Checkered picnic blanket */}
          <polygon points="48,144 172,144 196,172 24,172" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
          <polygon points="80,144 110,144 110,172 68,172" fill="#ffffff" opacity="0.6" />
          <polygon points="140,144 172,144 196,172 152,172" fill="#ffffff" opacity="0.6" />
          {/* Basket & apples on blanket */}
          <rect x="136" y="122" width="34" height="22" rx="5" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          <circle cx="90" cy="152" r="8" fill="#ef4444" />
          <circle cx="108" cy="154" r="8" fill="#22c55e" />
          {/* Fox spreading blanket */}
          <circle cx="62" cy="108" r="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <polygon points="48,94 44,76 58,88" fill="#ea580c" />
          <polygon points="76,94 80,76 66,88" fill="#ea580c" />
          <ellipse cx="62" cy="136" rx="16" ry="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
        </g>
      )}

      {illustrationKey === 'picnic-eat' && (
        <g>
          {/* Blanket */}
          <polygon points="36,144 184,144 206,174 14,174" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
          {/* Fox sitting happily */}
          <ellipse cx="76" cy="136" rx="18" ry="20" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <circle cx="76" cy="102" r="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <polygon points="62,88 58,70 72,82" fill="#ea580c" />
          <polygon points="90,88 94,70 80,82" fill="#ea580c" />
          <circle cx="70" cy="100" r="2.5" fill="#1c1917" />
          <circle cx="82" cy="100" r="2.5" fill="#1c1917" />
          <path d="M70 109 Q76 114 82 109" fill="none" stroke="#1c1917" strokeWidth="2" />
          {/* Bunny friend sitting & eating */}
          <ellipse cx="144" cy="136" rx="18" ry="20" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="144" cy="102" r="17" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="136" cy="76" rx="5" ry="15" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="152" cy="76" rx="5" ry="15" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="139" cy="100" r="2.5" fill="#1c1917" />
          <circle cx="149" cy="100" r="2.5" fill="#1c1917" />
          {/* Apples in middle */}
          <circle cx="104" cy="148" r="9" fill="#ef4444" />
          <circle cx="120" cy="150" r="9" fill="#ef4444" />
        </g>
      )}
    </svg>
  );
};
