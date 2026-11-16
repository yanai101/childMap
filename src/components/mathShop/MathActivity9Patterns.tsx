import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, HelpCircle } from 'lucide-react';
import { PATTERN_ITEMS, type PatternToken } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { PatternTokenIcon } from '../art/ShopArt';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity9PatternsProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const MathActivity9Patterns: React.FC<MathActivity9PatternsProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const item = PATTERN_ITEMS[index];
  const resp = responses[item.id];
  const selectedToken = resp?.responseText as PatternToken | undefined;

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_patterns',
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

  const handleSelectToken = async (token: PatternToken) => {
    const isCorrect = token === item.expectedToken;
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_patterns',
      itemId: item.id,
      responseText: token,
      isCorrect,
      notes: resp?.notes ?? '',
      recordingId: resp?.recordingId,
      metadata: {
        patternType: item.patternType,
        expectedToken: item.expectedToken,
        explanation: (resp?.metadata?.explanation as string) ?? '',
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
    onEncourage(getMathEncouragement());
  };

  const saveTeacherExtras = async (patch: {
    recordingId?: string;
    clearRecording?: boolean;
    explanation?: string;
    notes?: string;
  }) => {
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_patterns',
      itemId: item.id,
      responseText: resp?.responseText ?? '',
      isCorrect: resp?.isCorrect,
      notes: patch.notes ?? resp?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? resp?.recordingId,
      metadata: {
        patternType: item.patternType,
        expectedToken: item.expectedToken,
        explanation: patch.explanation ?? (resp?.metadata?.explanation as string) ?? '',
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing pattern stage */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            דגם {item.patternType} • {index + 1} מתוך {PATTERN_ITEMS.length}
          </span>
          <div className="flex gap-1.5">
            {PATTERN_ITEMS.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`דגם ${idx + 1}`}
                className={`h-3 w-3 rounded-full ${
                  idx === index
                    ? 'scale-125 bg-sky-600'
                    : responses[it.id]?.responseText
                      ? 'bg-emerald-400'
                      : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black text-stone-800 sm:text-3xl">
          מה חסר בדגם של דובי? בחר את הפריט המתאים!
        </h2>

        {/* Pattern strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-3xl border-2 border-amber-200 bg-amber-50/50 p-5">
          {item.sequence.map((token, idx) => {
            if (token === null) {
              return (
                <div
                  key={`slot-${idx}`}
                  className="flex h-18 w-18 items-center justify-center rounded-2xl border-3 border-dashed border-sky-500 bg-white shadow-inner sm:h-20 sm:w-20"
                >
                  {selectedToken ? (
                    <PatternTokenIcon token={selectedToken} className="h-12 w-12 sm:h-14 sm:w-14" />
                  ) : (
                    <HelpCircle className="h-8 w-8 text-sky-400" />
                  )}
                </div>
              );
            }
            return (
              <div
                key={`tok-${idx}`}
                className="flex h-18 w-18 items-center justify-center rounded-2xl border-2 border-amber-200 bg-white shadow-xs sm:h-20 sm:w-20"
              >
                <PatternTokenIcon token={token} className="h-12 w-12 sm:h-14 sm:w-14" />
              </div>
            );
          })}
        </div>

        {/* Choices */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {item.choices.map((choice) => {
            const isSelected = selectedToken === choice;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => void handleSelectToken(choice)}
                className={`flex h-24 w-28 items-center justify-center rounded-3xl border-3 transition active:scale-95 ${
                  isSelected
                    ? 'border-sky-600 bg-sky-100 ring-3 ring-sky-200 shadow-md'
                    : 'border-stone-200 bg-stone-50 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <PatternTokenIcon token={choice} className="h-14 w-14" />
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
              if (index < PATTERN_ITEMS.length - 1) {
                setIndex((i) => i + 1);
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {index < PATTERN_ITEMS.length - 1 ? 'לדגם הבא' : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Teacher summary & explanation recording */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 font-bold text-white">
              תיעוד גננת — דגם {item.patternType}
            </span>
            {resp?.responseText && (
              <span
                className={`rounded-full px-3 py-1 font-bold ${
                  resp.isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {resp.isCorrect ? 'השלמה מדויקת' : 'השלמה שונה מהדגם'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים מסכמים וסטטוס
          </button>
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId="math_patterns"
          itemId={item.id}
          recordingId={resp?.recordingId}
          onRecordingChange={(recId) =>
            void saveTeacherExtras({
              recordingId: recId,
              clearRecording: recId === undefined,
            })
          }
          transcription={(resp?.metadata?.explanation as string) ?? ''}
          onTranscriptionChange={(val) =>
            void saveTeacherExtras({ explanation: val })
          }
          compact
        />
      </div>
    </div>
  );
};
