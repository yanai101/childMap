import React from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';
import { PICTURE_DESCRIPTION_CONFIG } from '../../content/storyHouse';
import { getRandomEncouragement } from '../../content/village';
import { PictureDescriptionArt } from '../art/PictureDescriptionArt';

interface Activity5DescriptionProps {
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const Activity5Description: React.FC<Activity5DescriptionProps> = ({
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-[2rem] border-4 border-amber-200 bg-white p-5 shadow-lg sm:p-8">
        <div className="text-center">
          <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-extrabold text-emerald-900">
            {PICTURE_DESCRIPTION_CONFIG.title}
          </span>
          <h2 className="mt-3 text-xl font-black text-stone-800 sm:text-2xl">
            {PICTURE_DESCRIPTION_CONFIG.childInstruction}
          </h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border-2 border-amber-200 bg-sky-50 shadow-inner">
          <PictureDescriptionArt className="w-full h-auto" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              onEncourage(getRandomEncouragement());
              onFinishActivity();
            }}
            className="flex min-h-14 items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-amber-600"
          >
            <Sparkles className="h-5 w-5" />
            סיימתי לספר על התמונה!
          </button>
        </div>
      </div>

      {/* Visually separated Teacher bar */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
              תיעוד גננת — מדרש תמונה
            </span>
            <ul className="mt-2 list-disc pr-5 text-xs text-stone-600 space-y-0.5">
              {PICTURE_DESCRIPTION_CONFIG.teacherObservationHints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-stone-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            הקלטה, תמלול והערכת 6 קריטריונים
          </button>
        </div>
      </div>
    </div>
  );
};
