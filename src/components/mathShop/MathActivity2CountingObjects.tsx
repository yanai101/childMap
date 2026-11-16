import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, RotateCcw } from 'lucide-react';
import { COUNTING_OBJECTS_ITEMS } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { ShopObjectGroup } from '../art/ShopArt';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity2CountingObjectsProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

interface CountingItemMeta {
  oneToOne?: string;
  countingSequence?: string;
  cardinality?: string;
  independence?: string;
  assistance?: string;
}

const EVAL_OPTIONS = ['תקין / שולט', 'חלקי / בתיווך', 'קושי', 'לא נבדק'];

export const MathActivity2CountingObjects: React.FC<MathActivity2CountingObjectsProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [index, setIndex] = useState(0);
  const [tapped, setTapped] = useState<number[]>([]);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const item = COUNTING_OBJECTS_ITEMS[index];
  const resp = responses[item.id];
  const meta = (resp?.metadata ?? {}) as CountingItemMeta;

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_counting_objects',
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

  useEffect(() => {
    setTapped([]);
  }, [index]);

  const saveItem = async (patch: {
    responseText?: string;
    isCorrect?: boolean;
    notes?: string;
    recordingId?: string;
    clearRecording?: boolean;
    metaPatch?: Partial<CountingItemMeta>;
  }) => {
    const existing = responses[item.id];
    const nextText = patch.responseText ?? existing?.responseText ?? '';
    const trimmed = nextText.trim();
    const inferredCorrect =
      patch.isCorrect !== undefined
        ? patch.isCorrect
        : trimmed !== ''
          ? Number(trimmed) === item.quantity
          : existing?.isCorrect;

    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_counting_objects',
      itemId: item.id,
      responseText: nextText,
      isCorrect: inferredCorrect,
      notes: patch.notes ?? existing?.notes ?? '',
      recordingId: patch.clearRecording
        ? undefined
        : patch.recordingId ?? existing?.recordingId,
      metadata: {
        quantity: item.quantity,
        ...(existing?.metadata ?? {}),
        ...(patch.metaPatch ?? {}),
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
  };

  const toggleTap = (objIdx: number) => {
    setTapped((prev) =>
      prev.includes(objIdx) ? prev.filter((i) => i !== objIdx) : [...prev, objIdx],
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing counting card */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            מנייה {index + 1} מתוך {COUNTING_OBJECTS_ITEMS.length}
          </span>
          <button
            type="button"
            onClick={() => setTapped([])}
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            נקה סימון נגיעות
          </button>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black text-stone-800 sm:text-3xl">
          כמה חפצים יש כאן? בוא נספור.
        </h2>
        <p className="mt-1 text-center text-sm text-stone-500">
          אפשר לגעת בחפצים תוך כדי שסופרים, או פשוט לספור בקול!
        </p>

        <div className="mt-6 flex min-h-56 items-center justify-center rounded-3xl border-2 border-amber-200 bg-amber-50/40 p-6">
          <ShopObjectGroup
            quantity={item.quantity}
            objectType={item.objectType}
            arrangement="scattered"
            interactiveHighlight
            tappedIndices={tapped}
            onTapObject={toggleTap}
            itemSizeClass="h-16 w-16 sm:h-20 sm:w-20"
          />
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
              if (index < COUNTING_OBJECTS_ITEMS.length - 1) {
                setIndex((i) => i + 1);
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {index < COUNTING_OBJECTS_ITEMS.length - 1 ? 'לקבוצה הבאה' : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visually separated Teacher item evaluation */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
              תיעוד גננת — {item.labelHe}
            </span>
            {resp?.isCorrect !== undefined && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  resp.isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {resp.isCorrect ? 'סך כולל מדויק' : 'סך כולל שונה מהכמות'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            הערכה כללית וסטטוס
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-stone-700">
              תשובת הילד/ה (הכמות שנאמרה)
            </label>
            <input
              type="text"
              value={resp?.responseText ?? ''}
              onChange={(e) => void saveItem({ responseText: e.target.value })}
              placeholder={`לדוגמה: ${item.quantity}`}
              className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">סיווג סך כולל</label>
            <div className="mt-1 flex gap-2">
              {[
                { label: 'נכון', val: true },
                { label: 'לא נכון', val: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => void saveItem({ isCorrect: opt.val })}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ['oneToOne', 'התאמה חד-חד ערכית'],
              ['countingSequence', 'רצף מנייה מדויק'],
              ['cardinality', 'הבנת קרדינליות (המספר האחרון = הכמות)'],
              ['independence', 'עצמאות'],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="rounded-2xl border border-stone-200 bg-white p-3">
              <div className="text-xs font-bold text-stone-700">{label}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {EVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => void saveItem({ metaPatch: { [field]: opt } })}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                      (meta[field] ?? 'לא נבדק') === opt
                        ? 'border-sky-600 bg-sky-500 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId="math_counting_objects"
          itemId={item.id}
          recordingId={resp?.recordingId}
          onRecordingChange={(recId) =>
            void saveItem({
              recordingId: recId,
              clearRecording: recId === undefined,
            })
          }
          transcription={meta.assistance ?? ''}
          onTranscriptionChange={(val) => void saveItem({ metaPatch: { assistance: val } })}
          compact
        />
      </div>
    </div>
  );
};
