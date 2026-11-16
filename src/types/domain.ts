export type TaskStatus = 'לא התחיל' | 'בתהליך' | 'הושלם' | 'דולג';

export type StoryTaskId =
  | 'naming'
  | 'sequencing_a'
  | 'sequencing_b'
  | 'listening'
  | 'verbal_questions'
  | 'verbal_riddles'
  | 'verbal_vocabulary'
  | 'picture_description';

export type MathTaskId =
  | 'math_oral_counting'
  | 'math_counting_objects'
  | 'math_qty_to_numeral'
  | 'math_qty_to_qty'
  | 'math_more_less'
  | 'math_numeral_recognition'
  | 'math_numeral_naming'
  | 'math_addition'
  | 'math_patterns';

export type TaskId = StoryTaskId | MathTaskId;

export type NamingEvaluation =
  | 'שיום עצמאי ונכון'
  | 'שיום לאחר רמז או תיווך'
  | 'שיום שגוי'
  | 'אין תגובה'
  | 'לא נבדק';

export const NAMING_EVALUATION_OPTIONS: NamingEvaluation[] = [
  'שיום עצמאי ונכון',
  'שיום לאחר רמז או תיווך',
  'שיום שגוי',
  'אין תגובה',
  'לא נבדק',
];

export interface AssessmentProfile {
  id: string;
  childName: string;
  assessmentDate: string; // YYYY-MM-DD
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskProgress {
  id: string; // `${profileId}:${taskId}`
  profileId: string;
  taskId: TaskId;
  status: TaskStatus;
  skipReason?: string;
  updatedAt: number;
}

export interface ItemResponse {
  id: string; // `${profileId}:${taskId}:${itemId}`
  profileId: string;
  taskId: TaskId;
  itemId: string;
  responseText: string;
  namingEvaluation?: NamingEvaluation;
  /** Used in sequencing tasks: ordered array of picture IDs as arranged by the child */
  selectedOrder?: string[];
  /** Used in sequencing tasks: whether selectedOrder matches expectedOrder */
  isOrderCorrect?: boolean;
  /** Objective correctness where measurable (e.g. matching, recognition, addition) */
  isCorrect?: boolean;
  /** Task-specific performance level label or 'לא נבדק' */
  performanceLevel?: string;
  /** Structured activity-specific data (e.g. math strategy, stage, pattern type, one-to-one) */
  metadata?: Record<string, unknown>;
  notes: string;
  recordingId?: string;
  updatedAt: number;
}

export interface TeacherAssessment {
  id: string; // `${profileId}:${taskId}`
  profileId: string;
  taskId: TaskId;
  /** Map from criterionId to selected descriptive level label or 'לא נבדק' */
  criteriaRatings: Record<string, string>;
  transcription: string;
  notes: string;
  /** Structured task-level data (e.g. oral counting highest number, errors, skipped numbers) */
  metadata?: Record<string, unknown>;
  recordingId?: string;
  updatedAt: number;
}

export interface AudioRecording {
  id: string;
  profileId: string;
  taskId: TaskId;
  itemId?: string;
  mimeType: string;
  blob: Blob;
  arrayBuffer?: ArrayBuffer;
  durationMs: number;
  createdAt: number;
}

export interface SerializedAudioRecording {
  id: string;
  profileId: string;
  taskId: TaskId;
  itemId?: string;
  mimeType: string;
  base64Data: string;
  durationMs: number;
  createdAt: number;
}

export interface BackupData {
  appName: 'הכפר של החברים';
  version: 1;
  exportedAt: string;
  profiles: AssessmentProfile[];
  taskProgress: TaskProgress[];
  itemResponses: ItemResponse[];
  teacherAssessments: TeacherAssessment[];
  audioRecordings: SerializedAudioRecording[];
}

export interface CriterionLevel {
  id: string;
  label: string;
  description: string;
}

export interface AssessmentCriterion {
  id: string;
  title: string;
  levels: CriterionLevel[];
}

export interface TaskMetadata {
  id: TaskId;
  title: string;
  shortTitle: string;
  activityGroup: string;
  description: string;
  estimatedMinutes: number;
  supportsRecording: boolean;
}
