import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { NUMERAL_RECOGNITION_ITEMS } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';

interface MathActivity6NumeralRecognitionProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

const INDEPENDENCE_OPTIONS = ['עצמאי', 'לאחר רמז/חשיבה', 'בתיווך', 'לא נבדק'];

const NUMBER_WORDS_HE: Record<number, string> = {
  1: 'אחד',
  2: 'שתיים',
  3: 'שלוש',
  4: 'ארבע',
  5: 'חמש',
  6: 'שש',
  7: 'שבע',
  8: 'שמונה',
  9: 'תשע',
  10: 'עשר',
};

export const MathActivity6NumeralRecognition: React.FC<
  MathActivity6NumeralRecognitionProps
> = ({ profileId, onEncourage, onOpenTeacherDrawer, onFinishActivity }) => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const item = NUMERAL_RECOGNITION_ITEMS[index];
  const resp = responses[item.id];
  const independence = (resp?.metadata?.independence as string) ?? 'לא נבדק';

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_numeral_recognition',
      );
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

  const saveSelection = async (selectedNumeral: number, ind?: string) => {
    const isCorrect = selectedNumeral === item.targetNumeral;
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_numeral_recognition',
      itemId: item.id,
      responseText: String(selectedNumeral),
      isCorrect,
      notes: resp?.notes ?? '',
      metadata: {
        requestedNumeral: item.targetNumeral,
        selectedNumeral,
        independence: ind ?? independence,
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  const updateTeacherField = async (patch: {
    notes?: string;
    independence?: string;
    manualCorrect?: boolean;
  }) => {
    const currentSelected = resp?.metadata?.selectedNumeral as number | undefined;
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_numeral_recognition',
      itemId: item.id,
      responseText: resp?.responseText ?? '',
      isCorrect: patch.manualCorrect ?? resp?.isCorrect,
      notes: patch.notes ?? resp?.notes ?? '',
      metadata: {
        requestedNumeral: item.targetNumeral,
        selectedNumeral: currentSelected,
        independence: patch.independence ?? independence,
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            זיהוי ספרה {index + 1} מתוך {NUMERAL_RECOGNITION_ITEMS.length}
          </span>
          <div className="flex gap-1.5">
            {NUMERAL_RECOGNITION_ITEMS.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`ספרה ${idx + 1}`}
                className={`h-3 w-3 rounded-full ${
                  idx === index
                    ? 'scale-125 bg-sky-600'
                    : responses[it.id]
                      ? 'bg-emerald-400'
                      : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-black text-stone-800 sm:text-4xl">
          תראה לי איפה המספר {NUMBER_WORDS_HE[item.targetNumeral] ?? item.targetNumeral}.
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-stone-500">
          הגננת מקריאה בקול את שם המספר, והילד/ה בוחר/ת את הכרטיסייה המתאימה.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {item.choices.map((num) => {
            const isSelected = resp?.responseText === String(num);
            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  void saveSelection(num);
                  onEncourage(getMathEncouragement());
                }}
                className={`min-h-24 rounded-3xl border-3 text-4xl font-black transition active:scale-95 ${
                  isSelected
                    ? 'border-sky-600 bg-sky-100 text-sky-900 shadow-md ring-3 ring-sky-200'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="flex min-h-13 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-base font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
            הקודם
          </button>

          <button
            type="button"
            onClick={() => {
              if (index < NUMERAL_RECOGNITION_ITEMS.length - 1) {
                setIndex((i) => i + 1);
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {index < NUMERAL_RECOGNITION_ITEMS.length - 1 ? 'לספרה הבאה' : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Teacher item controls */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 font-bold text-white">
              תיעוד גננת — ספרה מבוקשת: {item.targetNumeral}
            </span>
            {resp && (
              <span
                className={`rounded-full px-3 py-1 font-bold ${
                  resp.isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                נבחר: {resp.responseText || '—'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים וסטטוס
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-700">עצמאות:</span>
          {INDEPENDENCE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => void updateTeacherField({ independence: opt })}
              className={`rounded-xl border px-3 py-1 text-xs font-semibold ${
                independence === opt
                  ? 'border-sky-600 bg-sky-500 text-white'
                  : 'border-stone-300 bg-white text-stone-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={resp?.notes ?? ''}
          onChange={(e) => void updateTeacherField({ notes: e.target.value })}
          placeholder="הערת גננת לספרה זו (רשות)..."
          className="min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};
