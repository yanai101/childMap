import type { MathTaskId, TaskMetadata } from '../types/domain';

export type ShopObjectType =
  | 'apple'
  | 'ball'
  | 'flower'
  | 'block'
  | 'orange'
  | 'strawberry'
  | 'carrot'
  | 'cookie'
  | 'balloon'
  | 'candy'
  | 'car'
  | 'star';

export const MATH_SHOP_TASKS: (TaskMetadata & { id: MathTaskId })[] = [
  {
    id: 'math_oral_counting',
    title: 'פעילות 1: ספירה בעל פה',
    shortTitle: 'ספירה בעל פה',
    activityGroup: 'חנות המספרים',
    description: 'ספירה חופשית בעל פה בקצב הילד/ה (ללא הגבלה ל־10).',
    estimatedMinutes: 3,
    supportsRecording: true,
  },
  {
    id: 'math_counting_objects',
    title: 'פעילות 2: מניית חפצים (4, 6, 7, 9)',
    shortTitle: 'מניית חפצים',
    activityGroup: 'חנות המספרים',
    description: 'מניית קבוצות של 4 תפוחים, 6 כדורים, 7 פרחים ו־9 קוביות.',
    estimatedMinutes: 4,
    supportsRecording: true,
  },
  {
    id: 'math_qty_to_numeral',
    title: 'פעילות 3: התאמת כמות לספרה',
    shortTitle: 'כמות לספרה',
    activityGroup: 'חנות המספרים',
    description: 'שלב א׳ (1–5) ושלב ב׳ (6–10) — בחירת הספרה המתאימה לכמות.',
    estimatedMinutes: 5,
    supportsRecording: false,
  },
  {
    id: 'math_qty_to_qty',
    title: 'פעילות 4: התאמת כמות לכמות',
    shortTitle: 'כמות לכמות',
    activityGroup: 'חנות המספרים',
    description: 'שלב א׳ (1–5) ושלב ב׳ (6–10) — מציאת קבוצה בעלת אותה כמות (בחפצים שונים).',
    estimatedMinutes: 5,
    supportsRecording: false,
  },
  {
    id: 'math_more_less',
    title: 'פעילות 5: יותר, פחות ושווה',
    shortTitle: 'יותר ופחות',
    activityGroup: 'חנות המספרים',
    description: 'השוואת כמויות (יותר/פחות/שווה) ושיום מספרים הגדולים מ־4.',
    estimatedMinutes: 5,
    supportsRecording: true,
  },
  {
    id: 'math_numeral_recognition',
    title: 'פעילות 6: זיהוי ספרות (1–10)',
    shortTitle: 'זיהוי ספרות',
    activityGroup: 'חנות המספרים',
    description: 'זיהוי ובחירת הספרה המבוקשת מתוך כרטיסיות (1 עד 10).',
    estimatedMinutes: 4,
    supportsRecording: false,
  },
  {
    id: 'math_numeral_naming',
    title: 'פעילות 7: שיום ספרות (1–10)',
    shortTitle: 'שיום ספרות',
    activityGroup: 'חנות המספרים',
    description: 'קריאה ושיום של הספרות 1 עד 10 בנפרד מזיהוי.',
    estimatedMinutes: 4,
    supportsRecording: true,
  },
  {
    id: 'math_addition',
    title: 'פעילות 8: בעיות מילוליות בחיבור',
    shortTitle: 'בעיות חיבור',
    activityGroup: 'חנות המספרים',
    description: '3 בעיות חיבור יומיומיות עם המחשה ואסטרטגיות פתרון.',
    estimatedMinutes: 6,
    supportsRecording: true,
  },
  {
    id: 'math_patterns',
    title: 'פעילות 9: השלמת דגמים',
    shortTitle: 'דגמים',
    activityGroup: 'חנות המספרים',
    description: 'זיהוי והשלמת דגמים חוזרים מסוג AB, AAB ו־ABC.',
    estimatedMinutes: 5,
    supportsRecording: true,
  },
];

export function getMathTaskMetadata(taskId: MathTaskId): TaskMetadata & { id: MathTaskId } {
  const found = MATH_SHOP_TASKS.find((t) => t.id === taskId);
  if (!found) {
    throw new Error(`Unknown math taskId: ${taskId}`);
  }
  return found;
}

// Activity 2: Exact quantities 4, 6, 7, 9
export interface CountingObjectItem {
  id: string;
  quantity: 4 | 6 | 7 | 9;
  objectType: ShopObjectType;
  labelHe: string;
}

export const COUNTING_OBJECTS_ITEMS: CountingObjectItem[] = [
  { id: 'count-4', quantity: 4, objectType: 'apple', labelHe: '4 תפוחים' },
  { id: 'count-6', quantity: 6, objectType: 'ball', labelHe: '6 כדורים' },
  { id: 'count-7', quantity: 7, objectType: 'flower', labelHe: '7 פרחים' },
  { id: 'count-9', quantity: 9, objectType: 'block', labelHe: '9 קוביות' },
];

// Activity 3: Quantity to Numeral (Stage A: 1-5, Stage B: 6-10)
export interface QtyToNumeralItem {
  id: string;
  stage: 'A' | 'B';
  quantity: number;
  objectType: ShopObjectType;
  choices: number[];
}

export const QTY_TO_NUMERAL_ITEMS: QtyToNumeralItem[] = [
  { id: 'q2n-a-2', stage: 'A', quantity: 2, objectType: 'orange', choices: [4, 2, 1, 5] },
  { id: 'q2n-a-4', stage: 'A', quantity: 4, objectType: 'strawberry', choices: [3, 5, 4, 2] },
  { id: 'q2n-a-5', stage: 'A', quantity: 5, objectType: 'carrot', choices: [5, 2, 3, 4] },
  { id: 'q2n-b-6', stage: 'B', quantity: 6, objectType: 'cookie', choices: [8, 6, 9, 7] },
  { id: 'q2n-b-8', stage: 'B', quantity: 8, objectType: 'apple', choices: [7, 10, 6, 8] },
  { id: 'q2n-b-9', stage: 'B', quantity: 9, objectType: 'star', choices: [9, 6, 8, 10] },
];

// Activity 4: Quantity to Quantity (Stage A: 1-5, Stage B: 6-10)
export interface QtyToQtyChoice {
  id: string;
  quantity: number;
  objectType: ShopObjectType;
  arrangement: 'grid' | 'row' | 'scattered';
}

export interface QtyToQtyItem {
  id: string;
  stage: 'A' | 'B';
  targetQuantity: number;
  targetObjectType: ShopObjectType;
  choices: QtyToQtyChoice[];
}

export const QTY_TO_QTY_ITEMS: QtyToQtyItem[] = [
  {
    id: 'q2q-a-3',
    stage: 'A',
    targetQuantity: 3,
    targetObjectType: 'apple',
    choices: [
      { id: 'c1', quantity: 4, objectType: 'flower', arrangement: 'row' },
      { id: 'c2', quantity: 3, objectType: 'flower', arrangement: 'scattered' },
      { id: 'c3', quantity: 2, objectType: 'orange', arrangement: 'grid' },
    ],
  },
  {
    id: 'q2q-a-5',
    stage: 'A',
    targetQuantity: 5,
    targetObjectType: 'strawberry',
    choices: [
      { id: 'c1', quantity: 5, objectType: 'cookie', arrangement: 'grid' },
      { id: 'c2', quantity: 4, objectType: 'cookie', arrangement: 'row' },
      { id: 'c3', quantity: 3, objectType: 'ball', arrangement: 'scattered' },
    ],
  },
  {
    id: 'q2q-b-6',
    stage: 'B',
    targetQuantity: 6,
    targetObjectType: 'carrot',
    choices: [
      { id: 'c1', quantity: 7, objectType: 'star', arrangement: 'grid' },
      { id: 'c2', quantity: 5, objectType: 'block', arrangement: 'row' },
      { id: 'c3', quantity: 6, objectType: 'flower', arrangement: 'scattered' },
    ],
  },
  {
    id: 'q2q-b-8',
    stage: 'B',
    targetQuantity: 8,
    targetObjectType: 'orange',
    choices: [
      { id: 'c1', quantity: 8, objectType: 'ball', arrangement: 'scattered' },
      { id: 'c2', quantity: 6, objectType: 'apple', arrangement: 'grid' },
      { id: 'c3', quantity: 9, objectType: 'cookie', arrangement: 'row' },
    ],
  },
];

// Activity 5: More, Less, Equal
export interface MoreLessComparison {
  id: string;
  questionType: 'more' | 'less' | 'equal';
  questionHe: string;
  rightGroup: { quantity: number; objectType: ShopObjectType; arrangement: 'grid' | 'scattered' };
  leftGroup: { quantity: number; objectType: ShopObjectType; arrangement: 'grid' | 'scattered' };
  expectedChoice: 'right' | 'left' | 'equal';
}

export const MORE_LESS_COMPARISONS: MoreLessComparison[] = [
  {
    id: 'ml-more-1',
    questionType: 'more',
    questionHe: 'איפה יש יותר?',
    rightGroup: { quantity: 6, objectType: 'apple', arrangement: 'grid' },
    leftGroup: { quantity: 3, objectType: 'orange', arrangement: 'scattered' },
    expectedChoice: 'right',
  },
  {
    id: 'ml-less-1',
    questionType: 'less',
    questionHe: 'איפה יש פחות?',
    rightGroup: { quantity: 7, objectType: 'strawberry', arrangement: 'scattered' },
    leftGroup: { quantity: 4, objectType: 'cookie', arrangement: 'grid' },
    expectedChoice: 'left',
  },
  {
    id: 'ml-equal-1',
    questionType: 'equal',
    questionHe: 'איפה יש יותר, פחות, או אותה כמות?',
    rightGroup: { quantity: 5, objectType: 'flower', arrangement: 'grid' },
    leftGroup: { quantity: 5, objectType: 'star', arrangement: 'scattered' },
    expectedChoice: 'equal',
  },
  {
    id: 'ml-more-2',
    questionType: 'more',
    questionHe: 'איפה יש יותר?',
    rightGroup: { quantity: 4, objectType: 'ball', arrangement: 'scattered' },
    leftGroup: { quantity: 8, objectType: 'carrot', arrangement: 'grid' },
    expectedChoice: 'left',
  },
];

// Activity 6: Numeral Recognition 1-10 (non-ascending, reproducible choices)
export interface NumeralRecognitionItem {
  id: string;
  targetNumeral: number;
  choices: number[];
}

export const NUMERAL_RECOGNITION_ITEMS: NumeralRecognitionItem[] = [
  { id: 'rec-6', targetNumeral: 6, choices: [9, 6, 2, 8] },
  { id: 'rec-3', targetNumeral: 3, choices: [5, 1, 3, 7] },
  { id: 'rec-10', targetNumeral: 10, choices: [1, 10, 4, 8] },
  { id: 'rec-2', targetNumeral: 2, choices: [2, 5, 9, 4] },
  { id: 'rec-8', targetNumeral: 8, choices: [3, 6, 8, 10] },
  { id: 'rec-1', targetNumeral: 1, choices: [7, 4, 1, 9] },
  { id: 'rec-5', targetNumeral: 5, choices: [5, 2, 8, 3] },
  { id: 'rec-9', targetNumeral: 9, choices: [6, 9, 10, 4] },
  { id: 'rec-4', targetNumeral: 4, choices: [7, 2, 1, 4] },
  { id: 'rec-7', targetNumeral: 7, choices: [3, 7, 5, 9] },
];

// Activity 7: Numeral Naming 1-10 (non-ascending order)
export const NUMERAL_NAMING_ORDER: number[] = [3, 7, 1, 9, 4, 10, 2, 6, 8, 5];

// Activity 8: Three exact Addition Word Problems
export interface AdditionProblem {
  id: string;
  problemNumber: 1 | 2 | 3;
  promptHe: string;
  initialCount: number;
  addedCount: number;
  expectedResult: number;
  objectType: ShopObjectType;
  objectLabelSingular: string;
  objectLabelPlural: string;
}

export const ADDITION_PROBLEMS: AdditionProblem[] = [
  {
    id: 'add-1',
    problemNumber: 1,
    promptHe: 'יש לך 2 בלונים והביאו לך עוד בלון אחד. כמה בלונים יש לך עכשיו?',
    initialCount: 2,
    addedCount: 1,
    expectedResult: 3,
    objectType: 'balloon',
    objectLabelSingular: 'בלון',
    objectLabelPlural: 'בלונים',
  },
  {
    id: 'add-2',
    problemNumber: 2,
    promptHe: 'היו לך 2 סוכריות וקיבלת עוד 2 סוכריות. כמה סוכריות יש לך עכשיו?',
    initialCount: 2,
    addedCount: 2,
    expectedResult: 4,
    objectType: 'candy',
    objectLabelSingular: 'סוכרייה',
    objectLabelPlural: 'סוכריות',
  },
  {
    id: 'add-3',
    problemNumber: 3,
    promptHe: 'היו לך 3 מכוניות וקיבלת עוד 4 מכוניות. כמה מכוניות יש לך עכשיו?',
    initialCount: 3,
    addedCount: 4,
    expectedResult: 7,
    objectType: 'car',
    objectLabelSingular: 'מכונית',
    objectLabelPlural: 'מכוניות',
  },
];

export const ADDITION_STRATEGIES = [
  'ספירה באצבעות',
  'מניית חפצים',
  'חישוב בעל פה',
  'אחר',
  'לא נצפה',
] as const;

// Activity 9: Patterns (AB, AAB, ABC) — multiple items per type, including missing inside!
export type PatternToken = 'red_apple' | 'blue_berry' | 'yellow_star' | 'green_pear';

export interface PatternItem {
  id: string;
  patternType: 'AB' | 'AAB' | 'ABC';
  /** Sequence where null marks the missing slot (can be in the middle or at the end) */
  sequence: (PatternToken | null)[];
  expectedToken: PatternToken;
  choices: PatternToken[];
}

export const PATTERN_ITEMS: PatternItem[] = [
  // AB
  {
    id: 'pat-ab-1',
    patternType: 'AB',
    sequence: ['red_apple', 'blue_berry', 'red_apple', 'blue_berry', 'red_apple', null],
    expectedToken: 'blue_berry',
    choices: ['blue_berry', 'red_apple', 'yellow_star'],
  },
  {
    id: 'pat-ab-2',
    patternType: 'AB',
    sequence: ['red_apple', 'yellow_star', null, 'yellow_star', 'red_apple', 'yellow_star'],
    expectedToken: 'red_apple',
    choices: ['yellow_star', 'red_apple', 'green_pear'],
  },
  // AAB
  {
    id: 'pat-aab-1',
    patternType: 'AAB',
    sequence: ['red_apple', 'red_apple', 'blue_berry', 'red_apple', 'red_apple', null],
    expectedToken: 'blue_berry',
    choices: ['red_apple', 'blue_berry', 'yellow_star'],
  },
  {
    id: 'pat-aab-2',
    patternType: 'AAB',
    sequence: ['yellow_star', 'yellow_star', 'green_pear', 'yellow_star', null, 'green_pear'],
    expectedToken: 'yellow_star',
    choices: ['green_pear', 'yellow_star', 'blue_berry'],
  },
  // ABC
  {
    id: 'pat-abc-1',
    patternType: 'ABC',
    sequence: ['red_apple', 'blue_berry', 'yellow_star', 'red_apple', 'blue_berry', null],
    expectedToken: 'yellow_star',
    choices: ['yellow_star', 'red_apple', 'blue_berry'],
  },
  {
    id: 'pat-abc-2',
    patternType: 'ABC',
    sequence: ['red_apple', 'blue_berry', null, 'red_apple', 'blue_berry', 'yellow_star'],
    expectedToken: 'yellow_star',
    choices: ['blue_berry', 'yellow_star', 'red_apple'],
  },
];
