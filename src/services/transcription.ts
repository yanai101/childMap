/**
 * Modular local transcription interface.
 *
 * PRIVACY GUARANTEE:
 * We intentionally DO NOT use window.SpeechRecognition / webkitSpeechRecognition
 * because many browsers route audio to remote cloud servers.
 * This interface is designed to plug in a future 100% offline Hebrew STT engine
 * (e.g. local Whisper WASM) without changing UI components.
 */
export interface OfflineTranscriptionProvider {
  readonly id: string;
  readonly isAvailable: boolean;
  readonly statusMessageHe: string;
  transcribe(audioBlob: Blob): Promise<{ text: string; isPlaceholder: boolean }>;
}

export const localHebrewTranscriptionProvider: OfflineTranscriptionProvider = {
  id: 'offline-hebrew-stt-placeholder',
  isAvailable: false,
  statusMessageHe:
    'תמלול אוטומטי בעברית (אופליין) עדיין אינו זמין בגרסה זו. מטעמי פרטיות, ההקלטות אינן נשלחות לשירותים חיצוניים — ניתן להאזין להקלטה ולתמלל ידנית.',
  async transcribe(): Promise<{ text: string; isPlaceholder: boolean }> {
    return {
      text: '',
      isPlaceholder: true,
    };
  },
};
