import Dexie, { type Table } from 'dexie';
import type {
  AssessmentProfile,
  AudioRecording,
  ItemResponse,
  TaskProgress,
  TeacherAssessment,
} from '../types/domain';

export class ChildMapDatabase extends Dexie {
  profiles!: Table<AssessmentProfile, string>;
  taskProgress!: Table<TaskProgress, string>;
  itemResponses!: Table<ItemResponse, string>;
  teacherAssessments!: Table<TeacherAssessment, string>;
  audioRecordings!: Table<AudioRecording, string>;

  constructor(name = 'ChildMapVillageDB') {
    super(name);
    this.version(1).stores({
      profiles: '&id, childName, assessmentDate, createdAt, updatedAt',
      taskProgress: '&id, profileId, taskId, status, updatedAt',
      itemResponses: '&id, profileId, taskId, itemId, updatedAt',
      teacherAssessments: '&id, profileId, taskId, updatedAt',
      audioRecordings: '&id, profileId, taskId, itemId, createdAt',
    });
  }
}

export const db = new ChildMapDatabase();
