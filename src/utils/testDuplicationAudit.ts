import { AssessmentQuestion, AssessmentTest } from '../types/curriculum';

/**
 * Cross-test duplication guard.
 *
 * A unit test is an independent instrument: it must not re-ask the lesson tests'
 * questions. This audit flags a unit question when BOTH of the following hold
 * against some lesson-test question:
 *   1. the normalized prompts share a high proportion of content tokens, and
 *   2. the normalized correct answers are substantively the same.
 *
 * Matching on skill alone is intentionally NOT flagged — testing the same skill
 * with different material is legitimate. Only near-identical question + answer
 * pairs are reported.
 */

const TATWEEL_AND_DIACRITICS = /[\u064B-\u0652\u0640\u0670\u0653-\u065F]/g;
const ARABIC_PUNCTUATION = /[،؛:؟!.«»()\-–—']/g;

export function normalizeForComparison(text: string): string {
  return text
    .replace(TATWEEL_AND_DIACRITICS, '')
    .replace(ARABIC_PUNCTUATION, ' ')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_TOKENS = new Set([
  'ما', 'ماذا', 'من', 'في', 'على', 'عن', 'الى', 'اي', 'ايه', 'هل', 'كيف', 'اين',
  'هو', 'هي', 'التي', 'الذي', 'ثم', 'او', 'و', 'ان', 'انه', 'ب', 'ل', 'ك', 'لل',
  'الا', 'لماذا', 'متى', 'كان', 'يكون', 'ال', 'هذا', 'هذه',
]);

export function contentTokens(text: string): string[] {
  return normalizeForComparison(text)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_TOKENS.has(token));
}

/** Jaccard similarity between two token sets. */
export function tokenOverlap(a: string, b: string): number {
  const setA = new Set(contentTokens(a));
  const setB = new Set(contentTokens(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection += 1;
  });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Returns the normalized correct-answer text for a question, best effort. */
export function normalizedCorrectAnswer(question: AssessmentQuestion): string {
  switch (question.type) {
    case 'single_choice':
    case 'true_false':
    case 'reading_comprehension':
    case 'grammar_application':
    case 'vocabulary_in_context': {
      const choice = question.choices.find((entry) => entry.id === question.correctChoiceId);
      return normalizeForComparison(choice ? choice.text : '');
    }
    case 'multi_select': {
      const texts = question.choices
        .filter((entry) => question.correctChoiceIds.includes(entry.id))
        .map((entry) => entry.text);
      return normalizeForComparison(texts.join(' '));
    }
    case 'fill_blank':
    case 'text_input':
    case 'sentence_correction':
      return normalizeForComparison(question.acceptedAnswers.join(' '));
    case 'ordering': {
      const texts = question.correctOrderIds
        .map((id) => question.items.find((item) => item.id === id)?.text ?? '')
        .filter(Boolean);
      return normalizeForComparison(texts.join(' '));
    }
    case 'matching':
      return normalizeForComparison(question.pairs.map((pair) => `${pair.left} ${pair.right}`).join(' '));
    case 'classification':
      return normalizeForComparison(question.items.map((item) => item.text).join(' '));
    case 'error_analysis':
      return normalizeForComparison(question.correctedSegment);
    default:
      return '';
  }
}

export interface DuplicationFinding {
  unitQuestionId: string;
  lessonQuestionId: string;
  lessonTestId: string;
  promptSimilarity: number;
  answerSimilarity: number;
}

export interface TestDuplicationReport {
  findings: DuplicationFinding[];
  passed: boolean;
}

export const PROMPT_SIMILARITY_THRESHOLD = 0.55;
export const ANSWER_SIMILARITY_THRESHOLD = 0.7;
/** Near-identical correct answers are flagged on their own (the main failure mode found in audit). */
export const ANSWER_ALONE_THRESHOLD = 0.8;

export function auditCrossTestDuplication(
  unitTest: AssessmentTest,
  lessonTests: AssessmentTest[],
): TestDuplicationReport {
  const findings: DuplicationFinding[] = [];

  for (const unitQuestion of unitTest.questions) {
    const unitAnswer = normalizedCorrectAnswer(unitQuestion);
    // Trivial answers (صحيح/خطأ/حبر…) are ignored by the answer-only branch.
    const unitAnswerSubstantive = contentTokens(unitAnswer).length >= 2;

    for (const lessonTest of lessonTests) {
      for (const lessonQuestion of lessonTest.questions) {
        const promptSimilarity = tokenOverlap(unitQuestion.prompt, lessonQuestion.prompt);
        const answerSimilarity = tokenOverlap(unitAnswer, normalizedCorrectAnswer(lessonQuestion));

        const verbatimDuplicate =
          promptSimilarity >= PROMPT_SIMILARITY_THRESHOLD &&
          answerSimilarity >= ANSWER_SIMILARITY_THRESHOLD;
        const sameAnswerReuse =
          unitAnswerSubstantive && answerSimilarity >= ANSWER_ALONE_THRESHOLD;

        if (!verbatimDuplicate && !sameAnswerReuse) continue;

        findings.push({
          unitQuestionId: unitQuestion.id,
          lessonQuestionId: lessonQuestion.id,
          lessonTestId: lessonTest.id,
          promptSimilarity,
          answerSimilarity,
        });
      }
    }
  }

  return { findings, passed: findings.length === 0 };
}
