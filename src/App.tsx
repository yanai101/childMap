import { useCallback, useEffect, useState } from 'react';
import { ProfilesScreen } from './components/profiles/ProfilesScreen';
import { StoryHouseHub } from './components/storyHouse/StoryHouseHub';
import { VillageScreen } from './components/village/VillageScreen';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { requestPersistentStorage, storageService } from './db/storageService';
import type { AssessmentProfile, TaskProgress } from './types/domain';

type AppScreen = 'welcome' | 'profiles' | 'village' | 'story-house';

const ACTIVE_PROFILE_KEY = 'childmap_active_profile_id';
const ACTIVE_SCREEN_KEY = 'childmap_active_screen';

export function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [activeProfile, setActiveProfile] = useState<AssessmentProfile | null>(null);
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>([]);
  const [initializing, setInitializing] = useState(true);

  const refreshProgress = useCallback(async (profileId: string) => {
    const prog = await storageService.getTaskProgressForProfile(profileId);
    setTaskProgress(prog);
  }, []);

  useEffect(() => {
    void requestPersistentStorage();

    async function restoreSession() {
      try {
        const savedProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
        const savedScreen = localStorage.getItem(ACTIVE_SCREEN_KEY) as AppScreen | null;
        if (savedProfileId) {
          const prof = await storageService.getProfile(savedProfileId);
          if (prof) {
            setActiveProfile(prof);
            await refreshProgress(prof.id);
            if (savedScreen === 'village' || savedScreen === 'story-house') {
              setScreen(savedScreen);
            } else {
              setScreen('village');
            }
          }
        }
      } catch {
        // Fallback to welcome screen
      } finally {
        setInitializing(false);
      }
    }

    void restoreSession();
  }, [refreshProgress]);

  const navigate = (nextScreen: AppScreen, profile?: AssessmentProfile | null) => {
    setScreen(nextScreen);
    try {
      localStorage.setItem(ACTIVE_SCREEN_KEY, nextScreen);
      if (profile !== undefined) {
        if (profile) {
          localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
        } else {
          localStorage.removeItem(ACTIVE_PROFILE_KEY);
        }
      }
    } catch {
      // Ignore
    }
  };

  if (initializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-amber-50 text-lg font-bold text-amber-900">
        טוען את הכפר של החברים...
      </div>
    );
  }

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => navigate('profiles')} />;
  }

  if (screen === 'profiles' || !activeProfile) {
    return (
      <ProfilesScreen
        onSelectProfile={async (profile) => {
          setActiveProfile(profile);
          await refreshProgress(profile.id);
          navigate('village', profile);
        }}
      />
    );
  }

  if (screen === 'village') {
    return (
      <VillageScreen
        profile={activeProfile}
        taskProgress={taskProgress}
        onEnterStoryHouse={() => navigate('story-house')}
        onBackToProfiles={() => {
          setActiveProfile(null);
          navigate('profiles', null);
        }}
      />
    );
  }

  return (
    <StoryHouseHub
      profile={activeProfile}
      taskProgress={taskProgress}
      onProgressUpdated={async () => {
        await refreshProgress(activeProfile.id);
      }}
      onBackToVillage={() => navigate('village')}
    />
  );
}

export default App;
