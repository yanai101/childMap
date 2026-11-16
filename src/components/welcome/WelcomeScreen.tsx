import React from 'react';
import { Play, ShieldCheck } from 'lucide-react';
import { FoxMascot } from '../art/FoxMascot';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 px-6 py-10">
      {/* Decorative soft clouds */}
      <div className="pointer-events-none absolute top-10 right-12 h-14 w-36 rounded-full bg-white/70 blur-[1px]" />
      <div className="pointer-events-none absolute top-20 left-16 h-12 w-28 rounded-full bg-white/60 blur-[1px]" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center rounded-[2.5rem] border-4 border-amber-200 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-xs sm:p-12 animate-pop-in">
        <div className="animate-float-slow">
          <FoxMascot className="h-44 w-44 sm:h-52 sm:w-52" holdingBook />
        </div>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-amber-900 sm:text-5xl">
          הכפר של החברים
        </h1>
        <p className="mt-3 max-w-md text-lg font-medium text-stone-600 sm:text-xl">
          מסע משחק וסיפורים בגן עם אורי השועל וחבריו
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 flex min-h-16 items-center gap-3 rounded-3xl bg-gradient-to-l from-amber-500 to-orange-500 px-10 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:scale-[1.02] hover:from-amber-600 hover:to-orange-600 active:scale-[0.99]"
        >
          <Play className="h-7 w-7 fill-white" />
          מתחילים לשחק
        </button>

        <div className="mt-7 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>כל הנתונים, ההקלטות והערכות נשמרים מקומית במכשיר זה בלבד</span>
        </div>
      </div>
    </div>
  );
};
