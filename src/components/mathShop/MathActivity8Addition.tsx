import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, RotateCcw } from 'lucide-react';
import { ADDITION_PROBLEMS, ADDITION_STRATEGIES } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { BearShopkeeper, ShopObjectIcon } from '../art/ShopArt';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity8AdditionProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const MathActivity8Addition: React.FC<MathActivity8AdditionProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedManipulatives, setSelectedManipulatives] = useState<number[]>([]);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const problem = ADDITION_PROBLEMS[index];
  const resp = responses[problem.id];
  const strategy = (resp?.metadata?.strategyUsed as string) ?? 'לא נצפה';
  const explanationText = (resp?.metadata?.explanationTranscription as string) ?? '';

  useEffect(() => {
    setSelectedManipulatives([]);
  }, [index]);

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_addition',
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

  const saveProblem = async (patch: {
    responseText?: string;
    isCorrect?: boolean;
    notes?: string;
    recordingId?: string;
    clearRecording?: boolean;
    strategyUsed?: string;
    explanationTranscription?: string;
  }) => {
    const existing = responses[problem.id];
    const nextAnswer = patch.responseText ?? existing?.responseText ?? '';
    const trimmed = nextAnswer.trim();
    const inferredCorrect =
      patch.isCorrect !== undefined
        ? patch.isCorrect
        : trimmed !== ''
          ? Number(trimmed) === problem.expectedResult
          : existing?.isCorrect;

    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_addition',
      itemId: problem.id,
      responseText: nextAnswer,
      isCorrect: inferredCorrect,
      notes: patch.notes ?? existing?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? existing?.recordingId,
      metadata: {
        problemNumber: problem.problemNumber,
        expectedResult: problem.expectedResult,
        strategyUsed: patch.strategyUsed ?? strategy,
        explanationTranscription: patch.explanationTranscription ?? explanationText,
      },
    });
    setResponses((prev) => ({ ...prev, [problem.id]: saved }));
  };

  const toggleManipulative = (idx: number) => {
    setSelectedManipulatives((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const totalManipulatives = problem.initialCount + problem.addedCount;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing story problem */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            סיפור חיבור {problem.problemNumber} מתוך {ADDITION_PROBLEMS.length}
          </span>
          <button
            type="button"
            onClick={() => setSelectedManipulatives([])}
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס הדגמה
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:text-right">
          <BearShopkeeper className="h-24 w-24 shrink-0" />
          <p className="text-xl font-black leading-relaxed text-stone-800 sm:text-2xl">
            {problem.promptHe}
          </p>
        </div>

        {/* Optional manipulable objects (never displays numeric total!) */}
        <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-amber-50/40 p-5">
          <p className="mb-3 text-center text-xs font-semibold text-stone-500">
            אפשר ללחוץ על החפצים כדי להדגים ולהזיז אותם לסל החישוב:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: totalManipulatives }, (_, idx) => {
              const isInSecondGroup = idx >= problem.initialCount;
              const isPicked = selectedManipulatives.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleManipulative(idx)}
                  className={`rounded-2xl border-2 p-2.5 transition active:scale-95 ${
                    isPicked
                      ? 'border-sky-500 bg-sky-100 ring-2 ring-sky-300 -translate-y-1'
                      : isInSecondGroup
                        ? 'border-dashed border-amber-400 bg-white hover:bg-amber-50'
                        : 'border-amber-300 bg-white hover:bg-amber-50'
                  }`}
                >
                  <ShopObjectIcon
                    type={problem.objectType}
                    className="h-12 w-12 sm:h-14 sm:w-14"
                  />
                </button>
              );
            })}
          </div>
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
              onEncourage(getMathEncouragement());
              if (index < ADDITION_PROBLEMS.length - 1) {
                setIndex((i) => i + 1);
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {index < ADDITION_PROBLEMS.length - 1 ? 'לבעיה הבאה' : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Teacher assessment for this problem */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
            תיעוד גננת — בעיה {problem.problemNumber} (תוצאה צפויה: {problem.expectedResult})
          </span>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים מסכמים וסטטוס
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-stone-700">
              תשובת הילד/ה בפועל
            </label>
            <input
              type="text"
              value={resp?.responseText ?? ''}
              onChange={(e) => void saveProblem({ responseText: e.target.value })}
              placeholder="מה ענה הילד/ה?"
              className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">דיוק התוצאה</label>
            <div className="mt-1 flex gap-2">
              {[
                { label: 'תוצאה נכונה', val: true },
                { label: 'תוצאה שגויה', val: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => void saveProblem({ isCorrect: opt.val })}
                  className={`flex-1 min-h-10 rounded-xl border px-3 py-1.5 text-xs font-bold ${
                    resp?.isCorrect === opt.val
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700">אסטרטגיית הפתרון שנצפתה</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {ADDITION_STRATEGIES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => void saveProblem({ strategyUsed: st })}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${
                  strategy === st
                    ? 'border-sky-600 bg-sky-500 text-white'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId="math_addition"
          itemId={problem.id}
          recordingId={resp?.recordingId}
          onRecordingChange={(recId) =>
            void saveProblem({
              recordingId: recId,
              clearRecording: recId === undefined,
            })
          }
          transcription={explanationText}
          onTranscriptionChange={(val) =>
            void saveProblem({ explanationTranscription: val })
          }
          compact
        />

        <input
          type="text"
          value={resp?.notes ?? ''}
          onChange={(e) => void saveProblem({ notes: e.target.value })}
          placeholder="הערת גננת לבעיה זו (רשות)..."
          className="min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};
