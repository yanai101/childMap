import React, { useState } from 'react';
import { SkipForward, X } from 'lucide-react';

interface SkipTaskModalProps {
  open: boolean;
  taskTitle: string;
  initialReason?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export const SkipTaskModal: React.FC<SkipTaskModalProps> = ({
  open,
  taskTitle,
  initialReason = '',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState(initialReason);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('יש לציין סיבה לדילוג על המשימה.');
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-pop-in"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
              <SkipForward className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800">דילוג על משימה</h3>
              <p className="text-xs text-stone-500">{taskTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-stone-700">
            סיבת הדילוג <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
            rows={3}
            placeholder="לדוגמה: הילד התעייף, ביקש לעבור למשחק אחר, יושלם במפגש הבא..."
            className="mt-1.5 w-full rounded-2xl border border-stone-300 p-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="min-h-11 rounded-2xl bg-stone-800 px-5 py-2 text-sm font-bold text-white hover:bg-stone-900"
          >
            שמור דילוג
          </button>
        </div>
      </form>
    </div>
  );
};
