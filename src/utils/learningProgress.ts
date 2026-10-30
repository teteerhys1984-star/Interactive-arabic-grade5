/**
 * Session-scoped resume location for the student's current lesson position.
 * No completion, mastery, or percentage is recorded here.
 */
export interface LearningLocation {
  unitId: string;
  lessonId: string;
  stepId: string;
}

const STORAGE_KEY = 'arabic-grade5-learning-location-v1';
const LOCATION_VERSION = 1;

function getSessionStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export function readLearningLocation(): LearningLocation | null {
  const storage = getSessionStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    const record = parsed as Record<string, unknown>;
    if (
      record.version !== LOCATION_VERSION ||
      typeof record.unitId !== 'string' ||
      typeof record.lessonId !== 'string' ||
      typeof record.stepId !== 'string' ||
      !record.unitId.trim() ||
      !record.lessonId.trim() ||
      !record.stepId.trim()
    ) {
      return null;
    }

    return {
      unitId: record.unitId,
      lessonId: record.lessonId,
      stepId: record.stepId,
    };
  } catch {
    return null;
  }
}

export function writeLearningLocation(location: LearningLocation): boolean {
  const storage = getSessionStorage();
  if (!storage) return false;

  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: LOCATION_VERSION, ...location }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearLearningLocation(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* Unavailable storage is treated as no saved location. */
  }
}
