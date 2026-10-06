import React, { useRef, useState } from 'react';
import { Lesson, LessonStep } from '../../types/curriculum';
import { ArabicNumber } from '../common/BiDi';
import { SourceBadge } from '../common/SourceBadge';

export interface LessonShellProps {
  lesson: Lesson;
  onOpenTest?: () => void;
  onExit?: () => void;
  /** Optional renderer injected by the lesson layer to draw step content. */
  renderStepContent?: (step: LessonStep) => React.ReactNode;
}

export const LessonShell: React.FC<LessonShellProps> = ({
  lesson,
  onOpenTest,
  onExit,
  renderStepContent,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visitedStepIndices, setVisitedStepIndices] = useState<Set<number>>(() => new Set([0]));
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const steps = lesson.steps || [];
  const totalSteps = steps.length;
  const currentStep: LessonStep | undefined = steps[currentStepIndex];
  const currentStepNumber = currentStepIndex + 1;
  const visitedCount = visitedStepIndices.size;
  const progressPercent = totalSteps > 0 ? (visitedCount / totalSteps) * 100 : 0;

  const selectStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      setVisitedStepIndices((previous) => {
        if (previous.has(index)) return previous;
        const next = new Set(previous);
        next.add(index);
        return next;
      });
    }
  };

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let destination: number | undefined;
    if (event.key === 'ArrowDown') destination = Math.min(index + 1, totalSteps - 1);
    if (event.key === 'ArrowUp') destination = Math.max(index - 1, 0);
    if (event.key === 'Home') destination = 0;
    if (event.key === 'End') destination = totalSteps - 1;

    if (destination !== undefined) {
      event.preventDefault();
      selectStep(destination);
      stepButtonRefs.current[destination]?.focus();
    }
  };

  const navigateByControl = (index: number) => {
    selectStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStepList = (className = '') => (
    <ol className={`lesson-nav-list ${className}`.trim()}>
      {steps.map((step, index) => {
        const isCurrent = index === currentStepIndex;
        const isVisited = visitedStepIndices.has(index) && !isCurrent;
        const accessibleStatus = isCurrent
          ? 'الخطوة الحالية'
          : isVisited
          ? 'سبق عرضها'
          : 'لم تُنجز بعد';

        return (
          <li
            key={step.id}
            className={`lesson-nav-item ${isCurrent ? 'is-current' : ''} ${isVisited ? 'is-visited' : ''}`.trim()}
          >
            <button
              ref={(element) => { stepButtonRefs.current[index] = element; }}
              type="button"
              className="lesson-nav-button"
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => selectStep(index)}
              onKeyDown={(event) => handleStepKeyDown(event, index)}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`الخطوة ${index + 1}: ${step.title}، ${accessibleStatus}`}
            >
              <span className="lesson-step-number" aria-hidden="true">
                <ArabicNumber value={String(index + 1).padStart(2, '0')} />
              </span>
              <span className="lesson-step-name">{step.title}</span>
              <span className={`lesson-step-status ${isCurrent ? 'status-current' : ''} ${isVisited ? 'status-visited' : ''}`}>
                {isCurrent ? 'الآن' : isVisited ? 'سابقاً' : ''}
              </span>
              {isVisited && <span className="lesson-step-check" aria-hidden="true">✓</span>}
              {isCurrent && <span className="lesson-step-current-marker" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="lesson-shell" dir="rtl">
      <header className="lesson-shell-header">
        <div className="lesson-header-top">
          <div className="lesson-title-meta">
            <span className="lesson-order-tag">
              الدرس <ArabicNumber value={lesson.metadata.order} />
              <span className="lesson-header-divider" aria-hidden="true" />
              الصف الخامس الأساسي
            </span>
            <h1 className="lesson-main-title">{lesson.metadata.title}</h1>
            {lesson.metadata.subtitle && <p className="lesson-subtitle">{lesson.metadata.subtitle}</p>}
          </div>
          {onExit && (
            <button
              type="button"
              className="btn btn-ghost lesson-exit-button"
              onClick={onExit}
              aria-label="الرجوع إلى قائمة الوحدات والدروس"
            >
              <span aria-hidden="true" dir="ltr">→</span>
              العودة للدروس
            </button>
          )}
        </div>
      </header>

      <div className="lesson-layout">
        {totalSteps > 0 && (
          <aside className="lesson-navigation-rail">
            <div className="lesson-navigation-card">
              <div className="lesson-nav-heading">
                <span className="lesson-nav-kicker">مسار التعلّم</span>
                <h2>خطوات الدرس</h2>
                <p>انتقل إلى أي خطوة في الدرس.</p>
              </div>

              <div className="lesson-progress-summary">
                <div className="lesson-progress-label">
                  <span>التقدّم</span>
                  <span className="lesson-progress-count">
                    الخطوة <ArabicNumber value={currentStepNumber} /> من <ArabicNumber value={totalSteps} />
                  </span>
                </div>
                <div
                  className="lesson-progress-track"
                  role="progressbar"
                  aria-label="عدد الخطوات التي تمت زيارتها"
                  aria-valuemin={0}
                  aria-valuemax={totalSteps}
                  aria-valuenow={visitedCount}
                  aria-valuetext={`تمت زيارة ${visitedCount} من ${totalSteps} خطوة؛ موضعك الحالي الخطوة ${currentStepNumber} من ${totalSteps}`}
                >
                  <span className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="lesson-visited-count">
                  زُرت <ArabicNumber value={visitedCount} /> من <ArabicNumber value={totalSteps} /> خطوات
                </p>
              </div>

              <nav aria-label="مسار الدرس">
                {renderStepList()}
              </nav>
              <p className="lesson-nav-legend">
                <span aria-hidden="true">✓</span> خطوات سبق عرضها
              </p>
            </div>
          </aside>
        )}

        <div className="lesson-content-column">
          {totalSteps > 0 && (
            <nav className="lesson-mobile-navigation" aria-label="التنقل بين خطوات الدرس">
              <div className="mobile-progress-heading">
                <span className="mobile-progress-kicker">موضعك في الدرس</span>
                <span className="mobile-progress-count">
                  الخطوة <ArabicNumber value={currentStepNumber} /> من <ArabicNumber value={totalSteps} />
                </span>
              </div>
              <div
                className="lesson-progress-track mobile-progress-track"
                role="progressbar"
                aria-label="عدد الخطوات التي تمت زيارتها"
                aria-valuemin={0}
                aria-valuemax={totalSteps}
                aria-valuenow={visitedCount}
                aria-valuetext={`تمت زيارة ${visitedCount} من ${totalSteps} خطوة؛ موضعك الحالي الخطوة ${currentStepNumber} من ${totalSteps}`}
              >
                <span className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="lesson-visited-count mobile-visited-count">
                زُرت <ArabicNumber value={visitedCount} /> من <ArabicNumber value={totalSteps} /> خطوات
              </p>
              <label className="mobile-step-select-label">
                <span>اختر خطوة للانتقال إليها</span>
                <select
                  className="mobile-step-select"
                  value={currentStepIndex}
                  onChange={(event) => selectStep(Number(event.target.value))}
                >
                  {steps.map((step, index) => (
                    <option key={step.id} value={index}>
                      {String(index + 1).padStart(2, '0')} · {step.title}
                    </option>
                  ))}
                </select>
              </label>
            </nav>
          )}

          <section
            className="lesson-step-content"
            aria-labelledby={currentStep ? `current-step-title-${lesson.metadata.id}` : undefined}
          >
            {currentStep ? (
              <article className="step-card">
                <header className="step-card-header">
                  <div className="step-title-group">
                    <span className="step-content-kicker">محتوى الخطوة</span>
                    <h2 id={`current-step-title-${lesson.metadata.id}`} className="step-title" aria-live="polite">
                      {currentStep.title}
                    </h2>
                  </div>
                  {currentStep.source && <SourceBadge source={currentStep.source} compact />}
                </header>

                <div className="step-body-container">
                  {renderStepContent ? renderStepContent(currentStep) : null}
                </div>
              </article>
            ) : (
              <div className="empty-step-state">
                <p>لا توجد خطوات متاحة لهذا الدرس حالياً.</p>
              </div>
            )}
          </section>

          <footer className="lesson-shell-footer" aria-label="التنقل بين الخطوات">
            <button
              type="button"
              className="btn btn-secondary lesson-footer-button"
              onClick={() => navigateByControl(currentStepIndex - 1)}
              disabled={currentStepIndex === 0 || totalSteps === 0}
              aria-label={currentStepIndex > 0 ? `العودة إلى الخطوة ${currentStepIndex}` : 'لا توجد خطوة سابقة'}
            >
              <span className="lesson-nav-arrow" aria-hidden="true" dir="ltr">→</span>
              الخطوة السابقة
            </button>

            {lesson.testId && currentStepIndex === totalSteps - 1 && totalSteps > 0 && (
              <button
                type="button"
                className="btn btn-accent lesson-test-button"
                onClick={onOpenTest}
                aria-label="بدء اختبار الدرس، عشرون سؤالاً"
              >
                بدء اختبار الدرس <span className="test-question-count">(20 سؤالاً)</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary lesson-footer-button"
              onClick={() => navigateByControl(currentStepIndex + 1)}
              disabled={currentStepIndex >= totalSteps - 1 || totalSteps === 0}
              aria-label={currentStepIndex < totalSteps - 1 ? `الانتقال إلى الخطوة ${currentStepIndex + 2}` : 'لا توجد خطوة تالية'}
            >
              الخطوة التالية
              <span className="lesson-nav-arrow" aria-hidden="true" dir="ltr">←</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
