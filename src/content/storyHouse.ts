import type { TaskId, TaskMetadata } from '../types/domain';

export const STORY_HOUSE_TASKS: TaskMetadata[] = [
  {
    id: 'naming',
    title: 'פעילות 1: שיום תמונות',
    shortTitle: 'שיום תמונות',
    activityGroup: 'שיום תמונות',
    description: 'זיהוי ושיום של 10 תמונות: בעלי חיים, חפצים ופעולות.',
    estimatedMinutes: 5,
    supportsRecording: false,
  },
  {
    id: 'sequencing_a',
    title: 'פעילות 2א: סיפור ברצף (3 תמונות)',
    shortTitle: 'רצף — 3 תמונות',
    activityGroup: 'סיפור ברצף',
    description: 'סידור 3 תמונות לפי סדר ההתרחשות וסיפור הסיפור במילים.',
    estimatedMinutes: 4,
    supportsRecording: true,
  },
  {
    id: 'sequencing_b',
    title: 'פעילות 2ב: סיפור ברצף (4 תמונות)',
    shortTitle: 'רצף — 4 תמונות',
    activityGroup: 'סיפור ברצף',
    description: 'סידור 4 תמונות לפי סדר ההתרחשות וסיפור הסיפור במילים.',
    estimatedMinutes: 5,
    supportsRecording: true,
  },
  {
    id: 'listening',
    title: 'פעילות 3: הבנת הנשמע',
    shortTitle: 'הבנת הנשמע',
    activityGroup: 'הבנת הנשמע',
    description: 'האזנה לסיפור קצר ומענה על 5 שאלות הבנה.',
    estimatedMinutes: 6,
    supportsRecording: false,
  },
  {
    id: 'verbal_questions',
    title: 'פעילות 4א: שאלות הבנה מילולית',
    shortTitle: 'שאלות הבנה',
    activityGroup: 'הבנה מילולית',
    description: '5 שאלות "למה" ו"מה קורה אם" מחיי היומיום.',
    estimatedMinutes: 4,
    supportsRecording: true,
  },
  {
    id: 'verbal_riddles',
    title: 'פעילות 4ב: חידות',
    shortTitle: 'חידות',
    activityGroup: 'הבנה מילולית',
    description: '5 חידות קצרות לפיתוח חשיבה מילולית והסקה.',
    estimatedMinutes: 4,
    supportsRecording: true,
  },
  {
    id: 'verbal_vocabulary',
    title: 'פעילות 4ג: אוצר מילים והגדרות',
    shortTitle: 'אוצר מילים',
    activityGroup: 'הבנה מילולית',
    description: 'הסבר משמעות ומאפיינים של 5 מילים מוכרות.',
    estimatedMinutes: 5,
    supportsRecording: true,
  },
  {
    id: 'picture_description',
    title: 'פעילות 5: מדרש תמונה',
    shortTitle: 'מדרש תמונה',
    activityGroup: 'מדרש תמונה',
    description: 'תיאור חופשי של תמונה עשירה בדמויות, חפצים ופעולות.',
    estimatedMinutes: 5,
    supportsRecording: true,
  },
];

export function getTaskMetadata(taskId: TaskId): TaskMetadata {
  const found = STORY_HOUSE_TASKS.find((t) => t.id === taskId);
  if (!found) {
    throw new Error(`Unknown taskId: ${taskId}`);
  }
  return found;
}

export interface PictureNamingItem {
  id: string;
  targetWord: string;
  category: 'בעלי חיים' | 'חפצים' | 'פעולות';
  illustrationKey:
    | 'dog'
    | 'butterfly'
    | 'frog'
    | 'elephant'
    | 'key'
    | 'umbrella'
    | 'cup'
    | 'bicycle'
    | 'jumping'
    | 'reading';
  teacherPrompt: string;
  teacherHint: string;
}

export const PICTURE_NAMING_ITEMS: PictureNamingItem[] = [
  {
    id: 'naming-dog',
    targetWord: 'כלב',
    category: 'בעלי חיים',
    illustrationKey: 'dog',
    teacherPrompt: 'מה רואים בתמונה?',
    teacherHint: 'חיה שנובחת ואוהבת לשחק',
  },
  {
    id: 'naming-butterfly',
    targetWord: 'פרפר',
    category: 'בעלי חיים',
    illustrationKey: 'butterfly',
    teacherPrompt: 'מה רואים בתמונה?',
    teacherHint: 'חרק צבעוני שעף מפרח לפרח',
  },
  {
    id: 'naming-frog',
    targetWord: 'צפרדע',
    category: 'בעלי חיים',
    illustrationKey: 'frog',
    teacherPrompt: 'מה רואים בתמונה?',
    teacherHint: 'חיה ירוקה שקופצת ליד הבריכה',
  },
  {
    id: 'naming-elephant',
    targetWord: 'פיל',
    category: 'בעלי חיים',
    illustrationKey: 'elephant',
    teacherPrompt: 'מה רואים בתמונה?',
    teacherHint: 'חיה גדולה עם חדק ארוך ואוזניים גדולות',
  },
  {
    id: 'naming-key',
    targetWord: 'מפתח',
    category: 'חפצים',
    illustrationKey: 'key',
    teacherPrompt: 'מה זה?',
    teacherHint: 'משתמשים בו כדי לפתוח דלת',
  },
  {
    id: 'naming-umbrella',
    targetWord: 'מטרייה',
    category: 'חפצים',
    illustrationKey: 'umbrella',
    teacherPrompt: 'מה זה?',
    teacherHint: 'מחזיקים מעל הראש כשיורד גשם',
  },
  {
    id: 'naming-cup',
    targetWord: 'כוס',
    category: 'חפצים',
    illustrationKey: 'cup',
    teacherPrompt: 'מה זה?',
    teacherHint: 'שותים ממנה מים או חלב',
  },
  {
    id: 'naming-bicycle',
    targetWord: 'אופניים',
    category: 'חפצים',
    illustrationKey: 'bicycle',
    teacherPrompt: 'מה רואים בתמונה?',
    teacherHint: 'כלי תחבורה עם שני גלגלים שרוכבים עליו',
  },
  {
    id: 'naming-jumping',
    targetWord: 'קופץ',
    category: 'פעולות',
    illustrationKey: 'jumping',
    teacherPrompt: 'מה הילד עושה?',
    teacherHint: 'עולה באוויר מעל השלולית / החבל',
  },
  {
    id: 'naming-reading',
    targetWord: 'קוראת',
    category: 'פעולות',
    illustrationKey: 'reading',
    teacherPrompt: 'מה הילדה עושה?',
    teacherHint: 'מסתכלת בספר ומספרת מה כתוב בו',
  },
];

export interface SequenceCard {
  id: string;
  illustrationKey:
    | 'seed-plant'
    | 'seed-water'
    | 'seed-bloom'
    | 'picnic-pack'
    | 'picnic-walk'
    | 'picnic-blanket'
    | 'picnic-eat';
  teacherCaption: string;
}

export interface StorySequenceLevel {
  taskId: 'sequencing_a' | 'sequencing_b';
  title: string;
  childInstruction: string;
  cards: SequenceCard[];
  expectedOrder: string[];
  initialShuffledOrder: string[];
}

export const STORY_SEQUENCES: Record<'sequencing_a' | 'sequencing_b', StorySequenceLevel> = {
  sequencing_a: {
    taskId: 'sequencing_a',
    title: 'הפרח של תולי',
    childInstruction: 'גרור את התמונות וסדר אותן מהתחלה ועד הסוף. אחר כך ספר לי את הסיפור!',
    cards: [
      {
        id: 'seq-a-1',
        illustrationKey: 'seed-plant',
        teacherCaption: 'תולי שותל זרע קטן בעציץ עם אדמה',
      },
      {
        id: 'seq-a-2',
        illustrationKey: 'seed-water',
        teacherCaption: 'תולי משקה את העציץ במזלף והנבט מציץ',
      },
      {
        id: 'seq-a-3',
        illustrationKey: 'seed-bloom',
        teacherCaption: 'השמש זורחת והפרח פורח במלוא הדרו',
      },
    ],
    expectedOrder: ['seq-a-1', 'seq-a-2', 'seq-a-3'],
    initialShuffledOrder: ['seq-a-2', 'seq-a-3', 'seq-a-1'],
  },
  sequencing_b: {
    taskId: 'sequencing_b',
    title: 'הפיקניק של אורי',
    childInstruction: 'סדר את ארבע התמונות לפי הסדר הנכון, וספר מה קרה בפיקניק של אורי!',
    cards: [
      {
        id: 'seq-b-1',
        illustrationKey: 'picnic-pack',
        teacherCaption: 'אורי אורז תפוחים ומיץ לתוך סל פיקניק בבית',
      },
      {
        id: 'seq-b-2',
        illustrationKey: 'picnic-walk',
        teacherCaption: 'אורי צועד בשביל הכפר עם סל הפיקניק',
      },
      {
        id: 'seq-b-3',
        illustrationKey: 'picnic-blanket',
        teacherCaption: 'אורי פורש שמיכה משובצת על הדשא ומניח את האוכל',
      },
      {
        id: 'seq-b-4',
        illustrationKey: 'picnic-eat',
        teacherCaption: 'אורי ותולי יושבים יחד על השמיכה ואוכלים בשמחה',
      },
    ],
    expectedOrder: ['seq-b-1', 'seq-b-2', 'seq-b-3', 'seq-b-4'],
    initialShuffledOrder: ['seq-b-3', 'seq-b-1', 'seq-b-4', 'seq-b-2'],
  },
};

export interface ListeningQuestion {
  id: string;
  aspect: string;
  question: string;
  expectedElements: string;
}

export interface ListeningStoryConfig {
  id: string;
  title: string;
  isPlaceholderAudio: boolean;
  placeholderNotice: string;
  /** Optional path to a real prerecorded audio file in /public/audio/ when provided */
  audioUrl?: string;
  /** Script so the teacher can read the story aloud if needed while placeholder audio is active */
  storyScriptForTeacher: string;
  questions: ListeningQuestion[];
}

export const LISTENING_STORY: ListeningStoryConfig = {
  id: 'story-umbrella-fox',
  title: 'המטרייה האדומה של אורי',
  isPlaceholderAudio: true,
  placeholderNotice:
    'הקלטת דמה זמנית (צלילי סיפור מובנים). ניתן להחליף בקובץ שמע מוקלט מראש דרך קובץ התוכן, או להקריא לילד ישירות מהטקסט המצורף.',
  storyScriptForTeacher:
    'בבוקר סגרירי יצא אורי השועל מביתו עם מטרייה אדומה גדולה. בדרך פגש את ציפי הציפור שישבה על ספסל ורעדה מקור בגלל הגשם. אורי פתח את המטרייה האדומה והזמין את ציפי להתחבא איתו מתחתיה. כשהגשם פסק והשמש יצאה, ראו השניים קשת צבעונית בשמיים וחייכו זה לזה.',
  questions: [
    {
      id: 'listen-q1',
      aspect: 'דמויות בסיפור',
      question: 'מי היו הדמויות בסיפור?',
      expectedElements: 'אורי השועל וציפי הציפור',
    },
    {
      id: 'listen-q2',
      aspect: 'פרטים ואירועים גלויים',
      question: 'איזה חפץ לקח אורי כשהוא יצא מהבית?',
      expectedElements: 'מטרייה אדומה (גדולה)',
    },
    {
      id: 'listen-q3',
      aspect: 'רצף אירועים',
      question: 'מה קרה אחרי שהגשם פסק?',
      expectedElements: 'השמש יצאה וראו קשת צבעונית בשמיים',
    },
    {
      id: 'listen-q4',
      aspect: 'סיבה ותוצאה',
      question: 'למה ציפי הציפור רעדה על הספסל?',
      expectedElements: 'כי ירד גשם והיה לה קר / הייתה רטובה',
    },
    {
      id: 'listen-q5',
      aspect: 'הסקה פשוטה',
      question: 'איך לדעתך הרגישה ציפי כשאורי שיתף איתה את המטרייה?',
      expectedElements: 'שמחה, מוגנת, מודה לאורי, רגועה',
    },
  ],
};

export interface VerbalQuestionItem {
  id: string;
  prompt: string;
  expectedConcept: string;
}

export const VERBAL_QUESTIONS: VerbalQuestionItem[] = [
  {
    id: 'vq-1',
    prompt: 'למה צריך גדר בגן?',
    expectedConcept: 'שמירה על בטיחות הילדים, שלא ייצאו לכביש / שזרים לא ייכנסו',
  },
  {
    id: 'vq-2',
    prompt: 'למה שוטפים ידיים לפני שאוכלים?',
    expectedConcept: 'להסיר לכלוך וחיידקים כדי לשמור על הבריאות והניקיון',
  },
  {
    id: 'vq-3',
    prompt: 'מה עושים אם מתחיל לרדת גשם כשאנחנו בדרך לגן?',
    expectedConcept: 'פותחים מטרייה, לובשים מעיל/מגפיים, מוצאים מחסה',
  },
  {
    id: 'vq-4',
    prompt: 'למה כדאי להחזיר צעצועים למקום אחרי שמשחקים?',
    expectedConcept: 'כדי שהחדר יהיה מסודר, שלא נדרוך עליהם ונמצא אותם בפעם הבאה',
  },
  {
    id: 'vq-5',
    prompt: 'למה שמים אוכל במקרר?',
    expectedConcept: 'כדי שיישאר קר וטרי ולא יתקלקל',
  },
];

export const VERBAL_RIDDLES: VerbalQuestionItem[] = [
  {
    id: 'vr-1',
    prompt: 'מי נותנת לנו חלב?',
    expectedConcept: 'פרה (או עז)',
  },
  {
    id: 'vr-2',
    prompt: 'אני עגול, צהוב וחם, ואני מאיר בשמיים ביום. מי אני?',
    expectedConcept: 'השמש',
  },
  {
    id: 'vr-3',
    prompt: 'יש לי דפים וכריכה, ואפשר לקרוא בי סיפורים לפני השינה. מה אני?',
    expectedConcept: 'ספר',
  },
  {
    id: 'vr-4',
    prompt: 'אני עף בשמיים עם כנפיים צבעוניות, ואוהב לנחות על פרחים. מי אני?',
    expectedConcept: 'פרפר',
  },
  {
    id: 'vr-5',
    prompt: 'אני יורד מהעננים בחורף, משקה את העצים והפרחים ויוצר שלוליות. מי אני?',
    expectedConcept: 'גשם',
  },
];

export const VERBAL_VOCABULARY: VerbalQuestionItem[] = [
  {
    id: 'vv-1',
    prompt: 'תרנגול',
    expectedConcept: 'בעל חיים / עוף, גר בלול, יש לו כרבולת ונוצות, קורא קוקוריקו בבוקר',
  },
  {
    id: 'vv-2',
    prompt: 'סולם',
    expectedConcept: 'חפץ / כלי עבודה, עשויים שלבים, מטפסים עליו כדי להגיע למקום גבוה',
  },
  {
    id: 'vv-3',
    prompt: 'תפוח',
    expectedConcept: 'פרי, גדל על עץ, עגול ומתוק/חמוץ, צבע אדום/ירוק/צהוב, אוכלים אותו',
  },
  {
    id: 'vv-4',
    prompt: 'מעיל',
    expectedConcept: 'בגד שלובשים בחורף כשקר, עם שרוולים ורוכסן/כפתורים, מחמם את הגוף',
  },
  {
    id: 'vv-5',
    prompt: 'רכבת',
    expectedConcept: 'כלי תחבורה ארוך עם קרונות, נוסעת על פסים מתחנה לתחנה, מסיעה נוסעים',
  },
];

export const PICTURE_DESCRIPTION_CONFIG = {
  id: 'village-park-scene',
  title: 'יום שמח בפארק של הכפר',
  childInstruction: 'תסתכל על התמונה ותספר לי מה אתה רואה.',
  teacherObservationHints: [
    'דמויות: אורי השועל מצייר/מנגן, תולי הארנב משקה פרחים, דובי דוחף עגלת תפוחים, ציפי על העץ, ילדים משחקים בכדור.',
    'חפצים: עץ תפוחים, ספסל, בריכה עם ברווז, עפיפון בשמיים, שמש, מזלף.',
    'יחסים ופעולות: שיתוף פעולה, סיבה ותוצאה, ארגון הסיפור במרחב.',
  ],
};
