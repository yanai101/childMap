import React from 'react';
import type { PatternToken, ShopObjectType } from '../../content/mathShop';

export const BearShopkeeper: React.FC<{ className?: string }> = ({
  className = 'h-32 w-32',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="דובי הסוחר מחנות המספרים"
    >
      <ellipse cx="100" cy="184" rx="60" ry="10" fill="#dbeafe" />
      {/* Ears */}
      <circle cx="56" cy="56" r="22" fill="#92400e" stroke="#451a03" strokeWidth="3" />
      <circle cx="56" cy="56" r="11" fill="#fde68a" />
      <circle cx="144" cy="56" r="22" fill="#92400e" stroke="#451a03" strokeWidth="3" />
      <circle cx="144" cy="56" r="11" fill="#fde68a" />
      {/* Body */}
      <ellipse cx="100" cy="144" rx="48" ry="40" fill="#b45309" stroke="#451a03" strokeWidth="3" />
      {/* Blue Shop Apron */}
      <path d="M68 122 L132 122 L138 176 L62 176 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="2.5" />
      <rect x="82" y="138" width="36" height="22" rx="6" fill="#93c5fd" stroke="#1e40af" strokeWidth="2" />
      <text x="100" y="154" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e3a8a">1 2 3</text>
      {/* Head */}
      <circle cx="100" cy="84" r="42" fill="#b45309" stroke="#451a03" strokeWidth="3" />
      {/* Snout */}
      <ellipse cx="100" cy="96" rx="20" ry="14" fill="#fef3c7" />
      <ellipse cx="100" cy="90" rx="7" ry="5" fill="#1c1917" />
      <path d="M90 100 Q100 108 110 100" fill="none" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
      {/* Eyes & Cheeks */}
      <circle cx="82" cy="76" r="5" fill="#1c1917" />
      <circle cx="83.5" cy="74.5" r="1.8" fill="#ffffff" />
      <circle cx="118" cy="76" r="5" fill="#1c1917" />
      <circle cx="119.5" cy="74.5" r="1.8" fill="#ffffff" />
      <ellipse cx="70" cy="88" rx="6" ry="4" fill="#fda4af" opacity="0.7" />
      <ellipse cx="130" cy="88" rx="6" ry="4" fill="#fda4af" opacity="0.7" />
      {/* Paws */}
      <ellipse cx="56" cy="140" rx="13" ry="10" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
      <ellipse cx="144" cy="140" rx="13" ry="10" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
    </svg>
  );
};

export const ShopObjectIcon: React.FC<{
  type: ShopObjectType;
  className?: string;
}> = ({ type, className = 'h-12 w-12' }) => {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {type === 'apple' && (
        <g>
          <path d="M32 16 C22 10, 10 18, 12 34 C14 50, 26 56, 32 52 C38 56, 50 50, 52 34 C54 18, 42 10, 32 16 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
          <path d="M32 16 Q34 8 38 6" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="40" cy="12" rx="7" ry="4" fill="#22c55e" transform="rotate(-20 40 12)" />
        </g>
      )}
      {type === 'ball' && (
        <g>
          <circle cx="32" cy="32" r="22" fill="#38bdf8" stroke="#0369a1" strokeWidth="2.5" />
          <path d="M12 24 Q32 36 52 24" fill="none" stroke="#fef08a" strokeWidth="6" />
          <path d="M22 12 Q32 32 22 52" fill="none" stroke="#f43f5e" strokeWidth="5" />
        </g>
      )}
      {type === 'flower' && (
        <g>
          <line x1="32" y1="32" x2="32" y2="58" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="16" r="8" fill="#f472b6" />
          <circle cx="44" cy="24" r="8" fill="#f472b6" />
          <circle cx="40" cy="37" r="8" fill="#f472b6" />
          <circle cx="24" cy="37" r="8" fill="#f472b6" />
          <circle cx="20" cy="24" r="8" fill="#f472b6" />
          <circle cx="32" cy="27" r="7" fill="#fde047" />
        </g>
      )}
      {type === 'block' && (
        <g>
          <rect x="12" y="18" width="40" height="36" rx="6" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
          <rect x="18" y="10" width="12" height="8" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <rect x="34" y="10" width="12" height="8" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        </g>
      )}
      {type === 'orange' && (
        <g>
          <circle cx="32" cy="34" r="20" fill="#fb923c" stroke="#c2410c" strokeWidth="2.5" />
          <ellipse cx="36" cy="13" rx="7" ry="4" fill="#22c55e" transform="rotate(-15 36 13)" />
        </g>
      )}
      {type === 'strawberry' && (
        <g>
          <path d="M16 24 C16 14, 48 14, 48 24 C48 40, 36 54, 32 54 C28 54, 16 40, 16 24 Z" fill="#f43f5e" stroke="#9f1239" strokeWidth="2.5" />
          <path d="M22 18 L32 10 L42 18 L32 22 Z" fill="#22c55e" />
          <circle cx="26" cy="30" r="2" fill="#fef08a" />
          <circle cx="38" cy="30" r="2" fill="#fef08a" />
          <circle cx="32" cy="40" r="2" fill="#fef08a" />
        </g>
      )}
      {type === 'carrot' && (
        <g>
          <path d="M24 22 L40 22 L32 56 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M32 22 L24 10 M32 22 L32 8 M32 22 L40 10" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
      {type === 'cookie' && (
        <g>
          <circle cx="32" cy="32" r="21" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="3" fill="#451a03" />
          <circle cx="39" cy="26" r="3.2" fill="#451a03" />
          <circle cx="30" cy="38" r="3" fill="#451a03" />
          <circle cx="40" cy="40" r="2.5" fill="#451a03" />
        </g>
      )}
      {type === 'balloon' && (
        <g>
          <ellipse cx="32" cy="25" rx="17" ry="20" fill="#ec4899" stroke="#9d174d" strokeWidth="2.5" />
          <polygon points="32,45 28,50 36,50" fill="#ec4899" />
          <path d="M32 50 Q28 56 34 62" fill="none" stroke="#64748b" strokeWidth="2" />
        </g>
      )}
      {type === 'candy' && (
        <g>
          <polygon points="8,24 18,32 8,40" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
          <polygon points="56,24 46,32 56,40" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
          <ellipse cx="32" cy="32" rx="15" ry="12" fill="#c084fc" stroke="#6b21a8" strokeWidth="2.5" />
          <path d="M25 22 L29 42 M35 22 L39 42" stroke="#fef08a" strokeWidth="3" />
        </g>
      )}
      {type === 'car' && (
        <g>
          <path d="M12 36 L18 22 L44 22 L52 36 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="8" y="34" width="48" height="14" rx="5" fill="#60a5fa" stroke="#1e40af" strokeWidth="2.5" />
          <circle cx="20" cy="48" r="6" fill="#1e293b" />
          <circle cx="44" cy="48" r="6" fill="#1e293b" />
        </g>
      )}
      {type === 'star' && (
        <polygon
          points="32,8 39,23 55,25 43,36 46,53 32,45 18,53 21,36 9,25 25,23"
          fill="#fde047"
          stroke="#ca8a04"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export const PatternTokenIcon: React.FC<{
  token: PatternToken;
  className?: string;
}> = ({ token, className = 'h-12 w-12' }) => {
  if (token === 'red_apple') {
    return <ShopObjectIcon type="apple" className={className} />;
  }
  if (token === 'yellow_star') {
    return <ShopObjectIcon type="star" className={className} />;
  }
  if (token === 'blue_berry') {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <circle cx="32" cy="34" r="19" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
        <path d="M26 15 L32 10 L38 15 L32 19 Z" fill="#22c55e" />
        <circle cx="26" cy="28" r="4" fill="#93c5fd" opacity="0.7" />
      </svg>
    );
  }
  // green_pear
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 14 C25 14, 24 24, 20 30 C14 38, 18 54, 32 54 C46 54, 50 38, 44 30 C40 24, 39 14, 32 14 Z"
        fill="#4ade80"
        stroke="#15803d"
        strokeWidth="2.5"
      />
      <line x1="32" y1="14" x2="35" y2="7" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

interface ShopObjectGroupProps {
  quantity: number;
  objectType: ShopObjectType;
  arrangement?: 'grid' | 'row' | 'scattered';
  interactiveHighlight?: boolean;
  tappedIndices?: number[];
  onTapObject?: (index: number) => void;
  itemSizeClass?: string;
}

export const ShopObjectGroup: React.FC<ShopObjectGroupProps> = ({
  quantity,
  objectType,
  arrangement = 'grid',
  interactiveHighlight = false,
  tappedIndices = [],
  onTapObject,
  itemSizeClass = 'h-12 w-12 sm:h-14 sm:w-14',
}) => {
  const items = Array.from({ length: quantity }, (_, i) => i);

  const containerClass =
    arrangement === 'row'
      ? 'flex flex-wrap items-center justify-center gap-2.5'
      : arrangement === 'scattered'
        ? 'flex flex-wrap items-center justify-around gap-3 px-2'
        : 'grid grid-cols-3 sm:grid-cols-4 gap-2.5 place-items-center';

  return (
    <div className={containerClass}>
      {items.map((idx) => {
        const isTapped = tappedIndices.includes(idx);
        const offsetClass =
          arrangement === 'scattered'
            ? idx % 3 === 0
              ? 'translate-y-1'
              : idx % 3 === 1
                ? '-translate-y-1.5'
                : 'translate-y-0.5'
            : '';

        if (interactiveHighlight && onTapObject) {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onTapObject(idx)}
              className={`rounded-2xl p-1.5 transition active:scale-95 ${offsetClass} ${
                isTapped
                  ? 'bg-amber-100 ring-3 ring-amber-400 scale-105'
                  : 'hover:bg-sky-50'
              }`}
            >
              <ShopObjectIcon type={objectType} className={itemSizeClass} />
            </button>
          );
        }

        return (
          <div key={idx} className={offsetClass}>
            <ShopObjectIcon type={objectType} className={itemSizeClass} />
          </div>
        );
      })}
    </div>
  );
};
