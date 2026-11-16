import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Eye, EyeOff } from 'lucide-react';
import { NAMING_EVALUATION_OPTIONS, type ItemResponse, type NamingEvaluation } from '../../types/domain';
import { PICTURE_NAMING_ITEMS } from '../../content/storyHouse';
import { getRandomEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import { PictureNamingArt } from '../art/PictureNamingArt';

interface Activity1NamingProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const Activity1Naming: React.FC<Activity1NamingProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});
  const [showTeacherItemControls, setShowTeacherItemControls] = useState(true);

  const item = PICTURE_NAMING_ITEMS[currentIndex];
  const currentResp = responses[item.id];

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(profileId, 'naming');
      if (!active) return;
      const map: Record<string, ItemResponse> = {};
      for (const r of existing) {
        map[r.itemId] = r;
      }
      setResponses(map);
    }
    void load();
    return () => {
      active = false;
    };
  }, [profileId]);

  const saveItemUpdate = async (patch: {
    responseText?: string;
    namingEvaluation?: NamingEvaluation;
    notes?: string;
  }) => {
    const existing = responses[item.id];
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'naming',
      itemId: item.id,
      responseText: patch.responseText ?? existing?.responseText ?? '',
      namingEvaluation: patch.namingEvaluation ?? existing?.namingEvaluation ?? 'לא נבדק',
      notes: patch.notes ?? existing?.notes ?? '',
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  const handleNext = () => {
    onEncourage(getRandomEncouragement());
    if (currentIndex < PICTURE_NAMING_ITEMS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onFinishActivity();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing stage */}
      <div className="rounded-[2rem] border-4 border-amber-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-extrabold text-amber-900">
            תמונה {currentIndex + 1} מתוך {PICTURE_NAMING_ITEMS.length}
          </span>
          <div className="flex gap-1.5">
            {PICTURE_NAMING_ITEMS.map((it, idx) => {
              const hasData = Boolean(
                responses[it.id]?.namingEvaluation &&
                  responses[it.id]?.namingEvaluation !== 'לא נבדק',
              );
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`תמונה ${idx + 1}`}
                  className={`h-3.5 w-3.5 rounded-full transition ${
                    idx === currentIndex
                      ? 'scale-125 bg-amber-500 ring-2 ring-amber-200'
                      : hasData
                        ? 'bg-emerald-400'
                        : 'bg-stone-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <p className="mb-4 text-center text-2xl font-extrabold text-stone-800">
            {item.teacherPrompt}
          </p>
          <PictureNamingArt
            illustrationKey={item.illustrationKey}
            className="h-60 w-60 sm:h-72 sm:w-72 animate-pop-in"
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="flex min-h-13 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-base font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
            הקודם
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-amber-600"
          >
            {currentIndex < PICTURE_NAMING_ITEMS.length - 1 ? 'לתמונה הבאה' : 'סיום המשחק'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visually separated Teacher Recording Bar */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100/90 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
              תיעוד גננת
            </span>
            <span className="text-sm font-bold text-stone-700">
              מילת יעד: <span className="text-amber-800">{item.targetWord}</span> ({item.category})
            </span>
            <span className="text-xs text-stone-500">• רמז: {item.teacherHint}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTeacherItemControls((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              {showTeacherItemControls ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showTeacherItemControls ? 'הסתר תיעוד פריט' : 'הצג תיעוד פריט'}
            </button>
            <button
              type="button"
              onClick={onOpenTeacherDrawer}
              className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-stone-900"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              פאנל הערכה מלא
            </button>
          </div>
        </div>

        {showTeacherItemControls && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {NAMING_EVALUATION_OPTIONS.map((option) => {
                const selected = (currentResp?.namingEvaluation ?? 'לא נבדק') === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => void saveItemUpdate({ namingEvaluation: option })}
                    className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      selected
                        ? 'border-amber-600 bg-amber-500 text-white shadow-xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-stone-700">
                  תגובת הילד/ה בפועל
                </label>
                <input
                  type="text"
                  value={currentResp?.responseText ?? ''}
                  onChange={(e) => void saveItemUpdate({ responseText: e.target.value })}
                  placeholder="מה אמר/ה הילד/ה?"
                  className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700">
                  הערת גננת לפריט (רשות)
                </label>
                <input
                  type="text"
                  value={currentResp?.notes ?? ''}
                  onChange={(e) => void saveItemUpdate({ notes: e.target.value })}
                  placeholder="הערה קצרה..."
                  className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
