import { beforeEach, describe, expect, it } from 'vitest';
import {
  ADDITION_PROBLEMS,
  COUNTING_OBJECTS_ITEMS,
  MATH_SHOP_TASKS,
  NUMERAL_NAMING_ORDER,
  NUMERAL_RECOGNITION_ITEMS,
  PATTERN_ITEMS,
  QTY_TO_NUMERAL_ITEMS,
  QTY_TO_QTY_ITEMS,
} from '../content/mathShop';
import { STORY_HOUSE_TASKS } from '../content/storyHouse';
import { ChildMapDatabase } from '../db/database';
import { StorageService } from '../db/storageService';
import { buildReportHtml, extractGroundedObservations } from '../services/pdfExport';

describe('Mathematics Shop — Content, Persistence & PDF Report', () => {
  let testDb: ChildMapDatabase;
  let service: StorageService;

  beforeEach(async () => {
    testDb = new ChildMapDatabase(`MathTestDB_${Date.now()}_${Math.random()}`);
    await testDb.open();
    service = new StorageService(testDb);
  });

  it('defines all 9 math activities and exact required item configurations', () => {
    expect(MATH_SHOP_TASKS).toHaveLength(9);
    expect(COUNTING_OBJECTS_ITEMS.map((i) => i.quantity)).toEqual([4, 6, 7, 9]);
    expect(QTY_TO_NUMERAL_ITEMS.some((i) => i.stage === 'A')).toBe(true);
    expect(QTY_TO_NUMERAL_ITEMS.some((i) => i.stage === 'B')).toBe(true);
    expect(QTY_TO_QTY_ITEMS.some((i) => i.stage === 'A')).toBe(true);
    expect(QTY_TO_QTY_ITEMS.some((i) => i.stage === 'B')).toBe(true);
    expect(NUMERAL_RECOGNITION_ITEMS).toHaveLength(10);
    expect(NUMERAL_NAMING_ORDER).toHaveLength(10);
    expect(ADDITION_PROBLEMS.map((p) => p.expectedResult)).toEqual([3, 4, 7]);

    const patternTypes = new Set(PATTERN_ITEMS.map((p) => p.patternType));
    expect(patternTypes).toEqual(new Set(['AB', 'AAB', 'ABC']));
    expect(PATTERN_ITEMS.every((p) => p.givenPrefix.length >= 2 && p.expectedContinuation.length >= 3)).toBe(true);
  });

  it('initializes both Story House (8) and Math Shop (9) tasks and preserves Story House data', async () => {
    const profile = await service.createProfile({
      childName: 'אורי',
      assessmentDate: '2026-11-16',
    });

    const progress = await service.getTaskProgressForProfile(profile.id);
    expect(progress).toHaveLength(STORY_HOUSE_TASKS.length + MATH_SHOP_TASKS.length);

    await service.upsertItemResponse({
      profileId: profile.id,
      taskId: 'naming',
      itemId: 'naming-dog',
      responseText: 'כלב',
      namingEvaluation: 'שיום עצמאי ונכון',
      notes: '',
    });

    await service.upsertTeacherAssessment({
      profileId: profile.id,
      taskId: 'math_oral_counting',
      criteriaRatings: { sequence_stability: 'רצף יציב ומסודר לאורך הספירה' },
      transcription: 'ספר עד 27 ברצף',
      notes: 'ספירה שוטפת מעבר ל־10',
      metadata: {
        highestNumber: '27',
        highestUninterrupted: '24',
        neededAssistance: false,
      },
    });

    const storyResponses = await service.getItemResponsesForTask(profile.id, 'naming');
    expect(storyResponses).toHaveLength(1);
    expect(storyResponses[0].responseText).toBe('כלב');

    const mathAssessment = await service.getTeacherAssessment(profile.id, 'math_oral_counting');
    expect(mathAssessment?.metadata?.highestNumber).toBe('27');
  });

  it('persists math item responses, strategies, skip reasons, and restores them via backup', async () => {
    const profile = await service.createProfile({
      childName: 'תמר',
      assessmentDate: '2026-11-16',
    });

    await service.upsertItemResponse({
      profileId: profile.id,
      taskId: 'math_counting_objects',
      itemId: 'count-7',
      responseText: '7',
      isCorrect: true,
      notes: '',
      metadata: {
        quantity: 7,
        oneToOne: 'תקין / שולט',
        cardinality: 'תקין / שולט',
      },
    });

    await service.upsertItemResponse({
      profileId: profile.id,
      taskId: 'math_addition',
      itemId: 'add-3',
      responseText: '7',
      isCorrect: true,
      notes: '',
      metadata: {
        problemNumber: 3,
        expectedResult: 7,
        strategyUsed: 'ספירה באצבעות',
        explanationTranscription: 'ספרתי 3 ועוד 4 באצבעות',
      },
    });

    await service.setTaskStatus(profile.id, 'math_patterns', 'דולג', 'יושלם במפגש הבא');

    const rec = await service.saveAudioRecording({
      profileId: profile.id,
      taskId: 'math_oral_counting',
      mimeType: 'audio/webm',
      blob: new Blob([new Uint8Array([10, 20, 30])], { type: 'audio/webm' }),
      durationMs: 2500,
    });

    const backup = await service.exportBackup();
    await service.deleteProfile(profile.id);

    const imported = await service.importBackup(backup, 'replace');
    expect(imported.profilesCount).toBe(1);
    expect(imported.recordingsCount).toBe(1);

    const restoredAdd = await service.getItemResponsesForTask(profile.id, 'math_addition');
    expect(restoredAdd[0].metadata?.strategyUsed).toBe('ספירה באצבעות');

    const restoredRec = await service.getAudioRecording(rec.id);
    expect(restoredRec).toBeDefined();
  });

  it('builds Hebrew RTL PDF HTML with Mathematics Shop section and grounded observations', async () => {
    const profile = await service.createProfile({
      childName: 'דניאל',
      assessmentDate: '2026-11-16',
    });

    await service.upsertTeacherAssessment({
      profileId: profile.id,
      taskId: 'math_oral_counting',
      criteriaRatings: { sequence_stability: 'רצף יציב ומסודר לאורך הספירה' },
      transcription: '',
      notes: '',
      metadata: { highestNumber: '32', highestUninterrupted: '32' },
    });

    await service.upsertItemResponse({
      profileId: profile.id,
      taskId: 'math_addition',
      itemId: 'add-1',
      responseText: '3',
      isCorrect: true,
      notes: '',
      metadata: { strategyUsed: 'חישוב בעל פה' },
    });

    await service.setTaskStatus(profile.id, 'math_qty_to_qty', 'דולג', 'הפסקת חצר');

    const bundle = {
      profile,
      taskProgress: await service.getTaskProgressForProfile(profile.id),
      itemResponses: await service.getAllItemResponsesForProfile(profile.id),
      teacherAssessments: await service.getAllTeacherAssessmentsForProfile(profile.id),
      audioRecordings: await service.getAudioRecordingsForProfile(profile.id),
    };

    const obs = extractGroundedObservations(bundle);
    expect(obs.strengths.some((s) => s.includes('ספירה בעל פה'))).toBe(true);

    const html = buildReportHtml(bundle);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('חנות המספרים — מיפוי חשיבה מתמטית');
    expect(html).toContain('32');
    expect(html).toContain('חישוב בעל פה');
    expect(html).toContain('הפסקת חצר');
    expect(html).toContain('לא נבדק');
  });
});
