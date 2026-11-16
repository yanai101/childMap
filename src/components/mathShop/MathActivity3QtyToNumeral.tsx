import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { QTY_TO_NUMERAL_ITEMS } from '../../content/mathShop';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { ItemResponse } from '../../types/domain';
import { ShopObjectGroup } from '../art/ShopArt';

interface MathActivity3QtyToNumeralProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const MathActivity3QtyToNumeral: React.FC<MathActivity3QtyToNumeralProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [stage, setStage] = useState<'A' | 'B'>('A');
  const [itemIndex, setItemIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  const stageItems = QTY_TO_NUMERAL_ITEMS.filter((i) => i.stage === stage);
  const item = stageItems[itemIndex] ?? stageItems[0];
  const resp = responses[item.id];

  useEffect(() => {
    setItemIndex(0);
  }, [stage]);

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(
        profileId,
        'math_qty_to_numeral',
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

  const handleSelectNumeral = async (numeral: number) => {
    const isCorrect = numeral === item.quantity;
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'math_qty_to_numeral',
      itemId: item.id,
      responseText: String(numeral),
      isCorrect,
      notes: resp?.notes ?? '',
      metadata: {
        stage: item.stage,
        expectedQuantity: item.quantity,
      },
    });
    setResponses((prev) => ({ ...prev, [item.id]: saved }));
    onEncourage(getMathEncouragement());
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stage selector (Stage A: 1-5, Stage B: 6-10) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setStage('A')}
          className={`min-h-11 rounded-2xl px-6 py-2 text-sm font-extrabold transition ${
            stage === 'A'
              ? 'bg-sky-600 text-white shadow-md'
              : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
          }`}
        >
          שלב א׳: מספרים 1–5
        </button>
        <button
          type="button"
          onClick={() => setStage('B')}
          className={`min-h-11 rounded-2xl px-6 py-2 text-sm font-extrabold transition ${
            stage === 'B'
              ? 'bg-sky-600 text-white shadow-md'
              : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
          }`}
        >
          שלב ב׳: מספרים 6–10
        </button>
      </div>

      {/* Child-facing matching stage */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            שלב {stage === 'A' ? 'א׳ (1–5)' : 'ב׳ (6–10)'} • {itemIndex + 1} מתוך{' '}
            {stageItems.length}
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-black text-stone-800 sm:text-3xl">
          ספור את החפצים ובחר את המספר המתאים.
        </h2>

        <div className="mt-6 flex min-h-44 items-center justify-center rounded-3xl border-2 border-amber-200 bg-amber-50/40 p-6">
          <ShopObjectGroup
            quantity={item.quantity}
            objectType={item.objectType}
            arrangement="grid"
            itemSizeClass="h-14 w-14 sm:h-16 sm:w-16"
          />
        </div>

        {/* Large touch-friendly numeral cards (neutral selection highlight only) */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {item.choices.map((num) => {
            const isSelected = resp?.responseText === String(num);
            return (
              <button
                key={num}
                type="button"
                onClick={() => void handleSelectNumeral(num)}
                className={`min-h-20 rounded-3xl border-3 text-4xl font-black transition active:scale-95 ${
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
            disabled={itemIndex === 0}
            onClick={() => setItemIndex((i) => Math.max(0, i - 1))}
            className="flex min-h-13 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-base font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
            הקודם
          </button>

          <button
            type="button"
            onClick={() => {
              if (itemIndex < stageItems.length - 1) {
                setItemIndex((i) => i + 1);
              } else if (stage === 'A') {
                setStage('B');
              } else {
                onFinishActivity();
              }
            }}
            className="flex min-h-13 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            {itemIndex < stageItems.length - 1
              ? 'לפריט הבא'
              : stage === 'A'
                ? 'עבור לשלב ב׳ (6–10)'
                : 'סיום המשימה'}
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visually separated Teacher summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-stone-300 bg-stone-100 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 font-bold text-white">
            תיעוד גננת (מוסתר מהילד/ה)
          </span>
          {resp ? (
            <span
              className={`rounded-full px-3 py-1 font-bold ${
                resp.isCorrect
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              נבחר: {resp.responseText} (כמות בפועל: {item.quantity})
            </span>
          ) : (
            <span className="text-stone-500">טרם נבחרה ספרה בפריט זה</span>
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
    </div>
  );
};
