import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileDown,
  Play,
  SkipForward,
} from 'lucide-react';
import { STORY_HOUSE_TASKS, getTaskMetadata } from '../../content/storyHouse';
import { storageService } from '../../db/storageService';
import { generateAssessmentPdf } from '../../services/pdfExport';
import type {
  AssessmentProfile,
  TaskId,
  TaskProgress,
  TaskStatus,
} from '../../types/domain';
import { FoxMascot } from '../art/FoxMascot';
import { EncourageToast } from '../common/EncourageToast';
import { SkipTaskModal } from '../teacher/SkipTaskModal';
import { TeacherDrawer } from '../teacher/TeacherDrawer';
import { Activity1Naming } from './Activity1Naming';
import { Activity2Sequencing } from './Activity2Sequencing';
import { Activity3Listening } from './Activity3Listening';
import { Activity4Verbal } from './Activity4Verbal';
import { Activity5Description } from './Activity5Description';

interface StoryHouseHubProps {
  profile: AssessmentProfile;
  taskProgress: TaskProgress[];
  onProgressUpdated: () => Promise<void>;
  onBackToVillage: () => void;
}

export const StoryHouseHub: React.FC<StoryHouseHubProps> = ({
  profile,
  taskProgress,
  onProgressUpdated,
  onBackToVillage,
}) => {
  const [activeTaskId, setActiveTaskId] = useState<TaskId | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skipTargetTaskId, setSkipTargetTaskId] = useState<TaskId | null>(null);
  const [encourageMsg, setEncourageMsg] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  const showEncouragement = (msg: string) => {
    setEncourageMsg(msg);
  };

  useEffect(() => {
    if (!encourageMsg) return;
    const timer = window.setTimeout(() => setEncourageMsg(null), 2600);
    return () => window.clearTimeout(timer);
  }, [encourageMsg]);

  const getProgressForTask = (taskId: TaskId): TaskProgress | undefined =>
    taskProgress.find((p) => p.taskId === taskId);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'הושלם':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'בתהליך':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'דולג':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  const handleOpenTask = async (taskId: TaskId) => {
    await storageService.markTaskInProgressIfUnstarted(profile.id, taskId);
    await onProgressUpdated();
    setActiveTaskId(taskId);
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const [latestProgress, itemResponses, teacherAssessments, audioRecordings] =
        await Promise.all([
          storageService.getTaskProgressForProfile(profile.id),
          storageService.getAllItemResponsesForProfile(profile.id),
          storageService.getAllTeacherAssessmentsForProfile(profile.id),
          storageService.getAudioRecordingsForProfile(profile.id),
        ]);
      await generateAssessmentPdf({
        profile,
        taskProgress: latestProgress,
        itemResponses,
        teacherAssessments,
        audioRecordings,
      });
    } finally {
      setExportingPdf(false);
    }
  };

  const activeTaskMeta = activeTaskId ? getTaskMetadata(activeTaskId) : null;
  const activeTaskProg = activeTaskId ? getProgressForTask(activeTaskId) : undefined;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-50 pb-12">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-20 border-b border-amber-200 bg-white/95 px-4 py-3 backdrop-blur-xs sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (activeTaskId) {
                  setActiveTaskId(null);
                } else {
                  onBackToVillage();
                }
              }}
              className="flex min-h-11 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
            >
              <ArrowRight className="h-4 w-4" />
              {activeTaskId ? 'חזרה לבית הסיפורים' : 'חזרה לכפר'}
            </button>
            <div>
              <h1 className="text-lg font-black text-amber-900 sm:text-xl">
                {activeTaskMeta ? activeTaskMeta.title : 'בית הסיפורים — שפה וסיפור'}
              </h1>
              <p className="text-xs font-semibold text-stone-500">
                {profile.childName} • {profile.assessmentDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTaskId ? (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex min-h-11 items-center gap-2 rounded-2xl bg-stone-800 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-stone-900"
              >
                <ClipboardCheck className="h-4 w-4" />
                פאנל גננת
              </button>
            ) : (
              <button
                type="button"
                disabled={exportingPdf}
                onClick={handleExportPdf}
                className="flex min-h-11 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-60"
              >
                <FileDown className="h-4 w-4 text-sky-600" />
                {exportingPdf ? 'מפיק PDF...' : 'ייצוא דוח PDF'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        {!activeTaskId ? (
          <>
            {/* Hub Welcome */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-md sm:flex-row">
              <FoxMascot className="h-24 w-24 shrink-0" holdingBook />
              <div>
                <h2 className="text-xl font-black text-stone-800">
                  ברוכים הבאים לבית הסיפורים של אורי השועל!
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  בחרו משימה מהרשימה למטה. ניתן לבצע את המשימות בכל סדר ובכמה מפגשים לפי קצב הילד/ה.
                </p>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {STORY_HOUSE_TASKS.map((task) => {
                const prog = getProgressForTask(task.id);
                const status: TaskStatus = prog?.status ?? 'לא התחיל';

                return (
                  <div
                    key={task.id}
                    className="flex flex-col justify-between rounded-3xl border-2 border-amber-200/80 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-amber-700">
                          {task.activityGroup}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-bold ${getStatusBadge(status)}`}
                        >
                          {status}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-black text-stone-800">{task.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{task.description}</p>

                      {status === 'דולג' && prog?.skipReason && (
                        <p className="mt-2 rounded-xl bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
                          <strong>סיבת דילוג:</strong> {prog.skipReason}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100">
                      <span className="flex items-center gap-1 text-xs font-semibold text-stone-400">
                        <Clock className="h-3.5 w-3.5" />כ-{task.estimatedMinutes} דקות
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSkipTargetTaskId(task.id)}
                          className="flex min-h-10 items-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                          דלג
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleOpenTask(task.id)}
                          className="flex min-h-10 items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-extrabold text-white shadow-xs hover:bg-amber-600"
                        >
                          {status === 'הושלם' ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              צפייה / עריכה
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 fill-white" />
                              {status === 'בתהליך' ? 'המשך' : 'התחל'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {activeTaskId === 'naming' && (
              <Activity1Naming
                profileId={profile.id}
                onEncourage={showEncouragement}
                onOpenTeacherDrawer={() => setDrawerOpen(true)}
                onFinishActivity={() => setDrawerOpen(true)}
              />
            )}

            {(activeTaskId === 'sequencing_a' || activeTaskId === 'sequencing_b') && (
              <Activity2Sequencing
                profileId={profile.id}
                taskId={activeTaskId}
                onEncourage={showEncouragement}
                onOpenTeacherDrawer={() => setDrawerOpen(true)}
                onFinishActivity={() => setDrawerOpen(true)}
              />
            )}

            {activeTaskId === 'listening' && (
              <Activity3Listening
                profileId={profile.id}
                onEncourage={showEncouragement}
                onOpenTeacherDrawer={() => setDrawerOpen(true)}
                onFinishActivity={() => setDrawerOpen(true)}
              />
            )}

            {(activeTaskId === 'verbal_questions' ||
              activeTaskId === 'verbal_riddles' ||
              activeTaskId === 'verbal_vocabulary') && (
              <Activity4Verbal
                profileId={profile.id}
                taskId={activeTaskId}
                onEncourage={showEncouragement}
                onOpenTeacherDrawer={() => setDrawerOpen(true)}
                onFinishActivity={() => setDrawerOpen(true)}
              />
            )}

            {activeTaskId === 'picture_description' && (
              <Activity5Description
                onEncourage={showEncouragement}
                onOpenTeacherDrawer={() => setDrawerOpen(true)}
                onFinishActivity={() => setDrawerOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {activeTaskId && (
        <TeacherDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          profileId={profile.id}
          taskId={activeTaskId}
          currentStatus={activeTaskProg?.status ?? 'בתהליך'}
          skipReason={activeTaskProg?.skipReason}
          onStatusChanged={async () => {
            await onProgressUpdated();
          }}
        />
      )}

      {skipTargetTaskId && (
        <SkipTaskModal
          open={Boolean(skipTargetTaskId)}
          taskTitle={getTaskMetadata(skipTargetTaskId).title}
          initialReason={getProgressForTask(skipTargetTaskId)?.skipReason}
          onConfirm={async (reason) => {
            await storageService.setTaskStatus(profile.id, skipTargetTaskId, 'דולג', reason);
            setSkipTargetTaskId(null);
            await onProgressUpdated();
          }}
          onCancel={() => setSkipTargetTaskId(null)}
        />
      )}

      <EncourageToast message={encourageMsg} />
    </div>
  );
};
