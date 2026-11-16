import { beforeEach, describe, expect, it } from 'vitest';
import { ChildMapDatabase } from '../db/database';
import { StorageService } from '../db/storageService';
import { buildReportHtml, extractGroundedObservations } from '../services/pdfExport';

describe('StorageService & Backup Restoration', () => {
  let testDb: ChildMapDatabase;
  let service: StorageService;

  beforeEach(async () => {
    testDb = new ChildMapDatabase(`TestDB_${Date.now()}_${Math.random()}`);
    await testDb.open();
    service = new StorageService(testDb);
  });

  it('creates independent assessment profiles even with the same child name', async () => {
    const p1 = await service.createProfile({
      childName: 'נועם',
      assessmentDate: '2026-11-10',
      notes: 'מפגש ראשון',
    });
    const p2 = await service.createProfile({
      childName: 'נועם',
      assessmentDate: '2026-11-16',
      notes: 'מפגש המשך',
    });

    expect(p1.id).not.toBe(p2.id);
    const profiles = await service.listProfiles();
    expect(profiles).toHaveLength(2);

    const progress1 = await service.getTaskProgressForProfile(p1.id);
    expect(progress1).toHaveLength(8);
    expect(progress1.every((t) => t.status === 'לא התחיל')).toBe(true);
  });

  it('persists task statuses, skip reasons, item responses, and teacher assessments', async () => {
    const profile = await service.createProfile({
      childName: 'מאיה',
      assessmentDate: '2026-11-16',
    });

    await service.upsertItemResponse({
      profileId: profile.id,
      taskId: 'naming',
      itemId: 'naming-dog',
      responseText: 'כלבלב',
      namingEvaluation: 'שיום עצמאי ונכון',
      notes: 'זיהתה מיד',
    });

    const progAfterItem = await service.getTaskProgressForProfile(profile.id);
    const namingProg = progAfterItem.find((p) => p.taskId === 'naming');
    expect(namingProg?.status).toBe('בתהליך');

    await service.setTaskStatus(profile.id, 'listening', 'דולג', 'הילדה התעייפה, יושלם מחר');
    const progAfterSkip = await service.getTaskProgressForProfile(profile.id);
    const listeningProg = progAfterSkip.find((p) => p.taskId === 'listening');
    expect(listeningProg?.status).toBe('דולג');
    expect(listeningProg?.skipReason).toBe('הילדה התעייפה, יושלם מחר');

    await service.upsertTeacherAssessment({
      profileId: profile.id,
      taskId: 'sequencing_a',
      criteriaRatings: {
        chronological_order: 'מסדר רצף מדויק באופן עצמאי',
      },
      transcription: 'תולי שם זרע, השקה במים וצמח פרח.',
      notes: 'סיפרה בביטחון',
    });

    const savedAssessment = await service.getTeacherAssessment(profile.id, 'sequencing_a');
    expect(savedAssessment?.transcription).toContain('זרע');
  });

  it('exports and imports full backup including audio recordings', async () => {
    const profile = await service.createProfile({
      childName: 'איתן',
      assessmentDate: '2026-11-16',
    });

    const audioBytes = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const audioBlob = new Blob([audioBytes], { type: 'audio/webm' });
    const rec = await service.saveAudioRecording({
      profileId: profile.id,
      taskId: 'picture_description',
      mimeType: 'audio/webm',
      blob: audioBlob,
      durationMs: 3200,
    });

    const backup = await service.exportBackup();
    expect(backup.profiles).toHaveLength(1);
    expect(backup.audioRecordings).toHaveLength(1);

    // Wipe database completely
    await service.deleteProfile(profile.id);
    expect(await service.listProfiles()).toHaveLength(0);
    expect(await service.getAudioRecording(rec.id)).toBeUndefined();

    // Restore from backup
    const result = await service.importBackup(backup, 'replace');
    expect(result.profilesCount).toBe(1);
    expect(result.recordingsCount).toBe(1);

    const restoredProfiles = await service.listProfiles();
    expect(restoredProfiles[0].childName).toBe('איתן');

    const restoredRec = await service.getAudioRecording(rec.id);
    expect(restoredRec).toBeDefined();
    expect(restoredRec?.durationMs).toBe(3200);
    expect(backup.audioRecordings[0].base64Data).toBe(
      btoa(String.fromCharCode(...audioBytes)),
    );
  });

  it('extracts grounded observations and builds Hebrew RTL report HTML without fabricating data', async () => {
    const profile = await service.createProfile({
      childName: 'תמר',
      assessmentDate: '2026-11-16',
    });

    const taskProgress = await service.getTaskProgressForProfile(profile.id);
    const bundle = {
      profile,
      taskProgress,
      itemResponses: [],
      teacherAssessments: [],
      audioRecordings: [],
    };

    const obs = extractGroundedObservations(bundle);
    expect(obs.strengths).toHaveLength(0);
    expect(obs.areasForSupport).toHaveLength(0);

    const html = buildReportHtml(bundle);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('תמר');
    expect(html).toContain('טרם תועדו תצפיות המסווגות כחוזקה');
  });
});
