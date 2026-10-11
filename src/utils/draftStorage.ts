/**
 * draftStorage — sessionStorage-based draft persistence for lesson activity widgets.
 *
 * Keys are namespaced per lesson and per source activity, so a draft can never
 * collide between lessons or between activities. Only learner input is stored —
 * never passwords, answer keys, or evaluation data.
 *
 * Storage failures are reported (return value / thrown-safe API), never faked:
 * callers must not claim a draft was saved when writeDraft returns false.
 */

const NAMESPACE = 'arabic-grade5-drafts-v1';

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export function draftKey(lessonId: string, activitySourceId: string): string {
  return `${NAMESPACE}:${lessonId}:${activitySourceId}`;
}

/** Reads a stored draft; returns an empty record when absent, unreadable, or corrupt. */
export function readDraft(lessonId: string, activitySourceId: string): Record<string, string> {
  const store = storage();
  if (!store) return {};
  try {
    const raw = store.getItem(draftKey(lessonId, activitySourceId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const values: Record<string, string> = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([fieldId, value]) => {
      if (typeof value === 'string') values[fieldId] = value;
    });
    return values;
  } catch {
    return {};
  }
}

/**
 * Persists the draft. Returns true only when the value was actually written.
 * Passing an empty record removes the entry.
 */
export function writeDraft(
  lessonId: string,
  activitySourceId: string,
  values: Record<string, string>,
): boolean {
  const store = storage();
  if (!store) return false;
  const key = draftKey(lessonId, activitySourceId);
  try {
    if (Object.keys(values).length === 0) {
      store.removeItem(key);
      return true;
    }
    store.setItem(key, JSON.stringify(values));
    return true;
  } catch {
    return false;
  }
}

/** Removes a stored draft (no-op when storage is unavailable). */
export function clearDraft(lessonId: string, activitySourceId: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(draftKey(lessonId, activitySourceId));
  } catch {
    /* storage unavailable — nothing to clear */
  }
}
