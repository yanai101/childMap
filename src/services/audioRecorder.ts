export interface RecordedAudioResult {
  blob: Blob;
  mimeType: string;
  durationMs: number;
}

export function isAudioRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

export function getPreferredAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'audio/webm';
  const candidates = [
    'audio/mp4',
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}

export class LocalAudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: BlobPart[] = [];
  private startedAt = 0;
  private mimeType = 'audio/webm';

  async start(): Promise<void> {
    if (!isAudioRecordingSupported()) {
      throw new Error('הדפדפן אינו תומך בהקלטת שמע מקומית.');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        throw new Error('לא ניתנה הרשאה למיקרופון. ניתן לאפשר גישה בהגדרות הדפדפן.');
      }
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        throw new Error('לא נמצא מיקרופון מחובר במכשיר זה.');
      }
      throw new Error('לא ניתן להפעיל את המיקרופון כרגע.');
    }

    const preferred = getPreferredAudioMimeType();
    this.chunks = [];
    this.mediaRecorder = preferred
      ? new MediaRecorder(this.stream, { mimeType: preferred })
      : new MediaRecorder(this.stream);
    this.mimeType = this.mediaRecorder.mimeType || preferred || 'audio/webm';
    this.startedAt = Date.now();

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start(250);
  }

  async stop(): Promise<RecordedAudioResult> {
    const recorder = this.mediaRecorder;
    if (!recorder) {
      throw new Error('אין הקלטה פעילה.');
    }

    return new Promise<RecordedAudioResult>((resolve, reject) => {
      recorder.onstop = () => {
        const durationMs = Math.max(500, Date.now() - this.startedAt);
        const blob = new Blob(this.chunks, { type: this.mimeType });
        this.cleanupStream();
        this.mediaRecorder = null;
        resolve({ blob, mimeType: this.mimeType, durationMs });
      };
      recorder.onerror = () => {
        this.cleanupStream();
        this.mediaRecorder = null;
        reject(new Error('אירעה שגיאה בעת עצירת ההקלטה.'));
      };
      try {
        recorder.stop();
      } catch {
        this.cleanupStream();
        this.mediaRecorder = null;
        reject(new Error('לא ניתן לעצור את ההקלטה.'));
      }
    });
  }

  cancel(): void {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } catch {
      // Ignore
    }
    this.cleanupStream();
    this.mediaRecorder = null;
    this.chunks = [];
  }

  private cleanupStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
