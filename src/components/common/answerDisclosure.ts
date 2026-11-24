import { AnswerDisclosure, AnswerDisclosureKind } from '../../types/curriculum';
import { AnswerRevealEntry, AnswerRevealProps } from './AnswerReveal';

/**
 * answerDisclosure — the ONE place that turns a record's declared disclosure
 * into a surface payload.
 *
 * WHY: five lesson renderers used to carry their own «أظهر الجواب» adapters and
 * their own hand-written id sets, so a new lesson silently got no feature and
 * the student/teacher split was re-decided per file. Here the decision is
 * consumed, never re-made:
 *
 *   record (data) ── disclosure ──▶ resolveAnswerReveal(record, scope)
 *                                        ├── 'student' → AnswerRevealProps | null
 *                                        └── 'teacher' → TeacherSolutionView | null
 *
 * HARD RULES
 *  - FAIL CLOSED: an unknown kind, a missing disclosure or an empty `sourceRef`
 *    yields `null` in BOTH scopes. There is no default that reveals anything.
 *  - `teacher_only` and `no_approved_content` never produce a student payload
 *    (no button, no wording).
 *  - The teacher payload is a DIFFERENT TYPE from the student payload, so a
 *    student component cannot render teacher material by accident.
 *  - No answer text is invented, rewritten or derived here: the record owns the
 *    text and this module only selects and labels it.
 */

export type AnswerScope = 'student' | 'teacher';

/** Student-facing payload: exactly the shared AnswerReveal contract. */
export type StudentRevealPayload = AnswerRevealProps;

/**
 * Teacher-facing payload. Structurally different from AnswerRevealProps on
 * purpose (different field names and a closed `kind`), so it can never be
 * spread into <AnswerReveal>.
 */
export interface TeacherSolutionView {
  kind: 'teacher_solution';
  sourceRef: string;
  modelAnswer: string;
  explanation?: string;
  commonMistakes?: string[];
}

/** What the resolver needs from any record; every lesson model satisfies it. */
export interface DisclosureBearingRecord {
  /** Internal record id, used only for diagnostics — never displayed. */
  id: string;
  /** Source-lock id when the lesson has one. */
  sourceActivityId?: string;
  disclosure?: AnswerDisclosure;
  /** Approved per-field answers already translated to display labels. */
  entries?: AnswerRevealEntry[];
  /** Approved model answer (key text or approved guidance text). */
  modelAnswer?: string;
  /** Student-usable explanation (never `teacher.explanation`). */
  explanation?: string;
  /** Honest note for the fields that have no approved key. */
  unavailableNote?: string;
  /**
   * Optional heading preserved verbatim from an existing lesson surface.
   * Used ONLY to keep an already-approved wording unchanged during migration
   * (lesson 1 shows «الجواب المعتمد»); it never decides whether anything is
   * revealed — the disclosure alone does that.
   */
  headingOverride?: string;
  /** Teacher-only material; only reachable through the 'teacher' scope. */
  teacher?: {
    answerOrGuidance?: string;
    explanation?: string;
    commonMistakes?: string[];
  };
}

export const DISCLOSURE_HEADINGS: Record<'approved_key' | 'guidance_only', string> = {
  approved_key: 'الحل النموذجي المعتمد',
  guidance_only: 'إرشادات للإجابة',
};

const isNonEmpty = (value: string | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const KNOWN_KINDS: ReadonlySet<AnswerDisclosureKind> = new Set<AnswerDisclosureKind>([
  'approved_key',
  'guidance_only',
  'teacher_only',
  'no_approved_content',
]);

/**
 * True only when the record carries a well-formed disclosure. Used by the
 * coverage audit and by the resolver's fail-closed guard.
 */
export const hasValidDisclosure = (record: DisclosureBearingRecord): boolean => {
  const disclosure = record.disclosure;
  if (!disclosure) return false;
  if (!KNOWN_KINDS.has(disclosure.kind)) return false;
  return isNonEmpty(disclosure.sourceRef);
};

/**
 * Student surface payload.
 * Returns `null` for every record the learner must not see anything about.
 */
export function toStudentReveal(
  record: DisclosureBearingRecord,
): StudentRevealPayload | null {
  if (!hasValidDisclosure(record)) return null;
  const disclosure = record.disclosure as AnswerDisclosure;

  if (disclosure.kind === 'teacher_only' || disclosure.kind === 'no_approved_content') {
    return null;
  }

  const entries = (record.entries ?? []).filter(
    (entry) => isNonEmpty(entry.label) && isNonEmpty(entry.value),
  );
  const hasModelAnswer = isNonEmpty(record.modelAnswer);
  const hasExplanation = isNonEmpty(record.explanation);

  /* Nothing approved to show ⇒ no button at all (never an empty panel). */
  if (entries.length === 0 && !hasModelAnswer && !hasExplanation) return null;

  const payload: StudentRevealPayload = {
    heading: isNonEmpty(record.headingOverride)
      ? record.headingOverride
      : DISCLOSURE_HEADINGS[disclosure.kind],
  };
  if (entries.length > 0) payload.entries = entries;
  if (hasModelAnswer) payload.modelAnswer = record.modelAnswer;
  if (hasExplanation) payload.explanation = record.explanation;
  if (isNonEmpty(record.unavailableNote)) payload.unavailableNote = record.unavailableNote;
  return payload;
}

/**
 * Teacher surface payload, used only inside the password-protected Teacher Area.
 */
export function toTeacherSolution(
  record: DisclosureBearingRecord,
): TeacherSolutionView | null {
  if (!hasValidDisclosure(record)) return null;
  const disclosure = record.disclosure as AnswerDisclosure;
  if (disclosure.kind === 'no_approved_content') return null;

  const modelAnswer = record.teacher?.answerOrGuidance ?? record.modelAnswer;
  if (!isNonEmpty(modelAnswer)) return null;

  const view: TeacherSolutionView = {
    kind: 'teacher_solution',
    sourceRef: disclosure.sourceRef,
    modelAnswer,
  };
  if (isNonEmpty(record.teacher?.explanation)) view.explanation = record.teacher.explanation;
  if (record.teacher?.commonMistakes && record.teacher.commonMistakes.length > 0) {
    view.commonMistakes = record.teacher.commonMistakes;
  }
  return view;
}

/** Unified entry point. Student code must pass 'student'. */
export function resolveAnswerReveal(
  record: DisclosureBearingRecord,
  scope: 'student',
): StudentRevealPayload | null;
export function resolveAnswerReveal(
  record: DisclosureBearingRecord,
  scope: 'teacher',
): TeacherSolutionView | null;
export function resolveAnswerReveal(
  record: DisclosureBearingRecord,
  scope: AnswerScope,
): StudentRevealPayload | TeacherSolutionView | null {
  return scope === 'teacher' ? toTeacherSolution(record) : toStudentReveal(record);
}

/* ------------------------------------------------------------------ */
/* Shared payload builder for the legacy `answerKey` lesson shape      */
/* ------------------------------------------------------------------ */

/** Interaction shapes the legacy answer-key adapter can translate. */
export type KeyedInteraction =
  | { kind: 'text_fields'; fields: { id: string; label: string }[] }
  | { kind: 'classification'; categories: { id: string; label: string }[]; items: { id: string; text: string }[] }
  | { kind: 'matching'; leftItems: { id: string; text: string }[]; rightItems: { id: string; text: string }[] }
  | { kind: 'checklist'; items: { id: string; label: string }[] }
  | { kind: string };

/**
 * Translates a `fieldId → expected` answer key into display entries using only
 * the Arabic labels the learner already sees. Unmappable keys are SKIPPED —
 * raw ids or internal values are never shown.
 *
 * Behaviour is byte-for-byte the one the five lesson adapters implemented
 * separately; it lives here once so it cannot drift.
 */
export function entriesFromAnswerKey(
  interaction: KeyedInteraction,
  answerKey: Record<string, string>,
): AnswerRevealEntry[] {
  const entries: AnswerRevealEntry[] = [];

  Object.entries(answerKey).forEach(([fieldId, expected]) => {
    if (interaction.kind === 'classification' && fieldId.startsWith('classify-')) {
      const view = interaction as Extract<KeyedInteraction, { kind: 'classification' }>;
      const item = view.items.find((entry) => `classify-${entry.id}` === fieldId);
      const category = view.categories.find((entry) => entry.id === expected);
      if (item && category) entries.push({ label: item.text, value: category.label });
      return;
    }
    if (interaction.kind === 'matching' && fieldId.startsWith('match-')) {
      const view = interaction as Extract<KeyedInteraction, { kind: 'matching' }>;
      const left = view.leftItems.find((entry) => `match-${entry.id}` === fieldId);
      const right = view.rightItems.find((entry) => entry.id === expected);
      if (left && right) entries.push({ label: left.text, value: right.text });
      return;
    }
    if (interaction.kind === 'text_fields') {
      const view = interaction as Extract<KeyedInteraction, { kind: 'text_fields' }>;
      const field = view.fields.find((entry) => entry.id === fieldId);
      if (field) entries.push({ label: field.label, value: expected });
      return;
    }
    if (interaction.kind === 'checklist' && fieldId.startsWith('check-')) {
      const view = interaction as Extract<KeyedInteraction, { kind: 'checklist' }>;
      const item = view.items.find((entry) => `check-${entry.id}` === fieldId);
      if (item && expected === '1') entries.push({ label: item.label, value: 'عنصرٌ مطلوبٌ تحديده' });
      return;
    }
    /* Unmappable internal key: skipped — never shown raw to the learner. */
  });

  return entries;
}

/* ------------------------------------------------------------------ */
/* Explicit per-model record adapters                                  */
/* ------------------------------------------------------------------ */

/**
 * Data model used by lessons 2, 3 and Unit 2 lessons 1–2: the approved answer
 * text is stored in `teacher.answerOrGuidance`, secondary reasoning in
 * `checkExplanation`, and closed-item keys in `answerKey`.
 *
 * This adapter only LOCATES the text for that model. Whether anything may be
 * displayed is still decided by `disclosure` alone — a record declared
 * `teacher_only` or `no_approved_content` yields nothing even though the text
 * exists. That is the difference between "reading a field" and "inferring
 * permission from the field's presence".
 */
export interface KeyedLessonAnswerRecord {
  id: string;
  sourceActivityId: string;
  disclosure?: AnswerDisclosure;
  interaction: KeyedInteraction;
  answerKey?: Record<string, string>;
  checkExplanation?: string;
  teacher: { answerOrGuidance: string; explanation: string; commonMistakes?: string[] };
}

export function fromKeyedLesson(activity: KeyedLessonAnswerRecord): DisclosureBearingRecord {
  return {
    id: activity.id,
    sourceActivityId: activity.sourceActivityId,
    disclosure: activity.disclosure,
    entries: activity.answerKey
      ? entriesFromAnswerKey(activity.interaction, activity.answerKey)
      : [],
    modelAnswer: activity.teacher.answerOrGuidance,
    /* Student-usable reasoning only; `teacher.explanation` stays teacher-side. */
    explanation: activity.checkExplanation,
    teacher: activity.teacher,
  };
}

/* ------------------------------------------------------------------ */
/* Lesson 1 — field-level record adapter                               */
/* ------------------------------------------------------------------ */

/**
 * Lesson 1 stores its approved keys INSIDE the interaction (`acceptedAnswers`,
 * `correctId(s)`, `correctCategoryId`), its prose answer in `solution`, and its
 * settled/pending split in `pending: true` flags. This adapter maps exactly that
 * shape onto the shared contract: settled fields become entries, a pending field
 * is never listed, and the honest `unavailableNote` is preserved for
 * `partial_pending` records.
 */
export interface Lesson1AnswerRecord {
  id: string;
  sourceRecordIds: string[];
  status: 'solved' | 'partial_pending' | 'pending';
  pendingNote?: string;
  solution: { answer: string; explanation: string };
  disclosure?: AnswerDisclosure;
  interaction:
    | { kind: 'text_inputs'; fields: { id: string; label: string; acceptedAnswers?: string[]; pending?: boolean }[] }
    | { kind: 'choose'; choices: { id: string; text: string }[]; correctId: string }
    | { kind: 'multi'; choices: { id: string; text: string }[]; correctIds: string[] }
    | { kind: 'classify'; categories: { id: string; label: string }[]; items: { id: string; text: string; correctCategoryId: string }[] }
    | {
        kind: 'table_fill';
        columns: string[];
        rows: { cells: ({ given: string } | { fieldId: string; acceptedAnswers?: string[]; pending?: boolean })[] }[];
      }
    | {
        kind: 'diagram_fill';
        boxes: { id: string; text?: string; fieldId?: string; tone?: 'given' | 'blank'; acceptedAnswers?: string[]; pending?: boolean }[];
      }
    | { kind: 'write' }
    | { kind: 'speak' }
    | { kind: 'decode'; checkDisabled?: boolean };
}

const arabicOrdinal = (value: number): string =>
  String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);

export function lesson1FieldEntries(record: Lesson1AnswerRecord): AnswerRevealEntry[] {
  const interaction = record.interaction;
  const entries: AnswerRevealEntry[] = [];

  switch (interaction.kind) {
    case 'choose': {
      const correct = interaction.choices.find((choice) => choice.id === interaction.correctId);
      if (correct) entries.push({ label: 'الاختيار الصحيح', value: correct.text });
      break;
    }
    case 'multi': {
      const texts = interaction.choices
        .filter((choice) => interaction.correctIds.includes(choice.id))
        .map((choice) => choice.text);
      if (texts.length > 0) entries.push({ label: 'الاختيارات الصحيحة', value: texts.join(' + ') });
      break;
    }
    case 'classify':
      interaction.items.forEach((item) => {
        const category = interaction.categories.find((entry) => entry.id === item.correctCategoryId);
        if (category) entries.push({ label: item.text, value: category.label });
      });
      break;
    case 'text_inputs':
      interaction.fields.forEach((field) => {
        if (!field.pending && field.acceptedAnswers && field.acceptedAnswers.length > 0) {
          entries.push({ label: field.label, value: field.acceptedAnswers.join(' / ') });
        }
      });
      break;
    case 'table_fill':
      interaction.rows.forEach((row, rowIndex) => {
        row.cells.forEach((cell, cellIndex) => {
          const column = interaction.columns[cellIndex];
          if (!column) return; // never fall back to a raw internal field id
          if ('fieldId' in cell && !cell.pending && cell.acceptedAnswers && cell.acceptedAnswers.length > 0) {
            entries.push({
              label: `${column} — صف ${arabicOrdinal(rowIndex + 1)}`,
              value: cell.acceptedAnswers.join(' / '),
            });
          }
        });
      });
      break;
    case 'diagram_fill': {
      let blankNumber = 0;
      interaction.boxes.forEach((box) => {
        if (!box.fieldId) return;
        blankNumber += 1;
        if (!box.pending && box.acceptedAnswers && box.acceptedAnswers.length > 0) {
          entries.push({
            label: `فارغ ${arabicOrdinal(blankNumber)}`,
            value: box.acceptedAnswers.join(' / '),
          });
        }
      });
      break;
    }
    default:
      break; /* write / speak / decode: the model answer below is the approved key */
  }

  return entries;
}

export const LESSON1_REVEAL_HEADING = 'الجواب المعتمد';

export function fromLesson1(activity: Lesson1AnswerRecord): DisclosureBearingRecord {
  return {
    id: activity.id,
    sourceActivityId: activity.sourceRecordIds[0],
    disclosure: activity.disclosure,
    entries: lesson1FieldEntries(activity),
    modelAnswer: activity.solution.answer,
    explanation: activity.solution.explanation,
    unavailableNote:
      activity.status === 'partial_pending'
        ? activity.pendingNote ?? 'بعض الإجابات معلّقة بقرار صاحب المشروع ولا تُعرض لها إجابة.'
        : undefined,
    headingOverride: LESSON1_REVEAL_HEADING,
  };
}
