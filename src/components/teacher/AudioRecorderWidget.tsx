import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2, RotateCcw, Info } from 'lucide-react';
import { storageService } from '../../db/storageService';
import {
  isAudioRecordingSupported,
  LocalAudioRecorder,
} from '../../services/audioRecorder';
import { localHebrewTranscriptionProvider } from '../../services/transcription';
import type { AudioRecording, TaskId } from '../../types/domain';
import { ConfirmModal } from '../common/ConfirmModal';

interface AudioRecorderWidgetProps {
  profileId: string;
  taskId: TaskId;
  itemId?: string;
  recordingId?: string;
  onRecordingChange: (recordingId: string | undefined) => void;
  transcription: string;
  onTranscriptionChange: (value: string) => void;
  compact?: boolean;
}

export const AudioRecorderWidget: React.FC<AudioRecorderWidgetProps> = ({
  profileId,
  taskId,
  itemId,
  recordingId,
  onRecordingChange,
  transcription,
  onTranscriptionChange,
  compact = false,
}) => {
  const recorderRef = useRef<LocalAudioRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const supported = isAudioRecordingSupported();

  useEffect(() => {
    let active = true;
    let currentUrl: string | null = null;

    async function loadExisting() {
      if (!recordingId) {
        setRecording(null);
        setAudioUrl(null);
        return;
      }
      const rec = await storageService.getAudioRecording(recordingId);
      if (!active) return;
      if (rec) {
        setRecording(rec);
        currentUrl = URL.createObjectURL(rec.blob);
        setAudioUrl(currentUrl);
      } else {
        setRecording(null);
        setAudioUrl(null);
      }
    }

    void loadExisting();

    return () => {
      active = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [recordingId]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
    };
  }, []);

  const handleStart = async () => {
    setErrorMsg(null);
    const recorder = new LocalAudioRecorder();
    recorderRef.current = recorder;
    try {
      await recorder.start();
      setElapsedSec(0);
      setIsRecording(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'שגיאה בהפעלת המיקרופון');
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) return;
    try {
      const result = await recorderRef.current.stop();
      setIsRecording(false);

      if (recordingId) {
        await storageService.deleteAudioRecording(recordingId);
      }

      const saved = await storageService.saveAudioRecording({
        profileId,
        taskId,
        itemId,
        mimeType: result.mimeType,
        blob: result.blob,
        durationMs: result.durationMs,
      });
      onRecordingChange(saved.id);
    } catch (err) {
      setIsRecording(false);
      setErrorMsg(err instanceof Error ? err.message : 'שגיאה בשמירת ההקלטה');
    }
  };

  const handleDelete = async () => {
    setConfirmDeleteOpen(false);
    if (recordingId) {
      await storageService.deleteAudioRecording(recordingId);
    }
    onRecordingChange(undefined);
    setRecording(null);
    setAudioUrl(null);
  };

  const handleReRecord = async () => {
    if (recordingId) {
      await storageService.deleteAudioRecording(recordingId);
      onRecordingChange(undefined);
    }
    await handleStart();
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-stone-700">הקלטת שמע מקומית (נשמרת במכשיר בלבד)</span>
        {recording && !isRecording && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            נשמרה הקלטה ({formatDuration(Math.round(recording.durationMs / 1000))})
          </span>
        )}
      </div>

      {!supported && (
        <p className="mt-2 text-sm text-amber-800">
          הקלטת שמע אינה נתמכת בדפדפן זה. ניתן להקליד תמלול ידני למטה.
        </p>
      )}

      {errorMsg && (
        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {supported && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!isRecording && !recording && (
            <button
              type="button"
              onClick={handleStart}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700"
            >
              <Mic className="h-4 w-4" />
              התחל הקלטה
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={handleStop}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-stone-800"
            >
              <Square className="h-4 w-4 fill-red-500 text-red-500" />
              עצור ושמור ({formatDuration(elapsedSec)})
            </button>
          )}

          {!isRecording && recording && audioUrl && (
            <div className="flex w-full flex-col gap-2">
              <audio controls src={audioUrl} className="w-full h-10" />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleReRecord}
                  className="flex min-h-10 items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  הקלטה מחדש
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="flex min-h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  מחק הקלטה
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modular offline transcription status & manual input */}
      <div className="mt-4">
        <div className="mb-2 flex items-start gap-2 rounded-xl bg-amber-50/80 p-2.5 text-xs text-amber-900 border border-amber-200/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>{localHebrewTranscriptionProvider.statusMessageHe}</span>
        </div>

        <label className="block text-sm font-semibold text-stone-700">
          תמלול ידני של דברי הילד/ה
        </label>
        <textarea
          value={transcription}
          onChange={(e) => onTranscriptionChange(e.target.value)}
          rows={compact ? 2 : 3}
          placeholder="הקלידי כאן את דברי הילד/ה כפי שנאמרו..."
          className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
      </div>

      <ConfirmModal
        open={confirmDeleteOpen}
        title="מחיקת הקלטה"
        message="האם למחוק את ההקלטה הקולית מהמכשיר? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק הקלטה"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
};
