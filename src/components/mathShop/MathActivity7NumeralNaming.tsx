import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { NUMERAL_NAMING_ORDER } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import {
  NAMING_EVALUATION_OPTIONS,
  type ItemResponse,
  type NamingEvaluation,
} from '../../types/domain';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity7NumeralNamingProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const MathActivity7NumeralNaming: React.FC<MathActivity7NumeralNamingProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const numeral = NUMERAL_NAMING_ORDER[index];
  const itemId = `name-${numeral}`;
  const resp = responses[itemId];

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_numeral_naming',
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

  const saveItem = async (patch: {
    responseText?: string;
    namingEvaluation?: NamingEvaluation;
    notes?: string;
    recordingId?: string;
    clearRecording?: boolean;
  }) => {
    const existing = responses[itemId];
    const nextEval = patch.namingEvaluation ?? existing?.namingEvaluation ?? 'לא נבדק';
    const isCorrect =
      nextEval === 'שיום עצמאי ונכון' || nextEval === 'שיום לאחר רמז או תיווך'
        ? true
        : nextEval === 'שיום שגוי' || nextEval === 'אין תגובה'
          ? false
          : undefined;

    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_numeral_naming',
      itemId,
      responseText: patch.responseText ?? existing?.responseText ?? '',
      namingEvaluation: nextEval,
      isCorrect,
      notes: patch.notes ?? existing?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? existing?.recordingId,
      metadata: { numeral },
    });
    setResponses((prev) => ({ ...prev, [itemId]: saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            ספרה {index + 1} מתוך {NUMERAL_NAMING_ORDER.length}
          </span>
          <div className="flex gap-1.5">
            {NUMERAL_NAMING_ORDER.map((n, idx) => {
              const r = responses[`name-${n}`];
              const hasEval = r?.namingEvaluation && r.namingEvaluation !== 'לא נבדק';
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIndex(idx)}
                  aria-label={`ספרה ${idx + 1}`}
                  className={`h-3 w-3 rounded-full ${
                    idx === index
                      ? 'scale-125 bg-sky-600'
                      : hasEval
                        ? 'bg-emerald-400'
                        : 'bg-stone-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <h2 className="mt-5 text-center text-2xl font-black text-stone-800 sm:text-3xl">
          איזה מספר זה?
        </h2>

        <div className="my-8 flex justify-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-[2.5rem] border-4 border-amber-300 bg-amber-50 text-8xl font-black text-sky-900 shadow-inner">
            {numeral}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
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
              onEncourage(getMathEncouragement());
              if (index < NUMERAL_NAMING_ORDER.length - 1) {
                setIndex((i) => i + 1);
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {index < NUMERAL_NAMING_ORDER.length - 1 ? 'למספר הבא' : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Teacher item evaluation */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
            תיעוד גננת — ספרה {numeral}
          </span>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים וסטטוס
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {NAMING_EVALUATION_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => void saveItem({ namingEvaluation: option })}
              className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                (resp?.namingEvaluation ?? 'לא נבדק') === option
                  ? 'border-sky-600 bg-sky-600 text-white'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={resp?.responseText ?? ''}
            onChange={(e) => void saveItem({ responseText: e.target.value })}
            placeholder="תגובת הילד/ה בפועל..."
            className="min-h-10 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={resp?.notes ?? ''}
            onChange={(e) => void saveItem({ notes: e.target.value })}
            placeholder="הערת גננת לספרה (רשות)..."
            className="min-h-10 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId="math_numeral_naming"
          itemId={itemId}
          recordingId={resp?.recordingId}
          onRecordingChange={(recId) =>
            void saveItem({
              recordingId: recId,
              clearRecording: recId === undefined,
            })
          }
          transcription={resp?.responseText ?? ''}
          onTranscriptionChange={(val) => void saveItem({ responseText: val })}
          compact
        />
      </div>
    </div>
  );
};
