export interface VillageBuilding {
  id: string;
  name: string;
  domain: string;
  characterName: string;
  characterGreeting: string;
  description: string;
  available: boolean;
  accentColor: string;
  roofColor: string;
  wallColor: string;
}

export const VILLAGE_BUILDINGS: VillageBuilding[] = [
  {
    id: 'story-house',
    name: 'בית הסיפורים',
    domain: 'שפה וסיפור',
    characterName: 'אורי השועל',
    characterGreeting: 'שלום חבר! בוא נספר סיפורים ונגלה מילים חדשות!',
    description: 'שיום תמונות, סיפור ברצף, הבנת הנשמע, הבנה מילולית ומדרש תמונה',
    available: true,
    accentColor: '#f59e0b',
    roofColor: '#ea580c',
    wallColor: '#fef3c7',
  },
  {
    id: 'numbers-shop',
    name: 'חנות המספרים',
    domain: 'מתמטיקה',
    characterName: 'דובי הסוחר',
    characterGreeting: 'בקרוב נפתח את החנות ונספור ביחד!',
    description: 'ספירה, מנייה, השוואת כמויות וחיבור ראשוני',
    available: false,
    accentColor: '#3b82f6',
    roofColor: '#2563eb',
    wallColor: '#dbeafe',
  },
  {
    id: 'builders-house',
    name: 'בית הבנאים',
    domain: 'תפיסה חזותית ומרחבית',
    characterName: 'בני הבונה',
    characterGreeting: 'בקרוב נבנה מגדלים וצורות מיוחדות!',
    description: 'התאמת צורות, תפיסה מרחבית והעתקת דגמים',
    available: false,
    accentColor: '#10b981',
    roofColor: '#059669',
    wallColor: '#d1fae5',
  },
  {
    id: 'memory-forest',
    name: 'יער הזיכרון',
    domain: 'זיכרון וקשב',
    characterName: 'ינשוף החכם',
    characterGreeting: 'בקרוב נטייל ביער ונשחק משחקי זיכרון!',
    description: 'זיכרון חזותי ושמיעתי, ריכוז והתמדה',
    available: false,
    accentColor: '#8b5cf6',
    roofColor: '#7c3aed',
    wallColor: '#ede9fe',
  },
  {
    id: 'craft-workshop',
    name: 'סדנת היצירה',
    domain: 'מוטוריקה עדינה',
    characterName: 'תולי הארנב',
    characterGreeting: 'בקרוב נגזור, נצייר וניצור דברים יפים!',
    description: 'אחיזת עיפרון, גזירה, קווים ותיאום עין-יד',
    available: false,
    accentColor: '#ec4899',
    roofColor: '#db2777',
    wallColor: '#fce7f3',
  },
  {
    id: 'sounds-house',
    name: 'בית הצלילים',
    domain: 'מודעות פונולוגית',
    characterName: 'ציפי הציפור',
    characterGreeting: 'בקרוב נשיר חרוזים ונחפש צלילים!',
    description: 'חריזה, פירוק להברות וזיהוי צליל פותח וסוגר',
    available: false,
    accentColor: '#06b6d4',
    roofColor: '#0891b2',
    wallColor: '#cffafe',
  },
  {
    id: 'friends-square',
    name: 'כיכר החברים',
    domain: 'כישורים חברתיים-רגשיים',
    characterName: 'נועה הצב',
    characterGreeting: 'בקרוב ניפגש בכיכר ונכיר רגשות וחברות!',
    description: 'זיהוי רגשות, שיתוף פעולה ופתרון מצבים חברתיים',
    available: false,
    accentColor: '#f43f5e',
    roofColor: '#e11d48',
    wallColor: '#ffe4e6',
  },
  {
    id: 'village-museum',
    name: 'מוזיאון הכפר',
    domain: 'ידע עולם',
    characterName: 'פרופסור קיפוד',
    characterGreeting: 'בקרוב נגלה אוצרות וסיפורים על העולם!',
    description: 'עונות השנה, בעלי חיים, מקצועות ומושגי זמן',
    available: false,
    accentColor: '#84cc16',
    roofColor: '#65a30d',
    wallColor: '#ecfccb',
  },
  {
    id: 'letters-house',
    name: 'בית האותיות',
    domain: 'אותיות הא״ב',
    characterName: 'גלי הג׳ירפה',
    characterGreeting: 'בקרוב נכיר את כל האותיות והאותיות הסופיות!',
    description: 'זיהוי ושיום של 22 אותיות הא״ב ו־5 האותיות הסופיות (ך, ם, ן, ף, ץ)',
    available: false,
    accentColor: '#eab308',
    roofColor: '#ca8a04',
    wallColor: '#fef9c3',
  },
];

export const ENCOURAGING_MESSAGES = [
  'תודה שסיפרת לי!',
  'בוא נמשיך להרפתקה!',
  'איזה יופי ששיתפת אותי!',
  'אורי השועל שמח מאוד לשמוע!',
  'כל הכבוד על המחשבה!',
];

export function getRandomEncouragement(): string {
  return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
}

export const MATH_ENCOURAGING_MESSAGES = [
  'איזה יופי, ממשיכים!',
  'תודה שעזרת לדובי!',
  'בוא נראה מה מחכה לנו עכשיו!',
  'דובי שמח מאוד על העזרה שלך!',
];

export function getMathEncouragement(): string {
  return MATH_ENCOURAGING_MESSAGES[Math.floor(Math.random() * MATH_ENCOURAGING_MESSAGES.length)];
}
