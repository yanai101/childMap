import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { NOT_ASSESSED_LABEL, TASK_CRITERIA } from '../content/criteria';
import {
  LISTENING_STORY,
  PICTURE_NAMING_ITEMS,
  STORY_HOUSE_TASKS,
  STORY_SEQUENCES,
  VERBAL_QUESTIONS,
  VERBAL_RIDDLES,
  VERBAL_VOCABULARY,
} from '../content/storyHouse';
import type {
  AssessmentProfile,
  AudioRecording,
  ItemResponse,
  TaskProgress,
  TeacherAssessment,
} from '../types/domain';

export interface ReportBundle {
  profile: AssessmentProfile;
  taskProgress: TaskProgress[];
  itemResponses: ItemResponse[];
  teacherAssessments: TeacherAssessment[];
  audioRecordings: AudioRecording[];
}

export interface GroundedObservations {
  strengths: string[];
  areasForSupport: string[];
}

/**
 * Computes strengths and areas for further support strictly from recorded observations.
 * Never fabricates conclusions or diagnoses.
 */
export function extractGroundedObservations(bundle: ReportBundle): GroundedObservations {
  const strengths: string[] = [];
  const areasForSupport: string[] = [];

  for (const task of STORY_HOUSE_TASKS) {
    const assessment = bundle.teacherAssessments.find((a) => a.taskId === task.id);
    const criteria = TASK_CRITERIA[task.id] ?? [];

    if (assessment) {
      for (const criterion of criteria) {
        const selectedLabel = assessment.criteriaRatings[criterion.id];
        if (!selectedLabel || selectedLabel === NOT_ASSESSED_LABEL) continue;

        const levelIndex = criterion.levels.findIndex((l) => l.label === selectedLabel);
        if (levelIndex === 0) {
          strengths.push(`${task.shortTitle} — ${criterion.title}: ${selectedLabel}`);
        } else if (levelIndex >= 1) {
          areasForSupport.push(`${task.shortTitle} — ${criterion.title}: ${selectedLabel}`);
        }
      }
    }
  }

  const namingResponses = bundle.itemResponses.filter((r) => r.taskId === 'naming');
  const independentNaming = namingResponses.filter(
    (r) => r.namingEvaluation === 'שיום עצמאי ונכון',
  );
  const cuedOrIncorrectNaming = namingResponses.filter(
    (r) =>
      r.namingEvaluation === 'שיום לאחר רמז או תיווך' ||
      r.namingEvaluation === 'שיום שגוי' ||
      r.namingEvaluation === 'אין תגובה',
  );

  if (independentNaming.length > 0) {
    strengths.push(
      `שיום תמונות: שיום עצמאי ונכון ב-${independentNaming.length} מתוך ${PICTURE_NAMING_ITEMS.length} פריטים שנצפו.`,
    );
  }
  if (cuedOrIncorrectNaming.length > 0) {
    areasForSupport.push(
      `שיום תמונות: נדרש רמז/תיווך או חיזוק שליפה ב-${cuedOrIncorrectNaming.length} פריטים.`,
    );
  }

  return { strengths, areasForSupport };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getItemPromptLabel(taskId: string, itemId: string): string {
  if (taskId === 'naming') {
    return PICTURE_NAMING_ITEMS.find((i) => i.id === itemId)?.targetWord ?? itemId;
  }
  if (taskId === 'listening') {
    return LISTENING_STORY.questions.find((q) => q.id === itemId)?.question ?? itemId;
  }
  if (taskId === 'verbal_questions') {
    return VERBAL_QUESTIONS.find((q) => q.id === itemId)?.prompt ?? itemId;
  }
  if (taskId === 'verbal_riddles') {
    return VERBAL_RIDDLES.find((q) => q.id === itemId)?.prompt ?? itemId;
  }
  if (taskId === 'verbal_vocabulary') {
    return VERBAL_VOCABULARY.find((q) => q.id === itemId)?.prompt ?? itemId;
  }
  return itemId;
}

export function buildReportHtml(bundle: ReportBundle): string {
  const { profile, taskProgress, itemResponses, teacherAssessments, audioRecordings } = bundle;
  const { strengths, areasForSupport } = extractGroundedObservations(bundle);

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'הושלם':
        return 'background:#dcfce7;color:#166534;border:1px solid #86efac;';
      case 'בתהליך':
        return 'background:#fef3c7;color:#92400e;border:1px solid #fcd34d;';
      case 'דולג':
        return 'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;';
      default:
        return 'background:#f5f5f4;color:#57534e;border:1px solid #e7e5e4;';
    }
  };

  const taskSections = STORY_HOUSE_TASKS.map((task) => {
    const prog = taskProgress.find((p) => p.taskId === task.id);
    const status = prog?.status ?? 'לא התחיל';
    const assessment = teacherAssessments.find((a) => a.taskId === task.id);
    const responses = itemResponses.filter((r) => r.taskId === task.id);
    const taskRecordings = audioRecordings.filter((rec) => rec.taskId === task.id);
    const criteria = TASK_CRITERIA[task.id] ?? [];

    const criteriaRows = criteria
      .map((c) => {
        const val = assessment?.criteriaRatings[c.id] || NOT_ASSESSED_LABEL;
        return `
          <tr>
            <td style="padding:6px 10px;border-bottom:1px solid #e7e5e4;font-weight:600;width:36%;">${escapeHtml(c.title)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #e7e5e4;">${escapeHtml(val)}</td>
          </tr>
        `;
      })
      .join('');

    let itemRows = '';
    if (task.id === 'sequencing_a' || task.id === 'sequencing_b') {
      const seqResp = responses.find((r) => r.itemId === 'sequence');
      const seqConfig = STORY_SEQUENCES[task.id];
      if (seqResp?.selectedOrder?.length) {
        const orderText = seqResp.selectedOrder
          .map((id, idx) => {
            const card = seqConfig.cards.find((c) => c.id === id);
            return `${idx + 1}. ${card?.teacherCaption ?? id}`;
          })
          .join(' | ');
        const matchLabel = seqResp.isOrderCorrect ? 'תואם לסדר הצפוי' : 'שונה מהסדר הצפוי';
        itemRows = `
          <div style="margin-top:8px;padding:8px 10px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;font-size:12px;">
            <div><strong>סדר התמונות שסידר הילד/ה:</strong> ${escapeHtml(orderText)}</div>
            <div style="margin-top:4px;"><strong>התאמה לרצף:</strong> ${escapeHtml(matchLabel)}</div>
          </div>
        `;
      }
    } else if (responses.length > 0) {
      const listHtml = responses
        .map((r) => {
          const label = getItemPromptLabel(task.id, r.itemId);
          const evalText = r.namingEvaluation || r.performanceLevel || NOT_ASSESSED_LABEL;
          const respText = r.responseText ? `"${escapeHtml(r.responseText)}"` : 'ללא תיעוד מילולי';
          const noteText = r.notes ? ` | הערה: ${escapeHtml(r.notes)}` : '';
          return `
            <li style="margin-bottom:5px;">
              <strong>${escapeHtml(label)}:</strong> ${respText}
              <span style="color:#78350f;background:#fef3c7;padding:1px 6px;border-radius:4px;font-size:11px;margin-right:6px;">${escapeHtml(evalText)}</span>
              ${noteText}
            </li>
          `;
        })
        .join('');
      itemRows = `<ul style="margin:8px 0 0 0;padding-right:18px;font-size:12px;">${listHtml}</ul>`;
    }

    return `
      <div style="margin-bottom:16px;padding:12px 14px;border:1px solid #e7e5e4;border-radius:10px;background:#ffffff;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="margin:0;font-size:15px;color:#78350f;">${escapeHtml(task.title)}</h3>
          <span style="padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;${statusBadgeColor(status)}">${escapeHtml(status)}</span>
        </div>
        ${
          status === 'דולג' && prog?.skipReason
            ? `<div style="margin-bottom:8px;padding:6px 10px;background:#f3f4f6;border-radius:6px;font-size:12px;"><strong>סיבת דילוג:</strong> ${escapeHtml(prog.skipReason)}</div>`
            : ''
        }
        ${
          criteriaRows
            ? `<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px;">${criteriaRows}</table>`
            : ''
        }
        ${itemRows}
        ${
          assessment?.transcription
            ? `<div style="margin-top:8px;font-size:12px;"><strong>תמלול דברי הילד/ה:</strong> ${escapeHtml(assessment.transcription)}</div>`
            : ''
        }
        ${
          assessment?.notes
            ? `<div style="margin-top:6px;font-size:12px;"><strong>הערות גננת:</strong> ${escapeHtml(assessment.notes)}</div>`
            : ''
        }
        ${
          taskRecordings.length > 0
            ? `<div style="margin-top:6px;font-size:11px;color:#57534e;">🎙 קיימות ${taskRecordings.length} הקלטות שמע מקומיות (שמורות בגיבוי המכשיר)</div>`
            : ''
        }
      </div>
    `;
  }).join('');

  return `
    <div dir="rtl" lang="he" style="font-family:'Rubik','Heebo','Noto Sans Hebrew','Arial Hebrew',Tahoma,sans-serif;color:#292524;background:#ffffff;padding:24px;width:760px;box-sizing:border-box;line-height:1.5;">
      <div style="border-bottom:3px solid #f59e0b;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div>
          <h1 style="margin:0;font-size:24px;color:#9a3412;">הכפר של החברים — דוח הערכה חינוכית</h1>
          <div style="font-size:13px;color:#78716c;margin-top:2px;">תחום: בית הסיפורים (שפה וסיפור)</div>
        </div>
        <div style="text-align:left;font-size:12px;color:#57534e;">
          הופק בתאריך: ${escapeHtml(new Date().toLocaleDateString('he-IL'))}
        </div>
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:18px;">
        <div style="font-size:15px;"><strong>שם הילד/ה:</strong> ${escapeHtml(profile.childName)}</div>
        <div style="font-size:13px;margin-top:4px;"><strong>תאריך הערכה:</strong> ${escapeHtml(profile.assessmentDate)}</div>
        ${
          profile.notes
            ? `<div style="font-size:13px;margin-top:4px;"><strong>הערות כלליות:</strong> ${escapeHtml(profile.notes)}</div>`
            : ''
        }
      </div>

      <div style="display:flex;gap:12px;margin-bottom:18px;">
        <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:10px 12px;">
          <h2 style="margin:0 0 6px 0;font-size:14px;color:#166534;">חוזקות שעלו מהתצפיות</h2>
          ${
            strengths.length > 0
              ? `<ul style="margin:0;padding-right:16px;font-size:12px;">${strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
              : `<div style="font-size:12px;color:#57534e;">טרם תועדו תצפיות המסווגות כחוזקה.</div>`
          }
        </div>
        <div style="flex:1;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:10px 12px;">
          <h2 style="margin:0 0 6px 0;font-size:14px;color:#9a3412;">תחומים לחיזוק והמשך תיווך</h2>
          ${
            areasForSupport.length > 0
              ? `<ul style="margin:0;padding-right:16px;font-size:12px;">${areasForSupport.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
              : `<div style="font-size:12px;color:#57534e;">לא תועדו תחומים הדורשים חיזוק נוסף בשלב זה.</div>`
          }
        </div>
      </div>

      <h2 style="font-size:17px;color:#78350f;margin:0 0 10px 0;">פירוט לפי משימות</h2>
      ${taskSections}

      <div style="margin-top:16px;padding-top:10px;border-top:1px solid #e7e5e4;font-size:11px;color:#78716c;">
        דוח זה מבוסס אך ורק על התצפיות והתיעוד שהוזנו במכשיר המקומי. המידע נשמר מקומית בלבד.
      </div>
    </div>
  `;
}

export async function generateAssessmentPdf(bundle: ReportBundle): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.zIndex = '-1';
  container.innerHTML = buildReportHtml(bundle);
  document.body.appendChild(container);

  try {
    const target = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    const safeName = bundle.profile.childName.replace(/[^\u0590-\u05FFa-zA-Z0-9_-]/g, '_');
    const filename = `הכפר_של_החברים_${safeName}_${bundle.profile.assessmentDate}.pdf`;
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
