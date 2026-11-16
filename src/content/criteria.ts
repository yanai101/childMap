import type { AssessmentCriterion, TaskId } from '../types/domain';

export const NOT_ASSESSED_LABEL = 'לא נבדק';

const SEQUENCING_CRITERIA: AssessmentCriterion[] = [
  {
    id: 'chronological_order',
    title: 'סידור כרונולוגי',
    levels: [
      { id: 'independent', label: 'מסדר רצף מדויק באופן עצמאי', description: 'הילד מסדר את כל התמונות מהתחלה ועד הסוף ללא עזרה.' },
      { id: 'with_cue', label: 'מסדר רצף לאחר רמז או הכוונה', description: 'זקוק לשאלה מכוונת אחת או יותר כדי למצוא את הסדר.' },
      { id: 'partial', label: 'סדר חלקי / קושי ברצף הזמן', description: 'מחבר חלק מהתמונות אך מתקשה בארגון הכרונולוגי המלא.' },
    ],
  },
  {
    id: 'logical_connections',
    title: 'קשרים לוגיים בין אירועים',
    levels: [
      { id: 'clear', label: 'קושר בין סיבה לתוצאה באופן ברור', description: 'משתמש במילות קישור ("ואז", "בגלל", "כדי") ומסביר את הקשר.' },
      { id: 'emerging', label: 'קישור בסיסי בין התמונות', description: 'מציין אירועים סמוכים אך הקשר הסיבתי אינו תמיד מפורש.' },
      { id: 'isolated', label: 'מתאר כל תמונה בנפרד', description: 'תיאור נקודתי של תמונות בודדות ללא חיבור עלילתי ביניהן.' },
    ],
  },
  {
    id: 'story_coherence',
    title: 'קוהרנטיות הסיפור',
    levels: [
      { id: 'coherent', label: 'סיפור רציף, ברור ומלא', description: 'בעל פתיחה, אמצע וסוף מובנים למאזין.' },
      { id: 'developing', label: 'סיפור מובן ברובו עם פערים קלים', description: 'ניתן לעקוב אחר העלילה אך חסרים פרטים מקשרים.' },
      { id: 'fragmented', label: 'סיפור קטוע או לא רציף', description: 'קשה לעקוב אחר רצף העלילה ללא תיווך צמוד.' },
    ],
  },
  {
    id: 'vocabulary',
    title: 'אוצר מילים',
    levels: [
      { id: 'rich', label: 'מגוון, מדויק ותואם גיל', description: 'שימוש בשמות עצם, פעלים ותארים מתאימים להקשר.' },
      { id: 'adequate', label: 'בסיסי ופונקציונלי', description: 'שימוש במילים שכיחות, לעיתים כלליות ("זה", "עושה").' },
      { id: 'limited', label: 'מצומצם / שליפה מאומצת', description: 'מיעוט מילים או קושי בשליפת מילים מתאימות.' },
    ],
  },
  {
    id: 'sentence_structure',
    title: 'מבנה משפט',
    levels: [
      { id: 'complex', label: 'משפטים מורכבים ומלאים', description: 'משפטים תקינים תחבירית עם הרחבות וקישורים.' },
      { id: 'simple', label: 'משפטים פשוטים ותקינים', description: 'משפטים קצרים בני 3–5 מילים, תקינים ברובם.' },
      { id: 'telegraphic', label: 'צירופי מילים / מבעים קצרים מאוד', description: 'מילים בודדות או משפטים חסרים.' },
    ],
  },
  {
    id: 'independence',
    title: 'עצמאות וצורך בתיווך',
    levels: [
      { id: 'independent', label: 'ביצוע עצמאי מלא', description: 'ניגש למשימה ומספר באופן עצמאי.' },
      { id: 'light_support', label: 'זקוק לעידוד או שאלה פותחת', description: 'מתחיל או ממשיך בקלות לאחר תיווך קל.' },
      { id: 'high_support', label: 'זקוק לתיווך מתמשך', description: 'נדרשות שאלות מנחות לאורך רוב המשימה.' },
    ],
  },
];

export const TASK_CRITERIA: Record<TaskId, AssessmentCriterion[]> = {
  naming: [
    {
      id: 'naming_fluency',
      title: 'שליפה ושיום כללי',
      levels: [
        { id: 'fluent', label: 'שליפה מהירה ומדויקת ברוב הפריטים', description: 'מזהה ומשיים בביטחון ובקלות.' },
        { id: 'cued', label: 'נעזר ברמזים סמנטיים או פונולוגיים', description: 'זקוק לרמז מדי פעם אך מצליח להגיע למילה.' },
        { id: 'effortful', label: 'מאמץ ניכר בשליפה / החלפות מילים', description: 'מתקשה לשלוף מילים מוכרות או מחליף במילים כלליות.' },
      ],
    },
  ],
  sequencing_a: SEQUENCING_CRITERIA,
  sequencing_b: SEQUENCING_CRITERIA,
  listening: [
    {
      id: 'explicit_details',
      title: 'הבנת פרטים ואירועים גלויים',
      levels: [
        { id: 'accurate', label: 'זוכר ומציין פרטים מדויקים מהסיפור', description: 'משיב בדיוק על דמויות ואירועים מרכזיים.' },
        { id: 'partial', label: 'זוכר חלק מהפרטים', description: 'זקוק לחזרה קצרה או לרמז.' },
        { id: 'minimal', label: 'קושי בשחזור פרטים', description: 'מתקשה להיזכר בפרטים גם לאחר תיווך.' },
      ],
    },
    {
      id: 'cause_and_inference',
      title: 'סיבה ותוצאה והסקה פשוטה',
      levels: [
        { id: 'clear', label: 'מבין קשרים סיבתיים ומסיק מסקנות', description: 'מסביר "למה" ורגשות דמויות בהקשר.' },
        { id: 'emerging', label: 'הסקה בסיסית בתיווך', description: 'מזהה קשרים ברורים כשנשאל ישירות.' },
        { id: 'concrete', label: 'התייחסות מילולית מוגבלת לפרטים גלויים', description: 'מתקשה לחרוג מהנראה/הנשמע במפורש.' },
      ],
    },
    {
      id: 'listening_attention',
      title: 'קשב בהאזנה',
      levels: [
        { id: 'sustained', label: 'קשב רציף לאורך הסיפור', description: 'מאזין בריכוז מההתחלה ועד הסוף.' },
        { id: 'fluctuating', label: 'קשב משתנה / נדרש מיקוד', description: 'מוסח לרגעים אך חוזר להאזין.' },
        { id: 'distracted', label: 'קושי לשמור על קשב בהאזנה', description: 'מתקשה להתמקד לאורך ההקלטה.' },
      ],
    },
  ],
  verbal_questions: [
    {
      id: 'causal_reasoning',
      title: 'הבנת סיבתיות והיגיון יומיומי',
      levels: [
        { id: 'reasoned', label: 'מנמק באופן הגיוני ומותאם', description: 'מספק הסבר ברור לשאלות "למה" ו"מה קורה אם".' },
        { id: 'partial', label: 'תשובה חלקית / זקוק להכוונה', description: 'מבין את הרעיון הכללי אך מתקשה לנסח נימוק מלא.' },
        { id: 'literal', label: 'קושי בנימוק מילולי', description: 'מתקשה להשיב באופן מותאם לשאלה.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות במענה',
      levels: [
        { id: 'independent', label: 'עונה באופן עצמאי', description: 'אינו זקוק לפירוק השאלה.' },
        { id: 'cued', label: 'נעזר בשאלת המשך או דוגמה', description: 'מצליח לאחר פישוט קל של השאלה.' },
        { id: 'dependent', label: 'זקוק לתיווך משמעותי', description: 'מתקשה לענות ללא הכוונה צמודה.' },
      ],
    },
  ],
  verbal_riddles: [
    {
      id: 'verbal_inference',
      title: 'הסקה מילולית מרמזים',
      levels: [
        { id: 'independent', label: 'מסיק ופותח חידות באופן עצמאי', description: 'מחבר בין הרמזים למושג הנכון.' },
        { id: 'cued', label: 'פותר חידות לאחר רמז נוסף', description: 'נעזר בחידוד או ברמז ויזואלי/מילולי.' },
        { id: 'struggling', label: 'קושי בחיבור הרמזים', description: 'נוטה להתמקד ברמז אחד בלבד או מנחש.' },
      ],
    },
  ],
  verbal_vocabulary: [
    {
      id: 'word_meaning',
      title: 'משמעות המילה',
      levels: [
        { id: 'accurate', label: 'מדייק בהבנת משמעות המילה', description: 'מציג הבנה ברורה של המושג.' },
        { id: 'partial', label: 'הבנה חלקית או אינטואיטיבית', description: 'מכיר את המילה אך ההסבר כללי.' },
        { id: 'unclear', label: 'אינו מכיר / הסבר לא מדויק', description: 'קושי להבהיר מהי המילה.' },
      ],
    },
    {
      id: 'category_knowledge',
      title: 'ידע קטגוריאלי',
      levels: [
        { id: 'explicit', label: 'מציין קטגוריה מתאימה', description: 'למשל: "בעל חיים", "פרי", "כלי תחבורה".' },
        { id: 'implicit', label: 'קטגוריה מרומזת בלבד', description: 'מתייחס לשימוש או מקום ללא שם הקטגוריה.' },
        { id: 'absent', label: 'ללא התייחסות לקטגוריה', description: 'אינו משייך לקבוצה.' },
      ],
    },
    {
      id: 'attributes',
      title: 'תכונות ומאפיינים',
      levels: [
        { id: 'detailed', label: 'מתאר מראה, חלקים או שימוש', description: 'מוסיף תכונות מבחינות (צבע, צורה, פעולה).' },
        { id: 'basic', label: 'מאפיין בודד או כללי', description: 'מציין פרט אחד מרכזי.' },
        { id: 'minimal', label: 'מיעוט מאפיינים', description: 'כמעט ואינו מפרט תכונות.' },
      ],
    },
    {
      id: 'associations',
      title: 'אסוציאציות רלוונטיות',
      levels: [
        { id: 'relevant', label: 'מקשר להקשרים מתאימים מחיי היומיום', description: 'מוסיף דוגמאות וקשרים הגיוניים.' },
        { id: 'tangential', label: 'אסוציאציות כלליות או אישיות', description: 'הקשר רופף אך קיים.' },
        { id: 'off_topic', label: 'ללא אסוציאציות / גלישה מהנושא', description: 'מתקשה לקשר להקשר מתאים.' },
      ],
    },
    {
      id: 'explanation_depth',
      title: 'עומק ההסבר',
      levels: [
        { id: 'rich', label: 'הסבר עשיר ורב-ממדי', description: 'משלב כמה היבטים (קטגוריה, תכונה, תפקיד).' },
        { id: 'moderate', label: 'הסבר תמציתי אך מובן', description: 'מספק מידע בסיסי מספק.' },
        { id: 'brief', label: 'הסבר קצר מאוד / מילה בודדת', description: 'תשובה מינימלית.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות',
      levels: [
        { id: 'independent', label: 'מסביר ביוזמתו ללא שאלות מנחות', description: 'מרחיב באופן חופשי.' },
        { id: 'prompted', label: 'מרחיב בעקבות שאלות מנחות', description: 'עונה כששואלים "איפה רואים את זה?", "מה עושים עם זה?".' },
        { id: 'dependent', label: 'זקוק לתיווך רב', description: 'מתקשה להוסיף מידע גם עם שאלות.' },
      ],
    },
  ],
  picture_description: [
    {
      id: 'vocabulary',
      title: 'אוצר מילים',
      levels: [
        { id: 'rich', label: 'עשיר ומגוון (שמות עצם, פעלים ותארים)', description: 'משתמש במילים מדויקות לתיאור הסצנה.' },
        { id: 'adequate', label: 'בסיסי ותואם', description: 'מזהה פריטים מרכזיים במילים שכיחות.' },
        { id: 'limited', label: 'מצומצם / שימוש במילים כלליות', description: 'מצביע ואומר "הנה זה" או מילים בודדות.' },
      ],
    },
    {
      id: 'sentence_structure',
      title: 'מבנה משפט',
      levels: [
        { id: 'complex', label: 'משפטים מלאים ומורכבים', description: 'שימוש תקין בפעלים, מילות יחס וקישור.' },
        { id: 'simple', label: 'משפטים פשוטים', description: 'משפטים קצרים ותקינים לרוב.' },
        { id: 'fragmented', label: 'מילים בודדות / צירופים חלקיים', description: 'רשימת פריטים ללא בניית משפט.' },
      ],
    },
    {
      id: 'relevant_details',
      title: 'פרטים רלוונטיים',
      levels: [
        { id: 'comprehensive', label: 'מבחין בדמויות, פעולות ופרטי רקע', description: 'סורק את התמונה ומאתר פרטים מגוונים.' },
        { id: 'main_only', label: 'מתמקד בדמויות המרכזיות בלבד', description: 'מתאר חלק מהסצנה.' },
        { id: 'minimal', label: 'מציין פרטים בודדים', description: 'פספוס של מרבית ההתרחשויות בתמונה.' },
      ],
    },
    {
      id: 'event_relationships',
      title: 'קשרים בין אירועים ודמויות',
      levels: [
        { id: 'connected', label: 'מקשר בין דמויות, פעולות וכוונות', description: 'מפרש מה קורה ביניהם ומדוע.' },
        { id: 'partial', label: 'קישור חלקי', description: 'מתאר פעולות אך לעיתים בנפרד.' },
        { id: 'isolated', label: 'מתאר פריטים מבודדים ללא קשר', description: 'מונה עצמים ללא עלילה או קשר.' },
      ],
    },
    {
      id: 'organization',
      title: 'ארגון התיאור',
      levels: [
        { id: 'organized', label: 'תיאור מאורגן ושיטתי', description: 'עובר באופן מסודר מאזור לאזור או מנושא לנושא.' },
        { id: 'semi_organized', label: 'ארגון חלקי', description: 'מדלג בין חלקי התמונה אך נשאר מובן.' },
        { id: 'scattered', label: 'תיאור מפוזר / אקראי', description: 'קופץ מפרט לפרט ללא רצף ברור.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'מתאר בשטף וביוזמה עצמית', description: 'ממשיך לתאר ללא צורך בהנחיה.' },
        { id: 'cued', label: 'זקוק לשאלות מכוונות ("מה עוד רואים?")', description: 'מרחיב יפה לאחר עידוד.' },
        { id: 'high_support', label: 'זקוק להצבעה והנחיה צמודה', description: 'עונה רק לשאלות ממוקדות.' },
      ],
    },
  ],
};

export const ITEM_PERFORMANCE_LEVELS: Record<
  'listening' | 'verbal_questions' | 'verbal_riddles' | 'verbal_vocabulary',
  string[]
> = {
  listening: [
    'מענה מדויק ומלא',
    'מענה חלקי / כללי',
    'מענה לאחר רמז או תיווך',
    'מענה לא תואם / אין תגובה',
    NOT_ASSESSED_LABEL,
  ],
  verbal_questions: [
    'הסבר מילולי מנומק ומותאם',
    'הסבר חלקי / זקוק לתיווך',
    'תשובה לא מותאמת / ללא תגובה',
    NOT_ASSESSED_LABEL,
  ],
  verbal_riddles: [
    'פתרון עצמאי ומדויק',
    'פתרון לאחר רמז',
    'קושי בהסקה / תשובה שגויה',
    NOT_ASSESSED_LABEL,
  ],
  verbal_vocabulary: [
    'הגדרה עשירה ומדויקת',
    'הגדרה בסיסית / חלקית',
    'זקוק לתיווך / תיאור מצומצם',
    NOT_ASSESSED_LABEL,
  ],
};
