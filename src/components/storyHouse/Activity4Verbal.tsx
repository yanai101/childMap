import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { ITEM_PERFORMANCE_LEVELS, NOT_ASSESSED_LABEL } from '../../content/criteria';
import {
  VERBAL_QUESTIONS,
  VERBAL_RIDDLES,
  VERBAL_VOCABULARY,
  type VerbalQuestionItem,
} from '../../content/storyHouse';
import { getRandomEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { FoxMascot } from '../art/FoxMascot';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

export type VerbalTaskId = 'verbal_questions' | 'verbal_riddles' | 'verbal_vocabulary';

interface Activity4VerbalProps {
  profileId: string;
  taskId: VerbalTaskId;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

const SUB_CONFIG: Record<
  VerbalTaskId,
  {
    badge: string;
    instructionForChild: (prompt: string) => string;
    items: VerbalQuestionItem[];
  }
> = {
  verbal_questions: {
    badge: 'שאלות הבנה',
    instructionForChild: (prompt) => prompt,
    items: VERBAL_QUESTIONS,
  },
  verbal_riddles: {
    badge: 'חידות הכפר',
    instructionForChild: (prompt) => prompt,
    items: VERBAL_RIDDLES,
  },
  verbal_vocabulary: {
    badge: 'אוצר מילים',
    instructionForChild: (prompt) => `ספר לי כל מה שאתה יודע על המילה: "${prompt}"`,
    items: VERBAL_VOCABULARY,
  },
};

export const Activity4Verbal: React.FC<Activity4VerbalProps> = ({
  profileId,
  taskId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const config = SUB_CONFIG[taskId];
  const levels = ITEM_PERFORMANCE_LEVELS[taskId];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  useEffect(() => {
    setCurrentIndex(0);
  }, [taskId]);

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(profileId, taskId);
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
  }, [profileId, taskId]);

  const item = config.items[currentIndex];
  const currentResp = responses[item.id];

  const saveItemUpdate = async (patch: {
    responseText?: string;
    performanceLevel?: string;
    notes?: string;
    recordingId?: string;
    clearRecording?: boolean;
  }) => {
    const existing = responses[item.id];
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId,
      itemId: item.id,
      responseText: patch.responseText ?? existing?.responseText ?? '',
      performanceLevel:
        patch.performanceLevel ?? existing?.performanceLevel ?? NOT_ASSESSED_LABEL,
      notes: patch.notes ?? existing?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? existing?.recordingId,
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  const handleNext = () => {
    onEncourage(getRandomEncouragement());
    if (currentIndex < config.items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onFinishActivity();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing card */}
      <div className="rounded-[2rem] border-4 border-amber-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-extrabold text-amber-900">
            {config.badge} • {currentIndex + 1} מתוך {config.items.length}
          </span>
          <div className="flex gap-1.5">
            {config.items.map((it, idx) => {
              const hasData = Boolean(
                responses[it.id]?.performanceLevel &&
                  responses[it.id]?.performanceLevel !== NOT_ASSESSED_LABEL,
              );
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`פריט ${idx + 1}`}
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

        <div className="mt-6 flex flex-col items-center text-center">
          <FoxMascot className="h-28 w-28" holdingBook={false} />
          <div className="mt-4 max-w-xl rounded-3xl border-2 border-amber-200 bg-amber-50/70 px-6 py-5">
            <p className="text-2xl font-black leading-relaxed text-stone-800 sm:text-3xl">
              {config.instructionForChild(item.prompt)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
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
            {currentIndex < config.items.length - 1 ? 'לשאלה הבאה' : 'סיום'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Teacher item recording, transcription & evaluation */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
              תיעוד גננת
            </span>
            <span className="text-xs text-stone-600">
              כיוון צפוי: {item.expectedConcept}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים מסכמים למשימה
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {levels.map((level) => {
            const selected = (currentResp?.performanceLevel ?? NOT_ASSESSED_LABEL) === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => void saveItemUpdate({ performanceLevel: level })}
                className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                  selected
                    ? 'border-amber-600 bg-amber-500 text-white'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId={taskId}
          itemId={item.id}
          recordingId={currentResp?.recordingId}
          onRecordingChange={(recId) =>
            void saveItemUpdate({
              recordingId: recId,
              clearRecording: recId === undefined,
            })
          }
          transcription={currentResp?.responseText ?? ''}
          onTranscriptionChange={(text) => void saveItemUpdate({ responseText: text })}
          compact
        />

        <div>
          <label className="block text-xs font-bold text-stone-700">הערת גננת לפריט (רשות)</label>
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
  );
};
