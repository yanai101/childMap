import React, { useEffect, useState } from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';
import { getMathEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import type { TeacherAssessment } from '../../types/domain';
import { BearShopkeeper } from '../art/ShopArt';
import { AudioRecorderWidget } from '../teacher/AudioRecorderWidget';

interface MathActivity1OralCountingProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

interface OralCountingMeta {
  highestNumber?: string;
  highestUninterrupted?: string;
  errors?: string;
  skippedNumbers?: string;
  repeatedNumbers?: string;
  neededAssistance?: boolean;
}

export const MathActivity1OralCounting: React.FC<MathActivity1OralCountingProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const [assessment, setAssessment] = useState<TeacherAssessment>({
    id: `${profileId}:math_oral_counting`,
    profileId,
    taskId: 'math_oral_counting',
    criteriaRatings: {},
    transcription: '',
    notes: '',
    metadata: {},
    updatedAt: Date.now(),
  });

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getTeacherAssessment(
        profileId,
        'math_oral_counting',
      );
      if (!active) return;
      if (existing) {
        setAssessment(existing);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [profileId]);

  const meta = (assessment.metadata ?? {}) as OralCountingMeta;

  const persist = async (next: TeacherAssessment) => {
    setAssessment(next);
    await storageService.upsertTeacherAssessment({
      profileId: next.profileId,
      taskId: next.taskId,
      criteriaRatings: next.criteriaRatings,
      transcription: next.transcription,
      notes: next.notes,
      recordingId: next.recordingId,
      metadata: next.metadata,
    });
  };

  const updateMeta = (patch: Partial<OralCountingMeta>) => {
    void persist({
      ...assessment,
      metadata: {
        ...(assessment.metadata ?? {}),
        ...patch,
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing counting scene */}
      <div className="rounded-[2rem] border-4 border-sky-200 bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="flex flex-col items-center">
          <BearShopkeeper className="h-36 w-36 animate-float-slow" />
          <span className="mt-2 rounded-full bg-sky-100 px-4 py-1 text-sm font-extrabold text-sky-900">
            ספירה בעל פה עם דובי
          </span>
          <h2 className="mt-3 text-2xl font-black text-stone-800 sm:text-3xl">
            עכשיו נספור יחד? אני רוצה לשמוע עד איזה מספר אתה יודע לספור.
          </h2>
          <p className="mt-2 text-lg font-medium text-stone-600">
            אתה יכול לספור בקול עד כמה שאתה יודע!
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              onEncourage(getMathEncouragement());
              onFinishActivity();
            }}
            className="flex min-h-14 items-center gap-2 rounded-2xl bg-sky-600 px-8 py-3 text-lg font-extrabold text-white shadow-md hover:bg-sky-700"
          >
            <Sparkles className="h-5 w-5" />
            סיימתי לספור!
          </button>
        </div>
      </div>

      {/* Visually separated Teacher Recording & Counting Details */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
            תיעוד גננת — ספירה בעל פה (ללא הגבלה ל־10)
          </span>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            קריטריונים וסטטוס משימה
          </button>
        </div>

        <AudioRecorderWidget
          profileId={profileId}
          taskId="math_oral_counting"
          recordingId={assessment.recordingId}
          onRecordingChange={(recordingId) =>
            void persist({ ...assessment, recordingId })
          }
          transcription={assessment.transcription}
          onTranscriptionChange={(transcription) =>
            void persist({ ...assessment, transcription })
          }
          compact
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-stone-700">
              המספר הגבוה ביותר אליו הגיע/ה
            </label>
            <input
              type="number"
              min={0}
              value={meta.highestNumber ?? ''}
              onChange={(e) => updateMeta({ highestNumber: e.target.value })}
              placeholder="לדוגמה: 14, 29, 40..."
              className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">
              המספר הגבוה ביותר ברצף תקין וללא הפרעות
            </label>
            <input
              type="number"
              min={0}
              value={meta.highestUninterrupted ?? ''}
              onChange={(e) => updateMeta({ highestUninterrupted: e.target.value })}
              placeholder="לדוגמה: 12"
              className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">טעויות ברצף</label>
            <input
              type="text"
              value={meta.errors ?? ''}
              onChange={(e) => updateMeta({ errors: e.target.value })}
              placeholder="לדוגמה: אמר 15 אחרי 13..."
              className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">מספרים שדולגו</label>
            <input
              type="text"
              value={meta.skippedNumbers ?? ''}
              onChange={(e) => updateMeta({ skippedNumbers: e.target.value })}
              placeholder="לדוגמה: דילג על 14"
              className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700">
              מספרים שחזרו על עצמם
            </label>
            <input
              type="text"
              value={meta.repeatedNumbers ?? ''}
              onChange={(e) => updateMeta({ repeatedNumbers: e.target.value })}
              placeholder="לדוגמה: חזר על 8 פעמיים"
              className="mt-1 min-h-10 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={Boolean(meta.neededAssistance)}
                onChange={(e) => updateMeta({ neededAssistance: e.target.checked })}
                className="h-4 w-4 accent-sky-600"
              />
              נדרש תיווך או עזרה בהתחלה/המשך
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700">הערות גננת (רשות)</label>
          <textarea
            value={assessment.notes}
            onChange={(e) => void persist({ ...assessment, notes: e.target.value })}
            rows={2}
            placeholder="קצב, ביטחון, נקודות מעבר בעשרות..."
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
