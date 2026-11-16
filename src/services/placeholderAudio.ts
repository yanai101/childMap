/**
 * Offline placeholder story audio player using Web Audio API.
 * Plays a gentle, child-friendly storytelling melody (~10 seconds)
 * when no prerecorded MP3/M4A file is configured yet.
 */
const STORY_MELODY_NOTES = [
  { freq: 392.0, duration: 0.45 }, // G4
  { freq: 440.0, duration: 0.45 }, // A4
  { freq: 493.88, duration: 0.55 }, // B4
  { freq: 587.33, duration: 0.7 }, // D5
  { freq: 523.25, duration: 0.45 }, // C5
  { freq: 493.88, duration: 0.45 }, // B4
  { freq: 440.0, duration: 0.65 }, // A4
  { freq: 392.0, duration: 0.8 }, // G4
  { freq: 523.25, duration: 0.45 }, // C5
  { freq: 587.33, duration: 0.45 }, // D5
  { freq: 659.25, duration: 0.7 }, // E5
  { freq: 587.33, duration: 0.5 }, // D5
  { freq: 523.25, duration: 0.9 }, // C5
];

export class PlaceholderStoryPlayer {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private noteIndex = 0;
  private playing = false;
  private onStateChange?: (state: {
    isPlaying: boolean;
    progress: number;
    ended: boolean;
  }) => void;

  constructor(
    onStateChange?: (state: { isPlaying: boolean; progress: number; ended: boolean }) => void,
  ) {
    this.onStateChange = onStateChange;
  }

  play(): void {
    if (this.playing) return;
    if (this.noteIndex >= STORY_MELODY_NOTES.length) {
      this.noteIndex = 0;
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.playing = true;
    this.emit(false);
    this.scheduleNextNote();
  }

  pause(): void {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.emit(false);
  }

  replay(): void {
    this.pause();
    this.noteIndex = 0;
    this.play();
  }

  dispose(): void {
    this.pause();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }

  private scheduleNextNote(): void {
    if (!this.playing || !this.ctx) return;
    if (this.noteIndex >= STORY_MELODY_NOTES.length) {
      this.playing = false;
      this.emit(true);
      return;
    }

    const note = STORY_MELODY_NOTES[this.noteIndex];
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.duration * 0.92);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + note.duration);

    this.noteIndex += 1;
    this.emit(false);

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, note.duration * 1000);
  }

  private emit(ended: boolean): void {
    this.onStateChange?.({
      isPlaying: this.playing,
      progress: Math.round((this.noteIndex / STORY_MELODY_NOTES.length) * 100),
      ended,
    });
  }
}
