import { createContext } from 'react';

/**
 * Contract a mounted assessment exposes to the app shell.
 *
 * The app shell (App.tsx) owns every in-app navigation control — including the
 * always-visible header links — so it needs a way to ask the live assessment:
 * "are there answers that failed to persist?" and "try saving them again".
 * The assessment is the only component that knows the true write result,
 * because `writeDraftValue` reports success only for a real write.
 */
export interface AssessmentDraftGuard {
  /**
   * True only when answers exist whose most recent save failed and no
   * successful write has happened since. Never true merely because answers
   * exist — a successfully saved draft is not a reason to block leaving.
   */
  hasUnsavedAnswers: () => boolean;
  /**
   * Re-attempts persisting the current answers. Returns true only when the
   * write actually succeeded; never reports success it cannot prove.
   */
  retrySave: () => boolean;
}

export interface AssessmentDraftGuardRegistry {
  register: (guard: AssessmentDraftGuard | null) => void;
}

/**
 * Provided by App.tsx. Null when an assessment is rendered outside the app
 * shell (e.g. isolated component tests) — registration then simply no-ops and
 * the assessment keeps working standalone.
 */
export const AssessmentDraftGuardContext = createContext<AssessmentDraftGuardRegistry | null>(null);
