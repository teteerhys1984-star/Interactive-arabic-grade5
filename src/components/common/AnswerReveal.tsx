import React, { useId, useState } from 'react';
import './answerReveal.css';

/**
 * AnswerReveal — the shared «أظهر الجواب» mechanism.
 *
 * WHY A SHARED COMPONENT: the owner mandated a student-facing button that shows
 * the approved answer directly, with no field filled and no «تحقّق» pressed.
 * Every lesson renderer keeps its own data model, so each lesson passes an
 * adapter-built payload into this one presentational component instead of
 * duplicating reveal logic per renderer.
 *
 * HARD RULES (owner-mandated, mirrored in the callers):
 *  - Nothing is revealed automatically: the panel is NOT rendered in the DOM
 *    until the learner presses the button (no CSS-only hiding), so re-renders,
 *    step switches and drafts never leak an answer. Step switches remount the
 *    widget and the state returns to hidden.
 *  - Only approved project data is displayed (activity solutions, accepted
 *    keys, teacher-guide model answers). Callers must never pass invented or
 *    model-derived answers, and must hide the button entirely when no approved
 *    key exists (pending / source-gap activities).
 *  - Existing check/grading protocols stay untouched; this is purely additive.
 */

export interface AnswerRevealEntry {
  /** Human-readable field/item label (never an internal id). */
  label: string;
  /** Approved answer text for that field/item. */
  value: string;
}

export interface AnswerRevealProps {
  /** Per-field approved answers; entries with an empty value are skipped. */
  entries?: AnswerRevealEntry[];
  /** Overall approved model answer (e.g. `solution.answer` / teacher guidance). */
  modelAnswer?: string;
  /** Approved rationale that accompanies the answer. */
  explanation?: string;
  /** Honest note for parts that have NO approved key (partial_pending items). */
  unavailableNote?: string;
  /** Panel heading chip; defaults to «الجواب المعتمد». */
  heading?: string;
  buttonLabel?: string;
  hideButtonLabel?: string;
  className?: string;
}

export const AnswerReveal: React.FC<AnswerRevealProps> = ({
  entries,
  modelAnswer,
  explanation,
  unavailableNote,
  heading = 'الجواب المعتمد',
  buttonLabel = 'أظهر الجواب',
  hideButtonLabel = 'أخفِ الجواب',
  className,
}) => {
  const [revealed, setRevealed] = useState(false);
  const panelId = useId();

  const visibleEntries = (entries ?? []).filter(
    (entry) => entry.label.trim().length > 0 && entry.value.trim().length > 0,
  );
  const hasModelAnswer = Boolean(modelAnswer && modelAnswer.trim().length > 0);
  const hasExplanation = Boolean(explanation && explanation.trim().length > 0);

  /* Nothing approved to show ⇒ render nothing at all (no button, no message).
   * Callers rely on this for pending / gap activities. */
  if (visibleEntries.length === 0 && !hasModelAnswer && !hasExplanation) {
    return null;
  }

  return (
    <div className={`answer-reveal ${className ?? ''}`.trim()}>
      <button
        type="button"
        className="btn btn-ghost btn-small answer-reveal-button"
        onClick={() => setRevealed((previous) => !previous)}
        aria-expanded={revealed}
        aria-controls={panelId}
      >
        {revealed ? hideButtonLabel : buttonLabel}
      </button>
      {revealed && (
        <div className="answer-reveal-panel" id={panelId}>
          <p className="answer-reveal-heading">
            <span className="source-label-explain">{heading}</span>
          </p>
          {visibleEntries.length > 0 && (
            <ul className="answer-reveal-entries">
              {visibleEntries.map((entry, index) => (
                <li key={`${entry.label}-${index}`}>
                  <span className="answer-reveal-entry-label">{entry.label}:</span>{' '}
                  <span className="answer-reveal-entry-value">{entry.value}</span>
                </li>
              ))}
            </ul>
          )}
          {hasModelAnswer && <p className="answer-reveal-model">{modelAnswer}</p>}
          {hasExplanation && (
            <p className="answer-reveal-explanation">
              <span className="answer-reveal-explanation-label">التعليل:</span> {explanation}
            </p>
          )}
          {unavailableNote && (
            <p className="answer-reveal-unavailable" role="note">
              ⏸ {unavailableNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerReveal;
