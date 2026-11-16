import React from 'react';

interface FoxMascotProps {
  className?: string;
  holdingBook?: boolean;
}

export const FoxMascot: React.FC<FoxMascotProps> = ({
  className = 'w-44 h-44',
}) => {
  return (
    <img
      src="/images/fox_mascot.jpg"
      alt="אורי השועל החבר"
      className={`${className} rounded-3xl object-cover shadow-md border-2 border-amber-200`}
    />
  );
};
