import React, { useEffect, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, ArrowRight, ClipboardList, GripHorizontal, Sparkles } from 'lucide-react';
import { STORY_SEQUENCES, type SequenceCard } from '../../content/storyHouse';
import { getRandomEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import { evaluateSequenceOrder } from '../../services/sequencingLogic';
import { SequenceCardArt } from '../art/SequenceCardArt';

interface SortableCardProps {
  card: SequenceCard;
  positionIndex: number;
  total: number;
  onMovePrev: () => void;
  onMoveNext: () => void;
}

const SortableStoryCard: React.FC<SortableCardProps> = ({
  card,
  positionIndex,
  total,
  onMovePrev,
  onMoveNext,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-drag-card flex flex-col items-center rounded-3xl border-3 bg-white p-3 shadow-md transition ${
        isDragging ? 'scale-105 border-amber-500 shadow-2xl' : 'border-amber-200'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex w-full cursor-grab items-center justify-between rounded-2xl bg-amber-50 px-3 py-2 text-amber-800 active:cursor-grabbing"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-sm font-black text-white">
          {positionIndex + 1}
        </span>
        <GripHorizontal className="h-5 w-5 text-amber-500" />
      </div>

      <div
        {...attributes}
        {...listeners}
        className="mt-2 w-full cursor-grab active:cursor-grabbing"
      >
        <SequenceCardArt illustrationKey={card.illustrationKey} className="h-40 w-full sm:h-44" />
      </div>

      {/* Accessible touch arrow buttons for easy single-tap reordering */}
      <div className="mt-2 flex w-full items-center justify-between gap-2">
        <button
          type="button"
          disabled={positionIndex === 0}
          onClick={onMovePrev}
          aria-label="הזז ימינה (קודם)"
          className="flex min-h-10 flex-1 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-amber-50 disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={positionIndex === total - 1}
          onClick={onMoveNext}
          aria-label="הזז שמאלה (הבא)"
          className="flex min-h-10 flex-1 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-amber-50 disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface Activity2SequencingProps {
  profileId: string;
  taskId: 'sequencing_a' | 'sequencing_b';
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const Activity2Sequencing: React.FC<Activity2SequencingProps> = ({
  profileId,
  taskId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const config = STORY_SEQUENCES[taskId];
  const [order, setOrder] = useState<string[]>(config.initialShuffledOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(profileId, taskId);
      if (!active) return;
      const seq = existing.find((r) => r.itemId === 'sequence');
      if (seq?.selectedOrder && seq.selectedOrder.length === config.cards.length) {
        setOrder(seq.selectedOrder);
      } else {
        setOrder(config.initialShuffledOrder);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [profileId, taskId, config.cards.length, config.initialShuffledOrder]);

  const persistOrder = async (nextOrder: string[]) => {
    setOrder(nextOrder);
    const isOrderCorrect = evaluateSequenceOrder(nextOrder, config.expectedOrder);
    await storageService.upsertItemResponse({
      profileId,
      taskId,
      itemId: 'sequence',
      responseText: nextOrder.join(','),
      selectedOrder: nextOrder,
      isOrderCorrect,
      notes: '',
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex !== -1 && newIndex !== -1) {
      const next = arrayMove(order, oldIndex, newIndex);
      void persistOrder(next);
    }
  };

  const moveByIndex = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = arrayMove(order, from, to);
    void persistOrder(next);
  };

  const isMatchedForTeacher = evaluateSequenceOrder(order, config.expectedOrder);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-[2rem] border-4 border-amber-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-extrabold text-amber-900">
            {config.title}
          </span>
          <h2 className="mt-3 text-xl font-extrabold text-stone-800 sm:text-2xl">
            {config.childInstruction}
          </h2>
        </div>

        <div className="mt-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={order} strategy={horizontalListSortingStrategy}>
              <div
                className={`grid gap-4 ${
                  config.cards.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {order.map((cardId, idx) => {
                  const card = config.cards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <SortableStoryCard
                      key={card.id}
                      card={card}
                      positionIndex={idx}
                      total={order.length}
                      onMovePrev={() => moveByIndex(idx, idx - 1)}
                      onMoveNext={() => moveByIndex(idx, idx + 1)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              void persistOrder(order);
              onEncourage(getRandomEncouragement());
              onFinishActivity();
            }}
            className="flex min-h-14 items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-amber-600"
          >
            <Sparkles className="h-5 w-5" />
            סיימתי לספר את הסיפור!
          </button>
        </div>
      </div>

      {/* Visually separated Teacher summary & drawer trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-stone-300 bg-stone-100 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
            תיעוד גננת (מוסתר מהילד/ה)
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isMatchedForTeacher
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isMatchedForTeacher ? 'הסדר הנוכחי תואם לרצף הצפוי' : 'הסדר הנוכחי שונה מהרצף הצפוי'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenTeacherDrawer}
          className="flex min-h-11 items-center gap-2 rounded-xl bg-stone-800 px-4 py-2 text-xs font-bold text-white hover:bg-stone-900"
        >
          <ClipboardList className="h-4 w-4" />
          הקלטה, תמלול והערכת 6 קריטריונים
        </button>
      </div>
    </div>
  );
};
