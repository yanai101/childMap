import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Save,
  SkipForward,
  X,
} from 'lucide-react';
import { TASK_CRITERIA } from '../../content/criteria';
import { getTaskMetadata } from '../../content/storyHouse';
import { storageService } from '../../db/storageService';
import type { TaskId, TaskStatus, TeacherAssessment } from '../../types/domain';
import { AudioRecorderWidget } from './AudioRecorderWidget';
import { CriteriaEvaluator } from './CriteriaEvaluator';
import { SkipTaskModal } from './SkipTaskModal';

interface TeacherDrawerProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  taskId: TaskId;
  currentStatus: TaskStatus;
  skipReason?: string;
  onStatusChanged: (status: TaskStatus, skipReason?: string) => void;
  extraContent?: React.ReactNode;
}

export const TeacherDrawer: React.FC<TeacherDrawerProps> = ({
  open,
  onClose,
  profileId,
  taskId,
  currentStatus,
  skipReason,
  onStatusChanged,
  extraContent,
}) => {
  const taskMeta = getTaskMetadata(taskId);
  const criteria = TASK_CRITERIA[taskId] ?? [];

  const [assessment, setAssessment] = useState<TeacherAssessment>({
    id: `${profileId}:${taskId}`,
    profileId,
    taskId,
    criteriaRatings: {},
    transcription: '',
    notes: '',
    updatedAt: Date.now(),
  });
  const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saved'>('idle');
  const [skipModalOpen, setSkipModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getTeacherAssessment(profileId, taskId);
      if (!active) return;
      if (existing) {
        setAssessment(existing);
      } else {
        setAssessment({
          id: `${profileId}:${taskId}`,
          profileId,
          taskId,
          criteriaRatings: {},
          transcription: '',
          notes: '',
          updatedAt: Date.now(),
        });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [profileId, taskId]);

  const persistAssessment = async (next: TeacherAssessment) => {
    setAssessment(next);
    await storageService.upsertTeacherAssessment({
      profileId: next.profileId,
      taskId: next.taskId,
      criteriaRatings: next.criteriaRatings,
      transcription: next.transcription,
      notes: next.notes,
      recordingId: next.recordingId,
    });
    setSaveIndicator('saved');
    window.setTimeout(() => setSaveIndicator('idle'), 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-stone-900/40 backdrop-blur-xs">
      <div
        className="flex h-full w-full max-w-xl flex-col bg-stone-50 shadow-2xl animate-pop-in"
        role="dialog"
        aria-label="פאנל הערכה לגננת"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">פאנל תיעוד והערכה — לגננת</h2>
              <p className="text-xs text-stone-500">{taskMeta.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveIndicator === 'saved' && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <Save className="h-3.5 w-3.5" />
                נשמר אוטומטית
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-stone-500 hover:bg-stone-100"
              aria-label="סגירת פאנל גננת"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-stone-200 bg-white p-3.5">
            <div className="text-sm font-semibold text-stone-700">
              סטטוס משימה:{' '}
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-900">
                {currentStatus}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  await storageService.setTaskStatus(profileId, taskId, 'הושלם');
                  onStatusChanged('הושלם');
                }}
                className="flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                סמן כהושלם
              </button>
              <button
                type="button"
                onClick={() => setSkipModalOpen(true)}
                className="flex min-h-10 items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                <SkipForward className="h-4 w-4" />
                דלג על המשימה
              </button>
            </div>
          </div>

          {currentStatus === 'דולג' && skipReason && (
            <div className="rounded-2xl border border-stone-200 bg-stone-100 p-3 text-xs text-stone-700">
              <strong>סיבת דילוג שמורה:</strong> {skipReason}
            </div>
          )}

          {extraContent}

          {taskMeta.supportsRecording && (
            <AudioRecorderWidget
              profileId={profileId}
              taskId={taskId}
              recordingId={assessment.recordingId}
              onRecordingChange={(recordingId) =>
                void persistAssessment({ ...assessment, recordingId })
              }
              transcription={assessment.transcription}
              onTranscriptionChange={(transcription) =>
                void persistAssessment({ ...assessment, transcription })
              }
            />
          )}

          <div>
            <h3 className="mb-2.5 text-sm font-bold text-stone-800">קריטריונים להערכה</h3>
            <CriteriaEvaluator
              criteria={criteria}
              ratings={assessment.criteriaRatings}
              onChange={(criterionId, levelLabel) =>
                void persistAssessment({
                  ...assessment,
                  criteriaRatings: {
                    ...assessment.criteriaRatings,
                    [criterionId]: levelLabel,
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800">הערות גננת למשימה</label>
            <textarea
              value={assessment.notes}
              onChange={(e) =>
                void persistAssessment({ ...assessment, notes: e.target.value })
              }
              rows={3}
              placeholder="התנהלות הילד/ה, צורך בתיווך, תצפיות חשובות..."
              className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white p-3 text-sm text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-white px-5 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-2xl bg-amber-600 px-6 py-2 text-sm font-bold text-white hover:bg-amber-700"
          >
            סגירה וחזרה למשחק
          </button>
        </div>
      </div>

      <SkipTaskModal
        open={skipModalOpen}
        taskTitle={taskMeta.title}
        initialReason={skipReason}
        onConfirm={async (reason) => {
          await storageService.setTaskStatus(profileId, taskId, 'דולג', reason);
          setSkipModalOpen(false);
          onStatusChanged('דולג', reason);
        }}
        onCancel={() => setSkipModalOpen(false)}
      />
    </div>
  );
};
