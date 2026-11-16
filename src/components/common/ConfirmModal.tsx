import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-pop-in">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-base leading-relaxed text-stone-600">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 rounded-2xl border border-stone-300 px-5 py-2.5 text-base font-semibold text-stone-700 hover:bg-stone-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-12 rounded-2xl px-5 py-2.5 text-base font-bold text-white shadow-sm ${
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
