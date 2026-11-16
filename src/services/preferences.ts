const PREFS_KEY = 'childmap_ui_prefs_v1';

export interface UiPreferences {
  soundEffectsEnabled: boolean;
  showTeacherHints: boolean;
}

const DEFAULT_PREFS: UiPreferences = {
  soundEffectsEnabled: true,
  showTeacherHints: true,
};

export function loadUiPreferences(): UiPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<UiPreferences>;
    return {
      soundEffectsEnabled:
        typeof parsed.soundEffectsEnabled === 'boolean'
          ? parsed.soundEffectsEnabled
          : DEFAULT_PREFS.soundEffectsEnabled,
      showTeacherHints:
        typeof parsed.showTeacherHints === 'boolean'
          ? parsed.showTeacherHints
          : DEFAULT_PREFS.showTeacherHints,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveUiPreferences(prefs: UiPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore localStorage quota/private-mode errors for non-critical UI prefs
  }
}
