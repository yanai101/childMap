import React from 'react';

interface FoxMascotProps {
  className?: string;
  holdingBook?: boolean;
}

export const FoxMascot: React.FC<FoxMascotProps> = ({
  className = 'w-44 h-44',
  holdingBook = true,
}) => {
  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      role="img"
      aria-label="אורי השועל החבר"
    >
      {/* Soft ground shadow */}
      <ellipse cx="110" cy="198" rx="64" ry="11" fill="#fde68a" opacity="0.7" />

      {/* Fluffy Fox Tail */}
      <path
        d="M148 158 C195 152, 206 112, 178 96 C162 88, 152 108, 146 132 Z"
        fill="#ea580c"
        stroke="#9a3412"
        strokeWidth="3"
      />
      <path
        d="M178 96 C192 104, 194 120, 180 128 C170 120, 168 106, 178 96 Z"
        fill="#fffbeb"
      />

      {/* Body */}
      <ellipse cx="110" cy="150" rx="44" ry="42" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <ellipse cx="110" cy="154" rx="26" ry="30" fill="#fffbeb" />

      {/* Paws / Feet */}
      <ellipse cx="86" cy="188" rx="15" ry="9" fill="#9a3412" />
      <ellipse cx="134" cy="188" rx="15" ry="9" fill="#9a3412" />

      {/* Ears */}
      <polygon points="62,72 52,22 94,48" fill="#ea580c" stroke="#9a3412" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="66,64 60,33 85,50" fill="#fed7aa" />
      <polygon points="158,72 168,22 126,48" fill="#ea580c" stroke="#9a3412" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="154,64 160,33 135,50" fill="#fed7aa" />

      {/* Head */}
      <ellipse cx="110" cy="84" rx="50" ry="42" fill="#f97316" stroke="#9a3412" strokeWidth="3" />

      {/* Cheeks */}
      <path
        d="M62 88 C68 112, 90 124, 110 124 C130 124, 152 112, 158 88 C142 96, 126 92, 110 102 C94 92, 78 96, 62 88 Z"
        fill="#fffbeb"
      />

      {/* Eyes */}
      <circle cx="90" cy="78" r="7.5" fill="#1c1917" />
      <circle cx="92.5" cy="75.5" r="2.5" fill="#ffffff" />
      <circle cx="130" cy="78" r="7.5" fill="#1c1917" />
      <circle cx="132.5" cy="75.5" r="2.5" fill="#ffffff" />

      {/* Rosy cheeks */}
      <ellipse cx="76" cy="92" rx="7" ry="4.5" fill="#fda4af" opacity="0.7" />
      <ellipse cx="144" cy="92" rx="7" ry="4.5" fill="#fda4af" opacity="0.7" />

      {/* Nose & Smile */}
      <ellipse cx="110" cy="96" rx="7.5" ry="5.5" fill="#292524" />
      <path d="M100 105 Q110 114 120 105" fill="none" stroke="#292524" strokeWidth="3" strokeLinecap="round" />

      {/* Storybook in paws */}
      {holdingBook ? (
        <g transform="translate(72, 134)">
          <path d="M4 6 L38 14 L38 48 L4 40 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M72 6 L38 14 L38 48 L72 40 Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="12" y1="16" x2="30" y2="20" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="24" x2="28" y2="28" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <circle cx="55" cy="24" r="6" fill="#f97316" opacity="0.7" />
        </g>
      ) : null}

      {/* Arms */}
      <ellipse cx="72" cy="148" rx="12" ry="9" fill="#ea580c" stroke="#9a3412" strokeWidth="2.5" />
      <ellipse cx="148" cy="148" rx="12" ry="9" fill="#ea580c" stroke="#9a3412" strokeWidth="2.5" />
    </svg>
  );
};
