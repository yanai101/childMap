import React from 'react';
import { Sparkles } from 'lucide-react';

interface EncourageToastProps {
  message: string | null;
}

export const EncourageToast: React.FC<EncourageToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border-2 border-amber-300 bg-white px-6 py-3 shadow-xl animate-pop-in">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-amber-900">{message}</span>
      </div>
    </div>
  );
};
