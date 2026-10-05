import { AssessmentTest, UserAnswerValue, UserAssessmentAttempt } from '../types/curriculum';

export interface EvaluationResult {
  score: number;
  totalPossible: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  questionResults: Record<string, boolean>;
}

/**
 * Pure evaluation function for completed attempts.
 * strictly evaluated ONLY upon submit, never mid-test.
 */
export function evaluateAssessmentAttempt(
  test: AssessmentTest,
  userAnswers: Record<string, UserAnswerValue>
): EvaluationResult {
  let correctCount = 0;
  const questionResults: Record<string, boolean> = {};

  for (const question of test.questions) {
    const rawAnswer = userAnswers[question.id];
    let isCorrect = false;

    if (rawAnswer !== undefined && rawAnswer !== null) {
      switch (question.type) {
        case 'single_choice':
        case 'true_false':
        case 'reading_comprehension':
        case 'grammar_application':
        case 'vocabulary_in_context': {
          isCorrect = typeof rawAnswer === 'string' && rawAnswer === question.correctChoiceId;
          break;
        }

        case 'multi_select': {
          if (Array.isArray(rawAnswer)) {
            const sortedUser = [...rawAnswer].sort();
            const sortedCorrect = [...question.correctChoiceIds].sort();
            isCorrect =
              sortedUser.length === sortedCorrect.length &&
              sortedUser.every((val, idx) => val === sortedCorrect[idx]);
          }
          break;
        }

        case 'fill_blank':
        case 'text_input':
        case 'sentence_correction': {
          if (typeof rawAnswer === 'string') {
            const cleanUser = rawAnswer.trim();
            const accepted = question.acceptedAnswers.map((a) => a.trim());
            if (question.caseSensitive) {
              isCorrect = accepted.includes(cleanUser);
            } else {
              isCorrect = accepted.some((a) => a.localeCompare(cleanUser, 'ar', { sensitivity: 'base' }) === 0);
            }
          }
          break;
        }

        case 'ordering': {
          if (Array.isArray(rawAnswer)) {
            isCorrect =
              rawAnswer.length === question.correctOrderIds.length &&
              rawAnswer.every((id, idx) => id === question.correctOrderIds[idx]);
          }
          break;
        }

        case 'matching': {
          if (typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) {
            const record = rawAnswer as Record<string, string>;
            isCorrect = question.pairs.every((pair) => record[pair.left] === pair.right);
          }
          break;
        }

        case 'classification': {
          if (typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) {
            const record = rawAnswer as Record<string, string>;
            isCorrect = question.items.every(
              (item) => record[item.id] === item.correctCategoryId
            );
          }
          break;
        }

        case 'error_analysis': {
          if (question.correctOptionId) {
            isCorrect = typeof rawAnswer === 'string' && rawAnswer === question.correctOptionId;
          } else {
            const cleanUser = typeof rawAnswer === 'string' ? rawAnswer.trim() : '';
            isCorrect = cleanUser === question.correctedSegment.trim();
          }
          break;
        }

        default:
          isCorrect = false;
      }
    }

    questionResults[question.id] = isCorrect;
    if (isCorrect) correctCount++;
  }

  const totalPossible = test.questions.length;
  const incorrectCount = totalPossible - correctCount;
  const percentage = totalPossible > 0 ? Math.round((correctCount / totalPossible) * 100) : 0;

  return {
    score: correctCount,
    totalPossible,
    percentage,
    correctCount,
    incorrectCount,
    questionResults,
  };
}

/**
 * Creates a genuinely fresh attempt object.
 */
export function createFreshAttempt(testId: string): UserAssessmentAttempt {
  return {
    testId,
    startedAt: new Date().toISOString(),
    answers: {},
    isSubmitted: false,
  };
}
