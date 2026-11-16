import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Equal, Sparkles } from 'lucide-react';
import { MORE_LESS_COMPARISONS } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { BearShopkeeper, ShopObjectGroup } from '../art/ShopArt';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity5MoreLessProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const MathActivity5MoreLess: React.FC<MathActivity5MoreLessProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [subTask, setSubTask] = useState<'A' | 'B'>('A');
  const [compIndex, setCompIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const comp = MORE_LESS_COMPARISONS[compIndex];
  const compResp = responses[comp.id];
  const gt4Resp = responses['gt-4'];

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_more_less',
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

  const handleSelectComparison = async (choice: 'right' | 'left' | 'equal') => {
    const isCorrect = choice === comp.expectedChoice;
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_more_less',
      itemId: comp.id,
      responseText:
        choice === 'right' ? 'קבוצה ימנית' : choice === 'left' ? 'קבוצה שמאלית' : 'אותה כמות',
      isCorrect,
      notes: compResp?.notes ?? '',
      metadata: {
        subTask: 'A',
        questionType: comp.questionType,
        selectedChoice: choice,
      },
    });
    setResponses((prev) => ({ ...prev, [comp.id]: saved }));
    onEncourage(getMathEncouragement());
  };

  const saveGt4 = async (patch: {
    responseText?: string;
    notes?: string;
    recordingId?: string;
    clearRecording?: boolean;
    numbersMentioned?: string;
  }) => {
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_more_less',
      itemId: 'gt-4',
      responseText: patch.responseText ?? gt4Resp?.responseText ?? '',
      notes: patch.notes ?? gt4Resp?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? gt4Resp?.recordingId,
      metadata: {
        subTask: 'B',
        numbersMentioned:
          patch.numbersMentioned ?? (gt4Resp?.metadata?.numbersMentioned as string) ?? '',
      },
    });
    setResponses((prev) => ({ ...prev, 'gt-4': saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Sub-task switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setSubTask('A')}
          className={`min-h-11 rounded-2xl px-6 py-2 text-sm font-extrabold transition ${
            subTask === 'A'
              ? 'bg-sky-600 text-white shadow-md'
              : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
          }`}
        >
          משימה א׳: השוואת שתי קבוצות
        </button>
        <button
          type="button"
          onClick={() => setSubTask('B')}
          className={`min-h-11 rounded-2xl px-6 py-2 text-sm font-extrabold transition ${
            subTask === 'B'
              ? 'bg-sky-600 text-white shadow-md'
              : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
          }`}
        >
          משימה ב׳: מספרים הגדולים מ־4
        </button>
      </div>

      {subTask === 'A' ? (
        <>
          <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
            <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
              השוואה {compIndex + 1} מתוך {MORE_LESS_COMPARISONS.length}
            </span>

            <h2 className="mt-4 text-center text-2xl font-black text-stone-800 sm:text-3xl">
              {comp.questionHe}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void handleSelectComparison('right')}
                className={`flex min-h-48 items-center justify-center rounded-3xl border-3 p-5 transition active:scale-[0.98] ${
                  compResp?.metadata?.selectedChoice === 'right'
                    ? 'border-sky-600 bg-sky-50 ring-3 ring-sky-200'
                    : 'border-amber-200 bg-amber-50/40 hover:border-sky-300'
                }`}
              >
                <ShopObjectGroup
                  quantity={comp.rightGroup.quantity}
                  objectType={comp.rightGroup.objectType}
                  arrangement={comp.rightGroup.arrangement}
                />
              </button>

              <button
                type="button"
                onClick={() => void handleSelectComparison('left')}
                className={`flex min-h-48 items-center justify-center rounded-3xl border-3 p-5 transition active:scale-[0.98] ${
                  compResp?.metadata?.selectedChoice === 'left'
                    ? 'border-sky-600 bg-sky-50 ring-3 ring-sky-200'
                    : 'border-amber-200 bg-amber-50/40 hover:border-sky-300'
                }`}
              >
                <ShopObjectGroup
                  quantity={comp.leftGroup.quantity}
                  objectType={comp.leftGroup.objectType}
                  arrangement={comp.leftGroup.arrangement}
                />
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => void handleSelectComparison('equal')}
                className={`flex min-h-13 items-center gap-2 rounded-2xl border-2 px-8 py-3 text-base font-extrabold transition ${
                  compResp?.metadata?.selectedChoice === 'equal'
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-stone-300 bg-stone-50 text-stone-700 hover:bg-sky-50'
                }`}
              >
                <Equal className="h-5 w-5" />
                יש אותה כמות בשתי הקבוצות
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={compIndex === 0}
                onClick={() => setCompIndex((i) => Math.max(0, i - 1))}
                className="flex min-h-13 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-base font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
                הקודם
              </button>
              <button
                type="button"
                onClick={() => {
                  if (compIndex < MORE_LESS_COMPARISONS.length - 1) {
                    setCompIndex((i) => i + 1);
                  } else {
                    setSubTask('B');
                  }
                }}
                className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
              >
                {compIndex < MORE_LESS_COMPARISONS.length - 1
                  ? 'להשוואה הבאה'
                  : 'עבור למשימה ב׳'}
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-stone-300 bg-stone-100 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg bg-stone-800 px-2.5 py-1 font-bold text-white">
                תיעוד גננת (מוסתר מהילד/ה)
              </span>
              {compResp ? (
                <span
                  className={`rounded-full px-3 py-1 font-bold ${
                    compResp.isCorrect
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  בחירה: {compResp.responseText} (ימין: {comp.rightGroup.quantity}, שמאל:{' '}
                  {comp.leftGroup.quantity})
                </span>
              ) : (
                <span className="text-stone-500">טרם נבחרה תשובה</span>
              )}
            </div>
            <button
              type="button"
              onClick={onOpenTeacherDrawer}
              className="flex min-h-11 items-center gap-1.5 rounded-xl bg-stone-800 px-4 py-2 text-xs font-bold text-white hover:bg-stone-900"
            >
              <ClipboardList className="h-4 w-4" />
              קריטריונים והערות גננת
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 text-center shadow-lg sm:p-8">
            <BearShopkeeper className="mx-auto h-32 w-32" />
            <span className="mt-2 inline-block rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
              משימה ב׳ — גודל יחסי של מספרים
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-800 sm:text-3xl">
              איזה מספרים גדולים מ־4 אתה מכיר?
            </h2>
            <p className="mt-2 text-base text-stone-600">
              אפשר להגיד כמה מספרים שרוצים!
            </p>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  onEncourage(getMathEncouragement());
                  onFinishActivity();
                }}
                className="flex min-h-14 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
              >
                <Sparkles className="h-5 w-5" />
                סיימתי!
              </button>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
                תיעוד גננת — מספרים גדולים מ־4
              </span>
              <button
                type="button"
                onClick={onOpenTeacherDrawer}
                className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
              >
                <ClipboardList className="h-4 w-4" />
                קריטריונים והערות
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700">
                המספרים שהילד/ה ציין/ה (אין תשובה יחידה נכונה)
              </label>
              <input
                type="text"
                value={(gt4Resp?.metadata?.numbersMentioned as string) ?? ''}
                onChange={(e) => void saveGt4({ numbersMentioned: e.target.value })}
                placeholder="לדוגמה: 5, 7, 10, 100..."
                className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <AudioRecorderWidget
              profileId={profileId}
              taskId="math_more_less"
              itemId="gt-4"
              recordingId={gt4Resp?.recordingId}
              onRecordingChange={(recId) =>
                void saveGt4({
                  recordingId: recId,
                  clearRecording: recId === undefined,
                })
              }
              transcription={gt4Resp?.responseText ?? ''}
              onTranscriptionChange={(text) => void saveGt4({ responseText: text })}
              compact
            />
          </div>
        </>
      )}
    </div>
  );
};
