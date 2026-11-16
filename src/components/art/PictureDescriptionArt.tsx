import React from 'react';

interface PictureDescriptionArtProps {
  className?: string;
}

export const PictureDescriptionArt: React.FC<PictureDescriptionArtProps> = ({
  className = 'w-full h-auto max-h-[460px]',
}) => {
  return (
    <svg
      viewBox="0 0 800 480"
      className={className}
      role="img"
      aria-label="יום שמח בפארק של הכפר"
    >
      {/* Sky */}
      <defs>
        <linearGradient id="parkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="800" height="310" fill="url(#parkSky)" />

      {/* Sun & rays */}
      <circle cx="710" cy="70" r="38" fill="#fde047" stroke="#eab308" strokeWidth="3" />
      <g stroke="#facc15" strokeWidth="4" strokeLinecap="round">
        <line x1="710" y1="16" x2="710" y2="26" />
        <line x1="710" y1="114" x2="710" y2="124" />
        <line x1="656" y1="70" x2="666" y2="70" />
        <line x1="754" y1="70" x2="764" y2="70" />
        <line x1="672" y1="32" x2="680" y2="40" />
        <line x1="740" y1="100" x2="748" y2="108" />
      </g>

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.92">
        <ellipse cx="140" cy="68" rx="44" ry="20" />
        <ellipse cx="166" cy="58" rx="30" ry="22" />
        <ellipse cx="114" cy="64" rx="26" ry="18" />

        <ellipse cx="440" cy="84" rx="52" ry="22" />
        <ellipse cx="470" cy="72" rx="34" ry="24" />
      </g>

      {/* Flying Kite */}
      <g>
        <polygon points="560,42 592,76 560,118 528,76" fill="#f43f5e" stroke="#9f1239" strokeWidth="2.5" />
        <polygon points="560,42 592,76 560,76" fill="#fbbf24" />
        <path d="M560 118 Q544 150 562 182 Q574 205 556 232" fill="none" stroke="#64748b" strokeWidth="2" />
        <circle cx="552" cy="144" r="4" fill="#38bdf8" />
        <circle cx="564" cy="176" r="4" fill="#fbbf24" />
      </g>

      {/* Rolling Hills & Grass */}
      <path d="M0 280 Q220 230 440 276 Q640 310 800 264 L800 480 L0 480 Z" fill="#86efac" />
      <path d="M0 320 Q300 290 800 326 L800 480 L0 480 Z" fill="#bbf7d0" />

      {/* Winding Path */}
      <path d="M260 480 Q360 390 480 370 Q620 350 800 390 L800 430 Q620 392 500 410 Q400 426 330 480 Z" fill="#fef3c7" stroke="#fde68a" strokeWidth="3" />

      {/* Pond & Duck (Left) */}
      <ellipse cx="135" cy="390" rx="108" ry="44" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
      {/* Duck in pond */}
      <g transform="translate(105, 362)">
        <ellipse cx="32" cy="24" rx="22" ry="13" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="48" cy="12" r="10" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
        <polygon points="57,11 67,14 57,17" fill="#f97316" />
        <circle cx="50" cy="10" r="2" fill="#1c1917" />
      </g>

      {/* Apple Tree (Left-center) */}
      <rect x="218" y="182" width="32" height="128" rx="6" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="234" cy="146" r="68" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
      <circle cx="192" cy="170" r="44" fill="#4ade80" />
      <circle cx="274" cy="170" r="44" fill="#4ade80" />
      {/* Apples on tree */}
      <circle cx="204" cy="136" r="9" fill="#ef4444" />
      <circle cx="254" cy="126" r="9" fill="#ef4444" />
      <circle cx="238" cy="168" r="9" fill="#ef4444" />
      <circle cx="182" cy="174" r="8" fill="#ef4444" />
      {/* Bird on branch */}
      <g transform="translate(274, 108)">
        <ellipse cx="14" cy="14" rx="12" ry="9" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
        <circle cx="22" cy="9" r="7" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
        <polygon points="28,8 35,10 28,12" fill="#f59e0b" />
        <circle cx="24" cy="7" r="1.5" fill="#1e293b" />
      </g>

      {/* Park Bench */}
      <g transform="translate(340, 268)">
        <rect x="0" y="16" width="96" height="10" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        <rect x="0" y="30" width="96" height="10" rx="3" fill="#d97706" stroke="#78350f" strokeWidth="2" />
        <rect x="10" y="40" width="8" height="22" fill="#78350f" />
        <rect x="78" y="40" width="8" height="22" fill="#78350f" />
      </g>

      {/* Ori the Fox painting at an easel (Center) */}
      <g transform="translate(465, 250)">
        {/* Easel */}
        <line x1="70" y1="20" x2="50" y2="112" stroke="#92400e" strokeWidth="4" />
        <line x1="70" y1="20" x2="96" y2="112" stroke="#92400e" strokeWidth="4" />
        <rect x="46" y="28" width="52" height="44" rx="4" fill="#ffffff" stroke="#b45309" strokeWidth="3" />
        <circle cx="72" cy="48" r="10" fill="#f43f5e" opacity="0.8" />
        {/* Fox */}
        <ellipse cx="22" cy="86" rx="18" ry="22" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
        <circle cx="22" cy="52" r="18" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
        <polygon points="8,38 4,20 18,32" fill="#ea580c" />
        <polygon points="36,38 40,20 26,32" fill="#ea580c" />
        <circle cx="17" cy="50" r="2.5" fill="#1c1917" />
        <circle cx="27" cy="50" r="2.5" fill="#1c1917" />
        {/* Paintbrush */}
        <line x1="34" y1="74" x2="54" y2="54" stroke="#78350f" strokeWidth="3" />
      </g>

      {/* Tuli the Bunny watering flowers (Right-foreground) */}
      <g transform="translate(615, 318)">
        {/* Flowers */}
        <line x1="88" y1="88" x2="88" y2="56" stroke="#15803d" strokeWidth="3" />
        <circle cx="88" cy="52" r="9" fill="#ec4899" />
        <circle cx="88" cy="52" r="4" fill="#fde047" />
        <line x1="112" y1="90" x2="112" y2="62" stroke="#15803d" strokeWidth="3" />
        <circle cx="112" cy="58" r="9" fill="#a855f7" />
        <circle cx="112" cy="58" r="4" fill="#fde047" />
        {/* Bunny */}
        <ellipse cx="26" cy="70" rx="16" ry="20" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="26" cy="38" r="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <ellipse cx="19" cy="14" rx="5" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <ellipse cx="33" cy="14" rx="5" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="22" cy="36" r="2" fill="#1c1917" />
        <circle cx="31" cy="36" r="2" fill="#1c1917" />
        {/* Watering can */}
        <rect x="44" y="48" width="24" height="18" rx="4" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
        <path d="M68 54 L82 48" stroke="#0369a1" strokeWidth="3" />
      </g>

      {/* Bear pushing cart with apples (Center-left path) */}
      <g transform="translate(310, 344)">
        {/* Cart */}
        <rect x="48" y="26" width="54" height="28" rx="6" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
        <circle cx="58" cy="58" r="9" fill="#44403c" />
        <circle cx="92" cy="58" r="9" fill="#44403c" />
        <circle cx="64" cy="24" r="8" fill="#ef4444" />
        <circle cx="78" cy="22" r="8" fill="#ef4444" />
        <circle cx="88" cy="25" r="8" fill="#22c55e" />
        {/* Bear */}
        <ellipse cx="24" cy="38" rx="18" ry="22" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        <circle cx="24" cy="12" r="16" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        <circle cx="12" cy="0" r="6" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        <circle cx="36" cy="0" r="6" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        <circle cx="20" cy="10" r="2" fill="#1c1917" />
        <circle cx="30" cy="10" r="2" fill="#1c1917" />
      </g>

      {/* Colorful Ball on the grass */}
      <g transform="translate(490, 416)">
        <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
        <path d="M4 20 Q20 8 36 20" fill="none" stroke="#ef4444" strokeWidth="4" />
        <path d="M20 2 Q10 20 20 38" fill="none" stroke="#3b82f6" strokeWidth="4" />
      </g>
    </svg>
  );
};
