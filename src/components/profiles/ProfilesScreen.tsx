import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Download,
  FileDown,
  FolderOpen,
  Plus,
  ShieldAlert,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { STORY_HOUSE_TASKS } from '../../content/storyHouse';
import { getStorageStatus, storageService } from '../../db/storageService';
import { generateAssessmentPdf } from '../../services/pdfExport';
import type { AssessmentProfile, BackupData, TaskProgress } from '../../types/domain';
import { ConfirmModal } from '../common/ConfirmModal';

interface ProfilesScreenProps {
  onSelectProfile: (profile: AssessmentProfile) => void;
}

export const ProfilesScreen: React.FC<ProfilesScreenProps> = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState<AssessmentProfile[]>([]);
  const [progressByProfile, setProgressByProfile] = useState<Record<string, TaskProgress[]>>({});
  const [childName, setChildName] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [nearLimit, setNearLimit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AssessmentProfile | null>(null);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfiles = async () => {
    const list = await storageService.listProfiles();
    setProfiles(list);
    const entries = await Promise.all(
      list.map(async (p) => [p.id, await storageService.getTaskProgressForProfile(p.id)] as const),
    );
    setProgressByProfile(Object.fromEntries(entries));
  };

  useEffect(() => {
    void loadProfiles();
    void getStorageStatus().then((st) => setNearLimit(st.nearLimit));
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      setFormError('יש להזין את שם הילד/ה.');
      return;
    }
    setFormError(null);
    const created = await storageService.createProfile({
      childName,
      assessmentDate,
      notes,
    });
    setChildName('');
    setNotes('');
    await loadProfiles();
    onSelectProfile(created);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await storageService.deleteProfile(deleteTarget.id);
    setDeleteTarget(null);
    setStatusBanner({ type: 'success', text: 'פרופיל ההערכה נמחק מהמכשיר.' });
    await loadProfiles();
  };

  const handleExportBackup = async () => {
    try {
      const backup = await storageService.exportBackup();
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `הכפר_של_החברים_גיבוי_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusBanner({
        type: 'success',
        text: `הגיבוי יוצא בהצלחה (${backup.profiles.length} פרופילים, ${backup.audioRecordings.length} הקלטות).`,
      });
    } catch {
      setStatusBanner({ type: 'error', text: 'אירעה שגיאה בעת ייצוא הגיבוי.' });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as BackupData;
      const result = await storageService.importBackup(parsed, 'merge');
      await loadProfiles();
      setStatusBanner({
        type: 'success',
        text: `הגיבוי שוחזר בהצלחה: ${result.profilesCount} פרופילים ו-${result.recordingsCount} הקלטות שמע.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'לא ניתן לקרוא את קובץ הגיבוי.',
      });
    }
  };

  const handleDownloadPdf = async (profile: AssessmentProfile) => {
    setExportingPdfId(profile.id);
    try {
      const [taskProgress, itemResponses, teacherAssessments, audioRecordings] =
        await Promise.all([
          storageService.getTaskProgressForProfile(profile.id),
          storageService.getAllItemResponsesForProfile(profile.id),
          storageService.getAllTeacherAssessmentsForProfile(profile.id),
          storageService.getAudioRecordingsForProfile(profile.id),
        ]);
      await generateAssessmentPdf({
        profile,
        taskProgress,
        itemResponses,
        teacherAssessments,
        audioRecordings,
      });
      setStatusBanner({ type: 'success', text: `דוח PDF עבור ${profile.childName} הורד בהצלחה.` });
    } catch {
      setStatusBanner({ type: 'error', text: 'אירעה שגיאה ביצירת קובץ ה-PDF.' });
    } finally {
      setExportingPdfId(null);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 to-stone-100 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header & Backup Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-amber-900">ניהול פרופילי הערכה</h1>
            <p className="mt-1 text-sm text-stone-600">
              צרי פרופיל הערכה חדש או פתחי הערכה קיימת להמשך עבודה. כל הנתונים נשמרים מקומית במכשיר.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex min-h-11 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-xs hover:bg-stone-50"
            >
              <Download className="h-4 w-4 text-amber-600" />
              ייצוא גיבוי מלא
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-11 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-xs hover:bg-stone-50"
            >
              <Upload className="h-4 w-4 text-emerald-600" />
              ייבוא / שחזור גיבוי
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {nearLimit && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>שטח האחסון המקומי בדפדפן מתמלא. מומלץ לייצא גיבוי ולמחוק הערכות ישנות שאינן נדרשות.</span>
          </div>
        )}

        {statusBanner && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              statusBanner.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {statusBanner.text}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* New Assessment Profile Form */}
          <form
            onSubmit={handleCreateProfile}
            className="rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-md lg:col-span-5"
          >
            <div className="flex items-center gap-2.5 text-amber-900">
              <UserPlus className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-extrabold">הערכה חדשה</h2>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700">
                  שם הילד/ה <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => {
                    setChildName(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="לדוגמה: נועם כהן"
                  className="mt-1.5 min-h-12 w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700">תאריך הערכה</label>
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="mt-1.5 min-h-12 w-full rounded-2xl border border-stone-300 px-4 py-2.5 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700">הערות (רשות)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="רקע קצר, מצב רוח, דגשים למפגש..."
                  className="mt-1.5 w-full rounded-2xl border border-stone-300 p-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {formError && <p className="text-sm font-semibold text-red-600">{formError}</p>}

              <button
                type="submit"
                className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-base font-extrabold text-white shadow-md hover:bg-amber-600"
              >
                <Plus className="h-5 w-5" />
                צרי פרופיל והיכנסי לכפר
              </button>
            </div>
          </form>

          {/* Existing Profiles List */}
          <div className="lg:col-span-7">
            <h2 className="mb-3 text-xl font-extrabold text-stone-800">
              הערכות שמורות ({profiles.length})
            </h2>

            {profiles.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white/70 p-10 text-center text-stone-500">
                עדיין לא נוצרו פרופילי הערכה במכשיר זה. צרו פרופיל חדש כדי להתחיל!
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((profile) => {
                  const progress = progressByProfile[profile.id] ?? [];
                  const completed = progress.filter((t) => t.status === 'הושלם').length;
                  const inProgress = progress.filter((t) => t.status === 'בתהליך').length;
                  const skipped = progress.filter((t) => t.status === 'דולג').length;
                  const total = STORY_HOUSE_TASKS.length;

                  return (
                    <div
                      key={profile.id}
                      className="flex flex-col justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-stone-900">
                            {profile.childName}
                          </h3>
                          <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                            <Calendar className="h-3.5 w-3.5" />
                            {profile.assessmentDate}
                          </span>
                        </div>
                        {profile.notes && (
                          <p className="mt-1 text-xs text-stone-500">{profile.notes}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800">
                            הושלמו: {completed}/{total}
                          </span>
                          {inProgress > 0 && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-800">
                              בתהליך: {inProgress}
                            </span>
                          )}
                          {skipped > 0 && (
                            <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-stone-700">
                              דולגו: {skipped}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProfile(profile)}
                          className="flex min-h-11 items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-amber-600"
                        >
                          <FolderOpen className="h-4 w-4" />
                          פתיחה והמשך
                        </button>
                        <button
                          type="button"
                          disabled={exportingPdfId === profile.id}
                          onClick={() => handleDownloadPdf(profile)}
                          className="flex min-h-11 items-center gap-1.5 rounded-2xl border border-stone-300 bg-white px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-60"
                        >
                          <FileDown className="h-4 w-4 text-sky-600" />
                          {exportingPdfId === profile.id ? 'מפיק PDF...' : 'דוח PDF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(profile)}
                          className="flex min-h-11 items-center justify-center rounded-2xl border border-red-200 bg-white p-2.5 text-red-600 hover:bg-red-50"
                          aria-label={`מחיקת פרופיל ${profile.childName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="מחיקת פרופיל הערכה"
        message={`האם למחוק לצמיתות את ההערכה של ${deleteTarget?.childName ?? ''} מתאריך ${deleteTarget?.assessmentDate ?? ''}, כולל כל התגובות וההקלטות?`}
        confirmLabel="מחק לצמיתות"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
