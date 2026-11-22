import { SourceReference } from '../../types/curriculum';
import { unit2ReviewRecord } from './sourceAudit';

/**
 * «تقويم الوحدة الثانية» — student-side inventory (pages 69–70).
 *
 * Only the five questions approved for implementation live here:
 * ١ · ٣ · ٥ · ٦ · ٧.
 *
 * Questions ٢ and ٤ are deliberately ABSENT: they own no step, no field and no
 * notice in the student area. Their printed text stays documented in
 * `sourceAudit.ts` as `excluded` records only.
 *
 * Every instruction and printed item below is read from the audited record of
 * the same id, so the wording rendered to the learner is the audited wording —
 * never a paraphrase.
 *
 * Editorial rules enforced here (see docs/spec: v6):
 *  - no answer key, no model answer, no accepted answers;
 *  - no placeholder, no hint, no helper text inside any field;
 *  - no field, requirement or step that is not printed on pages 69–70.
 */

export interface Unit2ReviewField {
  /** Stable learner-answer key. */
  id: string;
  /** Platform wording used as the accessible name and in the closing summary. */
  label: string;
  /** Printed height of the answer space (1 = one printed line). */
  rows: number;
  /** Printed item shown with the field (a statement, a word, or a sentence). */
  printedText?: string;
  /** Printed colour of the box/bubble the field sits in (visual fidelity only). */
  tone?: 'yellow' | 'pink' | 'green' | 'blue';
}

export type Unit2ReviewLayout = 'statement_list' | 'word_boxes' | 'dialogue' | 'single_line';

export interface Unit2ReviewQuestion {
  id: string;
  /** Printed question number (١، ٣، ٥، ٦، ٧ — the textbook numbering is kept). */
  printedNumber: number;
  page: number;
  /** Short printed designation, e.g. «السؤال ٣». */
  section: string;
  /** Verbatim printed instruction. */
  instruction: string;
  /** Verbatim sentence the learner must act on (questions ٦ and ٧ only). */
  sharedText?: string;
  layout: Unit2ReviewLayout;
  fields: Unit2ReviewField[];
  source: SourceReference;
}

export interface Unit2ReviewReflection {
  id: string;
  /** Verbatim printed closing line (page 70). */
  printedText: string;
}

const questionSource = (id: string): SourceReference => unit2ReviewRecord(id).source;

/* ------------------------------------------------------------------ */
/* Question 1 — page 69                                               */
/* ------------------------------------------------------------------ */

const Q1_BRANCH_IDS = ['U2R-69-Q1-A', 'U2R-69-Q1-B', 'U2R-69-Q1-C', 'U2R-69-Q1-D'];
const Q1_BRANCH_LABELS = ['العبارة ١', 'العبارة ٢', 'العبارة ٣', 'العبارة ٤'];

const q1: Unit2ReviewQuestion = {
  id: 'u2r-q1',
  printedNumber: 1,
  page: 69,
  section: 'السؤال ١',
  instruction: unit2ReviewRecord('U2R-69-Q1').text,
  layout: 'statement_list',
  fields: Q1_BRANCH_IDS.map((recordId, index) => ({
    id: `${recordId}-value`,
    label: Q1_BRANCH_LABELS[index],
    rows: 1,
    printedText: unit2ReviewRecord(recordId).text,
  })),
  source: questionSource('U2R-69-Q1'),
};

/* ------------------------------------------------------------------ */
/* Question 3 — page 69                                               */
/* ------------------------------------------------------------------ */

const q3: Unit2ReviewQuestion = {
  id: 'u2r-q3',
  printedNumber: 3,
  page: 69,
  section: 'السؤال ٣',
  instruction: unit2ReviewRecord('U2R-69-Q3').text,
  layout: 'word_boxes',
  fields: [
    { id: 'U2R-69-Q3-A-value', label: 'خانة الصفّ', rows: 1, printedText: unit2ReviewRecord('U2R-69-Q3-A').text, tone: 'yellow' },
    { id: 'U2R-69-Q3-B-value', label: 'خانة الملعب', rows: 1, printedText: unit2ReviewRecord('U2R-69-Q3-B').text, tone: 'pink' },
    { id: 'U2R-69-Q3-C-value', label: 'خانة السباحة', rows: 1, printedText: unit2ReviewRecord('U2R-69-Q3-C').text, tone: 'green' },
  ],
  source: questionSource('U2R-69-Q3'),
};

/* ------------------------------------------------------------------ */
/* Question 5 — page 70                                               */
/* ------------------------------------------------------------------ */

const q5: Unit2ReviewQuestion = {
  id: 'u2r-q5',
  printedNumber: 5,
  page: 70,
  section: 'السؤال ٥',
  instruction: unit2ReviewRecord('U2R-70-Q5').text,
  layout: 'dialogue',
  fields: [
    { id: 'U2R-70-Q5-A-value', label: 'الشخصية ١', rows: 3, tone: 'blue' },
    { id: 'U2R-70-Q5-B-value', label: 'الشخصية ٢', rows: 3, tone: 'green' },
  ],
  source: questionSource('U2R-70-Q5'),
};

/* ------------------------------------------------------------------ */
/* Question 6 — page 70                                               */
/* ------------------------------------------------------------------ */

const q6: Unit2ReviewQuestion = {
  id: 'u2r-q6',
  printedNumber: 6,
  page: 70,
  section: 'السؤال ٦',
  instruction: unit2ReviewRecord('U2R-70-Q6').text,
  sharedText: unit2ReviewRecord('U2R-70-Q6-A').text,
  layout: 'single_line',
  fields: [{ id: 'U2R-70-Q6-A-value', label: 'التحويل', rows: 1 }],
  source: questionSource('U2R-70-Q6'),
};

/* ------------------------------------------------------------------ */
/* Question 7 — page 70                                               */
/* ------------------------------------------------------------------ */

const q7: Unit2ReviewQuestion = {
  id: 'u2r-q7',
  printedNumber: 7,
  page: 70,
  section: 'السؤال ٧',
  instruction: unit2ReviewRecord('U2R-70-Q7').text,
  sharedText: unit2ReviewRecord('U2R-70-Q7-A').text,
  layout: 'single_line',
  fields: [{ id: 'U2R-70-Q7-A-value', label: 'التحويل', rows: 1 }],
  source: questionSource('U2R-70-Q7'),
};

/** The five implemented printed questions, in printed order. */
export const UNIT2_REVIEW_QUESTIONS: Unit2ReviewQuestion[] = [q1, q3, q5, q6, q7];

/**
 * The two closing reflective lines printed on page 70 (un-numbered).
 * They are optional, never graded, and never a condition to finish the review.
 */
export const UNIT2_REVIEW_REFLECTIONS: Unit2ReviewReflection[] = [
  { id: 'u2r-reflect-1', printedText: 'بعد انتهائي من دراسة الوحدة أضفتُ إلى معلوماتي:' },
  { id: 'u2r-reflect-2', printedText: 'المهارةُ التي أتقنتُها بعد دراسة هذه الوحدة:' },
];

/** Answer-key helper: one stable key per printed answer space. */
export const unit2AnswerKey = (fieldId: string): string => fieldId;
