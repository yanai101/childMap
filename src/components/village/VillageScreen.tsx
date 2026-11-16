import React from 'react';
import { ArrowRight, Lock, Sparkles, UserCheck } from 'lucide-react';
import { VILLAGE_BUILDINGS, type VillageBuilding } from '../../content/village';
import type { AssessmentProfile, TaskProgress } from '../../types/domain';
import { BuildingArt } from '../art/BuildingArt';
import { FoxMascot } from '../art/FoxMascot';

interface VillageScreenProps {
  profile: AssessmentProfile;
  taskProgress: TaskProgress[];
  onEnterStoryHouse: () => void;
  onBackToProfiles: () => void;
}

export const VillageScreen: React.FC<VillageScreenProps> = ({
  profile,
  taskProgress,
  onEnterStoryHouse,
  onBackToProfiles,
}) => {
  const completedCount = taskProgress.filter((t) => t.status === 'הושלם').length;
  const totalCount = taskProgress.length || 8;

  const handleSelectBuilding = (building: VillageBuilding) => {
    if (building.available && building.id === 'story-house') {
      onEnterStoryHouse();
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 pb-12">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-amber-200/80 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToProfiles}
              className="flex min-h-11 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
            >
              <ArrowRight className="h-4 w-4" />
              החלפת פרופיל
            </button>
            <div>
              <h1 className="text-xl font-black text-amber-900 sm:text-2xl">הכפר של החברים</h1>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{profile.childName}</span>
                <span>•</span>
                <span>{profile.assessmentDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>
              בית הסיפורים: {completedCount} מתוך {totalCount} משימות הושלמו
            </span>
          </div>
        </div>
      </header>

      {/* Welcome banner in village */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-amber-200 bg-white/85 p-5 shadow-md sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <FoxMascot className="h-20 w-20 shrink-0" holdingBook />
            <div>
              <h2 className="text-xl font-extrabold text-stone-800">
                שלום {profile.childName}! לאן נטייל היום בכפר?
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                אורי השועל מחכה לך בבית הסיפורים. לחץ על הבית הצבעוני כדי להתחיל!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEnterStoryHouse}
            className="min-h-13 shrink-0 rounded-2xl bg-amber-500 px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-amber-600"
          >
            כניסה לבית הסיפורים
          </button>
        </div>

        {/* 9 Village Buildings Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VILLAGE_BUILDINGS.map((building) => {
            const isAvailable = building.available;
            return (
              <button
                key={building.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => handleSelectBuilding(building)}
                className={`group relative flex flex-col items-center rounded-3xl border-3 p-5 text-center transition ${
                  isAvailable
                    ? 'cursor-pointer border-amber-400 bg-white shadow-xl hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99]'
                    : 'cursor-not-allowed border-stone-200 bg-white/70 opacity-85'
                }`}
              >
                {/* Status badge */}
                <span
                  className={`absolute top-4 left-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                    isAvailable
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {!isAvailable && <Lock className="h-3 w-3" />}
                  {isAvailable ? 'פתוח למשחק!' : 'בקרוב'}
                </span>

                <div className="mt-3 w-full">
                  <BuildingArt building={building} className="mx-auto h-36 w-48" />
                </div>

                <h3 className="mt-2 text-xl font-black text-stone-800">{building.name}</h3>
                <span className="mt-0.5 text-xs font-bold text-amber-700">{building.domain}</span>
                <p className="mt-2 text-xs leading-relaxed text-stone-600">
                  {building.description}
                </p>

                {isAvailable && (
                  <span className="mt-4 inline-flex items-center gap-1 rounded-2xl bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-900 group-hover:bg-amber-200">
                    בוא נשחק עם {building.characterName}!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
