/**
 * riddleGuard — centralized guard for the Lesson 3 p. 35 riddle (L3-35-01 / l3-a-49)
 * and its dependent assessment questions (l3-t-20, u1-t-50).
 *
 * Prevents revealing the riddle solution, revealing guidance, explanation,
 * preview, or any answer-revealing link to the student until:
 *   1. All four fields (b1..b4) in L3-35-01 are filled (non-empty after trim).
 *   2. The student explicitly presses «أنهيت المحاولة».
 *
 * Filling fields, navigating away, or reloading the page must NEVER
 * auto-reveal the solution or erase the student's draft.
 */

export const RIDDLE_ACTIVITY_ID = 'l3-a-49';
export const RIDDLE_SOURCE_ID = 'L3-35-01';
export const RIDDLE_TEST_QUESTION_IDS = new Set<string>(['l3-t-20', 'u1-t-50']);
export const RIDDLE_REQUIRED_FIELDS = ['b1', 'b2', 'b3', 'b4'] as const;
export const RIDDLE_COMPLETION_STORAGE_KEY = 'arabic-g5-riddle-l3-35-01-confirmed';

function getSessionStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export function isRiddleActivity(recordId: string, sourceActivityId?: string): boolean {
  return recordId === RIDDLE_ACTIVITY_ID || sourceActivityId === RIDDLE_SOURCE_ID;
}

export function isRiddleTestQuestion(questionId: string): boolean {
  return RIDDLE_TEST_QUESTION_IDS.has(questionId);
}

export function areRiddleFieldsComplete(values: Record<string, string>): boolean {
  return RIDDLE_REQUIRED_FIELDS.every(
    (fieldId) => typeof values[fieldId] === 'string' && values[fieldId].trim().length > 0,
  );
}

export function isRiddleAttemptConfirmed(): boolean {
  const storage = getSessionStorage();
  if (!storage) return false;
  try {
    return storage.getItem(RIDDLE_COMPLETION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function confirmRiddleAttempt(values: Record<string, string>): boolean {
  if (!areRiddleFieldsComplete(values)) {
    return false;
  }
  const storage = getSessionStorage();
  if (!storage) return false;
  try {
    storage.setItem(RIDDLE_COMPLETION_STORAGE_KEY, 'true');
    return true;
  } catch {
    return false;
  }
}

export function clearRiddleAttemptConfirmation(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(RIDDLE_COMPLETION_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function canRevealRiddleForStudent(): boolean {
  return isRiddleAttemptConfirmed();
}

export function canRevealRecordForScope(
  record: { id: string; sourceActivityId?: string },
  scope: 'student' | 'teacher',
): boolean {
  if (scope === 'teacher') {
    return true;
  }
  if (isRiddleActivity(record.id, record.sourceActivityId)) {
    return canRevealRiddleForStudent();
  }
  return true;
}

export function isRiddleQuestionGuardedForStudent(questionId: string): boolean {
  return isRiddleTestQuestion(questionId) && !canRevealRiddleForStudent();
}
