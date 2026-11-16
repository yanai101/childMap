import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  Info,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { ITEM_PERFORMANCE_LEVELS, NOT_ASSESSED_LABEL } from '../../content/criteria';
import { LISTENING_STORY } from '../../content/storyHouse';
import { getRandomEncouragement } from '../../content/village';
import { storageService } from '../../db/storageService';
import { PlaceholderStoryPlayer } from '../../services/placeholderAudio';
import type { ItemResponse } from '../../types/domain';
import { FoxMascot } from '../art/FoxMascot';

interface Activity3ListeningProps {
  profileId: string;
  onEncourage: (msg: string) => void;
  onOpenTeacherDrawer: () => void;
  onFinishActivity: () => void;
}

export const Activity3Listening: React.FC<Activity3ListeningProps> = ({
  profileId,
  onEncourage,
  onOpenTeacherDrawer,
  onFinishActivity,
}) => {
  const playerRef = useRef<PlaceholderStoryPlayer | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [responses, setResponses] = useState<Record<string, ItemResponse>>({});

  useEffect(() => {
    let active = true;
    async function load() {
      const existing = await storageService.getItemResponsesForTask(profileId, 'listening');
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
    if (!LISTENING_STORY.audioUrl) {
      playerRef.current = new PlaceholderStoryPlayer((st) => {
        setIsPlaying(st.isPlaying);
        setProgress(st.progress);
      });
    }
    return () => {
      playerRef.current?.dispose();
    };
  }, []);

  const handlePlay = () => {
    if (LISTENING_STORY.audioUrl && audioElRef.current) {
      void audioElRef.current.play();
      setIsPlaying(true);
    } else {
      playerRef.current?.play();
    }
  };

  const handlePause = () => {
    if (LISTENING_STORY.audioUrl && audioElRef.current) {
      audioElRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current?.pause();
    }
  };

  const handleReplay = () => {
    if (LISTENING_STORY.audioUrl && audioElRef.current) {
      audioElRef.current.currentTime = 0;
      void audioElRef.current.play();
      setIsPlaying(true);
    } else {
      playerRef.current?.replay();
    }
  };

  const saveQuestion = async (
    questionId: string,
    patch: { responseText?: string; performanceLevel?: string; notes?: string },
  ) => {
    const existing = responses[questionId];
    const saved = await storageService.upsertItemResponse({
      profileId,
      taskId: 'listening',
      itemId: questionId,
      responseText: patch.responseText ?? existing?.responseText ?? '',
      performanceLevel:
        patch.performanceLevel ?? existing?.performanceLevel ?? NOT_ASSESSED_LABEL,
      notes: patch.notes ?? existing?.notes ?? '',
    });
    setResponses((prev) => ({ ...prev, [questionId]: saved }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Child-facing Story Player */}
      <div className="rounded-[2rem] border-4 border-amber-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-right sm:gap-6">
          <FoxMascot className="h-28 w-28 shrink-0" holdingBook />
          <div className="flex-1">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-800">
              שעת סיפור בכפר
            </span>
            <h2 className="mt-2 text-2xl font-black text-stone-800">{LISTENING_STORY.title}</h2>
            <p className="mt-1 text-sm text-stone-600">
              בוא נקשיב יחד לסיפור, ואחר כך נדבר על מה שקרה!
            </p>
          </div>
        </div>

        {LISTENING_STORY.audioUrl && (
          <audio
            ref={audioElRef}
            src={LISTENING_STORY.audioUrl}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration) {
                setProgress(Math.round((el.currentTime / el.duration) * 100));
              }
            }}
          />
        )}

        {/* Audio controls */}
        <div className="mt-6 rounded-3xl bg-amber-50 p-5 border border-amber-200">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlay}
                className="flex min-h-13 items-center gap-2 rounded-2xl bg-amber-500 px-7 py-3 text-lg font-extrabold text-white shadow-md hover:bg-amber-600"
              >
                <Play className="h-5 w-5 fill-white" />
                השמע סיפור
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="flex min-h-13 items-center gap-2 rounded-2xl bg-stone-800 px-7 py-3 text-lg font-extrabold text-white shadow-md hover:bg-stone-900"
              >
                <Pause className="h-5 w-5" />
                השהה
              </button>
            )}

            <button
              type="button"
              onClick={handleReplay}
              className="flex min-h-13 items-center gap-2 rounded-2xl border border-amber-300 bg-white px-5 py-3 text-base font-bold text-amber-900 hover:bg-amber-100"
            >
              <RotateCcw className="h-5 w-5" />
              הפעל מההתחלה
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-amber-700" />
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-amber-800">{progress}%</span>
          </div>

          {LISTENING_STORY.isPlaceholderAudio && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white/80 p-3 text-xs text-stone-600 border border-amber-200/70">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <span>{LISTENING_STORY.placeholderNotice}</span>
                <button
                  type="button"
                  onClick={() => setShowScript((v) => !v)}
                  className="mr-2 inline-flex items-center gap-1 font-bold text-amber-800 underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {showScript ? 'הסתר טקסט להקראה' : 'הצג טקסט להקראה לגננת'}
                </button>
              </div>
            </div>
          )}

          {showScript && (
            <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed text-stone-800">
              {LISTENING_STORY.storyScriptForTeacher}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Questions & Responses Section */}
      <div className="rounded-3xl border-2 border-stone-300 bg-stone-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-bold text-white">
              תיעוד גננת — שאלות הבנה
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenTeacherDrawer}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
          >
            <ClipboardList className="h-4 w-4" />
            הערכת קריטריונים וסטטוס
          </button>
        </div>

        <div className="space-y-4">
          {LISTENING_STORY.questions.map((q, idx) => {
            const resp = responses[q.id];
            const selectedLevel = resp?.performanceLevel ?? NOT_ASSESSED_LABEL;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-stone-800">
                    {idx + 1}. {q.question}
                  </h3>
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
                    {q.aspect}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  רכיבים צפויים בתשובה: {q.expectedElements}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ITEM_PERFORMANCE_LEVELS.listening.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => void saveQuestion(q.id, { performanceLevel: level })}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        selectedLevel === level
                          ? 'border-amber-600 bg-amber-500 text-white'
                          : 'border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={resp?.responseText ?? ''}
                    onChange={(e) => void saveQuestion(q.id, { responseText: e.target.value })}
                    placeholder="תשובת הילד/ה כפי שנאמרה..."
                    className="min-h-10 rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={resp?.notes ?? ''}
                    onChange={(e) => void saveQuestion(q.id, { notes: e.target.value })}
                    placeholder="הערה אופציונלית לשאלה..."
                    className="min-h-10 rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              onEncourage(getRandomEncouragement());
              onFinishActivity();
            }}
            className="min-h-12 rounded-2xl bg-amber-500 px-8 py-3 text-base font-extrabold text-white shadow-md hover:bg-amber-600"
          >
            סיום משימת הבנת הנשמע
          </button>
        </div>
      </div>
    </div>
  );
};
