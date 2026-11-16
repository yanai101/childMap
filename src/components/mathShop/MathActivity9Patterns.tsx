import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, HelpCircle, RotateCcw } from 'lucide-react';
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

const TOKEN_LABELS_HE: Record<PatternToken, string> = {
  red_apple: 'תפוח',
  blue_berry: 'אוכמנייה',
  yellow_star: 'כוכב',
  green_pear: 'אגס',
};

export const MathActivity9Patterns: React.FC<MathActivity9PatternsProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});
  const [activeSlot, setActiveSlot] = useState(0);
  const [dragState, setDragState] = useState<{
    token: PatternToken;
    x: number;
    y: number;
  } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const item = PATTERN_ITEMS[index];
  const resp = responses[item.id];
  const savedSlots = resp?.metadata?.selectedContinuation as (PatternToken | null)[] | undefined;
  const filledSlots: (PatternToken | null)[] =
    savedSlots && savedSlots.length === item.expectedContinuation.length
      ? savedSlots
      : Array(item.expectedContinuation.length).fill(null);

  useEffect(() => {
    const firstEmpty = filledSlots.findIndex((s) => s === null);
    setActiveSlot(firstEmpty >= 0 ? firstEmpty : 0);
  }, [index, item.id]);

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

  const persistSlots = async (nextSlots: (PatternToken | null)[]) => {
    const allFilled = nextSlots.every((t) => t !== null);
    const isCorrect = allFilled
      ? nextSlots.every((t, i) => t === item.expectedContinuation[i])
      : undefined;
    const summaryText = nextSlots
      .map((t) => (t ? TOKEN_LABELS_HE[t] : '—'))
      .join(' , ');

    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_patterns',
      itemId: item.id,
      responseText: nextSlots.some((t) => t !== null) ? summaryText : '',
      isCorrect,
      notes: resp?.notes ?? '',
      recordingId: resp?.recordingId,
      metadata: {
        patternType: item.patternType,
        expectedContinuation: item.expectedContinuation,
        selectedContinuation: nextSlots,
        explanation: (resp?.metadata?.explanation as string) ?? '',
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
    if (allFilled) {
      onEncourage(getMathEncouragement());
    }
  };

  const placeTokenInSlot = (token: PatternToken, slotIdx: number) => {
    if (slotIdx < 0 || slotIdx >= filledSlots.length) return;
    const nextSlots = [...filledSlots];
    nextSlots[slotIdx] = token;
    const nextEmpty = nextSlots.findIndex((s, i) => i > slotIdx && s === null);
    const anyEmpty = nextEmpty >= 0 ? nextEmpty : nextSlots.findIndex((s) => s === null);
    setActiveSlot(anyEmpty >= 0 ? anyEmpty : Math.min(slotIdx + 1, nextSlots.length - 1));
    void persistSlots(nextSlots);
  };

  const handleSelectToken = (token: PatternToken) => {
    const targetIdx =
      activeSlot < filledSlots.length ? activeSlot : filledSlots.findIndex((s) => s === null);
    if (targetIdx < 0) return;
    placeTokenInSlot(token, targetIdx);
  };

  const findSlotUnderPointer = (x: number, y: number): number | null => {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      const attr = el.getAttribute('data-pattern-slot');
      if (attr !== null) {
        const parsed = Number(attr);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return null;
  };

  const handleChoicePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    token: PatternToken,
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    let isDragging = false;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!isDragging && Math.hypot(dx, dy) > 6) {
        isDragging = true;
      }
      if (isDragging) {
        setDragState({ token, x: moveEvent.clientX, y: moveEvent.clientY });
        setHoveredSlot(findSlotUnderPointer(moveEvent.clientX, moveEvent.clientY));
      }
    };

    const onUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);

      if (isDragging) {
        const dropSlot = findSlotUnderPointer(upEvent.clientX, upEvent.clientY);
        if (dropSlot !== null) {
          placeTokenInSlot(token, dropSlot);
        }
        setDragState(null);
        setHoveredSlot(null);
      } else {
        handleSelectToken(token);
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (filledSlots[slotIdx] !== null) {
      const nextSlots = [...filledSlots];
      nextSlots[slotIdx] = null;
      setActiveSlot(slotIdx);
      void persistSlots(nextSlots);
    } else {
      setActiveSlot(slotIdx);
    }
  };

  const handleClearAll = () => {
    const empty = Array(item.expectedContinuation.length).fill(null);
    setActiveSlot(0);
    void persistSlots(empty);
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
        expectedContinuation: item.expectedContinuation,
        selectedContinuation: filledSlots,
        explanation: patch.explanation ?? (resp?.metadata?.explanation as string) ?? '',
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {dragState && (
        <div
          style={{ left: dragState.x - 32, top: dragState.y - 32 }}
          className="pointer-events-none fixed z-50 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-sky-500 bg-white/95 shadow-2xl"
        >
          <PatternTokenIcon token={dragState.token} className="h-12 w-12" />
        </div>
      )}

      {/* Child-facing pattern stage */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            דגם {item.patternType} • {index + 1} מתוך {PATTERN_ITEMS.length}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              נקה מילוי
            </button>
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
        </div>

        <h2 className="mt-4 text-center text-2xl font-black text-stone-800 sm:text-3xl">
          הסתכל על ההתחלה של הדגם והשלם את ההמשך!
        </h2>
        <p className="mt-1 text-center text-xs font-semibold text-stone-500">
          אפשר לגרור את הפריטים אל המשבצות הריקות או ללחוץ עליהם.
        </p>

        {/* Pattern strip: given initial stage + fillable continuation slots */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 rounded-3xl border-2 border-amber-200 bg-amber-50/50 p-5">
          {item.givenPrefix.map((token, idx) => (
            <div
              key={`prefix-${idx}`}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-amber-300 bg-amber-100/60 shadow-xs sm:h-18 sm:w-18"
            >
              <PatternTokenIcon token={token} className="h-11 w-11 sm:h-12 sm:w-12" />
            </div>
          ))}

          {filledSlots.map((token, slotIdx) => {
            const isActive = slotIdx === activeSlot;
            const isHovered = slotIdx === hoveredSlot;
            return (
              <button
                key={`slot-${slotIdx}`}
                type="button"
                data-pattern-slot={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border-3 border-dashed transition sm:h-18 sm:w-18 ${
                  isHovered
                    ? 'scale-105 border-emerald-500 bg-emerald-50 ring-3 ring-emerald-200'
                    : isActive
                      ? 'border-sky-600 bg-sky-50 ring-3 ring-sky-200'
                      : token
                        ? 'border-sky-400 bg-white shadow-xs'
                        : 'border-sky-300 bg-white/80'
                }`}
              >
                {token ? (
                  <PatternTokenIcon token={token} className="h-11 w-11 sm:h-12 sm:w-12" />
                ) : (
                  <HelpCircle className="h-7 w-7 text-sky-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Choices (draggable + clickable) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {item.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onPointerDown={(e) => handleChoicePointerDown(e, choice)}
              className="flex h-24 w-28 cursor-grab touch-none select-none items-center justify-center rounded-3xl border-3 border-stone-200 bg-stone-50 transition hover:border-sky-400 hover:bg-sky-50 active:scale-95 active:cursor-grabbing"
            >
              <PatternTokenIcon token={choice} className="pointer-events-none h-14 w-14" />
            </button>
          ))}
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
