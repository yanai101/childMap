import { STORY_HOUSE_TASKS } from '../content/storyHouse';
import type {
  AssessmentProfile,
  AudioRecording,
  BackupData,
  ItemResponse,
  SerializedAudioRecording,
  TaskId,
  TaskProgress,
  TaskStatus,
  TeacherAssessment,
} from '../types/domain';
import { db, type ChildMapDatabase } from './database';

export function generateStableId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      return await navigator.storage.persist();
    }
  } catch {
    // Ignore unsupported environments
  }
  return false;
}

export async function getStorageStatus(): Promise<{
  persisted: boolean;
  usageBytes?: number;
  quotaBytes?: number;
  nearLimit: boolean;
}> {
  let persisted = false;
  let usageBytes: number | undefined;
  let quotaBytes: number | undefined;
  let nearLimit = false;

  try {
    if (typeof navigator !== 'undefined' && navigator.storage) {
      if (navigator.storage.persisted) {
        persisted = await navigator.storage.persisted();
      }
      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage;
        quotaBytes = estimate.quota;
        if (usageBytes !== undefined && quotaBytes !== undefined && quotaBytes > 0) {
          nearLimit = usageBytes / quotaBytes > 0.85;
        }
      }
    }
  } catch {
    // Ignore errors in restricted contexts
  }

  return { persisted, usageBytes, quotaBytes, nearLimit };
}

export async function blobToBase64(blob: Blob): Promise<string> {
  if (typeof blob.arrayBuffer === 'function') {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...slice);
    }
    return btoa(binary);
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType || 'audio/webm' });
}

export class StorageService {
  private database: ChildMapDatabase;

  constructor(database: ChildMapDatabase = db) {
    this.database = database;
  }

  async createProfile(input: {
    childName: string;
    assessmentDate: string;
    notes?: string;
  }): Promise<AssessmentProfile> {
    const now = Date.now();
    const profile: AssessmentProfile = {
      id: generateStableId('prof'),
      childName: input.childName.trim(),
      assessmentDate: input.assessmentDate,
      notes: (input.notes ?? '').trim(),
      createdAt: now,
      updatedAt: now,
    };

    const initialProgress: TaskProgress[] = STORY_HOUSE_TASKS.map((task) => ({
      id: `${profile.id}:${task.id}`,
      profileId: profile.id,
      taskId: task.id,
      status: 'לא התחיל',
      updatedAt: now,
    }));

    await this.database.transaction(
      'rw',
      this.database.profiles,
      this.database.taskProgress,
      async () => {
        await this.database.profiles.put(profile);
        await this.database.taskProgress.bulkPut(initialProgress);
      },
    );

    return profile;
  }

  async listProfiles(): Promise<AssessmentProfile[]> {
    return this.database.profiles.orderBy('updatedAt').reverse().toArray();
  }

  async getProfile(profileId: string): Promise<AssessmentProfile | undefined> {
    return this.database.profiles.get(profileId);
  }

  async updateProfile(
    profileId: string,
    patch: Partial<Pick<AssessmentProfile, 'childName' | 'assessmentDate' | 'notes'>>,
  ): Promise<void> {
    await this.database.profiles.update(profileId, {
      ...patch,
      updatedAt: Date.now(),
    });
  }

  async deleteProfile(profileId: string): Promise<void> {
    await this.database.transaction(
      'rw',
      [
        this.database.profiles,
        this.database.taskProgress,
        this.database.itemResponses,
        this.database.teacherAssessments,
        this.database.audioRecordings,
      ],
      async () => {
        await this.database.profiles.delete(profileId);
        await this.database.taskProgress.where('profileId').equals(profileId).delete();
        await this.database.itemResponses.where('profileId').equals(profileId).delete();
        await this.database.teacherAssessments.where('profileId').equals(profileId).delete();
        await this.database.audioRecordings.where('profileId').equals(profileId).delete();
      },
    );
  }

  async getTaskProgressForProfile(profileId: string): Promise<TaskProgress[]> {
    return this.database.taskProgress.where('profileId').equals(profileId).toArray();
  }

  async setTaskStatus(
    profileId: string,
    taskId: TaskId,
    status: TaskStatus,
    skipReason?: string,
  ): Promise<TaskProgress> {
    const now = Date.now();
    const record: TaskProgress = {
      id: `${profileId}:${taskId}`,
      profileId,
      taskId,
      status,
      skipReason: status === 'דולג' ? skipReason?.trim() : undefined,
      updatedAt: now,
    };

    await this.database.transaction(
      'rw',
      this.database.taskProgress,
      this.database.profiles,
      async () => {
        await this.database.taskProgress.put(record);
        await this.database.profiles.update(profileId, { updatedAt: now });
      },
    );

    return record;
  }

  async markTaskInProgressIfUnstarted(profileId: string, taskId: TaskId): Promise<void> {
    const existing = await this.database.taskProgress.get(`${profileId}:${taskId}`);
    if (!existing || existing.status === 'לא התחיל') {
      await this.setTaskStatus(profileId, taskId, 'בתהליך');
    }
  }

  async upsertItemResponse(
    input: Omit<ItemResponse, 'id' | 'updatedAt'>,
  ): Promise<ItemResponse> {
    const now = Date.now();
    const record: ItemResponse = {
      ...input,
      id: `${input.profileId}:${input.taskId}:${input.itemId}`,
      updatedAt: now,
    };

    await this.database.transaction(
      'rw',
      [this.database.itemResponses, this.database.taskProgress, this.database.profiles],
      async () => {
        await this.database.itemResponses.put(record);
        const existingTask = await this.database.taskProgress.get(
          `${input.profileId}:${input.taskId}`,
        );
        if (!existingTask || existingTask.status === 'לא התחיל') {
          await this.database.taskProgress.put({
            id: `${input.profileId}:${input.taskId}`,
            profileId: input.profileId,
            taskId: input.taskId,
            status: 'בתהליך',
            updatedAt: now,
          });
        }
        await this.database.profiles.update(input.profileId, { updatedAt: now });
      },
    );

    return record;
  }

  async getItemResponsesForTask(
    profileId: string,
    taskId: TaskId,
  ): Promise<ItemResponse[]> {
    return this.database.itemResponses
      .where('profileId')
      .equals(profileId)
      .filter((r) => r.taskId === taskId)
      .toArray();
  }

  async getAllItemResponsesForProfile(profileId: string): Promise<ItemResponse[]> {
    return this.database.itemResponses.where('profileId').equals(profileId).toArray();
  }

  async upsertTeacherAssessment(
    input: Omit<TeacherAssessment, 'id' | 'updatedAt'>,
  ): Promise<TeacherAssessment> {
    const now = Date.now();
    const record: TeacherAssessment = {
      ...input,
      id: `${input.profileId}:${input.taskId}`,
      updatedAt: now,
    };

    await this.database.transaction(
      'rw',
      [this.database.teacherAssessments, this.database.taskProgress, this.database.profiles],
      async () => {
        await this.database.teacherAssessments.put(record);
        const existingTask = await this.database.taskProgress.get(
          `${input.profileId}:${input.taskId}`,
        );
        if (!existingTask || existingTask.status === 'לא התחיל') {
          await this.database.taskProgress.put({
            id: `${input.profileId}:${input.taskId}`,
            profileId: input.profileId,
            taskId: input.taskId,
            status: 'בתהליך',
            updatedAt: now,
          });
        }
        await this.database.profiles.update(input.profileId, { updatedAt: now });
      },
    );

    return record;
  }

  async getTeacherAssessment(
    profileId: string,
    taskId: TaskId,
  ): Promise<TeacherAssessment | undefined> {
    return this.database.teacherAssessments.get(`${profileId}:${taskId}`);
  }

  async getAllTeacherAssessmentsForProfile(
    profileId: string,
  ): Promise<TeacherAssessment[]> {
    return this.database.teacherAssessments.where('profileId').equals(profileId).toArray();
  }

  async saveAudioRecording(input: {
    id?: string;
    profileId: string;
    taskId: TaskId;
    itemId?: string;
    mimeType: string;
    blob: Blob;
    durationMs: number;
  }): Promise<AudioRecording> {
    const arrayBuffer =
      typeof input.blob.arrayBuffer === 'function'
        ? await input.blob.arrayBuffer()
        : undefined;
    const record: AudioRecording = {
      id: input.id ?? generateStableId('rec'),
      profileId: input.profileId,
      taskId: input.taskId,
      itemId: input.itemId,
      mimeType: input.mimeType,
      blob: input.blob,
      arrayBuffer,
      durationMs: input.durationMs,
      createdAt: Date.now(),
    };
    await this.database.audioRecordings.put(record);
    return record;
  }

  private hydrateRecording(rec: AudioRecording): AudioRecording {
    if (rec.arrayBuffer && !(rec.blob instanceof Blob && rec.blob.size > 0)) {
      return {
        ...rec,
        blob: new Blob([rec.arrayBuffer], { type: rec.mimeType || 'audio/webm' }),
      };
    }
    return rec;
  }

  async getAudioRecording(recordingId: string): Promise<AudioRecording | undefined> {
    const rec = await this.database.audioRecordings.get(recordingId);
    return rec ? this.hydrateRecording(rec) : undefined;
  }

  async getAudioRecordingsForProfile(profileId: string): Promise<AudioRecording[]> {
    const list = await this.database.audioRecordings
      .where('profileId')
      .equals(profileId)
      .toArray();
    return list.map((r) => this.hydrateRecording(r));
  }

  async deleteAudioRecording(recordingId: string): Promise<void> {
    await this.database.audioRecordings.delete(recordingId);
  }

  async exportBackup(): Promise<BackupData> {
    const [profiles, taskProgress, itemResponses, teacherAssessments, audioRecordings] =
      await Promise.all([
        this.database.profiles.toArray(),
        this.database.taskProgress.toArray(),
        this.database.itemResponses.toArray(),
        this.database.teacherAssessments.toArray(),
        this.database.audioRecordings.toArray(),
      ]);

    const serializedRecordings: SerializedAudioRecording[] = await Promise.all(
      audioRecordings.map(async (rawRec) => {
        const rec = this.hydrateRecording(rawRec);
        let base64Data = '';
        if (rec.arrayBuffer) {
          const bytes = new Uint8Array(rec.arrayBuffer);
          const chunkSize = 0x8000;
          let binary = '';
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
          }
          base64Data = btoa(binary);
        } else {
          base64Data = await blobToBase64(rec.blob);
        }
        return {
          id: rec.id,
          profileId: rec.profileId,
          taskId: rec.taskId,
          itemId: rec.itemId,
          mimeType: rec.mimeType,
          base64Data,
          durationMs: rec.durationMs,
          createdAt: rec.createdAt,
        };
      }),
    );

    return {
      appName: 'הכפר של החברים',
      version: 1,
      exportedAt: new Date().toISOString(),
      profiles,
      taskProgress,
      itemResponses,
      teacherAssessments,
      audioRecordings: serializedRecordings,
    };
  }

  async importBackup(
    backup: BackupData,
    mode: 'merge' | 'replace' = 'merge',
  ): Promise<{ profilesCount: number; recordingsCount: number }> {
    if (
      !backup ||
      backup.appName !== 'הכפר של החברים' ||
      backup.version !== 1 ||
      !Array.isArray(backup.profiles) ||
      !Array.isArray(backup.taskProgress) ||
      !Array.isArray(backup.itemResponses) ||
      !Array.isArray(backup.teacherAssessments) ||
      !Array.isArray(backup.audioRecordings)
    ) {
      throw new Error('קובץ הגיבוי אינו תקין או אינו תואם לפורמט של הכפר של החברים.');
    }

    const restoredRecordings: AudioRecording[] = await Promise.all(
      backup.audioRecordings.map(async (rec) => {
        const blob = base64ToBlob(rec.base64Data, rec.mimeType);
        const arrayBuffer =
          typeof blob.arrayBuffer === 'function' ? await blob.arrayBuffer() : undefined;
        return {
          id: rec.id,
          profileId: rec.profileId,
          taskId: rec.taskId,
          itemId: rec.itemId,
          mimeType: rec.mimeType,
          blob,
          arrayBuffer,
          durationMs: rec.durationMs,
          createdAt: rec.createdAt,
        };
      }),
    );

    await this.database.transaction(
      'rw',
      [
        this.database.profiles,
        this.database.taskProgress,
        this.database.itemResponses,
        this.database.teacherAssessments,
        this.database.audioRecordings,
      ],
      async () => {
        if (mode === 'replace') {
          await Promise.all([
            this.database.profiles.clear(),
            this.database.taskProgress.clear(),
            this.database.itemResponses.clear(),
            this.database.teacherAssessments.clear(),
            this.database.audioRecordings.clear(),
          ]);
        }

        if (backup.profiles.length > 0) {
          await this.database.profiles.bulkPut(backup.profiles);
        }
        if (backup.taskProgress.length > 0) {
          await this.database.taskProgress.bulkPut(backup.taskProgress);
        }
        if (backup.itemResponses.length > 0) {
          await this.database.itemResponses.bulkPut(backup.itemResponses);
        }
        if (backup.teacherAssessments.length > 0) {
          await this.database.teacherAssessments.bulkPut(backup.teacherAssessments);
        }
        if (restoredRecordings.length > 0) {
          await this.database.audioRecordings.bulkPut(restoredRecordings);
        }
      },
    );

    return {
      profilesCount: backup.profiles.length,
      recordingsCount: restoredRecordings.length,
    };
  }
}

export const storageService = new StorageService();
