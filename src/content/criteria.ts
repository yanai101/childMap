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
  math_oral_counting: [
    {
      id: 'sequence_stability',
      title: 'יציבות רצף המספרים',
      levels: [
        { id: 'stable', label: 'רצף יציב ומסודר לאורך הספירה', description: 'סופר ברצף עולה עקבי ללא בלבול בסדר.' },
        { id: 'mostly_stable', label: 'רצף יציב ברובו עם מעידות קלות', description: 'דילוג או היפוך בודד במספרים גבוהים יותר.' },
        { id: 'unstable', label: 'רצף לא יציב / קפיצות מרובות', description: 'מתקשה לשמור על סדר המספרים.' },
      ],
    },
    {
      id: 'accuracy',
      title: 'דיוק בספירה',
      levels: [
        { id: 'accurate', label: 'ספירה מדויקת ללא השמטות או חזרות', description: 'כל המספרים נאמרים במדויק.' },
        { id: 'minor_errors', label: 'טעויות קלות בספירה', description: 'השמטה או חזרה נקודתית.' },
        { id: 'frequent_errors', label: 'טעויות תכופות ברצף', description: 'השמטות, חזרות או החלפות רבות.' },
      ],
    },
    {
      id: 'continuity',
      title: 'רציפות',
      levels: [
        { id: 'fluent', label: 'ספירה רציפה ושוטפת', description: 'סופר בקצב אחיד ללא עצירות ממושכות.' },
        { id: 'hesitant', label: 'ספירה עם עצירות קלות לחשיבה', description: 'עוצר מדי פעם וממשיך.' },
        { id: 'fragmented', label: 'ספירה קטועה', description: 'נעצר לעיתים קרובות ומתקשה להמשיך.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'סופר באופן עצמאי לחלוטין', description: 'מתחיל וממשיך ללא עזרה.' },
        { id: 'cued', label: 'נעזר בהתחלה או בעידוד קל', description: 'זקוק לפתיחה משותפת ("1, 2...") או עידוד.' },
        { id: 'high_support', label: 'זקוק לתיווך מתמשך', description: 'נדרשת עזרה חוזרת להמשך הספירה.' },
      ],
    },
  ],
  math_counting_objects: [
    {
      id: 'one_to_one',
      title: 'התאמה חד-חד ערכית',
      levels: [
        { id: 'consistent', label: 'מצביע/מונה כל חפץ פעם אחת בדיוק', description: 'התאמה מדויקת בין מילת המספר לחפץ.' },
        { id: 'occasional_skip', label: 'סטייה קלה בכמויות הגדולות (7, 9)', description: 'שומר על התאמה ב־4 ו־6 אך מתבלבל קלות ב־7/9.' },
        { id: 'inconsistent', label: 'קושי בהתאמה חד-חד ערכית', description: 'סופר מהר מדי, מדלג או מונה חפץ פעמיים.' },
      ],
    },
    {
      id: 'counting_sequence',
      title: 'רצף מנייה מדויק',
      levels: [
        { id: 'accurate', label: 'שומר על רצף מספרים תקין בכל הפריטים', description: 'סופר 1, 2, 3... בדיוק.' },
        { id: 'partial', label: 'רצף תקין ברוב הפריטים', description: 'טעות רצף קלה באחד הפריטים.' },
        { id: 'needs_support', label: 'קושי בשמירה על רצף המנייה', description: 'מתבלבל בסדר המספרים תוך כדי מנייה.' },
      ],
    },
    {
      id: 'cardinality',
      title: 'הבנת עקרון הקרדינליות (המספר האחרון מייצג את הכמות)',
      levels: [
        { id: 'understood', label: 'מציין מיד את המספר האחרון ככמות הכוללת', description: 'אינו נדרש לספור שוב כשנשאל "אז כמה יש?".' },
        { id: 'emerging', label: 'מבין בחלק מהפריטים / סופר שוב', description: 'לעיתים מונה מחדש במקום לציין את המספר האחרון.' },
        { id: 'not_yet', label: 'טרם מבין שהמספר האחרון הוא הסך הכולל', description: 'אומר מספר שונה או ממשיך למנות.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'מונה ומשיב עצמאית', description: 'מתארגן לבד במנייה.' },
        { id: 'cued', label: 'נעזר בהכוונה לארגון המנייה', description: 'למשל: "בוא נגע בכל תפוח כשסופרים".' },
        { id: 'high_support', label: 'זקוק לתיווך צמוד', description: 'נדרשת מנייה משותפת.' },
      ],
    },
  ],
  math_qty_to_numeral: [
    {
      id: 'quantity_recognition',
      title: 'זיהוי והערכת כמות',
      levels: [
        { id: 'accurate', label: 'מזהה/מונה כמויות בדיוק בשני השלבים', description: 'דיוק בטווח 1–5 וגם 6–10.' },
        { id: 'stage_a_only', label: 'דיוק בטווח 1–5, קושי קל ב־6–10', description: 'שולט בכמויות קטנות ומתקשה בגדולות.' },
        { id: 'developing', label: 'קושי בזיהוי הכמויות', description: 'טעויות במנייה לפני בחירת הספרה.' },
      ],
    },
    {
      id: 'numeral_selection',
      title: 'בחירת ספרה מתאימה',
      levels: [
        { id: 'accurate', label: 'בוחר את הספרה התואמת בדיוק', description: 'מקשר בין הכמות לסמל הספרה.' },
        { id: 'partial', label: 'התאמה חלקית', description: 'מתבלבל לעיתים בין ספרות דומות או סמוכות.' },
        { id: 'incorrect', label: 'קושי בהתאמת הכמות לספרה', description: 'בוחר ספרות שאינן תואמות לכמות.' },
      ],
    },
    {
      id: 'counting_strategy',
      title: 'אסטרטגיית מנייה',
      levels: [
        { id: 'systematic', label: 'סובטיזציה / מנייה מסודרת מימין לשמאל או בשורות', description: 'אסטרטגיה יעילה ומאורגנת.' },
        { id: 'touch_counting', label: 'מנייה באצבע על המסך', description: 'מצביע על כל פריט בקצב עקבי.' },
        { id: 'unsystematic', label: 'ניחוש או מנייה לא מאורגנת', description: 'בוחר מהר ללא מנייה או מתבלבל.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'ביצוע עצמאי', description: 'פועל לבד ללא רמזים.' },
        { id: 'cued', label: 'זקוק לתזכורת לספור לפני בחירה', description: 'מצליח לאחר הכוונה קלה.' },
        { id: 'high_support', label: 'זקוק לתיווך צמוד', description: 'נדרשת עזרה במנייה ובחיפוש הספרה.' },
      ],
    },
  ],
  math_qty_to_qty: [
    {
      id: 'matching_accuracy',
      title: 'דיוק בהתאמת כמויות',
      levels: [
        { id: 'accurate', label: 'מתאים כמויות שוות בדיוק בשני השלבים', description: 'אינו מוטעה מסוג החפץ או הסידור.' },
        { id: 'stage_a_only', label: 'מתאים היטב ב־1–5, קושי ב־6–10', description: 'דיוק בכמויות קטנות בלבד.' },
        { id: 'struggling', label: 'קושי בהתאמת כמות לכמות', description: 'נמשך לסידור חזותי או מנחש.' },
      ],
    },
    {
      id: 'one_to_one_observed',
      title: 'התאמה חד-חד ערכית (כאשר נצפתה)',
      levels: [
        { id: 'observed_accurate', label: 'משתמש במנייה/התאמה מדויקת בין הקבוצות', description: 'מונה את קבוצת היעד ואז בודק את הקבוצות.' },
        { id: 'partial', label: 'התאמה חלקית', description: 'מונה חלק מהקבוצות.' },
        { id: 'not_observed', label: 'לא נצפתה אסטרטגיית התאמה', description: 'מנסה להעריך במבט בלבד.' },
      ],
    },
    {
      id: 'group_comparison',
      title: 'יכולת השוואה בין קבוצות',
      levels: [
        { id: 'systematic', label: 'משווה באופן שיטתי בין הקבוצות', description: 'בודק אפשרויות ומוודא שוויון.' },
        { id: 'impulsive', label: 'בוחר מהר ולעיתים מתקן', description: 'בודק רק חלק מהאפשרויות.' },
        { id: 'difficulty', label: 'מתקשה להשוות בין חפצים שונים', description: 'מוטה מגודל או מצבע.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'עצמאי', description: 'אינו זקוק לתיווך.' },
        { id: 'cued', label: 'נעזר בהכוונה מילולית קלה', description: 'מצליח לאחר הצעה לספור כל קבוצה.' },
        { id: 'high_support', label: 'זקוק לתיווך צמוד', description: 'נדרשת עזרה בהשוואה.' },
      ],
    },
  ],
  math_more_less: [
    {
      id: 'concept_more',
      title: 'הבנת המושג "יותר"',
      levels: [
        { id: 'understood', label: 'מזהה במדויק היכן יש יותר', description: 'מבין את המשמעות הכמותית של "יותר".' },
        { id: 'developing', label: 'מזהה בחלק מהמקרים / בתיווך', description: 'זקוק לחידוד כשסידור החפצים שונה.' },
        { id: 'unclear', label: 'מתקשה בזיהוי "יותר"', description: 'מבלבל עם גודל פיזי או עם "פחות".' },
      ],
    },
    {
      id: 'concept_less',
      title: 'הבנת המושג "פחות"',
      levels: [
        { id: 'understood', label: 'מזהה במדויק היכן יש פחות', description: 'מבין את המשמעות הכמותית של "פחות".' },
        { id: 'developing', label: 'מזהה בתיווך או בפערים גדולים', description: 'זקוק לעידוד לספור.' },
        { id: 'unclear', label: 'מתקשה בזיהוי "פחות"', description: 'נוטה להצביע על הקבוצה הגדולה גם כשנשאל "פחות".' },
      ],
    },
    {
      id: 'concept_equal',
      title: 'הבנת המושג "שווה / אותה כמות"',
      levels: [
        { id: 'understood', label: 'מזהה מצבים של שוויון כמותי', description: 'מבחין שאין יותר או פחות אלא אותו דבר.' },
        { id: 'developing', label: 'מזהה לאחר ספירה משותפת', description: 'מפנים את השוויון עם הכוונה.' },
        { id: 'unclear', label: 'מתקשה לזהות שוויון', description: 'מחפש תמיד צד אחד שגדול יותר.' },
      ],
    },
    {
      id: 'relative_magnitude_gt4',
      title: 'הבנת גודל יחסי ושיום מספרים הגדולים מ־4',
      levels: [
        { id: 'rich', label: 'מציין מספרים רבים הגדולים מ־4 בהבנה ברורה', description: 'למשל: 5, 6, 8, 10 ומסביר שהם אחרי 4.' },
        { id: 'partial', label: 'מציין מספר אחד או שניים הגדולים מ־4', description: 'או משלב מספרים קטנים מ־4.' },
        { id: 'difficulty', label: 'קושי בהבנת "גדול מ־4"', description: 'אומר מספרים קטנים מ־4 או אינו משיב.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'עצמאי', description: 'משיב ומשווה בביטחון.' },
        { id: 'cued', label: 'נעזר בתזכורת לספור', description: 'משיב היטב לאחר מנייה.' },
        { id: 'high_support', label: 'זקוק לתיווך משמעותי', description: 'נדרשת עזרה בהשוואה ובשאלת ההמשך.' },
      ],
    },
  ],
  math_numeral_recognition: [
    {
      id: 'recognition_accuracy',
      title: 'זיהוי ספרות 1–10',
      levels: [
        { id: 'full', label: 'מזהה את כל או מרבית הספרות 1–10 בדיוק', description: 'כולל המספר הדו-ספרתי 10.' },
        { id: 'partial', label: 'מזהה חלק מהספרות (לרוב 1–5)', description: 'מתבלבל בספרות גבוהות או דומות (כמו 6 ו־9).' },
        { id: 'emerging', label: 'זיהוי ראשוני / ספרות בודדות', description: 'מזהה מספר מצומצם של ספרות.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'מזהה מיד ובאופן עצמאי', description: 'ללא רמזים.' },
        { id: 'cued', label: 'מזהה לאחר התבוננות חוזרת / רמז', description: 'מתקן את עצמו בעידוד קל.' },
        { id: 'high_support', label: 'זקוק לתיווך', description: 'נעזר בהדגמה או צמצום אפשרויות.' },
      ],
    },
  ],
  math_numeral_naming: [
    {
      id: 'naming_accuracy',
      title: 'שיום ספרות 1–10',
      levels: [
        { id: 'full', label: 'משיים במדויק את רוב/כל הספרות 1–10', description: 'שליפה ישירה ומדויקת של שם המספר.' },
        { id: 'partial', label: 'משיים חלק מהספרות / נעזר ברמז', description: 'שולט בחלק מהטווח או מבלבל ספרות דומות.' },
        { id: 'emerging', label: 'שיום חלקי מאוד / קושי בשליפה', description: 'מכיר ספרות בודדות בלבד.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות בשליפה',
      levels: [
        { id: 'independent', label: 'שליפה עצמאית ומהירה', description: 'עונה מיד בהצגת הספרה.' },
        { id: 'cued', label: 'זקוק לזמן או לרמז ("זה אחרי 5...")', description: 'מגיע למספר באמצעות רצף.' },
        { id: 'high_support', label: 'זקוק לתיווך מלא', description: 'מתקשה לשלוף גם עם רמז.' },
      ],
    },
  ],
  math_addition: [
    {
      id: 'problem_understanding',
      title: 'הבנת הסיפור והבעיה המילולית',
      levels: [
        { id: 'clear', label: 'מבין שמדובר בהוספה / צירוף', description: 'קולט את משמעות השאלה המילולית.' },
        { id: 'partial', label: 'מבין לאחר חזרה איטית על הסיפור', description: 'זקוק להדגשה של פעולת ההוספה.' },
        { id: 'unclear', label: 'קושי בהבנת הבעיה המילולית', description: 'אינו מחבר בין חלקי הסיפור.' },
      ],
    },
    {
      id: 'quantity_identification',
      title: 'זיהוי הכמויות הרלוונטיות',
      levels: [
        { id: 'accurate', label: 'מזהה את שני המספרים בבעיה במדויק', description: 'לוקח/מונה בדיוק את הכמויות שנאמרו.' },
        { id: 'partial', label: 'זקוק לתזכורת של אחד המספרים', description: 'שוכח חלק מהנתונים.' },
        { id: 'inaccurate', label: 'קושי בזיהוי הכמויות', description: 'מונה כמות שונה מהנאמר בסיפור.' },
      ],
    },
    {
      id: 'strategy_and_result',
      title: 'אסטרטגיית חיבור ותוצאה',
      levels: [
        { id: 'effective', label: 'בוחר אסטרטגיה יעילה ומגיע לתוצאה נכונה', description: 'אצבעות, חפצים או חישוב מנטלי מדויק.' },
        { id: 'developing', label: 'אסטרטגיה מתאימה עם טעות מנייה קלה', description: 'הדרך נכונה אך התוצאה סוטה ב־1.' },
        { id: 'ineffective', label: 'מתקשה בבחירת אסטרטגיה / ניחוש', description: 'זורק מספר ללא חישוב או מנייה.' },
      ],
    },
    {
      id: 'explanation',
      title: 'יכולת להסביר את דרך הפתרון',
      levels: [
        { id: 'clear', label: 'מסביר במילים כיצד פתר', description: 'למשל: "היו 2 והוספתי עוד 1 אז יצא 3".' },
        { id: 'demonstrates', label: 'מדגים באצבעות/חפצים ללא הסבר מילולי מלא', description: 'מראה אך מתקשה לנסח.' },
        { id: 'none', label: 'אינו מסביר איך הגיע לתשובה', description: 'אומר רק את המספר או "סתם".' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'פותר באופן עצמאי', description: 'ללא הכוונה.' },
        { id: 'cued', label: 'נעזר בהמחשה או שאלה מנחה', description: 'מצליח עם הצעה להשתמש בחפצים.' },
        { id: 'high_support', label: 'זקוק לתיווך צמוד', description: 'פותרים יחד שלב אחר שלב.' },
      ],
    },
  ],
  math_patterns: [
    {
      id: 'pattern_recognition',
      title: 'זיהוי הדגם ויחידת החזרה',
      levels: [
        { id: 'all_types', label: 'מזהה דגמי AB, AAB ו־ABC ויחידת חזרה', description: 'קולט את החוקיות גם כשהחסר באמצע.' },
        { id: 'ab_only', label: 'מזהה AB ומתקשה ב־AAB/ABC', description: 'שולט בדגם פשוט של שניים.' },
        { id: 'developing', label: 'קושי בזיהוי החוקיות', description: 'בוחר לפי צבע אהוב ולא לפי דגם.' },
      ],
    },
    {
      id: 'continuation_accuracy',
      title: 'השלמה נכונה של הדגם',
      levels: [
        { id: 'accurate', label: 'משלים נכון בסוף ובאמצע הדגם', description: 'דיוק עקבי בפריטים.' },
        { id: 'partial', label: 'משלים נכון חלק מהדגמים', description: 'מצליח בסוף הדגם ומתקשה כשהחסר באמצע.' },
        { id: 'inaccurate', label: 'קושי בהשלמת הדגמים', description: 'טעויות חוזרות.' },
      ],
    },
    {
      id: 'verbal_explanation',
      title: 'הסבר מילולי של הדגם',
      levels: [
        { id: 'clear', label: 'מסביר את החוקיות במילים', description: 'למשל: "אדום, כחול, אדום, כחול".' },
        { id: 'partial', label: 'מצביע או מתאר חלקית', description: 'זקוק לשאלה "מה חוזר על עצמו?".' },
        { id: 'none', label: 'מתקשה להסביר מילולית', description: 'אינו מנסח את החוקיות.' },
      ],
    },
    {
      id: 'independence',
      title: 'עצמאות וצורך בתיווך',
      levels: [
        { id: 'independent', label: 'עצמאי', description: 'משלים ומזהה לבד.' },
        { id: 'cued', label: 'נעזר בקריאה קולית של הדגם', description: 'מצליח כשקוראים יחד את הרצף בקול.' },
        { id: 'high_support', label: 'זקוק לתיווך צמוד', description: 'נדרשת הדגמה מלאה.' },
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
