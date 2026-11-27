import React, { useEffect, useRef } from 'react';

export interface AssessmentLeaveDialogProps {
  /** True once a final save attempt failed and the learner was told explicitly. */
  losingConfirmed: boolean;
  onStay: () => void;
  onRetrySave: () => void;
  onLeaveAnyway: () => void;
}

/**
 * Explicit confirmation shown when the learner tries to leave a test whose
 * answers failed to persist.
 *
 * Guarantees (per the approved PR1 plan):
 * - Staying is always offered first and is the default focus.
 * - Leaving is always possible, but never silently: after a failed final save
 *  the learner must confirm the loss explicitly. The learner is never trapped.
 * - Escape and backdrop clicks resolve to "stay", the non-destructive choice.
 */
export const AssessmentLeaveDialog: React.FC<AssessmentLeaveDialogProps> = ({
  losingConfirmed,
  onStay,
  onRetrySave,
  onLeaveAnyway,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      returnFocusRef.current?.focus?.();
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onStay();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  return (
    <div
      className="assessment-leave-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onStay();
      }}
    >
      <div
        ref={dialogRef}
        className="assessment-leave-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="assessment-leave-title"
        aria-describedby="assessment-leave-desc"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <h2 id="assessment-leave-title" className="assessment-leave-title">
          {losingConfirmed ? 'تأكيد المغادرة دون حفظ' : 'إجابات لم تُحفظ'}
        </h2>
        <p id="assessment-leave-desc" className="assessment-leave-desc">
          {losingConfirmed
            ? 'لم تنجح محاولة الحفظ الأخيرة. إذا غادرت الاختبار الآن فستفقد الإجابات التي لم تُحفظ في ذاكرة المتصفح.'
            : 'لم يُحفظ جزء من إجاباتك في ذاكرة المتصفح لهذه الجلسة. إجاباتك موجودة في هذه الصفحة فقط، وستضيع إذا غادرت الاختبار الآن. يمكنك البقاء وإعادة محاولة الحفظ، أو المغادرة مع علمك بما قد يُفقد.'}
        </p>
        <div className="assessment-leave-actions">
          <button type="button" className="btn btn-primary" onClick={onStay}>
            البقاء في الاختبار
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRetrySave}>
            إعادة محاولة الحفظ
          </button>
          <button type="button" className="btn btn-danger" onClick={onLeaveAnyway}>
            {losingConfirmed ? 'المغادرة على أي حال' : 'المغادرة دون حفظ'}
          </button>
        </div>
      </div>
    </div>
  );
};
